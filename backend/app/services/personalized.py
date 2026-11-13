from sqlalchemy import text
from app.db import SessionLocal
from app.services.collaborative import get_collaborative_books


def get_for_you(user_id: int, limit: int = 10, n_seeds: int = 5):
    """
    Gợi ý cá nhân hóa thật sự theo user_id (kèm Cache tầng 2: recommendation_cache).
    
    Chiến lược:
    - Kiểm tra recommendation_cache trước (hết hạn sau 1 giờ). Nếu hit, trả về ngay lập tức.
    - Lấy tối đa n_seeds cuốn "hạt giống" kết hợp giữa:
      + Đánh giá từ trước của user (ratings >= 4, trọng số 5)
      + Hành vi ngầm (interactions: purchase 5, add_to_cart 4, wishlist 3)
    - Loại trừ các sách đã chấm điểm hoặc đã mua (purchase) khỏi danh sách gợi ý
    - Content-Based: tính trọng tâm (centroid) embedding → tìm sách gần nhất
    - Collaborative: cộng điểm Ochiai từ từng hạt giống
    - Gộp 2 danh sách bằng Borda Count Fusion
    - Gắn nhãn "Vì bạn đã thích ..." cho Explainable AI
    - Lưu kết quả vào recommendation_cache phục vụ các lần tải trang tiếp theo
    - Cold-start → fallback về danh sách Popular
    """
    session = SessionLocal()
    try:
        # ==================== E3. KIỂM TRA RECOMMENDATION_CACHE ====================
        cache_row = session.execute(text("""
            SELECT book_ids, scores, generated_at
            FROM recommendation_cache
            WHERE user_id = :u
              AND generated_at >= NOW() - INTERVAL '1 hour'
            ORDER BY generated_at DESC
            LIMIT 1
        """), {"u": user_id}).fetchone()

        if cache_row and cache_row[0]:
            cached_ids = list(cache_row[0])[:limit]
            cached_scores = list(cache_row[1]) if cache_row[1] else []

            if cached_ids:
                placeholders = ", ".join([f":bid{i}" for i in range(len(cached_ids))])
                params = {f"bid{i}": bid for i, bid in enumerate(cached_ids)}
                b_rows = session.execute(
                    text(f"SELECT book_id, title, image_url FROM books WHERE book_id IN ({placeholders})"),
                    params
                ).fetchall()
                b_map = {r[0]: {"title": r[1], "image_url": r[2]} for r in b_rows}

                # Lấy hạt giống nhanh gọn để hiển thị tiêu đề ngữ cảnh
                seeds = session.execute(text("""
                    SELECT t.book_id, b.title
                    FROM (
                        SELECT book_id, created_at, 5 AS w FROM ratings WHERE user_id = :u AND rating >= 4
                        UNION ALL
                        SELECT book_id, created_at, 
                            CASE interaction_type
                                WHEN 'purchase' THEN 5 
                                WHEN 'add_to_cart' THEN 4 
                                WHEN 'wishlist' THEN 3 
                            END AS w
                        FROM interactions WHERE user_id = :u AND interaction_type IN ('purchase', 'add_to_cart', 'wishlist')
                    ) t
                    JOIN books b ON t.book_id = b.book_id
                    GROUP BY t.book_id, b.title
                    ORDER BY MAX(t.created_at) DESC, SUM(t.w) DESC, t.book_id
                    LIMIT :n
                """), {"u": user_id, "n": n_seeds}).fetchall()

                items = []
                for idx, bid in enumerate(cached_ids):
                    if bid in b_map:
                        score_val = cached_scores[idx] if idx < len(cached_scores) else 0.0
                        items.append({
                            "book_id": bid,
                            "title": b_map[bid]["title"],
                            "image_url": b_map[bid]["image_url"],
                            "score": score_val,
                            "found_in": ["cache"],
                            "because": None
                        })

                return {
                    "strategy": "personalized_hybrid",
                    "cached": True,
                    "seeds": [{"book_id": s[0], "title": s[1]} for s in seeds],
                    "items": items
                }

        # ==================== CACHE MISS: TÍNH TOÁN CÁ NHÂN HÓA ====================
        # 0. Lấy tập sách user đã chấm điểm hoặc đã mua (để loại trừ không gợi ý lại)
        seen = {r[0] for r in session.execute(
            text("""
                SELECT book_id FROM ratings WHERE user_id = :u
                UNION
                SELECT book_id FROM interactions WHERE user_id = :u AND interaction_type = 'purchase'
            """),
            {"u": user_id}
        ).fetchall()}

        # 1. Lấy tối đa n_seeds cuốn "hạt giống" từ ratings (>=4 sao) và interactions (trọng số >= 3)
        # Sắp xếp theo MAX(created_at) DESC để các hành vi mới nhất được ưu tiên ngay lập tức,
        # kết hợp tổng trọng số SUM(w) DESC
        seeds = session.execute(text("""
            SELECT t.book_id, b.title
            FROM (
                SELECT book_id, created_at, 5 AS w 
                FROM ratings 
                WHERE user_id = :u AND rating >= 4
                UNION ALL
                SELECT book_id, created_at, 
                    CASE interaction_type
                        WHEN 'purchase' THEN 5 
                        WHEN 'add_to_cart' THEN 4 
                        WHEN 'wishlist' THEN 3 
                    END AS w
                FROM interactions 
                WHERE user_id = :u AND interaction_type IN ('purchase', 'add_to_cart', 'wishlist')
            ) t
            JOIN books b ON t.book_id = b.book_id
            GROUP BY t.book_id, b.title
            ORDER BY MAX(t.created_at) DESC, SUM(t.w) DESC, t.book_id
            LIMIT :n
        """), {"u": user_id, "n": n_seeds}).fetchall()

        # Cold-start: user chưa có dữ liệu → trả về sách Popular
        if not seeds:
            popular_rows = session.execute(text("""
                SELECT b.book_id, b.title, b.image_url, p.score, p.rank
                FROM popular_books p
                JOIN books b ON p.book_id = b.book_id
                ORDER BY p.rank ASC
                LIMIT :lim
            """), {"lim": limit}).fetchall()
            return {
                "strategy": "popular_fallback",
                "cached": False,
                "seeds": [],
                "items": [
                    {"book_id": r[0], "title": r[1], "image_url": r[2],
                     "score": float(r[3]), "found_in": ["popular"], "because": None}
                    for r in popular_rows
                ]
            }

        seed_ids = [s[0] for s in seeds]
        pool = limit * 3  # Lấy gấp 3 để có không gian chọn lọc

        # ===== NHÁNH 1: Content-Based (Centroid Embedding) =====
        # Tính trọng tâm vector embedding của các cuốn hạt giống
        placeholders = ", ".join([f":id{i}" for i in range(len(seed_ids))])
        params = {f"id{i}": sid for i, sid in enumerate(seed_ids)}

        profile = session.execute(text(
            f"SELECT AVG(embedding)::text FROM books "
            f"WHERE book_id IN ({placeholders}) AND embedding IS NOT NULL"
        ), params).scalar()

        cb = []
        if profile:
            rows = session.execute(text("""
                SELECT book_id, title, image_url
                FROM books
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> cast(:p as vector)
                LIMIT :k
            """), {"p": profile, "k": pool + len(seen)}).fetchall()
            cb = [
                {"book_id": r[0], "title": r[1], "image_url": r[2]}
                for r in rows if r[0] not in seen
            ][:pool]

        # ===== NHÁNH 2: Collaborative Filtering =====
        # Gọi Ochiai cho từng cuốn hạt giống, cộng dồn điểm
        cf_score = {}
        cf_info = {}
        cf_because = {}  # Ghi nhớ "Vì bạn đã thích ..."

        for sid, stitle in seeds:
            for b in get_collaborative_books(sid, limit=20):
                if b["book_id"] in seen:
                    continue
                bid = b["book_id"]
                cf_score[bid] = cf_score.get(bid, 0) + b["confidence_score"]
                cf_info[bid] = {"title": b["title"], "image_url": b["image_url"]}
                # Ghi nhớ cuốn hạt giống nào đóng góp nhiều nhất
                if cf_because.get(bid, (0, ""))[0] < b["confidence_score"]:
                    cf_because[bid] = (b["confidence_score"], stitle)

        cf = sorted(cf_score, key=cf_score.get, reverse=True)[:pool]

        # ===== BORDA FUSION: Gộp 2 danh sách =====
        fused = {}
        info = {}
        sources = {}

        for rank, b in enumerate(cb):
            bid = b["book_id"]
            fused[bid] = fused.get(bid, 0) + (pool - rank)
            info[bid] = {"title": b["title"], "image_url": b["image_url"]}
            sources.setdefault(bid, []).append("content_based")

        for rank, bid in enumerate(cf):
            fused[bid] = fused.get(bid, 0) + (pool - rank)
            info.setdefault(bid, cf_info[bid])
            sources.setdefault(bid, []).append("collaborative")

        # Sắp xếp theo tổng điểm Borda giảm dần
        top = sorted(fused, key=fused.get, reverse=True)[:limit]

        # ===== LƯU KẾT QUẢ VÀO RECOMMENDATION_CACHE =====
        if top:
            try:
                session.execute(text("DELETE FROM recommendation_cache WHERE user_id = :u"), {"u": user_id})
                session.execute(
                    text("""
                        INSERT INTO recommendation_cache (user_id, model_version, book_ids, scores, generated_at)
                        VALUES (:u, :m, :b_ids, :scores, NOW())
                    """),
                    {
                        "u": user_id,
                        "m": "v1.0-borda-hybrid",
                        "b_ids": [int(x) for x in top],
                        "scores": [float(fused[x]) for x in top]
                    }
                )
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Lỗi lưu recommendation_cache: {e}")

        return {
            "strategy": "personalized_hybrid",
            "cached": False,
            "seeds": [{"book_id": s[0], "title": s[1]} for s in seeds],
            "items": [
                {
                    "book_id": b,
                    **info[b],
                    "score": fused[b],
                    "found_in": sources[b],
                    "because": cf_because.get(b, (0, None))[1]
                }
                for b in top
            ],
        }
    finally:
        session.close()

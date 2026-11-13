from sqlalchemy import text
from app.db import SessionLocal

def get_collaborative_books(book_id: int, limit: int = 5):
    """
    Lọc Cộng Tác (Collaborative Filtering) chuẩn hóa Cosine (Ochiai coefficient).
    Đã tối ưu hóa tốc độ truy vấn bằng cách lọc trước top ứng viên có đồng xuất hiện cao nhất.
    """
    session = SessionLocal()
    try:
        query = text("""
            WITH target_users AS (
                SELECT user_id 
                FROM ratings 
                WHERE book_id = :book_id AND rating >= 4
                LIMIT 1000
            ),
            co_occurrences AS (
                SELECT r2.book_id, COUNT(r2.user_id) as co_count
                FROM target_users u
                JOIN ratings r2 ON u.user_id = r2.user_id
                WHERE r2.rating >= 4 AND r2.book_id != :book_id
                GROUP BY r2.book_id
                ORDER BY co_count DESC
                LIMIT 40
            ),
            target_count AS (
                SELECT COUNT(*) as cnt FROM ratings WHERE book_id = :book_id AND rating >= 4
            )
            SELECT 
                b.book_id, 
                b.title, 
                b.image_url, 
                ROUND(CAST(
                    (c.co_count / SQRT(
                        (SELECT cnt FROM target_count) * 
                        (SELECT COUNT(*) FROM ratings WHERE book_id = c.book_id AND rating >= 4)
                    )) AS NUMERIC
                ), 4) as confidence_score
            FROM co_occurrences c
            JOIN books b ON c.book_id = b.book_id
            ORDER BY confidence_score DESC
            LIMIT :limit
        """)
        
        results = session.execute(query, {"book_id": book_id, "limit": limit}).fetchall()
        
        recommendations = []
        for row in results:
            recommendations.append({
                "book_id": row[0],
                "title": row[1],
                "image_url": row[2],
                "confidence_score": float(row[3])
            })
            
        return recommendations
    except Exception as e:
        print(f"Lỗi Collaborative Filtering: {e}")
        return []
    finally:
        session.close()

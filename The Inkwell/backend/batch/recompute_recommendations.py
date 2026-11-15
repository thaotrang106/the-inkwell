from sqlalchemy import text
from app.db import SessionLocal

def compute_popular_books():
    session = SessionLocal()
    try:
        print("Đang tính toán Sách Thịnh Hành (Bayesian Average) dựa trên Global Metadata...")
        
        # Sửa lại query: Lấy average_rating và ratings_count TỪ BẢNG books 
        # (Chứa điểm toàn cầu thật sự của hàng triệu user thay vì tập mẫu 100 rating)
        sql_query = text("""
            WITH global_stats AS (
                SELECT 
                    AVG(average_rating) AS C, 
                    -- Chọn m là mốc rating ở phân vị 80% (chỉ sách có số vote lọt top 20% mới được ưu tiên)
                    PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY ratings_count) AS m 
                FROM books
            )
            INSERT INTO popular_books (book_id, score, rank)
            SELECT 
                b.book_id,
                ((b.ratings_count::numeric / (b.ratings_count + gs.m)) * b.average_rating) + ((gs.m::numeric / (b.ratings_count + gs.m)) * gs.C) AS bayesian_score,
                RANK() OVER (ORDER BY ((b.ratings_count::numeric / (b.ratings_count + gs.m)) * b.average_rating) + ((gs.m::numeric / (b.ratings_count + gs.m)) * gs.C) DESC) AS rank
            FROM books b, global_stats gs
            ON CONFLICT (book_id) 
            DO UPDATE SET 
                score = EXCLUDED.score,
                rank = EXCLUDED.rank;
        """)
        
        session.execute(sql_query)
        session.commit()
        print("✅ Hoàn tất! Bảng popular_books đã được cập nhật thành công.")
        
    except Exception as e:
        print(f"❌ Có lỗi xảy ra: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    compute_popular_books()

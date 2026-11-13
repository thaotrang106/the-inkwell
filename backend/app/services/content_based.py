from sqlalchemy import text
from app.db import SessionLocal

def get_similar_books(book_id: int, limit: int = 5):
    """
    Tìm kiếm sách tương đồng dựa trên khoảng cách Vector (Cosine Similarity)
    """
    session = SessionLocal()
    try:
        # 1. Đi tìm Vector của cuốn sách mà người dùng đang xem
        book_query = text("SELECT embedding FROM books WHERE book_id = :id AND embedding IS NOT NULL")
        result = session.execute(book_query, {"id": book_id}).fetchone()
        
        if not result or not result[0]:
            return [] # Nếu sách chưa được nạp Vector thì không gợi ý được
            
        current_embedding = result[0] # Đây là chuỗi 768 chiều của sách
        
        # 2. Thuật toán lõi: Tính khoảng cách Cosine (toán tử <=>) 
        # Tìm 5 cuốn sách có Vector gần giống nhất, và loại trừ chính cuốn đang xem ra.
        similar_query = text("""
            SELECT book_id, title, image_url
            FROM books
            WHERE embedding IS NOT NULL AND book_id != :id
            ORDER BY embedding <=> cast(:embedding as vector)
            LIMIT :limit
        """)
        
        similar_books = session.execute(similar_query, {
            "id": book_id,
            "embedding": str(current_embedding),
            "limit": limit
        }).fetchall()
        
        # 3. Đóng gói kết quả gửi về cho Frontend
        recommendations = []
        for row in similar_books:
            recommendations.append({
                "book_id": row[0],
                "title": row[1],
                "image_url": row[2]
            })
            
        return recommendations
        
    except Exception as e:
        print(f"Lỗi AI Content-Based: {e}")
        return []
    finally:
        session.close()
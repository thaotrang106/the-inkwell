from app.services.content_based import get_similar_books
from app.services.collaborative import get_collaborative_books

def get_hybrid_recommendations(book_id: int, limit: int = 5, alpha: float = 0.5):
    """
    Thuật toán Lai (Hybrid Recommender): 
    Kết hợp kết quả của Content-Based và Collaborative Filtering.
    
    Tham số alpha điều chỉnh trọng số:
    - alpha = 0.5 → cân bằng 50/50 (mặc định)
    - alpha > 0.5 → nghiêng về Content-Based (AI)
    - alpha < 0.5 → nghiêng về Collaborative (Đám đông)
    """
    # Lấy top 10 từ mỗi thuật toán để mở rộng không gian tìm kiếm
    cb_books = get_similar_books(book_id, limit=10)
    cf_books = get_collaborative_books(book_id, limit=10)
    
    book_scores = {}
    book_details = {}
    
    # 1. Chấm điểm cho danh sách của AI (Content-Based) — trọng số alpha
    for rank, book in enumerate(cb_books):
        b_id = book["book_id"]
        score = (10 - rank) * alpha
        book_scores[b_id] = book_scores.get(b_id, 0) + score
        book_details[b_id] = dict(book)  # Copy dict để tránh mutation
        
    # 2. Chấm điểm cho danh sách của Đám đông (Collaborative) — trọng số (1 - alpha)
    for rank, book in enumerate(cf_books):
        b_id = book["book_id"]
        score = (10 - rank) * (1 - alpha)
        book_scores[b_id] = book_scores.get(b_id, 0) + score
        
        # Lưu thông tin chi tiết (nếu cuốn sách này chưa có trong book_details)
        if b_id not in book_details:
            book_details[b_id] = dict(book)  # Copy dict để tránh mutation
            
    # 3. Sắp xếp lại danh sách dựa trên Tổng điểm từ cao xuống thấp
    sorted_books = sorted(book_scores.items(), key=lambda x: x[1], reverse=True)
    
    # 4. Cắt lấy đúng số lượng cần thiết (limit = 5)
    recommendations = []
    for b_id, total_score in sorted_books[:limit]:
        detail = dict(book_details[b_id])  # Copy lần nữa để an toàn
        detail["hybrid_score"] = round(total_score, 2)
        recommendations.append(detail)
        
    return recommendations

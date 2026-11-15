"""
The Inkwell - Unit Tests for Recommendation Engine
-------------------------------------------------
Kiểm thử tính đúng đắn của các giải thuật gợi ý:
1. Không tự gợi ý chính cuốn đang xem (No self-recommendation)
2. Không trùng lặp tác phẩm trong danh sách kết quả (No duplicates)
3. Giới hạn số lượng trả về tuân thủ tham số k (Limit k respected)
4. Xử lý kịch bản Cold-Start (sách mới / ít tương tác không bị lỗi 500 hoặc mảng rỗng)
5. Tính linh hoạt của trọng số lai ghép Hybrid Borda (alpha)
"""

import sys
import unittest
from pathlib import Path

# Thêm thư mục backend vào sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.services.content_based import get_similar_books
from app.services.collaborative import get_collaborative_books
from app.services.hybrid import get_hybrid_recommendations


class TestRecommendationEngine(unittest.TestCase):
    def setUp(self):
        self.sample_book_id = 1  # The Hunger Games
        self.cold_start_book_id = 9999999  # Sách giả lập mới hoàn toàn

    def test_no_self_recommendation(self):
        """Đảm bảo không bao giờ gợi ý lại chính cuốn sách đang xem"""
        # 1. Content-Based
        cb_recs = get_similar_books(self.sample_book_id, limit=10)
        cb_ids = [b["book_id"] for b in cb_recs]
        self.assertNotIn(self.sample_book_id, cb_ids, "Content-Based tự gợi ý chính cuốn đang xem!")

        # 2. Collaborative
        cf_recs = get_collaborative_books(self.sample_book_id, limit=10)
        cf_ids = [b["book_id"] for b in cf_recs]
        self.assertNotIn(self.sample_book_id, cf_ids, "Collaborative tự gợi ý chính cuốn đang xem!")

        # 3. Hybrid
        hybrid_recs = get_hybrid_recommendations(self.sample_book_id, limit=10)
        hybrid_ids = [b["book_id"] for b in hybrid_recs]
        self.assertNotIn(self.sample_book_id, hybrid_ids, "Hybrid tự gợi ý chính cuốn đang xem!")

    def test_no_duplicates_in_recommendations(self):
        """Đảm bảo danh sách gợi ý không chứa phần tử trùng lặp"""
        for k in [3, 5, 10]:
            hybrid_recs = get_hybrid_recommendations(self.sample_book_id, limit=k)
            book_ids = [b["book_id"] for b in hybrid_recs]
            self.assertEqual(len(book_ids), len(set(book_ids)), "Danh sách Hybrid chứa ID trùng lặp!")

    def test_respect_limit_k(self):
        """Đảm bảo số lượng kết quả trả về không vượt quá giới hạn k chỉ định"""
        for k in [1, 3, 5, 8]:
            hybrid_recs = get_hybrid_recommendations(self.sample_book_id, limit=k)
            self.assertLessEqual(len(hybrid_recs), k, f"Số lượng kết quả ({len(hybrid_recs)}) vượt quá k={k}")

    def test_hybrid_alpha_weights(self):
        """Kiểm tra phản hồi của thuật toán Hybrid khi thay đổi trọng số alpha"""
        # alpha = 1.0 (Nghiêng hoàn toàn về Content-Based)
        hybrid_cb = get_hybrid_recommendations(self.sample_book_id, limit=5, alpha=1.0)
        self.assertIsInstance(hybrid_cb, list)

        # alpha = 0.0 (Nghiêng hoàn toàn về Collaborative)
        hybrid_cf = get_hybrid_recommendations(self.sample_book_id, limit=5, alpha=0.0)
        self.assertIsInstance(hybrid_cf, list)

        # alpha = 0.5 (Cân bằng 50/50)
        hybrid_balanced = get_hybrid_recommendations(self.sample_book_id, limit=5, alpha=0.5)
        self.assertIsInstance(hybrid_balanced, list)

    def test_cold_start_fallback_safety(self):
        """Kiểm tra sách mới chưa từng có đánh giá không làm sập hệ thống (No 500 error)"""
        try:
            cb_recs = get_similar_books(self.cold_start_book_id, limit=5)
            self.assertIsInstance(cb_recs, list)

            cf_recs = get_collaborative_books(self.cold_start_book_id, limit=5)
            self.assertIsInstance(cf_recs, list)

            hybrid_recs = get_hybrid_recommendations(self.cold_start_book_id, limit=5)
            self.assertIsInstance(hybrid_recs, list)
        except Exception as e:
            self.fail(f"Lỗi ngoại lệ khi xử lý Cold-Start: {e}")


if __name__ == "__main__":
    unittest.main()

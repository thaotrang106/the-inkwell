# Checklist rà soát & sửa lỗi — The Inkwell AI Recommendation System

Dựa trên đối chiếu `system_results_report.md` với code thực tế (`db.py`, `main.py`, `content_based.py`, `collaborative.py`, `hybrid.py`) đã review trước đó. Cập nhật ngày 18/10/2026.

---

## 🔴 Ưu tiên cao nhất — ảnh hưởng trực tiếp đến tên đề tài

- [ ] **Thêm endpoint cá nhân hoá thật theo `user_id`** — hiện tại `similar`, `collaborative`, `hybrid` đều nhận `book_id`, không nhận `user_id`, nên bản chất là gợi ý item-to-item, chưa phải "cá nhân hoá" đúng nghĩa đề tài.
  - Đề xuất: `GET /api/recommendations/foryou/{user_id}` — lấy các sách `user_id` đã rate ≥4, tổng hợp hybrid từ hồ sơ đó.
  - Demo bằng dropdown chọn 1 trong các `user_id` có sẵn trong bảng `ratings` (không cần login thật).
- [ ] **Sửa lại mô tả luồng "Just For You"** ở mục 5.3 — hiện đang gọi `API hybrid` (theo `book_id`), không khớp với tên gọi "cá nhân hoá theo user". Sau khi có endpoint `/foryou/{user_id}`, trỏ lại đúng chỗ.
- [ ] Nếu **không kịp làm** mục trên: đổi lại cách diễn đạt trong Chương 1 (Mở đầu) — từ "cá nhân hoá theo người dùng" sang "gợi ý sản phẩm liên quan" để báo cáo không mâu thuẫn với hệ thống thật.

## 🟠 Quan trọng — thiếu để hệ thống hoạt động đúng như thiết kế

- [ ] **Thêm `POST /api/interactions`** để ghi nhận hành vi (view/click/purchase/add_to_cart) — bảng `INTERACTIONS` hiện có trong ERD nhưng không có endpoint nào ghi vào, nên sẽ mãi trống.
- [ ] **Làm phần đánh giá định lượng** — Precision@k, Recall@k, so sánh Content-Based / Collaborative / Hybrid. Đây là yêu cầu tường minh của đề tài, hiện chưa thấy trong báo cáo.
- [ ] Xác nhận **mật khẩu Supabase và API key Gemini đã được đổi** (phát hiện lộ trong `db.py`/`_env` ở lượt review trước) — nếu chưa, làm ngay trước khi làm gì khác.

## 🟡 Nên cải thiện — không khẩn cấp nhưng đáng làm

- [ ] **Quyết định số phận bảng `RECOMMENDATION_CACHE`**: hiện có trong ERD nhưng `hybrid.py` tính trực tiếp mỗi request, không đọc/ghi bảng này.
  - Hoặc (a) implement cache thật (ghi kết quả hybrid vào bảng, đọc lại khi trùng request)
  - Hoặc (b) bỏ bảng này khỏi schema/ERD cho khớp thực tế
- [ ] **Cache kết quả Explainable AI (Mercy)** theo `book_id` — hiện gọi Gemini mỗi request dù nội dung sinh ra gần như giống nhau cho cùng 1 cuốn sách, tốn quota/chi phí không cần thiết. Thêm cột `ai_explanation` vào bảng `books` hoặc bảng riêng.
- [ ] **Xác nhận `scikit-learn`** có thực sự được dùng ở đâu không (không thấy trong code đã review) — nếu không, bỏ khỏi bảng công nghệ ở mục 6.1 để tránh khai thừa.
- [ ] **Bỏ `allow_credentials=True`** trong CORS nếu hệ thống chưa có đăng nhập/cookie nào (hiện không cần thiết).
- [ ] Viết **batch job** (`batch/recompute_recommendations.py` theo cấu trúc thư mục đã lên kế hoạch) để tính lại `popular_books` định kỳ, thay vì chạy SQL thủ công.

## ✅ Đã tốt — giữ nguyên, không cần sửa

- [x] Mapping `book_id` ↔ `goodreads_book_id` đúng.
- [x] Collaborative Filtering dùng hệ số Ochiai chuẩn hoá bias — đúng kỹ thuật.
- [x] Content-Based dùng pgvector + Gemini embedding — vững hơn kế hoạch TF-IDF ban đầu.
- [x] Bayesian average cho `popular_books` có vẻ đã fix đúng (dùng `books.ratings_count` thay vì bảng `ratings` bị cap 100) — số liệu mẫu khớp với `average_rating` gốc.
- [x] Kiến trúc 3 tầng rõ ràng, tách bạch Frontend/Backend/Data/External service.

---

## Câu hỏi cần xác nhận trước khi làm tiếp

1. Mật khẩu Supabase và API key Gemini đã đổi chưa?
2. `interactions` và `recommendation_cache` — đã có endpoint ghi vào đâu đó chưa, hay thực sự chưa làm?
3. Precision@k/Recall@k — đã làm ở đâu chưa, hay chưa bắt đầu?
4. `hybrid.py` — đã cập nhật tham số `alpha` và sửa lỗi copy dict (`book_details[b_id] = book`) theo gợi ý trước đó chưa?
5. Có thể gửi `models.py` để đối chiếu chính xác schema thật (đặc biệt kiểu `ARRAY` trong `RECOMMENDATION_CACHE`) không?

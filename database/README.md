# 🗄️ THE INKWELL - DATABASE & PGVECTOR CONFIGURATION GUIDE

Tài liệu hướng dẫn thiết lập Cơ sở dữ liệu PostgreSQL tích hợp tiện ích mở rộng `pgvector` phục vụ Hệ thống gợi ý cá nhân hóa và Cố vấn AI Mercy.

---

## 1. YÊU CẦU MÔI TRƯỜNG
- **Hệ quản trị CSDL:** PostgreSQL 15+ (Khuyến nghị sử dụng **Supabase Cloud Database** để có sẵn `pgvector`).
- **Phần mở rộng bắt buộc:** `vector` (hỗ trợ vector 768 chiều cho Google Gemini Embedding).

---

## 2. QUY TRÌNH THIẾT LẬP NHANH TRÊN SUPABASE CLOUD

1. **Tạo Project mới** trên [Supabase Console](https://supabase.com).
2. Vào mục **SQL Editor**, mở tab mới và sao chép toàn bộ nội dung trong file [schema.sql](schema.sql).
3. Nhấn **Run** để khởi tạo:
   - Kích hoạt extension `vector`.
   - Tạo đầy đủ 9 bảng quan hệ: `users`, `books`, `ratings`, `tags`, `book_tags`, `interactions`, `popular_books`, `recommendation_cache`, `reviews`.
   - Tạo chỉ mục HNSW (`idx_books_embedding_hnsw`) với hàm khoảng cách Cosine `vector_cosine_ops`.
4. Lấy chuỗi kết nối tại mục **Project Settings ➔ Database ➔ Connection string (URI)**:
   ```
   postgresql+pg8000://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Dán chuỗi kết nối vào biến `DATABASE_URL` trong file `.env` của `backend`.

---

## 3. NẠP DỮ LIỆU BAN ĐẦU (SEED DATA / ETL)

Sau khi tạo bảng thành công, chạy script ETL tự động trong thư mục `backend`:

```bash
cd backend
python batch/import_data.py
python batch/recompute_popular.py
```

- `import_data.py`: Tự động nạp danh mục sách Goodbooks-10k và embedding 768 chiều.
- `recompute_popular.py`: Tính toán điểm xếp hạng Bayesian Average Rating phục vụ bài toán Cold-Start.

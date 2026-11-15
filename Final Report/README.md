# Minh chứng kỹ thuật đồ án The Inkwell

**Đề tài:** “Ứng dụng trí tuệ nhân tạo (AI) trong đề xuất sản phẩm cá nhân hoá trên website thương mại điện tử bán sách The Inkwell”

**Sinh viên thực hiện:** Ngô Thảo Trang (MSSV: 030239230260)  
**Giảng viên hướng dẫn:** NCS.ThS Trần Việt Tâm  
**Học phần:** Đồ án Chuyên ngành (ITS703) – Khoa Hệ thống Thông tin Quản lý, Trường Đại học Ngân hàng TP. Hồ Chí Minh (HUB)

The Inkwell là website bán sách thử nghiệm tích hợp gợi ý theo cuốn sách đang xem và theo lịch sử tương tác của độc giả. Tài liệu này giới thiệu các chức năng chính và các mục minh chứng để Hội đồng đối chiếu với báo cáo.

---

## Tài nguyên đồ án

| Tài nguyên | Thông tin truy cập |
|---|---|
| Website The Inkwell | Local: [http://localhost:3000](http://localhost:3000) (Next.js 16 / React 19) |
| Tài liệu Swagger UI API | Local: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (16 RESTful API Endpoints)<br>Production: [https://the-inkwell-ehoh.onrender.com/docs](https://the-inkwell-ehoh.onrender.com/docs) |
| Mã nguồn hệ thống | Thư mục `the-inkwell/` (Mã nguồn Backend FastAPI, Frontend Next.js, Data ETL Pipeline) |
| Báo cáo đồ án | Bản Word chính thức 5 chương tại `Final - V1.docx` và `Final Report/Final - V1.docx` |

---

## Chức năng minh họa

| Chức năng | Nội dung minh chứng | Vị trí trong báo cáo |
|---|---|---|
| Sách phổ biến | Danh sách xếp hạng theo điểm Bayesian ($m=1.000, C=4.0$) dành cho khách hoặc hồ sơ chưa có đủ lịch sử tương tác (giải quyết Cold-Start). | Mục 2.5, Mục 4.2, Bảng 4.2 và Hình 4.2 |
| Sách liên quan | Gợi ý theo cuốn sách đang xem. Hệ thống kết hợp lọc theo nội dung (Gemini Embedding 768D trên pgvector) và lọc cộng tác (Ochiai) bằng Borda Count Fusion. | Mục 2.2–2.4, Mục 4.3, Bảng 2.1, Bảng 2.2, Hình 2.1, Hình 2.4 và Hình 4.3 |
| Just For You | Gợi ý cá nhân hóa dựa trên đánh giá và tương tác của hồ sơ độc giả (User #35 Minh Anh vs User #1 Hoàng Nam). | Mục 2.6, Mục 3.4, Mục 4.4, Hình 3.5, Hình 4.2 và Hình 4.4 |
| Mercy AI | Lời bình văn học do Gemini 2.5 Flash tạo dựa trên thông tin của tác phẩm (áp dụng Database Caching giảm độ trễ xuống dưới 20ms). | Mục 2.7, Mục 3.1.2 (FR-08), Mục 4.4, Bảng 3.5 và Hình 4.3 |
| Algorithm Lab | Phòng thí nghiệm thuật toán đối sánh trực quan đồng thời 3 cột: Content-Based, Collaborative và Hybrid Borda Count. | Mục 4.4 và Hình 4.5 |

---

## Danh mục minh chứng

| Thư mục | Nội dung |
|---|---|
| `01_Demo_website/` | Ảnh chụp thực tế các chức năng trên website: Swagger UI 16 API endpoints, Trang chủ User A (Minh Anh), Chi tiết sách Mercy AI, Trang chủ User B (Hoàng Nam), Algorithm Lab. |
| `02_Ket_qua_thu_nghiem/` | Mã đánh giá và đầu ra thực nghiệm được cung cấp kèm theo: script và notebook đánh giá Precision@K, Recall@K, MAP (`evaluate_models.py` & `.ipynb`), bảng kết quả đo lường (`ket_qua_danh_gia_thuc_te.csv`), script tính xếp hạng Bayesian (`tinh_toan_bayesian_ranking.py` & `bang_xep_hang_bayesian.csv`) và log độ trễ API 100 requests (`api_latency_benchmark.log`). |
| `03_So_do_he_thong/` | Sơ đồ định hướng phương pháp gợi ý (Hình 2.1), minh họa Borda Count Fusion (Hình 2.4), sơ đồ kiến trúc tổng thể 3 tầng (Hình 3.1), sơ đồ Use Case tổng thể (Hình 3.2), sơ đồ thực thể liên kết ERD (Hình 3.4) và sơ đồ tuần tự Just For You (Hình 3.5). |

---

## Khởi động nhanh hệ thống

1. **Khởi động Backend (FastAPI):** Bấm đúp file `start_backend.bat` (Server chạy tại port 8000, tự động mở Swagger UI).
2. **Khởi động Frontend (Next.js):** Bấm đúp file `start_frontend.bat` (Website chạy tại `http://localhost:3000`).
3. **Tài khoản thử nghiệm:** Độc giả Minh Anh (`User #35` – gu Giả tưởng) và Độc giả Hoàng Nam (`User #1` – gu Kinh điển).

Phương pháp đánh giá và các chỉ số Precision@K, Recall@K, F1-Score, MAP được trình bày tại **Mục 4.5 và Bảng 4.4**. Kết quả đo lường thời gian phản hồi (Latency) trung bình của các API được trình bày tại **Bảng 4.5**. Ảnh minh họa hành vi của hệ thống và kết quả định lượng được đối chiếu trực tiếp với đầu ra thử nghiệm tương ứng trong các thư mục minh chứng trên.

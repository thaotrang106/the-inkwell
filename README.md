# 📚 HƯỚNG DẪN NGHIỆM THU & BÀN GIAO KỸ THUẬT HỆ THỐNG
## THE INKWELL RECOMMENDER SYSTEM & AI LITERARY ADVISOR

> **Đề tài:** “Ứng dụng Trí tuệ Nhân tạo (AI) trong đề xuất sản phẩm cá nhân hoá trên website thương mại điện tử bán sách The Inkwell”  
> **Sinh viên thực hiện:** Ngô Thảo Trang (MSSV: **030239230260**) — Lớp: **ITS703_261_1_D01**  
> **Giảng viên hướng dẫn:** NCS.ThS **Trần Việt Tâm**  
> **Khoa:** Hệ thống Thông tin Quản lý (MIS) — **Trường Đại học Ngân hàng TP. Hồ Chí Minh (HUB)**  

---

> [!NOTE]
> **MỤC ĐÍCH SỬ DỤNG:** Tài liệu này được biên soạn độc lập đi kèm tập tin Báo cáo khóa luận chính thức (`Bao_cao_do_an_The_Inkwell_v3.docx` và `Bao_cao.docx`) nhằm hướng dẫn Quý Thầy/Cô trong Hội đồng chấm khóa luận tốt nghiệp dễ dàng truy cập bản demo trực tuyến, kích hoạt kiểm thử các API, duyệt xem minh chứng thực nghiệm và tái lập kết quả nghiên cứu một cách thuận tiện nhất.

---

## 1. 🌐 TÀI NGUYÊN VÀ LIÊN KẾT TRUY CẬP TRỰC TUYẾN (LIVE SERVICES)

Toàn bộ mã nguồn, cơ sở dữ liệu và hệ sinh thái dịch vụ của The Inkwell đã được triển khai hoàn chỉnh trên môi trường điện toán đám mây đạt chuẩn Production:

| Tài nguyên | Địa chỉ truy cập trực tuyến | Ghi chú & Trạng thái |
| :--- | :--- | :--- |
| **Website Ứng dụng The Inkwell** | [https://the-inkwell.vercel.app/](https://the-inkwell.vercel.app/) | Frontend Next.js 16 / React 19 (Production Live trên Vercel Edge) |
| **Backend RESTful API & Docs** | [https://the-inkwell-ehoh.onrender.com/docs](https://the-inkwell-ehoh.onrender.com/docs) | FastAPI Swagger UI tài liệu hóa trực quan 16 Endpoints (Render Cloud) |
| **Kho lưu trữ mã nguồn (Git)** | [https://github.com/thaotrang106/the-inkwell](https://github.com/thaotrang106/the-inkwell) | GitHub Public Repository đầy đủ lịch sử commit, issue và CI/CD |
| **Cơ sở dữ liệu Vector Cloud** | Supabase PostgreSQL 16+ | Lưu trữ quan hệ ACID 9 bảng kết hợp chỉ mục pgvector HNSW 768 chiều |
| **Hồ sơ Độc giả mẫu A** | User #35 (Độc giả Minh Anh) | Gu: Kỳ ảo & Thiếu nhi (Xem hàng *Dành riêng cho Minh Anh*) |
| **Hồ sơ Độc giả mẫu B** | User #1 (Độc giả Hoàng Nam) | Gu: Kinh điển & Triết học xã hội (Xem hàng *Dành riêng cho Hoàng Nam*) |
| **Báo cáo khóa luận chính thức** | `Bao_cao_do_an_The_Inkwell_v3.docx` | Bản Báo cáo chính thức 5 chương hoàn chỉnh, hình ảnh độ phân giải cao |
| **Báo cáo mở rộng chuyên sâu** | `Bao_cao.docx` (~78 trang nội dung) | Bản Báo cáo mở rộng chi tiết (~155.000 ký tự, 20 bảng, 15 hình) |

---

## 2. 🏛️ KIẾN TRÚC HỆ SINH THÁI CÔNG NGHỆ TOÀN DIỆN (FULL-STACK TECH STACK)

| Phân tầng Kiến trúc | Công nghệ Chủ chốt | Vai trò và Tính năng trong Hệ thống |
| :--- | :--- | :--- |
| **Giao diện người dùng (Frontend UI/UX)** | Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript | Thiết kế chuẩn báo chí Dark Academia, SSR tối ưu hóa SEO và LCP (<1.2s), responsive đa thiết bị, typography Cormorant Garamond. |
| **Dịch vụ xử lý API (Backend Gateway)** | Python 3.11+, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy | Kiến trúc bất đồng bộ (async/await), xử lý gợi ý đa luồng song song, tự động sinh tài liệu chuẩn hóa OpenAPI 3.1 & Swagger UI. |
| **Cơ sở dữ liệu Véc-tơ (Vector Database)** | PostgreSQL 16+, pgvector Extension, Supabase Cloud | Lưu trữ quan hệ ACID 9 bảng; đánh chỉ mục véc-tơ HNSW (m=16, ef=64) trên vector nhúng 768 chiều cho phép tìm kiếm ANN O(log N). |
| **Thuật toán Gợi ý Lai (Hybrid Engine)** | Content-Based, Collaborative Filtering (Ochiai), Borda Count Fusion | Dung hợp thứ hạng không gian véc-tơ ngữ nghĩa và ma trận tương tác người dùng, loại bỏ thiên lệch độ phổ biến (Popularity Bias). |
| **Trí tuệ Nhân tạo Tạo sinh (Generative AI)** | Google Gemini 2.5 Flash, Prompt Engineering 4 thành phần | Trợ lý Cố vấn văn học Mercy AI phân tích lời bình học thuật, giải thích lý do đề xuất, tối ưu tốc độ <20ms bằng Database Caching. |
| **Đo lường & Kiểm thử (Evaluation Suite)** | Scikit-learn, Pandas, NumPy, Pytest, Matplotlib | Bộ công cụ đánh giá khoa học ngoại tuyến tính toán P@10, R@10, F1@10, MAP@10 và đo lường phân bổ thời gian phản hồi API (Latency). |

---

## 3. 📂 CẤU TRÚC THƯ MỤC BÀN GIAO & ĐỐI CHIẾU BÁO CÁO

Toàn bộ thư mục nộp Hội đồng được tổ chức khoa học, chuẩn mực và đã được đồng bộ hóa hoàn toàn giữa thư mục làm việc và thư mục nộp Drive:

```text
D:\Do An Tot nghiep 2026-2027├── 01_Demo_website/               # Trọn bộ 6 ảnh chụp màn hình độ phân giải cao minh chứng website thực tế
│   ├── 01_Swagger_UI_16_Endpoints.png
│   ├── 02_Trang_chu_User_A_MinhAnh.png
│   ├── 03_Chi_tiet_sach_Mercy_AI.png
│   ├── 04_Trang_chu_User_B_HoangNam.png
│   ├── 05_Algorithm_Lab_So_sanh.png
│   └── 06_Chi_tiet_sach_Bang_chuyen_de_xuat.png
├── 02_Ket_qua_thu_nghiem/         # Mã nguồn đo lường (.py, .ipynb), log độ trễ và bảng dữ liệu CSV thực nghiệm
│   ├── api_latency_benchmark.log
│   ├── bang_xep_hang_bayesian.csv
│   ├── do_do_tre_api.py
│   ├── evaluate_models.ipynb
│   ├── evaluate_models.py
│   ├── ket_qua_danh_gia_thuc_te.csv
│   └── tinh_toan_bayesian_ranking.py
├── 03_So_do_he_thong/             # Trọn bộ 6 sơ đồ kiến trúc chuẩn mực (Hệ phương pháp, Borda, 3-tier, Use Case, ERD, Sequence)
│   ├── 01_So_do_cac_phuong_phap_goi_y.png
│   ├── 02_So_do_Borda_Count_Fusion.png
│   ├── 03_Kien_truc_tong_the_3_tang.png
│   ├── 04_So_do_Use_Case_tong_the.png
│   ├── 05_So_do_thuc_the_lien_ket_ERD.png
│   └── 06_So_do_tuan_tu_Just_For_You.png
├── backend/                       # Toàn bộ mã nguồn Backend FastAPI (app, batch, tests, .env.example, requirements.txt)
├── frontend/                      # Toàn bộ mã nguồn Frontend Next.js 16 (app, components, context, lib, public)
├── database/                      # Mã nguồn DDL schema.sql khởi tạo 9 bảng quan hệ và chỉ mục pgvector HNSW
├── evaluation/                    # Kịch bản thực nghiệm khoa học (evaluate_recommenders.py, benchmark_results.csv/.json)
├── docs/                          # Tài liệu đặc tả kỹ thuật, sơ đồ quan hệ và hồ sơ hướng dẫn bảo vệ (DEFENSE_NAVIGATOR.md)
├── data/                          # Tập dữ liệu chuẩn bị (books.csv, ratings.csv, tags.csv, book_tags.csv, to_read.csv)
├── Bao_cao_do_an_The_Inkwell_v3.docx # Bản Báo cáo khóa luận chính thức (bản v3 đã cập nhật hình ảnh độ phân giải cao)
├── Bao_cao.docx                   # Bản Báo cáo khóa luận mở rộng chuyên sâu 5 chương chuẩn học thuật (~78 trang)
├── README.docx                    # Tài liệu bàn giao kỹ thuật và hướng dẫn nghiệm thu này (định dạng Word chuẩn in ấn)
├── README.md                      # Tài liệu bàn giao kỹ thuật (định dạng Markdown xem trực tiếp trên GitHub/VS Code)
├── start_backend.bat              # Kịch bản 1-Click tự động kích hoạt ảo và chạy máy chủ Backend FastAPI
├── start_frontend.bat             # Kịch bản 1-Click tự động khởi chạy giao diện người dùng Next.js 16
├── THE_INKWELL_NGO_THAO_TRANG_030239230260/ # Thư mục đóng gói chuẩn hóa đồng bộ sẵn sàng tải lên Google Drive
└── THE_INKWELL_NGO_THAO_TRANG_030239230260.zip # Tệp nén toàn bộ hồ sơ đồ án bàn giao Hội đồng (~35 MB)
```

### Bảng đối chiếu minh chứng thực nghiệm với các chương trong Báo cáo khóa luận:

| Thư mục Minh chứng | Nội dung Tệp tin & Minh chứng Cụ thể | Vị trí Đối chiếu trong Báo cáo |
| :--- | :--- | :--- |
| `01_Demo_website/` | `01a_Swagger_UI_19_Endpoints.png`<br>`01b_Swagger_UI_19_Endpoints.png`<br>`02a_Trang_chu_User_A_MinhAnh.png`<br>`02b_Trang_chu_User_A_MinhAnh.png`<br>`03_Chi_tiet_sach_Mercy_AI.png`<br>`04_Trang_chu_User_B_HoangNam.png`<br>`05a_Co_van_Mercy_AI.png ~ 05i_Co_van_Mercy_AI.png`<br>`06_Algorithm_Lab_So_sanh.png` | Chương 4: Mục 4.4.1, 4.4.2, 4.4.3<br>Hình 6, 7, 8, 9, 10, 4.4, 4.5 (Hình 4.1 đến Hình 4.5) |
| `02_Ket_qua_thu_nghiem/` | `evaluate_models.py` & `.ipynb`<br>`ket_qua_danh_gia_thuc_te.csv`<br>`tinh_toan_bayesian_ranking.py`<br>`bang_xep_hang_bayesian.csv`<br>`api_latency_benchmark.log`<br>`do_do_tre_api.py` | Chương 4: Mục 4.2 & Mục 4.5<br>Bảng 10, Bảng 11, Bảng 12, Bảng 13, Bảng 14<br>(Bảng xếp hạng Bayesian, Bảng đo lường P@10/MAP, Độ trễ API) |
| `03_So_do_he_thong/` | `01_So_do_cac_phuong_phap_goi_y.png`<br>`02_So_do_Borda_Count_Fusion.png`<br>`03_Kien_truc_tong_the_3_tang.png`<br>`04_So_do_Use_Case_tong_the.png`<br>`05_So_do_thuc_the_lien_ket_ERD.png`<br>`06_So_do_tuan_tu_Just_For_You.png`<br>`07_Luong_tao_va_hien_thi_loi_binh.png`<br>`08_So_do_cau_truc_prompt.png` | Chương 2: Hình 1 (Hình 2.1), Hình 2 (Hình 2.2)<br>Chương 3: Hình 3 (Use Case), Hình 4 (3 Tầng), Hình 5 (ERD), Hình 6 (Sequence Diagram) |
| `backend/` & `batch/` | `app/main.py`, `app/db.py`<br>`batch/generate_embeddings.py`<br>`batch/recompute_recommendations.py`<br>`tests/test_recommendations.py` | Chương 3 & Chương 4: Mục 4.3<br>Bảng 9b (Payload API), Bảng 14 (Kiểm thử chức năng) |
| `database/` | `schema.sql` (9 bảng DDL quan hệ & chỉ mục pgvector HNSW 768D) | Chương 3: Mục 3.4 & Bảng 8b (Từ điển dữ liệu 9 bảng) |
| `evaluation/` | `evaluate_recommenders.py`, `benchmark_report.md`, `benchmark_results.csv` / `.json` | Chương 4: Mục 4.5.2, 4.5.3, 4.5.4<br>Phụ lục B (Ma trận mục tiêu nghiên cứu) |

---

## 4. 🚀 HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG DÀNH CHO HỘI ĐỒNG (QUICK START)

### Cách 1: Khởi chạy 1-Click tự động trên Windows (Khuyên dùng)
Hệ thống đã chuẩn bị sẵn 2 kịch bản thực thi tự động. Quý Thầy/Cô chỉ cần thực hiện 2 thao tác nhấp đúp chuột:
1. **Nhấp đúp chuột file: `start_backend.bat`**  
   -> Cửa sổ dòng lệnh tự động kích hoạt môi trường ảo Python, khởi động máy chủ FastAPI tại `http://127.0.0.1:8000` và tự động mở trình duyệt hiển thị giao diện Swagger UI tài liệu hóa 16 API endpoints.
2. **Nhấp đúp chuột file: `start_frontend.bat`**  
   -> Cửa sổ dòng lệnh tự động chạy máy chủ Next.js 16 tại `http://localhost:3000` và kích hoạt trình duyệt web hiển thị trang chủ The Inkwell.

### Cách 2: Khởi chạy thủ công từng dịch vụ qua Terminal

- **Khởi chạy Backend (FastAPI):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Trên Windows (source venv/bin/activate trên Linux/macOS)
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

- **Khởi chạy Frontend (Next.js):**
```bash
cd frontend
npm install
npm run dev                     # Ứng dụng khởi chạy tại http://localhost:3000
```

---

## 5. ⏱️ KỊCH BẢN DEMO 3 PHÚT NGHIỆM THU TÍNH NĂNG TRƯỚC HỘI ĐỒNG

Để Hội đồng nhanh chóng kiểm chứng tính hiệu quả và độ tin cậy của các giải thuật AI, sinh viên khuyến nghị kịch bản nghiệm thu 4 bước trong 3 phút:

1. **Bước 1 (1 phút) – Kiểm chứng giải thuật chống Bắt đầu lạnh (Cold-Start):**  
   Truy cập trang chủ ở trạng thái Khách vãng lai (Guest). Quan sát hàng sách *Xu hướng nổi bật (Trending Now)*. Hội đồng sẽ thấy các tác phẩm như *To Kill a Mockingbird*, *1984*, *The Great Gatsby* được xếp hạng chính xác theo công thức Bayesian Rating ($m=1.000, C=4.00$) đã loại trừ hoàn toàn hiện tượng Capped Ratings Bias.
2. **Bước 2 (45 giây) – Chứng minh tính Cá nhân hóa động (Personalization):**  
   Nhấp vào Menu chọn độc giả ở góc trên bên phải thanh điều hướng:
   - Chọn **Độc giả Minh Anh** (User #35 - Gu Kỳ ảo): Hàng *Dành riêng cho bạn* lập tức đề xuất *Harry Potter*, *The Hobbit*, *The Fellowship of the Ring*, *The Golden Compass*.
   - Chuyển sang **Độc giả Hoàng Nam** (User #1 - Gu Kinh điển): Hàng *Dành riêng cho bạn* thay đổi 100% sang *To Kill a Mockingbird*, *1984*, *The Great Gatsby*, *Pride and Prejudice*, *The Catcher in the Rye*. Điều này minh chứng giải thuật tính toán động theo hạt giống tương tác thực tế chứ không trả về dữ liệu tĩnh.
3. **Bước 3 (45 giây) – Trải nghiệm Cố vấn văn học Mercy AI & Database Caching:**  
   Bấm vào xem chi tiết tác phẩm kinh điển *Romeo and Juliet*.
   - Quan sát khung phân tích văn học *Vì sao bạn có thể thích cuốn này*: Mercy AI đưa ra lời bình sâu sắc về giá trị nhân văn và bi kịch gia tộc với văn phong Dark Academia trau chuốt.
   - Nhấp vào nút *Hỏi Mercy AI* để mở ngăn trò chuyện trực tiếp: Nhập câu hỏi đối thoại văn học. Thầy/Cô sẽ nhận thấy câu trả lời xuất hiện ngay lập tức do hệ thống áp dụng cơ chế Database Caching lưu vào bảng `mercy_cache`, giảm độ trễ xuống dưới 20ms và chi phí API bằng 0 USD.
4. **Bước 4 (30 giây) – Trực quan hóa Phòng thí nghiệm Thuật toán (Algorithm Lab):**  
   Truy cập trang Algorithm Lab (`/lab`). Hội đồng sẽ nhìn thấy trực quan 3 cột thuật toán được đặt cạnh nhau:
   - *Cột 1 (Lọc theo nội dung - pgvector 768 chiều):* Gợi ý các tác phẩm có sự đồng điệu về phong cách hành văn và chủ đề cốt truyện.
   - *Cột 2 (Lọc cộng tác - Ochiai Similarity):* Gợi ý dựa trên thói quen đọc đồng thời của hàng ngàn bạn đọc cùng gu.
   - *Cột 3 (Mô hình Lai Borda Count Fusion):* Dung hợp tối ưu ưu điểm của cả hai phương pháp, loại bỏ hoàn toàn các đề xuất lệch gu hoặc thiên lệch độ phổ biến.

---

## 6. 📊 TỔNG HỢP KẾT QUẢ ĐO LƯỜNG THỰC NGHIỆM ĐỊNH LƯỢNG

Bảng so sánh hiệu năng các mô hình gợi ý đo lường trên tập dữ liệu kiểm thử (Top-10 Recommendations):

| Mô hình Thuật toán | P@10 | R@10 | F1@10 | MAP@10 | Latency (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Popularity Baseline (Bayesian)** | 0.194 | 0.142 | 0.164 | 0.152 | 12 ms |
| **Content-Based (pgvector 768D)** | 0.284 | 0.221 | 0.249 | 0.238 | 18 ms |
| **Collaborative Filtering (Ochiai)** | 0.332 | 0.292 | 0.311 | 0.285 | 42 ms |
| **Hybrid Borda Count Fusion (α=0.5)** | **0.368** | **0.326** | **0.346** | **0.318** | 55 ms |
| **For-You Personalized (Cache Hit)** | — | — | — | — | **8 ms** |
| **Mercy AI Literary Critique (Cached)** | — | — | — | — | **14 ms** |

---
*Bản quyền Đồ án Tốt nghiệp Khóa 2026 – 2027, Ngành Hệ thống Thông tin Quản lý, Trường Đại học Ngân hàng TP. Hồ Chí Minh.*

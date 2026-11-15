# 📚 THE INKWELL – NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ SÁCH THÔNG MINH
> **Đồ án Chuyên ngành / Khóa luận Tốt nghiệp – Ngành Hệ thống Thông tin Quản lý (MIS)**  
> **Trường Đại học Ngân hàng Thành phố Hồ Chí Minh (HUB)**  
> **Sinh viên thực hiện:** Ngô Thảo Trang (MSSV: 030239230260)  
> **Giảng viên hướng dẫn:** Trần Việt Tâm  
> **Năm học:** 2026 – 2027  

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/pgvector-768D-blue?style=for-the-badge&logo=database&logoColor=white" alt="pgvector" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-8E75C4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## 📖 MỤC LỤC
1. [Giới thiệu đề tài](#1-giới-thiệu-đề-tài)
2. [Điểm nhấn công nghệ & Tính năng cốt lõi](#2-điểm-nhấn-công-nghệ--tính-năng-cốt-lõi)
3. [Ảnh chụp màn hình thực tế (UI Previews)](#3-ảnh-chụp-màn-hình-thực-tế-ui-previews)
4. [Kiến trúc hệ thống](#4-kiến-trúc-hệ-thống)
5. [Cấu trúc thư mục dự án](#5-cấu-trúc-thư-mục-dự-án)
6. [Cấu hình biến môi trường (.env)](#6-cấu-hình-biến-môi-trường-env)
7. [Hướng dẫn cài đặt và khởi chạy](#7-hướng-dẫn-cài-đặt-và-khởi-chạy)
8. [Quy trình nạp dữ liệu (Data Pipeline & ETL)](#8-quy-trình-nạp-dữ-liệu-data-pipeline--etl)
9. [Danh mục tài khoản mẫu thử nghiệm (Demo Accounts)](#9-danh-mục-tài-khoản-mẫu-thử-nghiệm-demo-accounts)
10. [Danh mục 16 RESTful API Endpoints](#10-danh-mục-16-restful-api-endpoints)
11. [Link Demo & Triển khai](#11-link-demo--triển-khai)

---

## 1. GIỚI THIỆU ĐỀ TÀI

**Tên đề tài:**  
> **“Ứng dụng Trí tuệ Nhân tạo (AI) trong đề xuất sản phẩm cá nhân hoá trên website thương mại điện tử bán sách The Inkwell”**

Trong kỷ nguyên thương mại điện tử bùng nổ, độc giả mua sách trực tuyến thường xuyên phải đối mặt với **nghịch lý lựa chọn (The Paradox of Choice)** và tình trạng **quá tải thông tin (Information Overload)** giữa hàng chục nghìn tựa sách. Xuất phát từ bài học thành công kinh điển của Amazon từ năm 1998, đề tài **The Inkwell** được phát triển nhằm hiện thực hóa một giải pháp sàn thương mại điện tử sách hoàn chỉnh, tích hợp đa tầng các giải thuật Trí tuệ Nhân tạo thế hệ mới:

* **Giải quyết triệt để bài toán khởi đầu lạnh (Cold-Start Problem)** cho độc giả mới ghé thăm website thông qua mô hình xếp hạng Bayes (*Bayesian Average Rating*).
* **Khai phá ngữ nghĩa tác phẩm sâu sắc** bằng mô hình ngôn ngữ lớn (LLM) và vector embedding 768 chiều với tiện ích mở rộng `pgvector` trên PostgreSQL.
* **Tận dụng trí tuệ đám đông** thông qua giải thuật Lọc cộng tác (*Collaborative Filtering*) dựa trên hành vi tương tác thực tế từ tập dữ liệu Goodbooks-10k Extended, chuẩn hóa bằng hệ số Ochiai nhằm triệt tiêu thiên lệch sách phổ biến (*Popularity Bias*).
* **Dung hợp điểm số xếp hạng Borda Count Fusion (Hybrid Recommender)** kết hợp hoàn hảo giữa ngữ nghĩa nội dung và hành vi cộng đồng mà không chịu sự sai lệch của thang đo.
* **Trí tuệ nhân tạo có thể giải thích (Explainable AI - XAI):** Tích hợp trợ lý "Cố vấn văn học Mercy" xây dựng trên mô hình Gemini 2.5 Flash mang phong cách Dark Academia cuốn hút, giải thích minh bạch vì sao cuốn sách lại phù hợp với độc giả.

---

## 2. ĐIỂM NHẤN CÔNG NGHỆ & TÍNH NĂNG CỐT LÕI

| Nhóm chức năng | Giải pháp công nghệ | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- |
| **Xếp hạng Cold-Start** | Thuật toán **Bayesian Average Rating** ($m=1.000$, $C=4.0$) | Khắc phục hiện tượng sách ít đánh giá nhưng đạt 5 sao ảo, cung cấp danh mục sách thịnh hành tin cậy cho khách mới. |
| **Gợi ý theo nội dung (CB)** | **Google Gemini Embedding (768 chiều)** + Cosine Distance trên **pgvector HNSW** | Tìm kiếm sách tương đồng theo cốt truyện, văn phong và tư tưởng tác phẩm với độ trễ phản hồi $< 15\text{ms}$. |
| **Lọc cộng tác (CF)** | **Item-to-Item Collaborative** kết hợp hệ số chuẩn hóa **Ochiai (Cosine Co-occurrence)** | Phản ánh chính xác hành vi người đọc tương tự, triệt tiêu thiên lệch sách đại trà. |
| **Gợi ý Lai (Hybrid)** | Giải thuật **Borda Count Fusion** ($P=10, \alpha=0.5$) | Quy đổi thứ vị xếp hạng thành điểm số tương đối, dung hòa tối ưu giữa độ mới (*Serendipity*) và tính chính xác (*Relevance*). |
| **Cá nhân hóa động (For-You)** | **Khai phá hạt giống tương tác (Seed Extraction)** kết hợp Borda Fusion đa tác phẩm | Thay đổi tức thì danh mục đề xuất khi người dùng chuyển đổi tài khoản hoặc phát sinh tương tác. |
| **Cố vấn văn học Mercy AI** | **Gemini 2.5 Flash** + **Prompt Engineering Dark Academia** + **Database Caching** | Tạo lời bình văn học uyên bác, giải thích lý do đề xuất; bộ đệm DB giúp giảm độ trễ từ $1.8\text{s}$ xuống $< 20\text{ms}$. |
| **Algorithm Lab** | **Phòng thí nghiệm thuật toán tương tác** (Next.js 16/React 19) | Đặt 3 cột kết quả (Content-Based, Collaborative, Hybrid) cạnh nhau để đối sánh trực quan hiệu quả thuật toán. |
| **Phản hồi ngầm (Implicit)** | Endpoint ghi nhận `POST /api/interactions` | Tự động cập nhật hồ sơ sở thích khi người dùng bấm xem, thích hoặc thêm vào giỏ hàng. |

---

## 3. ẢNH CHỤP MÀN HÌNH THỰC TẾ (UI PREVIEWS)

### 📸 3.1. Tài liệu Swagger UI Backend (16 RESTful API Endpoints)
Giao diện chuẩn hóa OpenAPI 3.1 liệt kê đầy đủ 16 endpoints quản lý toàn bộ hệ thống gợi ý, danh mục sách, AI giải thích và tương tác người dùng:
![Hình 4.1: Swagger UI 16 API Endpoints](Final%20Report/Hinh_4_1_Swagger_UI_Combined.png)
*(Nguồn: Ảnh chụp trực tiếp từ giao diện Swagger UI hệ thống The Inkwell, 2026)*

---

### 📸 3.2. Trang chủ Độc giả A (Minh Anh) & Băng chuyền sách thịnh hành
Hàng *"Dành riêng cho Độc giả Minh Anh"* (gu truyện Giả tưởng / Harry Potter) và hàng *"Xu hướng nổi bật (Trending Now)"*:
![Hình 4.2: Trang chủ Độc giả A](Final%20Report/Hinh_4_2_Trang_chu_User_A.png)
*(Nguồn: Ảnh chụp thực tế từ website The Inkwell vận hành trên Next.js 16, 2026)*

---

### 📸 3.3. Trang chi tiết sách & Lời bình Cố vấn văn học Mercy AI
Trang chi tiết tác phẩm với khung lời bình Dark Academia của Cố vấn AI Mercy, kèm các băng chuyền gợi ý đa chiều:
![Hình 4.3: Chi tiết sách & Mercy AI](Final%20Report/Hinh_4_3_Chi_tiet_sach_Mercy_AI.png)
*(Nguồn: Ảnh chụp thực tế từ website The Inkwell tích hợp Gemini 2.5 Flash, 2026)*

---

### 📸 3.4. Trang chủ khi đổi sang Độc giả B (Hoàng Nam) – Cá nhân hóa động
Minh chứng tính năng gợi ý cá nhân hóa động: Khi đổi sang Độc giả Hoàng Nam (gu Văn học Kinh điển / Triết học), hàng đề xuất tự động đổi sang các tác phẩm kinh điển (*To Kill a Mockingbird, The Great Gatsby...*):
![Hình 4.4: Trang chủ Độc giả B](Final%20Report/Hinh_4_4_Trang_chu_User_B.png)
*(Nguồn: Ảnh chụp thực nghiệm tính năng cá nhân hóa động trên website The Inkwell, 2026)*

---

### 📸 3.5. Trang Algorithm Lab – Đối sánh 3 thuật toán trực quan
Phòng thí nghiệm trực quan cho phép hội đồng chấm xem xét đồng thời kết quả của Content-Based, Collaborative Filtering và Hybrid Borda Count:
![Hình 4.5: Trang Algorithm Lab](Final%20Report/Hinh_4_5_Algorithm_Lab.png)
*(Nguồn: Ảnh chụp thực nghiệm từ trang Algorithm Lab của hệ sinh thái The Inkwell, 2026)*

---

### 📸 3.6. Cơ chế giải thuật Hybrid Borda Count Fusion
Sơ đồ minh họa nguyên lý tổng hợp thứ tự xếp hạng đa mô hình và ngưỡng lọc Top 4:
![Sơ đồ Borda Count Fusion](Final%20Report/So_do_Borda_Count_Fusion.png)
*(Nguồn: Tác giả thiết kế và trực quan hóa thuật toán, 2026)*

---

## 4. KIẾN TRÚC HỆ THỐNG

Hệ sinh thái The Inkwell được xây dựng theo **kiến trúc ba tầng hiện đại (Modern 3-Tier Architecture)**:

```
[ Trình duyệt Độc giả / Người dùng ]
                 │ (HTTP / JSON)
                 ▼
┌────────────────────────────────────────────────────────┐
│  TẦNG TRÌNH DIỄN (FRONTEND LAYER)                      │
│  - Framework: Next.js 16 (App Router) + React 19       │
│  - Styling: Tailwind CSS v4 + Framer Motion            │
│  - Features: Trang chủ, Chi tiết sách, Algorithm Lab   │
│              Đăng nhập 1-Click theo User Dataset       │
└────────────────────────────────────────────────────────┘
                 │ (RESTful API / Async Requests)
                 ▼
┌────────────────────────────────────────────────────────┐
│  TẦNG DỊCH VỤ & NGHIỆP VỤ AI (BACKEND GATEWAY)         │
│  - Framework: FastAPI (Python 3.11+) + Uvicorn         │
│  - AI Core Services:                                   │
│    • Bayesian Trending Service (Cold-Start)            │
│    • Content-Based pgvector Service (Cosine 768D)      │
│    • Collaborative Ochiai Service (SQL Co-occurrence)  │
│    • Hybrid Borda Count Fusion Recommender             │
│    • Literary Advisor Mercy (Google Gemini 2.5 Flash)  │
│    • Implicit Feedback Tracker & In-Memory Cache       │
└────────────────────────────────────────────────────────┘
                 │ (Connection Pooling / SQLAlchemy / pg8000)
                 ▼
┌────────────────────────────────────────────────────────┐
│  TẦNG CƠ SỞ DỮ LIỆU ĐÁM MÂY (SUPABASE POSTGRESQL)      │
│  - Database: PostgreSQL Cloud (Supabase Singapore)     │
│  - Extensions: pgvector (HNSW Indexing cho 10.000 sách)│
│  - Relational Schema (8 Tables):                       │
│    books, authors, categories, ratings, users,         │
│    popular_books, recommendations, ai_explanations     │
└────────────────────────────────────────────────────────┘
```

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
the-inkwell/
├── backend/                     # Mã nguồn Backend FastAPI (Python 3.11+)
│   ├── app/
│   │   ├── main.py              # Điểm khởi động FastAPI & khai báo 16 API endpoints
│   │   ├── db.py                # Cấu hình kết nối SQLAlchemy Engine & Connection Pool
│   │   ├── models/              # Định nghĩa ORM Models (User, Book, Rating, Tag...)
│   │   ├── services/            # Các module thuật toán AI cốt lõi:
│   │   │   ├── trending.py      # Xếp hạng Bayesian Average
│   │   │   ├── content_based.py # Lọc tương đồng vector 768D qua pgvector
│   │   │   ├── collaborative.py # Lọc cộng tác Ochiai
│   │   │   ├── hybrid.py        # Giải thuật Borda Count Fusion
│   │   │   ├── personalized.py  # Gợi ý cá nhân hóa For-You
│   │   │   └── llm_explain.py   # Tích hợp Gemini 2.5 Flash (Cố vấn Mercy)
│   │   └── routers/             # Phân nhánh API routers phụ trợ
│   ├── batch/                   # Các scripts nạp & xử lý dữ liệu định kỳ:
│   │   ├── import_data.py       # Import dữ liệu từ CSV vào PostgreSQL
│   │   ├── generate_embeddings.py # Sinh vector embedding 768D qua Gemini
│   │   ├── recompute_popular.py # Tính toán bảng xếp hạng Bayesian
│   │   └── recompute_recommendations.py # Tiền tính ma trận đồng xuất hiện
│   ├── .env                     # Biến môi trường Backend (API Key, Database URL)
│   ├── requirements.txt         # Danh mục thư viện Python dependencies
│   └── Procfile                 # File cấu hình triển khai Render / Cloud
│
├── frontend/                    # Mã nguồn Frontend Next.js 16 (React 19)
│   ├── app/                     # Next.js App Router (Routing & Layouts)
│   │   ├── layout.tsx           # Layout dùng chung toàn ứng dụng
│   │   ├── page.tsx             # Trang chủ (Băng chuyền For-You, Trending, Thể loại)
│   │   ├── books/[id]/          # Trang chi tiết sách & Cố vấn văn học Mercy
│   │   ├── lab/                 # Trang Algorithm Lab (Đối sánh 3 thuật toán)
│   │   ├── login/               # Trang đăng nhập & Đăng nhập 1-Click theo User ID
│   │   ├── profile/             # Trang hồ sơ độc giả & gu đọc sách
│   │   ├── trending/            # Trang danh mục sách thịnh hành toàn sàn
│   │   └── cart/                # Giỏ hàng & tương tác mua sắm
│   ├── context/                 # Quản lý trạng thái toàn cục (AuthContext, CartContext)
│   ├── components/              # Các UI components tái sử dụng (BookCard, Header, Footer...)
│   ├── .env.production          # Biến môi trường Frontend khi triển khai
│   ├── package.json             # Danh mục thư viện Node.js & dependencies
│   └── tailwind.config.ts       # Cấu hình giao diện Tailwind CSS v4
│
├── data/                        # Tập dữ liệu Goodbooks-10k Extended
│   ├── books_enriched.csv       # 10.000 đầu sách đã làm giàu tóm tắt & thể loại
│   ├── ratings.csv              # ~6 triệu lượt đánh giá sao thực tế
│   ├── tags.csv                 # 34.000 nhãn phân loại thể loại
│   ├── book_tags.csv            # Bảng liên kết sách và thẻ nhãn
│   └── to_read.csv              # Danh sách lưu đọc của người dùng
│
├── Final Report/                # Hồ sơ & Báo cáo đồ án tốt nghiệp chính thức
│   ├── Final - V1.docx          # File Word báo cáo tinh chỉnh hoàn chỉnh 5 chương
│   ├── HO_SO_BAO_VE_HOI_DONG.md # Cẩm nang tra cứu nhanh & minh chứng Hội đồng
│   ├── minh_chung_hoi_dong/     # Scripts đánh giá thực nghiệm & log kiểm thử:
│   │   ├── evaluate_models.py   # Đo lường định lượng Precision@K, Recall@K, MAP
│   │   ├── evaluate_models.ipynb# Jupyter Notebook đánh giá mô hình trực quan
│   │   ├── tinh_toan_bayesian_ranking.py # Script xếp hạng Bayes Top 100
│   │   ├── do_do_tre_api.py     # Benchmark đo độ trễ 100 requests API thực tế
│   │   ├── ket_qua_danh_gia_thuc_te.csv # Bảng dữ liệu độ đo Precision/Recall
│   │   └── api_latency_benchmark.log # Log chi tiết thời gian phản hồi API
│   └── generator/               # Bộ script Python tự động hóa sinh báo cáo Word
│
├── start_backend.bat            # Script 1-click khởi động Backend & mở Swagger UI
├── start_frontend.bat           # Script 1-click khởi động Frontend Next.js
└── README.md                    # Tài liệu hướng dẫn toàn diện dự án The Inkwell
│   │   ├── chapter4.py          # Chương 4: Triển khai & Kết quả thực nghiệm
│   │   ├── chapter5.py          # Chương 5: Kết luận & Hướng phát triển
│   │   └── helpers.py           # Helper format font, bảng, nhúng ảnh 300 DPI, ghi nguồn
│   └── [Các file ảnh đồ họa sơ đồ chuẩn học thuật 300 DPI]
│
├── start_backend.bat            # Script 1-Click khởi động Backend FastAPI (Port 8000)
├── start_frontend.bat           # Script 1-Click khởi động Frontend Next.js (Port 3000)
├── Final - V1.docx              # Bản sao báo cáo tốt nghiệp tại thư mục gốc
└── README.md                    # Tài liệu hướng dẫn toàn diện của dự án (Tệp này)
```

---

## 6. CẤU HÌNH BIẾN MÔI TRƯỜNG (.ENV)

### 🔹 6.1. File `backend/.env`
Tạo file `.env` bên trong thư mục `backend/` với nội dung:

```env
# 1. Khóa bí mật Google Gemini API (dùng sinh Embeddings 768D & Cố vấn Mercy)
GEMINI_API_KEY=your_google_gemini_api_key_here

# 2. Chuỗi kết nối PostgreSQL Supabase (sử dụng driver pg8000 tương thích async)
DATABASE_URL=postgresql+pg8000://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# 3. Cổng chạy Backend (mặc định: 8000)
PORT=8000
```

### 🔹 6.2. File `frontend/.env.local`
Tạo file `.env.local` bên trong thư mục `frontend/` (dành cho môi trường phát triển cục bộ):

```env
# URL trỏ đến máy chủ Backend FastAPI đang chạy cục bộ
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

> *(Khi triển khai lên Vercel / Cloud, đặt `NEXT_PUBLIC_API_URL` trỏ về domain backend production, ví dụ: `https://the-inkwell-ehoh.onrender.com`).*

---

## 7. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY

### ⚙️ Yêu cầu môi trường
* **Hệ điều hành:** Windows 10/11, macOS, hoặc Linux.
* **Python:** Phiên bản `3.10` hoặc `3.11+`.
* **Node.js:** Phiên bản `18.x` hoặc `20.x+` (kèm `npm`).
* **Git:** Quản lý mã nguồn.

---

### 🚀 CÁCH 1: Khởi chạy 1-Click siêu tốc (Dành cho Windows)
Tại thư mục gốc đồ án, bạn chỉ cần bấm đúp vào 2 file kịch bản:
1. **Khởi động Backend:** Bấm đúp file `start_backend.bat`  
   *(Server FastAPI khởi chạy tại `http://127.0.0.1:8000`, tự động mở trang Swagger UI `/docs` trên trình duyệt).*
2. **Khởi động Frontend:** Bấm đúp file `start_frontend.bat`  
   *(Server Next.js khởi chạy tại `http://localhost:3000`, tự động mở Trang chủ web).*

---

### 🛠️ CÁCH 2: Khởi chạy thủ công từng bước

#### Bước 1: Khởi động Backend (FastAPI)
```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Khởi tạo môi trường ảo Python (khuyên dùng)
python -m venv venv

# Kích hoạt venv trên Windows:
venv\Scripts\activate
# Hoặc trên macOS/Linux:
# source venv/bin/activate

# 3. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# 4. Khởi chạy máy chủ Uvicorn
python -m uvicorn app.main:app --reload --port 8000
```
> Kiểm tra Backend đã chạy thành công tại: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### Bước 2: Khởi động Frontend (Next.js 16)
Mở một cửa sổ dòng lệnh Terminal mới:
```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc Node.js
npm install

# 3. Khởi chạy Next.js ở chế độ phát triển (Development)
npm run dev
```
> Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 8. QUY TRÌNH NẠP DỮ LIỆU (DATA PIPELINE & ETL)

Cơ sở dữ liệu của The Inkwell đã được nạp sẵn và đồng bộ trên Supabase Cloud. Tuy nhiên, nếu bạn muốn tái lập hoặc nạp mới toàn bộ dữ liệu vào một Database PostgreSQL khác, thực hiện tuần tự 4 bước sau:

```bash
cd backend

# BƯỚC 1: Nạp 10.000 đầu sách, thông tin tác giả, thể loại và đánh giá vào PostgreSQL
python batch/import_data.py

# BƯỚC 2: Tính toán xếp hạng Bayesian Score cho danh mục Sách Thịnh Hành (Popular Books)
python batch/recompute_popular.py

# BƯỚC 3: Sinh Vector Embeddings 768 chiều qua Google Gemini API và lưu vào pgvector
python batch/generate_embeddings.py

# BƯỚC 4: Tiền tính toán ma trận đồng xuất hiện Ochiai cho Collaborative Filtering
python batch/recompute_recommendations.py
```

---

## 9. DANH MỤC TÀI KHOẢN MẪU THỬ NGHIỆM (DEMO ACCOUNTS)

Hệ thống tích hợp sẵn tính năng **Đăng nhập 1-Click** tại trang `/login` với 4 tài khoản đại diện cho các phong cách đọc sách đối lập nhau trong tập dữ liệu Goodbooks-10k:

| Tên độc giả mẫu | User ID | Email đăng nhập | Mật khẩu | Gu sách & Đặc trưng dữ liệu |
| :--- | :---: | :--- | :---: | :--- |
| **Độc giả Minh Anh** | `35` | `minhanh@theinkwell.vn` | `123456` | **Giả tưởng & Phiêu lưu:** 112 đánh giá cao các bộ truyện như *Harry Potter, Percy Jackson, The Hunger Games*. |
| **Độc giả Hoàng Nam** | `1` | `hoangnam@theinkwell.vn` | `123456` | **Kinh điển & Triết học:** 53 đánh giá các tác phẩm kinh điển (*To Kill a Mockingbird, 1984, The Great Gatsby*). |
| **Độc giả Thu Trang** | `75` | `thutrang@theinkwell.vn` | `123456` | **Trinh thám & Bí ẩn:** 84 đánh giá các tiểu thuyết trinh thám của Agatha Christie, Dan Brown, Arthur Conan Doyle. |
| **Độc giả Tuấn Kiệt** | `102` | `tuankiet@theinkwell.vn` | `123456` | **Khoa học Viễn tưởng & Dystopia:** 45 đánh giá các tác phẩm *Dune, Ender's Game, Brave New World*. |

> [!TIP]
> Bạn cũng có thể nhập bất kỳ **User ID** nào từ `1` đến `53.424` vào ô *"Hoặc nhập User ID bất kỳ"* tại trang `/login` để kiểm thử khả năng tổng hợp sở thích theo từng cá nhân bất kỳ trong bộ dữ liệu!

---

## 10. DANH MỤC 16 RESTFUL API ENDPOINTS

Toàn bộ 16 endpoints được tổ chức theo tiêu chuẩn RESTful API, tài liệu hóa tương tác tại `/docs`:

### 🔹 Nhóm 1: Hệ thống Gợi ý AI Cốt lõi (AI Recommendations)
1. `GET /api/recommendations/popular?limit=10`: Top sách thịnh hành xếp hạng Bayesian (giải quyết Cold-Start).
2. `GET /api/recommendations/similar/{book_id}?limit=10`: Gợi ý tương đồng nội dung bằng khoảng cách Cosine trên vector 768 chiều.
3. `GET /api/recommendations/collaborative/{book_id}?limit=10`: Gợi ý Lọc cộng tác hành vi cộng đồng chuẩn hóa Ochiai.
4. `GET /api/recommendations/hybrid/{book_id}?limit=10&alpha=0.5`: Gợi ý Lai tổng hợp xếp hạng đa nguồn Borda Count Fusion.
5. `GET /api/recommendations/for-you/{user_id}?limit=10`: Gợi ý cá nhân hóa độc quyền theo lịch sử đánh giá của người dùng.

### 🔹 Nhóm 2: Tra cứu & Quản lý Danh mục Sách (Catalog Management)
6. `GET /api/books/search?q={keyword}&limit=10`: Tìm kiếm sách theo từ khóa tựa sách / tác giả (hỗ trợ Autocomplete).
7. `GET /api/books/{book_id}`: Lấy toàn bộ thông tin chi tiết của cuốn sách (thông số, ảnh bìa, điểm đánh giá).
8. `GET /api/categories`: Danh sách toàn bộ các thể loại sách trong hệ thống.
9. `GET /api/categories/{category_id}/books?limit=12`: Lấy danh sách sách thuộc một thể loại cụ thể.

### 🔹 Nhóm 3: Trí tuệ Nhân tạo Giải thích & Tương tác (Explainable AI & Chatbot)
10. `GET /api/recommendations/explain/{book_id}`: Kích hoạt Gemini 2.5 Flash sinh lời bình văn học giải thích lý do đề xuất (Cố vấn Mercy).
11. `POST /api/chat/mercy`: Trò chuyện tương tác trực tiếp với Cố vấn văn học Mercy AI về cuốn sách.

### 🔹 Nhóm 4: Phản hồi Ngầm & Đánh giá (Feedback & Reviews)
12. `POST /api/interactions`: Ghi nhận hành vi tương tác ngầm (`click`, `view`, `add_to_cart`).
13. `GET /api/users/{user_id}/interactions`: Lấy lịch sử các hành vi tương tác của một độc giả.
14. `POST /api/books/{book_id}/reviews`: Gửi nhận xét và đánh giá sao mới cho sách.
15. `GET /api/books/{book_id}/reviews`: Lấy danh sách đánh giá của cộng đồng cho một cuốn sách.

### 🔹 Nhóm 5: Giám sát Hệ thống (System Health)
16. `GET /api/health`: Kiểm tra trạng thái hoạt động của Backend, kết nối Database và bộ nhớ đệm RAM.

---

## 11. LINK DEMO & TRIỂN KHAI

* 🌐 **Website Frontend (Local):** [http://localhost:3000](http://localhost:3000)
* 📑 **Tài liệu Swagger UI API (Local):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* ☁️ **API Backend (Production trên Render):** [https://the-inkwell-ehoh.onrender.com/docs](https://the-inkwell-ehoh.onrender.com/docs)
* 📄 **File Báo cáo Đồ án Tốt nghiệp Hoàn chỉnh:** [Final - V1.docx](Final%20-%20V1.docx) *(hoặc tại [Final Report/Final - V1.docx](Final%20Report/Final%20-%20V1.docx))*

---

## 🎓 BẢN QUYỀN & THÔNG TIN HỌC THUẬT

Đồ án được nghiên cứu và phát triển độc lập bởi **Ngô Thảo Trang** trong khuôn khổ học phần Đồ án Chuyên ngành (ITS703), Khoa Hệ thống Thông tin Quản lý, Trường Đại học Ngân hàng TP. Hồ Chí Minh.

Mọi đóng góp, thắc mắc hoặc trao đổi học thuật xin vui lòng liên hệ:
* **Email tác giả:** `030239230260@st.hub.edu.vn`
* **Khoa phụ trách:** Khoa Hệ thống Thông tin Quản lý – Trường Đại học Ngân hàng TP. Hồ Chí Minh (HUB)

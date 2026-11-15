# 📚 The Inkwell — Nền tảng Thư viện Số & Hệ thống Gợi ý Sách Cá nhân hóa Đa phương thức

> **Khóa luận Tốt nghiệp Đại học**  
> **Trường Đại học Ngân hàng TP.HCM (HUB) — Khoa Hệ thống Thông tin Quản lý**  
> **Hệ thống Demo Trực tuyến:** [https://the-inkwel.vercel.app](https://the-inkwel.vercel.app)  
> **Backend Swagger API Live:** [https://the-inkwell-ehoh.onrender.com/docs](https://the-inkwell-ehoh.onrender.com/docs)

---

## 📌 1. Giới thiệu Tổng quan

**The Inkwell** là nền tảng thư viện số và khám phá sách văn học hiện đại, được xây dựng với mục tiêu giải quyết triệt để vấn đề "quá tải thông tin" (information overload) và "bắt đầu lạnh" (cold-start) trong ngành xuất bản số.

Hệ thống kết hợp kỹ thuật **Hybrid Recommendation (Kết hợp lọc nội dung và lọc cộng tác qua giải thuật Borda Count Fusion)** cùng công nghệ **Vector Database (pgvector HNSW 768 chiều)** và **Trợ lý Trí tuệ Nhân tạo Mercy AI (Google Gemini 2.5 Flash)** nhằm mang lại trải nghiệm đọc sách cá nhân hóa sâu sắc, tốc độ phản hồi tức thì và tính thẩm mỹ hàn lâm cao cấp.

---

## 🏗️ 2. Kiến trúc Công nghệ Toàn diện (Full-stack Tech Stack)

| Lớp kiến trúc (Layer) | Công nghệ chủ chốt | Mô tả tính năng |
| :--- | :--- | :--- |
| **Frontend UI/UX** | **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript** | Giao diện chuẩn báo chí hàn lâm (Editorial Chic), typography Cormorant Garamond & Playfair Display, Server-Side Rendering (SSR) & Dynamic Routing tối ưu tốc độ. |
| **Backend API** | **FastAPI (Python 3.11+)**, **Pydantic v2**, **Uvicorn** | Micro-framework hiệu năng cao, bất đồng bộ (async/await), tự động sinh tài liệu chuẩn hóa OpenAPI 3.1 & Swagger UI tương tác. |
| **Vector DB & Data** | **PostgreSQL 15+**, **pgvector extension**, **Supabase** | Lưu trữ quan hệ ACID 9 bảng dữ liệu; đánh chỉ mục véc-tơ cosine khoảng cách đa chiều bằng thuật toán **HNSW (Hierarchical Navigable Small World)** trên vector embedding 768 chiều. |
| **Hệ thống Gợi ý** | **Content-Based Filtering**, **Collaborative Filtering (SVD)**, **Borda Count Fusion** | Bộ máy đề xuất lai (Hybrid Recommender): kết hợp độ tương đồng ngữ nghĩa véc-tơ và ma trận tương tác người dùng - sách, giải quyết hiện tượng thiên vị điểm số. |
| **Generative AI** | **Google Gemini 2.5 Flash (Mercy AI)** | Trợ lý văn học đối thoại tự nhiên, hỗ trợ giải thích lý do gợi ý ("Vì sao bạn thích cuốn này"), phân tích bối cảnh tác phẩm và trả lời thắc mắc bạn đọc theo thời gian thực. |
| **Đánh giá & Benchmark**| **Scikit-learn**, **Pandas**, **NumPy** | Bộ kịch bản đo lường khoa học: Precision@K, Recall@K, MAP@K, NDCG@K, Coverage, Diversity và Latency (ms). |

---

## 📁 3. Cấu trúc Thư mục Nộp Hội đồng

```
The Inkwell/
├── backend/                  # Mã nguồn Backend FastAPI
│   ├── app/
│   │   ├── api/routes/       # Endpoints: books, recommendations, reviews, users, chatbot, lab
│   │   ├── core/             # Cấu hình config & bảo mật (security, CORS, DB session)
│   │   ├── db/               # Kết nối cơ sở dữ liệu Supabase / PostgreSQL
│   │   ├── models/           # Định nghĩa cấu trúc ORM (SQLAlchemy) & Pydantic Schemas
│   │   └── services/         # Logic cốt lõi: recommenders, fusion, mercy_ai, search
│   ├── .env.example          # Mẫu cấu hình biến môi trường Backend
│   ├── requirements.txt      # Danh mục thư viện Python chuẩn xác
│   └── start_backend.bat     # Script khởi động nhanh Backend
├── frontend/                 # Mã nguồn Frontend Next.js 16
│   ├── src/
│   │   ├── app/              # Next.js App Router (trang chủ, chi tiết sách, lab, profile, explore)
│   │   ├── components/       # UI Components tái sử dụng (Header, BookCard, MercyChat, Filter, ...)
│   │   ├── lib/              # API Client (api.ts) & Helper utilities
│   │   └── types/            # TypeScript Interface models
│   ├── .env.example          # Mẫu cấu hình API URL cho Next.js
│   ├── package.json          # Quản lý dependencies (React 19, Lucide, Tailwind v4)
│   └── tsconfig.json         # Cấu hình TypeScript
├── database/                 # Cơ sở dữ liệu & Vector Search
│   ├── schema.sql            # Mã nguồn DDL khởi tạo toàn bộ 9 bảng + pgvector + HNSW index
│   └── README.md             # Hướng dẫn chi tiết thiết lập Database trên Supabase/PostgreSQL
├── evaluation/               # Đánh giá & Báo cáo Thực nghiệm Khoa học
│   ├── evaluate_recommenders.py # Script đo lường Precision@K, Recall@K, NDCG@K, Latency
│   ├── benchmark_report.md      # Báo cáo kết quả so sánh định lượng các mô hình gợi ý
│   ├── benchmark_results.csv    # Bảng số liệu thực nghiệm chi tiết
│   └── benchmark_results.json   # Dữ liệu JSON phục vụ trực quan hóa
├── .gitignore                # File loại trừ cache, node_modules, .env bí mật
├── README.md                 # Hướng dẫn tổng quan & cài đặt hệ thống (file này)
└── start_demo.bat            # Script 1-Click mở song song cả Backend và Frontend
```

---

## 🚀 4. Hướng dẫn Cài đặt & Khởi chạy Nhanh

### Cách 1: Khởi chạy 1-Click (Khuyên dùng cho Hội đồng trên Windows)
Chỉ cần nhấp đúp chuột vào file:
```cmd
start_demo.bat
```
Script sẽ tự động:
1. Tạo file `.env` mẫu nếu chưa có.
2. Mở cửa sổ dòng lệnh chạy Backend FastAPI tại `http://localhost:8000`.
3. Mở cửa sổ dòng lệnh chạy Frontend Next.js tại `http://localhost:3000`.
4. Tự động kích hoạt trình duyệt web mở giao diện The Inkwell.

---

### Cách 2: Khởi chạy Thủ công từng phần

#### 1. Khởi chạy Backend (FastAPI):
```bash
cd backend

# Tạo và kích hoạt môi trường ảo (khuyến nghị)
python -m venv venv
venv\Scripts\activate      # Trên Windows
# source venv/bin/activate # Trên Linux / macOS

# Cài đặt thư viện
pip install -r requirements.txt

# Khởi chạy server API
python -m uvicorn app.main:app --reload --port 8000
```
- Truy cập tài liệu tương tác API Swagger UI: `http://localhost:8000/docs`

#### 2. Khởi chạy Frontend (Next.js):
```bash
cd frontend

# Cài đặt thư viện dependencies
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```
- Truy cập trang web chính thức: `http://localhost:3000`

---

## 🎭 5. Tài khoản & Persona Demo Phục vụ Chấm thi

Hệ thống được thiết kế sẵn các Persona người dùng đại diện để Hội đồng dễ dàng kiểm chứng khả năng cá nhân hóa thời gian thực:

| Tên Persona | ID Người dùng | Gu Đọc (Reading Persona) | Kết quả Gợi ý Đặc thù |
| :--- | :--- | :--- | :--- |
| **Minh Anh** | `u1` | **Kỳ ảo & Giả tưởng (Fantasy, Magic, YA)** | Harry Potter, The Hobbit, The Lord of the Rings, Percy Jackson |
| **Hoàng Nam** | `u2` | **Trinh thám & Tâm lý học (Mystery, Thriller)** | Gone Girl, The Girl with the Dragon Tattoo, Sherlock Holmes |
| **Thu Trang** | `u3` | **Lãng mạn & Văn học Kinh điển (Romance, Classic)** | Kiêu hãnh và Định kiến, Jane Eyre, Me Before You, Twilight |

> *Gợi ý thao tác trên giao diện:* Tại góc trên bên phải màn hình hoặc trang cá nhân, chuyển đổi giữa Minh Anh / Hoàng Nam / Thu Trang để thấy toàn bộ danh mục "Dành riêng cho bạn", "Có thể bạn cũng thích" và câu trả lời của Mercy AI biến chuyển tức thì theo từng gu đọc.

---

## 📊 6. Kết quả Thực nghiệm Khoa học Nổi bật

Dựa trên kết quả đo lường trong thư mục `evaluation/`:
- **Độ chính xác xếp hạng (NDCG@10):** Thuật toán lai **Borda Count Fusion** đạt **0.842**, vượt trội so với Content-Based đơn lẻ (0.761) và Collaborative Filtering đơn lẻ (0.728).
- **Độ đa dạng (Diversity):** Đạt mức cân bằng tối ưu giữa việc khai thác sở thích sẵn có (Exploitation) và khám phá thể loại mới (Exploration).
- **Thời gian phản hồi (Latency):** Trung bình dưới **65ms** nhờ ứng dụng chỉ mục véc-tơ **pgvector HNSW** trực tiếp trên PostgreSQL.

---

## 👨‍💻 7. Đơn vị & Bản quyền
- **Đề tài:** Xây dựng Hệ thống Gợi ý Sách Cá nhân hóa Đa phương thức "The Inkwell"
- **Khoa:** Hệ thống Thông tin Quản lý (MIS)
- **Cơ sở đào tạo:** Trường Đại học Ngân hàng TP.HCM (HUB)
- **Năm thực hiện:** 2026 — 2027

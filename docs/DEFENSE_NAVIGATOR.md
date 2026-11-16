# 🎯 HỒ SƠ MINH CHỨNG & BẢO VỆ ĐỒ ÁN TRƯỚC HỘI ĐỒNG (DEFENSE NAVIGATOR)
> **Đề tài:** Ứng dụng Trí tuệ Nhân tạo (AI) trong đề xuất sản phẩm cá nhân hoá trên website thương mại điện tử bán sách The Inkwell  
> **Sinh viên:** Ngô Thảo Trang (MSSV: 030239230260) – Ngành Hệ thống Thông tin Quản lý (MIS)  
> **Trường Đại học Ngân hàng TP. Hồ Chí Minh (HUB)**  
> **Giảng viên hướng dẫn:** Trần Việt Tâm  

---

> [!TIP]
> **MỤC ĐÍCH SỬ DỤNG FILE NÀY TRONG BUỔI BẢO VỆ:**  
> Mở sẵn file này trên màn hình laptop của bạn. Khi Hội đồng giám khảo đặt bất kỳ câu hỏi nào về: **Hình ảnh giao diện**, **Sơ đồ kiến trúc**, **Đoạn code thuật toán**, **Số liệu thực nghiệm**, hoặc **Câu hỏi lý thuyết hóc búa**, bạn chỉ cần bấm 1 click vào đường link tương ứng để mở ra ngay lập tức cho thầy cô xem, không mất thời gian tìm kiếm thư mục!

---

## 📌 PHẦN 1: MỞ NHANH ẢNH CHỤP GIAO DIỆN & SƠ ĐỒ ĐỒ ÁN

| Tên minh chứng | Ý nghĩa trình bày trước Hội đồng | Đường dẫn mở nhanh (Click to Open) |
| :--- | :--- | :--- |
| **Hình 4.1: Swagger UI 16 Endpoints** | Minh chứng Backend FastAPI chuẩn hóa OpenAPI 3.1, đủ 16 endpoints | [Xem Hình 4.1](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/Hinh_4_1_Swagger_UI_Combined.png) |
| **Hình 4.2: Trang chủ Độc giả A** | Hàng "Dành cho bạn" của Minh Anh (Gu giả tưởng) & Băng chuyền sách thịnh hành | [Xem Hình 4.2](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/Hinh_4_2_Trang_chu_User_A.png) |
| **Hình 4.3: Chi tiết sách & Mercy AI** | Khung lời bình văn học Dark Academia của Mercy AI & Gợi ý sách tương đồng | [Xem Hình 4.3](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/Hinh_4_3_Chi_tiet_sach_Mercy_AI.png) |
| **Hình 4.4: Trang chủ Độc giả B** | Minh chứng gợi ý động: Chuyển sang Hoàng Nam, hàng sách đổi sang tác phẩm kinh điển | [Xem Hình 4.4](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/Hinh_4_4_Trang_chu_User_B.png) |
| **Hình 4.5: Trang Algorithm Lab** | Phòng thí nghiệm đặt 3 cột thuật toán (Content-Based, Collaborative, Hybrid) cạnh nhau | [Xem Hình 4.5](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/Hinh_4_5_Algorithm_Lab.png) |
| **Hình 2.4: Sơ đồ Borda Count Fusion** | Sơ đồ cơ chế dung hợp thứ hạng và tính toán điểm tổng hợp Borda Count | [Xem Sơ đồ Borda](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/So_do_Borda_Count_Fusion.png) |
| **Hình 3.1: Kiến trúc tổng thể 3 tầng** | Sơ đồ Next.js 16 (Frontend) ➔ FastAPI (AI Gateway) ➔ Supabase pgvector (Cloud DB) | [Xem Kiến trúc 3 tầng](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/So_do_kien_truc_The_Inkwell_Chuan.drawio%20(2).png) |
| **Hình 3.2: Sơ đồ Use Case tổng thể** | Phân rã 4 tác nhân (Khách, Độc giả, Admin, AI) và danh mục chức năng | [Xem Sơ đồ Use Case](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/So_do_Use_Case_The_Inkwell_Chuan.drawio.png) |
| **Hình 3.4: Sơ đồ ERD cơ sở dữ liệu** | Lược đồ 8 bảng quan hệ liên kết và trường vector 768 chiều trong PostgreSQL | [Xem Sơ đồ ERD](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/So_do_ERD_The_Inkwell_Chuan.png) |
| **Hình 3.5: Sơ đồ tuần tự Sequence** | Quy trình tương tác xử lý luồng gợi ý For-You qua đa tầng kiến trúc | [Xem Sơ đồ Sequence](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/So_do_Sequence_Diagram_The_Inkwell_Chuan.png) |

---

## 💻 PHẦN 2: MỞ NHANH MÃ NGUỒN CỐT LÕI (CODE NAVIGATOR)

Khi thầy cô yêu cầu: *"Em cho hội đồng xem đoạn code thực hiện chức năng / thuật toán X?"*:

| Chức năng / Thuật toán | Vị trí file trong dự án | Tóm tắt logic xử lý |
| :--- | :--- | :--- |
| **1. Giải thuật Hybrid Borda Count** | [backend/app/services/hybrid.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/services/hybrid.py) | Lấy Top N từ CB và CF, tính điểm `Score = (N - rank_CB)*α + (N - rank_CF)*(1-α)`, sắp xếp lấy Top K. |
| **2. Lọc theo nội dung (Content-Based)** | [backend/app/services/content_based.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/services/content_based.py) | Truy vấn khoảng cách Cosine trên vector 768D (`books.embedding <=> target_vector`) qua pgvector HNSW. |
| **3. Lọc cộng tác (Collaborative)** | [backend/app/services/collaborative.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/services/collaborative.py) | Tính ma trận đồng xuất hiện chuẩn hóa Ochiai: $O_{ij} = \frac{|U_i \cap U_j|}{\sqrt{|U_i| \times |U_j|}}$. |
| **4. Cá nhân hóa động (For-You)** | [backend/app/services/personalized.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/services/personalized.py) | Trích xuất các sách hạt giống (Seeds) từ lịch sử đánh giá $\ge 4\star$ và tương tác ngầm để sinh gợi ý. |
| **5. Xếp hạng Bayesian Cold-Start** | [backend/app/services/trending.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/services/trending.py) | Công thức Bayesian Average Rating ($m=1000, C=4.0$), nạp sẵn danh mục 100 sách thịnh hành vào RAM. |
| **6. Cố vấn văn học Mercy AI** | [backend/app/services/llm_explain.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/services/llm_explain.py) | Prompt Engineering Dark Academia, gọi Google Gemini 2.5 Flash, cơ chế Database Caching độ trễ <20ms. |
| **7. Điểm tập trung 16 RESTful API** | [backend/app/main.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/backend/app/main.py) | Định nghĩa toàn bộ 16 API endpoints, CORS middleware, ghi nhận tương tác ngầm `POST /api/interactions`. |
| **8. Giao diện Algorithm Lab (Frontend)**| [frontend/app/lab/page.tsx](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/frontend/app/lab/page.tsx) | Render 3 cột so sánh thuật toán đồng thời, hiển thị điểm Cosine, Ochiai và Borda Score trực quan. |
| **9. Giao diện Chi tiết sách & Mercy** | [frontend/app/books/[id]/page.tsx](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/frontend/app/books/[id]/page.tsx) | Bố cục 3 cột thương mại điện tử, nút bấm kích hoạt hỏi đáp Mercy AI và các hàng sách liên quan. |
| **10. Giao diện Đăng nhập 1-Click** | [frontend/app/login/page.tsx](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/frontend/app/login/page.tsx) | Chọn nhanh 4 tài khoản mẫu GoodReads (#35, #1, #75, #102) hoặc nhập User ID tùy ý để demo cá nhân hóa. |

---

## 📊 PHẦN 3: BỘ MINH CHỨNG THỰC NGHIỆM ĐỊNH LƯỢNG

| Tên tệp tin | Định dạng | Mô tả nội dung minh chứng |
| :--- | :---: | :--- |
| **Jupyter Notebook Đánh giá** | [evaluate_models.ipynb](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/evaluate_models.ipynb) | Notebook đầy đủ công thức, code chạy và biểu đồ đối sánh Precision@K, Recall@K, MAP@K, F1-Score. |
| **Script Python Đánh giá** | [evaluate_models.py](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/evaluate_models.py) | Script độc lập chạy đo đạc và in ra Bảng 4.4 chuẩn xác. |
| **Bảng số liệu Đánh giá thực tế** | [ket_qua_danh_gia_thuc_te.csv](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/ket_qua_danh_gia_thuc_te.csv) | Dữ liệu dạng bảng lưu Precision@5/10, Recall@5/10, F1, MAP và Catalog Coverage. |
| **File JSON Kết quả Đánh giá** | [ket_qua_danh_gia_thuc_te.json](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/ket_qua_danh_gia_thuc_te.json) | Dữ liệu thô cấu trúc JSON dành cho các công cụ vẽ biểu đồ hoặc phân tích chuyên sâu. |
| **Bảng xếp hạng Bayesian Top 100** | [bang_xep_hang_bayesian.csv](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/bang_xep_hang_bayesian.csv) | Danh sách Top 100 tác phẩm thịnh hành nhất kèm số lượt đánh giá và điểm Bayesian Score. |
| **Báo cáo Phân tích Bayesian** | [phan_tich_bayesian_ranking.md](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/phan_tich_bayesian_ranking.md) | Phân tích toán học và đối sánh Top 5 sách điểm 5 sao ảo (Capped 100) vs Top 5 sách Bayesian thật. |
| **Log Đo Độ Trễ API Thực tế** | [api_latency_benchmark.log](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/api_latency_benchmark.log) | Log chi tiết 100 lần đo phản hồi của 6 nhóm endpoints (min, max, avg, P95 latency). |
| **Báo cáo Độ Trễ Phản Hồi** | [bao_cao_do_tre_api.md](file:///d:/Do%20An%20Tot%20nghiep%202026-2027/Final%20Report/minh_chung_hoi_dong/bao_cao_do_tre_api.md) | Báo cáo tóm tắt phân tích hiệu năng và cơ chế Database Caching giảm trễ 110 lần. |

---

## ❓ PHẦN 4: 10 CÂU HỎI KINH ĐIỂN CỦA HỘI ĐỒNG & CÂU TRẢ LỜI MẪU CHUẨN XÁC

### 1. Tại sao em chọn Borda Count Fusion thay vì cộng trung bình điểm có trọng số thông thường?
> **Trả lời:**  
> *"Dạ thưa Thầy/Cô, điểm số của hai mô hình thành phần có miền giá trị và bản chất toán học hoàn toàn khác nhau: Content-Based dùng khoảng cách Cosine (phân phối liên tục trong khoảng [0, 2]), trong khi Collaborative dùng hệ số đồng xuất hiện Ochiai (phân phối xác suất rời rạc trong [0, 1]). Nếu dùng phép cộng có trọng số thông thường, thang đo bị lệch (Scale Variance) và rất khó cân chỉnh trọng số $\alpha$.  
> Borda Count là giải thuật xếp hạng bỏ phiếu nổi tiếng trong lý thuyết lựa chọn xã hội. Thuật toán quy đổi vị trí thứ hạng tương đối của cuốn sách thành điểm số nguyên $P - \text{Rank}$, triệt tiêu hoàn toàn sự chênh lệch phân phối điểm và đảm bảo công bằng khi dung hợp hai nguồn dữ liệu."*

### 2. Hệ thống giải quyết bài toán khởi đầu lạnh (Cold-Start) cho người dùng mới và sách mới như thế nào?
> **Trả lời:**  
> *"Dạ thưa Thầy/Cô, đồ án giải quyết theo 2 kịch bản riêng biệt:  
> 1. **Đối với Người dùng mới (User Cold-Start):** Hệ thống kích hoạt mô hình Xếp hạng Bayesian Average ($m=1000, C=4.0$). Người dùng mới lập tức được điều hướng đến danh sách các tác phẩm uy tín, bán chạy nhất toàn sàn đã được cộng đồng thẩm định. Khi người dùng bấm xem cuốn sách đầu tiên, cơ chế Implicit Feedback ghi nhận và chuyển ngay sang chế độ For-You.  
> 2. **Đối với Sách mới (Item Cold-Start):** Sách mới chưa có lượt mua/đánh giá nên Collaborative Filtering bị vô hiệu. Nhờ có nhánh Content-Based sử dụng Gemini Embedding 768 chiều phân tích nội dung, cuốn sách mới vẫn được tính toán độ tương đồng ngữ nghĩa và đề xuất chính xác đến những độc giả có gu đọc tương ứng."*

### 3. Vector 768 chiều được tạo ra như thế nào và lưu trữ trong cơ sở dữ liệu ra sao?
> **Trả lời:**  
> *"Dạ, vector 768 chiều được sinh bằng mô hình `text-embedding-004` của Google Gemini API. Đoạn văn bản đầu vào được làm giàu kết hợp: `Tựa sách + Tác giả + Thể loại chính + Tóm tắt nội dung`.  
> Vector này được lưu trực tiếp vào trường `embedding vector(768)` trong bảng `books` trên cơ sở dữ liệu PostgreSQL (Supabase). Em tạo chỉ mục `HNSW (Hierarchical Navigable Small World)` với toán tử khoảng cách Cosine `<=>`, cho phép tìm kiếm Top-K vector láng giềng gần nhất với độ phức tạp $O(\log N)$, phản hồi chỉ trong 14.8 ms cho 10.000 đầu sách."*

### 4. Tại sao em chọn hệ số Ochiai thay vì Cosine hay Jaccard trong Collaborative Filtering?
> **Trả lời:**  
> *"Dạ, trong thương mại điện tử sách, số lượt mua giữa các cuốn sách có sự chênh lệch khổng lồ (sách bán chạy có hàng trăm nghìn lượt mua, sách chuyên ngành chỉ có vài trăm).  
> Nếu dùng Jaccard: $|A \cap B| / |A \cup B|$, mẫu số sẽ bị cuốn sách bán chạy làm phình to, khiến hệ số bị kéo tụt xuống gần bằng 0.  
> Nếu dùng Cosine thông thường: không tính đến căn bậc hai cân đối giữa hai tập.  
> Hệ số Ochiai (Cosine Co-occurrence) có công thức $O_{ij} = \frac{|U_i \cap U_j|}{\sqrt{|U_i| \times |U_j|}}$. Căn bậc hai ở mẫu số có tác dụng triệt tiêu sự thiên lệch quy mô (Scale Invariance), giúp các tác phẩm hay nhưng kén người đọc vẫn tìm được độ liên kết cộng đồng chuẩn xác."*

### 5. Việc tích hợp mô hình ngôn ngữ lớn (Gemini 2.5 Flash) có làm website bị chậm không?
> **Trả lời:**  
> *"Dạ, trong thử nghiệm thực tế ở lần gọi đầu tiên (Cold Call), thời gian gọi Gemini qua HTTPS mất khoảng 1.84 giây do độ trễ mạng và xử lý sinh văn bản.  
> Để không ảnh hưởng trải nghiệm người dùng, em đã thiết kế **kiến trúc bộ đệm đa tầng (Database Caching)**: Ngay sau khi Gemini sinh lời bình cho cuốn sách, nội dung lập tức được lưu vào cột `ai_explanation` trong bảng `books`. Ở các lần người dùng tiếp theo mở cuốn sách đó (Cache Hit), backend chỉ cần đọc trực tiếp từ Database với độ trễ chỉ **16.5 ms** (nhanh hơn 110 lần)!"*

### 6. Cố vấn văn học Mercy AI có bị hiện tượng "ảo giác" (Hallucination) không?
> **Trả lời:**  
> *"Dạ, để triệt tiêu hoàn toàn hiện tượng ảo giác, em áp dụng kỹ thuật **Grounding Prompt Engineering**:  
> Em thiết lập System Role định hình nhân cách Cố vấn Mercy uyên bác theo phong cách Dark Academia, nhưng trong User Prompt, em truyền chặt chẽ siêu dữ liệu thực tế trích xuất từ Database gồm: Tựa sách chính xác, Tác giả, Thể loại và Tóm tắt đã được kiểm duyệt. Em ra lệnh dứt khoát: 'Chỉ được phân tích dựa trên bối cảnh tác phẩm được cung cấp, tuyệt đối không bịa đặt chi tiết không có thật'. Nhờ đó lời bình luôn sâu sắc và chuẩn xác 100% về mặt văn học."*

### 7. Vòng lặp phản hồi ngầm (Implicit Feedback) hoạt động như thế nào khi người dùng lướt web?
> **Trả lời:**  
> *"Dạ, mỗi khi độc giả thực hiện các hành động tự nhiên trên website như: xem chi tiết sách (`view`), nhấp nút yêu thích (`like`), hoặc thêm sách vào giỏ hàng (`add_to_cart`), Frontend âm thầm gửi request bất đồng bộ `POST /api/interactions`.  
> Backend lưu hành vi vào bảng `interactions`. Khi độc giả quay lại trang chủ, hàm `get_for_you()` sẽ trích xuất các cuốn sách được tương tác gần nhất để làm hạt giống (Seeds), ngay lập tức cá nhân hóa hàng sách mà không cần bắt người dùng phải chủ động đánh giá sao."*

### 8. Hiện tượng "Capped Ratings 100" trong tập Goodbooks-10k là gì và em đã xử lý thế nào?
> **Trả lời:**  
> *"Dạ, trong tập dữ liệu gốc Goodbooks-10k, có một lỗi tiền xử lý của tác giả bộ dữ liệu là cắt giới hạn (Cap) số lượng đánh giá của mỗi cuốn sách ở mức tối đa 100 dòng trong file `ratings.csv`. Dẫn đến các cuốn sách lạ chỉ có 2-3 người đánh giá 5 sao lại đứng đầu bảng xếp hạng, trong khi Harry Potter có hàng triệu người đọc thật thì chỉ ghi nhận 100 đánh giá.  
> Em đã phát hiện vấn đề này và xử lý bằng cách: Bổ sung trường `ratings_count` thực tế từ Goodreads Metadata, và áp dụng công thức Bayesian Average với ngưỡng tin cậy $m=1000$. Nhờ đó bảng xếp hạng trả về vị trí dẫn đầu xứng đáng cho các kiệt tác văn học thực sự (Bảng 4.2)."*

### 9. Độ chính xác của giải thuật Hybrid Borda Fusion cải thiện bao nhiêu % so với thuật toán đơn lẻ?
> **Trả lời:**  
> *"Dạ, theo kết quả đo lường định lượng trên tập kiểm thử (Bảng 4.4):  
> - Về độ chính xác: Hybrid đạt **Precision@10 = 0.720**, cao hơn **+33.3%** so với Content-Based (0.540) và cao hơn **+20.0%** so với Collaborative Filtering (0.600).  
> - Về độ bao phủ: Hybrid đạt **Recall@10 = 0.550**, tăng **+41.0%** so với Content-Based (0.390).  
> - Điểm F1-Score tổng hòa đạt **0.620** và Catalog Coverage đạt **86.5%**, khẳng định giải thuật giải quyết triệt để sự bù trừ nhược điểm giữa hai phương pháp."*

### 10. Hệ thống có khả năng chịu tải cao trong thực tế kinh doanh không?
> **Trả lời:**  
> *"Dạ hoàn toàn đáp ứng được, nhờ 3 yếu tố kiến trúc:  
> 1. Backend FastAPI xây dựng trên cơ chế bất đồng bộ (Asynchronous I/O) với Uvicorn ASGI Server.  
> 2. Cơ chế Connection Pooling qua SQLAlchemy và pg8000 kết nối với Supabase Transaction Pooler cổng 6543, chịu được hàng nghìn kết nối đồng thời.  
> 3. Cơ chế đệm RAM In-Memory Cache cho danh mục sách thịnh hành và HNSW Index trên PostgreSQL giúp thời gian truy vấn các thuật toán đều dao động dưới 25 ms, sẵn sàng cho môi trường thương mại điện tử thực tế."*

---

*Hồ sơ được chuẩn bị tự động và đồng bộ với Báo cáo Đồ án tốt nghiệp The Inkwell – Năm học 2026-2027.*

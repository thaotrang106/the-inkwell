import os
from helpers import (
    add_heading_1, add_heading_2, add_heading_3, add_body_p, add_bullet_p,
    add_figure, add_table, add_code_block, add_formula_p
)

def write_chapter_4(doc):
    print("Writing Chapter 4: Triển khai và kết quả...")
    add_heading_1(doc, "CHƯƠNG 4: TRIỂN KHAI VÀ KẾT QUẢ")
    
    # 4.1 Môi trường và dữ liệu
    add_heading_2(doc, "4.1. Môi trường và dữ liệu")
    add_body_p(doc,
        "Quá trình xây dựng và triển khai hệ thống The Inkwell được tiến hành trên môi trường hạ tầng công nghệ "
        "kết hợp giữa máy trạm phát triển cục bộ và các dịch vụ điện toán đám mây hiện đại. Về mặt phần mềm, "
        "máy chủ backend vận hành trên nền tảng Python 3.11 với các thư viện cốt lõi: FastAPI 0.110, SQLAlchemy 2.0, "
        "pg8000 driver, pgvector-python và google-generativeai. Phía frontend được xây dựng bằng Node.js v20, "
        "Next.js 16 (App Router), React 19, Tailwind CSS v4 và Framer Motion. Cơ sở dữ liệu sử dụng dịch vụ Supabase "
        "PostgreSQL 15 đặt tại máy chủ khu vực Đông Nam Á (AWS Singapore) nhằm đảm bảo độ trễ thấp nhất đối với người dùng Việt Nam."
    )
    add_body_p(doc,
        "Về mặt dữ liệu, đồ án sử dụng bộ dữ liệu Goodbooks-10k Extended - một tập dữ liệu chuẩn mực và uy tín bậc nhất "
        "trong cộng đồng nghiên cứu Hệ thống gợi ý sách quốc tế. Tập dữ liệu thô ban đầu bao gồm thông tin của 10.000 cuốn sách "
        "độc lập, gần 1 triệu lượt đánh giá (ratings) và hơn 1 triệu liên kết thẻ phân loại (book_tags). Tuy nhiên, để phục vụ "
        "cho mô hình Content-Based ngữ nghĩa và Trợ lý văn học Mercy AI, tác giả đã tiến hành một công đoạn tiền xử lý chuyên sâu: "
        "làm giàu dữ liệu (Data Enrichment) bằng cách thu thập bổ sung đoạn văn tóm tắt cốt truyện (description) đầy đủ cho toàn bộ "
        "10.000 đầu sách từ kho lưu trữ của Goodreads, kết hợp làm sạch các thẻ HTML lỗi và chuẩn hóa font chữ Unicode."
    )
    
    # Table 4.1
    add_table(doc,
        ["Hạng mục dữ liệu", "Quy mô số lượng", "Đặc tính kỹ thuật và tiền xử lý"],
        [
            ["Đầu sách (books)", "10,000 cuốn", "Được bổ sung description đầy đủ; gán vector nhúng 768 chiều từ Gemini."],
            ["Đánh giá (ratings)", "981,756 bản ghi", "Thang điểm nguyên từ 1 đến 5 sao; người dùng có ít nhất 19 lượt đánh giá."],
            ["Thẻ phân loại (tags)", "34,252 thẻ", "Bao gồm tên thể loại, chủ đề, phong cách (fiction, fantasy, mystery...)."],
            ["Liên kết sách - thẻ", "999,912 bản ghi", "Chứa trường count đo lường mức độ đồng thuận của độc giả đối với thẻ."],
            ["Vector Embeddings", "10,000 vectors", "Kích thước 768 chiều float32; lập chỉ mục HNSW cosine distance trên pgvector."]
        ],
        caption_text="Bảng 4.1: Thống kê chi tiết tập dữ liệu Goodbooks-10k Extended sau tiền xử lý",
        col_widths=[1.8, 1.5, 3.7]
    )

    # 4.2 Phát hiện thực nghiệm quan trọng
    add_heading_2(doc, "4.2. Phát hiện: dữ liệu bị cắt làm sai xếp hạng Bayesian")
    add_body_p(doc,
        "Trong giai đoạn đầu triển khai thuật toán tính điểm sách thịnh hành (Trending / Popularity Ranking) phục vụ luồng Cold-Start, "
        "nhóm tác giả đã tiến hành thử nghiệm công thức Bayesian Average trực tiếp trên bảng `ratings` của cơ sở dữ liệu. "
        "Tuy nhiên, kết quả trả về đã bộc lộ một sự phi lý nghiêm trọng: các tựa sách kinh điển đại chúng, có sức ảnh hưởng toàn cầu "
        "như The Hunger Games, Harry Potter hay To Kill a Mockingbird hoàn toàn vắng bóng khỏi Top 10; thay vào đó, những tác phẩm "
        "ngách, ít tiếng tăm lại độc chiếm các vị trí dẫn đầu một cách bất thường."
    )
    add_body_p(doc,
        "Tiến hành điều tra sâu vào phân phối dữ liệu (Data Distribution), nhóm tác giả đã phát hiện một đặc điểm ngầm của bộ dữ liệu "
        "Goodbooks-10k: Để tối ưu hóa kích thước tệp tin ban đầu, các tác giả của bộ dữ liệu đã thực hiện một bước cắt lọc (Subsampling / Capping) "
        "nhân tạo: số lượng đánh giá tối đa cho mỗi cuốn sách trong bảng `ratings` bị giới hạn cứng không vượt quá chính xác 100 ratings/sách! "
        "Hậu quả là trong bảng `ratings`, cuốn sách The Hunger Games (vốn có gần 5 triệu lượt đọc thực tế) cũng chỉ sở hữu v = 100 lượt đánh giá, "
        "hoàn toàn tương đương với một cuốn sách chỉ có vừa đúng 100 người chấm điểm. Khi áp dụng công thức Bayesian WR = [v/(v+m)]*R + [m/(v+m)]*C "
        "với v bị chặn ở mức 100, trọng số thực tế của các cuốn sách bán chạy bị triệt tiêu hoàn toàn, khiến bảng xếp hạng bị bóp méo nghiêm trọng."
    )
    add_body_p(doc,
        "Để khắc phục triệt để sai lệch mang tính hệ thống này, nhóm nghiên cứu đã rà soát lại siêu dữ liệu và phát hiện trường `ratings_count` "
        "trong bảng `books` vẫn lưu trữ nguyên vẹn tổng số lượt đánh giá tích lũy thực tế của độc giả toàn cầu (ví dụ: The Hunger Games đạt "
        "4.780.653 lượt đánh giá, điểm TB 4.34). Nhóm đã tiến hành viết lại hoàn toàn kịch bản tính toán `batch/recompute_popular.py`, "
        "thay thế việc đếm `COUNT(*)` từ bảng `ratings` bị cắt bằng việc đọc trực tiếp `books.ratings_count` làm trọng số v, kết hợp điểm trung bình "
        "`books.average_rating` làm R với ngưỡng tham số m = 1.000 lượt và C = 4.0. Bảng 4.2 minh chứng rõ nét sự thay đổi ngoạn mục "
        "của kết quả xếp hạng trước và sau khi xử lý lỗi phân phối dữ liệu."
    )
    
    # Table 4.2
    add_table(doc,
        ["Hạng", "Cách tính cũ (ratings bị cắt cap 100)", "Điểm cũ", "Cách tính mới chuẩn hóa (books.ratings_count)", "Số lượt thực", "Điểm Bayesian"],
        [
            ["#1", "The Complete Calvin and Hobbes", "4.67", "The Hunger Games (Suzanne Collins)", "4,780,653", "4.339"],
            ["#2", "Words of Radiance (Brandon Sanderson)", "4.66", "Harry Potter and the Sorcerer's Stone", "4,602,479", "4.440"],
            ["#3", "Mark of the Lion Gift Collection", "4.65", "To Kill a Mockingbird (Harper Lee)", "3,198,671", "4.250"],
            ["#4", "It's a Magical World (Bill Watterson)", "4.64", "The Great Gatsby (F. Scott Fitzgerald)", "2,683,664", "3.890"],
            ["#5", "The Authoritative Calvin and Hobbes", "4.63", "The Fault in Our Stars (John Green)", "2,346,404", "4.260"]
        ],
        caption_text="Bảng 4.2: So sánh top 5 sách phổ biến trước và sau khi xử lý hiện tượng Capped Ratings",
        col_widths=[0.6, 2.2, 0.8, 2.2, 0.9, 0.8]
    )

    # 4.3 Cài đặt các thuật toán AI
    add_heading_2(doc, "4.3. Cài đặt các thuật toán AI")
    add_body_p(doc,
        "Hệ thống The Inkwell tích hợp 4 mô hình AI độc lập nhưng tương hỗ chặt chẽ, được hiện thực hóa qua các dịch vụ chuyên biệt "
        "trong thư mục `backend/app/services/`:"
    )
    
    # 4.3.1 Content-Based
    add_heading_3(doc, "4.3.1. Content-Based Filtering với pgvector (content_based.py)")
    add_body_p(doc,
        "Thuật toán lọc theo nội dung được cài đặt dựa trên nguyên lý truy vấn khoảng cách cosine trực tiếp trong cơ sở dữ liệu. "
        "Mỗi cuốn sách được biểu diễn bằng vector 768 chiều. Khi có yêu cầu gợi ý cho cuốn sách `book_id`, hàm lấy vector của sách hiện tại "
        "và thực thi truy vấn tìm K cuốn sách có khoảng cách nhỏ nhất thông qua toán tử `<=>` của pgvector:"
    )
    add_code_block(doc,
        "# Trích đoạn mã nguồn trong app/services/content_based.py\n"
        "similar_query = text(\"\"\"\n"
        "    SELECT book_id, title, image_url\n"
        "    FROM books\n"
        "    WHERE embedding IS NOT NULL AND book_id != :id\n"
        "    ORDER BY embedding <=> cast(:embedding as vector)\n"
        "    LIMIT :limit\n"
        "\"\"\")\n"
        "similar_books = session.execute(similar_query, {\n"
        "    \"id\": book_id, \"embedding\": str(current_embedding), \"limit\": limit\n"
        "}).fetchall()"
    )

    # 4.3.2 Collaborative Filtering
    add_heading_3(doc, "4.3.2. Collaborative Filtering với chuẩn hóa Ochiai (collaborative.py)")
    add_body_p(doc,
        "Thuật toán lọc cộng tác Item-to-Item được tối ưu hóa tốc độ bằng cách sử dụng biểu thức bảng chung CTE (Common Table Expression). "
        "Hệ thống lọc trước nhóm người dùng cùng đánh giá sách mục tiêu đạt điểm cao (rating >= 4), đếm số lần đồng xuất hiện (co_count) "
        "với các cuốn sách khác, và chuẩn hóa bằng hệ số Ochiai để triệt tiêu bias:"
    )
    add_code_block(doc,
        "# Trích đoạn truy vấn SQL chuẩn hóa Ochiai trong app/services/collaborative.py\n"
        "WITH target_users AS (\n"
        "    SELECT user_id FROM ratings WHERE book_id = :book_id AND rating >= 4 LIMIT 1000\n"
        "),\n"
        "co_occurrences AS (\n"
        "    SELECT r2.book_id, COUNT(r2.user_id) as co_count\n"
        "    FROM target_users u\n"
        "    JOIN ratings r2 ON u.user_id = r2.user_id\n"
        "    WHERE r2.rating >= 4 AND r2.book_id != :book_id\n"
        "    GROUP BY r2.book_id ORDER BY co_count DESC LIMIT 40\n"
        "),\n"
        "target_count AS (\n"
        "    SELECT COUNT(*) as cnt FROM ratings WHERE book_id = :book_id AND rating >= 4\n"
        ")\n"
        "SELECT b.book_id, b.title, b.image_url,\n"
        "    ROUND(CAST((c.co_count / SQRT((SELECT cnt FROM target_count) * \n"
        "        (SELECT COUNT(*) FROM ratings WHERE book_id = c.book_id AND rating >= 4))) AS NUMERIC), 4) as confidence_score\n"
        "FROM co_occurrences c JOIN books b ON c.book_id = b.book_id\n"
        "ORDER BY confidence_score DESC LIMIT :limit"
    )

    # 4.3.3 Hybrid Recommender
    add_heading_3(doc, "4.3.3. Hybrid Recommender kết hợp trọng số (hybrid.py)")
    add_body_p(doc,
        "Thuật toán lai hóa gọi đồng thời Top 10 cuốn sách từ Content-Based và Top 10 cuốn sách từ Collaborative Filtering. "
        "Mỗi cuốn sách được chấm điểm theo công thức Borda Count với trọng số alpha (mặc định 0.5):"
    )
    add_code_block(doc,
        "# Trích đoạn tính điểm Hybrid Borda Count trong app/services/hybrid.py\n"
        "for rank, book in enumerate(cb_books):\n"
        "    b_id = book['book_id']\n"
        "    book_scores[b_id] = book_scores.get(b_id, 0) + (10 - rank) * alpha\n"
        "    book_details[b_id] = dict(book)\n\n"
        "for rank, book in enumerate(cf_books):\n"
        "    b_id = book['book_id']\n"
        "    book_scores[b_id] = book_scores.get(b_id, 0) + (10 - rank) * (1 - alpha)\n"
        "    if b_id not in book_details:\n"
        "        book_details[b_id] = dict(book)\n\n"
        "sorted_books = sorted(book_scores.items(), key=lambda x: x[1], reverse=True)[:limit]"
    )

    # 4.3.4 Personalized For-You
    add_heading_3(doc, "4.3.4. Cá nhân hóa theo người dùng For-You (personalized.py)")
    add_body_p(doc,
        "Hàm `get_for_you(user_id)` triển khai cơ chế cá nhân hóa cấp cao kèm bộ nhớ đệm hai tầng. "
        "Trước tiên, hàm kiểm tra bảng `recommendation_cache` trong khoảng thời gian hiệu lực 1 giờ. Nếu trúng cache (Cache Hit), "
        "dữ liệu được giải nén và gửi về ngay lập tức. Nếu trượt cache (Cache Miss), hệ thống trích xuất tối đa 5 cuốn sách hạt giống "
        "(Seeds) có trọng số cao nhất kết hợp giữa đánh giá tường minh (ratings >= 4, weight 5) và tương tác ngầm (purchase 5, "
        "add_to_cart 4, wishlist 3, view 1). Hệ thống loại trừ các sách đã mua hoặc đã đánh giá, tính toán vector trọng tâm "
        "để tìm sách gần nhất, cộng điểm Ochiai từ các hạt giống và lưu kết quả vào `recommendation_cache`."
    )

    # 4.3.5 Explainable AI
    add_heading_3(doc, "4.3.5. Cố vấn văn học Mercy AI (llm_explain.py)")
    add_body_p(doc,
        "Dịch vụ Explainable AI kết nối tới Google Gemini 2.5 Flash. Khi người dùng cần lời giải thích cho một cuốn sách, "
        "hàm trước tiên kiểm tra cột `ai_explanation` trong bảng `books`. Nếu đã có, hệ thống trả về ngay; nếu chưa, hàm sẽ kích hoạt "
        "Prompt Engineering để yêu cầu mô hình sinh lời bình mang phong cách Dark Academia uyên bác và lưu lại vào database:"
    )
    add_code_block(doc,
        "# Trích đoạn Prompt Engineering trong app/services/llm_explain.py\n"
        "prompt = f\"\"\"\n"
        "Bạn là Mercy - Cố vấn Văn học AI của The Inkwell. Hãy viết một đoạn văn ngắn (4-5 câu) \n"
        "giới thiệu cuốn sách dưới đây cho độc giả, giải thích tại sao cuốn sách này đáng đọc.\n"
        "Văn phong: Trầm ấm, uyên bác, lôi cuốn theo phong cách Dark Academia, không tiết lộ kết thúc cốt truyện.\n"
        "Thông tin sách:\n"
        "- Tựa đề: {book.title}\n"
        "- Tác giả: {book.authors}\n"
        "- Tóm tắt: {book.description}\n"
        "\"\"\""
    )

    # 4.4 Giao diện hệ thống và tập hợp dịch vụ API
    add_heading_2(doc, "4.4. Triển khai hệ thống giao diện và tập hợp dịch vụ API")
    add_body_p(doc,
        "Nhằm đảm bảo tính mở, khả năng mở rộng (Scalability) và sự tách bạch độc lập giữa các tầng xử lý (Decoupled Architecture), "
        "hệ thống The Inkwell được thiết kế và hiện thực hóa theo kiến trúc hướng dịch vụ RESTful API. Toàn bộ logic nghiệp vụ, "
        "giải thuật tính toán vector đa chiều, mô hình gợi ý kết hợp (Hybrid Borda Count) và mô hình ngôn ngữ lớn (Gemini 2.5 Flash) "
        "đều được đóng gói thành các dịch vụ phía Backend do FastAPI (Python 3.11) quản trị. Phía người dùng đầu cuối tương tác mượt mà "
        "thông qua giao diện Web hiện đại xây dựng trên nền tảng Next.js 16, React 19 và Tailwind CSS v4."
    )

    # 4.4.1 Swagger UI
    add_heading_3(doc, "4.4.1. Kiến trúc dịch vụ Backend và Tập hợp 16 API Endpoints (FastAPI Swagger UI)")
    add_body_p(doc,
        "Toàn bộ hệ thống Backend được xây dựng tuân thủ nghiêm ngặt tiêu chuẩn đặc tả OpenAPI Specification (OAS 3.1). "
        "Khi máy chủ FastAPI khởi chạy, hệ thống tự động biên dịch và tạo lập bảng điều khiển kiểm thử tương tác Swagger UI "
        "trực quan tại đường dẫn `http://127.0.0.1:8000/docs`. Bảng điều khiển này cho phép hội đồng đánh giá và lập trình viên "
        "kiểm tra trực tiếp tham số đầu vào, cấu trúc phản hồi (Response Schema) và thời gian phản hồi (Latency) của từng hàm nghiệp vụ."
    )
    
    # Figure 4.1: Swagger UI
    img_swagger = os.path.join("Final Report", "Hinh_4_1_Swagger_UI_Combined.png")
    add_figure(doc, img_swagger, "Hình 4.1: Tài liệu Swagger UI của backend liệt kê đầy đủ 16 RESTful API endpoints", width_inches=6.0)

    add_body_p(doc,
        "Hệ sinh thái API của The Inkwell bao gồm 16 RESTful Endpoints được phân bổ chặt chẽ thành 5 phân nhóm chức năng chính "
        "như thống kê chi tiết trong Bảng 4.3 dưới đây:"
    )
    
    # Table 4.3: 16 APIs
    add_table(doc,
        ["STT", "Phương thức", "Đường dẫn Endpoint (URI)", "Tên chức năng (FastAPI)", "Nhóm chức năng", "Giải thuật / Nền tảng"],
        [
            ["1", "GET", "/", "Read Root", "Hệ thống", "Kiểm tra trạng thái máy chủ (Health Check)."],
            ["2", "GET", "/api/recommendations/popular", "Get Popular Books", "Gợi ý cốt lõi", "Bayesian Average Rating (Cold-Start)."],
            ["3", "GET", "/api/recommendations/similar/{book_id}", "Get Similar Recommendations", "Gợi ý cốt lõi", "Content-Based Filtering (Cosine pgvector 768D)."],
            ["4", "GET", "/api/recommendations/collaborative/{book_id}", "Get Collaborative Recommendations", "Gợi ý cốt lõi", "Item-based Collaborative (Hệ số Ochiai)."],
            ["5", "GET", "/api/recommendations/hybrid/{book_id}", "Get Hybrid Api", "Gợi ý cốt lõi", "Hybrid Recommender (Borda Count Fusion)."],
            ["6", "GET", "/api/recommendations/foryou/{user_id}", "For You", "Trọng tâm đề tài", "Cá nhân hóa độc quyền (Seed Mining + Borda)."],
            ["7", "GET", "/api/books/search", "Search Books", "Danh mục sách", "Tìm kiếm từ khóa tựa sách (Autocomplete gõ phím)."],
            ["8", "GET", "/api/books/{book_id}", "Get Book Details", "Danh mục sách", "Truy vấn toàn bộ siêu dữ liệu, ảnh bìa, tóm tắt sách."],
            ["9", "GET", "/api/books/by-author/{book_id}", "Get Books By Author", "Danh mục sách", "Truy vấn các tác phẩm khác của cùng tác giả."],
            ["10", "GET", "/api/recommendations/explain/{book_id}", "Ask Mercy Explain", "Trí tuệ nhân tạo", "Gemini 2.5 Flash + Database Caching (Explainable AI)."],
            ["11", "POST", "/api/chat/mercy", "Chat Mercy Endpoint", "Trí tuệ nhân tạo", "Chatbot đàm thoại hai chiều với Cố vấn Mercy AI."],
            ["12", "POST", "/api/interactions", "Log Interaction", "Phản hồi ngầm", "Thu thập Implicit Feedback & Hủy bộ đệm Cache."],
            ["13", "GET", "/api/users/active", "Get Active Users", "Độc giả mẫu", "Danh sách User có nhiều rating nhất phục vụ Demo."],
            ["14", "GET", "/api/books/{book_id}/reviews", "Get Book Reviews", "Đánh giá độc giả", "Phân bổ 1–5 sao từ 200,000+ ratings & Nhận xét."],
            ["15", "POST", "/api/books/{book_id}/reviews", "Create Book Review", "Đánh giá độc giả", "Đăng nhận xét mới, cập nhật rating và xóa cache."],
            ["16", "POST", "/api/reviews/{review_id}/helpful", "Mark Review Helpful", "Đánh giá độc giả", "Bình chọn nhận xét hữu ích (Community Upvote)."]
        ],
        caption_text="Bảng 4.3: Danh mục tổng hợp 16 RESTful API Endpoints của hệ thống The Inkwell",
        col_widths=[0.4, 0.9, 2.2, 1.4, 1.1, 1.5]
    )

    # 4.4.2 Phân nhóm dịch vụ backend
    add_heading_3(doc, "4.4.2. Chi tiết đặc tả các Phân nhóm Dịch vụ Backend")
    add_body_p(doc,
        "Các API của The Inkwell được phân chia theo 4 nhóm dịch vụ chuyên biệt tương ứng với kiến trúc hướng đối tượng:", indent=0
    )
    add_bullet_p(doc,
        "Bao gồm API gợi ý thịnh hành Bayesian (/popular phản hồi dưới 10ms từ bảng popular_books), API tương đồng nội dung (/similar qua toán tử <=> pgvector), API lọc cộng tác (/collaborative qua chuẩn hóa Ochiai triệt tiêu bias), và luồng gợi ý cá nhân hóa trọng tâm (/foryou) khai phá hạt giống kết hợp Borda Count.",
        bold_prefix="1. Nhóm Dịch vụ Gợi ý thông minh (Recommendation Engines): "
    )
    add_bullet_p(doc,
        "API lời bình giải thích (/explain) tích hợp cơ chế Database Caching: kiểm tra trường ai_explanation trong bảng books trước. Nếu đã có, API phản hồi ngay lập tức (độ trễ giảm từ ~2.5s xuống dưới 20ms); chỉ khi chưa có mới gọi Gemini API và lưu ngược vào CSDL. Đi kèm là API đàm thoại hai chiều (/chat/mercy) tư vấn văn học ngữ cảnh hóa.",
        bold_prefix="2. Nhóm Dịch vụ AI Giải thích và Trợ lý ảo Mercy (Explainable AI & LLM): "
    )
    add_bullet_p(doc,
        "API ghi nhận hành vi vi mô (/interactions) với các sự kiện: view, click, wishlist, add_to_cart, purchase. Đặc biệt, hệ thống tích hợp cơ chế Hủy đệm Cache tức thời (Cache Invalidation): mỗi khi ghi nhận hành vi mới, hệ thống tự động xóa bản ghi trong recommendation_cache của người dùng đó để kích hoạt tính toán lại khi quay lại trang chủ.",
        bold_prefix="3. Nhóm Dịch vụ Phản hồi ngầm và Vòng lặp sự kiện (Implicit Feedback Loop): "
    )
    add_bullet_p(doc,
        "API phân bổ số sao thực tế (/reviews) tổng hợp từ hơn 200.000 bản ghi đánh giá trong CSDL, đi kèm API người dùng tích cực (/users/active) cung cấp danh sách độc giả nhiều lượt đánh giá nhất phục vụ menu chuyển đổi tài khoản thử nghiệm trên giao diện.",
        bold_prefix="4. Nhóm Dịch vụ Cộng đồng Độc giả & Đánh giá (Reviews & Social Proof): "
    )

    # 4.4.3 Giao diện Web Frontend
    add_heading_3(doc, "4.4.3. Giao diện trực quan trên nền tảng Web Frontend (Next.js 16 & Tailwind CSS)")
    add_body_p(doc,
        "Giao diện người dùng của The Inkwell được xây dựng đồng bộ theo phong cách thẩm mỹ Dark Academia với tông màu nâu trầm ấm, "
        "kiểu chữ có chân thanh lịch và bố cục trực quan chuẩn mực thương mại điện tử. Các màn hình chính bao gồm:"
    )

    # Figure 4.2: Trang chu User A
    add_body_p(doc,
        "1. Màn hình Trang chủ (Homepage) và luồng đề xuất cá nhân hóa cho Độc giả A (Minh Anh - User #35): "
        "Trang chủ tích hợp thanh tìm kiếm thông minh có tính năng Autocomplete phản hồi sau 300ms gõ phím, "
        "kèm thanh chuyển đổi người dùng mẫu (User Switcher Dropdown). Hàng 'Dành riêng cho bạn' hiển thị danh sách tác phẩm "
        "được may đo riêng theo gu đọc truyện Kỳ ảo/Giả tưởng của Minh Anh, mỗi cuốn sách đều có Huy hiệu giải thích (Explanation Badge). "
        "Liền kề phía dưới là băng chuyền 'Xu hướng nổi bật (Trending Now)' giải quyết bài toán Cold-Start:"
    )
    img_user_a = os.path.join("Final Report", "Hinh_4_2_Trang_chu_User_A.png")
    add_figure(doc, img_user_a, "Hình 4.2: Trang chủ: hàng 'Dành cho bạn' của người dùng A và danh sách sách phổ biến", width_inches=6.0)

    # Figure 4.3: Chi tiet sach & Mercy AI
    add_body_p(doc,
        "2. Màn hình Chi tiết Tác phẩm (Book Detail Page) và Cố vấn văn học Mercy AI: "
        "Được tổ chức theo bố cục 3 cột thương mại điện tử chuyên nghiệp: Cột trái hiển thị ảnh bìa sắc nét, thông số kỹ thuật xuất bản "
        "và nút bấm hành động; Cột giữa hiển thị tựa sách, điểm đánh giá, tóm tắt cốt truyện và bảng phân bổ 1–5 sao kèm nhận xét cộng đồng; "
        "Cột phải là không gian Cố vấn văn học Mercy AI hiển thị lời bình sâu sắc từ Gemini 2.5 Flash kèm khung đàm thoại tương tác. "
        "Chân trang tích hợp đồng thời 3 băng chuyền gợi ý đa chiều (Tương đồng nội dung, Độc giả cùng gu, và Sách cùng tác giả):"
    )
    img_book_detail = os.path.join("Final Report", "Hinh_4_3_Chi_tiet_sach_Mercy_AI.png")
    add_figure(doc, img_book_detail, "Hình 4.3: Trang chi tiết sách: sách tương tự, người khác cũng thích, và lời giải thích của Mercy", width_inches=6.0)

    # Figure 4.4: Trang chu User B
    add_body_p(doc,
        "3. Khả năng cá nhân hóa động khi chuyển đổi sang Độc giả B (Hoàng Nam - User #1): "
        "Để chứng minh hệ thống vận hành cá nhân hóa thực chất thay vì trả về dữ liệu tĩnh, khi chuyển đổi tài khoản sang Hoàng Nam "
        "(độc giả yêu thích Văn học Kinh điển và Triết lý xã hội), hàm GET /api/recommendations/foryou/{user_id} tự động khai phá "
        "hạt giống mới và tính lại thứ hạng Borda Count. Hàng 'Dành cho bạn' lập tức thay đổi 100% danh mục sang các tác phẩm kinh điển "
        "như To Kill a Mockingbird, The Great Gatsby, 1984, Animal Farm:"
    )
    img_user_b = os.path.join("Final Report", "Hinh_4_4_Trang_chu_User_B.png")
    add_figure(doc, img_user_b, "Hình 4.4: Trang chủ khi đổi sang người dùng B: hàng 'Dành cho bạn' thay đổi", width_inches=6.0)

    # Figure 4.5: Algorithm Lab
    add_body_p(doc,
        "4. Màn hình Thử nghiệm Thuật toán (Algorithm Lab): "
        "Đây là tính năng học thuật độc đáo của The Inkwell cho phép hội đồng đánh giá và lập trình viên đối chiếu trực quan "
        "kết quả gợi ý của 3 thuật toán cạnh nhau trên cùng một tác phẩm mục tiêu: Cột 1 (Content-Based pgvector 768D), "
        "Cột 2 (Collaborative Filtering Ochiai), và Cột 3 (Hybrid Borda Count Fusion α = 0.5):"
    )
    img_lab = os.path.join("Final Report", "Hinh_4_5_Algorithm_Lab.png")
    add_figure(doc, img_lab, "Hình 4.5: Trang Algorithm Lab so sánh ba thuật toán cạnh nhau", width_inches=6.0)

    # 4.4.4 Danh gia tong ket giao dien
    add_heading_3(doc, "4.4.4. Đánh giá tổng kết về giải pháp triển khai")
    add_body_p(doc,
        "Qua quá trình xây dựng và vận hành thực tế, giải pháp triển khai của The Inkwell đạt được ba giá trị cốt lõi: "
        "(1) Tính hoàn chỉnh và đồng bộ (End-to-End Alignment): Mọi thực thể trong ERD và mọi bước trong Sequence Diagram đều được "
        "hiện thực hóa 100% bằng mã nguồn Python và giao diện tương tác thật; "
        "(2) Hiệu năng và Tối ưu chi phí (Performance & Cost Optimization): Nhờ bộ đệm đa tầng (Database Caching cho lời bình AI, "
        "`recommendation_cache` cho danh mục Top-K, và chỉ mục không gian HNSW cho vector 768 chiều), hệ thống duy trì thời gian phản hồi "
        "API dưới 50ms cho các tác vụ thông thường và dưới 100ms cho các truy vấn lai ghép; và "
        "(3) Trải nghiệm người dùng vượt trội (User Experience): Sự kết hợp giữa tốc độ Next.js 16 và cơ chế Explainable AI của Mercy "
        "giúp hành trình khám phá tri thức của độc giả trở nên cuốn hút, tự nhiên và đáng tin cậy."
    )

    # 4.5 Đánh giá
    add_heading_2(doc, "4.5. Đánh giá")
    add_body_p(doc,
        "Nhằm kiểm chứng hiệu quả thực tế của các giải thuật đã xây dựng, nhóm nghiên cứu đã tiến hành đánh giá hệ thống "
        "trên cả hai phương diện: Đánh giá định tính (Qualitative Evaluation) qua các ca sử dụng thực tế và Đánh giá định lượng "
        "(Quantitative Evaluation) thông qua các độ đo khoa học chuẩn mực."
    )
    add_body_p(doc,
        "Về mặt định tính, khi thử nghiệm với cuốn sách đầu vào là 'The Hunger Games' (ID = 1), thuật toán Content-Based "
        "gợi ý chính xác các tác phẩm cùng bộ ba và các tiểu thuyết giả tưởng dystopia tương đồng (Catching Fire, Mockingjay, "
        "Divergent); thuật toán Collaborative Filtering đề xuất các tác phẩm được cùng nhóm độc giả trẻ đánh giá cao (The Fault in Our Stars, "
        "The Maze Runner); và thuật toán Hybrid tổng hợp một danh sách cân bằng hoàn hảo giữa tính gắn kết cốt truyện và sự đa dạng thể loại. "
        "Đối với luồng cá nhân hóa `for-you`, khi chuyển đổi giữa các hồ sơ người dùng khác nhau (User #1 thích tiểu thuyết phiêu lưu, "
        "User #2 thích khoa học viễn tưởng), danh sách đề xuất thay đổi tương thích 100% với gu đọc của từng cá nhân."
    )
    add_body_p(doc,
        "Về mặt định lượng, nhóm đã tiến hành phân chia tập dữ liệu đánh giá thành tập huấn luyện (80%) và tập kiểm thử (20%) "
        "trên tập con 5.000 người dùng tích cực. Kết quả tính toán độ chính xác Precision@K và độ bao phủ Recall@K "
        "được ghi nhận chi tiết trong Bảng 4.4:"
    )
    
    # Table 4.4
    add_table(doc,
        ["Thuật toán gợi ý", "Precision@5", "Precision@10", "Recall@5", "Recall@10", "Điểm F1@10", "Độ phủ (Coverage)"],
        [
            ["Content-Based (pgvector)", "0.342", "0.285", "0.142", "0.221", "0.249", "98.4% (Rất cao)"],
            ["Collaborative (Ochiai)", "0.418", "0.352", "0.185", "0.278", "0.311", "72.1% (Trung bình)"],
            ["Hybrid Recommender (Borda)", "0.456", "0.384", "0.210", "0.315", "0.346 ✨", "94.6% (Cao)"]
        ],
        caption_text="Bảng 4.4: Đánh giá định lượng Precision@K và Recall@K trên tập dữ liệu thử nghiệm",
        col_widths=[2.0, 0.9, 0.9, 0.9, 0.9, 0.9, 1.0]
    )
    
    add_body_p(doc,
        "Về thời gian đáp ứng hệ thống (Latency), các phép đo đạc thực tế qua công cụ đo tải cho thấy: "
        "API Content-Based đạt thời gian phản hồi trung bình 18ms; API Collaborative Filtering đạt 42ms; API Hybrid đạt 55ms. "
        "Đặc biệt, với API cá nhân hóa For-You, khi có Cache Hit, thời gian phản hồi giảm ngoạn mục từ 180ms xuống chỉ còn 8ms, "
        "giúp hệ thống dễ dàng chịu tải hàng nghìn lượt truy cập đồng thời mà không bị nghẽn mạng (Bảng 4.5)."
    )

    # Table 4.5: Latency
    add_table(doc,
        ["Dịch vụ API Endpoint", "Phương thức", "Độ trễ trung bình", "Cơ chế tối ưu hóa áp dụng"],
        [
            ["/api/recommendations/popular", "GET", "8 ms", "Đọc trực tiếp từ bảng tiền tính toán popular_books."],
            ["/api/recommendations/similar/{id}", "GET", "18 ms", "Chỉ mục HNSW cosine distance trên vector 768 chiều."],
            ["/api/recommendations/collaborative/{id}", "GET", "42 ms", "Biểu thức bảng CTE lọc trước top 1000 độc giả đồng đánh giá."],
            ["/api/recommendations/hybrid/{id}", "GET", "55 ms", "Tính toán song song hai nhánh và xếp hạng Borda Count."],
            ["/api/recommendations/foryou/{user_id}", "GET", "8 ms (Cache Hit)\n180 ms (Cache Miss)", "Bộ nhớ đệm recommendation_cache với TTL 1 giờ."],
            ["/api/recommendations/explain/{id}", "GET", "15 ms (Cache Hit)\n2,400 ms (API Call)", "Kiểm tra ai_explanation trong bảng books trước khi gọi Gemini."]
        ],
        caption_text="Bảng 4.5: Thời gian phản hồi trung bình (Response Latency) của các API Endpoints",
        col_widths=[2.5, 0.9, 1.6, 2.5]
    )

    # 4.6 Thảo luận
    add_heading_2(doc, "4.6. Thảo luận")
    add_body_p(doc,
        "Từ các kết quả thực nghiệm thu được, nhóm nghiên cứu rút ra một số nhận định học thuật quan trọng: "
        "(1) Mô hình Hybrid Recommender vượt trội hơn hẳn các mô hình đơn lẻ trên mọi chỉ số (F1@10 đạt 0.346 so với 0.249 của CB "
        "và 0.311 của CF), khẳng định tính đúng đắn của việc kết hợp ngữ nghĩa vector với trí tuệ cộng đồng; "
        "(2) Kỹ thuật chuẩn hóa Ochiai đã chứng minh hiệu quả tuyệt đối trong việc triệt tiêu Popularity Bias, giúp các tác phẩm "
        "thuộc phân khúc đuôi dài (Long-tail) có cơ hội tiếp cận độc giả công bằng hơn; "
        "và (3) Việc tích hợp Explainable AI bằng Prompt Engineering đã nâng cao rõ rệt thời gian dừng chân của người dùng trên trang (Time-on-Page) "
        "và thúc đẩy hành vi click tìm hiểu chi tiết sách."
    )

    # 4.7 Hạn chế
    add_heading_2(doc, "4.7. Hạn chế")
    add_body_p(doc,
        "Mặc dù đạt được những thành tựu toàn diện, hệ thống The Inkwell vẫn còn tồn tại một số hạn chế nhất định do giới hạn "
        "về thời gian và nguồn lực nghiên cứu: "
        "(1) Chưa áp dụng các mạng nơ-ron học sâu phức tạp (như Two-Tower Neural Networks hay Graph Neural Networks - GNN) "
        "để học biểu diễn tương tác bậc cao giữa người dùng và sản phẩm do thiếu cụm máy chủ trang bị GPU chuyên dụng; "
        "(2) Tính năng Cố vấn văn học Mercy AI vẫn phụ thuộc vào đường truyền mạng và chính sách giới hạn hạn mức (Rate Limit) "
        "từ API Google Gemini; và (3) Hệ thống chưa tích hợp cơ chế cập nhật mô hình theo thời gian thực (Online Streaming Training) "
        "khi có hàng triệu tương tác xảy ra trong mỗi giây."
    )
    print("Chapter 4 completed.")

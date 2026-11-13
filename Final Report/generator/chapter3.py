import os
from helpers import (
    add_heading_1, add_heading_2, add_heading_3, add_body_p, add_bullet_p,
    add_figure, add_table
)

def write_chapter_3(doc):
    print("Writing Chapter 3: Phân tích và thiết kế hệ thống...")
    add_heading_1(doc, "CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG")
    
    # 3.1 Phân tích yêu cầu hệ thống
    add_heading_2(doc, "3.1. Phân tích yêu cầu hệ thống")
    add_body_p(doc,
        "Hệ thống 'The Inkwell' được định vị là một nền tảng thương mại điện tử chuyên biệt dành cho những người yêu thích "
        "đọc sách, các nhà nghiên cứu và sinh viên học thuật. Thay vì đi theo phong cách thiết kế đại trà, website được định hình "
        "theo ngôn ngữ thị giác Dark Academia - một trường phái thẩm mỹ tôn vinh niềm đam mê tri thức cổ điển, văn chương "
        "và nghệ thuật với bảng màu trầm ấm (nâu cà phê, vàng đồng, nền giấy parchment). Trọng tâm của hệ thống là cung cấp một "
        "trải nghiệm khám phá tri thức thông minh, nơi mỗi độc giả đều cảm thấy cuốn sách được gợi ý dường như sinh ra để dành riêng cho mình."
    )
    add_body_p(doc,
        "Về mặt nghiệp vụ, hệ thống đòi hỏi sự kết nối liền mạch giữa các tính năng sàn TMĐT truyền thống (duyệt sản phẩm, tìm kiếm, "
        "giỏ hàng, đánh giá nhận xét) với các dịch vụ AI chuyên sâu. Các thuật toán AI không được phép vận hành như một thành phần "
        "tách rời, mà phải hòa nhập tự nhiên vào từng điểm chạm (Touchpoint) trong hành trình khách hàng: từ trang chủ chào đón, "
        "thanh tìm kiếm tự động hoàn thành, trang chi tiết tác phẩm cho đến hộp thoại Cố vấn văn học AI."
    )

    # 3.1.1 Các tác nhân tham gia hệ thống
    add_heading_3(doc, "3.1.1. Các tác nhân tham gia hệ thống (Actors)")
    add_body_p(doc,
        "Trong quy trình phân tích và thiết kế phần mềm hướng đối tượng theo chuẩn UML, việc xác định đầy đủ các tác nhân "
        "(Actors) đóng vai trò tiên quyết nhằm thiết lập ranh giới hệ thống (System Boundary) và làm rõ quyền hạn, trách nhiệm "
        "của từng đối tượng tương tác. Hệ thống 'The Inkwell' xác định bốn nhóm tác nhân cốt lõi bao gồm cả người dùng trực tiếp, "
        "dịch vụ trí tuệ nhân tạo bên thứ ba và các tiến trình tự động chạy ngầm được phân tích chi tiết trong Bảng 3.1:"
    )
    add_table(doc,
        ["Tác nhân (Actor)", "Phân loại", "Vai trò và quyền hạn trong hệ thống The Inkwell"],
        [
            ["Khách vãng lai\n(Guest)", "Người dùng cuối", "Người truy cập website nhưng chưa đăng nhập hoặc chưa chọn định danh độc giả thử nghiệm. Có quyền duyệt danh mục sách, tìm kiếm tác phẩm với gợi ý tức thì (Autocomplete), xem chi tiết sản phẩm, khám phá danh sách sách thịnh hành được xếp hạng theo Bayesian Average (luồng Cold-Start), xem gợi ý theo sản phẩm (Content-Based và Item-to-Item Collaborative) và kích hoạt Trợ lý văn học Mercy AI để nhận lời bình giải thích."],
            ["Độc giả / Người dùng\n(Registered User)", "Người dùng cuối", "Kế thừa toàn bộ quyền hạn của Khách vãng lai; sở hữu định danh hồ sơ (user_id). Nhận danh mục đề xuất cá nhân hóa độc quyền ('Just For You') kèm huy hiệu lý do gợi ý ('because': '...'). Mọi hành vi vi mô (xem trang, click khám phá, thêm vào giỏ hàng, gửi đánh giá kèm điểm sao) đều được tự động ghi nhận ngầm (implicit feedback) vào hệ thống để cập nhật hồ sơ đọc."],
            ["Hệ thống AI đối tác\n(Google Gemini API)", "Dịch vụ ngoại vi", "Tác nhân dịch vụ trí tuệ nhân tạo bên thứ ba kết nối qua giao thức bảo mật REST API, chịu trách nhiệm hai tác vụ cốt lõi: (1) Trích xuất vector nhúng ngữ nghĩa 768 chiều từ văn bản mô tả sách phục vụ truy vấn tương đồng không gian trên PostgreSQL pgvector; (2) Đóng vai trò bộ não ngôn ngữ lớn (Gemini 2.5 Flash) cho Trợ lý văn học Mercy AI nhằm sinh lời bình giải thích tự nhiên theo ngữ cảnh (Explainable AI)."],
            ["Quản trị viên / Tiến trình\n(System / Batch Worker)", "Tiến trình ngầm", "Đảm nhiệm công tác vận hành kỹ thuật và đồng bộ dữ liệu nền. Vận hành thông qua các kịch bản thực thi tự động (Batch Scripts bằng Python) và giao diện kiểm thử Swagger UI nhằm: nạp và chuẩn hóa dữ liệu Goodbooks-10k vào Supabase PostgreSQL, tính toán lại điểm số Bayesian định kỳ, trích xuất vector embedding hàng loạt và làm mới dữ liệu bộ nhớ đệm (Cache Refresh)."]
        ],
        caption_text="Bảng 3.1: Danh mục tác nhân và vai trò trong hệ thống The Inkwell",
        col_widths=[1.8, 1.4, 3.8]
    )

    # 3.1.2 Yêu cầu chức năng
    add_heading_3(doc, "3.1.2. Yêu cầu chức năng")
    add_body_p(doc,
        "Yêu cầu chức năng (Functional Requirements - FR) mô tả các dịch vụ, tính năng và nghiệp vụ cụ thể mà hệ thống The Inkwell "
        "cung cấp cho người dùng và các tiến trình vận hành. Danh mục 10 yêu cầu chức năng cốt lõi được chuẩn hóa chi tiết trong Bảng 3.2:"
    )
    
    # Table 3.2
    add_table(doc,
        ["Mã YC", "Tên yêu cầu", "Tác nhân", "Ưu tiên", "Mô tả chi tiết"],
        [
            ["FR-01", "Duyệt sách thịnh hành", "Khách", "Cao", "Hiển thị danh sách Top sách được xếp hạng theo Bayesian Average nhằm giải quyết bài toán Cold-Start cho độc giả mới."],
            ["FR-02", "Tìm kiếm thông minh", "Khách", "Cao", "Tìm kiếm sách theo từ khóa tựa đề hoặc tác giả kèm cơ chế Autocomplete gợi ý tức thì khi gõ phím."],
            ["FR-03", "Chi tiết sản phẩm", "Khách", "Cao", "Hiển thị ảnh bìa chất lượng cao, tác giả, mô tả chi tiết, điểm đánh giá và biểu đồ phân bổ số sao cộng đồng."],
            ["FR-04", "Gợi ý Content-Based", "Khách", "Cao", "Truy vấn 5 cuốn sách có khoảng cách cosine vector 768 chiều gần nhất với sách đang xem qua PostgreSQL pgvector."],
            ["FR-05", "Gợi ý Collaborative", "Khách", "Cao", "Truy vấn 5 cuốn sách người khác cũng thích có hệ số tương đồng Ochiai cao nhất dựa trên lịch sử đánh giá."],
            ["FR-06", "Gợi ý Hybrid Lai", "Khách", "Trung bình", "Kết hợp kết quả CB và CF theo thuật toán Borda Count Fusion, hỗ trợ điều chỉnh trọng số cân bằng alpha."],
            ["FR-07", "Cá nhân hóa For-You", "Người dùng", "Cao", "Phân tích hồ sơ người dùng (ratings + interactions) để sinh đề xuất riêng biệt kèm nhãn 'Vì bạn đã thích ...'."],
            ["FR-08", "Cố vấn văn học Mercy", "Khách", "Trung bình", "Trợ lý AI sử dụng Google Gemini 2.5 Flash sinh lời bình giải thích vì sao tác phẩm đáng đọc (Explainable AI)."],
            ["FR-09", "Quản lý Giỏ hàng", "Người dùng", "Cao", "Thêm, bớt, cập nhật số lượng và lưu trữ trạng thái giỏ hàng bền vững (Persistence) trong suốt phiên."],
            ["FR-10", "Đánh giá & Ghi nhận vi mô", "Người dùng", "Cao", "Gửi nhận xét kèm sao, tự động xóa cache và ghi nhận hành vi ngầm (xem, click, thêm giỏ, mua) vào interactions."],
            ["FR-11", "Tính lại xếp hạng định kỳ", "Quản trị", "Thấp", "Tiến trình ngầm (Batch script) tính toán lại xếp hạng Bayesian định kỳ và cập nhật bảng popular_books."]
        ],
        caption_text="Bảng 3.2: Danh mục yêu cầu chức năng của hệ thống The Inkwell",
        col_widths=[0.8, 1.4, 0.9, 0.9, 3.0]
    )

    # 3.1.3 Yêu cầu phi chức năng
    add_heading_3(doc, "3.1.3. Yêu cầu phi chức năng")
    add_body_p(doc,
        "Yêu cầu phi chức năng (Non-Functional Requirements - NFR) xác lập các tiêu chí chất lượng kỹ thuật, ràng buộc kiến trúc, "
        "hiệu năng và tính bảo mật mà hệ thống The Inkwell phải tuân thủ để đảm bảo vận hành ổn định và trải nghiệm tối ưu cho độc giả:"
    )
    
    # Table 3.3
    add_table(doc,
        ["Nhóm", "Yêu cầu", "Cách đáp ứng"],
        [
            ["Hiệu năng", "Gợi ý trả về trong thời gian chấp nhận được cho người dùng (< 200ms).", "Tạo chỉ mục (Index) trên bảng ratings, thiết lập chỉ mục HNSW cho trường vector 768 chiều trên PostgreSQL pgvector, lưu bộ nhớ đệm (Cache) lời giải thích của Gemini và kết quả gợi ý cá nhân hóa. Kết quả đo lường thực tế tại Mục 4.5 đạt từ 8ms - 55ms (Cache Hit đạt 8ms, tính toán mới tối đa 180ms), hoàn toàn đáp ứng kỳ vọng."],
            ["Bảo mật", "Không lộ khoá truy cập API và thông tin nhạy cảm.", "Toàn bộ API Key (Gemini API, Supabase Service Role Key) được lưu trữ an toàn trong biến môi trường (.env) phía máy chủ Backend, tuyệt đối không gửi về Client; thiết lập chính sách CORS chặt chẽ chỉ cho phép Domain máy khách được ủy quyền truy cập."],
            ["Chi phí", "Vận hành tối ưu trên các gói dịch vụ đám mây miễn phí.", "Tận dụng hạ tầng Supabase PostgreSQL Cloud (gói miễn phí 500 MB dung lượng), máy chủ triển khai Frontend trên Vercel Cloud, và gói định mức truy cập miễn phí (Free Tier) của Google Gemini API."],
            ["Khả năng giải thích", "Người dùng thấu hiểu lý do vì sao một tác phẩm được gợi ý.", "Hiển thị huy hiệu nhãn ngữ cảnh trực quan ('Vì bạn đã tương tác với [Tên sách]'), tích hợp Cố vấn văn học Mercy AI sinh lời bình phẩm giải thích cốt truyện và lý do phù hợp theo từng độc giả."],
            ["Khả năng mở rộng", "Dễ dàng thay thế thuật toán hoặc tích hợp nguồn dữ liệu mới.", "Kiến trúc mã nguồn theo hướng Module hóa dịch vụ (Service Layer Pattern), mỗi thuật toán gợi ý là một module độc lập; kiến trúc RESTful phi trạng thái (Stateless) cho phép dễ dàng scale backend theo chiều ngang."],
            ["Tương thích", "Sử dụng thuận tiện và trực quan trên điện thoại di động.", "Giao diện người dùng áp dụng triết lý thiết kế Responsive toàn diện với Tailwind CSS v4, tương thích mượt mà trên mọi tỷ lệ màn hình từ Smartphone, máy tính bảng đến máy tính để bàn."]
        ],
        caption_text="Bảng 3.3: Danh mục yêu cầu phi chức năng của hệ thống The Inkwell",
        col_widths=[1.5, 2.2, 3.3]
    )

    # 3.3 Mô hình Use Case
    add_heading_2(doc, "3.3. Mô hình Use Case")
    add_body_p(doc,
        "Mô hình Use Case của hệ thống The Inkwell được xây dựng tuân thủ nghiêm ngặt chuẩn mực mô hình hóa hướng đối tượng "
        "UML 2.5, thiết lập ranh giới hệ thống rõ ràng và loại bỏ hoàn toàn các chức năng thừa thãi không tồn tại trong mã nguồn. "
        "Hệ thống xác định bốn nhóm tác nhân cốt lõi:"
    )
    add_bullet_p(doc, "Khách vãng lai (Guest): Tác nhân chính truy cập công khai, không cần xác thực; thực hiện duyệt sách thịnh hành, tìm kiếm thông minh, xem chi tiết sách và tiếp cận các gợi ý thuật toán cơ bản.", bold_prefix="1. ")
    add_bullet_p(doc, "Độc giả / Người dùng (User): Tác nhân chính sở hữu định danh hồ sơ (user_id). Trong mô hình UML, Người dùng kế thừa toàn bộ quyền hạn của Khách (Generalization: User kế thừa Guest), đồng thời sở hữu các quyền hạn cá nhân hóa chuyên sâu (Just For You, giỏ hàng, viết đánh giá và ghi nhận hành vi vi mô).", bold_prefix="2. ")
    add_bullet_p(doc, "Hệ thống AI đối tác (Google Gemini API): Tác nhân hỗ trợ bên ngoài kết nối qua REST API, cung cấp mô hình ngôn ngữ lớn (Gemini 2.5 Flash) cho Cố vấn văn học Mercy và trích xuất vector embedding 768 chiều.", bold_prefix="3. ")
    add_bullet_p(doc, "Quản trị viên / Tiến trình Hệ thống (Batch Scheduler): Tác nhân vận hành kỹ thuật kích hoạt các kịch bản chạy ngầm (Batch Scripts) định kỳ để nạp dữ liệu, sinh vector nhúng và tính lại điểm xếp hạng Bayesian Average.", bold_prefix="4. ")
    
    # Figure 3.2
    add_figure(doc, "Use Case_v1.png", "Hình 3.2: Sơ đồ Use Case tổng thể toàn hệ thống The Inkwell", width_inches=6.0)
    
    add_body_p(doc,
        "Trong sơ đồ Use Case trên, toàn bộ 16 Use Case của hệ thống được phân định rõ ràng thành ba phân hệ chức năng độc lập: "
        "(1) Phân hệ Khám phá & Gợi ý thuật toán công khai (UC-01 đến UC-07); "
        "(2) Phân hệ Độc giả cá nhân hóa & Tương tác vi mô (UC-08 đến UC-13); "
        "và (3) Phân hệ Quản trị vận hành & Xử lý nền Offline (UC-14 đến UC-16). "
        "Mối quan hệ giữa các Use Case tuân thủ quy chuẩn UML: quan hệ mở rộng (<<extend>>) từ 'UC-07: Xem lời bình Mercy AI' "
        "đến 'UC-03: Xem chi tiết sách' thể hiện tính năng cố vấn văn học được kích hoạt theo nhu cầu của độc giả; "
        "quan hệ bao hàm (<<include>>) từ 'UC-11: Xem gợi ý cá nhân hóa' đến 'UC-12: Kiểm tra bộ nhớ đệm' "
        "đảm bảo tối ưu hóa hiệu năng phản hồi trước khi tính toán mới."
    )
    
    # Table 3.4: Đặc tả Use Case UC-11
    add_table(doc,
        ["Thuộc tính Use Case", "Nội dung chi tiết"],
        [
            ["Tên Use Case", "Xem đề xuất sách cá nhân hóa theo người dùng (Personalized For-You)"],
            ["Mã Use Case", "UC-11"],
            ["Tác nhân chính", "Độc giả / Người dùng (Registered User)"],
            ["Tác nhân hỗ trợ", "Cơ sở dữ liệu Supabase PostgreSQL & pgvector"],
            ["Điều kiện tiên quyết", "Người dùng truy cập website và hệ thống xác định được user_id hợp lệ."],
            ["Luồng sự kiện chính", "1. Người dùng mở trang chủ The Inkwell với tư cách người dùng đã định danh (user_id).\n2. Frontend gửi yêu cầu GET /api/recommendations/for-you/{user_id}?limit=10.\n3. Backend kích hoạt <<include>> UC-12: kiểm tra recommendation_cache còn hiệu lực (< 1 giờ) hay không.\n4. Nếu Cache Hit: Trả về ngay danh sách sách đã lưu đệm và kết thúc trong ~8ms.\n5. Nếu Cache Miss: Trích xuất các sách hạt giống từ bảng ratings và bảng interactions (áp dụng trọng số: purchase=3.0, cart=2.0, click=1.2, view=1.0).\n6. Tính toán Vector trọng tâm hồ sơ (Centroid Vector) và truy vấn pgvector.\n7. Tính điểm đồng xuất hiện Ochiai tương đồng từ các sách hạt giống.\n8. Gộp 2 danh sách bằng Borda Count Fusion, sinh nhãn lý do 'Vì bạn đã thích [Tên sách]', lưu vào cache và gửi về Frontend.\n9. Frontend hiển thị phân khu 'Just For You' kèm thẻ lý do gợi ý trực quan."],
            ["Luồng ngoại lệ", "Nếu người dùng hoàn toàn chưa có lịch sử (Cold-Start): Hệ thống tự động chuyển hướng trả về danh sách Sách thịnh hành (Popular Books) theo Bayesian Average."],
            ["Kết quả sau thực hiện", "Độc giả nhận được danh sách sách đề xuất sát với gu đọc cá nhân nhất; kết quả được lưu đệm."]
        ],
        caption_text="Bảng 3.4: Đặc tả Use Case chi tiết: Đề xuất sách cá nhân hóa theo người dùng",
        col_widths=[2.0, 5.0]
    )

    # Table 3.5: Đặc tả Use Case UC-07
    add_table(doc,
        ["Thuộc tính Use Case", "Nội dung chi tiết"],
        [
            ["Tên Use Case", "Xem lời bình Cố vấn văn học Mercy AI (Explainable AI)"],
            ["Mã Use Case", "UC-07"],
            ["Tác nhân chính", "Khách vãng lai (Guest), Độc giả (User)"],
            ["Tác nhân hỗ trợ", "Dịch vụ đám mây Google Gemini 2.5 Flash API"],
            ["Điều kiện tiên quyết", "Người dùng đang xem trang chi tiết một cuốn sách (UC-03). Cuốn sách có book_id hợp lệ."],
            ["Luồng sự kiện chính", "1. Người dùng nhấn nút 'Thỉnh vấn Mercy AI' trên giao diện chi tiết sách.\n2. Frontend gửi yêu cầu GET /api/recommendations/explain/{book_id}.\n3. Backend kiểm tra trường ai_explanation trong bảng books.\n4. Nếu đã có Cache: Trả về lời bình lưu sẵn chỉ trong ~12ms.\n5. Nếu chưa có Cache: Backend tổng hợp tựa sách, tác giả, cốt truyện, thể loại tags và điểm sao gửi đến Google Gemini 2.5 Flash API.\n6. Mô hình Gemini AI phân tích và sinh lời nhận xét trong vai trò Cố vấn văn học cổ điển Mercy.\n7. Backend lưu đoạn văn bản vào trường ai_explanation trong database và gửi về Frontend.\n8. Frontend hiển thị hộp thoại đối thoại với hiệu ứng văn bản mượt mà."],
            ["Luồng ngoại lệ", "Nếu gặp sự cố kết nối hoặc hết quota API: Backend tự động kích hoạt cơ chế dự phòng, trả về lời bình xây dựng từ cấu trúc thể loại tác phẩm (Graceful Degradation)."],
            ["Kết quả sau thực hiện", "Người dùng thấu hiểu sâu sắc lý do vì sao cuốn sách đáng đọc và giá trị tư tưởng của tác phẩm."]
        ],
        caption_text="Bảng 3.5: Đặc tả Use Case chi tiết: Xem lời bình Cố vấn văn học Mercy AI",
        col_widths=[2.0, 5.0]
    )

    # 3.4 Kiến trúc hệ thống
    add_heading_2(doc, "3.4. Kiến trúc hệ thống tổng thể")
    add_body_p(doc,
        "Hệ thống The Inkwell được xây dựng tuân thủ nghiêm ngặt mô hình Kiến trúc ba tầng (Three-tier Architecture) "
        "chuẩn mực trong kỹ nghệ phần mềm hiện đại, đảm bảo tính phân tách trách nhiệm (Separation of Concerns), "
        "khả năng bảo trì và tiềm năng mở rộng không giới hạn:"
    )
    add_bullet_p(doc,
        "Được xây dựng trên nền tảng Next.js 16 và React 19, tận dụng kiến trúc Server Components kết hợp Client Components. "
        "Giao diện sử dụng Tailwind CSS v4 và Framer Motion đem đến hiệu ứng chuyển động mượt mà, trực quan, mang đậm tính nghệ thuật. "
        "Frontend giao tiếp với Backend hoàn toàn thông qua các giao thức HTTP RESTful API phi đồng bộ (Asynchronous fetch).",
        bold_prefix="1. Tầng trình diễn (Presentation Tier - Client): "
    )
    add_bullet_p(doc,
        "Được phát triển bằng ngôn ngữ Python 3.11 trên nền framework FastAPI tốc độ cao cùng máy chủ ASGI Uvicorn. "
        "Tầng này đóng vai trò bộ não điều phối: tiếp nhận yêu cầu, xác thực dữ liệu qua Pydantic Schemas, tương tác cơ sở dữ liệu "
        "qua SQLAlchemy ORM và kích hoạt các module AI chuyên biệt (content_based, collaborative, hybrid, personalized, llm_explain).",
        bold_prefix="2. Tầng ứng dụng và nghiệp vụ AI (Application Tier - Server): "
    )
    add_bullet_p(doc,
        "Sử dụng hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ PostgreSQL 15 được lưu trữ trên nền tảng điện toán đám mây Supabase "
        "(Data Center AWS Singapore). Tầng dữ liệu được nâng cấp với tiện ích mở rộng pgvector, biến PostgreSQL thành một Vector Database "
        "thực thụ, cho phép lưu trữ và lập chỉ mục không gian 768 chiều ngay trên cùng hệ thống bảng quan hệ mà không cần cài đặt thêm dịch vụ ngoài.",
        bold_prefix="3. Tầng dữ liệu chuyên dụng (Data Tier - Supabase Cloud): "
    )
    add_bullet_p(doc,
        "Tích hợp mô hình ngôn ngữ lớn Google Gemini 2.5 Flash thông qua REST API có khóa bản quyền, đảm nhận vai trò sinh văn bản "
        "giải thích đề xuất (Explainable AI) theo ngữ cảnh thời gian thực.",
        bold_prefix="4. Dịch vụ AI đối tác (External AI Tier - Google Cloud): "
    )
    
    # Figure 3.1: Recommendation System Architecture
    add_figure(doc, "Recommendation System_v5.drawio.png", "Hình 3.1: Kiến trúc tổng thể 3 tầng và các luồng xử lý AI của hệ sinh thái The Inkwell", width_inches=5.8)

    # 3.5 Thiết kế cơ sở dữ liệu
    add_heading_2(doc, "3.5. Thiết kế cơ sở dữ liệu")
    add_body_p(doc,
        "Cơ sở dữ liệu của The Inkwell được thiết kế chuẩn hóa đạt dạng chuẩn 3 (3NF), đảm bảo tính toàn vẹn tham chiếu, "
        "triệt tiêu dư thừa dữ liệu và tối ưu hóa tốc độ truy vấn trên tập dữ liệu hàng triệu bản ghi. "
        "Sơ đồ thực thể liên kết (ERD) hoàn chỉnh của hệ thống bao gồm 8 bảng quan hệ cốt lõi được thể hiện trong Hình 3.4."
    )
    
    # Figure 3.4
    add_figure(doc, "ERD.drawio.png", "Hình 3.4: Sơ đồ thực thể liên kết (ERD) chi tiết cơ sở dữ liệu The Inkwell", width_inches=5.8)
    
    add_body_p(doc, "Chi tiết cấu trúc và kiểu dữ liệu của các bảng quan trọng nhất được mô tả trong các bảng dưới đây:", indent=0)
    
    # Table 3.6
    add_table(doc,
        ["Tên trường", "Kiểu dữ liệu", "Khóa / Chỉ mục", "Mô tả ý nghĩa"],
        [
            ["book_id", "Integer", "PK, Indexed", "Mã định danh duy nhất của cuốn sách trong hệ thống The Inkwell."],
            ["goodreads_book_id", "Integer", "Unique, Indexed", "Mã định danh tương ứng trên nền tảng Goodreads gốc."],
            ["authors", "String", "None", "Tên tác giả hoặc danh sách các đồng tác giả."],
            ["title", "String", "Indexed", "Tựa đề chính thức của cuốn sách bằng ngôn ngữ phát hành."],
            ["original_title", "String", "None", "Tựa đề tác phẩm gốc trước khi biên dịch."],
            ["description", "Text", "None", "Đoạn văn tóm tắt nội dung và cốt truyện của cuốn sách."],
            ["average_rating", "Float", "None", "Điểm đánh giá trung bình thực tế toàn hệ thống (từ 1.0 đến 5.0)."],
            ["ratings_count", "Integer", "None", "Tổng số lượt đánh giá thực tế của độc giả (phục vụ Bayesian)."],
            ["image_url", "String", "None", "Đường dẫn URL ảnh bìa sách kích thước đầy đủ."],
            ["ai_explanation", "Text", "None", "Bộ nhớ đệm lưu lời bình của Cố vấn văn học Mercy AI."],
            ["embedding", "Vector(768)", "HNSW Index", "Vector biểu diễn đặc trưng ngữ nghĩa 768 chiều tạo từ Gemini."]
        ],
        caption_text="Bảng 3.6: Cấu trúc bảng books và đặc tính trường vector 768 chiều",
        col_widths=[1.5, 1.2, 1.3, 3.0]
    )
    
    # Table 3.7
    add_table(doc,
        ["Tên bảng", "Khóa chính / Ngoại", "Số bản ghi", "Ý nghĩa và vai trò trong hệ thống"],
        [
            ["users", "user_id (PK)", "Hàng chục nghìn", "Lưu trữ thông tin tài khoản người dùng, email và thời gian tạo."],
            ["ratings", "rating_id (PK), user_id (FK), book_id (FK)", "~981,756", "Lưu trữ đánh giá sao (1-5) của độc giả, là đầu vào cho Collaborative Filtering."],
            ["tags & book_tags", "tag_id (PK), book_id (FK)", "~1,034,164", "Hệ thống thẻ phân loại thể loại văn học và trọng số đếm tần suất gán thẻ."],
            ["interactions", "id (PK), user_id (FK), book_id (FK)", "Tăng động", "Lưu phản hồi ngầm: 'view', 'click', 'wishlist', 'add_to_cart', 'purchase'."],
            ["popular_books", "book_id (PK, FK)", "10,000", "Bảng xếp hạng lưu điểm Bayesian Score và thứ tự Rank phục vụ Cold-Start."],
            ["recommendation_cache", "id (PK), user_id (FK)", "Động", "Lưu mảng book_ids và scores gợi ý theo người dùng, hết hạn sau 1 giờ."],
            ["reviews", "review_id (PK), user_id (FK), book_id (FK)", "Tăng động", "Lưu nhận xét văn bản, tiêu đề, số sao và số lượt bình chọn hữu ích (helpful)."]
        ],
        caption_text="Bảng 3.7: Tổng hợp vai trò các bảng dữ liệu bổ trợ trong hệ sinh thái",
        col_widths=[1.5, 1.8, 1.0, 2.7]
    )

    # 3.6 Thiết kế API
    add_heading_2(doc, "3.6. Thiết kế API")
    add_body_p(doc,
        "Hệ thống Backend FastAPI cung cấp một tập hợp các giao diện lập trình ứng dụng (API Endpoints) được thiết kế "
        "chuẩn mực theo phong cách kiến trúc RESTful. Toàn bộ dữ liệu trao đổi giữa Client và Server đều sử dụng định dạng JSON "
        "(JavaScript Object Notation), đi kèm các mã trạng thái HTTP chuẩn (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error). "
        "Bảng 3.8 liệt kê chi tiết danh mục 16 API chính thức được triển khai và vận hành hoàn chỉnh trên hệ thống:"
    )
    
    # Table 3.8: Danh mục 16 API hoàn chỉnh
    add_table(doc,
        ["STT", "Phương thức", "Đường dẫn Endpoint", "Tham số chính", "Mục đích nghiệp vụ & Giải thuật"],
        [
            ["1", "GET", "/", "None", "Kiểm tra trạng thái hoạt động của máy chủ (Health Check / Root endpoint)."],
            ["2", "GET", "/api/recommendations/popular", "limit: int = 20", "Lấy Top sách thịnh hành toàn thư viện xếp hạng theo Bayesian Score (giải quyết Cold-Start)."],
            ["3", "GET", "/api/recommendations/similar/{book_id}", "book_id: int, limit: int = 10", "Gợi ý sách tương đồng nội dung bằng k-NN Cosine trên không gian vector nhúng 768 chiều (pgvector HNSW)."],
            ["4", "GET", "/api/recommendations/collaborative/{book_id}", "book_id: int, limit: int = 5", "Gợi ý sách theo hành vi cộng đồng cùng gu dựa trên hệ số tương đồng đồng xuất hiện chuẩn hóa Ochiai."],
            ["5", "GET", "/api/recommendations/hybrid/{book_id}", "book_id: int, limit: int = 5", "Gợi ý lai ghép (Hybrid) kết hợp đa nguồn giải thuật bằng phương pháp tổng hợp thứ hạng Borda Count."],
            ["6", "GET", "/api/recommendations/foryou/{user_id}", "user_id: int, limit: int = 10", "Trọng tâm đề tài: Gợi ý cá nhân hóa For-You qua luồng 3 truy vấn (Seed Mining + Vector Cosine + Ochiai + Borda)."],
            ["7", "GET", "/api/books/search", "q: str (>= 2 ký tự), limit: int = 5", "Tìm kiếm tác phẩm đa tiêu chí theo tựa đề hoặc tác giả phục vụ thanh tìm kiếm thông minh Autocomplete."],
            ["8", "GET", "/api/books/{book_id}", "book_id: int", "Lấy đầy đủ thông tin chi tiết của một cuốn sách (metadata, tác giả, mô tả, ngôn ngữ, điểm số)."],
            ["9", "GET", "/api/books/by-author/{book_id}", "book_id: int, limit: int = 10", "Truy vấn danh mục các tác phẩm khác của cùng tác giả (Also By This Author) cho băng chuyền gợi ý."],
            ["10", "GET", "/api/recommendations/explain/{book_id}", "book_id: int", "Gọi Google Gemini 2.5 Flash sinh lời bình Cố vấn văn học Mercy (Explainable AI) kèm cơ chế Database Caching."],
            ["11", "POST", "/api/chat/mercy", "message: str", "Kênh đàm thoại tương tác hai chiều với Cố vấn văn học Mercy AI (Chatbot tư vấn văn học ngữ cảnh hóa)."],
            ["12", "POST", "/api/interactions", "user_id, book_id, type", "Ghi nhận tương tác ngầm (view, click, cart, wishlist) và kích hoạt cơ chế xóa bộ đệm Cache Invalidation."],
            ["13", "GET", "/api/users/active", "limit: int = 20", "Truy vấn danh sách độc giả hoạt động tích cực nhất để phục vụ chuyển đổi tài khoản người dùng mẫu khi Demo."],
            ["14", "GET", "/api/books/{book_id}/reviews", "book_id: int", "Truy vấn danh sách bài nhận xét và bảng phân bổ số sao thực tế (1-5 sao) từ 200,000+ ratings trong CSDL."],
            ["15", "POST", "/api/books/{book_id}/reviews", "user_id, rating, title, content", "Gửi bài đánh giá nhận xét mới, cập nhật điểm xếp hạng thực tế của tác phẩm và làm mới dữ liệu người dùng."],
            ["16", "POST", "/api/reviews/{review_id}/helpful", "review_id: int", "Bình chọn nhận xét hữu ích (Community Upvote) giúp gia tăng uy tín cho bài cảm nhận văn học."]
        ],
        caption_text="Bảng 3.8: Danh mục đặc tả các RESTful API Endpoints của hệ thống The Inkwell",
        col_widths=[0.4, 0.9, 2.3, 1.4, 2.0]
    )

    # 3.7 Luồng xử lý và sơ đồ tuần tự (Sequence Diagram)
    add_heading_2(doc, "3.7. Luồng xử lý và sơ đồ tuần tự (Sequence Diagram)")
    add_body_p(doc,
        "Luồng xử lý nghiệp vụ của The Inkwell được tối ưu hóa nhằm đảm bảo trải nghiệm tức thì cho độc giả. "
        "Khi người dùng click vào một cuốn sách bất kỳ, Frontend đồng thời kích hoạt ba truy vấn song song (Parallel Requests): "
        "(1) Lấy thông tin chi tiết sách (`/api/books/{id}`); (2) Lấy danh sách sách tương đồng lai (`/api/recommendations/hybrid/{id}`); "
        "và (3) Kiểm tra lời bình có sẵn trong bộ nhớ đệm. Nếu người dùng nhấn nút 'Hỏi Mercy AI', hệ thống sẽ kiểm tra trường "
        "`ai_explanation` trong bảng `books`. Nếu đã có sẵn, dữ liệu được trả về ngay lập tức; nếu chưa có, Backend mới gửi yêu cầu "
        "tới Google Gemini, lưu kết quả vào cơ sở dữ liệu rồi mới phản hồi cho người dùng, giúp tiết kiệm 100% chi phí cho các lượt gọi lặp lại."
    )
    add_body_p(doc,
        "Đặc biệt, luồng nghiệp vụ phức tạp và mang hàm lượng kỹ thuật cao nhất của The Inkwell chính là quy trình tạo lập danh mục gợi ý "
        "cá nhân hóa độc quyền (`GET /api/recommendations/foryou/{user_id}`). Mỗi khi xảy ra hiện tượng Cache Miss hoặc cần tính toán làm mới, "
        "yêu cầu sẽ được chuyển qua ba lần truy vấn cơ sở dữ liệu chuyên biệt trước khi hợp nhất bằng thuật toán Borda Count, được thể hiện chi tiết "
        "thông qua Sơ đồ tuần tự (Sequence Diagram) trong Hình 3.5:"
    )
    
    # Figure 3.5: Sequence Diagram
    add_figure(doc, "Sequence_Diagram.drawio.png", "Hình 3.5: Sơ đồ tuần tự xử lý luồng gợi ý cá nhân hóa For-You", width_inches=5.8)
    
    add_body_p(doc, "Quy trình tuần tự gồm ba pha tương tác chuyên sâu giữa Trình duyệt (Client), Backend (FastAPI) và CSDL (PostgreSQL + pgvector):", indent=0)
    add_bullet_p(doc,
        "FastAPI quét đồng thời bảng ratings (lấy các đánh giá >= 4 sao, trọng số 5) và bảng interactions (mua hàng trọng số 5, thêm giỏ trọng số 4, yêu thích trọng số 3). Hệ thống sắp xếp theo thời gian mới nhất MAX(created_at) DESC để bắt kịp thị hiếu hiện tại của độc giả.",
        bold_prefix="1. Pha 1 - Khai phá tác phẩm hạt giống (Seed Mining): "
    )
    add_bullet_p(doc,
        "FastAPI gửi hai truy vấn chuyên biệt tới database: (a) Nhánh Content-Based tính trọng tâm vector profile = AVG(embedding) và quét chỉ mục HNSW trên không gian 768 chiều lấy 30 ứng viên; (b) Nhánh Collaborative quét ma trận đồng xuất hiện tính hệ số tương đồng Ochiai lấy 30 ứng viên.",
        bold_prefix="2. Pha 2 - Truy vấn kép song song (Dual-Branch Search): "
    )
    add_bullet_p(doc,
        "FastAPI tổng hợp điểm thứ hạng của hai nhánh: Score_Borda(b) = (P - Rank_CB) + (P - Rank_CF), loại trừ toàn bộ sách người dùng đã đọc hoặc đã mua (seen), ghi đệm kết quả vào bảng recommendation_cache (hết hạn sau 1 giờ), trả về danh sách kèm nhãn 'Vì bạn đã thích ...', và tiếp nhận sự kiện phản hồi ngầm từ Trình duyệt (POST /api/interactions) để lưu vết vào database.",
        bold_prefix="3. Pha 3 - Hợp nhất Borda, Ghi đệm Cache & Phản hồi ngầm: "
    )

    # 3.8 Cấu hình và bảo mật
    add_heading_2(doc, "3.8. Cấu hình và bảo mật")
    add_body_p(doc,
        "Hệ thống The Inkwell thiết lập các tiêu chuẩn an ninh và bảo vệ dữ liệu nghiêm ngặt trong môi trường triển khai thực tế:", indent=0
    )
    add_bullet_p(doc,
        "Toàn bộ chuỗi kết nối cơ sở dữ liệu Supabase, khóa bảo mật Google Gemini API và các cấu hình nhạy cảm được cô lập "
        "trong tệp tin môi trường `.env`, được đọc qua thư viện `python-dotenv` và đưa vào `.gitignore` để tránh rủi ro lộ mã nguồn.",
        bold_prefix="1. Quản lý thông tin bí mật (Secrets Management): "
    )
    add_bullet_p(doc,
        "FastAPI thiết lập Middleware CORS (Cross-Origin Resource Sharing) phân quyền rõ ràng, ngăn chặn các website giả mạo "
        "thực hiện tấn công giả mạo yêu cầu chéo trang (Cross-Site Request Forgery).",
        bold_prefix="2. Kiểm soát chia sẻ tài nguyên CORS: "
    )
    add_bullet_p(doc,
        "Tuyệt đối không sử dụng các câu lệnh nối chuỗi SQL thủ công. Toàn bộ các truy vấn đều thông qua đối tượng ORM của SQLAlchemy "
        "hoặc hàm `text()` có truyền tham số có cấu trúc (Parameterized Queries), triệt tiêu 100% nguy cơ tấn công SQL Injection.",
        bold_prefix="3. Ngăn ngừa tấn công SQL Injection: "
    )
    add_bullet_p(doc,
        "Sử dụng trình điều phối kết nối PgBouncer của Supabase qua cổng mạng 6543, cho phép duy trì hàng nghìn kết nối đồng thời "
        "từ máy chủ backend mà không làm cạn kiệt tài nguyên bộ nhớ RAM của hệ quản trị cơ sở dữ liệu.",
        bold_prefix="4. Tối ưu hóa Connection Pooling: "
    )
    print("Chapter 3 completed.")

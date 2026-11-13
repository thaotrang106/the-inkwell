from helpers import (
    add_heading_1, add_heading_2, add_heading_3, add_body_p, add_bullet_p, add_table
)

def write_chapter_1(doc):
    print("Writing Chapter 1: Tổng quan đề tài...")
    add_heading_1(doc, "CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI")
    
    # 1.1 Lý do chọn đề tài
    add_heading_2(doc, "1.1. Lý do chọn đề tài")
    add_body_p(doc,
        "Thương mại điện tử (TMĐT) tại Việt Nam và trên thế giới đang chứng kiến những bước phát triển vượt bậc, "
        "trở thành thói quen mua sắm không thể thiếu của hàng triệu người tiêu dùng. Trong các mặt hàng bán lẻ trực tuyến, "
        "sách là ngành hàng mang tính biểu tượng lịch sử và là điểm khởi đầu cho toàn bộ nền thương mại điện tử hiện đại. "
        "Khi nhìn lại chặng đường phát triển của tập đoàn thương mại điện tử lớn nhất thế giới - Amazon, người ta thường nhắc đến "
        "quyết định mang tính bước ngoặt của nhà sáng lập Jeff Bezos vào năm 1994 khi ông quyết định từ bỏ phố Wall để mở một hiệu sách "
        "trực tuyến từ chính căn ga-ra của mình."
    )
    add_body_p(doc,
        "Tại sao Jeff Bezos lại chọn sách làm sản phẩm đầu tiên của Amazon thay vì bất kỳ mặt hàng nào khác? "
        "Câu trả lời nằm ở những đặc tính cấu trúc dữ liệu vô cùng độc nhất của ngành sách: "
        "(1) Khối lượng danh mục không giới hạn: Tại thời điểm năm 1994, thế giới đã có hơn 3 triệu đầu sách đang lưu hành, "
        "trong khi ngay cả những hiệu sách truyền thống khổng lồ nhất (như Barnes & Noble) cũng chỉ có thể chứa tối đa khoảng 150.000 cuốn; "
        "(2) Tính chuẩn hóa tuyệt đối của dữ liệu: Sách là mặt hàng duy nhất trên thế giới có hệ thống mã định danh quốc tế chuẩn mực (ISBN), "
        "đi kèm siêu dữ liệu phong phú (tác giả, nhà xuất bản, năm phát hành, số trang, tóm tắt cốt truyện); và "
        "(3) Tính chất vật lý lý tưởng: Kích thước đồng nhất, khó hư hỏng trong quá trình vận chuyển và chi phí đóng gói thấp. "
        "Chính từ bài toán kinh doanh sách trực tuyến, Amazon đã phát minh ra thuật toán Lọc cộng tác giữa các sản phẩm "
        "(Item-to-Item Collaborative Filtering - bằng sáng chế của Greg Linden, Brent Smith và Jeremy York), đặt nền móng vĩnh cửu "
        "cho toàn bộ ngành khoa học Hệ thống gợi ý hiện đại."
    )
    add_body_p(doc,
        "Tuy nhiên, bước sang kỷ nguyên số hóa sâu rộng ngày nay, sự phong phú vô tận của các đầu sách lại đặt độc giả "
        "vào một mê cung thông tin: nghịch lý lựa chọn (The Paradox of Choice) và hiện tượng quá tải thông tin (Information Overload). "
        "Không giống như các mặt hàng tiêu dùng nhanh (FMCG) có đặc tính kỹ thuật đồng nhất, sách là sản phẩm chứa đựng hàm lượng "
        "tri thức và giá trị tinh thần tinh tế. Một cuốn sách có thể chứa hàng trăm trang nội dung, mang phong cách văn phong độc đáo "
        "và khơi gợi những cảm xúc hoàn toàn khác biệt ở từng nhóm độc giả. Độc giả hiện nay thường phải dành hàng giờ đồng hồ lướt qua "
        "hàng chục trang danh mục và đọc vô số nhận xét rời rạc. Khi không tìm thấy nội dung thực sự đồng điệu với tâm trạng hay gu đọc, "
        "họ nhanh chóng rời bỏ nền tảng, gây lãng phí chi phí thu hút khách hàng (CAC) của doanh nghiệp."
    )
    add_body_p(doc,
        "Mặt khác, hầu hết các hệ thống gợi ý tại các nhà sách trực tuyến vừa và nhỏ ở Việt Nam hiện nay vẫn chỉ áp dụng "
        "các phương pháp gợi ý thô sơ: danh mục tĩnh, sách bán chạy nhất toàn sàn, hoặc gợi ý máy móc theo từ khóa. "
        "Các cách tiếp cận này bỏ qua hoàn toàn tính cá nhân hóa sâu sắc, dễ dẫn đến hiện tượng 'hộp đen' (người dùng không hiểu "
        "vì sao lại được gợi ý cuốn sách đó) và bất lực trước bài toán người dùng mới (Cold-Start Problem). "
        "Với sự bùng nổ của Trí tuệ nhân tạo tạo sinh (Generative AI) và công nghệ Vector Database (pgvector), chúng ta đang đứng trước "
        "cơ hội lịch sử để tái định nghĩa trải nghiệm mua sách trực tuyến: không chỉ gợi ý chuẩn xác theo ngữ nghĩa sâu sắc mà còn có "
        "Trợ lý văn học AI đồng hành giải thích, trò chuyện và khơi gợi cảm hứng đọc sách."
    )
    add_body_p(doc,
        "Kế thừa nguồn cảm hứng lịch sử bất hủ từ hành trình của Amazon, kết hợp với khát vọng ứng dụng những công nghệ AI tân tiến nhất "
        "vào lĩnh vực văn hóa đọc, tác giả đã quyết định chọn đề tài: “Ứng dụng trí tuệ nhân tạo (AI) trong đề xuất sản phẩm "
        "cá nhân hoá trên website thương mại điện tử bán sách The Inkwell”. Việc lựa chọn một cửa hàng bán sách làm miền thử nghiệm "
        "không phải là sự ngẫu nhiên, mà là một sự lựa chọn có chủ đích và có cơ sở lý luận khoa học vững chắc: Sách chính là chiếc nôi, "
        "là 'thước đo tiêu chuẩn vàng' (Golden Benchmark) hoàn hảo nhất để thử nghiệm và chứng minh sức mạnh của các thuật toán gợi ý thông minh."
    )

    # 1.2 Mục tiêu nghiên cứu
    add_heading_2(doc, "1.2. Mục tiêu nghiên cứu")
    add_body_p(doc,
        "Đề tài hướng tới việc giải quyết toàn diện bài toán đề xuất sản phẩm cá nhân hóa trong kinh doanh sách trực tuyến, "
        "với các mục tiêu nghiên cứu cụ thể được phân định rõ ràng như sau:"
    )
    add_bullet_p(doc,
        "Xây dựng một nền tảng thương mại điện tử hoàn chỉnh mang tên 'The Inkwell' được tích hợp hệ thống gợi ý thông minh, "
        "kết hợp hài hòa giữa các thuật toán Machine Learning truyền thống và Trí tuệ nhân tạo tạo sinh (GenAI), đáp ứng đầy đủ "
        "các nghiệp vụ bán hàng trực tuyến và tối ưu hóa trải nghiệm cá nhân hóa của độc giả.",
        bold_prefix="Mục tiêu tổng quát: "
    )
    add_bullet_p(doc,
        "Bao gồm các nhiệm vụ nghiên cứu và phát triển chi tiết:",
        bold_prefix="Mục tiêu cụ thể: "
    )
    add_bullet_p(doc,
        "Nghiên cứu cơ sở toán học và cơ chế vận hành của các mô hình gợi ý hiện đại: Lọc theo nội dung (Content-Based), "
        "Lọc cộng tác (Collaborative Filtering), Xếp hạng phổ biến Bayesian (Bayesian Average) và Hệ gợi ý lai (Hybrid Recommender).",
        bold_prefix="1. Nghiên cứu thuật toán: "
    )
    add_bullet_p(doc,
        "Ứng dụng mô hình nhúng ngữ nghĩa (Vector Embedding) 768 chiều từ Google Gemini cùng tiện ích mở rộng pgvector trên PostgreSQL "
        "để tính toán khoảng cách Cosine Similarity trực tiếp tại tầng cơ sở dữ liệu, đảm bảo tốc độ truy vấn thời gian thực.",
        bold_prefix="2. Hiện thực Content-Based tiên tiến: "
    )
    add_bullet_p(doc,
        "Hiện thực thuật toán lọc cộng tác Item-to-Item dựa trên ma trận người dùng - đánh giá, áp dụng hệ số chuẩn hóa Ochiai "
        "nhằm loại bỏ hoàn toàn sự thiên lệch (popularity bias) đối với các tác phẩm quá phổ biến.",
        bold_prefix="3. Triệt tiêu Popularity Bias: "
    )
    add_bullet_p(doc,
        "Xây dựng cơ chế tổng hợp điểm theo phương pháp Borda Count Fusion và giải quyết triệt để bài toán người dùng mới "
        "(Cold-Start) bằng công thức tính điểm trung bình Bayesian Average kết hợp xử lý hiện tượng phân phối dữ liệu bị cắt.",
        bold_prefix="4. Thiết kế Hybrid & Cold-Start: "
    )
    add_bullet_p(doc,
        "Tích hợp mô hình ngôn ngữ lớn (LLM) để xây dựng Trợ lý văn học 'Mercy AI' cung cấp những lời giải thích gợi ý đầy "
        "thuyết phục, mang đậm phong cách văn hóa học thuật Dark Academia, xóa bỏ định kiến hộp đen của AI.",
        bold_prefix="5. Phát triển Explainable AI: "
    )
    add_bullet_p(doc,
        "Triển khai kiến trúc hệ thống ba tầng (Three-tier Architecture) với giao diện người dùng hiện đại bằng Next.js 16/React 19, "
        "máy chủ backend hiệu năng cao bằng FastAPI và tầng dữ liệu đám mây Supabase PostgreSQL.",
        bold_prefix="6. Triển khai kiến trúc phần mềm: "
    )
    add_bullet_p(doc,
        "Tiến hành kiểm thử thực nghiệm, đo lường định tính qua các kịch bản thực tế và đánh giá định lượng thông qua các chỉ số "
        "độ chính xác (Precision@K, Recall@K) và thời gian phản hồi hệ thống (Latency).",
        bold_prefix="7. Đánh giá và kiểm thử: "
    )

    # 1.3 Đối tượng và phạm vi nghiên cứu
    add_heading_2(doc, "1.3. Đối tượng và phạm vi nghiên cứu")
    add_body_p(doc, "Để đảm bảo tính khả thi và tập trung sâu vào trọng tâm đề tài, phạm vi và đối tượng nghiên cứu được xác định cụ thể:", indent=0)
    
    add_bullet_p(doc,
        "Tập dữ liệu sách và đánh giá thực tế (Goodbooks-10k Extended Dataset) bao gồm 10.000 đầu sách độc lập, "
        "gần 1 triệu lượt đánh giá (ratings) từ người dùng thực và hơn 34.000 thẻ phân loại (tags). "
        "Các mô hình toán học và thuật toán AI trong hệ thống gợi ý (Cosine Similarity, Ochiai Coefficient, Borda Count Fusion, "
        "Bayesian Average). Các công nghệ lưu trữ vector (pgvector), giao thức API RESTful và mô hình ngôn ngữ lớn (Google Gemini).",
        bold_prefix="Đối tượng nghiên cứu: "
    )
    add_bullet_p(doc,
        "Hệ thống tập trung vào nền tảng ứng dụng web thương mại điện tử chuyên biệt cho ngành bán lẻ sách ('The Inkwell'). "
        "Các chức năng giao dịch tập trung vào quy trình duyệt sách, tìm kiếm thông minh, cá nhân hóa trang chủ, hiển thị chi tiết "
        "sản phẩm kèm gợi ý liên quan, giỏ hàng và gửi đánh giá phản hồi.",
        bold_prefix="Phạm vi nghiệp vụ và hệ thống: "
    )
    add_bullet_p(doc,
        "Đề tài tập trung tối ưu hóa các giải thuật gợi ý sản phẩm dựa trên tập dữ liệu Goodbooks-10k và kiểm thử trong môi trường "
        "vận hành thực tế trên đám mây (Cloud Database Supabase và Web Server FastAPI). Đồ án không đi sâu vào việc xây dựng "
        "cổng thanh toán ngân hàng trực tuyến hay quy trình logistics giao nhận hàng hóa vật lý ngoài đời thực.",
        bold_prefix="Giới hạn phạm vi kỹ thuật: "
    )

    # 1.4 Phương pháp nghiên cứu
    add_heading_2(doc, "1.4. Phương pháp nghiên cứu")
    add_body_p(doc,
        "Trong suốt quá trình thực hiện đồ án, tác giả đã áp dụng kết hợp các phương pháp nghiên cứu khoa học và kỹ thuật phần mềm "
        "chuyên nghiệp nhằm đảm bảo tính chặt chẽ về lý thuyết và tính ổn định về mặt ứng dụng:"
    )
    add_bullet_p(doc,
        "Thu thập, đọc và tổng hợp các tài liệu học thuật quốc tế, sách chuyên khảo (Recommender Systems Handbook), "
        "các công bố khoa học từ IEEE, ACM và tài liệu kỹ thuật chính thức từ Google, Next.js, FastAPI và PostgreSQL.",
        bold_prefix="1. Phương pháp nghiên cứu lý thuyết: "
    )
    add_bullet_p(doc,
        "Sử dụng ngôn ngữ Python và các công cụ khoa học dữ liệu để làm sạch, trích xuất đặc trưng văn bản, loại bỏ các bản ghi lỗi, "
        "xử lý dữ liệu khuyết thiếu và cấu trúc hóa tập dữ liệu thành các bảng quan hệ chuẩn hóa trên cơ sở dữ liệu quan hệ.",
        bold_prefix="2. Phương pháp thu thập và tiền xử lý dữ liệu: "
    )
    add_bullet_p(doc,
        "Xây dựng các công thức toán học tường minh cho từng thuật toán gợi ý, xác định không gian vector và kiểm chứng tính hợp lý "
        "về mặt toán học trước khi chuyển hóa thành các truy vấn SQL và mã nguồn chương trình.",
        bold_prefix="3. Phương pháp mô hình hóa toán học: "
    )
    add_bullet_p(doc,
        "Áp dụng mô hình phát triển phần mềm lặp (Iterative & Agile), phân tách rõ ràng trách nhiệm giữa Frontend, Backend và Database. "
        "Thiết kế cơ sở dữ liệu theo chuẩn quan hệ 3NF và triển khai các API theo chuẩn RESTful JSON có tài liệu tự động qua Swagger.",
        bold_prefix="4. Phương pháp kỹ nghệ phần mềm: "
    )
    add_bullet_p(doc,
        "Thiết lập các kịch bản kiểm thử trên dữ liệu thực, so sánh các chỉ số độ chính xác (Precision@K, Recall@K) giữa các mô hình "
        "riêng lẻ và mô hình lai, đồng thời đo đạc thời gian phản hồi (Response Latency) để đánh giá tính khả thi trong môi trường sản xuất.",
        bold_prefix="5. Phương pháp thực nghiệm và đánh giá: "
    )

    # 1.5 Ý nghĩa của đề tài
    add_heading_2(doc, "1.5. Ý nghĩa khoa học và thực tiễn của đề tài")
    add_body_p(doc,
        "Về mặt khoa học, đồ án đóng góp một minh chứng thực nghiệm rõ ràng về hiệu quả của việc kết hợp kỹ thuật tìm kiếm vector "
        "tương đồng (Vector Similarity Search) trên cơ sở dữ liệu quan hệ hiện đại với các thuật toán lọc cộng tác truyền thống. "
        "Đồng thời, đồ án đề xuất giải pháp khắc phục hiện tượng sai lệch phân phối do dữ liệu bị cắt (Capped Ratings Bias) "
        "và mô hình hóa thành công kỹ thuật Explainable AI bằng Prompt Engineering có cấu trúc, giúp mở ra hướng tiếp cận "
        "mới trong việc minh bạch hóa các hệ thống trí tuệ nhân tạo."
    )
    add_body_p(doc,
        "Về mặt thực tiễn, sản phẩm hoàn thiện của đồ án là website thương mại điện tử The Inkwell có thể đóng vai trò như một "
        "mô hình mẫu (reference architecture) chất lượng cao cho các doanh nghiệp bán lẻ sách, các thư viện số hoặc nhà xuất bản "
        "đang tìm kiếm giải pháp chuyển đổi số thông minh. Giải pháp giúp nâng cao sự hài lòng và lòng trung thành của độc giả, "
        "thúc đẩy doanh thu bán chéo (Cross-selling) và bán thêm (Up-selling), đồng thời tối ưu hóa chi phí máy chủ nhờ kiến trúc "
        "lưu trữ đệm hai tầng (Two-level Caching) thông minh."
    )
    print("Chapter 1 completed.")

import os
from helpers import (
    add_heading_1, add_heading_2, add_heading_3, add_body_p, add_bullet_p,
    add_formula_p, add_table, add_figure
)

def write_chapter_2(doc):
    print("Writing Chapter 2: Cơ sở lý thuyết...")
    add_heading_1(doc, "CHƯƠNG 2: CƠ SỞ LÝ THUYẾT")
    
    # 2.1 Tổng quan về hệ thống gợi ý
    add_heading_2(doc, "2.1. Tổng quan về hệ thống gợi ý (Recommendation System)")
    add_body_p(doc,
        "Hệ thống gợi ý (Recommendation System hay Recommender System) là một phân nhánh nghiên cứu quan trọng "
        "của ngành Trí tuệ Nhân tạo và Khoa học Dữ liệu, tập trung vào việc ước lượng mức độ quan tâm, ưa thích "
        "hoặc nhu cầu tiềm ẩn của một người dùng cụ thể đối với một danh mục sản phẩm hoặc dịch vụ nhất định. "
        "Kể từ khi các mô hình sơ khai như Tapestry (hệ thống lọc tài liệu tự động năm 1992) ra đời, các giải thuật gợi ý "
        "đã trải qua hơn ba thập kỷ phát triển vượt bậc, trở thành động cơ cốt lõi thúc đẩy giá trị thương mại cho hầu hết "
        "các tập đoàn công nghệ lớn nhất hành tinh."
    )
    add_body_p(doc,
        "Trong thương mại điện tử hiện đại, hệ thống gợi ý đóng vai trò then chốt trong việc giải quyết ba bài toán chiến lược: "
        "(1) Tối ưu hóa trải nghiệm khách hàng thông qua việc rút ngắn hành trình tìm kiếm và hỗ trợ ra quyết định nhanh chóng; "
        "(2) Gia tăng doanh thu bán hàng thông qua các chiến lược bán chéo (Cross-selling) và bán hàng giá trị cao hơn (Up-selling); "
        "và (3) Khai thác giá trị từ các sản phẩm thuộc phân khúc đuôi dài (Long-tail items) - những cuốn sách có lượng quan tâm "
        "hạn chế nhưng khi được kết nối đúng độc giả sẽ mang lại tổng biên lợi nhuận khổng lồ cho doanh nghiệp."
    )
    add_body_p(doc,
        "Dựa trên nguồn dữ liệu đầu vào và cơ chế suy luận toán học, các hệ thống gợi ý phổ biến hiện nay được chia thành "
        "ba nhóm tiếp cận chính: Lọc dựa trên nội dung (Content-Based Filtering), Lọc cộng tác (Collaborative Filtering), "
        "và Hệ gợi ý lai (Hybrid Recommender System). Tuy nhiên, mọi giải pháp triển khai trong thực tế đều phải đối mặt "
        "với bốn thách thức kinh điển:", indent=0
    )
    add_bullet_p(doc,
        "Xảy ra khi một người dùng mới vừa đăng ký hoặc một cuốn sách mới vừa được nhập kho, hệ thống hoàn toàn thiếu dữ liệu "
        "đánh giá lịch sử để thực hiện suy luận cá nhân hóa.",
        bold_prefix="1. Bài toán khởi động lạnh (Cold-Start Problem): "
    )
    add_bullet_p(doc,
        "Trong một sàn thương mại điện tử với hàng chục nghìn sản phẩm và hàng triệu người dùng, mỗi khách hàng chỉ có thể "
        "đọc và đánh giá một tỷ lệ cực nhỏ (< 0.1%) tổng số sản phẩm, khiến ma trận người dùng - sản phẩm bị trống hầu hết các ô.",
        bold_prefix="2. Sự thưa thớt của dữ liệu (Data Sparsity): "
    )
    add_bullet_p(doc,
        "Các thuật toán phải có khả năng tính toán và trả về kết quả gợi ý trong khoảng thời gian vài chục đến vài trăm mili-giây "
        "ngay cả khi quy mô danh mục sản phẩm và lượng người dùng truy cập đồng thời tăng trưởng theo hàm số mũ.",
        bold_prefix="3. Khả năng mở rộng quy mô (Scalability): "
    )
    add_bullet_p(doc,
        "Xu hướng thuật toán chỉ thiên lệch đề xuất các tác phẩm kinh điển bán chạy nhất (như Harry Potter, Đắc Nhân Tâm) "
        "bất kể người dùng đang tìm kiếm chủ đề gì, làm triệt tiêu tính bất ngờ và sự phong phú của hệ thống gợi ý.",
        bold_prefix="4. Sự thiên lệch về độ phổ biến (Popularity Bias): "
    )

    # 2.2 Content-Based Filtering
    add_heading_2(doc, "2.2. Content-Based Filtering – Lọc theo nội dung")
    add_body_p(doc,
        "Lọc theo nội dung (Content-Based Filtering - CB) là phương pháp đề xuất các sản phẩm có thuộc tính, đặc trưng "
        "tương tự với những sản phẩm mà người dùng đã từng yêu thích hoặc tương tác tích cực trong quá khứ. "
        "Nguyên lý cốt lõi của phương pháp này dựa trên giả định: 'Nếu độc giả yêu thích cuốn sách A, họ nhiều khả năng "
        "sẽ yêu thích cuốn sách B nếu B có nội dung, phong cách hoặc chủ đề tương đồng với A'."
    )
    add_body_p(doc,
        "Trong các hệ thống truyền thống, việc biểu diễn đặc trưng văn bản của sách (tiêu đề, tóm tắt nội dung, thể loại) "
        "thường dựa trên mô hình không gian vector Bag-of-Words kết hợp với trọng số TF-IDF (Term Frequency - Inverse Document Frequency). "
        "Tuy nhiên, hạn chế lớn nhất của kỹ thuật TF-IDF là chỉ so khớp máy móc các từ khóa rời rạc, không có khả năng nhận thức "
        "được ngữ cảnh, từ đồng nghĩa hoặc ngữ nghĩa ẩn sâu (Semantic Meaning). Chẳng hạn, một cuốn sách nói về 'chiến tranh vũ trụ' "
        "và một cuốn sách về 'du hành thiên hà' có thể không chứa chung nhiều từ khóa nhưng bản chất cùng thuộc thể loại khoa học viễn tưởng."
    )
    add_body_p(doc,
        "Để vượt qua rào cản ngữ nghĩa này, đề tài đã ứng dụng bước đột phá mới nhất của ngành Xử lý ngôn ngữ tự nhiên (NLP): "
        "Vector Embeddings từ mô hình ngôn ngữ lớn Google Gemini. Toàn bộ thông tin mô tả chi tiết, cốt truyện và thể loại "
        "của mỗi cuốn sách được mô hình AI chuyển đổi thành một vector toán học gồm 768 chiều thực. Trong không gian 768 chiều này, "
        "các cuốn sách có nội dung và tư tưởng tương đồng sẽ tự động được định vị nằm gần nhau về mặt hình học."
    )
    add_body_p(doc, "Để đo lường khoảng cách giữa hai cuốn sách A và B được biểu diễn bởi hai vector nhúng u và v, độ đo Cosine Similarity được áp dụng theo công thức toán học sau:", indent=0)
    
    add_formula_p(doc, "Cosine Similarity(u, v) = (u · v) / (||u|| * ||v||) = [ ∑(u_i * v_i) ] / [ √(∑ u_i²) * √(∑ v_i²) ]", "2.1")
    
    add_body_p(doc,
        "Trong đó, u · v là tích vô hướng của hai vector, ||u|| và ||v|| là chuẩn Euclidean tương ứng. Giá trị của Cosine Similarity "
        "nằm trong đoạn [-1, 1], trong đó giá trị tiến gần tới 1 phản ánh mức độ tương đồng ngữ nghĩa cực kỳ cao giữa hai cuốn sách. "
        "Nhằm đảm bảo hiệu năng tính toán thời gian thực khi so sánh giữa 10.000 vector 768 chiều, hệ thống tích hợp trực tiếp tiện ích "
        "mở rộng pgvector trên PostgreSQL, sử dụng toán tử khoảng cách cosine <=> kết hợp chỉ mục phân cấp HNSW (Hierarchical "
        "Navigable Small World) để đạt thời gian phản hồi chỉ dưới 15 mili-giây."
    )

    # 2.3 Collaborative Filtering
    add_heading_2(doc, "2.3. Collaborative Filtering – Lọc cộng tác")
    add_body_p(doc,
        "Lọc cộng tác (Collaborative Filtering - CF) là phương pháp gợi ý không dựa vào việc phân tích nội dung sản phẩm, "
        "mà khai thác mối quan hệ tương quan trong hành vi của cộng đồng người dùng. Phương pháp này vận hành theo triết lý: "
        "'Trí tuệ của số đông (Wisdom of the Crowd)' - nếu hai người dùng có lịch sử đánh giá giống nhau đối với nhiều cuốn sách, "
        "thì ý kiến đánh giá của người này đối với một cuốn sách mới sẽ là cơ sở tham khảo đáng tin cậy cho người kia."
    )
    add_body_p(doc,
        "Lọc cộng tác được phân làm hai trường phái chính: User-based CF (gợi ý dựa trên sự tương đồng giữa các người dùng) "
        "và Item-based CF (gợi ý dựa trên sự tương đồng giữa các sản phẩm thông qua hành vi người dùng). "
        "Trong lịch sử thương mại điện tử, thuật toán Item-to-Item Collaborative Filtering do nhóm kỹ sư Greg Linden, Brent Smith "
        "và Jeremy York phát minh tại Amazon (công bố trên tạp chí danh giá IEEE Internet Computing năm 2003) đã tạo nên một cuộc cách mạng. "
        "Trong các hệ thống TMĐT bán sách, số lượng độc giả thường biến động liên tục và lớn hơn rất nhiều so với số lượng đầu sách, "
        "do đó cách tiếp cận Item-to-Item CF được ưu tiên áp dụng rộng rãi bởi tính ổn định cao và khả năng tiền tính toán ma trận tương đồng hiệu quả."
    )
    add_body_p(doc,
        "Tuy nhiên, nếu chỉ tính toán số lượt người dùng cùng đánh giá cao cả hai cuốn sách (Co-occurrence count), hệ thống sẽ gặp phải "
        "hiện tượng Popularity Bias nghiêm trọng: những tựa sách 'bom tấn' có hàng trăm nghìn lượt đánh giá sẽ luôn xuất hiện trong "
        "danh sách gợi ý của bất kỳ cuốn sách nào. Để triệt tiêu hoàn toàn sự thiên lệch này, đồ án áp dụng hệ số chuẩn hóa Ochiai "
        "(Ochiai Coefficient) - một biến thể chuẩn mực của Cosine Similarity trên lý thuyết tập hợp:", indent=0
    )
    
    add_formula_p(doc, "Ochiai(A, B) = |U_A ∩ U_B| / √( |U_A| * |U_B| )", "2.2")
    
    add_body_p(doc,
        "Trong đó: U_A là tập hợp các độc giả đánh giá sách A đạt từ 4 sao trở lên (rating >= 4); U_B là tập hợp độc giả đánh giá "
        "sách B đạt từ 4 sao trở lên; và |U_A ∩ U_B| là số lượng độc giả cùng đánh giá cao cả hai tác phẩm. Bằng việc chia cho căn bậc hai "
        "của tích tổng số lượt đánh giá, công thức Ochiai phạt nặng các sản phẩm quá phổ biến và chỉ tưởng thưởng cho những cặp sách "
        "có mối tương quan đồng thuận thực sự mật thiết từ cộng đồng độc giả chân chính."
    )

    # 2.4 Hybrid Recommender
    add_heading_2(doc, "2.4. Hybrid Recommender – Gợi ý lai")
    add_body_p(doc,
        "Mỗi mô hình gợi ý đơn lẻ đều sở hữu những ưu điểm vượt trội đi kèm những điểm yếu nội tại không thể tránh khỏi "
        "(được tóm lược trong Bảng 2.1). Lọc theo nội dung (CB) giải quyết xuất sắc các sản phẩm mới chưa có lượt tương tác "
        "nhưng có xu hướng đề xuất quá an toàn (hiện tượng 'bong bóng bộ lọc' - Filter Bubble). Ngược lại, Lọc cộng tác (CF) "
        "mang lại tính bất ngờ thú vị (Serendipity) dựa trên hành vi cộng đồng nhưng lại hoàn toàn bất lực trước các sản phẩm mới "
        "hoặc người dùng mới (Cold-Start)."
    )
    
    # Table 2.1
    add_table(doc,
        ["Thuật toán", "Ưu điểm nổi bật", "Hạn chế cốt lõi"],
        [
            ["Content-Based (CB)", "Không phụ thuộc người dùng khác; gợi ý tốt cho sản phẩm mới; minh bạch theo nội dung.", "Dễ gây nhàm chán (Filter Bubble); phụ thuộc chất lượng trích xuất text; không nhận biết độ hay/dở."],
            ["Collaborative (CF)", "Tạo tính bất ngờ thú vị; không cần phân tích nội dung; chất lượng gợi ý tăng theo quy mô người dùng.", "Chịu tác động nặng nề từ Cold-Start; ma trận đánh giá thưa thớt (Sparsity); thiên lệch độ phổ biến."],
            ["Hybrid Recommender", "Kết hợp ưu điểm của cả hai; bù trừ nhược điểm; nâng cao độ phủ và độ chính xác tổng thể.", "Độ phức tạp kiến trúc cao hơn; cần cân chỉnh tham số trọng số tối ưu."]
        ],
        caption_text="Bảng 2.1: So sánh ưu điểm và hạn chế giữa Content-Based và Collaborative Filtering",
        col_widths=[1.5, 2.5, 2.5]
    )
    
    add_body_p(doc,
        "Do đó, đồ án đã triển khai Hệ gợi ý lai (Hybrid Recommender) theo kỹ thuật Rank-based Scoring kết hợp phương pháp "
        "Borda Count Fusion. Thay vì cộng trực tiếp các điểm số khoảng cách cosine và hệ số Ochiai vốn có miền giá trị và phân phối "
        "khác nhau, thuật toán quy đổi vị trí xếp hạng (Rank) của sản phẩm trong từng mô hình thành điểm số tương đối:", indent=0
    )
    
    add_formula_p(doc, "Score_Hybrid(book) = [ (N - rank_CB(book)) * α ] + [ (N - rank_CF(book)) * (1 - α) ]", "2.3")
    
    add_body_p(doc,
        "Trong đó: N là số lượng ứng viên top đầu được lấy ra từ mỗi mô hình (trong đề tài thiết lập N = 10); rank_CB và rank_CF "
        "là vị trí xếp hạng của cuốn sách (đánh chỉ số từ 0 đến N-1); và α ∈ [0, 1] là hệ số điều chỉnh trọng số (mặc định α = 0.5 "
        "nhằm đảm bảo sự cân bằng 50/50 giữa ngữ nghĩa AI và trí tuệ đám đông). Bảng 2.2 minh họa cơ chế tổng hợp điểm số này."
    )
    
    # Table 2.2
    add_table(doc,
        ["Tựa sách", "Rank CB", "Điểm CB (w=0.5)", "Rank CF", "Điểm CF (w=0.5)", "Tổng điểm Hybrid", "Thứ tự cuối"],
        [
            ["Sách A (Phần tiếp theo)", "#1 (idx 0)", "(10 - 0) * 0.5 = 5.0", "#3 (idx 2)", "(10 - 2) * 0.5 = 4.0", "9.0", "Hạng 2"],
            ["Sách B (Tác phẩm đột phá)", "#2 (idx 1)", "(10 - 1) * 0.5 = 4.5", "#1 (idx 0)", "(10 - 0) * 0.5 = 5.0", "9.5", "Hạng 1 ✨"],
            ["Sách C (Chỉ tương đồng text)", "#3 (idx 2)", "(10 - 2) * 0.5 = 4.0", "Không có", "0.0", "4.0", "Hạng 4"],
            ["Sách D (Cùng tác giả)", "#4 (idx 3)", "(10 - 3) * 0.5 = 3.5", "#2 (idx 1)", "(10 - 1) * 0.5 = 4.5", "8.0", "Hạng 3"]
        ],
        caption_text="Bảng 2.2: Minh họa ma trận chấm điểm thuật toán Hybrid Borda Count Fusion",
        col_widths=[1.8, 0.9, 1.2, 0.9, 1.2, 1.1, 0.9]
    )

    add_body_p(doc,
        "Cơ chế tính điểm và mức độ ưu tiên xếp hạng của thuật toán được mô phỏng trực quan thông qua ví dụ với P = 5 "
        "ứng viên đầu vào và hệ số cân bằng α = 0.5 trong Hình 2.4 dưới đây:"
    )
    
    # Figure 2.4: Borda Count Fusion Diagram
    img_borda = os.path.join("Final Report", "So_do_Borda_Count_Fusion.png")
    add_figure(doc, img_borda, "Hình 2.4: Sơ đồ tổng hợp điểm xếp hạng theo thuật toán Hybrid Borda Count Fusion", width_inches=6.0)

    # 2.5 Xếp hạng phổ biến và bài toán người dùng mới
    add_heading_2(doc, "2.5. Xếp hạng phổ biến và bài toán người dùng mới (Cold-Start Problem)")
    add_body_p(doc,
        "Khi một khách hàng mới lần đầu tiên đặt chân đến website The Inkwell, hệ thống chưa từng ghi nhận bất kỳ lượt click, "
        "lượt xem hay đánh giá sao nào của người đó. Trong tình huống này, cả mô hình cá nhân hóa lẫn lọc cộng tác đều không thể "
        "kích hoạt. Giải pháp tối ưu và thực tế nhất được các sàn thương mại điện tử lớn áp dụng là điều hướng người dùng "
        "đến danh sách các tác phẩm thịnh hành, uy tín nhất toàn sàn (Trending / Popular Books)."
    )
    add_body_p(doc,
        "Tuy nhiên, nếu chỉ đơn giản tính điểm trung bình số học (Arithmetic Mean) của các lượt đánh giá, hệ thống sẽ gặp phải "
        "sai số nghiêm trọng: một cuốn sách ít người biết chỉ có đúng 1 lượt đánh giá 5.0 sao sẽ lập tức vượt mặt một tác phẩm kinh điển "
        "có hàng trăm nghìn lượt đánh giá với điểm trung bình 4.5 sao. Để tạo ra bảng xếp hạng công bằng và khách quan nhất, "
        "đồ án đã ứng dụng mô hình trung bình có trọng số Bayesian Average (công thức xếp hạng Weighted Rating của IMDB):", indent=0
    )
    
    add_formula_p(doc, "WR = [ v / (v + m) ] * R + [ m / (v + m) ] * C", "2.4")
    
    add_body_p(doc,
        "Trong đó: R là điểm đánh giá trung bình thực tế của cuốn sách; v là tổng số lượt đánh giá mà cuốn sách đó nhận được; "
        "C là điểm đánh giá trung bình của toàn bộ các cuốn sách trong hệ thống; và m là ngưỡng số lượt đánh giá tối thiểu "
        "cần thiết để được đưa vào danh sách xếp hạng ưu tiên (được hệ thống xác định dựa trên phân vị của tập dữ liệu). "
        "Công thức Bayesian đóng vai trò như một lực kéo đàn hồi: với những cuốn sách có ít lượt đánh giá (v nhỏ), điểm số WR "
        "sẽ bị kéo mạnh về điểm trung bình C của toàn sàn; chỉ khi một tác phẩm tích lũy được lượng đánh giá áp đảo (v lớn), "
        "điểm số thực tế R của nó mới phát huy toàn bộ trọng số."
    )

    # 2.6 Cá nhân hoá theo hồ sơ người dùng
    add_heading_2(doc, "2.6. Cá nhân hoá theo hồ sơ người dùng (User Profiling)")
    add_body_p(doc,
        "Để tiến tới cấp độ cá nhân hóa thực sự (True Personalization) - nơi mỗi người dùng sở hữu một trang chủ riêng biệt, "
        "hệ thống phải liên tục xây dựng và làm giàu Hồ sơ người dùng (User Profile) từ cả hai nguồn dữ liệu:"
    )
    add_bullet_p(doc,
        "Các đánh giá sao tường minh từ 4 đến 5 sao do chính người dùng chấm điểm trong quá khứ.",
        bold_prefix="1. Phản hồi tường minh (Explicit Feedback): "
    )
    add_bullet_p(doc,
        "Các hành vi duyệt web tự nhiên được ghi nhận ngầm theo thời gian thực: xem chi tiết sách (view - trọng số 1), "
        "thêm vào danh sách yêu thích (wishlist - trọng số 3), thêm vào giỏ hàng (add_to_cart - trọng số 4), "
        "và hoàn tất đơn mua sách (purchase - trọng số 5).",
        bold_prefix="2. Phản hồi ngầm (Implicit Feedback): "
    )
    add_body_p(doc,
        "Từ tập hợp các tác phẩm 'hạt giống' (Seeds) này, hệ thống áp dụng kỹ thuật tính Trọng tâm Vector (Centroid Vector) "
        "trong không gian nhúng 768 chiều. Vector trọng tâm P_u của người dùng u được tính bằng trung bình có trọng số của các vector "
        "sách e_i mà người dùng đã tương tác:", indent=0
    )
    
    add_formula_p(doc, "P_u = [ ∑ (w_i * e_i) ] / [ ∑ w_i ]", "2.5")
    
    add_body_p(doc,
        "Vector hồ sơ P_u sau đó được dùng làm truy vấn tìm kiếm các cuốn sách chưa từng đọc có khoảng cách cosine gần nhất, "
        "kết hợp với việc tổng hợp danh sách gợi ý cộng tác từ từng hạt giống để sinh ra phân khu đề xuất 'Just For You' "
        "đầy cuốn hút trên trang chủ."
    )

    # 2.7 Giải thích gợi ý và mô hình ngôn ngữ lớn
    add_heading_2(doc, "2.7. Giải thích gợi ý và mô hình ngôn ngữ lớn (Explainable AI & LLM)")
    add_body_p(doc,
        "Một trong những rào cản tâm lý lớn nhất khiến người dùng ngần ngại trước các đề xuất tự động của AI là hiện tượng 'Hộp đen' "
        "(Black-box Problem). Khi hệ thống gợi ý một cuốn sách mà không cung cấp ngữ cảnh, người dùng có xu hướng hoài nghi rằng "
        "đây là quảng cáo tài trợ hơn là một lời khuyên chân thành. Nghiên cứu của Tintarev & Masthoff (2012) chỉ ra rằng việc bổ sung "
        "lời giải thích minh bạch giúp gia tăng độ tin cậy của hệ thống lên hơn 40% và thúc đẩy tỷ lệ chuyển đổi mua hàng rõ rệt."
    )
    add_body_p(doc,
        "Trong đồ án The Inkwell, tác giả đã tích hợp mô hình ngôn ngữ lớn Google Gemini 2.5 Flash thông qua REST API để đóng vai "
        "'Cố vấn văn học Mercy AI'. Thay vì sinh văn bản ngẫu nhiên, hệ thống áp dụng kỹ thuật Kỹ nghệ câu lệnh có cấu trúc "
        "(Structured Prompt Engineering) gồm 4 thành phần thiết yếu:", indent=0
    )
    add_bullet_p(doc,
        "Xác lập nhân cách học thuật, uyên bác nhưng gần gũi, sử dụng văn phong Dark Academia đậm chất văn chương cổ điển.",
        bold_prefix="• [SYSTEM ROLE]: "
    )
    add_bullet_p(doc,
        "Nạp dữ liệu thực tế trích xuất từ cơ sở dữ liệu (tựa sách, tác giả, cốt truyện, thể loại, phong cách).",
        bold_prefix="• [CONTEXT]: "
    )
    add_bullet_p(doc,
        "Yêu cầu AI phân tích điểm sáng giá nhất của tác phẩm, khơi gợi cảm xúc tò mò và giải thích ngắn gọn vì sao tác phẩm này đáng đọc.",
        bold_prefix="• [TASK]: "
    )
    add_bullet_p(doc,
        "Giới hạn độ dài từ 4 đến 5 câu, tuyệt đối không tiết lộ nội dung cốt truyện (no spoiler), trả lời bằng tiếng Việt chuẩn mực.",
        bold_prefix="• [CONSTRAINTS]: "
    )

    # 2.8 Các độ đo đánh giá
    add_heading_2(doc, "2.8. Các độ đo đánh giá hệ thống gợi ý")
    add_body_p(doc,
        "Để đánh giá hiệu quả của các giải thuật gợi ý một cách khoa học và khách quan, đồ án áp dụng bộ chỉ số đo lường "
        "tiêu chuẩn trong lĩnh vực Khai phá dữ liệu và Truy hồi thông tin (Information Retrieval):"
    )
    add_bullet_p(doc,
        "Tỷ lệ giữa số lượng sách gợi ý thực sự phù hợp (Relevance) trên tổng số K cuốn sách được đề xuất:",
        bold_prefix="1. Precision tại vị trí K (Precision@K): "
    )
    add_formula_p(doc, "Precision@K = | {Sách gợi ý thuộc Top K} ∩ {Sách người dùng thích} | / K", "2.6")
    
    add_bullet_p(doc,
        "Tỷ lệ giữa số lượng sách gợi ý phù hợp được tìm thấy trên tổng số tất cả các sách mà người dùng thực sự yêu thích:",
        bold_prefix="2. Recall tại vị trí K (Recall@K): "
    )
    add_formula_p(doc, "Recall@K = | {Sách gợi ý thuộc Top K} ∩ {Sách người dùng thích} | / |{Tất cả sách người dùng thích}|", "2.7")
    
    add_bullet_p(doc,
        "Trung bình điều hòa giữa Precision@K và Recall@K, phản ánh sự cân bằng tổng thể giữa độ chính xác và độ bao phủ:",
        bold_prefix="3. Điểm F1-Score@K: "
    )
    add_formula_p(doc, "F1@K = 2 * [ (Precision@K * Recall@K) / (Precision@K + Recall@K) ]", "2.8")
    
    add_bullet_p(doc,
        "Thời gian từ lúc máy khách (Client) gửi yêu cầu HTTP đến khi nhận được đầy đủ gói dữ liệu JSON phản hồi (tính bằng mili-giây ms), "
        "chỉ số quyết định độ mượt mà của trải nghiệm người dùng thực tế.",
        bold_prefix="4. Thời gian phản hồi hệ thống (Latency): "
    )
    print("Chapter 2 completed.")

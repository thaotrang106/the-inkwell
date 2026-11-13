from helpers import (
    add_heading_1, add_heading_2, add_heading_3, add_body_p, add_bullet_p
)

def write_chapter_5(doc):
    print("Writing Chapter 5: Kết luận và hướng phát triển...")
    add_heading_1(doc, "CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN")
    
    # 5.1 Kết quả đạt được
    add_heading_2(doc, "5.1. Kết quả đạt được")
    add_body_p(doc,
        "Trải qua 10 tuần nghiên cứu nghiêm túc và triển khai thực nghiệm không ngừng nghỉ, đề tài “Ứng dụng trí tuệ nhân tạo (AI) "
        "trong đề xuất sản phẩm cá nhân hoá trên website thương mại điện tử bán sách The Inkwell” đã hoàn thành xuất sắc 100% "
        "các mục tiêu nghiên cứu và nhiệm vụ phát triển kỹ thuật đã đề ra ban đầu. Cụ thể, các kết quả đột phá mà đồ án "
        "đã gặt hái được bao gồm:"
    )
    add_bullet_p(doc,
        "Làm chủ và mô hình hóa toán học thành công 4 thuật toán gợi ý cốt lõi: Content-Based Filtering với Vector 768 chiều, "
        "Collaborative Filtering với hệ số chuẩn hóa Ochiai, Hybrid Recommender với thuật toán Borda Count Fusion, "
        "và Xếp hạng phổ biến Bayesian Average giải quyết triệt để bài toán Cold-Start.",
        bold_prefix="1. Về mặt thuật toán và mô hình AI: "
    )
    add_bullet_p(doc,
        "Thu thập và tiền xử lý hoàn chỉnh tập dữ liệu Goodbooks-10k Extended, tiến hành làm giàu dữ liệu bằng văn bản tóm tắt "
        "nội dung (description) và nhúng vector ngữ nghĩa cho toàn bộ 10.000 đầu sách. Đặc biệt, nhóm đã phát hiện và xử lý "
        "thành công lỗi phân phối dữ liệu bị cắt (Capped Ratings Bias), phục hồi độ chính xác tuyệt đối cho bảng xếp hạng thịnh hành.",
        bold_prefix="2. Về mặt dữ liệu và phát hiện thực nghiệm: "
    )
    add_bullet_p(doc,
        "Xây dựng thành công máy chủ backend chuyên dụng bằng FastAPI cung cấp 10 RESTful API endpoints có tài liệu tự động Swagger UI, "
        "tích hợp hệ thống lưu trữ đệm hai tầng (Two-level Caching) giúp giảm thời gian phản hồi cho các yêu cầu cá nhân hóa từ 180ms "
        "xuống chỉ còn 8ms.",
        bold_prefix="3. Về mặt kiến trúc backend và hiệu năng: "
    )
    add_bullet_p(doc,
        "Hoàn thiện ứng dụng web thương mại điện tử The Inkwell theo phong cách nghệ thuật Dark Academia độc đáo bằng Next.js 16 "
        "và React 19, cung cấp trải nghiệm mượt mà, trực quan với đầy đủ tính năng duyệt sách, tìm kiếm Autocomplete, giỏ hàng, "
        "đánh giá nhận xét và đặc biệt là cửa sổ tương tác cùng Cố vấn văn học Mercy AI.",
        bold_prefix="4. Về mặt giao diện người dùng và ứng dụng web: "
    )
    add_bullet_p(doc,
        "Xóa bỏ định kiến 'hộp đen' của AI bằng việc ứng dụng mô hình ngôn ngữ lớn Google Gemini 2.5 Flash thông qua Prompt Engineering "
        "có cấu trúc chặt chẽ, tạo ra những lời bình phẩm sách đầy cảm xúc và sức thuyết phục học thuật.",
        bold_prefix="5. Về mặt Trí tuệ nhân tạo giải thích được (Explainable AI): "
    )

    # 5.2 Đóng góp của đề tài
    add_heading_2(doc, "5.2. Đóng góp của đề tài")
    add_body_p(doc,
        "Đề tài mang lại những giá trị đóng góp ý nghĩa trên cả hai phương diện học thuật và thực tiễn đời sống:", indent=0
    )
    add_bullet_p(doc,
        "Đồ án cung cấp một nghiên cứu thực nghiệm có hệ thống về việc kết hợp giữa công nghệ Vector Database (pgvector) hiện đại "
        "với các thuật toán lọc cộng tác cổ điển. Nghiên cứu chứng minh rằng việc chuẩn hóa Ochiai đóng vai trò sống còn trong việc "
        "loại bỏ Popularity Bias, đồng thời việc kết hợp Borda Count Fusion mang lại điểm F1 vượt trội hơn 11% so với các mô hình đơn lẻ.",
        bold_prefix="• Đóng góp về mặt học thuật và phương pháp luận: "
    )
    add_bullet_p(doc,
        "The Inkwell không dừng lại ở mức độ nghiên cứu lý thuyết mà đã trở thành một giải pháp phần mềm hoàn chỉnh, sẵn sàng "
        "triển khai cho các doanh nghiệp xuất bản và nhà sách trực tuyến tại Việt Nam. Giải pháp giúp các đơn vị kinh doanh vừa và nhỏ "
        "sở hữu một hệ thống gợi ý đẳng cấp quốc tế tương đương Amazon với chi phí hạ tầng cực kỳ tối ưu.",
        bold_prefix="• Đóng góp về mặt ứng dụng thực tiễn: "
    )

    # 5.3 Hạn chế
    add_heading_2(doc, "5.3. Hạn chế")
    add_body_p(doc,
        "Mặc dù đã đạt được những kết quả rất đáng khích lệ, đề tài vẫn còn tồn tại một số điểm hạn chế do điều kiện thời gian "
        "và nguồn lực nghiên cứu có hạn:", indent=0
    )
    add_bullet_p(doc,
        "Hệ thống hiện tại mới kiểm thử trên quy mô 10.000 đầu sách và gần 1 triệu lượt đánh giá; chưa có điều kiện thử nghiệm "
        "trên quy mô hàng triệu đầu sách thương mại thực tế.",
        bold_prefix="1. Giới hạn về quy mô dữ liệu: "
    )
    add_bullet_p(doc,
        "Tính năng Cố vấn văn học Mercy AI phụ thuộc vào kết nối Internet tới Google Cloud và hạn mức sử dụng (Quota) của API bên ngoài.",
        bold_prefix="2. Sự phụ thuộc vào dịch vụ API ngoài: "
    )
    add_bullet_p(doc,
        "Chưa tích hợp cổng thanh toán trực tuyến chính thức (VNPAY, MoMo) và hệ thống quản lý kho vận giao nhận vật lý ngoài đời thực.",
        bold_prefix="3. Phạm vi nghiệp vụ thương mại: "
    )

    # 5.4 Hướng phát triển
    add_heading_2(doc, "5.4. Hướng phát triển")
    add_body_p(doc,
        "Nhằm nâng tầm và hoàn thiện hệ thống The Inkwell trong các giai đoạn nghiên cứu tiếp theo, tác giả đề xuất "
        "các định hướng phát triển chiến lược sau:"
    )
    add_bullet_p(doc,
        "Nghiên cứu và triển khai các kiến trúc mạng nơ-ron học sâu tiên tiến nhất hiện nay, tiêu biểu là mô hình Two-Tower DSSM "
        "(Deep Structured Semantic Model) của YouTube và Graph Neural Networks (LightGCN) để học biểu diễn đa chiều phi tuyến tính "
        "giữa người dùng và tác phẩm.",
        bold_prefix="1. Ứng dụng Học sâu (Deep Learning): "
    )
    add_bullet_p(doc,
        "Triển khai các mô hình ngôn ngữ lớn mã nguồn mở có trọng số mở (như Llama 3 hoặc Google Gemma) trực tiếp trên máy chủ riêng "
        "(On-premise / Private Cloud) để tự chủ hoàn toàn về công nghệ, triệt tiêu độ trễ mạng và bảo mật tuyệt đối dữ liệu người dùng.",
        bold_prefix="2. Triển khai Local LLM tự chủ: "
    )
    add_bullet_p(doc,
        "Tích hợp các nền tảng xử lý luồng dữ liệu phân tán như Apache Kafka kết hợp Redis Streams để ghi nhận và cập nhật ma trận "
        "gợi ý ngay trong từng mili-giây khi người dùng vừa thực hiện một lượt click duyệt sách.",
        bold_prefix="3. Xử lý luồng thời gian thực (Real-time Streaming): "
    )
    add_bullet_p(doc,
        "Mở rộng hệ sinh thái The Inkwell sang các ứng dụng di động bản địa (Native Mobile Apps trên iOS và Android) sử dụng React Native, "
        "tích hợp hệ thống thông báo đẩy (Push Notifications) để chủ động gợi ý sách theo lịch đọc sách hàng ngày của độc giả.",
        bold_prefix="4. Mở rộng đa nền tảng (Omnichannel & Mobile): "
    )

    # TÀI LIỆU THAM KHẢO
    add_heading_1(doc, "TÀI LIỆU THAM KHẢO")
    
    references = [
        "[1] Burke, R. (2002). Hybrid recommender systems: Survey and experiments. User Modeling and User-Adapted Interaction, 12(4), 331-370.",
        "[2] Covington, P., Adams, J., & Sargin, E. (2016). Deep neural networks for youtube recommendations. In Proceedings of the 10th ACM Conference on Recommender Systems (pp. 191-198).",
        "[3] Google AI. (2024). Gemini: A Family of Highly Capable Multimodal Models. Technical Report, Google DeepMind.",
        "[4] He, X., Liao, L., Zhang, H., Nie, L., Hu, X., & Chua, T. S. (2017). Neural collaborative filtering. In Proceedings of the 26th International Conference on World Wide Web (pp. 173-182).",
        "[5] Koren, Y., Bell, R., & Volinsky, C. (2009). Matrix factorization techniques for recommender systems. Computer, 42(8), 30-37.",
        "[6] Linden, G., Smith, B., & York, J. (2003). Amazon.com recommendations: Item-to-item collaborative filtering. IEEE Internet Computing, 7(1), 76-80.",
        "[7] PostgreSQL Global Development Group. (2024). pgvector: Open-source vector similarity search for Postgres. Documentation.",
        "[8] Resnick, P., & Varian, H. R. (1997). Recommender systems. Communications of the ACM, 40(3), 56-58.",
        "[9] Ricci, F., Rokach, L., & Shapira, B. (2015). Recommender Systems Handbook (2nd ed.). Springer US.",
        "[10] Sarwar, B., Karypis, G., Konstan, J., & Riedl, J. (2001). Item-based collaborative filtering recommendation algorithms. In Proceedings of the 10th International Conference on World Wide Web (pp. 285-295).",
        "[11] Schafer, J. B., Frankowski, D., Herlocker, J., & Sen, S. (2007). Collaborative filtering recommender systems. In The Adaptive Web (pp. 291-324). Springer, Berlin, Heidelberg.",
        "[12] Su, X., & Khoshgoftaar, T. M. (2009). A survey of collaborative filtering techniques. Advances in Artificial Intelligence, 2009, 1-19.",
        "[13] Tiangolo, S. (2024). FastAPI: Modern, fast (high-performance), web framework for building APIs with Python. Documentation.",
        "[14] Tintarev, N., & Masthoff, J. (2012). Evaluating the effectiveness of explanations for recommender systems. User Modeling and User-Adapted Interaction, 22(4), 399-439.",
        "[15] Vercel Inc. (2024). Next.js Documentation: The React Framework for the Web. Official Technical Guide.",
        "[16] Zając, Z. (2017). Goodbooks-10k: A new dataset for book recommendation. FastML Research Publication."
    ]
    
    for ref in references:
        add_body_p(doc, ref, indent=0)
        
    print("Chapter 5 and References completed.")

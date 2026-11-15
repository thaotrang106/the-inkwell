import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.text.paragraph import Paragraph
from helpers import add_heading_1, add_heading_2, add_heading_3, add_body_p, add_bullet_p, set_font

def insert_p_after(anchor_p):
    new_p_elem = OxmlElement('w:p')
    anchor_p._element.addnext(new_p_elem)
    return Paragraph(new_p_elem, anchor_p._parent)

def update_front_matter(doc):
    print("Updating Front Matter...")
    body = doc._body._element
    
    # 1. Update Title typos on cover pages
    for idx in [20, 45]:
        if idx < len(doc.paragraphs):
            p = doc.paragraphs[idx]
            if "THE INWELL" in p.text:
                p.text = p.text.replace("THE INWELL", "THE INKWELL")
                for r in p.runs:
                    set_font(r, size_pt=14, bold=True, color=(0, 32, 96))
                print(f"Fixed typo in paragraph {idx}")

    # 2. Update Lời cam đoan (paragraph 62)
    if 62 < len(doc.paragraphs):
        p_camdoan = doc.paragraphs[62]
        p_camdoan.text = (
            "Em tên là Ngô Thảo Trang, mã số sinh viên 030239230260, sinh viên thuộc lớp học phần ITS703_261_1_D01, "
            "khoa Hệ thống Thông tin Quản lý, Trường Đại học Ngân hàng Thành phố Hồ Chí Minh. "
            "Em xin cam đoan đồ án chuyên ngành với đề tài “ỨNG DỤNG TRÍ TUỆ NHÂN TẠO (AI) TRONG ĐỀ XUẤT SẢN PHẨM CÁ NHÂN HOÁ "
            "TRÊN WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN SÁCH THE INKWELL” là công trình nghiên cứu và thực nghiệm độc lập của bản thân em "
            "trong suốt thời gian qua, dưới sự hướng dẫn khoa học tận tình của NCS.ThS Trần Việt Tâm.\n\n"
            "Các số liệu thống kê, mô hình toán học, cấu trúc cơ sở dữ liệu và mã nguồn chương trình được trình bày trong đồ án này "
            "hoàn toàn xuất phát từ quá trình nghiên cứu thực tế và triển khai hệ thống của chính em, không sao chép nguyên bản từ "
            "bất kỳ công trình nào khác chưa được công bố. Mọi tài liệu tham khảo, trích dẫn học thuật, thư viện mã nguồn mở và "
            "tập dữ liệu nghiên cứu đều đã được trích dẫn nguồn gốc rõ ràng, minh bạch theo đúng quy chuẩn học thuật quốc tế. "
            "Em xin hoàn toàn chịu trách nhiệm trước Hội đồng Đánh giá Đồ án, Ban Chủ nhiệm Khoa Hệ thống Thông tin Quản lý "
            "và Trường Đại học Ngân hàng TP. Hồ Chí Minh nếu có bất kỳ sự vi phạm nào về tính liêm chính học thuật."
        )
        p_camdoan.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_camdoan.paragraph_format.line_spacing = 1.3
        p_camdoan.paragraph_format.first_line_indent = Inches(0.5)
        for r in p_camdoan.runs:
            set_font(r, size_pt=13, bold=False)
        print("Updated Lời cam đoan successfully.")

    # 3. Update Table 2 (Danh mục từ viết tắt)
    if len(doc.tables) >= 3:
        t_abbr = doc.tables[2]
        abbr_data = [
            ("1", "AI", "Artificial Intelligence", "Trí tuệ nhân tạo"),
            ("2", "API", "Application Programming Interface", "Giao diện lập trình ứng dụng"),
            ("3", "CB", "Content-Based Filtering", "Lọc dựa trên nội dung"),
            ("4", "CF", "Collaborative Filtering", "Lọc cộng tác"),
            ("5", "CORS", "Cross-Origin Resource Sharing", "Chia sẻ tài nguyên giữa các nguồn khác nhau"),
            ("6", "ERD", "Entity Relationship Diagram", "Sơ đồ thực thể liên kết"),
            ("7", "LLM", "Large Language Model", "Mô hình ngôn ngữ lớn"),
            ("8", "NDCG", "Normalized Discounted Cumulative Gain", "Độ đo chuẩn hóa tăng ích tích lũy có chiết khấu"),
            ("9", "ORM", "Object-Relational Mapping", "Ánh xạ đối tượng - quan hệ"),
            ("10", "REST", "Representational State Transfer", "Kiểu kiến trúc truyền tải trạng thái đại diện"),
            ("11", "TMĐT", "Thương mại điện tử", "Thương mại điện tử"),
            ("12", "UML", "Unified Modeling Language", "Ngôn ngữ mô hình hóa thống nhất"),
            ("13", "XAI", "Explainable Artificial Intelligence", "Trí tuệ nhân tạo có thể giải thích"),
            ("14", "IDF", "Inverse Document Frequency", "Tần số nghịch đảo văn bản"),
            ("15", "HNSW", "Hierarchical Navigable Small World", "Đồ thị thế giới nhỏ phân cấp định tuyến vector"),
            ("16", "ALS", "Alternating Least Squares", "Thuật toán bình phương tối thiểu xen kẽ"),
            ("17", "TTL", "Time To Live", "Thời gian sống của bản ghi trong bộ nhớ đệm"),
            ("18", "MAP", "Mean Average Precision", "Độ chính xác trung bình chuẩn hóa"),
        ]
        
        while len(t_abbr.rows) - 1 < len(abbr_data):
            t_abbr.add_row()
            
        for idx, (stt, ab, en, vi) in enumerate(abbr_data):
            row = t_abbr.rows[idx + 1]
            vals = [stt, ab, en, vi]
            for c_idx, val in enumerate(vals):
                cell = row.cells[c_idx]
                cell.text = val
                p = cell.paragraphs[0]
                if c_idx in [0, 1]:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                for r in p.runs:
                    set_font(r, size_pt=11, bold=(c_idx == 1))
        print("Updated Danh mục từ viết tắt successfully.")

    # 4. Update Danh mục hình ảnh
    idx_fig = [i for i, c in enumerate(body) if c.tag.endswith('p') and ''.join(c.itertext()).strip().upper().startswith('DANH MỤC HÌNH')][0]
    idx_tbl = [i for i, c in enumerate(body) if c.tag.endswith('p') and ''.join(c.itertext()).strip().upper().startswith('DANH MỤC BẢNG')][0]
    p_page_break = body[idx_tbl - 1]

    # Remove old placeholder figure paragraphs strictly between idx_fig and p_page_break
    to_remove_fig = [body[i] for i in range(idx_fig + 1, list(body).index(p_page_break))]
    for c in to_remove_fig:
        body.remove(c)

    figures_list = [
        ("Hình 2.1", "Sơ đồ các phương pháp gợi ý và kỹ thuật lõi áp dụng trong hệ thống The Inkwell"),
        ("Hình 2.4", "Sơ đồ tổng hợp điểm xếp hạng theo thuật toán Hybrid Borda Count Fusion"),
        ("Hình 3.1", "Kiến trúc tổng thể 3 tầng và các luồng xử lý AI của hệ sinh thái The Inkwell"),
        ("Hình 3.2", "Sơ đồ Use Case tổng thể toàn hệ thống The Inkwell"),
        ("Hình 3.4", "Sơ đồ thực thể liên kết (ERD) chi tiết cơ sở dữ liệu The Inkwell"),
        ("Hình 3.5", "Sơ đồ tuần tự xử lý luồng gợi ý cá nhân hóa For-You"),
        ("Hình 4.1", "Tài liệu Swagger UI của backend liệt kê đầy đủ 16 RESTful API endpoints"),
        ("Hình 4.2", "Trang chủ: hàng 'Dành cho bạn' của người dùng A và danh sách sách phổ biến"),
        ("Hình 4.3", "Trang chi tiết sách: sách tương tự, người khác cũng thích, và lời giải thích của Mercy"),
        ("Hình 4.4", "Trang chủ khi đổi sang người dùng B: hàng 'Dành cho bạn' thay đổi"),
        ("Hình 4.5", "Trang Algorithm Lab so sánh ba thuật toán cạnh nhau"),
    ]

    curr_p = Paragraph(body[idx_fig], doc)
    for f_label, f_title in figures_list:
        p_new = insert_p_after(curr_p)
        p_new.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_new.paragraph_format.line_spacing = 1.3
        p_new.paragraph_format.space_after = Pt(3)
        p_new.paragraph_format.first_line_indent = Inches(0)
        r_lbl = p_new.add_run(f"{f_label}: ")
        set_font(r_lbl, size_pt=12, bold=True)
        r_tit = p_new.add_run(f_title)
        set_font(r_tit, size_pt=12, bold=False)
        curr_p = p_new
    print("Updated Danh mục hình ảnh successfully.")

    # 5. Update Danh mục bảng biểu
    idx_tbl = [i for i, c in enumerate(body) if c.tag.endswith('p') and ''.join(c.itertext()).strip().upper().startswith('DANH MỤC BẢNG')][0]
    idx_sect3 = [i for i in range(idx_tbl + 1, len(body)) if list(body[i].iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sectPr'))][0]
    p_sect3 = body[idx_sect3]

    # Remove old table entries strictly between idx_tbl and p_sect3
    to_remove_tbl = [body[i] for i in range(idx_tbl + 1, list(body).index(p_sect3))]
    for c in to_remove_tbl:
        body.remove(c)

    tables_list = [
        ("Bảng 2.1", "So sánh ưu điểm và hạn chế giữa Content-Based và Collaborative Filtering"),
        ("Bảng 2.2", "Minh họa ma trận chấm điểm thuật toán Hybrid Borda Count Fusion"),
        ("Bảng 3.1", "Danh mục tác nhân và vai trò trong hệ thống The Inkwell"),
        ("Bảng 3.2", "Danh mục yêu cầu chức năng của hệ thống The Inkwell"),
        ("Bảng 3.3", "Danh mục yêu cầu phi chức năng của hệ thống The Inkwell"),
        ("Bảng 3.4", "Đặc tả Use Case chi tiết: Xem đề xuất sách cá nhân hóa theo người dùng"),
        ("Bảng 3.5", "Đặc tả Use Case chi tiết: Xem lời bình Cố vấn văn học Mercy AI"),
        ("Bảng 3.6", "Cấu trúc bảng books và đặc tính trường vector 768 chiều"),
        ("Bảng 3.7", "Tổng hợp vai trò các bảng dữ liệu bổ trợ trong hệ sinh thái"),
        ("Bảng 3.8", "Danh mục đặc tả các RESTful API Endpoints của hệ thống The Inkwell"),
        ("Bảng 4.1", "Thống kê chi tiết tập dữ liệu Goodbooks-10k Extended sau tiền xử lý"),
        ("Bảng 4.2", "So sánh top 5 sách phổ biến trước và sau khi xử lý hiện tượng Capped Ratings"),
        ("Bảng 4.3", "Danh mục tổng hợp 16 RESTful API Endpoints của hệ thống The Inkwell"),
        ("Bảng 4.4", "Đánh giá định lượng Precision@K và Recall@K trên tập dữ liệu thử nghiệm"),
        ("Bảng 4.5", "Thời gian phản hồi trung bình (Response Latency) của các API Endpoints"),
    ]

    curr_p = Paragraph(body[idx_tbl], doc)
    for t_label, t_title in tables_list:
        p_new = insert_p_after(curr_p)
        p_new.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_new.paragraph_format.line_spacing = 1.3
        p_new.paragraph_format.space_after = Pt(3)
        p_new.paragraph_format.first_line_indent = Inches(0)
        r_lbl = p_new.add_run(f"{t_label}: ")
        set_font(r_lbl, size_pt=12, bold=True)
        r_tit = p_new.add_run(t_title)
        set_font(r_tit, size_pt=12, bold=False)
        curr_p = p_new
    print("Updated Danh mục bảng biểu successfully.")
    
    return p_sect3

def write_loi_mo_dau(doc):
    add_heading_1(doc, "LỜI MỞ ĐẦU")
    
    add_body_p(doc, 
        "Nhìn lại lịch sử ba thập kỷ hình thành và phát triển của thương mại điện tử (TMĐT) toàn cầu, "
        "cột mốc năm 1994 khi Jeff Bezos thành lập Amazon trong một ga-ra nhỏ tại Seattle đã mở ra một kỷ nguyên mới. "
        "Ít ai có thể ngờ rằng tập đoàn công nghệ nghìn tỷ đô la ngày nay lại khởi đầu hoàn toàn từ một hiệu sách trực tuyến "
        "với khẩu hiệu 'Hiệu sách lớn nhất Trái Đất' (Earth's Biggest Bookstore). Sự lựa chọn mặt hàng sách của Amazon "
        "thời điểm đó không phải là một quyết định ngẫu nhiên, mà là một bước đi chiến lược mang tính toán học sâu sắc: "
        "Sách là ngành hàng duy nhất sở hữu hàng triệu đầu mục sản phẩm độc lập được mã hóa chuẩn hóa quốc tế (ISBN), "
        "kích thước vật lý đồng nhất dễ đóng gói vận chuyển, và quan trọng hơn hết, không một hiệu sách truyền thống nào ngoài đời thực "
        "đủ diện tích để trưng bày hàng triệu tựa sách cùng lúc. Chính mảnh đất màu mỡ của ngành sách đã thai nghén nên phát minh "
        "vĩ đại nhất của công nghệ cá nhân hóa: thuật toán Lọc cộng tác giữa các sản phẩm (Item-to-Item Collaborative Filtering) "
        "được Amazon tiên phong phát triển từ năm 1998, đóng góp trực tiếp tới hơn 35% tổng doanh số toàn cầu."
    )
    
    add_body_p(doc,
        "Tại Việt Nam, với tỷ lệ thâm nhập Internet vượt mức 79% và sự bùng nổ của thị trường tiêu dùng số, "
        "ngành bán lẻ sách trực tuyến cũng đang đứng trước những cơ hội và thách thức chưa từng có. "
        "Sách không đơn thuần là hàng hóa tiêu dùng nhanh (FMCG), mà là sản phẩm chứa đựng hàm lượng tri thức và giá trị cảm xúc đặc thù. "
        "Tuy nhiên, sự phong phú vô tận của các tựa sách lại dẫn tới một rào cản tâm lý nghiêm trọng: tình trạng quá tải thông tin "
        "(Information Overload) và nghịch lý lựa chọn (The Paradox of Choice). Khi đứng trước hàng chục nghìn tác phẩm, "
        "người mua thường rơi vào trạng thái bối rối, tê liệt quyết định (decision paralysis) và nhanh chóng rời bỏ nền tảng. "
        "Do đó, bài toán kết nối đúng cuốn sách đến đúng độc giả thông qua Hệ thống Gợi ý (Recommendation System) "
        "ứng dụng Trí tuệ Nhân tạo (AI) chính là chìa khóa sống còn quyết định trải nghiệm người dùng, tỷ lệ chuyển đổi "
        "và sự gắn bó dài hạn của khách hàng."
    )
    
    add_body_p(doc,
        "Xuất phát từ cảm hứng lịch sử sâu sắc từ hành trình khởi nghiệp của Amazon kết hợp với mong muốn ứng dụng các tiến bộ "
        "công nghệ đột phá vào lĩnh vực văn hóa đọc, tác giả đã lựa chọn đề tài: “Ứng dụng trí tuệ nhân tạo (AI) trong đề xuất "
        "sản phẩm cá nhân hoá trên website thương mại điện tử bán sách The Inkwell”. Đề tài không chỉ kế thừa tinh hoa của các giải thuật "
        "lọc cộng tác cổ điển mà còn nâng tầm trải nghiệm gợi ý sách trong kỷ nguyên mới bằng sự kết hợp giữa Machine Learning "
        "và Trí tuệ nhân tạo tạo sinh (Generative AI). Hệ thống ứng dụng công nghệ Vector Embedding 768 chiều từ Google Gemini "
        "và extension pgvector trên PostgreSQL để hiểu sâu ngữ nghĩa tác phẩm, áp dụng hệ số chuẩn hóa Ochiai nhằm triệt tiêu bias sách phổ biến, "
        "sử dụng xếp hạng Bayesian trung bình dẫn đường cho độc giả mới, và tích hợp mô hình ngôn ngữ lớn (LLM) đóng vai trò 'Cố vấn văn học Mercy' "
        "nhằm tạo ra những lời bình phẩm đầy thuyết phục theo phong cách Dark Academia lôi cuốn."
    )
    
    add_body_p(doc,
        "Đồ án được hiện thực hóa thành một nền tảng thương mại điện tử hoàn chỉnh, vận hành thực tế theo kiến trúc ba tầng hiện đại: "
        "Next.js 16/React 19 ở tầng giao diện, FastAPI ở tầng xử lý nghiệp vụ AI, và Supabase PostgreSQL đám mây ở tầng dữ liệu. "
        "Báo cáo này được cấu trúc thành 5 chương, ghi lại chi tiết toàn bộ hành trình nghiên cứu từ cơ sở lý thuyết, phân tích thiết kế, "
        "những phát hiện thực nghiệm quý giá trong quá trình xử lý dữ liệu cho đến kết quả kiểm thử định tính và định lượng, "
        "qua đó khẳng định tính khả thi và tiềm năng ứng dụng to lớn của giải pháp vào thực tiễn kinh doanh số."
    )

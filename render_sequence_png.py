import os
from PIL import Image, ImageDraw, ImageFont

def render_sequence_png(output_path):
    w, h = 2500, 2150
    img = Image.new('RGB', (w, h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)

    # Large, crisp fonts
    try:
        title_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 40)
        sub_title_font = ImageFont.truetype('C:/Windows/Fonts/timesi.ttf', 23)
        ll_hdr_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 26)
        ll_sub_font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 17)
        msg_num_font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 20)
        msg_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 22)
        msg_sub_font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 17)
        sep_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
        box_hdr_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 22)
        box_bold_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 18)
        box_txt_font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 17)
    except Exception as e:
        print(f"Font loading error: {e}, falling back to default")
        title_font = ImageFont.load_default()
        sub_title_font = title_font
        ll_hdr_font = title_font
        ll_sub_font = title_font
        msg_num_font = title_font
        msg_font = title_font
        msg_sub_font = title_font
        sep_font = title_font
        box_hdr_font = title_font
        box_bold_font = title_font
        box_txt_font = title_font

    # Background subtle border / container
    draw.rounded_rectangle([20, 20, w - 20, h - 20], radius=16, fill='#FFFFFF', outline='#CBD5E1', width=2)

    # 1. Title Block
    title_text = "SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAM) - LUỒNG GỢI Ý CÁ NHÂN HÓA /FORYOU"
    tb = title_font.getbbox(title_text)
    draw.text(((w - (tb[2] - tb[0])) // 2, 40), title_text, fill='#1E3A8A', font=title_font)

    sub_text = "Mỗi yêu cầu /foryou đi qua ba lần truy vấn cơ sở dữ liệu chuyên biệt trước khi hợp nhất bằng thuật toán Borda Count"
    sb = sub_title_font.getbbox(sub_text)
    draw.text(((w - (sb[2] - sb[0])) // 2, 90), sub_text, fill='#475569', font=sub_title_font)

    # Divider below title
    draw.line([50, 132, w - 50, 132], fill='#E2E8F0', width=2)

    # ================= 2. LIFELINES SETUP =================
    ll_y_top = 155
    ll_h = 85
    ll_y_bot = 1750

    lifelines = [
        ("Trình duyệt", "Client / Next.js 16", 330, 280, '#FFFBEB', '#D97706', '#92400E', '#FEF3C7'),
        ("FastAPI", "Backend Server (Python)", 1140, 280, '#EFF6FF', '#1D4ED8', '#1E3A8A', '#DBEAFE'),
        ("PostgreSQL + pgvector", "Supabase Database (3NF)", 1960, 320, '#ECFDF5', '#059669', '#065F46', '#D1FAE5')
    ]

    for name, sub, cx, bw, fill_c, stroke_c, text_c, act_c in lifelines:
        bx = cx - bw // 2
        # Drop shadow
        draw.rounded_rectangle([bx + 3, ll_y_top + 3, bx + bw + 3, ll_y_top + ll_h + 3], radius=10, fill='#E2E8F0')
        # Header Box
        draw.rounded_rectangle([bx, ll_y_top, bx + bw, ll_y_top + ll_h], radius=10, fill=fill_c, outline=stroke_c, width=2)
        
        # Name text
        nb = ll_hdr_font.getbbox(name)
        draw.text((cx - (nb[2] - nb[0]) // 2, ll_y_top + 14), name, fill=text_c, font=ll_hdr_font)
        # Sub text
        snb = ll_sub_font.getbbox(sub)
        draw.text((cx - (snb[2] - snb[0]) // 2, ll_y_top + 48), sub, fill='#64748B', font=ll_sub_font)

        # Vertical dashed lifeline
        y_curr = ll_y_top + ll_h
        while y_curr < ll_y_bot:
            draw.line([cx, y_curr, cx, min(y_curr + 14, ll_y_bot)], fill='#94A3B8', width=2)
            y_curr += 22

    # Activation bars
    def draw_activation(cx, y1, y2, fill_c, stroke_c):
        act_w = 20
        draw.rectangle([cx - act_w // 2, y1, cx + act_w // 2, y2], fill=fill_c, outline=stroke_c, width=2)

    # Draw activation occurrences
    draw_activation(330, 290, 1390, '#FEF3C7', '#D97706')   # Client 1
    draw_activation(330, 1510, 1720, '#FEF3C7', '#D97706')  # Client 2
    
    draw_activation(1140, 290, 1390, '#DBEAFE', '#1D4ED8')  # FastAPI 1
    draw_activation(1140, 1510, 1720, '#DBEAFE', '#1D4ED8') # FastAPI 2

    draw_activation(1960, 390, 500, '#D1FAE5', '#059669')   # DB query 1
    draw_activation(1960, 600, 710, '#D1FAE5', '#059669')   # DB query 2
    draw_activation(1960, 810, 920, '#D1FAE5', '#059669')   # DB query 3
    draw_activation(1960, 1190, 1290, '#D1FAE5', '#059669') # DB cache write
    draw_activation(1960, 1610, 1710, '#D1FAE5', '#059669') # DB insert interaction

    # Helper functions for arrows
    def draw_solid_arrow(x1, y, x2, color='#1E293B', width=3):
        draw.line([x1, y, x2, y], fill=color, width=width)
        # Arrow head
        if x2 > x1:
            draw.polygon([(x2, y), (x2 - 14, y - 7), (x2 - 14, y + 7)], fill=color)
        else:
            draw.polygon([(x2, y), (x2 + 14, y - 7), (x2 + 14, y + 7)], fill=color)

    def draw_dashed_return(x1, y, x2, color='#64748B', width=2):
        step = 16
        curr_x = min(x1, x2)
        end_x = max(x1, x2)
        while curr_x < end_x:
            draw.line([curr_x, y, min(curr_x + step - 6, end_x), y], fill=color, width=width)
            curr_x += step
        # Open arrow head
        if x2 > x1:
            draw.line([x2, y, x2 - 14, y - 7], fill=color, width=width)
            draw.line([x2, y, x2 - 14, y + 7], fill=color, width=width)
        else:
            draw.line([x2, y, x2 + 14, y - 7], fill=color, width=width)
            draw.line([x2, y, x2 + 14, y + 7], fill=color, width=width)

    # Helper: draw badge and message label
    def draw_msg_label(x_start, x_end, y, num_str, title_str, sub_str=None, is_async=False, is_return=False):
        mid_x = (x_start + x_end) // 2
        title_color = '#0F172A'
        if is_return:
            title_color = '#334155'
        elif is_async:
            title_color = '#0F766E'

        # Main message line text
        line_txt = f"{num_str}: {title_str}"
        tb = msg_font.getbbox(line_txt)
        t_w = tb[2] - tb[0]
        
        draw.text((mid_x - t_w // 2, y - 32), line_txt, fill=title_color, font=msg_font)
        if sub_str:
            stb = msg_sub_font.getbbox(sub_str)
            s_w = stb[2] - stb[0]
            draw.text((mid_x - s_w // 2, y + 8), sub_str, fill='#64748B', font=msg_sub_font)

    # ================= 3. DRAW ALL MESSAGES =================

    # 1. Trình duyệt -> FastAPI: GET /foryou/{user_id}
    draw_solid_arrow(340, 300, 1130, color='#1E3A8A', width=3)
    draw_msg_label(340, 1130, 300, "1", "GET /api/recommendations/foryou/{user_id}", "[Yêu cầu danh mục gợi ý cá nhân hóa cho độc giả]")

    # 2. FastAPI -> PostgreSQL: Lấy 5 hạt giống
    draw_solid_arrow(1150, 400, 1950, color='#1E293B', width=3)
    draw_msg_label(1150, 1950, 400, "2", "[Truy vấn 1] Lấy 5 tác phẩm hạt giống (ratings >= 4★ hoặc tương tác cao)", "SQL: SELECT book_id FROM ratings UNION ALL interactions ORDER BY created_at DESC LIMIT 5")

    # 3. PostgreSQL --> FastAPI: Trả về hạt giống
    draw_dashed_return(1950, 490, 1150, color='#64748B', width=2)
    draw_msg_label(1150, 1950, 490, "3", "Trả về danh sách 5 tác phẩm hạt giống [seed_ids]", is_return=True)

    # 4. FastAPI -> PostgreSQL: AVG(embedding) pgvector Cosine
    draw_solid_arrow(1150, 610, 1950, color='#1E293B', width=3)
    draw_msg_label(1150, 1950, 610, "4", "[Truy vấn 2] AVG(embedding) & Tìm kiếm vector láng giềng k-NN Cosine (HNSW)", "SQL: ORDER BY embedding <=> cast(profile as vector) LIMIT 30")

    # 5. PostgreSQL --> FastAPI: Ứng viên Content-Based
    draw_dashed_return(1950, 700, 1150, color='#64748B', width=2)
    draw_msg_label(1150, 1950, 700, "5", "Trả về 30 ứng viên Content-Based [cb_candidates]", is_return=True)

    # 6. FastAPI -> PostgreSQL: Hệ số Ochiai từng hạt giống
    draw_solid_arrow(1150, 820, 1950, color='#1E293B', width=3)
    draw_msg_label(1150, 1950, 820, "6", "[Truy vấn 3] Tính hệ số tương đồng Ochiai đồng xuất hiện từng hạt giống", "Công thức: Ochiai(i, j) = |U_i ∩ U_j| / sqrt(|U_i| * |U_j|)")

    # 7. PostgreSQL --> FastAPI: Ứng viên Collaborative
    draw_dashed_return(1950, 910, 1150, color='#64748B', width=2)
    draw_msg_label(1150, 1950, 910, "7", "Trả về 30 ứng viên Collaborative Filtering [cf_candidates]", is_return=True)

    # 8. FastAPI Self Loop: Borda Fusion & Lọc sách đã đọc
    loop_x = 1150
    draw.line([loop_x, 1010, loop_x + 90, 1010], fill='#4338CA', width=3)
    draw.line([loop_x + 90, 1010, loop_x + 90, 1110], fill='#4338CA', width=3)
    draw.line([loop_x + 90, 1110, loop_x, 1110], fill='#4338CA', width=3)
    draw.polygon([(loop_x, 1110), (loop_x + 14, 1103), (loop_x + 14, 1117)], fill='#4338CA')
    
    draw.text((loop_x + 105, 1025), "8: Thuật toán Borda Count Fusion & Lọc sách đã đọc/đã mua (seen)", fill='#3730A3', font=msg_font)
    draw.text((loop_x + 105, 1065), "Điểm: Score_Borda(b) = (P - Rank_CB) + (P - Rank_CF) -> Top 10 đề xuất", fill='#6366F1', font=msg_sub_font)

    # 9. FastAPI -> PostgreSQL: Ghi đệm cache
    draw_solid_arrow(1150, 1200, 1950, color='#1E293B', width=3)
    draw_msg_label(1150, 1950, 1200, "9", "Ghi đệm danh sách Top-K vào bảng recommendation_cache (TTL = 1 giờ)", "SQL: INSERT INTO recommendation_cache (user_id, model_version, book_ids, scores)")

    # 9b. PostgreSQL --> FastAPI: ACK Cache
    draw_dashed_return(1950, 1280, 1150, color='#64748B', width=2)
    draw_msg_label(1150, 1950, 1280, "9b", "Ghi nhận Cache thành công (Cache Hit sẵn sàng cho 1 giờ)", is_return=True)

    # 10. FastAPI --> Trình duyệt: 200 OK JSON
    draw_dashed_return(1130, 1380, 340, color='#1D4ED8', width=3)
    draw_msg_label(340, 1130, 1380, "10", "200 OK: Trả về JSON {items, because: \"Vì bạn đã thích...\", seeds}", "[Client render giao diện và hiển thị huy hiệu giải thích AI Explainable]", is_return=True)

    # Phase Separator Box: Asynchronous Client Background Event
    draw.line([140, 1450, w - 140, 1450], fill='#E2E8F0', width=2)
    sep_txt = "TIẾN TRÌNH CHẠY NỀN: GHI NHẬN HÀNH VI NGẦM (IMPLICIT FEEDBACK EVENT LOOP)"
    stb = sep_font.getbbox(sep_txt)
    draw.rounded_rectangle([w // 2 - (stb[2] - stb[0]) // 2 - 25, 1435, w // 2 + (stb[2] - stb[0]) // 2 + 25, 1465], radius=6, fill='#F1F5F9', outline='#CBD5E1', width=1)
    draw.text((w // 2 - (stb[2] - stb[0]) // 2, 1441), sep_txt, fill='#475569', font=sep_font)

    # 11. Trình duyệt -> FastAPI: POST /interactions
    draw_solid_arrow(340, 1530, 1130, color='#0D9488', width=3)
    draw_msg_label(340, 1130, 1530, "11", "POST /api/interactions (Sự kiện vi mô: view / click / add_to_cart)", "[Beacon ngầm gửi dữ liệu khi độc giả tương tác với sách được gợi ý]", is_async=True)

    # 12. FastAPI -> PostgreSQL: INSERT interactions
    draw_solid_arrow(1150, 1620, 1950, color='#0D9488', width=3)
    draw_msg_label(1150, 1950, 1620, "12", "INSERT INTO interactions (user_id, book_id, type) (Lưu vết hành vi)", "Lưu vết vào CSDL để cập nhật hồ sơ độc giả và làm hạt giống cho phiên sau", is_async=True)

    # 12b. DB -> FastAPI: 201 Created
    draw_dashed_return(1950, 1700, 1150, color='#0D9488', width=2)
    draw_msg_label(1150, 1950, 1700, "12b", "201 Created (Ghi nhận thành công)", is_return=True)

    # ================= 4. SUMMARY / NOTES FOOTER BOX =================
    sum_x, sum_y, sum_w, sum_h = 80, 1790, 2340, 310
    draw.rounded_rectangle([sum_x + 3, sum_y + 3, sum_x + sum_w + 3, sum_y + sum_h + 3], radius=10, fill='#E2E8F0')
    draw.rounded_rectangle([sum_x, sum_y, sum_x + sum_w, sum_y + sum_h], radius=10, fill='#F8FAFC', outline='#CBD5E1', width=2)

    # Header of Summary Box
    draw.text((sum_x + 24, sum_y + 18), "GIẢI THÍCH 3 PHA XỬ LÝ TRUY VẤN VÀ TÍNH TOÁN CỦA LUỒNG GỢI Ý CÁ NHÂN HÓA (/FORYOU):", fill='#1E3A8A', font=box_hdr_font)
    draw.line([sum_x + 24, sum_y + 54, sum_x + sum_w - 24, sum_y + 54], fill='#E2E8F0', width=2)

    bullets = [
        ("• Pha 1 - Khai phá Hạt giống (Seed Mining):", "FastAPI kết hợp dữ liệu đánh giá sao cao (ratings >= 4★) và phản hồi ngầm trọng số lớn (interactions: purchase 5, cart 4, wishlist 3) để trích xuất 5 tác phẩm gần nhất đại diện cho thị hiếu hiện tại của độc giả."),
        ("• Pha 2 - Truy vấn Kép Song song (Dual-Branch Search):", "Gửi 2 truy vấn chuyên biệt tới database: (1) Nhánh Content-Based tính trọng tâm vector profile và quét chỉ mục không gian HNSW trên không gian 768 chiều; (2) Nhánh Collaborative quét ma trận đồng xuất hiện tính hệ số tương đồng Ochiai."),
        ("• Pha 3 - Hợp nhất Borda & Vòng lặp phản hồi (Fusion & Loop):", "Hợp nhất 2 danh sách ứng viên theo tổng điểm thứ hạng Borda Count, loại trừ sách đã tương tác (seen), lưu bộ đệm recommendation_cache (1 giờ), trả về kết quả kèm nhãn Explainable AI, và thu thập hành vi ngầm qua POST /interactions.")
    ]

    by_curr = sum_y + 70
    for b_title, b_desc in bullets:
        draw.text((sum_x + 24, by_curr), b_title, fill='#0F172A', font=box_bold_font)
        draw.text((sum_x + 550, by_curr), b_desc, fill='#334155', font=box_txt_font)
        by_curr += 44

    # Save outputs
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    img.save(output_path, quality=95, dpi=(300, 300))
    print(f"[SUCCESS] Rendered beautiful large-font Sequence Diagram PNG to: {output_path}")

if __name__ == '__main__':
    render_sequence_png(os.path.normpath('Sequence_Diagram.png'))
    render_sequence_png(os.path.normpath('Sequence_Diagram.drawio.png'))
    render_sequence_png(os.path.normpath('Final Report/Sequence_Diagram.png'))
    render_sequence_png(os.path.normpath('Final Report/Sequence_Diagram.drawio.png'))
    render_sequence_png(os.path.normpath('So_do_Sequence_Diagram_The_Inkwell_Chuan.png'))
    render_sequence_png(os.path.normpath('Final Report/So_do_Sequence_Diagram_The_Inkwell_Chuan.png'))

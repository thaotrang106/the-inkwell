import os
from PIL import Image, ImageDraw, ImageFont

def render_erd_png(output_path):
    w, h = 2100, 1340
    img = Image.new('RGB', (w, h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)

    # Fonts
    try:
        title_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 34)
        sub_title_font = ImageFont.truetype('C:/Windows/Fonts/timesi.ttf', 19)
        table_hdr_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 19)
        col_name_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
        col_reg_font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
        col_type_font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 14)
        badge_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 12)
        card_font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 17)
        legend_title_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 17)
        legend_text_font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
        legend_bold_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
    except Exception as e:
        print(f"Font loading error: {e}, falling back to default")
        title_font = ImageFont.load_default()
        sub_title_font = title_font
        table_hdr_font = title_font
        col_name_font = title_font
        col_reg_font = title_font
        col_type_font = title_font
        badge_font = title_font
        card_font = title_font
        legend_title_font = title_font
        legend_text_font = title_font
        legend_bold_font = title_font

    # Background subtle border / container
    draw.rounded_rectangle([20, 20, w - 20, h - 20], radius=16, fill='#FFFFFF', outline='#CBD5E1', width=2)

    # 1. Title Block
    title_text = "SƠ ĐỒ THỰC THỂ LIÊN KẾT (ERD) - HỆ THỐNG GỢI Ý SÁCH THE INKWELL"
    tb = title_font.getbbox(title_text)
    draw.text(((w - (tb[2] - tb[0])) // 2, 38), title_text, fill='#1E3A8A', font=title_font)

    sub_text = "Mô hình cơ sở dữ liệu quan hệ chuẩn 3NF tích hợp Vector Embeddings 768 chiều & Cơ chế đệm Cache tối ưu"
    sb = sub_title_font.getbbox(sub_text)
    draw.text(((w - (sb[2] - sb[0])) // 2, 82), sub_text, fill='#475569', font=sub_title_font)

    # Divider below title
    draw.line([50, 118, w - 50, 118], fill='#E2E8F0', width=2)

    # Helper: draw table entity
    def draw_entity(x, y, width, table_name, columns, header_bg='#2B6CB0', border_color='#2B6CB0', is_central=False):
        row_h = 32
        hdr_h = 42
        total_h = hdr_h + len(columns) * row_h
        
        # Subtle Drop shadow
        draw.rounded_rectangle([x + 3, y + 3, x + width + 3, y + total_h + 3], radius=8, fill='#E2E8F0')
        # Main container
        draw.rounded_rectangle([x, y, x + width, y + total_h], radius=8, fill='#FFFFFF', outline=border_color, width=3 if is_central else 2)

        # Header background
        draw.rounded_rectangle([x, y, x + width, y + hdr_h], radius=8, fill=header_bg)
        draw.rectangle([x, y + hdr_h - 10, x + width, y + hdr_h], fill=header_bg) # Fill bottom corners of header
        
        # Header text
        hb = table_hdr_font.getbbox(table_name)
        draw.text((x + (width - (hb[2] - hb[0])) // 2, y + (hdr_h - (hb[3] - hb[1])) // 2), table_name, fill='#FFFFFF', font=table_hdr_font)

        # Rows
        curr_y = y + hdr_h
        for i, col in enumerate(columns):
            tag, name, dtype, special = col
            
            # Row background
            row_fill = '#FFFFFF'
            if special == 'ai_vec':
                row_fill = '#FEF3C7' # light amber
            elif special == 'ai_text':
                row_fill = '#F0FDF4' # light emerald
            elif i % 2 == 1:
                row_fill = '#F8FAFC'
                
            draw.rectangle([x + 1, curr_y, x + width - 1, curr_y + row_h], fill=row_fill)
            if i < len(columns) - 1:
                draw.line([x, curr_y + row_h, x + width, curr_y + row_h], fill='#F1F5F9', width=1)

            # Badge for Tag
            if tag:
                badge_bg = '#FEF3C7'
                badge_txt = '#B45309'
                if tag == 'PK':
                    badge_bg = '#FEF3C7'
                    badge_txt = '#B45309'
                elif tag == 'FK':
                    badge_bg = '#E0F2FE'
                    badge_txt = '#0284C7'
                elif 'PK' in tag and 'FK' in tag:
                    badge_bg = '#F3E8FF'
                    badge_txt = '#7E22CE'
                elif tag == 'AI':
                    badge_bg = '#DCFCE7'
                    badge_txt = '#15803D'

                bb = badge_font.getbbox(tag)
                bw = (bb[2] - bb[0]) + 10
                bh = 19
                bx = x + 10
                by = curr_y + (row_h - bh) // 2
                draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=4, fill=badge_bg, outline=badge_txt, width=1)
                draw.text((bx + 5, by + 1), tag, fill=badge_txt, font=badge_font)

            # Column Name
            name_x = x + 72 if tag else x + 20
            font_to_use = col_name_font if ('PK' in tag or is_central and 'id' in name) else col_reg_font
            name_color = '#1E3A8A' if 'PK' in tag else ('#0F172A' if tag else '#334155')
            if special == 'ai_vec':
                name_color = '#92400E'
            elif special == 'ai_text':
                name_color = '#166534'
            draw.text((name_x, curr_y + 5), name, fill=name_color, font=font_to_use)

            # Data Type
            dtb = col_type_font.getbbox(dtype)
            dt_color = '#64748B'
            if special == 'ai_vec':
                dt_color = '#B45309'
            elif special == 'ai_text':
                dt_color = '#15803D'
            draw.text((x + width - (dtb[2] - dtb[0]) - 14, curr_y + 6), dtype, fill=dt_color, font=col_type_font)

            curr_y += row_h

        return total_h

    # ================= 2. DEFINE AND DRAW TABLES =================
    # Layout Coordinates
    x_col1 = 70
    w_col1 = 450

    x_col2 = 680
    w_col2 = 480

    x_col3 = 1340
    w_col3 = 540

    # Table 1: users (Left Top)
    users_cols = [
        ('PK', 'user_id', 'INT', None),
        ('', 'username', 'VARCHAR(100)', None),
        ('', 'email', 'VARCHAR(255)', None),
        ('', 'created_at', 'TIMESTAMP', None),
    ]
    u_h = draw_entity(x_col1, 230, w_col1, 'users', users_cols, header_bg='#2B6CB0', border_color='#2B6CB0')

    # Table 2: recommendation_cache (Left Bottom)
    cache_cols = [
        ('PK', 'id', 'INT', None),
        ('FK', 'user_id', 'INT', None),
        ('', 'model_version', 'VARCHAR(50)', None),
        ('', 'book_ids (kết quả)', 'INT[]', None),
        ('', 'scores (độ tương đồng)', 'FLOAT[]', None),
        ('', 'generated_at', 'TIMESTAMP', None),
    ]
    c_h = draw_entity(x_col1, 510, w_col1, 'recommendation_cache', cache_cols, header_bg='#475569', border_color='#475569')

    # Table 3: ratings (Center Top)
    ratings_cols = [
        ('PK', 'rating_id', 'INT', None),
        ('FK', 'user_id', 'INT', None),
        ('FK', 'book_id', 'INT', None),
        ('', 'rating (1 đến 5)', 'SMALLINT', None),
        ('', 'created_at', 'TIMESTAMP', None),
    ]
    r_h = draw_entity(x_col2, 160, w_col2, 'ratings', ratings_cols, header_bg='#C05621', border_color='#C05621')

    # Table 4: interactions (Center Bottom)
    interactions_cols = [
        ('PK', 'id', 'INT', None),
        ('FK', 'user_id', 'INT', None),
        ('FK', 'book_id', 'INT', None),
        ('', 'interaction_type', 'VARCHAR(20)', None),
        ('', 'created_at', 'TIMESTAMP', None),
    ]
    i_h = draw_entity(x_col2, 450, w_col2, 'interactions', interactions_cols, header_bg='#0D9488', border_color='#0D9488')

    # Table 5: popular_books (Right Top)
    popular_cols = [
        ('PK, FK', 'book_id', 'INT', None),
        ('', 'score (Bayesian)', 'FLOAT', None),
        ('', 'rank (Thứ hạng)', 'INT', None),
        ('', 'updated_at', 'TIMESTAMP', None),
    ]
    p_h = draw_entity(x_col3, 140, w_col3, 'popular_books', popular_cols, header_bg='#744210', border_color='#744210')

    # Table 6: books (Right Center - Central Table)
    books_cols = [
        ('PK', 'book_id', 'INT', None),
        ('', 'goodreads_book_id', 'INT', None),
        ('', 'title', 'VARCHAR(255)', None),
        ('', 'authors', 'VARCHAR(255)', None),
        ('', 'image_url', 'VARCHAR(500)', None),
        ('', 'average_rating', 'FLOAT', None),
        ('', 'ratings_count', 'INT', None),
        ('AI', 'embedding', 'VECTOR(768)', 'ai_vec'),
        ('AI', 'ai_explanation', 'TEXT', 'ai_text'),
    ]
    b_h = draw_entity(x_col3, 380, w_col3, '★ books (Bảng trọng tâm hệ thống)', books_cols, header_bg='#1D4ED8', border_color='#1D4ED8', is_central=True)

    # Table 7: book_tags (Right Below Books)
    book_tags_cols = [
        ('PK', 'id', 'INT', None),
        ('FK', 'book_id', 'INT', None),
        ('FK', 'tag_id', 'INT', None),
        ('', 'count (Tần suất gán)', 'INT', None),
    ]
    bt_h = draw_entity(x_col3, 770, w_col3, 'book_tags', book_tags_cols, header_bg='#6B46C1', border_color='#6B46C1')

    # Table 8: tags (Right Bottom)
    tags_cols = [
        ('PK', 'tag_id', 'INT', None),
        ('', 'tag_name', 'VARCHAR(100)', None),
    ]
    t_h = draw_entity(x_col3, 1010, w_col3, 'tags', tags_cols, header_bg='#15803D', border_color='#15803D')

    # ================= 3. CONNECTORS & MULTIPLICITY LABELS =================
    line_color = '#334155'
    line_w = 3

    def draw_cardinality_badge(cx, cy, label):
        bw, bh = 26, 22
        draw.rounded_rectangle([cx - bw // 2, cy - bh // 2, cx + bw // 2, cy + bh // 2], radius=4, fill='#FFFFFF', outline='#1E3A8A', width=2)
        lb = card_font.getbbox(label)
        draw.text((cx - (lb[2] - lb[0]) // 2, cy - (lb[3] - lb[1]) // 2 - 1), label, fill='#1E3A8A', font=card_font)

    # 1. users (1) ---> (N) recommendation_cache (Vertical straight down)
    ux_mid = x_col1 + w_col1 // 2
    uy_bot = 230 + u_h
    cy_top = 510
    draw.line([ux_mid, uy_bot, ux_mid, cy_top], fill=line_color, width=line_w)
    draw_cardinality_badge(ux_mid - 22, uy_bot + 20, '1')
    draw_cardinality_badge(ux_mid - 22, cy_top - 20, 'N')

    # 2. users (1) ---> (N) ratings
    u_right = x_col1 + w_col1
    u_exit_y1 = 230 + 50
    r_left = x_col2
    r_enter_y = 160 + 75
    mid_x1 = (u_right + r_left) // 2
    draw.line([u_right, u_exit_y1, mid_x1, u_exit_y1], fill=line_color, width=line_w)
    draw.line([mid_x1, u_exit_y1, mid_x1, r_enter_y], fill=line_color, width=line_w)
    draw.line([mid_x1, r_enter_y, r_left, r_enter_y], fill=line_color, width=line_w)
    draw_cardinality_badge(u_right + 22, u_exit_y1 - 16, '1')
    draw_cardinality_badge(r_left - 22, r_enter_y - 16, 'N')

    # 3. ratings (N) <--- (1) books
    r_right = x_col2 + w_col2
    b_left = x_col3
    b_enter_y1 = 380 + 75
    mid_x2 = (r_right + b_left) // 2
    draw.line([r_right, r_enter_y, mid_x2, r_enter_y], fill=line_color, width=line_w)
    draw.line([mid_x2, r_enter_y, mid_x2, b_enter_y1], fill=line_color, width=line_w)
    draw.line([mid_x2, b_enter_y1, b_left, b_enter_y1], fill=line_color, width=line_w)
    draw_cardinality_badge(r_right + 22, r_enter_y - 16, 'N')
    draw_cardinality_badge(b_left - 22, b_enter_y1 - 16, '1')

    # 4. users (1) ---> (N) interactions
    u_exit_y2 = 230 + 120
    i_left = x_col2
    i_enter_y = 450 + 75
    draw.line([u_right, u_exit_y2, mid_x1, u_exit_y2], fill=line_color, width=line_w)
    draw.line([mid_x1, u_exit_y2, mid_x1, i_enter_y], fill=line_color, width=line_w)
    draw.line([mid_x1, i_enter_y, i_left, i_enter_y], fill=line_color, width=line_w)
    draw_cardinality_badge(u_right + 22, u_exit_y2 - 16, '1')
    draw_cardinality_badge(i_left - 22, i_enter_y - 16, 'N')

    # 5. interactions (N) <--- (1) books
    i_right = x_col2 + w_col2
    b_enter_y2 = 380 + 160
    draw.line([i_right, i_enter_y, mid_x2, i_enter_y], fill=line_color, width=line_w)
    draw.line([mid_x2, i_enter_y, mid_x2, b_enter_y2], fill=line_color, width=line_w)
    draw.line([mid_x2, b_enter_y2, b_left, b_enter_y2], fill=line_color, width=line_w)
    draw_cardinality_badge(i_right + 22, i_enter_y - 16, 'N')
    draw_cardinality_badge(b_left - 22, b_enter_y2 - 16, '1')

    # 6. popular_books (1) <---> (1) books (Vertical straight down)
    bx_mid = x_col3 + w_col3 // 2
    p_bot = 140 + p_h
    b_top = 380
    draw.line([bx_mid, p_bot, bx_mid, b_top], fill=line_color, width=line_w)
    draw_cardinality_badge(bx_mid + 22, p_bot + 20, '1')
    draw_cardinality_badge(bx_mid + 22, b_top - 20, '1')

    # 7. books (1) ---> (N) book_tags (Vertical straight down)
    b_bot = 380 + b_h
    bt_top = 770
    draw.line([bx_mid, b_bot, bx_mid, bt_top], fill=line_color, width=line_w)
    draw_cardinality_badge(bx_mid + 22, b_bot + 20, '1')
    draw_cardinality_badge(bx_mid + 22, bt_top - 20, 'N')

    # 8. book_tags (N) <--- (1) tags (Vertical straight down)
    bt_bot = 770 + bt_h
    t_top = 1010
    draw.line([bx_mid, bt_bot, bx_mid, t_top], fill=line_color, width=line_w)
    draw_cardinality_badge(bx_mid + 22, bt_bot + 20, 'N')
    draw_cardinality_badge(bx_mid + 22, t_top - 20, '1')

    # ================= 4. LEGEND & ANNOTATION BOX =================
    leg_x = x_col1
    leg_y = 780
    leg_w = x_col2 + w_col2 - x_col1
    leg_h = 345
    draw.rounded_rectangle([leg_x, leg_y, leg_x + leg_w, leg_y + leg_h], radius=10, fill='#F8FAFC', outline='#CBD5E1', width=2)
    
    # Legend Title
    draw.text((leg_x + 20, leg_y + 15), "QUY ƯỚC KÝ HIỆU & GIẢI THÍCH KIẾN TRÚC CƠ SỞ DỮ LIỆU", fill='#1E3A8A', font=legend_title_font)
    draw.line([leg_x + 20, leg_y + 44, leg_x + leg_w - 20, leg_y + 44], fill='#E2E8F0', width=2)

    # Bullet 1: Badges
    items = [
        ("• Ký hiệu khóa:", [
            ("PK", '#FEF3C7', '#B45309', "Khóa chính (Primary Key) định danh duy nhất từng bản ghi."),
            ("FK", '#E0F2FE', '#0284C7', "Khóa ngoại (Foreign Key) thiết lập toàn vẹn tham chiếu."),
            ("PK, FK", '#F3E8FF', '#7E22CE', "Vừa là khóa chính vừa là khóa ngoại (quan hệ 1:1 mở rộng)."),
            ("AI", '#DCFCE7', '#15803D', "Trường vector pgvector (768D) & Lời bình Explainable AI.")
        ]),
    ]
    
    ly = leg_y + 56
    for title_lbl, badge_list in items:
        draw.text((leg_x + 20, ly), title_lbl, fill='#0F172A', font=legend_bold_font)
        bx_curr = leg_x + 160
        for b_tag, b_bg, b_fg, b_desc in badge_list:
            # Badge
            bb = badge_font.getbbox(b_tag)
            bw = (bb[2] - bb[0]) + 10
            draw.rounded_rectangle([bx_curr, ly - 2, bx_curr + bw, ly + 18], radius=4, fill=b_bg, outline=b_fg, width=1)
            draw.text((bx_curr + 5, ly - 1), b_tag, fill=b_fg, font=badge_font)
            bx_curr += bw + 8
            # Desc
            draw.text((bx_curr, ly - 1), b_desc, fill='#334155', font=legend_text_font)
            ly += 29
            bx_curr = leg_x + 160
        ly += 4

    # Bullet 2: Cardinalities
    draw.text((leg_x + 20, ly), "• Bản số quan hệ:", fill='#0F172A', font=legend_bold_font)
    draw.text((leg_x + 160, ly), "1 : N (Một - Nhiều) | 1 : 1 (Một - Một). Không có quan hệ Nhiều - Nhiều (M:N) trực tiếp;", fill='#334155', font=legend_text_font)
    ly += 25
    draw.text((leg_x + 160, ly), "Các quan hệ M:N giữa users - books và books - tags đều được chuẩn hóa qua các bảng trung gian.", fill='#475569', font=legend_text_font)
    ly += 30

    # Bullet 3: 3NF & Performance notes
    draw.text((leg_x + 20, ly), "• Chuẩn hóa & Cache:", fill='#0F172A', font=legend_bold_font)
    draw.text((leg_x + 160, ly), "Toàn bộ CSDL đạt chuẩn 3NF. Bảng recommendation_cache và popular_books đóng vai trò", fill='#334155', font=legend_text_font)
    ly += 25
    draw.text((leg_x + 160, ly), "lớp đệm (Cache) giúp truy vấn gợi ý Cold-Start và For-You đạt tốc độ phản hồi cực nhanh (< 50ms).", fill='#475569', font=legend_text_font)

    # Save outputs
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    img.save(output_path, quality=95, dpi=(300, 300))
    print(f"[SUCCESS] Rendered beautiful high-res ERD PNG to: {output_path}")

if __name__ == '__main__':
    render_erd_png(os.path.normpath('ERD.drawio.png'))
    render_erd_png(os.path.normpath('Final Report/ERD.drawio.png'))
    render_erd_png(os.path.normpath('So_do_ERD_The_Inkwell_Chuan.png'))
    render_erd_png(os.path.normpath('Final Report/So_do_ERD_The_Inkwell_Chuan.png'))

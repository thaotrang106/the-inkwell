from PIL import Image, ImageDraw, ImageFont

def render_flow_usecase_png(output_path):
    w, h = 2400, 2200
    img = Image.new('RGB', (w, h), color='#FFFFFF')
    draw = ImageDraw.Draw(img)

    # Fonts
    title_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 38)
    flow_title_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 23)
    actor_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 24)
    actor_sub_font = ImageFont.truetype('C:/Windows/Fonts/times.ttf', 20)
    uc_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 20)
    uc_sub_font = ImageFont.truetype('C:/Windows/Fonts/times.ttf', 17)
    rel_font = ImageFont.truetype('C:/Windows/Fonts/timesi.ttf', 18)

    # System Boundary
    bx, by, bw, bh = 460, 45, 1480, 2090
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=20, fill='#FCFAF7', outline='#4A3728', width=3)
    
    t_text = "HỆ THỐNG GỢI Ý SÁCH THÔNG MINH THE INKWELL"
    tb = title_font.getbbox(t_text)
    draw.text((bx + (bw - (tb[2]-tb[0]))//2, by + 20), t_text, fill='#4A3728', font=title_font)

    # 4 Flow Zones
    zones = [
        ("GIAI ĐOẠN 1: KHÁM PHÁ BAN ĐẦU & TÌM KIẾM (COLD-START FLOW)", by+75, 270, '#FFF8F0', '#DD6B20', '#9C4221'),
        ("GIAI ĐOẠN 2: CHI TIẾT SÁCH & GỢI Ý THUẬT TOÁN (ITEM-LEVEL AI FLOW)", by+375, 520, '#F0F7FF', '#3182CE', '#2B6CB0'),
        ("GIAI ĐOẠN 3: ĐỀ XUẤT CÁ NHÂN HÓA & GHI NHẬN HÀNH VI (USER FLOW)", by+925, 580, '#FEFCBF', '#D69E2E', '#744210'),
        ("GIAI ĐOẠN 4: VẬN HÀNH DỮ LIỆU & TIẾN TRÌNH NỀN (OFFLINE BATCH FLOW)", by+1535, 510, '#F7FAFC', '#718096', '#2D3748')
    ]
    for z_title, zy, zh, zfill, zstroke, zcolor in zones:
        draw.rounded_rectangle([bx+30, zy, bx+bw-30, zy+zh], radius=15, fill=zfill, outline=zstroke, width=2)
        draw.text((bx+55, zy+16), z_title, fill=zcolor, font=flow_title_font)

    # Helper stick figures
    def draw_actor(x, y, name, subname, color='#2B6CB0'):
        draw.ellipse([x-25, y-80, x+25, y-30], outline=color, width=3, fill='#FFFFFF')
        draw.line([x, y-30, x, y+35], fill=color, width=3)
        draw.line([x-35, y-10, x+35, y-10], fill=color, width=3)
        draw.line([x, y+35, x-30, y+90], fill=color, width=3)
        draw.line([x, y+35, x+30, y+90], fill=color, width=3)
        nb = actor_font.getbbox(name)
        draw.text((x - (nb[2]-nb[0])//2, y+100), name, fill=color, font=actor_font)
        if subname:
            sb = actor_sub_font.getbbox(subname)
            draw.text((x - (sb[2]-sb[0])//2, y+130), subname, fill='#555555', font=actor_sub_font)

    # Actors positions
    draw_actor(220, 360, "Khách vãng lai", "(Guest / Anonymous)", color='#C05621')
    draw_actor(220, 1220, "Độc giả / Người dùng", "(Registered User)", color='#2B6CB0')
    draw_actor(2180, 750, "Hệ thống AI đối tác", "(Google Gemini API)", color='#6B46C1')
    draw_actor(2180, 1790, "Quản trị / Tiến trình", "(Batch Scheduler)", color='#4A5568')

    # Generalization line (User inherits Guest - completely clear vertical line!)
    draw.line([220, 1120, 220, 520], fill='#4A5568', width=3)
    draw.polygon([(220, 500), (208, 525), (232, 525)], fill='#FFFFFF', outline='#4A5568')

    # Helper use cases
    def draw_uc(cx, cy, rw, rh, title, subtitle=None, fill='#FFFFFF', stroke='#DD6B20', tcolor='#2D3748'):
        draw.ellipse([cx-rw, cy-rh, cx+rw, cy+rh], fill=fill, outline=stroke, width=2)
        if subtitle:
            tb = uc_font.getbbox(title)
            sb = uc_sub_font.getbbox(subtitle)
            draw.text((cx - (tb[2]-tb[0])//2, cy - 22), title, fill=tcolor, font=uc_font)
            draw.text((cx - (sb[2]-sb[0])//2, cy + 4), subtitle, fill='#555555', font=uc_sub_font)
        else:
            tb = uc_font.getbbox(title)
            draw.text((cx - (tb[2]-tb[0])//2, cy - 10), title, fill=tcolor, font=uc_font)

    # Helper dashed line
    def draw_dash(p1, p2, color='#3182CE', dash=10, gap=6, width=2):
        import math
        x1, y1 = p1
        x2, y2 = p2
        dist = math.hypot(x2-x1, y2-y1)
        if dist == 0: return
        dx = (x2-x1) / dist
        dy = (y2-y1) / dist
        curr = 0
        while curr < dist:
            end = min(curr + dash, dist)
            draw.line([(x1 + dx*curr, y1 + dy*curr), (x1 + dx*end, y1 + dy*end)], fill=color, width=width)
            curr += dash + gap

    # ================= USE CASES =================
    # --- Zone 1: Giai đoạn 1 (Khám phá) ---
    uc_01 = (750, 210)
    uc_02 = (750, 315)
    draw_uc(uc_01[0], uc_01[1], 200, 44, "UC-01: Duyệt sách thịnh hành", "(Bayesian Cold-Start)", stroke='#DD6B20')
    draw_uc(uc_02[0], uc_02[1], 200, 44, "UC-02: Tìm kiếm thông minh", "(Từ khóa & Autocomplete)", stroke='#DD6B20')

    # --- Zone 2: Giai đoạn 2 (Chi tiết sách & AI) ---
    uc_03 = (750, 570)
    uc_04 = (1280, 510)
    uc_05 = (1280, 640)
    uc_06 = (1730, 570)
    uc_07 = (1730, 740)
    draw_uc(uc_03[0], uc_03[1], 200, 52, "UC-03: Xem chi tiết sách", "(Thông tin & Đánh giá cộng đồng)", stroke='#3182CE')
    draw_uc(uc_04[0], uc_04[1], 195, 48, "UC-04: Gợi ý theo nội dung", "(Content-Based pgvector)", stroke='#3182CE')
    draw_uc(uc_05[0], uc_05[1], 195, 48, "UC-05: Gợi ý theo cộng đồng", "(Collaborative Filtering Ochiai)", stroke='#3182CE')
    draw_uc(uc_06[0], uc_06[1], 195, 52, "UC-06: Gợi ý lai Hybrid", "(Borda Count Fusion + Alpha)", stroke='#3182CE')
    draw_uc(uc_07[0], uc_07[1], 195, 52, "UC-07: Xem lời bình Mercy AI", "(Google Gemini 2.5 Flash)", fill='#FAF5FF', stroke='#805AD5', tcolor='#44337A')

    # --- Zone 3: Giai đoạn 3 (Cá nhân hóa độc giả - Column 1 Stacked -> ZERO OVERLAPPING!) ---
    uc_08 = (750, 1050)
    uc_11 = (750, 1170)
    uc_09 = (750, 1300)
    uc_10 = (750, 1430)

    # Column 2 (System storage & processing)
    uc_12 = (1400, 1170)
    uc_13 = (1400, 1365)

    draw_uc(uc_08[0], uc_08[1], 200, 46, "UC-08: Chọn hồ sơ độc giả", "(Kích hoạt Demo user_id)", stroke='#D69E2E')
    draw_uc(uc_11[0], uc_11[1], 205, 50, "UC-11: Gợi ý cá nhân hóa", "(Just For You + Thẻ lý do)", stroke='#D69E2E')
    draw_uc(uc_09[0], uc_09[1], 200, 46, "UC-09: Quản lý giỏ hàng sách", "(Thêm, bớt, lưu trữ bền vững)", stroke='#D69E2E')
    draw_uc(uc_10[0], uc_10[1], 200, 46, "UC-10: Đánh giá & Viết nhận xét", "(Chấm sao + Nhận xét review)", stroke='#D69E2E')

    draw_uc(uc_12[0], uc_12[1], 200, 48, "UC-12: Kiểm tra bộ nhớ đệm", "(recommendation_cache)", fill='#EDFDFD', stroke='#319795', tcolor='#234E52')
    draw_uc(uc_13[0], uc_13[1], 205, 50, "UC-13: Ghi nhận hành vi vi mô", "(Log bảng interactions)", fill='#EDFDFD', stroke='#319795', tcolor='#234E52')

    # --- Zone 4: Giai đoạn 4 (Quản trị nền) ---
    uc_14 = (750, 1700)
    uc_15 = (1280, 1700)
    uc_16 = (1280, 1870)
    draw_uc(uc_14[0], uc_14[1], 205, 50, "UC-14: Nạp & chuẩn hóa dữ liệu", "(Tập Goodbooks-10k Extended)", stroke='#718096')
    draw_uc(uc_15[0], uc_15[1], 205, 50, "UC-15: Sinh vector nhúng 768 chiều", "(Embedding vào pgvector)", stroke='#718096')
    draw_uc(uc_16[0], uc_16[1], 205, 50, "UC-16: Tính lại xếp hạng Bayesian", "(Batch Script popular_books)", stroke='#718096')

    # ================= LINES & FLOW =================
    # Khách connections (Fan out with distinct exit points -> ZERO OVERLAPPING!)
    draw.line([270, 310, uc_01[0]-200, uc_01[1]], fill='#DD6B20', width=2)
    draw.line([270, 360, uc_02[0]-200, uc_02[1]], fill='#DD6B20', width=2)
    draw.line([270, 420, uc_03[0]-200, uc_03[1]], fill='#DD6B20', width=2)

    # Zone 2 Internal Relations
    # UC-03 -> UC-04, UC-05 (Item recommendation)
    draw_dash((uc_03[0]+200, uc_03[1]-15), (uc_04[0]-195, uc_04[1]), color='#3182CE')
    draw.text((990, 515), "<<include>>", fill='#3182CE', font=rel_font)
    draw_dash((uc_03[0]+200, uc_03[1]+15), (uc_05[0]-195, uc_05[1]), color='#3182CE')
    draw.text((990, 620), "<<include>>", fill='#3182CE', font=rel_font)

    # UC-04 & UC-05 -> UC-06 (Hybrid)
    draw_dash((uc_04[0]+195, uc_04[1]), (uc_06[0]-195, uc_06[1]-15), color='#3182CE')
    draw_dash((uc_05[0]+195, uc_05[1]), (uc_06[0]-195, uc_06[1]+15), color='#3182CE')
    draw.text((1500, 515), "<<include>>", fill='#3182CE', font=rel_font)
    draw.text((1500, 620), "<<include>>", fill='#3182CE', font=rel_font)

    # UC-07 (Mercy AI) <<extend>> UC-03 (Neat curve, no crossing!)
    draw_dash((uc_07[0]-195, uc_07[1]), (uc_03[0]+180, uc_03[1]+35), color='#805AD5')
    draw.text((1200, 715), "<<extend>>", fill='#805AD5', font=rel_font)

    # UC-07 -> Gemini API
    draw.line([uc_07[0]+195, uc_07[1], 2100, 750], fill='#6B46C1', width=2)

    # Người dùng connections (All 4 in Column 1 -> Fan out cleanly from (270, y) -> ZERO OVERLAPPING!)
    draw.line([270, 1160, uc_08[0]-200, uc_08[1]], fill='#2B6CB0', width=2)
    draw.line([270, 1200, uc_11[0]-205, uc_11[1]], fill='#2B6CB0', width=2)
    draw.line([270, 1260, uc_09[0]-200, uc_09[1]], fill='#2B6CB0', width=2)
    draw.line([270, 1310, uc_10[0]-200, uc_10[1]], fill='#2B6CB0', width=2)

    # Zone 3 Internal Relations
    # UC-11 -> UC-12 (Cache Check - purely horizontal line!)
    draw_dash((uc_11[0]+205, uc_11[1]), (uc_12[0]-200, uc_12[1]), color='#319795')
    draw.text((1030, 1145), "<<include>>", fill='#234E52', font=rel_font)

    # UC-09 & UC-10 -> UC-13 (Log Interactions - clean fan-in, ZERO CROSSING!)
    draw_dash((uc_09[0]+200, uc_09[1]), (uc_13[0]-205, uc_13[1]-15), color='#319795')
    draw_dash((uc_10[0]+200, uc_10[1]), (uc_13[0]-205, uc_13[1]+15), color='#319795')
    draw.text((1030, 1305), "<<include>>", fill='#234E52', font=rel_font)
    draw.text((1030, 1415), "<<include>>", fill='#234E52', font=rel_font)

    # Zone 4 Internal Relations (Data Flow Pipeline)
    draw.line([uc_14[0]+205, uc_14[1], uc_15[0]-205, uc_15[1]], fill='#718096', width=3)
    draw.polygon([(uc_15[0]-205, uc_15[1]), (uc_15[0]-220, uc_15[1]-8), (uc_15[0]-220, uc_15[1]+8)], fill='#718096')

    # Batch Actor connections
    draw.line([2100, 1790, uc_15[0]+205, uc_15[1]], fill='#4A5568', width=2)
    draw.line([2100, 1790, uc_16[0]+205, uc_16[1]], fill='#4A5568', width=2)

    # UC-15 -> Gemini API (Outer right channel, ZERO CROSSING!)
    draw.line([uc_15[0]+205, uc_15[1]-15, 1980, uc_15[1]-15], fill='#6B46C1', width=2)
    draw.line([1980, uc_15[1]-15, 1980, 780], fill='#6B46C1', width=2)
    draw.line([1980, 780, 2100, 750], fill='#6B46C1', width=2)
    draw.text((1820, 1655), "gọi API nhúng", fill='#6B46C1', font=rel_font)

    img.save(output_path, quality=95)
    print(f"Rendered Flow Use Case Diagram successfully to {output_path}")

if __name__ == '__main__':
    import os
    render_flow_usecase_png('Use Case_v1.png')
    render_flow_usecase_png(os.path.join('Final Report', 'Use Case_v1.png'))
    render_flow_usecase_png('So_do_Use_Case_The_Inkwell_Chuan.png')
    render_flow_usecase_png(os.path.join('Final Report', 'So_do_Use_Case_The_Inkwell_Chuan.png'))

from PIL import Image, ImageDraw, ImageFont
import math

def render_usecase_diagram(output_path):
    w, h = 2400, 1950
    img = Image.new('RGB', (w, h), color='#FFFFFF')
    draw = ImageDraw.Draw(img)

    # Fonts
    title_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 38)
    section_font = ImageFont.truetype('C:/Windows/Fonts/timesi.ttf', 24)
    actor_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 24)
    actor_sub_font = ImageFont.truetype('C:/Windows/Fonts/times.ttf', 20)
    uc_font = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 20)
    uc_sub_font = ImageFont.truetype('C:/Windows/Fonts/times.ttf', 17)
    rel_font = ImageFont.truetype('C:/Windows/Fonts/timesi.ttf', 18)

    # 1. System Boundary Box
    bx, by, bw, bh = 450, 50, 1480, 1840
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=20, fill='#FAF9F6', outline='#4A3728', width=3)
    
    # Title
    title_text = "HỆ THỐNG GỢI Ý SÁCH THÔNG MINH THE INKWELL"
    t_bbox = title_font.getbbox(title_text)
    draw.text((bx + (bw - (t_bbox[2]-t_bbox[0]))//2, by + 22), title_text, fill='#4A3728', font=title_font)

    # 3 Section Zones
    zones = [
        ("Phân hệ Khám phá & Gợi ý thuật toán (Công khai)", by+85, 600, '#F5ECE3', '#C4A482'),
        ("Phân hệ Độc giả cá nhân hóa & Tương tác vi mô (Theo user_id)", by+710, 580, '#EBF4FA', '#90CDF4'),
        ("Phân hệ Quản trị vận hành & Xử lý nền Offline (Batch Processing)", by+1315, 490, '#EDF2F7', '#CBD5E0')
    ]
    for z_title, zy, zh, zfill, zstroke in zones:
        draw.rounded_rectangle([bx+30, zy, bx+bw-30, zy+zh], radius=15, fill=zfill, outline=zstroke, width=2)
        draw.text((bx+55, zy+15), z_title, fill='#5A4A3A', font=section_font)

    # Helper to draw stick figures
    def draw_actor(x, y, name, subname, color='#2B6CB0'):
        draw.ellipse([x-25, y-80, x+25, y-30], outline=color, width=3, fill='#FFFFFF')
        draw.line([x, y-30, x, y+35], fill=color, width=3)
        draw.line([x-35, y-10, x+35, y-10], fill=color, width=3)
        draw.line([x, y+35, x-30, y+90], fill=color, width=3)
        draw.line([x, y+35, x+30, y+90], fill=color, width=3)
        n_bbox = actor_font.getbbox(name)
        draw.text((x - (n_bbox[2]-n_bbox[0])//2, y+100), name, fill=color, font=actor_font)
        if subname:
            s_bbox = actor_sub_font.getbbox(subname)
            draw.text((x - (s_bbox[2]-s_bbox[0])//2, y+130), subname, fill='#555555', font=actor_sub_font)

    # Draw Actors
    draw_actor(210, 380, "Khách vãng lai", "(Guest / Anonymous)", color='#C05621')
    draw_actor(210, 1020, "Độc giả / Người dùng", "(Registered User)", color='#2B6CB0')
    draw_actor(2180, 420, "Hệ thống AI đối tác", "(Google Gemini API)", color='#6B46C1')
    draw_actor(2180, 1550, "Quản trị / Tiến trình", "(Batch Scheduler)", color='#4A5568')

    # Generalization line from User to Guest (No crossing!)
    draw.line([210, 920, 210, 540], fill='#4A5568', width=3)
    draw.polygon([(210, 520), (198, 545), (222, 545)], fill='#FFFFFF', outline='#4A5568')

    # Helper to draw Use Case ellipse
    def draw_usecase(cx, cy, rw, rh, title, subtitle=None, fill='#FFFDF5', stroke='#C4A482'):
        draw.ellipse([cx-rw, cy-rh, cx+rw, cy+rh], fill=fill, outline=stroke, width=2)
        if subtitle:
            t_bbox = uc_font.getbbox(title)
            s_bbox = uc_sub_font.getbbox(subtitle)
            draw.text((cx - (t_bbox[2]-t_bbox[0])//2, cy - 22), title, fill='#2D3748', font=uc_font)
            draw.text((cx - (s_bbox[2]-s_bbox[0])//2, cy + 4), subtitle, fill='#555555', font=uc_sub_font)
        else:
            t_bbox = uc_font.getbbox(title)
            draw.text((cx - (t_bbox[2]-t_bbox[0])//2, cy - 10), title, fill='#2D3748', font=uc_font)

    # Helper for dashed lines
    def draw_dashed_line(p1, p2, color='#319795', dash=10, gap=6, width=2):
        x1, y1 = p1
        x2, y2 = p2
        length = math.hypot(x2-x1, y2-y1)
        if length == 0: return
        dx = (x2-x1) / length
        dy = (y2-y1) / length
        curr = 0
        while curr < length:
            seg_end = min(curr + dash, length)
            draw.line([(x1 + dx*curr, y1 + dy*curr), (x1 + dx*seg_end, y1 + dy*seg_end)], fill=color, width=width)
            curr += dash + gap

    # ================== ZONE 1: GUEST USE CASES ==================
    # Row 1: UC-01, UC-02
    uc_pop = (710, 200)
    uc_sea = (710, 310)
    # Row 2: UC-03 -> UC-07 (horizontal line, totally unblocked!)
    uc_det = (710, 420)
    uc_mrc = (1580, 420)
    # Row 3: UC-04, UC-05, UC-06
    uc_cb  = (710, 530)
    uc_cf  = (710, 640)
    uc_hyb = (1220, 585)

    draw_usecase(uc_pop[0], uc_pop[1], 180, 40, "UC-01: Duyệt sách thịnh hành", "(Bayesian Average Cold-Start)")
    draw_usecase(uc_sea[0], uc_sea[1], 180, 40, "UC-02: Tìm kiếm thông minh", "(Từ khóa & Autocomplete)")
    draw_usecase(uc_det[0], uc_det[1], 180, 44, "UC-03: Xem chi tiết sách", "(Thông tin & Đánh giá sao)")
    draw_usecase(uc_mrc[0], uc_mrc[1], 185, 48, "UC-07: Xem lời bình Mercy AI", "(Google Gemini 2.5 Flash)", fill='#FAF5FF', stroke='#805AD5')

    draw_usecase(uc_cb[0], uc_cb[1], 180, 42, "UC-04: Gợi ý theo nội dung", "(Content-Based pgvector)")
    draw_usecase(uc_cf[0], uc_cf[1], 180, 42, "UC-05: Gợi ý người khác cũng thích", "(Collaborative Filtering Ochiai)")
    draw_usecase(uc_hyb[0], uc_hyb[1], 195, 46, "UC-06: Gợi ý lai Hybrid", "(Borda Count Fusion + Alpha)")

    # Connections from Khách (Rays fan out cleanly from Actor: 200, 380 -> NO CROSSING!)
    draw.line([260, 380, uc_pop[0]-180, uc_pop[1]], fill='#C05621', width=2)
    draw.line([260, 380, uc_sea[0]-180, uc_sea[1]], fill='#C05621', width=2)
    draw.line([260, 380, uc_det[0]-180, uc_det[1]], fill='#C05621', width=2)
    draw.line([260, 380, uc_cb[0]-180, uc_cb[1]], fill='#C05621', width=2)
    draw.line([260, 380, uc_cf[0]-180, uc_cf[1]], fill='#C05621', width=2)

    # <<extend>> UC-03 -> UC-07 (Completely clean horizontal dashed line!)
    draw_dashed_line((uc_det[0]+180, uc_det[1]), (uc_mrc[0]-185, uc_mrc[1]), color='#805AD5')
    draw.text((1110, 395), "<<extend>>", fill='#805AD5', font=rel_font)

    # UC-04 & UC-05 -> UC-06 (Hybrid Borda fusion)
    draw_dashed_line((uc_cb[0]+180, uc_cb[1]), (uc_hyb[0]-195, uc_hyb[1]-15), color='#A0522D')
    draw_dashed_line((uc_cf[0]+180, uc_cf[1]), (uc_hyb[0]-195, uc_hyb[1]+15), color='#A0522D')
    draw.text((920, 525), "<<include>>", fill='#A0522D', font=rel_font)
    draw.text((920, 620), "<<include>>", fill='#A0522D', font=rel_font)

    # Connection to AI Actor (horizontal)
    draw.line([uc_mrc[0]+185, uc_mrc[1], 2100, 420], fill='#6B46C1', width=2)

    # ================== ZONE 2: USER USE CASES ==================
    uc_prf = (710, 835)
    uc_crt = (710, 955)
    uc_rev = (710, 1075)
    uc_fyu = (710, 1200)

    uc_log = (1200, 1015)
    uc_cch = (1580, 1200)

    draw_usecase(uc_prf[0], uc_prf[1], 180, 42, "UC-08: Chọn hồ sơ độc giả", "(Kích hoạt Demo user_id)", fill='#EBF8FF', stroke='#3182CE')
    draw_usecase(uc_crt[0], uc_crt[1], 180, 42, "UC-09: Quản lý giỏ hàng sách", "(Thêm, bớt, lưu trữ bền vững)", fill='#EBF8FF', stroke='#3182CE')
    draw_usecase(uc_rev[0], uc_rev[1], 180, 42, "UC-10: Đánh giá & Viết nhận xét", "(Chấm điểm sao + Review)", fill='#EBF8FF', stroke='#3182CE')
    draw_usecase(uc_fyu[0], uc_fyu[1], 195, 48, "UC-11: Gợi ý cá nhân hóa", "(Just For You + Thẻ lý do)", fill='#EBF8FF', stroke='#2B6CB0')

    draw_usecase(uc_log[0], uc_log[1], 190, 46, "UC-13: Ghi nhận hành vi vi mô", "(Log bảng interactions)", fill='#EDFDFD', stroke='#319795')
    draw_usecase(uc_cch[0], uc_cch[1], 185, 44, "UC-12: Kiểm tra bộ nhớ đệm", "(recommendation_cache)", fill='#EDFDFD', stroke='#319795')

    # Connections from Người dùng (Clean rays, NO crossing!)
    draw.line([260, 1020, uc_prf[0]-180, uc_prf[1]], fill='#2B6CB0', width=2)
    draw.line([260, 1020, uc_crt[0]-180, uc_crt[1]], fill='#2B6CB0', width=2)
    draw.line([260, 1020, uc_rev[0]-180, uc_rev[1]], fill='#2B6CB0', width=2)
    draw.line([260, 1020, uc_fyu[0]-195, uc_fyu[1]], fill='#2B6CB0', width=2)

    # <<include>> UC-09 & UC-10 -> UC-13 (Log Interactions)
    draw_dashed_line((uc_crt[0]+180, uc_crt[1]+10), (uc_log[0]-190, uc_log[1]-15), color='#319795')
    draw_dashed_line((uc_rev[0]+180, uc_rev[1]-10), (uc_log[0]-190, uc_log[1]+15), color='#319795')
    draw.text((920, 965), "<<include>>", fill='#319795', font=rel_font)
    draw.text((920, 1060), "<<include>>", fill='#319795', font=rel_font)

    # <<include>> UC-11 -> UC-12 (Cache Check - perfectly horizontal line!)
    draw_dashed_line((uc_fyu[0]+195, uc_fyu[1]), (uc_cch[0]-185, uc_cch[1]), color='#319795')
    draw.text((1120, 1175), "<<include>>", fill='#319795', font=rel_font)

    # ================== ZONE 3: BATCH USE CASES ==================
    uc_imp = (710, 1490)
    uc_emb = (1220, 1490)
    uc_rec = (1220, 1680)

    draw_usecase(uc_imp[0], uc_imp[1], 195, 46, "UC-14: Nạp & chuẩn hóa dữ liệu", "(Tập Goodbooks-10k Extended)", fill='#F7FAFC', stroke='#718096')
    draw_usecase(uc_emb[0], uc_emb[1], 200, 46, "UC-15: Sinh vector nhúng 768 chiều", "(Embedding vào pgvector)", fill='#F7FAFC', stroke='#718096')
    draw_usecase(uc_rec[0], uc_rec[1], 200, 46, "UC-16: Tính lại xếp hạng Bayesian", "(Batch Script popular_books)", fill='#F7FAFC', stroke='#718096')

    # Connections between batch use cases (data flow pipeline)
    draw.line([uc_imp[0]+195, uc_imp[1], uc_emb[0]-200, uc_emb[1]], fill='#718096', width=2)
    draw.polygon([(uc_emb[0]-200, uc_emb[1]), (uc_emb[0]-215, uc_emb[1]-6), (uc_emb[0]-215, uc_emb[1]+6)], fill='#718096')

    # Connections from Batch Actor (right)
    draw.line([2100, 1550, uc_emb[0]+200, uc_emb[1]], fill='#4A5568', width=2)
    draw.line([2100, 1550, uc_rec[0]+200, uc_rec[1]], fill='#4A5568', width=2)

    # Connection from UC-15 to Gemini API via outer right channel (Clean right margin path!)
    draw.line([uc_emb[0]+200, uc_emb[1], 1980, uc_emb[1]], fill='#6B46C1', width=2)
    draw.line([1980, uc_emb[1], 1980, 440], fill='#6B46C1', width=2)
    draw.line([1980, 440, 2100, 420], fill='#6B46C1', width=2)
    draw.text((1870, 1460), "gọi API nhúng", fill='#6B46C1', font=rel_font)

    # Save outputs
    img.save(output_path, quality=95)
    print(f"Rendered Use Case Diagram successfully to {output_path}")

if __name__ == '__main__':
    render_usecase_diagram('Use Case_v1.png')
    render_usecase_diagram('Final Report/Use Case_v1.png')
    render_usecase_diagram('So_do_Use_Case_The_Inkwell_Chuan.png')
    render_usecase_diagram('Final Report/So_do_Use_Case_The_Inkwell_Chuan.png')

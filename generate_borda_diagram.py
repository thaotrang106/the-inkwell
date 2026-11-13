import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from PIL import Image, ImageDraw, ImageFont

def create_borda_diagram(output_png_paths):
    w, h = 2400, 1520
    img = Image.new('RGB', (w, h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)

    # Load high quality fonts
    try:
        font_title = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 38)
        font_subtitle = ImageFont.truetype('C:/Windows/Fonts/timesi.ttf', 21)
        font_sec_hdr = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
        font_sec_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 14)
        font_card_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 22)
        font_card_score = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 19)
        font_card_score_bold = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 20)
        font_card_desc = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 14)
        font_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 13)
        font_tbl_hdr = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
        font_tbl_cell = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
        font_tbl_cell_b = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
        font_kpi_lbl = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
        font_kpi_val = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
        font_insight_hdr = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 17)
        font_insight_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
    except Exception as e:
        print(f"Font loading error: {e}, falling back to defaults")
        font_title = ImageFont.load_default()
        font_subtitle = font_sec_hdr = font_sec_sub = font_card_title = font_card_score = font_card_score_bold = font_card_desc = font_badge = font_tbl_hdr = font_tbl_cell = font_tbl_cell_b = font_kpi_lbl = font_kpi_val = font_insight_hdr = font_insight_body = font_title

    # 1. Main outer canvas container
    draw.rounded_rectangle([30, 25, w - 30, h - 25], radius=24, fill='#FFFFFF', outline='#CBD5E1', width=3)

    # 2. Header Title Block
    title_text = "SƠ ĐỒ CƠ CHẾ TỔNG HỢP ĐIỂM THEO THUẬT TOÁN HYBRID BORDA COUNT FUSION"
    tb = font_title.getbbox(title_text)
    draw.text(((w - (tb[2] - tb[0])) // 2, 48), title_text, fill='#1E3A8A', font=font_title)

    sub_text = "Mô hình hợp nhất thứ hạng chuẩn hóa với tập ứng viên P = 5, hệ số cân bằng α = 0.5 (Tác phẩm ký hiệu từ A đến G)"
    sb = font_subtitle.getbbox(sub_text)
    draw.text(((w - (sb[2] - sb[0])) // 2, 98), sub_text, fill='#475569', font=font_subtitle)

    # Divider below title
    draw.line([60, 136, w - 60, 136], fill='#E2E8F0', width=2)

    # 3. Formula & Rules KPI Banner
    banner_y1, banner_y2 = 148, 208
    draw.rounded_rectangle([60, banner_y1, w - 60, banner_y2], radius=14, fill='#F8FAFC', outline='#CBD5E1', width=1)

    # Three badges inside banner
    # Badge 1: Điểm nhánh
    draw.rounded_rectangle([80, banner_y1 + 10, 720, banner_y2 - 10], radius=10, fill='#EFF6FF', outline='#BFDBFE', width=1)
    draw.text((95, banner_y1 + 18), "• Điểm nhánh Borda:", fill='#1E40AF', font=font_kpi_lbl)
    draw.text((260, banner_y1 + 18), "Score = P - Rank  (Hạng 1 = 5 điểm, Hạng 5 = 1 điểm)", fill='#1E293B', font=font_kpi_val)

    # Badge 2: Điểm lai ghép
    draw.rounded_rectangle([740, banner_y1 + 10, 1540, banner_y2 - 10], radius=10, fill='#FFF5F2', outline='#FECDD3', width=1)
    draw.text((755, banner_y1 + 18), "• Công thức Hybrid:", fill='#B12704', font=font_kpi_lbl)
    draw.text((915, banner_y1 + 18), "Score_Hybrid = α · Score_CB + (1 - α) · Score_CF  (α = 0.5)", fill='#1E293B', font=font_kpi_val)

    # Badge 3: Quy ước màu
    draw.rounded_rectangle([1560, banner_y1 + 10, w - 80, banner_y2 - 10], radius=10, fill='#F0FDF4', outline='#BBF7D0', width=1)
    draw.text((1575, banner_y1 + 18), "• Quy ước nhận diện:", fill='#15803D', font=font_kpi_lbl)
    draw.text((1740, banner_y1 + 18), "Thẻ màu viền nổi bật là sách có mặt ở CẢ HAI danh sách", fill='#1E293B', font=font_kpi_val)

    # 4. Geometry for 3 main columns
    col_w = 680
    gap = 90
    c1_x1 = 70
    c1_x2 = c1_x1 + col_w
    c2_x1 = c1_x2 + gap
    c2_x2 = c2_x1 + col_w
    c3_x1 = c2_x2 + gap
    c3_x2 = c3_x1 + col_w

    hdr_y1, hdr_y2 = 226, 302

    # Column 1 Header: Content-Based
    draw.rounded_rectangle([c1_x1, hdr_y1, c1_x2, hdr_y2], radius=16, fill='#EFF6FF', outline='#3B82F6', width=2)
    draw.text((c1_x1 + 20, hdr_y1 + 12), "1. CONTENT-BASED (pgvector)", fill='#1D4ED8', font=font_sec_hdr)
    draw.text((c1_x1 + 20, hdr_y1 + 44), "Khoảng cách Cosine trên Vector ngữ nghĩa 768 chiều", fill='#3B82F6', font=font_sec_sub)

    # Column 2 Header: Collaborative Filtering
    draw.rounded_rectangle([c2_x1, hdr_y1, c2_x2, hdr_y2], radius=16, fill='#ECFDF5', outline='#10B981', width=2)
    draw.text((c2_x1 + 20, hdr_y1 + 12), "2. COLLABORATIVE (Ochiai)", fill='#047857', font=font_sec_hdr)
    draw.text((c2_x1 + 20, hdr_y1 + 44), "Hệ số tương đồng đồng xuất hiện cộng đồng (ratings >= 4★)", fill='#059669', font=font_sec_sub)

    # Column 3 Header: Hybrid Fusion
    draw.rounded_rectangle([c3_x1, hdr_y1, c3_x2, hdr_y2], radius=16, fill='#FFF5F2', outline='#B12704', width=2)
    draw.text((c3_x1 + 20, hdr_y1 + 12), "3. HYBRID RECOMMENDATION (TOP 4)", fill='#B12704', font=font_sec_hdr)
    draw.text((c3_x1 + 20, hdr_y1 + 44), "Hợp nhất thứ hạng Borda Count cân bằng đa chiều (50/50)", fill='#C2410C', font=font_sec_sub)

    # Helper function to draw a card
    card_start_y = 320
    card_h = 88
    card_spacing = 16

    # 5. Render Column 1 Cards (Content-Based)
    cb_items = [
        {"name": "Sách A", "sub": "Trọng tâm cốt truyện tương đồng cao", "score": "5 điểm", "rank": "#1", "both": True, "code": "A"},
        {"name": "Sách B", "sub": "Phong cách hành văn và thể loại cận kề", "score": "4 điểm", "rank": "#2", "both": True, "code": "B"},
        {"name": "Sách C", "sub": "Bối cảnh văn học tương cận", "score": "3 điểm", "rank": "#3", "both": True, "code": "C"},
        {"name": "Sách D", "sub": "Cùng tác giả / từ khóa liên quan", "score": "2 điểm", "rank": "#4", "both": False, "code": "D"},
        {"name": "Sách E", "sub": "Chủ đề tương đồng mức độ vừa", "score": "1 điểm", "rank": "#5", "both": False, "code": "E"},
    ]

    for i, it in enumerate(cb_items):
        cy1 = card_start_y + i * (card_h + card_spacing)
        cy2 = cy1 + card_h
        
        if it["both"]:
            fill_c = '#F0F7FF'
            border_c = '#2563EB'
            bw = 2
            rank_bg = '#2563EB'
            badge_bg = '#DBEAFE'
            badge_fg = '#1E40AF'
            badge_txt = "★ Giao thoa 2 danh sách"
        else:
            fill_c = '#FFFFFF'
            border_c = '#CBD5E1'
            bw = 1
            rank_bg = '#64748B'
            badge_bg = '#F1F5F9'
            badge_fg = '#475569'
            badge_txt = "Chỉ có ở Content-Based"

        draw.rounded_rectangle([c1_x1, cy1, c1_x2, cy2], radius=14, fill=fill_c, outline=border_c, width=bw)
        
        # Rank pill
        draw.rounded_rectangle([c1_x1 + 16, cy1 + 18, c1_x1 + 68, cy1 + 48], radius=8, fill=rank_bg)
        draw.text((c1_x1 + 25, cy1 + 22), it["rank"], fill='#FFFFFF', font=font_card_score_bold)

        # Title
        draw.text((c1_x1 + 84, cy1 + 17), it["name"], fill='#0F172A', font=font_card_title)
        draw.text((c1_x1 + 84, cy1 + 50), it["sub"], fill='#64748B', font=font_card_desc)

        # Score & Badge
        draw.text((c1_x2 - 130, cy1 + 18), it["score"], fill='#1D4ED8', font=font_card_score_bold)
        
        draw.rounded_rectangle([c1_x2 - 180, cy1 + 50, c1_x2 - 16, cy1 + 72], radius=6, fill=badge_bg, outline=border_c, width=1)
        draw.text((c1_x2 - 172, cy1 + 53), badge_txt, fill=badge_fg, font=font_badge)

    # 6. Render Column 2 Cards (Collaborative Filtering)
    cf_items = [
        {"name": "Sách C", "sub": "Được đông đảo độc giả cùng chấm 5 sao", "score": "5 điểm", "rank": "#1", "both": True, "code": "C"},
        {"name": "Sách A", "sub": "Hệ số tương quan đồng xuất hiện cao", "score": "4 điểm", "rank": "#2", "both": True, "code": "A"},
        {"name": "Sách F", "sub": "Khám phá bất ngờ từ bạn đọc cùng gu", "score": "3 điểm", "rank": "#3", "both": False, "code": "F", "special": True},
        {"name": "Sách B", "sub": "Tần suất tương tác chung tích cực", "score": "2 điểm", "rank": "#4", "both": True, "code": "B"},
        {"name": "Sách G", "sub": "Xuất hiện trong một số giỏ sách", "score": "1 điểm", "rank": "#5", "both": False, "code": "G"},
    ]

    for i, it in enumerate(cf_items):
        cy1 = card_start_y + i * (card_h + card_spacing)
        cy2 = cy1 + card_h

        if it["both"]:
            fill_c = '#F0FDF4'
            border_c = '#059669'
            bw = 2
            rank_bg = '#059669'
            badge_bg = '#D1FAE5'
            badge_fg = '#065F46'
            badge_txt = "★ Giao thoa 2 danh sách"
        elif it.get("special", False):
            fill_c = '#FFFBEB'
            border_c = '#D97706'
            bw = 2
            rank_bg = '#D97706'
            badge_bg = '#FEF3C7'
            badge_fg = '#92400E'
            badge_txt = "🌟 Thứ hạng cao ở CF (Độc lập)"
        else:
            fill_c = '#FFFFFF'
            border_c = '#CBD5E1'
            bw = 1
            rank_bg = '#64748B'
            badge_bg = '#F1F5F9'
            badge_fg = '#475569'
            badge_txt = "Chỉ có ở Collaborative"

        draw.rounded_rectangle([c2_x1, cy1, c2_x2, cy2], radius=14, fill=fill_c, outline=border_c, width=bw)

        # Rank pill
        draw.rounded_rectangle([c2_x1 + 16, cy1 + 18, c2_x1 + 68, cy1 + 48], radius=8, fill=rank_bg)
        draw.text((c2_x1 + 25, cy1 + 22), it["rank"], fill='#FFFFFF', font=font_card_score_bold)

        # Title
        draw.text((c2_x1 + 84, cy1 + 17), it["name"], fill='#0F172A', font=font_card_title)
        draw.text((c2_x1 + 84, cy1 + 50), it["sub"], fill='#64748B', font=font_card_desc)

        # Score & Badge
        draw.text((c2_x2 - 130, cy1 + 18), it["score"], fill='#047857', font=font_card_score_bold)

        draw.rounded_rectangle([c2_x2 - 200, cy1 + 50, c2_x2 - 16, cy1 + 72], radius=6, fill=badge_bg, outline=border_c, width=1)
        draw.text((c2_x2 - 192, cy1 + 53), badge_txt, fill=badge_fg, font=font_badge)

    # 7. Render Column 3 Cards (Hybrid Top 4)
    hybrid_items = [
        {
            "rank": "TOP 1",
            "name": "Sách A",
            "calc": "Score = (5 × 0.5) + (4 × 0.5) = 2.5 + 2.0",
            "total": "= 4.5 điểm",
            "origin": "Đồng thuận cao cả 2 nhánh (CB #1 & CF #2)",
            "crown": "Quán quân đề xuất ✨",
            "bg": '#FEF2F2',
            "border": '#B12704',
            "pill_bg": '#B12704'
        },
        {
            "rank": "TOP 2",
            "name": "Sách C",
            "calc": "Score = (3 × 0.5) + (5 × 0.5) = 1.5 + 2.5",
            "total": "= 4.0 điểm",
            "origin": "Đồng thuận cao cả 2 nhánh (CB #3 & CF #1)",
            "crown": "Á quân đề xuất ✨",
            "bg": '#FFF7ED',
            "border": '#EA580C',
            "pill_bg": '#EA580C'
        },
        {
            "rank": "TOP 3",
            "name": "Sách B",
            "calc": "Score = (4 × 0.5) + (2 × 0.5) = 2.0 + 1.0",
            "total": "= 3.0 điểm",
            "origin": "Đồng thuận cao cả 2 nhánh (CB #2 & CF #4)",
            "crown": "Hạng 3 đề xuất ✨",
            "bg": '#FFFBEB',
            "border": '#D97706',
            "pill_bg": '#D97706'
        },
        {
            "rank": "TOP 4",
            "name": "Sách F",
            "calc": "Score = (0 × 0.5) + (3 × 0.5) = 0.0 + 1.5",
            "total": "= 1.5 điểm",
            "origin": "Đột phá từ nhánh CF (CF #3, CB không có)",
            "crown": "Tính mới (Serendipity) 🌟",
            "bg": '#F0FDF4',
            "border": '#059669',
            "pill_bg": '#059669'
        },
    ]

    for i, it in enumerate(hybrid_items):
        cy1 = card_start_y + i * (card_h + card_spacing)
        cy2 = cy1 + card_h

        draw.rounded_rectangle([c3_x1, cy1, c3_x2, cy2], radius=14, fill=it["bg"], outline=it["border"], width=2)

        # Rank pill
        draw.rounded_rectangle([c3_x1 + 16, cy1 + 18, c3_x1 + 84, cy1 + 48], radius=8, fill=it["pill_bg"])
        draw.text((c3_x1 + 24, cy1 + 22), it["rank"], fill='#FFFFFF', font=font_card_score_bold)

        # Title
        draw.text((c3_x1 + 98, cy1 + 17), it["name"], fill='#0F172A', font=font_card_title)
        
        # Origin text
        draw.text((c3_x1 + 190, cy1 + 21), f"— {it['origin']}", fill='#475569', font=font_card_desc)

        # Calculation breakdown
        draw.text((c3_x1 + 98, cy1 + 50), it["calc"], fill='#334155', font=font_card_score)
        draw.text((c3_x1 + 480, cy1 + 49), it["total"], fill=it["border"], font=font_card_score_bold)

        # Crown tag
        draw.rounded_rectangle([c3_x2 - 170, cy1 + 16, c3_x2 - 16, cy1 + 42], radius=6, fill='#FFFFFF', outline=it["border"], width=1)
        draw.text((c3_x2 - 162, cy1 + 20), it["crown"], fill=it["border"], font=font_badge)

    # Cutoff line below Top 4
    cutoff_y = card_start_y + 4 * (card_h + card_spacing)
    draw.line([c3_x1, cutoff_y + 8, c3_x2, cutoff_y + 8], fill='#E11D48', width=2)
    
    cutoff_lbl = "▼  NGƯỠNG CẮT TOP 4 GỢI Ý (K = 4 ĐỀ XUẤT)  ▼"
    clb = font_badge.getbbox(cutoff_lbl)
    draw.rounded_rectangle([c3_x1 + (col_w - (clb[2] - clb[0]) - 30) // 2, cutoff_y - 2, c3_x1 + (col_w + (clb[2] - clb[0]) + 30) // 2, cutoff_y + 18], radius=6, fill='#FFE4E6', outline='#E11D48', width=1)
    draw.text((c3_x1 + (col_w - (clb[2] - clb[0])) // 2, cutoff_y + 1), cutoff_lbl, fill='#BE123C', font=font_badge)

    # Card for eliminated items
    cy1_elim = cutoff_y + 28
    cy2_elim = cy1_elim + 60
    draw.rounded_rectangle([c3_x1, cy1_elim, c3_x2, cy2_elim], radius=12, fill='#F8FAFC', outline='#94A3B8', width=1)
    draw.text((c3_x1 + 16, cy1_elim + 12), "Nhóm sách bị loại khỏi Top 4 do điểm thấp hơn:", fill='#475569', font=font_badge)
    elim_details = "• Sách D: 2 × 0.5 + 0 = 1.0 đ (Hạng 5)   |   • Sách E: 1 × 0.5 + 0 = 0.5 đ (Hạng 6)   |   • Sách G: 0 + 1 × 0.5 = 0.5 đ (Hạng 6)"
    draw.text((c3_x1 + 16, cy1_elim + 33), elim_details, fill='#64748B', font=font_card_desc)

    # 8. Draw visual connection lines between columns (Curved / flow ribbons)
    # Connector from Col 1 to Col 2 & Col 3
    # Sách A: Col 1 idx 0 -> Col 3 idx 0
    # Sách C: Col 2 idx 0 -> Col 3 idx 1
    # Sách B: Col 1 idx 1 -> Col 3 idx 2
    # Sách F: Col 2 idx 2 -> Col 3 idx 3
    
    # Elegant arrow drawing
    def draw_flow_arrow(x1, y1, x2, y2, color, width=2):
        # Draw smooth cubic bezier or multi-step line
        mid_x = (x1 + x2) // 2
        points = [(x1, y1), (mid_x, y1), (mid_x, y2), (x2, y2)]
        for p_idx in range(len(points) - 1):
            draw.line([points[p_idx], points[p_idx + 1]], fill=color, width=width)
        # Arrow head at (x2, y2)
        draw.polygon([(x2, y2), (x2 - 8, y2 - 5), (x2 - 8, y2 + 5)], fill=color)

    # Flow lines from Column 1 to Column 2 (intersection markers)
    # Just subtle connectors in the gaps:
    # Gap 1 (between Col 1 and Col 2):
    # A (CB #1: cy=364) to A (CF #2: cy=468)
    gap1_x = (c1_x2 + c2_x1) // 2
    draw.line([c1_x2, 364, gap1_x, 364], fill='#3B82F6', width=2)
    draw.line([gap1_x, 364, gap1_x, 468], fill='#3B82F6', width=2)
    draw.line([gap1_x, 468, c2_x1, 468], fill='#3B82F6', width=2)
    draw.polygon([(c2_x1, 468), (c2_x1 - 6, 464), (c2_x1 - 6, 472)], fill='#3B82F6')
    draw.rounded_rectangle([gap1_x - 35, 404, gap1_x + 35, 428], radius=6, fill='#EFF6FF', outline='#3B82F6', width=1)
    draw.text((gap1_x - 28, 408), "Khớp A", fill='#1D4ED8', font=font_badge)

    # C (CB #3: cy=572) to C (CF #1: cy=364)
    draw.line([c1_x2, 572, gap1_x + 15, 572], fill='#10B981', width=2)
    draw.line([gap1_x + 15, 572, gap1_x + 15, 364], fill='#10B981', width=2)
    draw.line([gap1_x + 15, 364, c2_x1, 364], fill='#10B981', width=2)
    draw.polygon([(c2_x1, 364), (c2_x1 - 6, 360), (c2_x1 - 6, 368)], fill='#10B981')
    draw.rounded_rectangle([gap1_x - 20, 480, gap1_x + 50, 504], radius=6, fill='#ECFDF5', outline='#10B981', width=1)
    draw.text((gap1_x - 13, 484), "Khớp C", fill='#047857', font=font_badge)

    # Gap 2 (between Col 2 and Col 3):
    # Flowing into Hybrid Top 4
    gap2_x = (c2_x2 + c3_x1) // 2
    # Flow from CF into Hybrid
    # Top 1 A:
    draw.line([c2_x2, 468, gap2_x, 468], fill='#B12704', width=2)
    draw.line([gap2_x, 468, gap2_x, 364], fill='#B12704', width=2)
    draw.line([gap2_x, 364, c3_x1, 364], fill='#B12704', width=2)
    draw.polygon([(c3_x1, 364), (c3_x1 - 6, 360), (c3_x1 - 6, 368)], fill='#B12704')

    # Top 2 C:
    draw.line([c2_x2, 364, gap2_x - 15, 364], fill='#EA580C', width=2)
    draw.line([gap2_x - 15, 364, gap2_x - 15, 468], fill='#EA580C', width=2)
    draw.line([gap2_x - 15, 468, c3_x1, 468], fill='#EA580C', width=2)
    draw.polygon([(c3_x1, 468), (c3_x1 - 6, 464), (c3_x1 - 6, 472)], fill='#EA580C')

    # Top 4 F:
    draw.line([c2_x2, 572, gap2_x, 572], fill='#059669', width=2)
    draw.line([gap2_x, 572, gap2_x, 676], fill='#059669', width=2)
    draw.line([gap2_x, 676, c3_x1, 676], fill='#059669', width=2)
    draw.polygon([(c3_x1, 676), (c3_x1 - 6, 672), (c3_x1 - 6, 680)], fill='#059669')

    # 9. Bottom Section: Comprehensive Analysis & Academic Insights (Y = 880 to 1480)
    bot_y1 = 880
    bot_y2 = 1475

    # Split bottom area into 2 cards:
    # Left Card: Summary Matrix Table of all 7 books (width 1100 px)
    tbl_x1 = 60
    tbl_x2 = 1180
    draw.rounded_rectangle([tbl_x1, bot_y1, tbl_x2, bot_y2], radius=18, fill='#FFFFFF', outline='#CBD5E1', width=2)

    # Title of table box
    draw.rounded_rectangle([tbl_x1, bot_y1, tbl_x2, bot_y1 + 48], radius=16, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.text((tbl_x1 + 20, bot_y1 + 14), "BẢNG ĐỐI CHIẾU MA TRẬN CHẤM ĐIỂM CHI TIẾT CẢ 7 TÁC PHẨM (A → G)", fill='#1E3A8A', font=font_insight_hdr)

    # Table headers
    cols_def = [
        ("Sách", 80),
        ("Hạng CB", 100),
        ("Điểm CB (×0.5)", 150),
        ("Hạng CF", 100),
        ("Điểm CF (×0.5)", 150),
        ("Điểm Hybrid", 130),
        ("Thứ hạng cuối", 150),
        ("Trạng thái", 220)
    ]

    t_y = bot_y1 + 56
    row_h = 42

    # Draw table header row
    draw.rectangle([tbl_x1 + 15, t_y, tbl_x2 - 15, t_y + row_h], fill='#EFF6FF')
    draw.line([tbl_x1 + 15, t_y + row_h, tbl_x2 - 15, t_y + row_h], fill='#93C5FD', width=1)

    cur_x = tbl_x1 + 25
    for c_title, c_w in cols_def:
        draw.text((cur_x, t_y + 11), c_title, fill='#1E40AF', font=font_tbl_hdr)
        cur_x += c_w

    # Table rows
    table_rows = [
        ("Sách A", "Rank #1", "5 × 0.5 = 2.5", "Rank #2", "4 × 0.5 = 2.0", "4.5 điểm", "Hạng 1 ★", "Lọt Top 4 (Quán quân)", '#FEF2F2', '#B12704', True),
        ("Sách C", "Rank #3", "3 × 0.5 = 1.5", "Rank #1", "5 × 0.5 = 2.5", "4.0 điểm", "Hạng 2 ★", "Lọt Top 4 (Á quân)", '#FFF7ED', '#EA580C', True),
        ("Sách B", "Rank #2", "4 × 0.5 = 2.0", "Rank #4", "2 × 0.5 = 1.0", "3.0 điểm", "Hạng 3 ★", "Lọt Top 4 (Hạng 3)", '#FFFBEB', '#D97706', True),
        ("Sách F", "Không có", "0 × 0.5 = 0.0", "Rank #3", "3 × 0.5 = 1.5", "1.5 điểm", "Hạng 4 ★", "Lọt Top 4 (Khám phá mới)", '#F0FDF4', '#059669', True),
        ("Sách D", "Rank #4", "2 × 0.5 = 1.0", "Không có", "0 × 0.5 = 0.0", "1.0 điểm", "Hạng 5", "Bị loại (Thiếu 0.5đ)", '#FFFFFF', '#64748B', False),
        ("Sách E", "Rank #5", "1 × 0.5 = 0.5", "Không có", "0 × 0.5 = 0.0", "0.5 điểm", "Hạng 6", "Bị loại", '#FFFFFF', '#64748B', False),
        ("Sách G", "Không có", "0 × 0.5 = 0.0", "Rank #5", "1 × 0.5 = 0.5", "0.5 điểm", "Hạng 6", "Bị loại", '#FFFFFF', '#64748B', False),
    ]

    for r_idx, r_data in enumerate(table_rows):
        ry = t_y + (r_idx + 1) * row_h
        
        # Row background
        if r_data[10]:
            draw.rectangle([tbl_x1 + 15, ry, tbl_x2 - 15, ry + row_h], fill=r_data[8])
        draw.line([tbl_x1 + 15, ry + row_h, tbl_x2 - 15, ry + row_h], fill='#E2E8F0', width=1)

        cur_x = tbl_x1 + 25
        # Sách
        draw.text((cur_x, ry + 11), r_data[0], fill='#0F172A', font=font_tbl_cell_b)
        cur_x += cols_def[0][1]
        # Rank CB
        draw.text((cur_x, ry + 11), r_data[1], fill='#334155', font=font_tbl_cell)
        cur_x += cols_def[1][1]
        # Điểm CB
        draw.text((cur_x, ry + 11), r_data[2], fill='#1D4ED8', font=font_tbl_cell)
        cur_x += cols_def[2][1]
        # Rank CF
        draw.text((cur_x, ry + 11), r_data[3], fill='#334155', font=font_tbl_cell)
        cur_x += cols_def[3][1]
        # Điểm CF
        draw.text((cur_x, ry + 11), r_data[4], fill='#047857', font=font_tbl_cell)
        cur_x += cols_def[4][1]
        # Điểm Hybrid
        draw.text((cur_x, ry + 11), r_data[5], fill=r_data[9], font=font_tbl_cell_b)
        cur_x += cols_def[5][1]
        # Thứ hạng cuối
        draw.text((cur_x, ry + 11), r_data[6], fill=r_data[9], font=font_tbl_cell_b)
        cur_x += cols_def[6][1]
        # Trạng thái
        draw.text((cur_x, ry + 11), r_data[7], fill='#475569', font=font_tbl_cell)

    # Footnote below table
    draw.text((tbl_x1 + 25, bot_y2 - 70), "Ghi chú công thức:", fill='#1E3A8A', font=font_badge)
    draw.text((tbl_x1 + 25, bot_y2 - 48), "• Điểm nhánh = (P - rank). Nếu sách không nằm trong Top P của nhánh đó, điểm nhánh = 0.", fill='#64748B', font=font_card_desc)
    draw.text((tbl_x1 + 25, bot_y2 - 28), "• Điểm Hybrid = 0.5 × Điểm_CB + 0.5 × Điểm_CF. Sắp xếp giảm dần để chọn ra K = 4 cuốn xuất sắc nhất.", fill='#64748B', font=font_card_desc)

    # Right Card: Three Core Architectural Principles (width 1100 px)
    ins_x1 = 1220
    ins_x2 = w - 60
    draw.rounded_rectangle([ins_x1, bot_y1, ins_x2, bot_y2], radius=18, fill='#FFFFFF', outline='#CBD5E1', width=2)

    # Title of insights box
    draw.rounded_rectangle([ins_x1, bot_y1, ins_x2, bot_y1 + 48], radius=16, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.text((ins_x1 + 20, bot_y1 + 14), "3 NGUYÊN LÝ KHOA HỌC THEN CHỐT CỦA THUẬT TOÁN BORDA COUNT FUSION", fill='#B12704', font=font_insight_hdr)

    # Principle 1
    p1_y = bot_y1 + 65
    draw.rounded_rectangle([ins_x1 + 20, p1_y, ins_x2 - 20, p1_y + 155], radius=12, fill='#EFF6FF', outline='#BFDBFE', width=1)
    draw.text((ins_x1 + 35, p1_y + 12), "1. Hiệu ứng cộng hưởng đồng thuận (Consensus Boosting)", fill='#1E40AF', font=font_insight_hdr)
    p1_text = (
        "• Các tác phẩm có mặt đồng thời trong cả hai danh sách (A, B, C) nhận được điểm số tích lũy từ cả\n"
        "  hai nhánh độc lập, tạo nên sức bật thứ hạng vượt trội và chiếm trọn 3 vị trí dẫn đầu (4.5đ, 4.0đ, 3.0đ).\n"
        "• Điều này phản ánh chính xác nguyên lý: Cuốn sách vừa tương đồng sâu sắc về nội dung (Content),\n"
        "  vừa được cộng đồng bạn đọc cùng gu tán thưởng nhiệt liệt (Collaborative) luôn là đề xuất đáng giá nhất."
    )
    draw.text((ins_x1 + 35, p1_y + 42), p1_text, fill='#1E293B', font=font_insight_body)

    # Principle 2
    p2_y = p1_y + 172
    draw.rounded_rectangle([ins_x1 + 20, p2_y, ins_x2 - 20, p2_y + 155], radius=12, fill='#F0FDF4', outline='#BBF7D0', width=1)
    draw.text((ins_x1 + 35, p2_y + 12), "2. Bảo tồn tính đa dạng và bất ngờ (Serendipity Preservation)", fill='#15803D', font=font_insight_hdr)
    p2_text = (
        "• Sách F dù chỉ xuất hiện ở một nhánh duy nhất (Collaborative Filtering), hoàn toàn vắng mặt ở nhánh kia,\n"
        "  nhưng nhờ xếp hạng xuất sắc (#3, đạt 3 điểm) nên điểm quy đổi Hybrid đạt 1.5 điểm.\n"
        "• Mức điểm 1.5 này vượt qua sách D (chỉ đạt 1.0 điểm từ Content-Based), giúp sách F lọt vào Top 4!\n"
        "• Cơ chế này mở ra cơ hội cho các tác phẩm bất ngờ, chống lại hiện tượng rập khuôn (Over-specialization)."
    )
    draw.text((ins_x1 + 35, p2_y + 42), p2_text, fill='#1E293B', font=font_insight_body)

    # Principle 3
    p3_y = p2_y + 172
    draw.rounded_rectangle([ins_x1 + 20, p3_y, ins_x2 - 20, p3_y + 155], radius=12, fill='#FFF5F2', outline='#FECDD3', width=1)
    draw.text((ins_x1 + 35, p3_y + 12), "3. Triệt tiêu hoàn toàn độ lệch thang đo (Scale Invariance)", fill='#991B1B', font=font_insight_hdr)
    p3_text = (
        "• Khoảng cách Cosine trong pgvector dao động từ [0, 2], trong khi hệ số Ochiai dao động từ [0, 1].\n"
        "  Nếu cộng trực tiếp điểm số thực tế, một giải thuật sẽ dễ dàng lấn át giải thuật còn lại.\n"
        "• Borda Count chuyển đổi thứ hạng sang điểm phân hạng số học công bằng (P - Rank), đảm bảo quyền số\n"
        "  của hai mô hình được chuẩn hóa tuyệt đối trước khi nhân với trọng số điều phối alpha (α = 0.5)."
    )
    draw.text((ins_x1 + 35, p3_y + 42), p3_text, fill='#1E293B', font=font_insight_body)

    # Save to all target paths
    for p in output_png_paths:
        os.makedirs(os.path.dirname(os.path.abspath(p)), exist_ok=True)
        img.save(p, dpi=(300, 300))
        print(f"[SUCCESS] Đã xuất ảnh Borda Diagram tại: {p}")

if __name__ == "__main__":
    targets = [
        "So_do_Borda_Count_Fusion.png",
        "Final Report/So_do_Borda_Count_Fusion.png",
        "Final Report/Hinh_2_Borda_Count_Fusion.png",
        "C:/Users/trang/.gemini/antigravity/brain/d2eea2e0-4756-4804-9912-799784a51bf6/So_do_Borda_Count_Fusion.png"
    ]
    create_borda_diagram(targets)

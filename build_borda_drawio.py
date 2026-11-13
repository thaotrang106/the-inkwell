import os
import xml.etree.ElementTree as ET

def build_borda_drawio(output_paths):
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='24.0.0')
    diagram = ET.SubElement(mxfile, 'diagram', id='Borda_Count_Fusion_Diagram', name='Cơ chế Tổng hợp Borda Count Fusion')
    mxGraphModel = ET.SubElement(
        diagram, 'mxGraphModel',
        dx='1600', dy='1200', grid='1', gridSize='10',
        guides='1', tooltips='1', connect='1', arrows='1', fold='1',
        page='1', pageScale='1', pageWidth='1750', pageHeight='1200',
        math='0', shadow='0'
    )
    root = ET.SubElement(mxGraphModel, 'root')
    
    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')
    
    def add_node(id, value, style, x, y, w, h, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=str(id), parent=str(parent), style=style, vertex='1', value=str(value))
        ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h), attrib={'as': 'geometry'})
        return cell

    def add_edge(id, value, style, source=None, target=None, points=None, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=str(id), parent=str(parent), style=style, edge='1', value=str(value))
        if source:
            cell.attrib['source'] = str(source)
        if target:
            cell.attrib['target'] = str(target)
        geom = ET.SubElement(cell, 'mxGeometry', attrib={'relative': '1', 'as': 'geometry'})
        if points:
            arr = ET.SubElement(geom, 'Array', attrib={'as': 'points'})
            for px, py in points:
                ET.SubElement(arr, 'mxPoint', x=str(px), y=str(py))
        return cell

    # 1. Canvas outer frame
    frame_style = "rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=2;shadow=0;"
    add_node('canvas_frame', '', frame_style, 20, 15, 1710, 1150)

    # 2. Main Title
    title_style = "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Times New Roman;fontStyle=1;fontSize=23;fontColor=#1E3A8A;"
    add_node('title', 'SƠ ĐỒ CƠ CHẾ TỔNG HỢP ĐIỂM THEO THUẬT TOÁN HYBRID BORDA COUNT FUSION', title_style, 220, 28, 1310, 35)

    # Subtitle
    sub_style = "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Times New Roman;fontStyle=2;fontSize=14;fontColor=#475569;"
    add_node('subtitle', 'Minh họa quy tắc xếp hạng Borda Count với P = 5 ứng viên đầu vào, hệ số cân bằng α = 0.5 (Tác phẩm ký hiệu từ A đến G)', sub_style, 320, 64, 1110, 25)

    # 3. Banner KPI / 3 Formulas & Rules
    kpi1_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#3B82F6;strokeWidth=1.5;fontSize=12;fontColor=#1E3A8A;fontFamily=Segoe UI;align=center;verticalAlign=middle;"
    add_node('kpi_borda', '<b>• Điểm nhánh Borda:</b> Score = P - Rank (Hạng 1 = 5 điểm, Hạng 5 = 1 điểm)', kpi1_style, 45, 98, 520, 44)

    kpi2_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#FFF5F2;strokeColor=#B12704;strokeWidth=1.5;fontSize=12;fontColor=#B12704;fontFamily=Segoe UI;align=center;verticalAlign=middle;"
    add_node('kpi_hybrid', '<b>• Công thức Hybrid:</b> Score_Hybrid = 0.5 × Score_CB + 0.5 × Score_CF', kpi2_style, 585, 98, 540, 44)

    kpi3_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#059669;strokeWidth=1.5;fontSize=12;fontColor=#065F46;fontFamily=Segoe UI;align=center;verticalAlign=middle;"
    add_node('kpi_legend', '<b>• Quy ước:</b> Thẻ viền xanh/đậm là sách có mặt ở CẢ HAI danh sách (Giao thoa)', kpi3_style, 1145, 98, 560, 44)

    # Columns Geometry
    col_w = 480
    c1_x = 55
    c2_x = 625
    c3_x = 1195

    # Column 1 Header: Content-Based
    c1_hdr_style = "rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#3B82F6;strokeWidth=2;align=left;spacingLeft=15;fontFamily=Segoe UI;"
    c1_hdr_val = "<b>1. NHÁNH CONTENT-BASED (pgvector)</b><br><font color='#2563EB' size='2'>Khoảng cách Cosine trên Vector 768 chiều (Score = P - Rank)</font>"
    add_node('hdr_cb', c1_hdr_val, c1_hdr_style, c1_x, 158, col_w, 54)

    # Column 2 Header: Collaborative Filtering
    c2_hdr_style = "rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#10B981;strokeWidth=2;align=left;spacingLeft=15;fontFamily=Segoe UI;"
    c2_hdr_val = "<b>2. NHÁNH COLLABORATIVE (Ochiai)</b><br><font color='#059669' size='2'>Hệ số tương quan đồng xuất hiện cộng đồng (Score = P - Rank)</font>"
    add_node('hdr_cf', c2_hdr_val, c2_hdr_style, c2_x, 158, col_w, 54)

    # Column 3 Header: Hybrid Fusion
    c3_hdr_style = "rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#FFF5F2;strokeColor=#B12704;strokeWidth=2;align=left;spacingLeft=15;fontFamily=Segoe UI;"
    c3_hdr_val = "<b>3. HYBRID RECOMMENDATION (TOP 4)</b><br><font color='#C2410C' size='2'>Hợp nhất thứ hạng Borda Count cân bằng đa chiều (50/50)</font>"
    add_node('hdr_hb', c3_hdr_val, c3_hdr_style, c3_x, 158, col_w, 54)

    # Card layout parameters
    start_y = 226
    card_h = 68
    card_step = 80

    # ==================== COLUMN 1: Content-Based Cards ====================
    cb_items = [
        ("cb_1", "Sách A", "Trọng tâm cốt truyện tương đồng cao", "5 điểm", "#1", True),
        ("cb_2", "Sách B", "Phong cách văn học và thể loại cận kề", "4 điểm", "#2", True),
        ("cb_3", "Sách C", "Bối cảnh văn học tương cận", "3 điểm", "#3", True),
        ("cb_4", "Sách D", "Cùng tác giả / từ khóa liên quan", "2 điểm", "#4", False),
        ("cb_5", "Sách E", "Chủ đề tương đồng mức độ vừa", "1 điểm", "#5", False),
    ]

    for i, (cid, name, sub, sc, rk, is_both) in enumerate(cb_items):
        y = start_y + i * card_step
        if is_both:
            c_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#F0F7FF;strokeColor=#2563EB;strokeWidth=2;"
            badge_bg = "#2563EB"
            tag_html = "<span style='background-color:#DBEAFE; color:#1E40AF; padding:2px 6px; font-size:10px; font-weight:bold;'>★ Giao thoa</span>"
        else:
            c_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1;"
            badge_bg = "#64748B"
            tag_html = "<span style='background-color:#F1F5F9; color:#64748B; padding:2px 6px; font-size:10px;'>Chỉ có CB</span>"

        # Main Card Box
        add_node(cid, '', c_style, c1_x, y, col_w, card_h)

        # Rank Badge Box
        rk_style = f"rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor={badge_bg};strokeColor=none;fontFamily=Segoe UI;fontStyle=1;fontSize=13;fontColor=#FFFFFF;align=center;verticalAlign=middle;"
        add_node(f"{cid}_rk", rk, rk_style, c1_x + 12, y + 16, 42, 36)

        # Book Title & Subtitle
        info_style = "text;html=1;align=left;verticalAlign=middle;resizable=0;points=[];strokeColor=none;fillColor=none;fontFamily=Segoe UI;"
        info_val = f"<b style='font-size:15px; color:#0F172A;'>{name}</b><br><font color='#64748B' style='font-size:11px;'>{sub}</font>"
        add_node(f"{cid}_info", info_val, info_style, c1_x + 62, y + 9, 275, 50)

        # Score & Tag
        score_style = "text;html=1;align=right;verticalAlign=middle;resizable=0;points=[];strokeColor=none;fillColor=none;fontFamily=Segoe UI;"
        score_val = f"<b style='font-size:16px; color:#1D4ED8; font-family:Consolas;'>{sc}</b><br>{tag_html}"
        add_node(f"{cid}_sc", score_val, score_style, c1_x + 340, y + 9, 128, 50)

    # ==================== COLUMN 2: Collaborative Filtering Cards ====================
    cf_items = [
        ("cf_1", "Sách C", "Được đông đảo độc giả cùng chấm 5 sao", "5 điểm", "#1", True, False),
        ("cf_2", "Sách A", "Hệ số tương quan đồng xuất hiện cao", "4 điểm", "#2", True, False),
        ("cf_3", "Sách F", "Khám phá bất ngờ từ bạn đọc cùng gu", "3 điểm", "#3", False, True),
        ("cf_4", "Sách B", "Tần suất tương tác chung tích cực", "2 điểm", "#4", True, False),
        ("cf_5", "Sách G", "Xuất hiện trong một số giỏ sách", "1 điểm", "#5", False, False),
    ]

    for i, (cid, name, sub, sc, rk, is_both, is_spec) in enumerate(cf_items):
        y = start_y + i * card_step
        if is_both:
            c_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#059669;strokeWidth=2;"
            badge_bg = "#059669"
            tag_html = "<span style='background-color:#D1FAE5; color:#065F46; padding:2px 6px; font-size:10px; font-weight:bold;'>★ Giao thoa</span>"
        elif is_spec:
            c_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#FFFBEB;strokeColor=#D97706;strokeWidth=2;"
            badge_bg = "#D97706"
            tag_html = "<span style='background-color:#FEF3C7; color:#92400E; padding:2px 6px; font-size:10px; font-weight:bold;'>🌟 Đột phá CF</span>"
        else:
            c_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1;"
            badge_bg = "#64748B"
            tag_html = "<span style='background-color:#F1F5F9; color:#64748B; padding:2px 6px; font-size:10px;'>Chỉ có CF</span>"

        # Main Card Box
        add_node(cid, '', c_style, c2_x, y, col_w, card_h)

        # Rank Badge Box
        rk_style = f"rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor={badge_bg};strokeColor=none;fontFamily=Segoe UI;fontStyle=1;fontSize=13;fontColor=#FFFFFF;align=center;verticalAlign=middle;"
        add_node(f"{cid}_rk", rk, rk_style, c2_x + 12, y + 16, 42, 36)

        # Book Title & Subtitle
        info_style = "text;html=1;align=left;verticalAlign=middle;resizable=0;points=[];strokeColor=none;fillColor=none;fontFamily=Segoe UI;"
        info_val = f"<b style='font-size:15px; color:#0F172A;'>{name}</b><br><font color='#64748B' style='font-size:11px;'>{sub}</font>"
        add_node(f"{cid}_info", info_val, info_style, c2_x + 62, y + 9, 275, 50)

        # Score & Tag
        score_style = "text;html=1;align=right;verticalAlign=middle;resizable=0;points=[];strokeColor=none;fillColor=none;fontFamily=Segoe UI;"
        score_val = f"<b style='font-size:16px; color:#047857; font-family:Consolas;'>{sc}</b><br>{tag_html}"
        add_node(f"{cid}_sc", score_val, score_style, c2_x + 340, y + 9, 128, 50)

    # ==================== COLUMN 3: Hybrid Top 4 Recommendations ====================
    hb_items = [
        ("hb_1", "Sách A", "Score = 5×0.5 + 4×0.5 = 2.5 + 2.0", "= 4.5 đ", "TOP 1", "Đồng thuận cả 2 nhánh (CB #1, CF #2)", "#B12704", "#FEF2F2", "Quán quân ✨"),
        ("hb_2", "Sách C", "Score = 3×0.5 + 5×0.5 = 1.5 + 2.5", "= 4.0 đ", "TOP 2", "Đồng thuận cả 2 nhánh (CB #3, CF #1)", "#EA580C", "#FFF7ED", "Á quân ✨"),
        ("hb_3", "Sách B", "Score = 4×0.5 + 2×0.5 = 2.0 + 1.0", "= 3.0 đ", "TOP 3", "Đồng thuận cả 2 nhánh (CB #2, CF #4)", "#D97706", "#FFFBEB", "Hạng 3 ✨"),
        ("hb_4", "Sách F", "Score = 0×0.5 + 3×0.5 = 0.0 + 1.5", "= 1.5 đ", "TOP 4", "Đột phá nhánh CF (CF #3, CB không có)", "#059669", "#F0FDF4", "Khám phá mới 🌟"),
    ]

    for i, (cid, name, calc, sc, rk, orig, clr, bg, crown) in enumerate(hb_items):
        y = start_y + i * card_step
        c_style = f"rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor={bg};strokeColor={clr};strokeWidth=2;"

        # Main Card Box
        add_node(cid, '', c_style, c3_x, y, col_w, card_h)

        # Rank Badge Box
        rk_style = f"rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor={clr};strokeColor=none;fontFamily=Segoe UI;fontStyle=1;fontSize=12;fontColor=#FFFFFF;align=center;verticalAlign=middle;"
        add_node(f"{cid}_rk", rk, rk_style, c3_x + 10, y + 16, 54, 36)

        # Book Title & Formula
        info_style = "text;html=1;align=left;verticalAlign=middle;resizable=0;points=[];strokeColor=none;fillColor=none;fontFamily=Segoe UI;"
        info_val = f"<b style='font-size:15px; color:#0F172A;'>{name}</b> <font color='#475569' style='font-size:11px;'>— {orig}</font><br><font color='#334155' style='font-family:Consolas; font-size:11.5px;'>{calc}</font>"
        add_node(f"{cid}_info", info_val, info_style, c3_x + 70, y + 9, 290, 50)

        # Score & Crown
        score_style = "text;html=1;align=right;verticalAlign=middle;resizable=0;points=[];strokeColor=none;fillColor=none;fontFamily=Segoe UI;"
        score_val = f"<b style='font-size:16px; color:{clr}; font-family:Consolas;'>{sc}</b><br><span style='background-color:#FFFFFF; color:{clr}; border:1px solid {clr}; padding:1px 5px; font-size:10px; font-weight:bold;'>{crown}</span>"
        add_node(f"{cid}_sc", score_val, score_style, c3_x + 360, y + 9, 110, 50)

    # Cutoff divider line
    cutoff_y = start_y + 4 * card_step - 3
    cutoff_line_style = "strokeColor=#E11D48;strokeWidth=2;dashed=1;html=1;"
    add_node('cutoff_line', '', cutoff_line_style, c3_x, cutoff_y, col_w, 1)

    cutoff_badge_style = "rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#FFE4E6;strokeColor=#E11D48;strokeWidth=1;fontFamily=Segoe UI;fontSize=10;fontStyle=1;fontColor=#BE123C;align=center;verticalAlign=middle;"
    add_node('cutoff_badge', '▼ NGƯỠNG CẮT TOP 4 GỢI Ý (K = 4) ▼', cutoff_badge_style, c3_x + 125, cutoff_y - 11, 230, 22)

    # Eliminated items card
    elim_style = "rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;strokeWidth=1;align=left;spacingLeft=12;fontFamily=Segoe UI;"
    elim_val = "<b>Nhóm sách bị loại khỏi Top 4 do tổng điểm thấp hơn:</b><br><font color='#64748B' size='2'>• Sách D: 2×0.5 + 0 = 1.0 đ (Hạng 5) &nbsp;|&nbsp; • Sách E: 1×0.5 + 0 = 0.5 đ (Hạng 6) &nbsp;|&nbsp; • Sách G: 0 + 1×0.5 = 0.5 đ (Hạng 6)</font>"
    add_node('elim_card', elim_val, elim_style, c3_x, cutoff_y + 18, col_w, 52)

    # ==================== CONNECTOR ARROWS ====================
    # 1. Edge cb_1 -> cf_2 (Match Book A)
    edge_a_style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563EB;strokeWidth=2;fontSize=11;fontColor=#1E40AF;fontStyle=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
    add_edge('e_a_match', 'Khớp Sách A', edge_a_style, source='cb_1', target='cf_2')

    # 2. Edge cb_3 -> cf_1 (Match Book C)
    edge_c_style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#059669;strokeWidth=2;fontSize=11;fontColor=#065F46;fontStyle=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
    add_edge('e_c_match', 'Khớp Sách C', edge_c_style, source='cb_3', target='cf_1')

    # 3. Edge cf_2 -> hb_1 (Fuse Book A)
    edge_hb_a = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#B12704;strokeWidth=2.5;fontSize=11;fontColor=#B12704;fontStyle=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
    add_edge('e_cf_hb1', 'Tổng hợp A', edge_hb_a, source='cf_2', target='hb_1')

    # 4. Edge cf_1 -> hb_2 (Fuse Book C)
    edge_hb_c = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#EA580C;strokeWidth=2.5;fontSize=11;fontColor=#EA580C;fontStyle=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
    add_edge('e_cf_hb2', 'Tổng hợp C', edge_hb_c, source='cf_1', target='hb_2')

    # 5. Edge cf_3 -> hb_4 (Breakthrough Book F)
    edge_hb_f = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#059669;strokeWidth=2;dashed=1;fontSize=11;fontColor=#065F46;fontStyle=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
    add_edge('e_cf_hb4', 'Đột phá F', edge_hb_f, source='cf_3', target='hb_4')

    # ==================== BOTTOM AREA: Academic Table & Insights ====================
    bot_y = 650
    bot_h = 475

    # --- BOTTOM LEFT: Score Matrix Table Grid ---
    tbl_card_style = "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.5;"
    add_node('tbl_container', '', tbl_card_style, 45, bot_y, 800, bot_h)

    # Table Title
    tbl_title_style = "text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;fontFamily=Segoe UI;fontStyle=1;fontSize=14;fontColor=#1E3A8A;"
    add_node('tbl_title', 'BẢNG ĐỐI CHIẾU MA TRẬN CHẤM ĐIỂM CHI TIẾT CẢ 7 TÁC PHẨM (A → G)', tbl_title_style, 60, bot_y + 12, 770, 24)

    # Table Grid Columns Definition
    cols = [
        ("Tác phẩm", 90),
        ("Rank CB", 75),
        ("Điểm CB (×0.5)", 105),
        ("Rank CF", 75),
        ("Điểm CF (×0.5)", 105),
        ("Điểm Hybrid", 100),
        ("Thứ hạng", 90),
        ("Kết quả gợi ý", 160)
    ]
    t_start_x = 60
    t_start_y = bot_y + 42
    hdr_h = 32
    row_h = 30

    # Render Header Row
    cur_x = t_start_x
    for c_idx, (col_name, col_w_i) in enumerate(cols):
        h_style = "rounded=0;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#93C5FD;strokeWidth=1;fontSize=11;fontStyle=1;fontColor=#1E40AF;fontFamily=Segoe UI;align=center;verticalAlign=middle;"
        add_node(f"th_{c_idx}", col_name, h_style, cur_x, t_start_y, col_w_i, hdr_h)
        cur_x += col_w_i

    # Table Rows Data
    table_rows = [
        ("Sách A", "Rank #1", "5 × 0.5 = 2.5", "Rank #2", "4 × 0.5 = 2.0", "4.5 đ", "Hạng 1 ★", "Lọt Top 4 (Quán quân)", "#FEF2F2", "#B12704", True),
        ("Sách C", "Rank #3", "3 × 0.5 = 1.5", "Rank #1", "5 × 0.5 = 2.5", "4.0 đ", "Hạng 2 ★", "Lọt Top 4 (Á quân)", "#FFF7ED", "#EA580C", True),
        ("Sách B", "Rank #2", "4 × 0.5 = 2.0", "Rank #4", "2 × 0.5 = 1.0", "3.0 đ", "Hạng 3 ★", "Lọt Top 4 (Hạng 3)", "#FFFBEB", "#D97706", True),
        ("Sách F", "Không có", "0 × 0.5 = 0.0", "Rank #3", "3 × 0.5 = 1.5", "1.5 đ", "Hạng 4 ★", "Lọt Top 4 (Khám phá)", "#F0FDF4", "#059669", True),
        ("Sách D", "Rank #4", "2 × 0.5 = 1.0", "Không có", "0 × 0.5 = 0.0", "1.0 đ", "Hạng 5", "Bị loại (Thiếu 0.5đ)", "#FFFFFF", "#475569", False),
        ("Sách E", "Rank #5", "1 × 0.5 = 0.5", "Không có", "0 × 0.5 = 0.0", "0.5 đ", "Hạng 6", "Bị loại", "#FFFFFF", "#64748B", False),
        ("Sách G", "Không có", "0 × 0.5 = 0.0", "Rank #5", "1 × 0.5 = 0.5", "0.5 đ", "Hạng 6", "Bị loại", "#FFFFFF", "#64748B", False),
    ]

    for r_idx, row in enumerate(table_rows):
        r_y = t_start_y + hdr_h + r_idx * row_h
        cur_x = t_start_x
        row_cells = row[:8]
        row_bg = row[8]
        row_fg = row[9]
        is_bold = row[10]
        
        for c_idx, cell_val in enumerate(row_cells):
            col_w_i = cols[c_idx][1]
            b_tag = "<b>" if is_bold else ""
            b_end = "</b>" if is_bold else ""
            
            # Specific color styling for scores
            if c_idx == 2:
                c_val_styled = f"<font color='#1D4ED8'>{cell_val}</font>"
            elif c_idx == 4:
                c_val_styled = f"<font color='#047857'>{cell_val}</font>"
            elif c_idx >= 5:
                c_val_styled = f"{b_tag}<font color='{row_fg}'>{cell_val}</font>{b_end}"
            else:
                c_val_styled = f"{b_tag}<font color='{row_fg}'>{cell_val}</font>{b_end}" if (is_bold and c_idx == 0) else cell_val

            td_style = f"rounded=0;whiteSpace=wrap;html=1;fillColor={row_bg};strokeColor=#E2E8F0;strokeWidth=1;fontSize=11;fontFamily=Segoe UI;align=center;verticalAlign=middle;"
            add_node(f"td_{r_idx}_{c_idx}", c_val_styled, td_style, cur_x, r_y, col_w_i, row_h)
            cur_x += col_w_i

    # Note Box below Table
    note_y = t_start_y + hdr_h + len(table_rows) * row_h + 12
    note_style = "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1;align=left;spacingLeft=12;spacingRight=12;fontFamily=Segoe UI;"
    note_val = (
        "<b>• Quy tắc tính:</b> Điểm nhánh = P - rank. Nếu sách không có trong top P đầu vào, điểm nhánh = 0.<br>"
        "<b>• Điểm Hybrid:</b> 0.5 × Điểm CB + 0.5 × Điểm CF. Sắp xếp giảm dần theo điểm để chọn Top K = 4 cuốn xuất sắc nhất."
    )
    add_node('tbl_note', note_val, note_style, 60, note_y, 770, 52)

    # --- BOTTOM RIGHT: 3 Scientific Principles ---
    ins_card_style = "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.5;"
    add_node('ins_container', '', ins_card_style, 865, bot_y, 840, bot_h)

    # Insights Title
    ins_title_style = "text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;fontFamily=Segoe UI;fontStyle=1;fontSize=14;fontColor=#B12704;"
    add_node('ins_title', '3 NGUYÊN LÝ KHOA HỌC THEN CHỐT CỦA THUẬT TOÁN BORDA COUNT FUSION', ins_title_style, 880, bot_y + 12, 810, 24)

    # Principle 1: Consensus Boosting
    p1_style = "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#BFDBFE;strokeWidth=1.5;align=left;spacingLeft=14;spacingRight=14;spacingTop=6;spacingBottom=6;fontFamily=Segoe UI;"
    p1_val = (
        "<b style='font-size:12.5px; color:#1E40AF;'>1. Hiệu ứng cộng hưởng đồng thuận (Consensus Boosting)</b><br>"
        "<font color='#1E293B' style='font-size:11px; line-height:1.35;'>"
        "Các tác phẩm xuất hiện trong cả hai danh sách (A, B, C) nhận được điểm cộng dồn từ cả hai mô hình độc lập, "
        "tạo nên sức bật thứ hạng vượt trội và chiếm trọn 3 vị trí dẫn đầu (4.5đ, 4.0đ, 3.0đ). Điều này đảm bảo những tác phẩm "
        "vừa có cốt truyện tương đồng, vừa được bạn đọc cùng gu yêu thích luôn được ưu tiên đề xuất hàng đầu."
        "</font>"
    )
    add_node('ins_p1', p1_val, p1_style, 880, bot_y + 44, 810, 118)

    # Principle 2: Serendipity Preservation
    p2_style = "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#BBF7D0;strokeWidth=1.5;align=left;spacingLeft=14;spacingRight=14;spacingTop=6;spacingBottom=6;fontFamily=Segoe UI;"
    p2_val = (
        "<b style='font-size:12.5px; color:#15803D;'>2. Bảo tồn tính đa dạng và khám phá mới (Serendipity Preservation)</b><br>"
        "<font color='#1E293B' style='font-size:11px; line-height:1.35;'>"
        "Sách F dù chỉ xuất hiện ở một nhánh duy nhất (Collaborative Filtering), nhưng nhờ có thứ hạng tốt (#3 với 3 điểm) nên "
        "điểm quy đổi Hybrid đạt 1.5 điểm, vượt qua sách D (chỉ 1.0 điểm) để giành suất vào Top 4. Cơ chế này chống lại hiện tượng "
        "rập khuôn (Over-specialization) của Content-Based, mang lại sự ngạc nhiên thú vị cho người đọc."
        "</font>"
    )
    add_node('ins_p2', p2_val, p2_style, 880, bot_y + 172, 810, 118)

    # Principle 3: Scale Invariance
    p3_style = "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFF5F2;strokeColor=#FECDD3;strokeWidth=1.5;align=left;spacingLeft=14;spacingRight=14;spacingTop=6;spacingBottom=6;fontFamily=Segoe UI;"
    p3_val = (
        "<b style='font-size:12.5px; color:#991B1B;'>3. Triệt tiêu hoàn toàn độ lệch thang đo (Scale Invariance)</b><br>"
        "<font color='#1E293B' style='font-size:11px; line-height:1.35;'>"
        "Khoảng cách Cosine trong pgvector dao động từ [0, 2], trong khi hệ số Ochiai dao động từ [0, 1]. Borda Count quy đổi "
        "thứ tự xếp hạng sang điểm số tương đối công bằng (P - Rank), loại bỏ hoàn toàn sự chênh lệch phân phối trước khi nhân "
        "trọng số cân bằng alpha (α = 0.5), giải quyết triệt để bài toán chuẩn hóa điểm không đồng nhất."
        "</font>"
    )
    add_node('ins_p3', p3_val, p3_style, 880, bot_y + 300, 810, 122)

    # ==================== SERIALIZE TO XML ====================
    xml_str = ET.tostring(mxfile, encoding='utf-8')
    
    # Validation checks
    assert b'&amp;lt;' not in xml_str, "CRITICAL ERROR: Found double escaped &amp;lt; in XML!"
    assert b'&lt;mxCell' in xml_str or b'<mxCell' in xml_str, "Valid XML elements expected"
    
    for p in output_paths:
        os.makedirs(os.path.dirname(os.path.abspath(p)), exist_ok=True)
        with open(p, 'wb') as f:
            f.write(xml_str)
        print(f"[SUCCESS] Đã ghi file Draw.io sạch và chuẩn tại: {p}")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    targets = [
        "So_do_Borda_Count_Fusion.drawio",
        "Final Report/So_do_Borda_Count_Fusion.drawio",
        "C:/Users/trang/.gemini/antigravity/brain/d2eea2e0-4756-4804-9912-799784a51bf6/So_do_Borda_Count_Fusion.drawio"
    ]
    build_borda_drawio(targets)

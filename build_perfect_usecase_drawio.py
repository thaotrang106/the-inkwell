import xml.etree.ElementTree as ET

def generate_perfect_drawio(output_path):
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='24.0.0')
    diagram = ET.SubElement(mxfile, 'diagram', id='UseCase_TheInkwell_Perfect', name='Sơ đồ Use Case The Inkwell (Chuẩn Flow)')
    mxGraphModel = ET.SubElement(diagram, 'mxGraphModel', dx='1400', dy='900', grid='1', gridSize='10', guides='1', tooltips='1', connect='1', arrows='1', fold='1', page='1', pageScale='1', pageWidth='1450', pageHeight='1250', math='0', shadow='0')
    root = ET.SubElement(mxGraphModel, 'root')
    
    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')
    
    def add_node(id, value, style, x, y, w, h, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=id, parent=parent, style=style, vertex='1', value=value)
        ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h), attrib={'as': 'geometry'})
        return cell

    def add_edge(id, value, style, source, target, points=None, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=id, parent=parent, style=style, edge='1', source=source, target=target, value=value)
        geom = ET.SubElement(cell, 'mxGeometry', attrib={'relative': '1', 'as': 'geometry'})
        if points:
            arr = ET.SubElement(geom, 'Array', attrib={'as': 'points'})
            for px, py in points:
                ET.SubElement(arr, 'mxPoint', x=str(px), y=str(py))
        return cell

    # ================= 1. SYSTEM BOUNDARY =================
    bound_style = "rounded=1;whiteSpace=wrap;html=1;arcSize=3;fillColor=#FCFAF7;strokeColor=#4A3728;strokeWidth=2.5;verticalAlign=top;align=center;fontStyle=1;fontSize=16;fontFamily=Times New Roman;fontColor=#4A3728;spacingTop=12;"
    add_node('boundary', 'HỆ THỐNG GỢI Ý SÁCH THÔNG MINH THE INKWELL', bound_style, 240, 40, 850, 1140)

    # 4 Flow Swimlane Zones
    zone_base = "rounded=1;whiteSpace=wrap;html=1;arcSize=4;strokeWidth=1.5;verticalAlign=top;align=left;spacingLeft=16;spacingTop=8;fontStyle=1;fontSize=12;fontFamily=Times New Roman;"
    
    # Zone 1
    add_node('zone1', 'GIAI ĐOẠN 1: KHÁM PHÁ BAN ĐẦU & TÌM KIẾM (COLD-START FLOW)', zone_base + "fillColor=#FFF8F0;strokeColor=#DD6B20;fontColor=#9C4221;", 260, 80, 810, 160)

    # Zone 2
    add_node('zone2', 'GIAI ĐOẠN 2: CHI TIẾT SÁCH & GỢI Ý THUẬT TOÁN (ITEM-LEVEL AI FLOW)', zone_base + "fillColor=#F0F7FF;strokeColor=#3182CE;fontColor=#2B6CB0;", 260, 260, 810, 280)

    # Zone 3
    add_node('zone3', 'GIAI ĐOẠN 3: ĐỀ XUẤT CÁ NHÂN HÓA & GHI NHẬN HÀNH VI (USER PERSONALIZATION FLOW)', zone_base + "fillColor=#FEFCBF;strokeColor=#D69E2E;fontColor=#744210;fillOpacity=40;", 260, 560, 810, 310)

    # Zone 4
    add_node('zone4', 'GIAI ĐOẠN 4: VẬN HÀNH DỮ LIỆU & TIẾN TRÌNH NỀN (OFFLINE BATCH PROCESSING FLOW)', zone_base + "fillColor=#F7FAFC;strokeColor=#718096;fontColor=#2D3748;", 260, 890, 810, 270)

    # ================= 2. ACTORS =================
    actor_base = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;strokeWidth=2;fontFamily=Times New Roman;fontSize=13;fontStyle=1;"
    
    # Left Actors
    add_node('act_guest', 'Khách vãng lai\n(Guest)', actor_base + "fillColor=#FEEBC8;strokeColor=#C05621;fontColor=#7B341E;", 60, 190, 70, 120)
    add_node('act_user', 'Độc giả / Người dùng\n(Registered User)', actor_base + "fillColor=#BEE3F8;strokeColor=#2B6CB0;fontColor=#2C5282;", 60, 650, 70, 120)

    # Right Actors
    add_node('act_gemini', 'Hệ thống AI đối tác\n(Google Gemini API)', actor_base + "fillColor=#E9D8FD;strokeColor=#6B46C1;fontColor=#44337A;", 1180, 420, 70, 120)
    add_node('act_batch', 'Quản trị viên /\nTiến trình ngầm (Batch)', actor_base + "fillColor=#E2E8F0;strokeColor=#4A5568;fontColor=#2D3748;", 1180, 960, 70, 120)

    # Generalization (User inherits Guest - completely clear vertical line!)
    gen_style = "edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;strokeWidth=2;strokeColor=#4A5568;exitX=0.5;exitY=0;entryX=0.5;entryY=1;"
    add_edge('gen_user_guest', '', gen_style, 'act_user', 'act_guest')

    # ================= 3. USE CASES =================
    uc_base = "ellipse;whiteSpace=wrap;html=1;strokeWidth=1.5;fontFamily=Times New Roman;fontSize=12;fontStyle=1;"
    uc_guest = uc_base + "fillColor=#FFFFFF;strokeColor=#DD6B20;fontColor=#7B341E;"
    uc_item  = uc_base + "fillColor=#FFFFFF;strokeColor=#3182CE;fontColor=#2B6CB0;"
    uc_mercy = uc_base + "fillColor=#FAF5FF;strokeColor=#805AD5;fontColor=#44337A;"
    uc_user  = uc_base + "fillColor=#FFFFFF;strokeColor=#D69E2E;fontColor=#744210;"
    uc_cache = uc_base + "fillColor=#EDFDFD;strokeColor=#319795;fontColor=#234E52;"
    uc_batch = uc_base + "fillColor=#FFFFFF;strokeColor=#718096;fontColor=#2D3748;"

    # --- Zone 1 Use Cases ---
    add_node('uc_01', 'UC-01: Duyệt sách thịnh hành\n(Bayesian Cold-Start)', uc_guest, 300, 120, 210, 50)
    add_node('uc_02', 'UC-02: Tìm kiếm thông minh\n(Từ khóa & Autocomplete)', uc_guest, 300, 180, 210, 50)

    # --- Zone 2 Use Cases ---
    add_node('uc_03', 'UC-03: Xem chi tiết sách\n& Đánh giá cộng đồng', uc_item, 300, 320, 210, 54)
    add_node('uc_04', 'UC-04: Gợi ý theo nội dung\n(Content-Based pgvector)', uc_item, 570, 290, 210, 50)
    add_node('uc_05', 'UC-05: Gợi ý theo cộng đồng\n(Collaborative Ochiai)', uc_item, 570, 365, 210, 50)
    add_node('uc_06', 'UC-06: Gợi ý lai Hybrid\n(Borda Count Fusion + Alpha)', uc_item, 830, 325, 210, 52)
    add_node('uc_07', 'UC-07: Xem lời bình Mercy AI\n(Google Gemini 2.5 Flash)', uc_mercy, 830, 420, 210, 54)

    # --- Zone 3 Use Cases (Stacked vertically in Column 1 at x=300 -> ZERO CROSSING!) ---
    add_node('uc_08', 'UC-08: Chọn hồ sơ độc giả\n(Kích hoạt Demo user_id)', uc_user, 300, 600, 210, 50)
    add_node('uc_11', 'UC-11: Gợi ý cá nhân hóa\n(Just For You + Thẻ lý do)', uc_user, 300, 670, 220, 52)
    add_node('uc_09', 'UC-09: Quản lý giỏ hàng sách\n(Thêm, bớt, lưu bền vững)', uc_user, 300, 740, 210, 50)
    add_node('uc_10', 'UC-10: Đánh giá & Viết nhận xét\n(Chấm sao + Review)', uc_user, 300, 810, 210, 50)

    # Zone 3 Internal Column 2 (Cache & Log)
    add_node('uc_12', 'UC-12: Kiểm tra bộ nhớ đệm\n(recommendation_cache)', uc_cache, 620, 670, 210, 50)
    add_node('uc_13', 'UC-13: Ghi nhận hành vi vi mô\n(Log bảng interactions)', uc_cache, 620, 775, 210, 52)

    # --- Zone 4 Use Cases ---
    add_node('uc_14', 'UC-14: Nạp & chuẩn hóa dữ liệu\nGoodbooks-10k Extended', uc_batch, 300, 950, 220, 52)
    add_node('uc_15', 'UC-15: Sinh vector nhúng 768 chiều\n(Embedding vào pgvector)', uc_batch, 580, 950, 220, 52)
    add_node('uc_16', 'UC-16: Tính lại xếp hạng Bayesian\n(Batch Script popular_books)', uc_batch, 580, 1040, 220, 52)

    # ================= 4. ASSOCIATIONS & FLOW RELATIONS =================
    # Clean Association Style (Direct straight line, NO orthogonal clutter!)
    assoc_guest_style = "edgeStyle=none;html=1;strokeWidth=1.5;strokeColor=#DD6B20;endArrow=none;"
    assoc_user_style  = "edgeStyle=none;html=1;strokeWidth=1.5;strokeColor=#2B6CB0;endArrow=none;"
    assoc_ai_style    = "edgeStyle=none;html=1;strokeWidth=1.5;strokeColor=#6B46C1;endArrow=none;"
    assoc_batch_style = "edgeStyle=none;html=1;strokeWidth=1.5;strokeColor=#4A5568;endArrow=none;"

    # Include / Extend styles with text labels
    inc_style = "edgeStyle=none;html=1;dashed=1;strokeWidth=1.5;strokeColor=#3182CE;endArrow=open;endSize=8;fontFamily=Times New Roman;fontSize=11;fontStyle=2;fontColor=#2B6CB0;"
    ext_style = "edgeStyle=none;html=1;dashed=1;strokeWidth=1.5;strokeColor=#805AD5;endArrow=open;endSize=8;fontFamily=Times New Roman;fontSize=11;fontStyle=2;fontColor=#44337A;"
    flow_pipe = "edgeStyle=none;html=1;strokeWidth=2;strokeColor=#718096;endArrow=classic;endSize=8;"

    # --- Khách connections (Fan out with distinct exitY -> ZERO OVERLAPPING!) ---
    add_edge('e_g1', '', assoc_guest_style + "exitX=1;exitY=0.25;entryX=0;entryY=0.5;", 'act_guest', 'uc_01')
    add_edge('e_g2', '', assoc_guest_style + "exitX=1;exitY=0.5;entryX=0;entryY=0.5;", 'act_guest', 'uc_02')
    add_edge('e_g3', '', assoc_guest_style + "exitX=1;exitY=0.85;entryX=0;entryY=0.5;", 'act_guest', 'uc_03')

    # --- Zone 2 internal relations (Item-level flow) ---
    add_edge('rel_inc_cb', '<<include>>', inc_style + "exitX=1;exitY=0.35;entryX=0;entryY=0.5;", 'uc_03', 'uc_04')
    add_edge('rel_inc_cf', '<<include>>', inc_style + "exitX=1;exitY=0.65;entryX=0;entryY=0.5;", 'uc_03', 'uc_05')

    add_edge('rel_inc_hyb1', '<<include>>', inc_style + "exitX=1;exitY=0.5;entryX=0;entryY=0.35;", 'uc_04', 'uc_06')
    add_edge('rel_inc_hyb2', '<<include>>', inc_style + "exitX=1;exitY=0.5;entryX=0;entryY=0.65;", 'uc_05', 'uc_06')

    # UC-07 (Mercy AI) <<extend>> UC-03 (Curving neatly, no crossing!)
    add_edge('rel_ext_mercy', '<<extend>>', ext_style + "exitX=0;exitY=0.5;entryX=0.85;entryY=1;", 'uc_07', 'uc_03', points=[(550, 440), (480, 440)])
    add_edge('e_ai_mercy', '', assoc_ai_style + "exitX=1;exitY=0.5;entryX=0;entryY=0.5;", 'uc_07', 'act_gemini')

    # --- Người dùng connections (All 4 in Column 1 -> Fan out cleanly with distinct exitY -> ZERO OVERLAPPING!) ---
    add_edge('e_u1', '', assoc_user_style + "exitX=1;exitY=0.25;entryX=0;entryY=0.5;", 'act_user', 'uc_08')
    add_edge('e_u2', '', assoc_user_style + "exitX=1;exitY=0.45;entryX=0;entryY=0.5;", 'act_user', 'uc_11')
    add_edge('e_u3', '', assoc_user_style + "exitX=1;exitY=0.70;entryX=0;entryY=0.5;", 'act_user', 'uc_09')
    add_edge('e_u4', '', assoc_user_style + "exitX=1;exitY=0.90;entryX=0;entryY=0.5;", 'act_user', 'uc_10')

    # --- Zone 3 internal relations (Personalization flow) ---
    # UC-11 (For-You) <<include>> UC-12 (Cache - straight horizontal line!)
    add_edge('rel_inc_cache', '<<include>>', inc_style + "strokeColor=#319795;fontColor=#234E52;exitX=1;exitY=0.5;entryX=0;entryY=0.5;", 'uc_11', 'uc_12')

    # UC-09 & UC-10 <<include>> UC-13 (Log Interactions - fan in cleanly without crossing!)
    add_edge('rel_inc_log1', '<<include>>', inc_style + "strokeColor=#319795;fontColor=#234E52;exitX=1;exitY=0.5;entryX=0;entryY=0.35;", 'uc_09', 'uc_13')
    add_edge('rel_inc_log2', '<<include>>', inc_style + "strokeColor=#319795;fontColor=#234E52;exitX=1;exitY=0.5;entryX=0;entryY=0.65;", 'uc_10', 'uc_13')

    # --- Zone 4 internal relations (Batch pipeline flow) ---
    add_edge('flow_batch', '', flow_pipe + "exitX=1;exitY=0.5;entryX=0;entryY=0.5;", 'uc_14', 'uc_15')

    add_edge('e_b1', '', assoc_batch_style + "exitX=0;exitY=0.4;entryX=1;entryY=0.5;", 'act_batch', 'uc_15')
    add_edge('e_b2', '', assoc_batch_style + "exitX=0;exitY=0.7;entryX=1;entryY=0.5;", 'act_batch', 'uc_16')

    # UC-15 calls Gemini API for embedding via right corridor (clean orthogonal waypoints!)
    add_edge('call_gemini_embed', 'gọi API nhúng', assoc_ai_style + "exitX=1;exitY=0.3;entryX=0.5;entryY=1;fontStyle=2;fontSize=11;", 'uc_15', 'act_gemini', points=[(830, 960), (1130, 960), (1130, 580), (1215, 580)])

    tree = ET.ElementTree(mxfile)
    ET.indent(tree, space='  ', level=0)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"Generated perfect Draw.io diagram at: {output_path}")

if __name__ == '__main__':
    generate_perfect_drawio('So_do_Use_Case_The_Inkwell_Chuan.drawio')
    generate_perfect_drawio('Final Report/So_do_Use_Case_The_Inkwell_Chuan.drawio')

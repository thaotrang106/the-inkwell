import xml.etree.ElementTree as ET

def create_use_case_drawio(output_path):
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='24.0.0')
    diagram = ET.SubElement(mxfile, 'diagram', id='UseCase_TheInkwell_Official', name='Sơ đồ Use Case Tổng thể The Inkwell')
    mxGraphModel = ET.SubElement(diagram, 'mxGraphModel', dx='1400', dy='900', grid='1', gridSize='10', guides='1', tooltips='1', connect='1', arrows='1', fold='1', page='1', pageScale='1', pageWidth='1300', pageHeight='1050', math='0', shadow='0')
    root = ET.SubElement(mxGraphModel, 'root')
    
    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')
    
    def add_cell(id, value, style, parent='1', vertex='1', edge=None, source=None, target=None, x=None, y=None, w=None, h=None):
        cell_attribs = {'id': id, 'parent': parent, 'style': style}
        if value:
            cell_attribs['value'] = value
        if vertex:
            cell_attribs['vertex'] = vertex
        if edge:
            cell_attribs['edge'] = edge
            if 'vertex' in cell_attribs:
                del cell_attribs['vertex']
        if source:
            cell_attribs['source'] = source
        if target:
            cell_attribs['target'] = target
        cell = ET.SubElement(root, 'mxCell', **cell_attribs)
        if x is not None and y is not None and w is not None and h is not None:
            ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h), attrib={'as': 'geometry'})
        elif edge:
            ET.SubElement(cell, 'mxGeometry', attrib={'relative': '1', 'as': 'geometry'})
        return cell

    # 1. System Boundary
    boundary_style = "rounded=1;whiteSpace=wrap;html=1;arcSize=4;fillColor=#FAF8F5;strokeColor=#4A3728;strokeWidth=2;verticalAlign=top;align=center;fontStyle=1;fontSize=15;fontFamily=Times New Roman;fontColor=#4A3728;spacingTop=12;"
    add_cell('boundary', 'HỆ THỐNG GỢI Ý SÁCH THÔNG MINH THE INKWELL', boundary_style, x=220, y=30, w=780, h=970)

    # Sub-boundary dividers
    group1_style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F4EBE1;strokeColor=#C4A482;strokeWidth=1;dashed=1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=6;fontStyle=2;fontSize=11;fontFamily=Times New Roman;fontColor=#6B4423;"
    add_cell('grp_guest', 'Phân hệ Khám phá & Gợi ý thuật toán (Công khai)', group1_style, x=240, y=65, w=740, h=330)

    group2_style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#EBF4FA;strokeColor=#90CDF4;strokeWidth=1;dashed=1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=6;fontStyle=2;fontSize=11;fontFamily=Times New Roman;fontColor=#2B6CB0;"
    add_cell('grp_user', 'Phân hệ Độc giả cá nhân hóa & Tương tác vi mô (Theo user_id)', group2_style, x=240, y=415, w=740, h=310)

    group3_style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#EDF2F7;strokeColor=#CBD5E0;strokeWidth=1;dashed=1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=6;fontStyle=2;fontSize=11;fontFamily=Times New Roman;fontColor=#4A5568;"
    add_cell('grp_batch', 'Phân hệ Quản trị vận hành & Xử lý nền Offline (Batch Processing)', group3_style, x=240, y=745, w=740, h=235)

    # 2. Actors
    actor_guest_style = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#FEEBC8;strokeColor=#C05621;strokeWidth=2;fontFamily=Times New Roman;fontSize=13;fontStyle=1;fontColor=#7B341E;"
    add_cell('actor_guest', 'Khách vãng lai\n(Guest)', actor_guest_style, x=60, y=180, w=70, h=120)

    actor_user_style = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#BEE3F8;strokeColor=#2B6CB0;strokeWidth=2;fontFamily=Times New Roman;fontSize=13;fontStyle=1;fontColor=#2C5282;"
    add_cell('actor_user', 'Độc giả / Người dùng\n(Registered User)', actor_user_style, x=60, y=520, w=70, h=120)

    actor_ai_style = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#E9D8FD;strokeColor=#6B46C1;strokeWidth=2;fontFamily=Times New Roman;fontSize=13;fontStyle=1;fontColor=#44337A;"
    add_cell('actor_ai', 'Hệ thống AI đối tác\n(Google Gemini API)', actor_ai_style, x=1060, y=200, w=70, h=120)

    actor_batch_style = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#E2E8F0;strokeColor=#4A5568;strokeWidth=2;fontFamily=Times New Roman;fontSize=13;fontStyle=1;fontColor=#2D3748;"
    add_cell('actor_batch', 'Quản trị viên /\nTiến trình ngầm (Batch)', actor_batch_style, x=1060, y=810, w=70, h=120)

    # Actor Inheritance (Generalization: User inherits Guest)
    gen_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=0;endSize=12;strokeWidth=2;strokeColor=#4A5568;"
    add_cell('gen_user_guest', '', gen_style, edge='1', source='actor_user', target='actor_guest')

    # 3. Use Cases inside System Boundary
    uc_guest_style = "ellipse;whiteSpace=wrap;html=1;fillColor=#FFFDF5;strokeColor=#C4A482;strokeWidth=1.5;fontFamily=Times New Roman;fontSize=12;fontStyle=1;fontColor=#4A3728;"
    uc_ai_style = "ellipse;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#805AD5;strokeWidth=1.5;fontFamily=Times New Roman;fontSize=12;fontStyle=1;fontColor=#44337A;"
    uc_user_style = "ellipse;whiteSpace=wrap;html=1;fillColor=#EBF8FF;strokeColor=#3182CE;strokeWidth=1.5;fontFamily=Times New Roman;fontSize=12;fontStyle=1;fontColor=#2B6CB0;"
    uc_inc_style = "ellipse;whiteSpace=wrap;html=1;fillColor=#EDFDFD;strokeColor=#319795;strokeWidth=1.5;fontFamily=Times New Roman;fontSize=11.5;fontColor=#234E52;"
    uc_batch_style = "ellipse;whiteSpace=wrap;html=1;fillColor=#F7FAFC;strokeColor=#718096;strokeWidth=1.5;fontFamily=Times New Roman;fontSize=12;fontStyle=1;fontColor=#2D3748;"

    # Section 1: Guest Use Cases
    add_cell('uc_pop', 'UC-01: Duyệt sách thịnh hành\n(Bayesian Average Cold-Start)', uc_guest_style, x=270, y=95, w=190, h=48)
    add_cell('uc_sea', 'UC-02: Tìm kiếm thông minh\n(Từ khóa & Autocomplete)', uc_guest_style, x=270, y=155, w=190, h=48)
    add_cell('uc_det', 'UC-03: Xem chi tiết sách\n(Thông tin & Đánh giá sao)', uc_guest_style, x=270, y=215, w=190, h=48)
    add_cell('uc_cb', 'UC-04: Gợi ý theo nội dung\n(Content-Based pgvector)', uc_guest_style, x=270, y=275, w=190, h=48)
    add_cell('uc_cf', 'UC-05: Gợi ý người khác cũng thích\n(Collaborative Ochiai)', uc_guest_style, x=270, y=335, w=190, h=48)

    add_cell('uc_mrc', 'UC-07: Xem lời bình Mercy AI\n(Google Gemini 2.5 Flash)', uc_ai_style, x=770, y=215, w=190, h=52)
    add_cell('uc_hyb', 'UC-06: Gợi ý lai Hybrid\n(Borda Count Fusion + Alpha)', uc_guest_style, x=530, y=305, w=200, h=52)

    # Section 2: User Use Cases
    add_cell('uc_prf', 'UC-08: Chọn hồ sơ độc giả\n(Kích hoạt Demo user_id)', uc_user_style, x=270, y=440, w=190, h=48)
    add_cell('uc_crt', 'UC-09: Quản lý giỏ hàng sách\n(Thêm, bớt, lưu trữ bền vững)', uc_user_style, x=270, y=505, w=190, h=48)
    add_cell('uc_rev', 'UC-10: Đánh giá & Viết nhận xét\n(Chấm điểm sao + Review)', uc_user_style, x=270, y=570, w=190, h=48)
    add_cell('uc_fyu', 'UC-11: Gợi ý cá nhân hóa\n(Just For You + Thẻ lý do)', uc_user_style, x=270, y=640, w=200, h=54)

    add_cell('uc_log', 'UC-13: Ghi nhận hành vi vi mô\n(Log bảng interactions)', uc_inc_style, x=530, y=535, w=200, h=52)
    add_cell('uc_cch', 'UC-12: Kiểm tra bộ nhớ đệm\n(recommendation_cache)', uc_inc_style, x=770, y=640, w=190, h=48)

    # Section 3: Batch Use Cases
    add_cell('uc_imp', 'UC-14: Nạp & chuẩn hóa dữ liệu\n(Tập Goodbooks-10k Extended)', uc_batch_style, x=270, y=780, w=210, h=50)
    add_cell('uc_emb', 'UC-15: Sinh vector nhúng 768 chiều\n(Embedding vào pgvector)', uc_batch_style, x=540, y=780, w=210, h=50)
    add_cell('uc_rec', 'UC-16: Tính lại xếp hạng Bayesian\n(Batch Script popular_books)', uc_batch_style, x=540, y=880, w=210, h=50)

    # 4. Association Lines & UML Relations
    assoc_guest_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor=#C05621;endArrow=none;"
    add_cell('asc_g1', '', assoc_guest_style, edge='1', source='actor_guest', target='uc_pop')
    add_cell('asc_g2', '', assoc_guest_style, edge='1', source='actor_guest', target='uc_sea')
    add_cell('asc_g3', '', assoc_guest_style, edge='1', source='actor_guest', target='uc_det')
    add_cell('asc_g4', '', assoc_guest_style, edge='1', source='actor_guest', target='uc_cb')
    add_cell('asc_g5', '', assoc_guest_style, edge='1', source='actor_guest', target='uc_cf')

    assoc_user_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor=#2B6CB0;endArrow=none;"
    add_cell('asc_u1', '', assoc_user_style, edge='1', source='actor_user', target='uc_prf')
    add_cell('asc_u2', '', assoc_user_style, edge='1', source='actor_user', target='uc_crt')
    add_cell('asc_u3', '', assoc_user_style, edge='1', source='actor_user', target='uc_rev')
    add_cell('asc_u4', '', assoc_user_style, edge='1', source='actor_user', target='uc_fyu')

    # <<extend>> UC-03 -> UC-07 (Mercy AI)
    ext_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;strokeWidth=1.5;strokeColor=#805AD5;endArrow=open;endSize=8;fontFamily=Times New Roman;fontSize=11;fontColor=#44337A;"
    add_cell('rel_ext_mercy', '<<extend>>', ext_style, edge='1', source='uc_mrc', target='uc_det')

    # <<include>> UC-04, UC-05 -> UC-06 (Hybrid)
    inc_hyb_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;strokeWidth=1.5;strokeColor=#A0522D;endArrow=open;endSize=8;fontFamily=Times New Roman;fontSize=11;fontColor=#A0522D;"
    add_cell('rel_inc_hyb1', '<<include>>', inc_hyb_style, edge='1', source='uc_hyb', target='uc_cb')
    add_cell('rel_inc_hyb2', '<<include>>', inc_hyb_style, edge='1', source='uc_hyb', target='uc_cf')

    # <<include>> UC-11 -> UC-12 (Cache)
    inc_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;strokeWidth=1.5;strokeColor=#319795;endArrow=open;endSize=8;fontFamily=Times New Roman;fontSize=11;fontColor=#234E52;"
    add_cell('rel_inc_cache', '<<include>>', inc_style, edge='1', source='uc_fyu', target='uc_cch')

    # <<include>> UC-10 (Review) & UC-09 (Cart) -> UC-13 (Log Interactions)
    add_cell('rel_inc_log1', '<<include>>', inc_style, edge='1', source='uc_crt', target='uc_log')
    add_cell('rel_inc_log2', '<<include>>', inc_style, edge='1', source='uc_rev', target='uc_log')

    # Supporting Actor AI Associations
    assoc_ai_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor=#6B46C1;endArrow=none;"
    add_cell('asc_ai_mercy', '', assoc_ai_style, edge='1', source='uc_mrc', target='actor_ai')

    # Batch Actor Associations
    assoc_batch_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor=#4A5568;endArrow=none;"
    add_cell('asc_b1', '', assoc_batch_style, edge='1', source='actor_batch', target='uc_emb')
    add_cell('asc_b2', '', assoc_batch_style, edge='1', source='actor_batch', target='uc_rec')

    # UC-14 -> UC-15 pipeline
    flow_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor=#718096;endArrow=classic;endSize=8;"
    add_cell('flow_batch', '', flow_style, edge='1', source='uc_imp', target='uc_emb')

    # UC-15 calls Gemini API
    call_ai_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor=#6B46C1;endArrow=none;"
    add_cell('call_ai_embed', 'gọi API nhúng', call_ai_style, edge='1', source='uc_emb', target='actor_ai')

    tree = ET.ElementTree(mxfile)
    ET.indent(tree, space='  ', level=0)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"Exported Draw.io successfully to {output_path}")

if __name__ == '__main__':
    create_use_case_drawio('So_do_Use_Case_The_Inkwell_Chuan.drawio')
    create_use_case_drawio('Final Report/So_do_Use_Case_The_Inkwell_Chuan.drawio')

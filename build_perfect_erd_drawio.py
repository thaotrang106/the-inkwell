import os
import xml.etree.ElementTree as ET

def build_erd_drawio(output_path):
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='24.0.0')
    diagram = ET.SubElement(mxfile, 'diagram', id='ERD_TheInkwell_Perfect', name='Sơ đồ ERD The Inkwell (Chuẩn Crow\'s Foot 3NF)')
    mxGraphModel = ET.SubElement(
        diagram, 'mxGraphModel',
        dx='1600', dy='1100', grid='1', gridSize='10',
        guides='1', tooltips='1', connect='1', arrows='1', fold='1',
        page='1', pageScale='1', pageWidth='1420', pageHeight='1020',
        math='0', shadow='0'
    )
    root = ET.SubElement(mxGraphModel, 'root')
    
    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')
    
    def add_node(id, value, style, x, y, w, h, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=id, parent=parent, style=style, vertex='1', value=value)
        ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h), attrib={'as': 'geometry'})
        return cell

    def add_edge(id, style, source, target, exit_point=None, entry_point=None, points=None, label_src=None, label_tgt=None, parent='1'):
        edge_style = style
        if exit_point:
            edge_style += f"exitX={exit_point[0]};exitY={exit_point[1]};exitDx=0;exitDy=0;"
        if entry_point:
            edge_style += f"entryX={entry_point[0]};entryY={entry_point[1]};entryDx=0;entryDy=0;"
            
        cell = ET.SubElement(root, 'mxCell', id=id, parent=parent, style=edge_style, edge='1', source=source, target=target, value='')
        geom = ET.SubElement(cell, 'mxGeometry', attrib={'relative': '1', 'as': 'geometry'})
        if points:
            arr = ET.SubElement(geom, 'Array', attrib={'as': 'points'})
            for px, py in points:
                ET.SubElement(arr, 'mxPoint', x=str(px), y=str(py))
                
        # Source label (multiplicity)
        if label_src:
            lbl1 = ET.SubElement(root, 'mxCell', id=f"{id}_src", parent=id, style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=13;fontStyle=1;fontColor=#1E3A8A;labelBackgroundColor=#FFFFFF;rounded=1;", vertex='1', connectable='0', value=label_src)
            g1 = ET.SubElement(lbl1, 'mxGeometry', x='-0.75', attrib={'relative': '1', 'as': 'geometry'})
            ET.SubElement(g1, 'mxPoint', y='-12', attrib={'as': 'offset'})

        # Target label (multiplicity)
        if label_tgt:
            lbl2 = ET.SubElement(root, 'mxCell', id=f"{id}_tgt", parent=id, style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=13;fontStyle=1;fontColor=#1E3A8A;labelBackgroundColor=#FFFFFF;rounded=1;", vertex='1', connectable='0', value=label_tgt)
            g2 = ET.SubElement(lbl2, 'mxGeometry', x='0.75', attrib={'relative': '1', 'as': 'geometry'})
            ET.SubElement(g2, 'mxPoint', y='-12', attrib={'as': 'offset'})
            
        return cell

    # ================= 0. TITLE & CANVAS HEADER =================
    title_style = "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Times New Roman;fontStyle=1;fontSize=18;fontColor=#1E3A8A;"
    add_node('title', 'SƠ ĐỒ THỰC THỂ LIÊN KẾT (ERD) - HỆ THỐNG GỢI Ý SÁCH THE INKWELL', title_style, 320, 20, 780, 30)

    # ================= 1. DEFINE TABLE NODES (100% DRAW.IO / DOMPURIFY COMPLIANT) =================
    # Clean style: verticalAlign=top, spacingTop=0, NO overflow=hidden
    box_style_base = "rounded=1;arcSize=3;whiteSpace=wrap;html=1;shadow=1;strokeWidth=2;fillColor=#FFFFFF;align=left;verticalAlign=top;spacing=0;spacingTop=0;spacingLeft=0;spacingRight=0;fontFamily=Segoe UI, Arial, sans-serif;"
    
    # Helper to build table HTML (1 single string, NO newlines, pure div/span/b)
    def make_table_html(title, title_bg, rows):
        hdr = f'<div style="background-color:{title_bg};color:#ffffff;padding:7px 4px;font-weight:bold;text-align:center;font-size:13px;letter-spacing:0.5px;border-top-left-radius:3px;border-top-right-radius:3px;">{title}</div>'
        body_rows = []
        for i, (tag, name, dtype, special) in enumerate(rows):
            border_bottom = "border-bottom:1px solid #EDF2F7;" if i < len(rows) - 1 else ""
            row_bg = ""
            if special == "ai_vec":
                row_bg = "background:#FEF3C7;"
            elif special == "ai_text":
                row_bg = "background:#F0FDF4;"
                
            # Badge
            badge_html = ""
            if tag == "PK":
                badge_html = '<b style="color:#D97706;">PK</b>&nbsp;&nbsp;'
            elif tag == "FK":
                badge_html = '<b style="color:#0284C7;">FK</b>&nbsp;&nbsp;'
            elif "PK" in tag and "FK" in tag:
                badge_html = '<b style="color:#7E22CE;">PK, FK</b>&nbsp;&nbsp;'
            elif tag == "AI":
                badge_html = '<b style="color:#15803D;">AI</b>&nbsp;&nbsp;'
            else:
                badge_html = '<span style="visibility:hidden;font-weight:bold;">PK</span>&nbsp;&nbsp;'
                
            # Column styling
            col_name_html = f"<b>{name}</b>" if "PK" in tag or name == "title" else name
            if special == "ai_vec":
                col_name_html = f'<b style="color:#92400E;">{name}</b>'
            elif special == "ai_text":
                col_name_html = f'<b style="color:#166534;">{name}</b>'
                
            # Type styling
            type_color = "#64748B"
            if special == "ai_vec":
                type_color = "#B45309;font-weight:bold"
            elif special == "ai_text":
                type_color = "#15803D;font-weight:bold"
                
            type_html = f'<span style="float:right;color:{type_color};font-family:Consolas,monospace;font-size:11px;">{dtype}</span>'
            
            body_rows.append(f'<div style="{border_bottom}{row_bg}padding:3px 10px;height:20px;line-height:20px;">{type_html}{badge_html}{col_name_html}</div>')
            
        content = f'{hdr}<div style="font-size:12px;color:#1E293B;">{"".join(body_rows)}</div>'
        return content

    # Table 1: users (Left Top)
    users_cols = [
        ('PK', 'user_id', 'INT', None),
        ('', 'username', 'VARCHAR(100)', None),
        ('', 'email', 'VARCHAR(255)', None),
        ('', 'created_at', 'TIMESTAMP', None),
    ]
    users_val = make_table_html("users", "#2B6CB0", users_cols)
    add_node('users', users_val, box_style_base + "strokeColor=#2B6CB0;", 60, 180, 310, 142)

    # Table 2: recommendation_cache (Left Bottom)
    cache_cols = [
        ('PK', 'id', 'INT', None),
        ('FK', 'user_id', 'INT', None),
        ('', 'model_version', 'VARCHAR(50)', None),
        ('', 'book_ids (kết quả)', 'INT[]', None),
        ('', 'scores (độ tương quan)', 'FLOAT[]', None),
        ('', 'generated_at', 'TIMESTAMP', None),
    ]
    cache_val = make_table_html("recommendation_cache", "#4A5568", cache_cols)
    add_node('cache', cache_val, box_style_base + "strokeColor=#4A5568;", 60, 390, 310, 195)

    # Table 3: ratings (Center Top)
    ratings_cols = [
        ('PK', 'rating_id', 'INT', None),
        ('FK', 'user_id', 'INT', None),
        ('FK', 'book_id', 'INT', None),
        ('', 'rating (1 đến 5)', 'SMALLINT', None),
        ('', 'created_at', 'TIMESTAMP', None),
    ]
    ratings_val = make_table_html("ratings", "#C05621", ratings_cols)
    add_node('ratings', ratings_val, box_style_base + "strokeColor=#C05621;", 480, 120, 330, 168)

    # Table 4: interactions (Center Bottom)
    interactions_cols = [
        ('PK', 'id', 'INT', None),
        ('FK', 'user_id', 'INT', None),
        ('FK', 'book_id', 'INT', None),
        ('', 'interaction_type', 'VARCHAR(20)', None),
        ('', 'created_at', 'TIMESTAMP', None),
    ]
    interactions_val = make_table_html("interactions", "#2C7A7B", interactions_cols)
    add_node('interactions', interactions_val, box_style_base + "strokeColor=#2C7A7B;", 480, 360, 330, 168)

    # Table 5: popular_books (Right Top)
    popular_cols = [
        ('PK, FK', 'book_id', 'INT', None),
        ('', 'score (Bayesian)', 'FLOAT', None),
        ('', 'rank (Thứ hạng)', 'INT', None),
        ('', 'updated_at', 'TIMESTAMP', None),
    ]
    popular_val = make_table_html("popular_books", "#744210", popular_cols)
    add_node('popular_books', popular_val, box_style_base + "strokeColor=#744210;", 930, 80, 380, 145)

    # Table 6: books (Right Center - Trọng tâm hệ thống)
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
    books_val = make_table_html("★ books (Bảng trọng tâm)", "#1D4ED8", books_cols)
    add_node('books', books_val, box_style_base + "strokeColor=#1D4ED8;strokeWidth=2.5;", 930, 275, 380, 275)

    # Table 7: book_tags (Right Below Books)
    book_tags_cols = [
        ('PK', 'id', 'INT', None),
        ('FK', 'book_id', 'INT', None),
        ('FK', 'tag_id', 'INT', None),
        ('', 'count (Số lần gán)', 'INT', None),
    ]
    book_tags_val = make_table_html("book_tags", "#553C9A", book_tags_cols)
    add_node('book_tags', book_tags_val, box_style_base + "strokeColor=#553C9A;", 930, 600, 380, 140)

    # Table 8: tags (Right Bottom)
    tags_cols = [
        ('PK', 'tag_id', 'INT', None),
        ('', 'tag_name', 'VARCHAR(100)', None),
    ]
    tags_val = make_table_html("tags", "#276749", tags_cols)
    add_node('tags', tags_val, box_style_base + "strokeColor=#276749;", 930, 785, 380, 95)

    # ================= 2. CONNECTORS (CROW'S FOOT 1:N & 1:1) =================
    edge_style_base = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2D3748;strokeWidth=2;"

    # 1. users (1) ---> (N) recommendation_cache (Vertical straight down)
    add_edge(
        'e_user_cache',
        edge_style_base,
        source='users',
        target='cache',
        exit_point=(0.5, 1.0),
        entry_point=(0.5, 0.0),
        label_src='1',
        label_tgt='N'
    )

    # 2. users (1) ---> (N) ratings
    add_edge(
        'e_user_ratings',
        edge_style_base,
        source='users',
        target='ratings',
        exit_point=(1.0, 0.3),
        entry_point=(0.0, 0.5),
        points=[(425, 222), (425, 204)],
        label_src='1',
        label_tgt='N'
    )

    # 3. ratings (N) <--- (1) books
    add_edge(
        'e_ratings_books',
        edge_style_base,
        source='ratings',
        target='books',
        exit_point=(1.0, 0.5),
        entry_point=(0.0, 0.25),
        points=[(870, 204), (870, 344)],
        label_src='N',
        label_tgt='1'
    )

    # 4. users (1) ---> (N) interactions
    add_edge(
        'e_user_interactions',
        edge_style_base,
        source='users',
        target='interactions',
        exit_point=(1.0, 0.75),
        entry_point=(0.0, 0.5),
        points=[(425, 286), (425, 444)],
        label_src='1',
        label_tgt='N'
    )

    # 5. interactions (N) <--- (1) books
    add_edge(
        'e_interactions_books',
        edge_style_base,
        source='interactions',
        target='books',
        exit_point=(1.0, 0.5),
        entry_point=(0.0, 0.75),
        points=[(870, 444), (870, 481)],
        label_src='N',
        label_tgt='1'
    )

    # 6. popular_books (1) <---> (1) books (Vertical straight down)
    add_edge(
        'e_popular_books',
        edge_style_base,
        source='popular_books',
        target='books',
        exit_point=(0.5, 1.0),
        entry_point=(0.5, 0.0),
        label_src='1',
        label_tgt='1'
    )

    # 7. books (1) ---> (N) book_tags (Vertical straight down)
    add_edge(
        'e_books_booktags',
        edge_style_base,
        source='books',
        target='book_tags',
        exit_point=(0.5, 1.0),
        entry_point=(0.5, 0.0),
        label_src='1',
        label_tgt='N'
    )

    # 8. book_tags (N) <--- (1) tags (Vertical straight down)
    add_edge(
        'e_booktags_tags',
        edge_style_base,
        source='tags',
        target='book_tags',
        exit_point=(0.5, 0.0),
        entry_point=(0.5, 1.0),
        label_src='1',
        label_tgt='N'
    )

    # ================= 3. FOOTNOTE LEGEND BOX =================
    legend_html = '<div style="font-family:Segoe UI, Arial;font-size:12px;line-height:1.6;color:#2D3748;padding:8px 12px;"><b>Ghi chú quy ước ký hiệu:</b><br/>• <b>PK</b>: Khóa chính (Primary Key) | <b>FK</b>: Khóa ngoại (Foreign Key) | <b>AI</b>: Trường nhúng AI (Vector 768D pgvector &amp; Gemini Explain).<br/>• <b>1 : N</b>: Quan hệ Một - Nhiều (One-to-Many) | <b>1 : 1</b>: Quan hệ Một - Một (One-to-One). Chuẩn hóa 3NF không tồn tại quan hệ M:N trực tiếp.<br/>• <i>Cơ sở dữ liệu The Inkwell tích hợp bảng đệm cache (recommendation_cache, popular_books) giải quyết tối ưu Cold-Start và cá nhân hóa.</i></div>'
    legend_style = "rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1.5;align=left;spacing=0;spacingTop=0;spacingLeft=0;spacingRight=0;"
    add_node('legend', legend_html, legend_style, 60, 620, 750, 105)

    # Write output
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    tree = ET.ElementTree(mxfile)
    ET.indent(tree, space='  ', level=0)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"[SUCCESS] Wrote perfect ERD Draw.io file to: {output_path}")

if __name__ == '__main__':
    build_erd_drawio('So_do_ERD_The_Inkwell_Chuan.drawio')
    build_erd_drawio('Final Report/So_do_ERD_The_Inkwell_Chuan.drawio')

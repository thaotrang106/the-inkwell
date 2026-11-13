import os
import xml.etree.ElementTree as ET

def build_sequence_drawio(output_path):
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='24.0.0')
    diagram = ET.SubElement(mxfile, 'diagram', id='Sequence_TheInkwell_Perfect', name='Sơ đồ Tuần tự The Inkwell (Personalized For-You Flow)')
    mxGraphModel = ET.SubElement(
        diagram, 'mxGraphModel',
        dx='1600', dy='1200', grid='1', gridSize='10',
        guides='1', tooltips='1', connect='1', arrows='1', fold='1',
        page='1', pageScale='1', pageWidth='1580', pageHeight='1380',
        math='0', shadow='0'
    )
    root = ET.SubElement(mxGraphModel, 'root')
    
    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')
    
    def add_node(id, value, style, x, y, w, h, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=id, parent=parent, style=style, vertex='1', value=value)
        ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h), attrib={'as': 'geometry'})
        return cell

    def add_edge(id, value, style, source=None, target=None, points=None, parent='1'):
        cell = ET.SubElement(root, 'mxCell', id=id, parent=parent, style=style, edge='1', value=value)
        if source:
            cell.attrib['source'] = source
        if target:
            cell.attrib['target'] = target
        geom = ET.SubElement(cell, 'mxGeometry', attrib={'relative': '1', 'as': 'geometry'})
        if points:
            arr = ET.SubElement(geom, 'Array', attrib={'as': 'points'})
            for px, py in points:
                ET.SubElement(arr, 'mxPoint', x=str(px), y=str(py))
        return cell

    # ================= 0. TITLE BLOCK (LARGE FONT) =================
    title_style = "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Times New Roman;fontStyle=1;fontSize=22;fontColor=#1E3A8A;"
    add_node('title', 'SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAM) - LUỒNG GỢI Ý CÁ NHÂN HÓA /FORYOU', title_style, 240, 25, 1080, 35)

    sub_title_style = "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Times New Roman;fontStyle=2;fontSize=15;fontColor=#475569;"
    add_node('sub_title', 'Mỗi yêu cầu /foryou đi qua 3 lần truy vấn database chuyên biệt trước khi hợp nhất bằng thuật toán Borda Count', sub_title_style, 220, 62, 1120, 28)

    # ================= 1. LIFELINES (LARGE HEADERS) =================
    ll_browser_style = (
        "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;dropTarget=0;"
        "collapsible=0;recursiveResize=0;outlineConnect=0;portConstraint=eastwest;newEdgeStyle={&quot;edgeStyle&quot;:&quot;elbowEdgeStyle&quot;,&quot;elbow&quot;:&quot;vertical&quot;,&quot;curved&quot;:0,&quot;rounded&quot;:0};"
        "size=60;fillColor=#FFFBEB;strokeColor=#D97706;strokeWidth=2;fontFamily=Segoe UI, Arial;fontStyle=1;fontSize=16;fontColor=#92400E;"
    )
    add_node('ll_browser', 'Trình duyệt\n(Client / Next.js 16)', ll_browser_style, 140, 110, 220, 1080)

    ll_api_style = (
        "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;dropTarget=0;"
        "collapsible=0;recursiveResize=0;outlineConnect=0;portConstraint=eastwest;newEdgeStyle={&quot;edgeStyle&quot;:&quot;elbowEdgeStyle&quot;,&quot;elbow&quot;:&quot;vertical&quot;,&quot;curved&quot;:0,&quot;rounded&quot;:0};"
        "size=60;fillColor=#EFF6FF;strokeColor=#1D4ED8;strokeWidth=2.5;fontFamily=Segoe UI, Arial;fontStyle=1;fontSize=16;fontColor=#1E3A8A;"
    )
    add_node('ll_api', 'FastAPI\n(Backend Server)', ll_api_style, 670, 110, 220, 1080)

    ll_db_style = (
        "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;dropTarget=0;"
        "collapsible=0;recursiveResize=0;outlineConnect=0;portConstraint=eastwest;newEdgeStyle={&quot;edgeStyle&quot;:&quot;elbowEdgeStyle&quot;,&quot;elbow&quot;:&quot;vertical&quot;,&quot;curved&quot;:0,&quot;rounded&quot;:0};"
        "size=60;fillColor=#ECFDF5;strokeColor=#059669;strokeWidth=2;fontFamily=Segoe UI, Arial;fontStyle=1;fontSize=16;fontColor=#065F46;"
    )
    add_node('ll_db', 'PostgreSQL + pgvector\n(Supabase Database)', ll_db_style, 1200, 110, 240, 1080)

    # ================= 2. ACTIVATION BARS =================
    act_style = "html=1;points=[];perimeter=orthogonalPerimeter;outlineConnect=0;targetShapes=umlLifeline;portConstraint=eastwest;strokeWidth=1.5;"
    # Client activations (Center X = 250)
    add_node('act_c1', '', act_style + "fillColor=#FEF3C7;strokeColor=#D97706;", 245, 210, 10, 770)
    add_node('act_c2', '', act_style + "fillColor=#FEF3C7;strokeColor=#D97706;", 245, 1050, 10, 80)
    # Backend activations (Center X = 780)
    add_node('act_api1', '', act_style + "fillColor=#DBEAFE;strokeColor=#1D4ED8;", 775, 210, 10, 770)
    add_node('act_api2', '', act_style + "fillColor=#DBEAFE;strokeColor=#1D4ED8;", 775, 1050, 10, 120)
    # DB activations (Center X = 1320)
    add_node('act_db1', '', act_style + "fillColor=#D1FAE5;strokeColor=#059669;", 1315, 280, 10, 70)
    add_node('act_db2', '', act_style + "fillColor=#D1FAE5;strokeColor=#059669;", 1315, 430, 10, 70)
    add_node('act_db3', '', act_style + "fillColor=#D1FAE5;strokeColor=#059669;", 1315, 580, 10, 70)
    add_node('act_db4', '', act_style + "fillColor=#D1FAE5;strokeColor=#059669;", 1315, 840, 10, 60)
    add_node('act_db5', '', act_style + "fillColor=#D1FAE5;strokeColor=#059669;", 1315, 1090, 10, 60)

    # ================= 3. MESSAGES (LARGE 14-15PT FONT) =================
    sync_call_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#1E293B;strokeWidth=2.5;fontSize=14;fontFamily=Segoe UI, Arial;fontStyle=1;fontColor=#0F172A;endArrow=block;endFill=1;"
    async_call_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#0D9488;strokeWidth=2.5;fontSize=14;fontFamily=Segoe UI, Arial;fontStyle=1;fontColor=#0F766E;endArrow=block;endFill=1;"
    return_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#64748B;strokeWidth=2;dashed=1;fontSize=13;fontFamily=Segoe UI, Arial;fontStyle=2;fontColor=#475569;endArrow=open;endFill=0;"

    # 1. Trình duyệt -> FastAPI: GET /foryou/{user_id}
    add_edge(
        'msg1',
        '1: GET /api/recommendations/foryou/{user_id}',
        sync_call_style,
        source='act_c1',
        target='act_api1',
        points=[(255, 210), (775, 210)]
    )

    # 2. FastAPI -> PostgreSQL: Lấy 5 hạt giống
    add_edge(
        'msg2',
        '2: [Truy vấn 1] Lấy 5 cuốn hạt giống (ratings >= 4★ hoặc tương tác cao)',
        sync_call_style,
        source='act_api1',
        target='act_db1',
        points=[(785, 280), (1315, 280)]
    )

    # 3. PostgreSQL -> FastAPI: Trả về hạt giống
    add_edge(
        'msg3',
        '3: Trả về danh sách 5 cuốn hạt giống [seed_ids]',
        return_style,
        source='act_db1',
        target='act_api1',
        points=[(1315, 350), (785, 350)]
    )

    # 4. FastAPI -> PostgreSQL: AVG(embedding), gần nhất
    add_edge(
        'msg4',
        '4: [Truy vấn 2] AVG(embedding) & Tìm kiếm vector láng giềng k-NN Cosine (HNSW)',
        sync_call_style,
        source='act_api1',
        target='act_db2',
        points=[(785, 430), (1315, 430)]
    )

    # 5. PostgreSQL -> FastAPI: Ứng viên Content-Based
    add_edge(
        'msg5',
        '5: Trả về 30 ứng viên Content-Based (theo khoảng cách vector)',
        return_style,
        source='act_db2',
        target='act_api1',
        points=[(1315, 500), (785, 500)]
    )

    # 6. FastAPI -> PostgreSQL: Ochiai theo từng hạt giống
    add_edge(
        'msg6',
        '6: [Truy vấn 3] Tính hệ số tương đồng Ochiai đồng xuất hiện từng hạt giống',
        sync_call_style,
        source='act_api1',
        target='act_db3',
        points=[(785, 580), (1315, 580)]
    )

    # 7. PostgreSQL -> FastAPI: Ứng viên Collaborative
    add_edge(
        'msg7',
        '7: Trả về 30 ứng viên Collaborative Filtering [cf_candidates]',
        return_style,
        source='act_db3',
        target='act_api1',
        points=[(1315, 650), (785, 650)]
    )

    # 8. FastAPI self loop: Borda + lọc sách đã đọc
    self_loop_style = (
        "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;"
        "strokeColor=#4338CA;strokeWidth=2.5;fontSize=14;fontFamily=Segoe UI, Arial;fontStyle=1;fontColor=#3730A3;"
        "endArrow=block;endFill=1;"
    )
    add_edge(
        'msg8',
        '8: Thuật toán Borda Count Fusion & Lọc sách đã đọc/đã mua (seen)',
        self_loop_style,
        source='act_api1',
        target='act_api1',
        points=[(785, 720), (910, 720), (910, 780), (785, 780)]
    )

    # 9. FastAPI -> PostgreSQL: Lưu kết quả vào recommendation_cache
    add_edge(
        'msg9',
        '9: Ghi đệm danh sách Top-K vào recommendation_cache (TTL = 1 giờ)',
        sync_call_style,
        source='act_api1',
        target='act_db4',
        points=[(785, 840), (1315, 840)]
    )

    # 9b. PostgreSQL -> FastAPI: ACK cache saved
    add_edge(
        'msg9b',
        '9b: Lưu cache thành công (200 OK Cache Hit)',
        return_style,
        source='act_db4',
        target='act_api1',
        points=[(1315, 900), (785, 900)]
    )

    # 10. FastAPI -> Trình duyệt: JSON: items + because
    add_edge(
        'msg10',
        '10: 200 OK: JSON {items, because: "Vì bạn đã thích...", seeds}',
        return_style,
        source='act_api1',
        target='act_c1',
        points=[(775, 970), (255, 970)]
    )

    # 11. Trình duyệt -> FastAPI: POST /interactions (nền)
    add_edge(
        'msg11',
        '11: POST /api/interactions (Sự kiện vi mô: view / click / add_to_cart)',
        async_call_style,
        source='act_c2',
        target='act_api2',
        points=[(255, 1050), (775, 1050)]
    )

    # 12. FastAPI -> PostgreSQL: INSERT interactions
    add_edge(
        'msg12',
        '12: INSERT INTO interactions (user_id, book_id, type) (Lưu vết hành vi)',
        async_call_style,
        source='act_api2',
        target='act_db5',
        points=[(785, 1090), (1315, 1090)]
    )

    # 12b. DB -> FastAPI: ACK Insert
    add_edge(
        'msg12b',
        '12b: 201 Created (Ghi nhận hành vi thành công)',
        return_style,
        source='act_db5',
        target='act_api2',
        points=[(1315, 1150), (785, 1150)]
    )

    # ================= 4. SUMMARY / NOTES BOX (LARGE FONT) =================
    summary_html = """<div style="font-family:Segoe UI, Arial;font-size:13px;line-height:1.7;color:#1E293B;">
<b>GIẢI THÍCH 3 PHA XỬ LÝ TRUY VẤN CỦA LUỒNG GỢI Ý CÁ NHÂN HÓA (/FORYOU):</b><br/>
• <b>Pha 1 (Seed Mining):</b> FastAPI kết hợp bảng <code>ratings</code> (sao &ge; 4) và bảng <code>interactions</code> (trọng số hành vi) để trích xuất 5 tác phẩm hạt giống tiêu biểu nhất theo thời gian thực.<br/>
• <b>Pha 2 (Dual-Branch Search):</b> (1) Nhánh <i>Content-Based</i> tính trọng tâm vector profile và quét chỉ mục HNSW trên không gian 768 chiều; (2) Nhánh <i>Collaborative</i> tính hệ số Ochiai cho từng hạt giống từ dữ liệu cộng đồng.<br/>
• <b>Pha 3 (Fusion & Loop):</b> Hợp nhất thứ hạng bằng thuật toán <i>Borda Count</i>, loại trừ toàn bộ sách đã đọc/đã mua, lưu đệm vào <code>recommendation_cache</code>, gắn nhãn giải thích AI, và ghi nhận phản hồi ngầm <i>Implicit Feedback</i>.
</div>"""
    summary_style = "rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1.5;align=left;spacingLeft=18;spacingRight=18;"
    add_node('summary', summary_html, summary_style, 140, 1210, 1300, 130)

    # Write output
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    tree = ET.ElementTree(mxfile)
    ET.indent(tree, space='  ', level=0)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"[SUCCESS] Wrote perfect large-font Sequence Draw.io file to: {output_path}")

if __name__ == '__main__':
    build_sequence_drawio(os.path.normpath('So_do_Sequence_Diagram_The_Inkwell_Chuan.drawio'))
    build_sequence_drawio(os.path.normpath('Final Report/So_do_Sequence_Diagram_The_Inkwell_Chuan.drawio'))

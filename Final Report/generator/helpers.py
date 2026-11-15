import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

FONT_NAME = 'Times New Roman'

def set_font(run, size_pt=13, bold=False, italic=False, color=(0, 0, 0)):
    run.font.name = FONT_NAME
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor(*color)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.first_line_indent = Inches(0)
    p.paragraph_format.keep_with_next = True
    p.style = doc.styles['Heading 1'] if 'Heading 1' in doc.styles else doc.styles['Normal']
    run = p.add_run(text.upper())
    set_font(run, size_pt=15, bold=True, color=(0, 32, 96))
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.first_line_indent = Inches(0)
    p.paragraph_format.keep_with_next = True
    p.style = doc.styles['Heading 2'] if 'Heading 2' in doc.styles else doc.styles['Normal']
    run = p.add_run(text)
    set_font(run, size_pt=13.5, bold=True, color=(0, 32, 96))
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.first_line_indent = Inches(0)
    p.paragraph_format.keep_with_next = True
    p.style = doc.styles['Heading 3'] if 'Heading 3' in doc.styles else doc.styles['Normal']
    run = p.add_run(text)
    set_font(run, size_pt=13, bold=True, italic=True, color=(20, 20, 20))
    return p

def add_body_p(doc, text, bold_prefix=None, indent=0.5):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.space_before = Pt(0)
    if indent:
        p.paragraph_format.first_line_indent = Inches(indent)
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_font(r_pre, size_pt=13, bold=True)
    
    r_body = p.add_run(text)
    set_font(r_body, size_pt=13, bold=False)
    return p

def add_bullet_p(doc, text, bold_prefix=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.left_indent = Inches(0.4)
    p.paragraph_format.first_line_indent = Inches(-0.2)
    
    r_bullet = p.add_run("• ")
    set_font(r_bullet, size_pt=13, bold=True)
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_font(r_pre, size_pt=13, bold=True)
    
    r_body = p.add_run(text)
    set_font(r_body, size_pt=13, bold=False)
    return p

def add_formula_p(doc, formula_text, formula_num=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.first_line_indent = Inches(0)
    
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F4F6F9"/>')
    p._element.get_or_add_pPr().append(shading)
    
    r = p.add_run(formula_text)
    set_font(r, size_pt=12, bold=True, italic=True, color=(10, 40, 90))
    
    if formula_num:
        r_num = p.add_run(f"    ({formula_num})")
        set_font(r_num, size_pt=11.5, bold=True, color=(80, 80, 80))
    return p

def add_code_block(doc, code_text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.first_line_indent = Inches(0)
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.right_indent = Inches(0.2)
    
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8F9FA"/>')
    p._element.get_or_add_pPr().append(shading)
    
    run = p.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(10)
    run.font.color.rgb = RGBColor(30, 40, 50)
    return p

DEFAULT_FIGURE_SOURCES = {
    "2.1": "Tác giả tổng hợp và xây dựng, 2026",
    "2.4": "Tác giả thiết kế và trực quan hóa thuật toán, 2026",
    "3.1": "Tác giả phân tích và thiết kế kiến trúc hệ thống, 2026",
    "3.2": "Tác giả phân tích và thiết kế phần mềm, 2026",
    "3.4": "Tác giả thiết kế mô hình quan hệ cơ sở dữ liệu, 2026",
    "3.5": "Tác giả xây dựng đặc tả luồng nghiệp vụ hệ thống, 2026",
    "4.1": "Ảnh chụp trực tiếp từ giao diện Swagger UI hệ thống The Inkwell, 2026",
    "4.2": "Ảnh chụp thực tế từ website The Inkwell vận hành trên Next.js 16, 2026",
    "4.3": "Ảnh chụp thực tế từ website The Inkwell tích hợp Gemini 2.5 Flash, 2026",
    "4.4": "Ảnh chụp thực nghiệm tính năng cá nhân hóa động trên website The Inkwell, 2026",
    "4.5": "Ảnh chụp thực nghiệm từ trang Algorithm Lab của hệ sinh thái The Inkwell, 2026",
}

DEFAULT_TABLE_SOURCES = {
    "2.1": "Tác giả tổng hợp từ Ricci et al. (2015) và Aggarwal (2016)",
    "2.2": "Tác giả tính toán và mô phỏng thực nghiệm, 2026",
    "3.1": "Tác giả phân tích và tổng hợp thiết kế, 2026",
    "3.2": "Tác giả xây dựng đặc tả yêu cầu chức năng, 2026",
    "3.3": "Tác giả xây dựng theo chuẩn chất lượng phần mềm, 2026",
    "3.4": "Tác giả xây dựng tài liệu đặc tả hệ thống The Inkwell, 2026",
    "3.5": "Tác giả xây dựng tài liệu đặc tả hệ thống The Inkwell, 2026",
    "3.6": "Trích xuất từ lược đồ cơ sở dữ liệu Supabase PostgreSQL The Inkwell, 2026",
    "3.7": "Trích xuất từ thiết kế cơ sở dữ liệu hệ thống The Inkwell, 2026",
    "3.8": "Đặc tả giao diện lập trình ứng dụng FastAPI của hệ thống The Inkwell, 2026",
    "4.1": "Kết quả tiền xử lý dữ liệu thực nghiệm của tác giả, 2026",
    "4.2": "Tính toán thực nghiệm thuật toán Bayesian Average của tác giả, 2026",
    "4.3": "Tài liệu Swagger UI / OpenAPI của backend FastAPI The Inkwell, 2026",
    "4.4": "Kết quả kiểm thử thực nghiệm trên hệ thống The Inkwell, 2026",
    "4.5": "Đo lường thực nghiệm tải với Postman và FastAPI Profiler, 2026",
}

def resolve_figure_source(caption_text, source_text=None):
    if source_text:
        return source_text
    if caption_text:
        for k, v in DEFAULT_FIGURE_SOURCES.items():
            if f"Hình {k}" in caption_text or f"hình {k}" in caption_text.lower():
                return v
    return "Tác giả xây dựng và tổng hợp, 2026"

def resolve_table_source(caption_text, source_text=None):
    if source_text:
        return source_text
    if caption_text:
        for k, v in DEFAULT_TABLE_SOURCES.items():
            if f"Bảng {k}" in caption_text or f"bảng {k}" in caption_text.lower():
                return v
    return "Tác giả tổng hợp, 2026"

def add_figure(doc, image_path, caption_text, width_inches=5.8, source_text=None):
    # Check candidates
    candidates = [
        image_path,
        os.path.join("Final Report", image_path),
        os.path.join("Final Report", os.path.basename(image_path))
    ]
    
    # High-resolution official image mappings
    alias_map = {
        "use case": "Final Report/So_do_Use_Case_The_Inkwell_Chuan.drawio.png",
        "recommendation system": "Final Report/So_do_kien_truc_The_Inkwell_Chuan.drawio (2).png",
        "erd": "Final Report/So_do_ERD_The_Inkwell_Chuan.png",
        "sequence": "Final Report/So_do_Sequence_Diagram_The_Inkwell_Chuan.png",
        "borda": "Final Report/So_do_Borda_Count_Fusion.png",
        "swagger": "Final Report/Hinh_4_1_Swagger_UI_Combined.png",
        "user_a": "Final Report/Hinh_4_2_Trang_chu_User_A.png",
        "detail": "Final Report/Hinh_4_3_Chi_tiet_sach_Mercy_AI.png",
        "user_b": "Final Report/Hinh_4_4_Trang_chu_User_B.png",
        "lab": "Final Report/Hinh_4_5_Algorithm_Lab.png"
    }
    
    for k, v in alias_map.items():
        if k in image_path.lower() and os.path.exists(v):
            candidates.insert(0, v)
            
    resolved_path = None
    for cand in candidates:
        if os.path.exists(cand):
            resolved_path = cand
            break
            
    if not resolved_path:
        print(f"[WARN] Image not found: {image_path}")
        return None
        
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(4)
    p_img.paragraph_format.first_line_indent = Inches(0)
    run_img = p_img.add_run()
    run_img.add_picture(resolved_path, width=Inches(width_inches))
    
    # Caption line
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(3)
    p_cap.paragraph_format.space_after = Pt(1)
    p_cap.paragraph_format.first_line_indent = Inches(0)
    p_cap.paragraph_format.keep_with_next = True
    run_cap = p_cap.add_run(caption_text)
    set_font(run_cap, size_pt=11, bold=True, italic=True, color=(40, 40, 40))
    
    # Source line
    src = resolve_figure_source(caption_text, source_text)
    if src:
        p_src = doc.add_paragraph()
        p_src.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_src.paragraph_format.space_before = Pt(0)
        p_src.paragraph_format.space_after = Pt(10)
        p_src.paragraph_format.first_line_indent = Inches(0)
        formatted_src = f"(Nguồn: {src})" if not src.startswith("(") else src
        run_src = p_src.add_run(formatted_src)
        set_font(run_src, size_pt=10.5, bold=False, italic=True, color=(70, 70, 70))
        
    print(f"  [FIGURE EMBEDDED] {resolved_path} -> {caption_text[:50]}...")
    return p_img

def add_table(doc, headers, rows_data, caption_text=None, col_widths=None, source_text=None):
    if caption_text:
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_cap.paragraph_format.space_before = Pt(8)
        p_cap.paragraph_format.space_after = Pt(4)
        p_cap.paragraph_format.first_line_indent = Inches(0)
        p_cap.paragraph_format.keep_with_next = True
        run_cap = p_cap.add_run(caption_text)
        set_font(run_cap, size_pt=11.5, bold=True, italic=True, color=(40, 40, 40))
        
    table = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Header
    for c_idx, h in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.text = h
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        for r in p.runs:
            set_font(r, size_pt=11, bold=True, color=(255, 255, 255))
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1F497D"/>')
        cell._tc.get_or_add_tcPr().append(shading)
        
    # Rows
    for r_idx, r_data in enumerate(rows_data):
        fill_color = "F9FBFD" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(r_data):
            cell = table.cell(r_idx + 1, c_idx)
            cell.text = str(val)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            # If first column or short numbers, center; otherwise left
            if len(str(val)) <= 6 or c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            for r in p.runs:
                set_font(r, size_pt=10.5, bold=False, color=(20, 20, 20))
            if fill_color != "FFFFFF":
                shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
                cell._tc.get_or_add_tcPr().append(shading)
                
    # Column widths
    if col_widths:
        for row in table.rows:
            for c_idx, w in enumerate(col_widths):
                if c_idx < len(row.cells):
                    row.cells[c_idx].width = Inches(w)
                    
    # Source line under table
    src = resolve_table_source(caption_text, source_text)
    if src:
        p_src = doc.add_paragraph()
        p_src.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_src.paragraph_format.space_before = Pt(3)
        p_src.paragraph_format.space_after = Pt(8)
        p_src.paragraph_format.first_line_indent = Inches(0)
        formatted_src = f"(Nguồn: {src})" if not src.startswith("(") else src
        run_src = p_src.add_run(formatted_src)
        set_font(run_src, size_pt=10.5, bold=False, italic=True, color=(70, 70, 70))
    else:
        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(2)
        p_spacer.paragraph_format.space_after = Pt(6)
        
    return table

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

def add_figure(doc, image_path, caption_text, width_inches=5.6):
    if not os.path.exists(image_path):
        print(f"[WARN] Image not found: {image_path}")
        return None
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(4)
    p_img.paragraph_format.first_line_indent = Inches(0)
    run_img = p_img.add_run()
    run_img.add_picture(image_path, width=Inches(width_inches))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(10)
    p_cap.paragraph_format.first_line_indent = Inches(0)
    run_cap = p_cap.add_run(caption_text)
    set_font(run_cap, size_pt=11, bold=True, italic=True, color=(60, 60, 60))
    return p_img

def add_table(doc, headers, rows_data, caption_text=None, col_widths=None):
    if caption_text:
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_cap.paragraph_format.space_before = Pt(8)
        p_cap.paragraph_format.space_after = Pt(4)
        p_cap.paragraph_format.first_line_indent = Inches(0)
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
                    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(2)
    p_spacer.paragraph_format.space_after = Pt(4)
    return table

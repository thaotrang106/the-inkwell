import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

FONT_NAME = 'Times New Roman'
COLOR_PRIMARY = (0, 32, 96)       # #002060 Navy Blue
COLOR_SECONDARY = (27, 54, 93)    # Deep Slate Blue
COLOR_TEXT = (40, 40, 40)         # Charcoal text
COLOR_GRAY = (100, 100, 100)      # Gray

def set_font(run, size_pt=12, bold=False, italic=False, color=COLOR_TEXT, font_name=FONT_NAME):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor(*color)

def parse_inline_formatting(paragraph, text, base_size=12, base_color=COLOR_TEXT, italic_all=False):
    pattern = re.compile(r'(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$|\*[^*]+\*|\[[^\]]+\]\([^)]+\))')
    tokens = pattern.split(text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**'):
            bold_text = token[2:-2]
            r = paragraph.add_run(bold_text)
            set_font(r, size_pt=base_size, bold=True, italic=italic_all, color=base_color)
        elif token.startswith('`') and token.endswith('`'):
            code_text = token[1:-1]
            r = paragraph.add_run(code_text)
            set_font(r, size_pt=base_size - 1, bold=False, italic=False, color=(160, 32, 32), font_name='Consolas')
        elif token.startswith('$') and token.endswith('$'):
            math_text = token[1:-1]
            r = paragraph.add_run(math_text)
            set_font(r, size_pt=base_size, bold=False, italic=True, color=(0, 70, 140))
        elif token.startswith('*') and token.endswith('*'):
            it_text = token[1:-1]
            r = paragraph.add_run(it_text)
            set_font(r, size_pt=base_size, bold=False, italic=True, color=base_color)
        elif token.startswith('[') and '](' in token and token.endswith(')'):
            m = re.match(r'\[([^\]]+)\]\(([^)]+)\)', token)
            if m:
                label = m.group(1)
                r = paragraph.add_run(label)
                set_font(r, size_pt=base_size, bold=False, italic=False, color=(0, 102, 204))
                r.underline = True
            else:
                r = paragraph.add_run(token)
                set_font(r, size_pt=base_size, bold=False, italic=italic_all, color=base_color)
        else:
            r = paragraph.add_run(token)
            set_font(r, size_pt=base_size, bold=False, italic=italic_all, color=base_color)

def add_code_block(doc, code_lines):
    full_code = "".join(code_lines).rstrip('\n')
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    
    shading = parse_xml(r'<w:shd {} w:fill="F4F6F8"/>'.format(nsdecls('w')))
    cell._tc.get_or_add_tcPr().append(shading)
    
    tcBorders = parse_xml(r'''
        <w:tcBorders {} >
            <w:top w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="002060"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/>
        </w:tcBorders>
    '''.format(nsdecls('w')))
    cell._tc.get_or_add_tcPr().append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.first_line_indent = Inches(0)
    
    r = p.add_run(full_code)
    set_font(r, size_pt=9.5, bold=False, italic=False, color=(30, 30, 30), font_name='Consolas')
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def add_md_table(doc, table_lines):
    rows = []
    for line in table_lines:
        line_clean = line.strip().strip('|')
        cells = [c.strip() for c in line_clean.split('|')]
        if all(re.match(r'^:?-+:?$', c) for c in cells):
            continue
        rows.append(cells)
        
    if not rows:
        return
        
    cols_count = max(len(r) for r in rows)
    tbl = doc.add_table(rows=len(rows), cols=cols_count)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.style = 'Table Grid'
    
    tblBorders = parse_xml(r'''
        <w:tblBorders {} >
            <w:top w:val="single" w:sz="6" w:space="0" w:color="002060"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="002060"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/>
            <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
        </w:tblBorders>
    '''.format(nsdecls('w')))
    tbl._tbl.tblPr.append(tblBorders)
    
    total_w = 6.5
    if cols_count == 3:
        col_widths = [1.8, 2.3, 2.4]
    elif cols_count == 4:
        col_widths = [1.5, 1.8, 1.2, 2.0]
    elif cols_count == 5:
        col_widths = [1.1, 1.3, 1.1, 1.4, 1.6]
    else:
        col_widths = [total_w / cols_count] * cols_count
        
    for r_idx, row_data in enumerate(rows):
        row = tbl.rows[r_idx]
        is_header = (r_idx == 0)
        
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        if is_header:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
            
        for c_idx in range(cols_count):
            val = row_data[c_idx] if c_idx < len(row_data) else ""
            cell = row.cells[c_idx]
            cell.width = Inches(col_widths[c_idx])
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            
            if is_header:
                shd = parse_xml(r'<w:shd {} w:fill="002060"/>'.format(nsdecls('w')))
            elif r_idx % 2 == 1:
                shd = parse_xml(r'<w:shd {} w:fill="F9FAFB"/>'.format(nsdecls('w')))
            else:
                shd = parse_xml(r'<w:shd {} w:fill="FFFFFF"/>'.format(nsdecls('w')))
            cell._tc.get_or_add_tcPr().append(shd)
            
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if is_header or c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.2
            p.paragraph_format.first_line_indent = Inches(0)
            
            if is_header:
                r = p.add_run(val.replace('**', ''))
                set_font(r, size_pt=10.5, bold=True, italic=False, color=(255, 255, 255))
            else:
                parse_inline_formatting(p, val, base_size=10.0)

    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(6)

def build_readme_docx(md_path, docx_path):
    print(f"Converting {md_path} -> {docx_path}...")
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc = docx.Document()
    
    # Page setup: A4
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.79)
        section.bottom_margin = Inches(0.79)
        section.left_margin = Inches(0.98)
        section.right_margin = Inches(0.79)
        
        footer = section.footer
        p_ft = footer.paragraphs[0]
        p_ft.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_ft = p_ft.add_run("The Inkwell AI Platform – README Documentation | HUB 2026-2027")
        set_font(r_ft, size_pt=9, italic=True, color=(128, 128, 128))

    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # 1. Code blocks
        if stripped.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lines = []
            else:
                in_code_block = False
                add_code_block(doc, code_lines)
                code_lines = []
            i += 1
            continue
            
        if in_code_block:
            code_lines.append(line)
            i += 1
            continue
            
        # 2. Markdown Tables
        if stripped.startswith('|') and stripped.endswith('|'):
            if not in_table:
                in_table = True
                table_lines = [line]
            else:
                table_lines.append(line)
            i += 1
            continue
        else:
            if in_table:
                in_table = False
                add_md_table(doc, table_lines)
                table_lines = []
                
        # 3. Empty lines
        if not stripped:
            i += 1
            continue
            
        # 4. Skip HTML tags like <p align="center"> or <img ... /> badges
        if stripped.startswith('<p') or stripped.startswith('</p>') or stripped.startswith('<img'):
            i += 1
            continue
            
        # 5. Horizontal divider
        if stripped == '---':
            p_div = doc.add_paragraph()
            p_div.paragraph_format.space_before = Pt(6)
            p_div.paragraph_format.space_after = Pt(6)
            p_div_pBrd = parse_xml(r'<w:pBrd {}><w:bottom w:val="single" w:sz="6" w:space="1" w:color="002060"/></w:pBrd>'.format(nsdecls('w')))
            p_div._p.get_or_add_pPr().append(p_div_pBrd)
            i += 1
            continue

        # 6. Images: ![alt](url)
        img_match = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', stripped)
        if img_match:
            alt_text = img_match.group(1)
            img_rel_path = img_match.group(2).replace('%20', ' ')
            if os.path.exists(img_rel_path):
                p_img = doc.add_paragraph()
                p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_img.paragraph_format.space_before = Pt(8)
                p_img.paragraph_format.space_after = Pt(4)
                p_img.paragraph_format.first_line_indent = Inches(0)
                r_img = p_img.add_run()
                r_img.add_picture(img_rel_path, width=Inches(5.8))
                
                # Caption
                p_cap = doc.add_paragraph()
                p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_cap.paragraph_format.space_before = Pt(2)
                p_cap.paragraph_format.space_after = Pt(8)
                p_cap.paragraph_format.first_line_indent = Inches(0)
                r_cap = p_cap.add_run(alt_text)
                set_font(r_cap, size_pt=10.5, bold=True, italic=True, color=(60, 60, 60))
            else:
                print(f"Warning: Image not found: {img_rel_path}")
            i += 1
            continue

        # 7. Headings
        if stripped.startswith('# '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.first_line_indent = Inches(0)
            r = p.add_run(stripped[2:])
            set_font(r, size_pt=18, bold=True, color=COLOR_PRIMARY)
            i += 1
            continue
            
        if stripped.startswith('## '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.first_line_indent = Inches(0)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(stripped[3:])
            set_font(r, size_pt=14, bold=True, color=COLOR_PRIMARY)
            i += 1
            continue

        if stripped.startswith('### '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.first_line_indent = Inches(0)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(stripped[4:])
            set_font(r, size_pt=12.5, bold=True, color=COLOR_SECONDARY)
            i += 1
            continue

        # 8. Blockquote: > text
        if stripped.startswith('> '):
            quote_text = stripped[2:]
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.left_indent = Inches(0.4)
            p.paragraph_format.line_spacing = 1.25
            
            pBrd = parse_xml(r'<w:pBrd {}><w:left w:val="single" w:sz="18" w:space="8" w:color="002060"/></w:pBrd>'.format(nsdecls('w')))
            p._p.get_or_add_pPr().append(pBrd)
            
            parse_inline_formatting(p, quote_text, base_size=11.5, base_color=(50, 50, 50), italic_all=True)
            i += 1
            continue

        # 9. Bullet lists: * or -
        if stripped.startswith('* ') or stripped.startswith('- '):
            bullet_text = stripped[2:]
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.first_line_indent = Inches(-0.15)
            p.paragraph_format.line_spacing = 1.25
            
            r_bullet = p.add_run("▪  ")
            set_font(r_bullet, size_pt=10, bold=True, color=COLOR_PRIMARY)
            parse_inline_formatting(p, bullet_text, base_size=11.5)
            i += 1
            continue

        # 10. Numbered lists: 1. 2.
        num_match = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if num_match:
            num_idx = num_match.group(1)
            item_text = num_match.group(2)
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.first_line_indent = Inches(-0.15)
            p.paragraph_format.line_spacing = 1.25
            
            r_num = p.add_run(f"{num_idx}. ")
            set_font(r_num, size_pt=11.5, bold=True, color=COLOR_PRIMARY)
            parse_inline_formatting(p, item_text, base_size=11.5)
            i += 1
            continue

        # 11. Regular paragraph
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.25
        p.paragraph_format.first_line_indent = Inches(0)
        parse_inline_formatting(p, stripped, base_size=11.5)
        i += 1

    if in_table and table_lines:
        add_md_table(doc, table_lines)

    try:
        doc.save(docx_path)
        print(f"[SUCCESS] Saved {docx_path} ({os.path.getsize(docx_path)} bytes)")
    except PermissionError:
        alt_path = docx_path.replace('.docx', '_Updated.docx')
        doc.save(alt_path)
        print(f"[WARNING] {docx_path} is currently OPEN in Word! Saved to {alt_path} instead ({os.path.getsize(alt_path)} bytes).")

build_readme_docx('README.md', 'Final Report/README.docx')
build_readme_docx('README.md', 'README.docx')
print("All done!")

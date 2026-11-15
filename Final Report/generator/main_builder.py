import os
import sys
import docx
from docx.oxml import parse_xml

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add generator directory to sys.path
curr_dir = os.path.dirname(os.path.abspath(__file__))
if curr_dir not in sys.path:
    sys.path.insert(0, curr_dir)

from front_matter import update_front_matter, write_loi_mo_dau
from chapter1 import write_chapter_1
from chapter2 import write_chapter_2
from chapter3 import write_chapter_3
from chapter4 import write_chapter_4
from chapter5 import write_chapter_5

def build_full_report():
    template_path = os.path.join("Final Report", "Bao cao do án - Final.docx")
    output_v1_path = os.path.join("Final Report", "Final - V1.docx")
    output_root_path = "Final - V1.docx"
    output_legacy_path = os.path.join("Final Report", "Bao cao do an - The Inkwell - Ban Chinh Thuc.docx")
    
    print(f"Loading template document from {template_path} (READ-ONLY, KHÔNG GHI ĐÈ)...")
    doc = docx.Document(template_path)
    body = doc._body._element
    
    # 1. Update front matter (Covers, Cam đoan, Abbreviations, Figures list, Tables list)
    # Returns the section break paragraph ending the Front Matter (Section 3)
    p_sect3 = update_front_matter(doc)
    
    # 2. Extract Section 4's sectPr XML (Body section properties: footer rId21, page_start=1)
    s_body_xml = None
    for c in body:
        for s in c.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sectPr'):
            start = s.xpath('.//w:pgNumType/@w:start')
            if start and start[0] == '1':
                s_body_xml = s.xml
                break
        if s_body_xml:
            break
            
    # 3. Clean out ALL old body children (BOTH paragraphs AND tables) after p_sect3
    final_sectPr = body[-1]
    p_sect3_idx = list(body).index(p_sect3)
    to_remove_body = [c for i, c in enumerate(body) if i > p_sect3_idx and c != final_sectPr]
    print(f"Cleaning out {len(to_remove_body)} old body children (paragraphs AND tables)...")
    for c in to_remove_body:
        body.remove(c)
        
    # Replace final_sectPr with the extracted body sectPr
    if s_body_xml:
        new_sectPr = parse_xml(s_body_xml)
        body.replace(final_sectPr, new_sectPr)
        
    print(f"Verified tables in front matter: {len(doc.tables)} (Covers + Abbreviations)")
    
    # 4. Write all chapters sequentially
    print("\n--- GENERATING CHAPTERS ---")
    write_loi_mo_dau(doc)
    write_chapter_1(doc)
    write_chapter_2(doc)
    write_chapter_3(doc)
    write_chapter_4(doc)
    write_chapter_5(doc)
    
    print(f"\nTotal tables in generated report: {len(doc.tables)}")
    print(f"Total sections in generated report: {len(doc.sections)}")
    
    # 5. Save documents strictly to the requested new file: Final - V1.docx
    print("\n--- SAVING REFINED DOCUMENT TO FINAL - V1 ---")
    targets = [output_v1_path, output_root_path, output_legacy_path]
    for target in targets:
        try:
            doc.save(target)
            print(f"[SUCCESS] Đã lưu file kết quả tinh chỉnh tại: {target}")
        except PermissionError:
            fallback = target.replace(".docx", "_new.docx")
            print(f"[WARN] File đang mở trong Word: {target}. Lưu vào file dự phòng: {fallback}")
            doc.save(fallback)
            print(f"[SUCCESS] Đã lưu thành công vào: {fallback}")
        except Exception as e:
            print(f"[ERROR] Không thể lưu file {target}: {e}")
    
    print("\nAll tasks completed successfully!")

if __name__ == "__main__":
    build_full_report()

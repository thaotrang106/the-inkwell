import os
import sys
import docx

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
    output_path = os.path.join("Final Report", "Bao cao do an - The Inkwell - Ban Chinh Thuc.docx")
    
    print(f"Loading template document from {template_path} (READ-ONLY, KHÔNG GHI ĐÈ)...")
    doc = docx.Document(template_path)
    
    # 1. Update front matter (Covers, Cam đoan, Abbreviations, Figures list, Tables list)
    update_front_matter(doc)
    
    # 2. Find the index where LỜI MỞ ĐẦU begins
    idx_start_body = None
    for i, p in enumerate(doc.paragraphs):
        if "LỜI MỞ ĐẦU" in p.text.upper() or "MỞ ĐẦU" in p.text.upper():
            idx_start_body = i
            break
            
    if idx_start_body is not None:
        print(f"Found LỜI MỞ ĐẦU at paragraph index {idx_start_body}. Deleting old empty body paragraphs...")
        paras_to_remove = doc.paragraphs[idx_start_body:]
        for p in paras_to_remove:
            p._element.getparent().remove(p._element)
    else:
        print("[WARN] Could not find LỜI MỞ ĐẦU paragraph, appending to end of document.")
        
    # 3. Write all chapters sequentially
    print("\n--- GENERATING CHAPTERS ---")
    write_loi_mo_dau(doc)
    write_chapter_1(doc)
    write_chapter_2(doc)
    write_chapter_3(doc)
    write_chapter_4(doc)
    write_chapter_5(doc)
    
    # 4. Save documents strictly to a separate file
    print("\n--- SAVING COMPLETED DOCUMENT TO SEPARATE FILE ---")
    try:
        doc.save(output_path)
        print(f"[SUCCESS] Đã lưu file kết quả riêng biệt tại: {output_path}")
    except PermissionError:
        fallback_path = os.path.join("Final Report", "Bao cao do an - The Inkwell - Ban Chinh Thuc - V2.docx")
        print(f"[WARN] File đang được mở trong Word: {output_path}. Đang lưu vào file dự phòng: {fallback_path}")
        doc.save(fallback_path)
        print(f"[SUCCESS] Đã lưu thành công vào file dự phòng: {fallback_path}")
    except Exception as e:
        print(f"[ERROR] Không thể lưu file: {e}")
    
    print("\nAll tasks completed successfully!")

if __name__ == "__main__":
    build_full_report()

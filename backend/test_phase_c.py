import os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from dotenv import load_dotenv
load_dotenv('backend/.env')
sys.path.insert(0, 'backend')

from app.main import log_interaction, for_you, InteractionIn
from app.db import SessionLocal
from sqlalchemy import text

# Clean up interactions for user 1 before testing
s = SessionLocal()
s.execute(text("DELETE FROM interactions WHERE user_id = 1"))
s.commit()
s.close()

print("==================================================")
print("TEST 1: GET /api/recommendations/foryou/1 TRƯỚC KHI TƯƠNG TÁC")
print("==================================================")
data1 = for_you(user_id=1, limit=5)
print("Strategy:", data1.get("strategy"))
seeds1 = [s["title"] for s in data1.get("seeds", [])]
print("Seeds ban đầu:", seeds1)
print("Top 5 sách gợi ý ban đầu:")
for it in data1.get("items", [])[:5]:
    print(f"  - {it['title']} (Lý do: {it.get('because')})")

print("\n==================================================")
print("TEST 2: GỌI POST /api/interactions (add_to_cart cuốn sách lạ #9: Angels & Demons)")
print("==================================================")
body = InteractionIn(
    user_id=1,
    book_id=9, # Angels & Demons
    interaction_type="add_to_cart"
)
res_post = log_interaction(body=body)
print("Response:", res_post)
assert res_post.get("ok") is True

print("\n==================================================")
print("TEST 3: GET /api/recommendations/foryou/1 SAU KHI TƯƠNG TÁC")
print("==================================================")
data2 = for_you(user_id=1, limit=5)
print("Strategy:", data2.get("strategy"))
seeds2 = [s["title"] for s in data2.get("seeds", [])]
print("Seeds sau khi thêm giỏ:", seeds2)
print("Top 5 sách gợi ý sau khi thêm giỏ:")
for it in data2.get("items", [])[:5]:
    print(f"  - {it['title']} (Lý do: {it.get('because')})")

# Kiểm tra xem cuốn sách #9 có xuất hiện trong seeds không
has_book_9 = any("Angels" in s for s in seeds2)
print(f"\n=> Kiểm tra sách #9 (Angels & Demons) có trong hạt giống: {has_book_9}")
assert has_book_9, "Sách #9 phải có trong hạt giống sau khi add_to_cart!"

# Kiểm tra xem danh sách mới có nghiêng về cuốn sách vừa tương tác không
has_dan_brown = any(it.get('because') and "Angels" in it.get('because') for it in data2.get("items", []))
print(f"=> Danh sách gợi ý nghiêng về cuốn sách vừa tương tác: {has_dan_brown}")
assert has_dan_brown, "Phải có sách gợi ý vì cuốn vừa tương tác!"

print("\n==================================================")
print("=> GIAI ĐOẠN C HOÀN TẤT VÀ KIỂM TRA THÀNH CÔNG 100%!")
print("==================================================")

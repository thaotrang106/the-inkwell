import os
import sys
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Setup path
sys.path.insert(0, str(Path(__file__).resolve().parent))
load_dotenv(Path(__file__).resolve().parent / ".env")

from sqlalchemy import text
from app.db import SessionLocal
from app.main import ask_mercy_explain, log_interaction, InteractionIn
from app.services.personalized import get_for_you

def test_phase_e():
    print("=" * 60)
    print("BAT DAU KIEM TRA GIAI DOAN E (CACHE & BATCH JOB)")
    print("=" * 60)

    session = SessionLocal()

    # -------------------------------------------------------------
    # TEST E2: Batch job popular_books
    # -------------------------------------------------------------
    print("\n--- [E2] Kiem tra ket qua batch job popular_books ---")
    pop_count = session.execute(text("SELECT count(*) FROM popular_books")).scalar()
    min_rank, max_rank = session.execute(text("SELECT min(rank), max(rank) FROM popular_books")).fetchone()
    print(f"So luong sach trong popular_books: {pop_count} (Ky vong: 100)")
    print(f"Khoang thu hang: {min_rank} -> {max_rank} (Ky vong: 1 -> 100)")
    assert pop_count == 100, f"Expected 100 books, got {pop_count}"
    assert min_rank == 1 and max_rank == 100, f"Expected rank 1..100, got {min_rank}..{max_rank}"

    top_rows = session.execute(text("""
        SELECT p.rank, p.book_id, b.title, p.score 
        FROM popular_books p 
        JOIN books b ON p.book_id = b.book_id 
        ORDER BY p.rank ASC LIMIT 3
    """)).fetchall()
    for r in top_rows:
        print(f"  #Rank {r[0]}: ID {r[1]} - {r[2][:40]} (Score: {r[3]:.4f})")
    print(">> [E2] DAT YEU CAU!")

    # -------------------------------------------------------------
    # TEST E1: Cache loi giai thich cua Mercy
    # -------------------------------------------------------------
    print("\n--- [E1] Kiem tra Cache ai_explanation (Explainable AI) ---")
    test_book_id = 27  # Harry Potter and the Half-Blood Prince
    # Xoa cache cu neu co de test tu dau
    session.execute(text("UPDATE books SET ai_explanation = NULL WHERE book_id = :b"), {"b": test_book_id})
    session.commit()

    print(f"1. Goi ask_mercy_explain cho book_id={test_book_id} lan 1 (Chua co cache)...")
    res1 = ask_mercy_explain(test_book_id, session)
    print(f"   Ket qua lan 1: cached = {res1.get('cached')}, status = {res1.get('status')}")
    print(f"   Noi dung AI (50 ky tu dau): {res1['data'][:50]}...")
    assert res1.get('cached') is False, "Lan 1 phai la cached = False"

    # Kiem tra trong DB xem da luu ai_explanation chua
    db_saved = session.execute(text("SELECT ai_explanation FROM books WHERE book_id = :b"), {"b": test_book_id}).scalar()
    assert db_saved is not None and len(db_saved) > 20, "ai_explanation phai duoc luu vao DB"
    print("   -> Da xac nhan ai_explanation da duoc luu vao Database!")

    print(f"2. Goi ask_mercy_explain cho book_id={test_book_id} lan 2 (Da co cache trong DB)...")
    res2 = ask_mercy_explain(test_book_id, session)
    print(f"   Ket qua lan 2: cached = {res2.get('cached')}, status = {res2.get('status')}")
    assert res2.get('cached') is True, "Lan 2 phai lay tu cache (cached = True)"
    assert res2['data'] == res1['data'], "Noi dung lan 2 phai khop chinh xac voi lan 1"
    print(">> [E1] DAT YEU CAU! Mo cung mot cuon sach lan 2 khong tang request Gemini.")

    # -------------------------------------------------------------
    # TEST E3: Recommendation Cache & Invalidation
    # -------------------------------------------------------------
    print("\n--- [E3] Kiem tra recommendation_cache & Invalidation ---")
    test_user_id = 1
    # Xoa cache cu cua user 1
    session.execute(text("DELETE FROM recommendation_cache WHERE user_id = :u"), {"u": test_user_id})
    session.commit()

    print(f"1. Goi get_for_you cho user_id={test_user_id} lan 1 (Cache Miss)...")
    rec1 = get_for_you(test_user_id, limit=6)
    print(f"   Ket qua lan 1: cached = {rec1.get('cached')}, items count = {len(rec1['items'])}")
    assert rec1.get('cached') is False, "Lan 1 phai tinh toan moi (cached = False)"

    # Kiem tra DB recommendation_cache
    cache_entry = session.execute(text("SELECT book_ids, scores, generated_at FROM recommendation_cache WHERE user_id = :u"), {"u": test_user_id}).fetchone()
    assert cache_entry is not None, "recommendation_cache phai co row cho user 1"
    print(f"   -> Da luu vao DB recommendation_cache: {len(cache_entry[0])} sach vao luc {cache_entry[2]}")

    print(f"2. Goi get_for_you cho user_id={test_user_id} lan 2 (Cache Hit)...")
    rec2 = get_for_you(test_user_id, limit=6)
    print(f"   Ket qua lan 2: cached = {rec2.get('cached')}, items count = {len(rec2['items'])}")
    assert rec2.get('cached') is True, "Lan 2 phai lay tu cache (cached = True)"
    assert [x['book_id'] for x in rec1['items']] == [x['book_id'] for x in rec2['items']], "Danh sach sach goi y phai dong nhat"

    print(f"3. Nguoi dung tuong tac moi (add_to_cart) -> Kiem tra Invalidation...")
    log_interaction(InteractionIn(user_id=test_user_id, book_id=422, interaction_type="add_to_cart"))
    remaining_cache = session.execute(text("SELECT count(*) FROM recommendation_cache WHERE user_id = :u"), {"u": test_user_id}).scalar()
    print(f"   So ban ghi recommendation_cache con lai sau tuong tac: {remaining_cache} (Ky vong: 0)")
    assert remaining_cache == 0, "Cache phai bi vo hieu hoa (xoa) sau khi co hanh vi moi"

    print(f"4. Goi get_for_you cho user_id={test_user_id} lan 3 (Sau khi Invalidate)...")
    rec3 = get_for_you(test_user_id, limit=6)
    print(f"   Ket qua lan 3: cached = {rec3.get('cached')}, items count = {len(rec3['items'])}")
    assert rec3.get('cached') is False, "Lan 3 phai duoc tinh toan lai tu dau voi hanh vi moi nhat"
    print(">> [E3] DAT YEU CAU! recommendation_cache hoat dong dung thiet ke offline-online & invalidation.")

    session.close()
    print("\n" + "=" * 60)
    print("TAT CA CAC MUC E1, E2, E3 CUA GIAI DOAN E DA THANH CONG 100%!")
    print("=" * 60)

if __name__ == "__main__":
    test_phase_e()

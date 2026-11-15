import csv
from sqlalchemy.dialects.postgresql import insert
from app.db import engine, SessionLocal
from app.models import User, Book, Rating, Tag, BookTag

session = SessionLocal()

def import_tags():
    print("4. Đang nạp 34.000 Tags (tags.csv)...")
    with open('../data/tags.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        tags_data = []
        for row in reader:
            tags_data.append({
                "tag_id": int(row["tag_id"]),
                "tag_name": row["tag_name"]
            })
            if len(tags_data) >= 5000:
                stmt = insert(Tag).values(tags_data).on_conflict_do_nothing()
                session.execute(stmt)
                session.commit()
                tags_data = []
        if tags_data:
            stmt = insert(Tag).values(tags_data).on_conflict_do_nothing()
            session.execute(stmt)
            session.commit()
    print("-> Nạp Tags xong!")

def import_book_tags(limit=300000):
    print(f"5. Đang nạp {limit} dòng Book Tags (book_tags.csv)...")
    
    # Bước phụ: Đọc file sách để tạo từ điển chuyển đổi (goodreads_id -> book_id)
    # Vì file book_tags.csv dùng goodreads_id, nhưng Database của ta lại liên kết bằng book_id
    print("   Đang tạo bản đồ ID sách...")
    id_map = {}
    with open('../data/books_enriched.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            id_map[int(row["goodreads_book_id"])] = int(row["book_id"])
            
    print("   Bắt đầu nạp Book Tags...")
    with open('../data/book_tags.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        book_tags_data = []
        count = 0
        for row in reader:
            if count >= limit:
                break
            
            goodreads_id = int(row["goodreads_book_id"])
            
            # Chỉ nạp nếu sách đó thực sự tồn tại trong danh sách 10.000 cuốn
            if goodreads_id in id_map:
                book_tags_data.append({
                    "book_id": id_map[goodreads_id],  # Đổi sang ID chuẩn
                    "tag_id": int(row["tag_id"]),
                    "count": int(row["count"])
                })
                count += 1
                
                if len(book_tags_data) >= 5000:
                    stmt = insert(BookTag).values(book_tags_data).on_conflict_do_nothing()
                    session.execute(stmt)
                    session.commit()
                    book_tags_data = []
                    print(f"   Đã nạp {count} book tags...")
                    
        if book_tags_data:
            stmt = insert(BookTag).values(book_tags_data).on_conflict_do_nothing()
            session.execute(stmt)
            session.commit()
    print("-> Nạp Book Tags xong!")

if __name__ == "__main__":
    try:
        import_tags()
        import_book_tags(limit=300000)
        print("TẤT CẢ ĐÃ HOÀN TẤT! Dữ liệu Tags đã lên Supabase!")
    except Exception as e:
        print(f"Bị lỗi rồi: {e}")
    finally:
        session.close()
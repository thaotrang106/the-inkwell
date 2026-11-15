import os
import time
import requests
from dotenv import load_dotenv
from sqlalchemy import text
from app.db import SessionLocal

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("LỖI: Chưa có GEMINI_API_KEY trong file .env!")
    exit(1)

URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:batchEmbedContents?key={GEMINI_API_KEY}"

def get_embeddings_batch(books_batch):
    requests_payload = []
    for book_id, _, description in books_batch:
        requests_payload.append({
            "model": "models/gemini-embedding-2",
            "outputDimensionality": 768,
            "content": {
                "parts": [{"text": description}]
            }
        })
        
    payload = {"requests": requests_payload}
    
    try:
        response = requests.post(URL, json=payload, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            data = response.json()
            return [emb["values"] for emb in data.get("embeddings", [])]
        else:
            print(f"Lỗi API: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Lỗi kết nối: {e}")
        return None

def main():
    print("🚀 Khởi động siêu động cơ Batch AI (Gom 90 cuốn - Nghỉ 90s)...")
    session = SessionLocal()
    
    try:
        query = text("""
            SELECT book_id, title, description 
            FROM books 
            WHERE embedding IS NULL AND description IS NOT NULL AND description != ''
            ORDER BY book_id ASC
        """)
        
        books = session.execute(query).fetchall()
        total_books = len(books)
        print(f"📚 Tìm thấy {total_books} cuốn sách chưa có Vector.")
        
        BATCH_SIZE = 90 # Giới hạn Google là 100/phút, mình nạp 90 thôi cho an toàn
        count = 0
        retry_count = 0
        
        i = 0
        while i < total_books:
            batch = books[i:i+BATCH_SIZE]
            print(f"Đang xử lý lô sách từ {i+1} đến {min(i+BATCH_SIZE, total_books)}...")
            
            vectors = get_embeddings_batch(batch)
            
            if vectors and len(vectors) == len(batch):
                for j, book in enumerate(batch):
                    book_id = book[0]
                    vector_str = str(vectors[j])
                    
                    update_query = text("UPDATE books SET embedding = :vec WHERE book_id = :id")
                    session.execute(update_query, {"vec": vector_str, "id": book_id})
                
                session.commit()
                count += len(batch)
                
                print(f"   ✅ Xong lô {i+1}. Đang nghỉ 90s để xả trạm API...")
                time.sleep(90) 
                
                i += BATCH_SIZE 
                retry_count = 0 # Đặt lại bộ đếm sau khi thành công
            else:
                retry_count += 1
                if retry_count > 5:
                    print(f"   ❌ Lô từ {i+1} đã thất bại 5 lần liên tiếp (Lỗi vĩnh viễn). Dừng chương trình để bảo vệ hệ thống!")
                    break
                    
                print(f"   ⚠️ Lô từ {i+1} bị Rate Limit hoặc lỗi API (Lần thử {retry_count}/5)...")
                print("   ⏳ Hệ thống tự động nghỉ 90 giây để thử lại lô này...")
                time.sleep(90)

        print(f"✅ HOÀN TẤT QUÁ TRÌNH! Đã nạp thành công {count} cuốn sách.")

    except Exception as e:
        print(f"❌ Có lỗi bất ngờ: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    main()

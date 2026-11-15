import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Cấu hình UTF-8 cho console Windows để tránh UnicodeEncodeError khi in tiếng Việt
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Đảm bảo nạp đúng file .env dù chạy từ root hay từ backend/
env_candidates = [
    Path(".env"),
    Path("backend/.env"),
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent / ".env"
]

for p in env_candidates:
    if p.exists():
        load_dotenv(p)
        break
else:
    load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL không tìm thấy trong biến môi trường hoặc .env!")

engine = create_engine(DATABASE_URL)

SQL = """
WITH g AS (
    SELECT AVG(average_rating) AS c,
           PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ratings_count) AS m
    FROM books
)
SELECT b.book_id,
       (b.ratings_count::double precision / (b.ratings_count + g.m)) * b.average_rating
     + (g.m::double precision / (b.ratings_count + g.m)) * g.c AS score
FROM books b, g
ORDER BY score DESC
LIMIT 100
"""

def run():
    with engine.begin() as conn:
        rows = conn.execute(text(SQL)).fetchall()
        conn.execute(text("DELETE FROM popular_books"))
        for rank, (book_id, score) in enumerate(rows, start=1):
            conn.execute(text(
                "INSERT INTO popular_books (book_id, score, rank, updated_at) VALUES (:b, :s, :r, NOW())"),
                {"b": book_id, "s": float(score), "r": rank})
    print(f"Đã cập nhật {len(rows)} sách")

if __name__ == "__main__":
    run()

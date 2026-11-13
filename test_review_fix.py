import os, sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, 'backend')
load_dotenv('backend/.env')

from app.db import SessionLocal
from app.models import Book, Review
from sqlalchemy import text
from datetime import datetime

s = SessionLocal()
try:
    test_bid = 25 # Deathly Hallows
    book = s.query(Book).filter(Book.book_id == test_bid).first()
    print("Testing for Book 25:", book.title)

    # 1. Rating counts from DB
    db_ratings = s.execute(text("""
        SELECT rating, count(*) 
        FROM ratings 
        WHERE book_id = :b AND rating BETWEEN 1 AND 5
        GROUP BY rating
    """), {"b": test_bid}).fetchall()
    
    distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    total_ratings_count = 0
    for r, cnt in db_ratings:
        distribution[r] = cnt
        total_ratings_count += cnt
        
    print("Distribution from ratings table:", distribution)
    print("Total ratings:", total_ratings_count)
finally:
    s.close()

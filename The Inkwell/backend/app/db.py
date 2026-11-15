import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.models import Base

from pathlib import Path

# Load biến môi trường từ file .env (hỗ trợ cả khi chạy từ backend/ hoặc thư mục gốc)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)
if not os.getenv("DATABASE_URL"):
    load_dotenv()

# Chuỗi kết nối PostgreSQL — đọc từ biến môi trường, không hardcode mật khẩu
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Khởi tạo engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Lệnh này sẽ tạo toàn bộ các bảng trong models.py vào database
    print("Đang tạo các bảng trong cơ sở dữ liệu...")
    Base.metadata.create_all(bind=engine)
    print("Tạo Database thành công!")

if __name__ == "__main__":
    init_db()

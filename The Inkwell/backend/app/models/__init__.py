from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Quan hệ
    ratings = relationship("Rating", back_populates="user")
    interactions = relationship("Interaction", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class Book(Base):
    __tablename__ = 'books'

    book_id = Column(Integer, primary_key=True, index=True)
    goodreads_book_id = Column(Integer, unique=True, index=True)
    authors = Column(String)
    original_title = Column(String)
    title = Column(String)
    language_code = Column(String)
    image_url = Column(String)
    small_image_url = Column(String)
    description = Column(String)
    average_rating = Column(Float)
    ratings_count = Column(Integer)
    ai_explanation = Column(String)
    embedding = Column(Vector(768)) # Vector 768 chiều cho AI Gemini

    # Quan hệ
    ratings = relationship("Rating", back_populates="book")
    tags = relationship("BookTag", back_populates="book")
    interactions = relationship("Interaction", back_populates="book")
    popular_book = relationship("PopularBook", back_populates="book", uselist=False)
    reviews = relationship("Review", back_populates="book")

class Rating(Base):
    __tablename__ = 'ratings'

    rating_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete="CASCADE"))
    book_id = Column(Integer, ForeignKey('books.book_id', ondelete="CASCADE"))
    rating = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ratings")
    book = relationship("Book", back_populates="ratings")

class Tag(Base):
    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String, unique=True)

    books = relationship("BookTag", back_populates="tag")

class BookTag(Base):
    __tablename__ = 'book_tags'

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey('books.book_id', ondelete="CASCADE"))
    tag_id = Column(Integer, ForeignKey('tags.tag_id', ondelete="CASCADE"))
    count = Column(Integer)

    book = relationship("Book", back_populates="tags")
    tag = relationship("Tag", back_populates="books")

# ================= CÁC BẢNG BỔ SUNG ĐỂ TỐI ƯU HỆ THỐNG GỢI Ý =================

class Interaction(Base):
    """Bảng lưu trữ hành vi ngầm của user (Implicit feedback)"""
    __tablename__ = 'interactions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete="CASCADE"))
    book_id = Column(Integer, ForeignKey('books.book_id', ondelete="CASCADE"))
    interaction_type = Column(String(20), nullable=False) # 'view', 'click', 'purchase', 'add_to_cart'
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interactions")
    book = relationship("Book", back_populates="interactions")

class PopularBook(Base):
    """Bảng lưu Top sách Trending để giải quyết Cold-Start (User mới)"""
    __tablename__ = 'popular_books'

    book_id = Column(Integer, ForeignKey('books.book_id', ondelete="CASCADE"), primary_key=True)
    score = Column(Float, nullable=False)
    rank = Column(Integer)
    updated_at = Column(DateTime, default=datetime.utcnow)

    book = relationship("Book", back_populates="popular_book")

class RecommendationCache(Base):
    """Bảng lưu trữ kết quả gợi ý cá nhân hóa (/foryou) theo user_id, hết hạn sau 1 giờ"""
    __tablename__ = 'recommendation_cache'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete="CASCADE"))
    model_version = Column(String(50))
    book_ids = Column(ARRAY(Integer))
    scores = Column(ARRAY(Float))
    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class Review(Base):
    """Bảng lưu trữ nhận xét chi tiết của độc giả (Reviews)"""
    __tablename__ = 'reviews'

    review_id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey('books.book_id', ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(String, nullable=False)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")

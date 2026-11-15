-- ==============================================================================
-- THE INKWELL BOOKSTORE - POSTGRESQL & PGVECTOR DATABASE SCHEMA
-- Hệ thống Thương mại Điện tử Sách & Đề xuất Cá nhân hóa Đa thuật toán
-- Khóa luận Tốt nghiệp Ngành Hệ thống Thông tin Quản lý (MIS) - HUB 2026-2027
-- ==============================================================================

-- 1. Kích hoạt tiện ích mở rộng pgvector (768 chiều cho Google Gemini text-embedding-004)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Bảng Người dùng (users)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Bảng Tác phẩm / Sách (books)
CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    goodreads_book_id INTEGER UNIQUE,
    authors TEXT,
    original_title TEXT,
    title TEXT NOT NULL,
    language_code VARCHAR(10),
    image_url TEXT,
    small_image_url TEXT,
    description TEXT,
    average_rating DOUBLE PRECISION,
    ratings_count INTEGER DEFAULT 0,
    ai_explanation TEXT,
    embedding vector(768) -- Vector embedding 768 chiều từ Gemini API
);

CREATE INDEX IF NOT EXISTS idx_books_goodreads_id ON books(goodreads_book_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- Chỉ mục HNSW cho tìm kiếm tương đồng vector Cosine siêu tốc (< 15ms cho 10.000 sách)
CREATE INDEX IF NOT EXISTS idx_books_embedding_hnsw 
ON books USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. Bảng Đánh giá xếp hạng (ratings)
CREATE TABLE IF NOT EXISTS ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_book_id ON ratings(book_id);

-- 5. Bảng Nhãn / Thể loại (tags & book_tags)
CREATE TABLE IF NOT EXISTS tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS book_tags (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE,
    count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_book_tags_book_id ON book_tags(book_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_tag_id ON book_tags(tag_id);

-- 6. Bảng Tương tác người dùng ngầm (interactions - Implicit Feedback)
CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- 'view', 'click', 'purchase', 'add_to_cart', 'wishlist'
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_interactions_user ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_book ON interactions(book_id);

-- 7. Bảng Xếp hạng thịnh hành Cold-Start (popular_books - Bayesian Average Rating)
CREATE TABLE IF NOT EXISTS popular_books (
    book_id INTEGER PRIMARY KEY REFERENCES books(book_id) ON DELETE CASCADE,
    score DOUBLE PRECISION NOT NULL,
    rank INTEGER,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- 8. Bảng Bộ đệm đề xuất cá nhân hóa (recommendation_cache)
CREATE TABLE IF NOT EXISTS recommendation_cache (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    model_version VARCHAR(50),
    book_ids INTEGER[],
    scores DOUBLE PRECISION[],
    generated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_rec_cache_user ON recommendation_cache(user_id);

-- 9. Bảng Nhận xét & Đánh giá chi tiết của Độc giả (reviews)
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

/**
 * Danh mục Độc giả mẫu chuẩn hóa theo Báo cáo Đồ án tốt nghiệp The Inkwell.
 * Đảm bảo mọi màn hình (Trang chủ, Trending, Profile, etc.) đều có thể
 * truy xuất thông tin gu đọc và danh sách đề xuất may đo riêng kèm Explanation Badge.
 */

export interface DemoBook {
  book_id: number;
  title: string;
  author: string;
  image_url: string;
  rating: number;
  price: number;
  original_price: number;
  hybrid_score: number;
  explanation: string;
  because: string;
}

export interface DemoReader {
  user_id: number;
  name: string;
  shortName: string;
  genre: string;
  tagline: string;
  email: string;
  tier: string;
  books: DemoBook[];
}

export const DEMO_READERS: DemoReader[] = [
  {
    user_id: 35,
    name: "Độc giả Minh Anh",
    shortName: "Minh Anh",
    genre: "Gu Kỳ ảo & Giả tưởng",
    tagline: "112 đánh giá • Yêu thích Harry Potter & Thế giới phép thuật",
    email: "minhanh@theinkwell.vn",
    tier: "Độc giả Uyên Bác",
    books: [
      {
        book_id: 1,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        image_url: "https://images.gr-assets.com/books/1474154022l/3.jpg",
        rating: 4.47,
        price: 180000,
        original_price: 220000,
        hybrid_score: 98,
        explanation: "Gu Kỳ ảo & Giả tưởng",
        because: "Harry Potter",
      },
      {
        book_id: 2,
        title: "Harry Potter and the Prisoner of Azkaban",
        author: "J.K. Rowling",
        image_url: "https://images.gr-assets.com/books/1630547330l/5.jpg",
        rating: 4.56,
        price: 195000,
        original_price: 240000,
        hybrid_score: 97,
        explanation: "Cùng Tác Giả & Thế Giới",
        because: "Harry Potter",
      },
      {
        book_id: 3,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        image_url: "https://images.gr-assets.com/books/1546071216l/5907.jpg",
        rating: 4.27,
        price: 165000,
        original_price: 200000,
        hybrid_score: 96,
        explanation: "Kỳ Ảo Kinh Điển",
        because: "Harry Potter",
      },
      {
        book_id: 4,
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        image_url: "https://images.gr-assets.com/books/1298411339l/34.jpg",
        rating: 4.36,
        price: 210000,
        original_price: 260000,
        hybrid_score: 95,
        explanation: "Sử Thi Giả Tưởng",
        because: "The Hobbit",
      },
      {
        book_id: 5,
        title: "The Golden Compass",
        author: "Philip Pullman",
        image_url: "https://images.gr-assets.com/books/1342493368l/119322.jpg",
        rating: 3.99,
        price: 170000,
        original_price: 210000,
        hybrid_score: 93,
        explanation: "Thế Giới Phép Thuật",
        because: "Harry Potter",
      },
    ],
  },
  {
    user_id: 1,
    name: "Độc giả Hoàng Nam",
    shortName: "Hoàng Nam",
    genre: "Gu Kinh điển & Triết học",
    tagline: "53 đánh giá • Yêu thích Văn học Kinh điển & Chiêm nghiệm",
    email: "hoangnam@theinkwell.vn",
    tier: "Thành viên Thân thiết",
    books: [
      {
        book_id: 6,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        image_url: "https://images.gr-assets.com/books/1553383690l/2657.jpg",
        rating: 4.27,
        price: 190000,
        original_price: 230000,
        hybrid_score: 96,
        explanation: "Văn Học Kinh Điển",
        because: "Goodreads Top",
      },
      {
        book_id: 7,
        title: "1984",
        author: "George Orwell",
        image_url: "https://images.gr-assets.com/books/1657781256l/5470.jpg",
        rating: 4.19,
        price: 175000,
        original_price: 210000,
        hybrid_score: 95,
        explanation: "Triết Học & Xã Hội",
        because: "To Kill a Mockingbird",
      },
      {
        book_id: 8,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        image_url: "https://images.gr-assets.com/books/1490528560l/4671.jpg",
        rating: 3.91,
        price: 160000,
        original_price: 195000,
        hybrid_score: 94,
        explanation: "Kinh Điển Nước Mỹ",
        because: "1984",
      },
      {
        book_id: 9,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        image_url: "https://images.gr-assets.com/books/1320399351l/1885.jpg",
        rating: 4.26,
        price: 160000,
        original_price: 190000,
        hybrid_score: 93,
        explanation: "Văn Học Lãng Mạn",
        because: "Harper Lee",
      },
      {
        book_id: 10,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        image_url: "https://images.gr-assets.com/books/1398034300l/5107.jpg",
        rating: 3.81,
        price: 175000,
        original_price: 210000,
        hybrid_score: 92,
        explanation: "Tâm Lý & Chiêm Nghiệm",
        because: "1984",
      },
    ],
  },
  {
    user_id: 75,
    name: "Độc giả Thu Trang",
    shortName: "Thu Trang",
    genre: "Gu Trinh thám & Bí ẩn",
    tagline: "84 đánh giá • Yêu thích Mật mã, Ly kỳ & Tội phạm",
    email: "thutrang@theinkwell.vn",
    tier: "Độc giả Tinh hoa",
    books: [
      {
        book_id: 11,
        title: "The Da Vinci Code",
        author: "Dan Brown",
        image_url: "https://images.gr-assets.com/books/1579621267l/968.jpg",
        rating: 3.84,
        price: 185000,
        original_price: 220000,
        hybrid_score: 97,
        explanation: "Trinh Thám & Mật Mã",
        because: "Angels & Demons",
      },
      {
        book_id: 12,
        title: "Angels & Demons",
        author: "Dan Brown",
        image_url: "https://images.gr-assets.com/books/1303390735l/968.jpg",
        rating: 3.91,
        price: 180000,
        original_price: 215000,
        hybrid_score: 96,
        explanation: "Cùng Tác Giả Dan Brown",
        because: "The Da Vinci Code",
      },
      {
        book_id: 13,
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        image_url: "https://images.gr-assets.com/books/1684638853l/2429135.jpg",
        rating: 4.14,
        price: 195000,
        original_price: 240000,
        hybrid_score: 94,
        explanation: "Tội Phạm & Ly Kỳ",
        because: "The Da Vinci Code",
      },
      {
        book_id: 14,
        title: "Gone Girl",
        author: "Gillian Flynn",
        image_url: "https://images.gr-assets.com/books/1554086139l/19288043.jpg",
        rating: 4.07,
        price: 175000,
        original_price: 210000,
        hybrid_score: 93,
        explanation: "Tâm Lý Tội Phạm",
        because: "Dragon Tattoo",
      },
      {
        book_id: 15,
        title: "And Then There Were None",
        author: "Agatha Christie",
        image_url: "https://images.gr-assets.com/books/1638425885l/16299.jpg",
        rating: 4.26,
        price: 165000,
        original_price: 200000,
        hybrid_score: 91,
        explanation: "Kỳ Phùng Địch Thủ",
        because: "Dan Brown",
      },
    ],
  },
];

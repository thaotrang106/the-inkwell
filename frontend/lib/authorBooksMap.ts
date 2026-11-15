/**
 * Bộ nhớ đệm danh mục sách cùng tác giả (Also By This Author) cho các tác gia nổi tiếng.
 * Đảm bảo khối "Cùng tác giả" luôn xuất hiện tức thì trong 0ms khi xem chi tiết sách.
 */

export interface AuthorBook {
  book_id: number;
  title: string;
  author: string;
  image_url: string;
  rating: number;
  price: number;
  original_price: number;
  badge?: string;
  genre?: string;
}

export const KNOWN_AUTHOR_BOOKS: Record<string, AuthorBook[]> = {
  rowling: [
    {
      book_id: 1,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      image_url: "https://images.gr-assets.com/books/1474154022l/3.jpg",
      rating: 4.47,
      price: 180000,
      original_price: 220000,
      badge: "Tập 1 Kinh Điển",
    },
    {
      book_id: 2,
      title: "Harry Potter and the Prisoner of Azkaban",
      author: "J.K. Rowling",
      image_url: "https://images.gr-assets.com/books/1630547330l/5.jpg",
      rating: 4.56,
      price: 195000,
      original_price: 240000,
      badge: "Tập 3 Xuất Sắc",
    },
    {
      book_id: 201,
      title: "Harry Potter and the Chamber of Secrets",
      author: "J.K. Rowling",
      image_url: "https://images.gr-assets.com/books/1474169725l/15881.jpg",
      rating: 4.42,
      price: 185000,
      original_price: 225000,
      badge: "Tập 2 Bí Ẩn",
    },
    {
      book_id: 202,
      title: "Harry Potter and the Goblet of Fire",
      author: "J.K. Rowling",
      image_url: "https://images.gr-assets.com/books/1554006138l/6.jpg",
      rating: 4.55,
      price: 210000,
      original_price: 260000,
      badge: "Tập 4 Đấu Tam Pháp Thuật",
    },
    {
      book_id: 203,
      title: "Harry Potter and the Deathly Hallows",
      author: "J.K. Rowling",
      image_url: "https://images.gr-assets.com/books/1663805647l/136251.jpg",
      rating: 4.62,
      price: 220000,
      original_price: 270000,
      badge: "Tập Kết Hùng Tráng",
    },
  ],

  tolkien: [
    {
      book_id: 3,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      image_url: "https://images.gr-assets.com/books/1546071216l/5907.jpg",
      rating: 4.27,
      price: 165000,
      original_price: 200000,
      badge: "Tiền Truyện Chúa Nhẫn",
    },
    {
      book_id: 4,
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      image_url: "https://images.gr-assets.com/books/1298411339l/34.jpg",
      rating: 4.36,
      price: 210000,
      original_price: 260000,
      badge: "Chúa Nhẫn Phần 1",
    },
    {
      book_id: 204,
      title: "The Two Towers",
      author: "J.R.R. Tolkien",
      image_url: "https://images.gr-assets.com/books/1298415523l/15241.jpg",
      rating: 4.44,
      price: 210000,
      original_price: 260000,
      badge: "Chúa Nhẫn Phần 2",
    },
    {
      book_id: 205,
      title: "The Return of the King",
      author: "J.R.R. Tolkien",
      image_url: "https://images.gr-assets.com/books/1520332827l/18512.jpg",
      rating: 4.52,
      price: 215000,
      original_price: 265000,
      badge: "Chúa Nhẫn Phần 3",
    },
    {
      book_id: 206,
      title: "The Silmarillion",
      author: "J.R.R. Tolkien",
      image_url: "https://images.gr-assets.com/books/1610045590l/7332.jpg",
      rating: 3.94,
      price: 195000,
      original_price: 240000,
      badge: "Huyền Sử Trung Địa",
    },
  ],

  "dan brown": [
    {
      book_id: 11,
      title: "The Da Vinci Code",
      author: "Dan Brown",
      image_url: "https://images.gr-assets.com/books/1579621267l/968.jpg",
      rating: 3.84,
      price: 185000,
      original_price: 220000,
      badge: "Mật Mã & Biểu Tượng",
    },
    {
      book_id: 12,
      title: "Angels & Demons",
      author: "Dan Brown",
      image_url: "https://images.gr-assets.com/books/1303390735l/968.jpg",
      rating: 3.91,
      price: 180000,
      original_price: 215000,
      badge: "Hội Kín Illuminati",
    },
    {
      book_id: 207,
      title: "Inferno",
      author: "Dan Brown",
      image_url: "https://images.gr-assets.com/books/1364223126l/17212231.jpg",
      rating: 3.85,
      price: 190000,
      original_price: 230000,
      badge: "Bí Mật Hỏa Ngục",
    },
    {
      book_id: 208,
      title: "The Lost Symbol",
      author: "Dan Brown",
      image_url: "https://images.gr-assets.com/books/1360056157l/6411961.jpg",
      rating: 3.72,
      price: 180000,
      original_price: 220000,
      badge: "Biểu Tượng Thất Truyền",
    },
    {
      book_id: 209,
      title: "Deception Point",
      author: "Dan Brown",
      image_url: "https://images.gr-assets.com/books/1303390740l/976.jpg",
      rating: 3.73,
      price: 175000,
      original_price: 210000,
      badge: "Điểm Dối Lừa",
    },
  ],

  orwell: [
    {
      book_id: 7,
      title: "1984",
      author: "George Orwell",
      image_url: "https://images.gr-assets.com/books/1657781256l/5470.jpg",
      rating: 4.19,
      price: 175000,
      original_price: 210000,
      badge: "Kiệt Tác Dystopia",
    },
    {
      book_id: 14,
      title: "Animal Farm (Chuyện Ở Nông Trại)",
      author: "George Orwell",
      image_url: "https://images.gr-assets.com/books/1424037542l/7613.jpg",
      rating: 3.95,
      price: 155000,
      original_price: 185000,
      badge: "Ngụ Ngôn Chính Trị",
    },
    {
      book_id: 210,
      title: "Homage to Catalonia",
      author: "George Orwell",
      image_url: "https://images.gr-assets.com/books/1388190055l/9646.jpg",
      rating: 4.14,
      price: 170000,
      original_price: 205000,
      badge: "Ký Sự Chiến Tranh",
    },
    {
      book_id: 211,
      title: "Down and Out in Paris and London",
      author: "George Orwell",
      image_url: "https://images.gr-assets.com/books/1388190059l/393199.jpg",
      rating: 4.08,
      price: 165000,
      original_price: 195000,
      badge: "Hồi Ký Hiện Thực",
    },
  ],

  flynn: [
    {
      book_id: 14,
      title: "Gone Girl (Cô Gái Mất Tích)",
      author: "Gillian Flynn",
      image_url: "https://images.gr-assets.com/books/1554086139l/19288043.jpg",
      rating: 4.07,
      price: 175000,
      original_price: 210000,
      badge: "Tâm Lý Tội Phạm",
    },
    {
      book_id: 212,
      title: "Sharp Objects (Vết Cắt Ngọt Ngào)",
      author: "Gillian Flynn",
      image_url: "https://images.gr-assets.com/books/1423847937l/18045891.jpg",
      rating: 3.99,
      price: 165000,
      original_price: 200000,
      badge: "Bí Ẩn Thị Trấn Nhỏ",
    },
    {
      book_id: 213,
      title: "Dark Places (Bóng Tối Kinh Hoàng)",
      author: "Gillian Flynn",
      image_url: "https://images.gr-assets.com/books/1330652016l/5886881.jpg",
      rating: 3.92,
      price: 170000,
      original_price: 205000,
      badge: "Ký Ức Đẫm Máu",
    },
  ],

  collins: [
    {
      book_id: 101,
      title: "The Hunger Games",
      author: "Suzanne Collins",
      image_url: "https://images.gr-assets.com/books/1447303603l/2767052.jpg",
      rating: 4.34,
      price: 170000,
      original_price: 210000,
      badge: "Đấu Trường Sinh Tử",
    },
    {
      book_id: 214,
      title: "Catching Fire",
      author: "Suzanne Collins",
      image_url: "https://images.gr-assets.com/books/1586722975l/6148028.jpg",
      rating: 4.29,
      price: 175000,
      original_price: 215000,
      badge: "Bắt Lửa Phần 2",
    },
    {
      book_id: 215,
      title: "Mockingjay",
      author: "Suzanne Collins",
      image_url: "https://images.gr-assets.com/books/1586722941l/7260188.jpg",
      rating: 4.03,
      price: 180000,
      original_price: 220000,
      badge: "Húng Nhại Kết Thúc",
    },
  ],

  "harper lee": [
    {
      book_id: 6,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      image_url: "https://images.gr-assets.com/books/1553383690l/2657.jpg",
      rating: 4.27,
      price: 190000,
      original_price: 230000,
      badge: "Kiệt Tác Nhân Văn",
    },
    {
      book_id: 216,
      title: "Go Set a Watchman",
      author: "Harper Lee",
      image_url: "https://images.gr-assets.com/books/1451442088l/24817626.jpg",
      rating: 3.32,
      price: 175000,
      original_price: 210000,
      badge: "Hậu Truyện Mockingbird",
    },
  ],

  larsson: [
    {
      book_id: 13,
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      image_url: "https://images.gr-assets.com/books/1684638853l/2429135.jpg",
      rating: 4.14,
      price: 195000,
      original_price: 240000,
      badge: "Trinh Thám Bắc Âu",
    },
    {
      book_id: 217,
      title: "The Girl Who Played with Fire",
      author: "Stieg Larsson",
      image_url: "https://images.gr-assets.com/books/1351778881l/5060378.jpg",
      rating: 4.23,
      price: 200000,
      original_price: 245000,
      badge: "Cô Gái Đùa Với Lửa",
    },
    {
      book_id: 218,
      title: "The Girl Who Kicked the Hornet's Nest",
      author: "Stieg Larsson",
      image_url: "https://images.gr-assets.com/books/1327708260l/6892870.jpg",
      rating: 4.21,
      price: 205000,
      original_price: 250000,
      badge: "Tổ Ong Nghẹt Thở",
    },
  ],

  "jane austen": [
    {
      book_id: 9,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      image_url: "https://images.gr-assets.com/books/1320399351l/1885.jpg",
      rating: 4.26,
      price: 160000,
      original_price: 190000,
      badge: "Kiêu Hãnh & Định Kiến",
    },
    {
      book_id: 219,
      title: "Sense and Sensibility",
      author: "Jane Austen",
      image_url: "https://images.gr-assets.com/books/1397245675l/14935.jpg",
      rating: 4.07,
      price: 165000,
      original_price: 195000,
      badge: "Lý Trí & Tình Cảm",
    },
    {
      book_id: 220,
      title: "Emma",
      author: "Jane Austen",
      image_url: "https://images.gr-assets.com/books/1373059440l/15823480.jpg",
      rating: 4.02,
      price: 165000,
      original_price: 195000,
      badge: "Tiểu Thuyết Lãng Mạn",
    },
  ],
};

/**
 * Tra cứu danh sách tác phẩm cùng tác giả có sẵn
 */
export function getKnownAuthorBooks(authorName: string, currentBookId: number): AuthorBook[] {
  if (!authorName) return [];
  const clean = authorName.toLowerCase();

  for (const [key, list] of Object.entries(KNOWN_AUTHOR_BOOKS)) {
    if (clean.includes(key)) {
      return list.filter((b) => b.book_id !== currentBookId);
    }
  }

  return [];
}

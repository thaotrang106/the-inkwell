/**
 * Danh sách Sách Đề xuất Tuyển chọn (The Inkwell Curations).
 * Đây là các tác phẩm văn học kinh điển, đoạt giải Nobel và kiệt tác tư tưởng
 * do Ban biên tập The Inkwell tuyển chọn, hoàn toàn độc lập và khác biệt với Top 10 Sách Thịnh Hành.
 */

export interface CuratedBook {
  book_id: number;
  title: string;
  author: string;
  authors?: string;
  image_url: string;
  isbn?: string;
  price?: number;
  rating: number;
  badge: string;
  genre: string;
}

export const CURATED_BOOKS: CuratedBook[] = [
  {
    book_id: 11,
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    image_url: "https://images.gr-assets.com/books/1484565687l/77203.jpg",
    isbn: "1594480001",
    rating: 4.26,
    badge: "Văn Học Đương Đại",
    genre: "Hiện thực & Nhân văn",
  },
  {
    book_id: 13,
    title: "1984",
    author: "George Orwell",
    image_url: "/covers/1984.jpg",
    isbn: "451524934",
    rating: 4.14,
    badge: "Kiệt Tác Dystopia",
    genre: "Triết học Xã hội",
  },
  {
    book_id: 14,
    title: "Animal Farm",
    author: "George Orwell",
    image_url: "https://images.gr-assets.com/books/1424037542l/7613.jpg",
    isbn: "452284244",
    rating: 3.87,
    badge: "Ngụ Ngôn Xã Hội",
    genre: "Văn học Kinh điển",
  },
  {
    book_id: 15,
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    image_url: "https://images.gr-assets.com/books/1358276407l/48855.jpg",
    isbn: "553296981",
    rating: 4.10,
    badge: "Hồi Ký Lịch Sử",
    genre: "Tư liệu Lịch sử",
  },
  {
    book_id: 16,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    image_url: "https://images.gr-assets.com/books/1327868566l/2429135.jpg",
    isbn: "307269752",
    rating: 4.11,
    badge: "Trinh Thám Bắc Âu",
    genre: "Trinh thám & Bí ẩn",
  },
  {
    book_id: 26,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    image_url: "https://images.gr-assets.com/books/1303252999l/968.jpg",
    isbn: "307277674",
    rating: 3.79,
    badge: "Bí Mật & Biểu Tượng",
    genre: "Ly kỳ & Tôn giáo",
  },
  {
    book_id: 28,
    title: "Lord of the Flies",
    author: "William Golding",
    image_url: "https://images.gr-assets.com/books/1327869409l/7624.jpg",
    isbn: "140283331",
    rating: 3.64,
    badge: "Giải Nobel Văn Học",
    genre: "Tâm lý Xã hội",
  },
  {
    book_id: 30,
    title: "Gone Girl",
    author: "Gillian Flynn",
    image_url: "https://images.gr-assets.com/books/1339602131l/8442457.jpg",
    isbn: "297859382",
    rating: 4.03,
    badge: "Tâm Lý Đen Tối",
    genre: "Tâm lý & Giật gân",
  },
  {
    book_id: 31,
    title: "The Help",
    author: "Kathryn Stockett",
    image_url: "https://images.gr-assets.com/books/1346100365l/4667024.jpg",
    isbn: "399155341",
    rating: 4.45,
    badge: "Xúc Động Nhân Tâm",
    genre: "Hiện thực & Đời sống",
  },
  {
    book_id: 32,
    title: "Of Mice and Men",
    author: "John Steinbeck",
    image_url: "https://images.gr-assets.com/books/1437235233l/890.jpg",
    isbn: "142000671",
    rating: 3.84,
    badge: "Kiệt Tác Nhân Đạo",
    genre: "Văn học Kinh điển",
  },
  {
    book_id: 35,
    title: "The Alchemist",
    author: "Paulo Coelho",
    image_url: "https://images.gr-assets.com/books/1483412266l/865.jpg",
    isbn: "61122416",
    rating: 3.82,
    badge: "Triết Lý Thức Tỉnh",
    genre: "Triết lý & Khai sáng",
  },
  {
    book_id: 36,
    title: "The Giver",
    author: "Lois Lowry",
    image_url: "https://images.gr-assets.com/books/1342493368l/3636.jpg",
    isbn: "385732554",
    rating: 4.12,
    badge: "Thế Giới Giả Tưởng",
    genre: "Dystopia & Tuổi trẻ",
  },
];

import { API_BASE_URL } from "./api";
import { getBookPricing } from "./bookPricing";
import { CURATED_BOOKS } from "./curatedBooks";
import { BOOK_DESCRIPTIONS } from "./bookDescriptions";

export interface BookDetailData {
  book_id: number;
  title: string;
  author: string;
  authors?: string;
  image_url: string;
  isbn?: string;
  isbn13?: string;
  original_publication_year?: number | string;
  rating?: number;
  ratings_count?: number;
  reviews_count?: number;
  description?: string;
  pages?: number | string;
  language_code?: string;
  price: number;
  original_price: number;
  discount_percent: number;
  genre?: string;
  rank?: number;
}

export const GENRE_METADATA_MAP: Record<string, { title: string; desc: string }> = {
  philosophy: {
    title: "Triết Học & Đạo Đức",
    desc: "Tuyển tập những tác phẩm triết luận, tư tưởng nhân sinh và câu hỏi hiện sinh kinh điển từ những triết gia vĩ đại nhất lịch sử."
  },
  fiction: {
    title: "Văn Học Hư Cấu",
    desc: "Thế giới của những câu chuyện sáng tạo phong phú, nhân vật giàu cảm xúc và những tác phẩm đoạt giải thưởng văn chương thế giới."
  },
  nonfiction: {
    title: "Phi Hư Cấu & Tri Thức",
    desc: "Các tác phẩm nghiên cứu, bài học cuộc sống, nhân văn và góc nhìn đa chiều về thế giới thực tế."
  },
  classics: {
    title: "Tác Phẩm Kinh Điển",
    desc: "Những áng văn bất hủ vượt thời gian, định hình nền văn học thế giới và trường tồn qua nhiều thế hệ độc giả."
  },
  "young-adult": {
    title: "Tuổi Trẻ & Thiếu Nhi",
    desc: "Những hành trình trưởng thành đầy khát vọng, nhiệt huyết tuổi trẻ, tình bạn và sự dũng cảm khám phá cuộc sống."
  },
  fantasy: {
    title: "Kỳ Ảo & Giả Tưởng",
    desc: "Những vùng đất thần bí, ma thuật cổ xưa, các trận chiến sử thi và thế giới kỳ vĩ vượt ngoài sức tưởng tượng."
  },
  romance: {
    title: "Tiểu Thuyết Lãng Mạn",
    desc: "Những câu chuyện tình yêu say đắm, trắc trở và ngọt ngào chạm đến những cung bậc sâu kín nhất của trái tim."
  },
  mystery: {
    title: "Trinh Thám & Phá Án",
    desc: "Những vụ án bí ẩn nghẹt thở, màn đấu trí đỉnh cao giữa thám tử và thủ phạm, cùng những nút thắt bất ngờ."
  },
  thriller: {
    title: "Giật Gân & Tâm Lý",
    desc: "Những tình huống dồn dập, căng thẳng tột độ và trò chơi tâm lý ly kỳ khiến bạn không thể rời mắt."
  },
  "science-fiction": {
    title: "Khoa Học Viễn Tưởng",
    desc: "Những viễn cảnh tương lai công nghệ, vũ trụ bao la, du hành thời gian và câu hỏi về bản chất trí tuệ nhân loại."
  },
  "historical-fiction": {
    title: "Tiểu Thuyết Lịch Sử",
    desc: "Những câu chuyện tái hiện sống động các thời kỳ hào hùng, biến cố lịch sử và số phận con người trong dòng xoáy thời đại."
  },
  contemporary: {
    title: "Văn Học Đương Đại",
    desc: "Góc nhìn đương đại về xã hội, những lát cắt đời sống hiện đại và tâm lý con người trong thế giới hôm nay."
  },
  crime: {
    title: "Tội Phạm & Hình Sự",
    desc: "Bức tranh gai góc về thế giới ngầm, quá trình điều tra phá án và ranh giới mong manh giữa công lý và tội ác."
  },
  horror: {
    title: "Kinh Dị & Rùng Rợn",
    desc: "Những tác phẩm gieo rắc nỗi sợ hãi nguyên thủy, bí ẩn siêu nhiên và bầu không khí rùng rợn lạnh gáy."
  },
  paranormal: {
    title: "Huyền Bí & Siêu Nhiên",
    desc: "Những câu chuyện về ma cà rồng, người sói, thế giới vô hình và những hiện tượng huyền bí khó giải thích."
  },
  history: {
    title: "Lịch Sử Văn Minh",
    desc: "Hành trình hàng nghìn năm của nhân loại, các nền văn minh cổ đại, các cuộc chiến tranh và bài học lịch sử đắt giá."
  },
  biography: {
    title: "Tiểu Sử & Hồi Ký",
    desc: "Câu chuyện cuộc đời có thật của những vĩ nhân, nhà lãnh đạo, nhà khoa học và những nhân vật truyền cảm hứng vĩ đại."
  },
  memoir: {
    title: "Hồi Ký & Tự Truyện",
    desc: "Những trang viết chân thật nhất từ ký ức của chính tác giả về những thăng trầm và bài học cuộc đời."
  },
  psychology: {
    title: "Tâm Lý Học Ứng Dụng",
    desc: "Giải mã hành vi, tiềm thức, cảm xúc con người và cách thức bộ não đưa ra quyết định mỗi ngày."
  },
  science: {
    title: "Khoa Học Tự Nhiên",
    desc: "Khám phá các định luật vật lý, sinh học, vũ trụ học và vẻ đẹp diệu kỳ của thế giới tự nhiên."
  },
  "self-help": {
    title: "Phát Triển Bản Thân",
    desc: "Cẩm nang xây dựng thói quen tốt, tư duy tích cực, quản lý tài chính cá nhân và nâng tầm cuộc sống."
  },
  poetry: {
    title: "Thơ Ca Tuyển Chọn",
    desc: "Những vần thơ tinh tế, giai điệu ngôn từ bay bổng lay động tâm hồn và tình yêu thi ca."
  },
  business: {
    title: "Kinh Doanh & Khởi Nghiệp",
    desc: "Chiến lược kinh doanh, bài học từ các tập đoàn hàng đầu thế giới và tư duy làm chủ thời đại mới."
  },
  art: {
    title: "Nghệ Thuật & Hội Họa",
    desc: "Tinh hoa hội họa, kiến trúc, thẩm mỹ học và cuộc đời những danh họa kiệt xuất."
  },
  comics: {
    title: "Truyện Tranh & Manga",
    desc: "Sự kết hợp hoàn hảo giữa nghệ thuật minh họa thị giác và cốt truyện cuốn hút đỉnh cao."
  }
};

/**
 * Tra cứu thông tin chi tiết một cuốn sách trên Server (phục vụ SSR và SEO Open Graph)
 */
export async function fetchServerBook(id: string | number): Promise<BookDetailData | null> {
  const numericId = Number(id);
  if (!numericId || isNaN(numericId)) return null;

  const pricing = getBookPricing(numericId);

  // 1. Thử fetch từ API Backend với timeout ngắn 3 giây
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/api/books/${numericId}`, {
      signal: controller.signal,
      next: { revalidate: 3600 }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const raw = json.data;
      if (raw) {
        return {
          ...raw,
          book_id: numericId,
          price: pricing.price,
          original_price: pricing.originalPrice,
          discount_percent: pricing.discountPercent,
          author: raw.author || raw.authors || "Nhiều tác giả",
        };
      }
    }
  } catch {
    // Không ném lỗi để fallback an toàn
  }

  // 2. Fallback sang danh sách tuyển chọn CURATED_BOOKS
  const curated = CURATED_BOOKS.find((b) => b.book_id === numericId);
  if (curated) {
    return {
      book_id: curated.book_id,
      title: curated.title,
      author: curated.author || curated.authors || "Tác giả văn học",
      image_url: curated.image_url,
      isbn: curated.isbn,
      rating: curated.rating,
      price: pricing.price,
      original_price: pricing.originalPrice,
      discount_percent: pricing.discountPercent,
      genre: curated.genre,
    };
  }

  // 3. Fallback sách danh mục nổi tiếng nếu trùng ID
  const DEFAULT_MAP: Record<number, { title: string; author: string; img: string; rating: number }> = {
    1: { title: "The Hunger Games", author: "Suzanne Collins", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1447303603i/2767052.jpg", rating: 4.34 },
    2: { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg", rating: 4.47 },
    3: { title: "Twilight", author: "Stephenie Meyer", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1361039443i/41865.jpg", rating: 3.61 },
    4: { title: "To Kill a Mockingbird", author: "Harper Lee", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg", rating: 4.28 },
    5: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg", rating: 3.93 },
    6: { title: "The Fault in Our Stars", author: "John Green", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg", rating: 4.26 },
    7: { title: "The Hobbit", author: "J.R.R. Tolkien", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg", rating: 4.27 },
    8: { title: "The Catcher in the Rye", author: "J.D. Salinger", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg", rating: 3.81 },
    9: { title: "Angels & Demons", author: "Dan Brown", img: "/covers/angels_and_demons.jpg", rating: 3.91 },
    10: { title: "Pride and Prejudice", author: "Jane Austen", img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg", rating: 4.26 },
    11: { title: "The Kite Runner", author: "Khaled Hosseini", img: "https://images.gr-assets.com/books/1484565687l/77203.jpg", rating: 4.26 },
    13: { title: "1984", author: "George Orwell", img: "/covers/1984.jpg", rating: 4.19 },
    14: { title: "Animal Farm", author: "George Orwell", img: "https://images.gr-assets.com/books/1424037542l/7613.jpg", rating: 3.95 },
    15: { title: "The Diary of a Young Girl", author: "Anne Frank", img: "https://images.gr-assets.com/books/1358276407l/48855.jpg", rating: 4.10 },
    16: { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", img: "https://images.gr-assets.com/books/1684638853l/2429135.jpg", rating: 4.14 },
    18: { title: "Harry Potter and the Prisoner of Azkaban", author: "J.K. Rowling", img: "https://images.gr-assets.com/books/1630547330l/5.jpg", rating: 4.56 },
    19: { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", img: "https://images.gr-assets.com/books/1298411339l/34.jpg", rating: 4.36 },
    26: { title: "The Da Vinci Code", author: "Dan Brown", img: "https://images.gr-assets.com/books/1579621267l/968.jpg", rating: 3.84 },
    28: { title: "Lord of the Flies", author: "William Golding", img: "https://images.gr-assets.com/books/1327869409l/7624.jpg", rating: 3.64 },
    30: { title: "Gone Girl", author: "Gillian Flynn", img: "https://images.gr-assets.com/books/1554086139l/19288043.jpg", rating: 4.07 },
    62: { title: "The Golden Compass", author: "Philip Pullman", img: "/covers/the_golden_compass.jpg", rating: 3.99 },
    200: { title: "And Then There Were None", author: "Agatha Christie", img: "https://images.gr-assets.com/books/1638425885l/16299.jpg", rating: 4.26 },
    514: { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", img: "/covers/sherlock_holmes.jpg", rating: 4.30 },
  };

  const defaultItem = DEFAULT_MAP[numericId];
  if (defaultItem) {
    return {
      book_id: numericId,
      title: defaultItem.title,
      author: defaultItem.author,
      image_url: defaultItem.img,
      rating: defaultItem.rating,
      price: pricing.price,
      original_price: pricing.originalPrice,
      discount_percent: pricing.discountPercent,
      description: BOOK_DESCRIPTIONS[numericId] || "",
    };
  }

  // 4. Nếu không có sẵn trong bộ nhớ đệm, sinh cấu trúc sách chuẩn
  return {
    book_id: numericId,
    title: `Tác phẩm tuyển chọn #${numericId}`,
    author: "Tác giả văn học",
    image_url: "",
    rating: 4.2,
    price: pricing.price,
    original_price: pricing.originalPrice,
    discount_percent: pricing.discountPercent,
  };
}

/**
 * Lấy danh sách sách Trending trên server (SSR)
 */
export async function fetchServerTrending(genre?: string, limit: number = 30): Promise<any[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = genre
      ? `${API_BASE_URL}/api/books/by-genre/${genre}?limit=${limit}`
      : `${API_BASE_URL}/api/recommendations/popular?limit=${limit}`;

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((b: any) => {
          const pricing = getBookPricing(b.book_id);
          return {
            ...b,
            price: pricing.price,
            original_price: pricing.originalPrice,
            discount_percent: pricing.discountPercent,
          };
        });
      }
    }
  } catch {
    // Fallback
  }

  // Fallback: 10 sách thịnh hành cơ bản
  return [
    { book_id: 1, title: "The Hunger Games", author: "Suzanne Collins", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1447303603i/2767052.jpg", rating: 4.34, rank: 1 },
    { book_id: 2, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg", rating: 4.47, rank: 2 },
    { book_id: 3, title: "Twilight", author: "Stephenie Meyer", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1361039443i/41865.jpg", rating: 3.61, rank: 3 },
    { book_id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg", rating: 4.28, rank: 4 },
    { book_id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg", rating: 3.93, rank: 5 },
    { book_id: 6, title: "The Fault in Our Stars", author: "John Green", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg", rating: 4.26, rank: 6 },
    { book_id: 7, title: "The Hobbit", author: "J.R.R. Tolkien", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg", rating: 4.27, rank: 7 },
    { book_id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg", rating: 3.81, rank: 8 },
    { book_id: 9, title: "Angels & Demons", author: "Dan Brown", image_url: "/covers/angels_and_demons.jpg", rating: 3.91, rank: 9 },
    { book_id: 10, title: "Pride and Prejudice", author: "Jane Austen", image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg", rating: 4.26, rank: 10 },
  ].map((b) => {
    const pricing = getBookPricing(b.book_id);
    return {
      ...b,
      price: pricing.price,
      original_price: pricing.originalPrice,
      discount_percent: pricing.discountPercent,
    };
  });
}

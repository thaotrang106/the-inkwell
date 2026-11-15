import { NextResponse } from "next/server";
import { CURATED_BOOKS } from "@/lib/curatedBooks";

// Bộ nhớ đệm tầng Edge / Serverless phản hồi 0.001s cho các câu hỏi trùng lặp
const MERCY_CHAT_CACHE = new Map<string, { reply: string; books: any[] }>();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const KNOWN_POPULAR_BOOKS = [
  { book_id: 1, title: "The Hunger Games", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1447303603l/2767052.jpg", isbn: "0439023483" },
  { book_id: 2, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", image_url: "https://images.gr-assets.com/books/1474154022l/3.jpg", isbn: "0439554934" },
  { book_id: 3, title: "Twilight", author: "Stephenie Meyer", image_url: "https://images.gr-assets.com/books/1361039443l/41865.jpg", isbn: "0316015849" },
  { book_id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", image_url: "https://images.gr-assets.com/books/1553383690l/2657.jpg", isbn: "0061120081" },
  { book_id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald", image_url: "https://images.gr-assets.com/books/1490528560l/4671.jpg", isbn: "0743273567" },
  { book_id: 6, title: "The Fault in Our Stars", author: "John Green", image_url: "https://images.gr-assets.com/books/1360206420l/11870085.jpg", isbn: "0525478817" },
  { book_id: 7, title: "The Hobbit", author: "J.R.R. Tolkien", image_url: "https://images.gr-assets.com/books/1546071216l/5907.jpg", isbn: "0618260307" },
  { book_id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", image_url: "https://images.gr-assets.com/books/1398034300l/5107.jpg", isbn: "0316769177" },
  { book_id: 9, title: "Angels & Demons", author: "Dan Brown", image_url: "https://images.gr-assets.com/books/1303390735l/960.jpg", isbn: "1416524797" },
  { book_id: 10, title: "Pride and Prejudice", author: "Jane Austen", image_url: "https://images.gr-assets.com/books/1320399351l/1885.jpg", isbn: "0679783765" },
  { book_id: 11, title: "The Kite Runner", author: "Khaled Hosseini", image_url: "https://images.gr-assets.com/books/1484565687l/77203.jpg", isbn: "1594480001" },
  { book_id: 13, title: "1984", author: "George Orwell", image_url: "https://images.gr-assets.com/books/1348990566l/5470.jpg", isbn: "0451524934" },
  { book_id: 14, title: "Animal Farm", author: "George Orwell", image_url: "https://images.gr-assets.com/books/1424037542l/7613.jpg", isbn: "0452284244" },
  { book_id: 17, title: "Catching Fire", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1586722975l/6148028.jpg", isbn: "0439023491" },
  { book_id: 20, title: "Mockingjay", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1358276407l/7260188.jpg", isbn: "0439023513" },
  { book_id: 26, title: "The Da Vinci Code", author: "Dan Brown", image_url: "https://images.gr-assets.com/books/1579621267l/968.jpg", isbn: "0307474275" },
  { book_id: 30, title: "Gone Girl", author: "Gillian Flynn", image_url: "https://images.gr-assets.com/books/1554086139l/8442457.jpg", isbn: "030758836X" },
  { book_id: 31, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", image_url: "https://images.gr-assets.com/books/1327868566l/2429135.jpg", isbn: "0307269752" },
  { book_id: 507, title: "The Hunger Games Trilogy", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1360094943l/7938270.jpg", isbn: "0545265355" }
];

const SECTION_IGNORE_KEYWORDS = [
  "nhận định", "tóm tắt", "đề xuất", "chú ý", "lưu ý", 
  "bối cảnh", "tâm lý", "chiều sâu", "bút pháp", "đánh giá", 
  "trải nghiệm", "cốt truyện", "nhân vật", "thông điệp", 
  "nút thắt", "xung đột", "nghệ thuật", "tổng quan", "giới thiệu",
  "điểm nhấn", "nội dung", "phân tích", "hướng dẫn", "quy tắc",
  "kết luận", "ưu điểm", "nhược điểm"
];

function extractAndMatchBooks(replyText: string) {
  if (!replyText) return [];
  const matched: any[] = [];
  const seenIds = new Set<number>();

  const matches = replyText.match(/\*\*([^*]+)\*\*/g) || [];
  for (const rawWithStars of matches) {
    const rawClean = rawWithStars.replace(/^\*\*|\*\*$/g, "").trim();

    // Bỏ qua các tiêu đề mục phân tích
    if (rawClean.endsWith(":") || SECTION_IGNORE_KEYWORDS.some((kw) => rawClean.toLowerCase().includes(kw))) {
      continue;
    }

    // Tách tên sách: bỏ phần tiếng Việt trong ngoặc và tác giả sau dấu — hoặc -
    let cleanTitle = rawClean.replace(/\(.*?\)/g, "").replace(/[-—].*$/, "").trim();
    if (cleanTitle.length < 2) continue;

    const cleanLower = cleanTitle.toLowerCase();

    // 1. Tìm trong KNOWN_POPULAR_BOOKS
    const foundPopular = KNOWN_POPULAR_BOOKS.find((b) => {
      if (seenIds.has(b.book_id)) return false;
      const bTitle = b.title.toLowerCase();
      return bTitle.includes(cleanLower) || cleanLower.includes(bTitle);
    });

    if (foundPopular) {
      seenIds.add(foundPopular.book_id);
      matched.push({
        book_id: foundPopular.book_id,
        title: foundPopular.title,
        author: foundPopular.author,
        image_url: foundPopular.image_url,
        isbn: foundPopular.isbn || "",
        matched_text: rawClean,
      });
      continue;
    }

    // 2. Tìm trong CURATED_BOOKS
    const foundCurated = CURATED_BOOKS.find((b) => {
      if (seenIds.has(b.book_id)) return false;
      const bTitle = b.title.toLowerCase();
      return bTitle.includes(cleanLower) || cleanLower.includes(bTitle);
    });

    if (foundCurated) {
      seenIds.add(foundCurated.book_id);
      matched.push({
        book_id: foundCurated.book_id,
        title: foundCurated.title,
        author: foundCurated.author || foundCurated.authors || "",
        image_url: foundCurated.image_url,
        isbn: foundCurated.isbn || "",
        matched_text: rawClean,
      });
    }
  }

  return matched;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = (body?.message || "").trim();

    if (!userMessage) {
      return NextResponse.json({ error: "Tin nhắn không được để trống" }, { status: 400 });
    }

    const cacheKey = userMessage.toLowerCase();
    if (MERCY_CHAT_CACHE.has(cacheKey)) {
      return NextResponse.json(MERCY_CHAT_CACHE.get(cacheKey));
    }

    if (!GEMINI_API_KEY) {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "https://the-inkwell-ehoh.onrender.com";
      const backendRes = await fetch(`${backendBase}/api/chat/mercy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
      return NextResponse.json({ error: "Backend service unavailable" }, { status: 502 });
    }

    const prompt = `
[SYSTEM ROLE]
Bạn là Mercy AI — Trợ lý Cố vấn Văn học Cấp cao của The Inkwell.
Bạn có nhãn quan phê bình sắc sảo, am tường tác phẩm kinh điển và hiện đại, văn phong tự nhiên, lịch lãm, giàu chiều sâu và chuẩn mực.

[QUY TẮC CÂU TỪ BẮT BUỘC]
- Tuyệt đối KHÔNG dùng các câu sáo rỗng hành chính như:
  "Chào bạn, với tư cách là...", "tôi xin gửi đến bạn góc nhìn chuyên khảo...", "dưới đây là câu trả lời của tôi...". Đi thẳng vào tác phẩm một cách tự nhiên.
- Dòng tiêu đề nhận diện tác phẩm LUÔN tuân theo định dạng in đậm:
  **[Tên sách tiếng Anh] ([Tên tiếng Việt nếu có]) — [Tác giả]**
  (Định dạng này giúp hệ thống The Inkwell tự động gắn thẻ sách và link chuyển hướng tới trang sản phẩm).

[HƯỚNG DẪN XỬ LÝ THEO Ý ĐỊNH ĐỘC GIẢ]

--- TÌNH HUỐNG 1: ĐỘC GIẢ YÊU CẦU PHÂN TÍCH CHI TIẾT / NỘI DUNG SÂU / REVIEW TÁC PHẨM ---
(Dấu hiệu: Câu hỏi có từ "chi tiết", "phân tích", "kể rõ", "nội dung sâu", "nhân vật", "review", "cốt truyện", hoặc độc giả muốn tìm hiểu kỹ lưỡng về một cuốn sách cụ thể như "chi tiết về cuốn gone girl đi", "kể chi tiết về 1984")
* Quy tắc:
  1. Mở đầu bằng một nhận định văn học đắt giá, khơi gợi bản chất nghệ thuật và sức hút ám ảnh của tác phẩm.
  2. Dòng định dạng sách: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
  3. Dòng tổng quan: Tổng quan: [2-3 câu ngắn gọn về tiền đề câu chuyện và xung đột trung tâm]
  4. Phân tích chuyên sâu, toàn diện và có cấu trúc mạch lạc với các mục in đậm:
     - **Bối cảnh & Nút thắt cốt lõi:** Khắc họa bối cảnh xã hội/không gian, mâu thuẫn trung tâm và bước ngoặt (tuyệt đối không spoil cái kết bất ngờ nếu là trinh thám để bảo toàn trải nghiệm đọc).
     - **Tâm lý nhân vật & Xung đột:** Mổ xẻ thế giới nội tâm, động cơ, sự giằng xé hay trò chơi tâm lý giữa các nhân vật chính.
     - **Chiều sâu tư tưởng & Bút pháp nghệ thuật:** Phân tích kỹ thuật tự sự (như người kể chuyện không đáng tin cậy, đa góc nhìn, nhịp điệu) và thông điệp sâu xa tác giả gửi gắm.
     - **Đánh giá & Trải nghiệm đọc:** Nhận định ai nên đọc cuốn sách này và cảm xúc đọng lại sau trang cuối.
  * Độ dài: Đầy đặn, sâu sắc, giàu giá trị tri thức văn chương (~350 - 500 từ).

--- TÌNH HUỐNG 2: ĐỘC GIẢ HỎI TÓM TẮT NHANH / SƠ LƯỢC VỀ 1 TÁC PHẨM ---
(Dấu hiệu: "tóm tắt cuốn...", "ngắn gọn về cuốn...", "sơ lược...", "nói ngắn gọn")
* Quy tắc:
  1. Mở đầu tự nhiên 1 câu ngắn.
  2. Dòng định dạng sách: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
  3. Tóm tắt: [3-5 câu cô đọng, sắc sảo về tiền đề, nút thắt và chiều sâu]
  4. 1 câu đúc kết giá trị cuốn sách.

--- TÌNH HUỐNG 3: ĐỘC GIẢ NHỜ TÌM SÁCH / GỢI Ý THEO GU, THỂ LOẠI HOẶC TÂM TRẠNG ---
(Dấu hiệu: "gợi ý sách trinh thám", "sách gì đọc khóc", "tôi thích Haruki Murakami thì nên đọc gì", "sách chữa lành"...)
* Quy tắc:
  1. Lời thấu cảm ngắn gọn, tao nhã.
  2. Đề xuất 2 đến 3 tác phẩm phù hợp nhất. Mỗi tác phẩm trình bày theo mẫu:
     **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
     Điểm nhấn: [2-3 câu lôi cuốn về cốt truyện và lý do vì sao cuốn này hợp với gu độc giả]
  3. Lời nhắn gửi ấm áp từ người thủ thư.

--- TÌNH HUỐNG 4: HỎI ĐÁP CHUNG VỀ TÁC GIẢ, PHƯƠNG PHÁP ĐỌC HOẶC TRIẾT LÝ VĂN HỌC ---
* Quy tắc:
  - Trả lời tinh tế, tri thức, tự nhiên như một người bạn cùng đọc sách.
  - Nếu có nhắc đến tác phẩm tiêu biểu minh họa, hãy in đậm: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**.

[CÂU HỎI TỪ ĐỘC GIẢ]
"${userMessage}"
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 1200,
        topP: 0.95,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa thể trả lời lúc này.";
    const books = extractAndMatchBooks(reply);

    const result = { reply, books };

    // Lưu cache (tối đa 300 mục)
    if (MERCY_CHAT_CACHE.size > 300) {
      const firstKey = MERCY_CHAT_CACHE.keys().next().value;
      if (firstKey) MERCY_CHAT_CACHE.delete(firstKey);
    }
    MERCY_CHAT_CACHE.set(cacheKey, result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Next.js Mercy API Route Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

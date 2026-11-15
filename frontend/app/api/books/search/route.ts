import { NextResponse } from "next/server";
import { CURATED_BOOKS } from "@/lib/curatedBooks";

// Danh sách sách phổ biến để phản hồi ngay lập tức cho Autocomplete
const POPULAR_SEARCH_INDEX = [
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
  { book_id: 12, title: "Divergent", author: "Veronica Roth", image_url: "https://images.gr-assets.com/books/1328559506l/13335037.jpg", isbn: "0062024035" },
  { book_id: 13, title: "1984", author: "George Orwell", image_url: "https://images.gr-assets.com/books/1348990566l/5470.jpg", isbn: "0451524934" },
  { book_id: 14, title: "Animal Farm", author: "George Orwell", image_url: "https://images.gr-assets.com/books/1424037542l/7613.jpg", isbn: "0452284244" },
  { book_id: 17, title: "Catching Fire", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1586722975l/6148028.jpg", isbn: "0439023491" },
  { book_id: 20, title: "Mockingjay", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1358276407l/7260188.jpg", isbn: "0439023513" },
  { book_id: 21, title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", image_url: "https://images.gr-assets.com/books/1298411339l/34.jpg", isbn: "0618346252" },
  { book_id: 26, title: "The Da Vinci Code", author: "Dan Brown", image_url: "https://images.gr-assets.com/books/1579621267l/968.jpg", isbn: "0307474275" },
  { book_id: 30, title: "Gone Girl", author: "Gillian Flynn", image_url: "https://images.gr-assets.com/books/1554086139l/8442457.jpg", isbn: "030758836X" },
  { book_id: 31, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", image_url: "https://images.gr-assets.com/books/1327868566l/2429135.jpg", isbn: "0307269752" },
  { book_id: 35, title: "The Alchemist", author: "Paulo Coelho", image_url: "https://images.gr-assets.com/books/1483412266l/865.jpg", isbn: "0061122416" },
  { book_id: 75, title: "Dune", author: "Frank Herbert", image_url: "https://images.gr-assets.com/books/1555447414l/44767458.jpg", isbn: "0441172717" },
  { book_id: 507, title: "The Hunger Games Trilogy", author: "Suzanne Collins", image_url: "https://images.gr-assets.com/books/1360094943l/7938270.jpg", isbn: "0545265355" }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!q || q.length < 2) {
    return NextResponse.json({ data: [] });
  }

  const results: any[] = [];
  const seenIds = new Set<number>();

  // 1. Tìm nhanh trong kho local static cache (0.001s)
  const allLocal = [...POPULAR_SEARCH_INDEX, ...CURATED_BOOKS];
  for (const b of allLocal) {
    if (seenIds.has(b.book_id)) continue;
    const title = (b.title || "").toLowerCase();
    const author = (b.author || (b as any).authors || "").toLowerCase();
    if (title.includes(q) || author.includes(q)) {
      seenIds.add(b.book_id);
      results.push({
        book_id: b.book_id,
        title: b.title,
        author: b.author || (b as any).authors || "",
        image_url: b.image_url,
        isbn: b.isbn || ""
      });
      if (results.length >= limit) break;
    }
  }

  // 2. Nếu đã có kết quả trong local cache, trả về ngay lập tức
  if (results.length >= limit) {
    return NextResponse.json({ data: results });
  }

  // 3. Dự phòng gọi Render Backend nếu chưa đủ số lượng
  try {
    const backendBase = process.env.NEXT_PUBLIC_API_URL || "https://the-inkwell-ehoh.onrender.com";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const backendRes = await fetch(`${backendBase}/api/books/search?q=${encodeURIComponent(q)}&limit=${limit}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const json = await backendRes.json();
      const serverBooks = json.data || [];
      for (const b of serverBooks) {
        if (!seenIds.has(b.book_id)) {
          seenIds.add(b.book_id);
          results.push(b);
          if (results.length >= limit) break;
        }
      }
    }
  } catch (e) {
    // Không làm gián đoạn nếu backend timeout
  }

  return NextResponse.json({ data: results });
}

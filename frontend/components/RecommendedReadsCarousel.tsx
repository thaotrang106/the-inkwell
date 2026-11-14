"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { CURATED_BOOKS, CuratedBook } from "@/lib/curatedBooks";
import { getBookPricing, formatPriceVND } from "@/lib/bookPricing";

// Hàm làm sạch tên sách
const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

// Định dạng URL ảnh sách chuẩn CDN độ nét cao HD (Large Cover) & tự động lấy ảnh từ Open Library nếu thiếu
const formatImageUrl = (url?: string, isbn?: string) => {
  if (!url || url.includes("nophoto")) {
    if (isbn) {
      const cleanIsbn = String(isbn).trim().replace(/^0+/, "");
      const paddedIsbn = cleanIsbn.length === 9 ? "0" + cleanIsbn : cleanIsbn;
      if (paddedIsbn.length >= 10) {
        return `https://covers.openlibrary.org/b/isbn/${paddedIsbn}-L.jpg`;
      }
    }
    return "";
  }
  let clean = url.trim();
  clean = clean.replace(/^http:\/\//i, "https://");
  if (clean.includes("openlibrary.org")) return clean;
  clean = clean.replace(/:\/\/(?:imagei|s)\.gr-assets\.com/i, "://images.gr-assets.com");
  // Tự động nâng cấp thumbnail mờ (m/ hoặc s/) thành ảnh gốc độ phân giải cao HD (l/)
  clean = clean.replace(/(\d+)[ms]\//i, "$1l/");
  return clean;
};

// Bảng màu sang trọng cho bìa sách thay thế (Luxury Hardcover Jackets)
const COVER_THEMES = [
  { bg: "from-[#1A2A3A] via-[#0D1B2A] to-[#050D1A]", text: "text-amber-200", border: "border-amber-400/30", label: "Midnight Blue" },
  { bg: "from-[#3D1418] via-[#260A0D] to-[#140406]", text: "text-rose-200", border: "border-rose-400/30", label: "Royal Crimson" },
  { bg: "from-[#122A1E] via-[#0A1A12] to-[#040D09]", text: "text-emerald-200", border: "border-emerald-400/30", label: "Deep Forest" },
  { bg: "from-[#2B1B3A] via-[#1A0E26] to-[#0D0614]", text: "text-purple-200", border: "border-purple-400/30", label: "Imperial Plum" },
  { bg: "from-[#2C2416] via-[#1E170D] to-[#0E0A05]", text: "text-amber-100", border: "border-amber-300/30", label: "Antique Leather" },
];

interface BookItem {
  book_id: number;
  title: string;
  author?: string;
  authors?: string;
  image_url?: string;
  isbn?: string;
  price?: number;
  list_price?: number;
  badge?: string;
  genre?: string;
}

/**
 * Component hiển thị bìa sách 3D có hiệu ứng gáy và đổ bóng.
 * Nếu ảnh bìa gốc không tải được hoặc bị lỗi, tự động render bìa sách bìa cứng
 * mạ vàng kim cổ điển (Luxury Hardcover Jacket) có tên sách và tác giả.
 */
function Book3DCover({ book }: { book: BookItem }) {
  const initialUrl = formatImageUrl(book.image_url, book.isbn);
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [retryStep, setRetryStep] = useState(0); // 0: initial, 1: weserv proxy, 2: open library, 3: failed
  const [imgFailed, setImgFailed] = useState(!initialUrl);
  const theme = COVER_THEMES[Math.abs(book.book_id) % COVER_THEMES.length];
  const authorName = book.author || book.authors || "The Inkwell";

  useEffect(() => {
    const url = formatImageUrl(book.image_url, book.isbn);
    setImgSrc(url);
    setRetryStep(0);
    setImgFailed(!url);
  }, [book.image_url, book.isbn]);

  const handleImageError = () => {
    if (retryStep === 0 && imgSrc && !imgSrc.includes("weserv.nl")) {
      setRetryStep(1);
      setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(imgSrc)}&w=450&fit=cover&q=90`);
    } else if (retryStep <= 1 && book.isbn) {
      setRetryStep(2);
      const cleanIsbn = String(book.isbn).trim();
      const paddedIsbn = cleanIsbn.length === 9 ? "0" + cleanIsbn : cleanIsbn;
      setImgSrc(`https://covers.openlibrary.org/b/isbn/${paddedIsbn}-L.jpg`);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className="relative my-2">
      <div className="relative w-[130px] h-[195px] sm:w-[145px] sm:h-[218px] transition-transform duration-300 group-hover/card:-translate-y-2">
        {!imgFailed && imgSrc ? (
          <img
            src={imgSrc}
            alt={`Bìa sách ${cleanTitle(book.title)} - ${authorName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-r-md rounded-l-xs shadow-[0_12px_24px_-6px_rgba(0,0,0,0.3),0_6px_12px_-4px_rgba(0,0,0,0.2)]"
            onError={handleImageError}
          />
        ) : (
          /* Bìa sách bìa cứng sang trọng thay thế nếu ảnh gốc gặp lỗi */
          <div
            className={`w-full h-full bg-gradient-to-br ${theme.bg} p-3 flex flex-col justify-between items-center text-center rounded-r-md rounded-l-xs border ${theme.border} shadow-[0_12px_24px_-6px_rgba(0,0,0,0.35),0_6px_12px_-4px_rgba(0,0,0,0.25)] relative overflow-hidden select-none`}
          >
            {/* Họa tiết viền chỉ vàng kim cổ điển */}
            <div className={`absolute inset-1.5 border ${theme.border} rounded pointer-events-none`}></div>
            <div className="w-full text-[8px] uppercase tracking-[0.25em] text-amber-300/80 font-mono mt-1">
              THE INKWELL
            </div>

            <div className="my-auto px-1 z-10">
              <p className={`font-serif font-bold text-xs sm:text-[13px] leading-snug line-clamp-3 ${theme.text}`}>
                {cleanTitle(book.title)}
              </p>
              <div className="w-8 h-[1px] bg-amber-400/40 mx-auto my-2"></div>
              <p className="text-[10px] text-stone-300 line-clamp-1 italic">
                {authorName}
              </p>
            </div>

            <div className="text-[7px] text-amber-300/60 uppercase tracking-widest font-mono mb-1">
              Collector's Pick
            </div>
          </div>
        )}

        {/* Hiệu ứng gáy sách 3D bên trái */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/45 via-black/20 to-transparent pointer-events-none rounded-l-xs"></div>

        {/* Điểm sáng nổi viền gáy sách */}
        <div className="absolute inset-y-0 left-2.5 w-[1.5px] bg-white/20 pointer-events-none"></div>

        {/* Hiệu ứng mép trang giấy bên phải */}
        <div className="absolute inset-y-0.5 right-0 w-[2px] bg-gradient-to-b from-stone-300 via-stone-100 to-stone-400 pointer-events-none"></div>
      </div>

      {/* Đổ bóng đáy sách */}
      <div className="w-[120px] sm:w-[135px] h-3 mx-auto mt-1 bg-black/20 blur-sm rounded-full"></div>
    </div>
  );
}

interface RecommendedReadsCarouselProps {
  title?: string;
  subtitle?: string;
  initialBooks?: BookItem[];
  emptyHide?: boolean;
}

export default function RecommendedReadsCarousel({
  title = "Gợi ý tuyển chọn",
  subtitle = "Tuyển chọn những kiệt tác văn học & tư tưởng được Ban biên tập tuyển lựa kỹ lưỡng",
  initialBooks,
  emptyHide = false,
}: RecommendedReadsCarouselProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [books, setBooks] = useState<BookItem[]>(() => {
    if (initialBooks && initialBooks.length > 0) return initialBooks;
    if (emptyHide) return [];
    return CURATED_BOOKS;
  });
  const [addedBookId, setAddedBookId] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Tải danh sách sách hoặc nhận từ props initialBooks
  useEffect(() => {
    if (initialBooks && initialBooks.length > 0) {
      setBooks(initialBooks);
      return;
    }

    if (emptyHide && initialBooks !== undefined && initialBooks.length === 0) {
      setBooks([]);
      return;
    }

    setBooks(CURATED_BOOKS);
  }, [initialBooks, emptyHide]);

  // Bảo đảm luôn có sách để hiển thị nếu emptyHide = false
  const displayBooks = books.length > 0 ? books : (emptyHide ? [] : CURATED_BOOKS);

  if (emptyHide && displayBooks.length === 0) {
    return null;
  }

  // Cập nhật vị trí thanh cuộn và trạng thái nút điều hướng
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -460 : 460;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleAddToCart = (book: BookItem, salePrice: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        book_id: book.book_id,
        title: cleanTitle(book.title),
        author: book.author || book.authors || "Nhiều tác giả",
        image_url: book.image_url,
        price: salePrice,
      },
      1
    );

    setAddedBookId(book.book_id);
    setTimeout(() => {
      setAddedBookId(null);
    }, 1800);

    // Ghi nhận hành vi tương tác add_to_cart
    const currentUserId = user?.user_id || 1;
    fetch(`${API_BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "add_to_cart",
      }),
    }).catch(() => {});
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-[#FAF8F5]/60 border-y border-stone-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mục Gợi ý tuyển chọn */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-stone-500 font-medium mb-2 block">
            THE INKWELL CURATIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight mb-2.5">
            {title}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm font-sans">
            {subtitle}
          </p>
          <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-4"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Nút mũi tên Trái */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Cuộn sang trái"
            className={`hidden md:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-white/95 backdrop-blur-xs shadow-sm transition-all cursor-pointer ${
              canScrollLeft
                ? "text-stone-800 hover:text-black hover:border-stone-400 hover:scale-105 active:scale-95"
                : "text-stone-300 border-stone-100 cursor-not-allowed opacity-30"
            }`}
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          {/* Dãy các thẻ sách cuộn ngang */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth w-full py-4 px-1"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {displayBooks.map((book) => {
              const pricing = getBookPricing(book.book_id, book.price);
              const isAdded = addedBookId === book.book_id;
              const authorName = book.author || book.authors || "Nhiều tác giả";

              return (
                <div
                  key={book.book_id}
                  style={{ scrollSnapAlign: "start" }}
                  className="flex-shrink-0 w-[205px] sm:w-[225px] lg:w-[240px] bg-white border border-stone-200/90 rounded-[6px] p-4 sm:p-5 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-stone-400 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)]"
                >
                  {/* Bìa sách định dạng 3D */}
                  <Link
                    href={`/books/${book.book_id}`}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        try {
                          sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify({ ...book, price: pricing.price }));
                        } catch {}
                      }
                    }}
                    onMouseEnter={() => {
                      if (typeof window !== "undefined") {
                        try {
                          sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify({ ...book, price: pricing.price }));
                        } catch {}
                      }
                    }}
                    className="w-full flex flex-col items-center group/card cursor-pointer"
                  >
                    {/* Huy hiệu biên tập (Badge) */}
                    {book.badge && (
                      <span className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#881337] bg-rose-50 px-2 py-0.5 rounded-[3px] border border-[#881337]/15">
                        {book.badge}
                      </span>
                    )}

                    <Book3DCover book={book} />

                    {/* Tên sách (Font Serif) */}
                    <h3 className="font-serif font-bold text-[#1C1917] text-sm mt-3 line-clamp-2 min-h-[2.5rem] group-hover/card:text-stone-600 transition-colors">
                      {cleanTitle(book.title)}
                    </h3>

                    {/* Tên tác giả */}
                    <p className="text-[11px] text-stone-500 font-sans line-clamp-1 mt-0.5">
                      {authorName}
                    </p>
                  </Link>

                  {/* Phần giá tiền đồng bộ 100% với BookCard */}
                  <div className="mt-3 w-full">
                    <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
                      <span className="font-serif font-bold text-[#1C1917] text-base sm:text-lg tracking-tight">
                        {formatPriceVND(pricing.price)}
                      </span>
                      <span className="text-[11px] text-stone-400 line-through decoration-stone-300 font-sans">
                        {formatPriceVND(pricing.originalPrice)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] font-bold font-mono text-[#881337] bg-rose-50/80 px-1.5 py-0.5 rounded-[3px]">
                        Tiết kiệm {pricing.discountPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Nút Add to Cart / Thêm vào giỏ viền mảnh tinh tế, bo góc 5px */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(book, pricing.price, e)}
                    className={`w-full mt-4 py-2 px-3 text-xs font-medium rounded-[5px] border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-xs font-sans ${
                      isAdded
                        ? "bg-[#1C1917] border-[#1C1917] text-white"
                        : "bg-white border-stone-300 text-stone-800 hover:border-[#1C1917] hover:bg-[#1C1917] hover:text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} className="stroke-[2.5]" />
                        <span>Đã thêm vào giỏ</span>
                      </>
                    ) : (
                      <span>Thêm vào giỏ</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Nút mũi tên Phải */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Cuộn sang phải"
            className={`hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-white/95 backdrop-blur-xs shadow-sm transition-all cursor-pointer ${
              canScrollRight
                ? "text-stone-800 hover:text-black hover:border-stone-400 hover:scale-105 active:scale-95"
                : "text-stone-300 border-stone-100 cursor-not-allowed opacity-30"
            }`}
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Thanh tiến độ cuộn trang trí bên dưới */}
        <div className="w-48 h-1 bg-stone-200/80 rounded-full mx-auto mt-6 overflow-hidden">
          <div
            className="h-full bg-stone-700 transition-all duration-200 rounded-full"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
}

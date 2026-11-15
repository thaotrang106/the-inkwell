"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, ShoppingBag, Sparkles } from "lucide-react";
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
  if (clean.includes("119322.jpg") || clean.includes("1342493368")) {
    return "/covers/the_golden_compass.jpg";
  }
  if (clean.includes("5470.jpg") || clean.includes("1657781256")) {
    return "/covers/1984.jpg";
  }
  if (clean.includes("968.jpg") || clean.includes("1303390735")) {
    return "/covers/angels_and_demons.jpg";
  }
  if (clean.includes("3590.jpg") || clean.includes("1356570991")) {
    return "/covers/sherlock_holmes.jpg";
  }
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
    const bId = String(book.book_id);
    const bTitle = (book.title || "").toLowerCase();
    if (bId === "62" || bTitle.includes("golden compass")) {
      if (imgSrc !== "/covers/the_golden_compass.jpg") {
        setImgSrc("/covers/the_golden_compass.jpg");
        return;
      }
    }
    if (bId === "13" || bTitle.includes("1984")) {
      if (imgSrc !== "/covers/1984.jpg") {
        setImgSrc("/covers/1984.jpg");
        return;
      }
    }
    if (bId === "9" || bId === "26" || bTitle.includes("angels") || bTitle.includes("vinci")) {
      if (imgSrc !== "/covers/angels_and_demons.jpg") {
        setImgSrc("/covers/angels_and_demons.jpg");
        return;
      }
    }
    if (bId === "514" || bTitle.includes("sherlock")) {
      if (imgSrc !== "/covers/sherlock_holmes.jpg") {
        setImgSrc("/covers/sherlock_holmes.jpg");
        return;
      }
    }
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
            <div className="w-full text-[10px] uppercase tracking-[0.26em] text-amber-300/80 font-cormorant font-bold mt-1">
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

            <div className="text-[9px] text-amber-300/70 uppercase tracking-[0.2em] font-cormorant font-semibold mb-1">
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
          <span className="font-cormorant text-sm sm:text-base uppercase tracking-[0.26em] text-stone-500 font-semibold mb-1.5 block">
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
                  className="flex-shrink-0 w-[190px] sm:w-[210px] lg:w-[225px] bg-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_14px_30px_-6px_rgba(28,25,23,0.12)] border border-stone-200/70 hover:border-stone-300 group/card"
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
                    className="w-full flex flex-col items-center cursor-pointer select-none"
                  >
                    <div className="w-full flex items-center justify-center py-1 relative">
                      {((book as any).explanation || book.badge) && (
                        <span className="absolute top-0 left-0 z-20 text-[9px] font-medium font-sans bg-[#1C1917]/90 text-amber-200 px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1 max-w-[125px] truncate">
                          <Sparkles size={8} className="text-amber-400 shrink-0" />
                          <span className="truncate">{(book as any).explanation || book.badge}</span>
                        </span>
                      )}
                      {pricing.discountPercent > 0 && (
                        <span className="absolute top-0 right-1 z-20 text-[10px] font-bold font-sans bg-[#881337] text-white px-2 py-0.5 rounded-full shadow-xs">
                          -{pricing.discountPercent}%
                        </span>
                      )}
                      <Book3DCover book={book} />
                    </div>

                    {/* Tên sách (Font Serif - Căn trái biên tập chuẩn nhà sách) */}
                    <div className="w-full mt-3 text-left">
                      <h3 className="font-serif font-bold text-[#1C1917] text-sm sm:text-[15px] leading-snug line-clamp-2 h-[2.6rem] group-hover/card:text-[#881337] transition-colors">
                        {cleanTitle(book.title)}
                      </h3>

                      {/* Tên tác giả */}
                      <p className="text-xs text-stone-500 font-sans line-clamp-1 mt-1">
                        {authorName}
                      </p>
                    </div>
                  </Link>

                  {/* Phần giá tiền trên 1 dòng trang nhã, không còn badge hồng vụn vặt */}
                  <div className="mt-2.5 w-full text-left">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-serif font-bold text-[#1C1917] text-base sm:text-lg tracking-tight">
                        {formatPriceVND(pricing.price)}
                      </span>
                      {pricing.originalPrice > pricing.price && (
                        <span className="text-xs text-stone-400 line-through decoration-stone-300 font-sans">
                          {formatPriceVND(pricing.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút Thêm vào giỏ dạng Pill sang trọng */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(book, pricing.price, e)}
                    className={`w-full mt-3.5 py-2 px-3 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs font-sans ${
                      isAdded
                        ? "bg-[#881337] text-white"
                        : "bg-[#1C1917] hover:bg-[#881337] text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} className="stroke-[2.5]" />
                        <span>Đã thêm vào giỏ</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} strokeWidth={2} />
                        <span>Thêm vào giỏ</span>
                      </>
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

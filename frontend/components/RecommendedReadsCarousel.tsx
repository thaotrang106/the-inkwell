"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";

// Hàm làm sạch tên sách
const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

// Định dạng giá VNĐ
const formatVND = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

// Tính toán giá bán và giá niêm yết ổn định theo book_id
const getBookPricing = (bookId: number) => {
  const base = 135000 + ((bookId * 179) % 115000);
  const salePrice = Math.round(base / 1000) * 1000;
  const listPrice = Math.round((salePrice * 1.75) / 1000) * 1000;
  return { salePrice, listPrice };
};

// Định dạng URL ảnh sách chuẩn CDN độ nét cao HD (Large Cover)
const formatImageUrl = (url?: string) => {
  if (!url) return "";
  let clean = url.trim();
  clean = clean.replace(/^http:\/\//i, "https://");
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
  price?: number;
  list_price?: number;
}

// Danh sách sách đề xuất tuyển chọn với CDN chuẩn
const DEFAULT_RECOMMENDED: BookItem[] = [
  {
    book_id: 1,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1447303603i/2767052.jpg",
  },
  {
    book_id: 2,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
  },
  {
    book_id: 25,
    title: "Harry Potter and the Deathly Hallows",
    author: "J.K. Rowling",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474171184i/136251.jpg",
  },
  {
    book_id: 27,
    title: "Harry Potter and the Half-Blood Prince",
    author: "J.K. Rowling",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1361039191i/1.jpg",
  },
  {
    book_id: 18,
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1298411339i/34.jpg",
  },
  {
    book_id: 21,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
  },
  {
    book_id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
  },
  {
    book_id: 17,
    title: "Catching Fire",
    author: "Suzanne Collins",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975i/6148028.jpg",
  },
  {
    book_id: 19,
    title: "The Fault in Our Stars",
    author: "John Green",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg",
  },
];

/**
 * Component hiển thị bìa sách 3D có hiệu ứng gáy và đổ bóng.
 * Nếu ảnh bìa gốc không tải được hoặc bị lỗi, tự động render bìa sách bìa cứng
 * mạ vàng kim cổ điển (Luxury Hardcover Jacket) có tên sách và tác giả.
 */
function Book3DCover({ book }: { book: BookItem }) {
  const initialUrl = formatImageUrl(book.image_url);
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [useProxy, setUseProxy] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const theme = COVER_THEMES[Math.abs(book.book_id) % COVER_THEMES.length];

  useEffect(() => {
    setImgSrc(formatImageUrl(book.image_url));
    setUseProxy(false);
    setImgFailed(false);
  }, [book.image_url]);

  const handleImageError = () => {
    if (!useProxy && imgSrc) {
      setUseProxy(true);
      setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(imgSrc)}&w=450&fit=cover&q=90`);
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
            alt={cleanTitle(book.title)}
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
                {book.author || book.authors || "Special Edition"}
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
  subtitle = "Tuyển chọn những tác phẩm nổi bật được cộng đồng yêu thích nhất",
  initialBooks,
  emptyHide = false,
}: RecommendedReadsCarouselProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [books, setBooks] = useState<BookItem[]>(initialBooks || DEFAULT_RECOMMENDED);
  const [addedBookId, setAddedBookId] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Tải danh sách sách từ database hoặc nhận từ props initialBooks
  useEffect(() => {
    if (initialBooks !== undefined) {
      setBooks(initialBooks);
      return;
    }

    const fetchBooks = async () => {
      try {
        const url = user?.user_id
          ? `${API_BASE_URL}/api/recommendations/foryou/${user.user_id}?limit=15`
          : `${API_BASE_URL}/api/recommendations/popular?limit=15`;

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const items = json.data || json.items || [];
          if (items.length > 0) {
            setBooks(items);
          }
        }
      } catch (e) {
        // Fallback về DEFAULT_RECOMMENDED nếu backend offline
      }
    };

    fetchBooks();
  }, [initialBooks, user]);

  // Nếu cấu hình emptyHide và không có sách thì ẩn hoàn toàn phần này
  if (emptyHide && (!books || books.length === 0)) {
    return null;
  }

  // Cập nhật vị trí thanh cuộn và trạng thái nút điều hướng
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll > 0) {
      setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      handleScroll();
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [books]);

  // Điều khiển nút cuộn Trái / Phải
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Xử lý thêm vào giỏ và ghi nhận hành vi
  const handleAddToCart = (book: BookItem, salePrice: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const bookToCart = {
      ...book,
      price: salePrice,
    };

    addToCart(bookToCart, 1);

    setAddedBookId(book.book_id);
    setTimeout(() => {
      setAddedBookId(null);
    }, 1500);

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
    <section className="w-full py-12 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề phần (Recommended Reads / You may also like / Also By This Author) */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Khung Carousel với hai mũi tên điều hướng hai bên */}
        <div className="relative flex items-center group">
          
          {/* Nút mũi tên Trái */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Cuộn sang trái"
            className={`hidden md:flex absolute -left-4 lg:-left-6 z-20 items-center justify-center w-10 h-10 transition-all cursor-pointer ${
              canScrollLeft
                ? "text-gray-800 hover:text-black hover:scale-110 active:scale-95"
                : "text-gray-300 cursor-not-allowed opacity-40"
            }`}
          >
            <ChevronLeft size={36} strokeWidth={1.8} />
          </button>

          {/* Dãy các thẻ sách cuộn ngang */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth w-full py-4 px-1"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {books.map((book) => {
              const { salePrice, listPrice } = getBookPricing(book.book_id);
              const isAdded = addedBookId === book.book_id;

              return (
                <div
                  key={book.book_id}
                  style={{ scrollSnapAlign: "start" }}
                  className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[235px] bg-[#FAF9F6] border border-gray-200/80 rounded-md p-4 sm:p-5 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:bg-white"
                >
                  {/* Bìa sách định dạng 3D */}
                  <Link
                    href={`/books/${book.book_id}`}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        try {
                          sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify({ ...book, price: salePrice }));
                        } catch {}
                      }
                    }}
                    onMouseEnter={() => {
                      if (typeof window !== "undefined") {
                        try {
                          sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify({ ...book, price: salePrice }));
                        } catch {}
                      }
                    }}
                    className="w-full flex flex-col items-center group/card cursor-pointer"
                  >
                    <Book3DCover book={book} />

                    {/* Tên sách */}
                    <h3 className="font-serif font-bold text-gray-900 text-sm mt-3 line-clamp-1 group-hover/card:text-[#B12704] transition-colors">
                      {cleanTitle(book.title)}
                    </h3>
                  </Link>

                  {/* Phần giá tiền */}
                  <div className="mt-3 w-full">
                    <p className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">
                      {formatVND(salePrice)}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 line-through decoration-gray-400">
                      Giá niêm yết: {formatVND(listPrice)}
                    </p>
                  </div>

                  {/* Nút Add to Cart / Thêm vào giỏ viền đen */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(book, salePrice, e)}
                    className={`w-full mt-4 py-2 px-3 text-xs sm:text-sm font-semibold rounded border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                      isAdded
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : "bg-white border-black text-black hover:bg-black hover:text-white"
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
            className={`hidden md:flex absolute -right-4 lg:-right-6 z-20 items-center justify-center w-10 h-10 transition-all cursor-pointer ${
              canScrollRight
                ? "text-gray-800 hover:text-black hover:scale-110 active:scale-95"
                : "text-gray-300 cursor-not-allowed opacity-40"
            }`}
          >
            <ChevronRight size={36} strokeWidth={1.8} />
          </button>
        </div>

        {/* Thanh chỉ báo cuộn (Progress Slider Bar) */}
        <div className="mt-8 flex justify-center">
          <div className="w-28 sm:w-36 h-1 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-gray-500 rounded-full transition-all duration-150"
              style={{
                width: "40%",
                transform: `translateX(${scrollProgress * 150}%)`,
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

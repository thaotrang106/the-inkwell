"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { Star, ShoppingCart, Play, BookOpen, ChevronRight, Share, ChevronDown, MessageCircle, Sparkles, Loader2, X, Check, Heart, Truck, ShieldCheck, RotateCcw, MapPin, Zap, Plus, Minus, Clock, Tablet, BookMarked } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import RecommendedReadsCarousel from "@/components/RecommendedReadsCarousel";
import ProductReviews from "@/components/ProductReviews";

const cleanTitle = (title: string) => {
  if (!title) return '';
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, '').trim();
};

// Cache bộ nhớ Client-side để mở lại sách đã xem trong 0.001 giây
const CLIENT_BOOK_CACHE = new Map<string, any>();

// Định dạng URL ảnh sách chuẩn CDN độ nét cao HD (Large Cover) & tự động dự phòng sang Open Library qua ISBN
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

// Bảng màu sang trọng cho bìa sách thay thế
const COVER_THEMES = [
  { bg: "from-[#1A2A3A] via-[#0D1B2A] to-[#050D1A]", text: "text-amber-200", border: "border-amber-400/30" },
  { bg: "from-[#3D1418] via-[#260A0D] to-[#140406]", text: "text-rose-200", border: "border-rose-400/30" },
  { bg: "from-[#122A1E] via-[#0A1A12] to-[#040D09]", text: "text-emerald-200", border: "border-emerald-400/30" },
  { bg: "from-[#2B1B3A] via-[#1A0E26] to-[#0D0614]", text: "text-purple-200", border: "border-purple-400/30" },
  { bg: "from-[#2C2416] via-[#1E170D] to-[#0E0A05]", text: "text-amber-100", border: "border-amber-300/30" },
];

// Hàm định dạng và loại bỏ các dấu markdown thô cho lời bình Mercy AI
const renderCleanMercyText = (raw: string) => {
  if (!raw) return null;

  // Tách text theo các phần in đậm (**...**) hoặc tên sách/in nghiêng (*...* hoặc "..." hoặc “...”)
  const tokens = raw.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|"[^"]+"|[“”][^“”]+[“”])/g);

  return (
    <span className="leading-relaxed">
      {tokens.map((token, idx) => {
        if (!token) return null;
        if (token.startsWith("**") && token.endsWith("**")) {
          const content = token.slice(2, -2).trim();
          return <strong key={idx} className="font-semibold text-ink">{content}</strong>;
        }
        if ((token.startsWith("*") && token.endsWith("*")) || (token.startsWith("_") && token.endsWith("_"))) {
          const content = token.slice(1, -1).replace(/^["“”]|["“”]$/g, "").trim();
          return <em key={idx} className="font-serif italic text-ink font-medium">“{content}”</em>;
        }
        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith('“') && token.endsWith('”'))) {
          const content = token.slice(1, -1).trim();
          return <span key={idx} className="font-serif italic text-ink font-medium">“{content}”</span>;
        }
        // Xóa sạch các dấu *, _, # đơn lẻ còn sót lại
        const cleaned = token.replace(/[*_#]/g, "");
        return <span key={idx}>{cleaned}</span>;
      })}
    </span>
  );
};

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // Khởi tạo state sách ngay từ RAM hoặc sessionStorage để hiển thị tức thì trong 0.00 giây
  const [book, setBook] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`inkwell_book_${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.title || parsed.book_id)) return parsed;
        }
      } catch {}
    }
    return CLIENT_BOOK_CACHE.get(id) || null;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`inkwell_book_${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.title || parsed.book_id)) return false;
        }
      } catch {}
    }
    return !CLIENT_BOOK_CACHE.has(id);
  });
  
  // Trạng thái ảnh bìa sách với cơ chế 3 tầng tải ảnh và bìa dự phòng
  const [detailImgSrc, setDetailImgSrc] = useState<string>(() => {
    if (book?.image_url) return formatImageUrl(book.image_url, book.isbn);
    return "";
  });
  const [detailRetryStep, setDetailRetryStep] = useState(0);
  const [detailImgFailed, setDetailImgFailed] = useState(false);

  // Trạng thái AI Mercy (lưu phiên để hiển thị tức thì nếu đã từng hỏi)
  const [mercyMessage, setMercyMessage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem(`inkwell_mercy_${id}`) || "";
      } catch {}
    }
    return "";
  });
  const [isMercyThinking, setIsMercyThinking] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"kindle" | "paperback" | "hardcover">("paperback");
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<any[]>([]);
  const [authorBooks, setAuthorBooks] = useState<any[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);

  useEffect(() => {
    let currentBook = CLIENT_BOOK_CACHE.get(id);
    if (!currentBook && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`inkwell_book_${id}`);
        if (stored) currentBook = JSON.parse(stored);
      } catch {}
    }

    if (currentBook && (currentBook.title || currentBook.book_id)) {
      setBook(currentBook);
      setLoading(false);
      if (currentBook.image_url || currentBook.isbn) {
        setDetailImgSrc(formatImageUrl(currentBook.image_url, currentBook.isbn));
      }
    } else {
      setLoading(true);
    }

    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
        const json = await res.json();
        
        // Dữ liệu API trả về nằm trong json.data
        const demoBook = json.data;
        
        if (demoBook) {
          const mergedBook = {
            ...currentBook,
            ...demoBook,
            price: currentBook?.price || demoBook.price || Math.floor(Math.random() * (260 - 80) + 80) * 1000
          };
          CLIENT_BOOK_CACHE.set(id, mergedBook);
          setBook(mergedBook);
          if (mergedBook.image_url || mergedBook.isbn) {
            setDetailImgSrc(formatImageUrl(mergedBook.image_url, mergedBook.isbn));
          }
          try {
            sessionStorage.setItem(`inkwell_book_${id}`, JSON.stringify(mergedBook));
          } catch {}
        }
        setRelatedBooks(json.data?.slice(1, 5) || []);

        // Ghi nhận hành vi 'view' vào backend (Giai đoạn C)
        const currentUserId = user?.user_id || 1;
        fetch(`${API_BASE_URL}/api/interactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            book_id: Number(id),
            interaction_type: "view",
          }),
        }).catch(() => {});
      } catch (e) {
        console.error("Error fetching book", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();

    // 1. Tải gợi ý sách tương tự (You may also like) với 3 tầng dự phòng thông minh
    fetch(`${API_BASE_URL}/api/recommendations/similar/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setSimilarBooks(json.data);
        } else {
          // Tầng 2: Gợi ý Hybrid kết hợp
          fetch(`${API_BASE_URL}/api/recommendations/hybrid/${id}`)
            .then((r) => r.json())
            .then((hj) => {
              if (hj.data && hj.data.length > 0) {
                setSimilarBooks(hj.data);
              } else {
                // Tầng 3: Tuyển chọn thịnh hành/đề xuất phổ biến để không bao giờ bị khoảng trống
                fetch(`${API_BASE_URL}/api/recommendations/popular?limit=10`)
                  .then((pr) => pr.json())
                  .then((pj) => {
                    if (pj.data && pj.data.length > 0) setSimilarBooks(pj.data);
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {
              fetch(`${API_BASE_URL}/api/recommendations/popular?limit=10`)
                .then((pr) => pr.json())
                .then((pj) => {
                  if (pj.data && pj.data.length > 0) setSimilarBooks(pj.data);
                })
                .catch(() => {});
            });
        }
      })
      .catch(() => {
        fetch(`${API_BASE_URL}/api/recommendations/popular?limit=10`)
          .then((pr) => pr.json())
          .then((pj) => {
            if (pj.data && pj.data.length > 0) setSimilarBooks(pj.data);
          })
          .catch(() => {});
      });

    // 2. Tải sách khác cùng tác giả (Also By This Author)
    fetch(`${API_BASE_URL}/api/books/by-author/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setAuthorBooks(json.data);
        } else {
          setAuthorBooks([]);
        }
      })
      .catch(() => {
        setAuthorBooks([]);
      });
  }, [id]);

  useEffect(() => {
    if (book?.image_url || book?.isbn) {
      const formatted = formatImageUrl(book.image_url, book.isbn);
      setDetailImgSrc(formatted);
      setDetailRetryStep(0);
      setDetailImgFailed(!formatted);
    }
  }, [book?.image_url, book?.isbn]);

  if (loading && !book) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-ink/10 rounded animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cột trái: Khung ảnh bìa sách Skeleton */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="w-full max-w-[280px] aspect-[2/3] bg-gradient-to-br from-ink/10 via-ink/5 to-ink/10 rounded-2xl animate-pulse shadow-md mb-6 flex items-center justify-center border border-ink/5">
              <span className="font-serif text-ink/20 text-sm">The Inkwell</span>
            </div>
          </div>

          {/* Cột giữa: Tiêu đề, tác giả & mô tả Skeleton */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="h-9 w-3/4 bg-ink/10 rounded-lg animate-pulse"></div>
            <div className="h-5 w-1/3 bg-ink/10 rounded animate-pulse"></div>
            <div className="h-5 w-1/4 bg-ink/5 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-1/3 bg-amber-500/10 rounded-xl animate-pulse"></div>
            
            <div className="space-y-3 pt-6 border-t border-ink/5">
              <div className="h-4 w-full bg-ink/5 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-ink/5 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-ink/5 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-ink/5 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Cột phải: Hộp mua hàng Skeleton */}
          <div className="lg:col-span-3">
            <div className="p-6 border border-ink/10 rounded-2xl space-y-4 bg-ink/[0.02]">
              <div className="h-7 w-1/2 bg-ink/10 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-emerald-500/15 rounded animate-pulse"></div>
              <div className="h-11 w-full bg-ink/10 rounded-xl animate-pulse mt-4"></div>
              <div className="h-11 w-full bg-ink/15 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sách</div>;
  }

  const handleDetailImageError = () => {
    if (detailRetryStep === 0 && detailImgSrc && !detailImgSrc.includes("weserv.nl")) {
      // Tầng 1: Sử dụng weserv proxy
      setDetailRetryStep(1);
      setDetailImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(detailImgSrc)}&w=600&fit=cover&q=90`);
    } else if (detailRetryStep <= 1 && book?.isbn) {
      // Tầng 2: Tra cứu Open Library Cover qua ISBN
      setDetailRetryStep(2);
      const cleanIsbn = String(book.isbn).trim();
      const paddedIsbn = cleanIsbn.length === 9 ? "0" + cleanIsbn : cleanIsbn;
      setDetailImgSrc(`https://covers.openlibrary.org/b/isbn/${paddedIsbn}-L.jpg`);
    } else {
      // Tầng 3: Bìa sách vải mạ vàng sang trọng nếu không thể tìm thấy ảnh trên Internet
      setDetailImgFailed(true);
    }
  };

  const authorName = typeof book.author === 'string' ? book.author.replace(/\[|\]|'/g, '') : book.author;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  // Tính toán giá tiền theo từng định dạng ấn bản
  const basePrice = book.price || 150000;
  const kindlePrice = Math.round((basePrice * 0.6) / 1000) * 1000;
  const paperbackPrice = basePrice;
  const hardcoverPrice = Math.round((basePrice * 1.5) / 1000) * 1000;

  const currentPrice = selectedFormat === "kindle" 
    ? kindlePrice 
    : selectedFormat === "hardcover" 
      ? hardcoverPrice 
      : paperbackPrice;

  const selectedFormatLabel = selectedFormat === "kindle" 
    ? "Bản điện tử (Kindle)" 
    : selectedFormat === "hardcover" 
      ? "Bìa cứng (Hardcover)" 
      : "Bìa mềm (Paperback)";

  const formatsList: { id: "kindle" | "paperback" | "hardcover"; name: string; price: number; desc: string; icon: string }[] = [
    {
      id: "kindle",
      name: "Bản điện tử (Kindle)",
      price: kindlePrice,
      desc: "Đọc tức thì trên thiết bị Kindle hoặc ứng dụng đọc số The Inkwell",
      icon: "kindle"
    },
    {
      id: "paperback",
      name: "Bìa mềm (Paperback)",
      price: paperbackPrice,
      desc: "Bản in tiêu chuẩn chất lượng cao, giấy xốp Phần Lan chống lóa 75gsm",
      icon: "paperback"
    },
    {
      id: "hardcover",
      name: "Bìa cứng (Hardcover)",
      price: hardcoverPrice,
      desc: "Ấn bản kỷ niệm bìa cứng mạ vàng kim cổ điển, áo ôm kèm bookmark lụa",
      icon: "hardcover"
    }
  ];

  const readSampleUrl = book.sample_read_url || book.preview_url || book.read_url || book.sample_url || "";
  const audioSampleUrl = book.audio_sample_url || book.audio_url || book.sample_audio_url || "";

  const askMercy = async () => {
    // 1. Kiểm tra cache phiên trước để hiển thị tức thì
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(`inkwell_mercy_${id}`);
        if (cached) {
          setMercyMessage(cached);
          return;
        }
      } catch {}
    }

    setIsMercyThinking(true);
    setMercyMessage("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommendations/explain/${id}`);
      const json = await res.json();
      const text = json.data || "";
      setMercyMessage(text);
      if (text && typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`inkwell_mercy_${id}`, text);
        } catch {}
      }
    } catch (e) {
      setMercyMessage(`Tác phẩm "${cleanTitle(book.title)}" của ${authorName} là một áng văn giàu tính triết lý và chiều sâu nhân bản sâu sắc, rất xứng đáng để bạn đón đọc.`);
    } finally {
      setIsMercyThinking(false);
    }
  };

  const handleAddToCartDetail = () => {
    const bookToCart = {
      ...book,
      price: currentPrice,
      selected_format: selectedFormatLabel,
      title: `${cleanTitle(book.title)} [${selectedFormat === "kindle" ? "Kindle" : selectedFormat === "hardcover" ? "Bìa cứng" : "Bìa mềm"}]`
    };
    addToCart(bookToCart, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2400);

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

  const handlePurchaseDetail = () => {
    const bookToBuy = {
      ...book,
      price: currentPrice,
      selected_format: selectedFormatLabel,
      title: `${cleanTitle(book.title)} [${selectedFormat === "kindle" ? "Kindle" : selectedFormat === "hardcover" ? "Bìa cứng" : "Bìa mềm"}]`
    };
    addToCart(bookToBuy, quantity);
    const currentUserId = user?.user_id || 1;
    fetch(`${API_BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "purchase",
      }),
    }).catch(() => {});
    alert(`Cảm ơn bạn đã đặt mua ấn bản ${selectedFormatLabel}! Hệ thống đã ghi nhận đơn hàng.`);
  };

  const handleWishlistDetail = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    const currentUserId = user?.user_id || 1;
    fetch(`${API_BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: nextState ? "wishlist" : "remove_wishlist",
      }),
    }).catch(() => {});
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      
      {/* Breadcrumb */}
      <div className="text-sm text-ink/60 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Trang chủ</Link> <ChevronRight size={14} /> 
        <Link href="/discover" className="hover:underline">Sách</Link> <ChevronRight size={14} /> 
        <span className="text-ink truncate max-w-xs">{cleanTitle(book.title)}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Image & Samples & Publishing Colophon (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col items-start w-full max-w-[320px] mx-auto lg:mx-0">
          
          {/* Bìa sách ấn phẩm nghệ thuật */}
          <div className="w-full mb-4 aspect-[2/3] relative rounded-[6px] overflow-hidden shadow-[0_12px_32px_-6px_rgba(0,0,0,0.18)] border border-stone-200/90 bg-[#1A1A1A] flex items-center justify-center group">
            {!detailImgFailed && detailImgSrc ? (
              <img 
                src={detailImgSrc} 
                alt={cleanTitle(book.title)} 
                referrerPolicy="no-referrer"
                onError={handleDetailImageError}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              /* Bìa sách mạ vàng cổ điển sang trọng nếu ảnh gốc không tồn tại */
              <div
                className={`w-full h-full bg-gradient-to-br ${COVER_THEMES[Math.abs(Number(book.book_id) || 1) % COVER_THEMES.length].bg} p-6 flex flex-col justify-between items-center text-center relative select-none`}
              >
                <div className="absolute inset-2 border border-amber-400/30 rounded pointer-events-none"></div>
                <div className="w-full text-[10px] uppercase tracking-[0.25em] text-amber-300/80 font-mono mt-2">
                  THE INKWELL
                </div>

                <div className="my-auto px-2 z-10">
                  <p className="font-serif font-bold text-lg leading-snug line-clamp-4 text-amber-200">
                    {cleanTitle(book.title)}
                  </p>
                  <div className="w-12 h-[1px] bg-amber-400/40 mx-auto my-3"></div>
                  <p className="text-xs text-stone-300 line-clamp-2 italic">
                    {authorName || "Special Edition"}
                  </p>
                </div>

                <div className="text-[9px] text-amber-300/60 uppercase tracking-widest font-mono mb-2">
                  Collector's Edition
                </div>
              </div>
            )}
          </div>
          
          {/* Nút Đọc thử & Nghe thử: Thiết kế tối giản tinh tế */}
          {(readSampleUrl || audioSampleUrl) && (
            <div className="flex gap-2 w-full mb-6">
              {readSampleUrl && (
                <a
                  href={readSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border border-stone-300 hover:border-stone-900 rounded-[5px] text-xs font-sans font-medium text-stone-800 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline shadow-2xs"
                >
                  <BookOpen size={14} /> Đọc thử
                </a>
              )}
              {audioSampleUrl && (
                <a
                  href={audioSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border border-stone-300 hover:border-stone-900 rounded-[5px] text-xs font-sans font-medium text-stone-800 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline shadow-2xs"
                >
                  <Play size={14} /> Nghe thử
                </a>
              )}
            </div>
          )}
          
          {/* Thông tin tác giả: Khối biên tập trang trọng */}
          <div className="w-full pt-5 border-t border-stone-200 text-left">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500 mb-3.5">
              Tác giả ấn phẩm
            </h4>
            <div className="flex items-center gap-3.5 p-3 rounded-[6px] bg-[#FAF9F6] border border-stone-200/80">
              <div className="w-11 h-11 rounded-full bg-[#1C1917] text-amber-100 flex items-center justify-center font-serif text-base font-bold shadow-xs shrink-0 select-none">
                {authorName ? authorName.trim().charAt(0) : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-sm text-stone-900 truncate hover:text-stone-700 cursor-pointer">
                  {authorName}
                </p>
                <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                  Tác giả văn học
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => alert(`Đã theo dõi tác giả ${authorName}! Bạn sẽ nhận được thông báo khi có ấn bản mới.`)}
              className="w-full mt-2.5 py-1.5 px-3 border border-stone-300 hover:border-stone-900 rounded-[5px] text-xs font-sans font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 transition-colors text-center cursor-pointer"
            >
              + Theo dõi tác giả
            </button>
          </div>

          {/* Thông số ấn bản (Publishing Colophon & Metadata) */}
          <div className="w-full mt-6 pt-5 border-t border-stone-200 text-left">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500 mb-3">
              Thông số ấn phẩm
            </h4>
            <dl className="text-xs space-y-2 text-stone-600 font-sans">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <dt className="text-stone-500">Mã ấn phẩm</dt>
                <dd className="font-mono text-stone-900 font-medium">{book.isbn || book.isbn13 || `#INK-${book.book_id}`}</dd>
              </div>
              {book.original_publication_year && (
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <dt className="text-stone-500">Năm phát hành</dt>
                  <dd className="font-medium text-stone-900">{book.original_publication_year}</dd>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-stone-100">
                <dt className="text-stone-500">Nhà phát hành</dt>
                <dd className="font-medium text-stone-900">The Inkwell Editions</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <dt className="text-stone-500">Ngôn ngữ</dt>
                <dd className="font-medium text-stone-900">Tiếng Việt & Nguyên bản</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-stone-500">Tình trạng</dt>
                <dd className="font-medium text-emerald-800">Mới 100% nguyên màng co</dd>
              </div>
            </dl>
          </div>

        </div>
        
        {/* CENTER COLUMN: Details & Description (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1C1917] leading-[1.18] tracking-tight pr-6">
              {cleanTitle(book.title)}
            </h1>
            <button className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer p-1" title="Chia sẻ tác phẩm">
              <Share size={19} />
            </button>
          </div>
          
          <div className="text-sm font-sans text-stone-600 mb-3 flex flex-wrap items-center gap-1.5">
            <span>Tác giả:</span> 
            <Link href="#" className="text-stone-900 hover:text-[#B12704] font-medium underline-offset-2 hover:underline">
              {authorName}
            </Link> 
            <span className="mx-2 text-stone-300">|</span> 
            <span>Định dạng:</span> 
            <span className="font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-[4px] text-xs">
              {selectedFormatLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-5 font-sans">
            <div className="flex items-center gap-1">
              <span className="font-bold text-stone-900 mr-1 text-sm">{book.score || "4.6"}</span>
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="fill-amber-500 text-amber-500" size={15} />
                ))}
              </div>
              <span className="text-stone-500 hover:text-stone-800 hover:underline cursor-pointer ml-2 text-xs">
                ({book.ratings_count ? `${new Intl.NumberFormat("vi-VN").format(book.ratings_count)} đánh giá Goodreads` : "Xem đánh giá"})
              </span>
            </div>
          </div>
          
          {/* Badge & Nút Xem tất cả phiên bản */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
            {book.rank && (
              <span className="bg-[#1C1917] text-white text-[11px] font-sans font-medium px-2.5 py-1 rounded-[4px]">
                Tuyển tập chọn lọc #{book.rank}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowFormatsModal(true)}
              className="ml-auto text-stone-700 hover:text-stone-900 text-xs font-sans font-medium underline underline-offset-2 cursor-pointer transition-colors"
            >
              Xem tất cả phiên bản
            </button>
          </div>
          
          {/* Formats Grid: Tinh gọn, bo góc 6px, màu đen than sang trọng */}
          <div className="grid grid-cols-3 gap-2.5 mb-8 font-sans">
            {formatsList.map((f) => {
              const isSelected = selectedFormat === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFormat(f.id)}
                  className={`p-3 rounded-[6px] text-center relative transition-all duration-200 cursor-pointer flex flex-col justify-between items-center ${
                    isSelected
                      ? "border-2 border-[#1C1917] bg-stone-50 shadow-xs"
                      : "border border-stone-200 hover:border-stone-400 bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white text-[9px] font-sans font-medium px-2 py-0.5 rounded-[3px] whitespace-nowrap shadow-xs uppercase tracking-wider">
                      Đã chọn
                    </div>
                  )}
                  <div className="font-semibold text-xs sm:text-sm text-stone-900 leading-snug mt-0.5">
                    {f.name}
                  </div>
                  <div className="text-[#1C1917] text-xs sm:text-sm font-bold mt-1.5 font-serif">
                    {formatPrice(f.price)}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Description: Tăng line-height [1.85], Sans-serif cho nội dung */}
          <div className="mb-8">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3 pb-1 border-b border-stone-200">
              Tóm tắt nội dung tác phẩm
            </h4>

            {book.description ? (
              <p className="font-sans text-[15px] sm:text-base text-stone-800 leading-[1.85] font-normal whitespace-pre-line">
                {book.description}
              </p>
            ) : (
              <div className="space-y-3 animate-pulse py-2">
                <div className="h-4 bg-stone-200/60 rounded-[4px] w-full"></div>
                <div className="h-4 bg-stone-200/60 rounded-[4px] w-11/12"></div>
                <div className="h-4 bg-stone-200/60 rounded-[4px] w-4/5"></div>
              </div>
            )}
          </div>

          {/* Khối Cột báo Biên tập: Góc nhìn từ Cố vấn Mercy AI (The Inkwell Critique) */}
          <div className="bg-[#FAF9F6] border border-stone-200/90 rounded-[8px] p-6 sm:p-7 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-200/80">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-stone-500 font-semibold block">
                  THE INKWELL CRITIQUE • MERCY DESK
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] mt-0.5">
                  Góc nhìn từ Cố vấn Mercy AI
                </h3>
              </div>

              {!mercyMessage && (
                <button
                  type="button"
                  onClick={askMercy}
                  disabled={isMercyThinking}
                  className="self-start sm:self-auto text-xs font-sans font-medium bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 hover:border-stone-700 px-4 py-2 rounded-[5px] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs active:scale-95"
                >
                  {isMercyThinking && <Loader2 size={13} className="animate-spin text-stone-600" />}
                  <span>{isMercyThinking ? "Đang biên soạn bài bình luận..." : "Xem bình luận văn học"}</span>
                </button>
              )}
            </div>

            {isMercyThinking && (
              <div className="flex items-center gap-3 py-4 px-4 bg-white rounded-[6px] border border-stone-200/80 text-stone-600 text-xs sm:text-sm font-serif italic">
                <Loader2 size={16} className="animate-spin text-stone-700 shrink-0" />
                <span>Mercy đang tra cứu tư liệu, đối chiếu phong cách học thuật và tổng hợp phân tích văn học về tác phẩm...</span>
              </div>
            )}

            {mercyMessage && (
              <div className="bg-white rounded-[6px] p-5 sm:p-6 border border-stone-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <div className="font-serif text-[15px] sm:text-base text-stone-800 leading-[1.85] font-normal">
                  {renderCleanMercyText(mercyMessage)}
                </div>
                <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 font-serif italic">
                  <span>— Bình luận trích dẫn từ Cố vấn Thư viện số Mercy AI</span>
                  <span className="font-sans text-[11px] not-italic text-stone-400 uppercase tracking-widest font-mono">
                    The Inkwell Literary Curations
                  </span>
                </div>
              </div>
            )}

            {!isMercyThinking && !mercyMessage && (
              <p className="font-serif italic text-stone-600 text-sm leading-relaxed">
                Nhấn <strong>"Xem bình luận văn học"</strong> để nhận góc nhìn biên tập độc quyền về cấu tứ tác phẩm, văn phong tác giả và giá trị triết học của ấn bản này.
              </p>
            )}
          </div>
        </div>
        
        {/* RIGHT COLUMN: Buy Box (col-span-3) - Thiết kế Editorial Sang Trọng */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-stone-200/90 rounded-[8px] p-5 sm:p-6 sticky top-24 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
            
            {/* Giá & Ưu đãi */}
            <div className="mb-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-3xl sm:text-[32px] font-bold text-[#1C1917] tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                <span className="text-[11px] font-medium font-sans text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-[4px] border border-stone-200 shrink-0">
                  Tiết kiệm 20%
                </span>
              </div>
              <div className="text-[11px] font-sans text-stone-400 line-through mt-0.5">
                Giá gốc: {formatPrice(Math.round(currentPrice * 1.25))}
              </div>
            </div>

            {/* Phiên bản đang chọn */}
            <div className="text-xs text-stone-600 font-sans font-medium mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Định dạng đã chọn:</span>
              <button 
                type="button"
                onClick={() => setShowFormatsModal(true)}
                className="font-medium text-[#1C1917] hover:text-stone-600 underline flex items-center gap-1 cursor-pointer"
                title="Bấm để đổi ấn bản"
              >
                {selectedFormatLabel}
                <ChevronDown size={13} />
              </button>
            </div>
            
            {/* Trạng thái kho hàng */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium font-sans text-stone-800 bg-stone-50 px-2.5 py-1 rounded-[4px] border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Còn hàng sẵn sàng giao
              </span>
              <span className="text-[11px] font-sans text-stone-400 ml-auto">Kho The Inkwell</span>
            </div>

            {/* Thông tin vận chuyển & Địa chỉ */}
            <div className="bg-[#FAF9F6] rounded-[6px] p-3.5 border border-stone-200/80 mb-5 space-y-2.5 text-xs font-sans">
              <div className="flex items-start gap-2.5 text-stone-700">
                <Truck size={15} className="text-stone-800 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  {selectedFormat === "kindle" ? (
                    <span>Giao nhận: <strong className="text-stone-900 font-semibold">Tức thì</strong> qua thư viện số</span>
                  ) : (
                    <span>Giao tiêu chuẩn: <strong className="text-stone-900 font-semibold">Miễn phí vào Ngày mai</strong></span>
                  )}
                </div>
              </div>
              {selectedFormat !== "kindle" && (
                <div className="flex items-center gap-2.5 text-stone-600">
                  <Clock size={14} className="text-stone-500 shrink-0" />
                  <span>Đặt trước trong <strong className="text-stone-800 font-semibold">5 giờ 30 phút</strong></span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                <span className="flex items-center gap-1 text-stone-500">
                  <MapPin size={13} className="text-stone-400" /> Giao tới: <strong className="text-stone-700 font-medium">Việt Nam</strong>
                </span>
                <span className="text-stone-600 font-medium hover:underline cursor-pointer">Miễn phí đổi trả</span>
              </div>
            </div>
            
            {/* Bộ chọn số lượng tinh gọn (Stepper - +) với bo góc 4px-6px */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-stone-700 font-sans">Số lượng:</span>
              <div className="flex items-center border border-stone-300 rounded-[5px] bg-white shadow-xs overflow-hidden">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Giảm số lượng"
                >
                  <Minus size={13} />
                </button>
                <span className="w-9 text-center text-xs font-bold text-stone-900 select-none font-sans">
                  {quantity}
                </span>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Tăng số lượng"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            
            {/* Nút Thêm vào giỏ hàng (Nút chính: Than đen #1C1917, bo góc 5px) & Mua ngay (Nút phụ: Dạng outline) */}
            <div className="space-y-2.5 mb-5 font-sans">
              <button 
                type="button"
                onClick={handleAddToCartDetail}
                className={`w-full py-3 px-4 rounded-[5px] font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] ${
                  isAddedToCart 
                    ? "bg-[#284234] text-white shadow-sm" 
                    : "bg-[#1C1917] hover:bg-[#2B2725] text-white shadow-sm"
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={16} className="animate-bounce" />
                    <span>Đã thêm vào giỏ hàng!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Thêm vào giỏ hàng</span>
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={handlePurchaseDetail}
                className="w-full py-3 px-4 rounded-[5px] font-medium text-sm border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917]/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Zap size={15} className="fill-[#1C1917]" />
                <span>Mua ngay</span>
              </button>
            </div>
            
            {/* Bảng cam kết & Đơn vị bán */}
            <div className="space-y-2 pt-4 border-t border-stone-200/80 text-xs font-sans">
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <ShieldCheck size={13} className="text-stone-600" /> Cung cấp bởi
                </span>
                <span className="font-medium text-stone-900">The Inkwell Official</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <RotateCcw size={13} className="text-stone-600" /> Đổi trả an tâm
                </span>
                <span className="text-stone-800 hover:underline cursor-pointer font-medium">30 ngày miễn phí</span>
              </div>
            </div>
            
            {/* Nút Thêm vào danh sách yêu thích */}
            <div className="mt-4 pt-4 border-t border-stone-200/80">
              <button 
                type="button"
                onClick={handleWishlistDetail}
                className={`w-full py-2.5 px-4 rounded-[5px] border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isWishlisted 
                    ? "bg-rose-50 border-rose-200 text-rose-700 shadow-xs" 
                    : "bg-white hover:bg-stone-50 border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-400"
                }`}
              >
                <Heart size={15} className={isWishlisted ? "fill-rose-600 text-rose-600" : "text-stone-400"} />
                <span>{isWishlisted ? "Đã lưu vào Yêu thích" : "Thêm vào danh sách yêu thích"}</span>
              </button>
            </div>
            
          </div>
        </div>

      </div>

      {/* Phần Đánh Giá & Nhận Xét Của Độc Giả (Product Reviews) */}
      <ProductReviews 
        bookId={Number(id)} 
        bookTitle={cleanTitle(book.title)} 
        initialAverageRating={book.score || 4.5}
        initialRatingsCount={book.ratings_count || 0}
        initialDistribution={book.ratings_distribution}
      />

      {/* 1. Phần Sách tương tự bạn có thể thích (You may also like) */}
      <div className="mt-16 border-t border-ink/10 pt-10">
        <RecommendedReadsCarousel 
          title="Có thể bạn cũng thích"
          subtitle="Những tác phẩm tương đồng về phong cách nghệ thuật và nội dung"
          initialBooks={similarBooks.length > 0 ? similarBooks : undefined}
        />
      </div>

      {/* 2. Phần Sách khác cùng tác giả (Also By This Author - nếu không có dữ liệu thì để trống) */}
      {authorBooks && authorBooks.length > 0 && (
        <div className="mt-6 border-t border-ink/10 pt-10">
          <RecommendedReadsCarousel 
            title="Cùng tác giả"
            subtitle={`Các tác phẩm khác của cùng tác giả ${authorName}`}
            initialBooks={authorBooks}
            emptyHide={true}
          />
        </div>
      )}

      {/* Modal Chi tiết & So sánh tất cả phiên bản sách */}
      {showFormatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FCFBF9] rounded-[8px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-1">
                  THE INKWELL EDITIONS • SO SÁNH ẤN BẢN
                </p>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] tracking-tight">
                  Các phiên bản của tác phẩm
                </h3>
                <p className="text-xs text-stone-600 font-serif italic mt-1">
                  {cleanTitle(book.title)} — {authorName}
                </p>
              </div>
              <button 
                onClick={() => setShowFormatsModal(false)}
                className="p-1.5 rounded-[4px] border border-transparent hover:border-stone-300 hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X size={18} />
              </button>
            </div>

            {/* Danh sách các phiên bản */}
            <div className="space-y-3.5 my-6 font-sans">
              {formatsList.map((f) => {
                const isSelected = selectedFormat === f.id;
                return (
                  <div 
                    key={f.id}
                    onClick={() => {
                      setSelectedFormat(f.id);
                      setShowFormatsModal(false);
                    }}
                    className={`p-4 sm:p-5 rounded-[6px] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected 
                        ? "border-2 border-[#1C1917] bg-white shadow-sm ring-1 ring-[#1C1917]/10" 
                        : "border border-stone-200/90 hover:border-stone-400 bg-white/70 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon đại diện bản in */}
                      <div className={`w-11 h-11 rounded-[5px] flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? "bg-[#1C1917] text-white border-[#1C1917]" 
                          : "bg-stone-100 text-stone-700 border-stone-200/80"
                      }`}>
                        {f.id === "kindle" ? (
                          <Tablet size={20} />
                        ) : f.id === "hardcover" ? (
                          <BookMarked size={20} />
                        ) : (
                          <BookOpen size={20} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-stone-900 text-base">
                            {f.name}
                          </h4>
                          {isSelected && (
                            <span className="bg-[#1C1917] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[3px]">
                              Đang chọn
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {f.desc}
                        </p>
                        <div className="text-[11px] text-stone-500 font-medium mt-1.5 flex items-center gap-1.5 flex-wrap">
                          {f.id === "kindle" ? (
                            <>
                              <Zap size={12} className="text-stone-700 shrink-0" />
                              <span>Giao nhận tức thì vào Thư viện số The Inkwell</span>
                            </>
                          ) : f.id === "hardcover" ? (
                            <>
                              <ShieldCheck size={12} className="text-stone-700 shrink-0" />
                              <span>Ấn bản giới hạn, áo ôm mạ vàng kim & bookmark lụa</span>
                            </>
                          ) : (
                            <>
                              <Truck size={12} className="text-stone-700 shrink-0" />
                              <span>Đóng gói cẩn thận 3 lớp, miễn phí đổi trả trong 30 ngày</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className="text-base sm:text-lg font-serif font-bold text-[#1C1917]">
                        {formatPrice(f.price)}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFormat(f.id);
                          setShowFormatsModal(false);
                        }}
                        className={`text-xs font-medium px-4 py-1.5 rounded-[5px] transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#1C1917] text-white shadow-xs"
                            : "border border-stone-300 text-stone-800 hover:border-stone-900 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check size={13} className="stroke-[2.5]" />
                            <span>Đã chọn</span>
                          </>
                        ) : (
                          <span>Chọn bản này</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200 text-xs font-sans">
              <span className="text-stone-500 font-serif italic text-[11px] sm:text-xs text-center sm:text-left">
                Tất cả ấn bản The Inkwell đều được cam kết tiêu chuẩn giấy và chất lượng đóng quyển cao cấp.
              </span>
              <button
                type="button"
                onClick={() => setShowFormatsModal(false)}
                className="px-5 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 border border-stone-300 hover:bg-stone-100 rounded-[5px] transition-colors cursor-pointer shrink-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

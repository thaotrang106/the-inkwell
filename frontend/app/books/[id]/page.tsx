"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { Star, ShoppingCart, Play, BookOpen, ChevronRight, Share, ChevronDown, MessageCircle, Sparkles, Loader2, X, Check } from "lucide-react";
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
  
  // Trạng thái ảnh bìa sách với cơ chế 2 tầng tải ảnh và bìa dự phòng
  const [detailImgSrc, setDetailImgSrc] = useState<string>(() => {
    if (book?.image_url) return formatImageUrl(book.image_url);
    return "";
  });
  const [useDetailProxy, setUseDetailProxy] = useState(false);
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
      if (currentBook.image_url) {
        setDetailImgSrc(formatImageUrl(currentBook.image_url));
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
          if (mergedBook.image_url) {
            setDetailImgSrc(formatImageUrl(mergedBook.image_url));
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

    // 1. Tải gợi ý sách tương tự (You may also like)
    fetch(`${API_BASE_URL}/api/recommendations/similar/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setSimilarBooks(json.data);
        } else {
          fetch(`${API_BASE_URL}/api/recommendations/hybrid/${id}`)
            .then((r) => r.json())
            .then((hj) => {
              if (hj.data && hj.data.length > 0) setSimilarBooks(hj.data);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

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
    if (book?.image_url) {
      setDetailImgSrc(formatImageUrl(book.image_url));
      setUseDetailProxy(false);
      setDetailImgFailed(false);
    }
  }, [book?.image_url]);

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
    if (!useDetailProxy && detailImgSrc) {
      setUseDetailProxy(true);
      setDetailImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(detailImgSrc)}&w=600&fit=cover&q=90`);
    } else {
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
      desc: "Đọc tức thì trên thiết bị Kindle hoặc ứng dụng di động",
      icon: "📱"
    },
    {
      id: "paperback",
      name: "Bìa mềm (Paperback)",
      price: paperbackPrice,
      desc: "Bản in tiêu chuẩn, giấy xốp chống lóa 70gsm",
      icon: "📖"
    },
    {
      id: "hardcover",
      name: "Bìa cứng (Hardcover)",
      price: hardcoverPrice,
      desc: "Bản kỷ niệm mạ vàng sang trọng, áo ôm kèm bookmark lụa",
      icon: "✨"
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
    const currentUserId = user?.user_id || 1;
    fetch(`${API_BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "wishlist",
      }),
    }).catch(() => {});
    alert("Đã thêm vào danh sách yêu thích! Hệ thống đã ghi nhận để cập nhật gu đọc của bạn.");
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
        
        {/* LEFT COLUMN: Image & Samples (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="w-full max-w-[300px] mb-6 aspect-[2/3] relative rounded-xl overflow-hidden shadow-xl border border-ink/10 bg-[#1A1A1A] flex items-center justify-center">
            {!detailImgFailed && detailImgSrc ? (
              <img 
                src={detailImgSrc} 
                alt={cleanTitle(book.title)} 
                referrerPolicy="no-referrer"
                onError={handleDetailImageError}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
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
          
          {/* Nút Đọc thử & Nghe thử: Chỉ hiển thị và dẫn link khi có dữ liệu, không có thì bỏ đi */}
          {(readSampleUrl || audioSampleUrl) && (
            <div className="flex gap-2 w-full max-w-[300px]">
              {readSampleUrl && (
                <a
                  href={readSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border border-ink/20 rounded-full text-sm font-medium text-ink hover:bg-ink/5 transition-colors flex items-center justify-center gap-2 cursor-pointer no-underline"
                >
                  <BookOpen size={16} /> Đọc thử
                </a>
              )}
              {audioSampleUrl && (
                <a
                  href={audioSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border border-ink/20 rounded-full text-sm font-medium text-ink hover:bg-ink/5 transition-colors flex items-center justify-center gap-2 cursor-pointer no-underline"
                >
                  <Play size={16} /> Nghe thử
                </a>
              )}
            </div>
          )}
          
          <div className="w-full max-w-[300px] mt-8 pt-6 border-t border-ink/10 text-left">
            <h3 className="font-bold text-ink mb-3 flex items-center gap-2">Theo dõi tác giả <span className="text-ink/40 text-xs">ⓘ</span></h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-ink/10 overflow-hidden flex items-center justify-center text-ink/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p className="font-medium text-ink hover:text-terracotta cursor-pointer">{authorName}</p>
            </div>
          </div>
        </div>
        
        {/* CENTER COLUMN: Details & Description (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-ink leading-tight mb-1 pr-8">
              {cleanTitle(book.title)}
            </h1>
            <button className="text-ink/50 hover:text-ink"><Share size={20} /></button>
          </div>
          
          <div className="text-sm text-ink mb-2">
            Tác giả: <Link href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium">{authorName}</Link> 
            <span className="mx-2 text-ink/30">|</span> 
            Định dạng: <span className="font-semibold text-terracotta">{selectedFormatLabel}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="font-bold text-ink mr-1">{book.score || "4.6"}</span>
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="fill-[#FFA41C] text-[#FFA41C]" size={16} />
                ))}
              </div>
              <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer ml-2">
                ({book.ratings_count ? `${new Intl.NumberFormat("vi-VN").format(book.ratings_count)} đánh giá` : "Xem đánh giá"})
              </span>
            </div>
          </div>
          
          {/* Badge & Nút Xem tất cả phiên bản */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/10">
            {book.rank && (
              <>
                <span className="bg-[#232F3E] text-white text-xs font-bold px-2 py-1 rounded-sm">
                  Bảng xếp hạng thịnh hành
                </span>
                <span className="text-[#007185] text-sm font-medium hover:underline cursor-pointer">
                  #{book.rank} tuần này
                </span>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowFormatsModal(true)}
              className="ml-auto text-[#007185] hover:text-[#C7511F] text-sm hover:underline cursor-pointer font-medium transition-colors"
            >
              Xem tất cả phiên bản
            </button>
          </div>
          
          {/* Formats Grid (Có thể bấm chọn từng bản và đổi giá tức thì) */}
          <div className="grid grid-cols-3 gap-2.5 mb-8">
            {formatsList.map((f) => {
              const isSelected = selectedFormat === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFormat(f.id)}
                  className={`p-3 rounded-lg text-center relative transition-all duration-200 cursor-pointer flex flex-col justify-between items-center ${
                    isSelected
                      ? "border-2 border-[#E77600] bg-[#FFF8F0] shadow-xs"
                      : "border border-ink/20 hover:border-ink/40 hover:bg-ink/[0.03] bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#E77600] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap shadow-xs">
                      Đã chọn
                    </div>
                  )}
                  <div className="font-bold text-xs sm:text-sm text-ink leading-snug mt-0.5">
                    {f.name}
                  </div>
                  <div className="text-[#B12704] text-xs sm:text-sm font-semibold mt-1.5">
                    {formatPrice(f.price)}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Description */}
          <div className="prose prose-sm max-w-none text-ink/90 leading-relaxed font-sans mb-8">
            <p className="font-bold mb-4 uppercase text-xs tracking-wider text-terracotta">
              TÓM TẮT NỘI DUNG SÁCH
            </p>

            {/* Hiển thị nội dung thật từ Database hoặc shimmer nhẹ khi đang hoàn tất tải */}
            {book.description ? (
              <p className="whitespace-pre-line text-base">
                {book.description}
              </p>
            ) : (
              <div className="space-y-2.5 animate-pulse py-1">
                <div className="h-4 bg-ink/10 rounded-sm w-full"></div>
                <div className="h-4 bg-ink/10 rounded-sm w-11/12"></div>
                <div className="h-4 bg-ink/10 rounded-sm w-4/5"></div>
              </div>
            )}
          </div>

          {/* Góc nhìn Cố vấn Mercy AI */}
          <div className="p-6 bg-[#FAF7F2] border border-[#B12704]/20 rounded-2xl mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-[#B12704]">
                <Sparkles size={18} className="fill-[#B12704]/20 text-[#B12704]" />
                <span className="text-base">Góc nhìn từ Cố vấn Mercy AI</span>
              </div>
              {!mercyMessage && (
                <button
                  type="button"
                  onClick={askMercy}
                  disabled={isMercyThinking}
                  className="text-xs font-semibold bg-[#B12704] hover:bg-[#8e1f03] text-white px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isMercyThinking ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>{isMercyThinking ? "Mercy đang suy nghĩ..." : "Hỏi Mercy về cuốn này"}</span>
                </button>
              )}
            </div>

            {isMercyThinking && (
              <div className="flex items-center gap-2 text-ink/60 text-xs italic py-3 bg-white/60 rounded-xl px-4 border border-ink/5">
                <Loader2 size={15} className="animate-spin text-[#B12704]" />
                <span>Mercy đang tra cứu và tổng hợp phân tích học thuật về tác phẩm này...</span>
              </div>
            )}

            {mercyMessage && (
              <div className="bg-white/80 rounded-xl p-4 sm:p-5 border border-ink/5 text-sm sm:text-[15px] text-ink/90 leading-relaxed font-sans shadow-xs">
                {renderCleanMercyText(mercyMessage)}
              </div>
            )}

            {!isMercyThinking && !mercyMessage && (
              <p className="text-xs text-ink/60 leading-relaxed">
                Nhấn "Hỏi Mercy về cuốn này" để nhận phân tích học thuật chuyên sâu về văn phong, chủ đề cốt lõi và giá trị văn học của tác phẩm từ Cố vấn Mercy AI.
              </p>
  
            )}

          </div>
        </div>
        
        {/* RIGHT COLUMN: Buy Box (col-span-3) */}
        <div className="lg:col-span-3">
          <div className="border border-ink/20 rounded-lg p-5 sticky top-24 shadow-sm">
            
            <div className="text-3xl font-bold text-[#B12704] mb-1">
              {formatPrice(currentPrice)}
            </div>

            <div className="text-xs text-ink/75 font-medium mb-4 pb-3 border-b border-ink/10 flex items-center justify-between">
              <span>Định dạng:</span>
              <span className="font-semibold text-[#007185]">{selectedFormatLabel}</span>
            </div>
            
            <div className="text-sm text-ink/70 mb-4">
              <span className="text-[#007185] hover:underline cursor-pointer">Miễn phí đổi trả</span>
              <br/>
              {selectedFormat === "kindle" ? (
                <>Giao hàng: <strong>Ngay lập tức</strong> qua thư viện số</>
              ) : (
                <>Giao hàng miễn phí vào <strong>Ngày mai</strong>. Đặt trước trong 5 giờ 30 phút</>
              )}
              <br/>
              <span className="flex items-center gap-1 mt-1 text-[#007185] hover:underline cursor-pointer">
                Giao tới Việt Nam
              </span>
            </div>
            
            <h4 className="text-xl font-bold text-[#007600] mb-4">Còn hàng</h4>
            
            {/* Quantity Selector */}
            <div className="mb-4">
              <select 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-ink/30 rounded-md py-1.5 px-3 bg-[#F0F2F2] shadow-sm hover:bg-[#E3E6E6] w-full max-w-[100px] cursor-pointer"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>Số lượng: {n}</option>
                ))}
              </select>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCartDetail}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-ink py-2.5 rounded-full font-medium shadow-sm border border-[#FCD200] flex items-center justify-center gap-2 mb-3 transition-colors"
            >
              <ShoppingCart size={18} /> Thêm vào giỏ hàng
            </button>
            
            {/* Buy Now Button */}
            <button 
              onClick={handlePurchaseDetail}
              className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-ink py-2.5 rounded-full font-medium shadow-sm border border-[#FF8F00] transition-colors mb-4"
            >
              Mua ngay
            </button>
            
            <div className="text-xs text-ink/60 space-y-1">
              <div className="flex justify-between"><span className="w-24">Giao hàng từ</span> <span>The Inkwell</span></div>
              <div className="flex justify-between"><span className="w-24">Bán bởi</span> <span>The Inkwell</span></div>
              <div className="flex justify-between"><span className="w-24">Đổi trả</span> <span className="text-[#007185] hover:underline cursor-pointer">Hỗ trợ đổi trả trong 30 ngày</span></div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-ink/10">
              <button 
                onClick={handleWishlistDetail}
                className="w-full py-1.5 border border-ink/30 rounded shadow-sm text-sm font-medium hover:bg-ink/5"
              >
                Thêm vào danh sách yêu thích
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
      />

      {/* 1. Phần Sách tương tự bạn có thể thích (You may also like) */}
      <div className="mt-16 border-t border-ink/10 pt-10">
        <RecommendedReadsCarousel 
          title="Có thể bạn cũng thích"
          subtitle="Những tác phẩm tương đồng về phong cách nghệ thuật và nội dung"
          initialBooks={similarBooks}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-ink/10 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <div>
                <h3 className="font-serif font-bold text-xl text-ink">Các phiên bản của tác phẩm</h3>
                <p className="text-xs text-ink/60 mt-0.5">{cleanTitle(book.title)} — {authorName}</p>
              </div>
              <button 
                onClick={() => setShowFormatsModal(false)}
                className="p-1.5 rounded-full hover:bg-ink/5 text-ink/60 hover:text-ink transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 my-6">
              {formatsList.map((f) => {
                const isSelected = selectedFormat === f.id;
                return (
                  <div 
                    key={f.id}
                    onClick={() => {
                      setSelectedFormat(f.id);
                      setShowFormatsModal(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected 
                        ? "border-[#E77600] bg-[#FFF8F0] shadow-xs" 
                        : "border-ink/10 hover:border-ink/30 hover:bg-ink/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="text-2xl mt-0.5">{f.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-ink text-sm sm:text-base">{f.name}</h4>
                          {isSelected && (
                            <span className="bg-[#E77600] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Đang chọn
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink/60 mt-1 leading-relaxed">{f.desc}</p>
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          {f.id === "kindle" ? "⚡ Giao ngay lập tức qua ứng dụng/email" : "📦 Đóng gói cẩn thận, miễn phí đổi trả"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base sm:text-lg font-bold text-[#B12704]">{formatPrice(f.price)}</div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFormat(f.id);
                          setShowFormatsModal(false);
                        }}
                        className={`mt-2 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#E77600] text-white"
                            : "bg-ink/5 text-ink hover:bg-ink/10"
                        }`}
                      >
                        {isSelected ? "Đã chọn" : "Chọn bản này"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-right pt-2 border-t border-ink/10">
              <button
                type="button"
                onClick={() => setShowFormatsModal(false)}
                className="px-5 py-2 text-sm font-medium text-ink/70 hover:text-ink hover:bg-ink/5 rounded-full transition-colors cursor-pointer"
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

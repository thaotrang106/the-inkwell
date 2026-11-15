"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { 
  Star, 
  ShoppingCart, 
  Play, 
  BookOpen, 
  ChevronRight, 
  Share, 
  ChevronDown, 
  MessageCircle, 
  Sparkles, 
  Loader2, 
  X, 
  Check, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  MapPin, 
  Zap, 
  Plus, 
  Minus, 
  Clock, 
  Tablet, 
  BookMarked 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import RecommendedReadsCarousel from "@/components/RecommendedReadsCarousel";
import ProductReviews from "@/components/ProductReviews";
import { BookDetailData } from "@/lib/serverBooks";
import { getBookPricing, formatPriceVND } from "@/lib/bookPricing";

const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

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
  clean = clean.replace(/(\d+)[ms]\//i, "$1l/");
  return clean;
};

const COVER_THEMES = [
  { bg: "from-[#1A2A3A] via-[#0D1B2A] to-[#050D1A]", text: "text-amber-200", border: "border-amber-400/30" },
  { bg: "from-[#3D1418] via-[#260A0D] to-[#140406]", text: "text-rose-200", border: "border-rose-400/30" },
  { bg: "from-[#122A1E] via-[#0A1A12] to-[#040D09]", text: "text-emerald-200", border: "border-emerald-400/30" },
  { bg: "from-[#2B1B3A] via-[#1A0E26] to-[#0D0614]", text: "text-purple-200", border: "border-purple-400/30" },
  { bg: "from-[#2C2416] via-[#1E170D] to-[#0E0A05]", text: "text-amber-100", border: "border-amber-300/30" },
];

const renderCleanMercyText = (raw: string) => {
  if (!raw) return null;
  const tokens = raw.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|"[^"]+"|[“”][^“”]+[“”])/g);

  return (
    <span className="leading-relaxed">
      {tokens.map((token, idx) => {
        if (!token) return null;
        if (token.startsWith("**") && token.endsWith("**")) {
          const content = token.slice(2, -2).trim();
          return <strong key={idx} className="font-semibold text-stone-900">{content}</strong>;
        }
        if ((token.startsWith("*") && token.endsWith("*")) || (token.startsWith("_") && token.endsWith("_"))) {
          const content = token.slice(1, -1).replace(/^["“”]|["“”]$/g, "").trim();
          return <em key={idx} className="font-serif italic text-stone-900 font-medium">“{content}”</em>;
        }
        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith('“') && token.endsWith('”'))) {
          const content = token.slice(1, -1).trim();
          return <span key={idx} className="font-serif italic text-stone-900 font-medium">“{content}”</span>;
        }
        const cleaned = token.replace(/[*_#]/g, "");
        return <span key={idx}>{cleaned}</span>;
      })}
    </span>
  );
};

interface BookDetailClientProps {
  initialBook: BookDetailData;
}

export default function BookDetailClient({ initialBook }: BookDetailClientProps) {
  const params = useParams();
  const id = (params?.id as string) || String(initialBook.book_id);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [book, setBook] = useState<any>(initialBook);
  const [loading, setLoading] = useState(false);
  
  const [detailImgSrc, setDetailImgSrc] = useState<string>(() => {
    return formatImageUrl(initialBook.image_url, initialBook.isbn);
  });
  const [detailRetryStep, setDetailRetryStep] = useState(0);
  const [detailImgFailed, setDetailImgFailed] = useState(false);

  const [mercyMessage, setMercyMessage] = useState<string>("");
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
    // 1. Kiểm tra cache phiên client
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(`inkwell_book_${id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.title || parsed.book_id)) {
            setBook(parsed);
          }
        }
        const cachedMercy = sessionStorage.getItem(`inkwell_mercy_${id}`);
        if (cachedMercy) setMercyMessage(cachedMercy);
      } catch {}
    }

    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
        const json = await res.json();
        const demoBook = json.data;
        
        if (demoBook) {
          const pricing = getBookPricing(id);
          const mergedBook = {
            ...initialBook,
            ...demoBook,
            price: pricing.price,
            original_price: pricing.originalPrice,
            discount_percent: pricing.discountPercent,
          };
          setBook(mergedBook);
          if (mergedBook.image_url || mergedBook.isbn) {
            setDetailImgSrc(formatImageUrl(mergedBook.image_url, mergedBook.isbn));
          }
          try {
            sessionStorage.setItem(`inkwell_book_${id}`, JSON.stringify(mergedBook));
          } catch {}
        }
        setRelatedBooks(json.data?.slice(1, 5) || []);

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
      }
    };
    
    fetchBook();

    // Tải sách tương tự
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

    // Tải sách cùng tác giả
    fetch(`${API_BASE_URL}/api/books/by-author/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setAuthorBooks(json.data);
        }
      })
      .catch(() => {});
  }, [id, initialBook]);

  useEffect(() => {
    if (book?.image_url || book?.isbn) {
      const formatted = formatImageUrl(book.image_url, book.isbn);
      setDetailImgSrc(formatted);
      setDetailRetryStep(0);
      setDetailImgFailed(!formatted);
    }
  }, [book?.image_url, book?.isbn]);

  const handleDetailImageError = () => {
    if (detailRetryStep === 0 && detailImgSrc && !detailImgSrc.includes("weserv.nl")) {
      setDetailRetryStep(1);
      setDetailImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(detailImgSrc)}&w=600&fit=cover&q=90`);
    } else if (detailRetryStep <= 1 && book?.isbn) {
      setDetailRetryStep(2);
      const cleanIsbn = String(book.isbn).trim();
      const paddedIsbn = cleanIsbn.length === 9 ? "0" + cleanIsbn : cleanIsbn;
      setDetailImgSrc(`https://covers.openlibrary.org/b/isbn/${paddedIsbn}-L.jpg`);
    } else {
      setDetailImgFailed(true);
    }
  };

  const authorName = typeof book.author === "string" ? book.author.replace(/\[|\]|'/g, "") : (book.author || book.authors || "Nhiều tác giả");
  
  // Tính toán giá tiền theo từng định dạng ấn bản từ nguồn tất định
  const basePrice = book.price || getBookPricing(id).price;
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

  const formatsList: { id: "kindle" | "paperback" | "hardcover"; name: string; price: number; desc: string }[] = [
    {
      id: "kindle",
      name: "Bản điện tử (Kindle)",
      price: kindlePrice,
      desc: "Đọc tức thì trên thiết bị Kindle hoặc ứng dụng đọc số The Inkwell"
    },
    {
      id: "paperback",
      name: "Bìa mềm (Paperback)",
      price: paperbackPrice,
      desc: "Bản in tiêu chuẩn chất lượng cao, giấy Phần Lan chống lóa 75gsm"
    },
    {
      id: "hardcover",
      name: "Bìa cứng (Hardcover)",
      price: hardcoverPrice,
      desc: "Ấn bản kỷ niệm bìa cứng mạ vàng kim cổ điển, áo ôm kèm bookmark lụa"
    }
  ];

  const readSampleUrl = book.sample_read_url || book.preview_url || book.read_url || book.sample_url || "";
  const audioSampleUrl = book.audio_sample_url || book.audio_url || book.sample_audio_url || "";

  const askMercy = async () => {
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
    } catch {
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
    alert(`Cảm ơn bạn đã đặt mua ấn bản ${selectedFormatLabel}! Đơn hàng đang được đóng gói.`);
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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#FAF7F2] min-h-screen font-sans">
      
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-stone-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-stone-900 transition-colors">Trang chủ</Link> 
        <ChevronRight size={13} className="text-stone-400" /> 
        <Link href="/trending" className="hover:text-stone-900 transition-colors">Tủ sách</Link> 
        <ChevronRight size={13} className="text-stone-400" /> 
        <span className="text-stone-800 font-medium truncate max-w-xs">{cleanTitle(book.title)}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-[4px] p-6 sm:p-8 lg:p-10 border border-stone-200/90 shadow-2xs">
        
        {/* LEFT COLUMN: Image & Samples & Spec Table (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col items-start w-full max-w-[320px] mx-auto lg:mx-0">
          
          <div className="w-full mb-4 aspect-[2/3] relative rounded-[4px] overflow-hidden shadow-md border border-stone-200/90 bg-[#1A1A1A] flex items-center justify-center group">
            {!detailImgFailed && detailImgSrc ? (
              <img 
                src={detailImgSrc} 
                alt={`Bìa sách ${cleanTitle(book.title)} - ${authorName}`}
                referrerPolicy="no-referrer"
                onError={handleDetailImageError}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 rounded-[4px]" 
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${COVER_THEMES[Math.abs(Number(book.book_id) || 1) % COVER_THEMES.length].bg} p-6 flex flex-col justify-between items-center text-center relative select-none rounded-[4px]`}
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
          
          {(readSampleUrl || audioSampleUrl) && (
            <div className="flex gap-2 w-full mb-6">
              {readSampleUrl && (
                <a
                  href={readSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border border-stone-300 hover:border-stone-900 rounded-[4px] text-xs font-sans font-medium text-stone-800 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline shadow-2xs"
                >
                  <BookOpen size={14} /> Đọc thử
                </a>
              )}
              {audioSampleUrl && (
                <a
                  href={audioSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border border-stone-300 hover:border-stone-900 rounded-[4px] text-xs font-sans font-medium text-stone-800 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline shadow-2xs"
                >
                  <Play size={14} /> Nghe thử
                </a>
              )}
            </div>
          )}
          
          {/* Tác giả */}
          <div className="w-full pt-5 border-t border-stone-200 text-left">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500 mb-3.5">
              Tác giả ấn phẩm
            </h4>
            <div className="flex items-center gap-3.5 p-3 rounded-[4px] bg-[#FAF7F2] border border-stone-200/80">
              <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center font-serif text-base font-bold shadow-xs shrink-0 select-none">
                {authorName ? authorName.trim().charAt(0) : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-sm text-stone-900 truncate">
                  {authorName}
                </p>
                <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                  Tác giả văn học
                </p>
              </div>
            </div>
          </div>

          {/* Bảng thông số ấn bản chuẩn hoá (Colophon - Không bịa nhà xuất bản) */}
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
              {book.pages && (
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <dt className="text-stone-500">Số trang</dt>
                  <dd className="font-medium text-stone-900">{book.pages} trang</dd>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-stone-100">
                <dt className="text-stone-500">Ngôn ngữ</dt>
                <dd className="font-medium text-stone-900">{book.language_code === "eng" ? "Tiếng Anh (Bản gốc)" : "Tiếng Việt & Nguyên bản"}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-stone-500">Tình trạng</dt>
                <dd className="font-medium text-emerald-800">Bản in chuẩn mực</dd>
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
            <strong className="text-stone-900 font-medium">{authorName}</strong>
            {book.genre && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-[#881337] font-medium">{book.genre}</span>
              </>
            )}
          </div>
          
          {/* Đánh giá sao */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 text-sm">
            <div className="flex text-amber-500 items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={15} 
                  fill={i < Math.floor(book.rating || 4.2) ? "currentColor" : "none"} 
                  className={i < Math.floor(book.rating || 4.2) ? "" : "text-stone-300"} 
                />
              ))}
            </div>
            <span className="font-bold text-stone-900">{book.rating || "4.2"}</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 text-xs">
              {(book.ratings_count || 1280).toLocaleString()} lượt bình chọn
            </span>
          </div>

          {/* Chọn định dạng sách */}
          <div className="mb-6">
            <p className="text-xs font-mono font-medium uppercase tracking-wider text-stone-500 mb-2.5">
              ĐỊNH DẠNG ẤN BẢN
            </p>
            <div className="grid grid-cols-3 gap-3">
              {formatsList.map((f) => {
                const isSelected = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFormat(f.id)}
                    className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? "border-[#1C1917] bg-[#FAF7F2] ring-1 ring-[#1C1917]" 
                        : "border-stone-200 hover:border-stone-400 bg-white"
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? "text-[#1C1917]" : "text-stone-800"}`}>
                      {f.name.split(" ")[0]} {f.name.split(" ")[1]}
                    </p>
                    <p className="text-xs font-semibold text-[#881337] mt-1">
                      {formatPriceVND(f.price)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mercy AI Book Overview Card */}
          <div className="p-4 sm:p-5 rounded-[4px] bg-[#FAF7F2] border border-stone-200/90 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#881337]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#881337]">
                  VÌ SAO BẠN CÓ THỂ THÍCH CUỐN NÀY
                </span>
              </div>
              <button
                type="button"
                onClick={askMercy}
                disabled={isMercyThinking}
                className="text-xs font-medium text-[#1C1917] hover:text-[#881337] transition-colors underline cursor-pointer"
              >
                {isMercyThinking ? "Đang phân tích..." : "Hỏi Mercy AI"}
              </button>
            </div>
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              {isMercyThinking ? (
                <div className="flex items-center gap-2 text-stone-500 py-2">
                  <Loader2 size={14} className="animate-spin text-[#881337]" />
                  <span>Mercy AI đang đọc sâu dữ liệu văn học của tác phẩm...</span>
                </div>
              ) : mercyMessage ? (
                renderCleanMercyText(mercyMessage)
              ) : (
                <p>
                  Tác phẩm thuộc danh mục tuyển chọn đặc sắc với cốt truyện hấp dẫn, phong cách hành văn điêu luyện và chủ đề nhân sinh sâu sắc. Bấm <em>"Hỏi Mercy AI"</em> để nhận lời bình văn học tức thì.
                </p>
              )}
            </div>
          </div>

          {/* Giới thiệu nội dung */}
          <div className="space-y-4 mb-8">
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Tóm tắt tác phẩm
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-sans">
              {book.description || `"${cleanTitle(book.title)}" là một trong những tác phẩm tiêu biểu của ${authorName}, đưa người đọc qua những trải nghiệm cảm xúc phong phú và bài học nhân sinh giá trị. Tác phẩm được chuẩn hóa từ kho dữ liệu văn học Goodreads-10k.`}
            </p>
          </div>

          {/* Sách tương tự cùng gu */}
          {similarBooks.length > 0 && (
            <div className="pt-6 border-t border-stone-200">
              <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-4">
                Độc giả yêu thích tác phẩm này cũng đọc
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {similarBooks.slice(0, 4).map((b) => (
                  <BookCard key={b.book_id} book={b} />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Buy Box (col-span-3) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 p-5 sm:p-6 rounded-[4px] border border-stone-200/90 bg-[#FAF7F2] space-y-5 shadow-2xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                GIÁ NIÊM YẾT CHÍNH HÃNG
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold font-sans text-[#881337]">
                  {formatPriceVND(currentPrice)}
                </span>
                {selectedFormat === "paperback" && book.original_price > book.price && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatPriceVND(book.original_price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-1">
                ✓ Còn hàng trong kho • Giao hàng tiêu chuẩn 2-3 ngày
              </p>
            </div>

            {/* Điều chỉnh số lượng */}
            <div className="flex items-center justify-between border-y border-stone-200/80 py-3">
              <span className="text-xs font-medium text-stone-700">Số lượng:</span>
              <div className="flex items-center border border-stone-300 rounded-[4px] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Minus size={13} />
                </button>
                <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCartDetail}
                className="w-full py-3 px-4 rounded-[4px] bg-[#1C1917] hover:bg-stone-800 text-white font-sans text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ShoppingCart size={15} />
                <span>{isAddedToCart ? "ĐÃ THÊM VÀO GIỎ" : "THÊM VÀO GIỎ HÀNG"}</span>
              </button>

              <button
                type="button"
                onClick={handlePurchaseDetail}
                className="w-full py-3 px-4 rounded-[4px] bg-[#881337] hover:bg-[#700f2d] text-white font-sans text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-2xs"
              >
                MUA NGAY
              </button>

              <button
                type="button"
                onClick={handleWishlistDetail}
                className={`w-full py-2 px-3 rounded-[4px] border transition-colors flex items-center justify-center gap-2 text-xs font-medium cursor-pointer ${
                  isWishlisted 
                    ? "border-rose-300 bg-rose-50 text-[#881337]" 
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
                }`}
              >
                <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? "Đã lưu vào danh sách ước" : "Lưu vào danh sách ước"}</span>
              </button>
            </div>

            {/* Cam kết của The Inkwell */}
            <div className="pt-3 border-t border-stone-200/80 space-y-2 text-[11px] text-stone-600 font-sans">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#881337] shrink-0" />
                <span>Miễn phí vận chuyển đơn từ 300.000₫</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={14} className="text-[#881337] shrink-0" />
                <span>Đổi trả 7 ngày không cần lý do</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#881337] shrink-0" />
                <span>Ấn bản chuẩn mực, nguyên seal màng co</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs Đánh giá của độc giả */}
      <div className="mt-12 bg-white rounded-[4px] p-6 sm:p-10 border border-stone-200/90 shadow-2xs">
        <ProductReviews bookId={Number(id) || initialBook.book_id} bookTitle={cleanTitle(book.title)} />
      </div>

    </div>
  );
}

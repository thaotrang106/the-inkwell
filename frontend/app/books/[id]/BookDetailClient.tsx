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
import RecommendedReadsCarousel from "@/components/RecommendedReadsCarousel";
import ProductReviews from "@/components/ProductReviews";
import { BookDetailData } from "@/lib/serverBooks";
import { getBookPricing, formatPriceVND } from "@/lib/bookPricing";
import { getKnownAuthorBooks } from "@/lib/authorBooksMap";
import { DEMO_READERS } from "@/lib/demoReaders";

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
  const [hasRequestedMercy, setHasRequestedMercy] = useState(false);
  const [isMercyThinking, setIsMercyThinking] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"kindle" | "paperback" | "hardcover">("paperback");
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<any[]>([]);
  const [authorBooks, setAuthorBooks] = useState<any[]>(() => {
    const rawAuth = typeof initialBook?.author === "string" 
      ? initialBook.author 
      : (initialBook?.authors || "");
    return getKnownAuthorBooks(rawAuth, Number(initialBook?.book_id || 0));
  });
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);

  useEffect(() => {
    // Reset trạng thái Mercy khi chuyển sách để không tự động hiển thị phân tích
    setHasRequestedMercy(false);
    setMercyMessage("");

    // 1. Kiểm tra cache phiên client cho thông tin sách
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(`inkwell_book_${id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.title || parsed.book_id)) {
            setBook(parsed);
          }
        }
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

    // 1. Tải gợi ý tương tự (3 tầng fallback an toàn: Similar -> Hybrid -> Popular)
    fetch(`${API_BASE_URL}/api/recommendations/similar/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setSimilarBooks(json.data);
        } else {
          fetch(`${API_BASE_URL}/api/recommendations/hybrid/${id}`)
            .then((r) => r.json())
            .then((hj) => {
              if (hj.data && hj.data.length > 0) {
                setSimilarBooks(hj.data);
              } else {
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
          const auth = typeof initialBook?.author === "string" ? initialBook.author : (initialBook?.authors || "");
          const fallback = getKnownAuthorBooks(auth, Number(id));
          if (fallback.length > 0) setAuthorBooks(fallback);
        }
      })
      .catch(() => {
        const auth = typeof initialBook?.author === "string" ? initialBook.author : (initialBook?.authors || "");
        const fallback = getKnownAuthorBooks(auth, Number(id));
        if (fallback.length > 0) setAuthorBooks(fallback);
      });
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
    const bId = String(id || book?.book_id);
    const bTitle = (book?.title || "").toLowerCase();
    if (bId === "62" || bTitle.includes("golden compass")) {
      if (detailImgSrc !== "/covers/the_golden_compass.jpg") {
        setDetailImgSrc("/covers/the_golden_compass.jpg");
        return;
      }
    }
    if (bId === "13" || bTitle.includes("1984")) {
      if (detailImgSrc !== "/covers/1984.jpg") {
        setDetailImgSrc("/covers/1984.jpg");
        return;
      }
    }
    if (bId === "9" || bId === "26" || bTitle.includes("angels") || bTitle.includes("vinci")) {
      if (detailImgSrc !== "/covers/angels_and_demons.jpg") {
        setDetailImgSrc("/covers/angels_and_demons.jpg");
        return;
      }
    }
    if (bId === "514" || bTitle.includes("sherlock")) {
      if (detailImgSrc !== "/covers/sherlock_holmes.jpg") {
        setDetailImgSrc("/covers/sherlock_holmes.jpg");
        return;
      }
    }
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
    setHasRequestedMercy(true);

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

  // Xác định hồ sơ độc giả cá nhân hóa (Chỉ áp dụng khi độc giả đã đăng nhập)
  const matchedDemo = user ? DEMO_READERS.find((r) => r.user_id === user.user_id && (user.name.includes(r.shortName) || user.name === r.name)) : null;
  const activeReader = matchedDemo || (user ? {
    user_id: user.user_id,
    name: user.name,
    shortName: user.name.replace(/\s*\(\s*#\d+\s*\)/g, "").replace(/^Độc giả\s+/i, "").trim(),
    genre: "Tuyển chọn khởi đầu",
    tagline: "Tuyển chọn theo gu đọc cá nhân",
    books: []
  } : null);

  const currentBookTitle = cleanTitle(book?.title || initialBook?.title);
  const personalizedTitle = activeReader
    ? `Có Thể ${activeReader.shortName} Sẽ Thích`
    : "Có Thể Bạn Sẽ Thích";
  const personalizedSubtitle = activeReader
    ? `${activeReader.genre} • Tuyển chọn phù hợp với gu đọc của ${activeReader.shortName} & tác phẩm "${currentBookTitle}"`
    : `Tuyển chọn tác phẩm tương đồng về nội dung & phong cách với "${currentBookTitle}" • Lọc kết hợp Hybrid`;

  // Hợp nhất danh sách đề xuất cá nhân hóa:
  // Ưu tiên các tác phẩm theo gu độc giả (loại trừ cuốn đang xem) + sách tương đồng từ AI Hybrid
  const displayPersonalizedBooks = (() => {
    const currentBookId = Number(id) || initialBook.book_id;
    const seenIds = new Set<number>([currentBookId]);
    const merged: any[] = [];

    if (activeReader && activeReader.books && activeReader.books.length > 0) {
      for (const b of activeReader.books) {
        if (!seenIds.has(b.book_id)) {
          seenIds.add(b.book_id);
          merged.push({
            ...b,
            badge: b.explanation || activeReader.genre
          });
          if (merged.length >= 5) break;
        }
      }
    }

    if (similarBooks && similarBooks.length > 0) {
      for (const b of similarBooks) {
        if (!seenIds.has(b.book_id)) {
          seenIds.add(b.book_id);
          merged.push({
            ...b,
            badge: b.badge || b.explanation || "Gợi ý tương đồng AI"
          });
          if (merged.length >= 10) break;
        }
      }
    }

    return merged.length > 0 ? merged : (similarBooks.length > 0 ? similarBooks : undefined);
  })();

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
                <div className="w-full text-xs uppercase tracking-[0.26em] text-amber-300/80 font-cormorant font-bold mt-2">
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

                <div className="text-[11px] text-amber-300/70 uppercase tracking-[0.2em] font-cormorant font-semibold mb-2">
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
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500 mb-3">
              Tác giả ấn phẩm
            </h4>
            <div className="p-3.5 rounded-[4px] bg-white border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-3">
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
              <button
                type="button"
                onClick={() => setIsFollowingAuthor(!isFollowingAuthor)}
                className="w-full mt-3 py-1.5 border border-stone-200 hover:border-stone-400 rounded-[3px] text-xs font-medium text-stone-700 bg-stone-50/60 hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                {isFollowingAuthor ? "✓ Đã theo dõi" : "+ Theo dõi tác giả"}
              </button>
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
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="flex justify-between items-start mb-1.5">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1C1917] leading-[1.18] tracking-tight pr-6">
              {cleanTitle(book.title)}
            </h1>
            <button className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer p-1" title="Chia sẻ tác phẩm">
              <Share size={19} />
            </button>
          </div>
          
          <div className="text-sm font-sans text-stone-600 mb-2.5 flex flex-wrap items-center gap-2">
            <span>Tác giả: <strong className="text-stone-900 font-medium">{authorName}</strong></span>
            <span className="text-stone-300">|</span>
            <span>Định dạng: <strong className="text-stone-900 font-medium">{selectedFormatLabel}</strong></span>
          </div>
          
          {/* Đánh giá sao */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className="font-bold text-stone-900">{book.rating || "4.34"}</span>
            <div className="flex text-amber-500 items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={15} 
                  fill={i < Math.floor(book.rating || 4.34) ? "currentColor" : "none"} 
                  className={i < Math.floor(book.rating || 4.34) ? "" : "text-stone-300"} 
                />
              ))}
            </div>
            <span className="text-stone-500 text-xs">
              ({(book.ratings_count || 4942365).toLocaleString()} đánh giá Goodreads)
            </span>
          </div>

          {/* Dòng Badge & Xem tất cả phiên bản */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
            <span className="bg-[#1C1917] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-[2px] tracking-wide uppercase">
              Tuyển tập chọn lọc #{Math.abs(Number(book.book_id) || 1)}
            </span>
            <a href="#formats" className="text-xs text-stone-500 hover:text-stone-900 underline transition-colors">
              Xem tất cả phiên bản
            </a>
          </div>

          {/* 3 thẻ chọn định dạng */}
          <div id="formats" className="grid grid-cols-3 gap-3 mb-6">
            {formatsList.map((f) => {
              const isSelected = selectedFormat === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFormat(f.id)}
                  className={`relative p-3 sm:p-3.5 rounded-[4px] border text-center transition-all cursor-pointer ${
                    isSelected 
                      ? "border-[#1C1917] bg-white ring-1 ring-[#1C1917]" 
                      : "border-stone-200 hover:border-stone-400 bg-white"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white text-[9px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider uppercase whitespace-nowrap shadow-xs">
                      ĐÃ CHỌN
                    </span>
                  )}
                  <p className="text-xs font-medium text-stone-800">
                    {f.name}
                  </p>
                  <p className="text-xs font-bold text-stone-900 mt-1">
                    {formatPriceVND(f.price)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* 1. Giới thiệu nội dung: Tóm tắt tác phẩm */}
          <div className="space-y-2.5 mb-6">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-stone-500">
              TÓM TẮT NỘI DUNG TÁC PHẨM
            </h3>
            <p className="text-stone-800 text-sm sm:text-[14.5px] leading-relaxed font-sans">
              {book.description || `"${cleanTitle(book.title)}" là một trong những tác phẩm tiêu biểu của ${authorName}, đưa người đọc qua những trải nghiệm cảm xúc phong phú và bài học nhân sinh giá trị. Tác phẩm được chuẩn hóa từ kho dữ liệu văn học Goodreads-10k.`}
            </p>
          </div>

          {/* 2. Trợ lý Mercy AI (xuống dưới - chỉ ghi ra phân tích khi người dùng bấm hỏi) */}
          <div className="p-4 sm:p-5 rounded-[4px] bg-[#FAF7F2] border border-stone-200/90 mb-8 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#881337]" />
                  <span className="text-xs sm:text-sm font-cormorant font-bold uppercase tracking-[0.2em] text-[#881337]">
                    VÌ SAO BẠN CÓ THỂ THÍCH CUỐN NÀY
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-sans">
                  Khám phá góc nhìn nghệ thuật và lời bình văn học chuyên sâu cùng Trợ lý Mercy AI.
                </p>
              </div>

              <button
                type="button"
                onClick={askMercy}
                disabled={isMercyThinking}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-[4px] bg-[#1C1917] hover:bg-[#881337] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
              >
                {isMercyThinking ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-white" />
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="text-amber-300" />
                    <span>Hỏi Mercy AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Chỉ ghi ra phân tích khi người dùng bấm hỏi Mercy AI */}
            {hasRequestedMercy && (
              <div className="mt-4 pt-4 border-t border-stone-200/80">
                {isMercyThinking ? (
                  <div className="flex items-center gap-2.5 text-stone-600 py-3 text-xs sm:text-sm font-sans">
                    <Loader2 size={15} className="animate-spin text-[#881337]" />
                    <span>Mercy AI đang đọc sâu dữ liệu văn học của tác phẩm...</span>
                  </div>
                ) : mercyMessage ? (
                  <div className="space-y-3">
                    <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                      {renderCleanMercyText(mercyMessage)}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setHasRequestedMercy(false)}
                        className="text-[11px] text-stone-500 hover:text-stone-800 underline transition-colors cursor-pointer"
                      >
                        Thu gọn phân tích
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Buy Box (col-span-3) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 p-5 sm:p-6 rounded-[4px] border border-stone-200/90 bg-white space-y-4 shadow-2xs text-left">
            {/* Giá tiền & Tiết kiệm */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-sans text-stone-900">
                  {formatPriceVND(currentPrice)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-[3px] border border-stone-200/80">
                  Tiết kiệm 20%
                </span>
              </div>
              <p className="text-xs text-stone-400 line-through mt-0.5">
                Giá gốc: {formatPriceVND(Math.round((currentPrice * 1.25) / 1000) * 1000)}
              </p>
              <div className="mt-2.5 text-xs text-stone-600 flex items-center justify-between">
                <span>Định dạng đã chọn:</span>
                <span className="font-medium text-stone-900 underline cursor-pointer">
                  {selectedFormatLabel} ▾
                </span>
              </div>
            </div>

            {/* Trạng thái kho */}
            <div className="flex items-center justify-between text-xs py-1 border-t border-stone-100">
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                Còn hàng sẵn sàng giao
              </span>
              <span className="text-stone-400">Kho The Inkwell</span>
            </div>

            {/* Hộp thông tin giao hàng */}
            <div className="border border-stone-200 rounded-[4px] p-3 space-y-2 text-xs text-stone-600 bg-stone-50/50">
              <div className="flex items-start gap-2">
                <Truck size={14} className="text-stone-700 mt-0.5 shrink-0" />
                <div>
                  <span>Giao tiêu chuẩn: </span>
                  <strong className="text-stone-900 font-medium">Miễn phí vào Ngày mai</strong>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-stone-700 mt-0.5 shrink-0" />
                <div>
                  <span>Đặt trước trong </span>
                  <strong className="text-stone-900 font-medium">5 giờ 30 phút</strong>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px]">
                <div className="flex items-center gap-1 text-stone-600">
                  <MapPin size={12} className="text-stone-500" />
                  <span>Giao tới: <strong className="text-stone-900">Việt Nam</strong></span>
                </div>
                <span className="text-stone-500">Miễn phí đổi trả</span>
              </div>
            </div>

            {/* Điều chỉnh số lượng */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-medium text-stone-700">Số lượng:</span>
              <div className="flex items-center border border-stone-300 rounded-[3px] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleAddToCartDetail}
                className="w-full py-2.5 px-4 rounded-[4px] bg-[#1C1917] hover:bg-stone-800 text-white font-sans text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingCart size={15} />
                <span>{isAddedToCart ? "ĐÃ THÊM VÀO GIỎ" : "Thêm vào giỏ hàng"}</span>
              </button>

              <button
                type="button"
                onClick={handlePurchaseDetail}
                className="w-full py-2.5 px-4 rounded-[4px] bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-sans text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap size={14} className="fill-current text-stone-900" />
                <span>Mua ngay</span>
              </button>
            </div>

            {/* Cam kết / Nhà cung cấp */}
            <div className="pt-2.5 border-t border-stone-100 space-y-1.5 text-xs text-stone-600 font-sans">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <ShieldCheck size={13} className="text-stone-500" /> Cung cấp bởi
                </span>
                <span className="font-medium text-stone-900">The Inkwell Official</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <RotateCcw size={13} className="text-stone-500" /> Đổi trả an tâm
                </span>
                <span className="font-medium text-stone-900">30 ngày miễn phí</span>
              </div>
            </div>

            {/* Thêm vào danh sách yêu thích */}
            <button
              type="button"
              onClick={handleWishlistDetail}
              className={`w-full py-2 px-3 rounded-[4px] border transition-colors flex items-center justify-center gap-2 text-xs font-medium cursor-pointer shadow-2xs ${
                isWishlisted 
                  ? "border-rose-300 bg-rose-50 text-[#881337]" 
                  : "border-stone-300 bg-white text-stone-700 hover:border-stone-500 hover:text-stone-900"
              }`}
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-[#881337]" : ""} />
              <span>{isWishlisted ? "Đã lưu vào danh sách yêu thích" : "Thêm vào danh sách yêu thích"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Tabs Đánh giá của độc giả */}
      <div className="mt-12 bg-white rounded-[4px] p-6 sm:p-10 border border-stone-200/90 shadow-2xs">
        <ProductReviews bookId={Number(id) || initialBook.book_id} bookTitle={cleanTitle(book.title)} />
      </div>

      {/* 1. Phần Sách cùng tác giả (Also By This Author) */}
      {authorBooks && authorBooks.length > 0 && (
        <div className="mt-14 border-t border-stone-200/80 pt-10">
          <RecommendedReadsCarousel 
            title="Cùng tác giả"
            subtitle={`Các tác phẩm tiêu biểu khác của cùng tác giả ${authorName}`}
            initialBooks={authorBooks}
            emptyHide={true}
          />
        </div>
      )}

      {/* 2. Phần Sách tương tự bạn có thể thích (You may also like) - Cá nhân hóa theo độc giả */}
      <div className="mt-14 border-t border-stone-200/80 pt-10">
        <RecommendedReadsCarousel 
          title={personalizedTitle}
          subtitle={personalizedSubtitle}
          initialBooks={displayPersonalizedBooks}
        />
      </div>

    </div>
  );
}

"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";

// Hàm làm sạch tên sách
const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
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
  { bg: "from-[#1A2A3A] via-[#0D1B2A] to-[#050D1A]", text: "text-amber-200", border: "border-amber-400/30" },
  { bg: "from-[#3D1418] via-[#260A0D] to-[#140406]", text: "text-rose-200", border: "border-rose-400/30" },
  { bg: "from-[#122A1E] via-[#0A1A12] to-[#040D09]", text: "text-emerald-200", border: "border-emerald-400/30" },
  { bg: "from-[#2B1B3A] via-[#1A0E26] to-[#0D0614]", text: "text-purple-200", border: "border-purple-400/30" },
  { bg: "from-[#2C2416] via-[#1E170D] to-[#0E0A05]", text: "text-amber-100", border: "border-amber-300/30" },
];

export default function BookCard({ book, rank, isHybrid }: { book: any, rank?: number, isHybrid?: boolean }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const initialUrl = formatImageUrl(book.image_url);
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [useProxy, setUseProxy] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  
  const theme = COVER_THEMES[Math.abs(Number(book.book_id) || 1) % COVER_THEMES.length];

  useEffect(() => {
    const formatted = formatImageUrl(book.image_url);
    setImgSrc(formatted);
    setUseProxy(false);
    setImgFailed(false);
  }, [book.image_url]);

  const handleImageError = () => {
    if (!useProxy && imgSrc) {
      // Nếu link trực tiếp bị chặn hoặc gặp lỗi mạng, chuyển sang CDN Proxy để tải ảnh thật
      setUseProxy(true);
      setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(imgSrc)}&w=450&fit=cover&q=90`);
    } else {
      // Nếu ảnh gốc thật sự không còn tồn tại trên Internet thì mới hiển thị bìa sách dự phòng
      setImgFailed(true);
    }
  };

  // Giả lập giá tiền VNĐ (VD: 150.000đ)
  const randomPrice = book.price || Math.floor(Math.random() * (260 - 80) + 80) * 1000;
  book.price = randomPrice;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);

    // Ghi nhận hành vi add_to_cart vào backend (Giai đoạn C)
    const currentUserId = user?.user_id || 1;
    fetch(`${API_BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "add_to_cart",
      }),
    }).catch((err) => console.log("Lỗi ghi nhận tương tác:", err));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const handleSaveToSession = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify(book));
      } catch {}
    }
  };

  return (
    <Link 
      href={`/books/${book.book_id}`} 
      onClick={handleSaveToSession}
      onMouseEnter={handleSaveToSession}
      onMouseDown={handleSaveToSession}
      className="group cursor-pointer flex flex-col h-full w-full relative"
    >
      {/* 1. Phần Bìa sách: Aspect ratio 2:3, bo góc nhẹ 4px */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-[4px] border border-stone-200/70 bg-stone-100 shadow-2xs transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md flex items-center justify-center p-0">
        
        {/* Badge Rank: Không nền, text in hoa nhỏ, đặt ở góc trên cùng bên trái của ảnh bìa */}
        {rank && !isHybrid && (
          <div className="absolute top-2 left-2 z-20 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-[#881337] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] select-none">
            #{rank} THỊNH HÀNH
          </div>
        )}
        {isHybrid && book.hybrid_score && (
          <div className="absolute top-2 right-2 z-20 font-mono text-[9px] font-bold uppercase tracking-wider text-stone-700 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            GỢI Ý {book.hybrid_score}%
          </div>
        )}

        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors z-10 pointer-events-none"></div>
        
        {!imgFailed && imgSrc ? (
          <img 
            src={imgSrc} 
            alt={cleanTitle(book.title)} 
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 rounded-[4px]"
          />
        ) : (
          /* Bìa sách bìa cứng mạ vàng kim cổ điển thay thế nếu sách không có ảnh thật */
          <div
            className={`w-full h-full bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between items-center text-center relative select-none rounded-[4px]`}
          >
            <div className={`absolute inset-2 border ${theme.border} rounded-[2px] pointer-events-none`}></div>
            <div className="w-full text-[9px] uppercase tracking-[0.25em] text-amber-300/80 font-mono mt-1">
              THE INKWELL
            </div>

            <div className="my-auto px-2 z-10">
              <p className={`font-serif font-bold text-sm leading-snug line-clamp-3 ${theme.text}`}>
                {cleanTitle(book.title)}
              </p>
              <div className="w-8 h-[1px] bg-amber-400/40 mx-auto my-2"></div>
              <p className="text-[11px] text-stone-300 line-clamp-1 italic font-sans">
                {book.author || book.authors || "Special Edition"}
              </p>
            </div>

            <div className="text-[8px] text-amber-300/60 uppercase tracking-widest font-mono mb-1">
              Collector's Pick
            </div>
          </div>
        )}
        
        {/* Nút Thêm vào giỏ thanh lịch hiện ra khi hover */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 bg-[#1C1917] text-white px-3.5 py-1.5 rounded-[4px] font-sans font-medium text-xs shadow-md hover:bg-stone-800 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
        >
          <ShoppingBag size={13} /> <span>Thêm vào giỏ</span>
        </button>
      </div>

      {/* 2. Phần Thông tin sách: Cấu trúc CSS Grid/Flexbox đảm bảo thẳng hàng tuyệt đối */}
      <div className="flex flex-col flex-1 pt-3 pb-1">
        
        {/* Hàng 1: Tiêu đề sách (Font Serif, cố định h-[2.6rem] để luôn thẳng hàng) */}
        <h3 className="font-serif font-bold text-[#1C1917] text-sm sm:text-[15px] leading-snug line-clamp-2 h-[2.6rem] group-hover:text-stone-600 transition-colors">
          {cleanTitle(book.title)}
        </h3>

        {/* Hàng 2: Tên tác giả (Font Sans-serif nhỏ, màu xám, cố định h-4) */}
        <p className="text-xs font-sans text-stone-500 line-clamp-1 h-4 mt-1">
          {book.author || book.authors || "Nhiều tác giả"}
        </p>
        
        {/* Hàng 3: Đánh giá sao (Màu vàng đất Gold #C5A059, kích thước nhỏ 10px, cố định h-4) */}
        <div className="flex items-center gap-1.5 mt-2 h-4">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="fill-[#C5A059] text-[#C5A059]" size={10} />
            ))}
          </div>
          <span className="text-[10px] font-mono text-stone-400 font-medium">
            ({book.rating ? Number(book.rating).toFixed(1) : "4.5"})
          </span>
        </div>
        
        {/* Hàng 4: Giá tiền in đậm, màu đen than #1C1917 (đẩy sát đáy bằng mt-auto) */}
        <div className="mt-auto pt-2.5">
          <p className="text-sm sm:text-[15px] font-bold text-[#1C1917] font-sans tracking-tight">
            {formatPrice(randomPrice)}
          </p>
        </div>
      </div>
    </Link>
  );
}

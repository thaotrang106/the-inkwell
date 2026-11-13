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

  return (
    <Link href={`/books/${book.book_id}`} className="group cursor-pointer flex flex-col gap-4 relative w-full h-full block">
      
      {rank && !isHybrid && (
        <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-md">
          #{rank} Thịnh hành
        </div>
      )}
      {isHybrid && book.hybrid_score && (
        <div className="absolute top-2 right-2 z-10 bg-purple-600 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-md flex items-center gap-1">
          <span>✨</span> Phù hợp {book.hybrid_score}%
        </div>
      )}

      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl bg-[#1A1A1A] flex items-center justify-center p-0">
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors z-10 pointer-events-none"></div>
        
        {!imgFailed && imgSrc ? (
          <img 
            src={imgSrc} 
            alt={cleanTitle(book.title)} 
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* Bìa sách bìa cứng mạ vàng kim cổ điển thay thế nếu sách không có ảnh thật */
          <div
            className={`w-full h-full bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between items-center text-center relative select-none`}
          >
            <div className={`absolute inset-2 border ${theme.border} rounded pointer-events-none`}></div>
            <div className="w-full text-[9px] uppercase tracking-[0.25em] text-amber-300/80 font-mono mt-1">
              THE INKWELL
            </div>

            <div className="my-auto px-2 z-10">
              <p className={`font-serif font-bold text-sm leading-snug line-clamp-3 ${theme.text}`}>
                {cleanTitle(book.title)}
              </p>
              <div className="w-8 h-[1px] bg-amber-400/40 mx-auto my-2"></div>
              <p className="text-[11px] text-stone-300 line-clamp-1 italic">
                {book.author || book.authors || "Special Edition"}
              </p>
            </div>

            <div className="text-[8px] text-amber-300/60 uppercase tracking-widest font-mono mb-1">
              Collector's Pick
            </div>
          </div>
        )}
        
        {/* Nút Thêm vào giỏ hiện ra khi hover */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 bg-white/90 backdrop-blur text-ink px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-ink hover:text-white transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <ShoppingBag size={16} /> Thêm vào giỏ
        </button>
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="font-serif font-bold text-ink text-[15px] leading-snug line-clamp-2 group-hover:text-[#4B6584] transition-colors">
          {cleanTitle(book.title)}
        </h3>
        <p className="text-xs text-ink/50 line-clamp-1">{book.author || book.authors || "Nhiều tác giả"}</p>
        
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="fill-amber-400 text-amber-400" size={12} />
            ))}
          </div>
          <span className="text-[10px] font-medium text-ink/40">
            ({book.rating || (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)})
          </span>
        </div>
        
        <p className="text-[15px] font-bold text-[#4B6584] mt-1">
          {formatPrice(randomPrice)}
        </p>
      </div>
    </Link>
  );
}

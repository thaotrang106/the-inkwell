"use client";

import { Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { MouseEvent } from "react";


// Hàm làm sạch tên sách
const cleanTitle = (title: string) => {
  if (!title) return '';
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, '').trim();
};

export default function BookCard({ book, rank, isHybrid }: { book: any, rank?: number, isHybrid?: boolean }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const highResImg = book.image_url ? book.image_url.replace("s.gr-assets", "i.gr-assets") : "";
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

      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl bg-white flex items-center justify-center p-0">
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors z-10 pointer-events-none"></div>
        <img 
          src={highResImg} 
          alt={cleanTitle(book.title)} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
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

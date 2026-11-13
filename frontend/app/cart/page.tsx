"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const cleanTitle = (title: string) => {
  if (!title) return '';
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, '').trim();
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-[#4B6584]/10 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-[#4B6584]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-ink/60 mb-8 max-w-md text-center">Có vẻ như bạn chưa chọn cuốn sách nào. Hãy khám phá không gian tri thức của The Inkwell ngay nhé.</p>
        <Link href="/" className="bg-[#4B6584] hover:bg-[#3d546f] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2">
          Tiếp tục khám phá <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl font-bold text-ink mb-10">Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.book_id} 
              className="flex gap-6 p-6 bg-white border border-ink/10 rounded-2xl shadow-sm relative group"
            >
              <img 
                src={item.image_url.replace("s.gr-assets", "i.gr-assets")} 
                alt={item.title} 
                referrerPolicy="no-referrer" className="w-24 h-36 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg text-ink line-clamp-1">{cleanTitle(item.title)}</h3>
                  <p className="text-ink/60 text-sm mt-1">{item.author}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 bg-[#FAF7F2] border border-ink/10 rounded-full px-3 py-1">
                    <button 
                      onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                      className="text-ink/60 hover:text-ink transition-colors p-1"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                      className="text-ink/60 hover:text-ink transition-colors p-1"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-[#4B6584] text-lg">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
              
              {/* Delete Button */}
              <button 
                onClick={() => removeFromCart(item.book_id)}
                className="absolute top-6 right-6 text-ink/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-ink/10 p-8 rounded-2xl shadow-lg sticky top-28">
            <h2 className="font-bold text-xl mb-6 text-ink border-b border-ink/5 pb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-ink/60">Tạm tính ({items.length} món)</span>
                <span className="font-medium text-ink">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Phí vận chuyển</span>
                <span className="font-medium text-ink">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Mã giảm giá (Mercy AI)</span>
                <span className="font-medium text-emerald-600">-0 ₫</span>
              </div>
            </div>
            
            <div className="border-t border-ink/10 pt-4 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-ink">Tổng cộng</span>
                <span className="font-bold text-2xl text-[#4B6584]">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-ink/50 text-right">Đã bao gồm VAT</p>
            </div>
            
            <button className="w-full bg-[#4B6584] hover:bg-[#3d546f] text-white py-4 rounded-xl font-bold shadow-xl shadow-[#4B6584]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Tiến hành thanh toán <ArrowRight size={18} />
            </button>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm font-medium text-ink/60 hover:text-ink transition-colors underline decoration-ink/30 underline-offset-4">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


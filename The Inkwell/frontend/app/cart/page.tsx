"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { 
  Trash2, 
  ArrowRight, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPriceVND } from "@/lib/bookPricing";

const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] py-16 sm:py-24 flex items-center justify-center font-sans">
        <div className="max-w-md w-full mx-auto px-4 text-center bg-white p-8 sm:p-12 rounded-[4px] border border-stone-200/90 shadow-2xs">
          <div className="w-14 h-14 rounded-[4px] bg-[#FAF7F2] border border-stone-200 text-[#881337] flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={26} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mb-3">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mb-8 leading-relaxed font-sans">
            Bạn chưa thêm ấn phẩm nào vào giỏ. Hãy dạo quanh tủ sách tuyển tập để chọn cho mình những tác phẩm tâm đắc nhất.
          </p>
          <div className="space-y-3">
            <Link 
              href="/trending" 
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white py-3 px-6 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              <span>Khám phá Sách Thịnh Hành</span>
              <ArrowRight size={14} />
            </Link>
            <div>
              <Link 
                href="/" 
                className="inline-block text-xs text-stone-500 hover:text-stone-900 transition-colors pt-2"
              >
                ← Quay lại Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/trending" 
            className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
          >
            <ArrowLeft size={14} /> Tiếp tục chọn sách
          </Link>
        </div>

        {/* Tiêu đề trang */}
        <div className="mb-8 pb-4 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-sm sm:text-base font-cormorant uppercase tracking-[0.24em] text-[#881337] font-bold">
              THE INKWELL CART
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
              Giỏ Hàng Tuyển Chọn
            </h1>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {items.length} đầu sách đang chọn
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Cột trái: Danh sách sách trong giỏ */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item, index) => {
              const formattedUrl = (item.image_url || "")
                .replace(/^http:\/\//i, "https://")
                .replace(/:\/\/(?:imagei|s)\.gr-assets\.com/i, "://images.gr-assets.com");
              const authorName = item.author || item.authors || "Tác giả văn học";

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  key={`${item.book_id}-${index}`} 
                  className="flex gap-4 sm:gap-6 p-4 sm:p-5 bg-white border border-stone-200/90 rounded-[4px] shadow-2xs relative group"
                >
                  {/* Bìa sách */}
                  <div className="w-20 sm:w-24 shrink-0 aspect-[2/3] bg-stone-100 rounded-[3px] overflow-hidden border border-stone-200">
                    {formattedUrl ? (
                      <img 
                        src={formattedUrl} 
                        alt={`Bìa sách ${cleanTitle(item.title)} - ${authorName}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1C1917] text-amber-100 flex items-center justify-center text-[10px] font-serif p-2 text-center">
                        The Inkwell
                      </div>
                    )}
                  </div>

                  {/* Chi tiết sách */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-3 pr-8">
                        <div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917] line-clamp-1">
                            {cleanTitle(item.title)}
                          </h3>
                          <p className="text-stone-500 text-xs mt-0.5 font-sans">
                            {authorName}
                          </p>
                          {item.selected_format && (
                            <span className="inline-block mt-1 text-[10px] font-mono text-[#881337] bg-rose-50 px-2 py-0.5 rounded-[2px] border border-rose-200/60">
                              {item.selected_format}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-100">
                      {/* Điều chỉnh số lượng */}
                      <div className="flex items-center border border-stone-300 rounded-[3px] bg-[#FAF7F2]">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                          className="text-stone-600 hover:text-stone-900 transition-colors px-2 py-1 cursor-pointer"
                          title="Giảm số lượng"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="font-bold w-6 text-center text-xs text-stone-900 font-mono">
                          {item.quantity}
                        </span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                          className="text-stone-600 hover:text-stone-900 transition-colors px-2 py-1 cursor-pointer"
                          title="Tăng số lượng"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      
                      {/* Thành tiền */}
                      <div className="text-right">
                        <p className="font-bold text-[#881337] text-base font-sans">
                          {formatPriceVND(item.price * item.quantity)}
                        </p>
                        <p className="text-[10px] text-stone-400 font-mono">
                          {formatPriceVND(item.price)} / cuốn
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nút xóa */}
                  <button 
                    type="button"
                    onClick={() => removeFromCart(item.book_id)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-[#881337] transition-colors p-1 cursor-pointer"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Cột phải: Hộp tóm tắt đơn hàng */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-stone-200/90 p-6 sm:p-7 rounded-[4px] shadow-2xs sticky top-24 font-sans space-y-5">
              <h2 className="font-serif font-bold text-xl text-[#1C1917] border-b border-stone-100 pb-3">
                Tóm Tắt Đơn Hàng
              </h2>
              
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính ({items.reduce((acc, i) => acc + i.quantity, 0)} cuốn)</span>
                  <span className="font-medium text-stone-900">{formatPriceVND(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển bưu phẩm</span>
                  <span className="font-medium text-emerald-800">Miễn phí toàn quốc</span>
                </div>
                <div className="flex justify-between">
                  <span>Đóng gói màng co chống sốc</span>
                  <span className="font-medium text-stone-900">0 ₫</span>
                </div>
              </div>
              
              <div className="border-t border-stone-200/80 pt-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-serif font-bold text-base text-[#1C1917]">Tổng cộng</span>
                  <span className="font-bold text-2xl text-[#881337]">{formatPriceVND(cartTotal)}</span>
                </div>
                <p className="text-[11px] text-stone-400 text-right">Đã bao gồm thuế GTGT &amp; hóa đơn</p>
              </div>
              
              <button 
                type="button"
                onClick={() => alert("Cảm ơn bạn đã lựa chọn The Inkwell! Hệ thống đang chuyển đến cổng thanh toán an toàn.")}
                className="w-full bg-[#1C1917] hover:bg-stone-800 text-white py-3.5 px-4 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>TIẾN HÀNH ĐẶT HÀNG</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-center pt-1">
                <Link 
                  href="/trending" 
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4"
                >
                  Tiếp tục chọn thêm ấn phẩm khác
                </Link>
              </div>

              {/* Cam kết dịch vụ */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <Truck size={13} className="text-[#881337] shrink-0" />
                  <span>Giao hàng tiêu chuẩn 2-3 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={13} className="text-[#881337] shrink-0" />
                  <span>Đổi trả miễn phí 7 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-[#881337] shrink-0" />
                  <span>Cam kết ấn bản chuẩn mực nguyên seal</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";
import { useMercy } from "@/context/MercyContext";

export default function ContactPage() {
  const { openMercy } = useMercy();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Tư vấn chọn sách",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#881337] selection:text-white">
      
      {/* 1. Nút quay lại trang chủ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-stone-500 hover:text-[#881337] transition-colors font-medium group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {/* Header trang */}
        <div className="border-b border-stone-200 pb-8 mb-10">
          <span className="uppercase tracking-[0.25em] text-xs font-bold text-[#881337] block mb-2.5 font-sans">
            KẾT NỐI VĂN HỌC &amp; HỖ TRỢ
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1917] tracking-tight mb-4">
            Liên Hệ &amp; Chăm Sóc Độc Giả
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            “Mọi thắc mắc về ấn bản, quy cách đóng gói hoặc góp ý cho không gian sách The Inkwell đều được chúng tôi lắng nghe với sự trân trọng cao nhất.”
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Cột trái: Thông tin liên hệ thực tế */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#1C1917] border-b border-stone-100 pb-3">
                Kênh Hỗ Trợ Trực Tiếp
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#881337]/10 text-[#881337] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-mono font-medium">Hotline Độc Giả</p>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">1900 6868 <span className="font-normal text-stone-500 text-xs">(Phím 1)</span></p>
                  <p className="text-[11px] text-stone-500 mt-0.5">08:30 – 21:00 (Thứ 2 – Chủ Nhật)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#881337]/10 text-[#881337] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-mono font-medium">Hòm Thư Điện Tử</p>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">support@theinkwell.vn</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Phản hồi thư trong vòng 2 – 4 giờ</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#881337]/10 text-[#881337] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-mono font-medium">Không Gian Trưng Bày</p>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">Tòa Nhà Tri Thức The Inkwell</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">126 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh</p>
                </div>
              </div>

            </div>

            {/* Thẻ mở nhanh Mercy AI */}
            <div className="bg-[#1C1917] rounded-2xl p-6 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-amber-300">
                <Sparkles size={16} />
                <span className="text-xs uppercase tracking-wider font-mono font-bold">Cần Tư Vấn Sách Ngay?</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Trợ lý văn học Mercy AI hoạt động 24/7 để phân tích gu đọc và gợi ý chính xác tác phẩm phù hợp tâm trạng của bạn.
              </p>
              <button
                type="button"
                onClick={() => openMercy()}
                className="w-full mt-2 bg-[#881337] hover:bg-[#9f1239] text-white py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageSquare size={14} />
                <span>Trò chuyện cùng Mercy AI</span>
              </button>
            </div>

          </div>

          {/* Cột phải: Form gửi tin nhắn / liên hệ */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
            
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-stone-900">
                  Cảm Ơn Bạn Đã Kết Nối!
                </h3>
                <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                  Tin nhắn của bạn đã được chuyển đến bộ phận Chăm sóc Độc giả The Inkwell. Chúng tôi sẽ phản hồi qua email <strong>{formData.email}</strong> trong thời gian sớm nhất.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "Tư vấn chọn sách", message: "" });
                    }}
                    className="text-xs font-semibold text-[#881337] hover:underline cursor-pointer"
                  >
                    Gửi thêm tin nhắn khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] mb-1">
                    Gửi Thư Cho The Inkwell
                  </h3>
                  <p className="text-xs text-stone-500">
                    Điền thông tin bên dưới để gửi phản hồi, yêu cầu ấn bản hiếm hoặc phản ánh dịch vụ.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Họ và tên của bạn <span className="text-[#881337]">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]/20 outline-none text-sm text-stone-900 transition-all placeholder:text-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email nhận phản hồi <span className="text-[#881337]">*</span>
                    </label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="VD: reader@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]/20 outline-none text-sm text-stone-900 transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Chủ đề cần hỗ trợ
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]/20 outline-none text-sm text-stone-900 transition-all bg-white"
                  >
                    <option value="Tư vấn chọn sách">Tư vấn chọn sách theo sở thích</option>
                    <option value="Tra cứu đơn hàng">Tra cứu tiến độ giao đơn hàng</option>
                    <option value="Đổi trả ấn bản">Yêu cầu đổi trả hoặc bảo hành sách</option>
                    <option value="Tìm ấn bản hiếm">Tìm kiếm ấn bản đặc biệt / sách hiếm</option>
                    <option value="Đóng góp ý kiến">Góp ý cải thiện không gian sách</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Nội dung tin nhắn <span className="text-[#881337]">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mô tả chi tiết nội dung bạn muốn chia sẻ cùng The Inkwell..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]/20 outline-none text-sm text-stone-900 transition-all placeholder:text-stone-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1C1917] hover:bg-[#881337] text-white py-3 px-6 rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? "Đang gửi đi..." : "Gửi tin nhắn"}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}

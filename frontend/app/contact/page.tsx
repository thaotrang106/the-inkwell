"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Hỏi về đơn hàng",
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
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#881337] selection:text-white font-sans">
      
      {/* 1. Thanh điều hướng quay lại */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-500 hover:text-[#881337] transition-colors font-medium group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {/* Header trang phong cách Biên tập thanh lịch */}
        <header className="border-b border-stone-300/80 pb-8 mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#881337] font-semibold mb-2">
            CHĂM SÓC KHÁCH HÀNG
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#1C1917] tracking-tight leading-tight mb-4">
            Liên Hệ Với The Inkwell
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
            Nếu bạn cần tra cứu tình trạng đơn hàng, yêu cầu đổi sách hoặc tìm kiếm một tựa sách cụ thể, đội ngũ The Inkwell luôn sẵn lòng hỗ trợ.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Cột trái: Thông tin liên hệ thực tế & minh bạch */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#1C1917] pb-3 border-b border-stone-200">
                Thông tin trực tiếp
              </h3>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Hotline đặt hàng &amp; hỗ trợ
                  </p>
                  <p className="font-semibold text-stone-900 text-base">
                    1900 6868
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    08:30 – 21:00, tất cả các ngày trong tuần
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Hòm thư điện tử
                  </p>
                  <p className="font-semibold text-stone-900 text-base">
                    support@theinkwell.vn
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Phản hồi trong vòng 2 – 4 giờ làm việc
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Địa chỉ hiệu sách
                  </p>
                  <p className="font-semibold text-stone-900 text-sm leading-relaxed">
                    126 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Mở cửa đón bạn đọc: 09:00 – 21:30 hàng ngày
                  </p>
                </div>
              </div>
            </div>

            {/* Khối cam kết dịch vụ gọn gàng */}
            <div className="p-4 bg-white border border-stone-200 rounded-[4px] text-xs text-stone-600 space-y-2">
              <p className="font-serif font-bold text-stone-900 text-sm">Thời gian xử lý đơn hàng</p>
              <p className="leading-relaxed">
                Đơn hàng tại TP.HCM và Hà Nội được giao trong 1-2 ngày làm việc. Các tỉnh thành khác từ 2-4 ngày làm việc. Mọi kiện sách đều được đóng bọc chống sốc 2 lớp.
              </p>
            </div>

          </div>

          {/* Cột phải: Biểu mẫu gửi thư ngắn gọn, nghiêm túc */}
          <div className="lg:col-span-7 bg-white border border-stone-300/80 rounded-[4px] p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-2">
              Gửi tin nhắn cho chúng tôi
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Điền thông tin bên dưới và chúng tôi sẽ phản hồi qua email của bạn trong thời gian sớm nhất.
            </p>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check size={20} />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900">Tin nhắn đã được gửi thành công</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Cảm ơn bạn đã liên hệ. Thủ thư The Inkwell đã tiếp nhận thư và sẽ gửi thư hồi đáp tới địa chỉ <span className="font-semibold text-stone-800">{formData.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", subject: "Hỏi về đơn hàng", message: "" });
                  }}
                  className="mt-4 text-xs text-[#881337] hover:underline font-medium cursor-pointer"
                >
                  Gửi một tin nhắn khác &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Họ và tên <span className="text-[#881337]">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-300 rounded-[3px] focus:outline-none focus:border-[#1C1917] text-stone-900 text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Địa chỉ Email <span className="text-[#881337]">*</span>
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-300 rounded-[3px] focus:outline-none focus:border-[#1C1917] text-stone-900 text-xs transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Chủ đề hỗ trợ
                  </label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-300 rounded-[3px] focus:outline-none focus:border-[#1C1917] text-stone-900 text-xs transition-colors"
                  >
                    <option value="Hỏi về đơn hàng">Kiểm tra tình trạng đơn hàng</option>
                    <option value="Đổi trả sách">Yêu cầu đổi trả / sách lỗi</option>
                    <option value="Tư vấn sách">Tư vấn tựa sách hoặc bản dịch</option>
                    <option value="Góp ý khác">Góp ý dịch vụ hoặc hợp tác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nội dung tin nhắn <span className="text-[#881337]">*</span>
                  </label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Vui lòng cung cấp mã đơn hàng nếu bạn đang cần tra cứu tình trạng giao nhận..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-300 rounded-[3px] focus:outline-none focus:border-[#1C1917] text-stone-900 text-xs transition-colors resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white rounded-[3px] text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={13} />
                    <span>{isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}

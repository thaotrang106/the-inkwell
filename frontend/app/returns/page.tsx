"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldCheck, Clock, CheckCircle2, Mail, Phone, ArrowRight, HelpCircle } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#881337] selection:text-white">
      
      {/* 1. Nút quay lại trang chủ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-stone-500 hover:text-[#881337] transition-colors font-medium group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {/* Header trang */}
        <div className="border-b border-stone-200 pb-8 mb-10">
          <span className="uppercase tracking-[0.25em] text-xs font-bold text-[#881337] block mb-2.5 font-sans">
            DỊCH VỤ &amp; HỖ TRỢ ĐỘC GIẢ
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1917] tracking-tight mb-4">
            Chính Sách Đổi Trả &amp; Hoàn Tiền
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            “The Inkwell cam kết mỗi tác phẩm đến tay bạn đều là ấn bản trọn vẹn, được gìn giữ nguyên vẹn giá trị tinh hoa và thẩm mỹ xuất bản.”
          </p>
        </div>

        {/* 3 Cam kết cốt lõi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#881337]/10 text-[#881337] flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1C1917] mb-1.5">7 Ngày Đổi Trả</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Thời gian linh hoạt trong vòng 7 ngày kể từ khi đơn hàng được giao thành công đến bạn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1C1917] mb-1.5">100% Sách Chính Hãng</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Đảm bảo bản quyền từ các nhà xuất bản uy tín, đền bù gấp đôi nếu phát hiện sách lậu hoặc in sao chép.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <RefreshCw size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1C1917] mb-1.5">Đổi Mới Miễn Phí</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              The Inkwell chi trả toàn bộ cước phí vận chuyển hai chiều đối với sách phát sinh lỗi từ nhà sản xuất.
            </p>
          </div>
        </div>

        {/* Nội dung chi tiết chính sách */}
        <div className="space-y-10 text-stone-700 text-sm sm:text-base leading-relaxed font-sans">
          
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#1C1917] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#881337]"></span>
              1. Các trường hợp được chấp nhận đổi trả
            </h2>
            <ul className="space-y-2.5 text-stone-600 pl-4 list-disc text-sm sm:text-[15px]">
              <li><strong>Lỗi in ấn kỹ thuật:</strong> Sách bị mất trang, trùng trang, in nhòe chữ, ngược dòng hoặc thiếu nội dung nguyên tác.</li>
              <li><strong>Lỗi gia công &amp; đóng bìa:</strong> Gáy sách bị bung chỉ, mép sách bị dập rách, keo gáy bong tróc khi mở hộp.</li>
              <li><strong>Hư hại do vận chuyển:</strong> Hộp carton bị móp vỡ làm ảnh hưởng trực tiếp đến sách bên trong (kèm video đồng kiểm khi nhận hàng).</li>
              <li><strong>Giao nhầm ấn bản:</strong> Nhầm tựa sách, tác giả, hoặc sai phiên bản bìa cứng/bìa mềm so với đơn đặt hàng.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#1C1917] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#881337]"></span>
              2. Điều kiện áp dụng đổi trả
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-stone-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Sách còn giữ nguyên tem niêm phong, bookmark và phụ kiện đính kèm (nếu có).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Không có dấu hiệu viết vẽ, gập gãy nếp góc trang do quá trình đọc cá nhân.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Yêu cầu đổi trả được gửi trong vòng 7 ngày kể từ thời điểm nhận hàng.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Cung cấp mã đơn hàng hoặc số điện thoại đã dùng để đặt mua trên The Inkwell.</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#1C1917] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#881337]"></span>
              3. Quy trình 3 bước xử lý đổi hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200">
                <span className="text-xs font-mono font-bold text-[#881337]">BƯỚC 01</span>
                <h4 className="font-bold text-sm text-stone-900 mt-1 mb-1">Gửi thông tin</h4>
                <p className="text-xs text-stone-600">Chụp ảnh tình trạng lỗi sách và gửi về Zalo/Email hỗ trợ của The Inkwell.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200">
                <span className="text-xs font-mono font-bold text-[#881337]">BƯỚC 02</span>
                <h4 className="font-bold text-sm text-stone-900 mt-1 mb-1">Xác nhận nhanh</h4>
                <p className="text-xs text-stone-600">Đội ngũ CSKH phản hồi và gửi mã vận chuyển đổi hàng tận nơi trong 2-4 giờ làm việc.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200">
                <span className="text-xs font-mono font-bold text-[#881337]">BƯỚC 03</span>
                <h4 className="font-bold text-sm text-stone-900 mt-1 mb-1">Giao sách mới</h4>
                <p className="text-xs text-stone-600">Bưu tá giao ấn bản mới tinh và thu hồi ấn bản lỗi tại nhà bạn, hoàn toàn miễn phí.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Khối hỗ trợ nhanh cuối trang */}
        <div className="mt-12 p-8 rounded-2xl bg-[#1C1917] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold">Cần giải đáp thêm về đơn hàng?</h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Bộ phận Chăm sóc Độc giả luôn sẵn sàng lắng nghe và hỗ trợ bạn trong mọi trường hợp.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/contact" 
              className="bg-[#881337] hover:bg-[#9f1239] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors inline-flex items-center gap-2"
            >
              <Mail size={14} />
              <span>Liên hệ hỗ trợ</span>
            </Link>
            <Link 
              href="/" 
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
            >
              Về Trang chủ
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

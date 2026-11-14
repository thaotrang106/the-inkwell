"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Package, Heart, Compass, ShieldCheck, Quote, BookMarked } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#B12704] selection:text-white">
      
      {/* 1. THANH ĐIỀU HƯỚNG BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-ink/60 hover:text-[#B12704] transition-colors font-medium group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">

        {/* 2. THE EDITORIAL CENTERPIECE (Bố cục Báo chí Tạp chí Văn học 3 Cột) */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start pb-12 border-b border-ink/15">

          {/* CỘT TRÁI (Desktop: 4 cols) - Tiêu đề thơ mộng & Triết lý cốt lõi */}
          <div className="lg:col-span-4 flex flex-col justify-between order-2 lg:order-1 space-y-7">
            
            <div className="space-y-3">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#881337] font-semibold">
                Bản Sắc & Sứ Mệnh The Inkwell
              </p>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#1C1917] leading-[1.15] tracking-tight">
                Sách Hay Vẹn Nguyên Nơi Tâm Thức
              </h1>
              
              <p className="font-serif italic text-xl sm:text-2xl text-stone-700 font-normal leading-snug">
                “Good Books Are Truly in the Heart”
              </p>

              <p className="font-sans text-xs sm:text-sm text-stone-500 uppercase tracking-[0.1em] font-medium">
                THƯ VIỆN SỐ & CỐ VẤN VĂN HỌC
              </p>
            </div>

            {/* Khối trích dẫn phong cách tạp chí biên tập (Editorial Blockquote) */}
            <blockquote className="border-l-4 border-[#881337] pl-5 py-1.5 my-2">
              <p className="font-serif italic text-base sm:text-[17px] text-stone-800 leading-[1.7]">
                “Đọc chậm giữa một thế giới luôn vội vã — đó không phải là sự thụt lùi, mà là sự trở về với những chiều sâu vĩnh cửu của tâm hồn.”
              </p>
              <footer className="text-xs uppercase tracking-[0.1em] text-stone-500 font-sans font-medium mt-3 not-italic">
                — Triết lý The Inkwell
              </footer>
            </blockquote>

            {/* Nút hành động dạng Outline viền mảnh đen, bo góc 4px */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                href="/trending" 
                className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white px-6 py-2.5 rounded-[4px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer font-sans"
              >
                <span>Khám phá các ấn phẩm</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                href="/lab" 
                className="inline-flex items-center gap-1.5 border border-stone-300 hover:border-stone-800 text-stone-700 hover:text-stone-900 px-5 py-2.5 rounded-[4px] text-xs sm:text-sm font-medium transition-colors font-sans bg-white/60"
              >
                <Sparkles size={13} className="text-[#881337]" />
                <span>Trải nghiệm AI</span>
              </Link>
            </div>

          </div>

          {/* CỘT GIỮA (Desktop: 4 cols) - Ngòi bút biểu tượng Editorial Totem */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 py-4 lg:py-0">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-full flex justify-center">
              
              {/* Ảnh ngòi bút The Inkwell với mix-blend-mode: multiply hòa vào nền trắng */}
              <img 
                src="/inkwell_editorial_totem_clean.png" 
                alt="Ngòi bút The Inkwell và Vũ trụ Sách mở" 
                style={{ mixBlendMode: "multiply" }}
                className="relative z-10 w-auto h-auto max-h-[500px] sm:max-h-[560px] lg:max-h-[620px] object-contain select-none transition-transform duration-700 hover:scale-[1.02] mix-blend-multiply"
              />
            </div>
          </div>

          {/* CỘT PHẢI (Desktop: 4 cols) - Bài viết xã luận với Drop Cap T */}
          <div className="lg:col-span-4 flex flex-col justify-start order-3 space-y-5 pt-1">
            
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-stone-500 font-sans">
                Lời ngỏ từ The Inkwell
              </p>
              <div className="w-12 h-0.5 bg-[#881337] mt-2 mb-3" />
            </div>

            {/* Bài luận xã luận chuẩn Magazine với line-height 1.7 */}
            <div className="space-y-4 text-stone-800 text-sm sm:text-[14.5px] leading-[1.7] font-serif text-left">
              <p>
                <span className="float-left text-5xl sm:text-6xl font-serif font-normal text-[#881337] mr-3 mt-1 leading-none select-none">
                  T
                </span>
                rong một chuyến tàu chiều ngập nắng, một người bạn từng ngập ngừng hỏi chúng tôi: 
                <em className="text-stone-900 font-normal"> “Giữa thời đại của những đoạn video vài giây và tin tức lướt vội, liệu còn ai đủ kiên nhẫn để lật giở từng trang của một cuốn tiểu thuyết dày?”</em>
              </p>
              
              <p>
                Câu hỏi ấy chính là lý do <strong>The Inkwell</strong> ra đời. Chúng tôi không xem sách như những món hàng tiêu thụ nhanh, mà là những chiếc cầu nối kỳ diệu giữa các thế hệ — nơi tư tưởng của những bậc hiền triết và đại thi hào vẫn âm thầm soi sáng tâm hồn con người.
              </p>
              
              <p>
                Từ giọt mực đầu tiên rơi trên đầu ngòi bút đến khi trang sách được mở ra, mỗi tác phẩm tại The Inkwell đều được chọn lọc bằng tất cả sự kính trọng. Bạn sẽ tìm thấy ở đây không chỉ là sách kinh điển, mà còn là người bạn đồng hành <strong>Mercy AI</strong> — thủ thư số tận tâm lắng nghe cảm xúc để dẫn lối bạn đến đúng cuốn sách bạn cần trong đời.
              </p>
            </div>

            {/* Lời trích mộc mạc & Chữ ký */}
            <div className="border-t border-b border-stone-200 py-3.5 my-2">
              <p className="text-xs italic text-stone-600 leading-[1.7] font-serif">
                “Mỗi cuốn sách bạn cầm trên tay là một cuộc hội ngộ đã được định sẵn qua nhiều thế kỷ.”
              </p>
            </div>

            <div className="text-right pt-1">
              <p className="font-serif italic text-xs text-stone-500">
                — Đội ngũ Giám tuyển The Inkwell
              </p>
            </div>

          </div>

        </section>

        {/* 3. THƯỚC ĐO TINH HOA (Key Milestones & Numbers) */}
        <section className="py-12 border-b border-ink/15">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Những Con Số Nói Lên Tâm Huyết
            </h2>
            <p className="text-xs sm:text-sm text-ink/60 font-sans mt-2">
              Chúng tôi cam kết gìn giữ chất lượng học thuật và trải nghiệm đọc chuẩn mực nhất.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white/70 border border-ink/10 rounded-2xl p-5 text-center shadow-xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#B12704] mb-1">
                10.000+
              </div>
              <div className="font-semibold text-xs sm:text-sm text-ink mb-1">
                Tác Phẩm Kinh Điển
              </div>
              <p className="text-[11px] text-ink/60 leading-snug">
                Tuyển chọn toàn diện từ văn học phương Tây, phương Đông đến hiện đại.
              </p>
            </div>

            <div className="bg-white/70 border border-ink/10 rounded-2xl p-5 text-center shadow-xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#B12704] mb-1">
                26+
              </div>
              <div className="font-semibold text-xs sm:text-sm text-ink mb-1">
                Chuyên Mục Thể Loại
              </div>
              <p className="text-[11px] text-ink/60 leading-snug">
                Phân loại bài bản từ Triết học, Thi ca, Tâm lý học đến Tiểu thuyết lịch sử.
              </p>
            </div>

            <div className="bg-white/70 border border-ink/10 rounded-2xl p-5 text-center shadow-xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#B12704] mb-1">
                100%
              </div>
              <div className="font-semibold text-xs sm:text-sm text-ink mb-1">
                Ấn Bản Chuẩn Mực
              </div>
              <p className="text-[11px] text-ink/60 leading-snug">
                Bìa nguyên bản độ nét cao HD, dịch thuật chính xác và giữ trọn nguyên tác.
              </p>
            </div>

            <div className="bg-white/70 border border-ink/10 rounded-2xl p-5 text-center shadow-xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#B12704] mb-1">
                0.00s
              </div>
              <div className="font-semibold text-xs sm:text-sm text-ink mb-1">
                Gợi Ý AI Tức Thì
              </div>
              <p className="text-[11px] text-ink/60 leading-snug">
                Mô hình Lai (Hybrid AI) phản hồi siêu tốc qua bộ nhớ đệm RAM thông minh.
              </p>
            </div>

          </div>
        </section>

        {/* 4. BA TRỤ CỘT TRIẾT LÝ CỦA THE INKWELL */}
        <section className="py-14 border-b border-ink/15">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#B12704] text-xs font-bold uppercase tracking-widest font-mono">
              Giá Trị Cốt Lõi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mt-1">
              Ba Trụ Cột Định Hình The Inkwell
            </h2>
            <p className="text-xs sm:text-sm text-ink/60 font-sans mt-2">
              Chúng tôi không chỉ bán sách, chúng tôi kiến tạo một ốc đảo tri thức tĩnh lặng cho độc giả hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Trụ cột 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-ink/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#B12704]/10 text-[#B12704] flex items-center justify-center mb-5">
                  <BookOpen size={22} />
                </div>
                <div className="text-xs uppercase tracking-wider font-bold text-[#B12704] mb-1">
                  Trụ Cột I
                </div>
                <h3 className="font-serif font-bold text-lg text-ink mb-3">
                  Giám Tuyển Khắt Khe
                </h3>
                <p className="text-xs sm:text-sm text-ink/70 leading-relaxed font-sans">
                  Không chạy theo thị hiếu nhất thời. Mỗi tác phẩm nằm trên kệ của The Inkwell đều trải qua quy trình thẩm định nghiêm ngặt về giá trị tư tưởng, phẩm giá nghệ thuật và chất lượng dịch thuật.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/5 text-[11px] text-ink/50 font-mono">
                ✓ Thẩm định dịch thuật • Bảo tồn nguyên tác
              </div>
            </div>

            {/* Trụ cột 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#B12704]/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#B12704] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Đột Phá
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center mb-5">
                  <Sparkles size={22} />
                </div>
                <div className="text-xs uppercase tracking-wider font-bold text-[#B12704] mb-1">
                  Trụ Cột II
                </div>
                <h3 className="font-serif font-bold text-lg text-ink mb-3">
                  Thủ Thư Số Mercy AI
                </h3>
                <p className="text-xs sm:text-sm text-ink/70 leading-relaxed font-sans">
                  Không chỉ là công cụ tìm kiếm từ khóa khô cứng. Mercy AI là vị cố vấn văn học có khả năng thấu cảm tâm trạng, phong cách đọc và chiều sâu tư tưởng để dẫn lối bạn đến đúng cuốn sách bạn cần.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/5 text-[11px] text-[#B12704] font-semibold font-mono">
                ✓ Thấu cảm cảm xúc • Giải thích lý do gợi ý
              </div>
            </div>

            {/* Trụ cột 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-ink/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center mb-5">
                  <Package size={22} />
                </div>
                <div className="text-xs uppercase tracking-wider font-bold text-emerald-800 mb-1">
                  Trụ Cột III
                </div>
                <h3 className="font-serif font-bold text-lg text-ink mb-3">
                  Mỹ Học Xúc Giác & Đóng Gói
                </h3>
                <p className="text-xs sm:text-sm text-ink/70 leading-relaxed font-sans">
                  Chúng tôi tin rằng lật giở một trang sách là một nghi thức thiêng liêng. Từng ấn bản đều được đóng gói tỉ mỉ bằng giấy mộc, chống sốc đa tầng và gửi kèm chiếc bookmark độc quyền của The Inkwell.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/5 text-[11px] text-ink/50 font-mono">
                ✓ Bookmark lụa • Hộp bảo vệ quà tặng
              </div>
            </div>

          </div>
        </section>

        {/* 5. GÓC NHÌN ĐẠI THI HÀO (Literary Echoes) */}
        <section className="py-12 border-b border-ink/15">
          <div className="bg-[#1C1917] rounded-3xl p-8 sm:p-12 text-[#FAF7F2] text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <Quote size={32} className="mx-auto text-amber-400/40 fill-amber-400/10" />
              <p className="font-serif italic text-lg sm:text-2xl leading-relaxed text-cream/95">
                “Tôi luôn tưởng tượng rằng Thiên đường sẽ là một dạng của Thư viện.”
              </p>
              <div className="w-12 h-[1px] bg-amber-400/40 mx-auto my-3" />
              <p className="text-xs uppercase tracking-widest text-amber-300/80 font-mono font-medium">
                — Jorge Luis Borges (1899 – 1986)
              </p>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION (Lời Mời Gọi Bước Vào Thế Giới Tri Thức) */}
        <section className="pt-14 pb-8 text-center max-w-xl mx-auto space-y-4">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-ink">
            Bắt Đầu Chuyến Du Hành Cùng The Inkwell
          </h3>
          <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
            Dù bạn đang tìm kiếm một cuốn sách để lắng đọng tâm tư hay muốn lắng nghe sự tư vấn từ Thủ thư số Mercy AI, cánh cửa The Inkwell luôn rộng mở chào đón bạn.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link 
              href="/" 
              className="bg-[#B12704] hover:bg-[#8e1f03] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Về Trang Chủ Khám Phá
            </Link>
            <Link 
              href="/trending" 
              className="bg-white border border-ink/20 hover:border-ink/50 text-ink px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            >
              Xem Bảng Xếp Hạng Thịnh Hành
            </Link>
          </div>
        </section>

        {/* 7. CHÂN TRANG BÁO CHÍ (Editorial Colophon) */}
        <div className="border-t border-ink/20 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink/60 gap-4">
          <p>© 2026 The Inkwell Bookstore. Tuyển tập tinh hoa tri thức & văn học nhân loại.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#B12704] transition-colors">Trang chủ</Link>
            <Link href="/trending" className="hover:text-[#B12704] transition-colors">Sách Thịnh hành</Link>
            <Link href="/lab" className="hover:text-[#B12704] transition-colors">Algorithm Lab</Link>
            <Link href="/profile" className="hover:text-[#B12704] transition-colors">Tủ sách</Link>
          </div>
        </div>

      </main>
    </div>
  );
}

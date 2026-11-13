"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Package, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#B12704] selection:text-white">
      
      {/* Top Breadcrumb Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-ink/60 hover:text-[#B12704] transition-colors font-medium group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      {/* BROADSHEET NEWSPAPER CONTAINER (Phong cách Báo / Tạp chí Văn học cổ điển) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">

        {/* 2. THE EDITORIAL CENTERPIECE (Desktop: 3-column broadsheet | Mobile: fluid editorial stack) */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">

          {/* CỘT TRÁI (Desktop: 4 cols) - Typography thơ mộng & Trích dẫn Ink Blot */}
          <div className="lg:col-span-4 flex flex-col justify-between order-2 lg:order-1 space-y-8">
            
            {/* Editorial Headline: Kết hợp Serif đậm, nghiêng, thanh thoát đúng chất nghệ thuật */}
            <div className="space-y-1">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-ink leading-[1.08] tracking-tight">
                Good Books
              </h1>
              <p className="font-serif italic text-3xl sm:text-4xl lg:text-[2.6rem] text-ink/80 font-normal leading-tight">
                Is Well and Truly
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-ink leading-tight">
                in the Heart
              </h2>
              <p className="font-serif text-lg sm:text-xl text-ink/60 pt-3">
                Will It Ever Fade?
              </p>
            </div>

            {/* Ink Blot Quote Badge (Vệt mực đen loang nghệ thuật chứa trích dẫn) */}
            <div className="relative pt-6">
              <div className="bg-[#1C1917] text-[#FAF7F2] rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden max-w-sm">
                {/* Viền mộc & hạt bụi sao */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="w-10 h-0.5 bg-amber-200/60 mb-3" />
                <p className="font-serif italic text-sm sm:text-base leading-relaxed text-cream/90">
                  "Đọc chậm giữa một thế giới luôn vội vã — đó không phải là sự thụt lùi, mà là khởi nguồn của mọi sự sâu sắc."
                </p>
                <p className="text-[11px] uppercase tracking-wider text-amber-300/80 font-semibold mt-3">
                  — Triết lý The Inkwell
                </p>
              </div>

              {/* Đốm mực trang trí nhỏ */}
              <div className="hidden sm:block absolute -bottom-3 right-6 w-3 h-3 rounded-full bg-ink/80" />
              <div className="hidden sm:block absolute -bottom-6 right-12 w-2 h-2 rounded-full bg-ink/60" />
            </div>

            {/* Nút hành động */}
            <div className="pt-2">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-[#B12704] hover:bg-[#8e1f03] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <span>Khám phá các ấn phẩm</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

          {/* CỘT GIỮA (Desktop: 4 cols) - Tác phẩm điêu khắc Ngòi bút & Vũ trụ Sách nở rộ */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 py-4 lg:py-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-full flex justify-center">
              
              {/* Ảnh ngòi bút & bàn tay mở sách siêu thực đã được bóc tách trong suốt 100% */}
              <img 
                src="/inkwell_editorial_totem_clean.png" 
                alt="Ngòi bút The Inkwell và Vũ trụ Sách mở" 
                className="w-auto h-auto max-h-[520px] sm:max-h-[600px] lg:max-h-[680px] object-contain drop-shadow-xl hover:scale-102 transition-transform duration-700 select-none pointer-events-none"
              />

              {/* Các đốm mực đen trang trí bay tự do bên cạnh ngòi bút */}
              <div className="absolute top-1/4 -right-2 sm:right-2 w-4 h-4 rounded-full bg-[#1C1917]" />
              <div className="absolute top-1/3 -right-5 sm:-right-2 w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
              <div className="absolute bottom-1/3 -left-3 sm:left-0 w-3 h-3 rounded-full bg-[#1C1917]" />
            </div>
          </div>

          {/* CỘT PHẢI (Desktop: 4 cols) - Bài viết xã luận với Drop Cap (Chữ T thụt dòng cổ điển) */}
          <div className="lg:col-span-4 flex flex-col justify-start order-3 space-y-6 pt-2">
            
            {/* Tác giả & Đường kẻ mỏng */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-ink/50">
                Lời ngỏ từ The Inkwell
              </p>
              <div className="w-12 h-0.5 bg-ink/30 mt-2 mb-4" />
            </div>

            {/* Bài luận xã luận chuẩn Magazine với DROP CAP T */}
            <div className="space-y-4 text-ink/80 text-sm leading-[1.75] font-serif text-justify">
              <p>
                <span className="float-left text-5xl sm:text-6xl font-serif font-bold text-ink mr-3 mt-1 leading-none select-none">
                  T
                </span>
                rong một chuyến tàu chiều ngập nắng, một người bạn từng ngập ngừng hỏi chúng tôi: 
                <em> "Giữa thời đại của những đoạn video vài giây và tin tức lướt vội, liệu còn ai đủ kiên nhẫn để lật giở từng trang của một cuốn tiểu thuyết dày?"</em>
              </p>
              <p>
                Câu hỏi ấy chính là lý do <strong>The Inkwell</strong> ra đời. Chúng tôi không xem sách như những món hàng hóa tiêu thụ nhanh, mà là những chiếc cầu nối kỳ diệu giữa các thế hệ, nơi tư tưởng của những bậc hiền triết và thi hào vĩ đại vẫn âm thầm soi sáng tâm hồn con người.
              </p>
              <p>
                Từ giọt mực đầu tiên rơi trên đầu ngòi bút đến khi trang sách được mở ra, mỗi tác phẩm tại The Inkwell đều được chọn lọc bằng tất cả sự kính trọng. Bạn sẽ tìm thấy ở đây không chỉ là sách kinh điển, mà còn là người bạn đồng hành <strong>Mercy AI</strong> — thủ thư số tận tâm lắng nghe cảm xúc để dẫn lối bạn đến đúng cuốn sách bạn cần trong đời.
              </p>
            </div>

            {/* Khối trích dẫn nhỏ phong cách cột báo chí */}
            <div className="border-t border-b border-ink/15 py-3 my-4">
              <p className="text-xs italic text-ink/70 leading-relaxed font-serif">
                "Mỗi cuốn sách bạn cầm trên tay là một cuộc hội ngộ đã được định sẵn qua nhiều thế kỷ."
              </p>
            </div>



          </div>

        </section>

        {/* 3. PHẦN BỐN CỘT BÁO CHÍ (4 Editorial Features — Chuẩn phong cách Tạp chí) */}
        <section className="border-t border-ink/20 pt-12 mt-16 sm:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#B12704] font-bold text-xs uppercase tracking-wider">
                <BookOpen size={16} />
                <span>01. Tuyển Chọn Tinh Hoa</span>
              </div>
              <h3 className="font-serif font-bold text-base text-ink">Bản Quyền Chính Ngạch</h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Từng tác phẩm đều qua thẩm định nghiêm ngặt về chất lượng dịch thuật, giá trị nhân văn và độ hoàn thiện của ấn bản.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#B12704] font-bold text-xs uppercase tracking-wider">
                <Sparkles size={16} />
                <span>02. Trợ Lý Mercy AI</span>
              </div>
              <h3 className="font-serif font-bold text-base text-ink">Thấu Hiểu Gu Đọc</h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Công nghệ AI phân tích cảm xúc giúp kết nối bạn với những cuốn sách đồng điệu nhất với tâm trạng hiện tại.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#B12704] font-bold text-xs uppercase tracking-wider">
                <Package size={16} />
                <span>03. Đóng Gói Thủ Công</span>
              </div>
              <h3 className="font-serif font-bold text-base text-ink">Như Một Món Quà</h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Bọc giấy kraft mộc mạc, chống sốc đa tầng và gửi kèm chiếc bookmark độc quyền mang biểu tượng The Inkwell.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#B12704] font-bold text-xs uppercase tracking-wider">
                <Heart size={16} />
                <span>04. Văn Hóa Đọc Sâu</span>
              </div>
              <h3 className="font-serif font-bold text-base text-ink">Lối Sống Chậm Rãi</h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Tạo dựng không gian tĩnh lặng, nuôi dưỡng sự tập trung và lan tỏa tình yêu sách đích thực giữa đời thường.
              </p>
            </div>

          </div>
        </section>

        {/* 4. CHÂN TRANG BÁO CHÍ (Newspaper Footer Rule) */}
        <div className="border-t-2 border-ink/40 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-ink/60 gap-4">
          <p>© 2026 The Inkwell Bookstore. Tất cả các tác phẩm được tuyển chọn và bảo lưu quyền phát hành.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#B12704] transition-colors">Trang chủ</Link>
            <Link href="/trending" className="hover:text-[#B12704] transition-colors">Sách Thịnh hành</Link>
            <Link href="/profile" className="hover:text-[#B12704] transition-colors">Tủ sách của tôi</Link>
          </div>
        </div>

      </main>
    </div>
  );
}

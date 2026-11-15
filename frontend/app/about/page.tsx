import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Package, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Về The Inkwell | Hiệu Sách Văn Học Khai Phóng",
  description: "Không gian kết hợp giữa giám tuyển văn học kinh điển và công nghệ gợi ý sách cá nhân hóa dựa trên dữ liệu Goodbooks-10k.",
  openGraph: {
    title: "Về The Inkwell | Hiệu Sách Văn Học Khai Phóng",
    description: "Giới thiệu bản sắc, sứ mệnh và tiêu chuẩn vận hành của hiệu sách The Inkwell.",
    url: "https://the-inkwel.vercel.app/about",
    siteName: "The Inkwell",
    locale: "vi_VN",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 font-sans selection:bg-[#881337] selection:text-white">
      
      {/* 1. NÚT QUAY LẠI CỬA HÀNG */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-stone-500 hover:text-[#881337] transition-colors font-medium group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-4">

        {/* 2. THE EDITORIAL CENTERPIECE */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start pb-12 border-b border-stone-200">

          {/* CỘT TRÁI: Tagline & Giới thiệu */}
          <div className="lg:col-span-4 flex flex-col justify-start order-1 lg:order-1">
            <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#881337] font-semibold mb-3.5">
              BẢN SẮC & SỨ MỆNH THE INKWELL
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#1C1917] leading-[1.2] tracking-tight mb-4">
              Không Gian Văn Học Khai Phóng & Tri Thức
            </h1>
            
            <p className="font-serif italic text-lg sm:text-xl text-stone-600 font-normal leading-relaxed mb-6">
              “Curated Literature & Intelligent Discovery”
            </p>

            <p className="text-sm text-stone-600 leading-relaxed mb-8 font-sans">
              The Inkwell tập hợp các ấn phẩm chọn lọc từ các nhà xuất bản uy tín, kết hợp cùng hệ thống gợi ý thông minh nhằm giúp bạn nhanh chóng tìm kiếm những đầu sách phù hợp với nhu cầu đọc và nghiên cứu.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                href="/trending" 
                className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white px-6 py-2.5 rounded-[4px] text-xs sm:text-sm font-medium transition-colors cursor-pointer font-sans shadow-2xs"
              >
                <span>Khám phá các ấn phẩm</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                href="/lab" 
                className="inline-flex items-center gap-1.5 border border-stone-300 hover:border-stone-800 text-stone-700 hover:text-stone-900 px-5 py-2.5 rounded-[4px] text-xs sm:text-sm font-medium transition-colors font-sans bg-white shadow-2xs"
              >
                <Sparkles size={13} className="text-[#881337]" />
                <span>Trải nghiệm AI</span>
              </Link>
            </div>
          </div>

          {/* CỘT GIỮA: Biểu tượng ngòi bút */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-2 lg:order-2 py-4 lg:py-0">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-full flex justify-center">
              <img 
                src="/inkwell_editorial_totem_clean.png" 
                alt="Ngòi bút The Inkwell và Vũ trụ Sách mở" 
                style={{ mixBlendMode: "multiply" }}
                className="relative z-10 w-auto h-auto max-h-[500px] sm:max-h-[560px] lg:max-h-[620px] object-contain select-none transition-transform duration-700 hover:scale-[1.02] mix-blend-multiply"
              />
            </div>
          </div>

          {/* CỘT PHẢI: Lời ngỏ */}
          <div className="lg:col-span-4 flex flex-col justify-start order-3 space-y-5 pt-1">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-stone-500 font-sans">
                Lời ngỏ từ The Inkwell
              </p>
              <div className="w-12 h-0.5 bg-[#881337] mt-2 mb-3" />
            </div>

            <div className="space-y-4 text-stone-800 text-sm sm:text-[14.5px] leading-[1.7] font-serif text-left">
              <p>
                The Inkwell được thành lập với mục tiêu xây dựng một không gian sách chất lượng cao, phục vụ độc giả quan tâm đến các tác phẩm văn học tư tưởng, triết học và các ấn phẩm học thuật có giá trị bền vững qua thời gian.
              </p>
              
              <p>
                Chúng tôi áp dụng quy trình chọn lọc nghiêm ngặt đối với từng tựa sách: từ việc thẩm định độ chính xác của bản dịch, tính toàn vẹn của nguyên tác cho đến tiêu chuẩn in ấn và thẩm mỹ bìa sách. Mỗi cuốn sách trên kệ đều phản ánh cam kết của chúng tôi về chất lượng nội dung.
              </p>
              
              <p>
                Bên cạnh danh mục sách truyền thống, The Inkwell tích hợp trợ lý đề xuất <strong>Mercy AI</strong> ứng dụng mô hình lai (Hybrid Recommendation System). Hệ thống phân tích sâu ngữ nghĩa và sở thích đọc cá nhân để hỗ trợ bạn tiếp cận nhanh chóng những tác phẩm phù hợp nhất với nhu cầu tìm hiểu của mình.
              </p>
            </div>
          </div>

        </section>

        {/* 3. THƯỚC ĐO DỮ LIỆU THỰC TẾ (Trung thực & Minh bạch) */}
        <section className="py-14 border-b border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#881337] font-semibold">
              DỮ LIỆU & NĂNG LỰC HỆ THỐNG
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight mt-1">
              Các Chỉ Số Kỹ Thuật Thực Tế
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans mt-2">
              Mọi con số được đo đạc và truy vấn trực tiếp từ cơ sở dữ liệu Goodbooks-10k.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white border border-stone-200/90 rounded-[4px] p-5 text-center shadow-2xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#881337] mb-1">
                10.000
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[#1C1917] mb-1">
                Tác Phẩm Chuẩn Hóa
              </div>
              <p className="text-[11px] text-stone-500 leading-snug font-sans">
                Tuyển chọn và xử lý từ tập dữ liệu văn học chuẩn hóa Goodbooks-10k.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-[4px] p-5 text-center shadow-2xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#881337] mb-1">
                20
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[#1C1917] mb-1">
                Chuyên Mục Thể Loại
              </div>
              <p className="text-[11px] text-stone-500 leading-snug font-sans">
                Phân loại bài bản từ Triết học, Hư cấu, Khoa học đến Tiểu thuyết lịch sử.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-[4px] p-5 text-center shadow-2xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#881337] mb-1">
                100%
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[#1C1917] mb-1">
                Dữ Liệu Thực Nghiệm
              </div>
              <p className="text-[11px] text-stone-500 leading-snug font-sans">
                Giữ trọn mã ISBN, số trang, năm phát hành nguyên bản không bịa số liệu.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-[4px] p-5 text-center shadow-2xs">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#881337] mb-1">
                ~35ms
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[#1C1917] mb-1">
                Độ Trễ Truy Vấn (p50)
              </div>
              <p className="text-[11px] text-stone-500 leading-snug font-sans">
                Tìm kiếm vector Cosine 768 chiều và hợp nhất thứ hạng Borda Fusion.
              </p>
            </div>

          </div>
        </section>

        {/* 4. BA TIÊU CHUẨN NỀN TẢNG TẠI THE INKWELL */}
        <section className="py-16 border-b border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#881337] text-xs font-semibold uppercase tracking-[0.15em] font-sans">
              TIÊU CHUẨN VẬN HÀNH
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C1917] tracking-tight mt-2">
              Ba Tiêu Chuẩn Nền Tảng Tại The Inkwell
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-serif italic mt-2.5 max-w-xl mx-auto leading-relaxed">
              Định hình trải nghiệm tiếp cận tri thức thông qua tuyển chọn khắt khe, công nghệ đề xuất thông minh và dịch vụ hoàn thiện ấn phẩm chuyên nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Trụ cột I */}
            <div className="bg-white border border-stone-200/90 rounded-[4px] p-6 sm:p-7 shadow-none flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div>
                <BookOpen size={28} strokeWidth={1.25} className="text-[#1C1917] mb-5" />
                <p className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.1em] mb-1.5">
                  TIÊU CHUẨN I
                </p>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] mb-3">
                  Giám Tuyển Tiêu Chuẩn Cao
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-[1.7] font-sans">
                  Mỗi tác phẩm trong danh mục The Inkwell đều trải qua quy trình đánh giá nghiêm ngặt về giá trị học thuật, tính nguyên bản và chất lượng dịch thuật. Chúng tôi ưu tiên các ấn bản có giá trị lâu dài thay vì chạy theo xu hướng nhất thời.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/80 text-[11px] text-stone-500 font-sans tracking-wide">
                Thẩm định bản quyền <span className="text-stone-300 mx-1.5">•</span> Tôn trọng nguyên tác
              </div>
            </div>

            {/* Trụ cột II */}
            <div className="bg-[#FAF7F2] border border-stone-300 rounded-[4px] p-6 sm:p-7 shadow-none flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div>
                <Sparkles size={28} strokeWidth={1.25} className="text-[#881337] mb-5" />
                <p className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.1em] mb-1.5">
                  TIÊU CHUẨN II
                </p>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] mb-3">
                  Đề Xuất Cá Nhân Hóa (Mercy AI)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-[1.7] font-sans">
                  Vượt lên các công cụ tìm kiếm từ khóa thông thường, Mercy AI ứng dụng mô hình lai (Hybrid Recommender) phân tích ngữ nghĩa và lịch sử tương tác để đề xuất chính xác các tựa sách phù hợp với phong cách đọc và nhu cầu nghiên cứu của bạn.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/80 text-[11px] text-stone-500 font-sans tracking-wide">
                Mô hình Hybrid AI <span className="text-stone-300 mx-1.5">•</span> Phân tích ngữ nghĩa
              </div>
            </div>

            {/* Trụ cột III */}
            <div className="bg-white border border-stone-200/90 rounded-[4px] p-6 sm:p-7 shadow-none flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div>
                <Package size={28} strokeWidth={1.25} className="text-[#1C1917] mb-5" />
                <p className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.1em] mb-1.5">
                  TIÊU CHUẨN III
                </p>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] mb-3">
                  Quy Chuẩn Đóng Gói & Bảo Quản
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-[1.7] font-sans">
                  Mỗi ấn bản khi xuất kho đều tuân thủ quy trình kiểm định ngoại quan, bọc chống sốc đa tầng và đóng gói hộp cứng chuyên dụng kèm thẻ đánh dấu sách (bookmark) The Inkwell, đảm bảo sách đến tay bạn trong tình trạng hoàn hảo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/80 text-[11px] text-stone-500 font-sans tracking-wide">
                Chống sốc đa tầng <span className="text-stone-300 mx-1.5">•</span> Hộp bảo vệ chuyên dụng
              </div>
            </div>

          </div>
        </section>

        {/* 5. GÓC NHÌN ĐẠI THI HÀO */}
        <section className="py-12 border-b border-stone-200">
          <div className="bg-[#1C1917] rounded-[4px] p-8 sm:p-12 text-[#FAF7F2] text-center relative overflow-hidden shadow-2xs">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <Quote size={28} className="mx-auto text-amber-400/40 fill-amber-400/10" />
              <p className="font-serif italic text-lg sm:text-2xl leading-relaxed text-[#FAF7F2]">
                “Tôi luôn tưởng tượng rằng Thiên đường sẽ là một dạng của Thư viện.”
              </p>
              <div className="w-12 h-[1px] bg-amber-400/40 mx-auto my-3" />
              <p className="text-xs uppercase tracking-widest text-amber-300/80 font-mono font-medium">
                — Jorge Luis Borges (1899 – 1986)
              </p>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION */}
        <section className="pt-14 pb-8 text-center max-w-xl mx-auto space-y-4">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1C1917]">
            Khám Phá Danh Mục Sách Tuyển Chọn
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            Dù bạn đang tìm kiếm tài liệu nghiên cứu chuyên sâu hay một tác phẩm kinh điển để thưởng thức, The Inkwell luôn sẵn sàng đồng hành cùng bạn.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link 
              href="/" 
              className="bg-[#1C1917] hover:bg-stone-800 text-white px-7 py-3 rounded-[4px] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              Về Trang Chủ Khám Phá
            </Link>
            <Link 
              href="/trending" 
              className="bg-white border border-stone-300 hover:border-stone-800 text-stone-800 px-6 py-3 rounded-[4px] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              Xem Sách Thịnh Hành
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

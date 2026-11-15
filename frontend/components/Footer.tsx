import Link from "next/link";
import { Mail, Phone, BookOpen, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] text-cream py-16 mt-20 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Cột 1 & 2: Thương hiệu The Inkwell & Sứ mệnh */}
        <div className="col-span-1 md:col-span-2 space-y-5">
          <Link href="/" className="inline-block" title="The Inkwell Bookstore">
            <img 
              src="/theinkwell_wordmark_light_transparent.png" 
              alt="The Inkwell" 
              className="h-9 sm:h-11 w-auto object-contain hover:opacity-85 transition-opacity"
            />
          </Link>
          <p className="text-stone-300 max-w-md text-sm leading-relaxed font-sans">
            Không gian văn học khai phóng kết hợp cùng Trí tuệ Nhân tạo Mercy AI. Khám phá hàng ngàn ấn phẩm tinh hoa được giám tuyển khắt khe và đóng gói chỉn chu dành riêng cho bạn.
          </p>
          
          <div className="flex items-center gap-3 pt-1">
            <a 
              href="mailto:support@theinkwell.vn" 
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#881337] text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Gửi thư đến support@theinkwell.vn"
              aria-label="Email hỗ trợ"
            >
              <Mail size={16} />
            </a>
            <Link 
              href="/contact" 
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#881337] text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Tổng đài hỗ trợ 1900 6868"
              aria-label="Hotline hỗ trợ"
            >
              <Phone size={16} />
            </Link>
            <Link 
              href="/trending" 
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#881337] text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Khám phá kho sách tuyển chọn"
              aria-label="Danh mục sách"
            >
              <BookOpen size={16} />
            </Link>
            <Link 
              href="/lab" 
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#881337] text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Phòng thí nghiệm thuật toán gợi ý sách"
              aria-label="Algorithm Lab"
            >
              <Sparkles size={16} />
            </Link>
          </div>
        </div>

        {/* Cột 3: Khám phá theo Thể loại */}
        <div>
          <h3 className="font-bold mb-6 uppercase text-xs tracking-wider text-stone-200 font-mono">
            Khám phá
          </h3>
          <ul className="space-y-3.5 text-sm text-stone-400">
            <li>
              <Link href="/trending?genre=fiction" className="hover:text-white hover:underline transition-colors block">
                Văn học hư cấu
              </Link>
            </li>
            <li>
              <Link href="/trending?genre=science-fiction" className="hover:text-white hover:underline transition-colors block">
                Khoa học viễn tưởng
              </Link>
            </li>
            <li>
              <Link href="/trending?genre=classics" className="hover:text-white hover:underline transition-colors block">
                Tác phẩm kinh điển
              </Link>
            </li>
            <li>
              <Link href="/trending?genre=self-help" className="hover:text-white hover:underline transition-colors block">
                Phát triển bản thân
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Hỗ trợ & Khách hàng */}
        <div>
          <h3 className="font-bold mb-6 uppercase text-xs tracking-wider text-stone-200 font-mono">
            Hỗ trợ
          </h3>
          <ul className="space-y-3.5 text-sm text-stone-400">
            <li>
              <Link href="/profile" className="hover:text-white hover:underline transition-colors block">
                Tài khoản của tôi
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-white hover:underline transition-colors block">
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white hover:underline transition-colors block">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white hover:underline transition-colors block">
                Về The Inkwell
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Dòng bản quyền & Điều hướng phụ chân trang */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 The Inkwell Bookstore. Mọi quyền được bảo lưu.</p>
        <div className="flex flex-wrap gap-5 text-stone-400">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <Link href="/trending" className="hover:text-white transition-colors">Sách Thịnh hành</Link>
          <Link href="/returns" className="hover:text-white transition-colors">Đổi trả &amp; Hoàn tiền</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Chăm sóc Độc giả</Link>
          <Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link>
        </div>
      </div>
    </footer>
  );
}

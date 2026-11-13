"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ShoppingBag, 
  User, 
  LogIn, 
  LogOut, 
  BookOpen, 
  ChevronDown, 
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<"categories" | "fiction" | "nonfiction" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Xử lý hover mở/đóng Mega Menu có độ trễ nhẹ để tránh giật
  const handleMouseEnter = (menuType: "categories" | "fiction" | "nonfiction") => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuType);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-ink/8 shadow-2xs">
      
      {/* 1. THANH ĐIỀU HƯỚNG CHÍNH (TOP NAV) — LOGO CĂN GIỮA HOÀN TOÀN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-20">
          
          {/* Cột trái: Hamburger menu trên Mobile & Spacer trên Desktop */}
          <div className="flex items-center flex-1 justify-start">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-ink/70 hover:text-ink hover:bg-ink/5 md:hidden cursor-pointer"
              title="Mở menu danh mục"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Cột giữa: Logo The Inkwell CĂN CHÍNH GIỮA TUYỆT ĐỐI */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <Link href="/" className="flex items-center group py-1.5" title="The Inkwell Bookstore">
              <img 
                src="/theinkwell_wordmark_transparent.png" 
                alt="The Inkwell Logo" 
                className="h-8 sm:h-9 md:h-11 w-auto max-w-[180px] sm:max-w-[220px] md:max-w-none object-contain group-hover:opacity-85 transition-opacity"
              />
            </Link>
          </div>

          {/* Cột phải: Đăng nhập / Tài khoản & Giỏ hàng */}
          <div className="flex items-center gap-3 sm:gap-4 text-ink/80 flex-1 justify-end">
            
            {/* Đăng nhập / Dropdown Tài khoản */}
            {isLoggedIn && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-ink/5 transition-colors cursor-pointer border border-ink/10"
                  title="Tài khoản độc giả"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4B6584] to-[#B12704] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-ink max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className="text-ink/40 hidden sm:inline" />
                </button>

                {/* Dropdown Menu khi đã đăng nhập */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-ink/10 py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-ink/5">
                      <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                      <p className="text-[11px] text-ink/50 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-[#FFF5F2] text-[#B12704] font-bold px-2 py-0.5 rounded-md border border-[#B12704]/20 font-mono">
                        User ID: #{user.user_id}
                      </span>
                    </div>

                    <Link 
                      href="/profile?tab=taste" 
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-ink hover:bg-[#FAF7F2] hover:text-[#B12704] transition-colors"
                    >
                      <User size={15} />
                      <span>Hồ sơ Gu đọc &amp; AI</span>
                    </Link>

                    <Link 
                      href="/profile?tab=library" 
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-ink hover:bg-[#FAF7F2] hover:text-[#B12704] transition-colors"
                    >
                      <BookOpen size={15} />
                      <span>Tủ sách cá nhân</span>
                    </Link>

                    <Link 
                      href="/cart" 
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-ink hover:bg-[#FAF7F2] hover:text-[#B12704] transition-colors"
                    >
                      <ShoppingBag size={15} />
                      <span>Giỏ hàng ({itemCount})</span>
                    </Link>

                    <div className="border-t border-ink/5 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-1.5 text-xs font-bold text-ink/90 hover:text-[#B12704] py-1.5 sm:py-2 px-3 sm:px-4 rounded-full border border-ink/20 hover:border-[#B12704] hover:bg-[#FFF5F2] transition-all cursor-pointer shadow-2xs"
                title="Đăng nhập tài khoản"
              >
                <LogIn size={15} className="text-[#B12704]" />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Giỏ hàng */}
            <Link 
              href="/cart" 
              className="hover:text-terracotta transition-colors relative block p-2 rounded-full hover:bg-ink/5 cursor-pointer"
              title="Giỏ hàng của bạn"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#4B6584] text-[#FAF7F2] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

          </div>

        </div>
      </div>

      {/* 2. THANH DANH MỤC PHỤ — TẤT CẢ TÊN MENU NẰM TRÊN 1 DÒNG, THUẦN TIẾNG VIỆT, CĂN GIỮA ĐỒNG BỘ */}
      <div className="border-t border-ink/6 bg-[#FAF7F2]/90 hidden md:block relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-center gap-7 lg:gap-8 text-xs font-semibold text-ink/80 whitespace-nowrap overflow-x-auto py-1">
            
            {/* MỤC 1: DANH MỤC SÁCH */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("categories")}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                href="/trending" 
                onClick={() => setActiveMegaMenu(null)}
                className={`flex items-center gap-1.5 py-1 tracking-wide uppercase transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeMegaMenu === "categories" 
                    ? "text-[#B12704] border-[#B12704]" 
                    : "border-transparent hover:text-[#B12704]"
                }`}
              >
                <span className="whitespace-nowrap">Danh Mục Sách</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeMegaMenu === "categories" ? "rotate-180 text-[#B12704]" : ""}`} />
              </Link>
            </div>

            {/* MỤC 2: HƯ CẤU */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("fiction")}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                href="/trending?genre=fiction" 
                onClick={() => setActiveMegaMenu(null)}
                className={`flex items-center gap-1.5 py-1 tracking-wide uppercase transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeMegaMenu === "fiction" 
                    ? "text-[#B12704] border-[#B12704]" 
                    : "border-transparent hover:text-[#B12704]"
                }`}
              >
                <span className="whitespace-nowrap">Hư Cấu</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeMegaMenu === "fiction" ? "rotate-180 text-[#B12704]" : ""}`} />
              </Link>
            </div>

            {/* MỤC 3: PHI HƯ CẤU */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("nonfiction")}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                href="/trending?genre=nonfiction" 
                onClick={() => setActiveMegaMenu(null)}
                className={`flex items-center gap-1.5 py-1 tracking-wide uppercase transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeMegaMenu === "nonfiction" 
                    ? "text-[#B12704] border-[#B12704]" 
                    : "border-transparent hover:text-[#B12704]"
                }`}
              >
                <span className="whitespace-nowrap">Phi Hư Cấu</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeMegaMenu === "nonfiction" ? "rotate-180 text-[#B12704]" : ""}`} />
              </Link>
            </div>

            {/* MỤC 4: TUỔI TRẺ & THIẾU NHI */}
            <Link 
              href="/trending?genre=young-adult" 
              className="py-2.5 uppercase tracking-wide hover:text-[#B12704] transition-colors whitespace-nowrap"
            >
              Tuổi Trẻ &amp; Thiếu Nhi
            </Link>

            {/* MỤC 5: KINH ĐIỂN */}
            <Link 
              href="/trending?genre=classics" 
              className="py-2.5 uppercase tracking-wide hover:text-[#B12704] transition-colors whitespace-nowrap"
            >
              Kinh Điển
            </Link>

            {/* MỤC 6: THỊNH HÀNH */}
            <Link 
              href="/trending" 
              className="py-2.5 uppercase tracking-wide hover:text-[#B12704] transition-colors text-[#B12704] font-bold whitespace-nowrap"
            >
              Thịnh Hành
            </Link>

            {/* MỤC 7: TỦ SÁCH */}
            <Link 
              href="/profile?tab=library" 
              className="py-2.5 uppercase tracking-wide hover:text-[#B12704] transition-colors whitespace-nowrap"
            >
              Tủ Sách
            </Link>

            {/* MỤC 8: VỀ CHÚNG TÔI */}
            <Link 
              href="/about" 
              className="py-2.5 uppercase tracking-wide hover:text-[#B12704] transition-colors whitespace-nowrap"
            >
              Về Chúng Tôi
            </Link>

            {/* MỤC 9: ALGORITHM LAB (SO SÁNH 3 THUẬT TOÁN) */}
            <Link 
              href="/lab" 
              className="py-2.5 uppercase tracking-wide hover:text-[#B12704] transition-colors whitespace-nowrap text-[#4B6584] font-bold flex items-center gap-1.5"
              title="Phòng thí nghiệm so sánh 3 thuật toán AI"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Algorithm Lab
            </Link>

          </div>

        </div>

        {/* 3. MEGA MENU DROPDOWNS — ĐÃ BỎ ICON ĐẦU VÀ BỎ TIẾNG ANH TRONG NGOẶC */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseEnter={() => {
                if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
              onClick={() => setActiveMegaMenu(null)}
              className="absolute top-full left-0 right-0 bg-[#FAF7F2] border-b border-ink/15 shadow-2xl z-50 text-left"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                
                {/* TRƯỜNG HỢP A: MEGA MENU "DANH MỤC SÁCH" */}
                {activeMegaMenu === "categories" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* CỘT 1: TUYỂN CHỌN NỔI BẬT (ĐÃ BỎ ICON ĐẦU VÀ BỎ DÒNG CHÚ THÍCH DỮ LIỆU) */}
                    <div className="space-y-4 pr-4 border-r border-ink/8">
                      <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
                        Tuyển Chọn Nổi Bật
                      </h3>
                      <ul className="space-y-2.5 text-xs text-ink/75 font-medium">
                        <li>
                          <Link href="/trending" className="hover:text-[#B12704] hover:underline flex items-center justify-between">
                            <span>Sách Thịnh Hành Nhất (Top 50)</span>
                            <span className="text-[10px] bg-[#FFF5F2] text-[#B12704] px-1.5 py-0.5 rounded font-mono font-bold">HOT</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/trending?filter=top10" className="hover:text-[#B12704] hover:underline">
                            Top 10 Tác Phẩm Bất Hủ Mọi Thời Đại
                          </Link>
                        </li>
                        <li>
                          <Link href="/trending?genre=classics" className="hover:text-[#B12704] hover:underline">
                            Tuyển Tập Văn Học Kinh Điển
                          </Link>
                        </li>
                        <li>
                          <Link href="/trending?genre=young-adult" className="hover:text-[#B12704] hover:underline">
                            Sách Dành Cho Tuổi Trẻ
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile?tab=taste" className="hover:text-[#B12704] hover:underline text-[#B12704] font-semibold">
                            Khám phá theo Gu đọc AI của bạn
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* CỘT 2: VĂN HỌC HƯ CẤU (ĐÃ BỎ ICON ĐẦU VÀ BỎ TIẾNG ANH TRONG NGOẶC) */}
                    <div className="space-y-4 pr-4 border-r border-ink/8">
                      <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
                        Văn Học Hư Cấu
                      </h3>
                      <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-ink/75 font-medium">
                        <li><Link href="/trending?genre=fantasy" className="hover:text-[#B12704] hover:underline">Kỳ Ảo</Link></li>
                        <li><Link href="/trending?genre=romance" className="hover:text-[#B12704] hover:underline">Lãng Mạn</Link></li>
                        <li><Link href="/trending?genre=mystery" className="hover:text-[#B12704] hover:underline">Trinh Thám</Link></li>
                        <li><Link href="/trending?genre=thriller" className="hover:text-[#B12704] hover:underline">Giật Gân</Link></li>
                        <li><Link href="/trending?genre=science-fiction" className="hover:text-[#B12704] hover:underline">Khoa Học Viễn Tưởng</Link></li>
                        <li><Link href="/trending?genre=historical-fiction" className="hover:text-[#B12704] hover:underline">Tiểu Thuyết Lịch Sử</Link></li>
                        <li><Link href="/trending?genre=contemporary" className="hover:text-[#B12704] hover:underline">Văn Học Đương Đại</Link></li>
                        <li><Link href="/trending?genre=crime" className="hover:text-[#B12704] hover:underline">Tội Phạm &amp; Hình Sự</Link></li>
                        <li><Link href="/trending?genre=horror" className="hover:text-[#B12704] hover:underline">Kinh Dị</Link></li>
                        <li><Link href="/trending?genre=paranormal" className="hover:text-[#B12704] hover:underline">Huyền Bí</Link></li>
                      </ul>
                    </div>

                    {/* CỘT 3: PHI HƯ CẤU & TRI THỨC (ĐÃ BỎ ICON ĐẦU VÀ BỎ TIẾNG ANH TRONG NGOẶC) */}
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
                        Phi Hư Cấu &amp; Tri Thức
                      </h3>
                      <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-ink/75 font-medium">
                        <li><Link href="/trending?genre=biography" className="hover:text-[#B12704] hover:underline">Tiểu Sử &amp; Hồi Ký</Link></li>
                        <li><Link href="/trending?genre=history" className="hover:text-[#B12704] hover:underline">Lịch Sử</Link></li>
                        <li><Link href="/trending?genre=philosophy" className="hover:text-[#B12704] hover:underline">Triết Học</Link></li>
                        <li><Link href="/trending?genre=psychology" className="hover:text-[#B12704] hover:underline">Tâm Lý Học</Link></li>
                        <li><Link href="/trending?genre=science" className="hover:text-[#B12704] hover:underline">Khoa Học Tự Nhiên</Link></li>
                        <li><Link href="/trending?genre=self-help" className="hover:text-[#B12704] hover:underline">Phát Triển Bản Thân</Link></li>
                        <li><Link href="/trending?genre=poetry" className="hover:text-[#B12704] hover:underline">Thơ Ca</Link></li>
                        <li><Link href="/trending?genre=business" className="hover:text-[#B12704] hover:underline">Kinh Doanh</Link></li>
                        <li><Link href="/trending?genre=art" className="hover:text-[#B12704] hover:underline">Nghệ Thuật &amp; Hội Họa</Link></li>
                        <li><Link href="/trending?genre=comics" className="hover:text-[#B12704] hover:underline">Truyện Tranh &amp; Manga</Link></li>
                      </ul>
                    </div>

                  </div>
                )}

                {/* TRƯỜNG HỢP B: MEGA MENU "HƯ CẤU" CHI TIẾT */}
                {activeMegaMenu === "fiction" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3 border-r border-ink/8 pr-4">
                      <h4 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">Hư Cấu Tuyển Chọn</h4>
                      <p className="text-xs text-ink/60 leading-relaxed">
                        Hơn 8.200 tác phẩm văn học hư cấu kinh điển và hiện đại từ các tác giả đoạt giải thưởng văn chương thế giới.
                      </p>
                      <Link href="/trending?genre=fiction" className="inline-block text-xs font-bold text-[#B12704] hover:underline mt-2">
                        Xem tất cả sách Hư Cấu &rarr;
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60">Kỳ Ảo &amp; Phiêu Lưu</h4>
                      <ul className="space-y-2 text-xs text-ink/75 font-medium">
                        <li><Link href="/trending?genre=fantasy" className="hover:text-[#B12704] hover:underline">Kỳ Ảo</Link></li>
                        <li><Link href="/trending?genre=science-fiction" className="hover:text-[#B12704] hover:underline">Khoa Học Viễn Tưởng</Link></li>
                        <li><Link href="/trending?genre=paranormal" className="hover:text-[#B12704] hover:underline">Siêu Nhiên &amp; Huyền Ảo</Link></li>
                        <li><Link href="/trending?genre=young-adult" className="hover:text-[#B12704] hover:underline">Thiếu Nhi &amp; Tuổi Mới Lớn</Link></li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60">Cảm Xúc &amp; Trinh Thám</h4>
                      <ul className="space-y-2 text-xs text-ink/75 font-medium">
                        <li><Link href="/trending?genre=romance" className="hover:text-[#B12704] hover:underline">Tiểu Thuyết Lãng Mạn</Link></li>
                        <li><Link href="/trending?genre=mystery" className="hover:text-[#B12704] hover:underline">Trinh Thám &amp; Phá Án</Link></li>
                        <li><Link href="/trending?genre=thriller" className="hover:text-[#B12704] hover:underline">Giật Gân &amp; Tâm Lý</Link></li>
                        <li><Link href="/trending?genre=historical-fiction" className="hover:text-[#B12704] hover:underline">Tiểu Thuyết Dã Sử</Link></li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* TRƯỜNG HỢP C: MEGA MENU "PHI HƯ CẤU" CHI TIẾT */}
                {activeMegaMenu === "nonfiction" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3 border-r border-ink/8 pr-4">
                      <h4 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">Phi Hư Cấu &amp; Chiêm Nghiệm</h4>
                      <p className="text-xs text-ink/60 leading-relaxed">
                        Các tác phẩm nghiên cứu, lịch sử, nhân học và trải nghiệm nhân sinh từ những bộ óc vĩ đại.
                      </p>
                      <Link href="/trending?genre=nonfiction" className="inline-block text-xs font-bold text-[#B12704] hover:underline mt-2">
                        Xem tất cả sách Phi Hư Cấu &rarr;
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60">Tư Tưởng &amp; Con Người</h4>
                      <ul className="space-y-2 text-xs text-ink/75 font-medium">
                        <li><Link href="/trending?genre=philosophy" className="hover:text-[#B12704] hover:underline">Triết Học &amp; Đạo Đức</Link></li>
                        <li><Link href="/trending?genre=psychology" className="hover:text-[#B12704] hover:underline">Tâm Lý Học Ứng Dụng</Link></li>
                        <li><Link href="/trending?genre=biography" className="hover:text-[#B12704] hover:underline">Tiểu Sử Doanh Nhân &amp; Vĩ Nhân</Link></li>
                        <li><Link href="/trending?genre=memoir" className="hover:text-[#B12704] hover:underline">Hồi Ký &amp; Tự Truyện</Link></li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60">Xã Hội &amp; Sáng Tạo</h4>
                      <ul className="space-y-2 text-xs text-ink/75 font-medium">
                        <li><Link href="/trending?genre=history" className="hover:text-[#B12704] hover:underline">Lịch Sử Văn Minh</Link></li>
                        <li><Link href="/trending?genre=science" className="hover:text-[#B12704] hover:underline">Khoa Học Tự Nhiên</Link></li>
                        <li><Link href="/trending?genre=self-help" className="hover:text-[#B12704] hover:underline">Phát Triển Bản Thân</Link></li>
                        <li><Link href="/trending?genre=poetry" className="hover:text-[#B12704] hover:underline">Thơ Ca &amp; Cảm Hứng</Link></li>
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 4. MOBILE DRAWER MENU (HIỂN THỊ TRÊN MÀN HÌNH NHỎ) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-ink/10 bg-[#FAF7F2] px-5 py-4 space-y-4 overflow-hidden"
          >
            <div className="space-y-2 text-sm font-semibold text-ink">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-ink/5 hover:text-[#B12704]"
              >
                Trang Chủ
              </Link>
              <Link 
                href="/trending" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-ink/5 hover:text-[#B12704] text-[#B12704]"
              >
                Sách Thịnh Hành (Top 50)
              </Link>
              <Link 
                href="/trending?genre=fiction" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-ink/5 hover:text-[#B12704]"
              >
                Văn Học Hư Cấu
              </Link>
              <Link 
                href="/trending?genre=nonfiction" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-ink/5 hover:text-[#B12704]"
              >
                Phi Hư Cấu
              </Link>
              <Link 
                href="/trending?genre=classics" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-ink/5 hover:text-[#B12704]"
              >
                Tác Phẩm Kinh Điển
              </Link>
              <Link 
                href="/profile?tab=library" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-ink/5 hover:text-[#B12704]"
              >
                Tủ Sách Cá Nhân
              </Link>
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#B12704]"
              >
                Về Chúng Tôi
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}

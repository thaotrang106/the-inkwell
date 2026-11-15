"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  BookOpen, 
  Clock, 
  Sliders, 
  Package, 
  ChevronRight, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  LogOut, 
  LogIn,
  Compass,
  ArrowRight,
  BookMarked,
  Sparkles,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DEMO_READERS } from "@/lib/demoReaders";

interface GenreDistribution {
  name: string;
  percent: number;
  colorClass: string;
}

interface SavedBook {
  id: number;
  title: string;
  author: string;
  img: string;
  status: "Đang đọc" | "Đã đọc xong" | "Muốn đọc";
  progress: number;
  rating: number;
}

interface OrderItem {
  id: string;
  date: string;
  items: string;
  total: number;
  status: string;
  statusColor: string;
}

interface ProfileMetadata {
  readCount: number;
  libraryCount: number;
  aiInteractions: number;
  tagline: string;
  genres: GenreDistribution[];
  savedBooks: SavedBook[];
  orders: OrderItem[];
}

// Bảng dữ liệu cá nhân hóa riêng biệt cho từng Độc giả chuẩn hóa
const PROFILES_BY_USER_ID: Record<number, ProfileMetadata> = {
  35: {
    readCount: 38,
    libraryCount: 26,
    aiInteractions: 54,
    tagline: "Yêu thích Harry Potter, Sử thi kỳ ảo & Thế giới phép thuật",
    genres: [
      { name: "Kỳ ảo & Giả tưởng (High Fantasy)", percent: 55, colorClass: "bg-[#881337]" },
      { name: "Thế giới Phép thuật & Thần thoại", percent: 25, colorClass: "bg-[#B12704]" },
      { name: "Văn học Cổ điển & Sử thi", percent: 12, colorClass: "bg-stone-700" },
      { name: "Thiếu nhi & Minh họa nghệ thuật", percent: 8, colorClass: "bg-amber-600" },
    ],
    savedBooks: [
      {
        id: 1,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        img: "https://images.gr-assets.com/books/1474154022l/3.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 5,
      },
      {
        id: 3,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        img: "https://images.gr-assets.com/books/1546071216l/5907.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 5,
      },
      {
        id: 4,
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        img: "https://images.gr-assets.com/books/1298411339l/34.jpg",
        status: "Đang đọc",
        progress: 68,
        rating: 5,
      },
      {
        id: 5,
        title: "The Golden Compass",
        author: "Philip Pullman",
        img: "https://images.gr-assets.com/books/1342493368l/119322.jpg",
        status: "Muốn đọc",
        progress: 0,
        rating: 4.5,
      },
    ],
    orders: [
      {
        id: "INK-98231",
        date: "24/10/2026",
        items: "Bộ Tuyển Tập Sử Thi & Kỳ Ảo Cao Cấp (4 cuốn)",
        total: 349000,
        status: "Đã giao thành công",
        statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      },
      {
        id: "INK-99104",
        date: "10/11/2026",
        items: "The Hobbit (Bìa cứng minh họa màu)",
        total: 165000,
        status: "Đang giao hàng",
        statusColor: "text-amber-700 bg-amber-50 border-amber-200",
      },
    ]
  },
  1: {
    readCount: 53,
    libraryCount: 34,
    aiInteractions: 28,
    tagline: "Yêu thích Văn học Kinh điển, Chiêm nghiệm & Triết học nhân sinh",
    genres: [
      { name: "Văn học Kinh điển & Nhân văn", percent: 60, colorClass: "bg-[#1C1917]" },
      { name: "Triết học & Đạo đức học", percent: 22, colorClass: "bg-[#881337]" },
      { name: "Lịch sử Văn minh & Xã hội", percent: 12, colorClass: "bg-stone-600" },
      { name: "Tiểu sử & Hồi ký vĩ nhân", percent: 6, colorClass: "bg-amber-600" },
    ],
    savedBooks: [
      {
        id: 6,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        img: "https://images.gr-assets.com/books/1553383690l/2657.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 5,
      },
      {
        id: 7,
        title: "1984",
        author: "George Orwell",
        img: "https://images.gr-assets.com/books/1657781256l/5470.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 5,
      },
      {
        id: 8,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        img: "https://images.gr-assets.com/books/1490528560l/4671.jpg",
        status: "Đang đọc",
        progress: 85,
        rating: 4.5,
      },
      {
        id: 10,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        img: "https://images.gr-assets.com/books/1320399351l/1885.jpg",
        status: "Muốn đọc",
        progress: 0,
        rating: 5,
      },
    ],
    orders: [
      {
        id: "INK-77120",
        date: "15/10/2026",
        items: "Tuyển Tập Văn Học Kinh Điển (5 cuốn)",
        total: 299000,
        status: "Đã giao thành công",
        statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      },
      {
        id: "INK-78401",
        date: "05/11/2026",
        items: "1984, Trại Súc Vật (Animal Farm)",
        total: 223000,
        status: "Đã giao thành công",
        statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      },
    ]
  },
  75: {
    readCount: 84,
    libraryCount: 45,
    aiInteractions: 62,
    tagline: "Yêu thích Trinh thám, Mật mã, Tâm lý tội phạm & Cốt truyện ly kỳ",
    genres: [
      { name: "Trinh thám, Mật mã & Tội phạm", percent: 58, colorClass: "bg-[#1C1917]" },
      { name: "Tâm lý học Hành vi & Pháp y", percent: 22, colorClass: "bg-[#881337]" },
      { name: "Khoa học Viễn tưởng & Gay cấn", percent: 12, colorClass: "bg-purple-900" },
      { name: "Tiểu thuyết Đương đại", percent: 8, colorClass: "bg-stone-600" },
    ],
    savedBooks: [
      {
        id: 11,
        title: "The Da Vinci Code",
        author: "Dan Brown",
        img: "https://images.gr-assets.com/books/1579621267l/968.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 5,
      },
      {
        id: 12,
        title: "Angels & Demons",
        author: "Dan Brown",
        img: "https://images.gr-assets.com/books/1584633425l/960.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 4.5,
      },
      {
        id: 13,
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        img: "https://images.gr-assets.com/books/1684638853l/2429135.jpg",
        status: "Đang đọc",
        progress: 74,
        rating: 5,
      },
      {
        id: 14,
        title: "The Silence of the Lambs",
        author: "Thomas Harris",
        img: "https://images.gr-assets.com/books/1390426249l/23807.jpg",
        status: "Muốn đọc",
        progress: 0,
        rating: 5,
      },
    ],
    orders: [
      {
        id: "INK-66512",
        date: "02/10/2026",
        items: "The Da Vinci Code, Angels & Demons",
        total: 320000,
        status: "Đã giao thành công",
        statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      },
      {
        id: "INK-67890",
        date: "08/11/2026",
        items: "Bộ Sách Khám Phá & Tri Thức (8 cuốn)",
        total: 399000,
        status: "Đang giao hàng",
        statusColor: "text-amber-700 bg-amber-50 border-amber-200",
      },
    ]
  },
  102: {
    readCount: 45,
    libraryCount: 20,
    aiInteractions: 36,
    tagline: "Yêu thích Khoa học Viễn tưởng, Không-thời gian & Xã hội tương lai",
    genres: [
      { name: "Khoa học Viễn tưởng (Sci-Fi)", percent: 62, colorClass: "bg-[#1C1917]" },
      { name: "Dystopia & Xã hội học", percent: 20, colorClass: "bg-[#881337]" },
      { name: "Bách khoa Tri thức & Vũ trụ", percent: 12, colorClass: "bg-blue-900" },
      { name: "Công nghệ & Tương lai", percent: 6, colorClass: "bg-stone-600" },
    ],
    savedBooks: [
      {
        id: 15,
        title: "Dune (Xứ Cát)",
        author: "Frank Herbert",
        img: "https://images.gr-assets.com/books/1555447414l/44767458.jpg",
        status: "Đang đọc",
        progress: 55,
        rating: 5,
      },
      {
        id: 7,
        title: "1984",
        author: "George Orwell",
        img: "https://images.gr-assets.com/books/1657781256l/5470.jpg",
        status: "Đã đọc xong",
        progress: 100,
        rating: 5,
      },
    ],
    orders: [
      {
        id: "INK-55201",
        date: "28/10/2026",
        items: "Xứ Cát (Dune) & Vũ Trụ Cosmos",
        total: 310000,
        status: "Đã giao thành công",
        statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      },
    ]
  }
};

const DEFAULT_GUEST_PROFILE: ProfileMetadata = {
  readCount: 0,
  libraryCount: 0,
  aiInteractions: 0,
  tagline: "Chưa có đủ lịch sử tương tác để phân tích gu thẩm mỹ",
  genres: [],
  savedBooks: [],
  orders: []
};

export default function ProfilePage() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"taste" | "library" | "orders">("taste");
  const [hybridRatio, setHybridRatio] = useState(50); // 50% Nội dung - 50% Cộng đồng

  // Đọc tham số ?tab= từ URL
  useEffect(() => {
    const handleTabFromUrl = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "library") {
          setActiveTab("library");
        } else if (tab === "orders") {
          setActiveTab("orders");
        } else if (tab === "taste") {
          setActiveTab("taste");
        }
      }
    };

    handleTabFromUrl();
    window.addEventListener("popstate", handleTabFromUrl);
    return () => window.removeEventListener("popstate", handleTabFromUrl);
  }, []);

  const switchTab = (tab: "taste" | "library" | "orders") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Xác định hồ sơ độc giả theo tài khoản hiện tại
  const currentUserId = user?.user_id;
  const currentProfileData: ProfileMetadata = currentUserId && PROFILES_BY_USER_ID[currentUserId]
    ? PROFILES_BY_USER_ID[currentUserId]
    : user
    ? {
        readCount: 12,
        libraryCount: 8,
        aiInteractions: 15,
        tagline: "Độc giả yêu thích văn học tư tưởng và sách tuyển chọn",
        genres: [
          { name: "Văn học Hư cấu & Kinh điển", percent: 50, colorClass: "bg-[#1C1917]" },
          { name: "Triết học & Tư tưởng", percent: 30, colorClass: "bg-[#881337]" },
          { name: "Khoa học & Đời sống", percent: 20, colorClass: "bg-stone-600" },
        ],
        savedBooks: PROFILES_BY_USER_ID[1].savedBooks.slice(0, 2),
        orders: []
      }
    : DEFAULT_GUEST_PROFILE;

  const displayName = user
    ? user.name.replace(/\s*\(\s*#\d+\s*\)/g, "").replace(/^Độc giả\s+/i, "Độc giả ")
    : "Độc giả Khách";

  const displayTier = user
    ? (user.tier || "Thành viên Thân thiết")
    : "Khách Vãng Lai";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 pb-24 text-[#1C1917] font-sans selection:bg-[#881337] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xs sm:text-sm text-stone-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#881337] transition-colors flex items-center gap-1.5 font-medium">
              <ArrowLeft size={14} /> Trang chủ
            </Link>
            <ChevronRight size={13} className="text-stone-300" />
            <span className="text-[#1C1917] font-medium">Hồ sơ độc giả</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white border border-stone-200 px-3 py-1 rounded-full text-stone-600 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck size={14} className="text-emerald-700" /> 
              <span>Tài khoản đã xác thực</span>
            </span>
          </div>
        </div>

        {/* 2. User Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xs border border-stone-200/90 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar chữ cái đầu */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#1C1917] to-[#881337] flex items-center justify-center text-white shadow-md text-2xl sm:text-3xl font-serif font-bold">
                {user ? displayName.replace(/^Độc giả\s+/i, "").charAt(0).toUpperCase() : "K"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-[#1C1917] p-1.5 rounded-full shadow-xs" title="Thành viên The Inkwell">
                <Award size={16} />
              </div>
            </div>

            {/* Thông tin chính & Thống kê */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
                    {displayName}
                  </h1>
                  <p className="text-stone-500 text-xs sm:text-sm font-sans mt-0.5">
                    {user ? user.email : "guest@theinkwell.vn"} • <span className="italic">{currentProfileData.tagline}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#881337]/30 rounded-full text-[#881337] text-xs font-serif font-semibold tracking-wide shadow-2xs">
                    <Award size={13} />
                    <span>{displayTier}</span>
                  </div>

                  {isLoggedIn ? (
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:border-stone-400 rounded-full text-xs font-sans text-stone-600 hover:text-[#1C1917] transition-colors cursor-pointer bg-white"
                      title="Đăng xuất tài khoản"
                    >
                      <LogOut size={13} />
                      <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1C1917] text-white hover:bg-stone-800 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer"
                    >
                      <LogIn size={13} />
                      <span>Đăng nhập</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Thống kê nhanh độc giả */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100 max-w-md">
                <div className="text-center sm:text-left">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Đã đọc</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
                    {currentProfileData.readCount} <span className="text-xs font-sans font-normal text-stone-400">cuốn</span>
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Tủ sách</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
                    {currentProfileData.libraryCount} <span className="text-xs font-sans font-normal text-stone-400">tác phẩm</span>
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Tương tác AI</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#881337] mt-0.5">
                    {currentProfileData.aiInteractions} <span className="text-xs font-sans font-normal text-[#881337]/60">lần</span>
                  </p>
                </div>
              </div>

              {/* Thanh chuyển nhanh hồ sơ mẫu để kiểm thử trải nghiệm */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans">
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Xem thử các gu đọc khác:</span>
                {DEMO_READERS.map((r) => {
                  const isCurrent = user?.user_id === r.user_id;
                  return (
                    <button
                      key={r.user_id}
                      onClick={() => login({ user_id: r.user_id, name: r.name, email: r.email, tier: r.tier })}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                        isCurrent 
                          ? "bg-[#1C1917] text-white" 
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {r.shortName} ({r.genre.replace(/^Gu\s+/i, "")})
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </motion.div>

        {/* 3. Tab Controls */}
        <div className="flex border-b border-stone-200 mb-8 gap-6 overflow-x-auto pb-1">
          <button
            onClick={() => switchTab("taste")}
            className={`pb-3 font-medium text-xs sm:text-sm transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "taste" ? "text-[#881337] font-semibold" : "text-stone-500 hover:text-[#1C1917]"
            }`}
          >
            <Compass size={16} strokeWidth={1.5} />
            <span>Hồ sơ Gu đọc &amp; Sở thích</span>
            {activeTab === "taste" && (
              <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#881337]" />
            )}
          </button>

          <button
            onClick={() => switchTab("library")}
            className={`pb-3 font-medium text-xs sm:text-sm transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "library" ? "text-[#881337] font-semibold" : "text-stone-500 hover:text-[#1C1917]"
            }`}
          >
            <BookMarked size={16} strokeWidth={1.5} />
            <span>Tủ sách cá nhân ({currentProfileData.savedBooks.length})</span>
            {activeTab === "library" && (
              <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#881337]" />
            )}
          </button>

          <button
            onClick={() => switchTab("orders")}
            className={`pb-3 font-medium text-xs sm:text-sm transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "orders" ? "text-[#881337] font-semibold" : "text-stone-500 hover:text-[#1C1917]"
            }`}
          >
            <Package size={16} strokeWidth={1.5} />
            <span>Đơn hàng của tôi ({currentProfileData.orders.length})</span>
            {activeTab === "orders" && (
              <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#881337]" />
            )}
          </button>
        </div>

        {/* 4. NỘI DUNG TỪNG TAB */}

        {/* TAB 1: Hồ sơ Gu đọc & Điều chỉnh hướng tiếp cận gợi ý */}
        {activeTab === "taste" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Cột trái: Bản đồ Thể loại cá nhân hóa theo từng độc giả */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#881337] font-semibold block mb-1">
                  PHÂN TÍCH GU ĐỌC
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight">
                  Bản Đồ Thể Loại Bạn Quan Tâm Nhất
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1.5 leading-relaxed font-sans">
                  Dựa trên các tác phẩm bạn đã đọc, đánh giá tích cực và lưu vào tủ sách, hệ thống phác họa phân bổ gu thẩm mỹ văn học của riêng bạn:
                </p>
              </div>

              {currentProfileData.genres.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {currentProfileData.genres.map((g, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs sm:text-sm mb-1.5 font-medium">
                        <span className="text-[#1C1917] font-serif">{g.name}</span>
                        <span className="text-stone-800 font-mono font-bold">{g.percent}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className={`${g.colorClass} h-full rounded-full transition-all duration-700`} style={{ width: `${g.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-stone-50 rounded-xl p-6 border border-stone-200/60">
                  <BookOpen size={28} className="mx-auto text-stone-400 mb-2" />
                  <h4 className="font-serif text-base font-bold text-[#1C1917] mb-1">Chưa Đủ Dữ Liệu Gu Đọc</h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto mb-4">
                    Hãy lưu các tác phẩm bạn yêu thích hoặc trò chuyện cùng Thủ thư Mercy AI để bắt đầu xây dựng bản đồ gu đọc độc bản.
                  </p>
                  <Link 
                    href="/trending" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1917] text-white text-xs font-medium rounded-[4px] hover:bg-stone-800 transition-colors"
                  >
                    <span>Khám phá kho sách Thịnh Hành</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* Cột phải: Tùy chỉnh Hướng tiếp cận gợi ý (Thay thế thuật ngữ AI khô cứng) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#881337] font-semibold block mb-1">
                  ĐIỀU CHỈNH TRẢI NGHIỆM
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight mb-1.5">
                  Tùy Chỉnh Hướng Gợi Ý Sách
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-sans">
                  Bạn có thể chủ động cân đối xem hệ thống sẽ ưu tiên gợi ý các tác phẩm có nét tương đồng cao về phong cách cốt truyện hay mở rộng theo thị hiếu từ bạn đọc cùng gu.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-xs font-mono font-semibold text-stone-600 uppercase">
                    <span>Nội dung cốt truyện ({100 - hybridRatio}%)</span>
                    <span>Cộng đồng cùng gu ({hybridRatio}%)</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={hybridRatio}
                    onChange={(e) => setHybridRatio(Number(e.target.value))}
                    className="w-full accent-[#881337] cursor-pointer"
                  />
                  
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/80 text-xs text-stone-700 flex items-start gap-3">
                    <Compass size={18} strokeWidth={1.5} className="text-[#881337] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {hybridRatio === 50 
                        ? "Chế độ Cân bằng hoàn hảo: Kết hợp hài hòa giữa chiều sâu tác phẩm và sở thích cộng đồng bạn đọc." 
                        : hybridRatio > 50 
                        ? "Đang ưu tiên các tác phẩm được đông đảo độc giả tương đồng gu đọc đánh giá cao nhất." 
                        : "Đang ưu tiên các tác phẩm có nét tương đồng cao nhất về phong cách hành văn và chủ đề văn học."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 text-center">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white px-6 py-2.5 rounded-[4px] text-xs font-medium transition-all shadow-2xs"
                >
                  <span>Áp dụng &amp; Khám phá trang chủ</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Tủ sách cá nhân (Động theo từng Độc giả) */}
        {activeTab === "library" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentProfileData.savedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProfileData.savedBooks.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="aspect-[2/3] rounded-[4px] overflow-hidden mb-3 bg-stone-100 shadow-2xs">
                        <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] inline-block mb-2 border ${
                        b.status === "Đang đọc" 
                          ? "bg-blue-50 text-blue-800 border-blue-200" 
                          : b.status === "Đã đọc xong" 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                          : "bg-stone-100 text-stone-700 border-stone-200"
                      }`}>
                        {b.status}
                      </span>
                      <h4 className="font-serif font-bold text-[#1C1917] text-sm line-clamp-1">{b.title}</h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{b.author}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <Link href={`/books/${b.id}`} className="text-[#881337] hover:underline font-medium text-xs">
                        Xem chi tiết &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-lg mx-auto">
                <BookMarked size={36} className="mx-auto text-stone-300 mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1">Tủ Sách Chưa Có Tác Phẩm Nào</h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Bạn có thể lưu các tác phẩm yêu thích khi duyệt qua kho sách để theo dõi tiến độ đọc và quản lý bộ sưu tập cá nhân.
                </p>
                <Link href="/trending" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-[4px] hover:bg-stone-800 transition-colors">
                  <span>Khám phá kho sách ngay</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: Đơn hàng của tôi (Động theo từng Độc giả) */}
        {activeTab === "orders" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {currentProfileData.orders.length > 0 ? (
              currentProfileData.orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#1C1917] text-sm sm:text-base">#{order.id}</span>
                      <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-medium border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">Ngày đặt hàng: {order.date}</p>
                    <p className="text-xs sm:text-sm text-[#1C1917] font-medium font-serif">{order.items}</p>
                  </div>

                  <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Tổng thanh toán</p>
                    <p className="font-serif font-black text-base sm:text-lg text-[#881337]">{formatPrice(order.total)}</p>
                    <button className="text-xs text-stone-600 hover:text-[#1C1917] hover:underline font-medium cursor-pointer">
                      Xem chi tiết đơn hàng &rarr;
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-lg mx-auto">
                <Package size={36} className="mx-auto text-stone-300 mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1">Chưa Có Đơn Hàng Nào</h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Khi bạn mua combo hoặc sách lẻ tại The Inkwell, thông tin đóng gói và vận chuyển sẽ được lưu trữ tại đây.
                </p>
                <Link href="/combos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-[4px] hover:bg-stone-800 transition-colors">
                  <span>Khám phá các combo ưu đãi</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  BookOpen, 
  Clock, 
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
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

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
  tagline: string;
  favoriteAuthors: string[];
  readingHabit: string;
  genres: GenreDistribution[];
  savedBooks: SavedBook[];
  orders: OrderItem[];
}

// Bảng dữ liệu cá nhân hóa riêng biệt cho từng Độc giả
const PROFILES_BY_USER_ID: Record<number, ProfileMetadata> = {
  35: {
    readCount: 38,
    libraryCount: 26,
    tagline: "Độc giả yêu thích văn học kỳ ảo, sử thi và thế giới thần thoại",
    favoriteAuthors: ["J.K. Rowling", "J.R.R. Tolkien", "Philip Pullman", "C.S. Lewis"],
    readingHabit: "Đọc 3-4 tác phẩm/tháng • Ưa chuộng ấn bản bìa cứng có minh họa",
    genres: [
      { name: "Kỳ ảo & Giả tưởng", percent: 55, colorClass: "bg-[#881337]" },
      { name: "Thần thoại & Sử thi", percent: 25, colorClass: "bg-stone-800" },
      { name: "Văn học Cổ điển", percent: 12, colorClass: "bg-stone-600" },
      { name: "Nghệ thuật & Thiếu nhi", percent: 8, colorClass: "bg-stone-400" },
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
    tagline: "Độc giả đam mê văn học kinh điển, triết học hiện sinh và tư tưởng nhân loại",
    favoriteAuthors: ["Harper Lee", "George Orwell", "F. Scott Fitzgerald", "Jane Austen"],
    readingHabit: "Đọc 4-5 tác phẩm/tháng • Chú trọng bản dịch trung thành nguyên tác",
    genres: [
      { name: "Văn học Kinh điển", percent: 60, colorClass: "bg-[#1C1917]" },
      { name: "Triết học & Nhân sinh", percent: 22, colorClass: "bg-[#881337]" },
      { name: "Lịch sử Văn minh", percent: 12, colorClass: "bg-stone-600" },
      { name: "Hồi ký & Tiểu sử", percent: 6, colorClass: "bg-stone-400" },
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
    tagline: "Độc giả yêu thích tiểu thuyết trinh thám, mật mã và tâm lý học tội phạm",
    favoriteAuthors: ["Dan Brown", "Stieg Larsson", "Thomas Harris", "Gillian Flynn"],
    readingHabit: "Đọc 6-8 tác phẩm/tháng • Theo dõi sát sao các series trinh thám Bắc Âu",
    genres: [
      { name: "Trinh thám & Mật mã", percent: 58, colorClass: "bg-[#1C1917]" },
      { name: "Tâm lý học Hành vi", percent: 22, colorClass: "bg-[#881337]" },
      { name: "Khoa học & Gay cấn", percent: 12, colorClass: "bg-stone-600" },
      { name: "Tiểu thuyết Đương đại", percent: 8, colorClass: "bg-stone-400" },
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
    tagline: "Độc giả quan tâm đến khoa học viễn tưởng, không gian và xã hội tương lai",
    favoriteAuthors: ["Frank Herbert", "George Orwell", "Arthur C. Clarke", "Isaac Asimov"],
    readingHabit: "Đọc 3-4 tác phẩm/tháng • Say mê các vũ trụ hư cấu quy mô lớn",
    genres: [
      { name: "Khoa học Viễn tưởng", percent: 62, colorClass: "bg-[#1C1917]" },
      { name: "Xã hội học Tương lai", percent: 20, colorClass: "bg-[#881337]" },
      { name: "Vũ trụ & Thiên văn", percent: 12, colorClass: "bg-stone-600" },
      { name: "Công nghệ Tri thức", percent: 6, colorClass: "bg-stone-400" },
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
  tagline: "Đăng nhập để lưu trữ tủ sách và theo dõi các đơn hàng của bạn",
  favoriteAuthors: [],
  readingHabit: "Chưa có thông tin",
  genres: [],
  savedBooks: [],
  orders: []
};

export default function ProfilePage() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"library" | "orders" | "taste">("library");

  // Đọc tham số ?tab= từ URL
  useEffect(() => {
    const handleTabFromUrl = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "taste") {
          setActiveTab("taste");
        } else if (tab === "orders") {
          setActiveTab("orders");
        } else if (tab === "library") {
          setActiveTab("library");
        }
      }
    };

    handleTabFromUrl();
    window.addEventListener("popstate", handleTabFromUrl);
    return () => window.removeEventListener("popstate", handleTabFromUrl);
  }, []);

  const switchTab = (tab: "library" | "orders" | "taste") => {
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
        tagline: "Độc giả yêu thích văn học tư tưởng và các ấn phẩm kinh điển",
        favoriteAuthors: ["Harper Lee", "George Orwell"],
        readingHabit: "Đọc 2-3 tác phẩm/tháng",
        genres: [
          { name: "Văn học Kinh điển", percent: 50, colorClass: "bg-[#1C1917]" },
          { name: "Triết học Tư tưởng", percent: 30, colorClass: "bg-[#881337]" },
          { name: "Khoa học Đời sống", percent: 20, colorClass: "bg-stone-600" },
        ],
        savedBooks: PROFILES_BY_USER_ID[1].savedBooks.slice(0, 2),
        orders: []
      }
    : DEFAULT_GUEST_PROFILE;

  const displayName = user
    ? user.name.replace(/\s*\(\s*#\d+\s*\)/g, "").replace(/^Độc giả\s+/i, "")
    : "Khách Đọc Sách";

  const displayTier = user
    ? (user.tier || "Thành viên Thân thiết")
    : "Chưa Đăng Nhập";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 pb-24 text-[#1C1917] font-sans selection:bg-[#881337] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Thanh điều hướng quay lại */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xs sm:text-sm text-stone-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#881337] transition-colors flex items-center gap-1.5 font-medium">
              <ArrowLeft size={14} /> Trang chủ
            </Link>
            <ChevronRight size={13} className="text-stone-300" />
            <span className="text-[#1C1917] font-medium">Tài khoản độc giả</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white border border-stone-200 px-3 py-1 rounded-[3px] text-stone-600 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-700" /> 
              <span>Tài khoản The Inkwell</span>
            </span>
          </div>
        </div>

        {/* 2. Thẻ thông tin cá nhân (Phong cách Biên tập phẳng mộc mạc) */}
        <header className="bg-white rounded-[4px] p-6 sm:p-8 border border-stone-300/80 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Chữ cái đầu Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1C1917] flex items-center justify-center text-white text-xl sm:text-2xl font-serif font-bold shrink-0">
              {user ? displayName.charAt(0).toUpperCase() : "K"}
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 text-center sm:text-left space-y-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
                    {displayName}
                  </h1>
                  <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                    {user ? user.email : "guest@theinkwell.vn"} • <span className="text-stone-600">{currentProfileData.tagline}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <span className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-[3px] text-stone-700 text-xs font-medium">
                    {displayTier}
                  </span>

                  {isLoggedIn ? (
                    <button
                      onClick={logout}
                      className="px-3 py-1 border border-stone-200 hover:border-stone-400 rounded-[3px] text-xs font-sans text-stone-600 hover:text-[#1C1917] transition-colors cursor-pointer bg-white"
                      title="Đăng xuất tài khoản"
                    >
                      Đăng xuất
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="px-4 py-1 bg-[#1C1917] text-white hover:bg-stone-800 rounded-[3px] text-xs font-medium transition-colors cursor-pointer"
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>

              {/* Thống kê bạn đọc thực tế (Đã đọc, Tủ sách, Đơn hàng) */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-stone-100 max-w-sm">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Đã đọc</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
                    {currentProfileData.readCount} <span className="text-xs font-sans font-normal text-stone-400">cuốn</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Tủ sách</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
                    {currentProfileData.libraryCount} <span className="text-xs font-sans font-normal text-stone-400">tác phẩm</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Đơn hàng</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#881337] mt-0.5">
                    {currentProfileData.orders.length} <span className="text-xs font-sans font-normal text-[#881337]/70">đơn</span>
                  </p>
                </div>
              </div>


            </div>
          </div>
        </header>

        {/* 3. Thanh Tab điều hướng nội dung */}
        <div className="flex border-b border-stone-300 mb-8 gap-8 overflow-x-auto pb-1 text-xs sm:text-sm">
          <button
            onClick={() => switchTab("library")}
            className={`pb-3 font-medium transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "library" ? "text-[#881337] font-semibold" : "text-stone-500 hover:text-[#1C1917]"
            }`}
          >
            <BookMarked size={15} strokeWidth={1.5} />
            <span>Tủ sách cá nhân ({currentProfileData.savedBooks.length})</span>
            {activeTab === "library" && (
              <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#881337]" />
            )}
          </button>

          <button
            onClick={() => switchTab("orders")}
            className={`pb-3 font-medium transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "orders" ? "text-[#881337] font-semibold" : "text-stone-500 hover:text-[#1C1917]"
            }`}
          >
            <Package size={15} strokeWidth={1.5} />
            <span>Đơn hàng của tôi ({currentProfileData.orders.length})</span>
            {activeTab === "orders" && (
              <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#881337]" />
            )}
          </button>

          <button
            onClick={() => switchTab("taste")}
            className={`pb-3 font-medium transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "taste" ? "text-[#881337] font-semibold" : "text-stone-500 hover:text-[#1C1917]"
            }`}
          >
            <Compass size={15} strokeWidth={1.5} />
            <span>Gu đọc &amp; Sở thích</span>
            {activeTab === "taste" && (
              <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#881337]" />
            )}
          </button>
        </div>

        {/* 4. NỘI DUNG TỪNG TAB */}

        {/* TAB 1: TỦ SÁCH CÁ NHÂN */}
        {activeTab === "library" && (
          <div>
            {currentProfileData.savedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProfileData.savedBooks.map((b) => (
                  <div key={b.id} className="bg-white rounded-[4px] p-4 border border-stone-300/80 flex flex-col justify-between">
                    <div>
                      <div className="aspect-[2/3] rounded-[2px] overflow-hidden mb-3 bg-stone-100">
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
                        Chi tiết &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[4px] p-12 text-center border border-stone-300/80 max-w-lg mx-auto">
                <BookMarked size={36} className="mx-auto text-stone-300 mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1">Tủ sách chưa có tác phẩm</h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Bạn có thể lưu các tựa sách quan tâm trong quá trình duyệt danh mục để thuận tiện theo dõi và lên kế hoạch đọc.
                </p>
                <Link href="/trending" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-[3px] hover:bg-stone-800 transition-colors">
                  <span>Khám phá kho sách ngay</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ĐƠN HÀNG CỦA TÔI */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {currentProfileData.orders.length > 0 ? (
              currentProfileData.orders.map((order) => (
                <div key={order.id} className="bg-white rounded-[4px] p-6 border border-stone-300/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#1C1917] text-sm sm:text-base">#{order.id}</span>
                      <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-[3px] font-medium border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">Ngày đặt hàng: {order.date}</p>
                    <p className="text-xs sm:text-sm text-[#1C1917] font-medium font-serif mt-1">{order.items}</p>
                  </div>

                  <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Tổng thanh toán</p>
                    <p className="font-serif font-bold text-base sm:text-lg text-[#881337]">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-[4px] p-12 text-center border border-stone-300/80 max-w-lg mx-auto">
                <Package size={36} className="mx-auto text-stone-300 mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1">Chưa có đơn hàng nào</h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Khi bạn mua sách tại The Inkwell, lịch sử đặt mua và lộ trình giao nhận sẽ xuất hiện tại đây.
                </p>
                <Link href="/combos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-[3px] hover:bg-stone-800 transition-colors">
                  <span>Xem các combo sách ưu đãi</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GU ĐỌC & SỞ THÍCH */}
        {activeTab === "taste" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột trái: Phân bổ thể loại */}
            <div className="lg:col-span-7 bg-white rounded-[4px] p-6 sm:p-8 border border-stone-300/80 space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#881337] font-semibold block mb-1">
                  SỞ THÍCH VĂN HỌC
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight">
                  Bản Đồ Thể Loại Bạn Đọc Nhiều Nhất
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Tổng hợp từ danh mục sách bạn đã đọc và lưu vào tủ sách cá nhân:
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
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`${g.colorClass} h-full rounded-full`} style={{ width: `${g.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-stone-50 rounded-[4px] p-6 border border-stone-200">
                  <BookOpen size={28} className="mx-auto text-stone-400 mb-2" />
                  <h4 className="font-serif text-base font-bold text-[#1C1917] mb-1">Chưa đủ dữ liệu sở thích</h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto mb-4">
                    Hãy lưu các tác phẩm yêu thích để bắt đầu phác họa thói quen đọc sách của bạn.
                  </p>
                  <Link 
                    href="/trending" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1917] text-white text-xs font-medium rounded-[3px] hover:bg-stone-800 transition-colors"
                  >
                    <span>Xem kho sách thịnh hành</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* Cột phải: Tác giả tâm đắc & Thói quen đọc sách */}
            <div className="lg:col-span-5 bg-white rounded-[4px] p-6 sm:p-8 border border-stone-300/80 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#881337] font-semibold block mb-1">
                    GHI CHÚ ĐỌC SÁCH
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight mb-2">
                    Tác Giả &amp; Thói Quen Tâm Đắc
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Những gương mặt tác giả xuất hiện thường xuyên nhất trong tủ sách của bạn:
                  </p>
                </div>

                <div className="space-y-2">
                  {currentProfileData.favoriteAuthors.map((author, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2 bg-[#FAF7F2] rounded-[3px] border border-stone-200/70 text-xs">
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-serif font-bold text-stone-900">{author}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Thói quen đọc
                  </p>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {currentProfileData.readingHabit}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 text-center">
                <Link 
                  href="/trending"
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white px-5 py-2 rounded-[3px] text-xs font-medium transition-colors"
                >
                  <span>Khám phá thêm sách cùng gu</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  BookOpen, 
  Heart, 
  Clock, 
  Sparkles, 
  Sliders, 
  Package, 
  Settings, 
  ChevronRight, 
  Star, 
  ArrowLeft, 
  CheckCircle2,
  Mail,
  ShieldCheck,
  Award,
  LogOut,
  LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"taste" | "library" | "orders">("taste");
  const [hybridRatio, setHybridRatio] = useState(50); // 50% Nội dung - 50% Cộng đồng

  // Đọc tham số ?tab= từ URL để mở trực tiếp đúng tab (VD: ?tab=library mở ngay Tủ sách cá nhân)
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

  // Dữ liệu sách mô phỏng trong tủ sách cá nhân
  const savedBooks = [
    {
      id: 1,
      title: "The Hunger Games",
      author: "Suzanne Collins",
      img: "https://images.gr-assets.com/books/1447303603m/2767052.jpg",
      status: "Đang đọc",
      progress: 68,
      rating: 5,
    },
    {
      id: 2,
      title: "Harry Potter and the Order of the Phoenix",
      author: "J.K. Rowling",
      img: "https://images.gr-assets.com/books/1546910265m/2.jpg",
      status: "Đã đọc xong",
      progress: 100,
      rating: 5,
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      img: "https://images.gr-assets.com/books/1553383690m/2657.jpg",
      status: "Muốn đọc",
      progress: 0,
      rating: 4.5,
    },
    {
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      img: "https://images.gr-assets.com/books/1490528560m/4671.jpg",
      status: "Đã đọc xong",
      progress: 100,
      rating: 4,
    },
  ];

  // Dữ liệu đơn hàng mô phỏng
  const mockOrders = [
    {
      id: "INK-98231",
      date: "24/10/2026",
      items: "The Hunger Games, Dune",
      total: 310000,
      status: "Đang giao hàng",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "INK-88412",
      date: "12/10/2026",
      items: "Harry Potter and the Sorcerer's Stone",
      total: 185000,
      status: "Đã giao thành công",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Nút Quay lại */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-ink/60 flex items-center gap-2">
            <Link href="/" className="hover:text-ink transition-colors flex items-center gap-1">
              <ArrowLeft size={16} /> Trang chủ
            </Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium">Hồ sơ độc giả</span>
          </div>
          <span className="text-xs bg-ink/5 border border-ink/10 px-3 py-1 rounded-full text-ink/60 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" /> Tài khoản đã xác thực
          </span>
        </div>

        {/* User Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-ink/10 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#4B6584] to-[#B12704] flex items-center justify-center text-white shadow-lg text-3xl font-serif font-bold">
                {user ? user.name.charAt(0).toUpperCase() : "T"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-ink p-1.5 rounded-full shadow-md" title="Độc giả thân thiết">
                <Award size={18} />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                    {user ? user.name : "Độc giả The Inkwell"}
                  </h1>
                  <p className="text-ink/60 text-sm flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Mail size={14} /> {user ? user.email : "reader@theinkwell.vn"} • {user ? `User ID: #${user.user_id}` : "Tài khoản Khách"}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF5F2] border border-[#B12704]/30 rounded-xl text-[#B12704] text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} /> {user ? (user.tier || `Độc giả #${user.user_id}`) : "Độc giả Khách"}
                  </div>
                  {isLoggedIn ? (
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-ink/15 hover:border-rose-400 hover:text-rose-600 rounded-xl text-xs font-semibold text-ink/70 transition-colors cursor-pointer"
                      title="Đăng xuất tài khoản"
                    >
                      <LogOut size={14} />
                      <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#B12704] text-white hover:bg-[#8e1f03] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <LogIn size={14} />
                      <span>Đăng nhập</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Thống kê nhanh */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ink/5 mt-4 max-w-md">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-ink/50 uppercase font-semibold">Đã đọc</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-ink">24 <span className="text-xs font-sans font-normal text-ink/60">cuốn</span></p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-ink/50 uppercase font-semibold">Tủ sách</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-ink">18 <span className="text-xs font-sans font-normal text-ink/60">tác phẩm</span></p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-ink/50 uppercase font-semibold">Tương tác AI</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#B12704]">42 <span className="text-xs font-sans font-normal text-[#B12704]/70">lần</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Controls */}
        <div className="flex border-b border-ink/10 mb-8 gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => switchTab("taste")}
            className={`pb-3 px-2 font-medium text-sm transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "taste" ? "text-[#B12704] font-bold" : "text-ink/60 hover:text-ink"
            }`}
          >
            <Sparkles size={16} /> Hồ sơ Gu đọc & AI
            {activeTab === "taste" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B12704]" />
            )}
          </button>

          <button
            onClick={() => switchTab("library")}
            className={`pb-3 px-2 font-medium text-sm transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "library" ? "text-[#B12704] font-bold" : "text-ink/60 hover:text-ink"
            }`}
          >
            <BookOpen size={16} /> Tủ sách cá nhân
            {activeTab === "library" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B12704]" />
            )}
          </button>

          <button
            onClick={() => switchTab("orders")}
            className={`pb-3 px-2 font-medium text-sm transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "orders" ? "text-[#B12704] font-bold" : "text-ink/60 hover:text-ink"
            }`}
          >
            <Package size={16} /> Đơn hàng của tôi
            {activeTab === "orders" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B12704]" />
            )}
          </button>
        </div>

        {/* TAB 1: Gu đọc & Cài đặt AI */}
        {activeTab === "taste" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Phân bổ thể loại */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                <BookOpen size={20} className="text-[#4B6584]" />
                Bản đồ Thể loại bạn quan tâm nhất
              </h3>
              <p className="text-ink/60 text-sm">
                Thuật toán của Mercy dựa trên lịch sử tương tác và đánh giá để phác họa gu thẩm mỹ của bạn:
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-ink">Văn học Hư cấu & Kinh điển</span>
                    <span className="text-[#4B6584] font-bold">45%</span>
                  </div>
                  <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#4B6584] h-full rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-ink">Trinh thám & Bí ẩn gay cấn</span>
                    <span className="text-[#B12704] font-bold">30%</span>
                  </div>
                  <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#B12704] h-full rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-ink">Khoa học Viễn tưởng (Sci-Fi / Dystopia)</span>
                    <span className="text-purple-600 font-bold">15%</span>
                  </div>
                  <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-ink">Tâm lý & Phát triển bản thân</span>
                    <span className="text-amber-600 font-bold">10%</span>
                  </div>
                  <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Điều khiển Thuật toán Hybrid */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2 mb-2">
                  <Sliders size={20} className="text-[#B12704]" />
                  Tùy chỉnh Trọng số AI Hybrid
                </h3>
                <p className="text-ink/60 text-xs leading-relaxed">
                  Bạn có thể chủ động điều chỉnh xem thuật toán sẽ ưu tiên gợi ý sách dựa trên cốt truyện văn phong (Semantic Content) hay xu hướng cộng đồng cùng gu (Collaborative Filtering).
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-ink/70 uppercase">
                    <span>Nội dung cốt truyện ({100 - hybridRatio}%)</span>
                    <span>Cộng đồng độc giả ({hybridRatio}%)</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={hybridRatio}
                    onChange={(e) => setHybridRatio(Number(e.target.value))}
                    className="w-full accent-[#B12704] cursor-pointer"
                  />
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-ink/5 text-xs text-ink/80 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#B12704] shrink-0" />
                    <span>
                      {hybridRatio === 50 
                        ? "Chế độ Cân bằng hoàn hảo giữa cốt truyện sâu sắc và sở thích bạn đọc chung." 
                        : hybridRatio > 50 
                        ? "Đang ưu tiên các tác phẩm được đông đảo độc giả tương đồng đánh giá cao." 
                        : "Đang ưu tiên các tác phẩm có nét tương đồng cao nhất về phong cách văn học."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/10 text-center">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#4B6584] hover:bg-[#3d546f] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
                >
                  Áp dụng & Khám phá sách ngay
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Tủ sách cá nhân */}
        {activeTab === "library" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {savedBooks.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-4 border border-ink/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-ink/5 shadow-xs">
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2 ${
                    b.status === "Đang đọc" 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : b.status === "Đã đọc xong" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {b.status}
                  </span>
                  <h4 className="font-serif font-bold text-ink text-base line-clamp-1">{b.title}</h4>
                  <p className="text-xs text-ink/60 line-clamp-1">{b.author}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-xs">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                  <Link href={`/books/${b.id}`} className="text-[#007185] hover:underline font-medium">
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 3: Đơn hàng */}
        {activeTab === "orders" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-ink text-base">#{order.id}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink/50">Ngày đặt hàng: {order.date}</p>
                  <p className="text-sm text-ink font-medium">{order.items}</p>
                </div>

                <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-ink/5">
                  <p className="text-xs text-ink/50">Tổng thanh toán</p>
                  <p className="font-bold text-lg text-[#B12704]">{formatPrice(order.total)}</p>
                  <button className="text-xs text-[#007185] hover:underline font-medium cursor-pointer">
                    Xem chi tiết hóa đơn
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
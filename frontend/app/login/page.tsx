"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft,
  Users,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, user: currentUser } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("reader@theinkwell.vn");
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("Độc giả The Inkwell");
  const [selectedUserId, setSelectedUserId] = useState<number>(35);
  const [customUserId, setCustomUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Danh sách các user mẫu có dữ liệu rating thực tế trong database
  const demoUsers = [
    {
      id: 35,
      name: "Độc giả Minh Anh (User #35)",
      email: "minhanh@theinkwell.vn",
      tier: "Độc giả Uyên Bác",
      ratings: "112 đánh giá",
      favGenre: "Giả tưởng & Harry Potter",
    },
    {
      id: 1,
      name: "Độc giả Hoàng Nam (User #1)",
      email: "hoangnam@theinkwell.vn",
      tier: "Thành viên Thân thiết",
      ratings: "53 đánh giá",
      favGenre: "Văn học Kinh điển & Triết học",
    },
    {
      id: 75,
      name: "Độc giả Thu Trang (User #75)",
      email: "thutrang@theinkwell.vn",
      tier: "Độc giả Tinh hoa",
      ratings: "84 đánh giá",
      favGenre: "Trinh thám & Bí ẩn",
    },
    {
      id: 102,
      name: "Độc giả Tuấn Kiệt (User #102)",
      email: "tuankiet@theinkwell.vn",
      tier: "Thành viên Mới",
      ratings: "45 đánh giá",
      favGenre: "Khoa học Viễn tưởng & Dystopia",
    },
  ];

  // Nếu đã đăng nhập, cho phép người dùng quay lại trang chủ hoặc chuyển tài khoản
  useEffect(() => {
    if (isLoggedIn && !successMessage) {
      // Đã có user đăng nhập
    }
  }, [isLoggedIn]);

  // Xử lý đăng nhập Form Email & Password
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login({
        user_id: selectedUserId || 35,
        name: mode === "register" ? name : "Độc giả The Inkwell",
        email: email,
        tier: "Thành viên Thân thiết",
      });
      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      setIsSubmitting(false);
    }, 600);
  };

  // Xử lý đăng nhập 1-click bằng User Demo GoodReads
  const handleDemoUserLogin = (demoUser: typeof demoUsers[0]) => {
    setIsSubmitting(true);
    setSelectedUserId(demoUser.id);
    
    setTimeout(() => {
      login({
        user_id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        tier: demoUser.tier,
      });
      setSuccessMessage(`Đã đăng nhập với tư cách ${demoUser.name}!`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
      setIsSubmitting(false);
    }, 400);
  };

  // Xử lý nhập User ID tùy ý
  const handleCustomUserIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(customUserId);
    if (isNaN(idNum) || idNum <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      login({
        user_id: idNum,
        name: `Độc giả #${idNum}`,
        email: `user${idNum}@theinkwell.vn`,
        tier: "Độc giả Đồ án",
      });
      setSuccessMessage(`Đã đăng nhập thành công với User ID #${idNum}!`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 flex flex-col justify-center relative overflow-hidden">
      
      {/* Nền trang trí */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Nút quay lại */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Quay lại Trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT 1: Form Đăng nhập / Đăng ký tiêu chuẩn (7 cột) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-ink/10 relative">
            
            {/* Header Form */}
            <div className="text-center sm:text-left mb-8">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#B12704] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} /> The Inkwell Membership
              </div>
              <h1 className="font-serif text-3xl font-bold text-ink">
                {mode === "login" ? "Chào mừng bạn trở lại" : "Tạo tài khoản Độc giả"}
              </h1>
              <p className="text-ink/60 text-sm mt-1.5">
                {mode === "login" 
                  ? "Đăng nhập để nhận danh sách gợi ý sách cá nhân hóa theo đúng gu đọc của bạn."
                  : "Khám phá thế giới văn chương cùng Cố vấn AI Mercy thông minh."}
              </p>
            </div>

            {/* Thông báo thành công */}
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-medium"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab chuyển Đăng nhập / Đăng ký */}
            <div className="flex bg-[#FAF7F2] p-1 rounded-2xl mb-6 border border-ink/5">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === "login" ? "bg-white text-ink shadow-xs" : "text-ink/60 hover:text-ink"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === "register" ? "bg-white text-ink shadow-xs" : "text-ink/60 hover:text-ink"
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1.5 uppercase tracking-wider">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-ink/10 rounded-xl text-sm focus:outline-none focus:border-[#B12704] text-ink"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1.5 uppercase tracking-wider">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-ink/10 rounded-xl text-sm focus:outline-none focus:border-[#B12704] text-ink"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-ink/70 uppercase tracking-wider">
                    Mật khẩu
                  </label>
                  {mode === "login" && (
                    <a href="#" className="text-xs text-[#007185] hover:underline font-medium">
                      Quên mật khẩu?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-ink/10 rounded-xl text-sm focus:outline-none focus:border-[#B12704] text-ink"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  defaultChecked 
                  className="rounded accent-[#B12704] cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-ink/70 cursor-pointer">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#4B6584] hover:bg-[#3d546f] text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{mode === "login" ? "Đăng nhập ngay" : "Tạo tài khoản"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* CỘT 2: Đăng nhập Demo Nhanh theo Dữ liệu GoodReads (5 cột) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-ink/10 space-y-4">
              <div className="flex items-center gap-2 text-[#B12704] text-xs font-bold uppercase tracking-wider">
                <Users size={16} /> Dành cho Hội đồng & Demo Đồ án
              </div>
              <h3 className="font-serif text-xl font-bold text-ink">
                Đăng nhập 1-Click theo User Dataset
              </h3>
              <p className="text-xs text-ink/60 leading-relaxed">
                Hệ thống lưu trữ lịch sử đánh giá thực tế của hàng ngàn độc giả GoodReads. Chọn nhanh một tài khoản bên dưới để kiểm tra thuật toán gợi ý cá nhân hóa:
              </p>

              {/* Danh sách User Demo */}
              <div className="space-y-2.5 pt-1">
                {demoUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleDemoUserLogin(u)}
                    className="p-3.5 rounded-2xl border border-ink/10 hover:border-[#B12704] hover:bg-[#FFF5F2] transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink group-hover:text-[#B12704] transition-colors">
                          {u.name}
                        </span>
                        <span className="text-[10px] bg-ink/5 px-2 py-0.5 rounded-full font-mono text-ink/60">
                          #{u.id}
                        </span>
                      </div>
                      <p className="text-xs text-ink/50">
                        {u.ratings} • <span className="text-[#4B6584] font-medium">{u.favGenre}</span>
                      </p>
                    </div>

                    <button 
                      type="button"
                      className="text-xs font-bold bg-white group-hover:bg-[#B12704] text-ink group-hover:text-white px-3 py-1.5 rounded-lg border border-ink/10 group-hover:border-transparent transition-all shadow-2xs"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>

              {/* Nhập ID tùy biến */}
              <form onSubmit={handleCustomUserIdLogin} className="pt-3 border-t border-ink/5">
                <label className="block text-[11px] font-bold text-ink/60 mb-1.5 uppercase">
                  Hoặc nhập User ID bất kỳ:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="VD: 15, 42, 88..."
                    value={customUserId}
                    onChange={(e) => setCustomUserId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-ink/10 rounded-xl text-xs focus:outline-none focus:border-[#B12704] text-ink"
                  />
                  <button
                    type="submit"
                    disabled={!customUserId}
                    className="px-4 py-2 bg-ink text-white rounded-xl text-xs font-bold hover:bg-ink/80 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Đăng nhập ID
                  </button>
                </div>
              </form>
            </div>

            {/* Ghi chú đồ án */}
            <div className="bg-[#FFF8F0] border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
              <ShieldCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý học thuật:</strong> Khi đăng nhập với bất kỳ User ID nào, trang chủ sẽ tự động gọi thuật toán <code>get_for_you(user_id)</code> để kết hợp vector tâm điểm và lọc cộng đồng Ochiai tương ứng.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
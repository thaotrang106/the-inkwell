"use client";

import { useState } from "react";
import { Users, ChevronDown, Check, X, Sparkles, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DEMO_READERS } from "@/lib/demoReaders";

export default function DemoFloatingSwitcher() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentReader = DEMO_READERS.find((r) => r.user_id === user?.user_id);

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-40 bg-[#1C1917]/90 hover:bg-[#1C1917] text-white p-2.5 rounded-full shadow-lg border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 font-sans text-xs"
        title="Mở bảng điều khiển Độc giả mẫu (Đồ án tốt nghiệp)"
      >
        <GraduationCap size={16} className="text-amber-300" />
        <span className="hidden sm:inline text-[11px] font-medium pr-1">Demo Đồ án</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 font-sans">
      <div className="relative">
        {/* Thanh điều khiển nổi ở góc dưới */}
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-stone-300/90 hover:border-stone-400 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-1 pr-2 transition-all">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1 text-xs text-stone-800 cursor-pointer select-none"
          >
            <div className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center shrink-0">
              <GraduationCap size={12} />
            </div>
            <div className="flex items-center gap-1.5 text-left">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold hidden sm:inline">
                Hồ sơ thử nghiệm:
              </span>
              <span className="text-xs font-bold text-stone-900">
                {currentReader ? currentReader.shortName : "Khách vãng lai"}
              </span>
            </div>
            <ChevronDown size={13} className={`text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Nút thu nhỏ lại góc */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors ml-0.5 cursor-pointer"
            title="Thu nhỏ bảng điều khiển demo"
          >
            <X size={13} />
          </button>
        </div>

        {/* Dropdown Menu chọn Độc giả mẫu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-12 left-0 w-80 sm:w-88 bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden z-50 text-left"
            >
              <div className="px-3.5 py-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#881337]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600">
                    HỒ SƠ ĐỘC GIẢ MẪU
                  </span>
                </div>
                <span className="text-[10px] text-[#881337] font-bold font-mono">Báo cáo Đồ án</span>
              </div>

              <div className="p-1.5 space-y-1">
                {DEMO_READERS.map((reader) => {
                  const isSelected = isLoggedIn && user?.user_id === reader.user_id;
                  return (
                    <button
                      key={reader.user_id}
                      type="button"
                      onClick={() => {
                        login({
                          user_id: reader.user_id,
                          name: reader.name,
                          email: reader.email,
                          tier: reader.tier,
                        });
                        setIsOpen(false);
                        setTimeout(() => {
                          const el = document.getElementById("personalized-section");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 120);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg hover:bg-stone-50 transition-colors flex items-start justify-between cursor-pointer group ${
                        isSelected ? "bg-rose-50/70 border border-[#881337]/20" : "border border-transparent"
                      }`}
                    >
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-[#881337] transition-colors">
                            {reader.name}
                          </span>
                          <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">
                            #{reader.user_id}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#881337] font-medium mt-0.5">
                          {reader.genre}
                        </p>
                        <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                          {reader.tagline}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-[#881337] mt-1 shrink-0">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Khách vãng lai / Cold-Start */}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg hover:bg-stone-50 transition-colors flex items-start justify-between cursor-pointer group ${
                    !isLoggedIn ? "bg-rose-50/70 border border-[#881337]/20" : "border border-transparent"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-stone-800">
                      Khách vãng lai (Chưa đăng nhập)
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Thử nghiệm bài toán Cold-Start (Hiện Sách Thịnh Hành)
                    </p>
                  </div>
                  {!isLoggedIn && (
                    <span className="text-[#881337] mt-1 shrink-0">
                      <Check size={14} />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

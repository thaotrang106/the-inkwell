"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMercy } from "@/context/MercyContext";

export default function MercyFloatingButton() {
  const { isOpen, openMercy } = useMercy();
  const [showTooltip, setShowTooltip] = useState(true);

  // Ẩn nút nổi khi bảng chat đang mở để tránh che khuất giao diện
  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans flex flex-col items-end">
      {/* Tooltip gợi ý nhỏ tinh tế phía trên nút (có thể đóng bằng dấu x) */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="mb-2 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-stone-200/90 text-stone-800 text-[11px] py-1.5 pl-3 pr-2 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] select-none"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-stone-600">Cần tư vấn chọn sách?</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Đóng gợi ý"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút bấm nổi chính Hỏi Mercy AI */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => openMercy()}
        className="group flex items-center gap-2.5 bg-[#1C1917] hover:bg-[#881337] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-[0_6px_20px_rgba(28,25,23,0.25)] border border-white/10 transition-colors duration-300 cursor-pointer"
        title="Mở trợ lý tư vấn sách Mercy AI"
        aria-label="Tư vấn sách cùng Mercy AI"
      >
        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0 text-amber-300 group-hover:rotate-12 transition-transform">
          <Sparkles size={13} className="fill-amber-300/30" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-wider text-stone-300 font-mono leading-none">
            Trợ lý AI
          </span>
          <span className="text-xs font-bold text-white tracking-tight leading-tight mt-0.5">
            Hỏi Mercy AI
          </span>
        </div>
      </motion.button>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, RotateCcw, Send, Loader2, BookOpen } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Message {
  role: "user" | "mercy";
  content: string;
}

interface MercyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hàm hỗ trợ format Markdown thành HTML hiển thị đẹp mắt (không còn hiện dấu ### hay **)
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  const parseInlineBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-2.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Thay thế "Phân tích:" thành "Tóm tắt:" nếu có
        trimmed = trimmed.replace(/Phân tích\s*:/i, "Tóm tắt:");

        // Xóa dấu gạch đầu dòng hoặc dấu sao thô ở đầu dòng
        trimmed = trimmed.replace(/^[\*\-]\s+(?=\*\*|Tóm tắt:)/i, "");

        // Nếu là dòng Tên sách in đậm
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <div key={idx} className="pt-2">
              <h4 className="font-bold text-ink text-sm sm:text-base leading-snug">
                {parseInlineBold(trimmed)}
              </h4>
            </div>
          );
        }

        // Nếu là dòng Tóm tắt:
        if (trimmed.startsWith("Tóm tắt:")) {
          const rest = trimmed.slice(8).trim();
          return (
            <p key={idx} className="text-ink/80 text-sm leading-relaxed pl-0 my-1">
              <strong className="font-bold text-[#B12704]">Tóm tắt: </strong>
              {parseInlineBold(rest)}
            </p>
          );
        }

        // Tiêu đề dạng ### hoặc ##
        const headerMatch = trimmed.match(/^#{1,4}\s+(.*)/);
        if (headerMatch) {
          return (
            <h4 key={idx} className="font-bold text-[#B12704] text-sm mt-3 pt-1 border-t border-ink/5">
              {parseInlineBold(headerMatch[1])}
            </h4>
          );
        }

        return <p key={idx}>{parseInlineBold(trimmed)}</p>;
      })}
    </div>
  );
}

export default function MercyChatDrawer({ isOpen, onClose }: MercyChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Làm mới cuộc trò chuyện (New Chat)
  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  // Gửi tin nhắn đến API
  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/mercy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      const mercyReply = data.reply || "Xin lỗi, tôi chưa thể trả lời lúc này.";
      setMessages((prev) => [...prev, { role: "mercy", content: mercyReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "mercy",
          content: "Không thể kết nối đến máy chủ cố vấn Mercy. Xin vui lòng kiểm tra lại Backend.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Các câu hỏi mẫu gợi ý
  const samplePrompts = [
    "Một cuốn tiểu thuyết trinh thám gay cấn có plot twist bất ngờ",
    "Một tác phẩm sinh tồn kịch tính giống The Hunger Games",
    "Sách chữa lành tâm hồn, câu chữ nhẹ nhàng và sâu lắng",
    "Một câu chuyện tình yêu kinh điển nhưng đầy trắc trở",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Lớp nền mờ tối (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Bảng Chat trượt từ cạnh phải (Slide-over Drawer) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-ink/10"
          >
            {/* 1. Header màu đỏ/terracotta phong cách Book Outlet */}
            <div className="bg-[#B12704] text-white px-5 py-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2 font-medium tracking-wide">
                <Sparkles size={18} className="text-amber-200 fill-amber-200" />
                <span className="font-semibold text-base">Cố vấn Văn học Mercy AI (Beta)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNewChat}
                  className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm border border-white/40 hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Đoạn chat mới</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* 2. Khung trò chuyện (Chat Body) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm bg-[#FAF8F5]">
              {/* Lời chào khởi đầu nếu chưa có tin nhắn */}
              {messages.length === 0 && (
                <div className="space-y-4 pt-4 text-ink/80 leading-relaxed font-sans">
                  <p className="text-base font-serif text-ink font-medium leading-relaxed">
                    "Chào bạn. Tôi là Mercy — Chuyên gia Giám tuyển và Cố vấn Văn học của The Inkwell. Hãy chia sẻ chủ đề, trường phái hoặc thể loại tác phẩm bạn đang quan tâm. Tôi sẽ chọn lọc và đưa ra các đề xuất tiêu biểu kèm góc nhìn phân tích học thuật sâu sắc nhất."
                  </p>

                  <p className="text-xs font-bold uppercase tracking-wider text-ink/50 pt-2">
                    Gợi ý câu hỏi để thử:
                  </p>
                  <div className="space-y-2">
                    {samplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left p-3 rounded-xl bg-white border border-ink/10 text-ink/80 hover:border-[#B12704] hover:text-[#B12704] hover:bg-[#FFF8F5] transition-all text-xs font-medium shadow-xs flex items-center justify-between group cursor-pointer"
                      >
                        <span>"{prompt}"</span>
                        <Sparkles size={14} className="opacity-0 group-hover:opacity-100 text-[#B12704] transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lịch sử tin nhắn */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl leading-relaxed shadow-xs ${
                      msg.role === "user"
                        ? "bg-[#232F3E] text-white rounded-tr-xs"
                        : "bg-white text-ink border border-ink/10 rounded-tl-xs font-sans text-sm"
                    }`}
                  >
                    {msg.role === "mercy" ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#B12704] mb-2.5 pb-1.5 border-b border-ink/5">
                          <BookOpen size={13} />
                          <span>Nhận định và Đề xuất từ Mercy:</span>
                        </div>
                        <FormattedMessage content={msg.content} />
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Hiệu ứng đang suy nghĩ */}
              {isLoading && (
                <div className="flex items-center gap-2 text-ink/50 text-xs italic bg-white border border-ink/5 p-3 rounded-2xl w-fit">
                  <Loader2 size={15} className="animate-spin text-[#B12704]" />
                  <span>Mercy đang tra cứu và tổng hợp phân tích học thuật...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 3. Khung nhập tin nhắn (Footer) */}
            <div className="p-4 bg-white border-t border-ink/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mô tả cuốn sách bạn đang tìm kiếm..."
                  className="flex-1 px-4 py-3 rounded-lg border border-ink/20 focus:outline-none focus:border-[#B12704] text-sm text-ink placeholder:text-ink/40"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-black hover:bg-ink/80 text-white px-5 py-3 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              <p className="text-[11px] text-ink/40 text-center mt-2.5">
                Kết quả do AI tạo ra. Hãy tham khảo và khám phá theo cách của bạn.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

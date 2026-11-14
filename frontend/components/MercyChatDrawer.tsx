"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Send, Loader2, BookOpen, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export interface BookRecommendation {
  book_id: number;
  title: string;
  author?: string;
  image_url?: string;
  isbn?: string;
  matched_text?: string;
}

interface Message {
  role: "user" | "mercy";
  content: string;
  books?: BookRecommendation[];
}

interface MercyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hàm làm sạch tên sách
const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

// Định dạng URL ảnh sách chuẩn CDN độ nét cao HD (Large Cover) & tự động dự phòng sang Open Library qua ISBN
const formatImageUrl = (url?: string, isbn?: string) => {
  if (!url || url.includes("nophoto")) {
    if (isbn) {
      const cleanIsbn = String(isbn).trim().replace(/^0+/, "");
      const paddedIsbn = cleanIsbn.length === 9 ? "0" + cleanIsbn : cleanIsbn;
      if (paddedIsbn.length >= 10) {
        return `https://covers.openlibrary.org/b/isbn/${paddedIsbn}-L.jpg`;
      }
    }
    return "";
  }
  let clean = url.trim();
  clean = clean.replace(/^http:\/\//i, "https://");
  if (clean.includes("openlibrary.org")) return clean;
  clean = clean.replace(/:\/\/(?:imagei|s)\.gr-assets\.com/i, "://images.gr-assets.com");
  clean = clean.replace(/(\d+)[ms]\//i, "$1l/");
  return clean;
};

// Component thẻ đề xuất sách của Mercy AI kèm link chuyển hướng trực tiếp đến trang sản phẩm
function MercyBookItem({
  rawTitle,
  summary,
  matchedBook,
  onClose,
}: {
  rawTitle: string;
  summary: string;
  matchedBook?: BookRecommendation;
  onClose: () => void;
}) {
  const [book, setBook] = useState<BookRecommendation | null>(matchedBook || null);

  // Tách tên tiếng Anh để làm từ khóa tìm kiếm nếu chưa có matchedBook
  const cleanEnglishTitle = rawTitle.replace(/\(.*?\)/g, "").replace(/[-—].*$/, "").replace(/\*/g, "").trim();
  const authorFromTitle = rawTitle.includes("—") 
    ? rawTitle.split("—")[1]?.trim() 
    : rawTitle.includes("-") 
      ? rawTitle.split("-")[1]?.trim() 
      : "";

  useEffect(() => {
    if (matchedBook) {
      setBook(matchedBook);
      return;
    }
    if (!cleanEnglishTitle || cleanEnglishTitle.length < 2) return;

    // Tra cứu nhanh API nếu backend chưa trả kèm book
    let isCancelled = false;
    fetch(`${API_BASE_URL}/api/books/search?q=${encodeURIComponent(cleanEnglishTitle)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isCancelled && json.data && json.data.length > 0) {
          const first = json.data[0];
          setBook({
            book_id: first.book_id,
            title: first.title,
            author: first.author || authorFromTitle,
            image_url: first.image_url,
          });
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [matchedBook, cleanEnglishTitle, authorFromTitle]);

  const targetHref = book?.book_id 
    ? `/books/${book.book_id}` 
    : `/trending?search=${encodeURIComponent(cleanEnglishTitle)}`;

  const handleBookClick = () => {
    if (book) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify(book));
        } catch {}
      }
    }
    onClose();
  };

  return (
    <div className="pt-2.5 my-2.5 border-b border-stone-200/70 pb-3 last:border-b-0">
      {/* 1. Tiêu đề sách có link bấm trực tiếp */}
      <Link
        href={targetHref}
        onClick={handleBookClick}
        className="group inline-flex items-start gap-1.5 text-stone-900 hover:text-[#881337] transition-colors"
      >
        <h4 className="font-serif font-bold text-sm sm:text-base leading-snug group-hover:underline decoration-stone-300">
          {rawTitle}
        </h4>
        <ArrowUpRight size={14} className="shrink-0 text-stone-400 group-hover:text-[#881337] transition-colors mt-0.5" />
      </Link>

      {/* 2. Đoạn văn tóm tắt & phân tích */}
      {summary && (
        <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mt-1.5 font-sans">
          <strong className="font-semibold text-[#881337]">Tóm tắt: </strong>
          {renderFormattedInline(summary, book ? [book] : undefined, onClose)}
        </p>
      )}

      {/* 3. Thẻ liên kết chuyển thẳng tới trang sản phẩm (Product Action Card) */}
      <Link
        href={targetHref}
        onClick={handleBookClick}
        className="mt-3 flex items-center justify-between p-2.5 sm:p-3 rounded-[6px] bg-[#FAF9F6] hover:bg-white border border-stone-200 hover:border-stone-400 hover:shadow-xs transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          {book?.image_url || book?.isbn ? (
            <img
              src={formatImageUrl(book.image_url, book.isbn)}
              alt={book.title || rawTitle}
              className="w-8 h-12 object-cover rounded-[3px] shadow-2xs shrink-0 bg-stone-100 border border-stone-200/80"
              onError={(e) => {
                if (book.isbn && !e.currentTarget.src.includes("openlibrary.org")) {
                  const cleanIsbn = String(book.isbn).trim();
                  const padded = cleanIsbn.length === 9 ? "0" + cleanIsbn : cleanIsbn;
                  e.currentTarget.src = `https://covers.openlibrary.org/b/isbn/${padded}-L.jpg`;
                } else {
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
          ) : (
            <div className="w-8 h-12 rounded-[3px] bg-[#1C1917] text-amber-200 flex items-center justify-center font-mono text-[8px] shrink-0 border border-stone-200">
              INK
            </div>
          )}
          <div className="min-w-0">
            <div className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#881337] transition-colors truncate">
              {book?.title ? cleanTitle(book.title) : cleanEnglishTitle}
            </div>
            <div className="text-[11px] text-stone-500 truncate font-sans">
              {book?.author || authorFromTitle || "The Inkwell Collection"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 group-hover:text-[#881337] bg-white group-hover:bg-stone-50 border border-stone-300 group-hover:border-stone-400 px-3 py-1.5 rounded-[4px] shadow-2xs shrink-0 font-sans transition-all ml-2">
          <span>Xem tác phẩm</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </div>
  );
}

// Helper phân tích các thẻ Markdown nội dòng (**in đậm**, *in nghiêng*, `code`) và tự động gắn link sách nếu có
function renderFormattedInline(
  rawText: string,
  books?: BookRecommendation[],
  onClose?: () => void
) {
  if (!rawText) return null;

  // Tách text theo các phần in đậm (**...**) hoặc in nghiêng (*...* hoặc _..._) hoặc mã (`...`)
  const tokens = rawText.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*|_[^_]+?_|`[^`]+?`)/g);

  return (
    <span>
      {tokens.map((token, idx) => {
        if (!token) return null;

        // Xử lý in đậm **...**
        if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
          const inner = token.slice(2, -2).trim();

          // Kiểm tra xem cụm in đậm có trùng với tên cuốn sách nào trong danh sách books không
          const cleanKey = inner.toLowerCase().replace(/\(.*?\)/g, "").replace(/[-—].*$/, "").trim();
          const matched = books?.find((b) => {
            const bTitle = b.title.toLowerCase();
            return bTitle.includes(cleanKey) || cleanKey.includes(bTitle);
          });

          if (matched && onClose) {
            return (
              <Link
                key={idx}
                href={`/books/${matched.book_id}`}
                onClick={onClose}
                className="inline-flex items-center gap-0.5 font-semibold text-stone-900 underline decoration-stone-300 hover:text-[#881337] hover:decoration-[#881337] transition-colors"
                title={`Xem tác phẩm: ${matched.title}`}
              >
                <span>{inner}</span>
                <ArrowUpRight size={11} className="inline text-stone-400 -mt-0.5" />
              </Link>
            );
          }

          return (
            <strong key={idx} className="font-semibold text-stone-900">
              {inner}
            </strong>
          );
        }

        // Xử lý in nghiêng *...* hoặc _..._
        if (
          ((token.startsWith("*") && token.endsWith("*")) ||
            (token.startsWith("_") && token.endsWith("_"))) &&
          token.length > 2
        ) {
          const inner = token.slice(1, -1).trim();
          return (
            <em key={idx} className="font-serif italic text-stone-800">
              “{inner}”
            </em>
          );
        }

        // Xử lý inline code `...`
        if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
          const inner = token.slice(1, -1).trim();
          return (
            <code key={idx} className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs font-mono">
              {inner}
            </code>
          );
        }

        // Dòng thường: loại bỏ các ký tự markdown thừa lẻ loi
        const cleaned = token.replace(/[*_]/g, "");
        return <span key={idx}>{cleaned}</span>;
      })}
    </span>
  );
}

// Hàm hỗ trợ format Markdown thành HTML hiển thị đẹp mắt kèm các khối đề xuất sách tương tác
function FormattedMessage({
  content,
  books,
  onClose,
}: {
  content: string;
  books?: BookRecommendation[];
  onClose: () => void;
}) {
  const lines = content.split("\n");

  // Gom các dòng lại: Dòng tiêu đề sách in đậm (**...**) và dòng tóm tắt đi liền kề
  const items: Array<
    | { type: "book"; rawTitle: string; summary: string }
    | { type: "text"; text: string }
    | { type: "space" }
  > = [];

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      items.push({ type: "space" });
      i++;
      continue;
    }

    const isBookHeader = trimmed.startsWith("**") && (trimmed.includes("—") || trimmed.includes("-") || trimmed.endsWith("**"));

    if (isBookHeader) {
      const rawTitle = trimmed.replace(/^\*\*|\*\*$/g, "").trim();
      let summary = "";
      if (i + 1 < lines.length) {
        const nextTrimmed = lines[i + 1].trim();
        if (nextTrimmed.toLowerCase().startsWith("tóm tắt:") || nextTrimmed.toLowerCase().startsWith("phân tích:")) {
          summary = nextTrimmed.replace(/^(Tóm tắt|Phân tích):\s*/i, "").trim();
          i++;
        }
      }
      items.push({ type: "book", rawTitle, summary });
      i++;
    } else {
      items.push({ type: "text", text: trimmed });
      i++;
    }
  }

  return (
    <div className="space-y-2 text-sm leading-relaxed font-sans">
      {items.map((item, idx) => {
        if (item.type === "space") {
          return <div key={idx} className="h-1" />;
        }

        if (item.type === "book") {
          // Tìm matchedBook tương ứng từ mảng books
          const cleanEnglish = item.rawTitle.replace(/\(.*?\)/g, "").replace(/[-—].*$/, "").trim().toLowerCase();
          const matched = books?.find((b) => {
            const bTitle = b.title.toLowerCase();
            return bTitle.includes(cleanEnglish) || cleanEnglish.includes(bTitle);
          });

          return (
            <MercyBookItem
              key={idx}
              rawTitle={item.rawTitle}
              summary={item.summary}
              matchedBook={matched}
              onClose={onClose}
            />
          );
        }

        // Dòng văn bản bình thường (mở đầu, đoạn văn phân tích hoặc kết luận)
        // 1. Nếu là tiêu đề markdown ### hoặc ##
        if (item.text.startsWith("#")) {
          const headingText = item.text.replace(/^#{1,6}\s*/, "");
          return (
            <h5 key={idx} className="font-serif font-bold text-stone-900 text-sm sm:text-base mt-2 mb-1">
              {renderFormattedInline(headingText, books, onClose)}
            </h5>
          );
        }

        // 2. Nếu là danh sách gạch đầu dòng (- hoặc • hoặc *)
        if (/^[-*•]\s+/.test(item.text)) {
          const bulletText = item.text.replace(/^[-*•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 my-1 text-stone-700">
              <span className="text-[#881337] font-bold select-none">•</span>
              <span className="flex-1 leading-relaxed">
                {renderFormattedInline(bulletText, books, onClose)}
              </span>
            </div>
          );
        }

        // 3. Nếu là danh sách đánh số 1. 2. 3.
        const numMatch = item.text.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 my-1 text-stone-700">
              <span className="font-mono text-xs font-bold text-[#881337] select-none min-w-[14px]">
                {numMatch[1]}.
              </span>
              <span className="flex-1 leading-relaxed">
                {renderFormattedInline(numMatch[2], books, onClose)}
              </span>
            </div>
          );
        }

        // 4. Đoạn văn xuôi bình thường
        return (
          <p key={idx} className="text-stone-700 font-sans leading-relaxed">
            {renderFormattedInline(item.text, books, onClose)}
          </p>
        );
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
      const mercyBooks: BookRecommendation[] = data.books || [];
      setMessages((prev) => [...prev, { role: "mercy", content: mercyReply, books: mercyBooks }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "mercy",
          content: "Mercy AI tạm thời chưa thể kết nối đến máy chủ. Bạn vui lòng thử lại sau ít phút nhé.",
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Bảng Chat trượt từ cạnh phải (Slide-over Drawer) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-stone-200 font-sans"
          >
            {/* 1. Header chuẩn Editorial: Màu than đen #1C1917, typography cổ điển */}
            <div className="bg-[#1C1917] text-white px-5 py-4 flex items-center justify-between shadow-xs border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-stone-800 text-amber-200 flex items-center justify-center shrink-0 border border-stone-700">
                  <BookOpen size={16} />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                    THE INKWELL ASSISTANT
                  </p>
                  <h3 className="font-serif font-bold text-sm sm:text-base tracking-tight text-white">
                    Mercy AI
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded-[4px] border border-stone-700 hover:border-stone-500 hover:bg-stone-800 text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Bắt đầu đoạn hội thoại mới"
                >
                  <RotateCcw size={11} />
                  <span>Đoạn chat mới</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-stone-400 hover:text-white transition-colors p-1.5 rounded-[4px] hover:bg-stone-800 cursor-pointer"
                  aria-label="Đóng cửa sổ"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 2. Khung trò chuyện (Chat Body) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm bg-[#FAF9F6]">
              {/* Lời chào khởi đầu nếu chưa có tin nhắn */}
              {messages.length === 0 && (
                <div className="space-y-4 pt-2 text-stone-700 leading-relaxed font-sans">
                  <div className="p-4 rounded-[6px] bg-white border border-stone-200/90 shadow-2xs">
                    <p className="text-sm font-sans text-stone-800 leading-relaxed">
                      Chào bạn, tôi là <strong>Mercy AI</strong>. Bạn đang tìm cuốn sách nào hoặc muốn được gợi ý theo chủ đề/gu đọc nào?
                    </p>
                  </div>

                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 pt-2 font-semibold">
                    Gợi ý câu hỏi để thử:
                  </p>
                  <div className="space-y-2">
                    {samplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left p-3 rounded-[6px] bg-white border border-stone-200 hover:border-[#1C1917] hover:bg-stone-50 transition-all text-xs font-medium text-stone-800 shadow-2xs flex items-center justify-between group cursor-pointer"
                      >
                        <span className="font-serif">"{prompt}"</span>
                        <ArrowRight size={13} className="text-stone-400 group-hover:text-[#1C1917] transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
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
                    className={`max-w-[92%] p-4 rounded-[6px] leading-relaxed shadow-2xs ${
                      msg.role === "user"
                        ? "bg-[#1C1917] text-white"
                        : "bg-white text-stone-900 border border-stone-200/90 font-sans text-sm"
                    }`}
                  >
                    {msg.role === "mercy" ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#881337] mb-2.5 pb-2 border-b border-stone-200/80">
                          <BookOpen size={13} strokeWidth={1.5} />
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Mercy AI</span>
                        </div>
                        <FormattedMessage content={msg.content} books={msg.books} onClose={onClose} />
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Hiệu ứng đang suy nghĩ */}
              {isLoading && (
                <div className="flex items-center gap-2 text-stone-500 text-xs italic bg-white border border-stone-200/80 p-3 rounded-[6px] w-fit shadow-2xs font-serif">
                  <Loader2 size={14} className="animate-spin text-[#1C1917]" />
                  <span>Mercy AI đang tìm kiếm và phân tích...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 3. Khung nhập tin nhắn (Footer) */}
            <div className="p-4 bg-white border-t border-stone-200">
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
                  placeholder="Hỏi Mercy AI về cuốn sách bạn muốn tìm..."
                  className="flex-1 px-3.5 py-2.5 rounded-[5px] border border-stone-300 focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 font-sans"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-[#1C1917] hover:bg-[#2B2725] text-white px-4 py-2.5 rounded-[5px] font-medium text-xs sm:text-sm transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 shrink-0"
                  title="Gửi tin nhắn"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>
              <p className="text-[10px] text-stone-400 text-center mt-2 font-mono">
                Tuyển chọn &amp; Đề xuất bởi Mercy AI • The Inkwell
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

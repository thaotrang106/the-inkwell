"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  TrendingUp, 
  Search, 
  Loader2, 
  BookOpen, 
  SlidersHorizontal,
  Compass,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "@/components/BookCard";
import { API_BASE_URL } from "@/lib/api";

// Cấu hình danh mục thể loại chuẩn hóa theo Dataset Goodreads-10k
const GENRE_CONFIG: Record<string, { title: string; desc: string }> = {
  "philosophy": {
    title: "Triết Học & Đạo Đức",
    desc: "Tuyển tập những tác phẩm triết luận, tư tưởng nhân sinh và câu hỏi hiện sinh kinh điển từ những triết gia vĩ đại nhất lịch sử."
  },
  "fiction": {
    title: "Văn Học Hư Cấu",
    desc: "Thế giới của những câu chuyện sáng tạo phong phú, nhân vật giàu cảm xúc và những tác phẩm đoạt giải thưởng văn chương thế giới."
  },
  "nonfiction": {
    title: "Phi Hư Cấu & Tri Thức",
    desc: "Các tác phẩm nghiên cứu, bài học cuộc sống, nhân văn và góc nhìn đa chiều về thế giới thực tế."
  },
  "classics": {
    title: "Tác Phẩm Kinh Điển",
    desc: "Những áng văn bất hủ vượt thời gian, định hình nền văn học thế giới và trường tồn qua nhiều thế hệ độc giả."
  },
  "young-adult": {
    title: "Tuổi Trẻ & Thiếu Nhi",
    desc: "Những hành trình trưởng thành đầy khát vọng, nhiệt huyết tuổi trẻ, tình bạn và sự dũng cảm khám phá cuộc sống."
  },
  "fantasy": {
    title: "Kỳ Ảo & Giả Tưởng",
    desc: "Những vùng đất thần bí, ma thuật cổ xưa, các trận chiến sử thi và thế giới kỳ vĩ vượt ngoài sức tưởng tượng."
  },
  "romance": {
    title: "Tiểu Thuyết Lãng Mạn",
    desc: "Những câu chuyện tình yêu say đắm, trắc trở và ngọt ngào chạm đến những cung bậc sâu kín nhất của trái tim."
  },
  "mystery": {
    title: "Trinh Thám & Phá Án",
    desc: "Những vụ án bí ẩn nghẹt thở, màn đấu trí đỉnh cao giữa thám tử và thủ phạm, cùng những nút thắt bất ngờ."
  },
  "thriller": {
    title: "Giật Gân & Tâm Lý",
    desc: "Những tình huống dồn dập, căng thẳng tột độ và trò chơi tâm lý ly kỳ khiến bạn không thể rời mắt."
  },
  "science-fiction": {
    title: "Khoa Học Viễn Tưởng",
    desc: "Những viễn cảnh tương lai công nghệ, vũ trụ bao la, du hành thời gian và câu hỏi về bản chất trí tuệ nhân loại."
  },
  "historical-fiction": {
    title: "Tiểu Thuyết Lịch Sử",
    desc: "Những câu chuyện tái hiện sống động các thời kỳ hào hùng, biến cố lịch sử và số phận con người trong dòng xoáy thời đại."
  },
  "contemporary": {
    title: "Văn Học Đương Đại",
    desc: "Góc nhìn đương đại về xã hội, những lát cắt đời sống hiện đại và tâm lý con người trong thế giới hôm nay."
  },
  "crime": {
    title: "Tội Phạm & Hình Sự",
    desc: "Bức tranh gai góc về thế giới ngầm, quá trình điều tra phá án và ranh giới mong manh giữa công lý và tội ác."
  },
  "horror": {
    title: "Kinh Dị & Rùng Rợn",
    desc: "Những tác phẩm gieo rắc nỗi sợ hãi nguyên thủy, bí ẩn siêu nhiên và bầu không khí rùng rợn lạnh gáy."
  },
  "paranormal": {
    title: "Huyền Bí & Siêu Nhiên",
    desc: "Những câu chuyện về ma cà rồng, người sói, thế giới vô hình và những hiện tượng huyền bí khó giải thích."
  },
  "history": {
    title: "Lịch Sử Văn Minh",
    desc: "Hành trình hàng nghìn năm của nhân loại, các nền văn minh cổ đại, các cuộc chiến tranh và bài học lịch sử đắt giá."
  },
  "biography": {
    title: "Tiểu Sử & Hồi Ký",
    desc: "Câu chuyện cuộc đời có thật của những vĩ nhân, nhà lãnh đạo, nhà khoa học và những nhân vật truyền cảm hứng vĩ đại."
  },
  "memoir": {
    title: "Hồi Ký & Tự Truyện",
    desc: "Những trang viết chân thật nhất từ ký ức của chính tác giả về những thăng trầm và bài học cuộc đời."
  },
  "psychology": {
    title: "Tâm Lý Học Ứng Dụng",
    desc: "Giải mã hành vi, tiềm thức, cảm xúc con người và cách thức bộ não đưa ra quyết định mỗi ngày."
  },
  "science": {
    title: "Khoa Học Tự Nhiên",
    desc: "Khám phá các định luật vật lý, sinh học, vũ trụ học và vẻ đẹp diệu kỳ của thế giới tự nhiên."
  },
  "self-help": {
    title: "Phát Triển Bản Thân",
    desc: "Cẩm nang xây dựng thói quen tốt, tư duy tích cực, quản lý tài chính cá nhân và nâng tầm cuộc sống."
  },
  "poetry": {
    title: "Thơ Ca Tuyển Chọn",
    desc: "Những vần thơ tinh tế, giai điệu ngôn từ bay bổng lay động tâm hồn và tình yêu thi ca."
  },
  "business": {
    title: "Kinh Doanh & Khởi Nghiệp",
    desc: "Chiến lược kinh doanh, bài học từ các tập đoàn hàng đầu thế giới và tư duy làm chủ thời đại mới."
  },
  "art": {
    title: "Nghệ Thuật & Hội Họa",
    desc: "Tinh hoa hội họa, kiến trúc, thẩm mỹ học và cuộc đời những danh họa kiệt xuất."
  },
  "comics": {
    title: "Truyện Tranh & Manga",
    desc: "Sự kết hợp hoàn hảo giữa nghệ thuật minh họa thị giác và cốt truyện cuốn hút đỉnh cao."
  },
  "manga": {
    title: "Manga Nhật Bản",
    desc: "Những bộ truyện tranh Nhật Bản đặc sắc với phong cách vẽ độc đáo và cốt truyện lôi cuốn."
  }
};

// Danh sách các thể loại hiển thị trên thanh chọn nhanh (Pills)
const QUICK_GENRE_PILLS = [
  { slug: "all", label: "Tất cả Thịnh hành" },
  { slug: "philosophy", label: "Triết Học" },
  { slug: "fiction", label: "Hư Cấu" },
  { slug: "nonfiction", label: "Phi Hư Cấu" },
  { slug: "classics", label: "Kinh Điển" },
  { slug: "young-adult", label: "Tuổi Trẻ" },
  { slug: "fantasy", label: "Kỳ Ảo" },
  { slug: "romance", label: "Lãng Mạn" },
  { slug: "mystery", label: "Trinh Thám" },
  { slug: "thriller", label: "Giật Gân" },
  { slug: "science-fiction", label: "Khoa Học Viễn Tưởng" },
  { slug: "psychology", label: "Tâm Lý Học" },
  { slug: "history", label: "Lịch Sử" },
  { slug: "biography", label: "Tiểu Sử" },
  { slug: "self-help", label: "Phát Triển Bản Thân" },
  { slug: "business", label: "Kinh Doanh" },
  { slug: "poetry", label: "Thơ Ca" },
  { slug: "comics", label: "Truyện Tranh" },
];

// Cache bộ nhớ Client-side để chuyển đổi giữa các thể loại trong 0.001 giây
const CLIENT_TRENDING_CACHE = new Map<string, any>();

function TrendingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const genreParam = searchParams.get("genre") || "";
  const filterParam = searchParams.get("filter") || "";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<"all" | "top10" | "top25">("all");
  const [activeGenreMeta, setActiveGenreMeta] = useState<{ title: string; desc: string } | null>(null);

  // Tải dữ liệu sách dựa trên genre hoặc popular
  useEffect(() => {
    let isCancelled = false;
    const cacheKey = genreParam ? `genre_${genreParam.toLowerCase().trim()}` : "popular";

    // 1. Nạp ngay từ RAM hoặc sessionStorage nếu đã từng mở hoặc được prefetch
    let hasImmediateData = false;
    if (CLIENT_TRENDING_CACHE.has(cacheKey)) {
      const cached = CLIENT_TRENDING_CACHE.get(cacheKey);
      setBooks(cached.books);
      setActiveGenreMeta(cached.meta);
      setLoading(false);
      hasImmediateData = true;
    } else if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`inkwell_${cacheKey}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.books) && parsed.books.length > 0) {
            setBooks(parsed.books);
            setActiveGenreMeta(parsed.meta);
            setLoading(false);
            CLIENT_TRENDING_CACHE.set(cacheKey, parsed);
            hasImmediateData = true;
          }
        }
      } catch {}
    }

    if (!hasImmediateData) {
      setLoading(true);
    }

    const fetchBooks = async () => {
      setSearchQuery(""); // Đặt lại ô tìm kiếm khi chuyển danh mục

      try {
        if (genreParam) {
          // 1. Chế độ Thể loại: Gọi API lấy sách theo thể loại từ Dataset
          const genreKey = genreParam.toLowerCase().trim();
          const localMeta = GENRE_CONFIG[genreKey] || {
            title: genreKey.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            desc: `Tuyển tập những tác phẩm văn học chọn lọc thuộc thể loại ${genreKey} từ kho tàng 10.000 cuốn sách The Inkwell.`
          };
          setActiveGenreMeta(localMeta);

          const res = await fetch(`${API_BASE_URL}/api/books/by-genre/${genreKey}?limit=60`);
          if (!res.ok) throw new Error("Network response was not ok");
          const json = await res.json();

          if (!isCancelled && json.data) {
            setBooks(json.data);
            const resolvedMeta = (json.genre_name_vi && json.description) ? {
              title: json.genre_name_vi,
              desc: json.description
            } : localMeta;
            
            setActiveGenreMeta(resolvedMeta);
            CLIENT_TRENDING_CACHE.set(cacheKey, { books: json.data, meta: resolvedMeta });
            try {
              sessionStorage.setItem(`inkwell_${cacheKey}`, JSON.stringify({ books: json.data, meta: resolvedMeta }));
            } catch {}
          }
        } else {
          // 2. Chế độ Thịnh hành chung
          setActiveGenreMeta(null);
          const res = await fetch(`${API_BASE_URL}/api/recommendations/popular?limit=50`);
          if (!res.ok) throw new Error("Network response was not ok");
          const json = await res.json();

          if (!isCancelled && json.data) {
            setBooks(json.data);
            CLIENT_TRENDING_CACHE.set(cacheKey, { books: json.data, meta: null });
            try {
              sessionStorage.setItem(`inkwell_${cacheKey}`, JSON.stringify({ books: json.data, meta: null }));
            } catch {}
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sách:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (filterParam === "top10") setRankFilter("top10");
    else if (filterParam === "top25") setRankFilter("top25");
    else setRankFilter("all");

    fetchBooks();

    return () => {
      isCancelled = true;
    };
  }, [genreParam, filterParam]);

  // Lọc sách theo từ khóa tìm kiếm (Tựa sách hoặc Tác giả)
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = book.title && book.title.toLowerCase().includes(q);
        const authorMatch = book.author && book.author.toLowerCase().includes(q);
        if (!titleMatch && !authorMatch) return false;
      }

      if (!genreParam) {
        if (rankFilter === "top10") return book.rank && book.rank <= 10;
        if (rankFilter === "top25") return book.rank && book.rank <= 25;
      }

      return true;
    });
  }, [books, searchQuery, rankFilter, genreParam]);

  // Xử lý chuyển đổi thể loại nhanh
  const handleSelectGenrePill = (slug: string) => {
    if (slug === "all") {
      router.push("/trending");
    } else {
      router.push(`/trending?genre=${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. BREADCRUMB ĐIỀU HƯỚNG */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-ink/60 hover:text-ink transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Quay lại Trang chủ
          </Link>

          <div className="text-xs text-ink/50 hidden sm:flex items-center gap-1.5">
            <span>Trang chủ</span>
            <span>/</span>
            <span>{genreParam ? "Danh mục thể loại" : "Bảng xếp hạng"}</span>
            <span>/</span>
            <span className="font-semibold text-ink/80">
              {activeGenreMeta ? activeGenreMeta.title : "Sách Thịnh Hành"}
            </span>
          </div>
        </div>

        {/* 2. HEADER BANNER THÔNG TIN DANH MỤC (Phong cách Editorial / New York Times) */}
        <div className="bg-[#FAFAFA] rounded-[6px] p-6 sm:p-9 lg:p-10 border border-stone-200/90 mb-8 relative">
          
          <div className="flex flex-col">
            {/* Huy hiệu phân mục tối giản */}
            <div className="flex items-center gap-2 mb-3 text-stone-500 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium">
              {genreParam ? (
                <>
                  <BookOpen size={13} className="text-stone-700" />
                  <span>THE INKWELL ARCHIVE • THỂ LOẠI SÁCH</span>
                </>
              ) : (
                <>
                  <TrendingUp size={13} className="text-stone-700" />
                  <span>THE INKWELL ARCHIVE • BẢNG XẾP HẠNG</span>
                </>
              )}
            </div>

            {/* Tựa đề trang: Font Serif (Lora) sang trọng, to rõ, thanh mảnh */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight leading-[1.12]">
              {activeGenreMeta ? activeGenreMeta.title : "Sách Thịnh Hành Nhất"}
            </h1>

            {/* Dòng mô tả & Căn lề số lượng tác phẩm cùng hàng (Căn phải) */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-3 pt-1">
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-3xl font-sans font-normal">
                {activeGenreMeta 
                  ? activeGenreMeta.desc 
                  : "Tuyển tập những tác phẩm văn học được hàng triệu độc giả yêu thích và đánh giá cao nhất trên hệ thống. Dữ liệu xếp hạng được tổng hợp liên tục theo thời gian thực."}
              </p>
              
              {/* Tag số lượng tác phẩm căn phải cùng hàng với mô tả */}
              <div className="shrink-0 text-xs font-mono text-stone-500 uppercase tracking-wider whitespace-nowrap self-start sm:self-auto pt-1 sm:pt-0">
                <span className="font-semibold text-stone-900">
                  {loading ? "Đang tải..." : `${filteredBooks.length} tác phẩm`}
                </span>
              </div>
            </div>
          </div>

          {/* 3. THANH DANH MỤC NHANH (QUICK TAGS) - Bỏ chữ dataset, bỏ bo tròn pill, nút Active viền mỏng chữ đậm */}
          <div className="mt-8 pt-6 border-t border-stone-200/80">
            <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-stone-500 mb-3.5 flex items-center gap-1.5">
              <Compass size={13} className="text-stone-600" />
              <span>KHÁM PHÁ CÁC THỂ LOẠI KHÁC</span>
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-sans">
              {QUICK_GENRE_PILLS.map((pill) => {
                const isActive = (pill.slug === "all" && !genreParam) || (genreParam === pill.slug);
                return (
                  <button
                    key={pill.slug}
                    onClick={() => handleSelectGenrePill(pill.slug)}
                    className={`px-3 py-1.5 rounded-[4px] border transition-all whitespace-nowrap cursor-pointer text-xs ${
                      isActive 
                        ? "border-[#1C1917] bg-white text-[#1C1917] font-bold shadow-2xs ring-1 ring-[#1C1917]" 
                        : "border-stone-200/90 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. THANH TÌM KIẾM MỞ RỘNG & BỘ LỌC THỨ HẠNG */}
          <div className="mt-5 pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            
            {/* Ô tìm kiếm mở rộng, bỏ bo tròn (4px), nền xám nhạt viền mỏng */}
            <div className="relative w-full sm:flex-1 max-w-2xl">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={
                  activeGenreMeta 
                    ? `Tìm sách hoặc tác giả trong mục ${activeGenreMeta.title}...` 
                    : "Lọc theo tựa sách hoặc tác giả..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-[#F5F5F4] border border-stone-200/90 rounded-[4px] text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 p-0.5 cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Các nút lọc thứ hạng (chỉ hiển thị khi đang ở bảng xếp hạng chung) */}
            {!genreParam && (
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 shrink-0">
                <button
                  onClick={() => setRankFilter("all")}
                  className={`px-3.5 py-2 rounded-[4px] text-xs transition-all cursor-pointer whitespace-nowrap border ${
                    rankFilter === "all" 
                      ? "border-[#1C1917] bg-[#1C1917] text-white font-semibold shadow-2xs" 
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                  }`}
                >
                  Tất cả ({books.length})
                </button>
                <button
                  onClick={() => setRankFilter("top10")}
                  className={`px-3.5 py-2 rounded-[4px] text-xs transition-all cursor-pointer whitespace-nowrap border ${
                    rankFilter === "top10" 
                      ? "border-[#7F1D1D] bg-white text-[#7F1D1D] font-bold shadow-2xs" 
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                  }`}
                >
                  Top 10 Xuất sắc
                </button>
                <button
                  onClick={() => setRankFilter("top25")}
                  className={`px-3.5 py-2 rounded-[4px] text-xs transition-all cursor-pointer whitespace-nowrap border ${
                    rankFilter === "top25" 
                      ? "border-[#7F1D1D] bg-white text-[#7F1D1D] font-bold shadow-2xs" 
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                  }`}
                >
                  Top 25
                </button>
              </div>
            )}

          </div>

        </div>

        {/* 5. DANH SÁCH TÁC PHẨM */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-x-8 lg:gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <div key={s} className="flex flex-col gap-4 w-full animate-pulse">
                <div className="aspect-[2/3] w-full bg-gradient-to-br from-ink/10 via-ink/5 to-ink/10 rounded-xl shadow-sm border border-ink/5 flex items-center justify-center">
                  <span className="font-serif text-ink/15 text-xs">The Inkwell</span>
                </div>
                <div className="space-y-2 px-1">
                  <div className="h-4 bg-ink/10 rounded w-5/6"></div>
                  <div className="h-3 bg-ink/5 rounded w-1/2"></div>
                  <div className="h-4 bg-ink/10 rounded w-1/3 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-[#FAFAFA] rounded-[6px] p-10 sm:p-14 text-center border border-stone-200/90 max-w-lg mx-auto shadow-2xs">
            <div className="w-12 h-12 rounded-[4px] bg-stone-100 text-stone-800 flex items-center justify-center mx-auto mb-3.5 border border-stone-200">
              <Search size={20} />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Không tìm thấy tác phẩm phù hợp</h3>
            <p className="text-stone-500 text-xs sm:text-sm mb-6 leading-relaxed font-sans">
              {searchQuery 
                ? `Không có cuốn sách nào khớp với từ khóa "${searchQuery}" trong danh mục hiện tại.` 
                : "Danh mục này hiện đang được cập nhật thêm tác phẩm mới."}
            </p>
            <div className="flex items-center justify-center gap-3 font-sans">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-[#1C1917] text-white rounded-[4px] text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
              <Link
                href="/trending"
                className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-[4px] text-xs font-medium hover:border-stone-900 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Xem tất cả sách thịnh hành
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-xs text-ink/60 font-medium">
                Hiển thị <span className="font-bold text-ink">{filteredBooks.length}</span> tác phẩm tuyển chọn:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-x-8 lg:gap-y-12">
              {filteredBooks.map((book, i) => (
                <motion.div
                  key={`${book.book_id}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min((i % 15) * 0.04, 0.4), duration: 0.35 }}
                >
                  <BookCard book={book} rank={book.rank} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#B12704]" size={36} />
      </div>
    }>
      <TrendingPageContent />
    </Suspense>
  );
}

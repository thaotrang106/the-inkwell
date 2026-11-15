"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  TrendingUp, 
  Search, 
  BookOpen, 
  Compass, 
  X, 
  Users, 
  ChevronDown, 
  Check, 
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "@/components/BookCard";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_READERS } from "@/lib/demoReaders";
import { GENRE_METADATA_MAP } from "@/lib/serverBooks";
import { getPersonalizedBooksForGenre } from "@/lib/genrePersonalized";

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

interface TrendingClientProps {
  initialBooks: any[];
  genreParam?: string;
  filterParam?: string;
  initialGenreMeta?: { title: string; desc: string } | null;
}

export default function TrendingClient({
  initialBooks,
  genreParam = "",
  filterParam = "",
  initialGenreMeta = null,
}: TrendingClientProps) {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useAuth();
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const currentDemoReader = (isLoggedIn && user)
    ? DEMO_READERS.find((r) => r.user_id === user.user_id && (user.name.includes(r.shortName) || user.name === r.name)) || null
    : null;
  const readerDisplayName = user?.name
    ? user.name.replace(/\s*\(\s*#\d+\s*\)/g, "").replace(/^Độc giả\s+/i, "").trim()
    : (currentDemoReader ? currentDemoReader.shortName : "Bạn");

  // Quản lý thể loại đang chọn đồng bộ URL và phản hồi lập tức 0ms
  const [selectedGenre, setSelectedGenre] = useState<string>(genreParam);
  const [books, setBooks] = useState<any[]>(initialBooks || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<"all" | "top10" | "top25">(
    filterParam === "top10" ? "top10" : filterParam === "top25" ? "top25" : "all"
  );
  const [activeGenreMeta, setActiveGenreMeta] = useState<{ title: string; desc: string } | null>(
    initialGenreMeta || (genreParam ? (GENRE_METADATA_MAP[genreParam.toLowerCase()] || null) : null)
  );

  // Đồng bộ khi URL thay đổi từ bên ngoài (e.g. back/forward hoặc query param)
  useEffect(() => {
    setSelectedGenre(genreParam);
  }, [genreParam]);

  // Cập nhật khi selectedGenre thay đổi
  useEffect(() => {
    let isCancelled = false;

    if (selectedGenre) {
      const localMeta = GENRE_METADATA_MAP[selectedGenre.toLowerCase()] || {
        title: selectedGenre.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        desc: `Tuyển tập những tác phẩm văn học chọn lọc thuộc thể loại ${selectedGenre} từ kho tàng 10.000 cuốn sách The Inkwell.`
      };
      setActiveGenreMeta(localMeta);
    } else {
      setActiveGenreMeta(null);
    }

    const fetchBooks = async () => {
      setSearchQuery("");
      setLoading(true);

      try {
        if (selectedGenre) {
          const res = await fetch(`${API_BASE_URL}/api/books/by-genre/${selectedGenre}?limit=60`);
          if (!res.ok) throw new Error("API call failed");
          const json = await res.json();
          if (!isCancelled && json.data) {
            setBooks(json.data);
          }
        } else {
          const res = await fetch(`${API_BASE_URL}/api/recommendations/popular?limit=50`);
          if (!res.ok) throw new Error("API call failed");
          const json = await res.json();
          if (!isCancelled && json.data) {
            setBooks(json.data);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sách:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (selectedGenre || filterParam) {
      fetchBooks();
    } else {
      setBooks(initialBooks);
    }

    return () => {
      isCancelled = true;
    };
  }, [selectedGenre, filterParam, initialBooks]);

  // Danh mục 5 tác phẩm đề xuất riêng may đo theo thể loại đang chọn
  const personalizedGenreBooks = useMemo(() => {
    return getPersonalizedBooksForGenre(selectedGenre, currentDemoReader, books);
  }, [selectedGenre, currentDemoReader, books]);

  // Lọc sách theo từ khóa tìm kiếm (Tựa sách hoặc Tác giả)
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = book.title && book.title.toLowerCase().includes(q);
        const authorMatch = (book.author || book.authors || "").toLowerCase().includes(q);
        if (!titleMatch && !authorMatch) return false;
      }

      if (!selectedGenre) {
        if (rankFilter === "top10") return book.rank && book.rank <= 10;
        if (rankFilter === "top25") return book.rank && book.rank <= 25;
      }

      return true;
    });
  }, [books, searchQuery, rankFilter, selectedGenre]);

  const handleSelectGenrePill = (slug: string) => {
    const nextSlug = slug === "all" ? "" : slug;
    setSelectedGenre(nextSlug);
    setSearchQuery("");

    if (nextSlug) {
      const localMeta = GENRE_METADATA_MAP[nextSlug.toLowerCase()] || {
        title: nextSlug.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        desc: `Tuyển tập những tác phẩm văn học chọn lọc thuộc thể loại ${nextSlug} từ kho tàng 10.000 cuốn sách The Inkwell.`
      };
      setActiveGenreMeta(localMeta);
      router.push(`/trending?genre=${nextSlug}`, { scroll: false });
    } else {
      setActiveGenreMeta(null);
      router.push("/trending", { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 pb-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. BREADCRUMB & USER SWITCHER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Quay lại Trang chủ
          </Link>

          {/* User Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white border border-stone-300 hover:border-stone-800 text-xs text-stone-800 shadow-2xs transition-all cursor-pointer"
            >
              <Users size={13} className="text-[#881337]" />
              <span className="font-medium text-[11px] sm:text-xs">
                {currentDemoReader ? (
                  <>Độc giả: <strong className="font-semibold text-[#881337]">{currentDemoReader.shortName}</strong></>
                ) : (
                  <>Độc giả mẫu: <strong className="font-semibold text-stone-600">Khách vãng lai</strong></>
                )}
              </span>
              <ChevronDown size={13} className={`text-stone-400 transition-transform ${showUserSwitcher ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showUserSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-1.5 w-80 bg-white border border-stone-200 rounded-[4px] shadow-xl overflow-hidden z-50 text-left font-sans"
                >
                  <div className="px-3.5 py-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                      CHUYỂN ĐỔI NGƯỜI DÙNG MẪU
                    </span>
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
                            setShowUserSwitcher(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-[4px] hover:bg-stone-50 transition-colors flex items-start justify-between cursor-pointer group ${
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
                          </div>
                          {isSelected && (
                            <span className="text-[#881337] mt-1 shrink-0">
                              <Check size={14} />
                            </span>
                          )}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowUserSwitcher(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-[4px] hover:bg-stone-50 transition-colors flex items-start justify-between cursor-pointer group ${
                        !isLoggedIn ? "bg-rose-50/70 border border-[#881337]/20" : "border border-transparent"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-stone-800">
                          Khách vãng lai (Chưa đăng nhập)
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Thử nghiệm bài toán Cold-Start
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

        {/* 2. HEADER BANNER THÔNG TIN DANH MỤC */}
        <div className="bg-white rounded-[4px] p-6 sm:p-9 lg:p-10 border border-stone-200/90 mb-8 relative shadow-2xs">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-stone-500 font-cormorant text-sm sm:text-base uppercase tracking-[0.24em] font-semibold">
              {selectedGenre ? (
                <>
                  <BookOpen size={13} className="text-[#881337]" />
                  <span>THE INKWELL ARCHIVE • THỂ LOẠI SÁCH</span>
                </>
              ) : (
                <>
                  <TrendingUp size={13} className="text-[#881337]" />
                  <span>THE INKWELL ARCHIVE • BẢNG XẾP HẠNG</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight leading-[1.12]">
              {activeGenreMeta ? activeGenreMeta.title : "Sách Thịnh Hành Nhất"}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-3 pt-1">
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-3xl font-sans font-normal">
                {activeGenreMeta 
                  ? activeGenreMeta.desc 
                  : "Tuyển tập những tác phẩm văn học được hàng triệu độc giả yêu thích và đánh giá cao nhất trên hệ thống. Dữ liệu xếp hạng được tổng hợp liên tục theo thời gian thực."}
              </p>
              
              <div className="shrink-0 text-xs font-mono text-stone-500 uppercase tracking-wider whitespace-nowrap self-start sm:self-auto pt-1 sm:pt-0">
                <span className="font-semibold text-stone-900">
                  {loading ? "Đang tải..." : `${filteredBooks.length} tác phẩm`}
                </span>
              </div>
            </div>
          </div>

          {/* 3. THANH DANH MỤC NHANH (QUICK TAGS) */}
          <div className="mt-8 pt-6 border-t border-stone-200/80">
            <p className="text-sm font-cormorant font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3 flex items-center gap-1.5">
              <Compass size={13} className="text-stone-600" />
              <span>KHÁM PHÁ CÁC THỂ LOẠI KHÁC</span>
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-sans">
              {QUICK_GENRE_PILLS.map((pill) => {
                const isActive = (pill.slug === "all" && !selectedGenre) || (selectedGenre === pill.slug);
                return (
                  <button
                    key={pill.slug}
                    onClick={() => handleSelectGenrePill(pill.slug)}
                    className={`px-3 py-1.5 rounded-[4px] border transition-all whitespace-nowrap cursor-pointer text-xs ${
                      isActive 
                        ? "border-[#1C1917] bg-[#1C1917] text-white font-bold shadow-2xs" 
                        : "border-stone-200/90 bg-[#FAF7F2] text-stone-700 hover:border-stone-400 hover:text-stone-900"
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
                className="w-full pl-9 pr-9 py-2.5 bg-[#FAF7F2] border border-stone-200/90 rounded-[4px] text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all font-sans"
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

            {!selectedGenre && (
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
                      ? "border-[#881337] bg-white text-[#881337] font-bold shadow-2xs" 
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                  }`}
                >
                  Top 10 Xuất sắc
                </button>
                <button
                  onClick={() => setRankFilter("top25")}
                  className={`px-3.5 py-2 rounded-[4px] text-xs transition-all cursor-pointer whitespace-nowrap border ${
                    rankFilter === "top25" 
                      ? "border-[#881337] bg-white text-[#881337] font-bold shadow-2xs" 
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                  }`}
                >
                  Top 25
                </button>
              </div>
            )}

          </div>

        </div>

        {/* GỢI Ý RIÊNG CHO ĐỘC GIẢ HOẶC TUYỂN CHỌN THỂ LOẠI CHO KHÁCH */}
        {personalizedGenreBooks.length > 0 && (
          <div className="bg-white rounded-[4px] p-6 sm:p-8 border border-stone-200/90 shadow-2xs mb-10 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span>{currentDemoReader ? `Dành Riêng Cho ${readerDisplayName}` : "Tuyển Chọn Nổi Bật"}</span>
                  {selectedGenre && activeGenreMeta && (
                    <>
                      <span className="text-stone-300 font-light hidden sm:inline">•</span>
                      <span className="text-[#881337] font-normal">{activeGenreMeta.title}</span>
                    </>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 font-sans mt-0.5">
                  {currentDemoReader ? (
                    selectedGenre && activeGenreMeta ? (
                      <>
                        Tuyển chọn 5 tác phẩm <strong className="font-semibold text-stone-700">{activeGenreMeta.title}</strong> tương thích nhất với gu đọc của {readerDisplayName} • Lọc kết hợp Hybrid
                      </>
                    ) : (
                      <>{currentDemoReader.genre} • Dựa trên gu đọc và tâm trạng của bạn</>
                    )
                  ) : (
                    selectedGenre && activeGenreMeta ? (
                      <>
                        Tuyển chọn 5 tác phẩm tiêu biểu thuộc thể loại <strong className="font-semibold text-stone-700">{activeGenreMeta.title}</strong> • Đăng nhập để cá nhân hóa theo gu đọc
                      </>
                    ) : (
                      <>Những tác phẩm văn học chọn lọc được bạn đọc đánh giá cao nhất • The Inkwell Editorial</>
                    )
                  )}
                </p>
              </div>

              {selectedGenre ? (
                <button
                  type="button"
                  onClick={() => handleSelectGenrePill("all")}
                  className="text-xs sm:text-sm font-sans font-medium text-[#1C1917] hover:text-[#881337] transition-colors flex items-center gap-1.5 self-start sm:self-auto group cursor-pointer"
                >
                  <span>Xem tất cả thể loại</span>
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[#1C1917]/70 group-hover:text-[#881337] group-hover:translate-x-1 transition-all" />
                </button>
              ) : (
                <Link 
                  href="/" 
                  className="text-xs sm:text-sm font-sans font-medium text-[#1C1917] hover:text-[#881337] transition-colors flex items-center gap-1.5 self-start sm:self-auto group cursor-pointer"
                >
                  <span>Về Trang chủ xem đầy đủ</span>
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[#1C1917]/70 group-hover:text-[#881337] group-hover:translate-x-1 transition-all" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {personalizedGenreBooks.map((b) => (
                <BookCard key={`personalized-${selectedGenre || 'all'}-${b.book_id}`} book={b} isHybrid={true} />
              ))}
            </div>
          </div>
        )}

        {/* 5. DANH SÁCH TÁC PHẨM */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-x-8 lg:gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <div key={s} className="flex flex-col gap-4 w-full animate-pulse">
                <div className="aspect-[2/3] w-full bg-stone-200/60 rounded-[4px] border border-stone-200 flex items-center justify-center">
                  <span className="font-serif text-stone-400 text-xs">The Inkwell</span>
                </div>
                <div className="space-y-2 px-1">
                  <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                  <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/3 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-[4px] p-10 sm:p-14 text-center border border-stone-200/90 max-w-lg mx-auto shadow-2xs">
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
              <p className="text-xs text-stone-500 font-medium font-sans">
                Hiển thị <span className="font-bold text-stone-900">{filteredBooks.length}</span> tác phẩm tuyển chọn:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-x-8 lg:gap-y-12">
              {filteredBooks.map((book, i) => (
                <motion.div
                  key={`${book.book_id}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min((i % 15) * 0.03, 0.3), duration: 0.3 }}
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

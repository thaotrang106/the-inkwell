"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Search, BookOpen, ArrowRight, Clock, X, Trash2, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import MercyChatDrawer from "@/components/MercyChatDrawer";
import RecommendedReadsCarousel from "@/components/RecommendedReadsCarousel";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL as BACKEND_URL } from "@/lib/api";

// Hàm làm sạch tên sách: loại bỏ phần (Harry Potter, #1) thô của dataset
const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

// Dữ liệu đệm tức thì (Instant Fallback) hiển thị ngay lập tức khi mở web
const DEFAULT_POPULAR_BOOKS = [
  {
    book_id: 1,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1447303603i/2767052.jpg",
    rating: 4.34,
    price: 221000,
    rank: 1,
  },
  {
    book_id: 2,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling, Mary GrandPré",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
    rating: 4.47,
    price: 166000,
    rank: 2,
  },
  {
    book_id: 3,
    title: "Twilight",
    author: "Stephenie Meyer",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1361039443i/41865.jpg",
    rating: 3.61,
    price: 187000,
    rank: 3,
  },
  {
    book_id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    rating: 4.28,
    price: 119000,
    rank: 4,
  },
  {
    book_id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    rating: 3.93,
    price: 243000,
    rank: 5,
  },
  {
    book_id: 6,
    title: "The Fault in Our Stars",
    author: "John Green",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg",
    rating: 4.26,
    price: 195000,
    rank: 6,
  },
  {
    book_id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    rating: 4.27,
    price: 210000,
    rank: 7,
  },
  {
    book_id: 8,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
    rating: 3.81,
    price: 175000,
    rank: 8,
  },
  {
    book_id: 9,
    title: "Angels & Demons",
    author: "Dan Brown",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1303390735i/968.jpg",
    rating: 3.91,
    price: 180000,
    rank: 9,
  },
  {
    book_id: 10,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image_url: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
    rating: 4.26,
    price: 160000,
    rank: 10,
  },
];

export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const [popularBooks, setPopularBooks] = useState<any[]>(DEFAULT_POPULAR_BOOKS);
  const [hybridBooks, setHybridBooks] = useState<any[]>([]);
  const [personalizedBooks, setPersonalizedBooks] = useState<any[]>([]);
  const [isPersonalizedLoading, setIsPersonalizedLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State quản lý Bảng Chat trượt bên phải (Ask Mercy Drawer)
  const [isMercyOpen, setIsMercyOpen] = useState(false);

  // Quản lý Lịch sử tìm kiếm gần đây (Cách 2)
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Danh sách các banner trang chủ (Tự động chuyển slide sau mỗi 7 giây)
  const heroSlides = [
    {
      id: 1,
      tag: "Khơi nguồn cảm hứng",
      titleLine1: "Good Books",
      titleLine2: "Better Days",
      description: "Nơi nghệ thuật văn chương giao thoa cùng Trí tuệ Nhân tạo. Hãy nhập tên một cuốn sách bạn yêu thích để Mercy tìm kiếm những tác phẩm thấu hiểu tâm hồn bạn.",
      desktopImg: "/hero banner_desktop.png",
      mobileImg: "/hero banner_mobile.jpg",
      objectPosition: "object-bottom md:object-[right_bottom]",
      badge: "Không gian Văn chương",
    },
    {
      id: 2,
      tag: "Tuyển tập tinh hoa • Book Tome",
      titleLine1: "Mỗi Cuốn Sách",
      titleLine2: "Là Một Thế Giới",
      description: "Mở rộng từng trang bách khoa văn chương với các ấn bản bìa vải lanh mạ vàng độc bản và tác phẩm kinh điển được tuyển chọn kỹ lưỡng.",
      desktopImg: "/banner_tome_bg_desktop.png",
      mobileImg: "/banner_tome_bg_mobile.png",
      objectPosition: "object-center",
      badge: "Ấn bản Sách Khảo Cứu Cổ Điển",
    },
    {
      id: 3,
      tag: "Đồng hành tri thức • Mercy AI",
      titleLine1: "Thủ Thư Số",
      titleLine2: "Thấu Cảm Độc Giả",
      description: "Không chỉ tìm sách theo từ khóa đơn thuần. Mercy AI lắng nghe tâm trạng và phong cách đọc để dẫn lối bạn đến đúng cuốn sách bạn cần.",
      desktopImg: "/banner-mercy-ai.jpg",
      mobileImg: "/banner_community_mobile_1080p.jpg",
      objectPosition: "object-center md:object-[right_center]",
      badge: "Trợ lý Văn học AI",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tự động chuyển banner mỗi 7 giây (tự tạm dừng khi đang gõ tìm kiếm hoặc hover chuột)
  useEffect(() => {
    if (isPaused || showDropdown || isSearching) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, showDropdown, isSearching, heroSlides.length]);

  // Tự động đọc lịch sử tìm kiếm từ localStorage khi mở trang
  useEffect(() => {
    const saved = localStorage.getItem("inkwell_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi khi đọc lịch sử tìm kiếm", e);
      }
    }
  }, []);

  // Hàm lưu từ khóa vào lịch sử tìm kiếm (tối đa 5 từ khóa mới nhất, không trùng)
  const saveRecentSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    setRecentSearches((prev) => {
      const updated = [cleanTerm, ...prev.filter((t) => t.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 5);
      localStorage.setItem("inkwell_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  // Hàm xóa một từ khóa tìm kiếm
  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== termToRemove);
      localStorage.setItem("inkwell_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  // Hàm xóa toàn bộ lịch sử tìm kiếm
  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("inkwell_recent_searches");
  };

  // Danh sách từ khóa thịnh hành: tự động lấy động theo Top sách trong Database
  const dynamicTrending = popularBooks.length > 0 
    ? popularBooks.slice(0, 6).map((b) => cleanTitle(b.title))
    : [
        "The Hunger Games",
        "Harry Potter",
        "To Kill a Mockingbird",
        "The Great Gatsby",
        "Dune",
        "1984"
      ];
  
  const searchRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = `${BACKEND_URL}/api/recommendations`;
  const SEARCH_API_URL = `${BACKEND_URL}/api/books/search`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchPopular();
  }, []);

  useEffect(() => {
    if (user && user.user_id) {
      fetchPersonalized(user.user_id);
    } else {
      setPersonalizedBooks([]);
    }
  }, [user]);

  const fetchPersonalized = async (userId: number) => {
    setIsPersonalizedLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/recommendations/foryou/${userId}`);
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setPersonalizedBooks(json.data);
      }
    } catch (err) {
      console.log("Could not fetch personalized recommendations", err);
    } finally {
      setIsPersonalizedLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2 && !selectedBookId) {
        setIsSearching(true);
        try {
          const res = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(searchQuery)}`);
          const json = await res.json();
          setSearchResults(json.data || []);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        }
        setIsSearching(false);
      } else if (searchQuery.length === 0) {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedBookId]);

  const fetchPopular = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/popular?limit=20`);
      const json = await res.json();
      if (json.data) setPopularBooks(json.data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedBookId(""); 
    if (!showDropdown) setShowDropdown(true);
  };

  // Hàm gọi API Hybrid và tự động cuộn xuống kết quả
  const fetchHybridForBook = async (bookId: string) => {
    setLoading(true);
    setError("");
    setHybridBooks([]);
    setShowDropdown(false);
    
    try {
      const res = await fetch(`${API_BASE_URL}/hybrid/${bookId}`);
      const json = await res.json();
      
      if (json.status === "error") {
        setError(json.message);
      } else {
        setHybridBooks(json.data);
        // Tự động cuộn trang mượt mà xuống phần kết quả Just For You
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại Backend.");
    }
    setLoading(false);
  };

  // Xử lý khi nhấn nút Kính lúp hoặc nhấn phím Enter
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
    }
    
    // 1. Nếu đã có cuốn sách chọn sẵn
    if (selectedBookId) {
      fetchHybridForBook(selectedBookId);
      return;
    }
    
    // 2. Nếu đã có danh sách autocomplete sẵn sàng, lấy cuốn đầu tiên
    if (searchResults.length > 0) {
      const topBook = searchResults[0];
      setSelectedBookId(topBook.book_id.toString());
      setSearchQuery(cleanTitle(topBook.title));
      fetchHybridForBook(topBook.book_id.toString());
      return;
    }

    // 3. Nếu người dùng vừa gõ và nhấn Enter ngay lập tức
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(searchQuery.trim())}`);
        const json = await res.json();
        const results = json.data || [];
        if (results.length > 0) {
          setSearchResults(results);
          setSelectedBookId(results[0].book_id.toString());
          setSearchQuery(cleanTitle(results[0].title));
          fetchHybridForBook(results[0].book_id.toString());
        } else {
          setError(`Không tìm thấy cuốn sách nào khớp với "${searchQuery}". Vui lòng thử từ khóa khác!`);
        }
      } catch (err) {
        setError("Lỗi kết nối khi tìm kiếm.");
      }
      setIsSearching(false);
      return;
    }

    setError("Vui lòng nhập tên cuốn sách bạn muốn tìm kiếm!");
  };

  return (
    <div className="flex flex-col pb-20">
      
      {/* Hero Section with Multi-Banner Auto Carousel (Chuyển slide mỗi 7s) */}
      <section 
        className="relative min-h-[500px] md:min-h-[560px] lg:min-h-[620px] flex items-center overflow-hidden group/hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Banner Slides with Framer Motion crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[currentSlide].id}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
          >
            <picture className="w-full h-full">
              <source media="(max-width: 767px)" srcSet={heroSlides[currentSlide].mobileImg} />
              <img 
                src={heroSlides[currentSlide].desktopImg} 
                alt={heroSlides[currentSlide].titleLine1} 
                className={`w-full h-full object-cover ${heroSlides[currentSlide].objectPosition}`}
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* Lớp phủ mờ nhẹ tinh tế để chữ luôn sắc nét và tương thích tối đa với nền tường */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/92 via-[#FAF8F5]/60 to-transparent pointer-events-none hidden md:block max-w-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/95 via-[#FAF8F5]/65 to-transparent pointer-events-none md:hidden h-2/3" />

        <div className="w-full z-10 py-10 sm:py-14 md:py-16 lg:py-20 pl-5 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 pr-4">
          <div className="w-full max-w-lg lg:max-w-xl text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroSlides[currentSlide].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="uppercase tracking-[0.3em] text-xs font-bold text-terracotta mb-3 block">
                  {heroSlides[currentSlide].tag}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-4 leading-[1.08] tracking-tight">
                  {heroSlides[currentSlide].titleLine1}<br />
                  <span className="italic font-normal text-terracotta">
                    {heroSlides[currentSlide].titleLine2}
                  </span>
                </h1>
                <p className="text-ink/75 text-sm sm:text-base lg:text-lg mb-7 max-w-lg leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Search Bar phong cách Book Outlet: Ô tìm kiếm + Icon Kính lúp + Nút Ask Mercy */}
            <form onSubmit={handleSearchSubmit} className="max-w-lg relative w-full" ref={searchRef}>
              <div className="flex items-center w-full bg-white/95 backdrop-blur-sm border border-ink/20 rounded-2xl shadow-md hover:border-ink/40 focus-within:border-[#B12704] focus-within:ring-2 focus-within:ring-[#B12704]/20 px-3.5 py-2.5 transition-all">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Tìm theo tên sách, tác giả (VD: Harry Potter, Dune...)" 
                className="w-full py-1.5 px-2 bg-transparent focus:outline-none text-ink text-sm sm:text-base font-medium placeholder:text-ink/40"
              />

              {/* Icon Loading khi đang tìm */}
              {isSearching && (
                <Loader2 className="text-[#B12704] animate-spin shrink-0 mx-2" size={18} />
              )}

              {/* Icon Kính lúp tìm kiếm (Bấm vào để tìm gợi ý sách) */}
              <button
                type="submit"
                disabled={loading}
                className="p-2 text-ink/50 hover:text-[#B12704] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                title="Tìm kiếm sách gợi ý"
              >
                {loading ? <Loader2 size={20} className="animate-spin text-[#B12704]" /> : <Search size={20} />}
              </button>

              {/* Nút Ask Mercy phong cách Ask Dash của Book Outlet */}
              <button
                type="button"
                onClick={() => setIsMercyOpen(true)}
                className="flex items-center gap-1.5 ml-2 px-4 py-2 rounded-full border border-[#B12704] text-[#B12704] hover:bg-[#FFF5F2] active:scale-95 text-sm font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Sparkles size={15} className="text-[#B12704] fill-[#B12704]/20" />
                <span>Hỏi Mercy AI</span>
              </button>
            </div>

            {/* Dropdown Menu: Trending Searches khi chưa gõ & Autocomplete khi đang gõ */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-ink/10 rounded-2xl shadow-xl overflow-hidden z-50 text-left"
                >
                  {/* TRƯỜNG HỢP 1: Chưa gõ từ khóa -> Hiện "Tìm kiếm gần đây" + "Xu hướng thịnh hành" */}
                  {searchQuery.length < 2 ? (
                    <div className="p-4 sm:p-5 space-y-4 max-h-[420px] overflow-y-auto">
                      {/* 1. TÌM KIẾM GẦN ĐÂY (chỉ xuất hiện khi người dùng có lịch sử tìm kiếm) */}
                      {recentSearches.length > 0 && (
                        <div className="pb-3 border-b border-ink/5">
                          <div className="flex items-center justify-between mb-2 px-1">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                              <Clock size={13} className="text-[#4B6584]" />
                              <span>Tìm kiếm gần đây</span>
                            </h4>
                            <button
                              type="button"
                              onClick={clearAllRecentSearches}
                              className="text-[11px] font-medium text-ink/40 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              Xóa tất cả
                            </button>
                          </div>
                          
                          <div className="space-y-0.5">
                            {recentSearches.map((term, i) => (
                              <div
                                key={i}
                                onClick={async () => {
                                  setSearchQuery(term);
                                  setSelectedBookId("");
                                  saveRecentSearch(term);
                                  setIsSearching(true);
                                  try {
                                    const res = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(term)}`);
                                    const json = await res.json();
                                    setSearchResults(json.data || []);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                  setIsSearching(false);
                                }}
                                className="flex items-center justify-between py-2 px-3 hover:bg-[#FAF7F2] rounded-xl cursor-pointer text-ink/80 text-sm group transition-colors"
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <Clock size={14} className="text-ink/40 group-hover:text-[#4B6584] shrink-0" />
                                  <span className="group-hover:text-ink font-medium truncate">{term}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => removeRecentSearch(term, e)}
                                  className="p-1 text-ink/30 hover:text-rose-500 rounded-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="Xóa tìm kiếm này"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. XU HƯỚNG TÌM KIẾM THỊNH HÀNH (Động theo Database) */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-2 px-1 flex items-center gap-1.5">
                          <TrendingUp size={13} className="text-[#B12704]" />
                          <span>Xu hướng tìm kiếm thịnh hành</span>
                        </h4>
                        <div className="space-y-0.5">
                          {dynamicTrending.map((term, i) => (
                            <div
                              key={i}
                              onClick={async () => {
                                setSearchQuery(term);
                                setSelectedBookId("");
                                saveRecentSearch(term);
                                setIsSearching(true);
                                try {
                                  const res = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(term)}`);
                                  const json = await res.json();
                                  setSearchResults(json.data || []);
                                } catch (err) {
                                  console.error(err);
                                }
                                setIsSearching(false);
                              }}
                              className="flex items-center gap-3 py-2 px-3 hover:bg-[#FAF7F2] rounded-xl cursor-pointer text-ink/80 text-sm group transition-colors"
                            >
                              <Search size={14} className="text-ink/40 group-hover:text-[#B12704] transition-colors shrink-0" />
                              <span className="group-hover:text-ink font-medium truncate">{term}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* TRƯỜNG HỢP 2: Đang gõ từ khóa -> Hiện kết quả Autocomplete từ Database */
                    searchResults.length > 0 && (
                      <div>
                        {searchResults.map(book => {
                          const cleanName = cleanTitle(book.title);
                          return (
                            <div 
                              key={book.book_id} 
                              className="flex items-center justify-between p-3.5 hover:bg-[#FAF7F2] transition-colors border-b border-ink/5 last:border-0 group"
                            >
                              {/* Nhấp vào toàn bộ cuốn sách để chuyển ngay tới trang Chi tiết sách */}
                              <Link 
                                href={`/books/${book.book_id}`}
                                onClick={() => {
                                  saveRecentSearch(cleanName);
                                  setShowDropdown(false);
                                  if (typeof window !== "undefined") {
                                    try {
                                      sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify(book));
                                    } catch {}
                                  }
                                }}
                                onMouseEnter={() => {
                                  if (typeof window !== "undefined") {
                                    try {
                                      sessionStorage.setItem(`inkwell_book_${book.book_id}`, JSON.stringify(book));
                                    } catch {}
                                  }
                                }}
                                className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                              >
                                <img 
                                  src={book.image_url ? book.image_url.replace(/^http:\/\//i, "https://").replace(/:\/\/(?:imagei|s)\.gr-assets\.com/i, "://images.gr-assets.com").replace(/(\d+)[ms]\//i, "$1l/") : ""} 
                                  alt={cleanName} 
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-14 object-cover rounded shadow-xs flex-shrink-0 bg-ink/5" 
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <div className="truncate pr-2">
                                  <h4 className="font-bold text-ink text-sm leading-tight line-clamp-1 group-hover:text-[#B12704] transition-colors">
                                    {cleanName}
                                  </h4>
                                  <p className="text-xs text-ink/50 mt-1 truncate">
                                    {typeof book.author === 'string' ? book.author.replace(/\[|\]|'/g, '') : book.author}
                                  </p>
                                </div>
                              </Link>

                              {/* Nút bấm nhanh để chạy gợi ý sách tương tự ngay tại Trang chủ */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  saveRecentSearch(cleanName);
                                  setSearchQuery(cleanName);
                                  setSelectedBookId(book.book_id.toString());
                                  setShowDropdown(false);
                                  fetchHybridForBook(book.book_id.toString());
                                }}
                                className="text-xs font-semibold text-[#B12704] hover:bg-[#FFF5F2] border border-[#B12704]/30 px-3 py-1.5 rounded-lg shrink-0 ml-2 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                                title="Xem các sách có gu tương đồng cuốn này"
                              >
                                <Sparkles size={13} className="text-[#B12704]" />
                                <span>Gợi ý tương tự</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {error && <p className="text-terracotta mt-4 text-sm font-medium bg-red-50 inline-block px-4 py-2 rounded-full">{error}</p>}

          {!isLoggedIn && (
            <div className="mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-ink/10 text-xs text-ink/80 shadow-xs">
              <Sparkles size={14} className="text-[#B12704]" />
              <span>Muốn nhận gợi ý theo gu đọc cá nhân?</span>
              <Link href="/login" className="font-bold text-[#B12704] hover:underline inline-flex items-center gap-0.5">
                Đăng nhập ngay <ArrowRight size={12} />
              </Link>
            </div>
          )}
          </div>
        </div>

        {/* Nút điều hướng Carousel Trước / Sau (Xuất hiện mượt mà khi hover vào banner) */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-ink/70 hover:text-ink shadow-md backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all cursor-pointer hover:scale-105 active:scale-95 border border-ink/10"
          title="Banner trước"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-ink/70 hover:text-ink shadow-md backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all cursor-pointer hover:scale-105 active:scale-95 border border-ink/10"
          title="Banner tiếp theo"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Kết quả AI Hybrid (Tự động cuộn xuống đây khi bấm tìm kiếm) */}
      {hybridBooks.length > 0 && (
        <section ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-ink/5"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-[#FFF5F2] p-3 rounded-full text-[#B12704]"><Sparkles size={24} /></div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink">Dành Riêng Cho Bạn</h2>
                <p className="text-ink/50 text-sm mt-1">Được tuyển chọn bởi thuật toán AI Hybrid (Nội dung & Cộng đồng)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
              {hybridBooks.map((book, i) => (
                <motion.div
                  key={book.book_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <BookCard book={book} isHybrid={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Gợi ý Cá nhân hóa theo Lịch sử Đọc của User Đăng nhập */}
      {personalizedBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-ink/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-ink/5">
              <div className="flex items-center gap-3">
                <div className="bg-[#FFF5F2] p-3 rounded-full text-[#B12704]"><Sparkles size={24} /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-ink">
                      Dành Riêng Cho {user?.name || `Độc giả #${user?.user_id}`}
                    </h2>
                    <span className="text-xs bg-ink/5 px-2.5 py-0.5 rounded-full font-mono text-ink/60">
                      User #{user?.user_id}
                    </span>
                  </div>
                  <p className="text-ink/50 text-sm mt-1">
                    Được đề xuất riêng dựa trên lịch sử đánh giá thực tế của bạn (Thuật toán Borda Fusion + Centroid)
                  </p>
                </div>
              </div>

              <Link 
                href="/profile"
                className="text-xs font-semibold text-[#B12704] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Xem hồ sơ gu đọc của tôi</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
              {personalizedBooks.map((book, i) => (
                <motion.div
                  key={book.book_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <BookCard book={book} isHybrid={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Mục Đề Xuất Tuyển Chọn (Recommended Reads Carousel) - Lấy dữ liệu sách từ Database */}
      <RecommendedReadsCarousel title="Gợi ý tuyển chọn" initialBooks={popularBooks} />

      {/* Sách Thịnh Hành (Popular) */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 scroll-mt-24">
        <div className="flex items-end justify-between mb-10 border-b border-ink/5 pb-6">
          <div>
            <h2 className="font-serif text-3xl font-bold text-ink mb-2">Sách Thịnh Hành</h2>
            <p className="text-ink/60 text-sm">Top 10 tác phẩm được yêu thích nhất mọi thời đại</p>
          </div>
          <Link 
            href="/trending" 
            className="text-sm font-bold text-terracotta hover:text-ink transition-colors uppercase tracking-wider hidden sm:flex items-center gap-1 group cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {popularBooks.length === 0 ? (
          <div className="text-center py-20 text-ink/40">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p>Đang tải dữ liệu từ máy chủ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-x-8 lg:gap-y-12">
            {popularBooks.slice(0, 10).map((book, i) => (
              <motion.div
                key={book.book_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 5) * 0.1, duration: 0.5 }}
              >
                <BookCard book={book} rank={book.rank || i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 scroll-mt-24">
        <div className="bg-ink rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="text-cream max-w-lg text-center md:text-left relative z-10">
            <h2 className="font-serif text-3xl font-bold mb-4">Đăng ký nhận bản tin.</h2>
            <p className="text-cream/60">Đăng ký để nhận danh sách gợi ý sách hàng tuần do AI tuyển chọn gửi trực tiếp vào email của bạn.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2 relative z-10">
            <input type="email" placeholder="Nhập địa chỉ email của bạn" className="px-6 py-3 rounded-full bg-cream/10 border border-cream/20 text-cream focus:outline-none focus:border-terracotta w-full md:w-64 placeholder:text-cream/30" />
            <button className="bg-terracotta text-cream px-6 py-3 rounded-full font-bold hover:bg-white hover:text-ink transition-colors whitespace-nowrap shadow-lg">Đăng ký</button>
          </div>
        </div>
      </section>

      {/* Bảng Chat trượt bên phải của Mercy AI (Slide-over Drawer) */}
      <MercyChatDrawer isOpen={isMercyOpen} onClose={() => setIsMercyOpen(false)} />

    </div>
  );
}

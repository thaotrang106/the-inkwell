"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Search, BookOpen, Compass, ArrowRight, Clock, X, Trash2, TrendingUp, ChevronLeft, ChevronRight, Users, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import RecommendedReadsCarousel from "@/components/RecommendedReadsCarousel";
import BundleDealsSection from "@/components/BundleDealsSection";
import { useAuth } from "@/context/AuthContext";
import { useMercy } from "@/context/MercyContext";
import { API_BASE_URL as BACKEND_URL } from "@/lib/api";
import { CURATED_BOOKS } from "@/lib/curatedBooks";
import { DEMO_READERS } from "@/lib/demoReaders";

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
  const { user, isLoggedIn, login, logout } = useAuth();
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
  
  // Trợ lý Mercy AI toàn cục
  const { openMercy } = useMercy();

  // Quản lý Lịch sử tìm kiếm gần đây (Cách 2)
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  interface HeroSlide {
    id: number;
    tag: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    desktopImg: string;
    mobileImg: string;
    objectPosition: string;
    objectPositionStyle?: string;
    badge: string;
    layout: "left" | "center";
  }

  // Danh sách các banner trang chủ (Tự động chuyển slide sau mỗi 5.5 giây)
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      tag: "TUYỂN TẬP VĂN HỌC & TRI THỨC",
      titleLine1: "Good Books",
      titleLine2: "Better Days",
      description: "Không gian hội tụ các tác phẩm kinh điển và công nghệ đề xuất thông minh. Khám phá những ấn phẩm giá trị được gợi ý theo gu đọc của bạn.",
      desktopImg: "/hero banner_desktop.png",
      mobileImg: "/hero banner_mobile.jpg",
      objectPosition: "object-bottom md:object-[right_bottom]",
      badge: "Không gian Văn chương",
      layout: "left",
    },
    {
      id: 2,
      tag: "HỆ THỐNG GỢI Ý THÔNG MINH • MERCY AI",
      titleLine1: "Thủ Thư Số",
      titleLine2: "Cá Nhân Hóa Đọc",
      description: "Vượt xa công cụ tìm kiếm thông thường. Mercy AI ứng dụng mô hình lai để phân tích gu đọc và ngữ cảnh, giúp bạn tiếp cận chính xác tác phẩm cần tìm.",
      desktopImg: "/cozy_sunlit_reading_nook_banner.png",
      mobileImg: "/cozy_sunlit_reading_nook_banner.jpg",
      objectPosition: "object-[20%_center] md:object-[20%_center] lg:object-[20%_center]",
      objectPositionStyle: "20% center",
      badge: "Trợ lý Văn học AI",
      layout: "left",
    },
    {
      id: 3,
      tag: "TUYỂN TẬP ẤN BẢN KINH ĐIỂN",
      titleLine1: "Vintage Classics",
      titleLine2: "Dấu Ấn Thời Gian",
      description: "Khám phá những ấn phẩm kinh điển được chọn lọc kỹ lưỡng, lưu giữ trọn vẹn giá trị nguyên tác và chuẩn mực xuất bản qua nhiều thế hệ.",
      desktopImg: "/vintage_book_cover_carousel.png",
      mobileImg: "/vintage_book_cover_carousel.png",
      objectPosition: "object-center",
      badge: "Bộ Sưu Tập Bìa Sách Cổ Điển",
      layout: "left",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tự động chuyển banner mỗi 5 giây (tự tạm dừng khi đang gõ tìm kiếm hoặc hover chuột, reset đếm khi chuyển slide)
  useEffect(() => {
    if (isPaused || showDropdown || isSearching) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [currentSlide, isPaused, showDropdown, isSearching, heroSlides.length]);

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
        "Harry Potter and the Sorcerer's Stone",
        "Twilight",
        "To Kill a Mockingbird",
        "The Great Gatsby",
        "The Fault in Our Stars"
      ];
  
  const searchRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = `${BACKEND_URL}/api/recommendations`;
  const SEARCH_API_URL = `${BACKEND_URL}/api/books/search`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
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
    // 1. Nếu là Độc giả mẫu trong Báo cáo Đồ án (User #35, #1, #75):
    // Luôn khóa vào danh mục sách may đo riêng chuẩn theo kịch bản đồ án,
    // không bị ghi đè bởi fallback popular của máy chủ backend khi chưa seed dữ liệu.
    const demoReader = DEMO_READERS.find((r) => r.user_id === userId);
    if (demoReader) {
      setPersonalizedBooks(demoReader.books);
      setIsPersonalizedLoading(false);
      return;
    }

    // 2. Với user thông thường khác, gọi API backend
    setIsPersonalizedLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${BACKEND_URL}/api/recommendations/foryou/${userId}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        const books = json.data || json.items || [];
        if (books && books.length > 0) {
          setPersonalizedBooks(books);
        }
      }
    } catch (err) {
      setPersonalizedBooks(DEMO_READERS[0].books);
    } finally {
      setIsPersonalizedLoading(false);
    }
  };

  useEffect(() => {
    // Phản hồi Autocomplete sau 300ms gõ phím (chuẩn Báo cáo Đồ án tốt nghiệp)
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
    }, 300);

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

  const isCentered = heroSlides[currentSlide]?.layout === "center";

  return (
    <div className="flex flex-col pb-20">
      
      {/* Hero Section with Multi-Banner Auto Carousel */}
      <section 
        className="relative min-h-[500px] md:min-h-[560px] lg:min-h-[620px] flex items-center group/hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Banner Slides với Crossfade đa tầng đồng thời (Hoàn toàn không nhấp nháy, không chớp trắng) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <picture className="w-full h-full">
                <source media="(max-width: 767px)" srcSet={slide.mobileImg} />
                <img 
                  src={slide.desktopImg} 
                  alt={slide.titleLine1} 
                  className={`w-full h-full object-cover ${slide.objectPosition}`}
                  style={slide.objectPositionStyle ? { objectPosition: slide.objectPositionStyle } : undefined}
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Lớp phủ mờ nhẹ tinh tế để chữ luôn sắc nét và tương thích tối đa với nền tường */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/80 via-[#FAF8F5]/45 via-40% to-transparent pointer-events-none hidden md:block z-2" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/70 to-[#FAF8F5]/30 pointer-events-none md:hidden z-2" />

        <div className={`w-full z-10 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto flex items-center transition-all duration-300 ${
          isCentered 
            ? "justify-center text-center" 
            : "justify-start text-left"
        }`}>
          <div className={`w-full transition-all duration-300 ${
            isCentered 
              ? "max-w-2xl mx-auto flex flex-col items-center text-center" 
              : "max-w-lg lg:max-w-xl text-left"
          }`}>
            {/* Chuyển đổi nội dung chữ mượt mà dạng Grid xếp chồng (Giữ nguyên chiều cao, tuyệt đối không bị giựt thanh tìm kiếm) */}
            <div className="grid grid-cols-1 grid-rows-1 w-full mb-7">
              {heroSlides.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <div
                    key={slide.id}
                    className={`col-start-1 row-start-1 w-full transition-all duration-700 ease-in-out ${
                      isActive 
                        ? "opacity-100 translate-y-0 pointer-events-auto" 
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    } ${isCentered ? "flex flex-col items-center text-center" : "text-left"}`}
                  >
                    <span className={`uppercase tracking-[0.3em] text-xs font-bold text-terracotta mb-3 block ${
                      isCentered ? "text-center mx-auto" : ""
                    }`}>
                      {slide.tag}
                    </span>
                    <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-4 leading-[1.08] tracking-tight ${
                      isCentered ? "text-center" : ""
                    }`}>
                      {slide.titleLine1}<br />
                      <span className="italic font-normal text-terracotta">
                        {slide.titleLine2}
                      </span>
                    </h1>
                    <p className={`text-ink/75 text-sm sm:text-base lg:text-lg leading-relaxed ${
                      isCentered ? "text-center max-w-xl mx-auto" : "max-w-lg text-left"
                    }`}>
                      {slide.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Search Bar phong cách Editorial: Khung viền mỏng tinh tế, bo góc 5px, nút Hỏi Mercy AI thanh lịch */}
            <form onSubmit={handleSearchSubmit} className={`relative w-full ${isCentered ? "max-w-xl mx-auto" : "max-w-lg lg:max-w-xl"}`} ref={searchRef}>
              <div 
                onClick={() => {
                  setShowDropdown(true);
                  inputRef.current?.focus();
                }}
                className="flex items-center w-full bg-white border border-stone-300 rounded-[5px] shadow-xs hover:border-stone-400 focus-within:border-[#1C1917] focus-within:ring-1 focus-within:ring-[#1C1917]/20 px-3.5 py-2 transition-all cursor-text font-sans"
              >
                <input 
                  ref={inputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => setShowDropdown(true)}
                  onClick={() => setShowDropdown(true)}
                  placeholder="Tìm theo tên sách, tác giả (VD: Harry Potter, Dune...)" 
                  className="w-full py-1.5 px-2 bg-transparent focus:outline-none text-[#1C1917] text-sm sm:text-base font-medium placeholder:text-stone-400"
                />

                {/* Icon Loading khi đang tìm */}
                {isSearching && (
                  <Loader2 className="text-[#1C1917] animate-spin shrink-0 mx-2" size={18} />
                )}

                {/* Icon Kính lúp tìm kiếm (Bấm vào để tìm gợi ý sách) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2 text-stone-500 hover:text-[#1C1917] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  title="Tìm kiếm sách gợi ý"
                >
                  {loading ? <Loader2 size={19} className="animate-spin text-[#1C1917]" /> : <Search size={19} />}
                </button>

                {/* Nút Ask Mercy phong cách Biên tập / Editorial: Outline đen than, bo góc 4px */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMercy(searchQuery.trim() || undefined);
                  }}
                  className="flex items-center gap-1.5 ml-2 px-3.5 py-2 rounded-[4px] border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white active:scale-95 text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <BookOpen size={14} />
                  <span>Hỏi Mercy AI</span>
                </button>
              </div>

            {/* Dropdown Menu: Trending Searches khi chưa gõ & Autocomplete khi đang gõ */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#FCFBF9] border border-stone-200 rounded-[6px] shadow-xl overflow-hidden z-50 text-left font-sans"
                >
                  {/* TRƯỜNG HỢP 1: Chưa gõ từ khóa -> Hiện "Tìm kiếm gần đây" + "Xu hướng thịnh hành" */}
                  {searchQuery.length < 2 ? (
                    <div className="p-4 sm:p-5 space-y-4 max-h-[420px] overflow-y-auto">
                      {/* 1. TÌM KIẾM GẦN ĐÂY (chỉ xuất hiện khi người dùng có lịch sử tìm kiếm) */}
                      {recentSearches.length > 0 && (
                        <div className="pb-3 border-b border-stone-200/80">
                          <div className="flex items-center justify-between mb-2 px-1">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-1.5">
                              <Clock size={13} className="text-stone-500" />
                              <span>Tìm kiếm gần đây</span>
                            </h4>
                            <button
                              type="button"
                              onClick={clearAllRecentSearches}
                              className="text-[11px] font-medium text-stone-400 hover:text-rose-700 transition-colors cursor-pointer"
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
                                className="flex items-center justify-between py-2 px-3 hover:bg-stone-100 rounded-[4px] cursor-pointer text-stone-800 text-sm group transition-colors"
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <Clock size={14} className="text-stone-400 group-hover:text-stone-700 shrink-0" />
                                  <span className="group-hover:text-stone-900 font-medium truncate">{term}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => removeRecentSearch(term, e)}
                                  className="p-1 text-stone-300 hover:text-rose-600 rounded-[3px] hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
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
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500 mb-2 px-1 flex items-center gap-1.5">
                          <TrendingUp size={13} className="text-[#881337]" />
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
                              className="flex items-center gap-3 py-2 px-3 hover:bg-stone-100 rounded-[4px] cursor-pointer text-stone-800 text-sm group transition-colors"
                            >
                              <Search size={14} className="text-stone-400 group-hover:text-[#881337] transition-colors shrink-0" />
                              <span className="group-hover:text-stone-900 font-medium truncate">{term}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* TRƯỜNG HỢP 2: Đang gõ từ khóa -> Hiện kết quả Autocomplete từ Database */
                    searchResults.length > 0 && (
                      <div className="divide-y divide-stone-100 max-h-[420px] overflow-y-auto">
                        {searchResults.map(book => {
                          const cleanName = cleanTitle(book.title);
                          return (
                            <div 
                              key={book.book_id} 
                              className="flex items-center justify-between p-3.5 hover:bg-stone-100/80 transition-colors group"
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
                                  src={
                                    book.image_url && !book.image_url.includes("nophoto")
                                      ? book.image_url.replace(/^http:\/\//i, "https://").replace(/:\/\/(?:imagei|s)\.gr-assets\.com/i, "://images.gr-assets.com").replace(/(\d+)[ms]\//i, "$1l/")
                                      : (book.isbn ? `https://covers.openlibrary.org/b/isbn/${String(book.isbn).trim().padStart(10, '0')}-L.jpg` : "")
                                  } 
                                  alt={cleanName} 
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-14 object-cover rounded-[3px] shadow-2xs flex-shrink-0 bg-stone-100" 
                                  onError={(e) => {
                                    if (book.isbn && !e.currentTarget.src.includes("openlibrary.org")) {
                                      e.currentTarget.src = `https://covers.openlibrary.org/b/isbn/${String(book.isbn).trim().padStart(10, '0')}-L.jpg`;
                                    } else {
                                      e.currentTarget.style.display = 'none';
                                    }
                                  }}
                                />
                                <div className="truncate pr-2">
                                  <h4 className="font-serif font-bold text-stone-900 text-sm leading-tight line-clamp-1 group-hover:text-[#881337] transition-colors">
                                    {cleanName}
                                  </h4>
                                  <p className="text-xs text-stone-500 mt-1 truncate font-sans">
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
                                className="text-xs font-medium text-stone-700 hover:text-white bg-white hover:bg-[#1C1917] border border-stone-300 hover:border-[#1C1917] px-3 py-1.5 rounded-[4px] shrink-0 ml-2 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap font-sans shadow-2xs"
                                title="Xem các sách có gu tương đồng cuốn này"
                              >
                                <BookOpen size={12} />
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

          {error && (
            <p className={`text-stone-800 mt-4 text-xs font-medium bg-stone-100 border border-stone-200 inline-block px-4 py-2 rounded-[4px] ${
              isCentered ? "mx-auto text-center" : ""
            }`}>
              {error}
            </p>
          )}

          {/* Trạng thái chào mừng độc giả cá nhân hóa (Phong cách thương mại điện tử sang trọng) */}
          <div className={`mt-5 flex items-center gap-2.5 flex-wrap ${isCentered ? "justify-center" : ""}`}>
            {isLoggedIn && user ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200/90 shadow-2xs text-xs text-stone-700 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  Xin chào, <strong className="font-semibold text-stone-900">{user.name}</strong>
                </span>
                <span className="text-stone-300">•</span>
                <a
                  href="#personalized-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("personalized-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[#881337] hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Gợi ý theo gu đọc của bạn <ArrowRight size={11} />
                </a>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xs border border-stone-200/80 shadow-2xs text-xs text-stone-600 font-sans">
                <Sparkles size={13} className="text-[#881337]" />
                <span>Muốn nhận gợi ý theo gu đọc của bạn?</span>
                <Link
                  href="/login"
                  className="text-[#881337] hover:underline font-semibold inline-flex items-center gap-0.5 ml-1"
                >
                  Đăng nhập ngay <ArrowRight size={11} />
                </Link>
              </div>
            )}
          </div>
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

        {/* Chỉ báo các slide (Slide Indicators) */}
        <div className="absolute bottom-3 sm:bottom-5 right-6 sm:right-10 z-20 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-ink/10 shadow-xs">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Chuyển đến banner ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx 
                  ? "w-6 h-2 bg-[#B12704]" 
                  : "w-2 h-2 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
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
            <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-ink/5">
              <div className="w-11 h-11 rounded-full border border-stone-200 bg-white flex items-center justify-center shrink-0 text-[#881337] shadow-2xs">
                <Compass size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#1C1917] tracking-tight">
                  Dành Riêng Cho Bạn
                </h2>
                <p className="text-stone-500 font-sans text-xs sm:text-sm mt-1">
                  Dựa trên gu đọc và tâm trạng của bạn
                </p>
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
        <section id="personalized-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 mb-16 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-ink/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-ink/5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full border border-stone-200 bg-white flex items-center justify-center shrink-0 text-[#881337] shadow-2xs">
                  <Compass size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#1C1917] tracking-tight">
                    Dành Riêng Cho {
                      (DEMO_READERS.find(r => r.user_id === user?.user_id)?.shortName || user?.name || "Bạn")
                        .replace(/\s*\(\s*#\d+\s*\)/g, "")
                        .replace(/^Độc giả\s+/i, "")
                        .trim()
                    }
                  </h2>
                  <p className="text-stone-500 font-sans text-xs sm:text-sm mt-1">
                    {DEMO_READERS.find(r => r.user_id === user?.user_id)?.genre 
                      ? `${DEMO_READERS.find(r => r.user_id === user?.user_id)?.genre} • Dựa trên gu đọc và tâm trạng của bạn`
                      : "Dựa trên gu đọc và tâm trạng của bạn"}
                  </p>
                </div>
              </div>

              <Link 
                href="/profile"
                className="text-xs sm:text-sm font-sans font-medium text-[#1C1917] hover:text-[#881337] transition-colors flex items-center gap-1.5 self-start sm:self-auto group cursor-pointer"
              >
                <span>Xem hồ sơ gu đọc của tôi</span>
                <ArrowRight size={14} strokeWidth={1.5} className="text-[#1C1917]/70 group-hover:text-[#881337] group-hover:translate-x-1 transition-all" />
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

      {/* Khối Ưu Đãi Combo Sách (Bundle Book Deals) - Tiếng Việt */}
      <BundleDealsSection />

      {/* Mục Đề Xuất Tuyển Chọn (Recommended Reads Carousel) - Tuyển tập văn học kinh điển & kiệt tác tư tưởng */}
      <RecommendedReadsCarousel title="Gợi ý tuyển chọn" initialBooks={CURATED_BOOKS} />

      {/* Sách Thịnh Hành (Popular) - Phong cách Editorial cao cấp */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 scroll-mt-24">
        <div className="flex items-end justify-between mb-10 border-b border-stone-200/80 pb-6">
          <div>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-1.5 block">
              THE INKWELL CANON • TUYỂN CHỌN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight mb-2">
              Sách Thịnh Hành
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm font-sans">
              Top 10 tác phẩm được yêu thích nhất mọi thời đại
            </p>
          </div>
          <Link 
            href="/trending" 
            className="text-xs sm:text-sm font-sans font-medium text-[#1C1917] hover:text-stone-600 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5 group cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform stroke-[2]" />
          </Link>
        </div>
        
        {popularBooks.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-sans">
            <Loader2 className="animate-spin mx-auto mb-4 text-stone-700" size={32} />
            <p className="text-sm font-serif italic text-stone-500">Đang tải dữ liệu từ máy chủ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-x-8 lg:gap-y-12 items-stretch">
            {popularBooks.slice(0, 10).map((book, i) => (
              <motion.div
                key={book.book_id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 5) * 0.08, duration: 0.4 }}
                className="h-full flex flex-col"
              >
                <BookCard book={book} rank={book.rank || i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section: Phong cách Editorial tạp chí văn học thanh lịch */}
      <section id="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16 mb-6">
        <div className="bg-white border border-stone-300/80 rounded-[4px] p-8 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xs">
          <div className="max-w-xl text-center md:text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#881337] font-semibold block mb-1.5">
              BẢN TIN THE INKWELL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight mb-2">
              Đăng ký nhận bản tin
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              Đăng ký để nhận danh sách gợi ý sách hàng tuần được tuyển chọn bởi đội ngũ biên tập The Inkwell.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[4px] text-xs font-sans text-stone-700">
                <Check size={15} className="text-emerald-700 shrink-0" />
                <span>Cảm ơn bạn đã đăng ký nhận bản tin tuyển chọn từ The Inkwell.</span>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                  }
                }}
                className="flex flex-col sm:flex-row w-full md:w-auto gap-2.5"
              >
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn" 
                  className="px-4 py-2.5 rounded-[4px] bg-[#FAF7F2] border border-stone-300 text-[#1C1917] placeholder:text-stone-400 focus:outline-none focus:border-[#1C1917] w-full sm:w-72 md:w-80 text-xs font-sans transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-[#881337] hover:bg-[#70102d] text-white px-6 py-2.5 rounded-[4px] font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                >
                  ĐĂNG KÝ
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

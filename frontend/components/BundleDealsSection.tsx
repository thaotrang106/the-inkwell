"use client";

import { useState } from "react";
import { Check, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface BundleItem {
  id: string;
  badge: {
    countText: string;
    priceText: string;
  };
  title: string;
  subtitle: string;
  originalPrice: number;
  salePrice: number;
  actionText: string;
  description: string;
  books: {
    title: string;
    author: string;
    coverColor: string;
    textColor: string;
    pattern: string;
    coverImg?: string;
  }[];
}

const BUNDLE_DATA: BundleItem[] = [
  {
    id: "classics-bundle",
    badge: {
      countText: "Chọn 5 cuốn",
      priceText: "299.000 ₫",
    },
    title: "Tuyển Tập Văn Học Kinh Điển",
    subtitle: "5 cuốn chỉ 299.000 ₫",
    originalPrice: 460000,
    salePrice: 299000,
    actionText: "Tạo combo ngay",
    description: "Bộ 5 tác phẩm kinh điển mọi thời đại: Gatsby, Kiêu Hãnh & Định Kiến, Giết Con Chim Nhại, 1984, Bắt Trẻ Đồng Xanh.",
    books: [
      {
        title: "Pride & Prejudice",
        author: "Jane Austen",
        coverColor: "from-[#8B263E] to-[#5C1425]",
        textColor: "text-rose-100",
        pattern: "border-rose-300/40",
        coverImg: "https://images.gr-assets.com/books/1320399351l/1885.jpg",
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverColor: "from-[#1F4E5B] to-[#0E2E37]",
        textColor: "text-cyan-100",
        pattern: "border-cyan-300/40",
        coverImg: "https://images.gr-assets.com/books/1490528560l/4671.jpg",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverColor: "from-[#8C5E28] to-[#573914]",
        textColor: "text-amber-100",
        pattern: "border-amber-300/40",
        coverImg: "https://images.gr-assets.com/books/1553383690l/2657.jpg",
      },
      {
        title: "1984",
        author: "George Orwell",
        coverColor: "from-[#2C3E50] to-[#1A252F]",
        textColor: "text-slate-100",
        pattern: "border-slate-300/40",
        coverImg: "https://images.gr-assets.com/books/1348990566l/5470.jpg",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        coverColor: "from-[#9C4221] to-[#682710]",
        textColor: "text-orange-100",
        pattern: "border-orange-300/40",
        coverImg: "https://images.gr-assets.com/books/1398034300l/5107.jpg",
      },
    ],
  },
  {
    id: "prestige-bundle",
    badge: {
      countText: "Chọn 4 cuốn",
      priceText: "349.000 ₫",
    },
    title: "Bộ Tuyển Tập Cao Cấp",
    subtitle: "4 cuốn chỉ 349.000 ₫",
    originalPrice: 580000,
    salePrice: 349000,
    actionText: "Tạo combo ngay",
    description: "Bộ 4 ấn phẩm bìa cứng giả tưởng & sử thi kỳ vĩ: Chúa Nhẫn, Người Hobbit, Xứ Cát Dune, Harry Potter.",
    books: [
      {
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        coverColor: "from-[#1E3A2F] to-[#0D1E17]",
        textColor: "text-emerald-100",
        pattern: "border-emerald-300/40",
        coverImg: "https://images.gr-assets.com/books/1298411339l/34.jpg",
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        coverColor: "from-[#7A4B17] to-[#4D2D0B]",
        textColor: "text-amber-100",
        pattern: "border-amber-300/40",
        coverImg: "https://images.gr-assets.com/books/1546071216l/5907.jpg",
      },
      {
        title: "Harry Potter & Sorcerer",
        author: "J.K. Rowling",
        coverColor: "from-[#4A1E6D] to-[#2B0E42]",
        textColor: "text-purple-100",
        pattern: "border-purple-300/40",
        coverImg: "https://images.gr-assets.com/books/1474154022l/3.jpg",
      },
      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        coverColor: "from-[#1A2F4C] to-[#0A172A]",
        textColor: "text-sky-100",
        pattern: "border-sky-300/40",
        coverImg: "https://images.gr-assets.com/books/1303252999l/968.jpg",
      },
    ],
  },
  {
    id: "illustrated-classics",
    badge: {
      countText: "Chọn 5 cuốn",
      priceText: "249.000 ₫",
    },
    title: "Kinh Điển Minh Họa Thiếu Nhi",
    subtitle: "5 cuốn chỉ 249.000 ₫",
    originalPrice: 420000,
    salePrice: 249000,
    actionText: "Tạo combo ngay",
    description: "Bộ tranh minh họa màu cao cấp: Hoàng Tử Bé, Alice Ở Xứ Sở Diệu Kỳ, Peter Pan, Khu Vườn Bí Mật.",
    books: [
      {
        title: "The Little Prince",
        author: "Saint-Exupéry",
        coverColor: "from-[#1C4E80] to-[#0F2D4A]",
        textColor: "text-sky-100",
        pattern: "border-sky-300/40",
        coverImg: "https://images.gr-assets.com/books/1367545443l/157993.jpg",
      },
      {
        title: "Alice in Wonderland",
        author: "Lewis Carroll",
        coverColor: "from-[#8E2850] to-[#591430]",
        textColor: "text-pink-100",
        pattern: "border-pink-300/40",
        coverImg: "https://images.gr-assets.com/books/1327872220l/24213.jpg",
      },
      {
        title: "The Secret Garden",
        author: "F.H. Burnett",
        coverColor: "from-[#2A5C3B] to-[#14341F]",
        textColor: "text-emerald-100",
        pattern: "border-emerald-300/40",
        coverImg: "https://images.gr-assets.com/books/1327873635l/2998.jpg",
      },
      {
        title: "Peter Pan",
        author: "J.M. Barrie",
        coverColor: "from-[#633974] to-[#3B1F47]",
        textColor: "text-violet-100",
        pattern: "border-violet-300/40",
        coverImg: "https://images.gr-assets.com/books/1337714526l/34268.jpg",
      },
      {
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        coverColor: "from-[#875A18] to-[#543509]",
        textColor: "text-amber-100",
        pattern: "border-amber-300/40",
        coverImg: "https://images.gr-assets.com/books/1353029077l/100915.jpg",
      },
    ],
  },
  {
    id: "curated-explorer-sets",
    badge: {
      countText: "Trọn bộ 8 cuốn",
      priceText: "399.000 ₫",
    },
    title: "Bộ Sách Khám Phá & Tri Thức",
    subtitle: "8 cuốn chỉ 399.000 ₫",
    originalPrice: 650000,
    salePrice: 399000,
    actionText: "Xem trọn bộ sách",
    description: "Bộ 8 cuốn bách khoa tri thức, tư duy khoa học, lịch sử văn minh nhân loại và kỹ năng phát triển bản thân.",
    books: [
      {
        title: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        coverColor: "from-[#B8860B] to-[#705204]",
        textColor: "text-amber-100",
        pattern: "border-amber-300/40",
      },
      {
        title: "Vũ Trụ Trong Vỏ Hạt Dẻ",
        author: "Stephen Hawking",
        coverColor: "from-[#112233] to-[#050D17]",
        textColor: "text-cyan-100",
        pattern: "border-cyan-300/40",
      },
      {
        title: "Cosmos: Vũ Trụ",
        author: "Carl Sagan",
        coverColor: "from-[#2C1654] to-[#150A2A]",
        textColor: "text-purple-100",
        pattern: "border-purple-300/40",
      },
      {
        title: "Lược Sử Thời Gian",
        author: "Stephen Hawking",
        coverColor: "from-[#1A3A3A] to-[#0A1A1A]",
        textColor: "text-teal-100",
        pattern: "border-teal-300/40",
      },
      {
        title: "Bách Khoa Tri Thức",
        author: "The Inkwell Press",
        coverColor: "from-[#8B263E] to-[#4F1321]",
        textColor: "text-rose-100",
        pattern: "border-rose-300/40",
      },
    ],
  },
];

export default function BundleDealsSection() {
  const { addToCart } = useCart();
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const handleAddBundle = (bundle: BundleItem) => {
    addToCart(
      {
        book_id: 99000 + (bundle.id === "classics-bundle" ? 1 : bundle.id === "prestige-bundle" ? 2 : bundle.id === "illustrated-classics" ? 3 : 4),
        title: `[COMBO] ${bundle.title}`,
        author: "The Inkwell Curations",
        image_url: bundle.books[0]?.coverImg || "https://images.gr-assets.com/books/1320399351l/1885.jpg",
        price: bundle.salePrice,
      },
      1
    );

    setAddedBundleId(bundle.id);
    setTimeout(() => {
      setAddedBundleId(null);
    }, 2000);
  };

  return (
    <section className="w-full py-16 sm:py-20 bg-white border-b border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-stone-500 font-semibold mb-2 block">
            TIẾT KIỆM HƠN CÙNG THE INKWELL
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1C1917] tracking-tight mb-3">
            Combo Sách Tuyển Chọn
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl mx-auto">
            Tự phối combo theo phong cách riêng hoặc sở hữu trọn bộ tác phẩm được tuyển lọc kỹ lưỡng. Lấp đầy tủ sách của bạn với chi phí tiết kiệm nhất.
          </p>

          {/* Nút Xem tất cả Combo */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("bundle-grid");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white font-sans font-medium text-xs sm:text-sm px-6 py-2.5 rounded-[4px] shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Xem Tất Cả Combo</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* 4 Cột Combo (Responsive: 1 cột mobile, 2 cột tablet, 4 cột desktop) */}
        <div id="bundle-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-stretch scroll-mt-24">
          {BUNDLE_DATA.map((bundle) => {
            const isAdded = addedBundleId === bundle.id;

            return (
              <div
                key={bundle.id}
                className="group flex flex-col justify-between items-center text-center p-4 sm:p-5 rounded-lg transition-all duration-300 hover:bg-[#FAF8F5]/80 border border-transparent hover:border-stone-200"
              >
                {/* 1. Kệ sách 3D trực quan với các gáy sách đứng thẳng + Huy hiệu tròn */}
                <div className="relative w-full max-w-[240px] h-[190px] sm:h-[210px] flex items-end justify-center pb-2 select-none">
                  
                  {/* Huy hiệu tròn nổi bật ở góc trên bên trái */}
                  <div className="absolute top-0 left-2 z-20 w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full bg-white border border-stone-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center p-1 text-center transition-transform group-hover:scale-108">
                    <span className="text-[8px] sm:text-[9px] font-sans font-medium text-stone-500 leading-tight">
                      {bundle.badge.countText}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-serif font-black text-[#881337] tracking-tight leading-tight mt-0.5">
                      {bundle.badge.priceText}
                    </span>
                  </div>

                  {/* Dãy sách đứng trên kệ (Perspective Book Spine Stack) */}
                  <div className="relative flex items-end justify-center gap-1 sm:gap-1.5 h-[160px] sm:h-[175px] w-full px-4 transition-transform duration-300 group-hover:-translate-y-1.5">
                    {bundle.books.map((b, idx) => {
                      const heights = ["h-[94%]", "h-[100%]", "h-[97%]", "h-[95%]", "h-[92%]"];
                      const widths = ["w-[30px]", "w-[34px]", "w-[32px]", "w-[33px]", "w-[30px]"];
                      const currentHeight = heights[idx % heights.length];
                      const currentWidth = widths[idx % widths.length];

                      return (
                        <div
                          key={idx}
                          className={`relative ${currentWidth} ${currentHeight} rounded-t-[3px] rounded-b-xs shadow-[2px_6px_14px_rgba(0,0,0,0.22)] bg-gradient-to-r ${b.coverColor} border-t border-r ${b.pattern} overflow-hidden flex flex-col justify-between py-2 items-center shrink-0 transition-transform duration-300 hover:scale-105 hover:z-10`}
                          style={{
                            boxShadow: "inset 2px 0 3px rgba(255,255,255,0.2), inset -2px 0 3px rgba(0,0,0,0.35)",
                          }}
                        >
                          {/* Đường gân gáy sách mạ vàng */}
                          <div className="w-full flex flex-col gap-1 px-1">
                            <div className="w-full h-[1px] bg-amber-200/40"></div>
                            <div className="w-full h-[1px] bg-amber-200/20"></div>
                          </div>

                          {/* Tên sách dọc trên gáy */}
                          <p
                            className={`text-[8px] font-serif font-bold uppercase tracking-wider ${b.textColor} line-clamp-2 px-1 text-center`}
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                          >
                            {b.title}
                          </p>

                          {/* Chi tiết chân gáy sách */}
                          <div className="w-full flex flex-col gap-1 px-1">
                            <div className="w-full h-[1px] bg-amber-200/30"></div>
                            <div className="w-2 h-2 rounded-full border border-amber-200/30 mx-auto"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mặt kệ sách nằm ngang (Podium / Shelf Base) */}
                  <div className="absolute bottom-0 inset-x-2 h-[8px] bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 rounded-xs shadow-[0_4px_8px_rgba(0,0,0,0.15)] border-t border-white/60"></div>
                  {/* Bóng đổ gầm kệ */}
                  <div className="absolute -bottom-2 inset-x-4 h-2 bg-black/15 blur-sm rounded-full"></div>
                </div>

                {/* 2. Thông tin Bundle */}
                <div className="mt-5 w-full flex flex-col items-center flex-1">
                  <h3 className="font-serif font-bold text-[#1C1917] text-base sm:text-lg group-hover:text-[#881337] transition-colors line-clamp-1">
                    {bundle.title}
                  </h3>
                  
                  <p className="font-sans font-medium text-stone-600 text-xs sm:text-sm mt-1">
                    {bundle.subtitle}
                  </p>

                  <p className="text-[11px] text-stone-400 line-clamp-2 font-sans mt-1.5 px-2">
                    {bundle.description}
                  </p>

                  {/* Nút hành động Tạo Combo / Thêm vào giỏ */}
                  <div className="mt-auto pt-4 w-full flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleAddBundle(bundle)}
                      className="text-xs font-semibold text-stone-900 group-hover:text-[#881337] underline underline-offset-4 cursor-pointer transition-colors flex items-center gap-1 active:scale-95"
                    >
                      {isAdded ? (
                        <span className="text-emerald-700 flex items-center gap-1 no-underline font-bold">
                          <Check size={14} className="stroke-[2.5]" /> Đã thêm vào giỏ!
                        </span>
                      ) : (
                        <span>{bundle.actionText}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
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
  image: string;
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
    image: "/bundles/bundle_classics.jpg",
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
    image: "/bundles/bundle_prestige.jpg",
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
    image: "/bundles/bundle_illustrated.jpg",
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
    image: "/bundles/bundle_explorer.jpg",
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
        image_url: bundle.image,
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
                {/* 1. Hình ảnh Chụp Thực Tế Kệ Sách 3D + Huy hiệu tròn nổi bật */}
                <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden flex items-center justify-center bg-white group/image p-1">
                  
                  {/* Huy hiệu tròn nổi bật ở góc trên bên trái */}
                  <div className="absolute top-1 left-2 z-20 w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.14)] flex flex-col items-center justify-center p-1 text-center transition-transform group-hover:scale-108">
                    <span className="text-[8px] sm:text-[9px] font-sans font-medium text-stone-500 leading-tight">
                      {bundle.badge.countText}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-serif font-black text-[#881337] tracking-tight leading-tight mt-0.5">
                      {bundle.badge.priceText}
                    </span>
                  </div>

                  {/* Ảnh chụp thực tế của combo sách */}
                  <img
                    src={bundle.image}
                    alt={bundle.title}
                    className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-104 select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
                  />
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

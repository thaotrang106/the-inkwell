"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Gift, 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  Tag,
  Star,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface BundleBookDetail {
  title: string;
  author: string;
  genre: string;
  format: string;
  highlight: string;
}

interface FullBundle {
  id: string;
  category: "classics" | "prestige" | "illustrated" | "explorer";
  badge: {
    countText: string;
    priceText: string;
  };
  title: string;
  tagline: string;
  originalPrice: number;
  salePrice: number;
  savePercent: number;
  image: string;
  overview: string;
  giftIncludes: string[];
  books: BundleBookDetail[];
}

const ALL_BUNDLES: FullBundle[] = [
  {
    id: "classics-bundle",
    category: "classics",
    badge: {
      countText: "Chọn 5 cuốn",
      priceText: "299.000 ₫",
    },
    title: "Tuyển Tập Văn Học Kinh Điển",
    tagline: "5 kiệt tác văn chương bất hủ định hình tâm thức nhân loại",
    originalPrice: 460000,
    salePrice: 299000,
    savePercent: 35,
    image: "/bundles/bundle_classics.jpg",
    overview: "Bộ sưu tập tập hợp 5 kiệt tác văn học kinh điển được bạn đọc toàn cầu ngưỡng mộ suốt nhiều thế kỷ. Từ bức tranh phồn hoa lẫn bi kịch của Thời đại Jazz trong Gatsby, đến tiếng nói công lý chấn động trong Giết Con Chim Nhại, mỗi cuốn sách là một tượng đài tư tưởng mở rộng thế giới quan của độc giả.",
    giftIncludes: [
      "Bộ 5 bookmark dập chìm họa tiết The Inkwell Vintage",
      "Hộp quà giấy mộc kraft cứng cáp chống va đập",
      "Thiệp cảm ơn đề tặng và niêm phong sáp mộc",
      "Miễn phí vận chuyển hỏa tốc toàn quốc"
    ],
    books: [
      {
        title: "The Great Gatsby (Đại Gia Gatsby)",
        author: "F. Scott Fitzgerald",
        genre: "Văn học cổ điển Mỹ",
        format: "Bìa mềm áo ôm cao cấp",
        highlight: "Bức tranh tráng lệ và ám ảnh về Giấc mơ Mỹ thời đại Jazz rực rỡ."
      },
      {
        title: "Kiêu Hãnh & Định Kiến (Pride and Prejudice)",
        author: "Jane Austen",
        genre: "Kinh điển lãng mạn Anh",
        format: "Bìa mềm cao cấp",
        highlight: "Tuyệt tác tâm lý sắc sảo về tình yêu, giai cấp và sự thấu suốt bản thân."
      },
      {
        title: "Giết Con Chim Nhại (To Kill a Mockingbird)",
        author: "Harper Lee",
        genre: "Văn học nhân đạo",
        format: "Bìa mềm cao cấp",
        highlight: "Khúc ca lay động lòng người về lòng trắc ẩn, lương tri và công lý."
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopia / Tư tưởng",
        format: "Bìa mềm cao cấp",
        highlight: "Kiệt tác tiên tri sắc lạnh về quyền lực, tự do tư tưởng và nhân tính."
      },
      {
        title: "Bắt Trẻ Đồng Xanh (The Catcher in the Rye)",
        author: "J.D. Salinger",
        genre: "Hiện sinh & Tuổi trẻ",
        format: "Bìa mềm cao cấp",
        highlight: "Tiếng thở dài đầy chân thành của tuổi trẻ giữa một thế giới người lớn giả tạo."
      }
    ]
  },
  {
    id: "prestige-bundle",
    category: "prestige",
    badge: {
      countText: "Chọn 4 cuốn",
      priceText: "349.000 ₫",
    },
    title: "Bộ Tuyển Tập Sử Thi & Kỳ Ảo Cao Cấp",
    tagline: "4 pho sử thi và thế giới kỳ ảo đồ sộ bậc nhất kho tàng nhân loại",
    originalPrice: 580000,
    salePrice: 349000,
    savePercent: 40,
    image: "/bundles/bundle_prestige.jpg",
    overview: "Dành riêng cho những độc giả khao khát phiêu lưu vào những vũ trụ hư cấu kỳ vĩ nhất từng được xây dựng. Từ vùng Trung Địa huyền thoại của Tolkien đến sa mạc Arrakis trong Xứ Cát Dune, bộ sưu tập mang lại trải nghiệm choáng ngợp về ngôn ngữ, triết học và huyền thoại học.",
    giftIncludes: [
      "Bộ 4 postcard bản đồ Trung Địa & Vũ trụ Xứ Cát",
      "Bookmark lụa thêu chỉ vàng The Inkwell Heritage",
      "Đóng gói hộp quà chuyên biệt dành cho sách bìa dày",
      "Miễn phí vận chuyển toàn quốc"
    ],
    books: [
      {
        title: "Chúa Tể Những Chiếc Nhẫn (The Fellowship of the Ring)",
        author: "J.R.R. Tolkien",
        genre: "Sử thi kỳ ảo cao cấp",
        format: "Bìa cứng gáy vải",
        highlight: "Bức tranh kỳ vĩ nhất về cuộc chiến chống lại bóng tối và sức mạnh tình bạn."
      },
      {
        title: "Người Hobbit (The Hobbit)",
        author: "J.R.R. Tolkien",
        genre: "Kỳ ảo cổ điển",
        format: "Bìa cứng minh họa",
        highlight: "Khởi nguồn chuyến phiêu lưu bất hủ của Bilbo Baggins vượt qua Dãy Núi Mù Sương."
      },
      {
        title: "Xứ Cát (Dune)",
        author: "Frank Herbert",
        genre: "Khoa học viễn tưởng sử thi",
        format: "Bìa mềm cao cấp",
        highlight: "Tuyệt phẩm sci-fi đồ sộ về sinh thái, chính trị đế chế và đấng cứu thế."
      },
      {
        title: "Harry Potter và Hòn Đá Phù Thủy",
        author: "J.K. Rowling",
        genre: "Kỳ ảo hiện đại",
        format: "Bìa mềm cao cấp",
        highlight: "Cánh cổng mở ra thế giới phù thủy diệu kỳ đồng hành cùng nhiều thế hệ."
      }
    ]
  },
  {
    id: "illustrated-classics",
    category: "illustrated",
    badge: {
      countText: "Chọn 5 cuốn",
      priceText: "249.000 ₫",
    },
    title: "Kinh Điển Minh Họa Thiếu Nhi & Gia Đình",
    tagline: "5 ấn phẩm màu nghệ thuật lưu giữ sự thuần khiết của tâm hồn",
    originalPrice: 420000,
    salePrice: 249000,
    savePercent: 41,
    image: "/bundles/bundle_illustrated.jpg",
    overview: "Một tủ sách tràn ngập ánh sáng, màu sắc và thơ mộng dành cho mọi lứa tuổi. Dù bạn là người lớn đang tìm lại đứa trẻ bên trong hay muốn nuôi dưỡng tình yêu sách cho con trẻ, những tác phẩm minh họa tinh tế này sẽ là người bạn đồng hành ấm áp nhất mỗi tối.",
    giftIncludes: [
      "Bộ tranh dán sticker nghệ thuật Hoàng Tử Bé",
      "Hộp quà gia đình thiết kế ấm cúng",
      "Bookmark gỗ khắc laser The Inkwell Storybook",
      "Miễn phí vận chuyển toàn quốc"
    ],
    books: [
      {
        title: "Hoàng Tử Bé (Le Petit Prince)",
        author: "Antoine de Saint-Exupéry",
        genre: "Triết lý cổ tích",
        format: "Minh họa màu nước nguyên bản",
        highlight: "Lời nhắc nhở dịu dàng: 'Người ta chỉ thấy rõ bằng trái tim, cái cốt lõi vô hình trước mắt'."
      },
      {
        title: "Alice Ở Xứ Sở Diệu Kỳ (Alice in Wonderland)",
        author: "Lewis Carroll",
        genre: "Văn học thiếu nhi kinh điển",
        format: "Minh họa phong cách cổ điển",
        highlight: "Chuyến du hành vào thế giới tưởng tượng bất tận cùng Thỏ Trắng và Xứ Thần Tiên."
      },
      {
        title: "Peter Pan",
        author: "J.M. Barrie",
        genre: "Phiêu lưu & Kỳ ảo",
        format: "Minh họa màu toàn trang",
        highlight: "Vùng đất Neverland bất tử và niềm tin thơ ngây vào những giấc mơ bay bổng."
      },
      {
        title: "Khu Vườn Bí Mật (The Secret Garden)",
        author: "Frances Hodgson Burnett",
        genre: "Văn học nuôi dưỡng tâm hồn",
        format: "Bìa mềm minh họa màu",
        highlight: "Sức mạnh chữa lành kỳ diệu của thiên nhiên và tình yêu thương chân thành."
      },
      {
        title: "Gió Qua Rặng Liễu (The Wind in the Willows)",
        author: "Kenneth Grahame",
        genre: "Văn học đồng quê Anh",
        format: "Minh họa màu cao cấp",
        highlight: "Khúc ca thanh bình về tình bạn chân chất bên bờ sông nước mộng mơ."
      }
    ]
  },
  {
    id: "curated-explorer-sets",
    category: "explorer",
    badge: {
      countText: "Trọn bộ 8 cuốn",
      priceText: "399.000 ₫",
    },
    title: "Bộ Sách Khám Phá & Khai Phóng Tri Thức",
    tagline: "8 công trình tinh hoa bồi đắp tư duy khoa học, lịch sử và nhân sinh quan",
    originalPrice: 650000,
    salePrice: 399000,
    savePercent: 39,
    image: "/bundles/bundle_explorer.jpg",
    overview: "Gói sách toàn diện dành cho những bộ óc ham học hỏi và khao khát mở rộng chiều kích tri thức. Từ khởi nguồn vũ trụ, tiến trình văn minh loài người đến cách não bộ ra quyết định, bộ sách trang bị hệ thống tư duy nền tảng vững chắc cho thời đại thông tin.",
    giftIncludes: [
      "Sổ tay ghi chú tư duy The Inkwell Field Notes",
      "Bộ 8 bookmark tóm lược ý niệm tri thức",
      "Hộp đóng gói bảo vệ đa tầng chuyên dụng cho bộ lớn",
      "Miễn phí vận chuyển toàn quốc"
    ],
    books: [
      {
        title: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        genre: "Lịch sử & Nhân loại học",
        format: "Bìa mềm cao cấp",
        highlight: "Góc nhìn đột phá về hành trình vươn lên thống trị hành tinh của loài người."
      },
      {
        title: "Vũ Trụ (Cosmos)",
        author: "Carl Sagan",
        genre: "Thiên văn & Triết học khoa học",
        format: "Bìa mềm cao cấp",
        highlight: "Thi ca hùng vĩ về vị trí khiêm nhường nhưng cao cả của con người giữa vũ trụ bao la."
      },
      {
        title: "Lược Sử Thời Gian",
        author: "Stephen Hawking",
        genre: "Vật lý lý thuyết đại chúng",
        format: "Bìa mềm cao cấp",
        highlight: "Khám phá bí ẩn của lỗ đen, nguồn gốc không-thời gian và thuyết vạn vật."
      },
      {
        title: "Tư Duy Nhanh & Chậm (Thinking, Fast and Slow)",
        author: "Daniel Kahneman",
        genre: "Tâm lý học hành vi",
        format: "Bìa mềm cao cấp",
        highlight: "Bóc tách hai hệ thống vận hành tâm trí và các định kiến sai lầm trong quyết định."
      },
      {
        title: "Nguyên Lý 80/20",
        author: "Richard Koch",
        genre: "Tối ưu hóa cuộc sống & Hiệu suất",
        format: "Bìa mềm cao cấp",
        highlight: "Bí quyết đạt được thành quả tối đa với sự tập trung vào những điều cốt lõi."
      },
      {
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        genre: "Kỹ năng giao tiếp & Thu phục lòng người",
        format: "Bìa mềm cao cấp",
        highlight: "Cẩm nang giao tiếp kinh điển vượt thời gian về sự thấu hiểu và tôn trọng."
      },
      {
        title: "Khởi Nghiệp Tinh Gọn (The Lean Startup)",
        author: "Eric Ries",
        genre: "Đổi mới sáng tạo & Kinh doanh",
        format: "Bìa mềm cao cấp",
        highlight: "Mô hình thử nghiệm nhanh, học hỏi liên tục để thích nghi và đột phá."
      },
      {
        title: "Lối Sống Tối Giản Thời Hiện Đại",
        author: "Fumio Sasaki",
        genre: "Phong cách sống & Tĩnh lặng",
        format: "Bìa mềm cao cấp",
        highlight: "Buông bỏ vật chất dư thừa để tìm lại sự thanh thản và tự do nội tâm."
      }
    ]
  }
];

export default function CombosPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredBundles = selectedFilter === "all" 
    ? ALL_BUNDLES 
    : ALL_BUNDLES.filter((b) => b.category === selectedFilter);

  const handleAddBundleToCart = (bundle: FullBundle, redirectToCart = false) => {
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
    setToastMessage(`Đã thêm "${bundle.title}" vào giỏ hàng!`);

    setTimeout(() => {
      setAddedBundleId(null);
      setToastMessage(null);
    }, 2800);

    if (redirectToCart) {
      router.push("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#881337] selection:text-white">
      
      {/* Toast thông báo thêm giỏ hàng */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check size={14} className="stroke-[3]" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
            <Link 
              href="/cart" 
              className="text-xs font-bold text-amber-300 hover:text-amber-200 underline ml-2 whitespace-nowrap"
            >
              Xem giỏ hàng &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Thanh điều hướng quay lại & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-stone-500 hover:text-[#881337] transition-colors font-medium group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Quay lại Trang chủ</span>
          </Link>
          
          <div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
            <Link href="/" className="hover:text-stone-700">Trang chủ</Link>
            <ChevronRight size={12} />
            <span className="text-stone-800 font-medium">Combo Sách Tuyển Chọn</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header trang Combo */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-12 sm:mb-16">
        <div className="relative rounded-2xl bg-white border border-stone-200/90 p-8 sm:p-12 overflow-hidden shadow-2xs">
          
          {/* Họa tiết trang trí mờ phía sau */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#881337]/5 blur-3xl pointer-events-none" />
          <div className="absolute right-12 top-10 hidden lg:block opacity-10 pointer-events-none">
            <BookOpen size={160} className="text-[#1C1917]" />
          </div>

          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#881337]/10 text-[#881337] text-xs font-bold font-mono tracking-wider uppercase mb-4">
              <Sparkles size={13} />
              BỘ SƯU TẬP TIẾT KIỆM • ƯU ĐÃI ĐẾN 41%
            </span>
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight leading-tight mb-4">
              Combo Sách Tuyển Chọn &amp; Hộp Quà Tri Thức
            </h1>
            
            <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
              Sở hữu những tác phẩm kinh điển, sử thi kỳ vĩ và sách bách khoa tri thức với mức giá ưu đãi đặc quyền. Mỗi combo đều được tuyển chọn kỹ lưỡng, đóng gói tỉ mỉ bằng hộp quà kraft bảo vệ cao cấp và tặng kèm bookmark lụa độc quyền của The Inkwell.
            </p>

            {/* Thanh cam kết giá trị */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#1C1917] flex items-center justify-center shrink-0">
                  <Truck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">Freeship Toàn Quốc</h4>
                  <p className="text-[10px] text-stone-500">Mọi đơn combo sách</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#1C1917] flex items-center justify-center shrink-0">
                  <Gift size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">Hộp Quà &amp; Bookmark</h4>
                  <p className="text-[10px] text-stone-500">Tặng kèm độc quyền</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#1C1917] flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">100% Chính Hãng</h4>
                  <p className="text-[10px] text-stone-500">Bản quyền xuất bản chuẩn</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#1C1917] flex items-center justify-center shrink-0">
                  <Tag size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">Tiết Kiệm Đến 41%</h4>
                  <p className="text-[10px] text-stone-500">So với mua lẻ từng cuốn</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 3. Bộ lọc phân loại Combo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            Tất Cả Combo ({ALL_BUNDLES.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("classics")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === "classics"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            Văn Học Kinh Điển
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("prestige")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === "prestige"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            Sử Thi &amp; Giả Tưởng
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("illustrated")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === "illustrated"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            Minh Họa &amp; Thiếu Nhi
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("explorer")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === "explorer"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            Bách Khoa &amp; Tri Thức
          </button>
        </div>
      </section>

      {/* 4. Danh sách các Combo chi tiết */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {filteredBundles.map((bundle, idx) => {
          const isAdded = addedBundleId === bundle.id;

          return (
            <article 
              key={bundle.id}
              id={bundle.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                
                {/* Cột trái: Hình ảnh Chụp Thực Tế Kệ Sách */}
                <div className="lg:col-span-5 relative bg-[#FAF8F5] p-8 sm:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-stone-200/80">
                  
                  {/* Badge số cuốn & giá nổi bật góc trên trái */}
                  <div className="absolute top-5 left-5 z-20 w-16 h-16 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200 shadow-md flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-sans font-medium text-stone-500 leading-tight">
                      {bundle.badge.countText}
                    </span>
                    <span className="text-[11px] font-serif font-black text-[#881337] tracking-tight leading-tight mt-0.5">
                      {bundle.badge.priceText}
                    </span>
                  </div>

                  {/* Tag tiết kiệm góc trên phải */}
                  <div className="absolute top-5 right-5 z-20 px-2.5 py-1 rounded bg-[#881337] text-white text-[10px] font-bold font-mono uppercase tracking-wider shadow-sm">
                    Tiết kiệm {bundle.savePercent}%
                  </div>

                  <div className="relative w-full aspect-[4/3] max-w-[380px] flex items-center justify-center">
                    <img
                      src={bundle.image}
                      alt={bundle.title}
                      className="w-full h-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] select-none hover:scale-102 transition-transform duration-500"
                    />
                  </div>

                  {/* Quà tặng đi kèm đóng khung */}
                  <div className="w-full mt-6 bg-white/80 rounded-xl p-4 border border-stone-200/70 text-left">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5 font-mono">
                      <Gift size={13} className="text-[#881337]" />
                      Đặc quyền đi kèm combo này:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-stone-600 font-sans">
                      {bundle.giftIncludes.map((gift, gIdx) => (
                        <li key={gIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{gift}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Cột phải: Thông tin chi tiết, danh sách sách & nút hành động */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#881337] font-mono">
                        COMBO #{idx + 1} • {bundle.badge.countText.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star size={14} className="fill-amber-400 stroke-amber-400" />
                        <Star size={14} className="fill-amber-400 stroke-amber-400" />
                        <Star size={14} className="fill-amber-400 stroke-amber-400" />
                        <Star size={14} className="fill-amber-400 stroke-amber-400" />
                        <Star size={14} className="fill-amber-400 stroke-amber-400" />
                        <span className="text-stone-400 text-[11px] font-mono ml-1">(5.0/5 từ độc giả)</span>
                      </div>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight mb-2">
                      {bundle.title}
                    </h2>
                    
                    <p className="font-serif italic text-sm text-[#881337] mb-4">
                      “{bundle.tagline}”
                    </p>

                    <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed mb-6">
                      {bundle.overview}
                    </p>

                    {/* Danh sách các tác phẩm trong bộ */}
                    <div className="mb-8">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-3 flex items-center justify-between font-mono pb-2 border-b border-stone-200">
                        <span>Danh mục tác phẩm trong combo ({bundle.books.length} cuốn):</span>
                        <span className="text-stone-400 text-[11px] font-normal lowercase">bản quyền chính ngạch</span>
                      </h4>

                      <div className="space-y-2.5">
                        {bundle.books.map((b, bIdx) => (
                          <div 
                            key={bIdx}
                            className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-stone-50 transition-colors"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-white text-stone-500 border border-stone-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {bIdx + 1}
                              </span>
                              <div>
                                <h5 className="text-xs sm:text-sm font-bold text-[#1C1917] font-serif">
                                  {b.title}
                                </h5>
                                <p className="text-[11px] text-stone-500 font-sans">
                                  {b.author} • <span className="italic">{b.genre}</span>
                                </p>
                              </div>
                            </div>
                            <div className="sm:text-right shrink-0 pl-7 sm:pl-0">
                              <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-stone-200/80 text-stone-600">
                                {b.format}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Thanh Giá & Nút Thêm vào giỏ / Mua ngay */}
                  <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-2xl sm:text-3xl font-black text-[#881337]">
                          {bundle.salePrice.toLocaleString("vi-VN")} ₫
                        </span>
                        <span className="text-sm font-mono text-stone-400 line-through">
                          {bundle.originalPrice.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-semibold font-sans mt-0.5">
                        Tiết kiệm {(bundle.originalPrice - bundle.salePrice).toLocaleString("vi-VN")} ₫ (gồm trọn bộ {bundle.books.length} cuốn)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddBundleToCart(bundle, false)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-stone-800 text-[#1C1917] hover:bg-stone-100 font-medium text-xs sm:text-sm transition-all active:scale-97 cursor-pointer"
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} className="text-emerald-600 stroke-[2.5]" />
                            <span className="text-emerald-700 font-bold">Đã thêm giỏ!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            <span>Thêm vào giỏ</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBundleToCart(bundle, true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1C1917] hover:bg-stone-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-97 cursor-pointer"
                      >
                        <span>Mua trọn bộ ngay</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </article>
          );
        })}
      </main>

      {/* 5. Khối gợi ý tùy biến combo hoặc nhờ Mercy AI tư vấn */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-2xl bg-gradient-to-br from-[#1C1917] to-stone-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          <div className="max-w-2xl relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B12704] font-semibold mb-2 block">
              TÙY PHỐI GU ĐỌC RIÊNG
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Muốn tự chọn 4 hoặc 5 cuốn sách theo sở thích cá nhân?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
              Bạn có thể tự do khám phá danh mục hàng ngàn đầu sách tại The Inkwell và thêm vào giỏ hàng. Khi đơn hàng có từ 4 cuốn trở lên, hệ thống sẽ tự động áp dụng chính sách ưu đãi đồng giá combo tốt nhất.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/trending"
                className="inline-flex items-center gap-2 bg-white text-[#1C1917] hover:bg-stone-100 font-medium text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Khám phá 50 Sách Thịnh Hành</span>
                <ArrowRight size={15} />
              </Link>
              
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm px-5 py-3 rounded-lg transition-colors border border-white/20 cursor-pointer"
              >
                <span>Nhờ tư vấn combo qua Hotline</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 hidden md:flex items-center justify-center pointer-events-none">
            <Sparkles size={240} className="text-white" />
          </div>

        </div>
      </section>

      {/* 6. FAQ & Câu hỏi thường gặp về Combo */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-stone-200">
        <div className="text-center mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500 block mb-2 font-semibold">
            GIẢI ĐÁP THẮC MẮC
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Câu Hỏi Thường Gặp Về Combo Sách
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200/80">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] mb-2">
              Sách trong combo có phải ấn bản mới và có bản quyền không?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              100% sách trong tất cả các combo tại The Inkwell đều là sách mới tinh, ấn bản chính thức có bản quyền từ các nhà xuất bản uy tín (NXB Trẻ, NXB Hội Nhà Văn, NXB Kim Đồng, Nhã Nam...). Chúng tôi cam kết hoàn tiền 200% nếu phát hiện sách sao chép bất hợp pháp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200/80">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] mb-2">
              Nếu tôi đã có sẵn 1 cuốn trong combo thì có thể đổi cuốn khác không?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              Hoàn toàn được! Bạn chỉ cần để lại ghi chú khi đặt hàng hoặc nhắn tin qua Mercy AI / Hotline 1900 6868, chuyên viên giám tuyển The Inkwell sẽ hỗ trợ đổi sang tác phẩm tương đương cùng thể loại.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200/80">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] mb-2">
              Quy cách đóng gói hộp quà combo có an toàn khi vận chuyển xa không?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              Tất cả các bộ combo đều được đóng gói tỉ mỉ bằng giấy mộc kraft, bọc màng khí chống sốc 3 lớp và đặt trong thùng carton định lượng cao có niêm phong The Inkwell, đảm bảo gáy sách và góc bìa nguyên vẹn tuyệt đối khi đến tay độc giả.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}

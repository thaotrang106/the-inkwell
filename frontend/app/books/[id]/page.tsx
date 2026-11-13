"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { Star, ShoppingCart, Play, BookOpen, ChevronRight, Share, ChevronDown, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import RecommendedReadsCarousel from "@/components/RecommendedReadsCarousel";
import ProductReviews from "@/components/ProductReviews";

const cleanTitle = (title: string) => {
  if (!title) return '';
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, '').trim();
};

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Trạng thái AI Mercy
  const [mercyMessage, setMercyMessage] = useState("");
  const [isMercyThinking, setIsMercyThinking] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [similarBooks, setSimilarBooks] = useState<any[]>([]);
  const [authorBooks, setAuthorBooks] = useState<any[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
        const json = await res.json();
        
        // Dữ liệu API trả về nằm trong json.data
        const demoBook = json.data;
        
        if (demoBook && !demoBook.price) {
          demoBook.price = Math.floor(Math.random() * (260 - 80) + 80) * 1000;
        }
        
        setBook(demoBook);
        setRelatedBooks(json.data?.slice(1, 5) || []);

        // Ghi nhận hành vi 'view' vào backend (Giai đoạn C)
        const currentUserId = user?.user_id || 1;
        fetch("${API_BASE_URL}/api/interactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            book_id: Number(id),
            interaction_type: "view",
          }),
        }).catch(() => {});
      } catch (e) {
        console.error("Error fetching book", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();

    // 1. Tải gợi ý sách tương tự (You may also like)
    fetch(`${API_BASE_URL}/api/recommendations/similar/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setSimilarBooks(json.data);
        } else {
          fetch(`${API_BASE_URL}/api/recommendations/hybrid/${id}`)
            .then((r) => r.json())
            .then((hj) => {
              if (hj.data && hj.data.length > 0) setSimilarBooks(hj.data);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    // 2. Tải sách khác cùng tác giả (Also By This Author)
    fetch(`${API_BASE_URL}/api/books/by-author/${id}?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setAuthorBooks(json.data);
        } else {
          setAuthorBooks([]);
        }
      })
      .catch(() => {
        setAuthorBooks([]);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center font-serif text-2xl text-ink/40 animate-pulse">Đang tải nội dung sách...</div>;
  }

  if (!book) {
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sách</div>;
  }

  const highResImg = book.image_url ? book.image_url.replace("s.gr-assets", "i.gr-assets") : "";
  const authorName = typeof book.author === 'string' ? book.author.replace(/\[|\]|'/g, '') : book.author;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };



    const askMercy = async () => {
    setIsMercyThinking(true); // Hiển thị trạng thái đang load
    setMercyMessage("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommendations/explain/${id}`);
      const json = await res.json();
      setMercyMessage(json.data); // Nhận câu trả lời từ Gemini
    } catch (e) {
      setMercyMessage("Xin lỗi, kết nối với tâm thức của Mercy đang bị gián đoạn.");
    } finally {
      setIsMercyThinking(false); // Tắt trạng thái load
    }
  };
  const handleAddToCartDetail = () => {
    addToCart(book, quantity);
    const currentUserId = user?.user_id || 1;
    fetch("${API_BASE_URL}/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "add_to_cart",
      }),
    }).catch(() => {});
  };

  const handlePurchaseDetail = () => {
    addToCart(book, quantity);
    const currentUserId = user?.user_id || 1;
    fetch("${API_BASE_URL}/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "purchase",
      }),
    }).catch(() => {});
    alert("Cảm ơn bạn đã mua sách! Hệ thống đã ghi nhận hành vi mua hàng để cá nhân hóa gợi ý cho bạn.");
  };

  const handleWishlistDetail = () => {
    const currentUserId = user?.user_id || 1;
    fetch("${API_BASE_URL}/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserId,
        book_id: book.book_id,
        interaction_type: "wishlist",
      }),
    }).catch(() => {});
    alert("Đã thêm vào danh sách yêu thích! Hệ thống đã ghi nhận để cập nhật gu đọc của bạn.");
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      
      {/* Breadcrumb */}
      <div className="text-sm text-ink/60 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Trang chủ</Link> <ChevronRight size={14} /> 
        <Link href="/discover" className="hover:underline">Sách</Link> <ChevronRight size={14} /> 
        <span className="text-ink truncate max-w-xs">{cleanTitle(book.title)}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Image & Samples (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="w-full max-w-[300px] mb-6">
            <img 
              src={highResImg} 
              alt={cleanTitle(book.title)} 
              className="w-full h-auto object-contain shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-ink/5" 
            />
          </div>
          
          {/* Sample Buttons (Like Amazon's Read Sample / Audible Sample) */}
          <div className="flex gap-2 w-full max-w-[300px]">
            <button className="flex-1 py-2 px-3 border border-ink/20 rounded-full text-sm font-medium text-ink hover:bg-ink/5 transition-colors flex items-center justify-center gap-2">
              <BookOpen size={16} /> Đọc thử
            </button>
            <button className="flex-1 py-2 px-3 border border-ink/20 rounded-full text-sm font-medium text-ink hover:bg-ink/5 transition-colors flex items-center justify-center gap-2">
              <Play size={16} /> Nghe thử
            </button>
          </div>
          
          <div className="w-full max-w-[300px] mt-8 pt-6 border-t border-ink/10 text-left">
            <h3 className="font-bold text-ink mb-3 flex items-center gap-2">Theo dõi tác giả <span className="text-ink/40 text-xs">ⓘ</span></h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-ink/10 overflow-hidden flex items-center justify-center text-ink/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p className="font-medium text-ink hover:text-terracotta cursor-pointer">{authorName}</p>
            </div>
          </div>
        </div>
        
        {/* CENTER COLUMN: Details & Description (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-ink leading-tight mb-1 pr-8">
              {cleanTitle(book.title)}
            </h1>
            <button className="text-ink/50 hover:text-ink"><Share size={20} /></button>
          </div>
          
          <div className="text-sm text-ink mb-2">
            Tác giả: <Link href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium">{authorName}</Link> 
            <span className="mx-2 text-ink/30">|</span> 
            Định dạng: <span className="font-medium">Bìa mềm</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="font-bold text-ink mr-1">{book.score || "4.6"}</span>
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="fill-[#FFA41C] text-[#FFA41C]" size={16} />
                ))}
              </div>
              <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer ml-2">
                ({book.ratings_count ? `${new Intl.NumberFormat("vi-VN").format(book.ratings_count)} đánh giá` : "Xem đánh giá"})
              </span>
            </div>
          </div>
          
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/10">
            {book.rank && (
              <>
                <span className="bg-[#232F3E] text-white text-xs font-bold px-2 py-1 rounded-sm">
                  Bảng xếp hạng thịnh hành
                </span>
                <span className="text-[#007185] text-sm font-medium hover:underline cursor-pointer">
                  #{book.rank} tuần này
                </span>
              </>
            )}
            <span className="ml-auto text-[#007185] text-sm hover:underline cursor-pointer">Xem tất cả phiên bản</span>
          </div>
          
          {/* Formats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="border border-ink/20 p-2 rounded cursor-pointer hover:bg-ink/5 text-center">
              <div className="font-bold text-sm text-ink">Bản điện tử (Kindle)</div>
              <div className="text-[#B12704] text-sm font-medium">{formatPrice(book.price * 0.6)}</div>
            </div>
            <div className="border-2 border-[#E77600] bg-[#FFF8F0] p-2 rounded cursor-pointer text-center relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#E77600] text-white text-[10px] font-bold px-2 rounded-sm whitespace-nowrap">Đã chọn</div>
              <div className="font-bold text-sm text-ink mt-1">Bìa mềm (Paperback)</div>
              <div className="text-[#B12704] text-sm font-medium">{formatPrice(book.price)}</div>
            </div>
            <div className="border border-ink/20 p-2 rounded cursor-pointer hover:bg-ink/5 text-center">
              <div className="font-bold text-sm text-ink">Bìa cứng (Hardcover)</div>
              <div className="text-[#B12704] text-sm font-medium">{formatPrice(book.price * 1.5)}</div>
            </div>
          </div>
          
          {/* Description */}
                    {/* Description */}
          <div className="prose prose-sm max-w-none text-ink/90 leading-relaxed font-sans mb-8">
            <p className="font-bold mb-4 uppercase text-xs tracking-wider text-terracotta">
              TÓM TẮT NỘI DUNG SÁCH
            </p>

            
            {/* Hiển thị nội dung thật từ Database */}
            <p className="whitespace-pre-line text-base">
              {book.description || "Chưa có thông tin giới thiệu cho cuốn sách này."}
            </p>

          </div>

          {/* Góc nhìn Cố vấn Mercy AI */}
          <div className="p-6 bg-[#FAF7F2] border border-[#B12704]/20 rounded-2xl mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-[#B12704]">
                <Sparkles size={18} className="fill-[#B12704]/20 text-[#B12704]" />
                <span className="text-base">Góc nhìn từ Cố vấn Mercy AI</span>
              </div>
              {!mercyMessage && (
                <button
                  type="button"
                  onClick={askMercy}
                  disabled={isMercyThinking}
                  className="text-xs font-semibold bg-[#B12704] hover:bg-[#8e1f03] text-white px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isMercyThinking ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>{isMercyThinking ? "Mercy đang suy nghĩ..." : "Hỏi Mercy về cuốn này"}</span>
                </button>
              )}
            </div>

            {isMercyThinking && (
              <div className="flex items-center gap-2 text-ink/60 text-xs italic py-3 bg-white/60 rounded-xl px-4 border border-ink/5">
                <Loader2 size={15} className="animate-spin text-[#B12704]" />
                <span>Mercy đang tra cứu và tổng hợp phân tích học thuật về tác phẩm này...</span>
              </div>
            )}

            {mercyMessage && (
              <div className="bg-white/80 rounded-xl p-4 border border-ink/5 text-sm text-ink/80 leading-relaxed font-sans whitespace-pre-line">
                {mercyMessage}
              </div>
            )}

            {!isMercyThinking && !mercyMessage && (
              <p className="text-xs text-ink/60 leading-relaxed">
                Nhấn "Hỏi Mercy về cuốn này" để nhận phân tích học thuật chuyên sâu về văn phong, chủ đề cốt lõi và giá trị văn học của tác phẩm từ Cố vấn Mercy AI.
              </p>
  
            )}

          </div>
        </div>
        
        {/* RIGHT COLUMN: Buy Box (col-span-3) */}
        <div className="lg:col-span-3">
          <div className="border border-ink/20 rounded-lg p-5 sticky top-24 shadow-sm">
            
            <div className="text-3xl font-bold text-[#B12704] mb-4">
              {formatPrice(book.price)}
            </div>
            
            <div className="text-sm text-ink/70 mb-4">
              <span className="text-[#007185] hover:underline cursor-pointer">Miễn phí đổi trả</span>
              <br/>
              Giao hàng miễn phí vào <strong>Ngày mai</strong>. Đặt trước trong 5 giờ 30 phút
              <br/>
              <span className="flex items-center gap-1 mt-1 text-[#007185] hover:underline cursor-pointer">
                Giao tới Việt Nam
              </span>
            </div>
            
            <h4 className="text-xl font-bold text-[#007600] mb-4">Còn hàng</h4>
            
            {/* Quantity Selector */}
            <div className="mb-4">
              <select 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-ink/30 rounded-md py-1.5 px-3 bg-[#F0F2F2] shadow-sm hover:bg-[#E3E6E6] w-full max-w-[100px] cursor-pointer"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>Số lượng: {n}</option>
                ))}
              </select>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCartDetail}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-ink py-2.5 rounded-full font-medium shadow-sm border border-[#FCD200] flex items-center justify-center gap-2 mb-3 transition-colors"
            >
              <ShoppingCart size={18} /> Thêm vào giỏ hàng
            </button>
            
            {/* Buy Now Button */}
            <button 
              onClick={handlePurchaseDetail}
              className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-ink py-2.5 rounded-full font-medium shadow-sm border border-[#FF8F00] transition-colors mb-4"
            >
              Mua ngay
            </button>
            
            <div className="text-xs text-ink/60 space-y-1">
              <div className="flex justify-between"><span className="w-24">Giao hàng từ</span> <span>The Inkwell</span></div>
              <div className="flex justify-between"><span className="w-24">Bán bởi</span> <span>The Inkwell</span></div>
              <div className="flex justify-between"><span className="w-24">Đổi trả</span> <span className="text-[#007185] hover:underline cursor-pointer">Hỗ trợ đổi trả trong 30 ngày</span></div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-ink/10">
              <button 
                onClick={handleWishlistDetail}
                className="w-full py-1.5 border border-ink/30 rounded shadow-sm text-sm font-medium hover:bg-ink/5"
              >
                Thêm vào danh sách yêu thích
              </button>
            </div>
            
          </div>
        </div>

      </div>

      {/* Phần Đánh Giá & Nhận Xét Của Độc Giả (Product Reviews) */}
      <ProductReviews 
        bookId={Number(id)} 
        bookTitle={cleanTitle(book.title)} 
        initialAverageRating={book.score || 4.5}
        initialRatingsCount={book.ratings_count || 0}
      />

      {/* 1. Phần Sách tương tự bạn có thể thích (You may also like) */}
      <div className="mt-16 border-t border-ink/10 pt-10">
        <RecommendedReadsCarousel 
          title="Có thể bạn cũng thích"
          subtitle="Những tác phẩm tương đồng về phong cách nghệ thuật và nội dung"
          initialBooks={similarBooks}
        />
      </div>

      {/* 2. Phần Sách khác cùng tác giả (Also By This Author - nếu không có dữ liệu thì để trống) */}
      {authorBooks && authorBooks.length > 0 && (
        <div className="mt-6 border-t border-ink/10 pt-10">
          <RecommendedReadsCarousel 
            title="Cùng tác giả"
            subtitle={`Các tác phẩm khác của cùng tác giả ${authorName}`}
            initialBooks={authorBooks}
            emptyHide={true}
          />
        </div>
      )}

    </div>
  );
}

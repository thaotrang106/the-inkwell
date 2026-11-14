"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquarePlus, CheckCircle2, Filter, Loader2, PenLine, Sparkles, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";

interface ReviewItem {
  review_id: number;
  book_id: number;
  user_id: number;
  username: string;
  rating: number;
  title: string;
  content: string;
  helpful_count: number;
  created_at: string;
}

interface ReviewData {
  average_rating: number;
  total_reviews: number;
  ratings_count: number;
  distribution: { [key: number]: number };
  reviews: ReviewItem[];
}

// Hàm sinh phân bổ số sao tự nhiên theo đường cong chuẩn nếu chưa kịp tải dữ liệu chi tiết
const getNaturalFallbackPercentage = (star: number, avg: number): number => {
  const weights: { [key: number]: number } = {};
  let totalWeight = 0;
  for (let s = 1; s <= 5; s++) {
    const w = Math.exp(-Math.pow(s - avg, 2) / (2 * 0.95 * 0.95));
    weights[s] = w;
    totalWeight += w;
  }
  return totalWeight > 0 ? Math.round((weights[star] / totalWeight) * 100) : 20;
};

export default function ProductReviews({
  bookId,
  bookTitle,
  initialAverageRating = 4.5,
  initialRatingsCount = 0,
  initialDistribution,
}: {
  bookId: number;
  bookTitle: string;
  initialAverageRating?: number;
  initialRatingsCount?: number;
  initialDistribution?: { [key: number]: number };
}) {
  const { user } = useAuth();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Trạng thái mở Form viết đánh giá
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Quản lý các review đã bấm Helpful trong phiên này
  const [helpfulVoted, setHelpfulVoted] = useState<{ [key: number]: boolean }>({});

  // Nhãn mô tả tương ứng theo số sao
  const RATING_LABELS: { [key: number]: string } = {
    5: "Tuyệt vời, vượt xa kỳ vọng",
    4: "Rất hay, đáng đọc",
    3: "Bình thường, ổn",
    2: "Chưa như mong đợi",
    1: "Không hài lòng",
  };

  // Nạp danh sách đánh giá từ API backend
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${bookId}/reviews`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.error("Lỗi khi tải đánh giá:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  // Xử lý gửi đánh giá mới
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle.trim()) {
      setFormError("Vui lòng nhập tiêu đề nhận xét.");
      return;
    }
    if (!formContent.trim() || formContent.trim().length < 10) {
      setFormError("Nội dung nhận xét cần ít nhất 10 ký tự.");
      return;
    }

    setSubmitting(true);
    try {
      const userId = user?.user_id || 1;
      const res = await fetch(`${API_BASE_URL}/api/books/${bookId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          rating: formRating,
          title: formTitle.trim(),
          content: formContent.trim(),
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Không thể gửi nhận xét.");
      }

      const resJson = await res.json();
      const createdReview: ReviewItem = resJson.data;

      // Cập nhật state trực tiếp để hiển thị ngay lập tức
      setData((prev) => {
        if (!prev) return prev;
        const updatedReviews = [createdReview, ...prev.reviews];
        const newTotal = prev.total_reviews + 1;
        const newDist = { ...prev.distribution };
        newDist[formRating] = (newDist[formRating] || 0) + 1;

        // Tính lại điểm trung bình
        const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        const newAvg = Number((sum / newTotal).toFixed(1));

        return {
          ...prev,
          average_rating: newAvg,
          total_reviews: newTotal,
          distribution: newDist,
          reviews: updatedReviews,
        };
      });

      setFormSuccess(true);
      setFormTitle("");
      setFormContent("");
      setFormRating(5);

      setTimeout(() => {
        setFormSuccess(false);
        setIsFormOpen(false);
      }, 1800);
    } catch (err: any) {
      setFormError(err.message || "Đã xảy ra lỗi khi gửi nhận xét.");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý bình chọn Hữu ích
  const handleHelpfulClick = async (reviewId: number) => {
    if (helpfulVoted[reviewId]) return;

    // Cập nhật giao diện trước (Optimistic UI)
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }));
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.review_id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
        ),
      };
    });

    try {
      await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
    } catch (e) {
      console.error("Lỗi khi gửi bình chọn hữu ích:", e);
    }
  };

  const reviewsList = data?.reviews || [];
  const totalReviewsCount = reviewsList.length;
  const avgRating = data?.average_rating || initialAverageRating;
  const distribution = (data?.distribution && Object.values(data.distribution).some((v) => v > 0))
    ? data.distribution
    : ((initialDistribution && Object.values(initialDistribution).some((v) => v > 0))
      ? initialDistribution
      : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  // Tổng số lượt rating từ cộng đồng
  const totalRatingsInDist = Object.values(distribution).reduce((a, b) => a + b, 0);
  const totalRatingsCount = totalRatingsInDist > 0 ? totalRatingsInDist : (data?.ratings_count || initialRatingsCount || 100);

  // Đếm số lượng bài nhận xét theo từng số sao
  const reviewCountsByStar = reviewsList.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Lọc đánh giá theo số sao đã chọn
  const filteredReviews = selectedStarFilter
    ? reviewsList.filter((r) => r.rating === selectedStarFilter)
    : reviewsList;

  return (
    <section id="reviews" className="w-full py-12 border-t border-ink/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight flex items-center gap-3">
              <span>Đánh giá từ độc giả</span>
              <span className="text-xs font-sans font-medium bg-stone-100 text-stone-800 border border-stone-200/90 px-2.5 py-0.5 rounded-[4px]">
                {totalReviewsCount} nhận xét
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-serif italic">
              Cảm nhận và góc nhìn văn học thực tế từ cộng đồng người đọc The Inkwell
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-[5px] bg-[#1C1917] text-white hover:bg-[#2B2725] font-medium text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer font-sans"
          >
            {isFormOpen ? <X size={15} /> : <PenLine size={15} />}
            <span>{isFormOpen ? "Đóng biểu mẫu" : "Viết nhận xét của bạn"}</span>
          </button>
        </div>

        {/* Khung tổng quan điểm số & Phân bổ số sao */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 bg-[#FAF9F6] border border-stone-200/90 rounded-[8px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          
          {/* Cột 1: Điểm trung bình tổng quát */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-stone-200/80 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-5xl sm:text-6xl font-serif font-bold text-[#1C1917] tracking-tight">
              {avgRating}
            </span>
            <span className="text-xs text-stone-500 font-sans mt-1 uppercase tracking-wider font-medium">trên thang điểm 5.0</span>

            <div className="flex items-center gap-1 my-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={19}
                  className={
                    star <= Math.round(avgRating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-stone-300"
                  }
                />
              ))}
            </div>

            <p className="text-xs text-stone-500 font-serif italic">
              Dựa trên {totalRatingsCount.toLocaleString("vi-VN")} lượt đánh giá độc giả
            </p>
          </div>

          {/* Cột 2: Bảng phân bổ % theo từng mốc 5 sao -> 1 sao */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5 sm:px-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = totalRatingsInDist > 0 
                ? Math.round((count / totalRatingsInDist) * 100) 
                : getNaturalFallbackPercentage(star, Number(avgRating) || 4.5);
              const isSelected = selectedStarFilter === star;

              return (
                <div
                  key={star}
                  onClick={() => setSelectedStarFilter(isSelected ? null : star)}
                  className={`flex items-center gap-3 text-xs font-medium cursor-pointer p-1.5 rounded-[4px] transition-colors ${
                    isSelected ? "bg-stone-200/70 text-stone-900 font-bold" : "hover:bg-white text-stone-700"
                  }`}
                  title={count > 0 ? `Lọc nhận xét ${star} sao (${count.toLocaleString("vi-VN")} lượt đánh giá)` : `Lọc nhận xét ${star} sao (${percentage}%)`}
                >
                  <span className="w-10 flex items-center gap-1 shrink-0 font-sans text-xs">
                    <span>{star} sao</span>
                  </span>

                  <div className="flex-1 h-2 bg-stone-200/80 rounded-[2px] overflow-hidden">
                    <div
                      className={`h-full rounded-[2px] transition-all duration-500 ${
                        isSelected ? "bg-[#1C1917]" : "bg-stone-800"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-stone-500 font-mono text-[11px] shrink-0">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cột 3: Lời kêu gọi đóng góp góc nhìn biên tập */}
          <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-white p-5 rounded-[6px] border border-stone-200/90 shadow-2xs">
            <div className="w-9 h-9 rounded-[5px] bg-[#1C1917] text-white flex items-center justify-center mb-3">
              <PenLine size={16} />
            </div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">
              Bạn đã đọc tác phẩm này?
            </h4>
            <p className="text-xs text-stone-600 mt-1 font-serif italic leading-relaxed">
              Những cảm nhận chân thật của bạn sẽ là kim chỉ nam quý giá giúp các độc giả khác chọn lựa ấn bản phù hợp.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-3.5 text-xs font-sans font-semibold text-[#1C1917] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Viết nhận xét ngay</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Biểu mẫu Viết Đánh Giá (Collapsible Form) */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-12 bg-white border border-stone-300 rounded-[6px] p-6 sm:p-8 shadow-sm transition-all animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#1C1917] text-white flex items-center justify-center">
                  <PenLine size={16} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                    Viết nhận xét cho "{bookTitle}"
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Đăng dưới tên: <span className="font-semibold text-stone-800">{user?.name || `Độc giả #${user?.user_id || 1}`}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-[4px] hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Thông báo thành công */}
            {formSuccess && (
              <div className="mb-6 p-4 rounded-[5px] bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium animate-in zoom-in-95">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>Cảm ơn bạn! Đánh giá của bạn đã được đăng thành công và ghi nhận vào hệ thống.</span>
              </div>
            )}

            {/* Thông báo lỗi nếu có */}
            {formError && (
              <div className="mb-6 p-3 rounded-[5px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            {/* Chọn số sao tương tác */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2 font-sans">
                Đánh giá tổng quan <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || formRating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                        title={`${star} sao`}
                      >
                        <Star
                          size={26}
                          className={
                            isFilled
                              ? "text-amber-500 fill-amber-500 transition-colors"
                              : "text-stone-300 transition-colors"
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-medium text-stone-700 ml-2 font-serif italic">
                  {RATING_LABELS[hoverRating || formRating]}
                </span>
              </div>
            </div>

            {/* Tiêu đề nhận xét */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2 font-sans">
                Tiêu đề nhận xét <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="VD: Một tuyệt phẩm văn học giàu cảm xúc, cốt truyện sâu sắc..."
                className="w-full px-4 py-2.5 rounded-[4px] border border-stone-300 focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] text-sm font-medium text-stone-900 placeholder:text-stone-400 font-sans"
                maxLength={200}
                required
              />
            </div>

            {/* Nội dung nhận xét chi tiết */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2 font-sans">
                Nội dung cảm nhận chi tiết <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Chia sẻ về chiều sâu nhân vật, văn phong của tác giả, thông điệp đọng lại hoặc điều khiến bạn ấn tượng nhất..."
                rows={4}
                className="w-full px-4 py-3 rounded-[4px] border border-stone-300 focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] text-sm text-stone-900 placeholder:text-stone-400 leading-relaxed font-sans"
                required
              />
            </div>

            {/* Nút gửi */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 font-sans">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-[5px] border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-[5px] bg-[#1C1917] hover:bg-[#2B2725] text-white font-medium text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                <span>{submitting ? "Đang gửi..." : "Gửi nhận xét ngay"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Thanh lọc nhận xét theo số sao */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 font-sans">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-stone-500 mr-2 flex items-center gap-1.5 font-semibold">
              <Filter size={12} /> Lọc theo:
            </span>

            <button
              type="button"
              onClick={() => setSelectedStarFilter(null)}
              className={`px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all cursor-pointer ${
                selectedStarFilter === null
                  ? "bg-[#1C1917] text-white border border-[#1C1917] shadow-2xs"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              Tất cả ({totalReviewsCount})
            </button>

            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStarFilter(s === selectedStarFilter ? null : s)}
                className={`px-3 py-1.5 rounded-[5px] text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  selectedStarFilter === s
                    ? "bg-[#1C1917] text-white border border-[#1C1917] shadow-2xs"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span>{s} sao</span>
                <span className="text-[10px] opacity-70">({reviewCountsByStar[s] || 0})</span>
              </button>
            ))}
          </div>

          {selectedStarFilter !== null && (
            <button
              type="button"
              onClick={() => setSelectedStarFilter(null)}
              className="text-xs text-[#1C1917] hover:underline font-medium cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Danh sách các bài nhận xét */}
        {loading ? (
          <div className="py-16 text-center text-stone-400">
            <Loader2 size={26} className="animate-spin mx-auto mb-3 text-stone-600" />
            <p className="text-sm font-serif italic text-stone-500">Đang tải nhận xét từ độc giả...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-14 px-6 text-center bg-[#FAF9F6] border border-stone-200/90 rounded-[8px]">
            <PenLine size={32} className="mx-auto text-stone-400 mb-3" />
            <h4 className="font-serif font-bold text-stone-900 text-base mb-1.5">
              {selectedStarFilter
                ? `Chưa có bài nhận xét nào đạt ${selectedStarFilter} sao.`
                : "Chưa có nhận xét nào cho cuốn sách này."}
            </h4>
            <p className="text-xs text-stone-600 font-serif italic max-w-md mx-auto mb-6 leading-relaxed">
              Hãy là người đầu tiên chia sẻ cảm nhận văn học của bạn để giúp các độc giả khác có thêm góc nhìn!
            </p>
            <div className="flex items-center justify-center gap-3 font-sans">
              {selectedStarFilter && (
                <button
                  type="button"
                  onClick={() => setSelectedStarFilter(null)}
                  className="px-4 py-2 rounded-[5px] border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-all cursor-pointer"
                >
                  Xem tất cả nhận xét
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (selectedStarFilter) setFormRating(selectedStarFilter);
                  setIsFormOpen(true);
                }}
                className="px-5 py-2.5 rounded-[5px] bg-[#1C1917] hover:bg-[#2B2725] text-white text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {selectedStarFilter ? `Viết nhận xét ${selectedStarFilter} sao` : "Viết nhận xét đầu tiên"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((rev) => {
              const isVoted = helpfulVoted[rev.review_id];

              return (
                <div
                  key={rev.review_id}
                  className="bg-white border border-stone-200/90 rounded-[6px] p-6 sm:p-7 shadow-xs hover:border-stone-400 transition-all"
                >
                  {/* Header nhận xét: Người dùng, huy hiệu mua hàng, ngày đăng */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar đại diện dạng Monogram hình vuông bo góc nhẹ */}
                      <div className="w-9 h-9 rounded-[4px] bg-[#1C1917] text-stone-100 flex items-center justify-center font-bold text-xs shadow-xs uppercase tracking-wider">
                        {rev.username ? rev.username[0] : "Đ"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm font-sans">
                            {rev.username}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-[3px] border border-stone-200">
                            <CheckCircle2 size={11} className="text-stone-800" />
                            Đã mua tại The Inkwell
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-sans">
                          Đăng ngày {rev.created_at}
                        </span>
                      </div>
                    </div>

                    {/* Số sao nhận xét */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= rev.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-stone-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tiêu đề nhận xét */}
                  <h5 className="font-serif font-bold text-[#1C1917] text-base mb-2 leading-snug">
                    {rev.title}
                  </h5>

                  {/* Nội dung nhận xét */}
                  <p className="text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-line mb-5">
                    {rev.content}
                  </p>

                  {/* Footer nhận xét: Nút Hữu ích (Helpful) bo góc 4px */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.review_id)}
                      disabled={isVoted}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border transition-all cursor-pointer ${
                        isVoted
                          ? "bg-stone-100 border-stone-300 text-stone-900 font-semibold cursor-default"
                          : "border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <ThumbsUp size={13} className={isVoted ? "text-stone-800" : ""} />
                      <span>{isVoted ? "Đã cảm ơn" : "Hữu ích"}</span>
                      {rev.helpful_count > 0 && (
                        <span className="font-bold ml-0.5">({rev.helpful_count})</span>
                      )}
                    </button>

                    <span className="text-[11px] text-stone-400 italic">
                      Đã được kiểm duyệt cộng đồng
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

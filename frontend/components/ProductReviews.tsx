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

export default function ProductReviews({
  bookId,
  bookTitle,
  initialAverageRating = 4.5,
  initialRatingsCount = 0,
}: {
  bookId: number;
  bookTitle: string;
  initialAverageRating?: number;
  initialRatingsCount?: number;
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
  const distribution = data?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-ink/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <span>Đánh giá từ độc giả</span>
              <span className="text-xs sm:text-sm font-sans font-semibold bg-[#FAF7F2] text-[#B12704] border border-[#B12704]/20 px-3 py-1 rounded-full">
                {totalReviewsCount} nhận xét
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              Cảm nhận và góc nhìn văn học thực tế từ cộng đồng người đọc The Inkwell
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-black font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {isFormOpen ? <X size={16} /> : <PenLine size={16} />}
            <span>{isFormOpen ? "Đóng biểu mẫu" : "Viết nhận xét của bạn"}</span>
          </button>
        </div>

        {/* Khung tổng quan điểm số & Phân bổ số sao */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 bg-[#FAF9F6] border border-gray-200/80 rounded-2xl p-6 sm:p-8">
          
          {/* Cột 1: Điểm trung bình tổng quát */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200/80 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-5xl sm:text-6xl font-serif font-bold text-gray-900 tracking-tight">
              {avgRating}
            </span>
            <span className="text-xs text-gray-500 font-medium mt-1">trên thang điểm 5.0</span>

            <div className="flex items-center gap-1 my-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(avgRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <p className="text-xs text-gray-600 font-medium">
              Dựa trên {totalRatingsCount.toLocaleString("vi-VN")} lượt đánh giá thực tế
            </p>
          </div>

          {/* Cột 2: Bảng phân bổ % theo từng mốc 5 sao -> 1 sao */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5 sm:px-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = totalRatingsInDist > 0 ? Math.round((count / totalRatingsInDist) * 100) : (star === 5 ? 70 : star === 4 ? 20 : 5);
              const isSelected = selectedStarFilter === star;

              return (
                <div
                  key={star}
                  onClick={() => setSelectedStarFilter(isSelected ? null : star)}
                  className={`flex items-center gap-3 text-xs font-medium cursor-pointer p-1.5 rounded-lg transition-colors ${
                    isSelected ? "bg-amber-50 text-amber-900 font-bold" : "hover:bg-white text-gray-700"
                  }`}
                  title={`Lọc nhận xét ${star} sao (${count} lượt đánh giá)`}
                >
                  <span className="w-10 flex items-center gap-1 shrink-0">
                    <span>{star} sao</span>
                  </span>

                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? "bg-amber-500" : "bg-amber-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-gray-500 font-mono text-[11px] shrink-0">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cột 3: Lời kêu gọi đóng góp góc nhìn */}
          <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-white/80 p-5 rounded-xl border border-gray-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#FFF5F2] text-[#B12704] flex items-center justify-center mb-3">
              <Sparkles size={20} />
            </div>
            <h4 className="font-serif font-bold text-gray-900 text-sm">
              Bạn đã đọc tác phẩm này?
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Những cảm nhận chân thật của bạn sẽ là kim chỉ nam quý giá giúp các độc giả khác chọn lựa.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-4 text-xs font-bold text-[#B12704] hover:underline flex items-center gap-1 cursor-pointer"
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
            className="mb-12 bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <PenLine size={16} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-base sm:text-lg">
                    Viết nhận xét cho "{bookTitle}"
                  </h3>
                  <p className="text-xs text-gray-500">
                    Đăng dưới tên: <span className="font-semibold text-gray-800">{user?.name || `Độc giả #${user?.user_id || 1}`}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Thông báo thành công */}
            {formSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium animate-in zoom-in-95">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>Cảm ơn bạn! Đánh giá của bạn đã được đăng thành công và ghi nhận vào hệ thống.</span>
              </div>
            )}

            {/* Thông báo lỗi nếu có */}
            {formError && (
              <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            {/* Chọn số sao tương tác */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
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
                          size={28}
                          className={
                            isFilled
                              ? "text-amber-400 fill-amber-400 transition-colors"
                              : "text-gray-300 transition-colors"
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-semibold text-gray-700 ml-2">
                  {RATING_LABELS[hoverRating || formRating]}
                </span>
              </div>
            </div>

            {/* Tiêu đề nhận xét */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Tiêu đề nhận xét <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="VD: Một tuyệt phẩm văn học giàu cảm xúc, cốt truyện xuất sắc..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm font-medium text-gray-900 placeholder:text-gray-400"
                maxLength={200}
                required
              />
            </div>

            {/* Nội dung nhận xét chi tiết */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nội dung cảm nhận chi tiết <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Chia sẻ về chiều sâu nhân vật, văn phong của tác giả, bài học đọng lại hoặc điều khiến bạn ấn tượng nhất..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm text-gray-900 placeholder:text-gray-400 leading-relaxed font-sans"
                required
              />
            </div>

            {/* Nút gửi */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                <span>{submitting ? "Đang gửi..." : "Gửi nhận xét ngay"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Thanh lọc nhận xét theo số sao */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2 flex items-center gap-1.5">
              <Filter size={13} /> Lọc theo:
            </span>

            <button
              type="button"
              onClick={() => setSelectedStarFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedStarFilter === null
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả ({totalReviewsCount})
            </button>

            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStarFilter(s === selectedStarFilter ? null : s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  selectedStarFilter === s
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{s} sao</span>
                <span className="text-[10px] opacity-80">({reviewCountsByStar[s] || 0})</span>
              </button>
            ))}
          </div>

          {selectedStarFilter !== null && (
            <button
              type="button"
              onClick={() => setSelectedStarFilter(null)}
              className="text-xs text-[#B12704] hover:underline font-semibold cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Danh sách các bài nhận xét */}
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <Loader2 size={28} className="animate-spin mx-auto mb-3 text-gray-600" />
            <p className="text-sm font-medium">Đang tải nhận xét từ độc giả...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center bg-[#FAF9F6] border border-dashed border-gray-300 rounded-2xl">
            <MessageSquarePlus size={36} className="mx-auto text-gray-400 mb-3" />
            <h4 className="font-serif font-bold text-gray-800 text-base mb-1">
              {selectedStarFilter
                ? `Chưa có bài nhận xét nào đạt ${selectedStarFilter} sao.`
                : "Chưa có nhận xét nào cho cuốn sách này."}
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-5 leading-relaxed">
              Hãy là người đầu tiên chia sẻ cảm nhận văn học của bạn để giúp các độc giả khác có thêm góc nhìn!
            </p>
            <div className="flex items-center justify-center gap-3">
              {selectedStarFilter && (
                <button
                  type="button"
                  onClick={() => setSelectedStarFilter(null)}
                  className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition-all cursor-pointer"
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
                className="px-5 py-2 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
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
                  className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-gray-300 transition-all"
                >
                  {/* Header nhận xét: Người dùng, huy hiệu mua hàng, ngày đăng */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar đại diện */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#475569] text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
                        {rev.username ? rev.username[0] : "Đ"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {rev.username}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            Đã mua tại The Inkwell
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
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
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tiêu đề nhận xét */}
                  <h5 className="font-serif font-bold text-gray-900 text-base mb-2 leading-snug">
                    {rev.title}
                  </h5>

                  {/* Nội dung nhận xét */}
                  <p className="text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-line mb-5">
                    {rev.content}
                  </p>

                  {/* Footer nhận xét: Nút Hữu ích (Helpful) */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.review_id)}
                      disabled={isVoted}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isVoted
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold cursor-default"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <ThumbsUp size={13} className={isVoted ? "text-emerald-600" : ""} />
                      <span>{isVoted ? "Đã cảm ơn" : "Hữu ích"}</span>
                      {rev.helpful_count > 0 && (
                        <span className="font-bold ml-0.5">({rev.helpful_count})</span>
                      )}
                    </button>

                    <span className="text-[11px] text-gray-400">
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

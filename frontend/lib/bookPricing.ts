/**
 * Module quản lý định giá sách đồng bộ cho toàn bộ The Inkwell.
 * Đảm bảo 1 cuốn sách (theo book_id) luôn có đúng 1 mức giá bán và 1 mức giá niêm yết
 * trên tất cả các component: BookCard, RecommendedReadsCarousel, Cart, Search, Detail.
 */

export interface BookPricing {
  price: number;           // Giá bán thực tế (VNĐ)
  originalPrice: number;   // Giá niêm yết / giá gốc gạch ngang (VNĐ)
  discountPercent: number; // Tỷ lệ giảm giá (%)
}

/**
 * Tính toán giá bán và giá niêm yết tất định (deterministic) theo book_id.
 * Nếu sách đã có sẵn `book.price` hợp lệ, sử dụng giá đó làm giá bán và tính giá gốc tương ứng.
 */
export const getBookPricing = (bookId: number | string, customPrice?: number): BookPricing => {
  const numericId = Math.abs(Number(bookId)) || 1;

  let salePrice = customPrice && customPrice > 0 ? customPrice : 0;
  
  if (!salePrice) {
    // Công thức giả lập giá sách thị trường Việt Nam (từ 115.000đ đến 235.000đ)
    const base = 120000 + ((numericId * 7919) % 115000);
    salePrice = Math.round(base / 1000) * 1000;
  }

  // Tỷ lệ chiết khấu niêm yết ổn định từ 22% đến 38%
  const markupRatio = 1.25 + (((numericId * 13) % 15) / 100); // 1.25 -> 1.39
  const originalPrice = Math.round((salePrice * markupRatio) / 1000) * 1000;
  const discountPercent = Math.max(10, Math.round(((originalPrice - salePrice) / originalPrice) * 100));

  return {
    price: salePrice,
    originalPrice,
    discountPercent,
  };
};

/**
 * Định dạng số tiền thành chuỗi VNĐ chuẩn (ví dụ: 135.000 ₫)
 */
export const formatPriceVND = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

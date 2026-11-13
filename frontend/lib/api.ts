// Cấu hình URL kết nối Backend:
// 1. Lấy từ biến môi trường NEXT_PUBLIC_API_URL nếu có thiết lập
// 2. Tự động nhận diện khi chạy trên Vercel / Production -> trỏ về Render Backend
// 3. Fallback khi chạy local máy cá nhân -> http://127.0.0.1:8000

const RENDER_BACKEND_URL = "https://the-inkwell-ehoh.onrender.com";

const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return RENDER_BACKEND_URL;
    }
  }
  return process.env.NODE_ENV === "production" ? RENDER_BACKEND_URL : "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();


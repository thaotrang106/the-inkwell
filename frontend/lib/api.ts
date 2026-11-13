// Cấu hình URL kết nối Backend:
// - Khi chạy trên máy cá nhân (Local): http://127.0.0.1:8000
// - Khi triển khai lên Vercel/Internet: Lấy từ biến môi trường NEXT_PUBLIC_API_URL
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

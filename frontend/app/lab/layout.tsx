import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algorithm Lab: So Sánh Thuật Toán Đề Xuất | The Inkwell",
  description: "Trực quan hóa và so sánh 3 phương pháp gợi ý sách: Content-Based (pgvector), Collaborative Filtering (Ochiai) và Hybrid Borda Fusion trên tập dữ liệu Goodbooks-10k.",
  openGraph: {
    title: "Algorithm Lab: So Sánh Thuật Toán Đề Xuất | The Inkwell",
    description: "So sánh trực quan hiệu năng của Content-Based, Collaborative Filtering và Hybrid Borda Fusion.",
    url: "https://the-inkwel.vercel.app/lab",
    siteName: "The Inkwell",
    locale: "vi_VN",
    type: "website",
  },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

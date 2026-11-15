import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ Hàng Tuyển Chọn | The Inkwell",
  description: "Kiểm tra danh mục các ấn phẩm tuyển chọn trong giỏ hàng của bạn và tiến hành đặt mua sách tại The Inkwell Bookstore.",
  openGraph: {
    title: "Giỏ Hàng Tuyển Chọn | The Inkwell",
    description: "Kiểm tra danh mục ấn phẩm tuyển chọn và tiến hành đặt hàng.",
    url: "https://the-inkwel.vercel.app/cart",
    siteName: "The Inkwell",
    locale: "vi_VN",
    type: "website",
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

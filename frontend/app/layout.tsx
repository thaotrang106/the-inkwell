import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: "--font-inter",
  display: "swap"
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
  display: "swap"
});

export const metadata: Metadata = {
  title: "The Inkwell",
  description: "Hiệu sách văn học khai phóng & Trợ lý văn học Mercy AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased bg-[#FAF7F2] text-[#1C1917] min-h-screen flex flex-col relative`}>
        <div className="fixed inset-0 pointer-events-none paper-texture opacity-30 mix-blend-multiply z-[-1]"></div>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

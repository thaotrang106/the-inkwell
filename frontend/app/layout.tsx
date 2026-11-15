import type { Metadata } from "next";
import { Inter, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MercyFloatingButton from "@/components/MercyFloatingButton";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { MercyProvider } from "@/context/MercyContext";

const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
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
      <body className={`${inter.variable} ${playfair.variable} ${lora.variable} font-sans antialiased bg-[#FAF7F2] text-[#1C1917] min-h-screen flex flex-col relative`}>
        <div className="fixed inset-0 pointer-events-none paper-texture opacity-30 mix-blend-multiply z-[-1]"></div>
        <AuthProvider>
          <CartProvider>
            <MercyProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <MercyFloatingButton />
            </MercyProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

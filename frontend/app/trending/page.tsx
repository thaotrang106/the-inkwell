import { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import TrendingClient from "./TrendingClient";
import { fetchServerTrending, GENRE_METADATA_MAP } from "@/lib/serverBooks";
import { formatPriceVND } from "@/lib/bookPricing";

interface Props {
  searchParams: Promise<{
    genre?: string;
    filter?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const genre = resolvedParams.genre;
  
  if (genre) {
    const meta = GENRE_METADATA_MAP[genre.toLowerCase()] || {
      title: genre.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      desc: `Khám phá các tác phẩm tuyển chọn thuộc thể loại ${genre} tại hiệu sách The Inkwell.`
    };

    return {
      title: `${meta.title} - Tuyển Tập Tác Phẩm Tuyển Chọn | The Inkwell`,
      description: meta.desc,
      openGraph: {
        title: `${meta.title} | The Inkwell Bookstore`,
        description: meta.desc,
        url: `https://the-inkwel.vercel.app/trending?genre=${genre}`,
        siteName: "The Inkwell",
        locale: "vi_VN",
        type: "website",
      },
    };
  }

  return {
    title: "Sách Thịnh Hành & Bảng Xếp Hạng Độc Giả | The Inkwell",
    description: "Khám phá danh sách các tác phẩm văn học, tư tưởng và tri thức được bạn đọc yêu thích nhất trên hệ thống The Inkwell.",
    openGraph: {
      title: "Sách Thịnh Hành & Tuyển Tập Tuyển Chọn | The Inkwell",
      description: "Danh mục các cuốn sách có lượt đánh giá cao và được đọc nhiều nhất do The Inkwell tổng hợp.",
      url: "https://the-inkwel.vercel.app/trending",
      siteName: "The Inkwell",
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function TrendingPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const genreParam = resolvedParams.genre || "";
  const filterParam = resolvedParams.filter || "";

  // 1. Tải trước dữ liệu sách phía server (SSR)
  const initialBooks = await fetchServerTrending(genreParam);
  const initialGenreMeta = genreParam ? (GENRE_METADATA_MAP[genreParam.toLowerCase()] || null) : null;

  return (
    <div>
      {/* 2. Semantic HTML Static SSR Fallback (cho SEO và khi tắt JavaScript) */}
      <noscript>
        <div style={{ padding: "32px 16px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
          <h1 style={{ fontFamily: "serif", fontSize: "32px", marginBottom: "8px" }}>
            {initialGenreMeta ? initialGenreMeta.title : "Sách Thịnh Hành Nhất"}
          </h1>
          <p style={{ color: "#555", marginBottom: "24px" }}>
            {initialGenreMeta ? initialGenreMeta.desc : "Danh mục sách văn học và tri thức tuyển chọn tại The Inkwell."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {initialBooks.map((book) => (
              <div key={book.book_id} style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "4px" }}>
                <a href={`/books/${book.book_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {book.image_url && (
                    <img
                      src={book.image_url}
                      alt={`Bìa sách ${book.title} - ${book.author || "Tác giả"}`}
                      style={{ width: "100%", height: "260px", objectFit: "cover", marginBottom: "8px" }}
                    />
                  )}
                  <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 4px" }}>{book.title}</h3>
                  <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px" }}>{book.author}</p>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: "#881337" }}>
                    {formatPriceVND(book.price)}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </noscript>

      {/* 3. Client Hydration mượt mà */}
      <Suspense fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#881337]" size={36} />
        </div>
      }>
        <TrendingClient 
          initialBooks={initialBooks}
          genreParam={genreParam}
          filterParam={filterParam}
          initialGenreMeta={initialGenreMeta}
        />
      </Suspense>
    </div>
  );
}

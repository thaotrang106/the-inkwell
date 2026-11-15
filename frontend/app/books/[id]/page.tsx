import { Metadata } from "next";
import { notFound } from "next/navigation";
import BookDetailClient from "./BookDetailClient";
import { fetchServerBook } from "@/lib/serverBooks";
import { formatPriceVND } from "@/lib/bookPricing";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const cleanTitle = (title: string) => {
  if (!title) return "";
  return title.replace(/\s*\([^)]*#\d+[^)]*\)/g, "").trim();
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await fetchServerBook(resolvedParams.id);

  if (!book) {
    return {
      title: "Không tìm thấy ấn phẩm | The Inkwell",
      description: "Tác phẩm bạn đang tìm kiếm không tồn tại hoặc đã được gỡ khỏi danh mục.",
    };
  }

  const title = cleanTitle(book.title);
  const author = book.author || book.authors || "Tác giả văn học";
  const desc = book.description 
    ? book.description.slice(0, 160) + "..."
    : `Khám phá tác phẩm "${title}" của tác giả ${author} tại hiệu sách The Inkwell.`;
  const coverImage = book.image_url || "https://the-inkwel.vercel.app/theinkwell_wordmark_light_transparent.png";

  return {
    title: `${title} - ${author} | The Inkwell Bookstore`,
    description: desc,
    openGraph: {
      title: `${title} - ${author}`,
      description: desc,
      url: `https://the-inkwel.vercel.app/books/${resolvedParams.id}`,
      siteName: "The Inkwell",
      images: [
        {
          url: coverImage,
          width: 600,
          height: 900,
          alt: `Bìa sách ${title} - ${author}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${author}`,
      description: desc,
      images: [coverImage],
    },
  };
}

export default async function BookDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const book = await fetchServerBook(resolvedParams.id);

  if (!book) {
    notFound();
  }

  const title = cleanTitle(book.title);
  const author = book.author || book.authors || "Nhiều tác giả";

  return (
    <div>
      {/* Semantic Static SSR Fallback (cho SEO và khi trình duyệt tắt JavaScript) */}
      <noscript>
        <div style={{ padding: "32px 16px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 280px" }}>
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={`Bìa sách ${title} - ${author}`}
                  style={{ width: "100%", height: "420px", objectFit: "cover", borderRadius: "4px" }}
                />
              )}
              <div style={{ marginTop: "16px", fontSize: "13px", color: "#666" }}>
                <p><strong>Mã ấn phẩm:</strong> {book.isbn || book.isbn13 || `#INK-${book.book_id}`}</p>
                {book.original_publication_year && <p><strong>Năm xuất bản:</strong> {book.original_publication_year}</p>}
                {book.pages && <p><strong>Số trang:</strong> {book.pages} trang</p>}
                <p><strong>Tình trạng:</strong> Bản in chuẩn mực</p>
              </div>
            </div>

            <div style={{ flex: "1 1 500px" }}>
              <h1 style={{ fontFamily: "serif", fontSize: "36px", margin: "0 0 8px", color: "#1C1917" }}>
                {title}
              </h1>
              <p style={{ fontSize: "16px", color: "#555", margin: "0 0 16px" }}>
                Tác giả: <strong>{author}</strong>
              </p>
              <p style={{ fontSize: "24px", color: "#881337", fontWeight: "bold", margin: "0 0 24px" }}>
                {formatPriceVND(book.price)}
              </p>
              <h3 style={{ fontFamily: "serif", fontSize: "20px", margin: "0 0 8px" }}>Tóm tắt tác phẩm</h3>
              <p style={{ lineHeight: "1.7", color: "#333" }}>
                {book.description || `"${title}" là một trong những tác phẩm tiêu biểu của ${author}, đưa người đọc qua những trải nghiệm cảm xúc phong phú và bài học nhân sinh giá trị.`}
              </p>
            </div>
          </div>
        </div>
      </noscript>

      {/* Client Component Hydration */}
      <BookDetailClient initialBook={book} />
    </div>
  );
}

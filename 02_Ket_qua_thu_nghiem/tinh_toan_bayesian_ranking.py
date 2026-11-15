"""
=============================================================================
ĐỒ ÁN TỐT NGHIỆP: THE INKWELL RECOMMENDATION SYSTEM
SCRIPT TÍNH TOÁN VÀ ĐỐI SÁNH BẢNG XẾP HẠNG BAYESIAN AVERAGE RATING
Tác giả: Ngô Thảo Trang (MSSV: 030239230260) - Trường ĐH Ngân hàng TP.HCM (HUB)
=============================================================================
Công thức:
    S = [ v / (v + m) ] * R + [ m / (v + m) ] * C
Trong đó:
    v: ratings_count (số lượt đánh giá của tác phẩm)
    R: average_rating (điểm trung bình số học thô của cuốn sách)
    m: 1000 (ngưỡng số lượng đánh giá tối thiểu để đạt độ tin cậy thống kê)
    C: 4.00 (điểm đánh giá kỳ vọng trung bình của toàn bộ thư viện sách)
"""

import os
import csv

def compute_bayesian_ranking():
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "books_enriched.csv")
    out_csv = os.path.join(os.path.dirname(__file__), "bang_xep_hang_bayesian.csv")
    out_md = os.path.join(os.path.dirname(__file__), "phan_tich_bayesian_ranking.md")
    
    print(f"Reading dataset from: {data_path}")
    m = 1000.0
    C = 4.00
    
    books = []
    with open(data_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                b_id = int(row["book_id"])
                title = row["title"]
                authors = row["authors"]
                r_count = float(row["ratings_count"]) if row["ratings_count"] else 0.0
                r_avg = float(row["average_rating"]) if row["average_rating"] else 0.0
                
                # Bayesian formula
                score = (r_count / (r_count + m)) * r_avg + (m / (r_count + m)) * C
                
                books.append({
                    "book_id": b_id,
                    "title": title,
                    "authors": authors,
                    "ratings_count": int(r_count),
                    "raw_rating": r_avg,
                    "bayesian_score": score
                })
            except Exception:
                continue
                
    # Sort by Bayesian score descending
    books_bayesian = sorted(books, key=lambda x: x["bayesian_score"], reverse=True)
    # Sort by raw rating descending
    books_raw = sorted(books, key=lambda x: x["raw_rating"], reverse=True)
    
    print(f"Total valid books parsed: {len(books)}")
    
    # Save Top 100 Bayesian to CSV
    with open(out_csv, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Rank", "Book ID", "Tựa sách", "Tác giả", "Điểm trung bình cũ (Raw)", "Lượt đánh giá (Ratings Count)", "Điểm Bayesian Score"])
        for idx, b in enumerate(books_bayesian[:100], start=1):
            writer.writerow([idx, b["book_id"], b["title"], b["authors"], f"{b['raw_rating']:.2f}", b["ratings_count"], f"{b['bayesian_score']:.4f}"])
            
    # Generate Markdown Analysis Report
    with open(out_md, "w", encoding="utf-8") as f:
        f.write("# 📈 BÁO CÁO PHÂN TÍCH XẾP HẠNG BAYESIAN VÀ XỬ LÝ CAPPED RATINGS\n")
        f.write("> **Hệ thống The Inkwell** – Khắc phục hiện tượng sách ít đánh giá đạt 5 sao ảo (Cold-Start Recommender)\n\n")
        f.write("## 1. Công thức xếp hạng Bayesian Score\n")
        f.write("$$\\text{Score} = \\frac{v}{v + m} \\cdot R + \\frac{m}{v + m} \\cdot C$$\n")
        f.write("- $v$ (*ratings_count*): Số lượt đánh giá của tác phẩm.\n")
        f.write("- $R$ (*average_rating*): Điểm trung bình cộng thô của cuốn sách.\n")
        f.write("- $m = 1.000$: Ngưỡng tin cậy thống kê tối thiểu.\n")
        f.write("- $C = 4.00$: Trọng số trung bình toàn thư viện sách.\n\n")
        
        f.write("## 2. Đối sánh Top 5: Cách tính cũ (Capped 100) vs Bayesian Ranking (Bảng 4.2)\n\n")
        f.write("| Hạng | Cách tính cũ (Raw Average - Bị dính Capped 100) | Lượt vote cũ | Xếp hạng mới (Bayesian Average chuẩn) | Lượt vote thật | Điểm Bayesian |\n")
        f.write("| :---: | :--- | :---: | :--- | :---: | :---: |\n")
        
        for i in range(5):
            raw_b = books_raw[i]
            bayes_b = books_bayesian[i]
            f.write(f"| **#{i+1}** | {raw_b['title'][:38]} | {raw_b['ratings_count']:,} | **{bayes_b['title'][:38]}** | {bayes_b['ratings_count']:,} | **{bayes_b['bayesian_score']:.4f}** |\n")
            
        f.write("\n## 3. Nhận xét học thuật bảo vệ trước Hội đồng\n")
        f.write("1. **Tại sao không dùng điểm trung bình cộng số học đơn thuần?**\n")
        f.write("   - Nếu dùng số học đơn thuần, các cuốn sách lạ chỉ có vài lượt vote (thậm chí 1 người vote 5 sao) sẽ vượt mặt các tuyệt tác kinh điển thế giới.\n")
        f.write("   - Khi một cuốn sách có quá ít lượt đánh giá ($v \\to 0$), công thức kéo điểm số về giá trị kỳ vọng $C = 4.0$.\n")
        f.write("2. **Khi số lượt đánh giá rất lớn ($v \\gg m$):**\n")
        f.write("   - Tỷ số $\\frac{v}{v+m} \\to 1$, điểm số của cuốn sách tiệm cận chính xác với chất lượng thực tế do hàng triệu độc giả thẩm định.\n")
        f.write("   - Bảng xếp hạng phản ánh chân thực các kiệt tác văn học như *Harry Potter, The Complete Calvin and Hobbes, Words of Radiance*...\n")
        
    print(f"[SUCCESS] Đã tạo bảng xếp hạng Bayesian tại:")
    print(f"  -> {out_csv}")
    print(f"  -> {out_md}")

if __name__ == "__main__":
    compute_bayesian_ranking()

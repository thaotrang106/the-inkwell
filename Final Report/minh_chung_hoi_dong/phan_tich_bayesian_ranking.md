# 📈 BÁO CÁO PHÂN TÍCH XẾP HẠNG BAYESIAN VÀ XỬ LÝ CAPPED RATINGS
> **Hệ thống The Inkwell** – Khắc phục hiện tượng sách ít đánh giá đạt 5 sao ảo (Cold-Start Recommender)

## 1. Công thức xếp hạng Bayesian Score
$$\text{Score} = \frac{v}{v + m} \cdot R + \frac{m}{v + m} \cdot C$$
- $v$ (*ratings_count*): Số lượt đánh giá của tác phẩm.
- $R$ (*average_rating*): Điểm trung bình cộng thô của cuốn sách.
- $m = 1.000$: Ngưỡng tin cậy thống kê tối thiểu.
- $C = 4.00$: Trọng số trung bình toàn thư viện sách.

## 2. Đối sánh Top 5: Cách tính cũ (Capped 100) vs Bayesian Ranking (Bảng 4.2)

| Hạng | Cách tính cũ (Raw Average - Bị dính Capped 100) | Lượt vote cũ | Xếp hạng mới (Bayesian Average chuẩn) | Lượt vote thật | Điểm Bayesian |
| :---: | :--- | :---: | :--- | :---: | :---: |
| **#1** | The Complete Calvin and Hobbes | 28,900 | **The Complete Calvin and Hobbes** | 28,900 | **4.7926** |
| **#2** | Words of Radiance (The Stormlight Arch | 73,572 | **Words of Radiance (The Stormlight Arch** | 73,572 | **4.7597** |
| **#3** | Harry Potter Boxed Set, Books 1-5 (Har | 33,220 | **Harry Potter Boxed Set, Books 1-5 (Har** | 33,220 | **4.7475** |
| **#4** | ESV Study Bible | 8,953 | **Harry Potter Boxset (Harry Potter, #1-** | 190,050 | **4.7361** |
| **#5** | Mark of the Lion Trilogy | 9,081 | **It's a Magical World: A Calvin and Hob** | 22,351 | **4.7179** |

## 3. Nhận xét học thuật bảo vệ trước Hội đồng
1. **Tại sao không dùng điểm trung bình cộng số học đơn thuần?**
   - Nếu dùng số học đơn thuần, các cuốn sách lạ chỉ có vài lượt vote (thậm chí 1 người vote 5 sao) sẽ vượt mặt các tuyệt tác kinh điển thế giới.
   - Khi một cuốn sách có quá ít lượt đánh giá ($v \to 0$), công thức kéo điểm số về giá trị kỳ vọng $C = 4.0$.
2. **Khi số lượt đánh giá rất lớn ($v \gg m$):**
   - Tỷ số $\frac{v}{v+m} \to 1$, điểm số của cuốn sách tiệm cận chính xác với chất lượng thực tế do hàng triệu độc giả thẩm định.
   - Bảng xếp hạng phản ánh chân thực các kiệt tác văn học như *Harry Potter, The Complete Calvin and Hobbes, Words of Radiance*...

import os
import requests
from dotenv import load_dotenv

from pathlib import Path

# Load chìa khóa API từ file .env (hỗ trợ cả khi chạy từ backend/ hoặc thư mục gốc)
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(env_path)
if not os.getenv("GEMINI_API_KEY"):
    load_dotenv()

def generate_explanation(book_title: str, book_author: str, description: str):
    """Sử dụng Gemini REST API để đóng vai Chuyên gia Cố vấn Văn học The Inkwell phân tích sách"""
    
    api_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={api_key}"
    
    prompt = f"""
    [SYSTEM ROLE]
    Bạn là Mercy — Chuyên gia Giám tuyển & Cố vấn Văn học Cấp cao (Senior Literary Advisor) của The Inkwell.
    Bạn có nhãn quan phân tích sắc sảo, văn phong tinh tế, học thuật và chuẩn mực.

    [CONTEXT]
    Tác phẩm: "{book_title}" của tác giả {book_author}.
    Tóm tắt: "{description}"

    [TASK]
    Viết một đoạn nhận định ngắn gọn (chính xác 2 đến 3 câu) đi thẳng vào trọng tâm:
    - Nêu bật tư tưởng nghệ thuật then chốt và giá trị văn chương của tác phẩm.
    - Không mở bài dông dài, không spoiler.
    - QUY TẮC ĐỊNH DẠNG TUYỆT ĐỐI: Viết thuần văn bản tự nhiên, KHÔNG DÙNG BẤT KỲ ký tự markdown nào (không dùng dấu sao *, dấu gạch dưới _, dấu thăng #). Tên tác phẩm hoặc trích dẫn nếu cần nhấn mạnh thì đặt trong dấu ngoặc kép "..." thay vì dấu sao.
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": 180,
            "temperature": 0.5
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=8)
        response.raise_for_status()
        data = response.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        # Dọn dẹp triệt để mọi dấu markdown nếu mô hình vẫn vô tình sinh ra
        clean_text = raw_text.replace("*", "").replace("#", "").replace("_", "").strip()
        return clean_text
    except Exception as e:
        print(f"Lỗi kết nối Gemini API: {e}")
        return f"Tác phẩm \"{book_title}\" của tác giả {book_author} là một áng văn giàu chiều sâu tư tưởng, khai mở những góc nhìn nhân văn tinh tế và xứng đáng là một điểm sáng trong tủ sách của mọi độc giả."

# Bộ nhớ đệm hội thoại Mercy để phản hồi tức thì cho các câu hỏi phổ biến
MERCY_CHAT_CACHE: dict = {}

def chat_with_mercy(user_message: str):
    """API trò chuyện cùng Cố vấn Văn học Mercy AI — Nhận diện chính xác ý định (hỏi chi tiết, tóm tắt, tìm sách theo gu), văn phong phê bình sắc sảo, tự nhiên, phản hồi phong phú và nhanh chóng."""
    clean_msg = user_message.strip()
    cache_key = clean_msg.lower()
    if cache_key in MERCY_CHAT_CACHE:
        return MERCY_CHAT_CACHE[cache_key]

    api_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={api_key}"
    
    prompt = f"""
    [SYSTEM ROLE]
    Bạn là Mercy AI — Trợ lý Cố vấn Văn học Cấp cao của The Inkwell.
    Bạn có nhãn quan phê bình sắc sảo, am tường tác phẩm kinh điển và hiện đại, văn phong tự nhiên, lịch lãm, giàu chiều sâu và chuẩn mực.

    [QUY TẮC CÂU TỪ BẮT BUỘC]
    - Tuyệt đối KHÔNG dùng các câu sáo rỗng hành chính như:
      "Chào bạn, với tư cách là...", "tôi xin gửi đến bạn góc nhìn chuyên khảo...", "dưới đây là câu trả lời của tôi...". Đi thẳng vào tác phẩm một cách tự nhiên.
    - Dòng tiêu đề nhận diện tác phẩm LUÔN tuân theo định dạng in đậm:
      **[Tên sách tiếng Anh] ([Tên tiếng Việt nếu có]) — [Tác giả]**
      (Định dạng này giúp hệ thống The Inkwell tự động gắn thẻ sách và link chuyển hướng tới trang sản phẩm).

    [HƯỚNG DẪN XỬ LÝ THEO Ý ĐỊNH ĐỘC GIẢ]

    --- TÌNH HUỐNG 1: ĐỘC GIẢ YÊU CẦU PHÂN TÍCH CHI TIẾT / NỘI DUNG SÂU / REVIEW TÁC PHẨM ---
    (Dấu hiệu: Câu hỏi có từ "chi tiết", "phân tích", "kể rõ", "nội dung sâu", "nhân vật", "review", "cốt truyện", hoặc độc giả muốn tìm hiểu kỹ lưỡng về một cuốn sách cụ thể như "chi tiết về cuốn gone girl đi", "kể chi tiết về 1984")
    * Quy tắc:
      1. Mở đầu bằng một nhận định văn học đắt giá, khơi gợi bản chất nghệ thuật và sức hút ám ảnh của tác phẩm.
      2. Dòng định dạng sách: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
      3. Dòng tổng quan: Tổng quan: [2-3 câu ngắn gọn về tiền đề câu chuyện và xung đột trung tâm]
      4. Phân tích chuyên sâu, toàn diện và có cấu trúc mạch lạc với các mục in đậm:
         - **Bối cảnh & Nút thắt cốt lõi:** Khắc họa bối cảnh xã hội/không gian, mâu thuẫn trung tâm và bước ngoặt (tuyệt đối không spoil cái kết bất ngờ nếu là trinh thám để bảo toàn trải nghiệm đọc).
         - **Tâm lý nhân vật & Xung đột:** Mổ xẻ thế giới nội tâm, động cơ, sự giằng xé hay trò chơi tâm lý giữa các nhân vật chính.
         - **Chiều sâu tư tưởng & Bút pháp nghệ thuật:** Phân tích kỹ thuật tự sự (như người kể chuyện không đáng tin cậy, đa góc nhìn, nhịp điệu) và thông điệp sâu xa tác giả gửi gắm.
         - **Đánh giá & Trải nghiệm đọc:** Nhận định ai nên đọc cuốn sách này và cảm xúc đọng lại sau trang cuối.
      * Độ dài: Đầy đặn, sâu sắc, giàu giá trị tri thức văn chương (~350 - 500 từ).

    --- TÌNH HUỐNG 2: ĐỘC GIẢ HỎI TÓM TẮT NHANH / SƠ LƯỢC VỀ 1 TÁC PHẨM ---
    (Dấu hiệu: "tóm tắt cuốn...", "ngắn gọn về cuốn...", "sơ lược...", "nói ngắn gọn")
    * Quy tắc:
      1. Mở đầu tự nhiên 1 câu ngắn.
      2. Dòng định dạng sách: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
      3. Tóm tắt: [3-5 câu cô đọng, sắc sảo về tiền đề, nút thắt và chiều sâu]
      4. 1 câu đúc kết giá trị cuốn sách.

    --- TÌNH HUỐNG 3: ĐỘC GIẢ NHỜ TÌM SÁCH / GỢI Ý THEO GU, THỂ LOẠI HOẶC TÂM TRẠNG ---
    (Dấu hiệu: "gợi ý sách trinh thám", "sách gì đọc khóc", "tôi thích Haruki Murakami thì nên đọc gì", "sách chữa lành"...)
    * Quy tắc:
      1. Lời thấu cảm ngắn gọn, tao nhã.
      2. Đề xuất 2 đến 3 tác phẩm phù hợp nhất. Mỗi tác phẩm trình bày theo mẫu:
         **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
         Điểm nhấn: [2-3 câu lôi cuốn về cốt truyện và lý do vì sao cuốn này hợp với gu độc giả]
      3. Lời nhắn gửi ấm áp từ người thủ thư.

    --- TÌNH HUỐNG 4: HỎI ĐÁP CHUNG VỀ TÁC GIẢ, PHƯƠNG PHÁP ĐỌC HOẶC TRIẾT LÝ VĂN HỌC ---
    * Quy tắc:
      - Trả lời tinh tế, tri thức, tự nhiên như một người bạn cùng đọc sách.
      - Nếu có nhắc đến tác phẩm tiêu biểu minh họa, hãy in đậm: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**.

    [CÂU HỎI TỪ ĐỘC GIẢ]
    "{user_message}"
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.65,
            "maxOutputTokens": 1200,
            "topP": 0.95,
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=25)
        response.raise_for_status()
        data = response.json()
        generated_reply = data["candidates"][0]["content"]["parts"][0]["text"]
        
        # Lưu vào cache (giới hạn 300 mục)
        if len(MERCY_CHAT_CACHE) > 300:
            MERCY_CHAT_CACHE.pop(next(iter(MERCY_CHAT_CACHE)))
        MERCY_CHAT_CACHE[cache_key] = generated_reply
        
        return generated_reply
    except Exception as e:
        print(f"Lỗi Chat Mercy: {e}")
        return "Thủ thư Mercy hiện chưa thể kết nối đến máy chủ AI. Xin bạn vui lòng thử lại sau ít phút."

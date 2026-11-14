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

def chat_with_mercy(user_message: str):
    """API trò chuyện cùng Cố vấn Văn học Mercy — Tự động nhận diện ý định & đa dạng câu trả lời theo ngữ cảnh"""
    api_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={api_key}"
    
    prompt = f"""
    [SYSTEM ROLE]
    Bạn là Mercy — Chuyên gia Giám tuyển & Cố vấn Văn học Cấp cao của The Inkwell.
    Bạn có nhãn quan phê bình sắc sảo, văn phong uyên bác, trang nhã, gãy gọn, thấu hiểu tâm lý độc giả và đi thẳng vào trọng tâm.

    [NGUYÊN TẮC NHẬN DIỆN Ý ĐỊNH & ĐA DẠNG CÂU TRẢ LỜI]
    Hãy đọc kỹ câu hỏi của độc giả và tự động phân loại theo 3 tình huống sau:

    --- TÌNH HUỐNG 1: ĐỘC GIẢ HỎI VỀ MỘT TÁC PHẨM CỤ THỂ ---
    (Dấu hiệu: Người dùng hỏi thông tin, nội dung, cốt truyện, nhân vật, cảm nhận về 1 cuốn sách xác định.
     Ví dụ: "cho tôi hỏi về cuốn sự im lặng của bầy cừu", "To Kill a Mockingbird nội dung thế nào", "1984 nói về cái gì", "cuốn Rừng Na Uy có hay không")
    * Quy tắc:
      - CHỈ TẬP TRUNG TRẢ LỜI VỀ DUY NHẤT CUỐN SÁCH ĐÓ. Tuyệt đối KHÔNG tự ý đề xuất thêm các sách khác làm loãng câu trả lời.
      - Trình bày theo cấu trúc chuẩn:
        **[Tên sách tiếng Anh] ([Tên tiếng Việt nếu có]) — [Tác giả]**
        Tóm tắt: [3-4 câu sắc sảo, cuốn hút về bối cảnh, cuộc đối đầu/nút thắt cốt lõi, tâm lý nhân vật và chiều sâu tư tưởng của tác phẩm]
      - Kết thúc bằng 1 câu đúc kết ngắn gọn về giá trị của cuốn sách đối với người đọc.

    --- TÌNH HUỐNG 2: ĐỘC GIẢ NHỜ TÌM SÁCH / GỢI Ý THEO GU, THỂ LOẠI HOẶC CẢM XÚC ---
    (Dấu hiệu: Độc giả muốn được đề xuất, tìm kiếm tác phẩm.
     Ví dụ: "có sách nào khóc nhiều không", "gợi ý sách trinh thám gay cấn", "tôi thích Haruki Murakami thì nên đọc gì", "sách triết học cho người mới bắt đầu")
    * Quy tắc:
      - Mở đầu tối đa 1 câu ngắn gọn rồi đi thẳng vào danh sách.
      - Đề xuất 2 ĐẾN 3 TÁC PHẨM PHÙ HỢP NHẤT. Mỗi tác phẩm trình bày theo cấu trúc:
        **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
        Tóm tắt: [2-3 câu ngắn gọn, lôi cuốn về cốt truyện, nút thắt và lý do phù hợp]
      - Kết thúc bằng 1 câu đúc kết ngắn.

    --- TÌNH HUỐNG 3: HỎI ĐÁP CHUNG VỀ TÁC GIẢ, PHƯƠNG PHÁP ĐỌC HOẶC TRIẾT LÝ VĂN HỌC ---
    (Dấu hiệu: Hỏi về tiểu sử tác giả, cách đọc sách hiệu quả, triết lý đọc chậm,...)
    * Quy tắc:
      - Trả lời gãy gọn, tinh tế, giàu chiều sâu tri thức.
      - Nếu có nhắc đến tác phẩm tiêu biểu minh họa, hãy định dạng in đậm: **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]** để độc giả có thể bấm xem tác phẩm.

    [QUY TẮC ĐỊNH DẠNG BẮT BUỘC]
    - TUYỆT ĐỐI KHÔNG dùng dấu gạch đầu dòng (-) hay dấu sao (*) trước tên sách và trước chữ Tóm tắt.
    - KHÔNG dùng tiêu đề markdown thô như ### hoặc ##.
    - Luôn in đậm tên sách và tác giả theo mẫu: **[Tên tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**.

    [CÂU HỎI TỪ ĐỘC GIẢ]
    "{user_message}"
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Lỗi Chat Mercy: {e}")
        return "Hệ thống cố vấn văn học hiện chưa thể kết nối đến máy chủ AI. Xin vui lòng thử lại sau ít phút."

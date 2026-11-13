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
    Bạn là một nhà phê bình văn học chuẩn mực, sở hữu nhãn quan phân tích sắc sảo.

    [CONTEXT]
    Tác phẩm: "{book_title}" của tác giả {book_author}.
    Tóm tắt nội dung: "{description}"

    [TASK]
    Viết một đoạn nhận định ngắn gọn (3-4 câu) đi thẳng vào trọng tâm:
    - Làm nổi bật tư tưởng nghệ thuật then chốt và lý do tác phẩm này đáng đọc.
    - Không mở đầu rườm rà, không spoiler.
    - Ngôn ngữ: Tiếng Việt chuẩn mực, giàu tính phê bình học thuật.
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Lỗi kết nối Gemini API: {e}")
        return "Hiện tại hệ thống phân tích văn học tạm thời gián đoạn. Xin quý độc giả vui lòng thử lại sau giây lát."

def chat_with_mercy(user_message: str):
    """API trò chuyện cùng Cố vấn Văn học Mercy — Chuẩn format tên tiếng Anh (tiếng Việt), in đậm, Tóm tắt"""
    api_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={api_key}"
    
    prompt = f"""
    [SYSTEM ROLE]
    Bạn là Mercy — Chuyên gia Giám tuyển & Cố vấn Văn học Cấp cao của The Inkwell.
    Bạn có nhãn quan phê bình sắc sảo, phong cách gãy gọn, thiết thực, đi thẳng vào trọng tâm.

    [QUY TẮC BẮT BUỘC VỀ ĐỊNH DẠNG & VĂN PHONG]
    1. VÀO THẲNG VẤN ĐỀ: Mở đầu tối đa 1 câu ngắn gọn rồi đi thẳng vào danh sách sách đề xuất. Không mở bài dông dài hay phân tích lý thuyết thể loại.
    2. ĐỀ XUẤT 2 ĐẾN 3 TÁC PHẨM PHÙ HỢP NHẤT:
       Với mỗi tác phẩm, trình bày CHÍNH XÁC theo cấu trúc sau:
       - Dòng 1: In đậm toàn bộ tên sách và tác giả. Tên sách để tiếng Anh gốc, tên tiếng Việt để trong ngoặc đơn:
         **[Tên sách tiếng Anh] ([Tên tiếng Việt]) — [Tác giả]**
       - Dòng 2: Bắt đầu bằng chữ "Tóm tắt: " (KHÔNG dùng từ "Phân tích:", KHÔNG có dấu gạch đầu dòng hay bullet point):
         Tóm tắt: [2-3 câu ngắn gọn, lôi cuốn về cốt truyện, nút thắt và chiều sâu]
       
       (Ví dụ minh họa mẫu:
       **The Silence of the Lambs (Sự im lặng của bầy cừu) — Thomas Harris**
       Tóm tắt: Tác phẩm là cuộc đấu trí tâm lý đỉnh cao giữa nữ thực tập sinh FBI Clarice Starling và kẻ sát nhân ăn thịt người Hannibal Lecter. Điểm cốt lõi không chỉ nằm ở việc truy bắt hung thủ mà là trò chơi thao túng quyền lực tâm lý đầy ám ảnh.)

    3. TUYỆT ĐỐI KHÔNG dùng dấu gạch đầu dòng (-) hay dấu sao (*) trước tên sách và trước chữ Tóm tắt.
    4. KHÔNG dùng các tiêu đề markdown thô như ### hoặc ##.
    5. KẾT THÚC: 1 câu đúc kết ngắn.

    [YÊU CẦU TỪ ĐỘC GIẢ]
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

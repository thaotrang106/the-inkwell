import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách Đổi Trả & Hoàn Tiền | The Inkwell Bookstore",
  description: "Chính sách đổi trả minh bạch trong 7 ngày, miễn phí vận chuyển đối với sách lỗi và cam kết hoàn tiền nhanh chóng tại The Inkwell.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24 selection:bg-[#881337] selection:text-white font-sans">
      
      {/* 1. Thanh điều hướng quay lại */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-500 hover:text-[#881337] transition-colors font-medium group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Quay lại Cửa hàng</span>
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {/* Header trang phong cách Editorial thanh lịch */}
        <header className="border-b border-stone-300/80 pb-8 mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#881337] font-semibold mb-2">
            DỊCH VỤ KHÁCH HÀNG
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#1C1917] tracking-tight leading-tight mb-4">
            Chính Sách Đổi Trả &amp; Hoàn Tiền
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
            Mỗi ấn phẩm gửi đi đều được đóng gói cẩn thận. Nếu sách gặp bất kỳ lỗi kỹ thuật hoặc hư hại trong quá trình vận chuyển, The Inkwell hỗ trợ đổi sách mới tận nơi hoàn toàn miễn phí.
          </p>
        </header>

        {/* 3 Tiêu chí tóm lược (Dạng lưới phẳng, đường kẻ mảnh) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-stone-200">
          <div className="pr-4">
            <span className="font-mono text-xs text-stone-400 font-bold block mb-1">01</span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1.5">Đổi hàng trong 7 ngày</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Áp dụng kể từ ngày bạn nhận được kiện hàng thành công từ đơn vị vận chuyển.
            </p>
          </div>

          <div className="pr-4 sm:border-l sm:border-stone-200 sm:pl-6">
            <span className="font-mono text-xs text-stone-400 font-bold block mb-1">02</span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1.5">Miễn phí vận chuyển 2 chiều</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The Inkwell chi trả toàn bộ cước phí thu hồi sách cũ và gửi sách mới đến bạn.
            </p>
          </div>

          <div className="pr-4 sm:border-l sm:border-stone-200 sm:pl-6">
            <span className="font-mono text-xs text-stone-400 font-bold block mb-1">03</span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-1.5">Hoàn tiền trong 48 giờ</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nếu tựa sách đã hết hàng không thể đổi mới, chúng tôi hoàn trả 100% qua tài khoản ngân hàng.
            </p>
          </div>
        </div>

        {/* Nội dung chi tiết chính sách (Dạng bài viết pháp lý xuất bản chuẩn mực) */}
        <article className="space-y-12 text-[#1C1917]">
          
          {/* Mục 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
              1. Trường hợp áp dụng đổi trả
            </h2>
            <div className="text-sm text-stone-700 leading-relaxed space-y-2">
              <p>Bạn có thể yêu cầu đổi hoặc hoàn trả sản phẩm trong các trường hợp sau:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Lỗi in ấn kỹ thuật:</strong> Sách bị mất trang, trùng trang, nhòe mực không đọc được chữ, rách từ nhà in.</li>
                <li><strong>Lỗi đóng bìa &amp; gia công:</strong> Gáy sách bị bong keo, bung chỉ may, bìa bị rách hoặc dập góc nghiêm trọng.</li>
                <li><strong>Hư hại do vận chuyển:</strong> Kiện hàng bị va đập, ướt nước hoặc rách hộp ảnh hưởng trực tiếp đến sách.</li>
                <li><strong>Giao sai đơn hàng:</strong> Giao nhầm tựa sách, sai số lượng hoặc phiên bản so với đơn đặt hàng.</li>
              </ul>
            </div>
          </section>

          {/* Mục 2 */}
          <section className="space-y-3 pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
              2. Điều kiện tình trạng sách
            </h2>
            <div className="text-sm text-stone-700 leading-relaxed space-y-2">
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Sách còn nguyên hiện trạng như khi nhận, chưa có vết viết vẽ, ghi chú, gạch chân hoặc làm gập mép trang sách.</li>
                <li>Phụ kiện đi kèm như bookmark, bìa áo, thiệp hoặc bản đồ minh họa (nếu có) cần được hoàn lại cùng với cuốn sách.</li>
                <li>Bạn chỉ cần cung cấp mã đơn hàng hoặc số điện thoại dùng để đặt sách, không cần giữ lại hóa đơn giấy.</li>
              </ul>
            </div>
          </section>

          {/* Mục 3 */}
          <section className="space-y-3 pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
              3. Quy trình gửi đổi sách
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-white border border-stone-300/80 rounded-[4px]">
                <p className="font-mono text-[11px] font-bold text-[#881337] uppercase tracking-wider mb-1">Bước 1</p>
                <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-1">Thông báo với nhà sách</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Chụp 1-2 bức ảnh vị trí sách bị lỗi và gửi qua Zalo hoặc email <span className="font-mono text-[#1C1917]">support@theinkwell.vn</span>.
                </p>
              </div>

              <div className="p-4 bg-white border border-stone-300/80 rounded-[4px]">
                <p className="font-mono text-[11px] font-bold text-[#881337] uppercase tracking-wider mb-1">Bước 2</p>
                <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-1">Xác nhận đổi mới</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The Inkwell xác nhận yêu cầu và tạo đơn đổi hàng 2 chiều qua đối tác vận chuyển trong 2 đến 4 giờ làm việc.
                </p>
              </div>

              <div className="p-4 bg-white border border-stone-300/80 rounded-[4px]">
                <p className="font-mono text-[11px] font-bold text-[#881337] uppercase tracking-wider mb-1">Bước 3</p>
                <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-1">Đổi sách tận nơi</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Nhân viên giao vận mang cuốn sách mới tinh đến giao và thu lại cuốn sách cũ, bạn không cần ra bưu cục gửi hàng.
                </p>
              </div>
            </div>
          </section>

          {/* Mục 4 */}
          <section className="space-y-3 pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
              4. Phương thức hoàn tiền
            </h2>
            <div className="text-sm text-stone-700 leading-relaxed space-y-2">
              <p>
                Trong trường hợp tựa sách cần đổi đã hết hàng trong kho, bạn có thể chọn đổi sang tựa sách khác có giá trị tương đương hoặc nhận hoàn tiền 100% giá trị sản phẩm.
              </p>
              <p className="text-stone-600">
                Thời gian chuyển khoản hoàn tiền: từ <strong>24 đến 48 giờ làm việc</strong> kể từ khi có xác nhận hoàn tiền từ thủ thư hỗ trợ.
              </p>
            </div>
          </section>

        </article>

        {/* Khối liên hệ hỗ trợ thanh lịch ở chân trang */}
        <div className="mt-14 pt-8 border-t border-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">Cần hỗ trợ về một đơn hàng cụ thể?</h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Vui lòng chuẩn bị sẵn mã đơn hàng và liên hệ trực tiếp với chúng tôi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white rounded-[4px] text-xs font-medium transition-colors cursor-pointer"
            >
              <Mail size={13} />
              <span>Gửi yêu cầu hỗ trợ</span>
            </Link>
            <Link 
              href="/" 
              className="text-xs text-stone-500 hover:text-[#1C1917] font-medium"
            >
              Về Trang chủ
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

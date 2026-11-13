import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream py-16 mt-20 border-t border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-6" title="The Inkwell">
            <img 
              src="/theinkwell_wordmark_light_transparent.png" 
              alt="The Inkwell" 
              className="h-9 sm:h-11 w-auto object-contain hover:opacity-85 transition-opacity"
            />
          </Link>
          <p className="text-cream/60 max-w-md text-sm leading-relaxed mb-6">
            Nơi nghệ thuật kể chuyện giao thoa cùng Trí tuệ Nhân tạo. Khám phá hàng ngàn tựa sách được tuyển chọn đặc biệt dành riêng cho tâm hồn bạn.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-cream/10 hover:bg-terracotta cursor-pointer transition-colors"></div>
            <div className="w-8 h-8 rounded-full bg-cream/10 hover:bg-terracotta cursor-pointer transition-colors"></div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-6 uppercase text-xs tracking-wider text-cream/80">Khám phá</h3>
          <ul className="space-y-4 text-sm text-cream/60">
            <li><a href="#" className="hover:text-terracotta transition-colors">Văn học hư cấu</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Khoa học viễn tưởng</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Tác phẩm kinh điển</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Phát triển bản thân</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 uppercase text-xs tracking-wider text-cream/80">Hỗ trợ</h3>
          <ul className="space-y-4 text-sm text-cream/60">
            <li><a href="#" className="hover:text-terracotta transition-colors">Tài khoản của tôi</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Liên hệ</a></li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-cream/10 text-xs text-cream/40 flex justify-between">
        <p>© 2026 The Inkwell. Mọi quyền được bảo lưu.</p>
        <p>Phát triển với Next.js & FastAPI.</p>
      </div>
    </footer>
  );
}

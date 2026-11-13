import os
from PIL import Image, ImageChops, ImageFilter, ImageEnhance

def export_mermaid_from_upload():
    src_path = r"C:\Users\trang\.gemini\antigravity\brain\d2eea2e0-4756-4804-9912-799784a51bf6\.user_uploaded\media_1793327168781_ea59e79d.png"
    
    if not os.path.exists(src_path):
        print(f"Error: {src_path} not found")
        return

    img = Image.open(src_path)
    print(f"Original size: {img.size}, mode: {img.mode}")

    # Convert to RGBA
    img_rgba = img.convert("RGBA")
    
    # Create white background
    white_bg = Image.new("RGBA", img_rgba.size, (255, 255, 255, 255))
    diff = ImageChops.difference(img_rgba.convert("RGB"), Image.new("RGB", img_rgba.size, (255, 255, 255)))
    bbox = diff.getbbox()
    print(f"Content bbox: {bbox}")

    if bbox:
        # Add comfortable padding around the diagram
        pad = 30
        crop_box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(img.width, bbox[2] + pad),
            min(img.height, bbox[3] + pad)
        )
        cropped = img_rgba.crop(crop_box)
    else:
        cropped = img_rgba

    # Create composite on pure white
    final_cropped = Image.new("RGB", cropped.size, (255, 255, 255))
    final_cropped.paste(cropped, mask=cropped.split()[3] if cropped.mode == "RGBA" else None)

    # 1. Save crisp 1x standard resolution
    std_w, std_h = final_cropped.size
    print(f"Cropped standard size: {std_w}x{std_h}")

    # 2. Generate 3x High-Resolution (HD 300 DPI) version with Lanczos
    scale = 3
    hd_w, hd_h = std_w * scale, std_h * scale
    hd_img = final_cropped.resize((hd_w, hd_h), Image.Resampling.LANCZOS)
    
    # Apply subtle unsharp mask to ensure text and lines are razor sharp
    hd_img = hd_img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=2))
    
    # Slight contrast enhancement for pure white background and crisp text
    enhancer = ImageEnhance.Contrast(hd_img)
    hd_img = enhancer.enhance(1.05)

    # Output targets
    output_files = [
        "So_do_ERD_Mermaid.png",
        "ERD_Mermaid.png",
        "Final Report/So_do_ERD_Mermaid.png",
        "Final Report/ERD_Mermaid.png",
        r"C:\Users\trang\.gemini\antigravity\brain\d2eea2e0-4756-4804-9912-799784a51bf6\So_do_ERD_Mermaid.png"
    ]

    for p in output_files:
        norm_p = os.path.normpath(p)
        os.makedirs(os.path.dirname(norm_p) if os.path.dirname(norm_p) else '.', exist_ok=True)
        # Save as 300 DPI high-res PNG
        hd_img.save(norm_p, "PNG", dpi=(300, 300))
        print(f"[SUCCESS] Exported high-res PNG to: {norm_p} ({hd_w}x{hd_h} at 300 DPI)")

if __name__ == '__main__':
    export_mermaid_from_upload()

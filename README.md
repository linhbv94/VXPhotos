# VXPhotos — Fast Photo Picker & Media Triage Utility

[![Release](https://img.shields.io/github/v/release/linhbv94/VXPhotos?style=flat-square&color=06b6d4)](https://github.com/linhbv94/VXPhotos/releases/latest)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-0284c7?style=flat-square)](https://github.com/linhbv94/VXPhotos/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Ecosystem](https://img.shields.io/badge/part%20of-VXUtilities-0ea5e9?style=flat-square)](../_summary/master_overview.md)

**VXPhotos** là tiện ích desktop chuyên dụng giúp lọc, phân loại, tuyển chọn (culling) và dọn dẹp thư viện ảnh tốc độ cao dành cho macOS và Windows.

Ứng dụng giải quyết triệt để các hạn chế của **macOS Finder** và **Windows Explorer** (thiếu cột EXIF tùy biến, không phân loại được ảnh chụp máy cơ thật vs ảnh chụp màn hình / ảnh mạng, thao tác xoay và đổi tên hàng loạt phức tạp, chậm chạp khi duyệt thư mục chứa hàng chục nghìn ảnh).

> **Tôn chỉ:** *Tốc độ duyệt tối đa, xử lý EXIF không giải mã toàn bộ ảnh, bảo toàn 100% chất lượng tệp gốc.*  
> **Phiên bản hiện tại:** `v1.0.15` — Thành viên trong hệ sinh thái [VXUtilities](../_summary/master_overview.md).

---

## 1. Tính năng nổi bật

* **Quét & Phân loại thư mục tốc độ cao:** Quét đệ quy hàng chục nghìn bức ảnh trong tích tắc nhờ Rust Native Scanner và cơ chế đọc Header-only EXIF siêu nhẹ.
* **Tự động phân tách Camera vs Non-Camera:** Tự động tách biệt ảnh chụp từ máy ảnh chuyên nghiệp (có thông số Shutter Speed, ISO, F-Number, Camera Model) với ảnh tải từ mạng hoặc ảnh chụp màn hình.
* **Xem trước siêu tốc (Quick Preview):**
  * *macOS:* Kích hoạt trực tiếp Native `QLPreviewPanel` (Quick Look chuẩn Mac) bằng phím Spacebar.
  * *Windows:* Cửa sổ Peek-like HUD Window nổi siêu mượt sử dụng Windows Shell API.
* **Xoay ảnh Lossless không nén lại:** Xoay ảnh JPEG bằng cách can thiệp trường EXIF Orientation tag trong Header, không nén lại ma trận điểm ảnh, giữ nguyên 100% độ sắc nét ban đầu.
* **Quy trình Đổi tên An toàn 2 pha (No-clobber Renamer):** Đổi tên hàng loạt theo khuôn mẫu ngày giờ chụp EXIF, camera model kèm cơ chế Operation Journal ghi nhận lịch sử, chống ghi đè nhầm lẫn.
* **Tự động cập nhật trực tiếp (Auto-Update):** Tích hợp thông báo cập nhật góc dưới màn hình, tải và cài đặt phiên bản mới chỉ với 1-click.

---

## 2. Tải xuống & Cài đặt

Tải bản phát hành mới nhất dành cho hệ điều hành của bạn tại [GitHub Releases](https://github.com/linhbv94/VXPhotos/releases/latest):

* **macOS (Apple Silicon & Intel):** Tải tệp `.dmg` hoặc `.app.tar.gz`. Kéo ứng dụng vào thư mục `/Applications`.
* **Windows (x64):** Tải bộ cài `.msi` hoặc tệp thực thi `.exe` độc lập.

---

## 3. Ngăn xếp Công nghệ (Tech Stack)

| Tầng | Công nghệ | Vai trò đảm nhiệm |
|---|---|---|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app/) (Rust) | Quản lý cửa sổ native, IPC hiệu năng cao, tích hợp OS |
| **Frontend UI** | React 18/19 + TypeScript + Vite + Tailwind CSS | Giao diện bảng tính ảo hoá Grid/Table, Dark-first theme (`#0f1117`) |
| **Media Core** | Rust Native Engine | Fast File Scanner, Header-only EXIF, Lossless JPEG Rotation, Operation Journal |
| **Platform Adapters** | Swift Cocoa & Win32 API | *macOS:* Native `QLPreviewPanel` Quick Look, `noteFileSystemChanged`<br>*Windows:* Shell `IShellItemImageFactory`, `SHChangeNotify` |

---

## 4. Hướng dẫn Phát triển & Biên dịch

### Yêu cầu môi trường
* Node.js ≥ 20.x và npm
* Rust & Cargo ≥ 1.80
* macOS: Xcode Command Line Tools (SDK 27.0 baseline) / Windows: C++ Build Tools

### Các lệnh phát triển
```bash
# Cài đặt thư viện frontend
npm install

# Khởi chạy chế độ phát triển
npm run tauri dev

# Biên dịch gói ứng dụng hoàn chỉnh (.app / .msi)
npm run build
npm run tauri build -- --bundles app
```

---

## 5. Hệ thống Tài liệu Đặc tả Kỹ thuật (Specification Suite)

Bộ đặc tả được xây dựng đầy đủ theo chuẩn hệ thống công cụ VXUtilities trong thư mục [docs/spec/](docs/spec/):

- 📋 [00_system_overview.md](docs/spec/00_system_overview.md): Tổng quan hệ thống, tôn chỉ, phân tích 5 điểm nghẽn kỹ thuật & kiến trúc phân lớp 3 tầng.
- 🔄 [01_business_process.md](docs/spec/01_business_process.md): Sơ đồ Swimlane quy trình Triage, quy tắc phân loại Camera vs Non-camera.
- ⚙️ [02_feature_flow.md](docs/spec/02_feature_flow.md): Luồng chi tiết: Máy trạng thái Selection vs Marking, Priority Scheduler, Pipeline Xoay Lossless & Đổi tên an toàn 2 pha.
- 🎨 [03_ui_wireframe.md](docs/spec/03_ui_wireframe.md): Thiết kế giao diện theo VX Master Theme, Cây folder Left Sidebar, Grid View & Detail Table, Spacebar Quick Preview.
- 🔌 [04_api_data.md](docs/spec/04_api_data.md): Hợp đồng IPC Commands giữa Tauri Rust Core và React TypeScript, FileItem, ExifMetadata schemas.
- 🧪 [05_qa_acceptance.md](docs/spec/05_qa_acceptance.md): Tiêu chuẩn nghiệm thu Gherkin (AC-01 → AC-10), Ma trận Edge Cases (10k file, thẻ SD Read-Only).
- 🎬 [06_demo_presentation.md](docs/spec/06_demo_presentation.md): Kịch bản trình diễn nghiệm thu 7 bước (DoD Playbook) & Hướng dẫn dựng Test Fixtures.

---

## 6. Giấy phép & Bản quyền (License)

Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**.  
Xem toàn văn giấy phép tại tệp [LICENSE](LICENSE).

Bản quyền © 2026 Viet Linh Bui. Đã đăng ký toàn bộ quyền.

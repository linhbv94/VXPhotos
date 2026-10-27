# vxphotos 1.0.15 — phát hành native SDK27
Ngày: 2026-10-27. User giao release sau migration traffic lights.

Giữ engine, app ID, khóa updater, minimum OS và icon mới đã phát hành. Chỉ thêm gate SDK27.0 thật, npm wrapper/build.rs và CI Xcode27. Hai target Mac đều build trên runner standard `xcode-27`; bản Intel cross-build x86_64 riêng, không gọi đó là test runtime Intel. Runner macos-15 cũ không có SDK27. Đã kiểm probe Mach-O Intel local SDK27.0; không patch metadata.

Local migration trước đó có bundle SDK27/codesign và AppKit fixture 50 lượt, bezel 14pt; không lấy fixture làm runtime QA toàn app. Lượt này chạy frontend/regressions; sau CI kiểm executable SDK27 thật, version/architecture/ID/icon/signatures và public.

Đang chuẩn bị tag; chưa publish. GUI native/old→new updater chưa chạy lại ở lượt release này.

## Kết quả public

[Photos1.0.15](https://github.com/linhbv94/VXPhotos/releases/tag/v1.0.15) stable/latest; tag9922eea78858b144ed264a40dd895b7d16f3b45e, PR14 merged. Build40451641196/publish40453566744 success.

Mach-O trong hai archive cập nhật đúng ARM64/x86_64 và SDK27.0 thật (LC_VERSION_MIN_MACOSX khi deployment10.13); strict codesign, ID/version/icon đúng. Hai DMG checksum/bundle/icon đạt; Windows executablex64/version/icon7payloads đúng. Sáuasset/layout, mọi Minisign signature và tamper rejection đạt. Kiểm public không token: manifest exact, sáuassets HTTP200. [Evidence](release_1_0_15_evidence.json).

Đóng riêng lượt Photos. Chưa GUI Windows/Intel hoặc old→new updater; Intel cross-build trên hostARM64, không gọi là runtime Intel.

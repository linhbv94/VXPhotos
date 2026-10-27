# vxphotos 1.0.14 — QA và release icon mới

Ngày:2026-10-27. User giao QA và release MP3/Photos với bộ icon mới. Phát hành đầy đủ Windows x64, Mac Silicon/Intel cùng engine hiện hữu.

## Phạm vi và QA trước tag

Chỉ chọn native icons, version/note và báo cáo của lượt này; không gom docs/examples/test fixtures/icon sources rời hoặc thay đổi converter của agent khác. Không sửa audio/photo engine, public key, appID, installer mode. Native icon files khớp root outputs;3ảnh nguồn khớp thư viện zicons; ICO đủ16/24/32/48/64/128/256. Đã xem ảnh nguồn mới.

Frontend production build PASS. 30 Rust PASS, 1 ignored là crash child; bridge audit PASS;18 updater/release PASS +1Windows-only skip trên Mac;2recent PASS. Regression thực chạy fixture riêng: thao tác mutation/Undo/crash giữ dữ liệu theo suite hiện hữu. Source runtime không đổi so với main public trước đó; đây không phải chứng nhận mọi filesystem/OS scenario.

Chưa mở GUI native hoặc test old→new updater trong lượt icon này. GUI Windows/Intel chưa thử; CI/build/package không thay GUI proof. Sau CI phải đối chiếu icon ICNS trong2gói Mac và ICO resources của PE Windows, ký updater/tamper rejection, đúng architecture/version/ID,6asset public.

## Checkpoint

Tagv1.0.14 đã push tại `9fde02b51c03be1c93300f49452ed8978bf428dc`; build run40441256131 đang chạy. Chưa publish; package/icon/signature/public sẽ cập nhật sau kiểm chứng.

## Kết quả public

Đã phát hành [VXPhotos 1.0.14](https://github.com/linhbv94/VXPhotos/releases/tag/v1.0.14), stable/latest. Tag `9fde02b51c03be1c93300f49452ed8978bf428dc`; PR #13 đã merge sau Windows PR checks thành công (run 40440734114). Build run **40441256131**, publish run **40443931754** đều success.

- Manifest đủ platform và sáu asset đúng layout; xác minh Minisign cho mọi entry và từ chối gói bị đổi một byte.
- Mac Silicon/Intel: đúng ARM64/x86_64, app ID/version; strict codesign và checksum DMG đạt. ICNS trong cả archive cập nhật và DMG byte-exact với icon mới.
- Windows: executable x64, version 1.0.14; bảy payload icon trong PE byte-exact với ICO mới.
- Sau publish, kiểm tra không đăng nhập: manifest public khớp bản đã xác minh và cả sáu asset HTTP 200. [Evidence](release_1_0_14_evidence.json), [CI checkpoint](release_1_0_14_ci_checkpoint.json).

Job Intel mất thời gian compile release, không phải lỗi đóng gói; không sửa source hoặc retry để vượt gate. Lượt này không mở lại GUI native và không chạy cập nhật từ bản cũ lên bản mới. Không dùng build/package để tuyên bố GUI Windows/Intel hoặc updater E2E đạt. Lượt Codex QA/release Photos đã đóng theo quy ước.

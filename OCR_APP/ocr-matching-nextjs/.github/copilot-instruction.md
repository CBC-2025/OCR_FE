🎯 Nhiệm vụ của Frontend trong hệ thống (không dùng jobId, nhận kết quả trực tiếp từ BE)

1. Upload & Giao tiếp với BE

- Cho phép người dùng tải lên file (ảnh/PDF).
- Gọi API BE để gửi file và NHẬN KẾT QUẢ TRỰC TIẾP trong response (không có jobId). Ví dụ: extracted_data, image_files, comparison.
- Hiển thị progress khi upload/đợi phản hồi (client-side), không cần polling hay WebSocket.

2. Hiển thị kết quả OCR & So khớp

- Render thông tin trích xuất do BE trả về.
- Hiển thị tỉ lệ so khớp theo 3 màu XANH / VÀNG / ĐỎ.
- Cho phép người dùng xem song song (Phiếu chuyển vs Hợp đồng).

3. Tương tác & Chỉnh sửa thủ công

- Cho phép sửa text bị OCR sai (ví dụ số CCCD thiếu số).
- Ghi chú và xác nhận (approve/reject) nếu có yêu cầu nghiệp vụ.

4. Quản lý quy trình (phiên bản đồng bộ)

- Trạng thái được quản lý cục bộ trên FE: uploading → processing (chờ response) → completed.
- Nếu cần lưu/khôi phục sau này: yêu cầu BE cung cấp API lưu bản ghi và trả về một recordId. Không nằm trong phạm vi hiện tại khi BE chỉ trả kết quả trực tiếp.

5. UX nâng cao (tùy roadmap)

- Highlight trực quan vùng OCR trên ảnh/PDF.
- Diff view: highlight ký tự khác biệt giữa 2 văn bản.
- Dashboard/thống kê khi có API lưu trữ từ BE (cần recordId hoặc tương đương).

🖼️ UI cơ bản cần có

1. Trang Upload

- Drag & drop hoặc chọn file.
- Có thể hỗ trợ upload nhiều file (Phiếu + Hợp đồng) theo quy ước của BE.
- Hiển thị progress bar khi upload.
- Khi BE trả kết quả: lưu vào state/context cục bộ rồi điều hướng sang trang Kết quả.

2. Trang Kết quả OCR & So khớp

- Bảng 2 cột (Phiếu chuyển vs Hợp đồng).
- Mỗi dòng là 1 trường (Họ và tên, Số CCCD, Địa chỉ người mua, Địa chỉ người bán, Số thửa (Thửa đất số), Tờ bản đồ, Diện tích, Loại đất, Tài sản gắn liền với đất).
- Cột cuối hiển thị màu (XANH/VÀNG/ĐỎ):
	- XANH: Tỉ lệ so khớp đạt 100%
	- VÀNG: Tỉ lệ so khớp 85-99%
	- ĐỎ: Tỉ lệ so khớp dưới 85%
- Không có jobId: route có thể là /results (không có tham số). Trang đọc dữ liệu từ Context/State. Nếu F5 mất dữ liệu, hiển thị thông báo và hướng dẫn upload lại (hoặc cân nhắc lưu tạm localStorage).

Ví dụ hiển thị:

Trường              Phiếu chuyển      Hợp đồng              Trạng thái
Họ và tên           Nguyễn Văn A      Nguyễn Văn A          🟩 XANH
Số CCCD             012345678901      01234567890_1         🟨 VÀNG
Địa chỉ người mua   123 Lê Lợi, HN    123 Lê Lợi, Hà Nội    🟥 ĐỎ

3. Trang Review / Chỉnh sửa

- Cho phép click vào từng trường để chỉnh text.
- Highlight diff (chữ khác nhau bôi màu đỏ).
- Nút “Xác nhận” hoặc “Gửi lại để xử lý”.
- Không có jobId: trang có thể là một bước ngay trong /results hoặc /review đọc từ Context.

4. Dashboard / Danh sách hồ sơ (tùy chọn — cần BE lưu trữ)

- Chỉ khả thi khi BE có API lưu kết quả và trả về recordId/list. Khi đó mới có thể lọc theo trạng thái (XANH/VÀNG/ĐỎ), tìm kiếm theo tên, CCCD, ...
- Với luồng hiện tại (BE trả trực tiếp, không id), bỏ qua phần Dashboard.

⚙️ Logic chức năng từ cơ bản → nâng cao
1. Cơ bản (hiện tại)

- Upload file → gọi API → nhận kết quả trực tiếp → hiển thị bảng so khớp.

2. Trung bình

- Cho phép người dùng chỉnh sửa từng trường (inline edit) và highlight diff.
- Lưu kết quả đã chỉnh sửa về BE (cần API lưu riêng; nếu chưa có, lưu tạm local state hoặc export JSON).

3. Nâng cao (phụ thuộc BE)

- Hiển thị trực tiếp ảnh/PDF gốc, overlay bounding box quanh text OCR.
- So sánh theo batch, thống kê.
- Realtime (WebSocket) nếu sau này BE hỗ trợ job/recordId.
- Role-based UI (người nhập liệu, reviewer, admin).

🔧 Công nghệ / Thư viện gợi ý cho FE

- Upload: React Dropzone; gọi trực tiếp endpoint BE (ví dụ /extract_pdf). Có thể dùng Next.js API Route để proxy nếu cần CORS.
- UI: Tailwind CSS + Shadcn UI + DataTable.
- Highlight diff: diff-match-patch hoặc react-diff-viewer.
- PDF/ảnh với bounding box: pdf.js, react-pdf, hoặc Konva.js để overlay box.
- State: React Context/State cho “kết quả hiện tại” (không cần SWR/React Query polling).
- Realtime: Không cần cho phiên bản đồng bộ. Chỉ thêm khi BE hỗ trợ.

📦 Hợp đồng dữ liệu BE (hiện tại — ví dụ)

- Endpoint: POST /extract_pdf → trả về JSON dạng:
	- extracted_data: dữ liệu đã trích xuất (ExtractedData)
	- image_files: danh sách đường dẫn ảnh để hiển thị (dùng GET /get_image/{path})
	- comparison: kết quả so khớp (ComparisonResult) dùng để tô màu XANH/VÀNG/ĐỎ theo ngưỡng 100% / 85–99% / <85%

🛠️ Checklist cập nhật code khi bỏ jobId

- Routes:
	- Đổi /results/[jobId] → /results (đọc từ Context/State).
	- Đổi /review/[jobId] → /review hoặc gộp vào /results.
- Hooks:
	- Loại bỏ useJobPolling, useWebSocket (không cần khi xử lý đồng bộ).
- Context:
	- JobContext chuyển sang lưu “currentResult” (kết quả gần nhất) thay vì map theo jobId.
- API Routes FE (nếu có):
	- Bỏ các route /api/jobs/* phụ thuộc jobId.

Ghi chú: Những tính năng như dashboard, resume sau F5, hoặc chia sẻ deep-link chỉ khả thi khi BE cung cấp cơ chế lưu trữ và trả về một định danh ổn định (recordId). Phiên bản hiện tại tập trung vào luồng đồng bộ: upload → nhận kết quả → xem/chỉnh sửa ngay.
<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

- Dự án này sử dụng React, Vite, Tailwind CSS, Framer Motion.
- Ưu tiên code sạch, dễ mở rộng, sử dụng Tailwind cho style và Framer Motion cho animation.
- Cấu trúc thư mục: src/components, src/pages, src/styles.
- Sử dụng React Router cho routing.

**Hướng dẫn chỉnh sửa file:**
- Khi được yêu cầu chỉnh sửa một file (ví dụ: `ServiceSection.tsx`, `Navbar.tsx`, v.v.), **không tạo file mới**. Thay vào đó, chỉnh sửa trực tiếp trên file hiện có.
- Chỉ thay đổi hoặc thêm các phần được yêu cầu, giữ nguyên các phần không liên quan để tránh viết lại toàn bộ file.
- Nếu cần thêm component hoặc file mới, chỉ tạo mới khi có yêu cầu rõ ràng (ví dụ: "tạo file mới `NewSection.tsx`").
- Đảm bảo code chỉnh sửa tương thích với các file khác trong dự án (React, Tailwind CSS, Framer Motion, React Router).
- Nếu cần hiển thị code đã chỉnh sửa, wrap mã trong artifact tag với `contentType="text/tsx"`.
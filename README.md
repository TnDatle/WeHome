# WeHome – Web Bán Đồ Gia Dụng

WeHome là một **website thương mại điện tử bán đồ gia dụng**, được xây dựng theo mô hình **Full-Stack** với React + Bootstrap ở Frontend và Node.js / Express.js + Firebase ở Backend.  
Dự án tập trung vào trải nghiệm người dùng, quản lý sản phẩm – đơn hàng – người dùng, và hỗ trợ vai trò Admin riêng biệt.

---

##  Tính năng chính

### Người dùng (User)
- Đăng ký / đăng nhập tài khoản
- Xem danh sách sản phẩm theo danh mục
- Tìm kiếm và lọc sản phẩm
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và theo dõi trạng thái đơn hàng

### Quản trị viên (Admin)
- Quản lý sản phẩm (thêm / sửa / xóa)
- Quản lý danh mục
- Quản lý đơn hàng
- Thống kê số lượng người dùng, sản phẩm, đơn hàng
- Dashboard realtime (Firebase)

### Chatbot gợi ý sản phẩm (Optional)
- Tư vấn sản phẩm trong lĩnh vực đồ gia dụng
- Chỉ truy vấn database khi cần
- Sử dụng AI API để hỗ trợ trải nghiệm mua sắm

---


---

## Công nghệ sử dụng

### Frontend
- React.js
- Bootstrap / CSS

### Backend
- Node.js
- Express.js
- Firebase Firestore
- Firebase Authentication

### Khác
- Firebase Realtime / Firestore
- RESTful API
- Environment Variables (.env)


### Mục tiêu dự án

- Áp dụng kiến thức Full-Stack vào dự án thực tế

- Làm quen với Firebase Firestore & Authentication

- Xây dựng hệ thống phân quyền User / Admin

- Chuẩn bị sản phẩm cho Portfolio & Internship

### Hướng phát triển trong tương lai

- Thanh toán online (VNPay / Momo)

- Đánh giá & bình luận sản phẩm

- Phân quyền chi tiết hơn (Super Admin)

- Tối ưu SEO & hiệu năng

- Chuyển sang TypeScript / Next.js


## Chạy dự án tất cả (concurrently)
 D:\DACN08>npm start

## Chạy FrontEnd 
 D:\DACN08> cd frontend
 D:\DACN08\frontend> npm start

## Chạy Backend
 D:\DACN08> cd backedn
 D:\DACN08\backend> npm start

## Chạy Admin
 D:\DACN08> cd admin
 D:\DACN08\admin> npm start
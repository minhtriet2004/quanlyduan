# 🎬 Hệ Thống Quản Lý Rạp Phim - Admin Panel

## 📌 Giới Thiệu

Đây là hệ thống quản lý rạp phim hoàn chỉnh với:
- 🎯 **Admin Dashboard** - Giao diện quản lý chuyên nghiệp
- 📊 **Database** - Lưu trữ dữ liệu hoàn chỉnh
- 🔐 **Authentication** - Hệ thống xác thực admin
- 📈 **Statistics** - Thống kê và báo cáo

---

## 🚀 Cách Sử Dụng

### 1️⃣ Đăng Nhập Admin
**URL**: `admin-login.html`

**Tài Khoản Demo:**
- Email: `admin@cinema.vn`
- Mật khẩu: `admin123`

### 2️⃣ Truy Cập Admin Dashboard
**URL**: `admin.html`

---

## 📂 Cấu Trúc File

```
quanlyduan-main/
├── admin.html                 # Giao diện admin dashboard
├── admin-login.html          # Trang đăng nhập admin
├── DATABASE_SCHEMA.md        # Tài liệu schema database
├── ADMIN_GUIDE.md           # Hướng dẫn sử dụng admin
├── css/
│   └── admin.css            # CSS cho admin panel
├── js/
│   └── admin.js             # Logic admin dashboard
├── index.html               # Trang chủ
├── movie-details.html       # Chi tiết phim
├── choose-seat.html         # Chọn ghế
└── img/                     # Hình ảnh
```

---

## 🎨 Các Tính Năng Chính

### 📊 Dashboard
- Tổng doanh thu
- Tổng số đơn hàng
- Tổng số phim đang chiếu
- Tổng người dùng
- Danh sách đơn hàng gần đây
- Phim phổ biến nhất

### 🎬 Quản Lý Phim
- ➕ Thêm phim
- ✏️ Sửa thông tin phim
- 🗑️ Xóa phim
- 📋 Danh sách tất cả phim
- 🏷️ Trạng thái phim (Sắp chiếu, Đang chiếu, Kết thúc)

### ⏰ Suất Chiếu
- ➕ Thêm suất chiếu mới
- ✏️ Chỉnh sửa suất chiếu
- 🗑️ Xóa suất chiếu
- 📍 Quản lý phòng chiếu
- 🪑 Theo dõi ghế trống

### 🎫 Đơn Hàng
- 📋 Danh sách tất cả đơn hàng
- 🔍 Lọc theo trạng thái
- ✓ Xác nhận/Hủy đơn
- 💰 Theo dõi doanh thu
- 👤 Thông tin khách hàng

### 🏢 Rạp Phim
- ➕ Thêm rạp mới
- ✏️ Sửa thông tin rạp
- 🗑️ Xóa rạp
- 📞 Quản lý liên hệ

### 👥 Người Dùng
- 📊 Danh sách người dùng
- 🎫 Số lượng đơn hàng
- 📞 Thông tin liên hệ
- 📅 Ngày tạo tài khoản

### 📈 Báo Cáo
- 💹 Doanh thu theo ngày/tuần/tháng
- 🎬 Phim bán chạy nhất
- 📊 Biểu đồ thống kê
- 📥 Xuất báo cáo Excel

---

## 💾 Database

Dữ liệu được lưu trữ trong **LocalStorage** của trình duyệt.

### Cấu Trúc Dữ Liệu

**Các Collection:**
1. `movies` - Danh sách phim
2. `cinemas` - Danh sách rạp
3. `showings` - Suất chiếu
4. `bookings` - Đơn hàng
5. `users` - Người dùng
6. `admins` - Tài khoản admin

**Chi tiết xem**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 🔐 Xác Thực & Bảo Mật

### Quy Trình Đăng Nhập
1. Nhập email & mật khẩu
2. Kiểm tra trong database
3. Tạo session (lưu trong localStorage)
4. Redirect đến dashboard

### Session Management
- Session được lưu trong `localStorage['adminSession']`
- Tự động kiểm tra session khi load trang
- Tự động logout khi tắt browser (tuỳ chọn)

### Độ An Toàn
⚠️ **Lưu ý quan trọng:**
- Hiện tại mật khẩu lưu dạng plain text (chỉ dùng cho dev)
- **Trong production**, phải:
  - Mã hóa mật khẩu (bcrypt)
  - Sử dụng HTTPS
  - Implement token JWT
  - Sử dụng server-side authentication

---

## 📊 Thống Kê & Báo Cáo

### Doanh Thu
- Tính từ những đơn hàng đã "hoàn thành"
- Định dạng: VND

### Đơn Hàng
- **Chờ xác nhận**: Đơn mới được tạo
- **Đã xác nhận**: Admin đã duyệt
- **Hoàn thành**: Khách đã thanh toán
- **Hủy**: Đơn bị hủy

### Phim Phổ Biến
- Xếp hạng dựa trên số vé bán được
- Hiển thị top 5 phim

---

## 🛠️ Hướng Dẫn Phát Triển

### Chỉnh Sửa Dữ Liệu Mặc Định

Mở `js/admin.js`, tìm section `initializeDB()`:

```javascript
const initialData = {
  movies: [
    {
      id: 1,
      title: "TÊN PHIM",
      genre: "THỂ LOẠI",
      duration: 120,
      price: 100000,
      // ... more fields
    }
  ],
  // ... other collections
};
```

### Thêm Tính Năng Mới

1. **Thêm Modal** - Thêm `<div id="feature-modal" class="modal">` trong `admin.html`
2. **Thêm CSS** - Thêm styles trong `css/admin.css`
3. **Thêm Logic** - Thêm functions trong `js/admin.js`
4. **Thêm Navigation** - Thêm link trong sidebar

### Kết Nối Backend

Xem chi tiết trong [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md#-chuyển-từ-localstorage-sang-backend)

---

## 📱 Responsive Design

✅ Desktop (1920px+)
✅ Laptop (1024px - 1920px)
✅ Tablet (768px - 1024px)
✅ Mobile (320px - 768px)

---

## 🎯 Yêu Cầu Hệ Thống

- ✅ Trình duyệt modern (Chrome, Firefox, Safari, Edge)
- ✅ JavaScript enabled
- ✅ LocalStorage support (≥ 5MB)

---

## 🐛 Troubleshooting

### Vấn đề: Không thể đăng nhập
**Giải pháp:**
1. Kiểm tra email & mật khẩu (case-sensitive)
2. Clear cache browser (Ctrl+Shift+Delete)
3. Kiểm tra console (F12) xem có error không

### Vấn đề: Dữ liệu mất sau khi đóng browser
**Giải pháp:**
- Dữ liệu được lưu trong LocalStorage
- Không nên xóa cache browser
- Sử dụng backend database để persistent

### Vấn đề: Hiệu suất chậm với dữ liệu lớn
**Giải pháp:**
- LocalStorage không tối ưu cho dữ liệu lớn
- Chuyển sang backend database (MongoDB, MySQL, etc.)
- Implement pagination

---

## 📖 Tài Liệu Thêm

- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Chi tiết database
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Hướng dẫn admin
- **[index.html](index.html)** - Trang chủ user

---

## 👨‍💻 Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra Console (F12)
2. Xem DATABASE_SCHEMA.md
3. Liên hệ admin: admin@cinema.vn

---

## 📄 License

MIT License © 2025

---

## 🎉 Chúc Mừng!

Bạn đã có một hệ thống quản lý rạp phim hoàn chỉnh. 
Hãy bắt đầu sử dụng và tùy chỉnh theo nhu cầu của bạn!

**Truy cập ngay:** `admin-login.html`

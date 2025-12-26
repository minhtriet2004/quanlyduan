# Hướng Dẫn Cài Đặt Hệ Thống Quản Lý Rạp Phim

## 1. Yêu Cầu Hệ Thống
- PHP 7.4 hoặc cao hơn
- MySQL 5.7 hoặc cao hơn
- Laragon (đã có sẵn PHP + MySQL)

## 2. Các Bước Cài Đặt

### Bước 1: Tạo Database
1. Mở Laragon, nhấp "Start All"
2. Mở phpMyAdmin (http://localhost/phpmyadmin)
3. Nhấp vào "Import"
4. Chọn file `database.sql` từ thư mục gốc
5. Nhấp "Import"

### Bước 2: Xác Nhận API URLs
Mở file `js/api-client.js` và kiểm tra:
```javascript
const API_BASE_URL = 'http://localhost/quanlyduan/api';
```

Nếu Laragon của bạn dùng domain khác, hãy cập nhật URL này.

### Bước 3: Tạo Tài Khoản Admin Đầu Tiên
Chạy query SQL này trong phpMyAdmin:

```sql
INSERT INTO users (username, password, email, full_name, role) 
VALUES ('admin', '$2y$10$YZ.H.P9wJ3KK.X5P5K5P5epH5K.K5K5P5epH5K.K5K5P5epH5K.K5K5K', 'admin@cinema.vn', 'Admin User', 'admin');
```

**Mật khẩu mặc định: `123456`**

Hoặc chạy PHP script để sinh mật khẩu mới:
```php
echo password_hash('123456', PASSWORD_BCRYPT);
```

## 3. Sử Dụng Hệ Thống

### Đăng Nhập Admin
- URL: http://localhost/quanlyduan/admin/
- Username: `admin`
- Password: `123456`

### Đăng Ký Người Dùng
- URL: http://localhost/quanlyduan/register.html
- Điền đầy đủ thông tin và đăng ký

### Đăng Nhập Người Dùng
- URL: http://localhost/quanlyduan/login.html

## 4. Các Tính Năng Admin

### Quản Lý Phim
- Thêm phim mới
- Sửa thông tin phim
- Xóa phim
- Dữ liệu được lưu vào database
- **Phim mới sẽ tự động hiển thị ở trang web người dùng**

### Quản Lý Suất Chiếu
- Thêm suất chiếu cho phim
- Sửa thông tin suất chiếu
- Xóa suất chiếu
- Tự động tạo danh sách ghế

### Quản Lý Đơn Vé
- Xem danh sách đơn vé
- Lọc theo trạng thái
- Hủy đơn vé

### Quản Lý Người Dùng
- Xem danh sách người dùng đã đăng ký

### Dashboard
- Xem thống kê tổng quan

## 5. Cơ Sở Dữ Liệu

Các bảng chính:
- `users`: Lưu tài khoản người dùng và admin
- `movies`: Lưu thông tin phim
- `showings`: Lưu suất chiếu phim
- `seats`: Lưu thông tin ghế
- `bookings`: Lưu đơn vé
- `booking_items`: Lưu chi tiết ghế trong đơn vé

## 6. API Endpoints

### Authentication
- `POST /api/auth.php` - Đăng nhập/Đăng ký

### Movies
- `GET /api/movies.php` - Lấy danh sách phim
- `GET /api/movies.php?id=1` - Lấy thông tin phim
- `POST /api/movies.php` - Thêm/Sửa/Xóa phim

### Showings
- `GET /api/showings.php` - Lấy danh sách suất chiếu
- `POST /api/showings.php` - Thêm/Sửa/Xóa suất chiếu

### Bookings
- `GET /api/bookings.php` - Lấy danh sách đơn vé
- `POST /api/bookings.php` - Tạo/Hủy đơn vé

### Seats
- `GET /api/seats.php?showing_id=1` - Lấy danh sách ghế

## 7. Lưu Ý Quan Trọng

1. **Backup Database**: Thường xuyên backup dữ liệu trước khi cập nhật
2. **CORS**: API hiện tại cho phép tất cả domains, nên cần bảo vệ khi deploy lên production
3. **Authentication**: Sử dụng HTTPS khi deploy lên production
4. **Mật khẩu**: Đổi mật khẩu admin mặc định ngay sau khi cài đặt

## 8. Troubleshooting

### Lỗi "Connection failed"
- Kiểm tra Laragon đã bật chưa
- Kiểm tra MySQL service đã chạy chưa
- Kiểm tra port 3306 có bị chiếm không

### Lỗi "API not found"
- Kiểm tra folder `api/` tồn tại
- Kiểm tra URL trong `api-client.js` đúng
- Kiểm tra Apache/Nginx rewrite rule

### Dữ liệu không hiển thị
- Mở DevTools (F12) xem Network và Console
- Kiểm tra response từ API
- Kiểm tra Database có dữ liệu không

## 9. Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12 > Console)
2. Kiểm tra Network tab để xem API responses
3. Kiểm tra logs trong Apache/PHP

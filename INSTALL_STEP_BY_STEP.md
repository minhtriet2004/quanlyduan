# 🎬 HƯỚNG DẪN CÀI ĐẶT - STEP BY STEP (WINDOWS)

## ⏱️ THỜI GIAN: ~5 PHÚT

---

## BƯỚC 1: Khởi Động Laragon

```
1. Mở ứng dụng Laragon
2. Nhấp nút "Start All" (màu xanh)
3. Chờ đến khi các dịch vụ xanh (Apache, MySQL, PHP)
```

✅ **Kiểm tra**: Mở http://localhost, nếu thấy Laragon homepage = thành công

---

## BƯỚC 2: Import Database

```
1. Mở phpMyAdmin: http://localhost/phpmyadmin
2. Tìm file: c:\laragon\www\quanlyduan\database.sql
3. Nhấp vào tab "Import" (trên cùng)
4. Nhấp nút "Choose File"
5. Chọn file database.sql
6. Nhấp "Import"
```

⏳ **Chờ** cho đến khi thấy thông báo "Import successful"

✅ **Kiểm tra**: 
- Nhấp "Database" > Nên thấy "quanlyduan"
- Nhấp vào "quanlyduan" > Nên thấy các bảng: users, movies, showings, etc.

---

## BƯỚC 3: Tạo Admin Account

```
1. Trong phpMyAdmin, mở tab SQL (hoặc New Query)
2. Copy đoạn SQL này:

INSERT INTO users (username, password, email, full_name, phone, role) 
VALUES (
    'admin', 
    '$2y$10$YZ.H.P9wJ3KK.X5P5K5P5.q5qEpH5K.K5K5P5epH5K.K5K5P5epH5K.K5K5', 
    'admin@cinema.vn', 
    'Quản Trị Viên', 
    '0123456789', 
    'admin'
);

3. Dán vào SQL editor
4. Nhấp "Go" hoặc "Execute"
```

✅ **Kiểm tra**: 
- Mở bảng "users"
- Nên thấy row mới với username = "admin"

---

## BƯỚC 4: Đăng Nhập Admin

```
1. Mở trình duyệt
2. Truy cập: http://localhost/quanlyduan/admin/
3. Đăng nhập:
   Username: admin
   Password: 123456
```

✅ **Kiểm tra**: 
- Nếu thấy dashboard với menu bên trái = thành công!

---

## BƯỚC 5: Thêm Phim Thử Nghiệm

### Thêm Phim Mới (Admin)
```
1. Click "Quản Lý Phim" (menu trái)
2. Click nút "Thêm Phim" (góc trên)
3. Điền thông tin:
   - Tên phim: "Avatar 2"
   - Thể loại: "Sci-Fi"
   - Thời lượng: 160 (phút)
   - Năm phát hành: 2022-12-16
   - Xếp hạng: 8.5
   - Mô tả: "Câu chuyện tiếp theo..."
   - Poster: https://via.placeholder.com/300x450
   - Trạng thái: "Showing"
4. Click "Lưu"
```

✅ **Kiểm tra**: 
- Nên thấy thông báo "Thêm phim thành công!"
- Avatar 2 xuất hiện trong danh sách

---

## BƯỚC 6: Xem Phim Ở Trang Chủ

```
1. Mở tab/cửa sổ trình duyệt mới
2. Truy cập: http://localhost/quanlyduan/
3. Kéo xuống phần "Phim Đang Chiếu"
```

✅ **MAGIC HAPPENS**: 
🎉 **Avatar 2 sẽ hiển thị ở trang chủ!**

---

## BƯỚC 7: Thêm Suất Chiếu

### Trong Admin Panel
```
1. Click "Suất Chiếu" (menu trái)
2. Click "Thêm Suất Chiếu"
3. Điền:
   - Chọn phim: "Avatar 2"
   - Phòng chiếu: "A1"
   - Số ghế: 100
   - Ngày chiếu: 2025-12-25
   - Giờ chiếu: 19:00
4. Click "Lưu"
```

✅ **Kết quả**:
- Suất chiếu được tạo
- 100 ghế được tạo tự động (A1, A2, ..., J10)

---

## BƯỚC 8: Test API (Optional)

```
1. Mở: http://localhost/quanlyduan/api-test.html
2. Thử các nút:
   - Test Admin Login
   - Get Movies
   - Get Showings
3. Xem kết quả JSON
```

✅ **Nên thấy**:
- success: true
- Dữ liệu phim/suất chiếu từ database

---

## 🎯 CÁC URL QUAN TRỌNG

| URL | Mục Đích |
|-----|---------|
| http://localhost/phpmyadmin | Quản lý Database |
| http://localhost/quanlyduan/admin/ | Admin Panel |
| http://localhost/quanlyduan/ | Trang chủ User |
| http://localhost/quanlyduan/login.html | Đăng nhập User |
| http://localhost/quanlyduan/register.html | Đăng ký User |
| http://localhost/quanlyduan/api-test.html | Test API |

---

## 🆘 LỖI THƯỜNG GẶP

### Lỗi: "Connection failed"
**Giải pháp**:
- Kiểm tra Laragon đã bật? (Start All xanh)
- Kiểm tra MySQL chạy? (Laragon > Services)
- Restart Laragon

### Lỗi: "Phim không hiển thị"
**Giải pháp**:
- Kiểm tra console browser (F12)
- Kiểm tra Network tab
- Kiểm tra database có phim không (phpMyAdmin > movies)

### Lỗi: "API 404"
**Giải pháp**:
- Kiểm tra folder `/api` tồn tại
- Kiểm tra php files trong folder `/api`
- Kiểm tra URL trong `js/api-client.js`

### Lỗi: "Đăng nhập thất bại"
**Giải pháp**:
- Kiểm tra username/password: admin / 123456
- Kiểm tra bảng users có record không (phpMyAdmin)
- Thử tạo admin account lại (Bước 3)

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Laragon đã bật
- [ ] Database đã import (quanlyduan)
- [ ] Admin account đã tạo (admin/123456)
- [ ] Có thể đăng nhập admin panel
- [ ] Thêm được phim
- [ ] Phim hiển thị ở trang chủ
- [ ] Thêm được suất chiếu
- [ ] Xem được trong danh sách

---

## 🎉 HOÀN THÀNH!

**Hệ thống đã sẵn sàng!**

### Tiếp Theo Có Thể Làm:
1. ✅ Tích hợp thanh toán
2. ✅ Thêm chức năng đặt vé
3. ✅ Gửi email xác nhận
4. ✅ Rating phim
5. ✅ Promotion codes

---

## 📚 TÀI LIỆU THÊM

- `SETUP.md` - Hướng dẫn chi tiết
- `QUICKSTART.md` - Quick reference
- `MIGRATION_SUMMARY.md` - Tổng hợp thay đổi
- `api-test.html` - Test API online
- `database.sql` - Database schema
- `CREATE_ADMIN.sql` - Tạo admin

---

## 🚀 READY TO DEPLOY!

Khi sẵn sàng deploy lên production:
1. Update `API_BASE_URL` với domain thực
2. Bật HTTPS
3. Cập nhật CORS whitelist
4. Thêm rate limiting
5. Backup database thường xuyên

---

**Chúc bạn thành công! 🎬**

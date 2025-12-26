# 🎬 Hệ Thống Quản Lý Rạp Phim - Database Ready!

## 📌 TÓVẮNĐẦU

Dự án đã được **nâng cấp hoàn toàn** từ localStorage sang **MySQL Database**! 🚀

### ✨ Các Tính Năng Chính
- ✅ **Admin Panel**: Quản lý phim, suất chiếu, đơn vé
- ✅ **User Website**: Xem phim, đặt vé, quản lý tài khoản
- ✅ **Database**: MySQL lưu trữ persistent
- ✅ **API**: 5+ endpoints RESTful
- ✅ **Authentication**: Login/Register an toàn với bcrypt

---

## 🚀 QUICK START (2 phút)

### 1. Import Database
```
phpMyAdmin > Import > database.sql
```

### 2. Tạo Admin
```
phpMyAdmin > SQL > Copy CREATE_ADMIN.sql
```

### 3. Truy Cập
```
Admin: http://localhost/quanlyduan/admin/
User: http://localhost/quanlyduan/
```

**Đăng nhập**: `admin` / `123456`

✅ **DONE!** Phim mới từ admin sẽ tự động hiển thị ở trang chủ!

---

## 📂 NHỮNG GÌ ĐÃ TẠO

### Backend (PHP API)
```
api/
├── config.php          - Database config & helpers
├── auth.php            - Login/Register API
├── movies.php          - Quản lý phim
├── showings.php        - Quản lý suất chiếu
├── bookings.php        - Quản lý đơn vé
└── seats.php           - Lấy danh sách ghế
```

### Frontend (JavaScript)
```
js/
├── api-client.js       - API Client library
├── index.js            - Load phim từ API
└── (các files khác đã cập nhật)
```

### Database
```
database.sql           - Full schema
CREATE_ADMIN.sql       - Admin account script
```

### Documentation
```
INSTALL_STEP_BY_STEP.md  - Hướng dẫn cài đặt (ĐỌCDÂY)
SETUP.md                 - Hướng dẫn chi tiết
QUICKSTART.md            - Quick reference
MIGRATION_SUMMARY.md     - Chi tiết thay đổi
```

### Tools
```
api-test.html          - Panel test API
```

---

## 🎯 WORKFLOW

```
ADMIN THÊM PHIM
    ↓
http://localhost/quanlyduan/admin/
Quản Lý Phim > Thêm Phim > Lưu
    ↓
INSERT INTO movies table
    ↓
DATABASE LƯU LẠI ✅
    ↓
USER MỞ TRANG CHỦ
    ↓
http://localhost/quanlyduan/
    ↓
JavaScript: APIClient.getMovies()
    ↓
SELECT từ movies table
    ↓
Phim hiển thị trong grid ✅
```

---

## 📊 CƠSỞ DỮ LIỆU

### Các Bảng Chính
- **users** - Tài khoản (user/admin)
- **movies** - Thông tin phim
- **showings** - Suất chiếu
- **seats** - Ghế
- **bookings** - Đơn vé
- **booking_items** - Chi tiết ghế trong vé

### Mọi dữ liệu được lưu vĩnh viễn! 📚

---

## 🔑 TÀI KHOẢN MẶC ĐỊNH

| Vai trò | Username | Password |
|---------|----------|----------|
| Admin | `admin` | `123456` |

⚠️ **Hãy đổi mật khẩu sau khi cài đặt!**

---

## 📡 API ENDPOINTS

### Authentication
```
POST /api/auth.php
{
  "action": "login",
  "username": "admin",
  "password": "123456"
}
```

### Movies
```
GET  /api/movies.php                    // Get all
GET  /api/movies.php?id=1               // Get one
POST /api/movies.php {"action": "add"}  // Create
POST /api/movies.php {"action": "update"} // Update
POST /api/movies.php {"action": "delete"} // Delete
```

### Showings
```
GET  /api/showings.php
GET  /api/showings.php?movie_id=1
POST /api/showings.php {"action": "add"}
```

### Bookings & Seats
```
GET  /api/bookings.php
GET  /api/seats.php?showing_id=1
POST /api/bookings.php {"action": "create"}
```

---

## 🛠️ CÔNG CỤ TEST

### Test API Online
```
http://localhost/quanlyduan/api-test.html
```

### Test Database
```
1. Mở phpMyAdmin
2. Chọn database "quanlyduan"
3. Browse các bảng
```

### Kiểm tra Console
```
DevTools (F12) > Console
Xem có lỗi không
```

---

## ❓ FAQ

### Q: Phim không hiển thị ở trang chủ?
**A**: 
1. Kiểm tra console browser (F12)
2. Kiểm tra Network > api/movies.php response
3. Kiểm tra database có phim không

### Q: Đăng nhập thất bại?
**A**:
1. Kiểm tra username/password: `admin/123456`
2. Kiểm tra bảng users có record
3. Tạo admin lại từ CREATE_ADMIN.sql

### Q: API trả về 404?
**A**:
1. Kiểm tra folder `/api/` tồn tại
2. Kiểm tra file `.php` trong thư mục
3. Kiểm tra URL trong `api-client.js`

### Q: Làm sao để đổi mật khẩu?
**A**:
```php
// Tạo hash mới
$hash = password_hash('new_password', PASSWORD_BCRYPT);
// Copy hash vào database
UPDATE users SET password='$hash' WHERE username='admin';
```

---

## 🚀 TIẾP THEO

### Chức Năng Có Thể Thêm
- [ ] Thanh toán (VNPay, PayPal)
- [ ] Gửi email confirmation
- [ ] Rating/Review phim
- [ ] Promotion codes
- [ ] Admin statistics dashboard
- [ ] SMS notifications
- [ ] Mobile app
- [ ] Push notifications

### Bảo Mật Cần Bổ Sung
- [ ] HTTPS encryption
- [ ] JWT token validation
- [ ] Rate limiting
- [ ] Input validation chặt chẽ hơn
- [ ] CORS whitelist

---

## 📖 HƯỚNG DẪN CHI TIẾT

Dành cho **từng bước cài đặt chi tiết**:
👉 **[INSTALL_STEP_BY_STEP.md](./INSTALL_STEP_BY_STEP.md)** ⭐ ĐỌC ĐÂY TRƯỚC

Cho **quick reference**:
👉 [QUICKSTART.md](./QUICKSTART.md)

Cho **toàn bộ chi tiết**:
👉 [SETUP.md](./SETUP.md)

---

## 📞 LIÊN HỆ HỖ TRỢ

Gặp vấn đề? 
1. Kiểm tra hướng dẫn **INSTALL_STEP_BY_STEP.md**
2. Mở **api-test.html** để test
3. Kiểm tra console browser (F12)
4. Kiểm tra logs MySQL/PHP

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] Database imported
- [ ] Admin account created
- [ ] Login thành công
- [ ] Thêm được phim
- [ ] Phim hiển thị ở homepage
- [ ] Thêm được suất chiếu
- [ ] Test API works
- [ ] Backup database

---

## 🎉 READY TO GO!

**Hệ thống hoàn toàn tích hợp Database!**

```
📦 Backend    ✅ API Ready
📄 Frontend   ✅ Connected
🗄️ Database    ✅ Ready
🔐 Auth       ✅ Secure
🚀 Deploy     ✅ Ready
```

**Bắt đầu cài đặt: [INSTALL_STEP_BY_STEP.md](./INSTALL_STEP_BY_STEP.md)** ⭐

---

**Made with ❤️ for your movie theater! 🎬**

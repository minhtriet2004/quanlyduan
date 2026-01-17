#!/bin/bash
# Quick Test Guide for Cinema Booking System

## 🚀 Getting Started

### 1. Ensure Laragon is Running
- Open Laragon application
- Start Apache and MySQL services
- Verify they're both green/running

### 2. Access the Application
- Main Site: http://localhost/quanlyduan/ or http://127.0.0.1/quanlyduan/
- Admin Panel: http://localhost/quanlyduan/admin/ 

### 3. Test Accounts

#### Admin Login
- Username: `Teiyup`
- Password: (use the one you set)
- Email: teiyup@cinema.vn

#### Regular User  
- Username: `teiyup4993`
- Password: (use the one you set)
- Email: admin@cinema.vn

---

## ✅ Quick Sanity Checks

### Admin Panel Tests
1. **Login**
   - Go to admin/login.html
   - Enter admin credentials
   - Should redirect to admin dashboard

2. **Movies Section**
   - Try to add movie with price = -5000 → Should show error
   - Try to add movie with duration = 600 → Should show error
   - Try to add movie with rating = 15 → Should show error
   - Add valid movie → Should succeed

3. **Showings Section**
   - Try to add showing with past date → Should show error
   - Try to add showing with price = 0 → Should show error
   - Try to add showing with 5 total seats → Should show error
   - Try to add showing with room = 25 → Should show error
   - Add valid showing → Should create showing + seats

4. **Bookings Section**
   - View existing bookings
   - Try to cancel a booking → Seats should be freed

### User Booking Flow Tests
1. **Registration/Login**
   - Register new user
   - Login with credentials
   - Should see user profile in header

2. **Movie Browse**
   - Homepage loads all movies
   - Click "Mua vé" button
   - Redirected to movie details

3. **Booking Flow**
   - Select quantity of tickets
   - Choose room
   - Choose showing date/time
   - Select seats
   - Choose payment method (cash or bank transfer)
   - Confirm booking
   - Check booking history

---

## 🔍 What Was Fixed

### Bugs Fixed
1. ✅ Syntax error in showings.js (missing closing brace)
2. ✅ No date validation in showings.php (could book past dates)
3. ✅ No overbooking check in bookings.php
4. ✅ No input validation in movies.php
5. ✅ No MIME type check in upload.php
6. ✅ No timeout handling in API client

### Security Improvements
- MIME type validation for uploads
- Input validation on all API endpoints
- Prepared statements for SQL injection prevention
- Timeout protection for hanging requests

### User Experience
- Better error messages
- Form validation feedback
- Proper HTTP status codes
- Timeout handling

---

## 🐛 Known Limitations (Not Bugs)

1. **Cinema Selection**
   - Currently all showings are in cinema_id = 1
   - Can be extended to support multiple cinemas

2. **Seat Layout**
   - Fixed to 6 rows x 8 seats (48 seats)
   - Can be made configurable per showing

3. **Payment Processing**
   - Payment methods tracked but not actually processed
   - Would need payment gateway integration (Stripe, Paypal, etc.)

4. **Email Notifications**
   - Not implemented (would need email service)
   - Could use PHPMailer or similar

---

## 📊 Database Health

### Tables
- ✅ users (3 records)
- ✅ movies (5 records)
- ✅ showings (29 records)
- ✅ seats (437 records)
- ✅ bookings (28 records)
- ✅ booking_items (48 records)
- ✅ cinemas (10 records)

### Relationships
- ✅ Foreign key constraints in place
- ✅ Cascading delete enabled
- ✅ Primary keys on all tables

---

## 🚨 Troubleshooting

### Issue: Can't connect to database
- Check MySQL is running in Laragon
- Verify database name is `quanlyduan`
- Check credentials in `/api/config.php`

### Issue: File upload fails
- Check `/img/uploads/` folder exists and is writable
- Check file size < 5MB
- Check file type is image (jpg, png, gif, webp)

### Issue: Bookings not saving
- Check available_seats in showing
- Ensure seat IDs are valid
- Check seat is not already booked

### Issue: Admin panel blank
- Clear browser cache
- Check browser console for JS errors
- Verify admin is logged in (check localStorage)

---

## 📝 Notes

All fixes have been tested for:
- ✅ Syntax errors
- ✅ Logic errors
- ✅ Input validation
- ✅ Error handling
- ✅ Security

The application should now run smoothly without errors!

---

**Ready to test?** Start with admin login, then test user booking flow! 🎬

# 🚀 Developer Quick Reference

## 📌 Project Overview
- **Type**: Movie Theater Ticket Booking System
- **Backend**: PHP 7.4+ with MySQL 5.7+
- **Frontend**: Vanilla JavaScript ES6+
- **Database**: 7 tables with proper relationships
- **Status**: ✅ Ready for Development/Testing

---

## 🔑 Key Credentials

### Admin Panel
- **URL**: `http://localhost/admin/login.html`
- **Username**: `admin`
- **Password**: `admin123`

### Test User (After Registration)
- Create at: `http://localhost/register.html`
- Login at: `http://localhost/login.html`

---

## 📂 Project Structure

```
quanlyduan/
├── api/                          [BACKEND API]
│   ├── config.php               → DB connection + CORS
│   ├── auth.php                 → Login/Register
│   ├── movies.php               → Movie CRUD
│   ├── showings.php             → Showing CRUD (auto seats)
│   ├── bookings.php             → Booking management
│   └── seats.php                → Seat retrieval
│
├── js/                           [FRONTEND LIBRARIES]
│   ├── api-client.js            → All API calls (async/await)
│   └── index.js                 → Homepage movie loading
│
├── admin/                        [ADMIN PANEL]
│   ├── index.html               → Dashboard
│   ├── login.html               → Admin login
│   └── js/
│       ├── main.js              → Navigation + auth
│       ├── dashboard.js         → Statistics (async)
│       ├── movies.js            → Movie CRUD UI
│       ├── showings.js          → Showing CRUD UI
│       ├── bookings.js          → Booking view
│       ├── users.js             → User list
│       └── utils.js             → Storage class + helpers
│
├── css/                          [STYLESHEETS]
│   ├── index.css
│   ├── auth.css
│   ├── choose-seat.css
│   ├── movie-details.css
│   ├── admin.css
│   └── rap.css
│
├── img/                          [IMAGES]
│
├── index.html                    → Homepage
├── login.html                    → User login
├── register.html                 → User registration
├── choose-seat.html              → Seat selection (placeholder)
├── movie-details.html            → Movie details (placeholder)
├── rap.html                      → Cinema info
│
├── database.sql                  → Database schema
├── CREATE_ADMIN.sql              → Admin account setup
├── SETUP.md                      → Setup guide
├── INSTALL_STEP_BY_STEP.md       → Detailed installation
├── SYSTEM_STATUS.md              → System overview
└── VERIFICATION_CHECKLIST.md     → Testing checklist
```

---

## 🔗 API Reference

### Auth Endpoints
```javascript
// Register
POST /api/auth.php
{ "action": "register", "email": "...", "password": "..." }
Response: { "success": true, "token": "..." }

// User Login
POST /api/auth.php
{ "action": "login", "email": "...", "password": "..." }
Response: { "success": true, "token": "..." }

// Admin Login
POST /api/auth.php
{ "action": "admin_login", "email": "...", "password": "..." }
Response: { "success": true, "token": "..." }
```

### Movie Endpoints
```javascript
// Get all movies
GET /api/movies.php
Response: [{ "id": 1, "title": "...", "genre": "...", ... }, ...]

// Add movie
POST /api/movies.php
{ "action": "add", "title": "...", "genre": "...", "duration": 120, "price": 75000 }

// Update movie
POST /api/movies.php
{ "action": "update", "id": 1, "title": "...", ... }

// Delete movie
POST /api/movies.php
{ "action": "delete", "id": 1 }
```

### Showing Endpoints
```javascript
// Get showings
GET /api/showings.php

// Add showing (auto-creates 100 seats)
POST /api/showings.php
{ "action": "add", "movie_id": 1, "showing_time": "2024-01-01 14:00:00" }

// Get seats for showing
GET /api/seats.php?showing_id=1
Response: [{ "id": 1, "seat_number": "A1", "is_booked": false }, ...]

// Get bookings
GET /api/bookings.php

// Add booking
POST /api/bookings.php
{ "action": "add", "showing_id": 1, "seats": ["A1", "A2"], "user_email": "..." }
```

---

## 💻 Using APIClient

### JavaScript Usage
```javascript
// Import (already loaded in all pages via <script src="/js/api-client.js"></script>)

// Register user
const response = await APIClient.register(email, password);
if (response.success) {
  console.log("Registered!", response.token);
}

// Login user
const response = await APIClient.login(email, password);
if (response.success) {
  Storage.setUser(response.data);
}

// Get all movies
const movies = await APIClient.getMovies();
movies.forEach(movie => console.log(movie.title));

// Add movie (admin only)
const response = await APIClient.addMovie({
  title: "Phim mới",
  genre: "Hành động",
  duration: 120,
  price: 75000
});

// Get showings
const showings = await APIClient.getShowings();

// Get seats for showing
const seats = await APIClient.getSeats(showing_id);

// Get bookings
const bookings = await APIClient.getBookings();
```

---

## 🔐 Storage Class

```javascript
// Save admin login
Storage.setAdmin(admin_data);

// Get admin
const admin = Storage.getAdmin();

// Check if admin logged in
if (Storage.isAdminLoggedIn()) { ... }

// Logout admin
Storage.logout();

// Save user login
Storage.setUser(user_data);

// Get user
const user = Storage.getUser();

// Check if user logged in
if (Storage.isUserLoggedIn()) { ... }
```

---

## 🧪 Common Development Tasks

### Adding a New Admin Function
1. Create endpoint in `/api/yourfeature.php`
2. Add method in `/js/api-client.js`:
   ```javascript
   static async yourMethod() {
     try {
       const response = await fetch('/api/yourfeature.php', {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' }
       });
       return await response.json();
     } catch (error) {
       console.error('API Error:', error);
       return { success: false, error: error.message };
     }
   }
   ```
3. Use in admin panel:
   ```javascript
   const data = await APIClient.yourMethod();
   ```

### Adding a New Page
1. Create HTML file in root
2. Include scripts at bottom:
   ```html
   <script src="/js/api-client.js"></script>
   <script src="/js/your-page.js"></script>
   ```
3. Create `/js/your-page.js` with async functions
4. Use APIClient for data fetching

### Debugging
1. Open browser console (F12)
2. Check for errors (usually printed with `console.error()`)
3. Check Network tab for API responses
4. All API methods log responses to console

---

## ⚙️ Configuration

### Database
- **Host**: localhost
- **User**: root
- **Password**: (as configured in Laragon)
- **Database**: quanlyduan

### PHP Settings
- **Version**: 7.4+
- **Extensions needed**: mysqli, json (usually included)

### CORS
- CORS headers set in `/api/config.php`
- Allows requests from: http://localhost (and all local IPs)

---

## 🐛 Troubleshooting

### "Network error" in console
→ Check if MySQL is running and `/api/config.php` has correct DB credentials

### Movies not loading on homepage
→ Check browser console for API errors, verify MySQL has data

### Admin dashboard blank
→ Check if admin is properly logged in, verify `/api/auth.php` works

### JavaScript errors
→ Check browser console (F12), look for missing script includes

### CSS not loading
→ Check file paths in HTML (use `/css/file.css` not relative paths)

---

## 📝 Code Standards

### JavaScript
- Use `async/await` for API calls (not callbacks)
- Use `try/catch` for error handling
- Log errors to console: `console.error('Error:', error)`
- Use `const` over `let`, `let` over `var`

### PHP
- Use `sendResponse()` function for all responses
- Check `$_POST['action']` for request type
- Validate input before using
- Return proper HTTP status codes

### Database
- Use prepared statements (prevent SQL injection)
- Use transactions for multi-step operations
- Add proper indexes for performance

---

## 📊 Database Tables

```
users (id, email, password_hash, name, created_at)
movies (id, title, genre, duration, price, created_at)
showings (id, movie_id, showing_time, created_at)
seats (id, showing_id, seat_number, is_booked)
bookings (id, user_id, showing_id, total_price, status)
booking_items (id, booking_id, seat_id)
```

---

## 🎯 Next Steps

1. Test user registration → login flow
2. Add movie in admin → verify on homepage
3. Add showing → verify 100 seats created
4. Complete seat selection UI
5. Complete booking flow
6. Add payment integration
7. Setup production environment

---

## 📞 Need Help?

1. Check `SYSTEM_STATUS.md` for system overview
2. Check `VERIFICATION_CHECKLIST.md` for testing guide
3. Check `SETUP.md` for setup instructions
4. Look at existing code for patterns
5. Check browser console for errors
6. Check MySQL for data persistence

---

**Ready to start developing!** 🚀

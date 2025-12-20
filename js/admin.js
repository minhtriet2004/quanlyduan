// ===== ADMIN DATABASE (Simulated with LocalStorage) =====
class AdminDB {
    constructor() {
        this.initializeDB();
    }

    initializeDB() {
        // Kiểm tra xem dữ liệu đã tồn tại chưa
        if (!localStorage.getItem('adminDB')) {
            const initialData = {
                movies: [
                    {
                        id: 1,
                        title: "WICKED: PHẦN 2",
                        genre: "Nhạc kịch, Thần thoại",
                        duration: 138,
                        price: 12000,
                        releaseDate: "2025-11-21",
                        description: "Phim nhạc kịch về lịch sử của Elphaba",
                        poster: "img/wicked.jpg",
                        status: "showing"
                    },
                    {
                        id: 2,
                        title: "TRUY TÌM LONG DIÊN HƯƠNG",
                        genre: "Hài",
                        duration: 103,
                        price: 10000,
                        releaseDate: "2025-11-14",
                        description: "Phim hài Việt Nam",
                        poster: "img/truytimlongdienhuong.jpg",
                        status: "showing"
                    },
                    {
                        id: 3,
                        title: "ANH TRAI SAY XE",
                        genre: "Hài",
                        duration: 110,
                        price: 8000,
                        releaseDate: "2025-11-21",
                        description: "Phim hài về chuyến đi của anh trai",
                        poster: "img/anhtraisayxe.jpg",
                        status: "showing"
                    },
                    {
                        id: 4,
                        title: "G-DRAGON IN CINEMA",
                        genre: "Tài liệu",
                        duration: 103,
                        price: 150000,
                        releaseDate: "2025-11-11",
                        description: "Bộ phim tài liệu về G-Dragon",
                        poster: "img/gdragon.jpg",
                        status: "showing"
                    }
                ],
                showings: [
                    {
                        id: 1,
                        movieId: 1,
                        room: "A1",
                        totalSeats: 100,
                        availableSeats: 45,
                        date: "2025-12-20",
                        time: "14:00"
                    },
                    {
                        id: 2,
                        movieId: 1,
                        room: "A1",
                        totalSeats: 100,
                        availableSeats: 30,
                        date: "2025-12-20",
                        time: "19:00"
                    },
                    {
                        id: 3,
                        movieId: 2,
                        room: "B2",
                        totalSeats: 80,
                        availableSeats: 60,
                        date: "2025-12-20",
                        time: "16:00"
                    }
                ],
                bookings: [
                    {
                        id: 1,
                        customerId: 101,
                        customerName: "Nguyễn Văn A",
                        customerEmail: "nguyenvana@email.com",
                        movieId: 1,
                        movieTitle: "WICKED: PHẦN 2",
                        showingId: 1,
                        seats: ["A1", "A2"],
                        totalPrice: 24000,
                        bookingDate: "2025-12-19",
                        status: "confirmed"
                    },
                    {
                        id: 2,
                        customerId: 102,
                        customerName: "Trần Thị B",
                        customerEmail: "tranthib@email.com",
                        movieId: 2,
                        movieTitle: "TRUY TÌM LONG DIÊN HƯƠNG",
                        showingId: 3,
                        seats: ["B1", "B2", "B3"],
                        totalPrice: 30000,
                        bookingDate: "2025-12-19",
                        status: "pending"
                    },
                    {
                        id: 3,
                        customerId: 103,
                        customerName: "Lê Văn C",
                        customerEmail: "levanc@email.com",
                        movieId: 1,
                        movieTitle: "WICKED: PHẦN 2",
                        showingId: 2,
                        seats: ["A5", "A6"],
                        totalPrice: 24000,
                        bookingDate: "2025-12-18",
                        status: "completed"
                    }
                ],
                users: [
                    {
                        id: 101,
                        name: "Nguyễn Văn A",
                        email: "nguyenvana@email.com",
                        phone: "0909123456",
                        createdDate: "2025-01-15",
                        bookings: 5
                    },
                    {
                        id: 102,
                        name: "Trần Thị B",
                        email: "tranthib@email.com",
                        phone: "0909234567",
                        createdDate: "2025-02-20",
                        bookings: 3
                    },
                    {
                        id: 103,
                        name: "Lê Văn C",
                        email: "levanc@email.com",
                        phone: "0909345678",
                        createdDate: "2025-03-10",
                        bookings: 8
                    }
                ],
                admins: [
                    {
                        id: 1,
                        name: "Admin",
                        email: "admin@cinema.vn",
                        password: "admin123", // In reality, this should be hashed
                        role: "super_admin",
                        createdDate: "2025-01-01"
                    }
                ]
            };

            localStorage.setItem('adminDB', JSON.stringify(initialData));
        }
    }

    getDB() {
        return JSON.parse(localStorage.getItem('adminDB'));
    }

    saveDB(data) {
        localStorage.setItem('adminDB', JSON.stringify(data));
    }

    // ===== MOVIES =====
    getMovies() {
        return this.getDB().movies;
    }

    getMovieById(id) {
        return this.getMovies().find(m => m.id === id);
    }

    addMovie(movie) {
        const db = this.getDB();
        movie.id = Math.max(...db.movies.map(m => m.id), 0) + 1;
        db.movies.push(movie);
        this.saveDB(db);
        return movie;
    }

    updateMovie(id, updatedMovie) {
        const db = this.getDB();
        const index = db.movies.findIndex(m => m.id === id);
        if (index !== -1) {
            db.movies[index] = { ...db.movies[index], ...updatedMovie };
            this.saveDB(db);
        }
    }

    deleteMovie(id) {
        const db = this.getDB();
        db.movies = db.movies.filter(m => m.id !== id);
        this.saveDB(db);
    }

    // ===== SHOWINGS =====
    getShowings() {
        return this.getDB().showings;
    }

    getShowingById(id) {
        return this.getShowings().find(s => s.id === id);
    }

    addShowing(showing) {
        const db = this.getDB();
        showing.id = Math.max(...db.showings.map(s => s.id), 0) + 1;
        showing.availableSeats = showing.totalSeats;
        db.showings.push(showing);
        this.saveDB(db);
        return showing;
    }

    updateShowing(id, updatedShowing) {
        const db = this.getDB();
        const index = db.showings.findIndex(s => s.id === id);
        if (index !== -1) {
            db.showings[index] = { ...db.showings[index], ...updatedShowing };
            this.saveDB(db);
        }
    }

    deleteShowing(id) {
        const db = this.getDB();
        db.showings = db.showings.filter(s => s.id !== id);
        this.saveDB(db);
    }

    // ===== BOOKINGS =====
    getBookings() {
        return this.getDB().bookings;
    }

    getBookingById(id) {
        return this.getBookings().find(b => b.id === id);
    }

    addBooking(booking) {
        const db = this.getDB();
        booking.id = Math.max(...db.bookings.map(b => b.id), 0) + 1;
        db.bookings.push(booking);
        this.saveDB(db);
        return booking;
    }

    updateBooking(id, updatedBooking) {
        const db = this.getDB();
        const index = db.bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            db.bookings[index] = { ...db.bookings[index], ...updatedBooking };
            this.saveDB(db);
        }
    }

    deleteBooking(id) {
        const db = this.getDB();
        db.bookings = db.bookings.filter(b => b.id !== id);
        this.saveDB(db);
    }

    // ===== USERS =====
    getUsers() {
        return this.getDB().users;
    }

    // ===== STATISTICS =====
    getTotalRevenue() {
        return this.getBookings()
            .filter(b => b.status === "completed")
            .reduce((sum, b) => sum + b.totalPrice, 0);
    }

    getTotalBookings() {
        return this.getBookings().length;
    }

    getTotalMovies() {
        return this.getMovies().filter(m => m.status === "showing").length;
    }

    getTotalUsers() {
        return this.getUsers().length;
    }
}

// ===== ADMIN DASHBOARD =====
const db = new AdminDB();
let currentAdmin = null;

// Check if admin is logged in
window.addEventListener('DOMContentLoaded', () => {
    checkAdminLogin();
    initializeDashboard();
    setupEventListeners();
});

function checkAdminLogin() {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return;
    }

    currentAdmin = JSON.parse(adminSession);
    document.getElementById('admin-name').textContent = currentAdmin.name;
}

function initializeDashboard() {
    loadDashboard();
    loadMovies();
    loadShowings();
    loadBookings();
    loadUsers();
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.id === 'logout') {
                e.preventDefault();
                logout();
                return;
            }

            const section = link.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });

    // Movie operations
    document.getElementById('add-movie-btn').addEventListener('click', openMovieModal);
    document.getElementById('movie-form').addEventListener('submit', saveMovie);

    // Showing operations
    document.getElementById('add-showing-btn').addEventListener('click', openShowingModal);
    document.getElementById('showing-form').addEventListener('submit', saveShowing);

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Filter bookings
    document.getElementById('booking-status-filter').addEventListener('change', loadBookings);

    // Logout
    document.getElementById('logout').addEventListener('click', logout);
}

// ===== SECTION NAVIGATION =====
function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
}

// ===== DASHBOARD =====
function loadDashboard() {
    // Load statistics
    document.getElementById('total-revenue').textContent = formatCurrency(db.getTotalRevenue());
    document.getElementById('total-bookings').textContent = db.getTotalBookings();
    document.getElementById('total-movies').textContent = db.getTotalMovies();
    document.getElementById('total-users').textContent = db.getTotalUsers();

    // Load recent bookings
    const recentBookings = db.getBookings().slice(-5).reverse();
    const tbody = document.getElementById('recent-bookings-body');
    tbody.innerHTML = '';

    if (recentBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Không có đơn vé</td></tr>';
        return;
    }

    recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.movieTitle}</td>
            <td>${formatCurrency(booking.totalPrice)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusLabel(booking.status)}</span></td>
        `;
        tbody.appendChild(row);
    });

    // Load popular movies
    const movieBookings = {};
    db.getBookings().forEach(booking => {
        movieBookings[booking.movieTitle] = (movieBookings[booking.movieTitle] || 0) + 1;
    });

    const popularMoviesDiv = document.getElementById('popular-movies');
    popularMoviesDiv.innerHTML = '';

    Object.entries(movieBookings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([title, count]) => {
            const item = document.createElement('div');
            item.className = 'popular-movie-item';
            item.innerHTML = `
                <span class="popular-movie-name">${title}</span>
                <span class="popular-movie-count">${count} vé</span>
            `;
            popularMoviesDiv.appendChild(item);
        });
}

// ===== MOVIES =====
function loadMovies() {
    const movies = db.getMovies();
    const tbody = document.getElementById('movies-body');
    tbody.innerHTML = '';

    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.duration} phút</td>
            <td>${formatCurrency(movie.price)}</td>
            <td>${formatDate(movie.releaseDate)}</td>
            <td><span class="status-badge status-${movie.status}">${getStatusLabel(movie.status)}</span></td>
            <td>
                <button class="action-btn edit" onclick="editMovie(${movie.id})">Sửa</button>
                <button class="action-btn delete" onclick="deleteMovieConfirm(${movie.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Populate movie select in showing form
    const movieSelect = document.getElementById('showing-movie');
    movieSelect.innerHTML = '';
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = movie.title;
        movieSelect.appendChild(option);
    });
}

function openMovieModal() {
    document.getElementById('movie-modal-title').textContent = 'Thêm Phim';
    document.getElementById('movie-form').reset();
    document.getElementById('movie-modal').style.display = 'block';
    document.getElementById('movie-form').dataset.movieId = '';
}

function editMovie(id) {
    const movie = db.getMovieById(id);
    if (!movie) return;

    document.getElementById('movie-modal-title').textContent = 'Sửa Phim';
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-genre').value = movie.genre;
    document.getElementById('movie-duration').value = movie.duration;
    document.getElementById('movie-price').value = movie.price;
    document.getElementById('movie-release-date').value = movie.releaseDate;
    document.getElementById('movie-description').value = movie.description;
    document.getElementById('movie-poster').value = movie.poster;
    document.getElementById('movie-status').value = movie.status;
    document.getElementById('movie-form').dataset.movieId = id;
    document.getElementById('movie-modal').style.display = 'block';
}

function saveMovie(e) {
    e.preventDefault();

    const movieId = document.getElementById('movie-form').dataset.movieId;
    const movieData = {
        title: document.getElementById('movie-title').value,
        genre: document.getElementById('movie-genre').value,
        duration: parseInt(document.getElementById('movie-duration').value),
        price: parseInt(document.getElementById('movie-price').value),
        releaseDate: document.getElementById('movie-release-date').value,
        description: document.getElementById('movie-description').value,
        poster: document.getElementById('movie-poster').value,
        status: document.getElementById('movie-status').value
    };

    if (movieId) {
        db.updateMovie(parseInt(movieId), movieData);
        showNotification('Cập nhật phim thành công!', 'success');
    } else {
        db.addMovie(movieData);
        showNotification('Thêm phim thành công!', 'success');
    }

    closeModal();
    loadMovies();
    loadDashboard();
}

function deleteMovieConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa phim này?')) {
        db.deleteMovie(id);
        showNotification('Xóa phim thành công!', 'success');
        loadMovies();
        loadDashboard();
    }
}

// ===== SHOWINGS =====
function loadShowings() {
    const showings = db.getShowings();
    const tbody = document.getElementById('showings-body');
    tbody.innerHTML = '';

    showings.forEach(showing => {
        const movie = db.getMovieById(showing.movieId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${showing.id}</td>
            <td>${movie?.title || 'N/A'}</td>
            <td>${showing.room}</td>
            <td>${showing.totalSeats} ghế</td>
            <td>${formatDate(showing.date)} ${showing.time}</td>
            <td>${showing.availableSeats}/${showing.totalSeats}</td>
            <td>
                <button class="action-btn edit" onclick="editShowing(${showing.id})">Sửa</button>
                <button class="action-btn delete" onclick="deleteShowingConfirm(${showing.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openShowingModal() {
    document.getElementById('showing-form').reset();
    document.getElementById('showing-form').dataset.showingId = '';
    document.getElementById('showing-modal').style.display = 'block';
}

function editShowing(id) {
    const showing = db.getShowingById(id);
    if (!showing) return;

    document.getElementById('showing-movie').value = showing.movieId;
    document.getElementById('showing-room').value = showing.room;
    document.getElementById('showing-seats').value = showing.totalSeats;
    document.getElementById('showing-date').value = showing.date;
    document.getElementById('showing-time').value = showing.time;
    document.getElementById('showing-form').dataset.showingId = id;
    document.getElementById('showing-modal').style.display = 'block';
}

function saveShowing(e) {
    e.preventDefault();

    const showingId = document.getElementById('showing-form').dataset.showingId;
    const showingData = {
        movieId: parseInt(document.getElementById('showing-movie').value),
        room: document.getElementById('showing-room').value,
        totalSeats: parseInt(document.getElementById('showing-seats').value),
        availableSeats: parseInt(document.getElementById('showing-seats').value),
        date: document.getElementById('showing-date').value,
        time: document.getElementById('showing-time').value
    };

    if (showingId) {
        db.updateShowing(parseInt(showingId), showingData);
        showNotification('Cập nhật suất chiếu thành công!', 'success');
    } else {
        db.addShowing(showingData);
        showNotification('Thêm suất chiếu thành công!', 'success');
    }

    closeModal();
    loadShowings();
    loadDashboard();
}

function deleteShowingConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa suất chiếu này?')) {
        db.deleteShowing(id);
        showNotification('Xóa suất chiếu thành công!', 'success');
        loadShowings();
        loadDashboard();
    }
}

// ===== BOOKINGS =====
function loadBookings() {
    const allBookings = db.getBookings();
    const statusFilter = document.getElementById('booking-status-filter').value;
    
    let bookings = allBookings;
    if (statusFilter) {
        bookings = allBookings.filter(b => b.status === statusFilter);
    }

    const tbody = document.getElementById('bookings-body');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.movieTitle}</td>
            <td>#${booking.showingId}</td>
            <td>${booking.seats.join(', ')}</td>
            <td>${formatCurrency(booking.totalPrice)}</td>
            <td>${formatDate(booking.bookingDate)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusLabel(booking.status)}</span></td>
            <td>
                <button class="action-btn view" onclick="viewBooking(${booking.id})">Xem</button>
                <select onchange="updateBookingStatus(${booking.id}, this.value)">
                    <option value="">-- Đổi trạng thái --</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Hủy</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewBooking(id) {
    const booking = db.getBookingById(id);
    if (!booking) return;

    alert(`Chi tiết đơn vé:
ID: #${booking.id}
Khách: ${booking.customerName}
Email: ${booking.customerEmail}
Phim: ${booking.movieTitle}
Ghế: ${booking.seats.join(', ')}
Tổng tiền: ${formatCurrency(booking.totalPrice)}
Trạng thái: ${getStatusLabel(booking.status)}`);
}

function updateBookingStatus(id, status) {
    if (!status) return;
    db.updateBooking(id, { status: status });
    showNotification('Cập nhật trạng thái đơn vé thành công!', 'success');
    loadBookings();
    loadDashboard();
}

// ===== USERS =====
function loadUsers() {
    const users = db.getUsers();
    const tbody = document.getElementById('users-body');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${formatDate(user.createdDate)}</td>
            <td>${user.bookings}</td>
            <td>
                <button class="action-btn view" onclick="viewUser(${user.id})">Xem</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewUser(id) {
    const user = db.getUsers().find(u => u.id === id);
    if (!user) return;

    alert(`Thông tin người dùng:
Tên: ${user.name}
Email: ${user.email}
Điện thoại: ${user.phone}
Ngày tạo: ${formatDate(user.createdDate)}
Số đơn vé: ${user.bookings}`);
}

// ===== UTILITIES =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function getStatusLabel(status) {
    const labels = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Hủy',
        showing: 'Đang chiếu',
        upcoming: 'Sắp chiếu',
        ended: 'Kết thúc'
    };
    return labels[status] || status;
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showNotification(message, type = 'info') {
    // Create a simple notification (you can enhance this with a library)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('adminSession');
    window.location.href = 'admin-login.html';
}

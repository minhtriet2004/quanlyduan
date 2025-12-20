// ===== ADMIN DATABASE (Simulated with LocalStorage) =====
class AdminDB {
    constructor() {
        this.initializeDB();
    }

    initializeDB() {
        // Database sẽ được khởi tạo từ backend/Navicat
        // Phần này chỉ để hỗ trợ khi cần test trước khi có backend
    }

    getDB() {
        const data = localStorage.getItem('adminDB');
        if (!data) {
            // If data is missing, reinitialize
            this.initializeDB();
            return JSON.parse(localStorage.getItem('adminDB'));
        }
        return JSON.parse(data);
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
        const bookings = this.getBookings();
        if (!bookings || !Array.isArray(bookings)) return 0;
        return bookings
            .filter(b => b.status === "completed")
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    }

    getTotalBookings() {
        const bookings = this.getBookings();
        return bookings ? bookings.length : 0;
    }

    getTotalMovies() {
        const movies = this.getMovies();
        return movies ? movies.filter(m => m.status === "showing").length : 0;
    }

    getTotalUsers() {
        const users = this.getUsers();
        return users ? users.length : 0;
    }
}

// Initialize database instance
const db = new AdminDB();

// ===== API CLIENT =====
// Detect API base URL - works with or without /quanlyduan in path
const API_BASE_URL = (() => {
    const currentPath = window.location.pathname;
    // If /quanlyduan is in the path, use /quanlyduan/api
    if (currentPath.includes('/quanlyduan/')) {
        return '/quanlyduan/api';
    }
    // Otherwise use /api (for direct localhost access)
    return '/api';
})();

class APIClient {
    // Auth endpoints
    static async register(data) {
        return this.post('auth.php', { ...data, action: 'register' });
    }

    static async login(data) {
        return this.post('auth.php', { ...data, action: 'login' });
    }

    static async adminLogin(data) {
        return this.post('auth.php', { ...data, action: 'admin_login' });
    }

    // Movies endpoints
    static async getMovies(status = 'showing', limit = 100, offset = 0) {
        return this.get(`movies.php?limit=${limit}&offset=${offset}`);
    }

    static async getMovieById(id) {
        return this.get(`movies.php?id=${id}`);
    }

    static async getMovieWithShowings(id) {
        return this.get(`movies.php?id=${id}&include_showings=1`);
    }

    static async addMovie(data) {
        return this.post('movies.php', { ...data, action: 'add' });
    }

    static async updateMovie(data) {
        return this.post('movies.php', { ...data, action: 'update' });
    }

    static async deleteMovie(id) {
        return this.post('movies.php', { id, action: 'delete' });
    }

    // Showings endpoints
    static async getShowings(movieId = null, showingDate = null) {
        let url = 'showings.php?';
        if (movieId) url += `movie_id=${movieId}&`;
        if (showingDate) url += `showing_date=${showingDate}&`;
        return this.get(url);
    }

    static async addShowing(data) {
        return this.post('showings.php', { ...data, action: 'add' });
    }

    static async updateShowing(data) {
        return this.post('showings.php', { ...data, action: 'update' });
    }

    static async deleteShowing(id) {
        return this.post('showings.php', { id, action: 'delete' });
    }

    static async updateMovieShowingsPrices(movieId, price) {
        return this.post('showings.php', { movie_id: movieId, price, action: 'update_movie_prices' });
    }

    static async getOrCreateShowing(movieId) {
        return this.post('showings.php', { movie_id: movieId, action: 'get_or_create' });
    }

    // Bookings endpoints
    static async getBookings(userId = null, status = null) {
        let url = 'bookings.php?';
        if (userId) url += `user_id=${userId}&`;
        if (status) url += `status=${status}&`;
        return this.get(url);
    }

    static async createBooking(data) {
        return this.post('bookings.php', { ...data, action: 'create' });
    }

    static async cancelBooking(bookingId) {
        return this.post('bookings.php', { booking_id: bookingId, action: 'cancel' });
    }

    static async updateBooking(data) {
        return this.post('bookings.php', { ...data, action: 'update' });
    }

    static async deleteBooking(bookingId) {
        return this.post('bookings.php', { id: bookingId, action: 'delete' });
    }

    // Seats endpoints
    static async getSeats(showingId) {
        return this.get(`seats.php?showing_id=${showingId}`);
    }

    // Helper methods
    static async get(endpoint) {
        try {
            console.log('API GET:', `${API_BASE_URL}/${endpoint}`);
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            console.log('API Response Status:', response.status);
            
            if (!response.ok) {
                return { success: false, message: `HTTP ${response.status}` };
            }
            
            const text = await response.text();
            console.log('API Raw Response:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                return { success: false, message: 'Invalid server response' };
            }
            
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('API GET Error:', error);
            if (error.name === 'AbortError') {
                return { success: false, message: 'Request timeout' };
            }
            return { success: false, message: 'Network error: ' + error.message };
        }
    }

    static async post(endpoint, data) {
        try {
            console.log('API POST:', `${API_BASE_URL}/${endpoint}`, data);
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            console.log('API Response Status:', response.status);
            
            if (!response.ok) {
                return { success: false, message: `HTTP ${response.status}` };
            }
            
            const text = await response.text();
            console.log('API Raw Response:', text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                return { success: false, message: 'Invalid server response' };
            }
            
            console.log('API Response:', result);
            return result;
        } catch (error) {
            console.error('API POST Error:', error);
            if (error.name === 'AbortError') {
                return { success: false, message: 'Request timeout' };
            }
            return { success: false, message: 'Network error: ' + error.message };
        }
    }
}

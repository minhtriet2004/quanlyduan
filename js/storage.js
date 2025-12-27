/**
 * Storage utility class for managing user sessions and data
 * Acts as a wrapper around APIClient's storage methods
 */
class Storage {
    /**
     * Get current logged-in user
     * @returns {Object|null} User object or null if not logged in
     */
    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Set current user
     * @param {Object} user User object to store
     */
    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Get current admin
     * @returns {Object|null} Admin object or null if not logged in as admin
     */
    static getAdmin() {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    }

    /**
     * Set current admin
     * @param {Object} admin Admin object to store
     */
    static setAdmin(admin) {
        localStorage.setItem('admin', JSON.stringify(admin));
    }

    /**
     * Get auth token
     * @returns {string|null} Auth token or null
     */
    static getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Set auth token
     * @param {string} token Auth token to store
     */
    static setToken(token) {
        localStorage.setItem('token', token);
    }

    /**
     * Clear all stored user data (logout)
     */
    static clearAll() {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        localStorage.removeItem('adminSession');
    }

    /**
     * Alias for clearAll() - logout
     */
    static clear() {
        this.clearAll();
    }

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    static isLoggedIn() {
        return this.getUser() !== null;
    }

    /**
     * Check if admin is logged in
     * @returns {boolean}
     */
    static isAdminLoggedIn() {
        return this.getAdmin() !== null;
    }
}

/**
 * Bookings API Client
 * Handles all booking-related API calls
 */
class BookingsClient {
    static getApiPath() {
        // Detect API base URL - works with or without /quanlyduan in path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/quanlyduan/')) {
            return '/quanlyduan/api/bookings.php';
        }
        return '/api/bookings.php';
    }

    /**
     * Get bookings for current user
     */
    static async getUserBookings(userId, status = null) {
        try {
            let url = `${this.getApiPath()}?user_id=${userId}`;
            if (status) {
                url += `&status=${status}`;
            }
            
            const response = await fetch(url);
            const text = await response.text();
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return { success: false, message: 'Error fetching bookings' };
        }
    }

    /**
     * Create a new booking
     */
    static async createBooking(bookingData) {
        try {
            const response = await fetch(this.getApiPath(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'create',
                    ...bookingData
                })
            });

            const text = await response.text();
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, message: 'Error creating booking' };
        }
    }

    /**
     * Cancel a booking
     */
    static async cancelBooking(bookingId) {
        try {
            const response = await fetch(this.getApiPath(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'cancel',
                    booking_id: bookingId
                })
            });

            const text = await response.text();
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return { success: false, message: 'Error cancelling booking' };
        }
    }
}

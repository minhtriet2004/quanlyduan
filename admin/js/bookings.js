// ===== BOOKINGS =====
async function loadBookings() {
    try {
        const response = await APIClient.getBookings();
        if (!response.success) {
            console.error('Failed to load bookings:', response.message);
            return;
        }

        let bookings = response.data.bookings || [];
        const statusFilter = document.getElementById('booking-status-filter')?.value;
        
        if (statusFilter) {
            bookings = bookings.filter(b => b.status === statusFilter);
        }

        const tbody = document.getElementById('bookings-body');
        tbody.innerHTML = '';

        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>';
            return;
        }

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${booking.id}</td>
                <td>User ${booking.user_id}</td>
                <td>Movie ${booking.movie_id}</td>
                <td>#${booking.showing_id}</td>
                <td>${booking.total_seats} ghế</td>
                <td>${formatCurrency(booking.total_price)}</td>
                <td>${formatDate(booking.booking_date)}</td>
                <td><span class="status-badge status-${booking.status}">${getStatusLabel(booking.status)}</span></td>
                <td>
                    <button class="action-btn view" onclick="viewBooking(${booking.id})">Xem</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

function viewBooking(id) {
    alert(`Chi tiết đơn vé #${id} - Xem trong database`);
}

function updateBookingStatus(id, status) {
    if (!status) return;
    // Update booking status via API (optional feature)
    showNotification('Feature coming soon', 'info');
}

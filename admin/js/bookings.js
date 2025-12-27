// ===== BOOKINGS =====
async function loadBookings() {
    try {
        const moviesRes = await APIClient.getMovies();
        const movies = moviesRes.success ? moviesRes.data.movies : [];
        
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
            // Get current movie price from movies list
            const movie = movies.find(m => m.id == booking.movie_id);
            const currentPrice = movie ? movie.price : 0;
            // Calculate current total price based on number of seats
            const currentTotal = currentPrice * booking.total_seats;
            
            row.innerHTML = `
                <td>#${booking.id}</td>
                <td>User ${booking.user_id}</td>
                <td>Movie ${booking.movie_id}</td>
                <td>#${booking.showing_id}</td>
                <td>${booking.total_seats} ghế</td>
                <td>${formatCurrency(currentTotal)}</td>
                <td>${formatDate(booking.booking_date)}</td>
                <td><span class="status-badge status-${booking.status}">${getStatusLabel(booking.status)}</span></td>
                <td>
                    <button class="action-btn view" onclick="viewBooking(${booking.id})">Xem</button>
                    <button class="action-btn edit" onclick="editBooking(${booking.id})">Sửa</button>
                    <button class="action-btn delete" onclick="deleteBookingConfirm(${booking.id})">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        currentBookings = bookings;
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

function viewBooking(id) {
    try {
        const moviesRes = APIClient.getMovies();
        moviesRes.then(res => {
            const movies = res.success ? res.data.movies : [];
            const booking = currentBookings.find(b => b.id === id);
            if (booking) {
                const movie = movies.find(m => m.id == booking.movie_id);
                const currentPrice = movie ? movie.price : 0;
                const currentTotal = currentPrice * booking.total_seats;
                
                const message = `
Đơn Vé #${booking.id}
Khách: User ${booking.user_id}
Phim: Movie ${booking.movie_id}
Suất Chiếu: #${booking.showing_id}
Ghế: ${booking.total_seats} ghế
Giá gốc (lúc đặt): ${formatCurrency(booking.total_price)}
Giá hiện tại: ${formatCurrency(currentTotal)}
Ngày Đặt: ${formatDate(booking.booking_date)}
Trạng Thái: ${getStatusLabel(booking.status)}
                `;
                alert(message);
            }
        });
    } catch (error) {
        console.error('Error viewing booking:', error);
        alert('Lỗi khi xem thông tin đơn vé');
    }
}

async function editBooking(id) {
    try {
        const response = await APIClient.getBookings();
        const booking = response.data.bookings.find(b => b.id === id);
        
        if (!booking) {
            alert('Không tìm thấy đơn vé');
            return;
        }

        const newStatus = prompt('Chọn trạng thái mới:\npending\nconfirmed\ncompleted\ncancelled', booking.status);
        if (!newStatus) return;

        const updateResponse = await APIClient.updateBooking({
            id: id,
            status: newStatus
        });

        if (updateResponse.success) {
            showNotification('Cập nhật trạng thái thành công!', 'success');
            loadBookings();
        } else {
            showNotification('Lỗi cập nhật: ' + updateResponse.message, 'error');
        }
    } catch (error) {
        console.error('Error editing booking:', error);
        showNotification('Lỗi: ' + error.message, 'error');
    }
}

async function deleteBookingConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa đơn vé này?')) {
        try {
            const response = await APIClient.deleteBooking(id);
            if (response.success) {
                showNotification('Xóa đơn vé thành công!', 'success');
                loadBookings();
            } else {
                showNotification('Lỗi: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            showNotification('Lỗi khi xóa: ' + error.message, 'error');
        }
    }
}

let currentBookings = [];

// Load bookings when section is shown
document.addEventListener('DOMContentLoaded', function() {
    const statusFilter = document.getElementById('booking-status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', loadBookings);
    }
});

function updateBookingStatus(id, status) {
    if (!status) return;
    // Update booking status via API (optional feature)
    showNotification('Feature coming soon', 'info');
}

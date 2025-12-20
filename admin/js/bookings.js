// ===== BOOKINGS =====
function loadBookings() {
    const allBookings = db.getBookings() || [];
    const statusFilter = document.getElementById('booking-status-filter')?.value;
    
    let bookings = allBookings;
    if (statusFilter) {
        bookings = allBookings.filter(b => b.status === statusFilter);
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

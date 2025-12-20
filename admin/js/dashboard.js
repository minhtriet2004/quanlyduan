// ===== DASHBOARD =====
function loadDashboard() {
    // Load statistics
    document.getElementById('total-revenue').textContent = formatCurrency(db.getTotalRevenue());
    document.getElementById('total-bookings').textContent = db.getTotalBookings();
    document.getElementById('total-movies').textContent = db.getTotalMovies();
    document.getElementById('total-users').textContent = db.getTotalUsers();

    // Load recent bookings
    const allBookings = db.getBookings() || [];
    const recentBookings = allBookings.slice(-5).reverse();
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
    const bookingsForMovies = db.getBookings() || [];
    bookingsForMovies.forEach(booking => {
        movieBookings[booking.movieTitle] = (movieBookings[booking.movieTitle] || 0) + 1;
    });

    const popularMoviesDiv = document.getElementById('popular-movies');
    popularMoviesDiv.innerHTML = '';

    if (Object.keys(movieBookings).length === 0) {
        popularMoviesDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">Không có dữ liệu</div>';
        return;
    }

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

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        // Load statistics
        const moviesRes = await APIClient.getMovies('showing', 1000);
        const bookingsRes = await APIClient.getBookings();
        
        const movies = moviesRes.success ? moviesRes.data.movies : [];
        const bookings = bookingsRes.success ? bookingsRes.data.bookings : [];

        document.getElementById('total-movies').textContent = movies.length;
        document.getElementById('total-bookings').textContent = bookings.length;
        
        // Calculate total revenue
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
        document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);

        // Load recent bookings
        const recentBookings = bookings.slice(-5).reverse();
        const tbody = document.getElementById('recent-bookings-body');
        tbody.innerHTML = '';

        if (recentBookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Không có đơn vé</td></tr>';
            return;
        }

        recentBookings.forEach(booking => {
            const row = document.createElement('tr');
            // Get current movie price from movies list
            const movie = movies.find(m => m.id == booking.movie_id);
            const currentPrice = movie ? movie.price : 0;
            row.innerHTML = `
                <td>#${booking.id}</td>
                <td>User ${booking.user_id}</td>
                <td>Movie ${booking.movie_id}</td>
                <td>${formatCurrency(currentPrice * booking.total_seats)}</td>
                <td><span class="status-badge status-${booking.status}">${getStatusLabel(booking.status)}</span></td>
            `;
            tbody.appendChild(row);
        });

        // Load popular movies
        const movieBookings = {};
        bookings.forEach(booking => {
            movieBookings[booking.movie_id] = (movieBookings[booking.movie_id] || 0) + 1;
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
            .forEach(([movieId, count]) => {
                const item = document.createElement('div');
                item.className = 'popular-movie-item';
                const movie = movies.find(m => m.id == movieId);
                item.innerHTML = `
                    <span class="popular-movie-name">${movie ? movie.title : 'Movie ' + movieId}</span>
                    <span class="popular-movie-count">${count} vé</span>
                `;
                popularMoviesDiv.appendChild(item);
            });
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

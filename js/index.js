// Load movies from API and display on homepage
async function loadMoviesFromAPI() {
    try {
        const response = await APIClient.getMovies();
        
        if (!response.success) {
            console.error('Failed to load movies:', response.message);
            return;
        }

        const movies = response.data.movies || [];
        
        // Categorize movies by status
        const showingMovies = movies.filter(m => m.auto_status === 'showing');
        const comingSoonMovies = movies.filter(m => m.auto_status === 'coming_soon');
        
        displayMovies(showingMovies, 'showing');
        displayMovies(comingSoonMovies, 'coming_soon');
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function displayMovies(movies, status) {
    let movieGrid;
    
    if (status === 'showing') {
        movieGrid = document.querySelector('#now-showing .movie-grid');
    } else {
        movieGrid = document.querySelector('#coming-soon .movie-grid');
    }
    
    if (!movieGrid) return;

    movieGrid.innerHTML = '';

    if (movies.length === 0) {
        const emptyMsg = status === 'showing' ? 'Không có phim đang chiếu' : 'Không có phim sắp chiếu';
        movieGrid.innerHTML = `<p style="text-align: center; grid-column: 1/-1;">${emptyMsg}</p>`;
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const posterImg = movie.poster_image ? movie.poster_image : '/img/default-poster.jpg';
        const buttonText = status === 'showing' ? 'Mua vé' : 'Đặt trước';
        const badgeHtml = status === 'coming_soon' ? '<span class="badge-coming">Sắp chiếu</span>' : '';
        
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${posterImg}" alt="${movie.title}">
                <div class="movie-overlay">
                    <button class="btn-buy" onclick="bookTicket(${movie.id}, '${movie.title}')">${buttonText}</button>
                </div>
                ${badgeHtml}
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <p><span class="label">Thể loại:</span> ${movie.genre || 'N/A'}</p>
                    <p><span class="label">Thời lượng:</span> ${movie.duration || 0} phút</p>
                    <p><span class="label">Khởi chiếu:</span> ${formatDate(movie.release_date)}</p>
                </div>
            </div>
        `;
        
        movieCard.addEventListener('click', () => viewMovieDetails(movie.id));
        movieGrid.appendChild(movieCard);
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function bookTicket(movieId, movieTitle) {
    // Check if user is logged in
    const user = Storage.getUser();
    if (!user) {
        Notification.error('Vui lòng đăng nhập để mua vé!');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    // Redirect to booking page
    window.location.href = `movie-details.html?id=${movieId}`;
}

function viewMovieDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}

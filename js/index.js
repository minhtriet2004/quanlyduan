// Load movies from API and display on homepage
async function loadMoviesFromAPI() {
    try {
        const response = await APIClient.getMovies('showing');
        
        if (!response.success) {
            console.error('Failed to load movies:', response.message);
            return;
        }

        const movies = response.data.movies || [];
        displayMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.querySelector('.movie-grid');
    if (!movieGrid) return;

    movieGrid.innerHTML = '';

    if (movies.length === 0) {
        movieGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Không có phim nào hiện tại</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const posterImg = movie.poster_image ? movie.poster_image : '/img/default-poster.jpg';
        
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${posterImg}" alt="${movie.title}">
                <div class="movie-overlay">
                    <button class="btn-buy" onclick="bookTicket(${movie.id}, '${movie.title}')">Mua vé</button>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-meta">
                    <span class="movie-rating">⭐ ${movie.rating || 'N/A'}</span>
                    <span class="movie-duration">${movie.duration || 0} phút</span>
                </p>
                <p class="movie-genre">${movie.genre || 'N/A'}</p>
            </div>
        `;
        
        movieCard.addEventListener('click', () => viewMovieDetails(movie.id));
        movieGrid.appendChild(movieCard);
    });
}

function bookTicket(movieId, movieTitle) {
    // Check if user is logged in
    const user = Storage.getUser();
    if (!user) {
        alert('Vui lòng đăng nhập để mua vé!');
        window.location.href = 'login.html';
        return;
    }

    // Redirect to booking page
    window.location.href = `movie-details.html?id=${movieId}`;
}

function viewMovieDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}

// Load movies when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadMoviesFromAPI();
});

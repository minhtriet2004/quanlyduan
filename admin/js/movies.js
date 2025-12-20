// ===== MOVIES =====
function loadMovies() {
    const movies = db.getMovies() || [];
    const tbody = document.getElementById('movies-body');
    tbody.innerHTML = '';

    if (movies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>';
        return;
    }

    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.duration} phút</td>
            <td>${formatCurrency(movie.price)}</td>
            <td>${formatDate(movie.releaseDate)}</td>
            <td><span class="status-badge status-${movie.status}">${getStatusLabel(movie.status)}</span></td>
            <td>
                <button class="action-btn edit" onclick="editMovie(${movie.id})">Sửa</button>
                <button class="action-btn delete" onclick="deleteMovieConfirm(${movie.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Populate movie select in showing form
    const movieSelect = document.getElementById('showing-movie');
    if (movieSelect) {
        movieSelect.innerHTML = '';
        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.title;
            movieSelect.appendChild(option);
        });
    }
}

function openMovieModal() {
    document.getElementById('movie-modal-title').textContent = 'Thêm Phim';
    document.getElementById('movie-form').reset();
    document.getElementById('movie-modal').style.display = 'block';
    document.getElementById('movie-form').dataset.movieId = '';
}

function editMovie(id) {
    const movie = db.getMovieById(id);
    if (!movie) return;

    document.getElementById('movie-modal-title').textContent = 'Sửa Phim';
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-genre').value = movie.genre;
    document.getElementById('movie-duration').value = movie.duration;
    document.getElementById('movie-price').value = movie.price;
    document.getElementById('movie-release-date').value = movie.releaseDate;
    document.getElementById('movie-description').value = movie.description;
    document.getElementById('movie-poster').value = movie.poster;
    document.getElementById('movie-status').value = movie.status;
    document.getElementById('movie-form').dataset.movieId = id;
    document.getElementById('movie-modal').style.display = 'block';
}

function saveMovie(e) {
    e.preventDefault();

    const movieId = document.getElementById('movie-form').dataset.movieId;
    const movieData = {
        title: document.getElementById('movie-title').value,
        genre: document.getElementById('movie-genre').value,
        duration: parseInt(document.getElementById('movie-duration').value),
        price: parseInt(document.getElementById('movie-price').value),
        releaseDate: document.getElementById('movie-release-date').value,
        description: document.getElementById('movie-description').value,
        poster: document.getElementById('movie-poster').value,
        status: document.getElementById('movie-status').value
    };

    if (movieId) {
        db.updateMovie(parseInt(movieId), movieData);
        showNotification('Cập nhật phim thành công!', 'success');
    } else {
        db.addMovie(movieData);
        showNotification('Thêm phim thành công!', 'success');
    }

    closeModal();
    loadMovies();
    loadDashboard();
}

function deleteMovieConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa phim này?')) {
        db.deleteMovie(id);
        showNotification('Xóa phim thành công!', 'success');
        loadMovies();
        loadDashboard();
    }
}

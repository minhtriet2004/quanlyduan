// ===== MOVIES =====
async function loadMovies() {
    try {
        const response = await APIClient.getMovies('showing', 1000, 0);
        
        if (!response.success) {
            console.error('Failed to load movies:', response.message);
            return;
        }

        const movies = response.data.movies || [];
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
                <td>${movie.genre || '-'}</td>
                <td>${movie.duration || 0} phút</td>
                <td>${movie.rating || 0}</td>
                <td>${formatDate(movie.release_date)}</td>
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
            movieSelect.innerHTML = '<option value="">Chọn phim...</option>';
            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.id;
                option.textContent = movie.title;
                movieSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function openMovieModal() {
    document.getElementById('movie-modal-title').textContent = 'Thêm Phim';
    document.getElementById('movie-form').reset();
    document.getElementById('poster-preview').innerHTML = '';
    document.getElementById('movie-poster').value = '';
    document.getElementById('movie-modal').style.display = 'block';
    document.getElementById('movie-form').dataset.movieId = '';
}

async function editMovie(id) {
    try {
        const response = await APIClient.getMovieById(id);
        
        if (!response.success) {
            console.error('Failed to load movie:', response.message);
            return;
        }

        const movie = response.data.movie;
        document.getElementById('movie-modal-title').textContent = 'Sửa Phim';
        document.getElementById('movie-title').value = movie.title || '';
        document.getElementById('movie-genre').value = movie.genre || '';
        document.getElementById('movie-duration').value = movie.duration || '';
        document.getElementById('movie-release-date').value = movie.release_date || '';
        document.getElementById('movie-description').value = movie.description || '';
        document.getElementById('movie-poster').value = movie.poster_image || '';
        document.getElementById('movie-status').value = movie.status || 'showing';
        
        // Show existing poster preview
        if (movie.poster_image) {
            const preview = document.getElementById('poster-preview');
            preview.innerHTML = `<img src="${movie.poster_image}" alt="Preview">`;
        }
        
        document.getElementById('movie-form').dataset.movieId = id;
        document.getElementById('movie-modal').style.display = 'block';
    } catch (error) {
        console.error('Error editing movie:', error);
    }
}

async function saveMovie(e) {
    e.preventDefault();

    const movieId = document.getElementById('movie-form').dataset.movieId;
    let posterImage = document.getElementById('movie-poster').value;
    
    // Handle file upload if a new file is selected
    const fileInput = document.getElementById('movie-poster-file');
    if (fileInput.files.length > 0) {
        try {
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            
            const uploadResponse = await fetch('/api/upload.php', {
                method: 'POST',
                body: formData
            });
            
            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                posterImage = uploadData.data.path;
            } else {
                showNotification('Lỗi upload hình: ' + uploadData.message, 'error');
                return;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('Lỗi khi upload hình!', 'error');
            return;
        }
    }

    const movieData = {
        title: document.getElementById('movie-title').value,
        genre: document.getElementById('movie-genre').value,
        duration: parseInt(document.getElementById('movie-duration').value),
        release_date: document.getElementById('movie-release-date').value,
        description: document.getElementById('movie-description').value,
        poster_image: posterImage,
        status: document.getElementById('movie-status').value
    };

    try {
        let response;
        if (movieId) {
            movieData.id = movieId;
            response = await APIClient.updateMovie(movieData);
            if (response.success) {
                showNotification('Cập nhật phim thành công!', 'success');
            }
        } else {
            response = await APIClient.addMovie(movieData);
            if (response.success) {
                showNotification('Thêm phim thành công!', 'success');
            }
        }

        if (response.success) {
            closeModal();
            loadMovies();
            loadDashboard();
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error saving movie:', error);
        showNotification('Lỗi khi lưu phim!', 'error');
    }
}

async function deleteMovieConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa phim này?')) {
        try {
            const response = await APIClient.deleteMovie(id);
            if (response.success) {
                showNotification('Xóa phim thành công!', 'success');
                loadMovies();
                loadDashboard();
            } else {
                showNotification(response.message || 'Lỗi!', 'error');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            showNotification('Lỗi khi xóa phim!', 'error');
        }
    }
}

// Handle poster file input change
if (document.getElementById('movie-poster-file')) {
    document.getElementById('movie-poster-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('poster-preview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

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
            const price = movie.price ? new Intl.NumberFormat('vi-VN').format(movie.price) : '-';
            row.innerHTML = `
                <td>#${movie.id}</td>
                <td>${movie.title}</td>
                <td>${movie.genre || '-'}</td>
                <td>${movie.duration || 0} phút</td>
                <td>${price}</td>
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
    
    // Setup Enter key handler for form submission
    setupFormEnterKey();
}

async function editMovie(id) {
    console.log('editMovie called with id:', id);
    try {
        // Try to get movie with showings first, fallback to getMovieById if it fails
        let response;
        try {
            response = await APIClient.getMovieWithShowings(id);
            console.log('getMovieWithShowings response:', response);
        } catch (err) {
            console.warn('getMovieWithShowings failed, falling back to getMovieById:', err);
            response = await APIClient.getMovieById(id);
            console.log('getMovieById response:', response);
        }
        
        if (!response.success) {
            console.error('Failed to load movie:', response);
            showNotification('Lỗi tải phim: ' + (response.message || 'Không tải được dữ liệu'), 'error');
            return;
        }

        const movie = response.data.movie;
        console.log('Movie loaded:', movie);
        
        if (!movie) {
            showNotification('Lỗi: Dữ liệu phim không hợp lệ', 'error');
            return;
        }
        
        document.getElementById('movie-modal-title').textContent = 'Sửa Phim';
        
        // Set form values with null checks
        const setFieldValue = (elementId, value) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.value = value || '';
            } else {
                console.warn(`Element ${elementId} not found`);
            }
        };
        
        setFieldValue('movie-title', movie.title);
        setFieldValue('movie-genre', movie.genre);
        setFieldValue('movie-duration', movie.duration);
        setFieldValue('movie-release-date', movie.release_date);
        setFieldValue('movie-description', movie.description);
        setFieldValue('movie-poster', movie.poster_image);
        setFieldValue('movie-price', movie.price);
        setFieldValue('movie-director', movie.director);
        setFieldValue('movie-rating', movie.rating);
        setFieldValue('movie-status', movie.status || 'showing');
        
        // Show existing poster preview
        const posterPreview = document.getElementById('poster-preview');
        if (posterPreview) {
            if (movie.poster_image) {
                posterPreview.innerHTML = `<img src="${movie.poster_image}" alt="Preview" style="max-width: 100px; max-height: 100px;">`;
            } else {
                posterPreview.innerHTML = '';
            }
        }
        
        const movieForm = document.getElementById('movie-form');
        if (movieForm) {
            movieForm.dataset.movieId = id;
        }
        
        const movieModal = document.getElementById('movie-modal');
        if (movieModal) {
            movieModal.style.display = 'block';
        } else {
            console.error('movie-modal element not found');
            showNotification('Lỗi: Modal không tồn tại', 'error');
            return;
        }
    } catch (error) {
        console.error('Error editing movie:', error);
        showNotification('Lỗi khi sửa phim: ' + error.message, 'error');
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
            
            // Detect API base URL - works with or without /quanlyduan in path
            const currentPath = window.location.pathname;
            const uploadUrl = currentPath.includes('/quanlyduan/') ? '/quanlyduan/api/upload.php' : '/api/upload.php';
            
            const uploadResponse = await fetch(uploadUrl, {
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
        title: document.getElementById('movie-title')?.value || '',
        genre: document.getElementById('movie-genre')?.value || '',
        duration: parseInt(document.getElementById('movie-duration')?.value) || 0,
        release_date: document.getElementById('movie-release-date')?.value || '',
        description: document.getElementById('movie-description')?.value || '',
        poster_image: posterImage,
        price: parseFloat(document.getElementById('movie-price')?.value) || 0,
        director: document.getElementById('movie-director')?.value || '',
        rating: parseFloat(document.getElementById('movie-rating')?.value) || 0,
        status: document.getElementById('movie-status')?.value || 'showing'
    };

    console.log('Movie data to save:', movieData);

    try {
        let response;
        if (movieId) {
            movieData.id = movieId;
            response = await APIClient.updateMovie(movieData);
            if (response.success) {
                showNotification('Cập nhật phim thành công!', 'success');
            } else {
                console.error('API Error:', response);
                showNotification('Lỗi: ' + (response.message || 'Lỗi cập nhật phim'), 'error');
                return;
            }
        } else {
            response = await APIClient.addMovie(movieData);
            if (response.success) {
                showNotification('Thêm phim thành công!', 'success');
            } else {
                console.error('API Error:', response);
                showNotification('Lỗi: ' + (response.message || 'Lỗi thêm phim'), 'error');
                return;
            }
        }

        if (response.success) {
            closeModal();
            loadMovies();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error saving movie:', error);
        showNotification('Lỗi khi lưu phim: ' + error.message, 'error');
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

// Setup Enter key submission for forms
function setupFormEnterKey() {
    const form = document.getElementById('movie-form');
    if (!form) return;
    
    // Get all input and select elements (not textarea)
    const inputs = form.querySelectorAll('input:not([type="button"]):not([type="submit"]), select');
    
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            // Check if Enter key was pressed
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                // Submit the form
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.click();
                } else {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    });
}

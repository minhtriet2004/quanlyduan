// ===== MOVIES MANAGEMENT =====
// Completely isolated movie management

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
                    <button class="action-btn view" onclick="viewShowings(${movie.id})">Suất Chiếu</button>
                    <button class="action-btn delete" onclick="deleteMovieConfirm(${movie.id})">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function openMovieModal() {
    console.log('openMovieModal called');
    document.getElementById('movie-modal-title').textContent = 'Thêm Phim';
    document.getElementById('movie-form').reset();
    document.getElementById('poster-preview').innerHTML = '';
    document.getElementById('movie-poster').value = '';
    document.getElementById('movie-form').dataset.movieId = '';
    
    const modal = document.getElementById('movie-modal');
    if (modal) {
        modal.style.display = 'flex';
        console.log('Movie modal opened');
    }
    
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
            movieModal.style.display = 'flex';
            console.log('Movie modal opened for editing');
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
            document.getElementById('movie-modal').style.display = 'none';
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
function handlePosterChange() {
    const fileInput = document.getElementById('movie-poster-file');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('poster-preview').innerHTML = 
                `<img src="${e.target.result}" alt="Preview" style="max-width: 100px; max-height: 100px;">`;
        };
        reader.readAsDataURL(file);
    }
}

// Setup Enter key handler for movie form
function setupFormEnterKey() {
    const form = document.getElementById('movie-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input:not([type="file"]):not([type="button"]):not([type="submit"]), select, textarea');
    
    inputs.forEach(input => {
        // Clone and replace to remove old listeners
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                if (newInput.id !== 'movie-description') {
                    e.preventDefault();
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                    }
                }
            }
        });
    });
}

// ===== SHOWINGS MANAGEMENT WITHIN MOVIES =====
// Load and display showings for a specific movie
async function viewShowings(movieId) {
    try {
        console.log('Viewing showings for movie:', movieId);
        
        // Get all showings
        const response = await APIClient.getShowings();
        if (!response.success) {
            showNotification('Lỗi khi tải suất chiếu', 'error');
            return;
        }

        const allShowings = response.data.showings || [];
        const movieShowings = allShowings.filter(s => s.movie_id === movieId);

        // Show modal with showings list
        showShowingsModal(movieId, movieShowings);
    } catch (error) {
        console.error('Error viewing showings:', error);
        showNotification('Lỗi khi tải suất chiếu: ' + error.message, 'error');
    }
}

function showShowingsModal(movieId, showings) {
    // Create modal dynamically
    let modal = document.getElementById('showings-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'showings-modal';
        modal.className = 'modal';
        modal.style.display = 'none';
        document.body.appendChild(modal);
    }

    let html = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Suất Chiếu</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div style="padding: 20px; max-height: 500px; overflow-y: auto;">
                <button class="btn btn-primary" onclick="addShowingForMovie(${movieId})" style="margin-bottom: 20px;">
                    <i class="fas fa-plus"></i> Thêm Suất Chiếu
                </button>
    `;

    if (showings.length === 0) {
        html += '<p style="text-align: center; color: #999;">Không có suất chiếu nào</p>';
    } else {
        html += '<table class="data-table" style="width: 100%; margin-top: 15px;">';
        html += '<thead><tr>';
        html += '<th>Phòng</th><th>Ngày/Giờ</th><th>Ghế</th><th>Hành Động</th>';
        html += '</tr></thead><tbody>';
        
        showings.forEach(showing => {
            html += `<tr>
                <td>Phòng ${showing.room_number}</td>
                <td>${formatDate(showing.showing_date)} ${showing.showing_time}</td>
                <td>${showing.available_seats}/${showing.total_seats}</td>
                <td>
                    <button class="action-btn edit" onclick="editShowingForMovie(${showing.id}, ${movieId})" style="padding: 5px 10px; font-size: 12px;">Sửa</button>
                    <button class="action-btn delete" onclick="deleteShowingConfirm(${showing.id})" style="padding: 5px 10px; font-size: 12px;">Xóa</button>
                </td>
            </tr>`;
        });
        
        html += '</tbody></table>';
    }

    html += `
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close-btn">Đóng</button>
            </div>
        </div>
    `;

    modal.innerHTML = html;
    modal.style.display = 'flex';

    // Add close handler
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function addShowingForMovie(movieId) {
    // Create a simple form to add showing
    const form = prompt('Nhập thông tin suất chiếu mới:\nĐịnh dạng: Phòng|Ghế|Ngày(YYYY-MM-DD)|Giờ(HH:MM)|Giá\nVD: 1|48|2026-01-22|14:00|120000');
    
    if (!form) return;

    const parts = form.split('|');
    if (parts.length !== 5) {
        showNotification('Định dạng không đúng', 'error');
        return;
    }

    const [room, seats, date, time, price] = parts;
    saveNewShowing(movieId, parseInt(room), parseInt(seats), date.trim(), time.trim(), parseFloat(price));
}

async function saveNewShowing(movieId, room, seats, date, time, price) {
    try {
        const showingData = {
            movie_id: movieId,
            room_number: room,
            total_seats: seats,
            showing_date: date,
            showing_time: time,
            price: price
        };

        const response = await APIClient.addShowing(showingData);
        if (response.success) {
            showNotification('Thêm suất chiếu thành công!', 'success');
            viewShowings(movieId);
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error saving showing:', error);
        showNotification('Lỗi khi lưu suất chiếu!', 'error');
    }
}

function editShowingForMovie(showingId, movieId) {
    const newInfo = prompt('Nhập thông tin cập nhật:\nĐịnh dạng: Phòng|Ghế|Ngày(YYYY-MM-DD)|Giờ(HH:MM)|Giá');
    
    if (!newInfo) return;

    const parts = newInfo.split('|');
    if (parts.length !== 5) {
        showNotification('Định dạng không đúng', 'error');
        return;
    }

    const [room, seats, date, time, price] = parts;
    updateShowing(showingId, movieId, parseInt(room), parseInt(seats), date.trim(), time.trim(), parseFloat(price));
}

async function updateShowing(showingId, movieId, room, seats, date, time, price) {
    try {
        const showingData = {
            id: showingId,
            movie_id: movieId,
            room_number: room,
            total_seats: seats,
            showing_date: date,
            showing_time: time,
            price: price
        };

        const response = await APIClient.updateShowing(showingData);
        if (response.success) {
            showNotification('Cập nhật suất chiếu thành công!', 'success');
            viewShowings(movieId);
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error updating showing:', error);
        showNotification('Lỗi khi cập nhật suất chiếu!', 'error');
    }
}

async function deleteShowingConfirm(showingId) {
    if (!confirm('Bạn chắc chắn muốn xóa suất chiếu này?')) return;

    try {
        const response = await APIClient.deleteShowing(showingId);
        if (response.success) {
            showNotification('Xóa suất chiếu thành công!', 'success');
            // Reload current movie showings
            const modal = document.getElementById('showings-modal');
            if (modal && modal.style.display === 'flex') {
                // Try to get movieId from modal context or reload all
                location.reload();
            }
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error deleting showing:', error);
        showNotification('Lỗi khi xóa suất chiếu!', 'error');
    }
}


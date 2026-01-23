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
        
        // Get all showings and movie details
        const [showingsResponse, movieResponse] = await Promise.all([
            APIClient.getShowings(),
            APIClient.getMovieById(movieId)
        ]);

        if (!showingsResponse.success) {
            showNotification('Lỗi khi tải suất chiếu', 'error');
            return;
        }

        const allShowings = showingsResponse.data.showings || [];
        const movieShowings = allShowings.filter(s => s.movie_id === movieId);
        const moviePrice = movieResponse.success ? movieResponse.data.movie.price : 0;

        // Show modal with showings list
        showShowingsModal(movieId, movieShowings, moviePrice);
    } catch (error) {
        console.error('Error viewing showings:', error);
        showNotification('Lỗi khi tải suất chiếu: ' + error.message, 'error');
    }
}

function showShowingsModal(movieId, showings, moviePrice) {
    // Create modal dynamically
    let modal = document.getElementById('showings-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'showings-modal';
        modal.className = 'modal';
        modal.style.display = 'none';
        document.body.appendChild(modal);
    }

    // Store movieId in modal for later use
    modal.dataset.movieId = movieId;

    let html = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>Quản Lý Suất Chiếu</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div style="padding: 20px; max-height: 600px; overflow-y: auto;">
                
                <!-- Form Thêm Suất Chiếu -->
                <div id="add-showing-form" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: none;">
                    <h4 style="margin-top: 0; color: #333;">Thêm Suất Chiếu Mới</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-size: 12px; font-weight: 600; margin-bottom: 5px; color: #555;">Phòng Chiếu *</label>
                            <input type="number" id="new-showing-room" min="1" max="20" placeholder="1" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-size: 12px; font-weight: 600; margin-bottom: 5px; color: #555;">Số Ghế *</label>
                            <input type="number" id="new-showing-seats" min="10" max="200" value="48" placeholder="48" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-size: 12px; font-weight: 600; margin-bottom: 5px; color: #555;">Ngày Chiếu *</label>
                            <input type="date" id="new-showing-date" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-size: 12px; font-weight: 600; margin-bottom: 5px; color: #555;">Giờ Chiếu *</label>
                            <input type="time" id="new-showing-time" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: 600; margin-bottom: 5px; color: #555;">Giá Vé (VND)</label>
                        <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background: #f0f0f0; color: #666;">
                            ${new Intl.NumberFormat('vi-VN').format(moviePrice)} VND
                        </div>
                        <input type="hidden" id="new-showing-price" value="${moviePrice}">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button onclick="cancelAddShowing()" style="padding: 8px 15px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Hủy</button>
                        <button onclick="saveNewShowingFromForm(${movieId})" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Lưu</button>
                    </div>
                </div>

                <!-- Button Thêm Suất Chiếu -->
                <button id="toggle-add-form" class="btn btn-primary" onclick="toggleAddShowingForm()" style="margin-bottom: 20px;">
                    <i class="fas fa-plus"></i> Thêm Suất Chiếu
                </button>

                <!-- Danh Sách Suất Chiếu -->
    `;

    if (showings.length === 0) {
        html += '<p style="text-align: center; color: #999;">Không có suất chiếu nào</p>';
    } else {
        html += '<table class="data-table" style="width: 100%; margin-top: 15px;">';
        html += '<thead><tr style="background: #f8f9fa;">';
        html += '<th style="padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd;">Phòng</th>';
        html += '<th style="padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd;">Ngày/Giờ</th>';
        html += '<th style="padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd;">Ghế</th>';
        html += '<th style="padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd;">Giá</th>';
        html += '<th style="padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd;">Hành Động</th>';
        html += '</tr></thead><tbody>';
        
        showings.forEach(showing => {
            const price = showing.price ? new Intl.NumberFormat('vi-VN').format(showing.price) : 'N/A';
            html += `<tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">Phòng ${showing.room_number}</td>
                <td style="padding: 10px;">${formatDate(showing.showing_date)} ${showing.showing_time}</td>
                <td style="padding: 10px;">${showing.available_seats}/${showing.total_seats}</td>
                <td style="padding: 10px;">${price} VND</td>
                <td style="padding: 10px;">
                    <button class="action-btn edit" onclick="editShowingForMovie(${showing.id}, ${movieId})" style="padding: 5px 10px; font-size: 12px; margin-right: 5px;">Sửa</button>
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

    // Add close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function toggleAddShowingForm() {
    const form = document.getElementById('add-showing-form');
    const btn = document.getElementById('toggle-add-form');
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        btn.textContent = '✕ Hủy Thêm';
        btn.style.background = '#dc3545';
    } else {
        form.style.display = 'none';
        btn.textContent = '+ Thêm Suất Chiếu';
        btn.style.background = '';
    }
}

function cancelAddShowing() {
    const form = document.getElementById('add-showing-form');
    const btn = document.getElementById('toggle-add-form');
    
    form.style.display = 'none';
    btn.textContent = '+ Thêm Suất Chiếu';
    btn.style.background = '';
    
    // Clear form
    document.getElementById('new-showing-room').value = '';
    document.getElementById('new-showing-seats').value = '48';
    document.getElementById('new-showing-date').value = '';
    document.getElementById('new-showing-time').value = '';
}

async function saveNewShowingFromForm(movieId) {
    const room = parseInt(document.getElementById('new-showing-room').value);
    const seats = parseInt(document.getElementById('new-showing-seats').value);
    const date = document.getElementById('new-showing-date').value;
    const time = document.getElementById('new-showing-time').value;
    const price = parseFloat(document.getElementById('new-showing-price').value);

    // Validate
    if (!room || room < 1) {
        showNotification('Vui lòng nhập phòng chiếu', 'error');
        return;
    }
    if (!seats || seats < 10) {
        showNotification('Vui lòng nhập số ghế (tối thiểu 10)', 'error');
        return;
    }
    if (!date) {
        showNotification('Vui lòng chọn ngày chiếu', 'error');
        return;
    }
    if (!time) {
        showNotification('Vui lòng chọn giờ chiếu', 'error');
        return;
    }

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
            cancelAddShowing();
            viewShowings(movieId);
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error saving showing:', error);
        showNotification('Lỗi khi lưu suất chiếu!', 'error');
    }
}

async function editShowingForMovie(showingId, movieId) {
    // Fetch the showing details first
    try {
        const response = await APIClient.getShowingById(showingId);
        if (!response.success) {
            showNotification('Không thể tải thông tin suất chiếu', 'error');
            return;
        }

        const showing = response.showing;
        
        // Create edit form modal
        let modal = document.getElementById('edit-showing-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'edit-showing-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        const html = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>Chỉnh Sửa Suất Chiếu</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div>
                            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Phòng Chiếu *</label>
                            <input type="number" id="edit-room-${showingId}" value="${showing.room_number}" min="1" max="20" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Số Ghế *</label>
                            <input type="number" id="edit-seats-${showingId}" value="${showing.total_seats}" min="10" max="200" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Ngày Chiếu *</label>
                            <input type="date" id="edit-date-${showingId}" value="${showing.showing_date}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Giờ Chiếu *</label>
                            <input type="time" id="edit-time-${showingId}" value="${showing.showing_time}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Giá Vé (VND) *</label>
                            <input type="number" id="edit-price-${showingId}" value="${showing.price}" min="1000" step="1000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                    <button type="button" class="btn btn-primary" onclick="updateShowingFromForm(${showingId}, ${movieId})">Lưu Thay Đổi</button>
                </div>
            </div>
        `;

        modal.innerHTML = html;
        modal.style.display = 'flex';

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.querySelector('.modal-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

    } catch (error) {
        console.error('Error fetching showing:', error);
        showNotification('Lỗi khi tải thông tin suất chiếu', 'error');
    }
}

async function updateShowingFromForm(showingId, movieId) {
    const room = parseInt(document.getElementById(`edit-room-${showingId}`).value);
    const seats = parseInt(document.getElementById(`edit-seats-${showingId}`).value);
    const date = document.getElementById(`edit-date-${showingId}`).value;
    const time = document.getElementById(`edit-time-${showingId}`).value;
    const price = parseFloat(document.getElementById(`edit-price-${showingId}`).value);

    // Validate
    if (!room || room < 1) {
        showNotification('Vui lòng nhập phòng chiếu', 'error');
        return;
    }
    if (!seats || seats < 10) {
        showNotification('Vui lòng nhập số ghế (tối thiểu 10)', 'error');
        return;
    }
    if (!date) {
        showNotification('Vui lòng chọn ngày chiếu', 'error');
        return;
    }
    if (!time) {
        showNotification('Vui lòng chọn giờ chiếu', 'error');
        return;
    }
    if (!price || price < 1000) {
        showNotification('Vui lòng nhập giá vé (tối thiểu 1000 VND)', 'error');
        return;
    }

    try {
        const updateData = {
            id: showingId,
            room_number: room,
            total_seats: seats,
            showing_date: date,
            showing_time: time,
            price: price
        };

        const response = await APIClient.updateShowing(updateData);
        if (response.success) {
            showNotification('Cập nhật suất chiếu thành công!', 'success');
            document.getElementById('edit-showing-modal').style.display = 'none';
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
                const movieId = parseInt(modal.dataset.movieId);
                if (movieId) {
                    await viewShowings(movieId);
                } else {
                    location.reload();
                }
            }
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error deleting showing:', error);
        showNotification('Lỗi khi xóa suất chiếu!', 'error');
    }
}


// ===== SHOWINGS =====
async function loadShowings() {
    try {
        const response = await APIClient.getShowings();
        
        if (!response.success) {
            console.error('Failed to load showings:', response.message);
            return;
        }

        const showings = response.data.showings || [];
        const tbody = document.getElementById('showings-body');
        tbody.innerHTML = '';

        if (showings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>';
            return;
        }

        showings.forEach(showing => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${showing.id}</td>
                <td>${showing.title || 'N/A'}</td>
                <td>${showing.room_number}</td>
                <td>${showing.total_seats} ghế</td>
                <td>${formatDate(showing.showing_date)} ${showing.showing_time}</td>
                <td>${showing.available_seats}/${showing.total_seats}</td>
                <td>
                    <button class="action-btn edit" onclick="editShowing(${showing.id})">Sửa</button>
                    <button class="action-btn delete" onclick="deleteShowingConfirm(${showing.id})">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading showings:', error);
    }
}

function openShowingModal() {
    console.log('openShowingModal called');
    document.getElementById('showing-form').reset();
    document.getElementById('showing-form').dataset.showingId = '';
    
    // Load movies into select
    loadMoviesForSelect();
    
    const modal = document.getElementById('showing-modal');
    console.log('Modal element:', modal);
    if (modal) {
        modal.style.display = 'flex';
        console.log('Modal display set to flex');
    } else {
        console.error('showing-modal element not found!');
    }
    setupFormEnterKeyForShowing();
}

// Load movies for select dropdown
async function loadMoviesForSelect() {
    try {
        const response = await APIClient.getMovies('showing', 1000);
        const movies = response.success ? response.data.movies : [];
        
        const select = document.getElementById('showing-movie');
        select.innerHTML = '<option value="">Chọn phim</option>';
        
        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.title;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading movies for select:', error);
    }
}

async function editShowing(id) {
    try {
        console.log('Editing showing:', id);
        const response = await APIClient.getShowings();
        
        if (!response.success) {
            console.error('Failed to load showing:', response.message);
            return;
        }

        const showings = response.data.showings || [];
        const showing = showings.find(s => s.id === id);
        
        if (!showing) {
            console.error('Showing not found:', id);
            return;
        }

        console.log('Found showing:', showing);
        document.getElementById('showing-movie').value = showing.movie_id;
        document.getElementById('showing-room').value = showing.room_number;
        document.getElementById('showing-seats').value = showing.total_seats;
        document.getElementById('showing-date').value = showing.showing_date;
        document.getElementById('showing-time').value = showing.showing_time;
        document.getElementById('showing-form').dataset.showingId = id;
        document.getElementById('showing-modal').style.display = 'flex';
        setupFormEnterKeyForShowing();
        console.log('Modal opened for editing');
    } catch (error) {
        console.error('Error editing showing:', error);
    }
}

async function saveShowing(e) {
    e.preventDefault();
    console.log('saveShowing called');

    const showingId = document.getElementById('showing-form').dataset.showingId;
    console.log('Showing ID:', showingId);
    
    const showingData = {
        movie_id: parseInt(document.getElementById('showing-movie').value),
        room_number: parseInt(document.getElementById('showing-room').value) || 1,
        showing_date: document.getElementById('showing-date').value,
        showing_time: document.getElementById('showing-time').value,
        total_seats: parseInt(document.getElementById('showing-seats').value) || 100
    };
    
    console.log('Showing data:', showingData);

    try {
        let response;
        if (showingId) {
            showingData.id = showingId;
            response = await APIClient.updateShowing(showingData);
            if (response.success) {
                showNotification('Cập nhật suất chiếu thành công!', 'success');
            }
        } else {
            response = await APIClient.addShowing(showingData);
            if (response.success) {
                showNotification('Thêm suất chiếu thành công!', 'success');
            }
        }

        if (response.success) {
            closeModal();
            loadShowings();
            loadDashboard();
        } else {
            showNotification(response.message || 'Lỗi!', 'error');
        }
    } catch (error) {
        console.error('Error saving showing:', error);
        showNotification('Lỗi khi lưu suất chiếu!', 'error');
    }


async function deleteShowingConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa suất chiếu này?')) {
        try {
            const response = await APIClient.deleteShowing(id);
            if (response.success) {
                showNotification('Xóa suất chiếu thành công!', 'success');
                loadShowings();
                loadDashboard();
            } else {
                showNotification(response.message || 'Lỗi!', 'error');
            }
        } catch (error) {
            console.error('Error deleting showing:', error);
            showNotification('Lỗi khi xóa suất chiếu!', 'error');
        }
    }
}

// Setup Enter key submission for showing form
function setupFormEnterKeyForShowing() {
    const form = document.getElementById('showing-form');
    if (!form) return;
    
    // Get all input and select elements
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

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
    document.getElementById('showing-form').reset();
    document.getElementById('showing-form').dataset.showingId = '';
    document.getElementById('showing-modal').style.display = 'block';
}

async function editShowing(id) {
    try {
        const response = await APIClient.getShowings();
        
        if (!response.success) {
            console.error('Failed to load showing:', response.message);
            return;
        }

        const showings = response.data.showings || [];
        const showing = showings.find(s => s.id === id);
        
        if (!showing) return;

        document.getElementById('showing-movie').value = showing.movie_id;
        document.getElementById('showing-room').value = showing.room_number;
        document.getElementById('showing-seats').value = showing.total_seats;
        document.getElementById('showing-date').value = showing.showing_date;
        document.getElementById('showing-time').value = showing.showing_time;
        document.getElementById('showing-form').dataset.showingId = id;
        document.getElementById('showing-modal').style.display = 'block';
    } catch (error) {
        console.error('Error editing showing:', error);
    }
}

async function saveShowing(e) {
    e.preventDefault();

    const showingId = document.getElementById('showing-form').dataset.showingId;
    const showingData = {
        movie_id: parseInt(document.getElementById('showing-movie').value),
        room_number: parseInt(document.getElementById('showing-room').value) || 1,
        total_seats: parseInt(document.getElementById('showing-seats').value) || 100,
        showing_date: document.getElementById('showing-date').value,
        showing_time: document.getElementById('showing-time').value,
        price: 50000 // Default price, can be customized
    };

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

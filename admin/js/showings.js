// ===== SHOWINGS =====
function loadShowings() {
    const showings = db.getShowings() || [];
    const tbody = document.getElementById('showings-body');
    tbody.innerHTML = '';

    if (showings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>';
        return;
    }

    showings.forEach(showing => {
        const movie = db.getMovieById(showing.movieId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${showing.id}</td>
            <td>${movie?.title || 'N/A'}</td>
            <td>${showing.room}</td>
            <td>${showing.totalSeats} ghế</td>
            <td>${formatDate(showing.date)} ${showing.time}</td>
            <td>${showing.availableSeats}/${showing.totalSeats}</td>
            <td>
                <button class="action-btn edit" onclick="editShowing(${showing.id})">Sửa</button>
                <button class="action-btn delete" onclick="deleteShowingConfirm(${showing.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openShowingModal() {
    document.getElementById('showing-form').reset();
    document.getElementById('showing-form').dataset.showingId = '';
    document.getElementById('showing-modal').style.display = 'block';
}

function editShowing(id) {
    const showing = db.getShowingById(id);
    if (!showing) return;

    document.getElementById('showing-movie').value = showing.movieId;
    document.getElementById('showing-room').value = showing.room;
    document.getElementById('showing-seats').value = showing.totalSeats;
    document.getElementById('showing-date').value = showing.date;
    document.getElementById('showing-time').value = showing.time;
    document.getElementById('showing-form').dataset.showingId = id;
    document.getElementById('showing-modal').style.display = 'block';
}

function saveShowing(e) {
    e.preventDefault();

    const showingId = document.getElementById('showing-form').dataset.showingId;
    const showingData = {
        movieId: parseInt(document.getElementById('showing-movie').value),
        room: document.getElementById('showing-room').value,
        totalSeats: parseInt(document.getElementById('showing-seats').value),
        availableSeats: parseInt(document.getElementById('showing-seats').value),
        date: document.getElementById('showing-date').value,
        time: document.getElementById('showing-time').value
    };

    if (showingId) {
        db.updateShowing(parseInt(showingId), showingData);
        showNotification('Cập nhật suất chiếu thành công!', 'success');
    } else {
        db.addShowing(showingData);
        showNotification('Thêm suất chiếu thành công!', 'success');
    }

    closeModal();
    loadShowings();
    loadDashboard();
}

function deleteShowingConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa suất chiếu này?')) {
        db.deleteShowing(id);
        showNotification('Xóa suất chiếu thành công!', 'success');
        loadShowings();
        loadDashboard();
    }
}

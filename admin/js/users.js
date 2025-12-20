// ===== USERS =====
function loadUsers() {
    const users = db.getUsers() || [];
    const tbody = document.getElementById('users-body');
    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${formatDate(user.createdDate)}</td>
            <td>${user.bookings}</td>
            <td>
                <button class="action-btn view" onclick="viewUser(${user.id})">Xem</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewUser(id) {
    const user = db.getUsers().find(u => u.id === id);
    if (!user) return;

    alert(`Thông tin người dùng:
Tên: ${user.name}
Email: ${user.email}
Điện thoại: ${user.phone}
Ngày tạo: ${formatDate(user.createdDate)}
Số đơn vé: ${user.bookings}`);
}

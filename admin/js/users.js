// ===== USERS =====
async function loadUsers() {
    try {
        const response = await APIClient.getUsers();
        
        if (!response.success) {
            showNotification('Lỗi khi tải người dùng', 'error');
            return;
        }

        const users = response.data.users || [];
        const tbody = document.getElementById('users-body');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Không có người dùng</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            const createdDate = new Date(user.created_at).toLocaleDateString('vi-VN');
            
            row.innerHTML = `
                <td>#${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.full_name || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role === 'admin' ? 'Admin' : 'Khách Hàng'}</span></td>
                <td>${createdDate}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Lỗi: ' + error.message, 'error');
    }
}

function viewUser(id) {
    alert(`Chi tiết người dùng #${id} - Xem trong database`);
}

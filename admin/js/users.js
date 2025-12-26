// ===== USERS =====
async function loadUsers() {
    try {
        // Users list would come from database
        // For now, showing placeholder
        const tbody = document.getElementById('users-body');
        tbody.innerHTML = '';

        // TODO: Implement when users API endpoint is ready
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Users data will load from database</td></tr>';
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function viewUser(id) {
    alert(`Chi tiết người dùng #${id} - Xem trong database`);
}

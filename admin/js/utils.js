// ===== UTILITIES =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function getStatusLabel(status) {
    const labels = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Hủy',
        showing: 'Đang chiếu',
        upcoming: 'Sắp chiếu',
        ended: 'Kết thúc'
    };
    return labels[status] || status;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Modal management
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-close-btn')) {
        closeModal();
    }
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

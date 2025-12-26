/**
 * Custom Notification System
 * Replaces browser alerts with styled notifications
 */
class Notification {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }

    static success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    static error(message, duration = 3000) {
        return this.show(message, 'error', duration);
    }

    static warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    }

    static info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    static confirm(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'notification-modal';
        modal.innerHTML = `
            <div class="notification-modal-content">
                <p class="notification-modal-message">${message}</p>
                <div class="notification-modal-buttons">
                    <button class="btn-cancel">Hủy</button>
                    <button class="btn-confirm">Xác nhận</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const cancelBtn = modal.querySelector('.btn-cancel');
        const confirmBtn = modal.querySelector('.btn-confirm');
        
        const cleanup = () => modal.remove();
        
        cancelBtn.addEventListener('click', () => {
            cleanup();
            if (onCancel) onCancel();
        });
        
        confirmBtn.addEventListener('click', () => {
            cleanup();
            if (onConfirm) onConfirm();
        });
        
        return modal;
    }

    static getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
}

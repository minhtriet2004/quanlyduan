// ===== ADMIN PANEL MAIN INITIALIZATION =====
let currentAdmin = null;

// Check if admin is logged in
window.addEventListener('DOMContentLoaded', () => {
    checkAdminLogin();
    initializeDashboard();
    setupEventListeners();
});

function checkAdminLogin() {
    const adminSession = Storage.getAdmin();
    if (!adminSession) {
        window.location.href = 'login.html';
        return;
    }

    currentAdmin = adminSession;
    const adminNameEl = document.getElementById('admin-name');
    if (adminNameEl) {
        adminNameEl.textContent = currentAdmin.full_name || currentAdmin.username;
    }
}

function initializeDashboard() {
    loadDashboard();
    loadMovies();
    loadShowings();
    loadBookings();
    loadUsers();
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.id === 'logout') {
                e.preventDefault();
                logout();
                return;
            }

            const section = link.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });

    // Notification button
    const notificationBtn = document.querySelector('.notification');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', handleNotificationClick);
    }

    // Movie operations
    const addMovieBtn = document.getElementById('add-movie-btn');
    const movieForm = document.getElementById('movie-form');
    if (addMovieBtn) addMovieBtn.addEventListener('click', openMovieModal);
    if (movieForm) movieForm.addEventListener('submit', saveMovie);

    // Showing operations
    const addShowingBtn = document.getElementById('add-showing-btn');
    const showingForm = document.getElementById('showing-form');
    if (addShowingBtn) addShowingBtn.addEventListener('click', openShowingModal);
    if (showingForm) showingForm.addEventListener('submit', saveShowing);

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Filter bookings
    const statusFilter = document.getElementById('booking-status-filter');
    if (statusFilter) statusFilter.addEventListener('change', loadBookings);

    // Logout
    const logoutLink = document.getElementById('logout');
    if (logoutLink) logoutLink.addEventListener('click', logout);
}

// ===== SECTION NAVIGATION =====
function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');

        // Reload data for the section
        if (sectionId === 'dashboard') loadDashboard();
        else if (sectionId === 'movies') loadMovies();
        else if (sectionId === 'showings') loadShowings();
        else if (sectionId === 'bookings') loadBookings();
        else if (sectionId === 'users') loadUsers();
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
}

// ===== LOGOUT =====
function logout() {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
        Storage.clear();
        window.location.href = 'login.html';
    }
}

// ===== NOTIFICATION =====
function handleNotificationClick() {
    const badge = document.querySelector('.notification .badge');
    const notificationCount = badge ? parseInt(badge.textContent) : 0;
    
    if (notificationCount > 0) {
        // Nếu có thông báo, xóa badge
        if (badge) {
            badge.style.display = 'none';
        }
        Notification.success('Đã xem ' + notificationCount + ' thông báo mới');
    } else {
        // Nếu không có thông báo
        Notification.info('Bạn không có thông báo mới');
    }
}

// ===== ADMIN PANEL MAIN INITIALIZATION =====
console.log('✅ main.js loaded');

let currentAdmin = null;

// Check if admin is logged in
function initializeAdmin() {
    console.log('Initializing admin panel...');
    checkAdminLogin();
    initializeDashboard();
    setupEventListeners();
    console.log('Admin panel initialized');
}

console.log('Document ready state:', document.readyState);

// Use both DOMContentLoaded and setTimeout as fallback
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeAdmin);
} else {
    // DOM is already loaded
    console.log('DOM already loaded, running init with delay...');
    setTimeout(initializeAdmin, 100);
}

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
    // loadCinemas(); // Commented out - no cinemas section in UI
    loadBookings();
    loadUsers();
}

let eventListenersInitialized = false;

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Only setup once to avoid duplicate listeners
    if (eventListenersInitialized) {
        console.log('Event listeners already initialized, skipping...');
        return;
    }
    
    // Sidebar navigation - simpler version
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found', navLinks.length, 'nav links');
    
    navLinks.forEach((link, index) => {
        const section = link.getAttribute('data-section');
        console.log(`Nav link ${index}: ${section}`);
        
        link.addEventListener('click', function(e) {
            console.log('Nav link clicked:', section);
            e.preventDefault();
            
            if (link.id === 'logout') {
                logout();
                return;
            }

            if (section) {
                console.log('Calling switchSection with:', section);
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

    // Note: Modal close buttons are handled by event delegation in utils.js
    // to avoid duplicate listeners

    // Filter bookings
    const statusFilter = document.getElementById('booking-status-filter');
    if (statusFilter) statusFilter.addEventListener('change', loadBookings);

    // Logout
    const logoutLink = document.getElementById('logout');
    if (logoutLink) logoutLink.addEventListener('click', logout);
    
    eventListenersInitialized = true;
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
        showNotification('Đã xem ' + notificationCount + ' thông báo mới', 'success');
    } else {
        // Nếu không có thông báo
        showNotification('Bạn không có thông báo mới', 'info');
    }
}

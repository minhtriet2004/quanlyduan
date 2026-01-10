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
    loadCinemas();
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

    // Cinema operations
    const addCinemaBtn = document.getElementById('add-cinema-btn');
    const cinemaForm = document.getElementById('cinema-form');
    if (addCinemaBtn) addCinemaBtn.addEventListener('click', () => {
        currentCinemaId = null;
        document.getElementById('cinema-modal-title').textContent = 'Thêm Rạp';
        cinemaForm.reset();
        openModal(cinemasModal);
    });
    if (cinemaForm) cinemaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cinemaData = {
            name: document.getElementById('cinema-name').value,
            city: document.getElementById('cinema-city').value,
            address: document.getElementById('cinema-address').value,
            phone: document.getElementById('cinema-phone').value
        };
        try {
            const url = currentCinemaId 
                ? `${API_BASE_URL}/cinemas.php?id=${currentCinemaId}`
                : `${API_BASE_URL}/cinemas.php`;
            const method = currentCinemaId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cinemaData)
            });
            if (response.ok) {
                showNotification(currentCinemaId ? 'Cập nhật rạp thành công!' : 'Thêm rạp thành công!', 'success');
                closeModal(cinemasModal);
                loadCinemas();
            } else {
                showNotification('Lỗi khi lưu rạp', 'error');
            }
        } catch (error) {
            console.error('Error saving cinema:', error);
            showNotification('Lỗi khi lưu rạp', 'error');
        }
    });

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
        else if (sectionId === 'cinemas') loadCinemas();
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

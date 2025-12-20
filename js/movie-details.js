// DATA PHIM
const movies = {
    wicked2: {
        title: "WICKED: PHẦN 2",
        genre: "Nhạc kịch, Thần thoại",
        duration: 138,
        release: "21-11-2025",
        price: 75000,
        poster: "img/wicked.jpg"
    },
    longdienhuong: {
        title: "TRUY TÌM LONG DIÊN HƯƠNG",
        genre: "Hài",
        duration: 103,
        release: "14-11-2025",
        price: 75000,
        poster: "img/truytimlongdienhuong.jpg"
    },
    anhtraisayxe: {
        title: "ANH TRAI SAY XE",
        genre: "Hài",
        duration: 110,
        release: "21-11-2025",
        price: 75000,
        poster: "img/anhtraisayxe.jpg"
    },
    gdragon: {
        title: "G-DRAGON IN CINEMA",
        genre: "Tài liệu",
        duration: 103,
        release: "11-11-2025",
        price: 75000,
        poster: "img/gdragon.jpg"
    }
};


// Lấy tên phim từ URL
const urlParams = new URLSearchParams(window.location.search);
const movieKey = urlParams.get("movie");
const movie = movies[movieKey];

// Gán vào HTML
document.getElementById("poster").src = movie.poster;
document.getElementById("title").innerText = movie.title;
document.getElementById("genre").innerText = movie.genre;
document.getElementById("duration").innerText = movie.duration;
document.getElementById("release").innerText = movie.release;


// Hàm chuyển sang chọn ghế
function nextStep() {
    const qty = document.getElementById("quantity").value;

    // Lưu dữ liệu vào localStorage để trang chọn ghế dùng được
    localStorage.setItem("selectedMovie", movieKey);
    localStorage.setItem("ticketQuantity", qty);

    // Chuyển sang trang chọn ghế
    window.location.href = "choose-seat.html";
}

// ===== TÍNH TIỀN =====
const quantitySelect = document.getElementById("quantity");
const totalPriceEl = document.getElementById("totalPrice");

function updateTotalPrice() {
    const qty = parseInt(quantitySelect.value);
    const total = qty * movie.price;
    totalPriceEl.innerText = total.toLocaleString("vi-VN");
}

// mặc định 1 vé
updateTotalPrice();

// khi đổi số lượng
quantitySelect.addEventListener("change", updateTotalPrice);
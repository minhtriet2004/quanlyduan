// 1. LẤY DỮ LIỆU TỪ LOCALSTORAGE
const movieKey = localStorage.getItem("selectedMovie");
const ticketQty = parseInt(localStorage.getItem("ticketQuantity")) || 1;

// Dữ liệu phim giống movie-details.html
const movies = {
    wicked2: { title: "WICKED: PHẦN 2"},
    longdienhuong: { title: "TRUY TÌM LONG DIÊN HƯƠNG"},
    anhtraisayxe: { title: "ANH TRAI SAY XE"},
    gdragon: { title: "G-DRAGON IN CINEMA"},    
};


// 2. HIỂN THỊ TÊN PHIM LÊN TRANG
window.addEventListener("DOMContentLoaded", () => {
    const movieNameTag = document.getElementById("movieName");

    if (movieKey && movies[movieKey]) {
        movieNameTag.innerText = `${movies[movieKey].title} `;
    } else {
        movieNameTag.innerText = "Không tìm thấy phim!";
    }

    updateSelectedCount();
});

// 3. LOGIC CHỌN GHẾ
const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");

    // Giới hạn số ghế được chọn = số vé
    if (selectedSeats.length > ticketQty) {
        selectedSeats[selectedSeats.length - 1].classList.remove("selected");
    }

    const seatsCount = document.querySelectorAll(".row .seat.selected").length;
    count.innerText = seatsCount;

    // Lấy giá vé theo phim
    const price = movies[movieKey] ? movies[movieKey].price : 10;

    total.innerText = seatsCount * price;
}

container.addEventListener("click", (e) => {
    if (
        e.target.classList.contains("seat") &&
        !e.target.classList.contains("occupied")
    ) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});

// LẤY POSTER PHIM từ movie-details (đã có sẵn trong file đó)
const moviePosters = {
    wicked2: "img/wicked.jpg",
    longdienhuong: "img/truytimlongdienhuong.jpg",
    anhtraisayxe: "img/anhtraisayxe.jpg",
    gdragon: "img/gdragon.jpg"
};

// SET BACKGROUND THEO PHIM
if (movieKey && moviePosters[movieKey]) {
    document.body.style.backgroundImage = `url('${moviePosters[movieKey]}')`;
}

// Nút xác nhận
document.getElementById("confirmBtn").addEventListener("click", () => {
    const seatCount = document.getElementById("count").innerText;
    if (seatCount == 0) {
        alert("Bạn chưa chọn ghế nào!");
        return;
    }
    alert("ĐẶT VÉ THÀNH CÔNG!\nBạn đã đặt: " + seatCount + " ghế.");
});

// Nút xóa lựa chọn
document.getElementById("clearBtn").addEventListener("click", () => {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    selectedSeats.forEach(seat => seat.classList.remove("selected"));
    document.getElementById("count").innerText = "0";
    document.getElementById("total").innerText = "0";
});



// 1. LẤY DỮ LIỆU TỪ LOCALSTORAGE
const movieKey = localStorage.getItem("selectedMovie");
const ticketQty = parseInt(localStorage.getItem("ticketQuantity")) || 1;

// Dữ liệu phim giống movie-details.html
const movies = {
    wicked2: { title: "WICKED: PHẦN 2", price: 12000 },
    longdienhuong: { title: "TRUY TÌM LONG DIÊN HƯƠNG", price: 10000 },
    anhtraisayxe: { title: "ANH TRAI SAY XE", price: 8000 },
    gdragon: { title: "G-DRAGON IN CINEMA", price: 150000 },    
};


// 2. HIỂN THỊ TÊN PHIM LÊN TRANG
window.addEventListener("DOMContentLoaded", () => {
    const movieNameTag = document.getElementById("movieName");

    if (movieKey && movies[movieKey]) {
        movieNameTag.innerText = `${movies[movieKey].title} - Giá vé ${movies[movieKey].price}VND`;
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

// Smooth scrolling for navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href.startsWith("#")) {
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }

    // Update active state
    document.querySelectorAll(".nav-link").forEach((navLink) => {
      navLink.classList.remove("active")
    })
    this.classList.add("active")
  })
})

// Buy button click handler
document.querySelectorAll(".btn-buy").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.stopPropagation()
    const movieCard = this.closest(".movie-card")
    const movieTitle = movieCard.querySelector(".movie-title").textContent
    alert(`Đang chuyển đến trang đặt vé cho phim: ${movieTitle}`)
  })
})

// Movie card click handler
document.querySelectorAll(".movie-card").forEach((card) => {
  card.addEventListener("click", function () {
    const movieTitle = this.querySelector(".movie-title").textContent
    alert(`Chi tiết phim: ${movieTitle}`)
  })
})

// Login button handler
document.querySelector(".btn-login").addEventListener("click", () => {
  alert("Chức năng đăng nhập đang được phát triển")
})

// Hero button handler
document.querySelector(".btn-hero").addEventListener("click", () => {
  const nowShowingSection = document.getElementById("now-showing")
  if (nowShowingSection) {
    nowShowingSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
})

// Intersection Observer for fade-in animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Apply animation to movie cards
document.querySelectorAll(".movie-card").forEach((card, index) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
  observer.observe(card)
})

// Mobile menu toggle (for future enhancement)
window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    console.log("[v0] Mobile view detected")
  }
})

// Scroll to top on page load
window.addEventListener("load", () => {
  window.scrollTo(0, 0)
})

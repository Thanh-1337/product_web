// Hàm đọc file HTML con và dán vào ô trống
function loadComponent(elementId, filePath) {
  const container = document.getElementById(elementId);
  if (!container) return; // Nếu trang đó không có ô trống thì bỏ qua

  // 1. Tìm và đọc file trong thư mục components/
  fetch(filePath)
    //response là phản hồi/câu trả lời của request
    .then((response) => {
      //kiểm tra phản hồi của trình duyệt là gì
      // Nếu !response.ok==true thì sai đường dẫn or không tìm thấy file
      if (!response.ok) throw new Error("Không thấy file: " + filePath);
      return response.text(); // Chuyển file nhận được thành dạng chuỗi HTML
    })
    .then((html) => {
      // 2. Dán chuỗi HTML đó vào trong ô trống <div>
      container.innerHTML = html;

      // 3. Tự động sáng đèn (active) menu của trang đang xem
      highlightActiveNav();
    })
    .catch((error) => console.error("Lỗi nạp component:", error));
}

// Hàm tự động active link menu dựa vào tên file trên đường dẫn URL
function highlightActiveNav() {
  // Lấy tên trang hiện tại (ví dụ: 'about.html')
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  // Tìm tất cả các thẻ <a> trong menu
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

// Chạy hàm khi khung trang HTML đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-placeholder", "./partials/top.html");
  loadComponent("footer-placeholder", "./partials/bot.html");
});

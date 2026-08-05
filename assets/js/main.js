// Hàm đọc file HTML con và dán vào ô trống
function loadComponent(elementId, filePath) {
  const container = document.getElementById(elementId);
  if (!container) return; // Nếu trang đó không có ô trống thì bỏ qua

  // 1. Tìm và đọc file trong thư mục components/
  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error("Không thấy file: " + filePath);
      return response.text(); // Chuyển file nhận được thành dạng chuỗi HTML
    })
    .then((html) => {
      // 2. Dán chuỗi HTML đó vào trong ô trống <div>
      container.innerHTML = html;

      // 3. Tự động sáng đèn (active) menu của trang đang xem
      highlightActiveNav();

      // 4. Nếu vừa nạp Header xong -> Tiến hành kiểm tra và hiển thị tài khoản/avatar
      if (elementId === "header-placeholder") {
        checkUserLogin();
      }
    })
    .catch((error) => console.error("Lỗi nạp component:", error));
}

// Hàm tự động active link menu dựa vào tên file trên đường dẫn URL
function highlightActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

// ==========================================
// HÀM KIỂM TRA ĐĂNG NHẬP & HIỂN THỊ TRÊN HEADER
// ==========================================
function checkUserLogin() {
  fetch("/api/current_user")
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        const user = data.user;

        // Tìm tất cả nút đăng nhập trong top.html vừa nạp
        const accountLinks = document.querySelectorAll(
          'a[href="/account/login"], .account-link',
        );

        accountLinks.forEach((link) => {
          const container = link.parentElement;
          if (container) {
            container.style.position = "relative";
          }

          // Hiển thị Avatar (Google) hoặc Icon Mặc định + Tên
          const userAvatar = user.avatar
            ? `<img src="${user.avatar}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 5px;" />`
            : `<i class="fa-solid fa-user me-4"></i>`;

          link.innerHTML = `${userAvatar} <span class="d-none d-md-inline">${user.name || "Tài khoản"}</span>`;
          link.setAttribute("href", "javascript:void(0)");

          // Xóa dropdown cũ nếu trùng
          const oldMenu = container.querySelector(".user-dropdown-menu");
          if (oldMenu) oldMenu.remove();

          // Tạo Menu Dropdown Đăng xuất
          const dropdownMenu = document.createElement("div");
          dropdownMenu.className = "user-dropdown-menu shadow-sm border";
          dropdownMenu.style.cssText = `
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  min-width: 170px;
  border-radius: 8px;
  padding: 6px 0;
  z-index: 9999; /* 👈 Sửa hoặc thêm dòng này lên 9999 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

          dropdownMenu.innerHTML = `
            <div style="padding: 8px 14px; border-bottom: 1px solid #f1f1f1; font-weight: 600; font-size: 13px; color: #333;">
              <small class="text-muted d-block" style="font-size: 10px;">Đã đăng nhập</small>
              ${user.name || user.email}
            </div>
            <a href="/account/logout" style="display: flex; align-items: center; padding: 8px 14px; color: #dc3545; text-decoration: none; font-size: 13px; font-weight: 500;">
              <i class="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất
            </a>
          `;

          container.appendChild(dropdownMenu);

          // Lắng nghe sự kiện click Bật/Tắt Menu
          link.onclick = (e) => {
            e.stopPropagation();
            const isVisible = dropdownMenu.style.display === "block";
            document
              .querySelectorAll(".user-dropdown-menu")
              .forEach((m) => (m.style.display = "none"));
            dropdownMenu.style.display = isVisible ? "none" : "block";
          };
        });
      }
    })
    .catch((err) => console.error("Lỗi kiểm tra đăng nhập:", err));
}

// Đóng dropdown khi click ra ngoài màn hình
document.addEventListener("click", () => {
  document
    .querySelectorAll(".user-dropdown-menu")
    .forEach((m) => (m.style.display = "none"));
});

// Chạy hàm khi khung trang HTML đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-placeholder", "../../partials/top.html");
  loadComponent("footer-placeholder", "../../partials/bot.html");
});

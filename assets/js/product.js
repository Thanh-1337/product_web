let products = [];
// Mảng giỏ hàng
let cart = [];
// assets/js/product.js

async function loadProducts() {
  try {
    // Gọi đến API từ server Node.js để lấy danh sách sản phẩm từ Database
    const response = await fetch("http://localhost:3000/api/products");
    products = await response.json();

    console.log("Dữ liệu từ phpMyAdmin qua Node.js:", products);

    // 1. Render banner Carousel nổi bật ở đầu trang
    renderHeroSlide(products);

    // 2. Render danh sách các thẻ sản phẩm chính
    renderProducts(products);

    // 3. Render danh sách các bài viết tin tức ngắn trên trang chủ
    renderHomeNews(products);

    // 4. Render bài viết tin tức chi tiết (bao gồm bài viết HOT và danh sách bài viết phụ bên phải)
    renderNews(products);

    // 5. Render các mục sản phẩm nổi bật trong menu thả xuống (Dropdown)
    renderDropdown(products);
  } catch (error) {
    console.log("Lỗi lấy dữ liệu:", error);
  }
}

// DOM Elements
const productGrid = document.getElementById("productGrid");

// Bắt sự kiện Lọc & Tìm kiếm
document.addEventListener("input", (e) => {
  if (e.target.id === "searchInput") {
    filterProducts();
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "filterSelect") {
    filterProducts();
  }
});
function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const filterValue = filterSelect ? filterSelect.value : "all";

  const filteredProducts = products.filter((p) => {
    const { id, name, category } = p;
    const matchesSearch = name.toLowerCase().includes(searchTerm);
    const matchesFilter = filterValue === "all" || category === filterValue;
    return matchesSearch && matchesFilter;
  });

  renderProducts(filteredProducts);
}

// Lọc sản phẩm theo Tab nút bấm
function filterByCategory() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.value;
      const filteredProducts = products.filter(
        (p) => filterValue === "all" || p.category === filterValue,
      );
      renderProducts(filteredProducts);
    });
  });
}
filterByCategory();
//Hàm Render ra carosuel
function renderHeroSlide(productsList) {
  const carouseHero = document.querySelector(
    "#techStoreCarousel .carousel-inner",
  );
  if (!carouseHero) return;
  const heroSlide = productsList.slice(9, 11);
  carouseHero.innerHTML = heroSlide
    .map((product, index) => {
      const { id, name, image, price } = product;
      const isActive = index === 0 ? "active" : "";
      return `<div class="carousel-item ${isActive}">
          <div class="row align-items-center g-0">
            
            <!-- CỘT TRÁI: Chữ & Nút bấm -->
            <div class="col-lg-6 p-4 p-md-5">
              <span class="badge bg-danger text-white fw-bold mb-3 px-3 py-2 rounded-pill text-uppercase">
                Công Nghệ Cho Tương Lai
              </span>
              <h2 class="display-6 fw-bold text-dark mb-3">${name}</h2>
              <p class="text-secondary mb-4">
                MewCar / TechStore không ngừng nỗ lực mang đến các sản phẩm công nghệ mới nhất. Trải nghiệm ngay hôm nay!
              </p>
              <div class="d-flex align-items-center gap-3">
                
                <button class="btn btn-danger fw-bold rounded-pill px-4 shadow-sm" onclick="addToCart(${id})">
                  Đến cửa hàng >
                </button>
              </div>
            </div>

            <!-- CỘT PHẢI: Khối màu cam + Ảnh sản phẩm nổi bật -->
            <div class="col-lg-6 position-relative d-flex align-items-center justify-content-center p-4" style="min-height: 380px;">
              
              <!-- Nền cam bo góc đằng sau -->
              <div 
                class="rounded-5 position-absolute"
                style="
                  width: 80%; 
                  height: 80%; 
                  background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%); 
                  z-index: 1;
                  border-radius: 30px;
                ">
              </div>

              <!-- Ảnh sản phẩm đè lên trên (dùng biến ${image}) -->
              <div class="position-relative text-center w-100" style="z-index: 2;">
                <img 
                  src="${image}" 
                  alt="${name}" 
                  class="img-fluid" 
                  style="
                    max-height: 320px; 
                    object-fit: contain; 
                    filter: drop-shadow(0 15px 15px rgba(0,0,0,0.25));
                  "
                />
              </div>

            </div>

          </div>
        </div>`;
    })
    .join("");
}
// Render danh sách sản phẩm ra màn hình
function renderProducts(productsList) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  if (productsList.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #718096; padding: 40px 0;">Không tìm thấy sản phẩm phù hợp.</p>`;
    return;
  }
  const topProducts = productsList.slice(0, 6);
  topProducts.forEach((product) => {
    const { id, image, name, category, price } = product;
    const productCard = document.createElement("div");
    productCard.className = "col-12 col-sm-6 col-lg-4";
    productCard.innerHTML = `
      <div class="product-card card h-100 p-3 shadow-sm">
        ${id === 1 ? '<span class="badge bg-danger position-absolute top-0 start-0 m-2">Bán Chạy</span>' : ""}
        <div onclick="openQuickView(${id})" class="text-center">
          <img src="${image}" style="cursor: pointer; height: 180px; object-fit: contain;" alt="${name}" class="product-image card-img-top p-2" />
        </div>
        <div class="product-info card-body d-flex flex-column justify-content-between p-0 mt-3">
          <div>
            <span class="product-category text-uppercase text-muted fs-7">${category}</span>
            <h5 class="product-name fw-bold mt-1" style="cursor: pointer;" onclick="openQuickView(${id})">${name}</h5>
          </div>
          <div>
            <p class="product-price fs-5 fw-bold text-danger my-2">${price.toLocaleString("vi-VN")} đ</p>
            <button class="btn btn-primary w-100 fw-bold" onclick="addToCart(${id})">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
}
function renderHomeNews(productsList) {
  const newContainer = document.querySelector("#homeNewsGrid");
  if (!newContainer) return;
  const newArticles = productsList.slice(8, 11);
  newContainer.innerHTML = newArticles
    .map((product) => {
      const { name, image, category } = product;
      return `<div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
            
            <!-- Hình ảnh bài viết -->
            <div class="position-relative overflow-hidden" style="height: 200px;">
              <img 
                src="${image}" 
                class="card-img-top w-100 h-100 object-fit-cover" 
                alt="${name}"
                style="transition: transform 0.3s ease;"
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              />
              <span class="badge bg-primary position-absolute top-0 start-0 m-3 rounded-pill text-uppercase fs-8">
                ${category}
              </span>
            </div>

            <!-- Nội dung bài viết -->
            <div class="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <small class="text-muted d-block mb-2">
                  <i class="fa-regular fa-calendar me-1"></i> 30/07/2026
                </small>
                <h5 class="card-title fw-bold text-dark fs-6 mb-3 lh-base">
                  <a href="news.html" class="text-decoration-none text-dark hover-primary">
                    Đánh Giá Chi Tiết ${name}: Lựa Chọn Đáng Tiền Nhất Phân Khúc
                  </a>
                </h5>
                <p class="card-text text-secondary small line-clamp-3 mb-3">
                  Khám phá ngay tính năng vượt trội, thiết kế hiện đại cùng hiệu năng mạnh mẽ của ${name} trong bài đánh giá chi tiết tuần này...
                </p>
              </div>

              <!-- Link Đọc thêm -->
              <div class="pt-2 border-top">
                <a href="news.html" class="text-primary fw-bold text-decoration-none small">
                  Đọc tiếp <i class="fa-solid fa-chevron-right ms-1 fs-8"></i>
                </a>
              </div>
            </div>

          </div>
        </div>`;
    })
    .join("");
}
//Hàm render ra Tin Tức
function renderNews(products) {
  const aboutRender = document.querySelector(".about-render");
  if (!aboutRender) return;
  const firtSlide = products[3];
  const mainSlide = products.slice(0, 3);
  const div = document.createElement("div");
  div.className = "row g-4";
  div.innerHTML = `
  <!-- Bài viết 1 (Nổi bật) -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <img
              src="${firtSlide.image}"
              class="card-img-top"
              alt="${firtSlide.name}"
              style="height: 320px; object-fit: cover"
            />
            <div class="card-body p-4">
              <span class="badge bg-danger mb-2">HOT</span>
              <span class="text-muted small ms-2"
                ><i class="fa-regular fa-calendar me-1"></i>28/07/2026</span
              >
              <h3 class="card-title fw-bold mt-2">
                Đánh Giá Chi Tiết ${firtSlide.name}: Sức Mạnh Vượt Trội Cho Dân Văn
                Phòng
              </h3>
              <p class="card-text text-secondary">
                Với con chip M3 tiến trình 3nm, MacBook Air mới không chỉ mang
                lại hiệu năng ấn tượng mà còn tối ưu thời lượng pin lên đến 18
                tiếng liên tục...
              </p>
              <a href="#" class="btn btn-outline-primary rounded-pill fw-bold"
                >Đọc tiếp <i class="fa-solid fa-arrow-right ms-1"></i
              ></a>
            </div>
          </div>
        </div>

        <!-- Sidebar Bài viết phụ bên phải -->
        <div class="col-lg-4">
          <div class="d-flex flex-column gap-3">
          ${mainSlide
            .map(
              ({ name, image }) =>
                `<div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div class="row g-0 align-items-center">
                  <div class="col-4">
                    <img
                      src="${image}"
                      class="img-fluid h-100"
                      alt="${name}"
                      style="object-fit: cover;"
                    />
                  </div>
                  <div class="col-8">
                    <div class="card-body p-3">
                      <span class="text-muted fs-8">
                        <i class="fa-regular fa-clock me-1"></i>2 ngày trước
                      </span>
                      <h6 class="fw-bold mb-1 fs-7">
                        Top 5 Mẹo Chụp Ảnh Đẹp Như Nhiếp Ảnh Gia Với ${name}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>`,
            )
            .join("")}
          </div>
        </div>`;
  aboutRender.innerHTML = "";
  aboutRender.appendChild(div);
}
function renderDropdown(products) {
  const dropdownMenu = document.getElementById("productDropdownMenu");
  if (!dropdownMenu) return;
  dropdownMenu.innerHTML = "";
  const header = document.createElement("li");
  header.innerHTML = `<h6 class="dropdown-header text-uppercase fw-bold text-primary">Danh mục nổi bật</h6>`;
  dropdownMenu.appendChild(header);
  products.slice(0, 4).forEach((product) => {
    const dropdown = document.createElement("li");
    dropdown.innerHTML = ` <a class="dropdown-item d-flex align-items-center justify-content-between py-2 px-3 fw-medium" href="/product/${product.id}">
        <span class="pe-2">
          <i class="fa-solid fa-angle-right me-2 text-primary fs-8"></i>
          ${product.name}
        </span>
        <span class="badge bg-secondary-subtle text-secondary rounded-pill fs-8">
          ${product.price.toLocaleString("vi-VN")} đ
        </span>
      </a>
    `;
    dropdownMenu.appendChild(dropdown);
  });
}
// Mở Quick View Modal
function openQuickView(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let modalElement = document.getElementById("quickViewModal");
  if (!modalElement) {
    modalElement = document.createElement("div");
    modalElement.id = "quickViewModal";
    modalElement.className = "modal fade";
    modalElement.tabIndex = -1;
    document.body.appendChild(modalElement);
  }

  modalElement.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
        <div class="modal-header border-0 pb-0">
          <span class="badge bg-primary-subtle text-primary fw-bold text-uppercase px-3 py-2 rounded-pill">
            ${product.category}
          </span>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4 pt-2">
          <div class="row g-4 align-items-center">
            <div class="col-md-5 text-center">
              <div class="p-3 bg-light rounded-4 d-flex align-items-center justify-content-center" style="min-height: 240px;">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded" style="max-height: 220px; object-fit: contain;">
              </div>
            </div>
            <div class="col-md-7">
              <h4 class="fw-bold text-dark mb-2">${product.name}</h4>
              <div class="fs-3 fw-bold text-danger mb-4">${product.price.toLocaleString("vi-VN")} đ</div>
              <div class="d-grid gap-2 d-md-flex">
                <button class="btn btn-danger btn-lg fw-bold flex-grow-1 rounded-3" onclick="addToCart(${product.id})">
                  Thêm vào giỏ hàng
                </button>
                <button class="btn btn-outline-secondary btn-lg rounded-3" data-bs-dismiss="modal">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tái sử dụng Instance Modal duy nhất
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  bsModal.show();
}
// Thêm vào giỏ hàng
function addToCart(productId) {
  const itemInCart = cart.find((p) => p.id === productId);

  if (itemInCart) {
    itemInCart.quantity += 1;
  } else {
    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct) {
      cart.push({ ...targetProduct, quantity: 1 });
    }
  }

  updateCartUI();
}

// Đổi số lượng món
function changeQuantity(productId, amount) {
  const item = cart.find((p) => p.id === productId);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCartUI();
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(productId) {
  cart = cart.filter((p) => p.id !== productId);
  updateCartUI();
}

// Cập nhật tất cả giao diện Giỏ hàng
// Hàm Cập nhật giao diện Giỏ hàng dạng Offcanvas Tối (Dark Theme)
function updateCartUI() {
  const cartTableBody = document.getElementById("cartTableBody");
  const cartTotal = document.getElementById("cartTotal");
  const cartBadge = document.getElementById("cartBadge");

  // A. Render danh sách thẻ sản phẩm
  if (cartTableBody) {
    if (cart.length === 0) {
      cartTableBody.innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="fa-solid fa-cart-flatbed fs-1 mb-3"></i>
          <p class="m-0">Giỏ hàng của bạn đang trống.</p>
        </div>`;
    } else {
      cartTableBody.innerHTML = cart
        .map(
          (p) => `
          <div class="cart-item d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary-subtle">
            <!-- 1. Hình ảnh sản phẩm -->
            <div class="cart-item-img p-2 rounded-3 bg-dark border border-secondary text-center" style="width: 70px; height: 70px; flex-shrink: 0;">
              <img src="${p.image}" alt="${p.name}" class="img-fluid h-100" style="object-fit: contain;">
            </div>

            <!-- 2. Thông tin tên, giá, số lượng -->
            <div class="cart-item-info flex-grow-1">
              <h6 class="fw-bold text-white mb-1 fs-6 lh-sm">${p.name}</h6>
              <div class="text-danger fw-bold fs-7 mb-2">${p.price.toLocaleString("vi-VN")} đ</div>
              
              <!-- Bộ nút Tăng / Giảm số lượng -->
              <div class="d-flex align-items-center gap-2">
                <button 
                  class="btn btn-sm btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center" 
                  style="width: 24px; height: 24px;" 
                  onclick="changeQuantity(${p.id}, -1)">
                  <i class="fa-solid fa-minus fs-8"></i>
                </button>
                <span class="text-white fw-bold px-1">${p.quantity}</span>
                <button 
                  class="btn btn-sm btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center" 
                  style="width: 24px; height: 24px;" 
                  onclick="changeQuantity(${p.id}, 1)">
                  <i class="fa-solid fa-plus fs-8"></i>
                </button>
              </div>
            </div>

            <!-- 3. Nút Xóa -->
            <button 
              class="btn btn-link text-muted p-0 border-0 align-self-start mt-1" 
              onclick="removeFromCart(${p.id})"
              title="Xóa sản phẩm">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `,
        )
        .join("");
    }
  }

  // B. Cập nhật Badge số lượng trên Header
  const totalBadge = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.innerText = totalBadge;

  // C. Cập nhật Tổng tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  if (cartTotal)
    cartTotal.innerText = totalPrice.toLocaleString("vi-VN") + " đ";
}

// Hàm xử lý nút Thanh toán ngay
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }
  alert(
    "Cảm ơn bạn đã đặt hàng! Tổng tiền: " +
      document.getElementById("cartTotal").innerText,
  );
  cart = [];
  updateCartUI();

  // Đóng Offcanvas
  const cartOffcanvasEl = document.getElementById("cartOffcanvas");
  const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvasEl);
  if (bsOffcanvas) bsOffcanvas.hide();
}
// Khởi chạy
if (productGrid) {
  productGrid.innerHTML =
    "<p style='text-align:center;'>Đang tải sản phẩm...</p>";
}
document.addEventListener("DOMContentLoaded", () => {
  filterByCategory();
  if (productGrid) {
    productGrid.innerHTML =
      "<p class='text-center py-4 col-12'>Đang tải sản phẩm...</p>";
  }
  loadProducts();
});

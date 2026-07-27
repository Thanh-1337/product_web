// 1. MẢNG DỮ LIỆU SẢN PHẨM (Giá đã đổi thành SỐ để tính toán đơn giản)
const products = [
  {
    id: 1,
    name: "Laptop Asus Zenbook 14 OLED",
    category: "laptop",
    price: 24990000,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRiTW5NdObcAtYhs9BRIH9TW3NPoDV2hFsZE4OJ-qwaBJR2bdGz44kHEDdOazNuVVQfuJ8rIq6iOf7JUUzQlM5jGhaN6vlz0JuVMyehCSMBkmI&usqp=CAc",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    category: "phone",
    price: 29490000,
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Bàn phím cơ Không dây Keychron K2",
    category: "accessory",
    price: 1850000,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "MacBook Air M3 (2024)",
    category: "laptop",
    price: 27950000,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Điện thoại Samsung Galaxy S24 Ultra",
    category: "phone",
    price: 26190000,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Tai nghe Sony WH-1000XM5 Chống ồn",
    category: "accessory",
    price: 6490000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
];

// Mảng giỏ hàng
let cart = [];

// DOM Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

// Giả lập lấy dữ liệu từ Server
function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
}

// Bắt sự kiện Lọc & Tìm kiếm
if (searchInput) searchInput.addEventListener("input", filterProducts);
if (filterSelect) filterSelect.addEventListener("change", filterProducts);

function filterProducts() {
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const filterValue = filterSelect ? filterSelect.value : "all";

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesFilter = filterValue === "all" || p.category === filterValue;
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

// Render danh sách sản phẩm ra màn hình
function renderProducts(productsList) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  if (productsList.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #718096; padding: 40px 0;">Không tìm thấy sản phẩm phù hợp.</p>`;
    return;
  }

  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-12 col-sm-6 col-lg-4";
    productCard.innerHTML = `
      <div class="product-card card h-100 p-3 shadow-sm">
        ${product.id === 1 ? '<span class="badge bg-danger position-absolute top-0 start-0 m-2">Bán Chạy</span>' : ""}
        <div onclick="openQuickView(${product.id})" class="text-center">
          <img src="${product.image}" style="cursor: pointer; height: 180px; object-fit: contain;" alt="${product.name}" class="product-image card-img-top p-2" />
        </div>
        <div class="product-info card-body d-flex flex-column justify-content-between p-0 mt-3">
          <div>
            <span class="product-category text-uppercase text-muted fs-7">${product.category}</span>
            <h5 class="product-name fw-bold mt-1" style="cursor: pointer;" onclick="openQuickView(${product.id})">${product.name}</h5>
          </div>
          <div>
            <p class="product-price fs-5 fw-bold text-danger my-2">${product.price.toLocaleString("vi-VN")} đ</p>
            <button class="btn btn-primary w-100 fw-bold" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(productCard);
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
// Hàm xử lý khi bấm nút Thanh toán
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }
  alert(
    "Cảm ơn bạn đã đặt hàng! Tổng tiền thanh toán là: " +
      document.getElementById("cartTotal").innerText,
  );
  cart = []; // Xóa sạch giỏ hàng sau khi thanh toán
  updateCartUI(); // Cập nhật lại giao diện

  // Đóng Modal
  const modalElement = document.getElementById("modalId");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) modalInstance.hide();
}
// Khởi chạy
if (productGrid) {
  productGrid.innerHTML =
    "<p style='text-align:center;'>Đang tải sản phẩm...</p>";
}

fetchProducts().then((data) => {
  renderProducts(data);
});

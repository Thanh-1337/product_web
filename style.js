const products = [
  {
    id: 1,
    name: "Laptop Asus Zenbook 14 OLED",
    category: "laptop",
    price: "24.990.000 đ",
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRiTW5NdObcAtYhs9BRIH9TW3NPoDV2hFsZE4OJ-qwaBJR2bdGz44kHEDdOazNuVVQfuJ8rIq6iOf7JUUzQlM5jGhaN6vlz0JuVMyehCSMBkmI&usqp=CAc",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    category: "phone",
    price: "29.490.000 đ",
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Bàn phím cơ Không dây Keychron K2",
    category: "accessory",
    price: "1.850.000 đ",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "MacBook Air M3 (2024)",
    category: "laptop",
    price: "27.950.000 đ",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Điện thoại Samsung Galaxy S24 Ultra",
    category: "phone",
    price: "26.190.000 đ",
    priceRaw: 26190000,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Tai nghe Sony WH-1000XM5 Chống ồn",
    category: "accessory",
    price: "6.490.000 đ",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
];
// Lấy các phần tử DOM từ HTML
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
// Thêm sự kiện input và change cho ô tìm kiếm và bộ lọc
searchInput.addEventListener("input", filterProducts);
filterSelect.addEventListener("change", filterProducts);
// Hàm xử lý tìm kiếm và lọc sản phẩm
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filterValue = filterSelect.value;
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesFilter =
      filterValue === "all" || product.category === filterValue;
    return matchesSearch && matchesFilter;
  });
  renderProducts(filteredProducts);
}
//Hàm hiển thị sản phẩm khi nhấn button
function filterByCategory() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.value;
      const filteredProducts = products.filter((product) => {
        const matchesFilter =
          filterValue === "all" || product.category === filterValue;
        return matchesFilter;
      });
      renderProducts(filteredProducts);
    });
  });
}
filterByCategory();
// Hàm render sản phẩm ra màn hình
function renderProducts(productsList) {
  productGrid.innerHTML = "";
  if (productsList.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #718096; padding: 40px 0;">Không tìm thấy sản phẩm phù hợp.</p>`;
    return;
  }
  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h2 class="product-name">${product.name}</h2>
      <p class="product-price">${product.price}</p>
      <button class="btn-add" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
}
// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  alert(`Đã thêm vào giỏ hàng: ${product.name}`);
}
renderProducts(products);

document.addEventListener("DOMContentLoaded", async () => {
  const pathSegments = window.location.pathname.split("/"); //Cắt đường phần ở / /product/5-> product,5
  const productId = pathSegments[pathSegments.length - 1];
  if (!productId || isNaN(productId)) {
    console.error("ID sản phẩm không hợp lệ!");
    return;
  }
  try {
    const respone = await fetch(`/api/product/${productId}`);
    const data = await respone.json();
    if (data.success) {
      const product = data.product;
      if (document.getElementById("product-name")) {
        document.getElementById("product-name").innerText = product.name;
      }
      if (document.getElementById("product-price")) {
        document.getElementById("product-price").innerText =
          `${product.price.toLocaleString("vi-VN")} đ`;
      }
      if (document.getElementById("product-img")) {
        document.getElementById("product-img").src =
          product.image || "/assets/images/default-product.png";
      }
      if (document.getElementById("product-desc")) {
        document.getElementById("product-desc").innerText =
          product.description || "Chưa có mô tả cho sản phẩm này.";
      }
      const btnAddToCart = document.getElementById("btn-add-to-cart");
      if (btnAddToCart) {
        btnAddToCart.setAttribute("onclick", `addToCart(${product.id})`);
      }
    } else {
      alert("Không tìm thấy sản phẩm!");
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin sản phẩm:", error);
  }
});

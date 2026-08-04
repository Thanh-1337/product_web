// 1. Khai báo các thư viện hỗ trợ
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();
// Middleware
app.use(cors());
app.use(express.static(__dirname));

// 2. Kết nối tới phpMyAdmin (MySQL)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Mặc định XAMPP để trống
  database: "techstore", // Tên database của bạn
});
db.connect((err) => {
  if (err) console.log("Lỗi kêt nối MySQL:", err);
  else console.log("Đã kết nối thành công tới phpMyadmin");
});
// 3. Tạo một "Đường dẫn API" (Endpoint) để Frontend gọi vào
app.get("/api/products", (req, res) => {
  // Khi Frontend truy cập /api/products,Backend sẽ chạy câu lệnh SQL này:
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    // Gửi mảng dữ liệu sản phẩm dưới dạng JSON về cho Frontend
    res.json(results);
  });
});
const webRoutes = require("./src/routes/web");
app.use("/", webRoutes);

// 4. Mở cổng Server
app.listen(3000, () => console.log("Backend đang chạy tại cổng 3000"));

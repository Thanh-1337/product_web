// ==============================================================================
// PHẦN 1: KHAI BÁO CÁC THƯ VIỆN HỖ TRỢ
// ==============================================================================

// Đọc các thông tin cấu hình từ file ẩn .env
require("dotenv").config();

// Khai báo Framework Express để tạo Server
const express = require("express");

// Khai báo thư viện kết nối đến Cơ sở dữ liệu MySQL
const mysql = require("mysql2");

// Thư viện xử lý đường dẫn file và thư mục trong hệ điều hành
const path = require("path");

// Thư viện CORS: Cho phép Frontend gọi API từ Backend khác cổng/tên miền
const cors = require("cors");

// Thư viện quản lý Session (phiên làm việc của người dùng khi đăng nhập)
const session = require("express-session");

// Thư viện Passport: Xử lý xác thực đăng nhập (Google, Facebook, Local...)
const passport = require("passport");

// Khởi tạo ứng dụng Express
const app = express();

// ==============================================================================
// PHẦN 2: CẤU HÌNH CÁC MIDDLEWARE (BỘ LỌC XỬ LÝ DỮ LIỆU)
// ==============================================================================

// Bật CORS cho phép mọi nguồn kết nối vào
app.use(cors());

// Giúp Server đọc được dữ liệu dạng JSON từ Frontend gửi lên
app.use(express.json());

// Giúp Server đọc được dữ liệu từ Form HTML gửi lên (mặc định dạng URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Cho phép người dùng truy cập trực tiếp các file tĩnh (HTML, CSS, JS, ảnh) trong thư mục gốc
app.use(express.static(__dirname));

// Cấu hình lưu trữ Session trong bộ nhớ
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey", // Chuỗi bí mật mã hóa Session
    resave: false, // Không lưu lại session nếu không đổi
    saveUninitialized: true, // Lưu session mới kể cả chưa có dữ liệu
  }),
);

// Khởi chạy Passport để bắt đầu quản lý xác thực
app.use(passport.initialize());

// Cho phép Passport kết nối và lưu thông tin người dùng vào Session
app.use(passport.session());

// Định nghĩa cách Passport ghi dữ liệu User vào Session
passport.serializeUser((user, done) => done(null, user));

// Định nghĩa cách Passport đọc dữ liệu User ra từ Session
passport.deserializeUser((obj, done) => done(null, obj));

// ==============================================================================
// PHẦN 3: KẾT NỐI CƠ SỞ DỮ LIỆU MYSQL (PHPMYADMIN)
// ==============================================================================

// Tạo một bể chứa kết nối (Connection Pool) tới MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Địa chỉ máy chủ CSDL
  user: process.env.DB_USER || "root", // Tên tài khoản MySQL
  password: process.env.DB_PASSWORD || "", // Mật khẩu MySQL
  database: process.env.DB_NAME || "techstore", // Tên CSDL
  waitForConnections: true, // Chờ khi hết kết nối trống
  connectionLimit: 10, // Tối đa 10 kết nối cùng lúc
  queueLimit: 0, // Không giới hạn hàng chờ
});

// Thử lấy 1 kết nối ra để kiểm tra kết nối có thành công hay không
db.getConnection((err, connection) => {
  if (err) console.log("Lỗi kết nối MySQL:", err);
  else {
    console.log("Đã kết nối thành công tới phpMyAdmin");
    connection.release(); // Trả kết nối lại cho pool sau khi kiểm tra xong
  }
});

// ==============================================================================
// PHẦN 4: NHẬP VÀ SỬ DỤNG CÁC ĐƯỜNG DẪN (ROUTES)
// ==============================================================================

// Lấy danh sách các đường dẫn giao diện từ file src/routes/web.js
const webRoutes = require("./src/routes/web");
app.use("/", webRoutes);

// ==============================================================================
// PHẦN 5: KHAI BÁO CÁC ĐƯỜNG DẪN API DỮ LIỆU
// ==============================================================================

// API trả về danh sách sản phẩm từ database cho Frontend
app.get("/api/products", (req, res) => {
  // Câu lệnh SQL lấy tất cả bản ghi từ bảng products
  const sql = "SELECT * FROM products";

  // Thực thi câu lệnh SQL
  db.query(sql, (err, results) => {
    // Nếu có lỗi SQL thì trả về lỗi 500
    if (err) return res.status(500).json(err);

    // Gửi mảng dữ liệu sản phẩm dưới dạng JSON về cho Frontend
    res.json(results);
  });
});

// ==============================================================================
// PHẦN 6: KÍCH HOẠT LẮNG NGHE CỔNG SERVER
// ==============================================================================

// Lấy cổng từ file .env hoặc dùng cổng 3000
const PORT = process.env.PORT || 3000;

// Bắt đầu lắng nghe các kết nối gửi tới Server
app.listen(PORT, () => console.log(`Backend đang chạy tại cổng ${PORT}`));

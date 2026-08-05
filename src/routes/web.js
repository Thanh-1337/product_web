// ==============================================================================
// PHẦN 1: KHAI BÁO THƯ VIỆN VÀ THIẾT LẬP ĐƯỜNG DẪN DỰ ÁN
// ==============================================================================
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mysql = require("mysql2");

const router = express.Router();

// Lấy đường dẫn thư mục gốc dự án
const rootDir = path.join(__dirname, "../../");
const rootDirAccount = path.join(rootDir, "account");

// Kết nối MySQL Database
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "techstore",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ==============================================================================
// PHẦN 2: CẤU HÌNH PASSPORT SERIALIZE & DESERIALIZE
// ==============================================================================
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Cấu hình Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const name = profile.displayName;
      const email =
        profile.emails && profile.emails[0] ? profile.emails[0].value : "";
      const avatar =
        profile.photos && profile.photos[0] ? profile.photos[0].value : "";

      const checkSql = "SELECT * FROM users WHERE email = ?";
      db.query(checkSql, [email], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
          const existingUser = results[0];
          const updateSql =
            "UPDATE users SET google_id = ?, avatar = ? WHERE id = ?";
          db.query(
            updateSql,
            [googleId, avatar || existingUser.avatar, existingUser.id],
            () => {
              const userData = {
                id: existingUser.id,
                name: existingUser.name || name,
                email: existingUser.email,
                avatar: avatar || existingUser.avatar,
                role: existingUser.role || "user",
              };
              return done(null, userData);
            },
          );
        } else {
          const insertSql =
            "INSERT INTO users (name, email, google_id, avatar, role) VALUES (?, ?, ?, ?, 'user')";
          db.query(
            insertSql,
            [name, email, googleId, avatar],
            (insertErr, insertResult) => {
              if (insertErr) return done(insertErr);
              const newUser = {
                id: insertResult.insertId,
                name: name,
                email: email,
                google_id: googleId,
                avatar: avatar,
                role: "user",
              };
              return done(null, newUser);
            },
          );
        }
      });
    },
  ),
);

// ==============================================================================
// PHẦN 3: ĐỊNH NGHĨA CÁC ROUTE API VÀ XÁC THỰC (POST & GET)
// ==============================================================================

// 1. API kiểm tra trạng thái đăng nhập
router.get("/api/current_user", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 2. Google OAuth Routes
router.get(
  "/account/google_login",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user) return res.redirect("/account/login");

    req.logIn(user, (loginErr) => {
      if (loginErr) return res.redirect("/account/login");
      req.session.save(() => {
        return res.redirect("/");
      });
    });
  })(req, res, next);
});

// 3. 🟢 ROUTE XỬ LÝ ĐĂNG NHẬP THƯỜNG (POST /account/login) - ĐÃ BỔ SUNG
router.post("/account/login", (req, res) => {
  const email = req.body.customer ? req.body.customer.email : req.body.email;
  const password = req.body.customer
    ? req.body.customer.password
    : req.body.password;

  if (!email || !password) {
    return res.send(`
      <script>
        alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        window.location.href = "/account/login";
      </script>
    `);
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.send(`
        <script>
          alert("Email hoặc mật khẩu không chính xác!");
          window.location.href = "/account/login";
        </script>
      `);
    }

    const user = results[0];

    if (!user.password && user.google_id) {
      return res.send(`
        <script>
          alert("Tài khoản này được đăng ký bằng Google. Vui lòng chọn 'Đăng nhập bằng Google'!");
          window.location.href = "/account/login";
        </script>
      `);
    }

    if (user.password !== password) {
      return res.send(`
        <script>
          alert("Email hoặc mật khẩu không chính xác!");
          window.location.href = "/account/login";
        </script>
      `);
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.send(`
          <script>
            alert("Lỗi đăng nhập session!");
            window.location.href = "/account/login";
          </script>
        `);
      }
      req.session.save(() => {
        res.redirect("/");
      });
    });
  });
});

// 4. 🟢 ROUTE XỬ LÝ ĐĂNG KÝ THƯỜNG (POST /register) - ĐÃ BỔ SUNG
router.post("/register", (req, res) => {
  const name = req.body.customer
    ? req.body.customer.first_name || req.body.customer.name
    : req.body.name;
  const email = req.body.customer ? req.body.customer.email : req.body.email;
  const password = req.body.customer
    ? req.body.customer.password
    : req.body.password;

  if (!email || !password) {
    return res.send(`
      <script>
        alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        window.location.href = "/register";
      </script>
    `);
  }

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (results && results.length > 0) {
      return res.send(`
        <script>
          alert("Email này đã được đăng ký!");
          window.location.href = "/register";
        </script>
      `);
    }

    const insertSql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
    db.query(insertSql, [name || "", email, password], (insertErr) => {
      if (insertErr) {
        return res.send(`
          <script>
            alert("Lỗi khi tạo tài khoản!");
            window.location.href = "/register";
          </script>
        `);
      }

      return res.send(`
        <script>
          alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
          window.location.href = "/account/login";
        </script>
      `);
    });
  });
});

// 5. 🟢 ROUTE XỬ LÝ ĐĂNG XUẤT (GET /account/logout) - ĐÃ BỔ SUNG
router.get("/account/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.send(`
        <script>
          alert("Đăng xuất thành công!");
          window.location.href = "/";
        </script>
      `);
    });
  });
});

// ==============================================================================
// PHẦN 4: ĐỊNH NGHĨA CÁC ROUTE GIAO DIỆN HTML (PAGES)
// ==============================================================================

router.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(rootDirAccount, "register.html"));
});

router.get("/account/login", (req, res) => {
  res.sendFile(path.join(rootDirAccount, "login.html"));
});

router.use(express.static(rootDir));

router.get("/:page", (req, res) => {
  const page = req.params.page;

  if (page === "favicon.ico") {
    return res.status(204).end();
  }

  const filePath = path.join(rootDir, `${page}.html`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res
      .status(404)
      .send(
        "<h1 style='text-align:center; margin-top:50px;'>404 - Trang không tồn tại!</h1>",
      );
  }
});
// ==========================================
// XỬ LÝ ĐĂNG XUẤT (LOGOUT)
// ==========================================
router.get("/account/logout", (req, res, next) => {
  // 1. Xóa thông tin xác thực của Passport
  req.logout((err) => {
    if (err) {
      console.error("Lỗi khi logout:", err);
      return next(err);
    }

    // 2. Hủy toàn bộ Session trong bộ nhớ
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Lỗi hủy session:", sessionErr);
      }

      // 3. Xóa cookie session ở trình duyệt
      res.clearCookie("connect.sid");

      // 4. Bật thông báo và quay về trang chủ
      return res.send(`
        <script>
          alert("Đăng xuất thành công!");
          window.location.href = "/";
        </script>
      `);
    });
  });
});
// ==============================================================================
// PHẦN 5: XUẤT ROUTER
// ==============================================================================
module.exports = router;

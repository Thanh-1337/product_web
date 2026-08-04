const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const rootDir = path.join(__dirname, "../../");
const rootDirAccount = path.join(rootDir, "account");
router.use(express.static(rootDir));
router.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});
router.get("/register", (req, res) => {
  res.sendFile(path.join(rootDirAccount, "register.html"));
});
router.get("/account/login", (req, res) => {
  res.sendFile(path.join(rootDirAccount, "login.html"));
});
router.get("/:page", (req, res) => {
  const page = req.params.page;
  if (page === "favicon.ico") {
    return res.status(204).end(); // Trả về HTTP 204 No Content và dừng lại ngay
  }

  const filePath = path.join(rootDir, `${page}.html`);

  // Kiểm tra file có tồn tại thật không trước khi gửi
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
module.exports = router;

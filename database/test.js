function generateRandomString() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // Random độ dài từ 6 đến 12
  const length = Math.floor(Math.random() * (12 - 6 + 1)) + 6;

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Chạy thử:
console.log(generateRandomString()); // Ví dụ output: "aB9xK2mP" hoặc "3fG8zQ1wE0pX"

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2026 at 09:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `techstore`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`) VALUES
(1, 'Laptop Asus Zenbook 14 OLED', 'laptop', 24990000.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRiTW5NdObcAtYhs9BRIH9TW3NPoDV2hFsZE4OJ-qwaBJR2bdGz44kHEDdOazNuVVQfuJ8rIq6iOf7JUUzQlM5jGhaN6vlz0JuVMyehCSMBkmI&usqp=CAc'),
(2, 'iPhone 15 Pro Max 256GB', 'phone', 29490000.00, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80'),
(3, 'Bàn phím cơ Không dây Keychron K2', 'accessory', 1850000.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80'),
(4, 'MacBook Air M3 (2024)', 'laptop', 27950000.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80'),
(5, 'Điện thoại Samsung Galaxy S24 Ultra', 'phone', 26190000.00, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80'),
(6, 'Tai nghe Sony WH-1000XM5 Chống ồn', 'accessory', 6490000.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'),
(7, 'iPhone 15 Pro Max 256GB', 'phone', 29590000.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80'),
(8, 'Laptop Dell XPS 13 9320', 'laptop', 34500000.00, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80'),
(9, 'Apple Watch Series 9 GPS', 'accessory', 9890000.00, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80'),
(10, 'Máy tính bảng iPad Air 5 M1', 'tablet', 13990000.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80'),
(11, 'Bàn phím cơ Logitech MX Keys S', 'accessory', 2850000.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80'),
(12, 'Laptop ASUS ROG Zephyrus G14', 'laptop', 32990000.00, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `google_id`, `avatar`, `role`, `created_at`) VALUES
(1, 'Nguyễn Thanh', 'nguyenthanh22102007@gmail.com', NULL, '100540115647728932432', 'https://lh3.googleusercontent.com/a/ACg8ocKfsrwALftpm6arPei1o9NUgNBkdtLNXoSJybPdx4UokhfcMA=s96-c', 'user', '2026-08-04 21:45:52'),
(2, 'Minh', 'leminhthai4627@gmail.com', 'Thaidzvll', NULL, NULL, 'user', '2026-08-04 22:06:21'),
(3, 'Code', 'thanhcode@gmail.com', 'KD29dAaeU', NULL, NULL, 'admin', '2026-08-04 22:51:19'),
(4, 'Hiếu', 'Hieucode@gmail.com', 'mFnKB41l7n', NULL, NULL, 'admin', '2026-08-05 19:16:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

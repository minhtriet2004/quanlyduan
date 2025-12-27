-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for quanlyduan
CREATE DATABASE IF NOT EXISTS `quanlyduan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quanlyduan`;

-- Dumping structure for table quanlyduan.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `showing_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `total_seats` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `booking_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `showing_id` (`showing_id`),
  KEY `movie_id` (`movie_id`),
  KEY `idx_booking_user` (`user_id`),
  KEY `idx_booking_status` (`status`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`showing_id`) REFERENCES `showings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.bookings: ~6 rows (approximately)
INSERT INTO `bookings` (`id`, `user_id`, `showing_id`, `movie_id`, `total_seats`, `total_price`, `status`, `payment_method`, `booking_date`, `created_at`, `updated_at`) VALUES
	(9, 6, 4, 1, 2, 20000.00, 'confirmed', 'cash', '2025-12-27 04:30:46', '2025-12-27 04:30:46', '2025-12-27 04:30:46'),
	(10, 6, 5, 2, 3, 33000.00, 'confirmed', 'cash', '2025-12-27 04:31:07', '2025-12-27 04:31:07', '2025-12-27 04:31:07'),
	(11, 6, 4, 1, 1, 10000.00, 'confirmed', 'cash', '2025-12-27 05:50:55', '2025-12-27 05:50:55', '2025-12-27 05:50:55'),
	(12, 6, 5, 2, 1, 11000.00, 'confirmed', 'cash', '2025-12-27 05:51:11', '2025-12-27 05:51:11', '2025-12-27 05:51:11'),
	(13, 6, 4, 1, 1, 10000.00, 'cancelled', 'cash', '2025-12-27 05:51:22', '2025-12-27 05:51:22', '2025-12-27 05:52:34'),
	(14, 6, 4, 1, 1, 10000.00, 'confirmed', 'cash', '2025-12-27 06:12:00', '2025-12-27 06:12:00', '2025-12-27 06:12:00');

-- Dumping structure for table quanlyduan.booking_items
CREATE TABLE IF NOT EXISTS `booking_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `booking_items_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_items_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.booking_items: ~9 rows (approximately)
INSERT INTO `booking_items` (`id`, `booking_id`, `seat_id`, `seat_number`, `price`) VALUES
	(11, 9, 197, 'A1', 10000.00),
	(12, 9, 198, 'A2', 10000.00),
	(13, 10, 245, 'A1', 11000.00),
	(14, 10, 246, 'A2', 11000.00),
	(15, 10, 247, 'A3', 11000.00),
	(16, 11, 199, 'A3', 10000.00),
	(17, 12, 254, 'B2', 11000.00),
	(18, 13, 206, 'B2', 10000.00),
	(19, 14, 200, 'A4', 10000.00);

-- Dumping structure for table quanlyduan.movies
CREATE TABLE IF NOT EXISTS `movies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `poster_image` varchar(255) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `duration` int DEFAULT NULL COMMENT 'Duration in minutes',
  `genre` varchar(100) DEFAULT NULL,
  `director` varchar(100) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT '0.0',
  `price` int DEFAULT '0',
  `status` enum('showing','coming_soon','archived') DEFAULT 'showing',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_movie_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.movies: ~3 rows (approximately)
INSERT INTO `movies` (`id`, `title`, `description`, `poster_image`, `release_date`, `duration`, `genre`, `director`, `rating`, `price`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'Mưa Đỏ', 'Test description', '/img/uploads/movie_694f379f4ae5c_1766799263.jpg', '2025-08-22', 124, 'Tư Liệu Chiến Tranh/Lịch Sử Việt Nam', '', 9.5, 10000, 'showing', '2025-12-26 06:14:12', '2025-12-27 01:36:49'),
	(2, 'Đại Chiến Thái Bình Dương', '', '/img/uploads/movie_694f3c029cb40_1766800386.jpg', '2013-04-12', 131, 'Sci-Fi', '', 8.8, 11000, 'showing', '2025-12-27 01:53:02', '2025-12-27 01:53:06'),
	(3, 'Thiên Đường ', '', '/img/uploads/movie_694f775969bad_1766815577.png', '2025-12-30', 113, 'Phim Kinh Dị', '', 0.0, 8000, 'coming_soon', '2025-12-27 06:06:17', '2025-12-27 06:06:17');

-- Dumping structure for table quanlyduan.seats
CREATE TABLE IF NOT EXISTS `seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `showing_id` int NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `is_booked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_seat` (`showing_id`,`seat_number`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`showing_id`) REFERENCES `showings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.seats: ~96 rows (approximately)
INSERT INTO `seats` (`id`, `showing_id`, `seat_number`, `is_booked`, `created_at`) VALUES
	(197, 4, 'A1', 1, '2025-12-27 04:30:05'),
	(198, 4, 'A2', 1, '2025-12-27 04:30:05'),
	(199, 4, 'A3', 1, '2025-12-27 04:30:05'),
	(200, 4, 'A4', 1, '2025-12-27 04:30:05'),
	(201, 4, 'A5', 0, '2025-12-27 04:30:05'),
	(202, 4, 'A6', 0, '2025-12-27 04:30:05'),
	(203, 4, 'A7', 0, '2025-12-27 04:30:05'),
	(204, 4, 'A8', 0, '2025-12-27 04:30:05'),
	(205, 4, 'B1', 0, '2025-12-27 04:30:05'),
	(206, 4, 'B2', 0, '2025-12-27 04:30:05'),
	(207, 4, 'B3', 0, '2025-12-27 04:30:05'),
	(208, 4, 'B4', 0, '2025-12-27 04:30:05'),
	(209, 4, 'B5', 0, '2025-12-27 04:30:05'),
	(210, 4, 'B6', 0, '2025-12-27 04:30:05'),
	(211, 4, 'B7', 0, '2025-12-27 04:30:05'),
	(212, 4, 'B8', 0, '2025-12-27 04:30:05'),
	(213, 4, 'C1', 0, '2025-12-27 04:30:05'),
	(214, 4, 'C2', 0, '2025-12-27 04:30:05'),
	(215, 4, 'C3', 0, '2025-12-27 04:30:05'),
	(216, 4, 'C4', 0, '2025-12-27 04:30:05'),
	(217, 4, 'C5', 0, '2025-12-27 04:30:05'),
	(218, 4, 'C6', 0, '2025-12-27 04:30:05'),
	(219, 4, 'C7', 0, '2025-12-27 04:30:05'),
	(220, 4, 'C8', 0, '2025-12-27 04:30:05'),
	(221, 4, 'D1', 0, '2025-12-27 04:30:05'),
	(222, 4, 'D2', 0, '2025-12-27 04:30:05'),
	(223, 4, 'D3', 0, '2025-12-27 04:30:05'),
	(224, 4, 'D4', 0, '2025-12-27 04:30:05'),
	(225, 4, 'D5', 0, '2025-12-27 04:30:05'),
	(226, 4, 'D6', 0, '2025-12-27 04:30:05'),
	(227, 4, 'D7', 0, '2025-12-27 04:30:05'),
	(228, 4, 'D8', 0, '2025-12-27 04:30:05'),
	(229, 4, 'E1', 0, '2025-12-27 04:30:05'),
	(230, 4, 'E2', 0, '2025-12-27 04:30:05'),
	(231, 4, 'E3', 0, '2025-12-27 04:30:05'),
	(232, 4, 'E4', 0, '2025-12-27 04:30:05'),
	(233, 4, 'E5', 0, '2025-12-27 04:30:05'),
	(234, 4, 'E6', 0, '2025-12-27 04:30:05'),
	(235, 4, 'E7', 0, '2025-12-27 04:30:05'),
	(236, 4, 'E8', 0, '2025-12-27 04:30:05'),
	(237, 4, 'F1', 0, '2025-12-27 04:30:05'),
	(238, 4, 'F2', 0, '2025-12-27 04:30:05'),
	(239, 4, 'F3', 0, '2025-12-27 04:30:05'),
	(240, 4, 'F4', 0, '2025-12-27 04:30:05'),
	(241, 4, 'F5', 0, '2025-12-27 04:30:06'),
	(242, 4, 'F6', 0, '2025-12-27 04:30:06'),
	(243, 4, 'F7', 0, '2025-12-27 04:30:06'),
	(244, 4, 'F8', 0, '2025-12-27 04:30:06'),
	(245, 5, 'A1', 1, '2025-12-27 04:30:55'),
	(246, 5, 'A2', 1, '2025-12-27 04:30:55'),
	(247, 5, 'A3', 1, '2025-12-27 04:30:55'),
	(248, 5, 'A4', 0, '2025-12-27 04:30:55'),
	(249, 5, 'A5', 0, '2025-12-27 04:30:55'),
	(250, 5, 'A6', 0, '2025-12-27 04:30:55'),
	(251, 5, 'A7', 0, '2025-12-27 04:30:55'),
	(252, 5, 'A8', 0, '2025-12-27 04:30:55'),
	(253, 5, 'B1', 0, '2025-12-27 04:30:55'),
	(254, 5, 'B2', 1, '2025-12-27 04:30:55'),
	(255, 5, 'B3', 0, '2025-12-27 04:30:55'),
	(256, 5, 'B4', 0, '2025-12-27 04:30:55'),
	(257, 5, 'B5', 0, '2025-12-27 04:30:55'),
	(258, 5, 'B6', 0, '2025-12-27 04:30:55'),
	(259, 5, 'B7', 0, '2025-12-27 04:30:55'),
	(260, 5, 'B8', 0, '2025-12-27 04:30:55'),
	(261, 5, 'C1', 0, '2025-12-27 04:30:55'),
	(262, 5, 'C2', 0, '2025-12-27 04:30:55'),
	(263, 5, 'C3', 0, '2025-12-27 04:30:55'),
	(264, 5, 'C4', 0, '2025-12-27 04:30:55'),
	(265, 5, 'C5', 0, '2025-12-27 04:30:55'),
	(266, 5, 'C6', 0, '2025-12-27 04:30:55'),
	(267, 5, 'C7', 0, '2025-12-27 04:30:55'),
	(268, 5, 'C8', 0, '2025-12-27 04:30:55'),
	(269, 5, 'D1', 0, '2025-12-27 04:30:55'),
	(270, 5, 'D2', 0, '2025-12-27 04:30:55'),
	(271, 5, 'D3', 0, '2025-12-27 04:30:55'),
	(272, 5, 'D4', 0, '2025-12-27 04:30:55'),
	(273, 5, 'D5', 0, '2025-12-27 04:30:55'),
	(274, 5, 'D6', 0, '2025-12-27 04:30:55'),
	(275, 5, 'D7', 0, '2025-12-27 04:30:55'),
	(276, 5, 'D8', 0, '2025-12-27 04:30:55'),
	(277, 5, 'E1', 0, '2025-12-27 04:30:55'),
	(278, 5, 'E2', 0, '2025-12-27 04:30:55'),
	(279, 5, 'E3', 0, '2025-12-27 04:30:55'),
	(280, 5, 'E4', 0, '2025-12-27 04:30:55'),
	(281, 5, 'E5', 0, '2025-12-27 04:30:55'),
	(282, 5, 'E6', 0, '2025-12-27 04:30:55'),
	(283, 5, 'E7', 0, '2025-12-27 04:30:55'),
	(284, 5, 'E8', 0, '2025-12-27 04:30:55'),
	(285, 5, 'F1', 0, '2025-12-27 04:30:55'),
	(286, 5, 'F2', 0, '2025-12-27 04:30:55'),
	(287, 5, 'F3', 0, '2025-12-27 04:30:55'),
	(288, 5, 'F4', 0, '2025-12-27 04:30:55'),
	(289, 5, 'F5', 0, '2025-12-27 04:30:55'),
	(290, 5, 'F6', 0, '2025-12-27 04:30:55'),
	(291, 5, 'F7', 0, '2025-12-27 04:30:55'),
	(292, 5, 'F8', 0, '2025-12-27 04:30:55');

-- Dumping structure for table quanlyduan.showings
CREATE TABLE IF NOT EXISTS `showings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `showing_date` date NOT NULL,
  `showing_time` time NOT NULL,
  `room_number` int NOT NULL,
  `total_seats` int DEFAULT '100',
  `available_seats` int DEFAULT '100',
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  KEY `idx_showing_date` (`showing_date`),
  CONSTRAINT `showings_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.showings: ~2 rows (approximately)
INSERT INTO `showings` (`id`, `movie_id`, `showing_date`, `showing_time`, `room_number`, `total_seats`, `available_seats`, `price`, `created_at`, `updated_at`) VALUES
	(4, 1, '2025-12-27', '14:00:00', 1, 48, 44, 10000.00, '2025-12-27 04:30:05', '2025-12-27 06:12:00'),
	(5, 2, '2025-12-27', '14:00:00', 1, 48, 44, 11000.00, '2025-12-27 04:30:55', '2025-12-27 05:51:11');

-- Dumping structure for table quanlyduan.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.users: ~3 rows (approximately)
INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `phone`, `role`, `created_at`, `updated_at`) VALUES
	(6, 'Teiyup', '$2y$10$Qjrhm3ZQ.BBhdiPfMv7Mr.CdAFjEdNZfk.tHf9Jr0dUwfH8knOBBq', 'teiyup@cinema.vn', 'Teiyup Admin', '0123456789', 'admin', '2025-12-23 05:35:25', '2025-12-23 05:35:25'),
	(7, 'teiyup4993', '$2y$10$ILoXsUuZcp5lbTwtSC6SQ.laLgsdqYED.aKNx5K8wA8XytW9MEsQa', 'admin@cinema.vn', 'Teiyup', '0909090909', 'user', '2025-12-23 05:54:22', '2025-12-23 05:54:22'),
	(8, 'TeiyupTeiyup@gmail.com', '$2y$10$y1hFDHxdfozDlH2Q6TeaGeiqOI08pJVnbFr3IOTiUARHaALRimhYK', 'TeiyupTeiyup@Gmail.com', 'Teiyup333', '0909090909', 'user', '2025-12-26 06:59:14', '2025-12-26 06:59:14');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

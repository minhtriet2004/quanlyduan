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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table quanlyduan.bookings: ~11 rows (approximately)
INSERT INTO `bookings` (`id`, `user_id`, `showing_id`, `movie_id`, `total_seats`, `total_price`, `status`, `payment_method`, `booking_date`, `created_at`, `updated_at`) VALUES
	(9, 6, 4, 1, 2, 20000.00, 'confirmed', 'cash', '2025-12-27 04:30:46', '2025-12-27 04:30:46', '2025-12-27 04:30:46'),
	(10, 6, 5, 2, 3, 33000.00, 'confirmed', 'cash', '2025-12-27 04:31:07', '2025-12-27 04:31:07', '2025-12-27 04:31:07'),
	(11, 6, 4, 1, 1, 10000.00, 'confirmed', 'cash', '2025-12-27 05:50:55', '2025-12-27 05:50:55', '2025-12-27 05:50:55'),
	(12, 6, 5, 2, 1, 11000.00, 'confirmed', 'cash', '2025-12-27 05:51:11', '2025-12-27 05:51:11', '2025-12-27 05:51:11'),
	(13, 6, 4, 1, 1, 10000.00, 'cancelled', 'cash', '2025-12-27 05:51:22', '2025-12-27 05:51:22', '2025-12-27 05:52:34'),
	(14, 6, 4, 1, 1, 10000.00, 'confirmed', 'cash', '2025-12-27 06:12:00', '2025-12-27 06:12:00', '2025-12-27 06:12:00'),
	(15, 6, 4, 1, 2, 20000.00, 'confirmed', 'cash', '2025-12-27 06:46:25', '2025-12-27 06:46:25', '2025-12-27 06:46:25'),
	(16, 6, 6, 3, 1, 8000.00, 'confirmed', 'cash', '2025-12-27 06:46:48', '2025-12-27 06:46:48', '2025-12-27 06:46:48'),
	(17, 6, 4, 1, 1, 10000.00, 'confirmed', 'bank_transfer', '2026-01-10 07:20:39', '2026-01-10 07:20:39', '2026-01-10 07:20:39'),
	(18, 7, 6, 3, 1, 8000.00, 'confirmed', 'bank_transfer', '2026-01-10 07:28:12', '2026-01-10 07:28:12', '2026-01-10 07:28:12'),
	(19, 7, 6, 3, 3, 24000.00, 'confirmed', 'bank_transfer', '2026-01-10 07:33:47', '2026-01-10 07:33:47', '2026-01-10 07:33:47');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

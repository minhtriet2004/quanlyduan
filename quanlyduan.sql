-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: quanlyduan
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_items`
--

DROP TABLE IF EXISTS `booking_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_items` (
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
INSERT INTO `booking_items` VALUES (11,9,197,'A1',10000.00),(12,9,198,'A2',10000.00),(13,10,245,'A1',11000.00),(14,10,246,'A2',11000.00),(15,10,247,'A3',11000.00),(16,11,199,'A3',10000.00),(17,12,254,'B2',11000.00),(18,13,206,'B2',10000.00),(19,14,200,'A4',10000.00),(20,15,201,'A5',10000.00),(21,15,202,'A6',10000.00),(22,16,293,'A1',8000.00),(23,17,233,'E5',10000.00),(24,18,294,'A2',8000.00),(25,19,303,'B3',8000.00),(26,19,304,'B4',8000.00),(27,19,305,'B5',8000.00),(28,20,310,'C2',8000.00),(29,21,360,'C4',10000.00),(30,22,344,'A4',10000.00),(31,22,345,'A5',10000.00),(32,22,347,'A7',10000.00),(33,23,255,'B3',11000.00),(34,23,263,'C3',11000.00),(35,23,271,'D3',11000.00),(36,23,279,'E3',11000.00),(37,23,287,'F3',11000.00),(38,24,207,'B3',10000.00),(39,24,208,'B4',10000.00),(40,24,209,'B5',10000.00),(41,24,210,'B6',10000.00),(42,25,343,'A3',10000.00),(43,26,297,'A5',8000.00),(44,26,298,'A6',8000.00),(45,26,299,'A7',8000.00),(46,26,300,'A8',8000.00),(47,27,322,'D6',8000.00),(48,28,353,'B5',10000.00);
/*!40000 ALTER TABLE `booking_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (9,6,4,1,2,20000.00,'confirmed','cash','2025-12-27 04:30:46','2025-12-27 04:30:46','2025-12-27 04:30:46'),(10,6,5,2,3,33000.00,'confirmed','cash','2025-12-27 04:31:07','2025-12-27 04:31:07','2025-12-27 04:31:07'),(11,6,4,1,1,10000.00,'confirmed','cash','2025-12-27 05:50:55','2025-12-27 05:50:55','2025-12-27 05:50:55'),(12,6,5,2,1,11000.00,'confirmed','cash','2025-12-27 05:51:11','2025-12-27 05:51:11','2025-12-27 05:51:11'),(13,6,4,1,1,10000.00,'cancelled','cash','2025-12-27 05:51:22','2025-12-27 05:51:22','2025-12-27 05:52:34'),(14,6,4,1,1,10000.00,'cancelled','cash','2025-12-27 06:12:00','2025-12-27 06:12:00','2026-01-10 08:22:22'),(15,6,4,1,2,20000.00,'confirmed','cash','2025-12-27 06:46:25','2025-12-27 06:46:25','2025-12-27 06:46:25'),(16,6,6,3,1,8000.00,'confirmed','cash','2025-12-27 06:46:48','2025-12-27 06:46:48','2025-12-27 06:46:48'),(17,6,4,1,1,10000.00,'confirmed','bank_transfer','2026-01-10 07:20:39','2026-01-10 07:20:39','2026-01-10 07:20:39'),(18,7,6,3,1,8000.00,'confirmed','bank_transfer','2026-01-10 07:28:12','2026-01-10 07:28:12','2026-01-10 07:28:12'),(19,7,6,3,3,24000.00,'confirmed','bank_transfer','2026-01-10 07:33:47','2026-01-10 07:33:47','2026-01-10 07:33:47'),(20,7,6,3,1,8000.00,'confirmed','bank_transfer','2026-01-10 07:41:25','2026-01-10 07:41:25','2026-01-10 07:41:25'),(21,7,7,4,1,10000.00,'confirmed','bank_transfer','2026-01-10 07:45:00','2026-01-10 07:45:00','2026-01-10 07:45:00'),(22,7,7,4,3,30000.00,'confirmed','bank_transfer','2026-01-10 07:45:37','2026-01-10 07:45:37','2026-01-10 07:45:37'),(23,7,5,2,5,55000.00,'confirmed','bank_transfer','2026-01-10 07:47:09','2026-01-10 07:47:09','2026-01-10 07:47:09'),(24,7,4,1,4,40000.00,'confirmed','bank_transfer','2026-01-10 07:47:24','2026-01-10 07:47:24','2026-01-10 07:47:24'),(25,7,7,4,1,10000.00,'confirmed','bank_transfer','2026-01-10 07:47:44','2026-01-10 07:47:44','2026-01-10 07:47:44'),(26,6,6,3,4,32000.00,'confirmed','bank_transfer','2026-01-10 08:21:58','2026-01-10 08:21:58','2026-01-10 08:21:58'),(27,6,6,3,1,8000.00,'confirmed','bank_transfer','2026-01-10 08:43:25','2026-01-10 08:43:25','2026-01-10 08:43:25'),(28,6,7,4,1,10000.00,'confirmed','bank_transfer','2026-01-15 08:28:52','2026-01-15 08:28:52','2026-01-15 08:28:52');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cinemas`
--

DROP TABLE IF EXISTS `cinemas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cinemas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cinema_city` (`city`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cinemas`
--

LOCK TABLES `cinemas` WRITE;
/*!40000 ALTER TABLE `cinemas` DISABLE KEYS */;
INSERT INTO `cinemas` VALUES (1,'R???p H??? Ch?? Minh - T??n B??nh','hcm','123 ???????ng Th??i V??n Lung, Ph?????ng T??n B??nh, TP.HCM','(028) 3847-1234','2025-12-27 03:00:00','2025-12-27 03:00:00'),(2,'R???p H??? Ch?? Minh - Qu???n 1','hcm','456 ???????ng Nguy???n Hu???, Ph?????ng B???n Ngh??, Qu???n 1, TP.HCM','(028) 3821-5678','2025-12-27 03:00:00','2025-12-27 03:00:00'),(3,'R???p H??? Ch?? Minh - B??nh Th???nh','hcm','789 ???????ng Pasteur, Ph?????ng 6, Qu???n 3, TP.HCM','(028) 3932-9012','2025-12-27 03:00:00','2025-12-27 03:00:00'),(4,'R???p H?? N???i - Ho??n Ki???m','hn','321 ???????ng Trang Tien, Ph?????ng Trang Tien, Qu???n Ho??n Ki???m, H?? N???i','(024) 3933-4567','2025-12-27 03:00:00','2025-12-27 03:00:00'),(5,'R???p H?? N???i - Thanh Xu??n','hn','654 ???????ng Gi???i Ph??ng, Ph?????ng Thanh Xu??n Trung, Qu???n Thanh Xu??n, H?? N???i','(024) 3541-8901','2025-12-27 03:00:00','2025-12-27 03:00:00'),(6,'R???p ???? N???ng - H???i Ch??u','dn','111 ???????ng Ng?? Gia T???, Ph?????ng H???i Ch??u 1, Qu???n H???i Ch??u, ???? N???ng','(0236) 3821-2345','2025-12-27 03:00:00','2025-12-27 03:00:00'),(7,'R???p C???n Th?? - Ninh Ki???u','ct','222 ???????ng H??a An, Ph?????ng An H??a, Qu???n Ninh Ki???u, C???n Th??','(0292) 3710-3456','2025-12-27 03:00:00','2025-12-27 03:00:00'),(8,'R???p H??? Ch?? Minh - T??n B??nh','H??? Ch?? Minh','123 ???????ng Th??i V??n Lung, Ph?????ng T??n B??nh','(028) 3847-1234','2026-01-10 08:38:11','2026-01-10 08:38:11'),(9,'R???p H??? Ch?? Minh - Qu???n 1','H??? Ch?? Minh','456 ???????ng Nguy???n Hu???, Ph?????ng B???n Ngh??, Qu???n 1','(028) 3821-5678','2026-01-10 08:38:11','2026-01-10 08:38:11'),(10,'R???p H?? N???i - Ho??n Ki???m','H?? N???i','321 ???????ng Trang Tien, Ph?????ng Trang Tien, Qu???n Ho??n Ki???m','(024) 3933-4567','2026-01-10 08:38:11','2026-01-10 08:38:11');
/*!40000 ALTER TABLE `cinemas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'M╞░a ─Éß╗Å','Test description','/img/uploads/movie_694f379f4ae5c_1766799263.jpg','2025-08-22',124,'T╞░ Liß╗çu Chiß║┐n Tranh/Lß╗ïch Sß╗¡ Viß╗çt Nam','',9.5,10000,'showing','2025-12-26 06:14:12','2025-12-27 01:36:49'),(2,'─Éß║íi Chiß║┐n Th├íi B├¼nh D╞░╞íng','','/img/uploads/movie_694f3c029cb40_1766800386.jpg','2013-04-12',131,'Sci-Fi','',8.8,11000,'showing','2025-12-27 01:53:02','2025-12-27 01:53:06'),(3,'Thi├¬n ─É╞░ß╗¥ng ','','/img/uploads/movie_694f775969bad_1766815577.png','2025-12-30',113,'Phim Kinh Dß╗ï','',0.0,8000,'showing','2025-12-27 06:06:17','2026-01-10 05:59:25'),(4,'Thi├¬n ─É╞░ß╗¥ng Maus 2','','/img/uploads/movie_6961eb1f3884e_1768024863.jpg','2026-01-09',113,'Phim Kinh Dß╗ï','',0.0,10000,'showing','2026-01-10 06:00:37','2026-01-10 06:01:03'),(5,'Spider-Man: Brand New Day','','/img/uploads/movie_6961ebfc2eb6c_1768025084.jpg','2026-01-31',100,'Phim Si├¬u Anh H├╣ng','SpuderMan',0.0,12000,'coming_soon','2026-01-10 06:04:44','2026-01-10 06:04:44');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `showing_id` int NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `is_booked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_seat` (`showing_id`,`seat_number`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`showing_id`) REFERENCES `showings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=437 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (197,4,'A1',1,'2025-12-27 04:30:05'),(198,4,'A2',1,'2025-12-27 04:30:05'),(199,4,'A3',1,'2025-12-27 04:30:05'),(200,4,'A4',0,'2025-12-27 04:30:05'),(201,4,'A5',1,'2025-12-27 04:30:05'),(202,4,'A6',1,'2025-12-27 04:30:05'),(203,4,'A7',0,'2025-12-27 04:30:05'),(204,4,'A8',0,'2025-12-27 04:30:05'),(205,4,'B1',0,'2025-12-27 04:30:05'),(206,4,'B2',0,'2025-12-27 04:30:05'),(207,4,'B3',1,'2025-12-27 04:30:05'),(208,4,'B4',1,'2025-12-27 04:30:05'),(209,4,'B5',1,'2025-12-27 04:30:05'),(210,4,'B6',1,'2025-12-27 04:30:05'),(211,4,'B7',0,'2025-12-27 04:30:05'),(212,4,'B8',0,'2025-12-27 04:30:05'),(213,4,'C1',0,'2025-12-27 04:30:05'),(214,4,'C2',0,'2025-12-27 04:30:05'),(215,4,'C3',0,'2025-12-27 04:30:05'),(216,4,'C4',0,'2025-12-27 04:30:05'),(217,4,'C5',0,'2025-12-27 04:30:05'),(218,4,'C6',0,'2025-12-27 04:30:05'),(219,4,'C7',0,'2025-12-27 04:30:05'),(220,4,'C8',0,'2025-12-27 04:30:05'),(221,4,'D1',0,'2025-12-27 04:30:05'),(222,4,'D2',0,'2025-12-27 04:30:05'),(223,4,'D3',0,'2025-12-27 04:30:05'),(224,4,'D4',0,'2025-12-27 04:30:05'),(225,4,'D5',0,'2025-12-27 04:30:05'),(226,4,'D6',0,'2025-12-27 04:30:05'),(227,4,'D7',0,'2025-12-27 04:30:05'),(228,4,'D8',0,'2025-12-27 04:30:05'),(229,4,'E1',0,'2025-12-27 04:30:05'),(230,4,'E2',0,'2025-12-27 04:30:05'),(231,4,'E3',0,'2025-12-27 04:30:05'),(232,4,'E4',0,'2025-12-27 04:30:05'),(233,4,'E5',1,'2025-12-27 04:30:05'),(234,4,'E6',0,'2025-12-27 04:30:05'),(235,4,'E7',0,'2025-12-27 04:30:05'),(236,4,'E8',0,'2025-12-27 04:30:05'),(237,4,'F1',0,'2025-12-27 04:30:05'),(238,4,'F2',0,'2025-12-27 04:30:05'),(239,4,'F3',0,'2025-12-27 04:30:05'),(240,4,'F4',0,'2025-12-27 04:30:05'),(241,4,'F5',0,'2025-12-27 04:30:06'),(242,4,'F6',0,'2025-12-27 04:30:06'),(243,4,'F7',0,'2025-12-27 04:30:06'),(244,4,'F8',0,'2025-12-27 04:30:06'),(245,5,'A1',1,'2025-12-27 04:30:55'),(246,5,'A2',1,'2025-12-27 04:30:55'),(247,5,'A3',1,'2025-12-27 04:30:55'),(248,5,'A4',0,'2025-12-27 04:30:55'),(249,5,'A5',0,'2025-12-27 04:30:55'),(250,5,'A6',0,'2025-12-27 04:30:55'),(251,5,'A7',0,'2025-12-27 04:30:55'),(252,5,'A8',0,'2025-12-27 04:30:55'),(253,5,'B1',0,'2025-12-27 04:30:55'),(254,5,'B2',1,'2025-12-27 04:30:55'),(255,5,'B3',1,'2025-12-27 04:30:55'),(256,5,'B4',0,'2025-12-27 04:30:55'),(257,5,'B5',0,'2025-12-27 04:30:55'),(258,5,'B6',0,'2025-12-27 04:30:55'),(259,5,'B7',0,'2025-12-27 04:30:55'),(260,5,'B8',0,'2025-12-27 04:30:55'),(261,5,'C1',0,'2025-12-27 04:30:55'),(262,5,'C2',0,'2025-12-27 04:30:55'),(263,5,'C3',1,'2025-12-27 04:30:55'),(264,5,'C4',0,'2025-12-27 04:30:55'),(265,5,'C5',0,'2025-12-27 04:30:55'),(266,5,'C6',0,'2025-12-27 04:30:55'),(267,5,'C7',0,'2025-12-27 04:30:55'),(268,5,'C8',0,'2025-12-27 04:30:55'),(269,5,'D1',0,'2025-12-27 04:30:55'),(270,5,'D2',0,'2025-12-27 04:30:55'),(271,5,'D3',1,'2025-12-27 04:30:55'),(272,5,'D4',0,'2025-12-27 04:30:55'),(273,5,'D5',0,'2025-12-27 04:30:55'),(274,5,'D6',0,'2025-12-27 04:30:55'),(275,5,'D7',0,'2025-12-27 04:30:55'),(276,5,'D8',0,'2025-12-27 04:30:55'),(277,5,'E1',0,'2025-12-27 04:30:55'),(278,5,'E2',0,'2025-12-27 04:30:55'),(279,5,'E3',1,'2025-12-27 04:30:55'),(280,5,'E4',0,'2025-12-27 04:30:55'),(281,5,'E5',0,'2025-12-27 04:30:55'),(282,5,'E6',0,'2025-12-27 04:30:55'),(283,5,'E7',0,'2025-12-27 04:30:55'),(284,5,'E8',0,'2025-12-27 04:30:55'),(285,5,'F1',0,'2025-12-27 04:30:55'),(286,5,'F2',0,'2025-12-27 04:30:55'),(287,5,'F3',1,'2025-12-27 04:30:55'),(288,5,'F4',0,'2025-12-27 04:30:55'),(289,5,'F5',0,'2025-12-27 04:30:55'),(290,5,'F6',0,'2025-12-27 04:30:55'),(291,5,'F7',0,'2025-12-27 04:30:55'),(292,5,'F8',0,'2025-12-27 04:30:55'),(293,6,'A1',1,'2025-12-27 06:46:43'),(294,6,'A2',1,'2025-12-27 06:46:43'),(295,6,'A3',0,'2025-12-27 06:46:43'),(296,6,'A4',0,'2025-12-27 06:46:43'),(297,6,'A5',1,'2025-12-27 06:46:43'),(298,6,'A6',1,'2025-12-27 06:46:43'),(299,6,'A7',1,'2025-12-27 06:46:43'),(300,6,'A8',1,'2025-12-27 06:46:43'),(301,6,'B1',0,'2025-12-27 06:46:43'),(302,6,'B2',0,'2025-12-27 06:46:43'),(303,6,'B3',1,'2025-12-27 06:46:43'),(304,6,'B4',1,'2025-12-27 06:46:43'),(305,6,'B5',1,'2025-12-27 06:46:43'),(306,6,'B6',0,'2025-12-27 06:46:43'),(307,6,'B7',0,'2025-12-27 06:46:43'),(308,6,'B8',0,'2025-12-27 06:46:43'),(309,6,'C1',0,'2025-12-27 06:46:43'),(310,6,'C2',1,'2025-12-27 06:46:43'),(311,6,'C3',0,'2025-12-27 06:46:43'),(312,6,'C4',0,'2025-12-27 06:46:43'),(313,6,'C5',0,'2025-12-27 06:46:43'),(314,6,'C6',0,'2025-12-27 06:46:43'),(315,6,'C7',0,'2025-12-27 06:46:43'),(316,6,'C8',0,'2025-12-27 06:46:43'),(317,6,'D1',0,'2025-12-27 06:46:43'),(318,6,'D2',0,'2025-12-27 06:46:43'),(319,6,'D3',0,'2025-12-27 06:46:43'),(320,6,'D4',0,'2025-12-27 06:46:43'),(321,6,'D5',0,'2025-12-27 06:46:43'),(322,6,'D6',1,'2025-12-27 06:46:43'),(323,6,'D7',0,'2025-12-27 06:46:43'),(324,6,'D8',0,'2025-12-27 06:46:43'),(325,6,'E1',0,'2025-12-27 06:46:43'),(326,6,'E2',0,'2025-12-27 06:46:43'),(327,6,'E3',0,'2025-12-27 06:46:43'),(328,6,'E4',0,'2025-12-27 06:46:43'),(329,6,'E5',0,'2025-12-27 06:46:43'),(330,6,'E6',0,'2025-12-27 06:46:43'),(331,6,'E7',0,'2025-12-27 06:46:43'),(332,6,'E8',0,'2025-12-27 06:46:43'),(333,6,'F1',0,'2025-12-27 06:46:43'),(334,6,'F2',0,'2025-12-27 06:46:43'),(335,6,'F3',0,'2025-12-27 06:46:43'),(336,6,'F4',0,'2025-12-27 06:46:43'),(337,6,'F5',0,'2025-12-27 06:46:43'),(338,6,'F6',0,'2025-12-27 06:46:43'),(339,6,'F7',0,'2025-12-27 06:46:43'),(340,6,'F8',0,'2025-12-27 06:46:43'),(341,7,'A1',0,'2026-01-10 07:44:17'),(342,7,'A2',0,'2026-01-10 07:44:17'),(343,7,'A3',1,'2026-01-10 07:44:17'),(344,7,'A4',1,'2026-01-10 07:44:17'),(345,7,'A5',1,'2026-01-10 07:44:17'),(346,7,'A6',0,'2026-01-10 07:44:17'),(347,7,'A7',1,'2026-01-10 07:44:17'),(348,7,'A8',0,'2026-01-10 07:44:17'),(349,7,'B1',0,'2026-01-10 07:44:17'),(350,7,'B2',0,'2026-01-10 07:44:17'),(351,7,'B3',0,'2026-01-10 07:44:17'),(352,7,'B4',0,'2026-01-10 07:44:17'),(353,7,'B5',1,'2026-01-10 07:44:17'),(354,7,'B6',0,'2026-01-10 07:44:17'),(355,7,'B7',0,'2026-01-10 07:44:17'),(356,7,'B8',0,'2026-01-10 07:44:17'),(357,7,'C1',0,'2026-01-10 07:44:17'),(358,7,'C2',0,'2026-01-10 07:44:17'),(359,7,'C3',0,'2026-01-10 07:44:17'),(360,7,'C4',1,'2026-01-10 07:44:17'),(361,7,'C5',0,'2026-01-10 07:44:17'),(362,7,'C6',0,'2026-01-10 07:44:17'),(363,7,'C7',0,'2026-01-10 07:44:17'),(364,7,'C8',0,'2026-01-10 07:44:17'),(365,7,'D1',0,'2026-01-10 07:44:17'),(366,7,'D2',0,'2026-01-10 07:44:17'),(367,7,'D3',0,'2026-01-10 07:44:17'),(368,7,'D4',0,'2026-01-10 07:44:17'),(369,7,'D5',0,'2026-01-10 07:44:17'),(370,7,'D6',0,'2026-01-10 07:44:17'),(371,7,'D7',0,'2026-01-10 07:44:17'),(372,7,'D8',0,'2026-01-10 07:44:17'),(373,7,'E1',0,'2026-01-10 07:44:17'),(374,7,'E2',0,'2026-01-10 07:44:17'),(375,7,'E3',0,'2026-01-10 07:44:17'),(376,7,'E4',0,'2026-01-10 07:44:17'),(377,7,'E5',0,'2026-01-10 07:44:17'),(378,7,'E6',0,'2026-01-10 07:44:17'),(379,7,'E7',0,'2026-01-10 07:44:17'),(380,7,'E8',0,'2026-01-10 07:44:17'),(381,7,'F1',0,'2026-01-10 07:44:17'),(382,7,'F2',0,'2026-01-10 07:44:17'),(383,7,'F3',0,'2026-01-10 07:44:17'),(384,7,'F4',0,'2026-01-10 07:44:17'),(385,7,'F5',0,'2026-01-10 07:44:17'),(386,7,'F6',0,'2026-01-10 07:44:17'),(387,7,'F7',0,'2026-01-10 07:44:17'),(388,7,'F8',0,'2026-01-10 07:44:17'),(389,8,'A1',0,'2026-01-10 07:44:17'),(390,8,'A2',0,'2026-01-10 07:44:17'),(391,8,'A3',0,'2026-01-10 07:44:17'),(392,8,'A4',0,'2026-01-10 07:44:17'),(393,8,'A5',0,'2026-01-10 07:44:17'),(394,8,'A6',0,'2026-01-10 07:44:17'),(395,8,'A7',0,'2026-01-10 07:44:17'),(396,8,'A8',0,'2026-01-10 07:44:17'),(397,8,'B1',0,'2026-01-10 07:44:17'),(398,8,'B2',0,'2026-01-10 07:44:17'),(399,8,'B3',0,'2026-01-10 07:44:17'),(400,8,'B4',0,'2026-01-10 07:44:17'),(401,8,'B5',0,'2026-01-10 07:44:17'),(402,8,'B6',0,'2026-01-10 07:44:17'),(403,8,'B7',0,'2026-01-10 07:44:17'),(404,8,'B8',0,'2026-01-10 07:44:17'),(405,8,'C1',0,'2026-01-10 07:44:17'),(406,8,'C2',0,'2026-01-10 07:44:17'),(407,8,'C3',0,'2026-01-10 07:44:17'),(408,8,'C4',0,'2026-01-10 07:44:17'),(409,8,'C5',0,'2026-01-10 07:44:17'),(410,8,'C6',0,'2026-01-10 07:44:17'),(411,8,'C7',0,'2026-01-10 07:44:17'),(412,8,'C8',0,'2026-01-10 07:44:17'),(413,8,'D1',0,'2026-01-10 07:44:17'),(414,8,'D2',0,'2026-01-10 07:44:17'),(415,8,'D3',0,'2026-01-10 07:44:17'),(416,8,'D4',0,'2026-01-10 07:44:17'),(417,8,'D5',0,'2026-01-10 07:44:17'),(418,8,'D6',0,'2026-01-10 07:44:17'),(419,8,'D7',0,'2026-01-10 07:44:17'),(420,8,'D8',0,'2026-01-10 07:44:17'),(421,8,'E1',0,'2026-01-10 07:44:17'),(422,8,'E2',0,'2026-01-10 07:44:17'),(423,8,'E3',0,'2026-01-10 07:44:17'),(424,8,'E4',0,'2026-01-10 07:44:17'),(425,8,'E5',0,'2026-01-10 07:44:17'),(426,8,'E6',0,'2026-01-10 07:44:17'),(427,8,'E7',0,'2026-01-10 07:44:17'),(428,8,'E8',0,'2026-01-10 07:44:17'),(429,8,'F1',0,'2026-01-10 07:44:17'),(430,8,'F2',0,'2026-01-10 07:44:17'),(431,8,'F3',0,'2026-01-10 07:44:17'),(432,8,'F4',0,'2026-01-10 07:44:17'),(433,8,'F5',0,'2026-01-10 07:44:17'),(434,8,'F6',0,'2026-01-10 07:44:17'),(435,8,'F7',0,'2026-01-10 07:44:17'),(436,8,'F8',0,'2026-01-10 07:44:17');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `showings`
--

DROP TABLE IF EXISTS `showings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `showings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `cinema_id` int DEFAULT NULL,
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
  KEY `cinema_id` (`cinema_id`),
  CONSTRAINT `showings_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `showings_ibfk_2` FOREIGN KEY (`cinema_id`) REFERENCES `cinemas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showings`
--

LOCK TABLES `showings` WRITE;
/*!40000 ALTER TABLE `showings` DISABLE KEYS */;
INSERT INTO `showings` VALUES (4,1,1,'2025-12-27','14:00:00',1,48,38,10000.00,'2025-12-27 04:30:05','2026-01-10 08:38:11'),(5,2,1,'2025-12-27','14:00:00',1,48,39,11000.00,'2025-12-27 04:30:55','2026-01-10 08:38:11'),(6,3,1,'2025-12-27','14:00:00',1,48,37,8000.00,'2025-12-27 06:46:43','2026-01-10 08:43:25'),(7,4,1,'2026-01-10','14:00:00',1,48,42,10000.00,'2026-01-10 07:43:51','2026-01-15 08:28:52'),(8,5,1,'2026-01-10','14:00:00',2,48,48,12000.00,'2026-01-10 07:43:51','2026-01-10 08:38:11'),(9,1,1,'2025-12-27','14:00:00',2,48,48,10000.00,'2026-01-15 08:31:20','2026-01-15 08:31:20'),(10,1,1,'2025-12-27','16:30:00',3,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(11,1,1,'2025-12-27','19:00:00',4,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(12,1,1,'2025-12-27','21:30:00',5,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(13,1,1,'2025-12-27','23:00:00',6,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(14,2,1,'2025-12-27','14:00:00',2,48,48,11000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(15,2,1,'2025-12-27','17:00:00',3,48,48,11000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(16,2,1,'2025-12-27','20:00:00',4,48,48,11000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(17,3,1,'2025-12-27','14:00:00',2,48,48,8000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(18,3,1,'2025-12-27','15:30:00',3,48,48,8000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(19,3,1,'2025-12-27','17:00:00',4,48,48,8000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(20,3,1,'2025-12-27','18:30:00',5,48,48,8000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(21,3,1,'2025-12-27','20:00:00',6,48,48,8000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(22,4,1,'2026-01-10','14:00:00',2,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(23,4,1,'2026-01-10','16:30:00',3,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(24,4,1,'2026-01-10','19:00:00',4,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(25,4,1,'2026-01-10','21:30:00',5,48,48,10000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(26,5,1,'2026-01-10','14:00:00',3,48,48,12000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(27,5,1,'2026-01-10','16:45:00',4,48,48,12000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(28,5,1,'2026-01-10','19:30:00',5,48,48,12000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21'),(29,5,1,'2026-01-10','22:00:00',6,48,48,12000.00,'2026-01-15 08:31:21','2026-01-15 08:31:21');
/*!40000 ALTER TABLE `showings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Teiyup','$2y$10$Qjrhm3ZQ.BBhdiPfMv7Mr.CdAFjEdNZfk.tHf9Jr0dUwfH8knOBBq','teiyup@cinema.vn','Teiyup Admin','0123456789','admin','2025-12-23 05:35:25','2025-12-23 05:35:25'),(7,'teiyup4993','$2y$10$ILoXsUuZcp5lbTwtSC6SQ.laLgsdqYED.aKNx5K8wA8XytW9MEsQa','admin@cinema.vn','Teiyup','0909090909','user','2025-12-23 05:54:22','2025-12-23 05:54:22'),(8,'TeiyupTeiyup@gmail.com','$2y$10$y1hFDHxdfozDlH2Q6TeaGeiqOI08pJVnbFr3IOTiUARHaALRimhYK','TeiyupTeiyup@Gmail.com','Teiyup333','0909090909','user','2025-12-26 06:59:14','2025-12-26 06:59:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-15 15:43:09

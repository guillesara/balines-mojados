-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.3.2-MariaDB - mariadb.org binary distribution
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


-- Dumping database structure for balines-mojados
CREATE DATABASE IF NOT EXISTS `balines-mojados` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `balines-mojados`;

-- Dumping structure for table balines-mojados.reserves
CREATE TABLE IF NOT EXISTS `reserves` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `room` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `mode` enum('private','public') NOT NULL,
  `players` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_rr_rooms` (`room`),
  CONSTRAINT `FK_rr_rooms` FOREIGN KEY (`room`) REFERENCES `rooms` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table balines-mojados.reserves: ~0 rows (approximately)

-- Dumping structure for table balines-mojados.rooms
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('small','medium','big') NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table balines-mojados.rooms: ~18 rows (approximately)
REPLACE INTO `rooms` (`id`, `type`, `capacity`) VALUES
	(1, 'small', 10),
	(2, 'small', 10),
	(3, 'small', 10),
	(4, 'small', 10),
	(5, 'small', 10),
	(6, 'small', 10),
	(7, 'medium', 15),
	(8, 'medium', 15),
	(9, 'medium', 15),
	(10, 'medium', 15),
	(11, 'medium', 15),
	(12, 'medium', 15),
	(13, 'big', 20),
	(14, 'big', 20),
	(15, 'big', 20),
	(16, 'big', 20),
	(17, 'big', 20),
	(18, 'big', 20);

-- Dumping structure for table balines-mojados.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `device` varchar(50) NOT NULL DEFAULT 'Unknown',
  `application` varchar(50) NOT NULL DEFAULT 'Unknown',
  `ip` varchar(50) NOT NULL DEFAULT 'Unknown',
  `logged` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_session_users` (`userId`),
  CONSTRAINT `FK_session_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table balines-mojados.sessions: ~2 rows (approximately)
REPLACE INTO `sessions` (`id`, `userId`, `device`, `application`, `ip`, `logged`) VALUES
	(4, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-07-12 00:35:56'),
	(7, 3, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-08-28 00:04:40');

-- Dumping structure for table balines-mojados.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` enum('admin','user') NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table balines-mojados.users: ~2 rows (approximately)
REPLACE INTO `users` (`id`, `group`, `mail`, `username`, `password`) VALUES
	(2, 'admin', 'admin@gmail.com', 'admin', '$2b$10$OmEPBW3oVkurumKEfiin6OL4orH40vqWijSivRYvPsa4OzpCCCTcG'),
	(3, 'user', 'user@gmail.com', 'user', '$2b$10$Zq8etDb6eq8Fq.DuA5QWU.O3w6ZLCHQdIL8IbaKWjsxXok08/xCMW');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.24-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para balines-mojados
CREATE DATABASE IF NOT EXISTS `balines-mojados` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `balines-mojados`;

-- Volcando estructura para tabla balines-mojados.plans
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `balls` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla balines-mojados.plans: ~4 rows (aproximadamente)
REPLACE INTO `plans` (`id`, `name`, `price`, `balls`) VALUES
	(1, 'Bronce', 26000, 100),
	(2, 'Plata', 45500, 200),
	(3, 'Oro', 65000, 300),
	(4, 'Diamante', 97500, 500);

-- Volcando estructura para tabla balines-mojados.reserves
CREATE TABLE IF NOT EXISTS `reserves` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `room` int(11) NOT NULL,
  `plan` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `players` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_rr_rooms` (`room`),
  KEY `FK_rr_reserves_plans` (`plan`),
  KEY `FK_reserves_users` (`user`),
  CONSTRAINT `FK_reserves_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_rr_reserves_plans` FOREIGN KEY (`plan`) REFERENCES `plans` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_rr_rooms` FOREIGN KEY (`room`) REFERENCES `rooms` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla balines-mojados.reserves: ~6 rows (aproximadamente)
REPLACE INTO `reserves` (`Id`, `user`, `room`, `plan`, `date`, `time`, `players`) VALUES
	(1, 3, 1, 1, '2024-08-28', '10:00:00', 5),
	(2, 3, 2, 4, '2024-08-28', '10:00:00', 5),
	(3, 3, 3, 2, '2024-08-28', '10:00:00', 5),
	(4, 3, 4, 4, '2024-08-28', '10:00:00', 5),
	(5, 3, 5, 1, '2024-08-28', '10:00:00', 5),
	(6, 3, 6, 3, '2024-08-28', '10:00:00', 5);

-- Volcando estructura para tabla balines-mojados.rooms
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('small','medium','big') NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla balines-mojados.rooms: ~18 rows (aproximadamente)
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

-- Volcando estructura para tabla balines-mojados.sessions
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla balines-mojados.sessions: ~3 rows (aproximadamente)
REPLACE INTO `sessions` (`id`, `userId`, `device`, `application`, `ip`, `logged`) VALUES
	(4, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-07-12 00:35:56'),
	(7, 3, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-08-28 00:04:40'),
	(9, 3, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-08-28 21:09:11');

-- Volcando estructura para tabla balines-mojados.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` enum('admin','user') NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla balines-mojados.users: ~2 rows (aproximadamente)
REPLACE INTO `users` (`id`, `group`, `mail`, `username`, `password`) VALUES
	(2, 'admin', 'admin@gmail.com', 'admin', '$2b$10$OmEPBW3oVkurumKEfiin6OL4orH40vqWijSivRYvPsa4OzpCCCTcG'),
	(3, 'user', 'user@gmail.com', 'user', '$2b$10$Zq8etDb6eq8Fq.DuA5QWU.O3w6ZLCHQdIL8IbaKWjsxXok08/xCMW'),
	(6, 'user', '', '', '$2b$10$SbWqos5MFcb96Gs/AM5Kx.LGsNvO.F40ENmzrB5VpdFar.VrnF.AC');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

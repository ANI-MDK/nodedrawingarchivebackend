-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.36 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table db_drawing_archive.tbl_categories
CREATE TABLE IF NOT EXISTS `tbl_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  KEY `INDEX` (`is_active`),
  FULLTEXT KEY `FULLTEXT` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for drawing categories';

-- Dumping data for table db_drawing_archive.tbl_categories: ~5 rows (approximately)
INSERT INTO `tbl_categories` (`id`, `name`, `is_active`) VALUES
	(1, 'PROFILE', 'Y'),
	(2, 'SKETCH', 'Y'),
	(3, 'CIVIL', 'Y'),
	(4, 'STRUCTURAL', 'Y'),
	(5, 'MECHANICAL', 'Y');

-- Dumping structure for table db_drawing_archive.tbl_download_logsheet
CREATE TABLE IF NOT EXISTS `tbl_download_logsheet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `drawing_id` int NOT NULL,
  `download_reason` varchar(500) NOT NULL,
  `download_file_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `download_file_original_name` varchar(200) NOT NULL,
  `download_on` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `INDEX` (`user_id`,`drawing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for drawing download by user log sheet';

-- Dumping data for table db_drawing_archive.tbl_download_logsheet: ~0 rows (approximately)

-- Dumping structure for table db_drawing_archive.tbl_drawings
CREATE TABLE IF NOT EXISTS `tbl_drawings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `category_id` int NOT NULL,
  `sub_category_id` int NOT NULL,
  `drawing_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `drg_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `page_number` smallint NOT NULL,
  `passed_date` date DEFAULT NULL,
  `revision` varchar(2) NOT NULL,
  `revision_date` date DEFAULT NULL,
  `added_by` int NOT NULL,
  `added_on` datetime NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  `is_delete` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`),
  KEY `INDEX` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for drawings';

-- Dumping data for table db_drawing_archive.tbl_drawings: ~0 rows (approximately)

-- Dumping structure for table db_drawing_archive.tbl_drawing_docs
CREATE TABLE IF NOT EXISTS `tbl_drawing_docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `drawing_id` int NOT NULL,
  `file_type` varchar(10) NOT NULL,
  `file_category` varchar(10) NOT NULL,
  `original_file_name` varchar(200) NOT NULL,
  `uploaded_file_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `INDEX` (`drawing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for drawing files';

-- Dumping data for table db_drawing_archive.tbl_drawing_docs: ~0 rows (approximately)

-- Dumping structure for table db_drawing_archive.tbl_projects
CREATE TABLE IF NOT EXISTS `tbl_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `location` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  KEY `INDEX` (`is_active`),
  FULLTEXT KEY `FULLTEXT` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for projects';

-- Dumping data for table db_drawing_archive.tbl_projects: ~0 rows (approximately)

-- Dumping structure for table db_drawing_archive.tbl_roles
CREATE TABLE IF NOT EXISTS `tbl_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  KEY `KEY` (`is_active`),
  FULLTEXT KEY `FULLTEXT` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for roles';

-- Dumping data for table db_drawing_archive.tbl_roles: ~0 rows (approximately)

-- Dumping structure for table db_drawing_archive.tbl_sub_categories
CREATE TABLE IF NOT EXISTS `tbl_sub_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  KEY `PRIMARY KEY` (`id`) USING BTREE,
  KEY `INDEX` (`is_active`),
  FULLTEXT KEY `FULLTEXT` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Static table for sub categories';

-- Dumping data for table db_drawing_archive.tbl_sub_categories: ~4 rows (approximately)
INSERT INTO `tbl_sub_categories` (`id`, `name`, `is_active`) VALUES
	(1, 'LINE', 'Y'),
	(2, 'LTP', 'Y'),
	(3, 'ITP', 'Y'),
	(4, 'UTP', 'Y');

-- Dumping structure for table db_drawing_archive.tbl_users
CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_admin` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  `is_delete` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`),
  KEY `INDEX` (`is_active`),
  FULLTEXT KEY `FULLTEXT` (`email`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for users';

-- Dumping data for table db_drawing_archive.tbl_users: ~1 rows (approximately)
INSERT INTO `tbl_users` (`id`, `role_id`, `name`, `email`, `password`, `is_admin`, `is_active`, `is_delete`) VALUES
	(1, 0, 'Admin User', 'admin@dril.net.in', '$2b$10$.h3GzwdfQwga6jacs1EzTO5l11uasElTAy/GQrLydFXz87HpwagE6', 'Y', 'Y', 'N');

-- Dumping structure for table db_drawing_archive.tbl_user_project_mapping
CREATE TABLE IF NOT EXISTS `tbl_user_project_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `can_view` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_add` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_edit` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_download` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_view_download_logsheet` enum('Y','N') NOT NULL DEFAULT 'N',
  KEY `PRIMARY KEY` (`id`) USING BTREE,
  KEY `KEY` (`user_id`,`project_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_drawing_archive.tbl_user_project_mapping: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

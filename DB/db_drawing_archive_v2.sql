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
INSERT IGNORE INTO `tbl_categories` (`id`, `name`, `is_active`) VALUES
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
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `drg_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for drawings';

-- Dumping data for table db_drawing_archive.tbl_drawings: ~4 rows (approximately)
INSERT IGNORE INTO `tbl_drawings` (`id`, `project_id`, `category_id`, `sub_category_id`, `description`, `drg_number`, `passed_date`, `revision`, `revision_date`, `added_by`, `added_on`, `updated_by`, `updated_on`, `is_active`, `is_delete`) VALUES
	(1, 10, 1, 0, 'This is a testing.\r\nPlease ignore.', 'Test-001', '2024-11-01', '0', NULL, 11, '2024-11-06 00:00:00', NULL, NULL, 'Y', 'N'),
	(2, 1, 3, 2, 'This is another testing.\r\nPlease ignore it.', 'Test-002', NULL, '0', NULL, 1, '2024-11-06 00:00:00', NULL, NULL, 'Y', 'N'),
	(3, 2, 3, 4, 'Testing', 'Test-003', '2024-11-04', '0', NULL, 1, '2024-11-06 00:00:00', NULL, NULL, 'Y', 'N'),
	(4, 4, 4, 1, 'Test Drawing.', 'Test-004', '2024-11-04', '0', '2024-11-05', 1, '2024-11-06 00:00:00', NULL, NULL, 'Y', 'N'),
	(5, 7, 5, 3, 'Test Image.', 'Test-007', '2024-11-01', '0', '2024-11-03', 1, '2024-11-06 00:00:00', NULL, NULL, 'Y', 'N'),
	(6, 10, 2, 0, 'Test again', 'Test-005', NULL, '0', NULL, 11, '2024-11-06 00:00:00', NULL, NULL, 'Y', 'N');

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for drawing files';

-- Dumping data for table db_drawing_archive.tbl_drawing_docs: ~11 rows (approximately)
INSERT IGNORE INTO `tbl_drawing_docs` (`id`, `drawing_id`, `file_type`, `file_category`, `original_file_name`, `uploaded_file_name`) VALUES
	(1, 1, 'PNG', 'IMAGE', 'Test-image.png', '1730879484377.png'),
	(2, 1, 'PDF', 'PDF', 'Test-pdf.pdf', '1730879484379.pdf'),
	(3, 1, 'DWG', 'DRAWING', 'Test-file.dwg', '1730879484392.dwg'),
	(4, 2, 'PNG', 'IMAGE', 'Test-image.png', '1730879609410.png'),
	(5, 2, 'PDF', 'PDF', 'Test-pdf.pdf', '1730879609411.pdf'),
	(6, 2, 'DWG', 'DRAWING', 'Test-file.dwg', '1730879609415.dwg'),
	(7, 3, 'PDF', 'PDF', '01-10-2024==counter1.pdf', '1730880803991.pdf'),
	(8, 4, 'DWG', 'DRAWING', 'MDM-105-02(1).dwg', '1730887705967.dwg'),
	(9, 5, 'PNG', 'IMAGE', 'Untitled design (1).png', '1730887761469.png'),
	(10, 6, 'PNG', 'IMAGE', 'Test-image.png', '1730890838661.png'),
	(11, 6, 'PDF', 'PDF', 'Test-pdf.pdf', '1730890838663.pdf');

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for projects';

-- Dumping data for table db_drawing_archive.tbl_projects: ~18 rows (approximately)
INSERT IGNORE INTO `tbl_projects` (`id`, `name`, `code`, `location`, `state`, `description`, `is_active`) VALUES
	(1, 'Project 1', 'PRO-10001', 'India', 'Andhra Pradesh', 'one', 'Y'),
	(2, 'Project 2', 'PRO-10002', 'India', 'Arunachal Pradesh', '', 'Y'),
	(3, 'Project 3', 'PRO-10003', 'India', 'Bihar', '', 'Y'),
	(4, 'Project 4', 'PRO-10004', 'India', 'Goa', 'Test', 'Y'),
	(5, 'Project 5', 'PRO-10005', 'India', 'Gujarat', '', 'Y'),
	(6, 'Project 6', 'PRO-10006', 'India', 'Himachal Pradesh', '', 'Y'),
	(7, 'Project 7', 'PRO-10007', 'India', 'Jharkhand', '', 'Y'),
	(8, 'Project 8', 'PRO-10008', 'India', 'Karnataka', 'Kesia Project', 'Y'),
	(9, 'Project 9', 'PRO-10009', 'India', 'Madhya Pradesh', '', 'Y'),
	(10, 'Project 10', 'PRO-10010', 'India', 'West Bengal', '', 'Y'),
	(11, 'Project 11', 'PRO-10011', 'India', 'Rajasthan', '', 'N'),
	(12, 'Project 12', 'PRO-10012', 'India', 'Uttarakhand', '', 'Y'),
	(13, 'Project 13', 'PRO-10013', 'India', 'Manipur', '', 'Y'),
	(14, 'Project 14', 'PRO-10014', 'India', 'Odisha', '', 'Y'),
	(15, 'Project 15', 'PRO-10015', 'India', 'Jammu and Kashmir', '', 'N'),
	(16, 'Project 16', 'PRO-10016', 'India', 'Meghalaya', '', 'Y'),
	(17, 'Project 17', 'PRO-10017', 'Digha', 'West Bengal', 'This is a testing.\nPlease ignore it.', 'Y'),
	(18, 'Project 18', 'PRO-10018', 'KOLKATA', 'Jammu and Kashmir', 'new projectjyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy yyyyyjttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt', 'Y');

-- Dumping structure for table db_drawing_archive.tbl_roles
CREATE TABLE IF NOT EXISTS `tbl_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  KEY `KEY` (`is_active`),
  FULLTEXT KEY `FULLTEXT` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for roles';

-- Dumping data for table db_drawing_archive.tbl_roles: ~2 rows (approximately)
INSERT IGNORE INTO `tbl_roles` (`id`, `name`, `is_active`) VALUES
	(1, 'Chairman', 'Y'),
	(2, 'Chairman New', 'Y');

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
INSERT IGNORE INTO `tbl_sub_categories` (`id`, `name`, `is_active`) VALUES
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for users';

-- Dumping data for table db_drawing_archive.tbl_users: ~7 rows (approximately)
INSERT IGNORE INTO `tbl_users` (`id`, `role_id`, `name`, `email`, `password`, `is_admin`, `is_active`, `is_delete`) VALUES
	(1, 0, 'Admin User', 'admin@dril.net.in', '$2b$10$.h3GzwdfQwga6jacs1EzTO5l11uasElTAy/GQrLydFXz87HpwagE6', 'Y', 'Y', 'N'),
	(11, 1, 'AM', 'am@dril.com', '$2b$10$P8Ao2iqvBsCkA3eafZ4gkuTqr3cnv423l5gFiZV0prmqAIgjfNKgG', 'N', 'Y', 'N'),
	(12, 2, 'RS', 'rs@dril.com', '$2b$10$E0FbMgHd7P9DM3fWzREbVegSucUnenDlK48erTRktAOZB.HAyWytK', 'N', 'Y', 'N'),
	(13, 2, 'SN', 'sn@dril.com', '$2b$10$kaN9xyMP19hWgOaM2swRnurOMAHfwpckROqw45lDSqxg7iu7.cLRm', 'N', 'Y', 'Y'),
	(14, 1, 'SN Test 1', 'sn@dril.com', '$2b$10$donrwhIUHpK8A/3D5yWBu.zaK/FfprM9fEsp8pLrR91AtCzkWR15q', 'N', 'Y', 'Y'),
	(15, 2, 'Test', 'sn@dril.com', '$2b$10$8JtvdUEL7pjyWNMi/Kvs3uIO6Au3Gw7bbJBHLlPuXXzxwSTH/5qg2', 'N', 'Y', 'N'),
	(16, 2, 'Subhadip', 'anything@gmail.com', '$2b$10$aSdeJSZLeOLSWqPHqDqf1eEke0BANO.6BsVdZC5pZvyYU3d.xROqe', 'N', 'Y', 'N');

-- Dumping structure for table db_drawing_archive.tbl_user_project_mapping
CREATE TABLE IF NOT EXISTS `tbl_user_project_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `can_view` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_add` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_edit` enum('Y','N') NOT NULL DEFAULT 'N',
  `can_download` enum('Y','N') NOT NULL DEFAULT 'N',
  KEY `PRIMARY KEY` (`id`) USING BTREE,
  KEY `KEY` (`user_id`,`project_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_drawing_archive.tbl_user_project_mapping: ~7 rows (approximately)
INSERT IGNORE INTO `tbl_user_project_mapping` (`id`, `user_id`, `project_id`, `can_view`, `can_add`, `can_edit`, `can_download`) VALUES
	(1, 11, 1, 'Y', 'N', 'N', 'N'),
	(2, 11, 10, 'Y', 'Y', 'Y', 'Y'),
	(3, 11, 2, 'N', 'N', 'N', 'N'),
	(4, 16, 10, 'Y', 'N', 'N', 'N'),
	(5, 12, 1, 'Y', 'N', 'N', 'N'),
	(6, 12, 10, 'Y', 'N', 'Y', 'N'),
	(7, 12, 12, 'Y', 'N', 'N', 'N');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

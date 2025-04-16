-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: asta_dev
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

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

BEGIN;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `name2` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `extra` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`client_id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_summary`
--

DROP TABLE IF EXISTS `inventory_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_summary` (
  `item_no` varchar(255) NOT NULL,
  `actual_inventory` int NOT NULL DEFAULT '0',
  `quantity_on_orders` int NOT NULL DEFAULT '0',
  `quantity_reserved` int NOT NULL DEFAULT '0',
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_no`),
  CONSTRAINT `inventory_summary_ibfk_1` FOREIGN KEY (`item_no`) REFERENCES `products` (`item_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invoice_headers`
--

DROP TABLE IF EXISTS `invoice_headers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_headers` (
  `invoice_no` int NOT NULL AUTO_INCREMENT,
  `order_no` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`invoice_no`),
  KEY `order_no` (`order_no`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `invoice_headers_ibfk_1` FOREIGN KEY (`order_no`) REFERENCES `orders` (`order_no`),
  CONSTRAINT `invoice_headers_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`username`@`localhost`*/ /*!50003 TRIGGER `update_order_on_new_invoice` AFTER INSERT ON `invoice_headers` FOR EACH ROW BEGIN
  UPDATE `orders`
  SET `has_invoice` = TRUE
  WHERE `order_no` = NEW.`order_no`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `invoice_lines`
--

DROP TABLE IF EXISTS `invoice_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_lines` (
  `invoice_no` int NOT NULL,
  `order_no` int NOT NULL,
  `line_no` int NOT NULL,
  KEY `order_no` (`order_no`,`line_no`),
  CONSTRAINT `invoice_lines_ibfk_1` FOREIGN KEY (`order_no`, `line_no`) REFERENCES `orders_list` (`order_no`, `line_no`),
  CONSTRAINT `invoice_lines_ibfk_2` FOREIGN KEY (`order_no`) REFERENCES `orders` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_entries`
--

DROP TABLE IF EXISTS `item_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_entries` (
  `entry_no` int NOT NULL AUTO_INCREMENT,
  `whs_id` int DEFAULT NULL,
  `transaction_id` int DEFAULT NULL,
  `type` int NOT NULL,
  `item_no` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `cost` decimal(10,2) DEFAULT '0.00',
  `document_no` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`entry_no`),
  KEY `transaction_id` (`transaction_id`),
  KEY `type` (`type`),
  KEY `item_no` (`item_no`),
  KEY `fk_item_entry_whs` (`whs_id`),
  CONSTRAINT `fk_item_entry_whs` FOREIGN KEY (`whs_id`) REFERENCES `warehouse_locations` (`whs_id`),
  CONSTRAINT `item_entries_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  CONSTRAINT `item_entries_ibfk_2` FOREIGN KEY (`type`) REFERENCES `item_entry_types` (`id`),
  CONSTRAINT `item_entries_ibfk_3` FOREIGN KEY (`item_no`) REFERENCES `products` (`item_no`)
) ENGINE=InnoDB AUTO_INCREMENT=466 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_entries_attr`
--

DROP TABLE IF EXISTS `item_entries_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_entries_attr` (
  `entry_no` int NOT NULL,
  `attr_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`entry_no`,`attr_id`),
  KEY `attr_id` (`attr_id`),
  CONSTRAINT `item_entries_attr_ibfk_1` FOREIGN KEY (`entry_no`) REFERENCES `item_entries` (`entry_no`),
  CONSTRAINT `item_entries_attr_ibfk_2` FOREIGN KEY (`attr_id`) REFERENCES `products_attr` (`attr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_entry_types`
--

DROP TABLE IF EXISTS `item_entry_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_entry_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_no` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `name2` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `required_date` date DEFAULT NULL,
  `quote` tinyint(1) DEFAULT '0',
  `priority` int DEFAULT '0',
  `consolidated` tinyint(1) DEFAULT '0',
  `has_invoice` tinyint(1) DEFAULT '0',
  `posted` tinyint NOT NULL DEFAULT '0',
  `tax_region` varchar(255) NOT NULL,
  `extra` varchar(255) DEFAULT NULL,
  `created_by` int NOT NULL,
  PRIMARY KEY (`order_no`),
  KEY `client_id` (`client_id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders_list`
--

DROP TABLE IF EXISTS `orders_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_list` (
  `order_no` int NOT NULL,
  `line_no` int NOT NULL,
  `whs_id` int DEFAULT '1',
  `item_no` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `discount` decimal(8,2) DEFAULT '0.00',
  `unit_price` decimal(8,2) NOT NULL,
  `shipped` tinyint NOT NULL DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `posted` tinyint(1) DEFAULT '0',
  `status` int DEFAULT '3',
  PRIMARY KEY (`order_no`,`line_no`),
  KEY `item_no` (`item_no`),
  KEY `fk_status` (`status`),
  KEY `fk_order_line_whs` (`whs_id`),
  CONSTRAINT `fk_order_line_whs` FOREIGN KEY (`whs_id`) REFERENCES `warehouse_locations` (`whs_id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status`) REFERENCES `orders_list_line_status` (`id`),
  CONSTRAINT `orders_list_ibfk_1` FOREIGN KEY (`order_no`) REFERENCES `orders` (`order_no`),
  CONSTRAINT `orders_list_ibfk_2` FOREIGN KEY (`item_no`) REFERENCES `products` (`item_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders_list_line_attr`
--

DROP TABLE IF EXISTS `orders_list_line_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_list_line_attr` (
  `order_no` int NOT NULL,
  `line_no` int NOT NULL,
  `attr_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_no`,`line_no`,`attr_id`),
  CONSTRAINT `orders_list_line_attr_ibfk_1` FOREIGN KEY (`order_no`, `line_no`) REFERENCES `orders_list` (`order_no`, `line_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders_list_line_status`
--

DROP TABLE IF EXISTS `orders_list_line_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_list_line_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders_list_priority`
--

DROP TABLE IF EXISTS `orders_list_priority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_list_priority` (
  `order_no` int NOT NULL,
  `line_no` int NOT NULL,
  `item_no` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `order_priority` int NOT NULL,
  PRIMARY KEY (`order_no`,`line_no`),
  KEY `item_no` (`item_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_entries`
--

DROP TABLE IF EXISTS `payment_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_entries` (
  `entry_no` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `order_no` int NOT NULL,
  `client_id` int NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_method` int NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`entry_no`),
  KEY `transaction_id` (`transaction_id`),
  KEY `order_no` (`order_no`),
  KEY `client_id` (`client_id`),
  KEY `payment_method` (`payment_method`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `item_no` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `pp_thousand` decimal(10,2) NOT NULL DEFAULT '0.00',
  `thickness` decimal(10,2) NOT NULL,
  `width` decimal(10,2) NOT NULL,
  `length` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`item_no`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`username`@`localhost`*/ /*!50003 TRIGGER `after_product_insert` AFTER INSERT ON `products` FOR EACH ROW INSERT INTO inventory_summary (item_no)
    VALUES (NEW.item_no) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `products_attr`
--

DROP TABLE IF EXISTS `products_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_attr` (
  `attr_id` int NOT NULL AUTO_INCREMENT,
  `attr_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservation_entries`
--

DROP TABLE IF EXISTS `reservation_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_entries` (
  `entry_no` int NOT NULL AUTO_INCREMENT,
  `order_no` int NOT NULL,
  `line_no` int NOT NULL,
  `quantity_reserved` int DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`entry_no`),
  KEY `order_no` (`order_no`,`line_no`)
) ENGINE=InnoDB AUTO_INCREMENT=338 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schedulers`
--

DROP TABLE IF EXISTS `schedulers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedulers` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `interval_ms` bigint DEFAULT NULL,
  `run_times` json DEFAULT NULL,
  `last_run` datetime DEFAULT NULL,
  `next_run` datetime DEFAULT NULL,
  `last_log` text,
  `last_error` text,
  `priority` int DEFAULT '1',
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxes`
--

DROP TABLE IF EXISTS `taxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `region` varchar(255) NOT NULL,
  `pst` decimal(6,3) NOT NULL,
  `gst` decimal(6,3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_header`
--

DROP TABLE IF EXISTS `transaction_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_header` (
  `transaction_type` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `payment_method` int DEFAULT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `quote` tinyint(1) DEFAULT '0',
  `tax_region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `extra` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`created_by`),
  KEY `transaction_type` (`transaction_type`),
  KEY `client_id` (`client_id`),
  KEY `fk_payment_method` (`payment_method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_lines`
--

DROP TABLE IF EXISTS `transaction_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_lines` (
  `line_no` int NOT NULL,
  `whs_id` int DEFAULT '1',
  `item_no` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `disc_perc` decimal(4,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`line_no`,`created_by`),
  KEY `item_no` (`item_no`),
  KEY `created_by` (`created_by`),
  KEY `fk_transaction_line_whs` (`whs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_lines_attr`
--

DROP TABLE IF EXISTS `transaction_lines_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_lines_attr` (
  `line_no` int NOT NULL,
  `attr_id` int NOT NULL,
  `created_by` int NOT NULL,
  PRIMARY KEY (`line_no`,`attr_id`,`created_by`),
  KEY `line_no` (`line_no`,`created_by`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_types`
--

DROP TABLE IF EXISTS `transaction_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `order_no` int NOT NULL,
  `type` int NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `order_no` (`order_no`),
  KEY `type` (`type`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_pin` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_locations`
--

DROP TABLE IF EXISTS `warehouse_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_locations` (
  `whs_id` int NOT NULL AUTO_INCREMENT,
  `whs_name` varchar(255) NOT NULL,
  PRIMARY KEY (`whs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_session_header`
--

DROP TABLE IF EXISTS `work_session_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_session_header` (
  `session_no` int NOT NULL AUTO_INCREMENT,
  `whs_id` int DEFAULT '1',
  `posted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `posted_at` datetime DEFAULT NULL,
  `created_by` int NOT NULL,
  PRIMARY KEY (`session_no`),
  KEY `created_by` (`created_by`),
  KEY `fk_work_header_whs` (`whs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_session_line_attr`
--

DROP TABLE IF EXISTS `work_session_line_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_session_line_attr` (
  `line_no` int NOT NULL,
  `session_no` int NOT NULL,
  `attr_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`line_no`,`session_no`,`attr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_session_lines`
--

DROP TABLE IF EXISTS `work_session_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_session_lines` (
  `line_no` int NOT NULL,
  `session_no` int NOT NULL,
  `item_no` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  PRIMARY KEY (`line_no`,`session_no`),
  KEY `session_no` (`session_no`),
  KEY `item_no` (`item_no`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_table_v2`
--

DROP TABLE IF EXISTS `work_table_v2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_table_v2` (
  `line_no` int NOT NULL AUTO_INCREMENT,
  `item_no` varchar(255) NOT NULL,
  `quantity_required` int NOT NULL DEFAULT '0',
  `quantity_quote` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`line_no`),
  UNIQUE KEY `item_no` (`item_no`)
) ENGINE=InnoDB AUTO_INCREMENT=10241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

COMMIT;

-- Dump completed on 2025-04-16 18:30:57
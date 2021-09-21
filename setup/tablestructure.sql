-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: finance
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts_table`
--

DROP TABLE IF EXISTS `accounts_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `plaid_account_id` varchar(127) NOT NULL,
  `name` varchar(127) NOT NULL,
  `official_name` varchar(127) DEFAULT NULL,
  `type` varchar(127) NOT NULL,
  `subtype` varchar(127) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `plaid_account_id_UNIQUE` (`plaid_account_id`),
  KEY `fk_account_user_idx` (`user_id`),
  KEY `fk_Account_item_idx` (`item_id`),
  CONSTRAINT `fk_account_item` FOREIGN KEY (`item_id`) REFERENCES `items_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_account_user` FOREIGN KEY (`user_id`) REFERENCES `users_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `areas_table`
--

DROP TABLE IF EXISTS `areas_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL,
  `input` tinyint NOT NULL DEFAULT '0',
  `description` varchar(127) NOT NULL,
  `color` char(7) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  UNIQUE KEY `color_UNIQUE` (`color`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `items_table`
--

DROP TABLE IF EXISTS `items_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `plaid_item_id` varchar(127) NOT NULL,
  `access_token` varchar(127) NOT NULL,
  `institution_name` varchar(127) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `plaid_item_id_UNIQUE` (`plaid_item_id`),
  UNIQUE KEY `access_token_UNIQUE` (`access_token`),
  KEY `fk_item_user_idx` (`user_id`),
  CONSTRAINT `fk_item_user` FOREIGN KEY (`user_id`) REFERENCES `users_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions_table`
--

DROP TABLE IF EXISTS `transactions_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `plaid_transaction_id` varchar(127) DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `item_id` int unsigned DEFAULT NULL,
  `parent_id` int unsigned DEFAULT NULL,
  `area_id` int unsigned DEFAULT NULL,
  `name` varchar(127) NOT NULL,
  `amount` decimal(28,10) NOT NULL,
  `date` date NOT NULL,
  `source` varchar(127) NOT NULL,
  `type` varchar(127) DEFAULT NULL,
  `memo` varchar(266) DEFAULT NULL,
  `pending` tinyint NOT NULL,
  `hidden` tinyint NOT NULL DEFAULT '0',
  `manual` tinyint NOT NULL DEFAULT '0',
  `split` tinyint NOT NULL DEFAULT '0',
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `plaid_transaction_id_UNIQUE` (`plaid_transaction_id`),
  KEY `fk_transaction_user_idx` (`user_id`),
  KEY `fk_transaction_item_idx` (`item_id`),
  KEY `fk_transaction_area_idx` (`area_id`),
  KEY `fk_parent_transaction` (`parent_id`),
  CONSTRAINT `fk_parent_transaction` FOREIGN KEY (`parent_id`) REFERENCES `transactions_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_area` FOREIGN KEY (`area_id`) REFERENCES `areas_table` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_item` FOREIGN KEY (`item_id`) REFERENCES `items_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`user_id`) REFERENCES `users_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16954 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_table`
--

DROP TABLE IF EXISTS `users_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-09-21 15:19:38

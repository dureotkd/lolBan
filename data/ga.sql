/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.5.5-10.1.37-MariaDB : Database - ban
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ban` /*!40100 DEFAULT CHARACTER SET utf32 */;

USE `ban`;

/*Table structure for table `game` */

DROP TABLE IF EXISTS `game`;

CREATE TABLE `game` (
  `seq` int(12) NOT NULL AUTO_INCREMENT,
  `blueName` varchar(100) NOT NULL DEFAULT '',
  `redName` varchar(100) NOT NULL DEFAULT '',
  `blueEnName` varchar(255) NOT NULL DEFAULT '',
  `redEnName` varchar(255) NOT NULL DEFAULT '',
  `matchName` varchar(100) NOT NULL DEFAULT '',
  `matchEnName` varchar(255) NOT NULL DEFAULT '',
  `regDate` datetime NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `game` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

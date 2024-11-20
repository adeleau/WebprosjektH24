-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: mysql.stud.ntnu.no
-- Generation Time: 20. Nov, 2024 11:22 AM
-- Tjener-versjon: 8.0.40-0ubuntu0.22.04.1
-- PHP Version: 7.4.3-4ubuntu2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fs_dcst2002_1_gruppe3_dev`
--

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `AngelHistory`
--

CREATE TABLE `AngelHistory` (
  `angelhistory_id` int NOT NULL,
  `angel_id` int NOT NULL,
  `description` text,
  `user_id` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Angels`
--

CREATE TABLE `Angels` (
  `angel_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `image` text,
  `release_year` int DEFAULT NULL,
  `views` int DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `series_id` int DEFAULT NULL,
  `valid_from` datetime DEFAULT CURRENT_TIMESTAMP,
  `valid_to` datetime DEFAULT '9999-12-31 23:59:59'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Angels`
--

INSERT INTO `Angels` (`angel_id`, `name`, `description`, `image`, `release_year`, `views`, `user_id`, `created_at`, `series_id`, `valid_from`, `valid_to`) VALUES
(1, 'Lesser Panda', 'An angel boy wearing a lesser panda hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_lesserpanda_01-1.jpg', 2018, 8, NULL, '2024-11-08 09:35:32', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(17, 'Mouse', 'An angel boy wearing a mouse hat, from the Animal Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_mouse_01-1.jpg', 2018, 6, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(18, 'Hedgegog', 'An angel boy wearing a hedgehog hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_hedghog_01-1.jpg', 2018, 38, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(19, 'Fawn', 'An angel boy wearing a fawn hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_fawn_01-1.jpg', 2018, 13, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(20, 'Duck', 'An angel boy wearing a duck, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_duck_01-1.jpg', 2015, 23, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(21, 'Cow', 'An angel boy wearing a cow hat, from the Animal Series. Mooo!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', 2018, 45, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(23, 'Uribou', 'An angel boy wearing an uribou hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_uribou_01-1.jpg', 2018, 10, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(24, 'Skunk', 'An angel boy wearing a skunk hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_skunk_01-1.jpg', 2018, 3, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(25, 'Sheep', 'An angel boy wearing a sheep hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_sheep_01-1.jpg', 2018, 25, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(26, 'Reindeer', 'An angel boy wearing a reindeer hat, from the Animal Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_reindeer_01-1.jpg', 2018, 4, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(27, 'Pig', 'An angel boy wearing a pig hat, from the Animal, Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_pig_01-1.jpg', 2018, 2, NULL, '2024-11-11 13:54:33', 1, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(28, 'Carrot', 'An angel boy wearing a carrot hat, from the Vegetable Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Carrot.png', 2019, 0, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(29, 'Tomato', 'An angel boy wearing a tomato hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Tomato.png', 2019, 0, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(30, 'Garlic', 'An angel boy wearing a garlic hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Garlic.png', 2019, 13, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(31, 'Zucchini', 'An angel boy wearing a zucchini, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Zucchini.png', 2019, 8, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(32, 'Onion', 'An angel boy wearing an onion hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Onion.png', 2019, 126, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(33, 'Radish', 'An angel boy wearing a radish hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Radish.png', 2019, 0, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(34, 'GreenPepper', 'An angel boy wearing an green pepper hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/GreenPepper.png', 2019, 0, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(35, 'Eggplant', 'An angel boy wearing a eggplant hat from, the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Eggplant.png', 2019, 10, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(36, 'BokChoy', 'An angel boy wearing a bok choy hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/BokChoy.png', 2019, 28, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(37, 'Corn', 'An angel boy wearing a corn hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Corn.png', 2019, 0, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(38, 'Cauliflower', 'An angel boy wearing a cauliflower hat, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Cauliflower.png', 2019, 0, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(39, 'Cabbage', 'An angel boy wearing a cabbage, from the Vegetable Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Cabbage.png', 2019, 1, NULL, '2024-11-11 14:10:51', 2, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(40, 'Shark', 'An angel boy wearing a shark hat, from the Marine Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Shark.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(41, 'Jellyfish', 'An angel boy wearing a jellyfish hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Jellyfish.png', 2019, 2, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(42, 'Dolphin', 'An angel boy wearing a dolphin hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Dolphin.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(43, 'Seal', 'An angel boy wearing a seal, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Seal.png', 2019, 1, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(44, 'Seahorse', 'An angel boy wearing an onion hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Seahorse.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(45, 'Whale', 'An angel boy wearing a whale hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Whale.png', 2019, 5, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(46, 'Clownfish', 'An angel boy wearing an clownfish hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Clownfish.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(48, 'Penguin', 'An angel boy wearing a penguin hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Penguin.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(49, 'Manta', 'An angel boy wearing a manta hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Manta.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(50, 'Blowfish', 'An angel boy wearing a blowfish hat, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Blowfish.png', 2019, 1, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(51, 'Starfish', 'An angel boy wearing a starfish, from the Marine Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Starfish.png', 2019, 0, NULL, '2024-11-11 14:24:46', 3, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(52, 'Raspberry', 'An angel boy wearing a raspberry hat, from the Fruit Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Raspberry.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(53, 'Peach', 'An angel boy wearing a peach hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Peach.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(54, 'Orange', 'An angel boy wearing an orange hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Orange.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(55, 'Pear', 'An angel boy wearing a pear hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Pear.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(56, 'Strawberry', 'An angel boy wearing a strawberry hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Strawberry.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(57, 'Grape', 'An angel boy wearing a grape hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Grape.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(58, 'Watermelon', 'An angel boy wearing a watermelon hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Watermelon.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(59, 'Melon', 'An angel boy wearing a melon hat from, the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Melon.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(60, 'Durian', 'An angel boy wearing a durian hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Durian.png', 2019, 9, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(61, 'DragonFruit', 'An angel boy wearing a dragonfruit hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/DragonFruit.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(62, 'Pinapple', 'An angel boy wearing a pinapple hat, from the Fruit Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Pineapple.png', 2019, 0, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(63, 'Apple', 'An angel boy wearing an apple hat, from the Fruit Series. Yum', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', 2019, 32, NULL, '2024-11-11 14:37:08', 4, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(64, 'Rose', 'An angel boy wearing a rose hat, from the Flower Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Rose.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(65, 'CherryBlossom', 'An angel boy wearing a cherry blossom hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/CherryBlossom.png', 2019, 7, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(66, 'Poppy', 'An angel boy wearing a poppy hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Poppy.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(67, 'Sunflower', 'An angel boy wearing a sunflower hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Sunflower.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(68, 'Cactus', 'An angel boy wearing a cactus hat, from the flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Cactus.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(69, 'MorningGlory', 'An angel boy wearing a morningglory hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/MorningGlory.png', 2019, 1, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(70, 'LilyBell', 'An angel boy wearing a lilybell hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/LilyBell.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(71, 'Hybrangea', 'An angel boy wearing a hybrangea hat from, the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Hybrangea.png', 2019, 22, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(72, 'Pansy', 'An angel boy wearing a pansy hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Pansy.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(73, 'Carnation', 'An angel boy wearing a carnation hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Carnarion.png', 2019, 5, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(74, 'Acorn', 'An angel boy wearing an acorn hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Acorn.png', 2019, 3, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(75, 'Tulip', 'An angel boy wearing a tulip hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/10/Tulip.png', 2019, 0, NULL, '2024-11-11 14:51:47', 5, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(76, 'Cream Puff', 'An angel boy wearing a cream puff hat, from the Sweets Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_creampuff_01.jpg', 2018, 2, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(77, 'Cupcake', 'An angel boy wearing a cupcake hat, from the Flower Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_cupcake_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(78, 'Fruit Tart', 'An angel boy wearing a fruit tart hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_fruittart_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(79, 'Ice Creams', 'An angel boy wearing a ice cream hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_icecreams_01.jpg', 2018, 8, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(80, 'Jelly Beans', 'An angel boy wearing a jelly bean hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_jellybeans_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(81, 'Konpeinto', 'An angel boy wearing a konpeinto hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_konpeito_01.jpg', 2018, 12, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(82, 'Pancake', 'An angel boy wearing a pancake hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_pancake_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(83, 'Popcorn', 'An angel boy wearing a popcorn hat from, the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_popcorn_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(84, 'Pudding', 'An angel boy wearing a pudding hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_pudding_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(85, 'Candy', 'An angel boy wearing a candy hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(86, 'Cookie', 'An angel boy wearing a cookie hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_cookie_01.jpg', 2018, 39, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(87, 'Strawberry Shortcake', 'An angel boy wearing a strawberry shortcake hat, from the Sweets Series', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_strawberryshortcake_01.jpg', 2018, 0, NULL, '2024-11-11 15:02:32', 6, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(88, 'Calico', 'An angel boy wearing a calico cat costume, from Cat Life.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/calico.png', 2023, 0, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(89, 'Silver tabby', 'An angel boy wearing a silver tabby costume, from Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/silver_tabby.png', 2023, 2, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(90, 'Tuxedo', 'An angel boy wearing a tuxedo cat costume, from Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/tuxedo.png', 2023, 0, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(91, 'Siamese', 'An angel boy wearing a siamese cat costume, from the Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/siamese.png', 2023, 0, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(92, 'White', 'An angel boy wearing a white cat costume, from Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/white.png', 2023, 0, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(93, 'Brown&Black', 'An angel boy wearing a brown and black cat costume holding a fish, from Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/brown_and_black.png', 2023, 3, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(94, 'Bluish gray', 'An angel boy wearing a blush gray cat cosume holding cat food, from Cat Life. meow', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/bluish_gray.png', 2023, 5, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(95, 'Red Tabby', 'An angel boy wearing a red tabby cat costume holding milk, from Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/red_tabby.png', 2023, 0, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(96, 'Black', 'An angel boy wearing a black cat costume holding chicken, from Cat Life', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/05/black.png', 2023, 5, NULL, '2024-11-11 15:11:42', 7, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(97, 'Tyrannosaurus', 'An angel boy wearing a tyrannosaurus costume, from Dinosaur. Rawr!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/07/Tyrannosaurus.png', 2024, 0, NULL, '2024-11-11 15:19:04', 8, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(98, 'Stegosaurus', 'An angel boy wearing a stegosaurus costume, from Dinosaur. Rawr!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/07/Stegosaurus.png', 2024, 0, NULL, '2024-11-11 15:19:04', 8, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(99, 'Triceratops', 'An angel boy wearing a triceratops, from Dinosaur. Rawr!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/07/Triceratops.png', 2024, 0, NULL, '2024-11-11 15:19:04', 8, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(100, 'Brachiosaurus', 'An angel boy wearing a brachiosaurus costume, from Dinosaur. Rawr!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/07/Brachiosaurus.png', 2024, 2, NULL, '2024-11-11 15:19:04', 8, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(102, 'Spinosaurus', 'An angel boy wearing a spinosaurus costume, from Dinosaur. Rawr!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/07/Spinosaurus.png', 2024, 0, NULL, '2024-11-11 15:19:04', 8, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(104, 'Church Bell', 'An angel boy wearing a curch bell costume, from the Christmas Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/11/sa_xmas2018_01.jpg', 2018, 0, NULL, '2024-11-11 15:29:14', 14, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(105, 'Classic Reindeer', 'An angel boy wearing a classic reindeer costume, from the Christmas Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/11/sa_xmas2018_04.jpg', 2018, 1, NULL, '2024-11-11 15:29:14', 14, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(106, 'Classic Santa', 'An angel boy wearing a classic santa costume, from the Christmas Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/11/sa_xmas2018_03.jpg', 2018, 2, NULL, '2024-11-11 15:29:14', 14, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(107, 'Chocolate Elephant', 'An angel boy wearing a chocolate elephant costume, from the Valentine Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/cache/2019/12/chocolate_elephant/2515489891.png', 2019, 0, NULL, '2024-11-11 15:35:10', 9, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(108, 'Chocolate Rabbit', 'An angel boy wearing a chocolate rabbit costume, from the Valentine Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/12/chocolate_rabbit.png', 2019, 0, NULL, '2024-11-11 15:35:10', 9, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(109, 'Chocolate Frenchie', 'An angel boy wearing a chocolate frenchie costume, from the Valentine Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/12/chocolate_french_bulldog.png', 2019, 0, NULL, '2024-11-11 15:35:10', 9, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(110, 'Chocolate Cat', 'An angel boy wearing a chocolate cat costume, from the Valentine Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/12/chocolate_cat.png', 2019, 0, NULL, '2024-11-11 15:35:10', 9, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(111, 'Ladybug', 'An angel boy wearing a ladybug costume, from Bugs World.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/ladybug.png', 2022, 0, NULL, '2024-11-11 15:45:38', 10, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(112, 'Dragonfly', 'An angel boy wearing a chocolate rabbit costume, from Bugs World.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/dragonfly.png', 2022, 21, NULL, '2024-11-11 15:45:38', 10, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(113, 'Ant', 'An angel boy wearing an ant costume', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/ant.png', 2022, 19, NULL, '2024-11-11 15:45:38', 10, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(114, 'Butterfly', 'An angel boy wearing a butterfly costume, from Bugs World.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/butterfly.png', 2022, 16, NULL, '2024-11-11 15:45:38', 10, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(115, 'Snail', 'An angel boy wearing a snail costume, from Bugs World.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/snail.png', 2022, 0, NULL, '2024-11-11 15:45:38', 10, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(116, 'Caterpillar', 'An angel boy wearing a caterpillar costume, from Bugs World.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/caterpillar.png', 2022, 13, NULL, '2024-11-11 15:45:38', 10, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(117, 'Shiba Inu', 'An angel boy wearing a Shiba inu costume, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Shiba_Inu.png', 2024, 1, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(118, 'French Bull Dog', 'An angel boy wearing a French Bull Dog costume holding a bone, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/French_Bull_Dog.png', 2024, 27, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(119, 'Dalmatian', 'An angel boy wearing a Dalmatian costume, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Dalmatian.png', 2024, 0, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(120, 'Toy Poodle', 'An angel boy wearing a Toy Poodle costume, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Toy_Poodle.png', 2024, 0, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(121, 'Dachshund', 'An angel boy wearing a Dachshund costume holding dog food, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Dachshund.png', 2024, 14, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(122, 'Pomeranian', 'An angel boy wearing a Pomeranian costume, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Pomeranian.png', 2024, 0, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(123, 'Chihuahua', 'An angel boy wearing a Chihuahua costume holding a tennis ball, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Chihuahua.png', 2024, 0, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(124, 'Pug', 'An angel boy wearing a Pug costume holding a dog frisbee, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Pug.png', 2024, 0, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(125, 'Beagle', 'An angel boy wearing a Beagle costume, from Dog Time.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2024/09/Beagle.png', 2024, 0, NULL, '2024-11-11 15:55:36', 11, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(147, 'Witch', 'An angel boy wearing a witch costume holding a pumpkin basket, from the Halloween Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/witch.png', 2021, 0, NULL, '2024-11-11 16:07:02', 12, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(148, 'Pumpkin', 'An angel boy wearing a pumpkin costume, from the Halloween Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/pumpkin.png', 2021, 0, NULL, '2024-11-11 16:07:02', 12, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(149, 'Owl', 'An angel boy wearing an owl costume holding a lollipop, from the Halloween Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/owl.png', 2021, 29, NULL, '2024-11-11 16:07:02', 12, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(150, 'Ghost', 'An angel boy wearing a ghost costume holding candy, from the Halloween Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/ghost.png', 2021, 0, NULL, '2024-11-11 16:07:02', 12, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(151, 'Bat', 'An angel boy wearing a bat costume holding candy, from the Halloween Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/bat.png', 2021, 0, NULL, '2024-11-11 16:07:02', 12, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(152, 'Cat', 'An angel boy wearing a cat costume holding candy, from the Halloween Series.', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/cat.png', 2021, 0, NULL, '2024-11-11 16:07:02', 12, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(153, 'Peach Bear', 'An angel boy wearing a pink bear costume, from Candy Charm Store. This can be used as a keychain!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/12/peach-bear.png', 2023, 1, NULL, '2024-11-12 10:09:48', 13, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(154, 'Soda Pig', 'An angel boy wearing a blue pig costume, from Candy Charm Store. This can be used as a keychain!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/12/soda-pig.png', 2023, 1, NULL, '2024-11-12 10:09:48', 13, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(155, 'Orange Sheep', 'An angel boy wearing an orange sheep costume, from Candy Charm Store. This can be used as a keychain!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/12/orange-sheep.png', 2023, 0, NULL, '2024-11-12 10:09:48', 13, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(156, 'Lime Dog', 'An angel boy wearing a lime dog costume, from Candy Charm Store. This can be used as a keychain!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/12/lime-dog.png', 2023, 0, NULL, '2024-11-12 10:09:48', 13, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(157, 'Grape Rabbit', 'An angel boy wearing a purple rabbit costume, from Candy Charm Store. This can be used as a keychain!', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/12/grape-rabbit.png', 2023, 1, NULL, '2024-11-12 10:09:48', 13, '2024-11-15 18:55:55', '9999-12-31 23:59:59'),
(171, 'Shell', 'An angel boy wearing a shell hat, from the Marine Series. ', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Shell.png', 32293, 0, NULL, '2024-11-17 15:51:46', 3, '2024-11-17 16:51:46', '9999-12-31 23:59:59'),
(173, 'Chameleon', 'An angel boy wearing a chameleon hat, from the Animal Series <3', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cameleon_01-1.jpg', 2018, 158, NULL, '2024-11-17 17:45:22', 1, '2024-11-17 18:45:22', '9999-12-31 23:59:59'),
(175, 'Christmas Angel', 'An angel boy wearing a christmas angel costume, from the Christmas Series. ', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/11/sa_xmas2018_02.jpg', 2018, 98, NULL, '2024-11-17 22:48:54', 14, '2024-11-17 23:48:54', '9999-12-31 23:59:59');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Angel_comments`
--

CREATE TABLE `Angel_comments` (
  `angelcomment_id` int NOT NULL,
  `angel_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Angel_comments`
--

INSERT INTO `Angel_comments` (`angelcomment_id`, `angel_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 'Jeg elsker Sonny Angels!', '2023-11-08 11:34:56', '2024-11-12 13:19:23'),
(2, 1, 2, 'Lesser panda er supersøt!.', '2023-11-08 11:34:56', '2024-11-12 13:19:23'),
(5, 173, 1, 'Jeg ønsker meg denne!', '2024-11-17 23:31:38', '2024-11-19 17:08:29'),
(7, 73, 1, 'Min først Sonny!', '2024-11-18 00:04:48', '2024-11-18 00:04:47'),

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Collections`
--

CREATE TABLE `Collections` (
  `user_id` int NOT NULL,
  `angel_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Collections`
--

INSERT INTO `Collections` (`user_id`, `angel_id`) VALUES
(1, 27),
(1, 36),
(1, 39),
(2, 86),
(2, 93),
(3, 96),
(3, 96),
(3, 113),
(4, 116),
(4, 121),

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Posts`
--

CREATE TABLE `Posts` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` text NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Posts`
--

INSERT INTO `Posts` (`post_id`, `user_id`, `title`, `content`, `image`, `created_at`) VALUES
(37, 3, 'Hei alle!', 'Hei, jeg leter etter nye venner som elsker Sonny Angels', 'https://ih1.redbubble.net/image.5118589567.2997/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg', '2024-11-17 19:40:47'),
(44, 2, 'Jeg ønsker meg keychain', 'Vet ikke hvilken da, kanskje den blå? Den er så cute! Tips?:))', 'https://www.sonnyangel.com/renewal/wp-content/uploads/2023/12/soda-pig.png', '2024-11-18 10:29:21'),
(49, 1, 'Så søtt design', 'Den babytingen med jordbær på toppen av posts er supersøt!', '', '2024-11-20 00:09:26'),

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Series`
--

CREATE TABLE `Series` (
  `series_id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Series`
--

INSERT INTO `Series` (`series_id`, `name`) VALUES
(1, 'Animal Series🐮'),
(10, 'Bugs World🐛'),
(13, 'Candy Charm Store🍬'),
(7, 'Cat Life😽'),
(14, 'Christmas Series🎁'),
(8, 'Dinosaur Series🦖'),
(11, 'Dog Time🐶'),
(5, 'Flower Series🌺'),
(4, 'Fruit Series🍎'),
(12, 'Halloween Series🎃'),
(3, 'Marine Series🪼'),
(6, 'Sweets Series🧁'),
(9, 'Valentine Series💝'),
(2, 'Vegetable Series🥕');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Users`
--

CREATE TABLE `Users` (
  `user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('user','admin') DEFAULT 'user',
  `bio` text,
  `profile_picture` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Users`
--

INSERT INTO `Users` (`user_id`, `username`, `email`, `password_hash`, `created_at`, `role`, `bio`, `profile_picture`) VALUES
(1, 'Guro', 'gurooy@stud.ntnu.no', '123', '2024-11-08 12:03:19', 'user', 'I love sonny angels', 'https://i.ebayimg.com/images/g/ngMAAOSwDFhkeCIl/s-l1600.webp'),
(2, 'Adele', 'Adele@stud.ntnu.no', '123', '2024-11-08 12:04:00', 'admin', 'Hei, jeg elsker sonny angels', 'https://m.media-amazon.com/images/I/417LIDmHllL.SS700.jpg'),
(3, 'Julia', 'Julia@stud.ntnu.no', '123', '2024-11-08 12:04:28', 'admin', 'Jeg elsker Sonny baby', NULL),
(4, 'Emina', 'Emina@sonny.com', 'Angel123?', '2024-11-14 17:59:13', 'user', 'Hei alle', NULL),

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Wishlists`
--

CREATE TABLE `Wishlists` (
  `user_id` int NOT NULL,
  `angel_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Wishlists`
--

INSERT INTO `Wishlists` (`user_id`, `angel_id`) VALUES
(2, 21),
(2, 25),
(3, 91),
(1, 93),
(2, 105),
(3, 109),
(2, 13),
(1, 87),
(1, 45),
(3, 23),
(1, 67),
(1, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AngelHistory`
--
ALTER TABLE `AngelHistory`
  ADD PRIMARY KEY (`angelhistory_id`),
  ADD KEY `angel_id` (`angel_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Angels`
--
ALTER TABLE `Angels`
  ADD PRIMARY KEY (`angel_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `series_id` (`series_id`);

--
-- Indexes for table `Angel_comments`
--
ALTER TABLE `Angel_comments`
  ADD PRIMARY KEY (`angelcomment_id`),
  ADD KEY `angel_id` (`angel_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Collections`
--
ALTER TABLE `Collections`
  ADD PRIMARY KEY (`user_id`,`angel_id`),
  ADD KEY `Collections_ibfk_2` (`angel_id`);

--
-- Indexes for table `Posts`
--
ALTER TABLE `Posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Series`
--
ALTER TABLE `Series`
  ADD PRIMARY KEY (`series_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `Wishlists`
--
ALTER TABLE `Wishlists`
  ADD PRIMARY KEY (`user_id`,`angel_id`),
  ADD KEY `angel_id` (`angel_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AngelHistory`
--
ALTER TABLE `AngelHistory`
  MODIFY `angelhistory_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `Angels`
--
ALTER TABLE `Angels`
  MODIFY `angel_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT for table `Angel_comments`
--
ALTER TABLE `Angel_comments`
  MODIFY `angelcomment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `Posts`
--
ALTER TABLE `Posts`
  MODIFY `post_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `Series`
--
ALTER TABLE `Series`
  MODIFY `series_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Begrensninger for dumpede tabeller
--

--
-- Begrensninger for tabell `AngelHistory`
--
ALTER TABLE `AngelHistory`
  ADD CONSTRAINT `AngelHistory_ibfk_1` FOREIGN KEY (`angel_id`) REFERENCES `Angels` (`angel_id`),
  ADD CONSTRAINT `AngelHistory_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Begrensninger for tabell `Angels`
--
ALTER TABLE `Angels`
  ADD CONSTRAINT `Angels_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Angels_ibfk_2` FOREIGN KEY (`series_id`) REFERENCES `Series` (`series_id`) ON DELETE SET NULL;

--
-- Begrensninger for tabell `Angel_comments`
--
ALTER TABLE `Angel_comments`
  ADD CONSTRAINT `angel_comment_ibfk_1` FOREIGN KEY (`angel_id`) REFERENCES `Angels` (`angel_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `angel_comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Begrensninger for tabell `Collections`
--
ALTER TABLE `Collections`
  ADD CONSTRAINT `Collections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Collections_ibfk_2` FOREIGN KEY (`angel_id`) REFERENCES `Angels` (`angel_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `Wishlists`
--
ALTER TABLE `Wishlists`
  ADD CONSTRAINT `Wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Wishlists_ibfk_2` FOREIGN KEY (`angel_id`) REFERENCES `Angels` (`angel_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

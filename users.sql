-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 14, 2015 at 04:44 AM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `pizza`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`Index` int(11) NOT NULL,
  `FName` varchar(50) NOT NULL DEFAULT 'John',
  `LName` varchar(50) NOT NULL DEFAULT 'Doe',
  `Email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Index`, `FName`, `LName`, `Email`, `password`, `verified`) VALUES
(1, 'Nick', 'Perez', 'nick@nickthesick.com', 'sha256:1003:gzmmUDqNNthFXl74YREn9eT1PdIOKz5k:ngAhFfVC7Jg3aJW3IrmFujHUpImubsXD', 1),
(4, 'NICK', 'POST', 'rf@gh.co', 'sha256:1003:tYak32UQ39/jybSd3QhizKRTYNafGpPT:vWw0LFFK823st+NF79Miy1Zokp6aVkdZ', 0),
(5, 'macaroni', 'maybe', 'nick@nickthesick.c0', 'sha256:1003:5tlmI6DhifTrGKxWvJ+k2Rhd27hFB4kx:HXTtaBUFWDxCrrhFX3nx+F1wN7PgjZdd', 0),
(6, 'yo', 'maybe', 'nick@nickthesi', 'sha256:1003:5l6u4kXtIciPIhPn0gYRAbIfYoH546sB:Wd4vCVQq7vhZw80o0er8C70lKsXPHFnk', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`Index`), ADD UNIQUE KEY `email` (`Email`), ADD UNIQUE KEY `Index` (`Index`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `Index` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Create and use SCMS database
CREATE DATABASE IF NOT EXISTS SCMS;
USE SCMS;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Supplier table
CREATE TABLE IF NOT EXISTS Supplier (
  supplierCode VARCHAR(20) PRIMARY KEY,
  supplierName VARCHAR(100) NOT NULL,
  telephone VARCHAR(20),
  address VARCHAR(200),
  email VARCHAR(100)
);

-- Shipment table
CREATE TABLE IF NOT EXISTS Shipment (
  shipmentNumber VARCHAR(20) PRIMARY KEY,
  shipmentDate DATE NOT NULL,
  shipmentStatus VARCHAR(50),
  destination VARCHAR(200),
  supplierCode VARCHAR(20),
  FOREIGN KEY (supplierCode) REFERENCES Supplier(supplierCode) ON DELETE SET NULL
);

-- Delivery table
CREATE TABLE IF NOT EXISTS Delivery (
  deliveryCode VARCHAR(20) PRIMARY KEY,
  deliveryDate DATE NOT NULL,
  quantityDelivered INT,
  deliveryStatus VARCHAR(50),
  shipmentNumber VARCHAR(20),
  FOREIGN KEY (shipmentNumber) REFERENCES Shipment(shipmentNumber) ON DELETE SET NULL
);

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

const sql = `
CREATE DATABASE IF NOT EXISTS SCMS;
USE SCMS;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Supplier (
  supplierCode VARCHAR(20) PRIMARY KEY,
  supplierName VARCHAR(100) NOT NULL,
  telephone VARCHAR(20),
  address VARCHAR(200),
  email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Shipment (
  shipmentNumber VARCHAR(20) PRIMARY KEY,
  shipmentDate DATE NOT NULL,
  shipmentStatus VARCHAR(50),
  destination VARCHAR(200),
  supplierCode VARCHAR(20),
  FOREIGN KEY (supplierCode) REFERENCES Supplier(supplierCode) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Delivery (
  deliveryCode VARCHAR(20) PRIMARY KEY,
  deliveryDate DATE NOT NULL,
  quantityDelivered INT,
  deliveryStatus VARCHAR(50),
  shipmentNumber VARCHAR(20),
  FOREIGN KEY (shipmentNumber) REFERENCES Shipment(shipmentNumber) ON DELETE SET NULL
);
`;

db.connect((err) => {
  if (err) { console.error('Connection failed:', err.message); process.exit(1); }
  db.query(sql, (err) => {
    if (err) { console.error('Schema error:', err.message); process.exit(1); }
    console.log('Database and tables created successfully.');

    // Seed default admin user
    const bcrypt = require('bcryptjs');
    const hashed = bcrypt.hashSync('admin123', 10);
    db.query(
      'INSERT IGNORE INTO SCMS.users (username, password) VALUES (?, ?)',
      ['admin', hashed],
      (err) => {
        if (err) console.error('Seed error:', err.message);
        else console.log('Default user created: admin / admin123');
        db.end();
      }
    );
  });
});

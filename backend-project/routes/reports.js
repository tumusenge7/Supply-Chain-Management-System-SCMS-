const express = require('express');
const router = express.Router();
const db = require('../db');

// Daily report - records from today
router.get('/daily', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const queries = {
    suppliers: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Supplier', (e, r) => e ? reject(e) : resolve(r))
    ),
    shipments: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Shipment WHERE shipmentDate = ?', [today], (e, r) => e ? reject(e) : resolve(r))
    ),
    deliveries: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Delivery WHERE deliveryDate = ?', [today], (e, r) => e ? reject(e) : resolve(r))
    ),
  };
  Promise.all([queries.suppliers, queries.shipments, queries.deliveries])
    .then(([suppliers, shipments, deliveries]) => res.json({ suppliers, shipments, deliveries, period: 'daily', date: today }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Weekly report - last 7 days
router.get('/weekly', (req, res) => {
  const queries = {
    suppliers: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Supplier', (e, r) => e ? reject(e) : resolve(r))
    ),
    shipments: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Shipment WHERE shipmentDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)', (e, r) => e ? reject(e) : resolve(r))
    ),
    deliveries: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Delivery WHERE deliveryDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)', (e, r) => e ? reject(e) : resolve(r))
    ),
  };
  Promise.all([queries.suppliers, queries.shipments, queries.deliveries])
    .then(([suppliers, shipments, deliveries]) => res.json({ suppliers, shipments, deliveries, period: 'weekly' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Monthly report - current month
router.get('/monthly', (req, res) => {
  const queries = {
    suppliers: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Supplier', (e, r) => e ? reject(e) : resolve(r))
    ),
    shipments: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Shipment WHERE MONTH(shipmentDate) = MONTH(CURDATE()) AND YEAR(shipmentDate) = YEAR(CURDATE())', (e, r) => e ? reject(e) : resolve(r))
    ),
    deliveries: new Promise((resolve, reject) =>
      db.query('SELECT * FROM Delivery WHERE MONTH(deliveryDate) = MONTH(CURDATE()) AND YEAR(deliveryDate) = YEAR(CURDATE())', (e, r) => e ? reject(e) : resolve(r))
    ),
  };
  Promise.all([queries.suppliers, queries.shipments, queries.deliveries])
    .then(([suppliers, shipments, deliveries]) => res.json({ suppliers, shipments, deliveries, period: 'monthly' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;

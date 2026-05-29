const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all deliveries
router.get('/', (req, res) => {
  db.query(
    'SELECT d.*, s.destination, s.shipmentStatus FROM Delivery d LEFT JOIN Shipment s ON d.shipmentNumber = s.shipmentNumber',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add delivery
router.post('/', (req, res) => {
  const { deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber } = req.body;
  db.query(
    'INSERT INTO Delivery VALUES (?, ?, ?, ?, ?)',
    [deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Delivery added' });
    }
  );
});

// Update delivery
router.put('/:id', (req, res) => {
  const { deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber } = req.body;
  db.query(
    'UPDATE Delivery SET deliveryDate=?, quantityDelivered=?, deliveryStatus=?, shipmentNumber=? WHERE deliveryCode=?',
    [deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber, req.params.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Delivery updated' });
    }
  );
});

// Delete delivery
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Delivery WHERE deliveryCode=?', [req.params.id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Delivery deleted' });
  });
});

module.exports = router;

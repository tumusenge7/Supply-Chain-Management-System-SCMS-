const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all shipments
router.get('/', (req, res) => {
  db.query('SELECT s.*, sup.supplierName FROM Shipment s LEFT JOIN Supplier sup ON s.supplierCode = sup.supplierCode', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add shipment
router.post('/', (req, res) => {
  const { shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode } = req.body;
  db.query(
    'INSERT INTO Shipment VALUES (?, ?, ?, ?, ?)',
    [shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Shipment added' });
    }
  );
});

// Update shipment
router.put('/:id', (req, res) => {
  const { shipmentDate, shipmentStatus, destination, supplierCode } = req.body;
  db.query(
    'UPDATE Shipment SET shipmentDate=?, shipmentStatus=?, destination=?, supplierCode=? WHERE shipmentNumber=?',
    [shipmentDate, shipmentStatus, destination, supplierCode, req.params.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Shipment updated' });
    }
  );
});

// Delete shipment
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Shipment WHERE shipmentNumber=?', [req.params.id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Shipment deleted' });
  });
});

module.exports = router;

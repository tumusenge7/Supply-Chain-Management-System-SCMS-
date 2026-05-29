const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all suppliers
router.get('/', (req, res) => {
  db.query('SELECT * FROM Supplier', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add supplier
router.post('/', (req, res) => {
  const { supplierCode, supplierName, telephone, address, email } = req.body;
  db.query(
    'INSERT INTO Supplier VALUES (?, ?, ?, ?, ?)',
    [supplierCode, supplierName, telephone, address, email],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Supplier added' });
    }
  );
});

module.exports = router;

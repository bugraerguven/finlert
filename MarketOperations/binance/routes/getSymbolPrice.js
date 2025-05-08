const express = require('express');
const mysql = require('mysql2');
const getSymbolPrice = require('../walletoperations/getSymbolPrice.js');
const router = express.Router();

// MySQL2 connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "finlert",
  password: "finlert123!",
  database: "finlert",
  port: 3306
});

// Service to create an alert and its corresponding price alert details
router.post('/', async (req, res) => {
  const { id } = req.body;

  try {
    connection.execute(
      'SELECT symbol FROM productlist WHERE productid = ?',
      [id],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const response = await getSymbolPrice(results[0].symbol);

        res.status(201).json({
response
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


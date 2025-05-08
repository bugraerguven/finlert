const express = require('express');
const insertProduct = require('../utils/dboperations/insertProduct.js');

const router = express.Router();

// Service to create an alert and its corresponding price alert details
router.post('/', async (req, res) => {
  const {
    market, 
    symbol, 
    provider, 
    description
  } = req.body;



  // Check if the necessary fields for alert are provided
  if (!market || !symbol || !provider || !description ) {
    return res.status(400).json({ error: 'Missing required fields for product' });
  }

  try {
    // Step 1: Insert the alert into the "alerts" table
    const alertResult = await insertProduct(market, symbol, provider, description,'active');


    if (alertResult>1) {
     
      res.status(201).json({
        message: 'Product is  created successfully',
        alertid: alertResult.insertId,
      });
    } else {
      throw new Error('Failed to create product');
    }

  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

module.exports = router;


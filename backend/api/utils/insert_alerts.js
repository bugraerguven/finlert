const express = require('express');
const runQuery = require('../utils/query');

const router = express.Router();

router.post('/', async (req, res) => {
  const { userid, productid, type, validated_until } = req.body;

  if (!userid || !productid || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sql = `
      INSERT INTO alerts (userid, productid, type, validated_until)
      VALUES (?, ?, ?, ?)
    `;

    const params = [userid, productid, type, validated_until];

    const result = await runQuery(sql, params);

    res.status(201).json({
      message: 'Alert created successfully',
      alertid: result.insertId,
    });
  } catch (err) {
    console.error('Error inserting alert:', err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const runQuery = require('../utils/query');

router.get('/', async (req, res) => {
  try {
    const results = await runQuery(
      'SELECT * FROM productlist order by symbol'
    );
    

    res.json(results);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

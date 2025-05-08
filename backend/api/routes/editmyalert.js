// routes/updateAlertAndDetail.js

const express = require('express');
const router = express.Router();
const runQuery = require('../utils/query');

router.post('/', async (req, res) => {
  const {
    alertid,
    title,
    type,
    detailid,
    interval,
    target_value,
    lower_value,
    upper_value,
  } = req.body;

  console.log('Update alert and detail request:', req.body);

  if (!alertid || !detailid) {
    return res.status(400).json({ error: 'alertid and detailid are required' });
  }

  try {
    // Update alerts table
    await runQuery(
      'UPDATE alerts SET title = ? WHERE alertid = ?',
      [title, alertid]
    );

    // Update price_alert_details table
    await runQuery(
      'UPDATE price_alert_details SET \`interval\` = ?, type = ?, target_value = ?, lower_value = ?, upper_value = ? WHERE id = ?',
      [interval, type, target_value, lower_value, upper_value, detailid]
    );

    res.json({ message: 'Alert and Detail updated successfully' });
  } catch (err) {
    console.error('Error updating alert and detail:', err);
    res.status(500).json({ error: 'Failed to update alert and detail' });
  }
});

module.exports = router;

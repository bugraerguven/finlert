const express = require('express');
const router = express.Router();
const update_alerts_deleted = require('../utils/dboperations/update_alerts_deleted'); // Path to the service

// Endpoint to update the alert status to "deleted"
router.put('/:alertid', async (req, res) => {
  const { alertid } = req.params; // Get the alertid from the request parameter

  try {
    const result = await update_alerts_deleted(alertid);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

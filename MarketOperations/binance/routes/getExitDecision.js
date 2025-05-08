const express = require('express');
const checkMarketExitConditions = require('../functions/getExitDecision.js');
const router = express.Router();

// Service to create an alert and its corresponding price alert details
router.post('/', async (req, res) => {
	checkMarketExitConditions();
});

module.exports = router;



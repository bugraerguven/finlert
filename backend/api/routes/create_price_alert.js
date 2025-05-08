const express = require('express');
const insertAlert = require('../utils/dboperations/insert_alerts');  // Adjust the path as needed
const insertPriceAlertDetails = require('../utils/dboperations/insert_price_alert_details');  // Adjust the path as needed
const setAlertStatusNotDetailed = require('../utils/dboperations/setAlertStatusNotDetailed');  // Adjust the path as needed

const router = express.Router();

// Service to create an alert and its corresponding price alert details
router.post('/', async (req, res) => {
  const {
    userid,
    productid,
    title,
    type,
    validated_until,
    status,
    waitforcandleclose,
    interval,
    target_value,
    lower_value,
    upper_value
  } = req.body;

  // Check if the necessary fields for alert are provided
  if (!userid || !productid || !type || !waitforcandleclose || !interval) {
    return res.status(400).json({ error: 'Missing required fields for alert' });
  }

  let insertedalertid=0;
  try {
    // Step 1: Insert the alert into the "alerts" table
    const alertResult = await insertAlert(userid, productid, title, "price", validated_until, status);
    
    if (alertResult && alertResult.insertId) {
      insertedalertid=alertResult.insertId; // details insert edememe durumunda alerti iptal edebilmek için 
      // Step 2: Insert price alert details if the alert was created successfully
      const priceAlertResult = await insertPriceAlertDetails(
        alertResult.insertId,  // use the alertid from the previous insert
        waitforcandleclose,
        interval,
        type,
        target_value,
        lower_value,
        upper_value
      );

      // Step 3: Return success response with both results if both insertions are successful
      res.status(201).json({
        message: 'Alert and price alert details created successfully',
        alertid: alertResult.insertId,
        priceAlertDetailId: priceAlertResult.insertId
      });
    } else {
      throw new Error('Failed to create alert');
    }

  } catch (err) {
    setAlertStatusNotDetailed(insertedalertid);
    console.error('Error creating alert and price alert details:', err);
    res.status(500).json({ error: err.message || 'Failed to create alert and price alert details' });
  }
});

module.exports = router;


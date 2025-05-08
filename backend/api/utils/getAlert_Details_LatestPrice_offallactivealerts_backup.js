const runQuery = require('../utils/query');
const getLatestCandleByProductId = require('./getLatestCandleByProductId'); // Make sure this file and function exist

async function getAlert_Details_LatestPrice_offallactivealerts() {
  try {
    // Step 1: Get all active price alerts
    const alerts = await runQuery(`
      SELECT * FROM alerts 
      WHERE type = 'price' AND status = 'active'
    `);

    const results = [];

    // Step 2: Loop through each alert
    for (const alert of alerts) {
      const alertid = alert.alertid;

      // Step 3: Get price alert details for this alert
      const priceAlertDetails = await runQuery(`
        SELECT * FROM price_alert_details 
        WHERE alertid = ?
      `, [alertid]);

      // Step 4: For each detail, get latest candle data and push result
      for (const detail of priceAlertDetails) {
        //console.log(alert.productid, detail.interval);
        const candleResult = await getLatestCandleByProductId(alert.productid, detail.interval);
//console.log(candleResult);
        results.push({
          alert,
          detailResults: detail,
          candleResult
        });
      }
    }
//console.log(results);
    return results;
  } catch (err) {
    console.error('Error in getAlert_Details_LatestPrice_offallactivealerts:', err);
    throw err;
  }
}
//getAlert_Details_LatestPrice_offallactivealerts();
module.exports = getAlert_Details_LatestPrice_offallactivealerts;

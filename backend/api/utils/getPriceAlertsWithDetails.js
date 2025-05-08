const runQuery = require('./query'); // Update path if needed
const getLatestCandleByProductId = require('./getLatestCandleByProductId'); // Adjust path


/**
 * Fetches all alerts of type "price" and their corresponding price alert details.
 * @returns {Promise<Array>} List of alerts with their price alert details.
 */
const getPriceAlertsWithDetails = async () => {
  try {
    // Step 1: Fetch all alerts where type = 'price'
    const alerts = await runQuery(
        `SELECT * FROM alerts WHERE type = ? AND status = ?`,
        ['price', 'active']
      );
      
      const results = [];
      
      for (const alert of alerts) {
        const details = await runQuery(
          `SELECT * FROM price_alert_details WHERE alertid = ?`,
          [alert.alertid]
        );
      
        const price = await getLatestCandleByProductId(alert.productid,details.interval); // Replace with dynamic product_id if available
      
       // console.log(alert);
       // console.log(details);
       // console.log(price);
       // console.log("#################");
      
        results.push({
          alertResult: alert,
          detailResults: details[0],
          candleResult: price
        });
      }
      
      //console.log(results);
      return results;
      

  } catch (err) {
    console.error('Error fetching price alerts with details:', err);
    throw new Error('Failed to fetch price alerts with details');
  }
};
//getPriceAlertsWithDetails();
module.exports = getPriceAlertsWithDetails;

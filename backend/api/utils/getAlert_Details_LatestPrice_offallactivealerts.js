const runQuery = require('../utils/query');
const getLatestCandleByProductId = require('./getLatestCandleByProductId'); // Make sure this file and function exist

async function getAlert_Details_LatestPrice_offallactivealerts(intrval) {
  try {
    // Step 1: Get all active price alerts
    console.log("Hola")
    const alertdetails = await runQuery(`
      SELECT * FROM price_alert_details 
      WHERE alertid in ( select alertid from alerts where
      type = 'price' AND status = 'active') and \`interval\` = ?
    `, [intrval]);

    //console.log(alertdetails);


    const results = [];

    // Step 2: Loop through each alert
    for (const alertdetail of alertdetails) {

      const alerts = await runQuery(`
        SELECT * FROM alerts 
        WHERE alertid = ? limit 1;
      `,[alertdetail.alertid]);

      const alert=alerts[0];



      // Step 4: For each detail, get latest candle data and push result
        //console.log(alert.productid, detail.interval);
        const candleResult = await getLatestCandleByProductId(alert.productid, alertdetail.interval);
//console.log(candleResult);
        results.push({
          alert,
          detailResults: alertdetail,
          candleResult
        });
      
    }

console.log(results);
    return results;
  } catch (err) {
    console.error('Error in getAlert_Details_LatestPrice_offallactivealerts:', err);
    throw err;
  }
}
//getAlert_Details_LatestPrice_offallactivealerts('15m');
module.exports = getAlert_Details_LatestPrice_offallactivealerts;

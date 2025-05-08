const runQuery = require('../utils/query'); // Update path if needed
const getAlert_Details_LatestPrice_offallactivealerts = require('../utils/getAlert_Details_LatestPrice_offallactivealerts'); // Adjust path
const insertCheckLog = require('../utils/dboperations/insert_CheckLog'); // Update path if needed
const Decimal = require('decimal.js');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches all alerts of type "price" and their corresponding price alert details.
 * @returns {Promise<Array>} List of alerts with their price alert details.
 */
const insert_checklogs = async (intrvl) => {
  try {
    //console.log("⏳ Sleeping for 20 seconds before starting...");
    //await sleep(20000); // 20 seconds

    console.log("boncorno");
    const activealerts = await getAlert_Details_LatestPrice_offallactivealerts(intrvl);
    

    for (const alert of activealerts) {
      //console.log('#######################');
      //console.log(alert);
      //console.log('#######################');
     

      const target_value = parseFloat(parseFloat(alert.detailResults.target_value).toFixed(8));
      const close = parseFloat(parseFloat(alert.candleResult.close).toFixed(8));

      const upper_value = parseFloat(parseFloat(alert.detailResults.upper_value).toFixed(8));
      const lower_value = parseFloat(parseFloat(alert.detailResults.lower_value).toFixed(8));

      
      console.log("alertid : " , alert.detailResults.alertid , " ---- > ----- " , target_value , " ----  ----- " , close);
      console.log("alert.detailResults.target_value --> " , typeof target_value); // "string"
      console.log("alert.candleResult.close" , typeof close); // "string"


      if (
        alert.detailResults.type === "TARGET_UPPER" ||
        alert.detailResults.type === "TARGET_LOWER"
      ) {
        if (target_value > close) {
          console.log("alertid : " , alert.detailResults.alertid , " ---- > ----- " , target_value , " ----  ----- " , close);
          console.log("alert.detailResults.target_value --> " , typeof target_value); // "string"
          console.log("alert.candleResult.close" , typeof close); // "string"

          insertCheckLog({
            alertdetailid: alert.detailResults.id,
            status: 'BELOW',
          });
        } else if (target_value < close) {
          console.log("alertid : " , alert.detailResults.alertid , " ---- > ----- " , target_value , " ----  ----- " , close);
          console.log("target_value --> " , typeof target_value); // "string"
          console.log("alert.candleResult.close" , typeof close); // "string"
          insertCheckLog({
            alertdetailid: alert.detailResults.id,
            status: 'ABOVE',
          });
        } else if (target_value === close) {
          insertCheckLog({
            alertdetailid: alert.detailResults.id,
            status: 'ABOVE', //EQUAL olmalı
          });
        } else {
          insertCheckLog({
            alertdetailid: alert.detailResults.id,
            status: 'Not identified',
          });
        }
      } else if (
        alert.detailResults.type === "TARGET_CANAL_INSIDE" ||
        alert.detailResults.type === "TARGET_CANAL_OUTSIDE"
      ) {
        if (
          close > upper_value ||
          close < lower_value
        ) {
          insertCheckLog({
            alertdetailid: alert.detailResults.id,
            status: 'OUTSIDE',
          });
        } else {
          insertCheckLog({
            alertdetailid: alert.detailResults.id,
            status: 'INSIDE',
          });
        }
      }
    }

    console.log("✅ Done!");
  } catch (err) {
    console.error('❌ Error fetching price alerts with details:', err);
    throw new Error('Failed to fetch price alerts with details');
  }
};

//insert_checklogs("15m");

module.exports = insert_checklogs;
 

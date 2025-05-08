const runQuery = require('../utils/query'); // Update path if needed
const getAlert_Details_LatestPrice_offallactivealerts = require('../utils/getAlert_Details_LatestPrice_offallactivealerts'); // Adjust path
const insertCheckLog = require('../utils/dboperations/insert_CheckLog'); // Update path if needed



/**
 * Fetches all alerts of type "price" and their corresponding price alert details.
 * @returns {Promise<Array>} List of alerts with their price alert details.
 */
const insert_checklogs = async () => {
  try {
    const activealerts=  await getAlert_Details_LatestPrice_offallactivealerts();
    //console.log(activealerts);
    for (const alert of activealerts) {
        //console.log(alert);
        if (  alert.detailResults.type=="TARGET_UPPER" || alert.detailResults.type=="TARGET_LOWER" )
        {
            if (alert.detailResults.target_value > alert.candleResult.close)
                {
                    insertCheckLog({
                        alertdetailid: alert.detailResults.id,
                        status: 'BELOW',
                      });                  
                }
            else if (alert.detailResults.target_value < alert.candleResult.close)
                    {
                        insertCheckLog({
                            alertdetailid: alert.detailResults.id,
                            status: 'ABOVE',
                          });                      
                    }
            else if (alert.detailResults.target_value = alert.candleResult.close)
                    {
                        insertCheckLog({
                            alertdetailid: alert.detailResults.id,
                            status: 'ABOVE', //EQUAL olmalı
                          });                                       
                    }
            else 
                    {
                        insertCheckLog({
                            alertdetailid: alert.detailResults.id,
                            status: 'Not identified',
                          });                                       
                        }
        }
        else if ( alert.detailResults.type=="TARGET_CANAL_INSIDE" || alert.detailResults.type=="TARGET_CANAL_OUTSIDE" )
        {
            if (alert.candleResult.close > alert.detailResults.upper_value)
                {
                    insertCheckLog({
                        alertdetailid: alert.detailResults.id,
                        status: 'OUTSIDE',
                      });                   
                }
            else if (alert.candleResult.close < alert.detailResults.lower_value)
                {
                    insertCheckLog({
                        alertdetailid: alert.detailResults.id,
                        status: 'OUTSIDE',
                      });                
                }
            else 
                {
                    insertCheckLog({
                        alertdetailid: alert.detailResults.id,
                        status: 'INSIDE',
                      });                                  
                     }

        }
    }
    console.log("done!");
insert_checklogs();
//    return ("done");

  } catch (err) {
    console.error('Error fetching price alerts with details:', err);
    throw new Error('Failed to fetch price alerts with details');
  }
};
insert_checklogs();
module.exports = insert_checklogs;

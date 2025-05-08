const runQuery = require('../utils/query');
const getLastTwoChecklogs = require('../utils/getLatestTwoCheckLogs'); // make sure this function is implemented
const checktonotifyalert = require('../utils/checktonotifyalert'); // should this alarm notify?
const insert_notification_queue = require('../utils/dboperations/insert_notification_queue'); 

async function findtoinsert_notification_queue() {
  try {
    // Step 1: Get active price alerts
    const alerts = await runQuery(
      `SELECT * FROM alerts WHERE type = 'price' AND status = 'active'`
    );

    const result = [];

    for (const alert of alerts) {
      // Step 2: Get price_alert_details for each alert
      const details = await runQuery(
        `SELECT * FROM price_alert_details WHERE alertid = ?`,
        [alert.alertid]
      );

      const enrichedDetails = [];

      for (const detail of details) {
        // Step 3: Get last two checklogs for each price_alert_detail.id
        const checklogs = await getLastTwoChecklogs(detail.id);
        enrichedDetails.push({
          ...detail,
          checklogs,
        });

        //console.log(" ### KONTROL EDILECEK ALARM ###");
        //console.log("###### ALERT ######");
        //console.log(alert)
        //console.log("###### ALERT DETAILS ######");
        //console.log(detail)
        //console.log("###### LAST TWO CANDLES  ######");
        //console.log(checklogs)

        if (alert.type == 'price')
        {const result = await checktonotifyalert(detail.type,checklogs); // should this alarm notify?
          if (result=='alert')
          {
            //console.log("queue'ye tablosuna eklenecek --> detail",detail.id);
            insert_notification_queue("0",alert.userid,"whatsapp_number", detail.id, "new");
          }
          else 
          {
            console.log("alarm tetiklenmedi --> detail ",detail.id);
          }
        }

        

      }

     

     // result.push({
    //    alert,
     //   price_alert_details: enrichedDetails,
    //  });
    }

    //console.log(result);
    console.log("bitti");
    return "ok";
  } catch (err) {
    console.error('Error in findtoinsert_notification_queue:', err);
    throw err;
  }
}
findtoinsert_notification_queue();
module.exports = findtoinsert_notification_queue;

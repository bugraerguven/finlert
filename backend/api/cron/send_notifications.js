const { sendWhatsAppMessage } = require('../utils/testtwilio.js');
const getNewNotificationQueue = require('../utils/getNewNotificationQueue.js');
const isAlertIdVerifiedByMethod = require('../utils/isAlertIdVerifiedByMethod.js');
const getProductNamebyId = require('../utils/getProductNamebyId.js');
const updateNotificationQueueDone = require('../utils/dboperations/updateNotificationQueueDone.js');
const runQuery = require('../utils/query'); // Adjust path as needed

async function run() {
  const notifications = await getNewNotificationQueue();

  if (!notifications.length) {
    console.log('🚫 No new notifications found.');
    return;
  }

    notifications.forEach(async (notification) => {
      try {
        let verified = await isAlertIdVerifiedByMethod(notification.alertdetailid,notification.method);
        if (verified == await "confirmed") { 
            const alertDetailResult = await runQuery(
                'SELECT alertid,target_value,lower_value,upper_value FROM price_alert_details WHERE id = ?',
                [notification.alertdetailid]
              );


              if (!Array.isArray(alertDetailResult) || alertDetailResult.length === 0 || !alertDetailResult[0].alertid) {
                console.warn(`❌ alertid not found for price_alert_details.id = ${notification.alertdetailid}`);
                return false;
              }
          
              const alertId = alertDetailResult[0].alertid;
              const target_value = alertDetailResult[0].target_value;
              const lower_value = alertDetailResult[0].lower_value;
              const upper_value = alertDetailResult[0].upper_value;

              const alertResult = await runQuery(
                'SELECT productid,title FROM alerts WHERE alertid = ?',
                [alertId]
              );

              if (!Array.isArray(alertResult) || alertResult.length === 0 ) {
                console.warn(`❌ userid not found for alerts.alertid = ${alertId}`);
                return false;
              }

          
              const productid = alertResult[0].productid;
              const title = alertResult[0].title;
              const symbol = await getProductNamebyId(productid);

              const text = symbol + "\n" + title + "\n" + "Alarm Tetiklendi";
              console.log(text);
              const result = await sendWhatsAppMessage({ body: text })
              if (result.status == "queued")
              {
                await updateNotificationQueueDone(notification.id);

              }
              
        }
        else return(false);
        //else{console.log("failed");}
        //const result = await sendWhatsAppMessage({ body: notification.value });
        //console.log(`✅ Sent to ${notification.method || 'unknown'}:`, result.status);
      } catch (error) {
        console.error(`❌ Failed to send to ${notification.method || 'unknown'}:`, error.message);
      }
    })
}

run();


  //  try {
   // const result = await sendWhatsAppMessage({ body: 'Hi Dude!!' });
    //console.log('📨 Result:', result.status);
  //} catch (error) {
   // console.error('❌ Error:', error);
 // }
const runQuery = require('../utils/query');
const getNotificationInformations = require('./getNotificationInformations'); // assumes this returns an object {notification, alertdetail, alert}
const sendNewMarketOrder = require('./sendNewMarketOrder.js');

async function processNewNotifications() {
  try {
    // Step 1: Get all new notifications
    const newNotifications = await runQuery(
      'SELECT * FROM notifications_queue WHERE status = "new"'
    );

    for (const row of newNotifications) {
      try {
        // Step 2: Get alert information
        const alertInformation = await getNotificationInformations(row.id);

        const { notification, alertdetail, alert } = alertInformation;
	      console.log(alertInformation);

        // Step 3: Skip if alert.status is not 'active'
        if (alert.status !== 'active') {
          console.log(`Skipping notification ${row.id} because alert.status is ${alert.status}`);
		// Step 3a: Update notification status to "already positioned"
        await runQuery(
          'UPDATE notifications_queue  SET status = "already positioned" WHERE id = ?',
          [notification.id]
        );
          continue;
        }

        // Step 4: Get product info from productlist
        const productResult = await runQuery(
          'SELECT symbol FROM productlist WHERE productid = ? AND status = "active"',
          [alert.productid]
        );

        if (productResult.length === 0) {
          console.log(`Skipping notification ${row.id} due to missing active product`);
          continue;
        }

        // Step 5: Log action based on alertdetail.type
        if (alertdetail.type === 'TARGET_UPPER') {
          console.log(`Notification ${row.id}: Let's BUY the product ${productResult[0].symbol}`);
	  let res = await sendNewMarketOrder({
  userid: 1,
  type: 'BUY',
  pairname: productResult[0].symbol
});
	// update notification as notified 
	 await runQuery(
          'UPDATE notifications_queue  SET status = "notified" WHERE id = ?',
          [notification.id]
        );
 

 
        } else if (alertdetail.type === 'TARGET_LOWER') {
          console.log(`Notification ${row.id}: Let's SELL the product ${productResult[0].symbol}`);
//		let resp = await sendNewMarketOrder({
//  userid: 1,
//  type: 'SELL',
//  pairname: productResult[0].symbol
// });
        }

        // Step 6: Update alert status to "positioned"
        await runQuery(
          'UPDATE alerts SET status = "positioned" WHERE alertid = ?',
          [alert.alertid]
        );

        console.log(`Alert ${alert.alertid} marked as positioned.`);

      } catch (innerErr) {
        console.error(`Error processing notification ${row.id}:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error('Error in processNewNotifications:', err.message);
  }
}
processNewNotifications();
module.exports = processNewNotifications;


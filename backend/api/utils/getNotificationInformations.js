const runQuery = require('./query');

async function getNotificationDetails(notificationId) {
  try {
    // Step 1: Get notification row
    const notifications = await runQuery(
      'SELECT * FROM notifications_queue WHERE id = ?',
      [notificationId]
    );

    if (notifications.length === 0) {
      throw new Error(`Notification with id ${notificationId} not found.`);
    }

    const notification = notifications[0];

    // Step 2: Get alert detail using alertdetailid from notification
    const alertDetails = await runQuery(
      'SELECT * FROM price_alert_details WHERE id = ?',
      [notification.alertdetailid]
    );

    if (alertDetails.length === 0) {
      throw new Error(`Alert detail with id ${notification.alertdetailid} not found.`);
    }

    const alertDetail = alertDetails[0];

    // Step 3: Get alert using alertid from alert detail
    const alerts = await runQuery(
      'SELECT * FROM alerts WHERE alertid = ?',
      [alertDetail.alertid]
    );

    if (alerts.length === 0) {
      throw new Error(`Alert with id ${alertDetail.alertid} not found.`);
    }

    const alert = alerts[0];

    // Return all combined
    return {
      notification,
      alertdetail: alertDetail,
      alert,
    };
  } catch (err) {
    console.error('Error in getNotificationDetails:', err.message);
    throw err;
  }

}
//getNotificationDetails(3);
module.exports = getNotificationDetails;


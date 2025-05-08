const runQuery = require('./query'); // Adjust path to your DB utility

/**
 * Checks if a user's verification status for a method is confirmed
 * @param {number} alertDetailId - ID from price_alert_details
 * @param {string} method - Verification method (e.g., 'whatsapp')
 * @returns {Promise<string|boolean>} 'confirmed' if verified, otherwise false
 */
const isAlertIdVerifiedByMethod = async (alertDetailId, method) => {
  try {
    // Step 1: Get alertid from price_alert_details
    const alertDetailResult = await runQuery(
      'SELECT alertid FROM price_alert_details WHERE id = ?',
      [alertDetailId]
    );

    if (!alertDetailResult.length) {
      console.warn('⚠️ No alertid found for detail ID:', alertDetailId);
      return false;
    }

    const alertId = alertDetailResult[0].alertid;

    // Step 2: Get userid from alerts table
    const alertResult = await runQuery(
      'SELECT userid FROM alerts WHERE alertid = ?',
      [alertId]
    );

    if (!alertResult.length) {
      console.warn('⚠️ No user found for alert ID:', alertId);
      return false;
    }

    const userId = alertResult[0].userid;

    // Step 3: Get status from verifications table
    const verificationResult = await runQuery(
      'SELECT status FROM verifications WHERE user_id = ? AND method = ?',
      [userId, method]
    );

    if (!verificationResult.length || verificationResult[0].status !== 'confirmed') {
      return false;
    }

    return 'confirmed';
  } catch (error) {
    console.error('❌ Error in isAlertIdVerifiedByMethod:', error);
    return false;
  }
};

//isAlertIdVerifiedByMethod(999,'whatsapp_number').then((resp)=>{console.log(resp);});

module.exports = isAlertIdVerifiedByMethod;

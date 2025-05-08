const runQuery = require('../query'); // Adjust path as needed

/**
 * Sets the status of an alert to "notdetailed" by alertid
 * @param {number} alertid 
 * @returns {Promise<void>}
 */
const setAlertStatusNotDetailed = async (alertid) => {
  if (!alertid) {
    throw new Error('alertid is required');
  }

  const sql = `
    UPDATE alerts
    SET status = 'notdetailed'
    WHERE alertid = ?
  `;

  try {
    await runQuery(sql, [alertid]);
    console.log(`Alert ${alertid} status updated to "notdetailed"`);
  } catch (error) {
    console.error('Error updating alert status:', error);
    throw error;
  }
};

module.exports = setAlertStatusNotDetailed;

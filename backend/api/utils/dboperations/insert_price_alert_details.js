const runQuery = require('../query'); // Adjust the path as needed

/**
 * Inserts price alert details into the "price_alert_details" table.
 * @param {number} alertid - The alert ID to associate with the price alert.
 * @param {number} waitforcandleclose - The value for waitforcandleclose field.
 * @param {string} interval - The interval for the price alert.
 * @param {string} type - The type of the price alert.
 * @param {number} target_value - The target price value for the alert.
 * @param {number} lower_value - The lower price value for the alert.
 * @param {number} upper_value - The upper price value for the alert.
 * @returns {Promise<object>} The result of the insert query, containing the inserted `id`.
 */
const insertPriceAlertDetails = async (alertid, waitforcandleclose, interval, type, target_value, lower_value, upper_value) => {
  const sql = `
    INSERT INTO price_alert_details 
    (alertid, waitforcandleclose, \`interval\`, \`type\`, target_value, lower_value, upper_value)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [alertid, waitforcandleclose, interval, type, target_value, lower_value, upper_value];

  try {
    const result = await runQuery(sql, params);
    return result;  // Returns the result of the insert operation
  } catch (err) {
    console.error('Error inserting price alert details:', err);
    throw new Error('Error inserting price alert details');
  }
};

module.exports = insertPriceAlertDetails;


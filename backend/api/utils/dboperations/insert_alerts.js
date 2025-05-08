const runQuery = require('../query');  // Adjust the path as needed

/**
 * Inserts a new alert into the database.
 * @param {number} userid - The ID of the user.
 * @param {string} productid - The productid for the alert.
 * @param {string} title - The title for the alert.
 * @param {string} type - The type of the alert.
 * @param {string} validated_until - The validated until timestamp for the alert.
 * @param {string} status - The status of the alert (optional).
 * @returns {Promise<object>} - Returns the result of the insert operation.
 */
const insertAlert = async (userid, productid, title, type, validated_until, status = null) => {
  // Construct the SQL query
  const sql = `
    INSERT INTO alerts (userid, productid, title,type, validated_until, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Params to be inserted into the query
  const params = [userid, productid, title, type, validated_until, status];

  try {
    const result = await runQuery(sql, params);
    return result;  // Return the result of the insert query
  } catch (err) {
    throw new Error('Error inserting alert: ' + err.message);
  }
};

module.exports = insertAlert;


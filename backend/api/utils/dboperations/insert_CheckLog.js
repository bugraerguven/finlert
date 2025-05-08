const runQuery = require('../query'); // Adjust path as needed

/**
 * Inserts a new check log record into the checklogs table.
 * 
 * @param {Object} data - The log data
 * @param {number} data.alertdetailid - The ID of the alert detail
 * @param {string} data.status - The status string (e.g. "success", "failed")
 * @param {Date} [data.checkdate] - The date and time of the check
 * @returns {Promise<Object>} The result of the insert operation
 */
const insertCheckLog = async ({ alertdetailid, status, checkdate = new Date() }) => {
  try {
    const sql = `
      INSERT INTO checklogs (alertdetailid, status, checkdate)
      VALUES (?, ?, ?)
    `;
    const params = [alertdetailid, status, checkdate];
    const result = await runQuery(sql, params);

    return {
      message: 'Check log inserted successfully',
      insertId: result.insertId,
    };
  } catch (err) {
    console.error('Error inserting check log:', err);
    throw new Error('Failed to insert check log');
  }
};

module.exports = insertCheckLog;

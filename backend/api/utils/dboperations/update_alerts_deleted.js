const runQuery = require('../query'); // Assuming you have a query utility for running MySQL queries

const update_alerts_deleted = async (alertid) => {
  try {
    // Query to update the status of the alert to "deleted"
    const result = await runQuery(
      'UPDATE alerts SET status = ? WHERE alertid = ?',
      ['deleted', alertid]
    );

    if (result.affectedRows === 0) {
      throw new Error('Alert not found or already deleted');
    }

    return { success: true, message: 'Alert status updated to deleted' };
  } catch (err) {
    console.error('Error updating alert status:', err);
    throw new Error('Failed to update alert status');
  }
};

module.exports = update_alerts_deleted;

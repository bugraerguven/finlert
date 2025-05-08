const runQuery = require('./query'); // Adjust path as needed

/**
 * Gets all new notification records.
 * @returns {Promise<Array>} Array of notifications with status='new'
 */
const getNewNotificationQueue = async () => {
  try {
    const result = await runQuery(
      `SELECT * FROM notifications_queue WHERE status='new'`
    );
    return result;
  } catch (err) {
    console.error(`Error getting new notifications`, err);
    throw new Error('Failed to get new notifications');
  }
};

module.exports = getNewNotificationQueue;

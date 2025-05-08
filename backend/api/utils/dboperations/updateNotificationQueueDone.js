const runQuery = require('../query'); // Assuming you have a query utility for running MySQL queries

const updateNotificationQueueDone = async (id) => {
  try {
    // Query to update the status of the alert to "done"
    const result = await runQuery(
      'UPDATE notifications_queue SET status = ? WHERE id = ?',
      ['done', id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Notification Queue not found or already deleted');
    }

    return { success: true, message: 'Notification Queue updated to done' };
  } catch (err) {
    console.error('Error Notification Queue status:', err);
    throw new Error('Failed to update Notification Queue status');
  }
};

module.exports = updateNotificationQueueDone;

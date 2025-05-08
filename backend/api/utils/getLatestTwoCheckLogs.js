const runQuery = require('./query'); // Adjust the path as needed

const getLastTwoChecklogs = async (alertdetailid) => {
  try {
    const logs = await runQuery(
      `SELECT * FROM checklogs 
       WHERE alertdetailid = ? 
       ORDER BY checkdate DESC 
       LIMIT 2`,
      [alertdetailid]
    );
    //console.log(logs);
    return logs;
  } catch (err) {
    console.error('Error fetching checklogs:', err);
    throw new Error('Failed to retrieve checklogs');
  }
};
//getLastTwoChecklogs(45);
module.exports = getLastTwoChecklogs;

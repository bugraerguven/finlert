// utils/query.js
const createConnection = require('./db');

async function runQuery(sql, params = []) {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  } finally {
    await connection.end(); // Important: close the connection after each query
  }
}

module.exports = runQuery;

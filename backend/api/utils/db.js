// utils/db.js
const mysql = require('mysql2/promise');

async function createConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "finlert",
    port: 3306
  });
}

module.exports = createConnection;

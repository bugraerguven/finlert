const mysql = require('mysql2');
const checkOrderStatus = require('../walletoperations/checkOrderStatus'); // Adjust path as needed

// MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "36strategy",
    port: 3306
});
function syncLimitOrders() {
  return new Promise((resolve, reject) => {
	  console.log("syncLimitOrders girdi");
    connection.connect((err) => {
      if (err) {
        console.error('MySQL connection error:', err);
        return reject(err);
      }

      console.log('Connected to MySQL. Checking LIMIT orders...');

      connection.query(
        "SELECT * FROM operation_history WHERE type='LIMIT' AND status='NEW'",
        async (err, results) => {
          if (err) {
            console.error('Query error:', err);
            return reject(err);
          }

          for (const row of results) {
            try {
              const apiResponse = await checkOrderStatus(row.symbol, row.orderId);

              if (apiResponse.status !== row.status) {
                const updateQuery = `UPDATE operation_history SET status = ? WHERE clientOrderId = ?`;
                connection.query(updateQuery, [apiResponse.status, row.clientOrderId], (err) => {
                  if (err) {
                    //console.error(`Update failed for row ${row.id}:`, err);
                  } else {
                    //console.log(`Updated row ${row.id} -> ${apiResponse.status}`);
                  }
                });


              } else {
                console.log(`Order ${row.orderId} is still in status '${row.status}'`);
              }
            } catch (error) {
              console.error(`API error for order ${row.orderId}:`, error.message);
            }
          }
          //connection.end(); // ✅ CLOSE the connection after operations

          resolve("DB'deki açık pozisyonlar, binance'dan kontrol edildi. Kapatılması gereken varsa kapatıldı.");
        }
      );
    });
  });
}
//syncLimitOrders();
module.exports = { syncLimitOrders };

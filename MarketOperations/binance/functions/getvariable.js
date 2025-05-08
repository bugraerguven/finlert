const mysql = require('mysql2');

// MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "36strategy",
    port: 3306
});
function getvariable (name) {
  return new Promise((resolve, reject) => {
	  console.log("syncLimitOrders girdi");
    connection.connect((err) => {
      if (err) {
        console.error('MySQL connection error:', err);
        return reject(err);
      }

      console.log('Connected to MySQL. Getting variable value');

      connection.query(
        "SELECT * FROM variables  WHERE `name` = ?",[name],
        async (err, results) => {
          if (err) {
            console.error('Query error:', err);
            return reject(err);
          }

		console.log(results[0].value);
		resolve(results[0].value);
//          connection.end(); // ✅ CLOSE the connection after operations

          resolve("DB'deki açık pozisyonlar, binance'dan kontrol edildi. Kapatılması gereken varsa kapatıldı.");
        }
      );
    });
  });
}
getvariable("positionmargin");
module.exports =  getvariable  ;

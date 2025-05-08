const mysql = require('mysql2');


function insertoperationhistory(operation) {
return new Promise((resolve, reject) => {

// Create a MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "36strategy",
    port: 3306
  });
 

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
});


//else {order.fills='NULL'; }
console.log("dbye bağlandı");

// SQL query to insert data into a table
const insertQuery = 'INSERT INTO operation_history SET ?';

//order.fills = order.fills[0];

// Execute the query
connection.query(insertQuery, operation, (err, results) => {
  if (err) {
    console.error('Error inserting data:', err);
    reject(err);
    throw err;
  }
    //console.log('Data inserted successfully:', results);
    //connection.end(); // ✅ CLOSE the connection after operations

  resolve(results);

  // Close the MySQL connection
  connection.end((err) => {
    if (err) {
      console.error('Error closing connection:', err);
      reject(err);
      throw err;
    }
    //console.log('Connection closed');
  });
});

});
}

module.exports = insertoperationhistory;

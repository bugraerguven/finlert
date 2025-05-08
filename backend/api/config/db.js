const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "finlert",
    port: 3306
});


db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

//module.exports = db;


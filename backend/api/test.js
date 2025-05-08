require("dotenv").config();
const express = require("express");
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3005;

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// Route to test database connection
app.get("/test", (req, res) => {
  db.query("SELECT NOW() ", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json({ message: "Connected!", data: results });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const router = express.Router();

// MySQL Connection Pool
const db = mysql.createPool({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "finlert",
    port: 3306
});

// Register endpoint
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Try-catch should be inside the same function block
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use 'await' with db.query (since mysql2/promise supports promises)
        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        console.log("User registered in users table. Info --> ");
        console.log(result);

        res.json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
 

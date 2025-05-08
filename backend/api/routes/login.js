const express = require('express');
const bcrypt = require('bcrypt');
const createToken = require('../utils/createToken.js');
const runQuery = require('../utils/query.js');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const results = await runQuery('SELECT * FROM users WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        let token;
        try {
            token = await createToken(user.id,'login');
        } catch (tokenError) {
            console.error('Token creation failed:', tokenError);
            return res.status(401).json({ error: 'Login failed. Please try again.' });
        }

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


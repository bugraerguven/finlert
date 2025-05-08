const jwt = require('jsonwebtoken');
const runQuery = require('./query');

/**
 * Creates a JWT and stores it in the database.
 * @param {number} userId
 * @returns {Promise<string>} JWT token
 * @throws {Error} If token storage fails
 */
const createToken = async (userId,type) => {
    const token = jwt.sign({ id: userId }, 'your_jwt_secret', { expiresIn: '1h' });
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2880 * 60 * 1000); // 48 hour later

    try {
        await runQuery(
            'INSERT INTO tokens (user_id, token,type, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
            [userId, token, type, createdAt, expiresAt]
        );
    } catch (err) {
        console.error('Error storing token:', err);
        throw new Error('Failed to store token in the database');
    }

    return token;
};

module.exports = createToken;


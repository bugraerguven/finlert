const runQuery = require('./query'); // Adjust path if needed

const authenticate = async (req, res, next) => {
  console.log("auth kontrol ediliyor");

  const { userid, token } = req.headers;

  if (!userid || !token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token or userid' });
  }

  try {
    const results = await runQuery(
      'SELECT expires_at FROM tokens WHERE user_id = ? AND token = ?',
      [userid, token]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { expires_at } = results[0];

    if (new Date(expires_at) < new Date()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    next();
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authenticate;

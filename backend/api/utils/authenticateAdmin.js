
const authenticateAdmin = async (req, res, next) => {
  console.log("auth kontrol ediliyor");

  const { userid, token } = req.headers;

  if (!userid || !token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token or userid' });
  }

  if (userid=="admin" && token=="pasAdmin123!")
  {
    next();
  }

  else 
  {
    return res.status(401).json({ error: 'Admin credentials does not meet' });
  }

};

module.exports = authenticateAdmin;

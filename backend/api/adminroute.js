const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const runQuery = require('./utils/query'); // Adjust path to match your project
const authenticateAdmin = require('./utils/authenticateAdmin');
const admin_create_product = require('./routes/admin_create_product');




dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

// CORS Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Secure route using the auth middleware
app.get('/securedata', authenticateAdmin, async (req, res) => {
  try {
    const result = await runQuery('SELECT NOW() AS currentTime');
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/adminCreateProduct',authenticateAdmin,admin_create_product);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

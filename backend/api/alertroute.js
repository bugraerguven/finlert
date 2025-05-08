const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const runQuery = require('./utils/query'); // Adjust path to match your project
const authenticate = require('./utils/authenticate');

const create_price_alert = require('./routes/create_price_alert');
const getmyalerts = require('./routes/getmyalerts');
const deleteAlert = require('./routes/deleteAlert');
const getProductList = require('./routes/getProductList');
const editmyalert = require('./routes/editmyalert');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// CORS Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Secure route using the auth middleware
app.get('/securedata', authenticate, async (req, res) => {
  try {
    const result = await runQuery('SELECT NOW() AS currentTime');
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/createpricealert',authenticate,create_price_alert);
app.use('/getmyalerts',authenticate,getmyalerts);
app.use('/deleteAlert',authenticate,deleteAlert);
app.use('/getProductList',authenticate,getProductList);
app.use('/editmyalert',authenticate,editmyalert);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

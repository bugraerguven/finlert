const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
//const authenticate = require('./utils/authenticate');
const newMarketOrder = require('./routes/newMarketOrder.js');
const getExitDecision = require('./routes/getExitDecision.js');
const getSymbolPrice = require('./routes/getSymbolPrice.js');
const getAllMyAsset = require('./routes/getAllMyAsset.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3010;

// CORS Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//app.use('/getProductList',authenticate,getProductList);
app.use('/newMarketOrder',newMarketOrder);
app.use('/getExitDecision',getExitDecision);
app.use('/getSymbolPrice',getSymbolPrice);
app.use('/getAllMyAsset',getAllMyAsset);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


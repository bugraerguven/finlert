// utils/sendMarketOrder.js
const axios = require('axios');

async function sendNewMarketOrder(userid,side,pairname) {
  try {
    const response = await axios.post(
      'http://localhost:3010/newmarketorder',
      {
        userid: userid,
        type: side,
        pairname: pairname
      },
      {
        headers: {
          userid: 'admin',
          token: 'passAdmin123!'
        }
      }
    );

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending market order:', error.response?.data || error.message);
    throw error;
  }
}

sendNewMarketOrder(1,"BUY","ARBUSDT");

module.exports = sendNewMarketOrder;

const axios = require('axios');

/**
 * Sends a POST request to /newmarketorder
 * @param {Object} input
 * @param {string|number} input.userid - User ID to send in body
 * @param {string} input.type - Type of order (e.g., 'BUY' or 'SELL')
 * @param {string} input.pairname - Trading pair (e.g., 'BTCUSDT')
 */
async function sendNewMarketOrder({ userid, type, pairname }) {
  try {
    const response = await axios.post(
      'http://localhost:3010/newmarketorder',
      {
        userid,
        type,
        pairname
      },
      {
        headers: {
          userid: 'admin',
          token: 'pasAdmin123!'
        }
      }
    );

    console.log('Order response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending market order:', error.message);
    throw error;
  }
}

//sendNewMarketOrder({
//  userid: 1,
//  type: 'BUY',
//  pairname: 'DOGEUSDT'
//});

module.exports = sendNewMarketOrder;


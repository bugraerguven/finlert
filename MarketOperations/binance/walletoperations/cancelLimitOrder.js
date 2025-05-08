//organized

const { Spot } = require('@binance/connector')
const variables = require('../variables.js');

async function cancelLimitOrder(symbol,origClientOrderId) {

var keys = await variables.getBinanceApiKeys();
const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

client.cancelMarginOrder(symbol,{origClientOrderId}
).then(response => {
          //client.logger.log(response.data);
          console.log(response.data);
		      resolve(response.data);
                      })
  .catch(error => {client.logger.error(error);reject(error)})

});
}
//cancelLimitOrder("BTCUSDT",41917100732);
module.exports = cancelLimitOrder;
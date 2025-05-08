const { Spot } = require('@binance/connector')
const variables = require('../variables.js');

async function getSymbolPrice(pairname) {

var keys = await variables.getBinanceApiKeys();
const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

client.tickerPrice(pairname)
.then(response => {
                      //client.logger.log(response.data);
                      resolve(response.data.price);
                      })
  .catch(error => {client.logger.error(error);reject(error)})

});
}
//getSymbolPrice('DOGEUSDT');
module.exports = getSymbolPrice;

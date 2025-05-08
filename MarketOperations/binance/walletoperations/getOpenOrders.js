//organized

const { Spot } = require('@binance/connector')
const variables = require('../variables.js');

async function getOpenOrders(symbol) {

var keys = await variables.getBinanceApiKeys();
const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

  client.marginOpenOrders(
    symbol, // symbol
  ).then(response => {
                        //client.logger.log(response.data);
                        resolve(response.data);
                        })
    .catch(error => {client.logger.error(error);resolve(error)})

});
}
getOpenOrders("EIGEN");
module.exports = getOpenOrders;
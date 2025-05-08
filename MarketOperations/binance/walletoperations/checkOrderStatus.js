//organized

const { Spot } = require('@binance/connector')
const variables = require('../variables.js');

async function checkOrderStatus(pairname,orderId) {

var keys = await variables.getBinanceApiKeys();
const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

client.marginOrder(
  pairname,
  {
    orderId //myOrder olarak set edilmişti
  }
).then(response => {
          //client.logger.log(response.data);
		      resolve(response.data);
                      })
  .catch(error => {client.logger.error(error);reject(error)})

});
}
//checkOrderStatus("CAKEUSDT",1424100363);
module.exports = checkOrderStatus;
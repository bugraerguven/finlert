const { Spot } = require('@binance/connector')
const variables = require('../variables.js');


async function getSymbolAsset(pairname) {

pairname = pairname.slice(0, -4);

var keys = await variables.getBinanceApiKeys();
const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

client.marginAccount()
  .then(response => {
    //console.log(response);

    array = response.data.userAssets;
    var foundElement = array.find(obj => obj.asset === pairname);
    console.log(foundElement);
    resolve(foundElement);
  })
  .catch(error => client.logger.error(error))
})
}
//getSymbolAsset("BNBUSDT");
module.exports = getSymbolAsset;

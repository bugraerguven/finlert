const { Spot } = require('@binance/connector')
const variables = require('../variables.js');

async function getPrecisionLimitAmount(symbol) {
    var keys = await variables.getBinanceApiKeys();
    
    const apiKey = keys.apikey;
    const apiSecret = keys.secretkey;
    const client = new Spot(apiKey, apiSecret)

  return new Promise((resolve, reject) => {
    
client.exchangeInfo().then(response => {
    const info = response.data.symbols.find(s => s.symbol === symbol);
  
    if (info) {
      const lotSizeFilter = info.filters.find(f => f.filterType === 'LOT_SIZE');
      const stepSize = lotSizeFilter.stepSize;
  
      console.log(`Step size for ${symbol}: ${stepSize}`);
      
      // To get the allowed quantity precision:
      const quantityPrecision = -Math.log10(parseFloat(stepSize));
      console.log(`Allowed quantity precision: ${quantityPrecision}`);
      resolve(quantityPrecision);
    } else {
      console.log('Symbol not found');
    }
  })
      .catch(reject);
  });
}

//getPrecisionLimit("DOGEUSDT");
module.exports = getPrecisionLimitAmount;

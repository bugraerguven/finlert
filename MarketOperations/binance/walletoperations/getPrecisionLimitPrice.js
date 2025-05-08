const { Spot } = require('@binance/connector')
const variables = require('../variables.js');

async function getPricePrecision(symbol) {
      var keys = await variables.getBinanceApiKeys();
      
      const apiKey = keys.apikey;
      const apiSecret = keys.secretkey;
      const client = new Spot(apiKey, apiSecret)

  return new Promise((resolve, reject) => {
    client.exchangeInfo()
      .then(response => {
        const info = response.data.symbols.find(s => s.symbol === symbol.toUpperCase());
        if (!info) return reject(new Error('Symbol not found'));

        const priceFilter = info.filters.find(f => f.filterType === 'PRICE_FILTER');
        const tickSize = parseFloat(priceFilter.tickSize);
        const pricePrecision = -Math.log10(tickSize);

        resolve({
          symbol,
          tickSize,
          pricePrecision
        });
      })
      .catch(reject);
  });
}

//getPricePrecision("DOGEUSDT");
module.exports = getPricePrecision;
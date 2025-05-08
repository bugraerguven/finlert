const { Spot } = require('@binance/connector');
const variables = require('../variables.js');
const getSymbolPrice = require('./getSymbolPrice.js'); // Uncomment this line when your getSymbolPrice is ready

async function getAllMyAssets() {
  try {
    const keys = await variables.getBinanceApiKeys();
    const apiKey = keys.apikey;
    const apiSecret = keys.secretkey;
    const client = new Spot(apiKey, apiSecret);

    const response = await client.marginAccount();
    const array = response.data.userAssets;

    const nonZeroAssets = array.filter(item =>
      ['free', 'locked', 'borrowed', 'interest', 'netAsset'].some(
        key => parseFloat(item[key]) !== 0
      )
    );

    const updatedAssets = [];

    for (const element of nonZeroAssets) {
	    let symbol="";
	    let price=0;
      if (element.asset=="USDT") { symbol ="USDT"; price =1 }
      else {
      symbol = `${element.asset}USDT`;
      price = await getSymbolPrice(symbol); // Ensure this function returns price
      }
      updatedAssets.push({ ...element, price });
    }

    console.log(updatedAssets);
    return updatedAssets;

  } catch (error) {
    console.error('Error in getAllMyAssets:', error.message);
    throw error;
  }
}

// To run directly:
//getAllMyAssets();

module.exports = getAllMyAssets;


const { Spot } = require('@binance/connector');
const variables = require('../variables.js');

async function getMarginBalanceInUSDT() {
  try {
    const keys = await variables.getBinanceApiKeys();
    const client = new Spot(keys.apikey, keys.secretkey);

    // Get margin balance in BTC
    const marginAccount = await client.marginAccount();
    const btcAmount = parseFloat(marginAccount.data.totalNetAssetOfBtc);

    // Get BTC price in USDT
    const priceInfo = await client.tickerPrice('BTCUSDT');
    const btcPrice = parseFloat(priceInfo.data.price);

    const usdtValue = btcAmount * btcPrice;
    console.log(usdtValue);
    return usdtValue;
  } catch (error) {
    console.error('Error getting margin balance in USDT:', error.message);
    return null;
  }
}
//getMarginBalanceInUSDT();
module.exports = getMarginBalanceInUSDT;

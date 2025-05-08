const { Spot } = require('@binance/connector')
const variables = require('../variables.js');
const insertoperationhistory = require('../dboperations/insertoperationhistory.js');

async function newMarketOrder(userid, type,pairname,quantity,clientorderId) {
var keys = await variables.getBinanceApiKeys();

const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

client.newMarginOrder(
  pairname, // symbol
  type,
  'Market',
  {
    quantity,
    newClientOrderId: clientorderId,
    newOrderRespType: 'FULL',
    sideEffectType: 'AUTO_BORROW_REPAY'
  }
).then(response => {
                          let operation = new Object();
                          operation.id=0;
			                    operation.userid=userid;
                          operation.symbol= response.data.symbol;
                          operation.orderId= response.data.orderId;
                          operation.clientOrderId = response.data.clientOrderId;
                          operation.transactTime= response.data.transactTime;
                          operation.executedQty= response.data.executedQty;
			                    operation.executedQtyDollar= response.data.executedQty * response.data.fills[0].price;
                          operation.status= response.data.status;
                          operation.type= response.data.type;
                          operation.side= response.data.side;
                          operation.fills_price= response.data.fills[0].price;
                          insertoperationhistory(operation);
                     //client.logger.log(response.data);
                      resolve(response.data);
                      })
  .catch(error => {client.logger.error(error);reject(error)})

});
}
//newMarketOrder(1,"BUY","DOGEUSDT",110);
module.exports = newMarketOrder;

const { Spot } = require('@binance/connector')
const variables = require('../variables.js');
const insertoperationhistory = require('../dboperations/insertoperationhistory.js');

async function newLimitOrder(userid,type,pairname,quantity,price,clientorderId) {
var keys = await variables.getBinanceApiKeys();

const apiKey = keys.apikey;
const apiSecret = keys.secretkey;
const client = new Spot(apiKey, apiSecret)

return new Promise((resolve, reject) => {

client.newMarginOrder(
  pairname, // symbol
  type,
  'LIMIT',
  {
    quantity,
    price,
    newClientOrderId: clientorderId,
    newOrderRespType: 'FULL',
    timeInForce: 'GTC'
    //sideEffectType: 'AUTO_BORROW_REPAY'
  }
).then(async(response) => {
                        let operation = new Object();
                        operation.id=0;
                        operation.userid=userid;
                        operation.symbol= response.data.symbol;
                        operation.orderId= response.data.orderId;
                        operation.clientOrderId = response.data.clientOrderId;
                        operation.transactTime= response.data.transactTime;
                        operation.executedQty= response.data.executedQty;
                        operation.executedQtyDollar= 0;
                        operation.status= response.data.status;
                        operation.type= response.data.type;
                        operation.side= response.data.side;
                        operation.fills_price= 0;
  insertoperationhistory(operation);
			console.log("LimitOrder oluşturuldu");
                      resolve(response.data);
                      })
  .catch(error => {client.logger.error(error);reject(error)})

});
}
//newLimitOrder("1","SELL","DOGEUSDT",267,0.20,"te212st");
module.exports = newLimitOrder;

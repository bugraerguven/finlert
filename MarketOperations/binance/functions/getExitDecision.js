const mysql = require('mysql2');
const getSymbolPrice = require('../walletoperations/getSymbolPrice'); // You must provide this
const cancelLimitOrder = require('../walletoperations/cancelLimitOrder.js');
const clearSymbolBalance = require('./clearSymbolBalance.js')
const {syncLimitOrders} = require('./updateStatusofOpenLimitOrders.js')

// MySQL connection config
const connection =  mysql.createConnection({
    host: "localhost",
    user: "finlert",
    password: "finlert123!",
    database: "36strategy",
    port: 3306
  });


async function checkMarketExitConditions() {
      //First get open positions from database. And check statused from binance
	console.log("checkMarketExitConditions girdi");
      const respon = await syncLimitOrders(); 

  return new Promise((resolve, reject) => {


    
    connection.connect(async (err) => {
      if (err) {
        console.error('MySQL connection error:', err);
        return reject(err);
      }


      console.log('Connected to MySQL. Checking market exits...');

      const query = "SELECT id, symbol, orderId,clientOrderId, fills_price, side FROM operation_history WHERE type='MARKET' AND status='FILLED'";

      connection.query(query, async (err, results) =>   {
        if (err) {
          console.error('Query error:', err);
          return reject(err);
        }

        for (const row of results) {
          try {
            const price = await getSymbolPrice(row.symbol);
            const fillsPrice = parseFloat(row.fills_price);
            const result = getExitDecision(row.side, price, fillsPrice);
            if (result == "CLOSE") // Eğer pozisyonun kapatılması gerekiyorsa
            {
                // Açık TP Limit orderı kapat
                console.log('cancelLimitOrder(',row.symbol,',',row.clientOrderId,');');
                const result1 = await cancelLimitOrder(row.symbol,row.clientOrderId);
                // Balance'ı clear et!!!
                const resp2 = await clearSymbolBalance(row.symbol,row.clientOrderId);
            }

            console.log(`Order ID ${row.id} | Symbol ${row.symbol} | Side ${row.side} | Market Price: ${price} | Fills Price: ${fillsPrice} → Result: ${result}`);
          } catch (error) {
            console.error(`Error processing order ${row.id}:`, error.message);
          }
        }
        connection.end(); // ✅ CLOSE the connection after operations

        resolve();
      });
    });
  });
}

// Decision logic for exiting
function getExitDecision(side, price, fillsPrice) {
  
  try {
    if (side === 'BUY' && price < fillsPrice * 0.97) {
        console.log('CLOSE');
      return 'CLOSE';
    } else if (side === 'SELL' && price > fillsPrice * 1.03) {
        console.log('CLOSE');
      return 'CLOSE';
    } else {
        console.log('CONTINUE');
      return 'CONTINUE';
    }
  } catch (err) {
    console.error('Decision logic error:', err);
    return 'ERROR';
  }
}
checkMarketExitConditions();
module.exports = { checkMarketExitConditions };

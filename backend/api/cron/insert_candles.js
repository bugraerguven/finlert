const { Spot } = require('@binance/connector');
const runQuery = require('../utils/query'); // Your custom query wrapper

const client = new Spot('', ''); // No API key needed

/**
 * Fetch symbol from DB using product ID
 * @param {number} productId
 * @returns {Promise<string>} symbol
 */
async function getSymbolByProductId(productId) {
    console.log("Hi");
    const sql = `SELECT symbol FROM productlist WHERE productid = ? LIMIT 1`;
    const results = await runQuery(sql, [productId]);

    if (results.length === 0) {
        throw new Error(`No product found with productid ${productId}`);
    }

    return results[0].symbol;
}

/**
 * Fetch latest closed candle from Binance and store in DB
 * @param {string} symbol - e.g., "BTCUSDT"
 * @param {string} interval - e.g., "15m"
 * @param {number} product_id - your internal product ID
 */
async function fetchAndStoreCandle(symbol, interval, product_id) {
    try {
        const checkDate = new Date();
        const { data } = await client.klines(symbol, interval, { limit: 2 });
        const candle = data[0]; // Closed candle

const sql = `
    INSERT INTO candles
    (\`interval\`,check_date, product_id, open_time, open, high, low, close, volume, close_time)
    VALUES (? , ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        check_date = VALUES(check_date),
        open = VALUES(open),
        high = VALUES(high),
        low = VALUES(low),
        close = VALUES(close),
        volume = VALUES(volume),
        close_time = VALUES(close_time)
`;
        const params = [
	    interval,
            checkDate,
            product_id,
            candle[0], candle[1], candle[2], candle[3],
            candle[4], candle[5], candle[6]
        ];

        await runQuery(sql, params);
        console.log(`✅ Stored candle for ${symbol} (${interval})`);
    } catch (err) {
        console.error(`❌ Error storing candle for ${symbol}:`, err.message);
    } finally {
        console.log("⏹️ Script completed.");
    }
}


// Main entry
async function storeCandles(intrval) {
    try {
        const products = await runQuery(
            `select distinct productid from alerts where status = ?`,
            ['active']
          );
          products.map(async (row) => {
            //console.log(row);
            const symbol = await getSymbolByProductId(row.productid);
            //console.log(symbol);
           await fetchAndStoreCandle(symbol, intrval, row.productid);
          })



    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}; 
//storeCandles("15m");

module.exports = { storeCandles };
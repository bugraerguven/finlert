const runQuery = require('./query'); // Adjust path as needed

/**
 * Gets the latest candle record for a given product_id.
 * @param {number} productId
 * @param {string} interval
 * @returns {Promise<Object|null>} The latest candle or null if none found.
 */
const getLatestCandleByProductId = async (productId, interval) => {
  //console.log("#### --> ", productId,interval);
  try {
    const result = await runQuery(
      `SELECT * FROM candles WHERE product_id = ? AND \`interval\` = ? ORDER BY open_time DESC LIMIT 1`,
      [productId, interval] // tek array
    );
    //console.log(result);
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(`Error fetching latest candle for product_id ${productId}:`, err);
    throw new Error('Failed to fetch latest candle');
  }
};

getLatestCandleByProductId(2, '15m');
module.exports = getLatestCandleByProductId;

const runQuery = require('./query'); // Adjust path as needed

/**
 * Gets the latest candle record for a given product_id.
 * @param {number} productId
 * @returns {Promise<Object|null>} The latest candle or null if none found.
 */
const getProductList = async () => {
  try {
    const result = await runQuery(
      `SELECT * FROM productlist`
    );
    console.log(result);
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(`Error getting productlist`, err);
    throw new Error('Failed to get product list');
  }
};
getProductList();
module.exports = getProductList;

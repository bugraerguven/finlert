const runQuery = require('./query'); // Adjust path as needed

/**
 * Gets the latest candle record for a given product_id.
 * @param {number} productId
 * @returns {Promise<Object|null>} The latest candle or null if none found.
 */
const getProductNamebyId = async (productid) => {
  try {
    const result = await runQuery(
      'SELECT symbol FROM productlist WHERE productid = ?',
      [productid]
    );

    console.log(result[0].symbol);
    return result.length > 0 ? result[0].symbol : null;
  } catch (err) {
    console.error(`Error getting productlist`, err);
    throw new Error('Failed to get product list');
  }
};
getProductNamebyId(1);
module.exports = getProductNamebyId;

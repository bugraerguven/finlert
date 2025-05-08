const runQuery = require('../query'); // Adjust the path if needed

/**
 * Inserts a product into the productlist table.
 * @param {Object} product
 * @param {string} product.market
 * @param {string} product.symbol
 * @param {string} product.provider
 * @param {string} [product.description]
 * @param {string} [product.status] - e.g., 'active' or 'inactive'
 * @returns {Promise<number>} The ID of the inserted product.
 */
const insertProduct = async ( market, symbol, provider, description = null, status = 'active' ) => {

  console.log("insertProduct ' e girdi --> ");
  console.log(" market --> " , market );
  console.log(" symbol --> " , symbol );
  console.log(" provider --> " , provider );
  console.log(" description --> " , description );

  try {
    const sql = `
      INSERT INTO productlist (market, symbol, provider, description, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [market, symbol, provider, description, status];
    const result = await runQuery(sql, params);

    return result.insertId;
  } catch (error) {
    console.error('Error inserting product:', error);
    throw new Error('Failed to insert product');
  }
};

module.exports = insertProduct;

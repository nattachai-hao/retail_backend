const productRepository = require('../repositories/productRepository');
const { enrichProduct } = require('../services/productService');
const { sendJson } = require('../utils/http');

async function getPromotions(req, res) {
  const promotions = (await productRepository
    .getAll())
    .map(enrichProduct)
    .filter(product => product.discount > 0 && product.quantity > 0);

  sendJson(res, 200, promotions);
}

module.exports = { getPromotions };

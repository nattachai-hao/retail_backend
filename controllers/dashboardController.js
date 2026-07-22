const productRepository = require('../repositories/productRepository');
const { enrichProduct } = require('../services/productService');
const { sendJson } = require('../utils/http');

async function getDashboard(req, res) {
  const products = productRepository.getAll().map(enrichProduct);

  sendJson(res, 200, {
    totalUnits: products.reduce((sum, product) => sum + product.quantity, 0),
    totalProducts: products.length,
    normal: products.filter(product => product.status === 'normal').reduce((sum, product) => sum + product.quantity, 0),
    expiring: products.filter(product => product.status === 'expiring').reduce((sum, product) => sum + product.quantity, 0),
    expired: products.filter(product => product.status === 'expired').reduce((sum, product) => sum + product.quantity, 0),
    riskValue: products.reduce((sum, product) => sum + product.riskValue, 0),
    products: products.sort((a, b) => a.daysLeft - b.daysLeft)
  });
}

module.exports = { getDashboard };

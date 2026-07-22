const promotionController = require('../controllers/promotionController');

module.exports = async function promotionRoutes(req, res, url) {
  if (url.pathname !== '/api/promotions' || req.method !== 'GET') return false;

  await promotionController.getPromotions(req, res);
  return true;
};

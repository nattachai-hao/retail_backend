const productRoutes = require('./productRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const promotionRoutes = require('./promotionRoutes');

const routeHandlers = [productRoutes, dashboardRoutes, promotionRoutes];

module.exports = async function routes(req, res, url) {
  for (const handleRoute of routeHandlers) {
    if (await handleRoute(req, res, url)) return true;
  }

  return false;
};

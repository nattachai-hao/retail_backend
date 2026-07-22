const dashboardController = require('../controllers/dashboardController');

module.exports = async function dashboardRoutes(req, res, url) {
  if (url.pathname !== '/api/dashboard' || req.method !== 'GET') return false;

  await dashboardController.getDashboard(req, res);
  return true;
};

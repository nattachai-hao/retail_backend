const productController = require('../controllers/productController');

module.exports = async function productRoutes(req, res, url) {
  if (url.pathname === '/api/products') {
    if (req.method === 'GET') await productController.getProducts(req, res);
    else if (req.method === 'POST') await productController.createProduct(req, res);
    else return false;

    return true;
  }

  const match = url.pathname.match(/^\/api\/products\/(\d+)$/);
  if (!match) return false;

  const id = Number(match[1]);
  if (req.method === 'PUT') await productController.updateProduct(req, res, id);
  else if (req.method === 'DELETE') await productController.deleteProduct(req, res, id);
  else return false;

  return true;
};

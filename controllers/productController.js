const productRepository = require('../repositories/productRepository');
const { enrichProduct } = require('../services/productService');
const { parseJsonBody, sendJson } = require('../utils/http');

async function getProducts(req, res) {
  sendJson(res, 200, productRepository.getAll().map(enrichProduct));
}

async function createProduct(req, res) {
  const data = await parseJsonBody(req);
  if (!data.name || !data.expiryDate || Number(data.quantity) < 0 || Number(data.price) < 0) {
    return sendJson(res, 400, { message: 'กรุณากรอกข้อมูลที่จำเป็นให้ถูกต้อง' });
  }

  const products = productRepository.getAll();
  const timestamp = Date.now();
  const product = {
    id: timestamp,
    name: data.name.trim(),
    category: data.category || 'อื่น ๆ',
    sku: data.sku || `SKU-${timestamp.toString().slice(-6)}`,
    quantity: Number(data.quantity),
    price: Number(data.price),
    expiryDate: data.expiryDate,
    image: data.image || '📦'
  };

  products.push(product);
  productRepository.saveAll(products);
  sendJson(res, 201, enrichProduct(product));
}

async function updateProduct(req, res, id) {
  const products = productRepository.getAll();
  const index = products.findIndex(product => product.id === id);
  if (index < 0) return sendJson(res, 404, { message: 'ไม่พบสินค้า' });

  const changes = await parseJsonBody(req);
  products[index] = { ...products[index], ...changes, id: products[index].id };
  products[index].quantity = Number(products[index].quantity);
  products[index].price = Number(products[index].price);

  productRepository.saveAll(products);
  sendJson(res, 200, enrichProduct(products[index]));
}

async function deleteProduct(req, res, id) {
  const products = productRepository.getAll();
  const filtered = products.filter(product => product.id !== id);
  if (filtered.length === products.length) return sendJson(res, 404, { message: 'ไม่พบสินค้า' });

  productRepository.saveAll(filtered);
  sendJson(res, 200, { message: 'ลบสินค้าแล้ว' });
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };

const productRepository = require('../repositories/productRepository');
const { enrichProduct } = require('../services/productService');
const { parseJsonBody, sendJson } = require('../utils/http');

async function getProducts(req, res) {
  sendJson(res, 200, (await productRepository.getAll()).map(enrichProduct));
}

async function createProduct(req, res) {
  const data = await parseJsonBody(req);
  if (!data.name || !data.expiryDate || Number(data.quantity) < 0 || Number(data.price) < 0) {
    return sendJson(res, 400, { message: 'กรุณากรอกข้อมูลที่จำเป็นให้ถูกต้อง' });
  }

  const timestamp = Date.now();
  const product = await productRepository.create({
    name: data.name.trim(),
    category: data.category || 'อื่น ๆ',
    sku: data.sku || `SKU-${timestamp.toString().slice(-6)}`,
    quantity: Number(data.quantity),
    price: Number(data.price),
    expiryDate: data.expiryDate,
    image: data.image || '📦'
  });
  sendJson(res, 201, enrichProduct(product));
}

async function updateProduct(req, res, id) {
  const changes = await parseJsonBody(req);
  if (changes.quantity !== undefined) changes.quantity = Number(changes.quantity);
  if (changes.price !== undefined) changes.price = Number(changes.price);
  delete changes.id;
  delete changes._id;

  const product = await productRepository.updateById(id, changes);
  if (!product) return sendJson(res, 404, { message: 'ไม่พบสินค้า' });
  sendJson(res, 200, enrichProduct(product));
}

async function deleteProduct(req, res, id) {
  if (!(await productRepository.deleteById(id))) return sendJson(res, 404, { message: 'ไม่พบสินค้า' });
  sendJson(res, 200, { message: 'ลบสินค้าแล้ว' });
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };

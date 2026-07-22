const Product = require('../models/Product');

const plain = document => document.toJSON();

async function getAll() {
  return (await Product.find().sort({ createdAt: 1 })).map(plain);
}

async function create(data) {
  return plain(await Product.create(data));
}

async function updateById(id, changes) {
  const product = await Product.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
  return product ? plain(product) : null;
}

async function deleteById(id) {
  return Boolean(await Product.findByIdAndDelete(id));
}

async function count() {
  return Product.countDocuments();
}

async function insertMany(products) {
  return Product.insertMany(products.map(({ id, ...product }) => product));
}

module.exports = { getAll, create, updateById, deleteById, count, insertMany };

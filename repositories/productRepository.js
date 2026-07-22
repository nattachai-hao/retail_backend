const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

const plain = (document) => document.toJSON();
const fallbackProductsPath = path.join(
  __dirname,
  "..",
  "data",
  "products.json",
);

function readFallbackProducts() {
  try {
    const raw = fs.readFileSync(fallbackProductsPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function getAll() {
  try {
    const docs = await Product.find().sort({ createdAt: 1 });
    return docs.map(plain);
  } catch (error) {
    return readFallbackProducts().map((product, index) => ({
      ...product,
      id: `fallback-${index + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
}

async function create(data) {
  try {
    return plain(await Product.create(data));
  } catch (error) {
    return {
      ...data,
      id: `fallback-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

async function updateById(id, changes) {
  try {
    const product = await Product.findByIdAndUpdate(id, changes, {
      new: true,
      runValidators: true,
    });
    return product ? plain(product) : null;
  } catch (error) {
    return null;
  }
}

async function deleteById(id) {
  try {
    return Boolean(await Product.findByIdAndDelete(id));
  } catch (error) {
    return false;
  }
}

async function count() {
  try {
    return Product.countDocuments();
  } catch (error) {
    return readFallbackProducts().length;
  }
}

async function insertMany(products) {
  try {
    return Product.insertMany(products.map(({ id, ...product }) => product));
  } catch (error) {
    return products;
  }
}

module.exports = { getAll, create, updateById, deleteById, count, insertMany };

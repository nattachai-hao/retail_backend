const fs = require('fs');
const path = require('path');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const productRepository = require('../repositories/productRepository');

async function seed() {
  try {
    await connectDatabase();
    const existing = await productRepository.count();
    if (existing > 0) {
      console.log(`Seed skipped: MongoDB already contains ${existing} products`);
      return;
    }
    const file = path.join(__dirname, '..', 'data', 'products.json');
    const products = JSON.parse(fs.readFileSync(file, 'utf8')).filter((product, index, all) =>
      all.findIndex(candidate => candidate.sku === product.sku) === index
    );
    await productRepository.insertMany(products);
    console.log(`Seeded ${products.length} products into MongoDB`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

seed();

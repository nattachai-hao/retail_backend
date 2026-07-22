const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'products.json');

function ensureDatabase() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
}

function getAll() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveAll(products) {
  ensureDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2));
}

module.exports = { getAll, saveAll };

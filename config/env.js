const fs = require('fs');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).reduce((values, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return values;

    const separator = trimmed.indexOf('=');
    if (separator < 0) return values;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
    return values;
  }, {});
}

const baseEnv = parseEnvFile(path.join(__dirname, '..', '.env'));
const environmentEnv = parseEnvFile(path.join(__dirname, '..', `.env.${nodeEnv}`));
const env = { ...baseEnv, ...environmentEnv, ...process.env };

function positivePort(value, fallback) {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : fallback;
}

module.exports = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  host: env.HOST || '0.0.0.0',
  port: positivePort(env.PORT, 5003),
  corsOrigin: env.CORS_ORIGIN || (nodeEnv === 'production' ? '' : 'http://localhost:3000'),
  mongoUri: env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
  mongoDbName: env.MONGODB_DB_NAME || 'smart_shelf'
});

const config = require('../config/env');

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

if (config.corsOrigin) JSON_HEADERS['Access-Control-Allow-Origin'] = config.corsOrigin;

function sendJson(res, status, data) {
  res.writeHead(status, JSON_HEADERS);
  res.end(status === 204 ? undefined : JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

module.exports = { sendJson, parseJsonBody };

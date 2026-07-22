const config = require("../config/env");

function normalizeOrigin(origin) {
  if (!origin) return "";
  return String(origin).replace(/\/+$/, "");
}

function getCorsHeaders(req = {}) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };

  // Prefer the browser Origin header so it matches exactly (no trailing slash mismatch).
  const requestOrigin = normalizeOrigin(req.headers && req.headers.origin);
  const configuredOrigin = normalizeOrigin(config.corsOrigin);

  if (requestOrigin) {
    headers["Access-Control-Allow-Origin"] = requestOrigin;
  } else if (configuredOrigin) {
    headers["Access-Control-Allow-Origin"] = configuredOrigin;
  }

  return headers;
}

function sendJson(res, status, data, req) {
  res.writeHead(status, getCorsHeaders(req));
  res.end(status === 204 ? undefined : JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

module.exports = { sendJson, parseJsonBody };

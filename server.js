const http = require('http');
const config = require('./config/env');
const routes = require('./routes');
const { sendJson } = require('./utils/http');

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const handled = await routes(req, res, url);

    if (!handled) sendJson(res, 404, { message: 'ไม่พบ API' });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { message: 'เกิดข้อผิดพลาดในระบบ' });
  }
});

server.listen(config.port, config.host, () => {
  console.log(`Smart Shelf API (${config.nodeEnv}): http://${config.host}:${config.port}`);
});

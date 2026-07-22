const http = require('http');
const config = require('./config/env');
const routes = require('./routes');
const { sendJson } = require('./utils/http');
const { connectDatabase, disconnectDatabase } = require('./config/database');

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

async function start() {
  try {
    await connectDatabase();
    server.listen(config.port, config.host, () => {
      console.log(`Smart Shelf API (${config.nodeEnv}): http://${config.host}:${config.port}`);
    });
  } catch (error) {
    console.error('Cannot connect to MongoDB:', error.message);
    process.exit(1);
  }
}

async function shutdown() {
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
start();

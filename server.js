const http = require('http');
const fs = require('fs');
const path = require('path');
const { ProxyEngine } = require('./core/proxy-engine');
const { PingEngine } = require('./core/ping-engine');
const { SERVERS_DATABASE } = require('./js/server-list');

const PORT = process.env.PORT || 4173;
const proxyEngine = new ProxyEngine(10808);
const pingEngine = new PingEngine();
proxyEngine.start();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Real Discord connectivity test endpoint
  if (req.url === '/api/discord-check') {
    const result = await proxyEngine.testDiscord();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // Live Ping measurement for all servers
  if (req.url === '/api/ping-all') {
    const pings = await pingEngine.pingAll(SERVERS_DATABASE);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(pings));
    return;
  }

  // Custom DoH configuration
  if (req.url === '/api/set-doh' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { endpoint } = JSON.parse(body);
        proxyEngine.setDoHEndpoint(endpoint);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, endpoint }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Split Tunnel configuration
  if (req.url === '/api/split-tunnel' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const config = JSON.parse(body);
        proxyEngine.setSplitTunnel(config);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, config }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'active',
      engine: 'GhostWire Core v1.0.0',
      proxyPort: 10808,
      dohEndpoint: proxyEngine.dohEndpoint,
      ramOnlyMode: true,
      logsRecorded: 0
    }));
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  filePath = filePath.split('?')[0];

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (fallbackErr, fallbackContent) => {
          if (fallbackErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🛡️  GhostWire VPN Core Server running at:`);
  console.log(`👉  http://localhost:${PORT}`);
  console.log(`⚡  Real DPI Circumvention Proxy running at 127.0.0.1:10808`);
  console.log(`🔒  Zero-Knowledge, Zero-Log, High-Speed Privacy Shield`);
  console.log(`======================================================\n`);
});

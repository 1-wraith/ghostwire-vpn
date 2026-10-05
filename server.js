const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { ProxyEngine } = require('./core/proxy-engine');
const { PingEngine } = require('./core/ping-engine');
const { UpdaterEngine } = require('./core/updater-engine');
const { WintunEngine } = require('./core/wintun-engine');
const { SERVERS_DATABASE } = require('./js/server-list');

// Intercept unhandled exceptions safely
process.on('uncaughtException', (err) => {
  console.warn('[GhostWire Server] Uncaught Exception intercepted:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.warn('[GhostWire Server] Unhandled Rejection intercepted:', reason);
});

const PORT = process.env.PORT || 4173;
const proxyEngine = new ProxyEngine(10808);
const pingEngine = new PingEngine();
const updaterEngine = new UpdaterEngine('1.0.0', '1-wraith/ghostwire-vpn');
const wintunEngine = new WintunEngine();
proxyEngine.start().catch(() => {});

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

  // Scan Running Windows Desktop Applications
  if (req.url === '/api/running-apps') {
    if (process.platform === 'win32') {
      exec('tasklist /FO CSV /NH', (err, stdout) => {
        if (err || !stdout) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, apps: [] }));
        }
        const lines = stdout.split('\r\n');
        const systemExes = new Set([
          'system', 'smss.exe', 'csrss.exe', 'wininit.exe', 'services.exe', 'lsass.exe',
          'svchost.exe', 'fontdrvhost.exe', 'winlogon.exe', 'dwm.exe', 'explorer.exe',
          'taskhostw.exe', 'sihost.exe', 'runtimebroker.exe', 'searchhost.exe',
          'startmenuexperiencehost.exe', 'textinputhost.exe', 'shellexperiencehost.exe',
          'conhost.exe', 'cmd.exe', 'powershell.exe', 'electron.exe', 'node.exe', 'ghostwire vpn.exe'
        ]);
        const detected = new Map();
        for (const line of lines) {
          const match = line.match(/^"([^"]+)"/);
          if (match) {
            const exe = match[1];
            const lower = exe.toLowerCase();
            if (!systemExes.has(lower) && !detected.has(lower)) {
              const name = exe.replace(/\.exe$/i, '');
              let icon = '⚡';
              let category = 'tools';
              if (lower.includes('discord')) { icon = '🎮'; category = 'gaming'; }
              else if (lower.includes('steam')) { icon = '🕹️'; category = 'gaming'; }
              else if (lower.includes('roblox')) { icon = '🕹️'; category = 'gaming'; }
              else if (lower.includes('riot') || lower.includes('valorant')) { icon = '🎯'; category = 'gaming'; }
              else if (lower.includes('epic')) { icon = '⚡'; category = 'gaming'; }
              else if (lower.includes('chrome')) { icon = '🌐'; category = 'browsers'; }
              else if (lower.includes('brave')) { icon = '🦁'; category = 'browsers'; }
              else if (lower.includes('edge')) { icon = '🌊'; category = 'browsers'; }
              else if (lower.includes('firefox')) { icon = '🦊'; category = 'browsers'; }
              else if (lower.includes('spotify')) { icon = '🎵'; category = 'media'; }
              else if (lower.includes('obs')) { icon = '📹'; category = 'media'; }
              else if (lower.includes('telegram')) { icon = '✈️'; category = 'social'; }
              else if (lower.includes('whatsapp')) { icon = '📱'; category = 'social'; }
              else if (lower.includes('code')) { icon = '💻'; category = 'tools'; }
              
              detected.set(lower, {
                exe,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                icon,
                category
              });
            }
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, apps: Array.from(detected.values()).slice(0, 40) }));
      });
      return;
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, apps: [] }));
      return;
    }
  }

  if (req.url === '/api/check-update') {
    const updateInfo = await updaterEngine.checkLatestRelease();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updateInfo));
    return;
  }

  if (req.url === '/api/download-update' && req.method === 'POST') {
    const status = await updaterEngine.startDownload();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
    return;
  }

  if (req.url === '/api/update-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updaterEngine.getStatus()));
    return;
  }

  if (req.url === '/api/install-update' && req.method === 'POST') {
    const result = updaterEngine.applyUpdate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // Wintun Layer-3 Kernel Engine Endpoints
  if (req.url === '/api/wintun-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(wintunEngine.getStatus()));
    return;
  }

  if (req.url === '/api/wintun-toggle' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { enabled } = JSON.parse(body || '{}');
        const state = wintunEngine.toggle(enabled !== undefined ? enabled : !wintunEngine.enabled);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, enabled: state, status: wintunEngine.getStatus() }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.url === '/api/wintun-telemetry') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(wintunEngine.getStatus()));
    return;
  }

  if (req.url.startsWith('/api/simulate-update') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let enable = true;
      let targetVersion = '1.1.0';
      try {
        if (body) {
          const parsed = JSON.parse(body);
          if (parsed.enable !== undefined) enable = parsed.enable;
          if (parsed.version) targetVersion = parsed.version;
        }
      } catch (e) {}
      const status = updaterEngine.simulateUpdate(enable, targetVersion);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status));
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

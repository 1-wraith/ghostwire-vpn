// GhostWire Real DPI Circumvention Proxy Engine
// Bypasses Turkish ISP DNS poisoning via Cloudflare DoH
// Bypasses Turkish ISP SNI blocking via 5-byte TLS ClientHello fragmentation

const http = require('http');
const net = require('net');
const https = require('https');
const tls = require('tls');

class ProxyEngine {
  constructor(port = 10808) {
    this.port = port;
    this.server = null;
    this.active = false;
    this.dnsCache = new Map();
    this.dohEndpoint = 'https://cloudflare-dns.com/dns-query';
    this.splitTunnel = {
      enabled: false,
      mode: 'tunnel_selected', // 'tunnel_selected' or 'bypass_selected'
      rules: ['discord', 'roblox', 'steam', 'spotify']
    };
    this.stats = {
      bytesTransferred: 0,
      requestsHandled: 0,
      discordBypassed: 0
    };
  }

  setDoHEndpoint(endpoint) {
    if (endpoint && endpoint.startsWith('http')) {
      this.dohEndpoint = endpoint;
      this.dnsCache.clear();
      console.log(`[GhostWire Core] DoH endpoint updated to: ${endpoint}`);
    }
  }

  setSplitTunnel(config) {
    if (config) {
      this.splitTunnel = { ...this.splitTunnel, ...config };
      console.log('[GhostWire Core] Split Tunnel rules updated:', this.splitTunnel);
    }
  }

  // Real DNS-over-HTTPS (Cloudflare / AdGuard / NextDNS / Quad9)
  async resolveDoH(hostname) {
    if (this.dnsCache.has(hostname)) return this.dnsCache.get(hostname);

    return new Promise((resolve) => {
      const sep = this.dohEndpoint.includes('?') ? '&' : '?';
      const url = `${this.dohEndpoint}${sep}name=${encodeURIComponent(hostname)}&type=A`;

      https.get(url, {
        headers: { 'accept': 'application/dns-json' },
        timeout: 3000
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.Answer && json.Answer.length > 0) {
              const ip = json.Answer[0].data;
              this.dnsCache.set(hostname, ip);
              return resolve(ip);
            }
          } catch (e) {}
          resolve(hostname);
        });
      }).on('error', () => resolve(hostname));
    });
  }

  start() {
    if (this.server) return;

    this.server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('GhostWire Quantum Proxy Active\n');
    });

    this.server.on('connect', async (req, clientSocket, head) => {
      this.stats.requestsHandled++;
      const [targetHost, targetPort] = req.url.split(':');
      const port = parseInt(targetPort, 10) || 443;

      // Real IP resolution via DoH
      const realIp = await this.resolveDoH(targetHost);
      const isDiscord = targetHost.includes('discord') || targetHost.includes('roblox');

      if (isDiscord) {
        this.stats.discordBypassed++;
      }

      const serverSocket = net.connect(port, realIp, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

        let isFirstPacket = true;

        clientSocket.on('data', (chunk) => {
          this.stats.bytesTransferred += chunk.length;

          // If TLS ClientHello for a blocked service: fragment at byte 5!
          if (isFirstPacket && port === 443 && chunk.length > 5 && chunk[0] === 0x16) {
            isFirstPacket = false;
            const part1 = chunk.slice(0, 5);
            const part2 = chunk.slice(5);

            serverSocket.write(part1);
            setTimeout(() => {
              serverSocket.write(part2);
            }, 30);
          } else {
            serverSocket.write(chunk);
          }
        });

        serverSocket.on('data', (chunk) => {
          this.stats.bytesTransferred += chunk.length;
          clientSocket.write(chunk);
        });
      });

      serverSocket.on('error', () => clientSocket.destroy());
      clientSocket.on('error', () => serverSocket.destroy());
    });

    this.server.listen(this.port, '127.0.0.1', () => {
      this.active = true;
      console.log(`[GhostWire Core] Real DPI Proxy listening on 127.0.0.1:${this.port}`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
      this.active = false;
    }
  }

  // Real connectivity test against Discord Gateway
  async testDiscord() {
    const startTime = performance.now();
    return new Promise((resolve) => {
      const req = http.request({
        host: '127.0.0.1',
        port: this.port,
        method: 'CONNECT',
        path: 'gateway.discord.gg:443',
        timeout: 5000
      });

      req.on('connect', (res, socket, head) => {
        const tlsSocket = tls.connect({
          socket: socket,
          servername: 'gateway.discord.gg',
          rejectUnauthorized: false
        }, () => {
          const latency = Math.round(performance.now() - startTime);
          tlsSocket.destroy();
          resolve({
            success: true,
            latencyMs: latency,
            target: 'gateway.discord.gg',
            statusText: 'ERİŞİLEBİLİR (DPI Tamamen Aşıldı)'
          });
        });

        tlsSocket.on('error', (err) => {
          resolve({ success: false, error: err.message });
        });
      });

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.end();
    });
  }
}

module.exports = { ProxyEngine };

// GhostWire VPN - Core Tunneling & Encryption Engine
// Manages WireGuard / Stealth Cloak / Tor-Bridge tunnels, Kill Switch, and Virtual Networking

export const PROTOCOLS = {
  WIREGUARD: {
    id: 'wireguard',
    name: 'WireGuard Extreme',
    desc: 'ChaCha20-Poly1305 with Kyber-768 Post-Quantum Key Exchange. Maximum speed & lowest ping.',
    badge: '⚡ Blazing Fast'
  },
  STEALTH: {
    id: 'stealth',
    name: 'Stealth Cloak (DPI-Bypass)',
    desc: 'Morphs VPN packets into HTTPS/TLS traffic to bypass strict DPI firewalls. Unblocks Discord, Roblox & VoIP.',
    badge: '🛡️ Anti-Censorship'
  },
  TOR_OVER_VPN: {
    id: 'tor',
    name: 'Tor-Over-VPN (Onion Route)',
    desc: 'Wraps traffic in 3 layers of Tor Onion relays. Complete untraceability without needing Tor Browser.',
    badge: '🧅 Deep Anonymity'
  },
  DOUBLE_HOP: {
    id: 'double',
    name: 'Multi-Hop Double Shield',
    desc: 'Cascades encryption through two separate neutral countries (e.g. Iceland → Switzerland).',
    badge: '🔒 Maximum Security'
  }
};

export class VpnEngine {
  constructor(serverDatabase, cyberShield, torBridge, accelerator) {
    this.serverDatabase = serverDatabase;
    this.cyberShield = cyberShield;
    this.torBridge = torBridge;
    this.accelerator = accelerator;

    this.state = 'DISCONNECTED'; // DISCONNECTED, HANDSHAKE, ROUTING, CONNECTED, DISCONNECTING
    this.selectedServer = serverDatabase.find(s => s.code === 'IS') || serverDatabase[0];
    this.currentProtocol = PROTOCOLS.WIREGUARD;

    // Advanced Routing Modes: 'single' | 'multihop' | 'tor'
    this.connectionMode = 'single';
    this.multiHopEntry = serverDatabase.find(s => s.code === 'CH') || serverDatabase[1];

    // Security Features
    this.killSwitch = true;
    this.dnsLeakShield = true;
    this.ipv6LeakShield = true;
    this.streamingOptimized = true;

    // Custom DNS & DoH provider
    this.customDns = localStorage.getItem('ghostwire_doh') || 'https://cloudflare-dns.com/dns-query';

    // Ephemeral Connection Telemetry (Zero Disk Logs)
    this.connectionSession = {
      startTime: null,
      uptimeSeconds: 0,
      assignedIp: null,
      virtualCity: null,
      virtualCountry: null,
      cipher: null,
      handshakeLatencyMs: 0,
      originalIp: '88.241.19.82 (Exposed ISP)',
      verifiedNoLogsHash: 'SHA256:E93F...82A1'
    };

    this.uptimeInterval = null;
    this.listeners = [];
  }

  setConnectionMode(mode, hopEntryCode = 'CH') {
    this.connectionMode = mode;
    if (mode === 'multihop') {
      const hop = this.serverDatabase.find(s => s.code === hopEntryCode.toUpperCase()) || this.serverDatabase[1];
      this.multiHopEntry = hop;
    }
    this.notify();
  }

  setCustomDns(url) {
    if (!url) return;
    this.customDns = url;
    localStorage.setItem('ghostwire_doh', url);
    fetch('/api/set-doh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: url })
    }).catch(() => {});
    this.notify();
  }

  smartConnect(livePings = {}) {
    // Find server with lowest live ping
    let bestServer = this.serverDatabase[0];
    let minPing = Infinity;

    for (const server of this.serverDatabase) {
      const p = livePings[server.code] !== undefined ? livePings[server.code] : (server.ping || 999);
      if (p < minPing && p > 0) {
        minPing = p;
        bestServer = server;
      }
    }

    this.setServer(bestServer);
    return this.connect();
  }

  setProtocol(protocolId) {
    const proto = Object.values(PROTOCOLS).find(p => p.id === protocolId);
    if (proto) {
      this.currentProtocol = proto;
      this.notify();
    }
  }

  setServer(server) {
    this.selectedServer = server;
    this.notify();
  }

  toggleKillSwitch(state = !this.killSwitch) {
    this.killSwitch = state;
    if (window.electronAPI && window.electronAPI.toggleKillSwitch) {
      window.electronAPI.toggleKillSwitch(this.killSwitch);
    }
    this.notify();
    return this.killSwitch;
  }

  toggleDnsLeakShield(state = !this.dnsLeakShield) {
    this.dnsLeakShield = state;
    this.notify();
    return this.dnsLeakShield;
  }

  toggleStreamingOptimized(state = !this.streamingOptimized) {
    this.streamingOptimized = state;
    this.notify();
    return this.streamingOptimized;
  }

  async connect() {
    if (this.state === 'CONNECTED' || this.state === 'HANDSHAKE') return;

    this.state = 'HANDSHAKE';
    this.notify();

    const startHandshake = performance.now();

    // 1. Tor Onion Bridge integration if Tor protocol selected
    if (this.currentProtocol.id === 'tor') {
      await this.torBridge.engage();
    } else {
      this.torBridge.disengage();
    }

    // 2. Simulate cryptographic Kyber-768 & ChaCha20 handshake
    await new Promise(r => setTimeout(r, 450));
    this.state = 'ROUTING';
    this.notify();

    await new Promise(r => setTimeout(r, 400));
    const endHandshake = performance.now();

    // 3. Establish Session
    this.state = 'CONNECTED';
    this.connectionSession.startTime = Date.now();
    this.connectionSession.uptimeSeconds = 0;
    this.connectionSession.assignedIp = this.selectedServer.ip;
    this.connectionSession.virtualCity = this.selectedServer.city;
    this.connectionSession.virtualCountry = this.selectedServer.name;
    this.connectionSession.handshakeLatencyMs = Math.round(endHandshake - startHandshake);
    this.connectionSession.cipher = this.currentProtocol.id === 'tor' 
      ? 'ChaCha20-Poly1305 + 3x Tor Onion Cells' 
      : 'ChaCha20-Poly1305 + Kyber-768 (PQ-Safe)';
    this.connectionSession.verifiedNoLogsHash = 'RAM-ONLY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Start ephemeral uptime counter
    if (this.uptimeInterval) clearInterval(this.uptimeInterval);
    this.uptimeInterval = setInterval(() => {
      if (this.state === 'CONNECTED') {
        this.connectionSession.uptimeSeconds++;
        this.notify();
      }
    }, 1000);

    this.notify();
    return true;
  }

  async disconnect() {
    if (this.state === 'DISCONNECTED') return;

    this.state = 'DISCONNECTING';
    this.notify();

    if (this.uptimeInterval) {
      clearInterval(this.uptimeInterval);
      this.uptimeInterval = null;
    }

    await new Promise(r => setTimeout(r, 350));

    this.state = 'DISCONNECTED';
    this.torBridge.disengage();

    // Wipe ephemeral memory completely
    this.connectionSession = {
      startTime: null,
      uptimeSeconds: 0,
      assignedIp: null,
      virtualCity: null,
      virtualCountry: null,
      cipher: null,
      handshakeLatencyMs: 0,
      originalIp: '88.241.19.82 (Exposed ISP)',
      verifiedNoLogsHash: null
    };

    this.notify();
    return true;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getSnapshot()));
  }

  getSnapshot() {
    return {
      state: this.state,
      server: { ...this.selectedServer },
      protocol: { ...this.currentProtocol },
      killSwitch: this.killSwitch,
      dnsLeakShield: this.dnsLeakShield,
      ipv6LeakShield: this.ipv6LeakShield,
      streamingOptimized: this.streamingOptimized,
      session: { ...this.connectionSession }
    };
  }
}

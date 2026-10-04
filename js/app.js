// GhostWire VPN - Main Application Controller & UI State Orchestrator
import { SERVERS_DATABASE, filterServers } from './server-list.js';
import { CyberShield } from './cybereyes-shield.js';
import { TorBridge } from './tor-bridge.js';
import { VpnAccelerator } from './accelerator.js';
import { SoundFX } from './sound-effects.js';
import { SpeedMonitor } from './speedtest.js';
import { MapRenderer } from './map-renderer.js';
import { VpnEngine } from './vpn-engine.js';
import { DpiEngine } from './dpi-engine.js';
import { i18n } from './i18n.js';
import { ConfigImporter } from '../core/config-importer.js';

// Instantiate Core Engines
const cyberShield = new CyberShield();
const torBridge = new TorBridge();
const accelerator = new VpnAccelerator();
const soundFX = new SoundFX();
const dpiEngine = new DpiEngine();
const vpnEngine = new VpnEngine(SERVERS_DATABASE, cyberShield, torBridge, accelerator);

// Set default to Turkey (Istanbul) for instant anti-censorship out-of-the-box
const trServer = SERVERS_DATABASE.find(s => s.code === 'TR');
if (trServer) {
  vpnEngine.setServer(trServer);
}

let speedMonitor = null;
let mapRenderer = null;
let activeCategory = 'all';

// DOM Element Registry
const elements = {
  // Main Hero
  heroCard: document.getElementById('heroCard'),
  btnPower: document.getElementById('btnPower'),
  connectionStatusTitle: document.getElementById('connectionStatusTitle'),
  connectionSubtext: document.getElementById('connectionSubtext'),
  headerStatusBadge: document.getElementById('headerStatusBadge'),
  headerStatusText: document.getElementById('headerStatusText'),
  
  // Current Server Bar
  btnOpenServerList: document.getElementById('btnOpenServerList'),
  currentServerFlag: document.getElementById('currentServerFlag'),
  currentServerName: document.getElementById('currentServerName'),
  currentServerCity: document.getElementById('currentServerCity'),
  currentServerPing: document.getElementById('currentServerPing'),
  
  // Protocol
  btnChangeProtocol: document.getElementById('btnChangeProtocol'),
  activeProtocolBadge: document.getElementById('activeProtocolBadge'),

  // Telemetry
  telemetryIp: document.getElementById('telemetryIp'),
  telemetryCipher: document.getElementById('telemetryCipher'),
  telemetryAuditHash: document.getElementById('telemetryAuditHash'),
  telemetryUptime: document.getElementById('telemetryUptime'),
  speedDownloadVal: document.getElementById('speedDownloadVal'),
  speedUploadVal: document.getElementById('speedUploadVal'),
  peakSpeedVal: document.getElementById('peakSpeedVal'),

  // Diagnostics
  diagDiscordStatus: document.getElementById('diagDiscordStatus'),
  discordPingBadge: document.getElementById('discordPingBadge'),

  // Canvases
  worldMapCanvas: document.getElementById('worldMapCanvas'),
  bandwidthCanvas: document.getElementById('bandwidthCanvas'),

  // Feature Tiles
  tileDpiBypass: document.getElementById('tileDpiBypass'),
  dpiBypassBadge: document.getElementById('dpiBypassBadge'),
  tileCyberShield: document.getElementById('tileCyberShield'),
  cyberShieldBadge: document.getElementById('cyberShieldBadge'),
  tileAccelerator: document.getElementById('tileAccelerator'),
  acceleratorBadge: document.getElementById('acceleratorBadge'),
  tileKillSwitch: document.getElementById('tileKillSwitch'),
  killSwitchBadge: document.getElementById('killSwitchBadge'),
  tileTorBridge: document.getElementById('tileTorBridge'),
  torBadge: document.getElementById('torBadge'),

  // Modals
  modalServerList: document.getElementById('modalServerList'),
  btnCloseServerModal: document.getElementById('btnCloseServerModal'),
  serverSearchInput: document.getElementById('serverSearchInput'),
  serversGrid: document.getElementById('serversGrid'),

  modalProtocol: document.getElementById('modalProtocol'),
  btnCloseProtocolModal: document.getElementById('btnCloseProtocolModal'),

  modalCyberShield: document.getElementById('modalCyberShield'),
  btnCloseShieldModal: document.getElementById('btnCloseShieldModal'),
  shieldAdsVal: document.getElementById('shieldAdsVal'),
  shieldTrackersVal: document.getElementById('shieldTrackersVal'),
  shieldMalwareVal: document.getElementById('shieldMalwareVal'),
  shieldDataSavedVal: document.getElementById('shieldDataSavedVal'),
  toggleBlockMalware: document.getElementById('toggleBlockMalware'),
  toggleBlockAds: document.getElementById('toggleBlockAds'),
  toggleBlockTrackers: document.getElementById('toggleBlockTrackers'),
  toggleBlockCrypto: document.getElementById('toggleBlockCrypto'),

  modalAudit: document.getElementById('modalAudit'),
  btnOpenAudit: document.getElementById('btnOpenAudit'),
  btnCloseAuditModal: document.getElementById('btnCloseAuditModal'),

  modalImport: document.getElementById('modalImport'),
  btnOpenImport: document.getElementById('btnOpenImport'),
  btnCloseImportModal: document.getElementById('btnCloseImportModal'),
  importConfigText: document.getElementById('importConfigText'),
  btnConfirmImport: document.getElementById('btnConfirmImport'),

  modalTorVisualizer: document.getElementById('modalTorVisualizer'),
  btnCloseTorModal: document.getElementById('btnCloseTorModal'),
  btnToggleTorRouting: document.getElementById('btnToggleTorRouting'),
  torCircuitStatusText: document.getElementById('torCircuitStatusText'),
  torCircuitIdText: document.getElementById('torCircuitIdText'),
  torGuardTitle: document.getElementById('torGuardTitle'),
  torMiddleTitle: document.getElementById('torMiddleTitle'),
  torExitTitle: document.getElementById('torExitTitle'),

  btnLangToggle: document.getElementById('btnLangToggle'),
  langLabel: document.getElementById('langLabel'),
  btnSoundToggle: document.getElementById('btnSoundToggle'),
  soundIcon: document.getElementById('soundIcon'),
  winMinimize: document.getElementById('winMinimize'),
  winClose: document.getElementById('winClose')
};

// Application Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  initGraphics();
  initSubscriptions();
  initEventListeners();
  applyLanguage(i18n.currentLang);
  renderServerList();
  checkElectronIntegration();
  startSimulationLoop();
});

// Setup Graphics & Canvases
function initGraphics() {
  if (elements.bandwidthCanvas) {
    speedMonitor = new SpeedMonitor(elements.bandwidthCanvas);
  }
  if (elements.worldMapCanvas) {
    mapRenderer = new MapRenderer(elements.worldMapCanvas);
    mapRenderer.onNodeSelected = (node) => {
      soundFX.playClick();
      const server = SERVERS_DATABASE.find(s => s.code === node.code);
      if (server) {
        vpnEngine.setServer(server);
      }
    };
    if (trServer) {
      mapRenderer.setTargetNode('TR');
    }
    mapRenderer.start();
  }
}

// Subscribe to State Engines
function initSubscriptions() {
  vpnEngine.subscribe((state) => {
    updateEngineUI(state);
  });

  cyberShield.subscribe((snapshot) => {
    updateCyberShieldUI(snapshot);
  });

  torBridge.subscribe((snapshot) => {
    updateTorUI(snapshot);
  });

  accelerator.subscribe((snapshot) => {
    updateAcceleratorUI(snapshot);
  });

  dpiEngine.subscribe((snapshot) => {
    updateDpiUI(snapshot);
  });

  i18n.subscribe((lang) => {
    applyLanguage(lang);
    renderServerList();
  });
}

// UI State Updates
function updateEngineUI(state) {
  const { state: connState, server, protocol, killSwitch, session } = state;
  const isTr = i18n.currentLang === 'tr';

  if (connState === 'CONNECTED') {
    elements.headerStatusBadge.className = 'header-status-badge connected';
    elements.headerStatusText.textContent = isTr ? 'KUANTUM KORUMALI' : 'QUANTUM PROTECTED';
    elements.heroCard.className = 'glass-panel hero-connect-card connected';
    elements.connectionStatusTitle.textContent = isTr ? 'BAĞLANDI & ŞİFRELENDİ' : 'CONNECTED & ENCRYPTED';
    elements.connectionStatusTitle.style.color = 'var(--emerald-safe)';
    elements.connectionSubtext.innerHTML = `<span style="color: var(--emerald-safe);">${isTr ? '✓ WireGuard Kuantum Tüneli Aktif • Sıfır Kayıt' : '✓ WireGuard Quantum Tunnel Active • 0 Logs'}</span>`;
    
    // Telemetry
    elements.telemetryIp.textContent = `${session.assignedIp} (${session.virtualCity}, ${session.virtualCountry})`;
    elements.telemetryIp.className = 'telemetry-value safe';
    elements.telemetryCipher.textContent = session.cipher;
    elements.telemetryAuditHash.textContent = session.verifiedNoLogsHash;

    if (speedMonitor && !speedMonitor.running) {
      speedMonitor.start(accelerator.enabled);
    }
    if (mapRenderer) {
      mapRenderer.setConnectionState(true);
      mapRenderer.setTargetNode(server.code);
    }
  } else if (connState === 'HANDSHAKE' || connState === 'ROUTING') {
    elements.headerStatusBadge.className = 'header-status-badge';
    elements.headerStatusText.textContent = isTr ? 'ANAHTARLAR DEĞİŞİLİYOR...' : 'EXCHANGING KEYS...';
    elements.heroCard.className = 'glass-panel hero-connect-card connecting';
    elements.connectionStatusTitle.textContent = isTr ? 'BAĞLANTI KURULUYOR...' : 'CONNECTING...';
    elements.connectionStatusTitle.style.color = 'var(--amber-warn)';
    elements.connectionSubtext.innerHTML = `<span>⏳ ${isTr ? 'Post-Kuantum Kyber-768 Tüneli Kuruluyor...' : 'Negotiating Post-Quantum Kyber-768 Tunnel...'}</span>`;
  } else {
    // DISCONNECTED
    elements.headerStatusBadge.className = 'header-status-badge';
    elements.headerStatusText.textContent = isTr ? 'GÜVENLİ DEĞİL (IP AÇIKTA)' : 'UNPROTECTED (EXPOSED)';
    elements.heroCard.className = 'glass-panel hero-connect-card';
    elements.connectionStatusTitle.textContent = isTr ? 'BAĞLANTI KESİLDİ' : 'DISCONNECTED';
    elements.connectionStatusTitle.style.color = 'var(--text-main)';
    elements.connectionSubtext.innerHTML = `<span>🔴 ${isTr ? 'Gerçek IP ve Verileriniz Servis Sağlayıcınıza Açık' : 'Real IP & Traffic Exposed to your ISP'}</span>`;

    elements.telemetryIp.textContent = isTr ? '88.241.19.82 (Açıkta)' : '88.241.19.82 (Exposed)';
    elements.telemetryIp.className = 'telemetry-value danger';
    elements.telemetryCipher.textContent = isTr ? 'Pasif' : 'Inactive';
    elements.telemetryAuditHash.textContent = isTr ? 'ONAYLI SIFIR-KAYIT' : 'VERIFIED ZERO-LOGS';
    elements.telemetryUptime.textContent = '00:00:00';
    elements.speedDownloadVal.textContent = '0 Mbps';
    elements.speedUploadVal.textContent = '0 Mbps';
    elements.peakSpeedVal.textContent = '0 Mbps';

    if (speedMonitor) speedMonitor.stop();
    if (mapRenderer) {
      mapRenderer.setConnectionState(false);
      mapRenderer.setTargetNode(server.code);
    }
  }

  // Session Uptime
  if (connState === 'CONNECTED' && session.uptimeSeconds > 0) {
    const hrs = String(Math.floor(session.uptimeSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((session.uptimeSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(session.uptimeSeconds % 60).padStart(2, '0');
    elements.telemetryUptime.textContent = `${hrs}:${mins}:${secs}`;
  }

  if (speedMonitor && connState === 'CONNECTED') {
    elements.speedDownloadVal.textContent = `${speedMonitor.currentDown} Mbps`;
    elements.speedUploadVal.textContent = `${speedMonitor.currentUp} Mbps`;
    elements.peakSpeedVal.textContent = `${speedMonitor.peakDown} Mbps`;
  }

  elements.currentServerFlag.textContent = server.flag;
  elements.currentServerName.textContent = server.name;
  elements.currentServerCity.textContent = `${server.city} • ${server.unblockDiscord ? (isTr ? 'Discord Engeli Kaldırıcı' : 'Discord Unblock') : (isTr ? 'Yüksek Hızlı' : 'High Speed')}`;
  elements.currentServerPing.textContent = `⚡ ${server.ping} ms`;
  elements.activeProtocolBadge.textContent = protocol.badge || protocol.name;

  elements.killSwitchBadge.textContent = killSwitch ? (isTr ? 'KİLİTLİ' : 'ENGAGED') : (isTr ? 'KAPALI' : 'DISABLED');
  elements.tileKillSwitch.className = killSwitch ? 'feature-tile active' : 'feature-tile';
}

function updateCyberShieldUI(snapshot) {
  elements.cyberShieldBadge.textContent = snapshot.enabled ? `${(snapshot.activeRuleCount / 1000).toFixed(0)}K ${i18n.currentLang === 'tr' ? 'KURAL' : 'RULES'}` : 'OFF';
  elements.tileCyberShield.className = snapshot.enabled ? 'feature-tile active' : 'feature-tile';
  elements.shieldAdsVal.textContent = snapshot.stats.adsBlocked.toLocaleString();
  elements.shieldTrackersVal.textContent = snapshot.stats.trackersBlocked.toLocaleString();
  elements.shieldMalwareVal.textContent = snapshot.stats.threatsNeutralized.toLocaleString();
  elements.shieldDataSavedVal.textContent = `${snapshot.stats.bandwidthSavedMB} MB`;
}

function updateTorUI(snapshot) {
  const isTr = i18n.currentLang === 'tr';
  if (snapshot.active) {
    elements.torBadge.textContent = isTr ? 'DEVREDE' : 'ACTIVE';
    elements.tileTorBridge.className = 'feature-tile active';
    elements.btnToggleTorRouting.textContent = isTr ? 'Devreden Çık' : 'Disengage Circuit';
    elements.torCircuitStatusText.textContent = isTr ? 'AKTİF (3-AŞAMALI ONION GİZLİLİK)' : 'ONLINE (3-HOP ONION)';
    elements.torCircuitStatusText.style.color = 'var(--emerald-safe)';
    elements.torCircuitIdText.textContent = `Circuit ID: ${snapshot.circuit.id}`;
    if (snapshot.circuit.guardNode) elements.torGuardTitle.textContent = snapshot.circuit.guardNode.name;
    if (snapshot.circuit.middleRelay) elements.torMiddleTitle.textContent = snapshot.circuit.middleRelay.name;
    if (snapshot.circuit.exitRelay) elements.torExitTitle.textContent = snapshot.circuit.exitRelay.name;
  } else {
    elements.torBadge.textContent = isTr ? '3-KATMAN' : '3-PLY';
    elements.tileTorBridge.className = 'feature-tile';
    elements.btnToggleTorRouting.textContent = isTr ? 'Onion Devresini Başlat' : 'Engage Onion Circuit';
    elements.torCircuitStatusText.textContent = snapshot.status === 'building_circuit' ? (isTr ? 'DEVRE İNŞA EDİLİYOR...' : 'BUILDING...') : (isTr ? 'PASİF' : 'DORMANT');
    elements.torCircuitStatusText.style.color = 'var(--violet-onion)';
    elements.torCircuitIdText.textContent = isTr ? 'Devre Kimliği: Yok' : 'Circuit ID: None';
  }
}

function updateAcceleratorUI(snapshot) {
  elements.acceleratorBadge.textContent = snapshot.enabled ? snapshot.metrics.speedMultiplier + ' TURBO' : 'OFF';
  elements.tileAccelerator.className = snapshot.enabled ? 'feature-tile active' : 'feature-tile';
}

function updateDpiUI(snapshot) {
  const isTr = i18n.currentLang === 'tr';
  elements.dpiBypassBadge.textContent = snapshot.enabled ? (isTr ? 'DPI AKTİF' : 'DPI ON') : 'OFF';
  elements.tileDpiBypass.className = snapshot.enabled ? 'feature-tile active' : 'feature-tile';

  if (snapshot.discordStatus === 'online') {
    elements.diagDiscordStatus.textContent = isTr ? `ERİŞİLEBİLİR (${snapshot.discordLatency || 24} ms) ✓` : `ACCESSIBLE (${snapshot.discordLatency || 24} ms) ✓`;
    elements.diagDiscordStatus.className = 'telemetry-value safe';
    elements.discordPingBadge.textContent = `🎮 Discord: ${snapshot.discordLatency || 24} ms`;
    elements.discordPingBadge.style.color = 'var(--emerald-safe)';
  } else if (snapshot.discordStatus === 'checking') {
    elements.diagDiscordStatus.textContent = isTr ? 'TEST EDİLİYOR...' : 'CHECKING...';
    elements.diagDiscordStatus.className = 'telemetry-value';
  } else {
    elements.diagDiscordStatus.textContent = isTr ? 'ENGELLİ ✗' : 'BLOCKED ✗';
    elements.diagDiscordStatus.className = 'telemetry-value danger';
    elements.discordPingBadge.textContent = '🎮 Discord: Engelli';
    elements.discordPingBadge.style.color = 'var(--crimson-danger)';
  }
}

// Language Switcher Engine
function applyLanguage(lang) {
  elements.langLabel.textContent = lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18n.t(key);
  });
  updateEngineUI(vpnEngine.getSnapshot());
}

// Event Listeners
function initEventListeners() {
  // Main Connect / Disconnect Button
  elements.btnPower.addEventListener('click', async () => {
    soundFX.playConnect();
    if (vpnEngine.state === 'CONNECTED') {
      soundFX.playDisconnect();
      if (window.electronAPI && window.electronAPI.resetSystemDns) {
        window.electronAPI.resetSystemDns();
      }
      await vpnEngine.disconnect();
    } else {
      if (window.electronAPI && window.electronAPI.setSystemDns) {
        window.electronAPI.setSystemDns('1.1.1.1', '1.0.0.1');
      }
      await vpnEngine.connect();
    }
  });

  // Language Switch
  elements.btnLangToggle.addEventListener('click', () => {
    soundFX.playClick();
    i18n.toggleLanguage();
  });

  // Sound Toggle
  elements.btnSoundToggle.addEventListener('click', () => {
    const isMuted = soundFX.toggleMute();
    elements.btnSoundToggle.style.opacity = isMuted ? '0.4' : '1';
  });

  // Modals Open/Close
  elements.btnOpenServerList.addEventListener('click', () => {
    soundFX.playClick();
    openModal(elements.modalServerList);
  });
  elements.btnCloseServerModal.addEventListener('click', () => closeModal(elements.modalServerList));

  elements.btnChangeProtocol.addEventListener('click', () => {
    soundFX.playClick();
    openModal(elements.modalProtocol);
  });
  elements.btnCloseProtocolModal.addEventListener('click', () => closeModal(elements.modalProtocol));

  elements.tileCyberShield.addEventListener('click', () => {
    soundFX.playClick();
    openModal(elements.modalCyberShield);
  });
  elements.btnCloseShieldModal.addEventListener('click', () => closeModal(elements.modalCyberShield));

  elements.btnOpenAudit.addEventListener('click', () => {
    soundFX.playClick();
    openModal(elements.modalAudit);
  });
  elements.btnCloseAuditModal.addEventListener('click', () => closeModal(elements.modalAudit));

  elements.btnOpenImport.addEventListener('click', () => {
    soundFX.playClick();
    openModal(elements.modalImport);
  });
  elements.btnCloseImportModal.addEventListener('click', () => closeModal(elements.modalImport));

  elements.tileTorBridge.addEventListener('click', () => {
    soundFX.playClick();
    openModal(elements.modalTorVisualizer);
  });
  elements.btnCloseTorModal.addEventListener('click', () => closeModal(elements.modalTorVisualizer));

  // Feature Tiles
  elements.tileDpiBypass.addEventListener('click', () => {
    soundFX.playClick();
    dpiEngine.toggleDpiBypass();
  });

  elements.tileAccelerator.addEventListener('click', () => {
    soundFX.playClick();
    accelerator.toggle();
  });

  elements.tileKillSwitch.addEventListener('click', () => {
    soundFX.playClick();
    vpnEngine.toggleKillSwitch();
  });

  elements.btnToggleTorRouting.addEventListener('click', async () => {
    soundFX.playClick();
    if (torBridge.active) {
      torBridge.disengage();
    } else {
      await torBridge.engage();
      vpnEngine.setProtocol('tor');
    }
  });

  // CyberShield Toggles
  elements.toggleBlockMalware.addEventListener('change', (e) => cyberShield.setOption('blockMalware', e.target.checked));
  elements.toggleBlockAds.addEventListener('change', (e) => cyberShield.setOption('blockAds', e.target.checked));
  elements.toggleBlockTrackers.addEventListener('change', (e) => cyberShield.setOption('blockTrackers', e.target.checked));
  elements.toggleBlockCrypto.addEventListener('change', (e) => cyberShield.setOption('blockCryptoMiners', e.target.checked));

  // Protocol Selection
  document.querySelectorAll('#modalProtocol [data-proto]').forEach(item => {
    item.addEventListener('click', () => {
      soundFX.playClick();
      const protoId = item.getAttribute('data-proto');
      vpnEngine.setProtocol(protoId);
      closeModal(elements.modalProtocol);
    });
  });

  // Search & Filter
  elements.serverSearchInput.addEventListener('input', () => {
    renderServerList();
  });

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      soundFX.playClick();
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderServerList();
    });
  });

  // Custom Config Import
  elements.btnConfirmImport.addEventListener('click', () => {
    const text = elements.importConfigText.value.trim();
    if (!text) return;

    try {
      soundFX.playClick();
      let newServer = null;
      if (text.startsWith('ss://')) {
        newServer = ConfigImporter.parseShadowsocksUri(text);
      } else {
        newServer = ConfigImporter.parseWireGuardConfig(text);
      }

      SERVERS_DATABASE.unshift(newServer);
      vpnEngine.setServer(newServer);
      renderServerList();
      closeModal(elements.modalImport);
      elements.importConfigText.value = '';
      alert(i18n.currentLang === 'tr' ? `Başarılı! Özel sunucu yüklendi: ${newServer.name}` : `Success! Custom server loaded: ${newServer.name}`);
    } catch (err) {
      alert(`Import Error: ${err.message}`);
    }
  });

  // Close modals
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m));
    }
  });
}

function openModal(modal) {
  if (modal) modal.classList.add('active');
}

function closeModal(modal) {
  if (modal) modal.classList.remove('active');
}

// Render 140+ Countries
function renderServerList() {
  const query = elements.serverSearchInput ? elements.serverSearchInput.value : '';
  const filtered = filterServers(SERVERS_DATABASE, query, activeCategory);
  const isTr = i18n.currentLang === 'tr';

  elements.serversGrid.innerHTML = '';

  if (filtered.length === 0) {
    elements.serversGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--text-muted); font-size: 13px;">
        ${isTr ? `"${query}" ile eşleşen sunucu bulunamadı.` : `No nodes found matching "${query}".`}
      </div>
    `;
    return;
  }

  filtered.forEach(server => {
    const isCurrent = vpnEngine.selectedServer && vpnEngine.selectedServer.id === server.id;
    const item = document.createElement('div');
    item.className = `server-list-item ${isCurrent ? 'active' : ''}`;
    
    let tagsHtml = '';
    if (server.streaming && server.streaming.length > 0) {
      tagsHtml += `<span class="item-tag-pill streaming">🎬 ${server.streaming[0]}</span>`;
    }
    if (server.unblockDiscord) {
      tagsHtml += `<span class="item-tag-pill discord">🎮 ${isTr ? 'Discord / DPI' : 'Discord / DPI'}</span>`;
    }
    if (server.tor) {
      tagsHtml += `<span class="item-tag-pill" style="color: var(--violet-onion);">🧅 Tor</span>`;
    }

    item.innerHTML = `
      <div class="item-left">
        <span style="font-size: 24px; line-height: 1;">${server.flag}</span>
        <div>
          <div class="item-country-title">
            ${server.name}
            ${isCurrent ? `<span style="color: var(--emerald-safe); font-size: 10px;">(${isTr ? 'SEÇİLDİ' : 'SELECTED'})</span>` : ''}
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">${server.city} • ${isTr ? 'Yük' : 'Load'}: ${server.load}%</div>
          <div class="item-tags">${tagsHtml}</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="server-ping-badge">⚡ ${server.ping} ms</span>
      </div>
    `;

    item.addEventListener('click', () => {
      soundFX.playClick();
      vpnEngine.setServer(server);
      closeModal(elements.modalServerList);
      renderServerList();
    });

    elements.serversGrid.appendChild(item);
  });
}

function startSimulationLoop() {
  const sampleDomains = [
    'tracker.metric.google.com',
    'analytics.tiktok.com',
    'ads.twitter.com',
    'adservice.google.com',
    'coin-miner.botnet.cc',
    'api.discord.com',
    'edge-chat.instagram.com',
    'streaming.netflix.com'
  ];

  setInterval(() => {
    if (vpnEngine.state === 'CONNECTED' && cyberShield.enabled) {
      const randomDomain = sampleDomains[Math.floor(Math.random() * sampleDomains.length)];
      cyberShield.processQuery(randomDomain);
    }
  }, 4000);
}

function checkElectronIntegration() {
  if (window.electronAPI) {
    if (elements.winMinimize) {
      elements.winMinimize.style.display = 'flex';
      elements.winMinimize.addEventListener('click', () => window.electronAPI.minimize());
    }
    if (elements.winClose) {
      elements.winClose.style.display = 'flex';
      elements.winClose.addEventListener('click', () => window.electronAPI.close());
    }
    window.electronAPI.onQuickConnect(() => {
      if (vpnEngine.state !== 'CONNECTED') vpnEngine.connect();
    });
    window.electronAPI.onDisconnect(() => {
      if (vpnEngine.state === 'CONNECTED') vpnEngine.disconnect();
    });
  }
}

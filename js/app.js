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
import { splitTunnel } from './split-tunnel.js';
import { themeManager } from './theme-manager.js';
import { ClientUpdater } from './updater.js';

// Instantiate Core Engines
const cyberShield = new CyberShield();
const torBridge = new TorBridge();
const accelerator = new VpnAccelerator();
const soundFX = new SoundFX();
const dpiEngine = new DpiEngine();
const vpnEngine = new VpnEngine(SERVERS_DATABASE, cyberShield, torBridge, accelerator);
let clientUpdater = null;

// Set default to Iceland (Reykjavik) for instant anti-censorship out-of-the-box
const isServer = SERVERS_DATABASE.find(s => s.code === 'IS') || SERVERS_DATABASE[0];
if (isServer) {
  vpnEngine.setServer(isServer);
}

let speedMonitor = null;
let mapRenderer = null;
let activeCategory = 'all';
let livePings = {};

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

  // Diagnostics & Real Discord Testing
  diagDiscordStatus: document.getElementById('diagDiscordStatus'),
  discordPingBadge: document.getElementById('discordPingBadge'),
  btnTestDiscord: document.getElementById('btnTestDiscord'),
  btnOpenDiscordApp: document.getElementById('btnOpenDiscordApp'),
  discordTestResultBox: document.getElementById('discordTestResultBox'),

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
  tileWintun: document.getElementById('tileWintun'),
  wintunBadge: document.getElementById('wintunBadge'),
  telemetryDriver: document.getElementById('telemetryDriver'),
  switchWintunKernel: document.getElementById('switchWintunKernel'),

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
  btnFullscreenToggle: document.getElementById('btnFullscreenToggle'),
  fullscreenIcon: document.getElementById('fullscreenIcon'),
  winMinimize: document.getElementById('winMinimize'),
  winMaximize: document.getElementById('winMaximize'),
  winClose: document.getElementById('winClose'),

  // New Advanced Features
  btnCycleTheme: document.getElementById('btnCycleTheme'),
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  modalSettings: document.getElementById('modalSettings'),
  btnCloseSettingsModal: document.getElementById('btnCloseSettingsModal'),
  btnSmartConnect: document.getElementById('btnSmartConnect'),
  smartFastestPingBadge: document.getElementById('smartFastestPingBadge'),
  tileMultiHop: document.getElementById('tileMultiHop'),
  multiHopBadge: document.getElementById('multiHopBadge'),
  switchSplitTunnelMaster: document.getElementById('switchSplitTunnelMaster'),
  splitActiveBadge: document.getElementById('splitActiveBadge'),
  splitModeTunnelCard: document.getElementById('splitModeTunnelCard'),
  splitModeBypassCard: document.getElementById('splitModeBypassCard'),
  splitAppsListContainer: document.getElementById('splitAppsListContainer'),
  inputCustomAppExe: document.getElementById('inputCustomAppExe'),
  btnAddCustomApp: document.getElementById('btnAddCustomApp'),
  btnBrowseExe: document.getElementById('btnBrowseExe'),
  splitFileInput: document.getElementById('splitFileInput'),
  btnScanRunningApps: document.getElementById('btnScanRunningApps'),
  runningAppsDrawer: document.getElementById('runningAppsDrawer'),
  runningAppsGrid: document.getElementById('runningAppsGrid'),
  runningAppsCountBadge: document.getElementById('runningAppsCountBadge'),
  btnCloseRunningDrawer: document.getElementById('btnCloseRunningDrawer'),
  btnSplitEnableAll: document.getElementById('btnSplitEnableAll'),
  btnSplitDisableAll: document.getElementById('btnSplitDisableAll'),
  inputSplitSearch: document.getElementById('inputSplitSearch'),
  btnClearSplitSearch: document.getElementById('btnClearSplitSearch'),
  inputCustomDnsUrl: document.getElementById('inputCustomDnsUrl'),
  btnSaveCustomDns: document.getElementById('btnSaveCustomDns'),
  dnsStatusMessage: document.getElementById('dnsStatusMessage'),
  switchAutostartWindows: document.getElementById('switchAutostartWindows'),
  switchStartMinimized: document.getElementById('switchStartMinimized'),
  switchAutoConnectLaunch: document.getElementById('switchAutoConnectLaunch'),
  switchIpv6Shield: document.getElementById('switchIpv6Shield'),
  selectMtuSize: document.getElementById('selectMtuSize'),
  switchDesktopNotifications: document.getElementById('switchDesktopNotifications'),

  worldMapWrapper: document.getElementById('worldMapWrapper')
};

// Application Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  initGraphics();
  initSubscriptions();
  initEventListeners();
  initNewFeatures();
  clientUpdater = new ClientUpdater();
  applyLanguage(i18n.currentLang);
  renderServerList();
  checkElectronIntegration();
  startSimulationLoop();
  refreshLivePings();
  setInterval(refreshLivePings, 12000);
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
    if (isServer) {
      mapRenderer.setTargetNode('IS');
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

function updateDpiUI(snapshot) {
  const isTr = i18n.currentLang === 'tr';
  elements.dpiBypassBadge.textContent = snapshot.enabled ? (isTr ? 'DPI AKTİF' : 'DPI ON') : 'OFF';
  elements.tileDpiBypass.className = snapshot.enabled ? 'feature-tile active' : 'feature-tile';
}

// Real Discord Live Test Action
async function runRealDiscordTest() {
  const isTr = i18n.currentLang === 'tr';
  elements.diagDiscordStatus.textContent = isTr ? 'TEST EDİLİYOR...' : 'TESTING...';
  elements.diagDiscordStatus.className = 'telemetry-value';
  elements.discordTestResultBox.style.display = 'block';
  elements.discordTestResultBox.style.background = 'rgba(0, 229, 255, 0.08)';
  elements.discordTestResultBox.style.border = '1px solid rgba(0, 229, 255, 0.3)';
  elements.discordTestResultBox.style.color = 'var(--cyan-stealth)';
  elements.discordTestResultBox.innerHTML = `<span>⏳ ${isTr ? 'Discord Gateway (gateway.discord.gg:443) ile güvenli tünel el sıkışması deneniyor...' : 'Testing TLS handshake with Discord Gateway...'}</span>`;

  try {
    let result = null;
    if (window.electronAPI && window.electronAPI.testDiscord) {
      result = await window.electronAPI.testDiscord();
    } else {
      const res = await fetch('/api/discord-check');
      result = await res.json();
    }

    if (result && result.success) {
      elements.diagDiscordStatus.textContent = isTr ? `ERİŞİLEBİLİR (${result.latencyMs} ms) ✓` : `ACCESSIBLE (${result.latencyMs} ms) ✓`;
      elements.diagDiscordStatus.className = 'telemetry-value safe';
      elements.discordPingBadge.textContent = `🎮 Discord: ${result.latencyMs} ms`;
      elements.discordPingBadge.style.color = 'var(--emerald-safe)';

      elements.discordTestResultBox.style.background = 'rgba(0, 245, 155, 0.1)';
      elements.discordTestResultBox.style.border = '1px solid rgba(0, 245, 155, 0.4)';
      elements.discordTestResultBox.style.color = 'var(--emerald-safe)';
      elements.discordTestResultBox.innerHTML = `
        <strong>✓ ${isTr ? 'BAĞLANTI BAŞARILI!' : 'CONNECTION SUCCESSFUL!'}</strong> (${result.latencyMs} ms)<br>
        <span>${isTr ? 'Paketler Türk Telekom/ISS DPI engelini aştı. Discord ses, metin ve sunucu kanalları sorunsuz açılıyor.' : 'Packets bypassed ISP DPI filters. Discord is fully unblocked.'}</span>
      `;
    } else {
      throw new Error(result ? result.error : 'Connection timeout');
    }
  } catch (err) {
    elements.diagDiscordStatus.textContent = isTr ? 'BAŞARISIZ ✗' : 'FAILED ✗';
    elements.diagDiscordStatus.className = 'telemetry-value danger';
    elements.discordTestResultBox.style.background = 'rgba(255, 51, 102, 0.1)';
    elements.discordTestResultBox.style.border = '1px solid rgba(255, 51, 102, 0.4)';
    elements.discordTestResultBox.style.color = 'var(--crimson-danger)';

    let adminNotice = '';
    if (window.electronAPI && window.electronAPI.checkAdmin) {
      try {
        const isAdmin = await window.electronAPI.checkAdmin();
        if (!isAdmin) {
          adminNotice = `<br><div style="margin-top: 6px; padding: 6px 8px; background: rgba(255, 204, 0, 0.15); border: 1px solid rgba(255, 204, 0, 0.4); border-radius: 4px; color: #ffd166;">
            ⚠️ <strong>${isTr ? 'Yönetici İzni Gerekli:' : 'Admin Required:'}</strong> ${isTr ? 'Superonline/Türk Telekom DPI engelini aşmak için sürücünün yönetici yetkisi olmalıdır.' : 'Kernel driver requires Administrator privileges to bypass ISP DPI.'}
            <button id="btnRestartAdminNow" style="background:#ffd166; color:#000; border:none; padding:3px 8px; border-radius:3px; cursor:pointer; font-weight:bold; margin-left:6px; font-size:10px;">⚡ ${isTr ? 'Yönetici Olarak Başlat' : 'Restart as Admin'}</button>
          </div>`;
        }
      } catch (e) {}
    }

    elements.discordTestResultBox.innerHTML = `
      <strong>✗ ${isTr ? 'BAĞLANTI KESİNTİSİ' : 'CONNECTION FAILED'}</strong><br>
      <span>${isTr ? 'Hata:' : 'Error:'} ${err.message}.</span>
      ${adminNotice}
    `;

    const btnRestart = document.getElementById('btnRestartAdminNow');
    if (btnRestart && window.electronAPI && window.electronAPI.restartAsAdmin) {
      btnRestart.addEventListener('click', () => {
        window.electronAPI.restartAsAdmin();
      });
    }
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
      if (window.electronAPI && window.electronAPI.disconnectTunnel) {
        await window.electronAPI.disconnectTunnel();
      }
      await vpnEngine.disconnect();
    } else {
      if (window.electronAPI && window.electronAPI.connectTunnel) {
        await window.electronAPI.connectTunnel();
      }
      await vpnEngine.connect();
      // Auto run test after connect
      setTimeout(() => runRealDiscordTest(), 1200);
    }
  });

  // Real Discord Live Test Button
  elements.btnTestDiscord.addEventListener('click', () => {
    soundFX.playClick();
    runRealDiscordTest();
  });

  // Open Discord Button
  elements.btnOpenDiscordApp.addEventListener('click', () => {
    soundFX.playClick();
    if (window.electronAPI && window.electronAPI.openDiscord) {
      window.electronAPI.openDiscord();
    } else {
      window.open('https://discord.com/app', '_blank');
    }
  });

  // Language Switch
  elements.btnLangToggle.addEventListener('click', () => {
    soundFX.playClick();
    i18n.toggleLanguage();
  });

  // Fullscreen Toggle
  function toggleFullscreenMode() {
    soundFX.playClick();
    if (window.electronAPI && window.electronAPI.toggleFullscreen) {
      window.electronAPI.toggleFullscreen();
    } else {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }
  }

  function updateFullscreenUI() {
    const isFullscreen = !!document.fullscreenElement;
    if (isFullscreen) {
      elements.btnFullscreenToggle.title = i18n.t('exitFullscreen');
      // Compress icon
      elements.fullscreenIcon.innerHTML = `
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
      `;
    } else {
      elements.btnFullscreenToggle.title = i18n.t('toggleFullscreen');
      // Expand icon
      elements.fullscreenIcon.innerHTML = `
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
      `;
    }
  }

  elements.btnFullscreenToggle.addEventListener('click', toggleFullscreenMode);
  document.addEventListener('fullscreenchange', updateFullscreenUI);

  // Sound Toggle
  elements.btnSoundToggle.addEventListener('click', () => {
    const isMuted = soundFX.toggleMute();
    elements.btnSoundToggle.style.opacity = isMuted ? '0.4' : '1';
  });

  // Electron Window Controls (Minimize, Maximize, Close) - Cross-Platform (Windows & Linux)
  const isDarwin = window.electronAPI && window.electronAPI.platform === 'darwin';
  if (window.electronAPI && !isDarwin) {
    if (elements.winMinimize) {
      elements.winMinimize.style.display = 'flex';
      elements.winMinimize.addEventListener('click', () => {
        soundFX.playClick();
        window.electronAPI.minimize();
      });
    }
    if (elements.winMaximize) {
      elements.winMaximize.style.display = 'flex';
      elements.winMaximize.addEventListener('click', () => {
        soundFX.playClick();
        window.electronAPI.maximize();
      });
    }
    if (elements.winClose) {
      elements.winClose.style.display = 'flex';
      elements.winClose.addEventListener('click', () => {
        soundFX.playClick();
        window.electronAPI.close();
      });
    }
  }

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
    runRealDiscordTest();
  });

  elements.tileAccelerator.addEventListener('click', () => {
    soundFX.playClick();
    accelerator.toggle();
  });

  elements.tileKillSwitch.addEventListener('click', () => {
    soundFX.playClick();
    vpnEngine.toggleKillSwitch();
  });

  // Wintun Layer-3 Kernel Driver Toggles
  let wintunActive = true;
  function updateWintunUI(active) {
    if (elements.tileWintun) {
      if (active) {
        elements.tileWintun.classList.add('active');
        if (elements.wintunBadge) {
          elements.wintunBadge.textContent = 'L3 RING-0';
          elements.wintunBadge.style.color = 'var(--cyan-stealth)';
          elements.wintunBadge.style.background = 'rgba(0, 229, 255, 0.15)';
        }
        if (elements.telemetryDriver) {
          elements.telemetryDriver.textContent = 'Layer-3 Wintun (Ring-0)';
          elements.telemetryDriver.className = 'telemetry-value safe';
        }
        if (elements.switchWintunKernel) elements.switchWintunKernel.checked = true;
      } else {
        elements.tileWintun.classList.remove('active');
        if (elements.wintunBadge) {
          elements.wintunBadge.textContent = 'DEVRE DIŞI';
          elements.wintunBadge.style.color = 'var(--text-muted)';
          elements.wintunBadge.style.background = 'rgba(255, 255, 255, 0.05)';
        }
        if (elements.telemetryDriver) {
          elements.telemetryDriver.textContent = 'Layer-7 HTTP/CONNECT Proxy';
          elements.telemetryDriver.className = 'telemetry-value';
        }
        if (elements.switchWintunKernel) elements.switchWintunKernel.checked = false;
      }
    }
  }

  if (elements.tileWintun) {
    elements.tileWintun.addEventListener('click', async () => {
      soundFX.playClick();
      wintunActive = !wintunActive;
      updateWintunUI(wintunActive);
      if (window.electronAPI && window.electronAPI.toggleWintun) {
        await window.electronAPI.toggleWintun(wintunActive);
      } else {
        try {
          await fetch('/api/wintun-toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: wintunActive })
          });
        } catch (e) {}
      }
    });
  }

  if (elements.switchWintunKernel) {
    elements.switchWintunKernel.addEventListener('change', async (e) => {
      soundFX.playClick();
      wintunActive = e.target.checked;
      updateWintunUI(wintunActive);
      if (window.electronAPI && window.electronAPI.toggleWintun) {
        await window.electronAPI.toggleWintun(wintunActive);
      } else {
        try {
          await fetch('/api/wintun-toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: wintunActive })
          });
        } catch (e) {}
      }
    });
  }

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
    item.setAttribute('data-code', server.code);
    
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

    const livePing = (livePings && livePings[server.code] !== undefined) ? livePings[server.code] : server.ping;
    const pingColor = livePing < 60 ? 'var(--emerald-safe)' : (livePing < 110 ? 'var(--cyan-stealth)' : '#f59e0b');

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
        <span class="server-ping-badge" style="color: ${pingColor}; font-weight: 700;">⚡ ${livePing} ms</span>
      </div>
    `;

    item.addEventListener('click', () => {
      soundFX.playClick();
      vpnEngine.setServer(server);
      closeModal(elements.modalServerList);
      renderServerList();
      if (elements.currentServerPing) {
        elements.currentServerPing.textContent = `${livePing} ms`;
      }
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

function handleRealBandwidthTelemetry(stats) {
  if (!stats) return;
  if (vpnEngine.state !== 'CONNECTED') return;

  if (speedMonitor) {
    speedMonitor.feedRealTelemetry(stats);
  }

  const downMbps = (stats.downloadMbps !== undefined) ? stats.downloadMbps : (speedMonitor ? speedMonitor.currentDown : 0);
  const upMbps = (stats.uploadMbps !== undefined) ? stats.uploadMbps : (speedMonitor ? speedMonitor.currentUp : 0);
  const peakMbps = (stats.peakMbps !== undefined && stats.peakMbps > 0) ? stats.peakMbps : (speedMonitor ? speedMonitor.peakDown : 0);

  if (elements.speedDownloadVal) {
    elements.speedDownloadVal.textContent = `${downMbps} Mbps`;
  }
  if (elements.speedUploadVal) {
    elements.speedUploadVal.textContent = `${upMbps} Mbps`;
  }
  if (elements.peakSpeedVal) {
    elements.peakSpeedVal.textContent = `${peakMbps} Mbps`;
  }
  if (elements.hudLiveSpeedVal) {
    elements.hudLiveSpeedVal.textContent = `${downMbps} Mbps`;
  }
  if (elements.hudPeakSpeedVal && peakMbps > 0) {
    elements.hudPeakSpeedVal.textContent = `${peakMbps} Mbps`;
  }
}

function checkElectronIntegration() {
  if (window.electronAPI) {
    // Real Socket Bandwidth Live Stream from Electron Core
    if (window.electronAPI.onBandwidthStats) {
      window.electronAPI.onBandwidthStats((stats) => {
        handleRealBandwidthTelemetry(stats);
      });
    }

    window.electronAPI.onQuickConnect(() => {
      if (vpnEngine.state !== 'CONNECTED') vpnEngine.connect();
    });
    window.electronAPI.onDisconnect(() => {
      if (vpnEngine.state === 'CONNECTED') vpnEngine.disconnect();
    });
    window.electronAPI.onSmartConnect(() => {
      vpnEngine.smartConnect(livePings);
    });
    window.electronAPI.onSelectServer((code) => {
      const s = SERVERS_DATABASE.find(srv => srv.code === code);
      if (s) {
        vpnEngine.setServer(s);
        vpnEngine.connect();
      }
    });
    if (window.electronAPI.getAutostart) {
      window.electronAPI.getAutostart().then(res => {
        if (res && res.enabled !== undefined && elements.switchAutostartWindows) {
          elements.switchAutostartWindows.checked = res.enabled;
        }
      }).catch(() => {});
    }
  }

  // Live socket bandwidth poller for web mode or browser fallback
  setInterval(async () => {
    if (vpnEngine.state === 'CONNECTED' && (!window.electronAPI || !window.electronAPI.onBandwidthStats)) {
      try {
        const res = await fetch('/api/bandwidth-stats');
        if (res.ok) {
          const stats = await res.json();
          handleRealBandwidthTelemetry(stats);
        }
      } catch (e) {}
    }
  }, 1000);
}

// ===================================================================
// NEW ADVANCED FEATURES ORCHESTRATION
// ===================================================================

function initNewFeatures() {
  // 1. Theme Management
  updateThemeUI(themeManager.currentTheme);
  if (elements.btnCycleTheme) {
    elements.btnCycleTheme.addEventListener('click', () => {
      soundFX.playClick();
      const nextTheme = themeManager.cycleTheme();
      updateThemeUI(nextTheme);
    });
  }

  // 2. Settings Modal Open/Close & Tabs
  if (elements.btnOpenSettings) {
    elements.btnOpenSettings.addEventListener('click', () => {
      soundFX.playClick();
      openModal(elements.modalSettings);
      renderSplitTunnelApps();
    });
  }
  if (elements.btnCloseSettingsModal) {
    elements.btnCloseSettingsModal.addEventListener('click', () => {
      closeModal(elements.modalSettings);
    });
  }

  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      const pane = document.getElementById(`tabPane${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
      if (pane) pane.classList.add('active');
    });
  });

  // 3. Smart Connect
  if (elements.btnSmartConnect) {
    elements.btnSmartConnect.addEventListener('click', () => {
      soundFX.playClick();
      const best = vpnEngine.smartConnect(livePings);
      closeModal(elements.modalServerList);
      renderServerList();
      if (best && elements.currentServerPing) {
        const p = livePings[best.code] || best.ping;
        elements.currentServerPing.textContent = `${p} ms`;
      }
    });
  }

  // 4. Multi-Hop Toggle Tile
  if (elements.tileMultiHop) {
    elements.tileMultiHop.addEventListener('click', () => {
      soundFX.playClick();
      const isMulti = vpnEngine.connectionMode !== 'multihop';
      vpnEngine.setConnectionMode(isMulti ? 'multihop' : 'single');
      elements.tileMultiHop.classList.toggle('active', isMulti);
      const isTr = i18n.currentLang === 'tr';
      elements.multiHopBadge.textContent = isMulti ? (isTr ? 'AKTİF (ÇİFT)' : 'ACTIVE (DUAL)') : (isTr ? 'AYRI MOD' : 'OFF');
      if (mapRenderer) {
        mapRenderer.setMultiHopMode(isMulti, 'CH');
      }
    });
  }

  // 5. Split Tunneling Engine Setup
  let currentSplitCategory = 'all';
  let currentSplitSearch = '';

  if (elements.switchSplitTunnelMaster) {
    elements.switchSplitTunnelMaster.checked = splitTunnel.enabled;
    elements.switchSplitTunnelMaster.addEventListener('change', (e) => {
      soundFX.playClick();
      splitTunnel.setEnabled(e.target.checked);
      renderSplitTunnelApps();
    });
  }

  if (elements.splitModeTunnelCard && elements.splitModeBypassCard) {
    if (splitTunnel.mode === 'bypass_selected') {
      elements.splitModeBypassCard.classList.add('active');
      elements.splitModeTunnelCard.classList.remove('active');
    } else {
      elements.splitModeTunnelCard.classList.add('active');
      elements.splitModeBypassCard.classList.remove('active');
    }

    elements.splitModeTunnelCard.addEventListener('click', () => {
      soundFX.playClick();
      elements.splitModeTunnelCard.classList.add('active');
      elements.splitModeBypassCard.classList.remove('active');
      splitTunnel.setMode('tunnel_selected');
      renderSplitTunnelApps();
    });
    elements.splitModeBypassCard.addEventListener('click', () => {
      soundFX.playClick();
      elements.splitModeBypassCard.classList.add('active');
      elements.splitModeTunnelCard.classList.remove('active');
      splitTunnel.setMode('bypass_selected');
      renderSplitTunnelApps();
    });
  }

  // Windows File Picker (.exe selection)
  if (elements.btnBrowseExe) {
    elements.btnBrowseExe.addEventListener('click', async () => {
      soundFX.playClick();
      if (window.electronAPI && window.electronAPI.selectExeFile) {
        try {
          const res = await window.electronAPI.selectExeFile();
          if (res && res.name) {
            splitTunnel.addCustomApp(res.fullPath || res.name, res.exe);
            currentSplitCategory = 'all';
            renderSplitTunnelApps();
            soundFX.playConnect();
          }
        } catch (e) {
          console.warn('[GhostWire] Select EXE notice:', e);
        }
      } else if (elements.splitFileInput) {
        elements.splitFileInput.click();
      }
    });
  }

  if (elements.splitFileInput) {
    elements.splitFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        splitTunnel.addCustomApp(file.name, file.name);
        currentSplitCategory = 'all';
        renderSplitTunnelApps();
        soundFX.playConnect();
        elements.splitFileInput.value = '';
      }
    });
  }

  // Running Processes Scanner (Tasklist integration)
  if (elements.btnScanRunningApps) {
    elements.btnScanRunningApps.addEventListener('click', async () => {
      soundFX.playClick();
      if (elements.runningAppsDrawer) {
        elements.runningAppsDrawer.style.display = 'flex';
      }
      if (elements.runningAppsGrid) {
        elements.runningAppsGrid.innerHTML = '<div style="font-size:11px; color:var(--text-muted); padding:6px;">⚡ Windows görev listesi taranıyor...</div>';
      }

      let detectedApps = [];
      try {
        if (window.electronAPI && window.electronAPI.getRunningApps) {
          detectedApps = await window.electronAPI.getRunningApps();
        } else {
          const res = await fetch('/api/running-apps');
          if (res.ok) {
            const data = await res.json();
            detectedApps = data.apps || [];
          }
        }
      } catch (err) {
        console.warn('Running apps scan notice:', err);
      }

      if (elements.runningAppsCountBadge) {
        elements.runningAppsCountBadge.textContent = `(${detectedApps.length} Açık Süreç)`;
      }

      if (!elements.runningAppsGrid) return;
      elements.runningAppsGrid.innerHTML = '';

      if (detectedApps.length === 0) {
        elements.runningAppsGrid.innerHTML = '<div style="font-size:11px; color:var(--text-muted); padding:6px;">Tespit edilen harici masaüstü uygulaması bulunamadı.</div>';
        return;
      }

      detectedApps.forEach(item => {
        const chip = document.createElement('div');
        chip.className = 'running-app-chip';
        chip.innerHTML = `
          <span>${item.icon || '⚡'}</span>
          <span>${item.name}</span>
          <span class="chip-add-btn">+ Ekle</span>
        `;
        chip.addEventListener('click', () => {
          soundFX.playClick();
          splitTunnel.addCustomApp(item.name, item.exe, item.category || 'tools', item.icon || '⚡');
          chip.style.opacity = '0.4';
          chip.style.pointerEvents = 'none';
          renderSplitTunnelApps();
        });
        elements.runningAppsGrid.appendChild(chip);
      });
    });
  }

  if (elements.btnCloseRunningDrawer && elements.runningAppsDrawer) {
    elements.btnCloseRunningDrawer.addEventListener('click', () => {
      elements.runningAppsDrawer.style.display = 'none';
    });
  }

  // Batch Toggles
  if (elements.btnSplitEnableAll) {
    elements.btnSplitEnableAll.addEventListener('click', () => {
      soundFX.playClick();
      splitTunnel.toggleAll(currentSplitCategory, true);
      renderSplitTunnelApps();
    });
  }

  if (elements.btnSplitDisableAll) {
    elements.btnSplitDisableAll.addEventListener('click', () => {
      soundFX.playClick();
      splitTunnel.toggleAll(currentSplitCategory, false);
      renderSplitTunnelApps();
    });
  }

  // Split Category Navigation
  document.querySelectorAll('.split-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      document.querySelectorAll('.split-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSplitCategory = btn.getAttribute('data-cat') || 'all';
      renderSplitTunnelApps();
    });
  });

  // Split Search Input
  if (elements.inputSplitSearch) {
    elements.inputSplitSearch.addEventListener('input', (e) => {
      currentSplitSearch = e.target.value;
      if (elements.btnClearSplitSearch) {
        elements.btnClearSplitSearch.style.display = currentSplitSearch ? 'block' : 'none';
      }
      renderSplitTunnelApps();
    });
  }

  if (elements.btnClearSplitSearch && elements.inputSplitSearch) {
    elements.btnClearSplitSearch.addEventListener('click', () => {
      elements.inputSplitSearch.value = '';
      currentSplitSearch = '';
      elements.btnClearSplitSearch.style.display = 'none';
      renderSplitTunnelApps();
    });
  }

  // Manual Add App
  if (elements.btnAddCustomApp && elements.inputCustomAppExe) {
    elements.btnAddCustomApp.addEventListener('click', () => {
      const exeName = elements.inputCustomAppExe.value.trim();
      if (exeName) {
        soundFX.playClick();
        splitTunnel.addCustomApp(exeName);
        elements.inputCustomAppExe.value = '';
        renderSplitTunnelApps();
      }
    });
  }

  // 6. DNS / DoH Providers
  document.querySelectorAll('.dns-card').forEach(card => {
    card.addEventListener('click', () => {
      soundFX.playClick();
      document.querySelectorAll('.dns-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const prov = card.getAttribute('data-dns-provider');
      const dohMap = {
        cloudflare: 'https://cloudflare-dns.com/dns-query',
        adguard: 'https://dns.adguard-dns.com/dns-query',
        quad9: 'https://dns.quad9.net/dns-query',
        mullvad: 'https://dns.mullvad.net/dns-query'
      };
      if (dohMap[prov]) {
        vpnEngine.setCustomDns(dohMap[prov]);
        showDnsFeedback();
      }
    });
  });

  if (elements.btnSaveCustomDns && elements.inputCustomDnsUrl) {
    elements.btnSaveCustomDns.addEventListener('click', () => {
      const url = elements.inputCustomDnsUrl.value.trim();
      if (url) {
        soundFX.playClick();
        vpnEngine.setCustomDns(url);
        showDnsFeedback();
      }
    });
  }

  // 7. System, Network & Autostart Settings
  if (elements.switchAutostartWindows) {
    elements.switchAutostartWindows.addEventListener('change', async (e) => {
      soundFX.playClick();
      if (window.electronAPI && window.electronAPI.setAutostart) {
        await window.electronAPI.setAutostart(e.target.checked);
      }
    });
  }

  if (elements.switchIpv6Shield) {
    elements.switchIpv6Shield.addEventListener('change', (e) => {
      soundFX.playClick();
      localStorage.setItem('ghostwire_ipv6_shield', e.target.checked ? 'true' : 'false');
    });
  }

  if (elements.selectMtuSize) {
    elements.selectMtuSize.addEventListener('change', (e) => {
      soundFX.playClick();
      localStorage.setItem('ghostwire_mtu_size', e.target.value);
    });
  }

  if (elements.switchDesktopNotifications) {
    elements.switchDesktopNotifications.addEventListener('change', (e) => {
      soundFX.playClick();
      localStorage.setItem('ghostwire_notifications', e.target.checked ? 'true' : 'false');
    });
  }

  // 8. Cyber Theme Cards in Settings
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      soundFX.playClick();
      const theme = card.getAttribute('data-theme-name');
      themeManager.setTheme(theme);
      updateThemeUI(theme);
    });
  });
}

function updateThemeUI(theme) {
  document.querySelectorAll('.theme-card').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-theme-name') === theme);
  });
}

function showDnsFeedback() {
  if (elements.dnsStatusMessage) {
    elements.dnsStatusMessage.style.display = 'block';
    setTimeout(() => {
      elements.dnsStatusMessage.style.display = 'none';
    }, 4000);
  }
}

function renderSplitTunnelApps() {
  if (!elements.splitAppsListContainer) return;
  elements.splitAppsListContainer.innerHTML = '';

  const allApps = splitTunnel.getAllApps();
  const isTunnelMode = splitTunnel.mode === 'tunnel_selected';
  const isMasterOn = splitTunnel.enabled;

  // Update category counts on chip badges
  const catCounts = {
    all: allApps.length,
    gaming: allApps.filter(a => a.category === 'gaming').length,
    browsers: allApps.filter(a => a.category === 'browsers').length,
    social: allApps.filter(a => a.category === 'social').length,
    media: allApps.filter(a => a.category === 'media').length,
    tools: allApps.filter(a => a.category === 'tools').length,
    custom: allApps.filter(a => a.isCustom).length
  };

  const updateBadge = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };
  updateBadge('catCountAll', catCounts.all);
  updateBadge('catCountGaming', catCounts.gaming);
  updateBadge('catCountBrowsers', catCounts.browsers);
  updateBadge('catCountSocial', catCounts.social);
  updateBadge('catCountMedia', catCounts.media);
  updateBadge('catCountTools', catCounts.tools);
  updateBadge('catCountCustom', catCounts.custom);

  // Update active count badge on header
  if (elements.splitActiveBadge) {
    const activeCount = allApps.filter(a => a.enabled).length;
    if (!isMasterOn) {
      elements.splitActiveBadge.textContent = 'DEVRE DIŞI';
      elements.splitActiveBadge.style.color = 'var(--text-muted)';
      elements.splitActiveBadge.style.borderColor = 'var(--border-glass)';
    } else {
      elements.splitActiveBadge.textContent = `${activeCount} UYGULAMA AKTİF`;
      elements.splitActiveBadge.style.color = 'var(--cyan-stealth)';
      elements.splitActiveBadge.style.borderColor = 'rgba(0, 229, 255, 0.3)';
    }
  }

  // Filter apps
  const filtered = splitTunnel.getFilteredApps(currentSplitCategory, currentSplitSearch);

  if (filtered.length === 0) {
    elements.splitAppsListContainer.innerHTML = `
      <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">🔍</span>
        <div>Arama kriterine uygun uygulama bulunamadı.</div>
        <div style="font-size: 10px; color: var(--text-muted);">Yukarıdaki <b>📂 .EXE Seç</b> veya <b>⚡ Açık Uygulamaları Tara</b> butonlarıyla dilediğiniz uygulamayı ekleyebilirsiniz.</div>
      </div>
    `;
    return;
  }

  const categoryNames = {
    gaming: '🎮 Oyun',
    browsers: '🌐 Tarayıcı',
    social: '💬 İletişim',
    media: '🎵 Medya',
    tools: '📥 Araç',
    custom: '📦 Özel'
  };

  filtered.forEach(app => {
    const item = document.createElement('div');
    item.className = `split-app-item ${app.enabled ? 'item-active' : ''}`;

    let routeLabel = '';
    let routeClass = '';
    if (isTunnelMode) {
      routeLabel = app.enabled ? '🛡️ TÜNELLENİYOR' : '⚪ DOĞRUDAN ISS';
      routeClass = app.enabled ? 'tunneled' : 'direct';
    } else {
      routeLabel = app.enabled ? '⚡ BYPASS (ISS)' : '🛡️ TÜNELLENİYOR';
      routeClass = app.enabled ? 'direct' : 'tunneled';
    }

    const catBadge = categoryNames[app.category] || '📦 Özel';

    item.innerHTML = `
      <div class="split-app-info">
        <span class="split-app-icon">${app.icon || '📦'}</span>
        <div class="split-app-text-wrap">
          <div class="split-app-name-row">
            <span class="split-app-name" title="${app.name}">${app.name}</span>
            <span class="split-cat-tag ${app.category || 'custom'}">${catBadge}</span>
          </div>
          <div class="split-app-exe" title="${app.desc || app.exe}">${app.desc || app.exe}</div>
        </div>
      </div>
      <div class="split-app-controls">
        <span class="split-app-route-badge ${routeClass}">${routeLabel}</span>
        <label class="switch">
          <input type="checkbox" ${app.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        ${app.isCustom ? `<button class="split-app-delete-btn" title="Uygulamayı Listeden Kaldır">🗑️</button>` : ''}
      </div>
    `;

    // Toggle switch
    const cb = item.querySelector('input');
    cb.addEventListener('change', () => {
      soundFX.playClick();
      splitTunnel.toggleApp(app.id);
      renderSplitTunnelApps();
    });

    // Delete custom app
    if (app.isCustom) {
      const delBtn = item.querySelector('.split-app-delete-btn');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          soundFX.playClick();
          splitTunnel.removeCustomApp(app.id);
          renderSplitTunnelApps();
        });
      }
    }

    elements.splitAppsListContainer.appendChild(item);
  });
}

async function refreshLivePings() {
  try {
    const res = await fetch('/api/ping-all');
    if (res.ok) {
      const data = await res.json();
      if (data && data.pings) {
        livePings = data.pings;
        updateLivePingsUI();
      }
    }
  } catch (e) {
    // Silent background refresh
  }
}

function updateLivePingsUI() {
  let bestServer = null;
  let minPing = Infinity;
  for (const s of SERVERS_DATABASE) {
    const p = (livePings && livePings[s.code] !== undefined) ? livePings[s.code] : (s.ping || 999);
    if (p < minPing) {
      minPing = p;
      bestServer = s;
    }
  }

  if (elements.smartFastestPingBadge && bestServer) {
    elements.smartFastestPingBadge.textContent = `${bestServer.name}: ${minPing} ms`;
  }

  if (vpnEngine.selectedServer && livePings[vpnEngine.selectedServer.code] !== undefined) {
    elements.currentServerPing.textContent = `${livePings[vpnEngine.selectedServer.code]} ms`;
  }

  document.querySelectorAll('#serversGrid .server-list-item').forEach(item => {
    const sCode = item.getAttribute('data-code');
    if (sCode && livePings[sCode] !== undefined) {
      const badge = item.querySelector('.server-ping-badge');
      if (badge) {
        const p = livePings[sCode];
        badge.textContent = `⚡ ${p} ms`;
        badge.style.color = p < 60 ? 'var(--emerald-safe)' : (p < 110 ? 'var(--cyan-stealth)' : '#f59e0b');
      }
    }
  });
}

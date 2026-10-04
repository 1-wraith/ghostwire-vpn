// GhostWire Advanced Split Tunneling & Per-App Routing Engine
// Manages application-level VPN inclusion and bypass rules with Windows integration

export const DEFAULT_SPLIT_APPS = [
  // 🎮 Gaming & Blocked Platforms
  { id: 'discord', name: 'Discord', exe: 'Discord.exe', desc: 'discord.com & Discord Gateway', icon: '🎮', category: 'gaming', enabled: true },
  { id: 'roblox', name: 'Roblox Player', exe: 'RobloxPlayerBeta.exe', desc: 'roblox.com & Roblox Engine', icon: '🕹️', category: 'gaming', enabled: true },
  { id: 'steam', name: 'Steam Client', exe: 'Steam.exe', desc: 'store.steampowered.com', icon: '🚀', category: 'gaming', enabled: false },
  { id: 'riot', name: 'Riot Client / Valorant', exe: 'RiotClientServices.exe', desc: 'VALORANT & League of Legends', icon: '🎯', category: 'gaming', enabled: false },
  { id: 'epic', name: 'Epic Games Launcher', exe: 'EpicGamesLauncher.exe', desc: 'Fortnite & Unreal Engine', icon: '⚡', category: 'gaming', enabled: false },
  { id: 'minecraft', name: 'Minecraft Launcher', exe: 'MinecraftLauncher.exe', desc: 'Mojang Studios', icon: '⛏️', category: 'gaming', enabled: false },
  { id: 'battlenet', name: 'Battle.net', exe: 'Battle.net.exe', desc: 'Blizzard Entertainment', icon: '⚔️', category: 'gaming', enabled: false },
  { id: 'ea', name: 'EA App', exe: 'EADesktop.exe', desc: 'Electronic Arts Games', icon: '🏆', category: 'gaming', enabled: false },

  // 🌐 Browsers
  { id: 'chrome', name: 'Google Chrome', exe: 'chrome.exe', desc: 'Google Chromium Web Browser', icon: '🌐', category: 'browsers', enabled: false },
  { id: 'brave', name: 'Brave Browser', exe: 'brave.exe', desc: 'Gizlilik ve Reklam Korumalı', icon: '🦁', category: 'browsers', enabled: false },
  { id: 'firefox', name: 'Mozilla Firefox', exe: 'firefox.exe', desc: 'Açık Kaynak Gecko Tarayıcı', icon: '🦊', category: 'browsers', enabled: false },
  { id: 'msedge', name: 'Microsoft Edge', exe: 'msedge.exe', desc: 'Windows Entegre Tarayıcı', icon: '🌊', category: 'browsers', enabled: false },
  { id: 'operagx', name: 'Opera GX', exe: 'opera.exe', desc: 'Oyuncu Web Tarayıcısı', icon: '🔴', category: 'browsers', enabled: false },
  { id: 'torbrowser', name: 'Tor Browser', exe: 'firefox.exe', desc: 'Onion Çok Katmanlı Ağı', icon: '🧅', category: 'browsers', enabled: false },

  // 💬 Social & Messaging
  { id: 'telegram', name: 'Telegram Desktop', exe: 'Telegram.exe', desc: 'Uçtan Uca Şifreli Mesajlaşma', icon: '✈️', category: 'social', enabled: false },
  { id: 'whatsapp', name: 'WhatsApp Desktop', exe: 'WhatsApp.exe', desc: 'Meta Güvenli Mesajlaşma', icon: '📱', category: 'social', enabled: false },
  { id: 'signal', name: 'Signal Messenger', exe: 'Signal.exe', desc: 'Açık Kaynak Maksimum Gizlilik', icon: '🔒', category: 'social', enabled: false },
  { id: 'slack', name: 'Slack', exe: 'slack.exe', desc: 'İş ve Takım İletişimi', icon: '💼', category: 'social', enabled: false },

  // 🎵 Media & Streaming
  { id: 'spotify', name: 'Spotify Music', exe: 'Spotify.exe', desc: 'Müzik ve Podcast Akışı', icon: '🎵', category: 'media', enabled: false },
  { id: 'obs', name: 'OBS Studio', exe: 'obs64.exe', desc: 'Canlı Yayın ve Ekran Kayıt', icon: '📹', category: 'media', enabled: false },
  { id: 'vlc', name: 'VLC Media Player', exe: 'vlc.exe', desc: 'Video ve Medya Oynatıcı', icon: '🟧', category: 'media', enabled: false },
  { id: 'twitch', name: 'Twitch Studio', exe: 'TwitchStudio.exe', desc: 'Twitch İnteraktif Yayın', icon: '🟣', category: 'media', enabled: false },

  // 📥 Tools & P2P
  { id: 'qbittorrent', name: 'qBittorrent', exe: 'qbittorrent.exe', desc: 'Anonim Torrent & P2P İndirici', icon: '📥', category: 'tools', enabled: false },
  { id: 'idm', name: 'Internet Download Manager', exe: 'IDMan.exe', desc: 'Hızlı İndirme Hızlandırıcı', icon: '⚡', category: 'tools', enabled: false },
  { id: 'vscode', name: 'Visual Studio Code', exe: 'Code.exe', desc: 'Geliştirici Kod Editörü', icon: '💻', category: 'tools', enabled: false }
];

export class SplitTunnelManager {
  constructor() {
    this.storageKey = 'ghostwire_split_tunnel_v2';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge saved toggles with latest catalog
        const mergedApps = DEFAULT_SPLIT_APPS.map(def => {
          const found = parsed.apps ? parsed.apps.find(a => a.id === def.id) : null;
          return found ? { ...def, enabled: found.enabled } : { ...def };
        });
        return {
          enabled: parsed.enabled ?? false,
          mode: parsed.mode || 'tunnel_selected', // 'tunnel_selected' or 'bypass_selected'
          apps: mergedApps,
          customApps: parsed.customApps || []
        };
      }
    } catch (e) {}

    return {
      enabled: false,
      mode: 'tunnel_selected',
      apps: [...DEFAULT_SPLIT_APPS],
      customApps: []
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      // Sync with local backend
      fetch('/api/split-tunnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: this.state.enabled,
          mode: this.state.mode,
          rules: this.getActiveAppIds()
        })
      }).catch(() => {});
    } catch (e) {}
  }

  get enabled() {
    return this.state.enabled;
  }

  get mode() {
    return this.state.mode;
  }

  setEnabled(enabled) {
    this.state.enabled = enabled;
    this.saveState();
  }

  setMode(mode) {
    this.state.mode = mode;
    this.saveState();
  }

  // Returns all applications (default catalog + custom added)
  getAllApps() {
    const list = [];
    for (const a of this.state.apps) {
      list.push({ ...a, isCustom: false });
    }
    for (const c of this.state.customApps) {
      list.push({ ...c, isCustom: true });
    }
    return list;
  }

  // Backwards compatibility alias for app.js
  getApps() {
    return this.getAllApps();
  }

  // Filter applications by category and search string
  getFilteredApps(category = 'all', searchQuery = '') {
    const all = this.getAllApps();
    const q = searchQuery.toLowerCase().trim();

    return all.filter(app => {
      // Category filter
      if (category !== 'all') {
        if (category === 'custom') {
          if (!app.isCustom) return false;
        } else if (app.category !== category) {
          return false;
        }
      }

      // Search filter
      if (q) {
        const matchName = app.name.toLowerCase().includes(q);
        const matchExe = (app.exe || '').toLowerCase().includes(q);
        const matchDesc = (app.desc || '').toLowerCase().includes(q);
        if (!matchName && !matchExe && !matchDesc) return false;
      }

      return true;
    });
  }

  toggleApp(id, forcedState = null) {
    // Check standard apps
    const app = this.state.apps.find(a => a.id === id);
    if (app) {
      app.enabled = forcedState !== null ? forcedState : !app.enabled;
      this.saveState();
      return app.enabled;
    }

    // Check custom apps
    const custom = this.state.customApps.find(a => a.id === id);
    if (custom) {
      custom.enabled = forcedState !== null ? forcedState : !custom.enabled;
      this.saveState();
      return custom.enabled;
    }

    return false;
  }

  // Batch toggle all apps in a given category or all
  toggleAll(category = 'all', enable = true) {
    const targets = this.getFilteredApps(category, '');
    const targetIds = new Set(targets.map(t => t.id));

    this.state.apps.forEach(a => {
      if (targetIds.has(a.id)) a.enabled = enable;
    });

    this.state.customApps.forEach(c => {
      if (targetIds.has(c.id)) c.enabled = enable;
    });

    this.saveState();
  }

  // Add custom application selected from file browser or process scanner
  addCustomApp(nameOrPath, exeName = null, category = 'custom', icon = '📦') {
    if (!nameOrPath) return null;

    let cleanName = nameOrPath;
    let cleanExe = exeName || nameOrPath;

    // If a full path was passed (e.g. C:\Games\Valorant\VALORANT.exe)
    if (cleanName.includes('\\') || cleanName.includes('/')) {
      const parts = cleanName.split(/[/\\]/);
      cleanExe = parts[parts.length - 1];
      cleanName = cleanExe.replace(/\.exe$/i, '');
    } else {
      if (!cleanExe.toLowerCase().endsWith('.exe')) {
        cleanExe += '.exe';
      }
      cleanName = cleanName.replace(/\.exe$/i, '');
    }

    // Capitalize first letter
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    // Prevent duplicates
    const existing = this.state.customApps.find(c => c.exe.toLowerCase() === cleanExe.toLowerCase());
    if (existing) {
      existing.enabled = true;
      this.saveState();
      return existing;
    }

    // Assign appropriate icon if recognizable
    const lower = cleanExe.toLowerCase();
    if (lower.includes('discord')) icon = '🎮';
    else if (lower.includes('steam')) icon = '🕹️';
    else if (lower.includes('game') || lower.includes('play')) icon = '🎯';
    else if (lower.includes('chrome') || lower.includes('browser')) icon = '🌐';
    else if (lower.includes('media') || lower.includes('player')) icon = '🎵';

    const newApp = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: cleanName,
      exe: cleanExe,
      desc: nameOrPath.length > 30 ? '...' + nameOrPath.slice(-30) : nameOrPath,
      fullPath: nameOrPath,
      icon,
      category,
      enabled: true,
      isCustom: true
    };

    this.state.customApps.push(newApp);
    this.saveState();
    return newApp;
  }

  removeCustomApp(id) {
    this.state.customApps = this.state.customApps.filter(a => a.id !== id);
    this.saveState();
  }

  getActiveAppIds() {
    const active = [];
    for (const a of this.state.apps) {
      if (a.enabled) active.push(a.id);
    }
    for (const a of this.state.customApps) {
      if (a.enabled) active.push(a.exe.toLowerCase());
    }
    return active;
  }

  getStats() {
    const all = this.getAllApps();
    const activeCount = all.filter(a => a.enabled).length;
    return {
      total: all.length,
      active: activeCount,
      customCount: this.state.customApps.length
    };
  }
}

export const splitTunnel = new SplitTunnelManager();

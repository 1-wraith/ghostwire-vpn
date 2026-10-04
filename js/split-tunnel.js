// GhostWire Split Tunneling & Per-App Routing Engine
// Manages application-level VPN inclusion and bypass rules

export const DEFAULT_SPLIT_APPS = [
  { id: 'discord', name: 'Discord', desc: 'discord.com & Discord.exe', icon: '🎮', enabled: true },
  { id: 'roblox', name: 'Roblox', desc: 'roblox.com & RobloxPlayer.exe', icon: '🕹️', enabled: true },
  { id: 'steam', name: 'Steam', desc: 'store.steampowered.com & Steam.exe', icon: '🚀', enabled: false },
  { id: 'chrome', name: 'Google Chrome', desc: 'chrome.exe', icon: '🌐', enabled: false },
  { id: 'spotify', name: 'Spotify', desc: 'spotify.com & Spotify.exe', icon: '🎵', enabled: false },
  { id: 'brave', name: 'Brave Browser', desc: 'brave.exe', icon: '🦁', enabled: false },
  { id: 'telegram', name: 'Telegram Desktop', desc: 'Telegram.exe', icon: '✈️', enabled: false },
  { id: 'epic', name: 'Epic Games', desc: 'EpicGamesLauncher.exe', icon: '⚡', enabled: false }
];

export class SplitTunnelManager {
  constructor() {
    this.storageKey = 'ghostwire_split_tunnel';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      enabled: false,
      mode: 'tunnel_selected', // 'tunnel_selected' or 'bypass_selected'
      apps: DEFAULT_SPLIT_APPS,
      customApps: []
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      // Sync with local core server
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

  setEnabled(enabled) {
    this.state.enabled = enabled;
    this.saveState();
  }

  setMode(mode) {
    this.state.mode = mode;
    this.saveState();
  }

  toggleApp(appId, enabled) {
    const app = this.state.apps.find(a => a.id === appId);
    if (app) {
      app.enabled = enabled;
      this.saveState();
    }
  }

  addCustomApp(name, exeName) {
    if (!name || !exeName) return;
    const id = 'custom_' + Date.now();
    this.state.customApps.push({
      id,
      name,
      desc: exeName,
      icon: '📦',
      enabled: true
    });
    this.saveState();
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
      if (a.enabled) active.push(a.desc.toLowerCase());
    }
    return active;
  }
}

export const splitTunnel = new SplitTunnelManager();

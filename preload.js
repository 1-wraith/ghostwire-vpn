const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  toggleFullscreen: () => ipcRenderer.send('window:toggle-fullscreen'),
  close: () => ipcRenderer.send('window:close'),
  connectTunnel: () => ipcRenderer.invoke('vpn:connect-tunnel'),
  disconnectTunnel: () => ipcRenderer.invoke('vpn:disconnect-tunnel'),
  testDiscord: () => ipcRenderer.invoke('vpn:test-discord'),
  openDiscord: () => ipcRenderer.send('vpn:open-discord'),
  toggleKillSwitch: (state) => ipcRenderer.invoke('killswitch:toggle', state),
  setAutostart: (enable) => ipcRenderer.invoke('settings:set-autostart', enable),
  getAutostart: () => ipcRenderer.invoke('settings:get-autostart'),
  updateTrayStatus: (data) => ipcRenderer.send('tray:update-status', data),
  onQuickConnect: (callback) => ipcRenderer.on('vpn:quick-connect', callback),
  onDisconnect: (callback) => ipcRenderer.on('vpn:disconnect', callback),
  onSmartConnect: (callback) => ipcRenderer.on('vpn:smart-connect', callback),
  onSelectServer: (callback) => ipcRenderer.on('vpn:select-server', (event, code) => callback(code)),
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download'),
  installUpdate: () => ipcRenderer.invoke('updater:install'),
  getUpdateStatus: () => ipcRenderer.invoke('updater:status'),
  simulateUpdate: (enable, version) => ipcRenderer.invoke('updater:simulate', enable, version),
  selectExeFile: () => ipcRenderer.invoke('dialog:select-exe'),
  getRunningApps: () => ipcRenderer.invoke('system:get-running-apps'),
  toggleWintun: (state) => ipcRenderer.invoke('wintun:toggle', state),
  getWintunStatus: () => ipcRenderer.invoke('wintun:status'),
  getWintunTelemetry: () => ipcRenderer.invoke('wintun:get-telemetry')
});


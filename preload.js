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
  onQuickConnect: (callback) => ipcRenderer.on('vpn:quick-connect', callback),
  onDisconnect: (callback) => ipcRenderer.on('vpn:disconnect', callback)
});

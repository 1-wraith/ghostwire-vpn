const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  toggleKillSwitch: (state) => ipcRenderer.invoke('killswitch:toggle', state),
  setSystemDns: (primary, secondary) => ipcRenderer.invoke('system:set-dns', primary, secondary),
  resetSystemDns: () => ipcRenderer.invoke('system:reset-dns'),
  importConfig: () => ipcRenderer.invoke('config:import'),
  onQuickConnect: (callback) => ipcRenderer.on('vpn:quick-connect', callback),
  onDisconnect: (callback) => ipcRenderer.on('vpn:disconnect', callback)
});

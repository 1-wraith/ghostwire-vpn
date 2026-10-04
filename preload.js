const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  toggleKillSwitch: (state) => ipcRenderer.invoke('killswitch:toggle', state),
  importConfig: () => ipcRenderer.invoke('config:import'),
  onQuickConnect: (callback) => ipcRenderer.on('vpn:quick-connect', callback),
  onDisconnect: (callback) => ipcRenderer.on('vpn:disconnect', callback)
});

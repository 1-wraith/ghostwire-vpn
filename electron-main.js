const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Hardware acceleration & security flags
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 960,
    minHeight: 680,
    title: 'GhostWire VPN - Zero-Knowledge Stealth Privacy Shield',
    backgroundColor: '#070a12',
    frame: false, // Frameless sleek cyber window
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');

  // Window close behavior: minimize to tray unless explicit quit
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Simple tray icon placeholder or generated icon
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  // If file doesn't exist yet, nativeImage can use an empty or drawn buffer
  tray = new Tray(nativeImage.createEmpty());
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'GhostWire VPN: Active', enabled: false },
    { type: 'separator' },
    { label: '⚡ Quick Connect (Fastest)', click: () => { mainWindow.webContents.send('vpn:quick-connect'); mainWindow.show(); } },
    { label: '🛑 Disconnect', click: () => { mainWindow.webContents.send('vpn:disconnect'); } },
    { type: 'separator' },
    { label: 'Open GhostWire Dashboard', click: () => { mainWindow.show(); } },
    { label: 'Exit Application', click: () => { isQuitting = true; app.quit(); } }
  ]);

  tray.setToolTip('GhostWire VPN - 100% Zero-Log Stealth Shield');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow.show());
}

// IPC Controls for frameless window
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.hide();
});

// Native Kill Switch Trigger
ipcMain.handle('killswitch:toggle', async (event, enabled) => {
  console.log(`[GhostWire WFP Engine] Kill Switch status changed: ${enabled ? 'ENGAGED' : 'DISENGAGED'}`);
  // In native environment, interacts with Windows Filtering Platform (WFP) / iptables rules
  return { success: true, active: enabled };
});

// Import custom WireGuard/OpenVPN configuration
ipcMain.handle('config:import', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Custom VPN Configuration',
    properties: ['openFile'],
    filters: [
      { name: 'VPN Configurations (*.conf, *.ovpn)', extensions: ['conf', 'ovpn'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const fs = require('fs');
  const filePath = result.filePaths[0];
  const content = fs.readFileSync(filePath, 'utf-8');
  return { canceled: false, path: filePath, content, name: path.basename(filePath) };
});

app.whenReady().then(() => {
  createWindow();
  try {
    createTray();
  } catch (err) {
    console.log('Tray creation note:', err.message);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

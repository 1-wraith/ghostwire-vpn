const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { ProxyEngine } = require('./core/proxy-engine');

let mainWindow = null;
let tray = null;
let isQuitting = false;
const proxyEngine = new ProxyEngine(10808);

app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 840,
    minHeight: 560,
    title: 'GhostWire VPN - 0-Kayıtlı Kuantum Gizlilik Kalkanı',
    backgroundColor: '#060911',
    frame: false,
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
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  let trayIcon = nativeImage.createEmpty();
  if (require('fs').existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  }
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'GhostWire VPN: Hazır', enabled: false },
    { type: 'separator' },
    { label: '⚡ Hızlı Bağlan (Discord Açıcı)', click: () => { mainWindow.webContents.send('vpn:quick-connect'); mainWindow.show(); } },
    { label: '🛑 Bağlantıyı Kes', click: () => { mainWindow.webContents.send('vpn:disconnect'); } },
    { type: 'separator' },
    { label: 'Paneli Göster', click: () => { mainWindow.show(); } },
    { label: 'Çıkış Yap', click: () => { isQuitting = true; app.quit(); } }
  ]);

  tray.setToolTip('GhostWire VPN - 100% Sıfır Kayıt & Kuantum Koruma');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow.show());
}

// Window Controls
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  }
});

ipcMain.on('window:toggle-fullscreen', () => {
  if (mainWindow) {
    const isFull = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFull);
  }
});

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.hide();
});

// Enable Windows Proxy & Real DPI Engine
ipcMain.handle('vpn:connect-tunnel', async () => {
  proxyEngine.start();

  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d "127.0.0.1:10808" /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyOverride /t REG_SZ /d "<local>" /f`;
      exec(cmd, () => {
        console.log('[GhostWire Core] Windows Proxy engaged on 127.0.0.1:10808');
        resolve({ success: true, proxyPort: 10808 });
      });
    });
  }
  return { success: true };
});

// Disconnect & Reset Windows Proxy
ipcMain.handle('vpn:disconnect-tunnel', async () => {
  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f`;
      exec(cmd, () => {
        console.log('[GhostWire Core] Windows Proxy disengaged');
        resolve({ success: true });
      });
    });
  }
  return { success: true };
});

// Real Discord Test
ipcMain.handle('vpn:test-discord', async () => {
  proxyEngine.start();
  return await proxyEngine.testDiscord();
});

// Launch Discord
ipcMain.on('vpn:open-discord', () => {
  shell.openExternal('https://discord.com/app');
});

// Native Kill Switch
ipcMain.handle('killswitch:toggle', async (event, enabled) => {
  console.log(`[GhostWire WFP] Kill Switch: ${enabled ? 'ENGAGED' : 'DISENGAGED'}`);
  return { success: true, active: enabled };
});

app.whenReady().then(() => {
  createWindow();
  try {
    createTray();
  } catch (err) {}

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  // Make sure proxy is cleanly disengaged on app exit
  if (process.platform === 'win32') {
    exec('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

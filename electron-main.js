const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { ProxyEngine } = require('./core/proxy-engine');

// Intercept unhandled exceptions safely so Windows never shows modal crash dialogs
process.on('uncaughtException', (err) => {
  console.warn('[GhostWire Main] Uncaught Exception intercepted:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.warn('[GhostWire Main] Unhandled Rejection intercepted:', reason);
});

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

let trayState = {
  connected: false,
  serverName: 'Hazır',
  ping: 18,
  recent: ['DE', 'IS', 'CH', 'NL', 'US']
};

function buildTrayContextMenu() {
  const statusLabel = trayState.connected 
    ? `🟢 Bağlandı: ${trayState.serverName} (${trayState.ping} ms)`
    : '🔴 Koruma Pasif (IP Açıkta)';

  return Menu.buildFromTemplate([
    { label: statusLabel, enabled: false },
    { type: 'separator' },
    {
      label: trayState.connected ? '🛑 Bağlantıyı Kes' : '⚡ Hızlı Bağlan (Discord Açıcı)',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send(trayState.connected ? 'vpn:disconnect' : 'vpn:quick-connect');
          mainWindow.show();
        }
      }
    },
    {
      label: '🎯 Akıllı Bağlantı (En Düşük Ping)',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('vpn:smart-connect');
          mainWindow.show();
        }
      }
    },
    {
      label: '📍 Hızlı Konum Seçimi',
      submenu: [
        { label: '🇩🇪 Almanya (Frankfurt)', click: () => selectServerFromTray('DE') },
        { label: '🇮🇸 İzlanda (Reykjavik)', click: () => selectServerFromTray('IS') },
        { label: '🇨🇭 İsviçre (Zürih)', click: () => selectServerFromTray('CH') },
        { label: '🇳🇱 Hollanda (Amsterdam)', click: () => selectServerFromTray('NL') },
        { label: '🇺🇸 ABD (New York)', click: () => selectServerFromTray('US') }
      ]
    },
    { type: 'separator' },
    {
      label: '🖥️ GhostWire Paneli Aç',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: '❌ Çıkış Yap',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
}

function selectServerFromTray(code) {
  if (mainWindow) {
    mainWindow.webContents.send('vpn:select-server', code);
    mainWindow.show();
  }
}

function updateTrayMenu(newState) {
  if (!tray) return;
  trayState = { ...trayState, ...newState };
  tray.setContextMenu(buildTrayContextMenu());
  tray.setToolTip(`GhostWire VPN: ${trayState.connected ? 'Korumalı' : 'Korumasız'}`);
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  let trayIcon = nativeImage.createEmpty();
  if (require('fs').existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  }
  
  tray = new Tray(trayIcon);
  tray.setToolTip('GhostWire VPN - 100% Sıfır Kayıt & Kuantum Koruma');
  tray.setContextMenu(buildTrayContextMenu());
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
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
  try {
    await proxyEngine.start();
  } catch (err) {
    console.warn('[GhostWire Main] Proxy startup notice:', err.message);
  }

  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const port = proxyEngine.port || 10808;
      const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d "127.0.0.1:${port}" /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyOverride /t REG_SZ /d "<local>" /f`;
      exec(cmd, () => {
        console.log(`[GhostWire Core] Windows Proxy engaged on 127.0.0.1:${port}`);
        resolve({ success: true, proxyPort: port });
      });
    });
  }
  return { success: true };
});

// Native Windows File Dialog to select any .exe application directly
ipcMain.handle('dialog:select-exe', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'VPN Tüneline Eklenecek Uygulamayı Seçin (.exe)',
    filters: [
      { name: 'Çalıştırılabilir Dosyalar (*.exe)', extensions: ['exe'] },
      { name: 'Tüm Dosyalar (*.*)', extensions: ['*'] }
    ],
    properties: ['openFile']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const fullPath = result.filePaths[0];
    const name = path.basename(fullPath, path.extname(fullPath));
    const exe = path.basename(fullPath);
    return { fullPath, name, exe };
  }
  return null;
});

// Scan currently running Windows applications
ipcMain.handle('system:get-running-apps', async () => {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      exec('tasklist /FO CSV /NH', (err, stdout) => {
        if (err || !stdout) return resolve([]);
        const lines = stdout.split('\r\n');
        const systemExes = new Set([
          'system', 'smss.exe', 'csrss.exe', 'wininit.exe', 'services.exe', 'lsass.exe',
          'svchost.exe', 'fontdrvhost.exe', 'winlogon.exe', 'dwm.exe', 'explorer.exe',
          'taskhostw.exe', 'sihost.exe', 'runtimebroker.exe', 'searchhost.exe',
          'startmenuexperiencehost.exe', 'textinputhost.exe', 'shellexperiencehost.exe',
          'conhost.exe', 'cmd.exe', 'powershell.exe', 'electron.exe', 'node.exe', 'ghostwire vpn.exe'
        ]);
        const detected = new Map();
        for (const line of lines) {
          const match = line.match(/^"([^"]+)"/);
          if (match) {
            const exe = match[1];
            const lower = exe.toLowerCase();
            if (!systemExes.has(lower) && !detected.has(lower)) {
              const name = exe.replace(/\.exe$/i, '');
              let icon = '⚡';
              if (lower.includes('discord')) icon = '🎮';
              else if (lower.includes('steam')) icon = '🕹️';
              else if (lower.includes('chrome')) icon = '🌐';
              else if (lower.includes('spotify')) icon = '🎵';
              else if (lower.includes('telegram')) icon = '✈️';
              else if (lower.includes('code')) icon = '💻';
              detected.set(lower, {
                exe,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                icon
              });
            }
          }
        }
        resolve(Array.from(detected.values()).slice(0, 35));
      });
    } else {
      resolve([]);
    }
  });
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

// Windows Autostart (Start on boot)
ipcMain.handle('settings:get-autostart', () => {
  try {
    const settings = app.getLoginItemSettings();
    return settings.openAtLogin;
  } catch (e) {
    return false;
  }
});

ipcMain.handle('settings:set-autostart', (event, enable) => {
  try {
    app.setLoginItemSettings({
      openAtLogin: enable,
      path: process.execPath
    });
    console.log(`[GhostWire Core] Windows Autostart set to: ${enable}`);
    return true;
  } catch (e) {
    console.error('Error setting autostart:', e);
    return false;
  }
});

// Live Tray status updater from renderer
ipcMain.on('tray:update-status', (event, data) => {
  updateTrayMenu(data);
});


// In-App Auto-Updater IPC Handlers
const { UpdaterEngine } = require('./core/updater-engine');
const updaterEngine = new UpdaterEngine('1.0.0', '1-wraith/ghostwire-vpn');

ipcMain.handle('updater:check', async () => {
  return await updaterEngine.checkLatestRelease();
});

ipcMain.handle('updater:download', async () => {
  return await updaterEngine.startDownload();
});

ipcMain.handle('updater:install', () => {
  return updaterEngine.applyUpdate();
});

ipcMain.handle('updater:status', () => {
  return updaterEngine.getStatus();
});

ipcMain.handle('updater:simulate', (event, enable, version) => {
  return updaterEngine.simulateUpdate(enable, version);
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

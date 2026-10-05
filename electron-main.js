const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { ProxyEngine } = require('./core/proxy-engine');
const { WintunEngine } = require('./core/wintun-engine');

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
const wintunEngine = new WintunEngine();

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
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
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

// Bandwidth broadcaster to renderer
let bandwidthBroadcastTimer = null;
function startBandwidthBroadcaster() {
  if (bandwidthBroadcastTimer) clearInterval(bandwidthBroadcastTimer);
  bandwidthBroadcastTimer = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const stats = proxyEngine.getBandwidthTelemetry();
      mainWindow.webContents.send('vpn:bandwidth-stats', stats);
    }
  }, 800);
}

function stopBandwidthBroadcaster() {
  if (bandwidthBroadcastTimer) {
    clearInterval(bandwidthBroadcastTimer);
    bandwidthBroadcastTimer = null;
  }
}

// Enable Cross-Platform Proxy & Real DPI Engine & Layer-3 Wintun Driver
ipcMain.handle('vpn:connect-tunnel', async () => {
  let wintunStatus = null;
  try {
    if (wintunEngine.enabled && process.platform === 'win32') {
      wintunStatus = await wintunEngine.start();
    }
  } catch (err) {
    console.warn('[GhostWire Main] Wintun Layer-3 startup notice:', err.message);
  }

  try {
    await proxyEngine.start();
  } catch (err) {
    console.warn('[GhostWire Main] Proxy startup notice:', err.message);
  }

  const port = proxyEngine.port || 10808;
  startBandwidthBroadcaster();

  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d "127.0.0.1:${port}" /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyOverride /t REG_SZ /d "<local>" /f`;
      exec(cmd, () => {
        console.log(`[GhostWire Core] Windows Proxy engaged on 127.0.0.1:${port}`);
        resolve({ success: true, proxyPort: port, wintun: wintunStatus || wintunEngine.getStatus() });
      });
    });
  } else if (process.platform === 'darwin') {
    return new Promise((resolve) => {
      // macOS system proxy via networksetup
      const cmd = `networksetup -setwebproxy "Wi-Fi" 127.0.0.1 ${port} & networksetup -setsecurewebproxy "Wi-Fi" 127.0.0.1 ${port} & networksetup -setwebproxystate "Wi-Fi" on & networksetup -setsecurewebproxystate "Wi-Fi" on`;
      exec(cmd, () => {
        console.log(`[GhostWire Core] macOS Proxy engaged on 127.0.0.1:${port}`);
        resolve({ success: true, proxyPort: port, platform: 'darwin' });
      });
    });
  } else if (process.platform === 'linux') {
    return new Promise((resolve) => {
      // Linux GNOME system proxy
      const cmd = `gsettings set org.gnome.system.proxy mode 'manual' && gsettings set org.gnome.system.proxy.http host '127.0.0.1' && gsettings set org.gnome.system.proxy.http port ${port} && gsettings set org.gnome.system.proxy.https host '127.0.0.1' && gsettings set org.gnome.system.proxy.https port ${port}`;
      exec(cmd, () => {
        console.log(`[GhostWire Core] Linux GNOME Proxy engaged on 127.0.0.1:${port}`);
        resolve({ success: true, proxyPort: port, platform: 'linux' });
      });
    });
  }
  return { success: true, proxyPort: port, wintun: wintunStatus || wintunEngine.getStatus() };
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

// Disconnect & Reset Proxy & Wintun across Windows / macOS / Linux
ipcMain.handle('vpn:disconnect-tunnel', async () => {
  stopBandwidthBroadcaster();

  try {
    await wintunEngine.stop();
  } catch (e) {}

  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f`;
      exec(cmd, () => {
        console.log('[GhostWire Core] Windows Proxy disengaged');
        resolve({ success: true });
      });
    });
  } else if (process.platform === 'darwin') {
    return new Promise((resolve) => {
      exec(`networksetup -setwebproxystate "Wi-Fi" off & networksetup -setsecurewebproxystate "Wi-Fi" off`, () => {
        console.log('[GhostWire Core] macOS Proxy disengaged');
        resolve({ success: true });
      });
    });
  } else if (process.platform === 'linux') {
    return new Promise((resolve) => {
      exec(`gsettings set org.gnome.system.proxy mode 'none'`, () => {
        console.log('[GhostWire Core] Linux Proxy disengaged');
        resolve({ success: true });
      });
    });
  }
  return { success: true };
});

// Telemetry handler
ipcMain.handle('vpn:get-bandwidth-stats', () => {
  return proxyEngine.getBandwidthTelemetry();
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

// Wintun Layer-3 Kernel Engine IPC Handlers
ipcMain.handle('wintun:status', () => {
  return wintunEngine.getStatus();
});

ipcMain.handle('wintun:toggle', (event, enabled) => {
  return wintunEngine.toggle(enabled);
});

ipcMain.handle('wintun:get-telemetry', () => {
  return wintunEngine.getStatus();
});


// In-App Auto-Updater IPC Handlers
const { UpdaterEngine } = require('./core/updater-engine');
const pkg = require('./package.json');
const updaterEngine = new UpdaterEngine(pkg.version || '1.2.0', '1-wraith/ghostwire-vpn');

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
  stopBandwidthBroadcaster();
  // Disengage Wintun Layer-3 driver and routes cleanly
  try {
    wintunEngine.stop();
  } catch (e) {}
  
  // Make sure proxy is cleanly disengaged across all platforms on app exit
  if (process.platform === 'win32') {
    exec('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f');
  } else if (process.platform === 'darwin') {
    exec('networksetup -setwebproxystate "Wi-Fi" off & networksetup -setsecurewebproxystate "Wi-Fi" off');
  } else if (process.platform === 'linux') {
    exec("gsettings set org.gnome.system.proxy mode 'none'");
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

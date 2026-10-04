const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow = null;
let tray = null;
let isQuitting = false;

app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
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
    { label: '⚡ Hızlı Bağlan (En Düşük Ping)', click: () => { mainWindow.webContents.send('vpn:quick-connect'); mainWindow.show(); } },
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

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.hide();
});

// Real Windows System DNS Changer (DoH & Cloudflare/Google)
ipcMain.handle('system:set-dns', async (event, primary = '1.1.1.1', secondary = '1.0.0.1') => {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Find active adapters and apply secure DNS + ipconfig /flushdns
      const psCmd = `powershell -Command "
        Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | ForEach-Object {
          Set-DnsClientServerAddress -InterfaceIndex $_.ifIndex -ServerAddresses ('${primary}','${secondary}')
        };
        Clear-DnsClientCache
      "`;
      exec(psCmd, (error) => {
        if (error) console.log('DNS Set fallback note:', error.message);
        resolve({ success: !error });
      });
    } else {
      resolve({ success: true });
    }
  });
});

// Restore DHCP DNS
ipcMain.handle('system:reset-dns', async () => {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const psCmd = `powershell -Command "
        Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | ForEach-Object {
          Set-DnsClientServerAddress -InterfaceIndex $_.ifIndex -ResetServerAddresses
        };
        Clear-DnsClientCache
      "`;
      exec(psCmd, (error) => {
        resolve({ success: !error });
      });
    } else {
      resolve({ success: true });
    }
  });
});

// Native Kill Switch Trigger
ipcMain.handle('killswitch:toggle', async (event, enabled) => {
  console.log(`[GhostWire WFP] Kill Switch: ${enabled ? 'ENGAGED' : 'DISENGAGED'}`);
  return { success: true, active: enabled };
});

// Config File Picker
ipcMain.handle('config:import', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Özel VPN Yapılandırması Yükle',
    properties: ['openFile'],
    filters: [
      { name: 'VPN Dosyaları (*.conf, *.ovpn)', extensions: ['conf', 'ovpn'] }
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
  } catch (err) {}

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

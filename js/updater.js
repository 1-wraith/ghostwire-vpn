// GhostWire VPN - Client-Side Auto-Updater Controller
// Seamless in-app updating via GitHub Releases

export class ClientUpdater {
  constructor() {
    this.elements = {
      banner: document.getElementById('updateBanner'),
      badge: document.getElementById('updateBadge'),
      title: document.getElementById('updateTitle'),
      desc: document.getElementById('updateDesc'),
      progressWrap: document.getElementById('updateProgressWrap'),
      progressFill: document.getElementById('updateProgressFill'),
      progressText: document.getElementById('updateProgressText'),
      btnAction: document.getElementById('btnDownloadUpdate'),
      btnActionText: document.getElementById('btnDownloadUpdateText'),
      btnDismiss: document.getElementById('btnDismissUpdate'),
      
      // Settings modal elements
      settingsCurrentVer: document.getElementById('settingsCurrentVer'),
      btnCheckUpdateManual: document.getElementById('btnCheckUpdateManual'),
      btnTestSimulateUpdate: document.getElementById('btnTestSimulateUpdate'),
      settingsUpdateStatus: document.getElementById('settingsUpdateStatus')
    };

    this.currentStatus = 'idle';
    this.pollTimer = null;
    this.latestInfo = null;

    this.init();
  }

  init() {
    if (this.elements.btnAction) {
      this.elements.btnAction.addEventListener('click', () => this.handleActionClick());
    }
    if (this.elements.btnDismiss) {
      this.elements.btnDismiss.addEventListener('click', () => this.hideBanner());
    }
    if (this.elements.btnCheckUpdateManual) {
      this.elements.btnCheckUpdateManual.addEventListener('click', () => this.check(true));
    }
    if (this.elements.btnTestSimulateUpdate) {
      this.elements.btnTestSimulateUpdate.addEventListener('click', () => this.simulateNewVersion());
    }

    // Auto-check on startup after 3 seconds
    setTimeout(() => {
      this.check(false);
    }, 3000);
  }

  async check(isManual = false) {
    if (this.elements.settingsUpdateStatus && isManual) {
      this.elements.settingsUpdateStatus.textContent = '⏳ GitHub Releases denetleniyor...';
      this.elements.settingsUpdateStatus.style.color = 'var(--cyan-stealth)';
      this.elements.settingsUpdateStatus.style.display = 'block';
    }

    try {
      let updateInfo = null;
      if (window.electronAPI && window.electronAPI.checkForUpdates) {
        updateInfo = await window.electronAPI.checkForUpdates();
      } else {
        const res = await fetch('/api/check-update');
        if (res.ok) {
          updateInfo = await res.json();
        }
      }

      if (updateInfo) {
        this.latestInfo = updateInfo;
        if (updateInfo.hasUpdate) {
          this.showBanner(updateInfo);
          if (this.elements.settingsUpdateStatus && isManual) {
            this.elements.settingsUpdateStatus.textContent = `✓ Yeni Sürüm Mevcut: v${updateInfo.latestVersion}!`;
            this.elements.settingsUpdateStatus.style.color = 'var(--emerald-safe)';
          }
        } else {
          if (this.elements.settingsUpdateStatus && isManual) {
            this.elements.settingsUpdateStatus.textContent = `✓ GhostWire VPN güncel (v${updateInfo.currentVersion}).`;
            this.elements.settingsUpdateStatus.style.color = 'var(--emerald-safe)';
          }
        }
      }
    } catch (err) {
      console.log('Update check error:', err);
      if (this.elements.settingsUpdateStatus && isManual) {
        this.elements.settingsUpdateStatus.textContent = 'Güncelleme kontrolü başarısız oldu (Çevrimdışı).';
        this.elements.settingsUpdateStatus.style.color = 'var(--amber-warn)';
      }
    }
  }

  showBanner(info) {
    if (!this.elements.banner) return;
    this.latestInfo = info;
    this.currentStatus = 'available';

    if (this.elements.title) {
      this.elements.title.textContent = info.releaseName || `GhostWire VPN v${info.latestVersion} Yayınlandı!`;
    }
    if (this.elements.desc) {
      const sizeMb = info.assetSize ? (info.assetSize / (1024 * 1024)).toFixed(1) : '80.6';
      this.elements.desc.textContent = `GitHub Release üzerinden tek tıkla doğrudan kurun (${sizeMb} MB).`;
    }
    if (this.elements.btnActionText) {
      this.elements.btnActionText.textContent = `Şimdi Güncelle (v${info.latestVersion})`;
    }
    if (this.elements.progressWrap) {
      this.elements.progressWrap.style.display = 'none';
    }

    this.elements.banner.style.display = 'flex';
  }

  hideBanner() {
    if (this.elements.banner) {
      this.elements.banner.style.display = 'none';
    }
  }

  async handleActionClick() {
    if (this.currentStatus === 'ready') {
      // Launch installer
      await this.applyInstall();
      return;
    }

    if (this.currentStatus === 'downloading') {
      return;
    }

    // Start downloading
    await this.startDownload();
  }

  async startDownload() {
    this.currentStatus = 'downloading';
    if (this.elements.progressWrap) {
      this.elements.progressWrap.style.display = 'flex';
    }
    if (this.elements.btnActionText) {
      this.elements.btnActionText.textContent = 'İndiriliyor...';
    }
    if (this.elements.btnAction) {
      this.elements.btnAction.disabled = true;
    }

    try {
      if (window.electronAPI && window.electronAPI.downloadUpdate) {
        await window.electronAPI.downloadUpdate();
      } else {
        await fetch('/api/download-update', { method: 'POST' });
      }
    } catch (e) {
      console.log('Error triggering download:', e);
    }

    // Poll download progress
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(async () => {
      let status = null;
      try {
        if (window.electronAPI && window.electronAPI.getUpdateStatus) {
          status = await window.electronAPI.getUpdateStatus();
        } else {
          const res = await fetch('/api/update-status');
          if (res.ok) status = await res.json();
        }
      } catch (err) {}

      if (status) {
        const percent = status.progressPercent || 0;
        const totalMb = ((status.assetSize || 80696313) / (1024 * 1024)).toFixed(1);
        const currMb = ((status.downloadedBytes || 0) / (1024 * 1024)).toFixed(1);

        if (this.elements.progressFill) {
          this.elements.progressFill.style.width = `${percent}%`;
        }
        if (this.elements.progressText) {
          this.elements.progressText.textContent = `%${percent} (${currMb} MB / ${totalMb} MB)`;
        }

        if (status.status === 'ready' || percent >= 100) {
          clearInterval(this.pollTimer);
          this.currentStatus = 'ready';
          if (this.elements.btnAction) {
            this.elements.btnAction.disabled = false;
            this.elements.btnAction.style.background = 'linear-gradient(135deg, #00f59b, #00c853)';
          }
          if (this.elements.btnActionText) {
            this.elements.btnActionText.textContent = '🚀 Kur & Yeniden Başlat';
          }
          if (this.elements.desc) {
            this.elements.desc.textContent = '✓ İndirme tamamlandı! Kurulumu başlatmak için butona tıklayın.';
          }
        }
      }
    }, 250);
  }

  async applyInstall() {
    try {
      if (window.electronAPI && window.electronAPI.installUpdate) {
        await window.electronAPI.installUpdate();
      } else {
        await fetch('/api/install-update', { method: 'POST' });
      }
    } catch (e) {
      console.log('Install error:', e);
    }
  }

  // Simulation test mode (allows instant testing of the update banner)
  async simulateNewVersion() {
    try {
      if (window.electronAPI && window.electronAPI.simulateUpdate) {
        const sim = await window.electronAPI.simulateUpdate(true, '1.2.0');
        this.showBanner(sim);
      } else {
        const res = await fetch('/api/simulate-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enable: true, version: '1.2.0' })
        });
        if (res.ok) {
          const sim = await res.json();
          this.showBanner(sim);
        }
      }
      if (this.elements.settingsUpdateStatus) {
        this.elements.settingsUpdateStatus.textContent = '✓ Test Güncellemesi (v1.2.0) Aktifleştirildi! Üstteki banner kontrol edin.';
        this.elements.settingsUpdateStatus.style.color = 'var(--emerald-safe)';
        this.elements.settingsUpdateStatus.style.display = 'block';
      }
    } catch (e) {
      console.log('Simulate error:', e);
    }
  }
}

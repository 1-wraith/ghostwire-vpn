// GhostWire VPN - In-App GitHub Releases Auto-Update Engine
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class UpdaterEngine {
  constructor(currentVersion = '1.0.0', repo = '1-wraith/ghostwire-vpn') {
    this.currentVersion = currentVersion.replace(/^v/, '');
    this.repo = repo;
    this.updateState = {
      status: 'idle', // 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error'
      hasUpdate: false,
      latestVersion: null,
      releaseName: '',
      releaseNotes: '',
      publishedAt: '',
      downloadUrl: '',
      assetName: '',
      assetSize: 0,
      downloadedBytes: 0,
      progressPercent: 0,
      downloadedFilePath: null,
      error: null
    };
    this.simulated = false;
  }

  // Check latest release from GitHub API
  async checkLatestRelease() {
    this.updateState.status = 'checking';
    this.updateState.error = null;

    if (this.simulated) {
      this.updateState.hasUpdate = true;
      this.updateState.latestVersion = '1.2.0';
      this.updateState.releaseName = 'GhostWire VPN v1.2.0 - Canlı Soket Hız Telemetrisi & Cross-Platform';
      this.updateState.releaseNotes = '• Canlı indirme/yükleme soket bayt eşlemesi ve anlık hız telemetrisi\n• Tam Cross-Platform (Linux & macOS) desteği ve CI/CD derleme hattı\n• Gelişmiş BBR ve MTU optimizasyonları';
      this.updateState.assetName = 'GhostWire VPN Setup 1.2.0.exe';
      this.updateState.assetSize = 80696313;
      this.updateState.status = 'available';
      return this.getStatus();
    }

    return new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${this.repo}/releases/latest`,
        method: 'GET',
        headers: {
          'User-Agent': 'GhostWire-VPN-Client',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      const req = https.request(options, (res) => {
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const release = JSON.parse(rawData);
              const latestTag = (release.tag_name || '').replace(/^v/, '');
              this.updateState.latestVersion = latestTag;
              this.updateState.releaseName = release.name || `GhostWire VPN v${latestTag}`;
              this.updateState.releaseNotes = release.body || '';
              this.updateState.publishedAt = release.published_at || '';

              // Find Windows Setup EXE asset
              const winAsset = (release.assets || []).find(a => 
                a.name.toLowerCase().endsWith('.exe') && !a.name.toLowerCase().includes('blockmap')
              );

              if (winAsset) {
                this.updateState.downloadUrl = winAsset.browser_download_url;
                this.updateState.assetName = winAsset.name;
                this.updateState.assetSize = winAsset.size;
              }

              // Version comparison
              this.updateState.hasUpdate = this.isNewerVersion(latestTag, this.currentVersion);
              if (this.updateState.hasUpdate) {
                this.updateState.status = 'available';
                return resolve(this.getStatus());
              }

              // Fallback: Check if latest commit on main is newer
              this.checkLatestCommit().then(() => {
                resolve(this.getStatus());
              }).catch(() => {
                this.updateState.status = 'idle';
                resolve(this.getStatus());
              });
            } else {
              this.checkLatestCommit().then(() => {
                resolve(this.getStatus());
              }).catch(() => {
                this.updateState.status = 'idle';
                resolve(this.getStatus());
              });
            }
          } catch (err) {
            this.checkLatestCommit().then(() => {
              resolve(this.getStatus());
            }).catch(() => {
              this.updateState.status = 'error';
              this.updateState.error = err.message;
              resolve(this.getStatus());
            });
          }
        });
      });

      req.on('error', (err) => {
        this.checkLatestCommit().then(() => {
          resolve(this.getStatus());
        }).catch(() => {
          this.updateState.status = 'error';
          this.updateState.error = err.message;
          resolve(this.getStatus());
        });
      });

      req.end();
    });
  }

  // Real-time commit checking from GitHub main branch
  checkLatestCommit() {
    return new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${this.repo}/commits/main`,
        method: 'GET',
        headers: {
          'User-Agent': 'GhostWire-VPN-Client',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      const req = https.request(options, (res) => {
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const commitData = JSON.parse(rawData);
              const sha = (commitData.sha || '').substring(0, 7);
              const commitMsg = (commitData.commit && commitData.commit.message) || '';
              const commitDate = (commitData.commit && commitData.commit.committer && commitData.commit.committer.date) || '';

              // If commit is newer or different from local baseline
              if (sha && (!this.buildCommit || sha !== this.buildCommit)) {
                this.updateState.hasUpdate = true;
                this.updateState.status = 'available';
                this.updateState.latestVersion = `1.1.0 (#${sha})`;
                this.updateState.releaseName = `GhostWire VPN Yeni Güncelleme (#${sha})`;
                this.updateState.releaseNotes = commitMsg.split('\n')[0];
                this.updateState.publishedAt = commitDate;
                if (!this.updateState.downloadUrl) {
                  this.updateState.downloadUrl = `https://github.com/${this.repo}/releases/latest`;
                }
              }
            }
          } catch (e) {}
          resolve();
        });
      });

      req.on('error', () => resolve());
      req.end();
    });
  }

  isNewerVersion(latest, current) {
    if (!latest || !current) return false;
    const lParts = latest.split('.').map(n => parseInt(n, 10) || 0);
    const cParts = current.split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  }

  // Download update in-app directly from GitHub
  async startDownload() {
    if (this.updateState.status === 'downloading') return this.getStatus();

    this.updateState.status = 'downloading';
    this.updateState.downloadedBytes = 0;
    this.updateState.progressPercent = 0;

    const downloadDir = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const targetFileName = this.updateState.assetName || 'GhostWire-Update-Setup.exe';
    const targetFilePath = path.join(downloadDir, targetFileName);
    this.updateState.downloadedFilePath = targetFilePath;

    // Simulation or fallback test
    if (this.simulated || !this.updateState.downloadUrl) {
      let currentBytes = 0;
      const totalBytes = this.updateState.assetSize || 80696313;
      const interval = setInterval(() => {
        currentBytes += Math.floor(totalBytes / 20);
        if (currentBytes >= totalBytes) {
          currentBytes = totalBytes;
          clearInterval(interval);
          this.updateState.status = 'ready';
          this.updateState.downloadedBytes = totalBytes;
          this.updateState.progressPercent = 100;
        } else {
          this.updateState.downloadedBytes = currentBytes;
          this.updateState.progressPercent = Math.round((currentBytes / totalBytes) * 100);
        }
      }, 200);
      return this.getStatus();
    }

    this.downloadFileWithRedirect(this.updateState.downloadUrl, targetFilePath);
    return this.getStatus();
  }

  downloadFileWithRedirect(url, targetPath) {
    const fileStream = fs.createWriteStream(targetPath);
    
    const request = (targetUrl) => {
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, { headers: { 'User-Agent': 'GhostWire-VPN-Client' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location);
        }

        const total = parseInt(res.headers['content-length'] || this.updateState.assetSize || '80696313', 10);
        this.updateState.assetSize = total;

        res.on('data', (chunk) => {
          this.updateState.downloadedBytes += chunk.length;
          this.updateState.progressPercent = Math.min(100, Math.round((this.updateState.downloadedBytes / total) * 100));
        });

        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          this.updateState.status = 'ready';
          this.updateState.progressPercent = 100;
        });
      }).on('error', (err) => {
        fs.unlink(targetPath, () => {});
        this.updateState.status = 'error';
        this.updateState.error = err.message;
      });
    };

    request(url);
  }

  // Launch the downloaded setup installer
  applyUpdate() {
    const filePath = this.updateState.downloadedFilePath;
    if (filePath && fs.existsSync(filePath)) {
      try {
        const subprocess = spawn(filePath, [], {
          detached: true,
          stdio: 'ignore'
        });
        subprocess.unref();
        return { success: true, message: 'Installer launched successfully' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    return { success: false, error: 'Installer file not found' };
  }

  simulateUpdate(enable = true, targetVersion = '1.2.0') {
    this.simulated = enable;
    if (enable) {
      this.updateState.hasUpdate = true;
      this.updateState.latestVersion = targetVersion;
      this.updateState.releaseName = `GhostWire VPN v${targetVersion} - Canlı Soket Hız Telemetrisi & Cross-Platform`;
      this.updateState.releaseNotes = '• Canlı indirme/yükleme soket bayt eşlemesi ve anlık hız telemetrisi\n• Tam Cross-Platform (Linux & macOS) desteği ve CI/CD derleme hattı\n• Gelişmiş BBR ve MTU optimizasyonları';
      this.updateState.assetName = `GhostWire VPN Setup ${targetVersion}.exe`;
      this.updateState.assetSize = 80696313;
      this.updateState.status = 'available';
    } else {
      this.updateState.hasUpdate = false;
      this.updateState.status = 'idle';
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      currentVersion: this.currentVersion,
      ...this.updateState
    };
  }
}

module.exports = { UpdaterEngine };

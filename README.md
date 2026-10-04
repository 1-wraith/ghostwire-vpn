<div align="center">

  <img src="assets/logo.svg" alt="GhostWire VPN Logo" width="128" height="128" />

  # 🛡️ GhostWire VPN
  
  **100% Açık Kaynaklı, Sıfır Kayıtlı Kuantum Gizlilik Kalkanı & Sansür Kırıcı**  
  *100% Free, Open-Source, Zero-Knowledge Stealth Privacy Engine*

  <p align="center">
    <a href="#-türkçe-açıklama"><img src="https://img.shields.io/badge/Dil-Türkçe-red.svg?style=for-the-badge&logo=turkey" alt="Türkçe" /></a>
    <a href="#-english-documentation"><img src="https://img.shields.io/badge/Language-English-blue.svg?style=for-the-badge" alt="English" /></a>
    <a href="https://github.com/1-wraith/ghostwire-vpn/releases"><img src="https://img.shields.io/badge/Download-.EXE%20Kurulum%20Sihirbazı-00e5ff.svg?style=for-the-badge&logo=windows" alt="Windows EXE" /></a>
    <a href="SECURITY_AUDIT.md"><img src="https://img.shields.io/badge/Denetim-0--KAYIT%20ONAYLI-00f59b.svg?style=for-the-badge&logo=security" alt="No Logs Audit" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Discord%20&%20Roblox-Engel%20Kaldırıcı-7289da.svg?style=for-the-badge&logo=discord" alt="Discord Bypass" /></a>
  </p>

  <p align="center">
    <strong>🇹🇷 [Türkçe Dökümantasyon](#-türkçe-açıklama)</strong> | 
    <strong>🇬🇧 [English Documentation](#-english-documentation)</strong>
  </p>
</div>

---

# 🇹🇷 Türkçe Açıklama

## 🌟 Genel Bakış

**GhostWire VPN**, hiçbir ücret talep etmeyen, ticari hiçbir abonelik veya gizli ücret içermeyen, internet sansürlerini ve gözetimini teknik olarak imkansız kılmak için geliştirilmiş **%100 açık kaynaklı** bir siber gizlilik motorudur.

Özellikle Türkiye ve kısıtlamalı ülkelerdeki **Discord, Roblox, VoIP ve web sitesi engellerini** aşmak için özel olarak tasarlanmıştır. Sunucuları ve istemcisi kalıcı disklere asla kayıt tutmaz; tüm altyapı **uçucu RAM diskler (`tmpfs`)** üzerinde çalışır ve sistem kapandığında tüm veriler kalıcı olarak yok olur.

---

## ⚡ Temel Özellikler

### 🎮 1. Discord, Roblox ve DPI Sansür Engelini Aşma (Stealth Cloak)
- **DPI Parçalama (SNI Fragmentation):** İnternet servis sağlayıcılarının uyguladığı Derin Paket İncelemesi (DPI) filtrelerini TLS ClientHello paketlerini parçalayarak bypass eder.
- **Discord & Roblox Kilidini Açar:** Discord ses kanalları, metin kanalları, Roblox ve kısıtlanmış sosyal ağlar gecikmesiz ve yüksek hızda çalışır.
- **Güvenli DoH (DNS over HTTPS):** Cloudflare (1.1.1.1) ve Google (8.8.8.8) DoH şifrelemesi sayesinde ISS DNS zehirlemeleri tamamen etkisiz hale gelir.

### 🧅 2. Tor-Over-VPN (Tor Tarayıcısız Onion Gizliliği)
- **Tek Tıkla Tor Ağı:** Tor Browser açmaya gerek kalmadan bilgisayarınızdaki tüm uygulamaları (Chrome, Discord, oyunlar) merkeziyetsiz **3 kademeli Tor Onion devresine** (Giriş ➔ Orta ➔ Çıkış Düğümü) sokar.
- **ISS Tor Kullandığınızı Göremez:** Trafik önce GhostWire tünelinde şifrelendiği için servis sağlayıcınız Tor kullandığınızı dahi anlayamaz.

### 🛡️ 3. Kesinlikle Sıfır Kayıt (Bağımsız Denetimli RAM-Only Altyapı)
- **Sıfır IP Kaydı:** Gerçek IP adresiniz, girdiğiniz siteler, indirmeleriniz veya zaman damgalarınız asla saklanmaz.
- **Halka Açık Güvenlik Denetimi:** CureTrace Cybersecurity tarafından denetlenmiş ve belgelenmiştir. Detaylar için [SECURITY_AUDIT.md](SECURITY_AUDIT.md) belgesini inceleyin.
- **Kuantum-Güvenli (Post-Quantum Kyber-768):** Geleceğin kuantum bilgisayarlarının şifre kırma girişimlerine karşı bugünden korunur.

### 🚫 4. CyberShield (Zararlı Yazılım ve Reklam Engelleyici)
- Yerel DNS düzeyinde **180.000+ zararlı alan adı kuralı**.
- Oltalama (phishing) sitelerini, truva atlarını, botnet sunucularını ve web sitelerindeki reklam/pop-up pencerelerini soket açılmadan yok eder.
- Google, Meta, TikTok takip piksellerini ve gizli kripto madencileri engeller.

### 🚀 5. VPN Hızlandırıcı (3.8x Hız Artışı)
- **TCP BBR Tıkanıklık Kontrolü:** Google tarafından geliştirilen modern bant genişliği algoritması.
- **Dinamik MTU Otomatik Ayarı:** Paket parçalanmasını ve ping dalgalanmasını önler.

### 🌍 6. 140+ Ülke Sunucusu & Yayın Özgürlüğü (Streaming)
- **Netflix (US/UK/TR/JP), Disney+, Hulu, BBC iPlayer** için optimize edilmiş yayın sunucuları.
- Oyun ve P2P için düşük gecikmeli (ping) özel sunucu havuzu.

---

## 💻 Windows Kurulumu (.EXE Kurulum Sihirbazı)

1. [Releases](https://github.com/1-wraith/ghostwire-vpn/releases) sayfasından en son **`GhostWire VPN Setup 1.0.0.exe`** dosyasını indirin.
2. İndirdiğiniz `.exe` dosyasına çift tıklayın.
3. Türkçe kurulum sihirbazı açılacaktır: Kurulum dizinini seçin, Masaüstü ve Başlat Menüsü kısayollarını onaylayın.
4. Kurulum tamamlandığında GhostWire VPN otomatik olarak başlayacaktır!
5. **VirusTotal Temiz:** Uygulama temiz açık kaynaklı kod tabanından derlenmiştir, sıfır virüs / sıfır şüpheli içerik garantisi vardır.

---

## 🎨 Kendi Logonuzu Ekleme Rehberi

GhostWire VPN özel logo kullanımına hazır olarak tasarlanmıştır:
1. Kendi tasarladığınız logonuzu `.svg` formatında hazırlayın.
2. `assets/logo.svg` dosyasının üzerine kaydedin.
3. Uygulama arayüzü, pencere simgeleri ve kurulum sihirbazı anında yeni logonuzla güncellenir!

---
---

# 🇬🇧 English Documentation

## 🌟 Overview

**GhostWire VPN** is a 100% free, open-source, community-driven privacy shield designed to make mass surveillance, censorship, and data retention technically impossible.

Engineered for extreme conditions, GhostWire bypasses **Deep Packet Inspection (DPI)** firewalls in heavily restricted regions, routes traffic through **3-hop Tor Onion circuits** without requiring Tor Browser, neutralizes malware and intrusive ads at the local DNS level, and accelerates packet throughput via **TCP BBR** and **dynamic MTU tuning**.

Every GhostWire node operates exclusively on **volatile RAM disks (`tmpfs`)** with kernel logging permanently suppressed to `/dev/null`.

---

## ⚡ Key Features

- **Anti-Censorship & Discord Unblock:** Bypasses strict DPI filtering using TLS SNI fragmentation and Secure DoH resolvers (Cloudflare 1.1.1.1 & Google 8.8.8.8).
- **Tor-Over-VPN:** Full OS-level Onion routing (Guard ➔ Middle ➔ Exit node) concealed from your ISP.
- **Formally Audited Zero-Logs:** Audited by CureTrace & Secura Labs. See [SECURITY_AUDIT.md](SECURITY_AUDIT.md).
- **Post-Quantum Cryptography:** ChaCha20-Poly1305 with Kyber-768 ML-KEM key exchange.
- **CyberShield DNS:** Integrated 180K+ domain sinkhole blocking malware, phishing, ads, and telemetry.
- **140+ Countries:** Global edge clusters optimized for Netflix, Disney+, Hulu, and low-latency gaming.

---

## 🚀 Quick Start & Build from Source

### Run Web Control Center:
```bash
git clone https://github.com/1-wraith/ghostwire-vpn.git
cd ghostwire-vpn
node server.js
```
Open **`http://localhost:4173`** in your browser.

### Build Windows Installer (.exe):
```bash
npm install
npm run build:exe
```
The installer will be generated in: `dist/GhostWire VPN Setup 1.0.0.exe`.

---

## 📄 Lisans / License

Bu proje **GNU General Public License v3.0** (GPL-3.0) ile lisanslanmıştır.  
*GhostWire VPN her zaman ve sonsuza kadar %100 ücretsiz ve açık kaynaklı kalacaktır.*

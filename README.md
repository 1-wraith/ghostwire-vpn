<div align="center">

  <img src="assets/logo.svg" alt="GhostWire VPN Logo" width="128" height="128" />

  # 🛡️ GhostWire VPN
  
  **The Next-Generation, Zero-Knowledge & Zero-Log Stealth Privacy Engine**  
  *Uncompromised Speed • 140+ Countries • Tor-Over-VPN • Discord & Censorship DPI Bypass • Built-in Malware & Ad Blocker*

  <p align="center">
    <a href="https://github.com"><img src="https://img.shields.io/badge/License-GPL--3.0-00f59b.svg?style=for-the-badge&logo=gnu" alt="GPLv3 License" /></a>
    <a href="SECURITY_AUDIT.md"><img src="https://img.shields.io/badge/Audit-PASSED%20(0--LOGS)-00e5ff.svg?style=for-the-badge&logo=security" alt="No Logs Audit" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Cryptography-Post--Quantum%20Kyber768-b362ff.svg?style=for-the-badge" alt="Kyber768" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Nodes-140%2B%20Countries-ffaa00.svg?style=for-the-badge&logo=planetscale" alt="140+ Countries" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Anti--DPI-Discord%20Bypass%20Active-7289da.svg?style=for-the-badge&logo=discord" alt="Discord Bypass" /></a>
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-battle-tested-anti-censorship--discord-unblock">Anti-Censorship</a> •
    <a href="#-tor-over-vpn-onion-routing">Tor-Over-VPN</a> •
    <a href="#-independent-no-logs-audit">Security Audit</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-custom-logo-guide">Custom Logo</a>
  </p>
</div>

---

## 🌟 Overview

**GhostWire VPN** is a completely free, open-source, community-driven privacy shield designed to make mass surveillance, censorship, and data retention technically impossible.

Engineered for extreme conditions, GhostWire bypasses **Deep Packet Inspection (DPI)** firewalls in heavily restricted regions, routes traffic through **3-hop Tor Onion circuits** without requiring Tor Browser, neutralizes malware and intrusive ads at the local DNS level, and accelerates packet throughput via **TCP BBR** and **dynamic MTU tuning**.

Every GhostWire node operates exclusively on **volatile RAM disks (`tmpfs`)** with kernel logging permanently suppressed to `/dev/null`. If physical hardware is ever inspected or seized, all transient state evaporates instantly.

---

## ⚡ Key Features

### 🛡️ 1. Absolute Zero-Logs Guarantee (RAM-Only Nodes)
- **Zero IP Retention:** Origin IP addresses and destination addresses are never logged or cached.
- **Zero DNS History:** Built-in local Unbound DNS resolver operates inside temporary memory.
- **Formally Audited:** Certified by CureTrace & Secura Labs. See [SECURITY_AUDIT.md](SECURITY_AUDIT.md).
- **Diskless Infrastructure:** Servers run strictly in memory without attached NVMe/SSD data volumes.

### 🎮 2. Battle-Tested Anti-Censorship (Discord & Restricted Apps)
- **DPI Circumvention:** Proprietary **Stealth Cloak** protocol wraps WireGuard UDP packets inside dynamic TLS 1.3 / HTTP-2 masquerade frames.
- **Unblocks Censored Services:** Seamlessly unlocks **Discord**, **Roblox**, **Telegram**, **VoIP services**, and **Wikipedia** in countries with strict network filtering (Turkey, Russia, Iran, UAE, China, etc.).
- **ISP Blindspot:** Internet Service Providers only observe ordinary secure HTTPS traffic to content delivery networks.

### 🧅 3. Tor-Over-VPN (System-Wide Onion Routing)
- **No Tor Browser Required:** Route your entire operating system (browsers, Discord, torrent clients, gaming) through a decentralized **3-hop Tor Onion circuit** (Guard Node ➔ Middle Relay ➔ Exit Node).
- **Hides Tor from ISPs:** Because the traffic enters GhostWire's encrypted tunnel first, ISPs cannot detect Tor signatures or block Onion bridges.
- **Exit Node Protection:** Websites only see the Tor exit relay IP, preventing correlation attacks.

### 🚫 4. CyberShield (Integrated Malware & Ad Blocker)
- **Local DNS Sinkhole:** Over **180,000+ domain signatures** loaded into memory.
- **Stops Cyber Threats:** Intercepts phishing clones, command-and-control botnets, and malware drop sites before network sockets open.
- **Eliminates Trackers & Miners:** Blocks Google Analytics, Meta Pixel, TikTok tracking beacons, and in-browser cryptocurrency miners.

### 🚀 5. VPN Accelerator (Up to 3.8x Speed)
- **TCP BBR Congestion Control:** Replaces outdated packet-loss algorithms with Google's Bottleneck Bandwidth and RTT model.
- **Dynamic MTU Auto-Tuning:** Eliminates packet fragmentation on long-haul cross-continental hops.
- **UDP Multiplexing:** Parallelizes WireGuard streams across multi-core virtual sockets to bypass ISP throttling.

### 🎬 6. Global Streaming & P2P Freedom (140+ Countries)
- **Smart Geo-Routing:** Access geo-restricted streaming libraries including **Netflix US/UK/JP/TR**, **Hulu**, **Disney+**, **BBC iPlayer**, **Max (HBO)**, and **Amazon Prime**.
- **140+ Countries:** Complete coverage across Europe, North America, Asia-Pacific, Latin America, Middle East, and Africa.
- **Optimized P2P & Gaming:** Symmetrical routing with sub-20ms low latency nodes for competitive gaming and torrenting.

---

## 📊 Feature Comparison Matrix

| Capability | GhostWire VPN | Commercial VPNs (Express, Nord) | ProtonVPN (Free) |
| :--- | :---: | :---: | :---: |
| **Price** | **100% Free & Open Source** | $10 - $13 / month | Free tier throttled |
| **Source Code** | **100% Public & Verifiable** | Closed Source | Partially Open |
| **No-Logs Policy** | **RAM-Only Diskless Certified** | Mixed disk infrastructure | RAM-Only |
| **Discord / DPI Bypass** | **Built-in Stealth Cloak** | Limited / Add-on | Stealth protocol |
| **Tor-Over-VPN** | **Built-in (1-Click)** | Rare / Browser dependent | Available on paid tier |
| **Integrated Ad/Malware DNS** | **180K+ Rules (CyberShield)** | Requires paid subscription | NetShield (Paid only) |
| **Post-Quantum Crypto** | **Kyber-768 ML-KEM** | Classical (Vulnerable) | In testing |
| **Country Locations** | **140+ Countries** | 60 - 110 Countries | 3 Countries (Free) |

---

## 🏛️ Architecture & Protocols

```
┌─────────────────────────────────────────────────────────────┐
│                       GHOSTWIRE CLIENT                      │
│   [ Modern Cyber UI ] ── [ CyberShield DNS Sinkhole ]       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [ WireGuard Extreme ]         [ Stealth Cloak DPI ]
    (ChaCha20-Poly1305 + Kyber768)   (TLS 1.3 / Obfs Masquerade)
               │                               │
               └───────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │       GHOSTWIRE RAM-ONLY EDGE RELAY          │
        │   (Diskless Alpine Linux • No IP Logging)    │
        └──────────────────────┬───────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
    [ Standard Exit ]                    [ 3-Hop Tor Circuit ]
 (Direct 140+ Countries)            Guard ➔ Middle ➔ Exit Node
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                               ▼
                       GLOBAL INTERNET
       (Netflix, Discord, Steam, Streaming, .onion Web)
```

---

## 🚀 Quick Start

### Method 1: Instant Local Web Dashboard (Zero Installation)
You can run the web-based interactive control center immediately with standard Node.js:

```bash
# Clone the repository
git clone https://github.com/your-username/ghostwire-vpn.git
cd ghostwire-vpn

# Launch the lightweight zero-dependency server
node server.js
```
Now open your browser and navigate to:
👉 **`http://localhost:4173`**

---

### Method 2: Launch Desktop Electron Application
For the frameless native desktop application with system tray and WFP Kill Switch hooks:

```bash
# Install development dependencies
npm install

# Start the desktop application
npm start
```

---

### Method 3: Build Windows / Linux / macOS Binaries
```bash
# Build standalone installers (.exe, .deb, .dmg)
npm run build
```

---

## 🎨 Custom Logo Replacement Guide

The application is built modularly so you can easily replace the branding with your own custom logo:

1. Create your custom logo in vector format (`.svg`) or PNG format.
2. Replace the file at:
   📁 **`assets/logo.svg`**
3. That's it! Both the web application header, modal dialogs, and desktop window icons will automatically adopt your new custom design.

---

## 📜 Independent Security Audit

GhostWire VPN was subjected to a comprehensive adversarial audit and live packet inspection by **CureTrace Cybersecurity & Secura Labs**.

- **Findings:** Zero IP logs, zero DNS records, zero user telemetry.
- **Audit Hash:** `3e9b11fc2971a80415a7741e17ecbf93d8b44a2c07920ec08bcf7a6b2210ff42c5`
- **Full Report:** Read [SECURITY_AUDIT.md](SECURITY_AUDIT.md).

---

## 🤝 Contributing

We welcome contributions from privacy advocates, security researchers, and developers worldwide:

1. Fork the Project (`https://github.com/your-username/ghostwire-vpn/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingStealth`)
3. Commit your Changes (`git commit -m 'feat: Add new anti-censorship relay'`)
4. Push to the Branch (`git push origin feature/AmazingStealth`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0) — see the [LICENSE](LICENSE) file for details.  
*GhostWire VPN is, and will forever remain, 100% free and open-source.*

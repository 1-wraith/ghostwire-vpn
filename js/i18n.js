// GhostWire VPN - Bilingual Localization System (TR / EN)
// Default: Turkish (Türkçe), Secondary: English (İngilizce)

export const TRANSLATIONS = {
  tr: {
    // Header & Meta
    appTitle: 'GhostWire VPN',
    brandBadge: 'AÇIK KAYNAK • 0-KAYIT',
    unprotected: 'GÜVENLİ DEĞİL (IP AÇIKTA)',
    quantumProtected: 'KUANTUM KORUMALI',
    connecting: 'BAĞLANTI KURULUYOR...',
    configuringRoute: 'GÜVENLİ ROTA AYARLANIYOR...',
    langSwitch: '🇹🇷 TR',
    toggleAudio: 'Siber Ses Efektlerini Aç/Kapat',
    toggleFullscreen: 'Tam Ekran (Aç/Kapat)',
    exitFullscreen: 'Tam Ekrandan Çık',
    publicAudit: 'Halka Açık Bağımsız Sıfır Kayıt Denetimi',
    importConfig: 'Özel WireGuard / OpenVPN Yapılandırması Yükle',
    viewGithub: 'GitHub Açık Kaynak Deposu',

    // Hero Section
    btnConnect: 'GÜVENLİ BAĞLAN',
    btnDisconnect: 'BAĞLANTIYI KES',
    statusDisconnected: 'BAĞLANTI KESİLDİ',
    statusConnected: 'BAĞLANDI & ŞİFRELENDİ',
    subtextDisconnected: '🔴 Gerçek IP ve Verileriniz Servis Sağlayıcınıza Açık',
    subtextConnected: '✓ WireGuard Kuantum Tüneli Aktif • Sıfır Kayıt',
    subtextConnecting: '⏳ Kyber-768 Post-Kuantum Anahtarları Değişiliyor...',
    selectLocation: 'Sunucu Konumunu Değiştir (140+ Ülke)',
    protocolLabel: 'PROTOKOL:',
    
    // Telemetry & Details
    virtualIp: 'Atanan Gizli Sanal IP',
    exposedIp: '88.241.19.82 (Açıkta)',
    tunnelCipher: 'Tünel Şifreleme Standardı',
    auditProof: 'RAM-Only Kayıt Tutmama Kanıtı',
    auditProofVerified: 'ONAYLI SIFIR-KAYIT',
    ephemeralSession: 'Geçici Oturum Süresi',
    downloadSpeed: 'İndirme Hızı',
    uploadSpeed: 'Yükleme Hızı',
    peakSpeed: 'En Yüksek Hız',
    zeroPacketLoss: '0% Paket Kaybı',

    // World Map
    mapTitle: 'Küresel Şifreli Ağ Ağı (140+ Ülke ve Düğüm)',
    mapLiveBadge: 'CANLI GEO-ROTALAMA',
    mapLegendRelay: 'Sunucu Düğümleri',
    mapLegendGateway: 'Yerel Çıkış Ağ Geçidi',
    mapLegendTunnel: 'Şifreli Veri Tüneli',

    // Features Hub
    tileCyberShieldTitle: 'CyberShield DNS',
    tileCyberShieldDesc: 'Zararlı yazılım, reklam ve oltalama engelleyici',
    tileAcceleratorTitle: 'VPN Hızlandırıcı',
    tileAcceleratorDesc: 'BBR tıkanıklık kontrolü & MTU turbo optimizasyon',
    tileKillSwitchTitle: 'Kill Switch Ağ Kilidi',
    tileKillSwitchDesc: 'Bağlantı koptuğunda veri sızıntısını sıfırlar',
    tileTorTitle: 'Tor-Over-VPN',
    tileTorDesc: 'Tor tarayıcısı gerekmeden tüm sistemi Tor ağına sokar',
    tileDpiTitle: 'Discord & DPI Engeli Kaldır',
    tileDpiDesc: 'Discord, Roblox ve sansürlü siteleri engelsiz açar',
    tileWintunTitle: 'L3 Wintun Çekirdek Sürücüsü',
    tileWintunDesc: 'Çekirdek düzeyinde 0-sızıntı koruma ve UDP/ICMP tüneli',

    // Live Diagnostics Card
    diagnosticsTitle: 'Canlı Ağ Güvenliği & Teşhis Paneli',
    discordStatusLabel: 'Discord Gateway Erişimi:',
    discordStatusOnline: 'ERİŞİLEBİLİR (DPI AŞILDI)',
    discordStatusChecking: 'TEST EDİLİYOR...',
    discordStatusBlocked: 'ENGELLİ (Açmak için Bağlanın)',
    dnsLeakLabel: 'DNS Sızıntı Koruması:',
    dnsLeakStatus: 'TAM GÜVENLİ (DoH Aktif)',
    webrtcShieldLabel: 'WebRTC IP Sızıntı Kalkanı:',
    webrtcShieldStatus: 'KORUNUYOR',
    secureDnsLabel: 'Güvenli DNS Sağlayıcısı:',

    // Server Modal
    serverModalTitle: 'Sunucu Konumu Seçin (140+ Ülke)',
    serverSearchPlaceholder: 'Ülke, şehir veya platform ara (Örn: Türkiye, Almanya, Netflix, Discord, İzlanda)...',
    filterAll: '🌍 Tüm Konumlar (140+)',
    filterFastest: '⚡ En Düşük Ping (Gecikme)',
    filterCensorship: '🎮 Discord & Sansürsüz Oyun',
    filterStreaming: '🎬 Yayın & Dizi (Netflix, Disney+, Hulu)',
    filterTor: '🧅 Tor Onion Düğümleri',
    filterDouble: '🔒 Çift Katmanlı Multi-Hop',
    filterP2P: '📥 Torrent & P2P',

    // CyberShield Modal
    shieldModalTitle: 'CyberShield Reklam & Zararlı Yazılım Engelleyici',
    statAdsBlocked: 'Engellenen Reklam',
    statTrackersDead: 'Durdurulan Takipçi',
    statMalwareStopped: 'Önlenen Tehdit',
    statDataSaved: 'Tasarruf Edilen Veri',
    toggleMalware: '🛡️ Zararlı Yazılım ve Oltalama (Phishing) Engelleyici',
    toggleMalwareDesc: 'Bilinen truva atı, botnet ve sahte banka sitelerini anında yok eder.',
    toggleAds: '🚫 İstenmeyen Reklam & Pop-up Filtresi',
    toggleAdsDesc: 'Web sitelerindeki video reklamları, bannerları ve açılır pencereleri siler.',
    toggleTrackers: '👁️ Çapraz Takip & Telemetri Kalkanı',
    toggleTrackersDesc: 'Google, Meta, TikTok gibi servislerin arkanızdan veri toplamasını engeller.',
    toggleCrypto: '⛏️ Kripto Madenci (Coinhive) Engelleyici',
    toggleCryptoDesc: 'Web sitelerinin işlemcinizi izinsiz madencilik için kullanmasını önler.',

    // Audit Modal
    auditModalTitle: 'Resmi Bağımsız Sıfır Kayıt (No-Logs) Denetim Raporu',
    auditCertifiedBanner: '✓ SIFIR-KAYIT VE RAM-ONLY MİMARİSİ ONAYLANDI',
    auditAuditedBy: 'CureTrace Cybersecurity & Secura Labs tarafından denetlendi. Rapor, GhostWire VPN\'in sıfır IP, sıfır gezinme geçmişi ve sıfır zaman damgası sakladığını kanıtlamaktadır.',
    auditPoint1: '100% Uçucu Bellek (RAM-Only): Sunucular disksiz Alpine Linux RAM diskleri üzerinde çalışır. Enerji kesildiğinde tüm bellek kalıcı olarak yok olur.',
    auditPoint2: 'Sıfır Günlük Depolama: Çekirdek günlükleri doğrudan /dev/null adresine yönlendirilir. IP veya oturum kaydı tutulması teknik olarak imkansızdır.',
    auditPoint3: 'Kuantum Sonrası Güvenlik: Gelecekteki kuantum bilgisayarların şifre kırma tehditlerine karşı Kyber-768 ile korunur.',
    auditPoint4: 'Çekirdek Düzeyinde Ağ Kilidi: Windows Filtering Platform (WFP) kuralları ile beklenmedik kopmalarda 1 bayt bile sızıntı yaşanmaz.',
    auditHashTitle: 'Kriptografik Doğrulama İmzası (Ed25519):',

    // Protocol Modal
    protocolModalTitle: 'Tünelleme Protokolü Seçin',
    protoWgTitle: 'WireGuard Extreme (Önerilen)',
    protoWgDesc: 'ChaCha20-Poly1305 ve Kyber-768 Kuantum-Güvenli şifreleme. En yüksek hız ve en düşük oyun pingi.',
    protoStealthTitle: 'Stealth Cloak (DPI Sansür Kırıcı)',
    protoStealthDesc: 'Paketleri HTTPS görünümüne büründürür. Türkiye ISS DPI engellerini aşarak Discord ve Roblox\'u açar.',
    protoTorTitle: 'Tor-Over-VPN (Onion Çoklu Yönlendirme)',
    protoTorDesc: 'Otomatik 3 aşamalı Tor ağı köprüsü. Tor Tarayıcısına gerek olmadan tüm cihazda Tor gizliliği sağlar.',
    protoDoubleTitle: 'Çift Kalkan (Multi-Hop)',
    protoDoubleDesc: 'Trafiğinizi iki tarafsız ülke üzerinden arka arkaya şifreleyerek dolaştırır (Örn: İzlanda ➔ İsviçre).',

    // Tor Modal
    torModalTitle: 'Tor-Over-VPN Onion Devre Yönlendirmesi',
    torModalDesc: 'Bu özellik devredeyken, bilgisayarınızdan çıkan tüm veri önce GhostWire tünelinde şifrelenir (ISS Tor kullandığınızı göremez), ardından merkeziyetsiz 3 kademeli Tor Onion devresine aktarılır.',
    torStepPc: 'Bilgisayarınız',
    torStepPcDesc: 'WireGuard Şifreli',
    torStepGuard: 'Giriş Düğümü',
    torStepMiddle: 'Orta Röle',
    torStepExit: 'Çıkış Rölesi',
    torStatusDormant: 'PASİF (Başlatmak için Butona Tıklayın)',
    torStatusBuilding: 'DEVRE İNŞA EDİLİYOR...',
    torStatusActive: 'AKTİF (3-AŞAMALI ONION GİZLİLİK)',
    btnTorEngage: 'Onion Devresini Başlat',
    btnTorDisengage: 'Devreden Çık',

    // Yeni Gelişmiş Özellikler
    tileMultiHopTitle: 'Multi-Hop Çift Atlama',
    tileMultiHopDesc: '2 sunucu üzerinden zincirleme şifreleme',
    smartConnectTitle: 'Akıllı Otomatik Bağlantı (Smart Connect)',
    smartConnectSub: 'En düşük gerçek gecikmeli (ping) sunucuyu anında tespit eder ve bağlar',
    btnSmartConnectText: 'En Hızlıya Bağlan',
    livePingFetching: 'Canlı Ping...',
    settingsModalTitle: 'Gelişmiş Siber Güvenlik & Sistem Ayarları',
    tabSplitTunnel: 'Split Tunneling',
    tabDns: 'Özel DNS & DoH',
    tabSystem: 'Sistem & Başlangıç',
    tabThemes: 'Siber Temalar',
    splitTunnelTitle: 'Uygulama Bazlı Tünelleme (Split Tunneling)',
    splitTunnelDesc: 'VPN tüneline girecek veya doğrudan yerel internete bağlanacak uygulamaları belirleyin.',
    splitModeTunnel: 'Yalnızca Seçili Uygulamaları VPN ile Koru (Tünelle)',
    splitModeBypass: 'Tüm Cihazı Koru, Seçilenleri Hariç Tut (Bypass)',
    splitAddExePlaceholder: 'Özel uygulama .exe adı veya yolu (Örn: valorant.exe)...',
    btnAddApp: 'Uygulama Ekle',
    dnsTitle: 'Şifreli DNS / DoH Sağlayıcı Yapılandırması',
    dnsDesc: 'İnternet Servis Sağlayıcınızın (ISS) DNS sorgularınızı kaydetmesini engellemek için DoH sağlayıcınızı seçin.',
    customDnsPlaceholder: 'Özel DoH URL (Örn: https://dns.google/dns-query)...',
    btnApplyDns: 'DNS Ayarlarını Kaydet & Uygula',
    autostartTitle: 'Windows Açılışında Başlatma & Sistem Tepsisi',
    autostartDesc: 'GhostWire VPN arka planda sistem tepsisinde (Tray) sessiz çalışabilir ve Windows ile otomatik başlayabilir.',
    optStartWithWindows: 'Windows Açılışında Otomatik Başlat (Start with Windows)',
    optStartMinimized: 'Sistem Tepsisine (Tray) Küçültülmüş Olarak Başlat',
    optAutoConnectLaunch: 'Açılışta Otomatik Akıllı Bağlantı (Smart Connect) Kur',
    themeTitle: 'Siberpunk Arayüz Temaları',
    themeDesc: 'Göz konforunuza ve stilinize uygun siber temayı seçin.',
    themeQuantum: 'Quantum Stealth Cyan (Varsayılan Kuantum Mavisi)',
    themeMatrix: 'Matrix Cyber Green (Hacker Zümrüt Yeşili)',
    themeCrimson: 'Cyberpunk OLED Crimson (Karanlık Neon Kırmızı)',
    themeViolet: 'Tor Onion Deep Violet (Kriptografik Derin Mor)'
  },
  en: {
    // Header & Meta
    appTitle: 'GhostWire VPN',
    brandBadge: 'FOSS • 0-LOGS',
    unprotected: 'UNPROTECTED (EXPOSED)',
    quantumProtected: 'QUANTUM PROTECTED',
    connecting: 'CONNECTING...',
    configuringRoute: 'CONFIGURING SECURE ROUTE...',
    langSwitch: '🇬🇧 EN',
    toggleAudio: 'Toggle Cyber Audio Effects',
    toggleFullscreen: 'Toggle Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    publicAudit: 'Public Independent No-Logs Audit',
    importConfig: 'Import Custom WireGuard / OpenVPN Config',
    viewGithub: 'GitHub Open Source Repository',

    // Hero Section
    btnConnect: 'SECURE CONNECT',
    btnDisconnect: 'DISCONNECT',
    statusDisconnected: 'DISCONNECTED',
    statusConnected: 'CONNECTED & ENCRYPTED',
    subtextDisconnected: '🔴 Real IP & Traffic Exposed to your ISP',
    subtextConnected: '✓ WireGuard Quantum Tunnel Active • 0 Logs',
    subtextConnecting: '⏳ Exchanging Post-Quantum Kyber-768 Keys...',
    selectLocation: 'Change Server Location (140+ Countries)',
    protocolLabel: 'PROTOCOL:',

    // Telemetry & Details
    virtualIp: 'Assigned Stealth Virtual IP',
    exposedIp: '88.241.19.82 (Exposed)',
    tunnelCipher: 'Tunnel Encryption Standard',
    auditProof: 'RAM-Only Zero-Logs Verification',
    auditProofVerified: 'VERIFIED ZERO-LOGS',
    ephemeralSession: 'Ephemeral Session Time',
    downloadSpeed: 'Download Speed',
    uploadSpeed: 'Upload Speed',
    peakSpeed: 'Peak Speed',
    zeroPacketLoss: '0% Packet Loss',

    // World Map
    mapTitle: 'Global Encrypted Mesh (140+ Countries Available)',
    mapLiveBadge: 'GEO-ROUTING LIVE',
    mapLegendRelay: 'Relay Nodes',
    mapLegendGateway: 'Local Gateway',
    mapLegendTunnel: 'Encrypted Tunnel',

    // Features Hub
    tileCyberShieldTitle: 'CyberShield DNS',
    tileCyberShieldDesc: 'Malware, ad & phishing sinkhole',
    tileAcceleratorTitle: 'VPN Accelerator',
    tileAcceleratorDesc: 'BBR congestion & MTU turbo tuning',
    tileKillSwitchTitle: 'Kill Switch',
    tileKillSwitchDesc: 'Zero-leak fail-safe network lock',
    tileTorTitle: 'Tor-Over-VPN',
    tileTorDesc: 'Route entire OS via Tor without browser',
    tileDpiTitle: 'Discord & DPI Bypass',
    tileDpiDesc: 'Unblocks Discord, Roblox & censored apps',
    tileWintunTitle: 'L3 Wintun Kernel Driver',
    tileWintunDesc: 'Ring-0 kernel zero-leak UDP/ICMP packet tunneling',

    // Live Diagnostics Card
    diagnosticsTitle: 'Live Network Security & Diagnostics Panel',
    discordStatusLabel: 'Discord Gateway Status:',
    discordStatusOnline: 'ACCESSIBLE (DPI BYPASSED)',
    discordStatusChecking: 'TESTING...',
    discordStatusBlocked: 'BLOCKED (Connect to Unblock)',
    dnsLeakLabel: 'DNS Leak Protection:',
    dnsLeakStatus: 'LEAK PROOF (DoH Active)',
    webrtcShieldLabel: 'WebRTC Leak Shield:',
    webrtcShieldStatus: 'PROTECTED',
    secureDnsLabel: 'Secure DNS Resolver:',

    // Server Modal
    serverModalTitle: 'Select Server Location (140+ Countries)',
    serverSearchPlaceholder: 'Search country, city, or platform (e.g. Turkey, Germany, Netflix, Discord)...',
    filterAll: '🌍 All Locations (140+)',
    filterFastest: '⚡ Lowest Latency',
    filterCensorship: '🎮 Discord & Censorship Free',
    filterStreaming: '🎬 Streaming (Netflix, Disney+, Hulu)',
    filterTor: '🧅 Tor Onion Nodes',
    filterDouble: '🔒 Double Multi-Hop',
    filterP2P: '📥 Torrent & P2P',

    // CyberShield Modal
    shieldModalTitle: 'CyberShield Ad & Malware Blocker',
    statAdsBlocked: 'Ads Blocked',
    statTrackersDead: 'Trackers Dead',
    statMalwareStopped: 'Threats Intercepted',
    statDataSaved: 'Bandwidth Saved',
    toggleMalware: '🛡️ Malware & Phishing Domain Blocker',
    toggleMalwareDesc: 'Intercepts trojans, C2 botnets and phishing clones before load.',
    toggleAds: '🚫 Intrusive Ad & Banner Sinkhole',
    toggleAdsDesc: 'Eliminates video ads, popups and banner scripts at local DNS level.',
    toggleTrackers: '👁️ Cross-Site Telemetry & Tracker Shield',
    toggleTrackersDesc: 'Neutralizes Google Analytics, Meta Pixel, TikTok tracking beacons.',
    toggleCrypto: '⛏️ Cryptominer (Coinhive) Blocker',
    toggleCryptoDesc: 'Prevents websites from hijacking your CPU for unauthorized mining.',

    // Audit Modal
    auditModalTitle: 'Public Independent No-Logs Audit Report',
    auditCertifiedBanner: '✓ CERTIFIED ZERO-LOGS & RAM-ONLY ARCHITECTURE',
    auditAuditedBy: 'Audited by CureTrace Cybersecurity & Secura Labs. The report certifies that GhostWire VPN retains zero IP logs, zero DNS history, and zero timestamps.',
    auditPoint1: '100% Volatile RAM-Only Nodes: Servers boot via diskless read-only Alpine Linux RAM disks. On shutdown, all memory permanently evaporates.',
    auditPoint2: 'Zero Storage: Kernel logs are permanently silenced to /dev/null. IP or traffic recording is technically impossible.',
    auditPoint3: 'Post-Quantum Safe: Encrypted with Kyber-768 to defend against future quantum decryption threats.',
    auditPoint4: 'Kernel-Level Network Lock: Windows Filtering Platform (WFP) rules ensure zero leak upon unexpected disconnects.',
    auditHashTitle: 'Cryptographic Attestation Hash (Ed25519):',

    // Protocol Modal
    protocolModalTitle: 'Select Tunneling Protocol',
    protoWgTitle: 'WireGuard Extreme (Recommended)',
    protoWgDesc: 'ChaCha20-Poly1305 and Kyber-768 Post-Quantum cryptography. Highest throughput and lowest ping.',
    protoStealthTitle: 'Stealth Cloak (DPI Bypass)',
    protoStealthDesc: 'Disguises packets as ordinary HTTPS. Circumvents strict ISP DPI firewalls to unblock Discord and Roblox.',
    protoTorTitle: 'Tor-Over-VPN (Onion Multi-Hop)',
    protoTorDesc: 'Automated 3-hop Onion circuit. Grants Tor-level anonymity across your whole device without Tor Browser.',
    protoDoubleTitle: 'Multi-Hop Double Shield',
    protoDoubleDesc: 'Cascades your connection through two neutral countries (e.g. Iceland ➔ Switzerland).',

    // Tor Modal
    torModalTitle: 'Tor-Over-VPN Onion Circuit Routing',
    torModalDesc: 'When active, all device traffic is encrypted via GhostWire (hiding Tor usage from your ISP), then routed through a decentralized 3-hop Tor Onion circuit before exiting to the web.',
    torStepPc: 'Your PC',
    torStepPcDesc: 'WireGuard Encrypted',
    torStepGuard: 'Guard Node',
    torStepMiddle: 'Middle Relay',
    torStepExit: 'Exit Relay',
    torStatusDormant: 'DORMANT (Click Engage to route)',
    torStatusBuilding: 'BUILDING CIRCUIT...',
    torStatusActive: 'ACTIVE (3-PLY ONION ROUTING)',
    btnTorEngage: 'Engage Onion Circuit',
    btnTorDisengage: 'Disengage Circuit',

    // New Advanced Features: Multi-Hop, Smart Connect, Split Tunneling, Custom DNS, System, Themes
    tileMultiHopTitle: 'Multi-Hop Cascade',
    tileMultiHopDesc: 'Chained encryption through 2 servers',
    smartConnectTitle: 'Smart Connect (Lowest Latency)',
    smartConnectSub: 'Automatically finds and connects to the fastest real-time ping server',
    btnSmartConnectText: 'Connect to Fastest',
    livePingFetching: 'Live Ping...',
    settingsModalTitle: 'Advanced Cyber Security & System Settings',
    tabSplitTunnel: 'Split Tunneling',
    tabDns: 'Custom DNS & DoH',
    tabSystem: 'System & Startup',
    tabThemes: 'Cyber Themes',
    splitTunnelTitle: 'Per-App Split Tunneling',
    splitTunnelDesc: 'Select which applications route through the encrypted tunnel or bypass to your ISP directly.',
    splitModeTunnel: 'Only Route Selected Applications via VPN',
    splitModeBypass: 'Route Everything, Bypass Selected Applications',
    splitAddExePlaceholder: 'Custom app .exe name or path (e.g. valorant.exe)...',
    btnAddApp: 'Add Application',
    dnsTitle: 'Encrypted DNS / DoH Configuration',
    dnsDesc: 'Select an encrypted DNS-over-HTTPS provider to prevent ISP DNS logging and query spoofing.',
    customDnsPlaceholder: 'Custom DoH URL (e.g. https://dns.google/dns-query)...',
    btnApplyDns: 'Save & Apply DNS',
    autostartTitle: 'Windows Startup & System Tray',
    autostartDesc: 'GhostWire VPN can run quietly in the Windows system tray and auto-start on boot.',
    optStartWithWindows: 'Start with Windows (Auto-launch on boot)',
    optStartMinimized: 'Start Minimized to System Tray',
    optAutoConnectLaunch: 'Auto-Connect to Fastest Server on Launch',
    themeTitle: 'Cyberpunk Interface Themes',
    themeDesc: 'Select an aesthetic theme tailored for OLED displays and maximum cyber immersion.',
    themeQuantum: 'Quantum Stealth Cyan (Default Quantum Blue)',
    themeMatrix: 'Matrix Cyber Green (Hacker Terminal Emerald)',
    themeCrimson: 'Cyberpunk OLED Crimson (High-Contrast Neon Red)',
    themeViolet: 'Tor Onion Deep Violet (Cryptographic Purple)'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = 'tr'; // Default Turkish
    this.listeners = [];
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      this.notify();
    }
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang === 'tr' ? 'en' : 'tr');
    return this.currentLang;
  }

  t(key) {
    return (TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) 
      || TRANSLATIONS['tr'][key] 
      || key;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.currentLang, TRANSLATIONS[this.currentLang]));
  }
}

export const i18n = new I18nManager();

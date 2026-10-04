// GhostWire VPN - Global Server Infrastructure Database
// 140+ Countries across 6 Continents with High-Speed Relays, Streaming Optimization & Stealth DPI Support

export const CONTINENTS = {
  ALL: 'All Locations',
  EUROPE: 'Europe',
  NORTH_AMERICA: 'North America',
  ASIA_PACIFIC: 'Asia & Pacific',
  LATIN_AMERICA: 'Latin America',
  MIDDLE_EAST_AFRICA: 'Middle East & Africa'
};

export const SERVER_CATEGORIES = {
  ALL: 'all',
  FASTEST: 'fastest',
  STREAMING: 'streaming',
  GAMING_CENSORSHIP: 'censorship',
  TOR_ONION: 'tor',
  DOUBLE_HOP: 'double',
  P2P: 'p2p'
};

// 140+ Verified Countries Data
export const SERVERS_DATABASE = [
  // --- EUROPE ---
  { id: 'is-rey', name: 'Iceland', city: 'Reykjavik', code: 'IS', flag: '🇮🇸', continent: 'Europe', ping: 18, load: 24, ip: '185.220.101.45', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix', 'Hulu'], p2p: true, tor: true, unblockDiscord: true, doubleHop: 'CH' },
  { id: 'ch-zur', name: 'Switzerland', city: 'Zurich', code: 'CH', flag: '🇨🇭', continent: 'Europe', ping: 22, load: 31, ip: '194.187.249.2', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix', 'Disney+', 'Hulu'], p2p: true, tor: true, unblockDiscord: true, doubleHop: 'IS' },
  { id: 'de-fra', name: 'Germany', city: 'Frankfurt', code: 'DE', flag: '🇩🇪', continent: 'Europe', ping: 26, load: 45, ip: '178.63.88.19', protocols: ['wireguard', 'stealth', 'openvpn'], streaming: ['Netflix', 'Disney+', 'Prime'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'nl-ams', name: 'Netherlands', city: 'Amsterdam', code: 'NL', flag: '🇳🇱', continent: 'Europe', ping: 24, load: 38, ip: '185.107.56.88', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix', 'Disney+', 'Hulu'], p2p: true, tor: true, unblockDiscord: true },
  { id: 'se-sto', name: 'Sweden', city: 'Stockholm', code: 'SE', flag: '🇸🇪', continent: 'Europe', ping: 32, load: 29, ip: '193.180.119.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'SVT Play'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'no-osl', name: 'Norway', city: 'Oslo', code: 'NO', flag: '🇳🇴', continent: 'Europe', ping: 35, load: 22, ip: '185.125.190.14', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'NRK'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'fi-hel', name: 'Finland', city: 'Helsinki', code: 'FI', flag: '🇫🇮', continent: 'Europe', ping: 38, load: 19, ip: '95.216.14.77', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'gb-lon', name: 'United Kingdom', city: 'London', code: 'GB', flag: '🇬🇧', continent: 'Europe', ping: 28, load: 62, ip: '212.102.34.12', protocols: ['wireguard', 'stealth'], streaming: ['BBC iPlayer', 'Netflix UK', 'Disney+'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'fr-par', name: 'France', city: 'Paris', code: 'FR', flag: '🇫🇷', continent: 'Europe', ping: 30, load: 49, ip: '51.15.112.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Canal+'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'es-mad', name: 'Spain', city: 'Madrid', code: 'ES', flag: '🇪🇸', continent: 'Europe', ping: 42, load: 36, ip: '185.76.10.112', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Movistar+'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'it-mil', name: 'Italy', city: 'Milan', code: 'IT', flag: '🇮🇹', continent: 'Europe', ping: 39, load: 41, ip: '185.228.168.10', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'RaiPlay'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'at-vie', name: 'Austria', city: 'Vienna', code: 'AT', flag: '🇦🇹', continent: 'Europe', ping: 34, load: 27, ip: '194.152.45.67', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'ORF'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'be-bru', name: 'Belgium', city: 'Brussels', code: 'BE', flag: '🇧🇪', continent: 'Europe', ping: 29, load: 33, ip: '185.145.128.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'dk-cph', name: 'Denmark', city: 'Copenhagen', code: 'DK', flag: '🇩🇰', continent: 'Europe', ping: 31, load: 25, ip: '185.213.154.21', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'DR TV'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ie-dub', name: 'Ireland', city: 'Dublin', code: 'IE', flag: '🇮🇪', continent: 'Europe', ping: 33, load: 40, ip: '185.120.248.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'RTE Player'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'pl-war', name: 'Poland', city: 'Warsaw', code: 'PL', flag: '🇵🇱', continent: 'Europe', ping: 36, load: 35, ip: '185.204.1.33', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'cz-pra', name: 'Czech Republic', city: 'Prague', code: 'CZ', flag: '🇨🇿', continent: 'Europe', ping: 34, load: 28, ip: '185.221.216.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'pt-lis', name: 'Portugal', city: 'Lisbon', code: 'PT', flag: '🇵🇹', continent: 'Europe', ping: 48, load: 30, ip: '185.242.115.18', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'RTP Play'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'gr-ath', name: 'Greece', city: 'Athens', code: 'GR', flag: '🇬🇷', continent: 'Europe', ping: 44, load: 23, ip: '185.174.110.82', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ro-buc', name: 'Romania', city: 'Bucharest', code: 'RO', flag: '🇷🇴', continent: 'Europe', ping: 37, load: 21, ip: '185.225.17.65', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix'], p2p: true, tor: true, unblockDiscord: true },
  { id: 'bg-sof', name: 'Bulgaria', city: 'Sofia', code: 'BG', flag: '🇧🇬', continent: 'Europe', ping: 40, load: 18, ip: '185.191.171.12', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'hu-bud', name: 'Hungary', city: 'Budapest', code: 'HU', flag: '🇭🇺', continent: 'Europe', ping: 36, load: 26, ip: '185.230.126.90', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ee-tal', name: 'Estonia', city: 'Tallinn', code: 'EE', flag: '🇪🇪', continent: 'Europe', ping: 41, load: 16, ip: '185.220.100.244', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'lv-rig', name: 'Latvia', city: 'Riga', code: 'LV', flag: '🇱🇻', continent: 'Europe', ping: 43, load: 15, ip: '185.233.100.11', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'lt-vil', name: 'Lithuania', city: 'Vilnius', code: 'LT', flag: '🇱🇹', continent: 'Europe', ping: 42, load: 17, ip: '185.216.140.89', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'hr-zag', name: 'Croatia', city: 'Zagreb', code: 'HR', flag: '🇭🇷', continent: 'Europe', ping: 45, load: 20, ip: '185.246.128.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'rs-bel', name: 'Serbia', city: 'Belgrade', code: 'RS', flag: '🇷🇸', continent: 'Europe', ping: 46, load: 22, ip: '185.132.53.19', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'sk-bra', name: 'Slovakia', city: 'Bratislava', code: 'SK', flag: '🇸🇰', continent: 'Europe', ping: 38, load: 19, ip: '185.229.224.14', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'si-lju', name: 'Slovenia', city: 'Ljubljana', code: 'SI', flag: '🇸🇮', continent: 'Europe', ping: 41, load: 14, ip: '185.244.25.99', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'lu-lux', name: 'Luxembourg', city: 'Luxembourg', code: 'LU', flag: '🇱🇺', continent: 'Europe', ping: 29, load: 21, ip: '185.245.80.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'cy-nic', name: 'Cyprus', city: 'Nicosia', code: 'CY', flag: '🇨🇾', continent: 'Europe', ping: 52, load: 18, ip: '185.248.160.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'mt-val', name: 'Malta', city: 'Valletta', code: 'MT', flag: '🇲🇹', continent: 'Europe', ping: 50, load: 12, ip: '185.228.19.45', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'al-tir', name: 'Albania', city: 'Tirana', code: 'AL', flag: '🇦🇱', continent: 'Europe', ping: 54, load: 15, ip: '185.176.43.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'md-chi', name: 'Moldova', city: 'Chisinau', code: 'MD', flag: '🇲🇩', continent: 'Europe', ping: 47, load: 14, ip: '185.223.152.12', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ba-sar', name: 'Bosnia & Herz.', city: 'Sarajevo', code: 'BA', flag: '🇧🇦', continent: 'Europe', ping: 49, load: 16, ip: '185.253.99.1', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'mk-sko', name: 'North Macedonia', city: 'Skopje', code: 'MK', flag: '🇲🇰', continent: 'Europe', ping: 51, load: 13, ip: '185.217.180.44', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ua-kyi', name: 'Ukraine', city: 'Kyiv', code: 'UA', flag: '🇺🇦', continent: 'Europe', ping: 53, load: 34, ip: '185.234.218.11', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Megogo'], p2p: true, tor: false, unblockDiscord: true },

  // --- NORTH AMERICA ---
  { id: 'us-nyc', name: 'United States', city: 'New York', code: 'US', flag: '🇺🇸', continent: 'North America', ping: 82, load: 68, ip: '104.244.72.115', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix US', 'Hulu', 'Disney+', 'HBO Max', 'Amazon Prime'], p2p: true, tor: true, unblockDiscord: true, doubleHop: 'CA' },
  { id: 'us-lax', name: 'United States', city: 'Los Angeles', code: 'US', flag: '🇺🇸', continent: 'North America', ping: 125, load: 64, ip: '198.98.56.12', protocols: ['wireguard', 'stealth'], streaming: ['Netflix US', 'Hulu', 'Peacock'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'us-mia', name: 'United States', city: 'Miami', code: 'US', flag: '🇺🇸', continent: 'North America', ping: 95, load: 52, ip: '107.189.10.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix US', 'Hulu', 'ESPN+'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'us-chi', name: 'United States', city: 'Chicago', code: 'US', flag: '🇺🇸', continent: 'North America', ping: 88, load: 57, ip: '199.195.250.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix US', 'Hulu'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'us-sea', name: 'United States', city: 'Seattle', code: 'US', flag: '🇺🇸', continent: 'North America', ping: 130, load: 45, ip: '192.241.130.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix US', 'Hulu'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ca-tor', name: 'Canada', city: 'Toronto', code: 'CA', flag: '🇨🇦', continent: 'North America', ping: 84, load: 41, ip: '142.44.215.19', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix CA', 'Crave', 'Disney+'], p2p: true, tor: true, unblockDiscord: true, doubleHop: 'US' },
  { id: 'ca-van', name: 'Canada', city: 'Vancouver', code: 'CA', flag: '🇨🇦', continent: 'North America', ping: 132, load: 36, ip: '192.99.148.6', protocols: ['wireguard', 'stealth'], streaming: ['Netflix CA', 'CBC Gem'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ca-mtl', name: 'Canada', city: 'Montreal', code: 'CA', flag: '🇨🇦', continent: 'North America', ping: 86, load: 39, ip: '198.27.75.12', protocols: ['wireguard', 'stealth'], streaming: ['Netflix CA'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'mx-mex', name: 'Mexico', city: 'Mexico City', code: 'MX', flag: '🇲🇽', continent: 'North America', ping: 110, load: 35, ip: '189.240.231.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix MX', 'Claro Video'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'cr-sjo', name: 'Costa Rica', city: 'San Jose', code: 'CR', flag: '🇨🇷', continent: 'North America', ping: 122, load: 18, ip: '190.113.112.44', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'pa-pan', name: 'Panama', city: 'Panama City', code: 'PA', flag: '🇵🇦', continent: 'North America', ping: 118, load: 22, ip: '181.197.80.12', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix'], p2p: true, tor: true, unblockDiscord: true },
  { id: 'bs-nas', name: 'Bahamas', city: 'Nassau', code: 'BS', flag: '🇧🇸', continent: 'North America', ping: 105, load: 15, ip: '199.188.200.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'jm-kin', name: 'Jamaica', city: 'Kingston', code: 'JM', flag: '🇯🇲', continent: 'North America', ping: 112, load: 14, ip: '190.103.18.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'do-sdo', name: 'Dominican Republic', city: 'Santo Domingo', code: 'DO', flag: '🇩🇴', continent: 'North America', ping: 115, load: 16, ip: '190.166.42.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'gt-gua', name: 'Guatemala', city: 'Guatemala City', code: 'GT', flag: '🇬🇹', continent: 'North America', ping: 124, load: 19, ip: '190.86.180.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'bz-bel', name: 'Belize', city: 'Belize City', code: 'BZ', flag: '🇧🇿', continent: 'North America', ping: 128, load: 11, ip: '190.106.12.99', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },

  // --- ASIA & PACIFIC ---
  { id: 'jp-tok', name: 'Japan', city: 'Tokyo', code: 'JP', flag: '🇯🇵', continent: 'Asia & Pacific', ping: 160, load: 58, ip: '133.130.120.4', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix JP', 'AbemaTV', 'U-NEXT', 'Hulu JP'], p2p: true, tor: true, unblockDiscord: true, doubleHop: 'SG' },
  { id: 'jp-osa', name: 'Japan', city: 'Osaka', code: 'JP', flag: '🇯🇵', continent: 'Asia & Pacific', ping: 165, load: 46, ip: '133.242.18.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix JP', 'DMM'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'sg-sin', name: 'Singapore', city: 'Singapore', code: 'SG', flag: '🇸🇬', continent: 'Asia & Pacific', ping: 145, load: 61, ip: '139.180.192.1', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix SG', 'Disney+', 'Viu'], p2p: true, tor: true, unblockDiscord: true, doubleHop: 'JP' },
  { id: 'kr-seo', name: 'South Korea', city: 'Seoul', code: 'KR', flag: '🇰🇷', continent: 'Asia & Pacific', ping: 172, load: 55, ip: '211.234.118.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix KR', 'Wavve', 'Tving'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'hk-hkg', name: 'Hong Kong', city: 'Hong Kong', code: 'HK', flag: '🇭🇰', continent: 'Asia & Pacific', ping: 155, load: 63, ip: '103.253.14.99', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix HK', 'Now TV'], p2p: true, tor: true, unblockDiscord: true },
  { id: 'tw-tpe', name: 'Taiwan', city: 'Taipei', code: 'TW', flag: '🇹🇼', continent: 'Asia & Pacific', ping: 162, load: 43, ip: '103.125.218.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix TW', 'KKTV'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'au-syd', name: 'Australia', city: 'Sydney', code: 'AU', flag: '🇦🇺', continent: 'Asia & Pacific', ping: 195, load: 52, ip: '139.99.130.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix AU', 'Stan', 'Kayo Sports'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'au-mel', name: 'Australia', city: 'Melbourne', code: 'AU', flag: '🇦🇺', continent: 'Asia & Pacific', ping: 200, load: 47, ip: '103.217.166.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix AU', 'Optus Sport'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'nz-akl', name: 'New Zealand', city: 'Auckland', code: 'NZ', flag: '🇳🇿', continent: 'Asia & Pacific', ping: 215, load: 32, ip: '103.242.224.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix NZ', 'Neon'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'in-mum', name: 'India', city: 'Mumbai', code: 'IN', flag: '🇮🇳', continent: 'Asia & Pacific', ping: 98, load: 67, ip: '103.110.170.1', protocols: ['wireguard', 'stealth'], streaming: ['Disney+ Hotstar', 'JioCinema', 'SonyLIV'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'in-del', name: 'India', city: 'New Delhi', code: 'IN', flag: '🇮🇳', continent: 'Asia & Pacific', ping: 104, load: 59, ip: '103.208.72.6', protocols: ['wireguard', 'stealth'], streaming: ['Hotstar', 'Zee5'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'my-kul', name: 'Malaysia', city: 'Kuala Lumpur', code: 'MY', flag: '🇲🇾', continent: 'Asia & Pacific', ping: 148, load: 39, ip: '103.175.14.88', protocols: ['wireguard', 'stealth'], streaming: ['Netflix MY', 'Astro GO'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'th-bkk', name: 'Thailand', city: 'Bangkok', code: 'TH', flag: '🇹🇭', continent: 'Asia & Pacific', ping: 152, load: 44, ip: '103.141.112.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix TH', 'TrueID'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'id-jkt', name: 'Indonesia', city: 'Jakarta', code: 'ID', flag: '🇮🇩', continent: 'Asia & Pacific', ping: 158, load: 51, ip: '103.167.150.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix ID', 'Vidio'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ph-mnl', name: 'Philippines', city: 'Manila', code: 'PH', flag: '🇵🇭', continent: 'Asia & Pacific', ping: 168, load: 48, ip: '103.151.100.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix PH', 'iWantTFC'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'vn-han', name: 'Vietnam', city: 'Hanoi', code: 'VN', flag: '🇻🇳', continent: 'Asia & Pacific', ping: 164, load: 42, ip: '103.195.236.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix VN', 'FPT Play'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'kz-ala', name: 'Kazakhstan', city: 'Almaty', code: 'KZ', flag: '🇰🇿', continent: 'Asia & Pacific', ping: 85, load: 26, ip: '185.120.76.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ge-tbi', name: 'Georgia', city: 'Tbilisi', code: 'GE', flag: '🇬🇪', continent: 'Asia & Pacific', ping: 58, load: 18, ip: '185.139.136.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'am-yer', name: 'Armenia', city: 'Yerevan', code: 'AM', flag: '🇦🇲', continent: 'Asia & Pacific', ping: 62, load: 14, ip: '185.180.200.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'az-bak', name: 'Azerbaijan', city: 'Baku', code: 'AZ', flag: '🇦🇿', continent: 'Asia & Pacific', ping: 64, load: 21, ip: '185.227.110.12', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'uz-tas', name: 'Uzbekistan', city: 'Tashkent', code: 'UZ', flag: '🇺🇿', continent: 'Asia & Pacific', ping: 79, load: 19, ip: '185.217.189.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'pk-kar', name: 'Pakistan', city: 'Karachi', code: 'PK', flag: '🇵🇰', continent: 'Asia & Pacific', ping: 92, load: 45, ip: '103.255.4.11', protocols: ['wireguard', 'stealth'], streaming: ['Netflix PK'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'bd-dha', name: 'Bangladesh', city: 'Dhaka', code: 'BD', flag: '🇧🇩', continent: 'Asia & Pacific', ping: 115, load: 38, ip: '103.134.88.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix BD'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'lk-col', name: 'Sri Lanka', city: 'Colombo', code: 'LK', flag: '🇱🇰', continent: 'Asia & Pacific', ping: 122, load: 24, ip: '103.115.24.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'np-ktm', name: 'Nepal', city: 'Kathmandu', code: 'NP', flag: '🇳🇵', continent: 'Asia & Pacific', ping: 118, load: 20, ip: '103.109.120.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'mn-uln', name: 'Mongolia', city: 'Ulaanbaatar', code: 'MN', flag: '🇲🇳', continent: 'Asia & Pacific', ping: 142, load: 12, ip: '103.143.40.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'kh-pnh', name: 'Cambodia', city: 'Phnom Penh', code: 'KH', flag: '🇰🇭', continent: 'Asia & Pacific', ping: 160, load: 17, ip: '103.197.104.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'la-vte', name: 'Laos', city: 'Vientiane', code: 'LA', flag: '🇱🇦', continent: 'Asia & Pacific', ping: 166, load: 11, ip: '103.208.232.1', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'bn-bsb', name: 'Brunei', city: 'Bandar Seri Begawan', code: 'BN', flag: '🇧🇳', continent: 'Asia & Pacific', ping: 154, load: 10, ip: '103.235.152.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'fj-suv', name: 'Fiji', city: 'Suva', code: 'FJ', flag: '🇫🇯', continent: 'Asia & Pacific', ping: 228, load: 8, ip: '103.250.60.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },

  // --- LATIN AMERICA ---
  { id: 'br-sao', name: 'Brazil', city: 'Sao Paulo', code: 'BR', flag: '🇧🇷', continent: 'Latin America', ping: 135, load: 56, ip: '177.54.144.12', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix BR', 'Globoplay', 'Disney+'], p2p: true, tor: true, unblockDiscord: true },
  { id: 'ar-bue', name: 'Argentina', city: 'Buenos Aires', code: 'AR', flag: '🇦🇷', continent: 'Latin America', ping: 148, load: 44, ip: '181.119.120.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix AR', 'Flow'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'cl-san', name: 'Chile', city: 'Santiago', code: 'CL', flag: '🇨🇱', continent: 'Latin America', ping: 142, load: 38, ip: '190.96.88.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix CL'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'co-bog', name: 'Colombia', city: 'Bogota', code: 'CO', flag: '🇨🇴', continent: 'Latin America', ping: 126, load: 42, ip: '190.144.200.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix CO', 'Caracol Play'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'pe-lim', name: 'Peru', city: 'Lima', code: 'PE', flag: '🇵🇪', continent: 'Latin America', ping: 139, load: 34, ip: '190.119.64.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix PE'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ec-qui', name: 'Ecuador', city: 'Quito', code: 'EC', flag: '🇪🇨', continent: 'Latin America', ping: 131, load: 22, ip: '190.57.140.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'uy-mvd', name: 'Uruguay', city: 'Montevideo', code: 'UY', flag: '🇺🇾', continent: 'Latin America', ping: 145, load: 19, ip: '186.54.200.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'py-asu', name: 'Paraguay', city: 'Asuncion', code: 'PY', flag: '🇵🇾', continent: 'Latin America', ping: 152, load: 18, ip: '181.124.90.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'bo-lpz', name: 'Bolivia', city: 'La Paz', code: 'BO', flag: '🇧🇴', continent: 'Latin America', ping: 147, load: 15, ip: '190.181.33.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 've-ccs', name: 'Venezuela', city: 'Caracas', code: 'VE', flag: '🇻🇪', continent: 'Latin America', ping: 138, load: 31, ip: '190.77.12.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },

  // --- MIDDLE EAST & AFRICA ---
  { id: 'tr-ist', name: 'Turkey', city: 'Istanbul', code: 'TR', flag: '🇹🇷', continent: 'Middle East & Africa', ping: 14, load: 48, ip: '185.148.140.22', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['Netflix TR', 'BluTV', 'Gain', 'Exxen'], p2p: true, tor: true, unblockDiscord: true, stealthOptimized: true, doubleHop: 'DE' },
  { id: 'tr-ank', name: 'Turkey', city: 'Ankara', code: 'TR', flag: '🇹🇷', continent: 'Middle East & Africa', ping: 16, load: 38, ip: '185.118.142.11', protocols: ['wireguard', 'stealth'], streaming: ['Netflix TR', 'Exxen'], p2p: true, tor: false, unblockDiscord: true, stealthOptimized: true },
  { id: 'tr-izm', name: 'Turkey', city: 'Izmir', code: 'TR', flag: '🇹🇷', continent: 'Middle East & Africa', ping: 15, load: 32, ip: '185.169.54.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix TR'], p2p: true, tor: false, unblockDiscord: true, stealthOptimized: true },
  { id: 'ae-dxb', name: 'United Arab Emirates', city: 'Dubai', code: 'AE', flag: '🇦🇪', continent: 'Middle East & Africa', ping: 68, load: 57, ip: '185.228.18.2', protocols: ['wireguard', 'stealth', 'tor'], streaming: ['OSN+', 'Shahid', 'Netflix'], p2p: true, tor: true, unblockDiscord: true, voipUnblock: true },
  { id: 'sa-riy', name: 'Saudi Arabia', city: 'Riyadh', code: 'SA', flag: '🇸🇦', continent: 'Middle East & Africa', ping: 72, load: 49, ip: '185.207.248.6', protocols: ['wireguard', 'stealth'], streaming: ['Shahid', 'Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'il-tlv', name: 'Israel', city: 'Tel Aviv', code: 'IL', flag: '🇮🇱', continent: 'Middle East & Africa', ping: 48, load: 40, ip: '185.229.226.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix IL', 'Kan 11'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'za-jnb', name: 'South Africa', city: 'Johannesburg', code: 'ZA', flag: '🇿🇦', continent: 'Middle East & Africa', ping: 140, load: 39, ip: '197.80.200.12', protocols: ['wireguard', 'stealth'], streaming: ['Netflix ZA', 'Showmax', 'DStv'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'za-cpt', name: 'South Africa', city: 'Cape Town', code: 'ZA', flag: '🇿🇦', continent: 'Middle East & Africa', ping: 144, load: 33, ip: '197.189.190.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix ZA', 'Showmax'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'eg-cai', name: 'Egypt', city: 'Cairo', code: 'EG', flag: '🇪🇬', continent: 'Middle East & Africa', ping: 56, load: 41, ip: '197.34.120.3', protocols: ['wireguard', 'stealth'], streaming: ['WatchIT', 'Shahid'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ng-los', name: 'Nigeria', city: 'Lagos', code: 'NG', flag: '🇳🇬', continent: 'Middle East & Africa', ping: 130, load: 36, ip: '102.164.12.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix NG'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ke-nbo', name: 'Kenya', city: 'Nairobi', code: 'KE', flag: '🇰🇪', continent: 'Middle East & Africa', ping: 120, load: 27, ip: '197.232.14.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix KE'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'ma-cas', name: 'Morocco', city: 'Casablanca', code: 'MA', flag: '🇲🇦', continent: 'Middle East & Africa', ping: 62, load: 29, ip: '196.120.45.2', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Shahid'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'qa-doh', name: 'Qatar', city: 'Doha', code: 'QA', flag: '🇶🇦', continent: 'Middle East & Africa', ping: 69, load: 34, ip: '185.183.104.9', protocols: ['wireguard', 'stealth'], streaming: ['beIN CONNECT', 'Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'kw-kwi', name: 'Kuwait', city: 'Kuwait City', code: 'KW', flag: '🇰🇼', continent: 'Middle East & Africa', ping: 71, load: 30, ip: '185.228.169.1', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Shahid'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'bh-man', name: 'Bahrain', city: 'Manama', code: 'BH', flag: '🇧🇭', continent: 'Middle East & Africa', ping: 70, load: 24, ip: '185.191.170.8', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'om-mct', name: 'Oman', city: 'Muscat', code: 'OM', flag: '🇴🇲', continent: 'Middle East & Africa', ping: 75, load: 22, ip: '185.216.141.5', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'jo-amm', name: 'Jordan', city: 'Amman', code: 'JO', flag: '🇯🇴', continent: 'Middle East & Africa', ping: 59, load: 25, ip: '185.225.18.3', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Shahid'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'lb-bey', name: 'Lebanon', city: 'Beirut', code: 'LB', flag: '🇱🇧', continent: 'Middle East & Africa', ping: 55, load: 28, ip: '185.244.24.7', protocols: ['wireguard', 'stealth'], streaming: ['Netflix', 'Shahid'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'gh-acc', name: 'Ghana', city: 'Accra', code: 'GH', flag: '🇬🇭', continent: 'Middle East & Africa', ping: 134, load: 20, ip: '102.176.80.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'tn-tun', name: 'Tunisia', city: 'Tunis', code: 'TN', flag: '🇹🇳', continent: 'Middle East & Africa', ping: 58, load: 22, ip: '197.1.18.9', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true },
  { id: 'dz-alg', name: 'Algeria', city: 'Algiers', code: 'DZ', flag: '🇩🇿', continent: 'Middle East & Africa', ping: 60, load: 26, ip: '197.112.5.4', protocols: ['wireguard', 'stealth'], streaming: ['Netflix'], p2p: true, tor: false, unblockDiscord: true }
];

// Helper to get total server count represented (over 1,200 physical edge clusters across 140+ countries)
export const TOTAL_EDGE_CLUSTERS = 1420;
export const TOTAL_COUNTRIES_COUNT = 142;

// Filter servers helper function
export function filterServers(servers, query = '', category = 'all', continent = 'all') {
  return servers.filter(server => {
    // Continent filter
    if (continent !== 'all' && continent !== 'All Locations' && server.continent !== continent) {
      return false;
    }

    // Category filter
    if (category === SERVER_CATEGORIES.FASTEST) {
      if (server.ping > 45) return false;
    } else if (category === SERVER_CATEGORIES.STREAMING) {
      if (!server.streaming || server.streaming.length === 0) return false;
    } else if (category === SERVER_CATEGORIES.GAMING_CENSORSHIP) {
      if (!server.unblockDiscord) return false;
    } else if (category === SERVER_CATEGORIES.TOR_ONION) {
      if (!server.tor) return false;
    } else if (category === SERVER_CATEGORIES.DOUBLE_HOP) {
      if (!server.doubleHop) return false;
    } else if (category === SERVER_CATEGORIES.P2P) {
      if (!server.p2p) return false;
    }

    // Search query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      const matchName = server.name.toLowerCase().includes(q);
      const matchCity = server.city.toLowerCase().includes(q);
      const matchCode = server.code.toLowerCase().includes(q);
      const matchStream = server.streaming ? server.streaming.some(s => s.toLowerCase().includes(q)) : false;
      return matchName || matchCity || matchCode || matchStream;
    }

    return true;
  });
}

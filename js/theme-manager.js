// GhostWire Cyber Theme Manager
// Manages live switching between Quantum Cyan, Matrix Green, OLED Crimson, and Onion Violet themes

export const THEMES = [
  { id: 'cyan', name: 'Kuantum Siber (Neon Mavi)', primary: '#00e5ff', secondary: '#00f59b' },
  { id: 'matrix', name: 'Matrix Siber (Terminal Yeşil)', primary: '#00ff66', secondary: '#00cc44' },
  { id: 'crimson', name: 'OLED Hayalet (Kan Kırmızı)', primary: '#ff2a5f', secondary: '#ff0055' },
  { id: 'violet', name: 'Onion Kuantum (Tor Moru)', primary: '#b362ff', secondary: '#ec4899' }
];

export class ThemeManager {
  constructor() {
    this.storageKey = 'ghostwire_active_theme';
    this.currentTheme = this.loadTheme();
    this.applyTheme(this.currentTheme);
  }

  loadTheme() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && THEMES.some(t => t.id === saved)) return saved;
    } catch (e) {}
    return 'cyan';
  }

  setTheme(themeId) {
    if (!THEMES.some(t => t.id === themeId)) return;
    this.currentTheme = themeId;
    try {
      localStorage.setItem(this.storageKey, themeId);
    } catch (e) {}
    this.applyTheme(themeId);
  }

  applyTheme(themeId) {
    if (themeId === 'cyan') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  }

  cycleTheme() {
    const idx = THEMES.findIndex(t => t.id === this.currentTheme);
    const nextIdx = (idx + 1) % THEMES.length;
    this.setTheme(THEMES[nextIdx].id);
    return THEMES[nextIdx];
  }
}

export const themeManager = new ThemeManager();

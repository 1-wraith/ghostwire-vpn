// GhostWire High-Precision Geographical World Map Visualizer
// Real Vector SVG Projection (180+ Countries) with Live Geodesic Laser Routing & Interactive Nodes

import { SVG_VIEWBOX, COUNTRY_CENTERS, WORLD_MAP_SVG_INNER } from './map-svg-data.js';
import { SERVERS_DATABASE } from './server-list.js';

export class MapRenderer {
  constructor(containerOrCanvas) {
    this.container = containerOrCanvas?.parentElement?.id === 'worldMapWrapper'
      ? containerOrCanvas.parentElement
      : (document.getElementById('worldMapWrapper') || containerOrCanvas?.parentElement || containerOrCanvas);

    this.svgElement = null;
    this.tooltipElement = null;
    this.animationId = null;
    this.pulsePhase = 0;
    this.connected = false;

    // Home Node: Turkey
    this.originCode = 'TR';
    this.originCenter = COUNTRY_CENTERS['tr'] || { cx: 485.5, cy: 428.4 };

    // Target Node: Defaults to Iceland or first server
    this.targetCode = 'IS';
    this.targetCenter = COUNTRY_CENTERS['is'] || { cx: 370.3, cy: 346.1 };
    this.targetServer = SERVERS_DATABASE.find(s => s.code === 'IS') || SERVERS_DATABASE[0];

    this.onNodeSelected = null;
    this.hoveredCountry = null;

    // Major global relay hubs to display as ambient node pins
    this.hubCodes = ['de', 'nl', 'gb', 'ch', 'se', 'us', 'jp', 'sg', 'au', 'ae', 'br', 'za'];

    window.addEventListener('map:select', (e) => {
      const code = e.detail;
      const server = this.getServerInfo(code);
      this.setTargetNode(code);
      if (this.onNodeSelected) {
        this.onNodeSelected(server);
      }
    });

    this.initSvgMap();
  }

  initSvgMap() {
    if (!this.container) return;

    // Check or create map container
    let mapDiv = document.getElementById('worldMapContainer');
    if (!mapDiv) {
      mapDiv = document.createElement('div');
      mapDiv.id = 'worldMapContainer';
      mapDiv.className = 'world-map-svg-container';
      this.container.prepend(mapDiv);
    }

    // Check or create tooltip
    this.tooltipElement = document.getElementById('mapTooltip');
    if (!this.tooltipElement) {
      this.tooltipElement = document.createElement('div');
      this.tooltipElement.id = 'mapTooltip';
      this.tooltipElement.className = 'map-cyber-tooltip';
      this.tooltipElement.style.display = 'none';
      this.container.appendChild(this.tooltipElement);
    }

    // Hide old canvas if present
    const oldCanvas = document.getElementById('worldMapCanvas');
    if (oldCanvas) {
      oldCanvas.style.display = 'none';
    }

    // Build SVG markup with cyber filters, background grid, real countries, laser layer and pins
    mapDiv.innerHTML = `
      <svg id="cyberWorldMapSvg" class="cyber-world-map-svg" viewBox="${SVG_VIEWBOX}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Cyber Cyan & Emerald Glow Filters -->
          <filter id="neonGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonGlowEmerald" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Laser Beam Gradient -->
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00e5ff" stop-opacity="1" />
            <stop offset="60%" stop-color="#00f59b" stop-opacity="1" />
            <stop offset="100%" stop-color="#00f59b" stop-opacity="1" />
          </linearGradient>
        </defs>

        <!-- 1. Coordinate Grid Layer (Cyber Meridians & Parallels) -->
        <g id="mapGridLayer" class="map-grid-layer">
          <!-- Meridians -->
          <line x1="140" y1="240" x2="140" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="240" y1="240" x2="240" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="340" y1="240" x2="340" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="440" y1="240" x2="440" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="540" y1="240" x2="540" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="640" y1="240" x2="640" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="740" y1="240" x2="740" y2="700" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />

          <!-- Parallels -->
          <line x1="30" y1="300" x2="820" y2="300" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="30" y1="380" x2="820" y2="380" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="30" y1="460" x2="820" y2="460" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="30" y1="540" x2="820" y2="540" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />
          <line x1="30" y1="620" x2="820" y2="620" stroke="rgba(0, 229, 255, 0.04)" stroke-width="1" />

          <!-- Equator (Dashed cyan) -->
          <line x1="30" y1="525" x2="820" y2="525" stroke="rgba(0, 229, 255, 0.09)" stroke-width="1" stroke-dasharray="4, 6" />
        </g>

        <!-- 2. Real Vector Country Paths (180+ Countries) -->
        <g id="mapCountryLayer" class="map-country-layer">
          ${WORLD_MAP_SVG_INNER}
        </g>

        <!-- 3. Geodesic Laser Tunnel Layer -->
        <g id="mapLaserLayer" class="map-laser-layer">
          <!-- Background glow track -->
          <path id="laserArcGlow" class="laser-arc-glow" fill="none" stroke="rgba(0, 229, 255, 0.15)" stroke-width="5" />
          <!-- Main Laser Arc -->
          <path id="laserArcMain" class="laser-arc-main" fill="none" stroke="rgba(0, 229, 255, 0.45)" stroke-width="2" stroke-dasharray="4, 4" />
          <!-- Active animated packet pulse -->
          <circle id="laserPulsePacket" r="4.5" fill="#00f59b" filter="url(#neonGlowEmerald)" style="display: none;" />
        </g>

        <!-- 4. Dynamic Interactive Server Nodes & Beacons -->
        <g id="mapNodesLayer" class="map-nodes-layer"></g>
      </svg>
    `;

    this.svgElement = document.getElementById('cyberWorldMapSvg');
    this.setupInteractivity();
    this.renderNodes();
    this.updateRoute();
  }

  setupInteractivity() {
    if (!this.svgElement) return;

    const countriesLayer = document.getElementById('mapCountryLayer');
    if (!countriesLayer) return;

    // Apply classes to all paths/groups
    const elements = countriesLayer.querySelectorAll('path, g');
    elements.forEach(el => {
      const id = el.id?.toLowerCase();
      if (id && id.length === 2) {
        el.classList.add('map-country-path');
        el.setAttribute('data-country-code', id.toUpperCase());

        el.addEventListener('mouseenter', (e) => this.handleCountryHover(e, id.toUpperCase()));
        el.addEventListener('mousemove', (e) => this.handleCountryMove(e));
        el.addEventListener('mouseleave', () => this.handleCountryLeave());
        el.addEventListener('click', () => this.handleCountryClick(id.toUpperCase()));
      }
    });

    // Tooltip hide on mouseleave container
    this.container.addEventListener('mouseleave', () => this.handleCountryLeave());
  }

  getServerInfo(countryCode) {
    return SERVERS_DATABASE.find(s => s.code.toUpperCase() === countryCode.toUpperCase()) || {
      name: countryCode,
      code: countryCode,
      flag: '🌐',
      city: 'GhostWire Relay Node',
      ping: Math.floor(20 + Math.random() * 35)
    };
  }

  handleCountryHover(e, countryCode) {
    const server = this.getServerInfo(countryCode);
    this.hoveredCountry = server;

    if (this.tooltipElement) {
      const isTarget = server.code === this.targetCode;
      const isHome = server.code === this.originCode;

      this.tooltipElement.innerHTML = `
        <span style="font-size: 16px; line-height: 1;">${server.flag || '🌐'}</span>
        <div>
          <div style="font-weight: 700; color: #fff;">${server.name} <span style="font-size: 10px; color: var(--cyan-stealth);">(${server.code})</span></div>
          <div style="font-size: 10px; color: var(--text-muted);">${server.city || 'Tünel Düğümü'} • <span style="color: var(--emerald-safe); font-family: var(--font-mono);">⚡ ${server.ping} ms</span></div>
        </div>
        <div style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: rgba(0, 229, 255, 0.15); color: var(--cyan-stealth); margin-left: 4px;">
          ${isHome ? 'EV AĞI' : (isTarget ? 'AKTİF TÜNEL' : 'TIKLA & BAĞLAN')}
        </div>
      `;
      this.tooltipElement.style.display = 'flex';
      this.positionTooltip(e);
    }
  }

  handleCountryMove(e) {
    this.positionTooltip(e);
  }

  positionTooltip(e) {
    if (!this.tooltipElement || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Keep within bounds
    const clampedX = Math.max(80, Math.min(rect.width - 80, x));
    const clampedY = Math.max(30, y);

    this.tooltipElement.style.left = `${clampedX}px`;
    this.tooltipElement.style.top = `${clampedY}px`;
  }

  handleCountryLeave() {
    this.hoveredCountry = null;
    if (this.tooltipElement) {
      this.tooltipElement.style.display = 'none';
    }
  }

  handleCountryClick(countryCode) {
    if (countryCode === this.originCode) return; // Ignore home click

    const server = this.getServerInfo(countryCode);
    this.setTargetNode(countryCode);

    if (this.onNodeSelected) {
      this.onNodeSelected(server);
    }
  }

  setTargetNode(countryCode) {
    const code = countryCode.toUpperCase();
    this.targetCode = code;
    this.targetServer = this.getServerInfo(code);

    const center = COUNTRY_CENTERS[code.toLowerCase()];
    if (center) {
      this.targetCenter = center;
    }

    this.updateRoute();
    this.renderNodes();
  }

  setConnectionState(isConnected) {
    this.connected = isConnected;
    this.updateRoute();
  }

  updateRoute() {
    if (!this.svgElement) return;

    const arcMain = document.getElementById('laserArcMain');
    const arcGlow = document.getElementById('laserArcGlow');
    const pulsePacket = document.getElementById('laserPulsePacket');
    const countriesLayer = document.getElementById('mapCountryLayer');

    // Update active highlight classes on SVG countries
    if (countriesLayer) {
      countriesLayer.querySelectorAll('.country-home, .country-target').forEach(el => {
        el.classList.remove('country-home', 'country-target');
      });

      const homeEl = countriesLayer.querySelector(`[id="${this.originCode.toLowerCase()}"]`);
      if (homeEl) homeEl.classList.add('country-home');

      const targetEl = countriesLayer.querySelector(`[id="${this.targetCode.toLowerCase()}"]`);
      if (targetEl) targetEl.classList.add('country-target');
    }

    if (!arcMain || !arcGlow) return;

    const p1 = this.originCenter;
    const p2 = this.targetCenter;

    // Calculate Geodesic Arching Bezier curve
    const dx = p2.cx - p1.cx;
    const dy = p2.cy - p1.cy;
    const dist = Math.hypot(dx, dy);

    const midX = (p1.cx + p2.cx) / 2;
    // Arch upward proportional to distance
    const archHeight = Math.max(30, Math.min(85, dist * 0.28));
    const midY = Math.min(p1.cy, p2.cy) - archHeight;

    const d = `M ${p1.cx} ${p1.cy} Q ${midX} ${midY} ${p2.cx} ${p2.cy}`;
    arcMain.setAttribute('d', d);
    arcGlow.setAttribute('d', d);

    if (this.connected) {
      arcMain.setAttribute('stroke', 'url(#laserBeamGrad)');
      arcMain.setAttribute('stroke-width', '2.5');
      arcMain.setAttribute('stroke-dasharray', '8, 4');
      arcMain.classList.add('laser-arc-active');
      arcGlow.style.display = 'block';
      if (pulsePacket) pulsePacket.style.display = 'block';
    } else {
      arcMain.setAttribute('stroke', 'rgba(0, 229, 255, 0.45)');
      arcMain.setAttribute('stroke-width', '1.8');
      arcMain.setAttribute('stroke-dasharray', '4, 4');
      arcMain.classList.remove('laser-arc-active');
      arcGlow.style.display = 'none';
      if (pulsePacket) pulsePacket.style.display = 'none';
    }

    // Cache curve params for packet animation
    this.curveParams = { p1, mid: { x: midX, y: midY }, p2 };
  }

  renderNodes() {
    const nodesLayer = document.getElementById('mapNodesLayer');
    if (!nodesLayer) return;

    let html = '';

    // 1. Ambient Relay Node Pins
    for (const hubCode of this.hubCodes) {
      if (hubCode.toUpperCase() === this.originCode || hubCode.toUpperCase() === this.targetCode) continue;
      const c = COUNTRY_CENTERS[hubCode];
      if (!c) continue;

      html += `
        <g class="relay-node-group" style="cursor: pointer;" onclick="document.dispatchEvent(new CustomEvent('map:select', {detail: '${hubCode.toUpperCase()}'}))">
          <circle cx="${c.cx}" cy="${c.cy}" r="2" fill="rgba(255, 255, 255, 0.4)" />
          <circle cx="${c.cx}" cy="${c.cy}" r="5" fill="none" stroke="rgba(0, 229, 255, 0.15)" stroke-width="0.8" />
        </g>
      `;
    }

    // 2. Home Node: Turkey (Cyan Radar Pulse)
    const tr = this.originCenter;
    html += `
      <g id="nodeHomeTR" class="node-home-group">
        <circle cx="${tr.cx}" cy="${tr.cy}" r="14" fill="none" stroke="rgba(0, 229, 255, 0.25)" stroke-width="1" class="radar-pulse-ring" />
        <circle cx="${tr.cx}" cy="${tr.cy}" r="7" fill="rgba(0, 229, 255, 0.2)" stroke="#00e5ff" stroke-width="1.2" />
        <circle cx="${tr.cx}" cy="${tr.cy}" r="3" fill="#00e5ff" filter="url(#neonGlowCyan)" />
        <text x="${tr.cx + 9}" y="${tr.cy + 3}" fill="#00e5ff" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" letter-spacing="0.5">TR</text>
      </g>
    `;

    // 3. Target Node: Active VPN Exit (Emerald Radar Pulse)
    const tgt = this.targetCenter;
    const tgtColor = this.connected ? '#00f59b' : '#00e5ff';
    const tgtGlow = this.connected ? 'url(#neonGlowEmerald)' : 'url(#neonGlowCyan)';

    html += `
      <g id="nodeTargetCurrent" class="node-target-group">
        <circle cx="${tgt.cx}" cy="${tgt.cy}" r="18" fill="none" stroke="${tgtColor}" stroke-width="1.2" opacity="0.35" class="radar-pulse-ring-tgt" />
        <circle cx="${tgt.cx}" cy="${tgt.cy}" r="9" fill="rgba(0, 245, 155, 0.2)" stroke="${tgtColor}" stroke-width="1.5" />
        <circle cx="${tgt.cx}" cy="${tgt.cy}" r="3.8" fill="${tgtColor}" filter="${tgtGlow}" />
        <text x="${tgt.cx + 10}" y="${tgt.cy + 3.5}" fill="${tgtColor}" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" letter-spacing="0.5">${this.targetCode}</text>
      </g>
    `;

    nodesLayer.innerHTML = html;
  }

  start() {
    const loop = () => {
      this.pulsePhase += 0.02;
      this.animatePacket();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animatePacket() {
    if (!this.connected || !this.curveParams) return;

    const pulsePacket = document.getElementById('laserPulsePacket');
    if (!pulsePacket) return;

    const { p1, mid, p2 } = this.curveParams;
    const t = (this.pulsePhase * 0.8) % 1;

    // Quadratic bezier curve interpolation: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
    const px = (1 - t) * (1 - t) * p1.cx + 2 * (1 - t) * t * mid.x + t * t * p2.cx;
    const py = (1 - t) * (1 - t) * p1.cy + 2 * (1 - t) * t * mid.y + t * t * p2.cy;

    pulsePacket.setAttribute('cx', px.toFixed(1));
    pulsePacket.setAttribute('cy', py.toFixed(1));
  }
}

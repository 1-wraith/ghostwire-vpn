// GhostWire High-Fidelity Cyber World Map Visualizer
// Real Geographic Continent Coordinates & Live Geodesic Animated Routing

export class MapRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.animationId = null;
    this.pulsePhase = 0;
    this.hoveredNode = null;

    // Real Geographic Nodes (Lat, Lon)
    this.worldNodes = [
      { id: 'tr-ist', name: 'Türkiye (İstanbul)', code: 'TR', flag: '🇹🇷', lat: 41.0, lon: 28.9, isHome: true },
      { id: 'tr-ank', name: 'Türkiye (Ankara)', code: 'TR', flag: '🇹🇷', lat: 39.9, lon: 32.8 },
      { id: 'is-rey', name: 'İzlanda (Reykjavik)', code: 'IS', flag: '🇮🇸', lat: 64.1, lon: -21.9 },
      { id: 'ch-zur', name: 'İsviçre (Zürih)', code: 'CH', flag: '🇨🇭', lat: 47.3, lon: 8.5 },
      { id: 'de-fra', name: 'Almanya (Frankfurt)', code: 'DE', flag: '🇩🇪', lat: 50.1, lon: 8.6 },
      { id: 'nl-ams', name: 'Hollanda (Amsterdam)', code: 'NL', flag: '🇳🇱', lat: 52.3, lon: 4.9 },
      { id: 'gb-lon', name: 'Birleşik Krallık (Londra)', code: 'GB', flag: '🇬🇧', lat: 51.5, lon: -0.1 },
      { id: 'se-sto', name: 'İsveç (Stockholm)', code: 'SE', flag: '🇸🇪', lat: 59.3, lon: 18.0 },
      { id: 'us-nyc', name: 'ABD (New York)', code: 'US', flag: '🇺🇸', lat: 40.7, lon: -74.0 },
      { id: 'us-lax', name: 'ABD (Los Angeles)', code: 'US', flag: '🇺🇸', lat: 34.0, lon: -118.2 },
      { id: 'ca-tor', name: 'Kanada (Toronto)', code: 'CA', flag: '🇨🇦', lat: 43.6, lon: -79.3 },
      { id: 'jp-tok', name: 'Japonya (Tokyo)', code: 'JP', flag: '🇯🇵', lat: 35.6, lon: 139.6 },
      { id: 'sg-sin', name: 'Singapur', code: 'SG', flag: '🇸🇬', lat: 1.3, lon: 103.8 },
      { id: 'au-syd', name: 'Avustralya (Sidney)', code: 'AU', flag: '🇦🇺', lat: -33.8, lon: 151.2 },
      { id: 'ae-dxb', name: 'BAE (Dubai)', code: 'AE', flag: '🇦🇪', lat: 25.2, lon: 55.2 },
      { id: 'br-sao', name: 'Brezilya (Sao Paulo)', code: 'BR', flag: '🇧🇷', lat: -23.5, lon: -46.6 },
      { id: 'za-jnb', name: 'Güney Afrika (Johannesburg)', code: 'ZA', flag: '🇿🇦', lat: -26.2, lon: 28.0 }
    ];

    // High-Resolution Normalized Continent Outlines (Real Earth Geography)
    this.continents = [
      // North America
      [
        [-168, 65], [-160, 71], [-130, 70], [-90, 73], [-80, 62], [-65, 60], [-55, 48],
        [-65, 43], [-75, 35], [-80, 25], [-97, 26], [-90, 20], [-80, 8], [-77, 7],
        [-83, 10], [-92, 16], [-105, 20], [-115, 30], [-124, 40], [-124, 48], [-135, 57],
        [-160, 56], [-165, 60], [-168, 65]
      ],
      // Greenland
      [
        [-50, 83], [-20, 82], [-20, 70], [-40, 60], [-55, 60], [-55, 78], [-50, 83]
      ],
      // South America
      [
        [-77, 8], [-60, 8], [-50, 0], [-35, -5], [-35, -10], [-40, -22], [-50, -30],
        [-55, -40], [-65, -55], [-72, -53], [-75, -45], [-72, -30], [-78, -10], [-80, -2],
        [-77, 8]
      ],
      // Europe
      [
        [-9, 36], [-9, 43], [-2, 47], [-5, 48], [2, 51], [8, 54], [10, 57],
        [15, 55], [25, 60], [30, 70], [40, 67], [60, 67], [60, 50], [40, 45],
        [30, 40], [25, 35], [15, 38], [0, 38], [-9, 36]
      ],
      // British Isles
      [
        [-5, 50], [1, 52], [0, 58], [-5, 58], [-6, 54], [-5, 50]
      ],
      // Scandinavia
      [
        [5, 58], [10, 64], [18, 70], [28, 71], [30, 65], [22, 60], [12, 56], [5, 58]
      ],
      // Africa
      [
        [-17, 15], [-17, 25], [-5, 36], [10, 37], [25, 32], [32, 31], [35, 27],
        [43, 12], [51, 12], [45, 0], [40, -10], [35, -25], [28, -34], [18, -34],
        [12, -18], [9, 4], [0, 6], [-10, 5], [-15, 12], [-17, 15]
      ],
      // Asia
      [
        [40, 45], [50, 40], [60, 25], [75, 20], [80, 10], [85, 20], [90, 22],
        [100, 18], [105, 10], [108, 15], [120, 23], [122, 30], [122, 38], [130, 42],
        [140, 48], [145, 58], [170, 65], [178, 67], [170, 70], [140, 73], [100, 77],
        [80, 73], [60, 68], [60, 50], [40, 45]
      ],
      // Japan
      [
        [130, 32], [136, 35], [141, 38], [144, 44], [141, 44], [136, 38], [130, 32]
      ],
      // Australia
      [
        [114, -22], [115, -34], [130, -32], [138, -35], [148, -38], [152, -28],
        [148, -20], [142, -11], [132, -12], [128, -18], [114, -22]
      ]
    ];

    this.origin = this.worldNodes.find(n => n.code === 'TR') || this.worldNodes[0];
    this.target = this.worldNodes.find(n => n.code === 'IS') || this.worldNodes[2];
    this.connected = false;

    this.onNodeSelected = null;
    this.initInteraction();
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.initInteraction();
  }

  geoToPixel(lon, lat, width, height) {
    // Equirectangular projection with margin adjustment
    const padX = 24;
    const padY = 16;
    const w = width - padX * 2;
    const h = height - padY * 2;

    const x = padX + ((lon + 180) / 360) * w;
    // Latitude clamped to -60..85 degrees
    const clampedLat = Math.max(-60, Math.min(82, lat));
    const y = padY + ((85 - clampedLat) / 145) * h;

    return { x, y };
  }

  initInteraction() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (const node of this.worldNodes) {
        const p = this.geoToPixel(node.lon, node.lat, this.canvas.width, this.canvas.height);
        const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (dist < 14) {
          found = node;
          break;
        }
      }

      this.hoveredNode = found;
      this.canvas.style.cursor = found ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredNode && this.onNodeSelected) {
        this.setTargetNode(this.hoveredNode.code);
        this.onNodeSelected(this.hoveredNode);
      }
    });
  }

  setTargetNode(countryCode) {
    const found = this.worldNodes.find(n => n.code === countryCode);
    if (found) {
      this.target = found;
    }
  }

  setConnectionState(isConnected) {
    this.connected = isConnected;
  }

  start() {
    const loop = () => {
      this.pulsePhase += 0.025;
      this.render();
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

  render() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width = this.canvas.parentElement.clientWidth || 700;
    const height = this.canvas.height = this.canvas.parentElement.clientHeight || 260;

    this.ctx.clearRect(0, 0, width, height);

    // 1. Draw Subtle Cyber Coordinate Grid
    this.drawCoordinateGrid(width, height);

    // 2. Draw Real Geographic Continents (Fill & Border)
    this.drawContinents(width, height);

    // 3. Draw Active Geodesic Routing Arc
    this.drawRoutingArc(width, height);

    // 4. Draw Server Nodes with Neon Halos
    this.drawNodes(width, height);

    // 5. Draw Tooltip if hovering over a node
    if (this.hoveredNode) {
      this.drawTooltip(this.hoveredNode, width, height);
    }
  }

  drawCoordinateGrid(width, height) {
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.035)';
    this.ctx.lineWidth = 1;

    // Longitudinal meridians
    for (let lon = -180; lon <= 180; lon += 45) {
      const p1 = this.geoToPixel(lon, 80, width, height);
      const p2 = this.geoToPixel(lon, -60, width, height);
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, 0);
      this.ctx.lineTo(p2.x, height);
      this.ctx.stroke();
    }

    // Latitudinal parallels
    for (let lat = -45; lat <= 75; lat += 30) {
      const p1 = this.geoToPixel(-180, lat, width, height);
      this.ctx.beginPath();
      this.ctx.moveTo(0, p1.y);
      this.ctx.lineTo(width, p1.y);
      this.ctx.stroke();
    }

    // Equator Line (Subtle Cyan Marker)
    const eq = this.geoToPixel(0, 0, width, height);
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    this.ctx.setLineDash([3, 6]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, eq.y);
    this.ctx.lineTo(width, eq.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawContinents(width, height) {
    for (const polygon of this.continents) {
      if (polygon.length < 3) continue;

      this.ctx.beginPath();
      const first = this.geoToPixel(polygon[0][0], polygon[0][1], width, height);
      this.ctx.moveTo(first.x, first.y);

      for (let i = 1; i < polygon.length; i++) {
        const pt = this.geoToPixel(polygon[i][0], polygon[i][1], width, height);
        this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.closePath();

      // Continent Landmass styling: Glass slate body with glowing border
      this.ctx.fillStyle = 'rgba(16, 26, 48, 0.55)';
      this.ctx.fill();

      this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.22)';
      this.ctx.lineWidth = 1.2;
      this.ctx.shadowColor = 'rgba(0, 229, 255, 0.15)';
      this.ctx.shadowBlur = 4;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }
  }

  drawRoutingArc(width, height) {
    const p1 = this.geoToPixel(this.origin.lon, this.origin.lat, width, height);
    const p2 = this.geoToPixel(this.target.lon, this.target.lat, width, height);

    // Control point arching upwards
    const midX = (p1.x + p2.x) / 2;
    const midY = Math.min(p1.y, p2.y) - 45;

    // Glowing Arc Path
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
    this.ctx.strokeStyle = this.connected ? 'rgba(0, 245, 155, 0.65)' : 'rgba(0, 229, 255, 0.45)';
    this.ctx.lineWidth = this.connected ? 2.5 : 1.5;
    this.ctx.setLineDash([5, 5]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Animated Flying Packet Pulse along Arc
    if (this.connected) {
      const t = (this.pulsePhase * 0.9) % 1;
      const px = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
      const py = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00f59b';
      this.ctx.shadowColor = '#00f59b';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  drawNodes(width, height) {
    for (const node of this.worldNodes) {
      const p = this.geoToPixel(node.lon, node.lat, width, height);
      const isTarget = node.code === this.target.code;
      const isHome = node.code === this.origin.code;

      const color = isTarget 
        ? (this.connected ? '#00f59b' : '#00e5ff') 
        : isHome 
          ? '#00e5ff' 
          : 'rgba(255, 255, 255, 0.5)';

      // Outer Halo for active nodes
      if (isTarget || isHome) {
        const pulseR = 7 + (Math.sin(this.pulsePhase * 3) + 1) * 4;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        this.ctx.strokeStyle = isTarget ? (this.connected ? 'rgba(0, 245, 155, 0.4)' : 'rgba(0, 229, 255, 0.4)') : 'rgba(0, 229, 255, 0.3)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }

      // Center Node Dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, isTarget || isHome ? 4 : 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = isTarget ? 10 : 4;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Small Country Code Label next to major nodes
      if (isTarget || isHome) {
        this.ctx.fillStyle = color;
        this.ctx.font = '600 10px JetBrains Mono';
        this.ctx.fillText(node.code, p.x + 8, p.y + 3);
      }
    }
  }

  drawTooltip(node, width, height) {
    const p = this.geoToPixel(node.lon, node.lat, width, height);
    const text = `${node.flag} ${node.name}`;

    this.ctx.font = '600 11px Outfit, sans-serif';
    const textW = this.ctx.measureText(text).width;
    const boxW = textW + 16;
    const boxH = 24;

    const boxX = Math.max(10, Math.min(width - boxW - 10, p.x - boxW / 2));
    const boxY = p.y - 34;

    // Tooltip Bubble
    this.ctx.fillStyle = 'rgba(6, 10, 20, 0.92)';
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxW, boxH, 6);
    this.ctx.fill();
    this.ctx.stroke();

    // Tooltip Text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(text, boxX + 8, boxY + 16);
  }
}

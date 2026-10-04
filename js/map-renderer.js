// GhostWire Interactive Cyber World Map Visualizer
// Canvas-based real-time node network with animated geodesic routing arcs & packet pulses

export class MapRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.animationId = null;
    this.pulsePhase = 0;

    // Default origin (client virtual point, e.g. Istanbul/Frankfurt/New York)
    this.origin = { x: 0.55, y: 0.38, name: 'Local Gateway' };
    this.target = { x: 0.49, y: 0.28, name: 'Iceland (Reykjavik)' }; // Default node
    this.connected = false;

    // Major node coordinates on normalized 0..1 scale
    this.worldNodes = [
      { id: 'is-rey', x: 0.46, y: 0.22, name: 'Iceland', code: 'IS' },
      { id: 'ch-zur', x: 0.51, y: 0.33, name: 'Switzerland', code: 'CH' },
      { id: 'de-fra', x: 0.52, y: 0.31, name: 'Germany', code: 'DE' },
      { id: 'nl-ams', x: 0.50, y: 0.30, name: 'Netherlands', code: 'NL' },
      { id: 'se-sto', x: 0.54, y: 0.24, name: 'Sweden', code: 'SE' },
      { id: 'gb-lon', x: 0.48, y: 0.30, name: 'United Kingdom', code: 'GB' },
      { id: 'tr-ist', x: 0.56, y: 0.37, name: 'Turkey', code: 'TR' },
      { id: 'us-nyc', x: 0.28, y: 0.35, name: 'United States (NY)', code: 'US' },
      { id: 'us-lax', x: 0.18, y: 0.39, name: 'United States (LA)', code: 'US' },
      { id: 'ca-tor', x: 0.27, y: 0.32, name: 'Canada', code: 'CA' },
      { id: 'br-sao', x: 0.34, y: 0.69, name: 'Brazil', code: 'BR' },
      { id: 'jp-tok', x: 0.85, y: 0.38, name: 'Japan', code: 'JP' },
      { id: 'sg-sin', x: 0.77, y: 0.56, name: 'Singapore', code: 'SG' },
      { id: 'au-syd', x: 0.87, y: 0.74, name: 'Australia', code: 'AU' },
      { id: 'ae-dxb', x: 0.62, y: 0.43, name: 'UAE (Dubai)', code: 'AE' },
      { id: 'za-jnb', x: 0.56, y: 0.71, name: 'South Africa', code: 'ZA' },
      { id: 'in-mum', x: 0.68, y: 0.46, name: 'India', code: 'IN' },
      { id: 'kr-seo', x: 0.82, y: 0.37, name: 'South Korea', code: 'KR' }
    ];

    this.onNodeSelected = null;
    this.initInteraction();
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.initInteraction();
  }

  initInteraction() {
    if (!this.canvas) return;
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;

      // Find closest node
      let closest = null;
      let minDistance = 0.05;

      for (const node of this.worldNodes) {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          closest = node;
        }
      }

      if (closest && this.onNodeSelected) {
        this.setTargetNode(closest.code);
        this.onNodeSelected(closest);
      }
    });
  }

  setTargetNode(countryCode) {
    const found = this.worldNodes.find(n => n.code === countryCode);
    if (found) {
      this.target = { x: found.x, y: found.y, name: found.name };
    } else {
      // Approximate fallback coordinate
      this.target = { x: 0.50, y: 0.30, name: countryCode };
    }
  }

  setConnectionState(isConnected) {
    this.connected = isConnected;
  }

  start() {
    const loop = () => {
      this.pulsePhase += 0.03;
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

    const width = this.canvas.width = this.canvas.parentElement.clientWidth || 600;
    const height = this.canvas.height = this.canvas.parentElement.clientHeight || 280;

    this.ctx.clearRect(0, 0, width, height);

    // 1. Draw subtle background cyber grid
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    this.ctx.lineWidth = 1;
    const gridSize = 32;

    for (let x = 0; x < width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // 2. Draw continent abstract point-cloud silhouettes
    this.drawContinentSilhouettes(width, height);

    // 3. Draw connection arc if connected or routing
    if (this.connected || this.pulsePhase % 2 > 0) {
      this.drawRoutingArc(width, height);
    }

    // 4. Draw edge nodes
    for (const node of this.worldNodes) {
      const nx = node.x * width;
      const ny = node.y * height;
      const isTarget = Math.abs(node.x - this.target.x) < 0.02 && Math.abs(node.y - this.target.y) < 0.02;

      // Glow circle
      this.ctx.beginPath();
      this.ctx.arc(nx, ny, isTarget ? 5 : 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = isTarget ? (this.connected ? '#00f59b' : '#00e5ff') : 'rgba(255, 255, 255, 0.35)';
      this.ctx.shadowColor = isTarget ? (this.connected ? '#00f59b' : '#00e5ff') : 'transparent';
      this.ctx.shadowBlur = isTarget ? 14 : 0;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (isTarget) {
        // Pulsing radar ring around active target
        const ringRadius = 6 + (Math.sin(this.pulsePhase * 3) + 1) * 6;
        this.ctx.beginPath();
        this.ctx.arc(nx, ny, ringRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.connected ? 'rgba(0, 245, 155, 0.5)' : 'rgba(0, 229, 255, 0.5)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    }
  }

  drawRoutingArc(width, height) {
    const x1 = this.origin.x * width;
    const y1 = this.origin.y * height;
    const x2 = this.target.x * width;
    const y2 = this.target.y * height;

    // Control point arching upwards
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - 45;

    // Base arc
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(midX, midY, x2, y2);
    this.ctx.strokeStyle = this.connected ? 'rgba(0, 245, 155, 0.4)' : 'rgba(0, 229, 255, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Animated packet pulse travelling along the quadratic curve
    if (this.connected) {
      const t = (this.pulsePhase * 0.8) % 1;
      const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
      const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00f59b';
      this.ctx.shadowColor = '#00f59b';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  drawContinentSilhouettes(width, height) {
    // Elegant stylized dot-matrix continent anchors
    const clusters = [
      // North America
      { x: 0.22, y: 0.32, w: 0.12, h: 0.12, density: 16 },
      // South America
      { x: 0.33, y: 0.62, w: 0.08, h: 0.15, density: 12 },
      // Europe
      { x: 0.50, y: 0.30, w: 0.09, h: 0.10, density: 18 },
      // Africa
      { x: 0.53, y: 0.55, w: 0.10, h: 0.18, density: 16 },
      // Asia
      { x: 0.72, y: 0.36, w: 0.18, h: 0.18, density: 24 },
      // Australia
      { x: 0.85, y: 0.72, w: 0.09, h: 0.09, density: 10 }
    ];

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for (const c of clusters) {
      for (let i = 0; i < c.density; i++) {
        // Deterministic pseudo-random placement
        const seed = (i * 9301 + 49297) % 233280;
        const rndX = (seed / 233280);
        const rndY = ((seed * 1.618) % 1);

        const px = (c.x + (rndX - 0.5) * c.w) * width;
        const py = (c.y + (rndY - 0.5) * c.h) * height;

        this.ctx.fillRect(px, py, 2, 2);
      }
    }
  }
}

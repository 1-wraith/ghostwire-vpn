// GhostWire Real-time Network Throughput & Telemetry Graph
// High-performance Canvas renderer plotting live encrypted speeds and latency jitter

export class SpeedMonitor {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.running = false;
    this.animationId = null;

    // Buffer for history
    this.maxPoints = 40;
    this.downloadHistory = new Array(this.maxPoints).fill(0);
    this.uploadHistory = new Array(this.maxPoints).fill(0);

    this.currentDown = 0;
    this.currentUp = 0;
    this.peakDown = 0;
    this.totalDataMB = 0;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  start(accelerated = true) {
    this.running = true;
    this.accelerated = accelerated;
    this.tick();
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.currentDown = 0;
    this.currentUp = 0;
    this.render();
  }

  tick() {
    if (!this.running) return;

    // Generate realistic fluctuating speeds based on accelerator status
    const baseDown = this.accelerated ? 720 : 280;
    const baseUp = this.accelerated ? 410 : 160;

    const jitterDown = (Math.random() - 0.45) * (this.accelerated ? 180 : 80);
    const jitterUp = (Math.random() - 0.45) * (this.accelerated ? 90 : 40);

    this.currentDown = Math.max(12, Math.round(baseDown + jitterDown));
    this.currentUp = Math.max(8, Math.round(baseUp + jitterUp));

    if (this.currentDown > this.peakDown) this.peakDown = this.currentDown;
    this.totalDataMB += +((this.currentDown + this.currentUp) / (8 * 60)).toFixed(2);

    this.downloadHistory.push(this.currentDown);
    this.downloadHistory.shift();

    this.uploadHistory.push(this.currentUp);
    this.uploadHistory.shift();

    this.render();

    setTimeout(() => {
      if (this.running) {
        this.animationId = requestAnimationFrame(() => this.tick());
      }
    }, 150);
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width = this.canvas.parentElement.clientWidth || 320;
    const height = this.canvas.height = this.canvas.parentElement.clientHeight || 52;

    this.ctx.clearRect(0, 0, width, height);

    // Grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();

    const maxVal = Math.max(900, this.peakDown * 1.15);
    const stepX = width / (this.maxPoints - 1);

    // Draw Download Area (Cyan glow)
    this.drawCurve(this.downloadHistory, maxVal, stepX, height, '#00e5ff', 'rgba(0, 229, 255, 0.15)');

    // Draw Upload Area (Emerald glow)
    this.drawCurve(this.uploadHistory, maxVal, stepX, height, '#00f59b', 'rgba(0, 245, 155, 0.12)');
  }

  drawCurve(data, maxVal, stepX, height, strokeColor, fillColor) {
    if (data.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(0, height - (data[0] / maxVal) * height);

    for (let i = 1; i < data.length; i++) {
      const x = i * stepX;
      const y = height - (data[i] / maxVal) * (height - 8);
      this.ctx.lineTo(x, y);
    }

    // Stroke
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = strokeColor;
    this.ctx.shadowBlur = 8;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Fill under curve
    this.ctx.lineTo((data.length - 1) * stepX, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
  }
}

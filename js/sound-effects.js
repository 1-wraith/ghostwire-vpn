// GhostWire Synthetic Cyber Audio FX
// Uses Web Audio API oscillator synthesis - 100% offline, zero audio file dependencies

export class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Futuristic Connection Engage Sound
  playConnect() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Low sub bass sweep
      const subOsc = this.audioCtx.createOscillator();
      const subGain = this.audioCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(80, now);
      subOsc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      subOsc.connect(subGain);
      subGain.connect(this.audioCtx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.4);

      // Cyber chime
      const chimeOsc = this.audioCtx.createOscillator();
      const chimeGain = this.audioCtx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(587.33, now + 0.15); // D5
      chimeOsc.frequency.setValueAtTime(880, now + 0.28);    // A5
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.setValueAtTime(0.18, now + 0.15);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.audioCtx.destination);
      chimeOsc.start(now + 0.15);
      chimeOsc.stop(now + 0.6);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Soft Disconnect Sound
  playDisconnect() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Tactile Cyber Switch Click
  playClick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }
}

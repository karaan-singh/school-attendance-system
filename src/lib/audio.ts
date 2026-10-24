// Web Audio API Procedural Synthesizer for Forest Quest
// Generates ambient forest breeze, birdsong, leaf blooms, and victory chimes without external audio assets

class ForestAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private soundEnabled = true;
  private ambientVolume = 0.25;
  private fxVolume = 0.5;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.isAmbientPlaying) {
      this.stopAmbient();
    }
  }

  public setVolumes(ambient: number, fx: number) {
    this.ambientVolume = Math.max(0, Math.min(1, ambient));
    this.fxVolume = Math.max(0, Math.min(1, fx));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  // Play a soft wooden click / toggle
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(this.fxVolume * 0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Play leaf bloom chime (pentatonic sparkling chime for Present status)
  public playLeafBloom(status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT' = 'PRESENT') {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const baseFreqs =
        status === 'PRESENT'
          ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Lush harmonic)
          : status === 'LATE'
          ? [440, 554.37, 659.25] // A4, C#5, E5 (Warm amber)
          : status === 'EXCUSED'
          ? [587.33, 739.99, 880] // D5, F#5, A5 (Gentle sky)
          : [329.63, 392.0]; // E4, G4 (Dignified autumn low chime)

      baseFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

        const startTime = this.ctx.currentTime + idx * 0.04;
        const duration = 0.5 + idx * 0.1;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(this.fxVolume * 0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch (e) {}
  }

  // Chapter 5: Forest Celebration Fanfare (Glissando + triumphant harmony)
  public playCelebrationFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],          // C major
        [587.33, 739.99, 880.0],           // D major
        [659.25, 830.61, 987.77],          // E major
        [783.99, 987.77, 1174.66, 1567.98], // G triumphant high
      ];

      chords.forEach((chord, stepIdx) => {
        const stepTime = this.ctx!.currentTime + stepIdx * 0.22;
        chord.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = stepIdx === chords.length - 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, stepTime);

          const duration = stepIdx === chords.length - 1 ? 1.6 : 0.45;
          gain.gain.setValueAtTime(0.001, stepTime);
          gain.gain.exponentialRampToValueAtTime(this.fxVolume * 0.35, stepTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, stepTime + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(stepTime);
          osc.stop(stepTime + duration + 0.05);
        });
      });
    } catch (e) {}
  }

  // Gentle river brook & waterfall water splash
  public playWaterSplash() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.fxVolume * 0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.34);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Ambient gentle wind & periodic bird tweets
  public startAmbient() {
    if (this.isAmbientPlaying || !this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.isAmbientPlaying = true;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.15, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // Low-frequency wind noise simulator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      whiteNoise.start();
    } catch (e) {}
  }

  public stopAmbient() {
    this.isAmbientPlaying = false;
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }
  }
}

export const forestAudio = new ForestAudioEngine();

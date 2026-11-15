// Web Audio for Storm Drums: a tuned tom with a noise crack per hit, a low triangle note per month.
// Continuous sound turns the hits into a rolling rumble whose loudness follows them and glides the month note.
import type {Hit} from './sonify.ts';
import {FlowVoice, getArticulation} from '../articulation.ts';

const MASTER = 0.55;
export type DrumPlay = {getStepSeconds: () => number; onStep: (index: number) => void; onEnd: () => void};

export class DrumEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private sources = new Set<AudioScheduledSourceNode>();
  private timers: number[] = [];
  private ticker: number | undefined;
  private level = 1;

  setVolume(v: number): void { this.level = Math.max(0, Math.min(1, v)); if (this.master) this.master.gain.value = MASTER * this.level; }

  unlock(): AudioContext | null {
    const Ctor: typeof AudioContext | undefined = globalThis.AudioContext ?? (globalThis as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return null;
    if (!this.ctx) {
      const session = (navigator as unknown as {audioSession?: {type: string}}).audioSession;
      if (session) { try { session.type = 'playback'; } catch { /* keep the default */ } }
      this.ctx = new Ctor(); this.master = this.ctx.createGain(); this.master.gain.value = MASTER * this.level; this.master.connect(this.ctx.destination);
      const length = this.ctx.sampleRate, buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate), data = buffer.getChannelData(0);
      let seed = 5011; for (let i = 0; i < length; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; data[i] = seed / 2 ** 31 - 1; }
      this.noise = buffer;
    }
    if (this.ctx.state !== 'running' && this.ctx.state !== 'closed') void this.ctx.resume().catch(() => undefined);
    return this.ctx;
  }

  private track<T extends AudioScheduledSourceNode>(node: T): T { this.sources.add(node); node.onended = () => this.sources.delete(node); return node; }

  private drum(velocity: number, when: number): void {
    if (velocity <= 0) return;
    const ctx = this.ctx!, tom = this.track(ctx.createOscillator()), g = ctx.createGain();
    tom.type = 'sine'; tom.frequency.setValueAtTime(150, when); tom.frequency.exponentialRampToValueAtTime(58, when + 0.18);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.5 * velocity, when + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, when + 0.3);
    tom.connect(g); g.connect(this.master!); tom.start(when); tom.stop(when + 0.32);
    const crack = this.track(ctx.createBufferSource()), hp = ctx.createBiquadFilter(), cg = ctx.createGain();
    crack.buffer = this.noise; hp.type = 'highpass'; hp.frequency.value = 1800;
    cg.gain.setValueAtTime(0, when); cg.gain.linearRampToValueAtTime(0.22 * velocity, when + 0.002); cg.gain.exponentialRampToValueAtTime(0.0001, when + 0.09);
    crack.connect(hp); hp.connect(cg); cg.connect(this.master!); crack.start(when, (when * 7.3) % 0.8); crack.stop(when + 0.1);
  }

  private bass(hz: number, when: number, dur: number): void {
    const ctx = this.ctx!, o = this.track(ctx.createOscillator()), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = hz;
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.32, when + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g); g.connect(this.master!); o.start(when); o.stop(when + dur + 0.05);
  }

  playOne(h: Hit, step: number): void { this.stop(); const ctx = this.unlock(); if (!ctx) return; const at = ctx.currentTime + 0.02; if (h.hz) this.bass(h.hz, at, step * 6); else this.drum(h.velocity, at); }

  play(score: readonly Hit[], opts: DrumPlay): void {
    this.stop(); const ctx = this.unlock();
    if (!ctx || !score.length) { opts.onEnd(); return; }
    let index = 0, when = ctx.currentTime + 0.06;
    const flow = getArticulation() === 'flow' ? this.rumble(ctx, when) : null;
    const tick = () => {
      while (when < ctx.currentTime + 0.12) {
        if (index >= score.length) { flow?.end(when); this.timers.push(window.setTimeout(opts.onEnd, Math.max(0, (when - ctx.currentTime) * 1000))); window.clearInterval(this.ticker); this.ticker = undefined; return; }
        const i = index, dur = opts.getStepSeconds(), h = score[i];
        if (flow) flow.step(h, when, dur);
        else if (h.hz) this.bass(h.hz, when, dur * 18); // a month note rings under its 18 hits
        else this.drum(h.velocity, when);
        this.timers.push(window.setTimeout(() => opts.onStep(i), Math.max(0, (when - ctx.currentTime) * 1000)));
        when += dur; index++;
      }
      if (this.timers.length > 64) this.timers.splice(0, this.timers.length - 64);
    };
    tick(); this.ticker = window.setInterval(tick, 25);
  }

  /** Continuous: low-passed thunder whose loudness follows each hit, under one gliding month note. */
  private rumble(ctx: AudioContext, start: number) {
    const bass = new FlowVoice(ctx, this.master!, {partials: [{ratio: 1, weight: 1, type: 'triangle'}, {ratio: 2, weight: 0.2}]}, start);
    for (const o of bass.sources) this.track(o);
    const n = this.track(ctx.createBufferSource()), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = this.noise; n.loop = true; lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 0.7; g.gain.setValueAtTime(0, start);
    n.connect(lp); lp.connect(g); g.connect(this.master!); n.start(start);
    return {
      step: (h: Hit, when: number, dur: number) => {
        if (h.hz) bass.note(h.hz, when, 0.22, {holdUntil: when + dur * 19.5});
        else g.gain.setTargetAtTime(0.5 * h.velocity, when, dur * 0.6);
      },
      end: (when: number) => { bass.end(when); g.gain.setTargetAtTime(0, when, 0.2); try { n.stop(when + 1.2); } catch { /* stopped */ } },
    };
  }

  stop(): void {
    window.clearInterval(this.ticker); this.ticker = undefined;
    for (const t of this.timers) window.clearTimeout(t); this.timers = [];
    const now = this.ctx?.currentTime ?? 0;
    for (const s of this.sources) { try { s.stop(now + 0.05); } catch { /* already stopped */ } }
    this.sources.clear();
  }

  dispose(): void { this.stop(); void this.ctx?.close().catch(() => undefined); this.ctx = null; this.master = null; }
}

// Fixed sound rules for The Warming Map. The anomaly NASA's colour stands for sets pitch on one scale for every band,
// place and decade; tempo and the Sound setting never change a note. Notes use the Currents of Heat engine's shape.
import type {OceanNote} from '../ocean/sonify.ts';
import {T_MAX, T_MIN} from './analyze.ts';

/** −2 to +2 °C in sixteen 0.25 °C steps, climbing A minor pentatonic from A2: cooler than normal low, warmer high. */
export const STEP_C = 0.25, NOTES = (T_MAX - T_MIN) / STEP_C;
const PENTATONIC = [0, 3, 5, 7, 10];
const SCALE = Array.from({length: 128}, (_, m) => m).filter(m => PENTATONIC.includes((((m - 9) % 12) + 12) % 12));
const BASE = SCALE.indexOf(45); // A2
export const degreeFor = (t: number) => Math.max(0, Math.min(NOTES - 1, Math.floor((t - T_MIN) / STEP_C)));
export const midiFor = (t: number) => SCALE[BASE + degreeFor(t)];
export const midiToHz = (m: number) => 440 * 2 ** ((m - 69) / 12);
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const midiName = (m: number) => `${NAMES[m % 12]}${Math.floor(m / 12) - 1}`;
/** The normal (0 °C anomaly) note, for reference in captions and tests. */
export const NORMAL_MIDI = midiFor(0);

export function noteFor(temp: number | null, pan = 0): OceanNote {
  if (temp === null || Number.isNaN(temp)) return null;
  const midi = midiFor(temp);
  return {midi, hz: midiToHz(midi), name: midiName(midi), temp, shimmer: 0, pan: Math.max(-0.85, Math.min(0.85, pan))};
}

export const DEFAULT_BPM = 112;
/** One band or decade per eighth note. */
export const stepSeconds = (bpm: number) => 30 / Math.max(60, Math.min(160, bpm));

export const MAPPING_TABLE: readonly (readonly [string, string])[] = [
  ['Colour of the map, matched to NASA’s −2 to +2 °C colour bar', 'Temperature anomaly against 1951–1980 (as rendered)'],
  ['Average anomaly of a band of latitude or of a place', 'Pitch: sixteen 0.25 °C steps of A minor pentatonic; cooler low, warmer high'],
  ['Pale grey (normal, or no data in NASA’s picture)', 'The middle of the scale: about 0 °C'],
  ['Beyond the colour bar', 'The top or bottom note: “2 °C or more”'],
  ['Tempo and Sound', 'Your musical choices; they never change a note'],
];

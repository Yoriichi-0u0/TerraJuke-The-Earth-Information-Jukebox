// Fixed sound rules for Storm Drums. Only the lightning NASA drew sets loudness and pitch; tempo and the Sound
// setting never change which value makes which sound.
import type {LightningAnalysis} from './analyze.ts';
import {MONTHS, SECTORS} from './analyze.ts';

const PENTATONIC = [0, 3, 5, 7, 10];
const SCALE = Array.from({length: 128}, (_, m) => m).filter(m => PENTATONIC.includes((((m - 9) % 12) + 12) % 12));
export const midiToHz = (m: number) => 440 * 2 ** ((m - 69) / 12);
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const midiName = (m: number) => `${NAMES[m % 12]}${Math.floor(m / 12) - 1}`;
/** A month's worldwide lightning (drawn area, relative units) sets a low note: 1,000-unit steps of A minor pentatonic from A1. */
export const TOTAL_STEP = 1000;
const BASE = SCALE.indexOf(33); // A1
export const totalMidi = (total: number) => SCALE[BASE + Math.max(0, Math.min(15, Math.floor(total / TOTAL_STEP)))];

export type Hit = {kind: 'month' | 'drum'; month: number; sector: number; velocity: number; midi: number | null; hz: number | null; name: string; value: number};
/** Drum loudness: square root of the value over a fixed reference, so quiet storms stay audible and nothing clips. */
export const velocityFor = (value: number, reference: number) => (value <= 0 ? 0 : Math.min(1, Math.sqrt(value / reference)));

/** Side A: each month = one low note for the world, then 18 drum hits sweeping west to east (180°W first). */
export function yearScore(data: LightningAnalysis): Hit[] {
  const reference = Math.max(...data.months.flatMap(m => m.sectors));
  return data.months.flatMap((m, month) => {
    const midi = totalMidi(m.total);
    return [
      {kind: 'month' as const, month, sector: -1, velocity: 0.8, midi, hz: midiToHz(midi), name: midiName(midi), value: m.total},
      ...m.sectors.map((value, sector) => ({kind: 'drum' as const, month, sector, velocity: velocityFor(value, reference), midi: null, hz: null, name: value > 0 ? 'drum' : 'rest', value})),
    ];
  });
}
/** Side B: one drum hit per month for a 10° × 10° place, on a fixed reference shared by every place. */
export const PLACE_REFERENCE = 450;
export function placeScore(values: readonly number[]): Hit[] {
  return values.map((value, month) => ({kind: 'drum' as const, month, sector: -1, velocity: velocityFor(value, PLACE_REFERENCE), midi: null, hz: null, name: value > 0 ? 'drum' : 'rest', value}));
}

export const DEFAULT_BPM = 132;
/** One sector per sixteenth note; a month note takes the same slot. */
export const stepSeconds = (bpm: number) => 15 / Math.max(80, Math.min(180, bpm));
export const SCORE_STEPS = MONTHS.length * (SECTORS + 1);

export const MAPPING_TABLE: readonly (readonly [string, string])[] = [
  ['Yellow dots NASA drew for lightning detected by the ISS sensor (10-day window)', 'Lightning, counted as drawn area per place'],
  ['A month’s lightning worldwide', 'A low note: 1,000-unit steps of A minor pentatonic; more lightning, higher'],
  ['Lightning in each 20° slice of longitude, west to east', 'A drum hit; louder where more lightning was drawn, silent where none'],
  ['A place’s lightning month by month (Side B)', 'One drum hit per month on one fixed loudness scale for every place'],
  ['Tempo and Sound', 'Your musical choices; Continuous turns the drums into a rolling rumble'],
];

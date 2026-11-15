import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {decodePng} from './airFixture.ts';
import {CELL_COLS, FRAME_IDS, SECTORS, analyseLightning, cellIndex, flashWeight} from '../src/lib/lightning/analyze.ts';
import type {LightningAnalysis} from '../src/lib/lightning/analyze.ts';
import {PLACE_REFERENCE, SCORE_STEPS, placeScore, totalMidi, velocityFor, yearScore} from '../src/lib/lightning/sonify.ts';
import {placeCaption, strength} from '../src/lib/lightning/describe.ts';

const frames = FRAME_IDS.map(id => decodePng(readFileSync(new URL(`../validation/svs5011/${id}.png`, import.meta.url))));
const world = JSON.parse(readFileSync(new URL('../src/data/world.json', import.meta.url), 'utf8'));
const committed: LightningAnalysis = JSON.parse(readFileSync(new URL('../src/data/lightning5011.json', import.meta.url), 'utf8'));
const place = (lat: number, lon: number) => { const c = cellIndex(lat, lon)!; return FRAME_IDS.map(id => committed.cells[id][c.row * CELL_COLS + c.col]); };

test('flash weight: NASA’s yellow dots count, the grey map, white lines and black sea do not', () => {
  assert.equal(flashWeight(250, 225, 40), 1);
  for (const [r, g, b] of [[60, 60, 60], [120, 120, 120], [230, 230, 230], [8, 8, 8], [70, 70, 75]]) assert.equal(flashWeight(r, g, b), 0, `${r},${g},${b}`);
  assert.ok(flashWeight(120, 108, 30) > 0 && flashWeight(120, 108, 30) < 1, 'a dot blended by resampling counts in part');
});

test('the committed data file is exactly what the analysis produces from NASA’s frames', () => {
  assert.deepEqual(analyseLightning(frames, world.coastlines), committed);
});

test('most lightning falls over land, every month', () => {
  for (const m of committed.months) assert.ok(m.landShare > 0.65 && m.landShare < 0.95, `${m.id}: ${m.landShare}`);
});

test('the storm belt follows the sun: south of the equator in January, far north in July and August', () => {
  const lat = (id: string) => committed.months.find(m => m.id === id)!.centroidLat;
  assert.ok(lat('2022-01') < -5 && lat('2022-07') > 10 && lat('2022-08') > 10, `${lat('2022-01')} → ${lat('2022-07')}`);
  assert.ok(lat('2022-07') - lat('2022-01') > 20);
});

test('the sensor sees only to about 55°: nothing beyond it', () => {
  for (const m of committed.months) assert.ok(m.beyond55 < 1, `${m.id}: ${m.beyond55}`);
});

test('known places: the Congo storms all year, the Sahara and the open Pacific stay quiet, the US Plains peak in summer', () => {
  const congo = place(-2, 22), sahara = place(25, 10), pacific = place(-5, -145), plains = place(35, -95);
  assert.ok(congo.every(v => v > 50), `Congo ${congo.join(' ')}`);
  assert.ok(Math.max(...sahara) < 20 && Math.max(...pacific) < 5);
  const summer = plains[5] + plains[6] + plains[7], winter = plains[0] + plains[1] + plains[11];
  assert.ok(summer > 3 * winter, `US Plains summer ${summer} vs winter ${winter}`);
});

test('sound rules: one month note then 18 drums; louder for more lightning; silence for none', () => {
  const score = yearScore(committed);
  assert.equal(score.length, SCORE_STEPS); assert.equal(SCORE_STEPS, 12 * (SECTORS + 1));
  assert.equal(score[0].kind, 'month'); assert.ok(score.slice(1, SECTORS + 1).every(h => h.kind === 'drum'));
  assert.equal(velocityFor(0, 100), 0); assert.ok(velocityFor(50, 100) < velocityFor(100, 100)); assert.equal(velocityFor(400, 100), 1);
  const aug = committed.months[7].total, feb = committed.months[1].total;
  assert.ok(totalMidi(aug) > totalMidi(feb), 'a busier month plays a higher note');
  assert.deepEqual(placeScore([0, PLACE_REFERENCE]).map(h => h.velocity), [0, 1]);
});

test('captions say where and when the storms are', () => {
  assert.equal(strength(0), 'no lightning drawn'); assert.equal(strength(400), 'a storm hotspot');
  assert.match(placeCaption(-5, 25, place(-2, 22)), /^Africa, 5°S 25°E: lightning in 12 of 12 months, most in \w+$/);
  assert.equal(placeCaption(-5, -145, [0, 0, 0]), 'the South Pacific, 5°S 145°W: no lightning drawn in any month of 2022');
});

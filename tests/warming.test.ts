import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {decodePng} from './airFixture.ts';
import {BANDS, BAND_DEG, CELL_COLS, LAT_LIMIT, YEARS, analyseWarming, cellIndex, readBar, tempAtColumn, temperatureOf} from '../src/lib/warming/analyze.ts';
import type {WarmingAnalysis} from '../src/lib/warming/analyze.ts';
import {rgbToOklab, oklabToRgb} from '../src/lib/nightLights/color.ts';
import {NORMAL_MIDI, degreeFor, midiFor, noteFor} from '../src/lib/warming/sonify.ts';
import {anomaly, bandCaption, placeCaption, regionName} from '../src/lib/warming/describe.ts';

const bar = decodePng(readFileSync(new URL('../public/nasa/svs5450/svs5450_cbar.png', import.meta.url)));
const stops = readBar(bar);
const frames = YEARS.map(y => decodePng(readFileSync(new URL(`../validation/svs5450/${y}.png`, import.meta.url))));
const committed: WarmingAnalysis = JSON.parse(readFileSync(new URL('../src/data/warming5450.json', import.meta.url), 'utf8'));
const year = (y: number) => committed.years.find(s => s.year === y)!;
const place = (lat: number, lon: number, y: number) => { const c = cellIndex(lat, lon)!; return committed.cells[String(y)][c.row * CELL_COLS + c.col]; };

/** NASA's own GISTEMP v4 annual means (J-D), from the pinned CSV used by Climate Spiral. */
const gistemp = new Map<number, number>();
for (const line of readFileSync(new URL('../public/data/sources/gistemp-global-monthly-2026-10-18.csv', import.meta.url), 'utf8').split('\n')) {
  const cells = line.split(','), y = Number(cells[0]), v = Number(cells[13]);
  if (Number.isInteger(y) && cells[13] && Number.isFinite(v)) gistemp.set(y, v);
}

test('NASA’s colour bar: −2 °C at the left border, 0 in the middle, +2 °C at the right; every bar colour reads back to itself', () => {
  assert.equal(tempAtColumn(130), -2); assert.equal(tempAtColumn(872), 2); assert.ok(Math.abs(tempAtColumn(501)) < 0.01);
  let worst = 0;
  for (const s of stops) if (Math.abs(s.temp) > 0.15) worst = Math.max(worst, Math.abs(temperatureOf(s.lab, stops)! - s.temp));
  assert.ok(worst < 0.1, `largest read-back error ${worst.toFixed(3)} °C`);
});

test('relief shading does not change a reading; pale grey reads as normal; dark lines read nothing', () => {
  for (const target of [-1.5, -0.7, 0.8, 1.6]) {
    const s = stops.reduce((a, b) => (Math.abs(b.temp - target) < Math.abs(a.temp - target) ? b : a));
    const shaded = rgbToOklab(oklabToRgb([s.lab[0] * 0.86, s.lab[1] * 0.86, s.lab[2] * 0.86]).map(v => Math.round(v)) as unknown as [number, number, number]);
    assert.ok(Math.abs(temperatureOf(shaded, stops)! - s.temp) < 0.15, `${target} °C shaded`);
  }
  assert.ok(Math.abs(temperatureOf(rgbToOklab([200, 200, 200]), stops)!) < 0.2, 'NASA’s pale grey');
  assert.equal(temperatureOf(rgbToOklab([60, 60, 60]), stops), null, 'a coastline');
});

test('the committed data file is exactly what the analysis produces from NASA’s frames', () => {
  assert.deepEqual(analyseWarming(frames, bar), committed);
});

test('global averages read from colour agree with NASA’s published GISTEMP means', () => {
  const diffs = committed.years.map(s => {
    const truth = s.year === 2024 ? (gistemp.get(2023)! + gistemp.get(2024)!) / 2 : (gistemp.get(s.year - 1)! + gistemp.get(s.year)!) / 2;
    return s.globalC! - truth;
  });
  const meanAbs = diffs.reduce((a, d) => a + Math.abs(d), 0) / diffs.length;
  assert.ok(meanAbs < 0.08, `mean absolute difference ${meanAbs.toFixed(3)} °C`);
  assert.ok(Math.max(...diffs.map(Math.abs)) < 0.2, `largest difference ${Math.max(...diffs.map(Math.abs)).toFixed(2)} °C`);
  assert.ok(committed.years.every(s => s.coverage > 0.95));
});

test('the warming has the shape climate science expects', () => {
  assert.ok(year(1910).globalC! < -0.3 && year(2024).globalC! > 1.0, 'cool early century, record-warm 2024');
  for (const [a, b] of [[1970, 1990], [1990, 2010], [2010, 2024]]) assert.ok(year(b).globalC! > year(a).globalC!, `${b} warmer than ${a}`);
  const arctic = year(2024).bands.slice(-3).filter((v): v is number => v !== null), arcticMean = arctic.reduce((a, b) => a + b, 0) / arctic.length;
  assert.ok(arcticMean > year(2024).globalC! + 0.6, `Arctic amplification: 70–85°N reads ${arcticMean.toFixed(2)} °C`);
  assert.equal(year(2024).bands.length, BANDS);
  assert.ok(place(50, 10, 2024)! > 1.5 && place(50, 10, 1910)! < 0, 'central Europe: cool in 1910, far warmer in 2024');
});

test('sound rules: fixed scale, normal in the middle, warmer is higher, beyond the bar clamps', () => {
  assert.equal(degreeFor(-2), 0); assert.equal(degreeFor(2), 15); assert.equal(degreeFor(5), 15); assert.equal(midiFor(0), NORMAL_MIDI);
  for (let t = -2; t < 2; t += 0.1) assert.ok(midiFor(t + 0.1) >= midiFor(t));
  assert.ok(noteFor(1.9)!.midi > noteFor(-0.4)!.midi); assert.equal(noteFor(null), null);
});

test('captions name the place and say how far from normal', () => {
  assert.equal(anomaly(2), '+2 °C or more'); assert.equal(anomaly(-0.44), '−0.4 °C'); assert.equal(anomaly(0.02), '±0.0 °C');
  assert.equal(regionName(52, 10), 'Europe'); assert.equal(regionName(75, 0), 'the Arctic');
  assert.equal(bandCaption(80 - BAND_DEG, 2024, 2), '75°N to 80°N in 2024: +2 °C or more, far warmer than normal');
  assert.match(placeCaption(52.5, 15, [{year: 1890, t: -0.3}, {year: 2024, t: 1.9}]), /^Europe, 53°N 15°E: −0\.3 °C in 1890, \+1\.9 °C in 2024$/);
  assert.equal(LAT_LIMIT, 85);
});

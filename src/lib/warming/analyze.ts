/**
 * The Warming Map: temperature anomalies read back from NASA SVS 5450's colours (GISTEMP v4, 1951–1980 baseline).
 * Pure and framework-free; scripts/svs5450-analyse.ts and the unit tests run the same code.
 *
 * NASA's colour bar (svs5450_cbar.png, 1000×346) is linear from −2 °C at x = 130 to +2 °C at x = 872, the two white
 * end borders under the printed −2 °C and 2 °C ticks. NASA's map shades the bar's colours (relief shading makes the
 * bar's white read as pale grey), so each map pixel is matched by lightness-normalised OKLab chromaticity (a/L, b/L),
 * which shading does not change. Pale neutral pixels therefore read as about 0 °C, which is how the picture draws
 * both normal temperatures and areas without data. Dark neutral pixels (coastlines, borders) read nothing.
 * Colours beyond the bar's ends read as the end value: "2 °C or more".
 */
import type {Raster} from '../nightLights/raster.ts';
import {chroma, rgbToOklab} from '../nightLights/color.ts';
import type {Lab} from '../nightLights/color.ts';

export const YEARS = [1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024] as const;
export const T_MIN = -2, T_MAX = 2;
export const BAR = {left: 130, right: 872, row: 190} as const;
/** Latitudes read: NASA's last rows near each pole carry rendering artefacts. */
export const LAT_LIMIT = 85;
export const BAND_DEG = 5, BANDS = (2 * LAT_LIMIT) / BAND_DEG;
export const CELL = {lat: 5, lon: 10} as const;
export const CELL_ROWS = (2 * LAT_LIMIT) / CELL.lat, CELL_COLS = 360 / CELL.lon;

export type BarStop = {temp: number; lab: Lab; ca: number; cb: number};
export const tempAtColumn = (x: number) => T_MIN + ((x - BAR.left) / (BAR.right - BAR.left)) * (T_MAX - T_MIN);

export function readBar(bar: Raster): BarStop[] {
  const stops: BarStop[] = [];
  for (let x = BAR.left + 2; x <= BAR.right - 2; x++) {
    const i = (BAR.row * bar.width + x) * 4;
    const lab = rgbToOklab([bar.data[i], bar.data[i + 1], bar.data[i + 2]]);
    stops.push({temp: tempAtColumn(x), lab, ca: lab[1] / lab[0], cb: lab[2] / lab[0]});
  }
  return stops;
}

/** The anomaly NASA's colour stands for, or null for no data and coastlines. */
export function temperatureOf(lab: Lab, stops: readonly BarStop[]): number | null {
  if (lab[0] < 0.2 || (chroma(lab) < 0.03 && lab[0] < 0.6)) return null;
  const ca = lab[1] / lab[0], cb = lab[2] / lab[0];
  let best = Infinity, temp = 0;
  for (const s of stops) {
    const d = (s.ca - ca) ** 2 + (s.cb - cb) ** 2;
    if (d < best) { best = d; temp = s.temp; }
  }
  return best > 0.01 ? null : temp;
}

export type Field = {width: number; height: number; temps: Float32Array};
/** Plate carrée: row 0 is the North Pole edge, column 0 is 180°W. */
export function readField(map: Raster, stops: readonly BarStop[]): Field {
  const {width, height} = map, temps = new Float32Array(width * height).fill(NaN), cache = new Map<number, number | null>();
  for (let i = 0; i < width * height; i++) {
    const r = map.data[i * 4], g = map.data[i * 4 + 1], b = map.data[i * 4 + 2], key = (r << 16) | (g << 8) | b;
    let t = cache.get(key);
    if (t === undefined) { t = temperatureOf(rgbToOklab([r, g, b]), stops); cache.set(key, t); }
    if (t !== null) temps[i] = t;
  }
  return {width, height, temps};
}
const latOfRow = (y: number, h: number) => 90 - ((y + 0.5) / h) * 180;
const lonOfCol = (x: number, w: number) => -180 + ((x + 0.5) / w) * 360;

/** Area-weighted (cos latitude) mean over the read pixels inside a box; null where nothing was read. */
export function boxMean(f: Field, south: number, north: number, west = -180, east = 180): {mean: number | null; share: number} {
  let sum = 0, weight = 0, all = 0;
  for (let y = 0; y < f.height; y++) {
    const lat = latOfRow(y, f.height);
    if (lat < south || lat >= north) continue;
    const w = Math.cos((lat * Math.PI) / 180);
    for (let x = 0; x < f.width; x++) {
      const lon = lonOfCol(x, f.width);
      if (lon < west || lon >= east) continue;
      all += w;
      const t = f.temps[y * f.width + x];
      if (!Number.isNaN(t)) { sum += t * w; weight += w; }
    }
  }
  return {mean: weight ? sum / weight : null, share: all ? weight / all : 0};
}

const round2 = (v: number | null) => (v === null ? null : Math.round(v * 100) / 100 || 0); // no -0: JSON cannot keep it
export type YearSummary = {year: number; globalC: number | null; coverage: number; bands: (number | null)[]};
/** Per frame: global mean, coverage, and 34 bands of 5° from 85°S to 85°N (south first). */
export function summarise(year: number, f: Field): YearSummary {
  const g = boxMean(f, -LAT_LIMIT, LAT_LIMIT);
  const bands = Array.from({length: BANDS}, (_, k) => round2(boxMean(f, -LAT_LIMIT + k * BAND_DEG, -LAT_LIMIT + (k + 1) * BAND_DEG).mean));
  return {year, globalC: round2(g.mean), coverage: Math.round(g.share * 1000) / 1000, bands};
}
/** Places: 5° × 10° cells, north first; each value needs at least a third of the cell read, else null. */
export function cellGrid(f: Field): (number | null)[] {
  const out: (number | null)[] = [];
  for (let row = 0; row < CELL_ROWS; row++) for (let col = 0; col < CELL_COLS; col++) {
    const north = LAT_LIMIT - row * CELL.lat, west = -180 + col * CELL.lon, m = boxMean(f, north - CELL.lat, north, west, west + CELL.lon);
    out.push(m.share >= 1 / 3 ? round2(m.mean) : null);
  }
  return out;
}
export const cellIndex = (lat: number, lon: number) => {
  if (Math.abs(lat) > LAT_LIMIT) return null;
  const row = Math.min(CELL_ROWS - 1, Math.floor((LAT_LIMIT - lat) / CELL.lat)), col = Math.min(CELL_COLS - 1, Math.floor(((((lon + 180) % 360) + 360) % 360) / CELL.lon));
  return {row, col};
};
export const cellCentre = (row: number, col: number) => ({lat: LAT_LIMIT - (row + 0.5) * CELL.lat, lon: -180 + (col + 0.5) * CELL.lon});

export type WarmingAnalysis = {years: YearSummary[]; cells: Record<string, (number | null)[]>};
export function analyseWarming(frames: readonly Raster[], bar: Raster): WarmingAnalysis {
  const stops = readBar(bar), years: YearSummary[] = [], cells: Record<string, (number | null)[]> = {};
  frames.forEach((frame, i) => { const f = readField(frame, stops); years.push(summarise(YEARS[i], f)); cells[YEARS[i]] = cellGrid(f); });
  return {years, cells};
}

/**
 * Storm Drums: lightning as NASA SVS 5011 drew it (ISS Lightning Imaging Sensor, quality-controlled science data,
 * 10-day roving window), on the frames nearest the 15th of each month of 2022. Pure and framework-free.
 *
 * NASA draws each detected lightning event as a yellow dot over a dark grey plate carrée map. A pixel's "flash weight"
 * is how yellow it is (OKLab b, the yellow–blue axis, between 0.04 and 0.16, scaled 0–1), so dots blended by
 * resampling still count in proportion. Weights are multiplied by cos(latitude), so a cell's total is proportional to
 * the ground area NASA painted with lightning. These are drawn dots, not a count of strokes.
 */
import type {Raster} from '../nightLights/raster.ts';
import {rgbToOklab} from '../nightLights/color.ts';
import {isLand, rasterLand} from '../arcticIce/landMask.ts';

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'] as const;
export const FRAME_IDS = MONTHS.map((_, i) => `2022-${String(i + 1).padStart(2, '0')}`);
/** NASA's frame numbers in the 6,002-frame SOS movie, nearest the 15th of each month in labels.txt. */
export const FRAME_NUMBERS = [4132, 4194, 4251, 4316, 4379, 4446, 4512, 4583, 4655, 4727, 4804, 4882] as const;
/** The ISS orbit is inclined 51.6°; LIS sees to about 55°. Places are 10° × 10° from 60°S to 60°N. */
export const LAT_LIMIT = 60, CELL = 10, CELL_ROWS = (2 * LAT_LIMIT) / CELL, CELL_COLS = 360 / CELL;
export const SECTORS = 18, SECTOR_DEG = 360 / SECTORS;

export function flashWeight(r: number, g: number, b: number): number {
  const lab = rgbToOklab([r, g, b]);
  if (lab[0] < 0.25 || lab[1] > 0.08) return 0; // too dark, or red/pink rather than yellow
  return Math.max(0, Math.min(1, (lab[2] - 0.04) / 0.12));
}

const latOf = (y: number, h: number) => 90 - ((y + 0.5) / h) * 180;
const lonOf = (x: number, w: number) => -180 + ((x + 0.5) / w) * 360;
const round = (v: number) => Math.round(v * 10) / 10 || 0;

export type MonthSummary = {id: string; total: number; landShare: number; centroidLat: number; beyond55: number; sectors: number[]};
export type LightningAnalysis = {months: MonthSummary[]; cells: Record<string, number[]>};
type Ring = readonly (readonly number[])[];

/** One frame: per-cell flash area (relative units), per-longitude-sector totals, land share and centroid latitude. */
export function analyseFrame(id: string, f: Raster, landGrid: ReturnType<typeof rasterLand>): {summary: MonthSummary; cells: number[]} {
  const cells = new Array(CELL_ROWS * CELL_COLS).fill(0), sectors = new Array(SECTORS).fill(0);
  let total = 0, land = 0, latSum = 0, beyond = 0;
  for (let y = 0; y < f.height; y++) {
    const lat = latOf(y, f.height), w = Math.cos((lat * Math.PI) / 180);
    for (let x = 0; x < f.width; x++) {
      const i = (y * f.width + x) * 4, k = flashWeight(f.data[i], f.data[i + 1], f.data[i + 2]);
      if (!k) continue;
      const v = k * w, lon = lonOf(x, f.width);
      if (Math.abs(lat) > 55) beyond += v;
      if (Math.abs(lat) >= LAT_LIMIT) continue;
      total += v; latSum += v * lat;
      if (isLand(landGrid, lat, lon)) land += v;
      cells[Math.floor((LAT_LIMIT - lat) / CELL) * CELL_COLS + Math.floor((lon + 180) / CELL)] += v;
      sectors[Math.min(SECTORS - 1, Math.floor((lon + 180) / SECTOR_DEG))] += v;
    }
  }
  return {
    summary: {id, total: round(total), landShare: Math.round((land / total) * 1000) / 1000, centroidLat: round(latSum / total), beyond55: round(beyond), sectors: sectors.map(round)},
    cells: cells.map(round),
  };
}

export function analyseLightning(frames: readonly Raster[], landRings: readonly Ring[]): LightningAnalysis {
  const grid = rasterLand(landRings, -90), months: MonthSummary[] = [], cells: Record<string, number[]> = {};
  frames.forEach((f, i) => { const r = analyseFrame(FRAME_IDS[i], f, grid); months.push(r.summary); cells[FRAME_IDS[i]] = r.cells; });
  return {months, cells};
}
export const cellIndex = (lat: number, lon: number) => (Math.abs(lat) >= LAT_LIMIT ? null : {row: Math.floor((LAT_LIMIT - lat) / CELL), col: Math.min(CELL_COLS - 1, Math.floor(((((lon + 180) % 360) + 360) % 360) / CELL))});
export const cellCentre = (row: number, col: number) => ({lat: LAT_LIMIT - (row + 0.5) * CELL, lon: -180 + (col + 0.5) * CELL});

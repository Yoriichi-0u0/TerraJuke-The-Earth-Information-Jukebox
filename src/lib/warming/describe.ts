// Plain-language captions for The Warming Map. Region names are approximate boxes, for orientation only.
import {T_MAX, T_MIN} from './analyze.ts';

export const latLabel = (lat: number) => { const v = Math.round(Math.abs(lat)); return v === 0 ? '0°' : `${v}°${lat < 0 ? 'S' : 'N'}`; };
export const lonLabel = (lon: number) => { const v = Math.round(Math.abs(lon)); return v === 0 || v === 180 ? `${v}°` : `${v}°${lon < 0 ? 'W' : 'E'}`; };
/** "+1.3 °C", "−0.4 °C", or "2 °C or more" at the colour bar's ends. */
export function anomaly(t: number): string {
  if (t >= T_MAX - 0.01) return '+2 °C or more';
  if (t <= T_MIN + 0.01) return '−2 °C or less';
  const v = Math.round(t * 10) / 10;
  return `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toFixed(1)} °C`;
}
export function feel(t: number): string {
  if (t >= 1.5) return 'far warmer than normal';
  if (t >= 0.5) return 'warmer than normal';
  if (t > -0.5) return 'about normal';
  if (t > -1.5) return 'cooler than normal';
  return 'far cooler than normal';
}

/** [name, west, south, east, north]; first match wins. */
const REGIONS: readonly (readonly [string, number, number, number, number])[] = [
  ['the Arctic', -180, 66, 180, 90], ['Antarctica and the Southern Ocean', -180, -90, 180, -60],
  ['Greenland', -60, 59, -15, 66], ['Europe', -12, 35, 40, 66], ['Siberia', 40, 50, 180, 66], ['Central and East Asia', 40, 20, 150, 50],
  ['South Asia', 60, 5, 95, 30], ['Southeast Asia', 95, -10, 150, 20], ['Australia', 112, -45, 155, -10],
  ['Canada and Alaska', -170, 50, -52, 66], ['the United States', -125, 25, -66, 50], ['Mexico and Central America', -118, 7, -77, 25],
  ['South America', -82, -56, -34, 12], ['North Africa and Arabia', -18, 12, 60, 35], ['Africa', -18, -35, 52, 12],
  ['the North Atlantic', -80, 20, -12, 59], ['the South Atlantic', -60, -60, 20, 0], ['the tropical Atlantic', -60, 0, -18, 20],
  ['the Indian Ocean', 20, -60, 112, 5], ['the North Pacific', 120, 0, 180, 66], ['the North Pacific', -180, 0, -77, 50],
  ['the South Pacific', -180, -60, -70, 0], ['the South Pacific', 150, -60, 180, 0],
];
export function regionName(lat: number, lon: number): string {
  for (const [name, w, s, e, n] of REGIONS) if (lat >= s && lat < n && lon >= w && lon < e) return name;
  return 'the open ocean';
}
export function bandCaption(south: number, year: number, t: number | null): string {
  const where = `${latLabel(south)} to ${latLabel(south + 5)} in ${year}`;
  return t === null ? `${where}: nothing to read, silence` : `${where}: ${anomaly(t)}, ${feel(t)}`;
}
export function placeCaption(lat: number, lon: number, series: readonly {year: number; t: number | null}[]): string {
  const read = series.filter((p): p is {year: number; t: number} => p.t !== null), where = `${regionName(lat, lon)}, ${latLabel(lat)} ${lonLabel(lon)}`;
  if (read.length < 2) return `${where}: too little to read here`;
  const first = read[0], last = read.at(-1)!;
  return `${where}: ${anomaly(first.t)} in ${first.year}, ${anomaly(last.t)} in ${last.year}`;
}

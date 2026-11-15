// Plain-language captions for Storm Drums. Region names reuse The Warming Map's approximate boxes.
import {MONTHS} from './analyze.ts';
import {latLabel, lonLabel, regionName} from '../warming/describe.ts';

export {latLabel, lonLabel, regionName};
export const sectorLabel = (sector: number, deg: number) => `${lonLabel(-180 + sector * deg)} to ${lonLabel(-180 + (sector + 1) * deg)}`;
export function strength(value: number): string {
  if (value <= 0) return 'no lightning drawn';
  if (value < 20) return 'a few flashes';
  if (value < 120) return 'some storms';
  if (value < 300) return 'many storms';
  return 'a storm hotspot';
}
export function monthCaption(month: number, total: number, landShare: number, centroidLat: number): string {
  return `15 ${MONTHS[month]} 2022: lightning across the world, ${Math.round(landShare * 100)}% of it over land, centred near ${latLabel(centroidLat)}`;
}
export function placeCaption(lat: number, lon: number, values: readonly number[]): string {
  const where = `${regionName(lat, lon)}, ${latLabel(lat)} ${lonLabel(lon)}`, max = Math.max(...values);
  if (max <= 0) return `${where}: no lightning drawn in any month of 2022`;
  const months = values.filter(v => v > 0).length, peak = MONTHS[values.indexOf(max)];
  return `${where}: lightning in ${months} of 12 months, most in ${peak}`;
}

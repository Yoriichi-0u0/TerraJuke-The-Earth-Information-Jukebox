// Read NASA SVS 5450's decade maps (validation/svs5450/*.png) and write The Warming Map's data file.
// Usage: npx tsx scripts/svs5450-analyse.ts   (deterministic; tests/warming.test.ts checks the file matches)
import { readFileSync, writeFileSync } from 'node:fs';
import { decodePng } from '../tests/airFixture.ts';
import { YEARS, analyseWarming } from '../src/lib/warming/analyze.ts';

const frames = YEARS.map(y => decodePng(readFileSync(new URL(`../validation/svs5450/${y}.png`, import.meta.url))));
const bar = decodePng(readFileSync(new URL('../public/nasa/svs5450/svs5450_cbar.png', import.meta.url)));
const result = analyseWarming(frames, bar);
writeFileSync(new URL('../src/data/warming5450.json', import.meta.url), JSON.stringify(result) + '\n');
for (const y of result.years) console.log(y.year, y.globalC, `coverage ${y.coverage}`, `north ${y.bands.at(-2)} south ${y.bands[1]}`);

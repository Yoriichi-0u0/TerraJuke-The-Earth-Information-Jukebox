// Read NASA SVS 5011's twelve 2022 frames (validation/svs5011/*.png) and write Storm Drums' data file.
// Usage: npx tsx scripts/svs5011-analyse.ts   (deterministic; tests/lightning.test.ts checks the file matches)
import { readFileSync, writeFileSync } from 'node:fs';
import { decodePng } from '../tests/airFixture.ts';
import { FRAME_IDS, analyseLightning } from '../src/lib/lightning/analyze.ts';

const frames = FRAME_IDS.map(id => decodePng(readFileSync(new URL(`../validation/svs5011/${id}.png`, import.meta.url))));
const world = JSON.parse(readFileSync(new URL('../src/data/world.json', import.meta.url), 'utf8'));
const result = analyseLightning(frames, world.coastlines);
writeFileSync(new URL('../src/data/lightning5011.json', import.meta.url), JSON.stringify(result) + '\n');
for (const m of result.months) console.log(m.id, 'total', m.total, 'land', m.landShare, 'centroid', m.centroidLat, 'beyond55', m.beyond55);

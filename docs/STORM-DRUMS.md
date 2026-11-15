# Storm Drums (NASA SVS 5011, Lightning Events Detected from the ISS 2017–2023)

Record 08 on the TerraJuke shelf (since 15 November 2026), built from a listed challenge Resource. Code:
[`src/lib/lightning/`](../src/lib/lightning/) and [`StormDeck`](../src/components/StormDeck.tsx). Tests:
[`tests/lightning.test.ts`](../tests/lightning.test.ts) and [`tests/storm.e2e.spec.ts`](../tests/storm.e2e.spec.ts).

## The visualization

NASA SVS 5011 (visualizer Michala Garrison): lightning events detected by the **Lightning Imaging Sensor (LIS)** on the
International Space Station, January 2017 to July 2023, from the quality-controlled science dataset, drawn as yellow
dots with a 10-day roving window. NASA made a version for the EIC display and one for Science On a Sphere. TerraJuke
uses the **Science On a Sphere movie** (4096 × 2048, plate carrée, H.264, 6,002 frames) and NASA's `labels.txt`,
which dates every frame, and takes the frame nearest the 15th of each month of **2022** (frames 4132 … 4882).
(`labels.txt` labels the 2023 frames "2003", an evident typo; 2022 is unaffected.) Files and hashes:
[`public/nasa/svs5011/svs5011.provenance.json`](../public/nasa/svs5011/svs5011.provenance.json).

## Reading lightning from the picture

1. `scripts/svs5011-prepare.sh` extracts the twelve frames with ffmpeg, keeps a 1440 × 720 analysis copy
   (0.25° per pixel, colour chunks stripped) and a 2048 × 1024 WebP for display.
2. A pixel's **flash weight** is how yellow it is: OKLab b (the yellow–blue axis) from 0.04 to 0.16, scaled 0–1, so
   dots softened by resampling still count in part. NASA's grey map, white tropic lines and dark ocean weigh nothing.
3. Weights × cos(latitude) give the ground area NASA painted with lightning, per 10° × 10° place, per 20° slice of
   longitude, over land (Natural Earth 1:110m) and in total.

`scripts/svs5011-analyse.ts` writes [`src/data/lightning5011.json`](../src/data/lightning5011.json); a unit test
re-runs the analysis on the frames and requires the identical file.

## How it sounds

- **Side A, the storm year.** Each month opens with a low triangle note for the world's lightning that month
  (1,000-unit steps of A minor pentatonic from A1: more lightning, higher), then 18 tuned drums sweep west to east,
  one per 20° of longitude, louder where NASA drew more lightning (square-root scale) and silent where it drew none.
- **Side B, touch a place.** One drum per month for a 10° × 10° place, on one loudness scale shared by every place.
- **Continuous** (the Sound setting) turns the drums into a low rumble that swells with the lightning, under a gliding
  month note.

## Is it sensible? (pinned by tests)

| Fact about lightning | What the frames give |
|---|---|
| Lightning is mostly over land | 71–85% over land in every month of 2022 |
| The storm belt follows the sun | Centred near 11°S in January and 19–28°N in July–August |
| LIS sees only to about 55° | Nothing drawn beyond 55° in any month |
| The Congo basin is a year-round hotspot; Lake Maracaibo too | Strong in all 12 months |
| Deserts and the open Pacific are quiet | Sahara and central Pacific near zero |
| US Plains storms peak in summer | June–August more than three times December–February |

## Limits

- These are **drawn dots**, not a count of strokes or flash rates; dot size and overlap change the totals.
- LIS sees only between about 55°N and 55°S and only during station overpasses; each frame is a 10-day window.
- One frame per month of one year (2022) stands for that month.
- The movie came from the Internet Archive's raw capture of NASA's URL (svs.gsfc.nasa.gov refused connections).

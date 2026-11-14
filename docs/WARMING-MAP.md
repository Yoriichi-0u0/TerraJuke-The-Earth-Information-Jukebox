# The Warming Map (NASA SVS 5450, Global Temperature Anomalies from 1880 to 2024)

Record 07 on the TerraJuke shelf (since 15 November 2026; it replaces *Temperature Through Time*, which replayed the
GISTEMP numbers already heard on Climate Spiral's Side B). Code: [`src/lib/warming/`](../src/lib/warming/) and
[`WarmingDeck`](../src/components/WarmingDeck.tsx). Tests: [`tests/warming.test.ts`](../tests/warming.test.ts) and
[`tests/warming.e2e.spec.ts`](../tests/warming.e2e.spec.ts).

## The visualization

NASA Scientific Visualization Studio 5450 (visualizer Mark SubbaRao, scientific consulting Gavin A. Schmidt),
released 10 January 2025: NASA GISS's GISTEMP v4 temperature anomalies against the 1951–1980 normal, drawn as a world
map and averaged over a running 24-month window, from 1880 to 2024. TerraJuke uses the **Science On a Sphere** frame
set (900 frames, 4096 × 2048, plate carrée, so pixels map straight to latitude and longitude) and NASA's
`time.txt`, which labels every frame with its year. One frame per decade, the last labelled with that year:
1890, 1900 … 2020, plus the final 2024 map. Files, archive captures and hashes:
[`public/nasa/svs5450/svs5450.provenance.json`](../public/nasa/svs5450/svs5450.provenance.json).

## Reading temperature from colour

1. NASA's colour bar *Temperature Change* (`svs5450_cbar.png`) is linear from −2 °C at x = 130 to +2 °C at x = 872,
   with white at 0. TerraJuke reads its middle row.
2. NASA's map shades the bar's colours (relief shading is visible over mountains; the bar's white appears as pale
   grey). Each pixel is therefore matched by **lightness-normalised OKLab chromaticity** (a/L, b/L), which shading does
   not change. Every bar colour reads back to its own temperature within 0.1 °C, and a shaded colour reads the same
   (tested).
3. Pale neutral pixels read about 0 °C: NASA draws normal temperatures and places without data in the same pale grey.
   Dark neutral pixels (coastlines, borders) read nothing. Colours past the bar's ends read "2 °C or more".
4. Latitudes beyond 85° are left out (the last rows near each pole carry rendering artefacts).

`scripts/svs5450-analyse.ts` writes [`src/data/warming5450.json`](../src/data/warming5450.json): per map, the
area-weighted global mean, 34 bands of 5° latitude, and 1,224 places of 5° × 10°. A unit test re-runs the analysis
on the frames and requires the identical file.

## How it sounds

- **Side A, pole to pole.** 34 bands from 85°S to 85°N of the chosen decade (2024 by default). Each band's anomaly
  sets pitch on one fixed scale: sixteen 0.25 °C steps of A minor pentatonic from A2, so −2 °C is the lowest note,
  normal sits in the middle, and +2 °C or more is the highest. The decade strip and the arrow keys change the map.
- **Side B, touch a place.** Tap or arrow-key a 5° × 10° place; its 15 decades play in turn on the same scale, the map
  changes with each decade, and the strip's bars show that place's history.
- Notes use the Currents of Heat engine, so the Sound setting (Note by note or Continuous) works here too.

## Is it sensible? (pinned by tests)

The global mean read from colour alone agrees with NASA's published GISTEMP annual means (mean of the two years each
map covers, from TerraJuke's pinned GISTEMP file) to within **0.06 °C on average, at most 0.14 °C**, across all 15
maps. 1910 reads −0.4 °C and 2024 +1.2 °C (GISTEMP: −0.46 and +1.23). Tests also require a warming sequence from
1970 to 2024, Arctic amplification (70–85°N in 2024 at least 0.6 °C above the global mean; it reads near +2 °C), and
central Europe cooler than normal in 1910 and more than 1.5 °C warmer in 2024.

## Limits

- Values are read from rendered colour: about 0.1 °C precision, and nothing beyond ±2 °C.
- Early decades read about 0 °C where NASA had no data, because the picture draws missing data like normal.
- Each map is a 24-month average ending in its year; the analysis copy is 720 × 360 (0.5° per pixel).
- The frames came from the Internet Archive's raw captures of NASA's URLs (svs.gsfc.nasa.gov refused connections);
  the archived colour bar is 64,283 bytes, while the SVS page lists 43.1 KB, so its bytes may differ from NASA's
  current file even though the printed scale is the one the page describes.

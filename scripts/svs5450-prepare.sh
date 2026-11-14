#!/bin/sh
# Rebuild The Warming Map's images from NASA SVS 5450 (Global Temperature Anomalies 1880-2024, Science On a Sphere
# frames: 4096x2048, plate carree, 8-bit sRGB PNG). Usage: scripts/svs5450-prepare.sh <folder with YEAR.png frames>
#   validation/svs5450/YEAR.png  720x360 (0.5 degrees per pixel), colour chunks stripped: what the analysis reads
#   public/nasa/svs5450/YEAR.webp 2048x1024 WebP: what the record shows
set -eu
src=${1:?folder with frames named 1890.png ... 2024.png}
root=$(cd "$(dirname "$0")/.." && pwd)
work=$(mktemp -d)
mkdir -p "$root/validation/svs5450" "$root/public/nasa/svs5450"
for year in 1890 1900 1910 1920 1930 1940 1950 1960 1970 1980 1990 2000 2010 2020 2024; do
  sips -z 360 720 "$src/$year.png" --out "$work/small.png" >/dev/null
  node "$root/scripts/png-strip-colour.mjs" "$work/small.png" "$root/validation/svs5450/$year.png"
  cwebp -quiet -q 80 -resize 2048 1024 "$src/$year.png" -o "$root/public/nasa/svs5450/$year.webp"
done
cp "$src/SOS_GlobalTemperatures_cbar_1000px.png" "$root/public/nasa/svs5450/svs5450_cbar.png"
rm -rf "$work"
echo "Done. Next: npx tsx scripts/svs5450-analyse.ts"

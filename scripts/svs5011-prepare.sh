#!/bin/sh
# Rebuild Storm Drums' images from NASA SVS 5011 (ISS LIS lightning, Science On a Sphere movie, 4096x2048 plate
# carree, H.264). Usage: scripts/svs5011-prepare.sh <iss_lightning_sos_yearly_07312023_2048p60.mp4>
# The frames are those nearest the 15th of each month of 2022 in NASA's labels.txt (frame n = line n+1).
#   validation/svs5011/2022-MM.png  1440x720 (0.25 degrees per pixel), colour chunks stripped: what the analysis reads
#   public/nasa/svs5011/2022-MM.webp 2048x1024 WebP: what the record shows
set -eu
movie=${1:?NASA SOS movie}
root=$(cd "$(dirname "$0")/.." && pwd)
work=$(mktemp -d)
mkdir -p "$root/validation/svs5011" "$root/public/nasa/svs5011"
sel=""; for n in 4132 4194 4251 4316 4379 4446 4512 4583 4655 4727 4804 4882; do sel="${sel}eq(n\\,$n)+"; done
ffmpeg -hide_banner -loglevel error -i "$movie" -vf "select=${sel%+}" -fps_mode passthrough -frames:v 12 "$work/f_%02d.png"
for m in 01 02 03 04 05 06 07 08 09 10 11 12; do
  sips -z 720 1440 "$work/f_$m.png" --out "$work/small.png" >/dev/null
  node "$root/scripts/png-strip-colour.mjs" "$work/small.png" "$root/validation/svs5011/2022-$m.png"
  cwebp -quiet -q 82 -resize 2048 1024 "$work/f_$m.png" -o "$root/public/nasa/svs5011/2022-$m.webp"
done
rm -rf "$work"
echo "Done. Next: npx tsx scripts/svs5011-analyse.ts"

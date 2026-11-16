#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
episode_output="${EPISODE_OUTPUT_DIR:-$PWD/out/pez-luna-oceanico}"
episode_browser="${REMOTION_BROWSER:-/usr/bin/chromium}"
episode_workers="${REMOTION_CONCURRENCY:-2}"
mkdir -p "$episode_output"
npx remotion render src/index.ts PezLunaOceanico "$episode_output/montaje-remotion.mp4" \
  --codec=h264 --audio-codec=aac --crf=18 --pixel-format=yuv420p \
  --concurrency="$episode_workers" --browser-executable="$episode_browser" --log=error
# Keep the rendered video bit-for-bit; trim only AAC padding to exact duration.
ffmpeg -y -v error -i "$episode_output/montaje-remotion.mp4" -map 0:v:0 -map 0:a:0 \
  -c:v copy -af 'atrim=duration=70,apad=whole_dur=70,asetpts=N/SR/TB' \
  -c:a aac -b:a 192k -ar 48000 -t 70 -movflags +faststart \
  "$episode_output/corazon-al-limite-pez-luna-oceanico.mp4"
python3 scripts/validar_pez_luna.py "$episode_output/corazon-al-limite-pez-luna-oceanico.mp4"

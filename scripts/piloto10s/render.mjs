import fs from "node:fs";
import { execFileSync } from "node:child_process";
const manifest = JSON.parse(
  fs.readFileSync("src/Piloto10s/production.json", "utf8"),
);
const captions = JSON.parse(
  fs.readFileSync("src/Piloto10s/captions.json", "utf8"),
);
if (captions.length !== 18 || captions.at(-1).endMs >= 10000)
  throw new Error("Falta la alineación real completa del piloto");
if (!fs.existsSync("public/piloto10s/audio/mezcla_master.wav"))
  throw new Error("Genera primero los recursos de audio");
fs.mkdirSync("output", { recursive: true });
const source = "output/corazon_al_limite_piloto_10s_remotion.mp4";
const target = "output/corazon_al_limite_piloto_10s.mp4";
const args = [
  "remotion",
  "render",
  "src/index.ts",
  manifest.composition,
  source,
  "--codec=h264",
  "--pixel-format=yuv420p",
  "--crf=18",
  "--audio-codec=aac",
  "--audio-bitrate=192k",
  "--concurrency=2",
];
if (fs.existsSync("/usr/bin/chromium"))
  args.push("--browser-executable=/usr/bin/chromium");
execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", args, {
  stdio: "inherit",
});
const coded = JSON.parse(
  execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_streams",
      "-of",
      "json",
      source,
    ],
    { encoding: "utf8" },
  ),
).streams[0];
const inputRange =
  coded.color_range === "pc" || coded.pix_fmt.startsWith("yuvj")
    ? "full"
    : "tv";
// Delivery pass: standard video range, fast-start MP4 and one AAC encode from
// the same mastered PCM bus used by Remotion, avoiding AAC-to-AAC degradation.
execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-y",
    "-i",
    source,
    "-i",
    "public/piloto10s/audio/mezcla_master.wav",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-vf",
    `scale=in_range=${inputRange}:out_range=tv,format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-threads",
    "2",
    "-crf",
    "18",
    "-r",
    "30",
    "-frames:v",
    "300",
    "-color_range",
    "tv",
    "-colorspace",
    "bt709",
    "-color_primaries",
    "bt709",
    "-color_trc",
    "bt709",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-ar",
    "48000",
    "-ac",
    "2",
    "-t",
    "10",
    "-movflags",
    "+faststart",
    "-video_track_timescale",
    "15360",
    target,
  ],
  { stdio: "inherit" },
);
console.log(`MP4 final: ${target}`);

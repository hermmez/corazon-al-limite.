import fs from "node:fs";
import { execFileSync } from "node:child_process";
const config = JSON.parse(
  fs.readFileSync("src/episodios/episodio-01-cerebro/production.json", "utf8"),
);
const directory = "output/episodio-01-cerebro";
const source = `${directory}/episodio_01_cerebro_70s_remotion.mp4`;
const target = `${directory}/episodio_01_cerebro_70s.mp4`;
const encoding = `${directory}/episodio_01_cerebro_70s_encoding.mp4`;
const master = "public/episodios/episodio-01-cerebro/audio/mezcla_master.flac";
if (!fs.existsSync(master))
  throw new Error("Primero genera el bus maestro con crear_audio.py");
fs.mkdirSync(directory, { recursive: true });
const browser = fs.existsSync("/usr/bin/chromium")
  ? ["--browser-executable=/usr/bin/chromium"]
  : [];
execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "remotion",
    "render",
    "src/index.ts",
    config.composition,
    source,
    "--codec=h264",
    "--pixel-format=yuv420p",
    "--crf=18",
    "--audio-codec=aac",
    "--audio-bitrate=192k",
    "--concurrency=2",
    ...browser,
  ],
  { stdio: "inherit" },
);
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
const range =
  coded.color_range === "pc" || coded.pix_fmt.startsWith("yuvj")
    ? "full"
    : "tv";
// Standard TV range / BT.709 delivery. AAC is encoded once from lossless FLAC.
execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-y",
    "-i",
    source,
    "-i",
    master,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-vf",
    `scale=in_range=${range}:out_range=tv,format=yuv420p`,
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
    "2100",
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
    "70",
    "-movflags",
    "+faststart",
    "-video_track_timescale",
    "15360",
    encoding,
  ],
  { stdio: "inherit" },
);
// Expose the deliverable only after the encoder has finalized its MP4 index.
fs.renameSync(encoding, target);
execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-y",
    "-ss",
    "1.4",
    "-i",
    target,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    `${directory}/miniatura_vertical.jpg`,
  ],
  { stdio: "inherit" },
);
console.log(
  `MP4: ${target}\nVoz: ${config.voice.status}. 3D: ${config.intro3d.status}.`,
);

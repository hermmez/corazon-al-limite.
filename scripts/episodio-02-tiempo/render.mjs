import fs from "node:fs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const root = "src/episodios/episodio-02-tiempo";
const out = "output/episodio-02-tiempo";
const timeline = JSON.parse(fs.readFileSync(`${root}/timeline.json`, "utf8"));
assert.equal(
  timeline.audioReady,
  true,
  "Falta integrar la narración real y la mezcla del episodio 02.",
);
const master = "public/episodios/episodio-02-tiempo/audio/mezcla_master.flac";
assert.ok(fs.existsSync(master), "Falta el master de audio real.");
const probe = (file) =>
  JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
      { encoding: "utf8" },
    ),
  );
assert.equal(
  Number(probe(master).format.duration),
  70,
  "El master debe durar 70.000 s antes de renderizar.",
);
fs.mkdirSync(out, { recursive: true });
const intermediate = `${out}/episodio_02_tiempo_70s_remotion.mp4`;
const encoding = `${out}/episodio_02_tiempo_70s_encoding.mp4`;
const target = `${out}/episodio_02_tiempo_70s.mp4`;
const browser = fs.existsSync("/usr/bin/chromium")
  ? ["--browser-executable=/usr/bin/chromium"]
  : [];
execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "remotion",
    "render",
    "src/index.ts",
    "Episodio02Tiempo",
    intermediate,
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
const v = probe(intermediate).streams.find((s) => s.codec_type === "video");
assert.equal(v.nb_frames, "2100");
assert.equal(v.width, 1080);
assert.equal(v.height, 1920);
const range =
  v.color_range === "pc" || v.pix_fmt.startsWith("yuvj") ? "full" : "tv";
// Delivery AAC is encoded once from lossless master; the whole MP4 is not sped up.
execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-y",
    "-i",
    intermediate,
    "-i",
    master,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-map_metadata",
    "-1",
    "-vf",
    `sidedata=delete:type=ICC_PROFILE,scale=in_range=${range}:out_range=tv,format=yuv420p`,
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
    // Explicit H.264 VUI avoids inherited ICC/container data hiding primaries
    // or transfer tags even when FFmpeg's color options were supplied.
    "-bsf:v",
    "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0",
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
const delivered = probe(encoding);
assert.equal(Number(delivered.format.duration), 70);
const deliveredVideo = delivered.streams.find((s) => s.codec_type === "video");
assert.equal(deliveredVideo.nb_frames, "2100");
assert.equal(deliveredVideo.color_range, "tv");
assert.equal(deliveredVideo.color_space, "bt709");
assert.equal(deliveredVideo.color_primaries, "bt709");
assert.equal(deliveredVideo.color_transfer, "bt709");
assert.ok(
  !deliveredVideo.side_data_list?.some(
    (data) => data.side_data_type === "ICC Profile",
  ),
  "La entrega no debe conservar un perfil ICC heredado junto al VUI BT.709.",
);
// Atomic publication prevents probes or users from opening a half-written index.
fs.renameSync(encoding, target);
const thumbArgument = process.argv.find((a) =>
  a.startsWith("--thumbnail-time="),
);
const thumbTime = thumbArgument ? Number(thumbArgument.split("=")[1]) : 2.0;
assert.ok(Number.isFinite(thumbTime) && thumbTime >= 0 && thumbTime < 70);
execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-y",
    "-ss",
    String(thumbTime),
    "-i",
    target,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    `${out}/miniatura_vertical.jpg`,
  ],
  { stdio: "inherit" },
);
console.log(
  `MP4 terminado: ${target}\nMiniatura: ${out}/miniatura_vertical.jpg\nValidar: node scripts/episodio-02-tiempo/validar.mjs`,
);

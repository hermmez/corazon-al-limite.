import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const config = read("src/Piloto10s/production.json"),
  captions = read("src/Piloto10s/captions.json");
const png = read("src/Piloto10s/approved-assets.json");
assert.equal(Object.keys(png).length, 68);
for (const [file, before] of Object.entries(png))
  assert.equal(
    hash(fs.readFileSync(file)),
    before.sha256,
    `PNG modificado: ${file}`,
  );
for (const file of config.visualAssets)
  assert.ok(fs.existsSync(`public/${file}`));
assert.equal(config.frames, 300);
assert.equal(config.fps, 30);
assert.equal(config.durationSeconds, 10);
assert.deepEqual(
  config.scenes.map((s) => [s.start, s.end]),
  [
    [0, 2],
    [2, 5],
    [5, 8],
    [8, 10],
  ],
);
assert.equal(captions.map((c) => c.text).join(""), config.narration);
assert.equal(captions.length, 18);
let previous = 0,
  group = 0;
const groups = [];
for (const c of captions) {
  assert.ok(c.startMs >= previous && c.endMs > c.startMs && c.endMs < 10000);
  assert.ok(c.confidence >= 0 && c.confidence <= 1);
  previous = c.endMs;
  group++;
  if (c.pageBreakAfter) {
    assert.ok(group >= 2 && group <= 5);
    groups.push(group);
    group = 0;
  }
}
assert.equal(group, 0);
const source = read("output/piloto_transcripcion_original.json");
assert.equal(source.words.length, captions.length);
for (let i = 0; i < captions.length; i++) {
  assert.equal(
    captions[i].startMs,
    Math.round(source.words[i].start * 1000) + 180,
  );
  assert.equal(captions[i].endMs, Math.round(source.words[i].end * 1000) + 180);
}
const file = "output/corazon_al_limite_piloto_10s.mp4";
const probe = JSON.parse(
  execFileSync(
    "ffprobe",
    ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
    { encoding: "utf8" },
  ),
);
const video = probe.streams.find((s) => s.codec_type === "video"),
  audio = probe.streams.find((s) => s.codec_type === "audio");
assert.equal(video.codec_name, "h264");
assert.equal(video.width, 1080);
assert.equal(video.height, 1920);
assert.equal(video.r_frame_rate, "30/1");
assert.equal(video.nb_frames, "300");
assert.equal(video.pix_fmt, "yuv420p");
assert.equal(audio.codec_name, "aac");
assert.equal(audio.channels, 2);
assert.equal(audio.sample_rate, "48000");
assert.equal(Number(probe.format.duration), 10);
assert.equal(Number(video.duration), 10);
const decoded = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-xerror",
    "-i",
    file,
    "-vf",
    "blackdetect=d=0.025:pix_th=0.06:pic_th=0.98",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 3e6 },
);
assert.equal(decoded.status, 0, "No se decodifica el video completo");
assert.ok(
  !decoded.stderr.includes("black_start:"),
  "Fotograma negro detectado",
);
const loudness = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-i",
    file,
    "-af",
    "loudnorm=I=-14:TP=-2:LRA=7:print_format=json",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 3e6 },
);
assert.equal(loudness.status, 0);
const levels = JSON.parse(loudness.stderr.match(/\{[^{}]*\}/g).at(-1));
assert.ok(Number(levels.input_tp) <= -1, "Pico demasiado alto");
assert.ok(
  Number(levels.input_i) >= -16 && Number(levels.input_i) <= -12,
  "Loudness fuera de rango",
);
const raw = execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-i",
    file,
    "-an",
    "-vf",
    "scale=108:192,format=rgb24",
    "-f",
    "rawvideo",
    "-",
  ],
  { maxBuffer: 24e6 },
);
const bytes = 108 * 192 * 3;
assert.equal(raw.length / bytes, 300);
const distinctFrames = new Set(
  Array.from({ length: 300 }, (_, i) =>
    hash(raw.subarray(i * bytes, (i + 1) * bytes)),
  ),
).size;
assert.ok(distinctFrames > 295, "Exceso de fotogramas inmóviles");
const buffer = fs.readFileSync(file);
const moov = buffer.indexOf(Buffer.from("moov")),
  mdat = buffer.indexOf(Buffer.from("mdat"));
assert.ok(moov > 0 && moov < mdat, "Falta fast-start");
const report = {
  status: "passed",
  composition: config.composition,
  file,
  bytes: buffer.length,
  sha256: hash(buffer),
  durationSeconds: Number(probe.format.duration),
  video: {
    codec: video.codec_name,
    width: video.width,
    height: video.height,
    fps: 30,
    frames: 300,
    pixelFormat: video.pix_fmt,
    colorRange: video.color_range,
  },
  audio: {
    codec: audio.codec_name,
    sampleRate: 48000,
    channels: 2,
    lufs: Number(levels.input_i),
    truePeakDbtp: Number(levels.input_tp),
  },
  voice: {
    originalDurationSeconds: 8.75102,
    playbackRate: 1,
    offsetMs: 180,
    lastWordEndSeconds: captions.at(-1).endMs / 1000,
  },
  captions: {
    engine: source.engine,
    model: source.model,
    alignment: "actual audio word timestamps",
    words: 18,
    wordsPerGroup: groups,
  },
  preservation: { approvedPngUnchanged: 68 },
  fullDecode: true,
  blackRanges: 0,
  distinctFrames,
  fastStart: true,
  validatedAt: new Date().toISOString(),
};
fs.writeFileSync(
  "output/piloto_validacion_tecnica.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));

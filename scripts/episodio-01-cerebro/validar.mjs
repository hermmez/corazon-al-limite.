import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const config = read("src/episodios/episodio-01-cerebro/production.json");
const captions = read("src/episodios/episodio-01-cerebro/captions.json");
const approved = read(config.preservationManifest);
assert.equal(Object.keys(approved).length, 68);
for (const [file, info] of Object.entries(approved))
  assert.equal(
    hash(fs.readFileSync(file)),
    info.sha256,
    `Ilustración alterada: ${file}`,
  );
for (const file of config.visualAssets)
  assert.ok(fs.existsSync(`public/${file}`), file);
assert.equal(config.frames, 2100);
assert.equal(config.fps, 30);
assert.equal(config.durationSeconds, 70);
assert.deepEqual(
  config.scenes.map((s) => [s.start, s.end]),
  [
    [0, 5],
    [5, 13],
    [13, 22],
    [22, 33],
    [33, 44],
    [44, 55],
    [55, 64],
    [64, 70],
  ],
);
const oldRoot = execFileSync(
  "git",
  ["show", "7d821b6c866b84cd71748ba9176cbc1aa811aea1:src/Root.tsx"],
  { encoding: "utf8" },
);
const currentRoot = fs.readFileSync("src/Root.tsx", "utf8");
const oldIds = [...oldRoot.matchAll(/<Composition\s+id="([^"]+)"/g)].map(
  (m) => m[1],
);
for (const id of oldIds)
  assert.ok(currentRoot.includes(`id="${id}"`), `Composición eliminada: ${id}`);
const groups = [];
let group = 0,
  previous = 0;
if (config.voice.status === "real-integrated") {
  assert.equal(
    captions
      .map((c) => c.text)
      .join("")
      .trim(),
    config.narration,
  );
  for (const c of captions) {
    assert.ok(c.startMs >= previous && c.endMs > c.startMs && c.endMs <= 70000);
    previous = c.endMs;
    group++;
    if (c.pageBreakAfter) {
      assert.ok(group >= 3 && group <= 5);
      groups.push(group);
      group = 0;
    }
  }
  assert.equal(group, 0);
  assert.ok(captions.length > 100);
  const alignment = read(
    "output/episodio-01-cerebro/alineacion_audio_real.json",
  );
  assert.equal(alignment.words.length, captions.length);
  for (let i = 0; i < captions.length; i++) {
    assert.equal(captions[i].startMs, alignment.words[i].startMs);
    assert.equal(captions[i].endMs, alignment.words[i].endMs);
  }
} else {
  assert.equal(captions.length, 0, "No publicar subtítulos de voz inventados");
}
const file = "output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4";
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
assert.equal(video.nb_frames, "2100");
assert.equal(video.pix_fmt, "yuv420p");
assert.equal(video.color_range, "tv");
assert.equal(audio.codec_name, "aac");
assert.equal(audio.channels, 2);
assert.equal(audio.sample_rate, "48000");
assert.equal(Number(probe.format.duration), 70);
assert.equal(Number(video.duration), 70);
assert.equal(Number(audio.duration), 70);
const decoded = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-xerror",
    "-i",
    file,
    "-vf",
    "blackdetect=d=0.025:pix_th=0.06:pic_th=0.98,scale=108:192,format=rgb24",
    "-an",
    "-f",
    "framemd5",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 3e6 },
);
assert.equal(decoded.status, 0, "Fallo al decodificar MP4 completo");
assert.ok(!decoded.stderr.includes("black_start:"), "Fotogramas negros");
const frameRows = decoded.stdout
  .split("\n")
  .filter((l) => l && !l.startsWith("#"));
assert.equal(frameRows.length, 2100);
const distinctFrames = new Set(frameRows.map((l) => l.split(",").at(-1).trim()))
  .size;
assert.ok(distinctFrames > 2070);
const loud = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-i",
    file,
    "-vn",
    "-af",
    "loudnorm=I=-14:TP=-2:LRA=7:print_format=json",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 3e6 },
);
assert.equal(loud.status, 0);
const levels = JSON.parse(loud.stderr.match(/\{[^{}]*\}/g).at(-1));
assert.ok(Number(levels.input_tp) <= -1);
const expected = config.voice.status === "real-integrated" ? -14 : -24;
assert.ok(Math.abs(Number(levels.input_i) - expected) < 2);
const bytes = fs.readFileSync(file),
  moov = bytes.indexOf(Buffer.from("moov")),
  mdat = bytes.indexOf(Buffer.from("mdat"));
assert.ok(moov > 0 && moov < mdat);
const report = {
  technicalStatus: "passed",
  publicationStatus:
    config.voice.status === "real-integrated"
      ? "ready-with-2d-intro"
      : "voice-pending",
  file,
  bytes: bytes.length,
  sha256: hash(bytes),
  durationSeconds: 70,
  video: {
    codec: "h264",
    width: 1080,
    height: 1920,
    fps: 30,
    frames: 2100,
    pixelFormat: video.pix_fmt,
    colorRange: video.color_range,
  },
  audio: {
    codec: "aac",
    channels: 2,
    sampleRate: 48000,
    lufs: Number(levels.input_i),
    truePeakDbtp: Number(levels.input_tp),
  },
  narration: config.voice,
  captions: {
    alignment: config.captionAlignment,
    words: captions.length,
    wordsPerGroup: groups,
  },
  intro3d: config.intro3d,
  preservation: { unchangedApprovedPng: 68, retainedCompositions: oldIds },
  fullDecode: true,
  blackRanges: 0,
  distinctFrames,
  fastStart: true,
  validatedAt: new Date().toISOString(),
};
fs.writeFileSync(
  "output/episodio-01-cerebro/validacion_tecnica.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));

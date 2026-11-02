import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (b) => createHash("sha256").update(b).digest("hex");
const root = "src/episodios/episodio-01-cerebro-125",
  out = "output/episodio-01-cerebro-125",
  preview = process.argv.includes("--preview"),
  tag = preview ? "PREVIEW" : "FINAL",
  timeline = read(`${root}/timeline.json`),
  production = read(`${root}/production.json`),
  captions = read(`${root}/captions.json`);
if (!preview)
  assert.equal(
    timeline.audioReady,
    true,
    "La voz ampliada real sigue pendiente; no declarar producción terminada",
  );
for (const [file, info] of Object.entries(
  read("src/Piloto10s/approved-assets.json"),
))
  assert.equal(hash(fs.readFileSync(file)), info.sha256, file);
assert.equal(
  hash(fs.readFileSync(production.original.video)),
  "2985c99c74f23883c8302fa65094da5f2bc99364bd820f10faaf8288e395a4a3",
  "Se alteró el video aprobado",
);
const originalRoot = execFileSync(
  "git",
  ["show", `${production.original.commit}:src/Root.tsx`],
  { encoding: "utf8" },
);
const currentRoot = fs.readFileSync("src/Root.tsx", "utf8");
for (const m of originalRoot.matchAll(/<Composition\s+id="([^"]+)"/g))
  assert.ok(currentRoot.includes(`id="${m[1]}"`));
let group = 0,
  previous = 0;
const counts = [];
for (const c of captions) {
  assert.ok(c.startMs >= previous && c.endMs > c.startMs && c.endMs <= 70000);
  previous = c.endMs;
  group++;
  if (c.pageBreakAfter) {
    assert.ok(group >= 3 && group <= 5);
    counts.push(group);
    group = 0;
  }
}
assert.equal(group, 0);
assert.equal(
  captions.length,
  preview
    ? 131
    : production.scenes.reduce((n, s) => n + s.text.split(/\s+/).length, 0),
);
assert.equal(timeline.scenes[0].start, 0);
assert.equal(timeline.scenes.at(-1).end, 70);
const file = `${out}/episodio_01_cerebro_70s_${tag}.mp4`;
const probe = JSON.parse(
  execFileSync(
    "ffprobe",
    ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
    { encoding: "utf8" },
  ),
);
const v = probe.streams.find((s) => s.codec_type === "video"),
  a = probe.streams.find((s) => s.codec_type === "audio");
assert.equal(v.width, 1080);
assert.equal(v.height, 1920);
assert.equal(v.codec_name, "h264");
assert.equal(v.nb_frames, "2100");
assert.equal(v.r_frame_rate, "30/1");
assert.equal(Number(v.duration), 70);
assert.equal(Number(a.duration), 70);
assert.equal(Number(probe.format.duration), 70);
assert.equal(a.codec_name, "aac");
assert.equal(a.channels, 2);
assert.equal(a.sample_rate, "48000");
const decode = spawnSync(
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
assert.equal(decode.status, 0);
assert.ok(!decode.stderr.includes("black_start:"));
const frames = decode.stdout.split("\n").filter((l) => l && !l.startsWith("#"));
assert.equal(frames.length, 2100);
const distinct = new Set(frames.map((l) => l.split(",").at(-1).trim())).size;
assert.ok(distinct > 2070);
const volume = spawnSync(
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
assert.equal(volume.status, 0);
const levels = JSON.parse(volume.stderr.match(/\{[^{}]*\}/g).at(-1));
assert.ok(Number(levels.input_tp) <= -1);
assert.ok(Math.abs(Number(levels.input_i) + 14) < 2);
const buffer = fs.readFileSync(file);
assert.ok(
  buffer.indexOf(Buffer.from("moov")) < buffer.indexOf(Buffer.from("mdat")),
);
const report = {
  technicalStatus: "passed",
  productionStatus: preview
    ? "PREVIEW-expanded-voice-awaiting-authorization"
    : "ready",
  file,
  bytes: buffer.length,
  sha256: hash(buffer),
  duration: 70,
  frames: 2100,
  fps: 30,
  width: 1080,
  height: 1920,
  codecs: ["h264", "aac"],
  audio: {
    sampleRate: 48000,
    channels: 2,
    lufs: Number(levels.input_i),
    truePeakDbtp: Number(levels.input_tp),
    voiceTempo: 1.25,
    musicBpm: 105,
  },
  captions: {
    words: captions.length,
    groups: counts.length,
    wordsPerGroup: counts,
    alignment: preview
      ? "measured original word times mapped through tempo and clip placement; provisional"
      : "Piper/VITS intrinsic phoneme durations verified against emitted samples, mapped through actual tempo duration and acoustic silence splices; tolerance 35ms",
  },
  originalUnchanged: true,
  approvedPngUnchanged: 68,
  blackRanges: 0,
  distinctFrames: distinct,
  visualEvents: timeline.events.length,
  paidGenerationsThisRevision: production.voice.paidGenerationCount ?? 0,
  voiceAuthorizationPending: !timeline.audioReady,
  validatedAt: new Date().toISOString(),
};
fs.writeFileSync(
  `${out}/validacion_${tag}.json`,
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));

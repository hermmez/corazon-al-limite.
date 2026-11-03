import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";

const root = "src/episodios/episodio-02-tiempo";
const out = "output/episodio-02-tiempo";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = (file) =>
  createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const timeline = read(`${root}/timeline.json`),
  production = read(`${root}/production.json`),
  captions = read(`${root}/captions.json`);
assert.equal(
  timeline.audioReady,
  true,
  "No se declara validada una producción sin narración real.",
);
const assets = read("src/Piloto10s/approved-assets.json");
assert.equal(Object.keys(assets).length, 68);
for (const [file, info] of Object.entries(assets))
  assert.equal(
    sha(file),
    info.sha256,
    `Ilustración aprobada alterada: ${file}`,
  );
const protectedMovies = {
  "output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4":
    "2985c99c74f23883c8302fa65094da5f2bc99364bd820f10faaf8288e395a4a3",
  "output/episodio-01-cerebro-125/episodio_01_cerebro_70s_FINAL.mp4":
    "878dfa169b11cce9a8f18698a78a5580c1603fafd958a47cab0780630a68688b",
};
for (const [file, digest] of Object.entries(protectedMovies))
  assert.equal(sha(file), digest, `Se alteró un episodio anterior: ${file}`);
const previousCommit =
  production.previousCommit ??
  production.original?.commit ??
  "ae06cebb9f927616705d9ed30cfed17d0c722f08";
const originalRoot = execFileSync(
  "git",
  ["show", `${previousCommit}:src/Root.tsx`],
  { encoding: "utf8" },
);
const currentRoot = fs.readFileSync("src/Root.tsx", "utf8");
const previousIds = [
  ...originalRoot.matchAll(/<Composition\s+id="([^"]+)"/g),
].map((m) => m[1]);
for (const id of previousIds)
  assert.ok(currentRoot.includes(`id="${id}"`), `Se eliminó composición ${id}`);
assert.ok(currentRoot.includes('id="Episodio02Tiempo"'));
assert.equal(timeline.scenes.length, 8);
assert.equal(timeline.scenes[0].start, 0);
assert.equal(timeline.scenes.at(-1).end, 70);
for (let i = 0; i < timeline.scenes.length; i++) {
  const s = timeline.scenes[i];
  assert.ok(
    s.end > s.start &&
      s.voiceStart >= s.start - 0.08 &&
      s.voiceEnd <= s.end + 0.08 &&
      s.voiceEnd > s.voiceStart,
  );
  if (i)
    assert.ok(
      Math.abs(timeline.scenes[i - 1].end - s.start) < 0.0011,
      "Hueco en la línea de tiempo.",
    );
}
let count = 0,
  previous = 0;
const groups = [];
for (const c of captions) {
  assert.ok(typeof c.text === "string" && c.text.trim());
  assert.ok(
    c.startMs >= previous && c.endMs > c.startMs && c.endMs <= 70000,
    "Marcas de subtítulos inválidas.",
  );
  previous = c.endMs;
  count++;
  if (c.pageBreakAfter) {
    assert.ok(count >= 3 && count <= 5, "Grupos de 3–5 palabras.");
    groups.push(count);
    count = 0;
  }
}
assert.equal(count, 0, "Último grupo de subtítulos sin cerrar.");
const scriptScenes = production.scenes ?? read(`${root}/chapters.json`);
const expectedWords = scriptScenes.reduce(
  (n, s) => n + s.text.trim().split(/\s+/).length,
  0,
);
assert.equal(captions.length, expectedWords);
const sync = timeline.events.map((e) => {
  const c = captions[e.audioWord];
  assert.ok(c, `No existe palabra acústica de ${e.id}`);
  const target =
    e.action === 0 ? timeline.scenes[e.scene].voiceStart : c.startMs / 1000;
  const delta = e.start - target;
  // Frame-zero hook precedes the first voiced phoneme; retain the true offset.
  const allowedSeconds =
    e.action === 0 ? (e.scene === 0 ? 0.12 : 0.08) : 0.0011;
  assert.ok(
    Math.abs(delta) <= allowedSeconds,
    `Desfase semántico ${e.id}: ${delta}s`,
  );
  return {
    event: e.id,
    cue: e.cue,
    word: c.text.trim(),
    time: e.start,
    deltaMs: Number((delta * 1000).toFixed(3)),
    chapterPreroll: e.action === 0,
    allowedPrerollMs: e.action === 0 ? allowedSeconds * 1000 : null,
  };
});
const file = `${out}/episodio_02_tiempo_70s.mp4`;
assert.ok(fs.existsSync(file), "No existe el MP4 final.");
const probe = JSON.parse(
  execFileSync(
    "ffprobe",
    ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
    { encoding: "utf8" },
  ),
);
const v = probe.streams.find((s) => s.codec_type === "video"),
  a = probe.streams.find((s) => s.codec_type === "audio");
assert.ok(v && a, "Falta video o audio.");
assert.equal(v.width, 1080);
assert.equal(v.height, 1920);
assert.equal(v.codec_name, "h264");
assert.equal(v.nb_frames, "2100");
assert.equal(v.r_frame_rate, "30/1");
assert.equal(v.avg_frame_rate, "30/1");
assert.equal(Number(v.duration), 70);
assert.equal(Number(a.duration), 70);
assert.equal(Number(probe.format.duration), 70);
assert.equal(v.pix_fmt, "yuv420p");
assert.equal(v.color_range, "tv");
assert.equal(v.color_space, "bt709");
assert.equal(v.color_primaries, "bt709");
assert.equal(v.color_transfer, "bt709");
assert.equal(a.codec_name, "aac");
assert.equal(a.channels, 2);
assert.equal(a.sample_rate, "48000");
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
  { encoding: "utf8", maxBuffer: 4e6 },
);
assert.equal(decoded.status, 0, decoded.stderr);
assert.ok(
  !decoded.stderr.includes("black_start:"),
  "Hay fotogramas negros que deben revisarse.",
);
const frames = decoded.stdout
  .split("\n")
  .filter((l) => l && !l.startsWith("#"));
assert.equal(frames.length, 2100);
const distinct = new Set(frames.map((l) => l.split(",").at(-1).trim())).size;
assert.ok(
  distinct > 2070,
  "Demasiados fotogramas idénticos; revisar evolución visual.",
);
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
  { encoding: "utf8", maxBuffer: 4e6 },
);
assert.equal(volume.status, 0, volume.stderr);
const levels = JSON.parse(volume.stderr.match(/\{[^{}]*\}/g).at(-1));
assert.ok(
  Number(levels.input_tp) <= -1,
  "Pico verdadero alto; revisar mezcla.",
);
assert.ok(
  Math.abs(Number(levels.input_i) + 14) < 2,
  "Loudness fuera del objetivo −14 ±2 LUFS.",
);
const buffer = fs.readFileSync(file);
assert.ok(
  buffer.indexOf(Buffer.from("moov")) < buffer.indexOf(Buffer.from("mdat")),
  "Falta inicio rápido.",
);
const report = {
  technicalStatus: "passed",
  file,
  bytes: buffer.length,
  sha256: sha(file),
  duration: 70,
  frames: 2100,
  fps: 30,
  width: 1080,
  height: 1920,
  codecs: ["h264", "aac"],
  pixelFormat: v.pix_fmt,
  color: {
    range: v.color_range,
    space: v.color_space,
    primaries: v.color_primaries,
    transfer: v.color_transfer,
  },
  audio: {
    sampleRate: 48000,
    channels: 2,
    lufs: Number(levels.input_i),
    truePeakDbtp: Number(levels.input_tp),
    voiceProvider: production.voice?.provider ?? null,
    voiceTempo: production.voice?.tempo ?? null,
  },
  captions: {
    words: captions.length,
    groups: groups.length,
    wordsPerGroup: groups,
    source:
      production.voice?.intrinsicAlignment ??
      "Verificar alineacion_audio_real.json",
  },
  semanticEvents: sync,
  approvedPngUnchanged: 68,
  protectedMoviesUnchanged: Object.keys(protectedMovies),
  previousCompositionIdsRetained: previousIds,
  decodedFrames: frames.length,
  distinctFrames: distinct,
  blackRanges: [],
  fastStart: true,
  paidGenerations: production.voice?.paidGenerationCount ?? null,
  creditsSpent: production.voice?.creditsActual ?? null,
  scope:
    "Verificación técnica; no sustituye revisión editorial, visual ni de naturalidad de la voz.",
  validatedAt: new Date().toISOString(),
};
fs.writeFileSync(
  `${out}/validacion_tecnica.json`,
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      technicalStatus: report.technicalStatus,
      file,
      duration: 70,
      frames: 2100,
      distinctFrames: distinct,
      words: captions.length,
      semanticEvents: sync.length,
      sha256: report.sha256,
    },
    null,
    2,
  ),
);

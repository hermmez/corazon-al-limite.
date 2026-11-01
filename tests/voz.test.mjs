import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { createRequire } from "node:module";
import { alignmentToCaptions, splitAlignedScenes } from "../scripts/voz/alineacion.mjs";
import { isMexicanMale } from "../scripts/voz/catalogo.mjs";
import { generateNarration, requestFingerprint } from "../scripts/generar-narracion.mjs";

const require = createRequire(import.meta.url);
const load = (file, overrides = {}) => {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function("require", "module", "exports", source)((id) => id in overrides ? overrides[id] : require(id), module, module.exports);
  return module.exports;
};
const assets = load("src/video-2d/assets.ts");
const scriptHelpers = load("src/video-2d/script.ts", { "./assets": assets });
const { syncNarrationScript } = load("src/video-2d/narration.ts", { "./script": scriptHelpers });
const base = JSON.parse(fs.readFileSync("src/PrimerVideoSueno/script.json", "utf8"));

// Synthetic character timings are test data only, never saved as production audio.
const alignmentFixture = (text) => ({
  characters: [...text],
  characterStartTimesSeconds: [...text].map((_, i) => i * 0.05),
  characterEndTimesSeconds: [...text].map((_, i) => (i + 1) * 0.05),
});
const sampleManifest = () => {
  const scenes = base.scenes.slice(0, 2), text = scenes.map((s) => s.narration.text).join(" ");
  const alignment = alignmentFixture(text);
  const captions = alignmentToCaptions(text, alignment);
  return { schemaVersion: 1, status: "generated", mode: "prueba", leadInSeconds: 0.15, tailSeconds: 0.2,
    clips: splitAlignedScenes(scenes, captions, { src: "voz/prueba/test.mp3", durationSeconds: text.length * 0.05 + 0.1, sha256: "test-fixture-only" }) };
};

test("word captions preserve Spanish punctuation, accents and actual character boundaries", () => {
  const text = "¿Dormir poco? Sí, afecta tu atención.";
  const captions = alignmentToCaptions(text, alignmentFixture(text));
  assert.equal(captions.map((c) => c.text).join(""), text);
  assert.equal(captions[1].startMs, 400);
  assert.equal(captions[4].pageBreakAfter, true);
  assert.ok(captions.every((c, i) => c.confidence === null && c.endMs > c.startMs && (!i || c.startMs >= captions[i - 1].endMs)));
});
test("missing or mismatched alignment is rejected instead of inventing timestamps", () => {
  assert.throws(() => alignmentToCaptions("Hola", null), /alineación/);
  assert.throws(() => alignmentToCaptions("Hola", alignmentFixture("Otra")), /alineación/);
});
test("one MP3 can be split between two scenes without overlapping source intervals", () => {
  const manifest = sampleManifest();
  const [a, b] = manifest.clips;
  assert.equal(a.offsetSeconds + a.durationSeconds, b.offsetSeconds);
  assert.equal(a.src, b.src);
  assert.equal(b.captions.map((c) => c.text).join(""), base.scenes[1].narration.text);
  assert.ok(b.captions[0].startMs >= 0);
});
test("audio-derived timeline uses measured durations, frame-safe boundaries and real captions", () => {
  const original = JSON.stringify(base), manifest = sampleManifest();
  const result = syncNarrationScript(base, manifest, { timing: "audio", voiceTest: true });
  assert.equal(result.scenes.length, 2);
  assert.equal(result.scenes[1].start, result.scenes[0].end);
  assert.ok(Math.abs(result.durationSeconds * 30 - Math.round(result.durationSeconds * 30)) < 1e-8);
  assert.equal(result.scenes[0].narration.src, manifest.clips[0].src);
  assert.equal(result.scenes[0].captionTiming, "elevenlabs_character_alignment");
  assert.equal(JSON.stringify(base), original);
});
test("preserve timing extends long speech rather than cutting it", () => {
  const manifest = sampleManifest();
  const clip = manifest.clips[0];
  clip.durationSeconds = 15;
  clip.audioDurationSeconds = 30;
  const result = syncNarrationScript(base, manifest);
  assert.ok(result.scenes[0].end > 15);
  assert.equal(result.scenes[1].start, result.scenes[0].end);
  assert.ok(result.durationSeconds > 90);
});
test("a pending manifest preserves the approved silent 90-second composition", () => {
  const manifest = { schemaVersion: 1, status: "pending", mode: "episodio", clips: [], leadInSeconds: 0.15, tailSeconds: 0.2 };
  assert.deepEqual(syncNarrationScript(base, manifest), base);
});
test("wrong scripts and audio path traversal are rejected", () => {
  const manifest = sampleManifest();
  manifest.clips[0].text = "Otro guion";
  assert.throws(() => syncNarrationScript(base, manifest), /guion actual/);
  manifest.clips[0].text = base.scenes[0].narration.text;
  manifest.clips[0].src = "voz/../private.mp3";
  assert.throws(() => syncNarrationScript(base, manifest), /MP3 local/);
});
test("voice selection requires male Mexican evidence; no automatic English fallback", () => {
  assert.equal(isMexicanMale({ gender: "male", locale: "es-MX" }), true);
  assert.equal(isMexicanMale({ gender: "female", locale: "es-MX" }), false);
  assert.equal(isMexicanMale({ gender: "male", accent: "american" }), false);
});
test("fingerprint invalidates the cache when text, voice or settings change", () => {
  const c = { voiceId: "one", modelId: "m", outputFormat: "mp3", voiceSettings: { speed: 1 } };
  assert.notEqual(requestFingerprint(c, "Hola"), requestFingerprint(c, "Otro"));
  assert.notEqual(requestFingerprint(c, "Hola"), requestFingerprint({ ...c, voiceId: "two" }, "Hola"));
  assert.notEqual(requestFingerprint(c, "Hola"), requestFingerprint({ ...c, voiceSettings: { speed: 0.9 } }, "Hola"));
});
test("full episode is blocked before any API call unless explicitly confirmed", async () => {
  await assert.rejects(generateNarration({ mode: "episodio" }), /--confirm-full/);
});

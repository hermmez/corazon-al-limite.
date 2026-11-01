import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import { createTikTokStyleCaptions } from "@remotion/captions";
const require = createRequire(import.meta.url);
const load = (file, overrides = {}) => {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  new Function("require", "module", "exports", source)(
    (id) => (id in overrides ? overrides[id] : require(id)),
    module,
    module.exports,
  );
  return module.exports;
};
const assets = load("src/video-2d/assets.ts");
const { loadStoryScript } = load("src/video-2d/script.ts", {
  "./assets": assets,
});
const script = loadStoryScript(
  JSON.parse(fs.readFileSync("src/PrimerVideoSueno/script.json", "utf8")),
);
const motion = load("src/video-2d/motion.ts");
assert.equal(script.scenes.length, 8);
assert.equal(script.fps, 30);
assert.equal(script.durationSeconds * script.fps, 2700);
assert.deepEqual(
  script.scenes.map((s) => [s.start, s.end]),
  [
    [0, 10],
    [10, 22],
    [22, 34],
    [34, 46],
    [46, 58],
    [58, 70],
    [70, 82],
    [82, 90],
  ],
);
const used = new Set();
for (const scene of script.scenes) {
  for (const key of Object.values(scene.assets)) {
    const asset = assets.ASSETS[key];
    assert.match(
      asset.path,
      /^imagenes\/(personajes|anatomia|ciencia|escenarios)\/[^/]+\.png$/,
    );
    const file = path.join("public", asset.path),
      png = fs.readFileSync(file);
    assert.ok(
      png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    );
    assert.ok(
      Math.abs(png.readUInt32BE(16) / png.readUInt32BE(20) - asset.aspect) <
        0.00001,
    );
    used.add(file);
  }
  const { pages } = createTikTokStyleCaptions({
    captions: scene.captions,
    combineTokensWithinMilliseconds: 100000,
  });
  assert.equal(pages.map((p) => p.text.trim()).join(" "), scene.narration.text);
  assert.ok(
    pages.every((p) => p.tokens.length <= 5),
    "Máximo cinco palabras por página",
  );
  if (!scene.narration.src)
    assert.ok(
      scene.captions.every((c) => c.confidence === null && c.timestampMs === null),
    );
  assert.equal(scene.narration.locale, "es-MX");
  if (scene.narration.src)
    assert.ok(
      fs.existsSync(path.join("public", scene.narration.src)),
      "Falta el audio asignado",
    );
  else assert.equal(scene.narration.status, "pending");
}
let maxStep = 0,
  maxZoomStep = 0;
for (let frame = 0; frame < 2700; frame++) {
  const t = frame / 30,
    a = motion.cameraAt(t, script.scenes),
    b = motion.cameraAt((frame + 1) / 30, script.scenes);
  assert.ok(Object.values(a).every(Number.isFinite));
  assert.ok(a.zoom > 0.8 && a.zoom < 1.2);
  const step = Math.hypot(b.x - a.x, b.y - a.y);
  maxStep = Math.max(maxStep, step);
  maxZoomStep = Math.max(maxZoomStep, Math.abs(a.zoom - b.zoom));
  assert.ok(step < 45, "Salto de cámara");
  assert.ok(Math.abs(a.zoom - b.zoom) < 0.03);
  const tr = motion.transitionAt(t, script.scenes);
  if (tr) {
    const p = motion.curve(tr.index, tr.progress);
    assert.ok(
      Math.hypot(p.x - a.x, p.y - a.y) < 0.001,
      "La cámara debe seguir la señal",
    );
  }
}
console.log(
  JSON.stringify(
    {
      status: "passed",
      frames: 2700,
      scenes: 8,
      approvedImagesUsed: used.size,
      captionTiming: "estimated_from_script_not_audio",
      voiceFilesAssigned: script.scenes.filter((s) => s.narration.src).length,
      maxCameraStep: maxStep,
      maxZoomStep,
    },
    null,
    2,
  ),
);

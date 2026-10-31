import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const loadMotion = (folder) => {
  const module = { exports: {} };
  const compiled = ts.transpileModule(
    fs.readFileSync(`src/${folder}/motion.ts`, "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  new Function("require", "module", "exports", compiled)(
    require,
    module,
    module.exports,
  );
  return module.exports;
};
const approved = loadMotion("DemoProfesional2D");
const fluid = loadMotion("DemoProfesional2DFluida");
assert.deepEqual(fluid.C, approved.C, "La paleta aprobada debe conservarse");
assert.equal(
  fluid.signalPath,
  approved.signalPath,
  "Se conserva el recorrido visual aprobado",
);
const media = (folder) =>
  fs
    .readdirSync(`src/${folder}`)
    .filter((f) => f.endsWith(".tsx"))
    .flatMap((f) =>
      [
        ...fs
          .readFileSync(`src/${folder}/${f}`, "utf8")
          .matchAll(/staticFile\((['"`])([^'"`]+)\1\)/g),
      ].map((m) => m[2]),
    )
    .sort();
assert.deepEqual(media("DemoProfesional2DFluida"), media("DemoProfesional2D"));
const lineArrays = (folder) =>
  fs
    .readdirSync(`src/${folder}`)
    .filter((f) => f.startsWith("El") || f.startsWith("La"))
    .flatMap((f) =>
      [
        ...fs
          .readFileSync(`src/${folder}/${f}`, "utf8")
          .matchAll(/lines=\{(\[[\s\S]*?\])\}/g),
      ].map((m) => JSON.parse(m[1])),
    );
assert.deepEqual(
  lineArrays("DemoProfesional2DFluida"),
  lineArrays("DemoProfesional2D"),
);
const stats = (motion) => {
  const cameras = Array.from({ length: 901 }, (_, i) =>
    motion.cameraAt(i / 30),
  );
  const speeds = cameras.slice(1).map((c, i) => ({
    x: c.x - cameras[i].x,
    y: c.y - cameras[i].y,
    z: c.zoom - cameras[i].zoom,
  }));
  return {
    maxTranslationPerFrame: Math.max(
      ...speeds.map((s) => Math.hypot(s.x, s.y)),
    ),
    maxAcceleration: Math.max(
      ...speeds
        .slice(1)
        .map((s, i) => Math.hypot(s.x - speeds[i].x, s.y - speeds[i].y)),
    ),
    maxZoomPerFrame: Math.max(...speeds.map((s) => Math.abs(s.z))),
  };
};
const before = stats(approved),
  after = stats(fluid);
assert.ok(
  after.maxTranslationPerFrame < before.maxTranslationPerFrame * 0.8,
  "Debe reducirse la velocidad máxima de cámara",
);
assert.ok(
  after.maxAcceleration < before.maxAcceleration,
  "Debe reducirse el cambio brusco de velocidad",
);
assert.ok(after.maxZoomPerFrame < 0.025);
let lastHead = 0,
  lastBody = 0;
for (let frame = 0; frame < 900; frame++) {
  const time = frame / 30,
    camera = fluid.cameraAt(time),
    p = fluid.travelProgress(time),
    signal = fluid.signalAtDistance(p);
  assert.ok(Object.values(camera).every(Number.isFinite));
  assert.ok(camera.zoom >= 1 && camera.zoom <= 1.81);
  if (time >= 13.4 && time <= 17.1)
    assert.ok(
      Math.hypot(signal.x - camera.x, signal.y - camera.y) * camera.zoom < 30,
      "La cámara debe seguir la señal",
    );
  const head = fluid.headRadius(time),
    body = fluid.bodyRadius(time);
  assert.ok(
    head >= lastHead && body >= lastBody,
    "Las máscaras no deben retroceder ni saltar",
  );
  lastHead = head;
  lastBody = body;
  const beat = fluid.heartBeat(time);
  assert.ok(beat.phase >= 0 && beat.phase < 1 && beat.impulse <= 1.41);
}
assert.deepEqual(fluid.cameraAt(0), approved.cameraAt(0));
assert.deepEqual(fluid.cameraAt(30), approved.cameraAt(30));
const steps = Array.from({ length: 101 }, (_, i) =>
  fluid.signalAtDistance(i / 100),
);
const spacing = steps
  .slice(1)
  .map((point, i) => Math.hypot(point.x - steps[i].x, point.y - steps[i].y));
assert.ok(
  Math.max(...spacing) / Math.min(...spacing) < 1.01,
  "El recorrido debe tener espaciado uniforme",
);
console.log(
  "OK: paleta, recursos, textos, cámaras, máscaras y señal en 900 fotogramas.",
);
console.log(JSON.stringify({ approved: before, fluid: after }, null, 2));

const luminance = (channels) =>
  channels
    .map((value) => {
      value /= 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
let minContrast = Infinity;
for (let i = 0; i <= 1000; i++) {
  const dark = i / 1000;
  const ink = fluid.readableInk(dark);
  assert.ok([fluid.C.ink, fluid.C.cream].includes(ink));
  const bg = require("remotion")
    .interpolateColors(dark, [0, 1], [fluid.C.cream, "#0C233E"])
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number);
  const rgb = ink === fluid.C.ink ? [17, 44, 71] : [255, 244, 224];
  const a = luminance(bg),
    b = luminance(rgb);
  minContrast = Math.min(
    minContrast,
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
  );
}
assert.ok(
  minContrast >= 3.3,
  "El texto principal debe conservar el contraste durante las transiciones",
);
console.log("Contraste mínimo del texto principal:", minContrast.toFixed(2));

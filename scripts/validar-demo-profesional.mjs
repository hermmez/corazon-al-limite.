import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const required = [
  "personajes/01_neutral.png",
  "personajes/11_sorprendido.png",
  "personajes/12_preocupado.png",
  "personajes/20_respirando.png",
  "personajes/02_explicando.png",
  "anatomia/01_cerebro_completo.png",
  "anatomia/03_corazon_humano.png",
];
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
assert.equal(
  readdirSync("public/imagenes/personajes").filter((n) => n.endsWith(".png"))
    .length,
  30,
);
for (const file of required) {
  const bytes = readFileSync(`public/imagenes/${file}`);
  assert.ok(bytes.subarray(0, 8).equals(png), `PNG inválido: ${file}`);
  assert.equal(bytes[25], 6, `Falta canal alfa: ${file}`);
  console.log(
    file,
    bytes.readUInt32BE(16),
    "×",
    bytes.readUInt32BE(20),
    "RGBA",
  );
}
const sources = readdirSync("src/DemoProfesional2D")
  .filter((n) => n.endsWith(".tsx"))
  .map((n) => readFileSync(`src/DemoProfesional2D/${n}`, "utf8"))
  .join("\n");
const paths = [...sources.matchAll(/staticFile\((['"`])([^'"`]+)\1\)/g)].map(
  (m) => m[2],
);
assert.equal(paths.length, 3, "Se esperan un cargador de poses y dos órganos");
for (const file of paths) {
  assert.ok(
    file.startsWith("imagenes/personajes/") ||
      file.startsWith("imagenes/anatomia/"),
    `Ruta ajena a la biblioteca: ${file}`,
  );
}
// Check motion invariants using the actual animation functions, without a browser.
const compiled = ts.transpileModule(
  readFileSync("src/DemoProfesional2D/motion.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
const module = { exports: {} };
new Function("require", "module", "exports", compiled)(
  createRequire(import.meta.url),
  module,
  module.exports,
);
const { cameraAt, signalPoint, heartBeat } = module.exports;
assert.deepEqual(signalPoint(0), { x: 540, y: 740 });
assert.deepEqual(signalPoint(1), { x: 575, y: 1180 });
for (let frame = 0; frame < 900; frame++) {
  const time = frame / 30;
  const camera = cameraAt(time);
  const next = cameraAt((frame + 1) / 30);
  assert.ok(
    Object.values(camera).every(Number.isFinite),
    `Cámara inválida: ${frame}`,
  );
  assert.ok(camera.zoom >= 1 && camera.zoom <= 1.81);
  assert.ok(
    Math.hypot(next.x - camera.x, next.y - camera.y) < 25,
    `Salto de cámara: ${frame}`,
  );
  assert.ok(
    Math.abs(next.zoom - camera.zoom) < 0.04,
    `Salto de zoom: ${frame}`,
  );
  const beat = heartBeat(time);
  assert.ok(
    beat.phase >= 0 && beat.phase <= 1 && Number.isFinite(beat.impulse),
  );
}
console.log(
  "OK: siete PNG, rutas oficiales, continuidad de cámara y pulsaciones durante 900 fotogramas.",
);

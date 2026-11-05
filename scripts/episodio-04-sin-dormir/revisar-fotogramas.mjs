import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {bundle} from "@remotion/bundler";
import {openBrowser, renderStill, selectComposition} from "@remotion/renderer";

const output = path.resolve("output/episodio-04-sueno");
const publicDir = path.join(output, "revision-interna/public");
assert.ok(fs.existsSync(publicDir), "Ejecutar antes auditar_recursos.py");
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  outDir: path.join(output, "revision-interna/bundle"),
  publicDir,
  enableCaching: false,
});
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({serveUrl, id: "Episodio04SinDormir", browserInstance: browser});
  assert.equal(composition.width, 1080);
  assert.equal(composition.height, 1920);
  assert.equal(composition.fps, 30);
  assert.equal(composition.durationInFrames, 2100);
  const frames = process.argv.length > 2 ? process.argv.slice(2).map(Number) : [60, 360, 600, 940, 1150, 1450, 1750, 1990];
  for (const frame of frames) {
    await renderStill({serveUrl, composition, browserInstance: browser, frame,
      output: path.join(output, `revision-${frame}.png`), imageFormat: "png"});
    console.log(`Fotograma ${frame} listo`);
  }
  fs.writeFileSync(path.join(output, "revision-tecnica-composicion.json"), JSON.stringify({
    composition: composition.id, width: composition.width, height: composition.height,
    fps: composition.fps, frames: composition.durationInFrames,
    durationSeconds: composition.durationInFrames / composition.fps,
    stillFramesRendered: frames, typecheck: "passed",
    finalVideoExported: false, finalAudioValidated: false,
    captionAlignmentValidated: false, status: "visual-review-awaiting-voice",
  }, null, 2) + "\n");
} finally {
  await Promise.race([browser.close({silent: true}), new Promise((resolve) => setTimeout(resolve, 5000))]);
}
// El bundler puede conservar workers abiertos en Windows después de terminar las imágenes.
process.exit(0);

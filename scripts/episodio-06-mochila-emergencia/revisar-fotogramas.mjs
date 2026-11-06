import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {openBrowser, renderStill, selectComposition} from "@remotion/renderer";
import {compositionId, fingerprint, output, prepareBundle} from "./bundle.mjs";
const {serveUrl,close} = await prepareBundle();
console.log("Paquete de revisión preparado");
const browser = await openBrowser("chrome");
console.log("Navegador de revisión iniciado");
try {
  const composition = await selectComposition({serveUrl, id: compositionId, browserInstance: browser, inputProps: {externalAudio: true}});
  console.log("Composición seleccionada");
  assert.deepEqual([composition.width, composition.height, composition.fps, composition.durationInFrames], [1080, 1920, 30, 2100]);
  const frames = process.argv.length > 2 ? process.argv.slice(2).map(Number) : [35, 62, 109, 286, 344, 429, 490, 556, 646, 791, 899, 949, 985, 1152, 1372, 1491, 1647, 1749, 1828, 1985, 2070];
  for (const frame of frames) {
    await renderStill({serveUrl, composition, browserInstance: browser, inputProps: {externalAudio: true}, frame, scale: .42, imageFormat: "png", output: path.join(output, "revision-" + frame + ".png")});
    console.log("Revisión " + frame + "/2100");
  }
  fs.writeFileSync(path.join(output, "revision-composicion.json"), JSON.stringify({composition: compositionId, width: 1080, height: 1920, fps: 30, frames: 2100, duration: 70, lowResolutionStillFrames: frames, sourceFingerprint: fingerprint(), fullMovieRendered: false}, null, 2) + "\n");
} finally {
  close();
  await Promise.race([browser.close({silent: true}), new Promise(resolve => setTimeout(resolve, 5000))]);
}
process.exit(0);

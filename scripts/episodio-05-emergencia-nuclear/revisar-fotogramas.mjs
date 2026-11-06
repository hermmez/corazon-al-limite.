import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {openBrowser, renderStill, selectComposition} from "@remotion/renderer";
import {compositionId, fingerprint, output, prepareBundle} from "./bundle.mjs";
const serveUrl = await prepareBundle();
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({serveUrl, id: compositionId, browserInstance: browser, inputProps: {externalAudio: true}});
  assert.deepEqual([composition.width, composition.height, composition.fps, composition.durationInFrames], [1080, 1920, 30, 2100]);
  const frames = process.argv.length > 2 ? process.argv.slice(2).map(Number) : [60, 170, 390, 525, 650, 790, 920, 1040, 1100, 1230, 1380, 1500, 1650, 1780, 1880, 2050];
  for (const frame of frames) {
    await renderStill({serveUrl, composition, browserInstance: browser, inputProps: {externalAudio: true}, frame, scale: .5, imageFormat: "png", output: path.join(output, "revision-" + frame + ".png")});
    console.log("Revisión " + frame + "/2100");
  }
  fs.writeFileSync(path.join(output, "revision-composicion.json"), JSON.stringify({composition: compositionId, width: 1080, height: 1920, fps: 30, frames: 2100, duration: 70, lowResolutionStillFrames: frames, sourceFingerprint: fingerprint(), fullMovieRendered: false}, null, 2) + "\n");
} finally {
  await Promise.race([browser.close({silent: true}), new Promise(resolve => setTimeout(resolve, 5000))]);
}
process.exit(0);

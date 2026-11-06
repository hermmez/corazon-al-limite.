import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {openBrowser, renderFrames, selectComposition} from "@remotion/renderer";
import {compositionId,fingerprint,output,prepareBundle} from "./bundle.mjs";

const {serveUrl,close}=await prepareBundle();
const browser=await openBrowser("chrome");
const inputProps={externalAudio:true};
const frames=[];
const [first,last,step]=process.argv.length===5 ? process.argv.slice(2).map(Number) : [1040,2099,65];
try {
  const composition=await selectComposition({serveUrl,id:compositionId,browserInstance:browser,inputProps});
  assert.deepEqual([composition.width,composition.height,composition.fps,composition.durationInFrames],[1080,1920,30,2100]);
  await renderFrames({serveUrl,composition,puppeteerInstance:browser,inputProps,frameRange:[first,last],everyNthFrame:step,scale:.36,imageFormat:"jpeg",jpegQuality:78,outputDir:null,muted:true,concurrency:1,disableSharedMemoryCapture:true,
    onFrameBuffer:async(buffer,frame)=>{
      await fs.writeFile(path.join(output,"revision-interna",`revision-${frame}.jpg`),buffer);
      frames.push(frame);
      console.log(`Revisión ${frame}/2100`);
    },
  });
  await fs.writeFile(path.join(output,`revision-rango-${first}.json`),JSON.stringify({composition:compositionId,frames,sourceFingerprint:fingerprint(),scale:.36,fullMovieRendered:false},null,2)+"\n");
} finally {
  close();
  await Promise.race([browser.close({silent:true}),new Promise(resolve=>setTimeout(resolve,5000))]);
}
process.exit(0);

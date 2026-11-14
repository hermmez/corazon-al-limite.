import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {mkdirSync} from 'node:fs';
import {bundle} from '@remotion/bundler';
import {getCompositions,renderStill,openBrowser} from '@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url));
const out=process.env.EPISODE_OUTPUT_DIR || resolve(root,'out/un-dia-vas-a-extranar-este-momento/control');
mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:root+'/src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser});
const composition=compositions.find(c=>c.id==='UnDiaVasAExtranarEsteMomento');
for(const frame of [0,45,75,135,240,420,630,744,930,1230,1380,1500,1605,1740,1905,2070]){
 await renderStill({serveUrl,composition,frame,output:`${out}/f${String(frame).padStart(4,'0')}.png`,scale:.5,puppeteerInstance:browser});
 console.log('Checked frame',frame);
}
await browser.close({silent:true});

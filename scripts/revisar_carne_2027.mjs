import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {mkdirSync,writeFileSync} from 'node:fs';
import {bundle} from '@remotion/bundler';
import {getCompositions,renderStill,openBrowser} from '@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url));
const out=process.env.EPISODE_OUTPUT_DIR||resolve(root,'out/carne-mexico-2027/control');
mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:resolve(root,'src/index.ts')});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
try{
 const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser});
 const composition=compositions.find(c=>c.id==='CarneMexico2027');
 const frames=[...new Set([0,30,60,90,135,180,...Array.from({length:70},(_,s)=>[s*30+2,s*30+28]).flat()])].sort((a,b)=>a-b);
 for(let i=0;i<frames.length;i++){
  const frame=frames[i];
  await renderStill({serveUrl,composition,frame,output:resolve(out,`f${String(frame).padStart(4,'0')}.png`),scale:.25,puppeteerInstance:browser});
  if(i%20===0)console.log('Fotogramas de control',i+1,'/',frames.length);
 }
 writeFileSync(resolve(out,'frames.json'),JSON.stringify(frames));
 console.log('Control de los 70 segundos preparado');
}finally{await browser.close({silent:true});}

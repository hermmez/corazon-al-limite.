import{fileURLToPath}from'node:url';
import{resolve}from'node:path';
import{mkdirSync,writeFileSync}from'node:fs';
import{bundle}from'@remotion/bundler';
import{openBrowser,getCompositions,renderStill}from'@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url));
const out=process.env.EPISODE_OUTPUT_DIR||resolve(root,'out/pez-luna-oceanico/control');mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:resolve(root,'src/index.ts')});
const browser=await openBrowser('chrome',{browserExecutable:process.env.REMOTION_BROWSER||'/usr/bin/chromium'});
try{
 const composition=(await getCompositions(serveUrl,{puppeteerInstance:browser})).find(c=>c.id==='PezLunaOceanico');
 const frames=process.env.ALL_SECONDS==='1'?[...new Set([0,30,60,90,145,255,...Array.from({length:70},(_,s)=>[s*30+2,s*30+28]).flat()])].sort((a,b)=>a-b):[0,90,145,255,460,700,930,1080,1230,1275,1500,1575,1615,1665,1810,2060];
 for(let i=0;i<frames.length;i++){
  await renderStill({serveUrl,composition,frame:frames[i],output:resolve(out,`f${String(frames[i]).padStart(4,'0')}.png`),scale:.35,puppeteerInstance:browser});
  if(i%10===0)console.log('Control',i+1,'/',frames.length);
 }
 writeFileSync(resolve(out,'frames.json'),JSON.stringify(frames));
 console.log('Capturas de control preparadas');
}finally{await browser.close({silent:true});}

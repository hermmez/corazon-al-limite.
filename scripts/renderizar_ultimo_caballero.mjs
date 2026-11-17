import {resolve} from 'node:path';
import {mkdirSync,existsSync,writeFileSync} from 'node:fs';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia} from '@remotion/renderer';
const out=resolve(process.env.EPISODE_OUTPUT_DIR||'out/ultimo-caballero');mkdirSync(out,{recursive:true});
const mode=process.argv[2]||'preview';if(!['preview','final'].includes(mode))throw new Error('preview|final');
const cache=process.env.EPISODE_BUNDLE||resolve('out/ultimo-caballero/bundle');
const serveUrl=process.env.SKIP_BUNDLE==='1'?cache:await bundle({entryPoint:resolve('src/index.ts'),outDir:cache,enableCaching:true});
const output=resolve(out,mode==='preview'?'vista-previa-10s.mp4':'montaje-remotion.mp4');if(existsSync(output))throw new Error('Output exists: '+output);
const browser=await openBrowser('chrome',{browserExecutable:process.env.REMOTION_BROWSER||'/usr/bin/chromium'});
try{const composition=await selectComposition({serveUrl,id:'UltimoCaballero',puppeteerInstance:browser});const started=Date.now();
 await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:output,codec:'h264',audioCodec:'aac',pixelFormat:'yuv420p',imageFormat:'jpeg',crf:mode==='preview'?25:18,scale:mode==='preview'?.5:1,concurrency:2,frameRange:mode==='preview'?[0,299]:undefined,onProgress:({renderedFrames,encodedFrames})=>{if(renderedFrames%150===0)console.log('Frames',renderedFrames,'encoded',encodedFrames);}});
 writeFileSync(output+'.render.json',JSON.stringify({durationInFrames:mode==='preview'?300:2100,seconds:mode==='preview'?10:70,scale:mode==='preview'?.5:1,elapsedSeconds:(Date.now()-started)/1000,output},null,2)+'\n');console.log('Completado',output);
}finally{await browser.close({silent:true});}

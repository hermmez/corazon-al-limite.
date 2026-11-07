const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const fs=require('node:fs');
(async()=>{
 fs.mkdirSync('out/episodio-09/revision',{recursive:true});
 const serveUrl=await bundle({entryPoint:'src/index.ts'});
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
 const composition=await selectComposition({serveUrl,id:'Episodio09',puppeteerInstance:browser});
 fs.writeFileSync('out/episodio-09/composition.json',JSON.stringify(composition,null,2));
 const frames=process.argv.slice(2).length?process.argv.slice(2).map(Number):[50,140,210,340,450,570,730,880,954,985,1160,1275,1435,1570,1680,1800,1990,2085];
 for(const frame of frames){
  await renderStill({serveUrl,composition,frame,output:`out/episodio-09/revision/${String(frame).padStart(4,'0')}.png`,scale:.5,puppeteerInstance:browser,logLevel:'error'});
  console.log(`Revisado frame ${frame}`);
 }
 await browser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});

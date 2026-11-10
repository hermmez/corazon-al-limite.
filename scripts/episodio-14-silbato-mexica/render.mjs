import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
import {bundle} from "@remotion/bundler";
import {openBrowser, renderFrames, renderStill, selectComposition} from "@remotion/renderer";

const preview = process.argv.includes("--stills");
const output = path.resolve("output/episodio-14-silbato-mexica/revision-interna");
const publicDir = path.join(output, "public-render");
const target = path.join(output, "episodio14-en-proceso.mp4");
fs.mkdirSync(publicDir, {recursive:true});
fs.cpSync("public/episodio-14/ilustraciones", path.join(publicDir,"episodio-14/ilustraciones"), {recursive:true,force:true});
fs.mkdirSync(path.join(publicDir,"imagenes/personajes"),{recursive:true});
fs.copyFileSync("public/imagenes/personajes/12_preocupado.png",path.join(publicDir,"imagenes/personajes/12_preocupado.png"));
const serveUrl = await bundle({entryPoint:path.resolve("src/index.ts"),publicDir,outDir:path.join(output,"bundle")});
const browser = await openBrowser("chrome");
const inputProps = {externalAudio:true};
let encoder;
try {
  const composition = await selectComposition({serveUrl, id:"Episodio14SilbatoMexica", browserInstance:browser,inputProps});
  assert.deepEqual([composition.width,composition.height,composition.fps,composition.durationInFrames],[1080,1920,30,2100]);
  assert.equal(composition.props.externalAudio,true);
  if (preview) {
    const frames = process.argv.slice(3).map(Number);
    assert.ok(frames.length>0 && frames.every(f=>Number.isInteger(f)&&f>=0&&f<2100));
    for (const frame of frames) {
      await renderStill({serveUrl,composition,puppeteerInstance:browser,inputProps,frame,scale:.5,imageFormat:"jpeg",jpegQuality:88,
        output:path.join(output,"revision-"+frame+".jpg"),disableSharedMemoryCapture:true});
      console.log("Revisión "+frame);
    }
  } else {
    const timeline = JSON.parse(fs.readFileSync("src/episodios/episodio-14-silbato-mexica/timeline.json","utf8"));
    const audio = path.resolve("public/episodio-14/audio/mezcla_final_70s.wav");
    assert.ok(timeline.audioReady && fs.existsSync(audio), "Faltan voz y subtítulos verificados");
    assert.ok(!fs.existsSync(target), "Conservar el archivo de la exportación anterior");
    assert.ok(process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH), "Configurar FFMPEG_PATH");
    encoder = spawn(process.env.FFMPEG_PATH, [
      "-hide_banner","-loglevel","error","-f","image2pipe","-vcodec","png","-framerate","30","-i","pipe:0","-i",audio,
      "-map","0:v:0","-map","1:a:0","-vf","scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709",
      "-c:v","libx264","-profile:v","high","-preset","medium","-crf","17","-threads","2","-r","30","-frames:v","2100",
      "-color_range","tv","-colorspace","bt709","-color_primaries","bt709","-color_trc","bt709",
      "-c:a","aac","-b:a","179k","-ar","48000","-t","70","-movflags","+faststart","-map_metadata","-1",target
    ], {stdio:["pipe","ignore","pipe"],windowsHide:true});
    let errorLog="";
    encoder.stdin.on("error",()=>{});
    encoder.stderr.on("data",chunk=>{errorLog=(errorLog+chunk).slice(-9000);});
    const completed = new Promise((resolve,reject)=>{
      encoder.once("error",reject);
      encoder.once("close",code=>code===0?resolve():reject(new Error("FFmpeg "+code+": "+errorLog)));
    });
    completed.catch(()=>{});
    let frames=0;
    const started=Date.now();
    await renderFrames({serveUrl,composition,puppeteerInstance:browser,inputProps,imageFormat:"png",
      outputDir:null,concurrency:1,muted:true,disableSharedMemoryCapture:true,
      onFrameBuffer:async (buffer,frame)=>{
        assert.equal(frame,frames,"Fotogramas fuera de orden");
        await new Promise((resolve,reject)=>encoder.stdin.write(buffer,error=>error?reject(new Error(error.message+" "+errorLog)):resolve()));
        frames++;
        if(frames%150===0||frames===2100)console.log("Captura "+frames+"/2100 · "+((Date.now()-started)/1000).toFixed(1)+" s");
      }
    });
    assert.equal(frames,2100);
    encoder.stdin.end();
    await completed;
    console.log(target);
  }
} finally {
  encoder?.stdin?.destroy();
  if(encoder && encoder.exitCode===null)encoder.kill();
  await Promise.race([browser.close({silent:true}),new Promise(resolve=>setTimeout(resolve,5000))]);
}
process.exit(0);

const {readFileSync,existsSync,mkdirSync,writeFileSync,renameSync}=require('node:fs');
const {bundle}=require('@remotion/bundler');
const {selectComposition,renderMedia}=require('@remotion/renderer');
const {execFileSync}=require('node:child_process');
(async()=>{
 const draft=process.argv.includes('--borrador');
 const manifest=JSON.parse(readFileSync('src/episodio09/audio-manifest.json','utf8'));
 if(!draft&&(manifest.status!=='ready'||manifest.captionStatus!=='aligned-reviewed'||!existsSync('public/'+manifest.src))){
  throw new Error('La exportación FINAL requiere voz Grady integrada y subtítulos alineados y revisados. Usa --borrador para revisar únicamente la animación.');
 }
 mkdirSync('out/episodio-09',{recursive:true});
 const outputLocation=draft?'out/episodio-09/episodio-09-BORRADOR-sin-voz.mp4':'out/episodio-09/episodio-09-final.mp4';
 if(existsSync(outputLocation)&&!process.argv.includes('--reemplazar'))throw new Error('Ya existe la exportación. Evita trabajo duplicado; usa --reemplazar solo si cambió la composición.');
 const serveUrl=await bundle({entryPoint:'src/index.ts'});
 const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||'/usr/bin/chromium';
 const composition=await selectComposition({serveUrl,id:'Episodio09',browserExecutable});
 if(composition.durationInFrames!==2100||composition.fps!==30||composition.width!==1080||composition.height!==1920)throw new Error('Configuración diferente de la requerida.');
 let last=-1;
 await renderMedia({serveUrl,composition,outputLocation,browserExecutable,codec:'h264',audioCodec:'aac',enforceAudioTrack:true,pixelFormat:'yuv420p',crf:18,x264Preset:'medium',concurrency:2,logLevel:'error',metadata:{title:'Corazón al Límite — Episodio 09',comment:draft?'BORRADOR: pista AAC silenciosa. Grady pendiente; subtítulos provisionales.':'Narración Grady vía Higgsfield; subtítulos alineados.'},onProgress:({progress})=>{let p=Math.floor(progress*20)*5;if(p>last){last=p;console.log(`${p}%`);}}});
 let probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',outputLocation]));
 // AAC puede introducir relleno de un bloque. Corrige la duración del contenedor
 // copiando H.264 sin volver a renderizar ni recodificar la imagen.
 if(Math.abs(Number(probe.format.duration)-70)>.0001){
  const temp=outputLocation+'.duration.tmp.mp4';
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',outputLocation,'-map','0:v:0','-map','0:a:0','-c:v','copy','-c:a','aac','-af','atrim=duration=70,asetpts=PTS-STARTPTS','-t','70','-movflags','+faststart',temp]);
  renameSync(temp,outputLocation);
  probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',outputLocation]));
 }
 const v=probe.streams.find(s=>s.codec_type==='video');const a=probe.streams.find(s=>s.codec_type==='audio');
 if(v.codec_name!=='h264'||a?.codec_name!=='aac'||v.width!==1080||v.height!==1920||v.r_frame_rate!=='30/1'||Number(v.nb_frames)!==2100||Math.abs(Number(v.duration)-70)>.0001||Math.abs(Number(probe.format.duration)-70)>.0001||Math.abs(Number(a.duration)-70)>.0001)throw new Error('El archivo exportado no cumple con la configuración.');
 writeFileSync(outputLocation+'.json',JSON.stringify({draft,audioStatus:manifest.status,captionStatus:manifest.captionStatus,...probe},null,2));
 console.log(`Exportación verificada: ${outputLocation}`);
})().catch(e=>{console.error(e);process.exit(1)});

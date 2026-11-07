// Importación local: no llama ElevenLabs ni consume créditos.
// Uso: node scripts/episodio-09/integrar-audio.mjs VOZ.wav CAPTIONS.json --revisado
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const [audioPath,captionsPath]=process.argv.slice(2);
if(!audioPath||!captionsPath||!process.argv.includes('--revisado'))throw new Error('Se requiere voz Grady de Higgsfield, Caption[] alineado al audio REAL y revisión auditiva (--revisado).');
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',audioPath]));
const duration=Number(probe.format.duration);
if(!probe.streams.some(s=>s.codec_type==='audio')||!Number.isFinite(duration)||duration<=0||duration>70)throw new Error('El audio no cabe en los 70 s. Revisa silencios y tiempos; no cortes palabras ni aceleres artificialmente la voz.');
const captions=JSON.parse(readFileSync(captionsPath,'utf8'));
const script=JSON.parse(readFileSync('docs/episodio-09/narracion.json','utf8'));
const clean=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
let prev=0;
for(const c of captions){
 if(!c.text||!Number.isFinite(c.startMs)||!Number.isFinite(c.endMs)||c.startMs<prev||c.endMs<=c.startMs||c.endMs>70000||!Number.isInteger(c.scene)||c.scene<1||c.scene>8)throw new Error('Cue de subtítulo inválido.');
 if(c.text.split('\n').length>2||c.text.split('\n').some(l=>l.length>43))throw new Error('Subtítulo demasiado largo: máximo dos líneas de 43 caracteres.');
 const scene=script.scenes[c.scene-1];
 if(c.startMs<scene.start*1000||c.endMs>scene.end*1000)throw new Error('Ajusta la escena o el cue al audio real antes de integrar.');
 c.timestampMs??=null;c.confidence??=null;prev=c.endMs;
}
if(clean(captions.map(c=>c.text).join(' '))!==clean(script.scenes.map(s=>s.text).join(' ')))throw new Error('El texto alineado no coincide con el guion oficial.');
mkdirSync('public/episodio-09/audio',{recursive:true});
// Normaliza el contenedor sin cambiar la velocidad. El original se conserva fuera del repositorio.
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',audioPath,'-ar','48000','-c:a','pcm_s16le','public/episodio-09/audio/grady-master.wav']);
copyFileSync(captionsPath,'src/episodio09/captions.json');
const mpath='src/episodio09/audio-manifest.json';const manifest=JSON.parse(readFileSync(mpath,'utf8'));
manifest.status='ready';manifest.captionStatus='aligned-reviewed';manifest.durationSeconds=duration;
writeFileSync(mpath,JSON.stringify(manifest,null,2)+'\n');
console.log('Audio y subtítulos integrados. Revisa Studio antes de exportar el final.');

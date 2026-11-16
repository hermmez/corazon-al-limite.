"""Prepare the approved speech at rate 1, timed captions, and original local sound.
No API calls or new generations. Prerequisites: Python, NumPy, FFmpeg.
"""
from pathlib import Path
import json,subprocess,wave,hashlib,math,shutil
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/episodios/pez-luna-oceanico';SRC=ROOT/'src/episodios/pez-luna-oceanico'
trans=json.loads((OUT/'transcripcion-original.json').read_text())
q=json.loads((OUT/'guion-y-voz.json').read_text());sr=44100
voice=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(OUT/'narracion-grady-original.mp3'),'-f','f32le','-ar',str(sr),'-ac','1','-']),np.float32).copy()
voice*=min(.12/np.sqrt(np.mean(voice**2)),.88/max(abs(voice)))
cuts=[0,6.38,17.3,25.4,34.62,43.54,52.6,59.08,len(voice)/sr]
starts=[0,234,570,858,1170,1470,1770,2004]
def wav(path,data):
 with wave.open(str(path),'wb') as f:
  f.setnchannels(1 if data.ndim==1 else data.shape[1]);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(data,-.99,.99)*32767).astype('<i2').tobytes())
raw=[dict(w,phrase=s['text'].strip()) for s in trans['segments'] for w in s['words']]
words=[]
for i,w in enumerate(raw):
 w=w.copy();text=w['text'].strip()
 if text=='a' and 47.5<w['start']<47.7:
  w['text']=' acostado';w['end']=raw[i+1]['end']
 elif text=='costado' and 47.5<w['start']<48:continue
 if text=='pero' and w['start']<3:w['text']=' Pero';w['start']=2.84
 if text=='mitad,':w['text']=' mitad!'
 if text=='Este':w['text']='¡Este'
 if text=='mola' and 8<w['start']<9:w['text']=' Mola'
 if text=='Y' and 28.5<w['start']<29:w['start']=29.15
 if text=='Es' and 55.6<w['start']<55.8:w['start']=56.02
 if text=='Y' and 59<w['start']<59.3:w['start']=59.3
 words.append(w)
caps=[];global_words=[]
for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
 wav(OUT/f'voz-{i+1:02}.wav',voice[round(a*sr):round(b*sr)])
 selected=[w for w in words if a<=w['start']<b]
 c=[dict(text=w['text'],startMs=round((w['start']-a)*1000),endMs=round((w['end']-a)*1000),timestampMs=round(((w['start']+w['end'])/2-a)*1000),confidence=w['probability']) for w in selected]
 caps.append(c);(OUT/f'subtitulos-{i+1:02}.json').write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n')
 for w in selected:global_words.append(dict(w,globalStart=starts[i]/30+w['start']-a,globalEnd=starts[i]/30+w['end']-a))
(SRC/'captions.ts').write_text("import type {Caption} from '@remotion/captions';\nexport const captions:Caption[][]="+json.dumps(caps,ensure_ascii=False,indent=2)+';\n')
def at(text,after=0):return next(w['globalStart'] for w in global_words if w['text'].strip().lower().strip('.,:;!?¡¿')==text and w['globalStart']>after)
cues=dict(complete=at('completo'),ton=at('tonelada'),name=at('luna'),scientific=at('mola'),tail=at('cola'),posterior=at('posterior'),clavus=at('clavus'),rudder=at('timón'),incredible=at('increíble'),propulsion=at('impulsa'),dorsal=at('dorsal'),anal=at('anal'),coordinated=at('coordinada'),wings=at('alas'),big=at('impresionantes'),dives=at('inmersiones'),deep=at('profundas'),food=at('alimento'),jelly=at('medusas'),salps=at('salpas'),travel=at('recorrer'),surface=at('superficie'),side=at('acostado'),maybe=at('cree'),warm=at('calentarse'),notIncomplete=at('incompleto'),evolution=at('evolución'),question=at('dime'),swim=at('nadar'),end=global_words[-1]['globalEnd'])
(SRC/'cues.ts').write_text('export const cues='+json.dumps(cues,ensure_ascii=False,indent=2)+' as const;\n')
(OUT/'sincronizacion.json').write_text(json.dumps(dict(sourceCuts=cuts,voiceStartFrames=starts,words=global_words,cues=cues,playbackRate=1,editorialASRFixes=['a costado → acostado, unión de transcripción de la palabra aprobada','Mola con mayúscula de género','Inicios de Pero, Y y Es se colocan tras las pausas acústicas correspondientes']),ensure_ascii=False,indent=2)+'\n')

# Original underwater score: soft sustained voicings with sparse plucked harmonics.
n=70*sr;music=np.zeros((n,2),np.float32);sfx=np.zeros((n,2),np.float32);rng=np.random.default_rng(1411)
def put(dest,at,sig,pan=0):
 a=round(at*sr);l=min(len(sig),n-a)
 if l>0:
  dest[a:a+l,0]+=sig[:l]*math.sqrt((1-pan)/2);dest[a:a+l,1]+=sig[:l]*math.sqrt((1+pan)/2)
chords=[[50,57,60,65],[46,53,57,60],[43,50,53,57],[45,52,55,60]]
for bar in range(9):
 for j,m in enumerate(chords[bar%4]):
  dur=min(9.2,70-bar*8);t=np.arange(round(dur*sr))/sr;f=440*2**((m-69)/12)
  env=np.minimum(t/1.7,1)*np.minimum((dur-t)/1.8,1)
  sig=(np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*f*2.001*t))*env*.005
  put(music,bar*8,sig,(j-1.5)/4)
 for j in range(4):
  t=np.arange(round(2.2*sr))/sr;f=440*2**((chords[bar%4][j]+24-69)/12)
  put(music,bar*8+.5+j*1.7,np.sin(2*np.pi*f*t)*(1-np.exp(-t*30))*np.exp(-t*2)*.006,(j-1.5)/3)
# Quiet original water movement; no repetitive loud whooshes.
noise=rng.normal(0,1,n)
filtered=np.convolve(noise,np.ones(80)/80,mode='same')
sfx[:,0]+=filtered*.0017;sfx[:,1]+=np.roll(filtered,180)*.0016
for atime in [3.2,4.2,28.8,30.1,33.7,39.2,41.3,43,49.5,51.2,54.1,60.3,64.2,67.5]:
 dur=.16;t=np.arange(round(dur*sr))/sr;f=520+310*np.exp(-t*18)
 put(sfx,atime,np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*32)*.007,(atime%2-.5)*.4)
for atime in [7.7,18.8,28.3,38.7,48.7,53.8,58.8]:
 t=np.arange(round(.32*sr))/sr;put(sfx,atime,rng.normal(0,1,len(t))*np.sin(np.pi*t/.32)**2*.002)
fade=np.minimum(np.arange(n)/(.03*sr),1)*np.minimum((n-1-np.arange(n))/(.22*sr),1)
music*=fade[:,None];sfx*=fade[:,None]
wav(OUT/'musica-submarina-original.wav',music);wav(OUT/'ambiente-oceano-original.wav',sfx)
manifest=dict(episode=q['episode'],species='Mola mola',approvedVoiceCredits=4.37,jobId=q['jobId'],sourceDurationSeconds=len(voice)/sr,playbackRate=1,voiceEndSeconds=starts[-1]/30+cuts[-1]-cuts[-2],width=1080,height=1920,fps=30,frames=2100,sourceCuts=cuts,voiceStartFrames=starts,originalVoiceSha256=hashlib.sha256((OUT/'narracion-grady-original.mp3').read_bytes()).hexdigest(),sources=q['sourceChecks'],music='Composición y síntesis local original, sin muestras de terceros',visuals='Ilustración 2D original adaptada usando los PNG aprobados como referencias; recursos anteriores intactos')
(OUT/'produccion.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(sourceSeconds=len(voice)/sr,voiceEndSeconds=manifest['voiceEndSeconds'],cues=cues),indent=2))

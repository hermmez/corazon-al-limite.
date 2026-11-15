"""Prepare the approved voice, local sound and geographical vector paths.
No paid services, no voice speed changes, no edits to prior episode assets.
"""
from pathlib import Path
import json, subprocess, wave, math, hashlib, re, os, urllib.request
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/episodios/carne-mexico-2027'
SRC=ROOT/'src/episodios/carne-mexico-2027'
WORK=Path(os.environ.get('EPISODE_WORK_DIR', ROOT/'out/carne-mexico-2027/preparacion'))
WORK.mkdir(parents=True, exist_ok=True)
quote=json.loads((OUT/'guion-y-voz.json').read_text())
trans=json.loads((OUT/'transcripcion-original.json').read_text())
sync=json.loads((OUT/'sincronizacion.json').read_text())
cuts=sync['sourceCuts'];starts=sync['voiceStartFrames'];sr=44100
def wav(path,data):
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1 if data.ndim==1 else data.shape[1]);f.setsampwidth(2);f.setframerate(sr)
        f.writeframes((np.clip(data,-.99,.99)*32767).astype('<i2').tobytes())
voice=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(OUT/'narracion-grady-original.mp3'),'-f','f32le','-ar',str(sr),'-ac','1','-']),dtype=np.float32).copy()
voice*=min(.115/max(np.sqrt(np.mean(voice**2)),1e-6),.89/max(abs(voice)))
words=[dict(w,phrase=s['text'].strip()) for s in trans['segments'] for w in s['words']]
corrected=[]
for i,w in enumerate(words):
    w=w.copy();text=w['text'].strip()
    if text.startswith('.8') or text.startswith('.3'):continue
    if text=='4' and i+1<len(words) and words[i+1]['text'].strip().startswith('.8'):
        w['text']=' 4,8 %;';w['end']=words[i+1]['end']
    elif text=='3' and i+1<len(words) and words[i+1]['text'].strip().startswith('.3'):
        w['text']=' 3,3 %.';w['end']=words[i+1]['end']
    elif text.startswith('6%'):w['text']=' 6 %'+(',' if w['start']>45 else ';')
    elif text=='aumentas':w['text']=' aumenta'
    elif text=='carne' and w['start']<9:w['text']=' Carne'
    elif text=='casa?':w['text']=' casa:'
    if text=='Pero' and w['start']<55:w['start']=55.16
    if text=='La' and 28<w['start']<28.5:w['start']=28.9
    corrected.append(w)
caps=[];global_words=[]
for i in range(7):
    a,b=cuts[i:i+2];chunk=voice[round(a*sr):round(b*sr)]
    wav(OUT/f'voz-{i+1:02}.wav',chunk)
    selected=[w for w in corrected if a<=w['start']<b]
    c=[{'text':w['text'],'startMs':round((w['start']-a)*1000),'endMs':round((w['end']-a)*1000),'timestampMs':round(((w['start']+w['end'])/2-a)*1000),'confidence':w['probability']} for w in selected]
    caps.append(c)
    for w in selected:global_words.append(dict(w,globalStart=starts[i]/30+w['start']-a,globalEnd=starts[i]/30+w['end']-a))
    (OUT/f'subtitulos-{i+1:02}.json').write_text(json.dumps(c,ensure_ascii=False,indent=2))
(SRC/'captions.ts').write_text("import type {Caption} from '@remotion/captions';\nexport const captions: Caption[][] = "+json.dumps(caps,ensure_ascii=False,indent=2)+';\n')
(OUT/'transcripcion-original.json').write_text(json.dumps(trans,ensure_ascii=False,indent=2))
(OUT/'sincronizacion.json').write_text(json.dumps(dict(sourceCuts=cuts,voiceStartFrames=starts,words=global_words,editorialASRFixes=['Numerales agrupados: 6 %, 4,8 %, 3,3 %, $250 y $265','aumentas → aumenta, según el guion y la unión fonética con seis','Inicio de Pero colocado en la toma correcta tras una pausa detectada']),ensure_ascii=False,indent=2))
cues={'beef':9.99333,'beefPct':10.91333,'pork':12.67333,'porkPct':13.05333,'chicken':14.83333,'chickenPct':15.09333,'reason1':17.56667,'electricity':21.86667,'fuel':22.96667,'cold':24.02667,'distribution':24.90667,'reason2':28.76,'insecurity':30.26,'theft':31.22,'securityCost':33.4,'reason3':38.04667,'usa':40.98667,'supply':43.20667,'mexico':46.00667,'example':48.06,'kilo':49.8,'price250':51.46,'ifRise':53.58,'six':54.26,'pay':55.12,'price265':55.78,'warning':58.96667,'forecast':59.96667,'notConfirmed':61.02667,'market':64.34667,'question':66.42667,'answerBeef':68.14667,'answerChicken':68.76667,'answerPork':69.40667}
(SRC/'cues.ts').write_text('export const cues = '+json.dumps(cues,indent=2)+' as const;\n')
plan=json.loads((OUT/'plan-70s.json').read_text())
for p in plan:
    active=next((w for w in global_words if w['globalStart']<p['second']+1 and w['globalEnd']>p['second']),None)
    if active:p['narration']=active['phrase']
(OUT/'plan-70s.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2))

# Original instrumental, synthesized without samples or outside licenses.
n=70*sr;music=np.zeros((n,2),np.float32);rng=np.random.default_rng(2027)
def note(at,midi,length,amp,pan=0):
    a=round(at*sr);size=min(round(length*sr),n-a)
    if size<=0:return
    t=np.arange(size)/sr;f=440*2**((midi-69)/12)
    env=(1-np.exp(-t/.009))*np.exp(-t/1.1)*np.minimum(1,(length-t)/.1)
    s=(np.sin(2*np.pi*f*t)+.23*np.sin(2*np.pi*f*2.0007*t)+.07*np.sin(2*np.pi*f*3.001*t))*env*amp
    music[a:a+size,0]+=s*np.sqrt((1-pan)/2);music[a:a+size,1]+=s*np.sqrt((1+pan)/2)
    delay=round(.17*sr);l=min(size,n-a-delay)
    if l>0:music[a+delay:a+delay+l]+=s[:l,None]*.045
beat=60/104
chords=[[50,62,66,69],[47,59,62,66],[43,55,59,62],[45,57,61,64]]
for b in range(16):
    c=chords[b%4];at=b*8*beat
    note(at,c[0],3,.018,-.2)
    for k in range(8):note(at+k*beat,c[1+(k%3)]+12,1.8,.012+(.003 if k%4==0 else 0),(k%3-1)*.3)
fade=np.minimum(np.arange(n)/(.03*sr),1)*np.minimum((n-1-np.arange(n))/(.25*sr),1)
music*=fade[:,None];wav(OUT/'musica-original.wav',music)
sfx=np.zeros((n,2),np.float32)
def put(at,sig,pan=0):
    a=round(at*sr);l=min(len(sig),n-a)
    if l>0:sfx[a:a+l,0]+=sig[:l]*np.sqrt((1-pan)/2);sfx[a:a+l,1]+=sig[:l]*np.sqrt((1+pan)/2)
for at in [.1,.32,.6,.9,10.91,13.05,15.09,51.46,54.26,55.78,56.6]:
    t=np.arange(round(.055*sr))/sr;put(at,np.sin(2*np.pi*740*t)*np.exp(-t*90)*.009)
for a,b in [(20,21.8),(27,30.4),(34.2,35.5)]:
    t=np.arange(round((b-a)*sr))/sr;env=np.sin(np.pi*np.arange(len(t))/len(t))**2
    put(a,(np.sin(2*np.pi*(75*t+6*t*t))+.2*np.sin(2*np.pi*150*t))*env*.008,-.25)
for at in [19.3,25.2,25.8,35.2,49.9,57.25,65.1,66.1]:
    t=np.arange(round(.12*sr))/sr;put(at,(rng.normal(0,.5,len(t))+np.sin(2*np.pi*180*t))*np.exp(-t*35)*.008,.2)
for at in [50,56.5]:
    t=np.arange(round(.3*sr))/sr;put(at,(np.sin(2*np.pi*1320*t)+.4*np.sin(2*np.pi*1980*t))*np.exp(-t*22)*.008)
sfx+=rng.normal(0,.00012,n)[:,None];sfx*=fade[:,None];wav(OUT/'ambiente-y-efectos.wav',sfx)

geofile=WORK/'natural-earth-countries.geojson'
if not geofile.exists():
    urllib.request.urlretrieve('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson', geofile)
geo=json.loads(geofile.read_text());paths={}
for f in geo['features']:
    name=f['properties'].get('ADMIN')
    if name not in ['Mexico','United States of America']:continue
    g=f['geometry'];polygons=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    rings=[]
    for poly in polygons:
        for ring in poly:
            if not any(-127<=x<=-65 and 12<=y<=52 for x,y in ring):continue
            rings.append('M'+' L'.join(f'{(x+127)/62*840:.1f},{(52-y)/40*560:.1f}' for x,y in ring)+' Z')
    paths['mexico' if name=='Mexico' else 'usa']=' '.join(rings)
assert set(paths)=={'mexico','usa'}
(SRC/'geography.ts').write_text('export const countryPaths = '+json.dumps(paths)+';\n')
manifest=dict(episode=quote['episode'],model=quote['model'],voice=quote['voice'],approvedCredits=4.6,jobId=quote['jobId'],sourceDurationSeconds=len(voice)/sr,playbackRate=1,sourceCuts=cuts,voiceStartFrames=starts,width=1080,height=1920,fps=30,frames=2100,sources=quote['sources'],mapsSource='Natural Earth 1:110m admin 0, public domain',originalVoiceSha256=hashlib.sha256((OUT/'narracion-grady-original.mp3').read_bytes()).hexdigest(),editorialNote='La transcripción automática agrupa numerales; el audio es la generación aprobada y no se modifica el texto. Separaciones de montaje conservan las palabras y el cierre termina tras la pregunta.')
(OUT/'produccion.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
quote['generated']=True;quote['submissionStatus']='completed';quote['audioDurationSeconds']=len(voice)/sr;(OUT/'guion-y-voz.json').write_text(json.dumps(quote,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'voiceSeconds':len(voice)/sr,'plannedSeconds':len(plan),'voiceEndSeconds':starts[-1]/30+cuts[-1]-cuts[-2],'musicPeak':float(abs(music).max())},indent=2))

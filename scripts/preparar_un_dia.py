"""Prepare this episode only. No external services or paid calls.

Keeps the authorized voice at playbackRate=1. Every cut falls inside a detected
pause. The remaining time belongs to visible story actions over music/room tone.
Music is an original deterministic composition, synthesized without samples.
"""
from pathlib import Path
import json, subprocess, wave, math, hashlib, re, unicodedata
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/episodios/un-dia-vas-a-extranar-este-momento'
SRC=ROOT/'src/episodios/un-dia-vas-a-extranar-este-momento'
MAN=json.loads((OUT/'produccion.json').read_text())
TRANS=json.loads((OUT/'transcripcion-original.json').read_text())
SR=44100
def write_wav(path, data, rate=SR):
    data=np.asarray(data)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1 if data.ndim==1 else data.shape[1]);f.setsampwidth(2);f.setframerate(rate)
        f.writeframes((np.clip(data,-.99,.99)*32767).astype('<i2').tobytes())
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(OUT/'narracion-grady-original.mp3'),'-f','f32le','-ar',str(SR),'-ac','1','-'])
voice=np.frombuffer(raw,np.float32).copy()
# Uniform gain only; the spoken pitch, timing and original breaths stay intact.
rms=np.sqrt(np.mean(voice**2));voice*=min(.115/max(rms,1e-6),.89/max(abs(voice)))
words=[w for s in TRANS['segments'] for w in s['words']]
def norm(s):
    return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode())
assert [norm(w['text']) for w in words]==[norm(w) for s in MAN['scenes'] for w in s['text'].split()], 'Transcript differs from authorized text'
captions=[]
for i,s in enumerate(MAN['scenes']):
    a,b=s['sourceStart'],s['sourceEnd']
    write_wav(OUT/f'voz-{i+1:02}.wav',voice[round(a*SR):round(b*SR)])
    original=s['text'].split()
    selected=[w for w in words if w['start']>=a and w['start']<b]
    assert len(original)==len(selected),(i,len(original),len(selected))
    caps=[{'text':(' ' if j else '')+text,'startMs':round(max(0,w['start']-a)*1000),'endMs':round((w['end']-a)*1000),'timestampMs':round(((w['start']+w['end'])/2-a)*1000),'confidence':w['probability']} for j,(w,text) in enumerate(zip(selected,original))]
    captions.append(caps)
    (OUT/f'subtitulos-{i+1:02}.json').write_text(json.dumps(caps,ensure_ascii=False,indent=2))
(OUT/'transcripcion-original.json').write_text(json.dumps(TRANS,ensure_ascii=False,indent=2))
(SRC/'captions.ts').write_text("import type {Caption} from '@remotion/captions';\nexport const captions: Caption[][] = "+json.dumps(captions,ensure_ascii=False,indent=2)+";\n")

# Original slow instrumental: D add9 / Bm7 / Gmaj7 / Asus4; felt-key timbre,
# restrained soft strings, no vocal samples and no third-party recordings.
N=70*SR
music=np.zeros((N,2),np.float32)
rng=np.random.default_rng(4107)
chords=[[50,57,62,66,69],[47,54,57,62,66],[43,50,54,59,62],[45,52,57,62,64]]
def add_note(at,midi,length,amp,pan=0):
    start=round(at*SR);n=min(round(length*SR),N-start)
    if n<=0:return
    tm=np.arange(n)/SR;freq=440*2**((midi-69)/12)
    env=(1-np.exp(-tm/0.014))*np.exp(-tm/2.3)*np.minimum(1,(length-tm)/.16)
    tone=sum(a*np.sin(2*np.pi*freq*(h+.00014*h*h)*tm+(.1*h)) * np.exp(-tm*h/5.7) for h,a in [(1,1),(2,.28),(3,.11),(4,.055),(5,.018)])
    sig=(tone*env*amp).astype(np.float32)
    music[start:start+n,0]+=sig*math.sqrt((1-pan)/2)
    music[start:start+n,1]+=sig*math.sqrt((1+pan)/2)
    for delay,gain in [(.19,.08),(.37,.055),(.61,.035)]:
        offset=round(delay*SR);m=min(n,N-start-offset)
        if m>0: music[start+offset:start+offset+m]+=sig[:m,None]*gain
for bar in range(12):
    base=bar*6.;chord=chords[(bar+0)%4]
    intensity=.68+.32*min(base/62,1)
    add_note(base,chord[0],5.8,.026*intensity,-.15)
    for beat,index in enumerate([1,3,2,4]):
        add_note(base+.12+beat*1.45,chord[index]+12,4.2,.024*intensity,(beat-1.5)*.21)
    if base>37:
        for j,midi in enumerate(chord[1:4]):
            start=round(base*SR);n=min(round(6.4*SR),N-start)
            if n>0:
                tm=np.arange(n)/SR;f=440*2**((midi+12-69)/12)
                env=np.minimum(tm/1.9,1)*np.minimum((6.4-tm)/1.4,1)
                pad=(np.sin(2*np.pi*f*tm+.006*np.sin(tm*3))+.25*np.sin(2*np.pi*f*2.001*tm))*env*.003
                music[start:start+n,0]+=pad;music[start:start+n,1]+=pad*.94
fade=np.minimum(np.arange(N)/(SR*.025),1)*np.minimum((N-1-np.arange(N))/(SR*.7),1)
music*=fade[:,None]
write_wav(OUT/'musica-original.wav',music)

sfx=np.zeros((N,2),np.float32)
def put(at,sig,level=1,pan=0):
    a=round(at*SR);n=min(len(sig),N-a)
    if n>0:
        sfx[a:a+n,0]+=sig[:n]*level*math.sqrt((1-pan)/2)
        sfx[a:a+n,1]+=sig[:n]*level*math.sqrt((1+pan)/2)
def buzz(at):
    tm=np.arange(round(.2*SR))/SR
    env=np.sin(np.pi*np.arange(len(tm))/len(tm))**2
    sig=(np.sin(2*np.pi*125*tm)+.32*np.sin(2*np.pi*250*tm))*env*.024
    put(at,sig,pan=.18)
for at in [0,.3,.92,1.22,8.8,9.1]:buzz(at)
for start,end in [(7.1,9.5),(12.8,14.3),(27.1,32.5),(38.3,40.8)]:
    for at in np.arange(start,end,.23):
        tm=np.arange(round(.05*SR))/SR
        sig=(rng.normal(0,.7,len(tm))+np.sin(2*np.pi*650*tm)) * np.exp(-tm*120)*.009
        put(float(at+rng.uniform(0,.08)),sig,pan=-.35)
for at in [10.5,43.6,44.8]:
    tm=np.arange(round(.06*SR))/SR;put(at,np.sin(2*np.pi*540*tm)*np.exp(-tm*65)*.015)
for at in [18.1,21.6,54.2,55.5,61.8]:
    tm=np.arange(round(.15*SR))/SR
    put(at,(np.sin(2*np.pi*1730*tm)+.4*np.sin(2*np.pi*2580*tm))*np.exp(-tm*37)*.006,pan=.3)
for at in [52.1,52.55,57.6,58.05]:
    tm=np.arange(round(.14*SR))/SR
    put(at,rng.normal(0,1,len(tm))*np.exp(-tm*33)*.009,pan=-.12)
# Very quiet continuous room air avoids dead digital gaps without masking voice.
air=rng.normal(0,.00024,N).astype(np.float32)
air=np.convolve(air,np.ones(13)/13,mode='same')
sfx+=air[:,None]
sfx*=fade[:,None]
write_wav(OUT/'ambiente-y-efectos.wav',sfx)
MAN['audioPreparation']={'voicePlaybackRate':1,'voiceWords':len(words),'transcriptMatchesAuthorizedText':True,'music':'Original synthesis; no samples or external credit use','sourceSha256':hashlib.sha256((OUT/'narracion-grady-original.mp3').read_bytes()).hexdigest()}
(OUT/'produccion.json').write_text(json.dumps(MAN,ensure_ascii=False,indent=2))
print(json.dumps({'words':len(words),'voiceSourceSeconds':len(voice)/SR,'compositionSeconds':70,'musicPeak':float(abs(music).max())},indent=2))

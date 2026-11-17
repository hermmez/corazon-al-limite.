"""Rebuild the episode timing from existing speech; no TTS or speech time-stretch."""
from pathlib import Path
import json,hashlib,re,subprocess,wave
import numpy as np
R=Path(__file__).resolve().parents[1];P=R/'public/episodios/economist-2027';D=R/'docs/economist-2027';S=R/'src/economist2027';SR=48000
# v1 timing is retained in git and a separate local data file so this operation is repeatable.
v1_path=D/'timing-v1-reference.json'
if not v1_path.exists():
 v1_path.write_text(json.dumps({'captions':json.loads((D/'captions-word-timing.json').read_text()),'plan':json.loads((D/'plan-70-segundos.json').read_text())},ensure_ascii=False,indent=2))
v1=json.loads(v1_path.read_text());oldcaps=v1['captions']
pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(P/'narracion-original.mp3'),'-ar',str(SR),'-ac','1','-f','s16le','-'])
source=np.frombuffer(pcm,dtype='<i2');source_seconds=len(source)/SR;target=70*SR;extra=target-len(source)
assert 0<extra<8*SR
silence_log=subprocess.run(['ffmpeg','-hide_banner','-i',str(P/'narracion-original.mp3'),'-af','silencedetect=noise=-32dB:d=0.25','-f','null','-'],capture_output=True,text=True,check=True).stderr
starts=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',silence_log)];ends=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',silence_log)]
assert len(starts)==len(ends)==18
lengths=np.array(ends)-np.array(starts)
# Preserve variation: slightly longer before a reveal/question, shorter around brief statements.
base=np.array([.95,.85,.80,.85,.95,.80,.85,.80,.85,.85,.80,.80,.65,.85,.95,.65,.90,.90])
lo,hi=-1.,1.
for _ in range(80):
 mid=(lo+hi)/2;desired=np.maximum(lengths,np.minimum(.98,base+mid))
 if np.sum(desired-lengths)<extra/SR:lo=mid
 else:hi=mid
added=np.round((np.maximum(lengths,np.minimum(.98,base+hi))-lengths)*SR).astype(int)
added[-1]+=extra-int(added.sum());assert int(added.sum())==extra
insertions=[];chunks=[];cursor=0;running=0
for a,b,n in zip(starts,ends,added):
 pos=round((a+b)/2*SR);chunks.extend([source[cursor:pos],np.zeros(int(n),dtype='<i2')]);cursor=pos
 insertions.append({'sourceSecond':pos/SR,'sourceSilence':[a,b],'addedSamples':int(n),'addedSeconds':int(n)/SR,'editedSilenceSeconds':round(b-a+int(n)/SR,6),'timelineInsertionSecond':(pos+running)/SR})
 running+=int(n)
chunks.append(source[cursor:]);out=np.concatenate(chunks);assert len(out)==target
# Strip the new silent inserts and prove that every original PCM sample remains unchanged.
restored=[];cursor=0
for event in insertions:
 pos=round(event['timelineInsertionSecond']*SR);restored.append(out[cursor:pos]);cursor=pos+event['addedSamples']
restored.append(out[cursor:]);assert np.array_equal(np.concatenate(restored),source)
with wave.open(str(P/'narracion-ritmo-v2.wav'),'wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(out.tobytes())
def mapped(t):return t+sum(x['addedSeconds'] for x in insertions if x['sourceSecond']<=t)
raw=json.loads((D/'transcripcion-asr-original.json').read_text());words=[w.copy() for s in raw['segments'] for w in s['words']]
for w in words:
 if 'Entonces' in w['text']:w['start']=53.2
 if w['text'].strip()=='La' and abs(w['start']-28.24)<.02:w['start']=28.90
cuts=[0,8.3,16,25.9,34.85,42.6,53.1,source_seconds];frames=[round(mapped(t)*30) for t in cuts];frames[0]=0;frames[-1]=2100
old_starts=[0,8,18,28,39,49,60];old_lengths=[8,10,10,11,10,11,10]
text_scenes=(D/'guion-autorizado.txt').read_text().strip().split('\n\n');allcaps=[];clocks=[]
for scene in range(7):
 selected=[w for w in words if cuts[scene]<=w['start']<cuts[scene+1]];tokens=text_scenes[scene].split();assert len(tokens)==len(selected)
 caps=[]
 for w,text in zip(selected,tokens):
  gs=mapped(w['start'])*1000;ge=mapped(w['end'])*1000
  c={'text':' '+text,'startMs':round(gs-frames[scene]/30*1000),'endMs':round(ge-frames[scene]/30*1000),'timestampMs':round((gs+ge)/2-frames[scene]/30*1000),'confidence':round(w['confidence'],4)}
  caps.append(c);allcaps.append(dict(c,scene=scene+1,compositionStartMs=round(gs),compositionEndMs=round(ge)))
 (P/f'captions-{scene+1:02}.json').write_text(json.dumps(caps,ensure_ascii=False,indent=2))
 old=[c for c in oldcaps if c['scene']==scene+1];assert len(old)==len(caps)
 pairs=[(0.,0.)]
 for n,o in zip(caps,old):
  token=re.sub(r'[^\w]','',n['text']).lower()
  if len(token)<4 and token not in ('no','qué','más'):continue
  pair=(n['startMs']/1000,o['startMs']/1000)
  if pair[0]>pairs[-1][0] and pair[1]>pairs[-1][1]:pairs.append(pair)
 pairs.append(((frames[scene+1]-frames[scene])/30,old_lengths[scene]))
 clocks.append({'fromFrame':frames[scene],'durationFrames':frames[scene+1]-frames[scene],'inputSeconds':[p[0] for p in pairs],'animationSeconds':[p[1] for p in pairs]})
(D/'captions-word-timing.json').write_text(json.dumps(allcaps,ensure_ascii=False,indent=2))
# Inverse visual clock: move sound effects and transitions with the associated animation.
def inverse(t):
 i=max(i for i,s in enumerate(old_starts) if s<=t);c=clocks[i]
 return frames[i]/30+float(np.interp(t-old_starts[i],c['animationSeconds'],c['inputSeconds']))
question_hide=float(np.interp(7.5,clocks[6]['animationSeconds'],clocks[6]['inputSeconds']))*1000
(S/'timing.ts').write_text('export const visualClocks = '+json.dumps(clocks,indent=2)+' as const;\nexport const finalQuestionMs = '+str(round(question_hide))+';\n')
report={'revision':2,'durationSeconds':70,'voicePlaybackRate':1,'sourceDurationSeconds':source_seconds,'originalPcmPreserved':True,'originalSamplesSha256':hashlib.sha256(source.tobytes()).hexdigest(),'prolongedSceneTailPaddingRemoved':True,'maximumDesignedPauseSeconds':max(x['editedSilenceSeconds'] for x in insertions),'insertions':insertions,'sceneBoundariesFrames':frames,'sceneBoundariesSeconds':[x/30 for x in frames],'animationClock':'continuous piecewise interpolation anchored to actual words; no static visual holds'}
(D/'audio-edit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
# Keep a true Caption-format SRT sidecar with short phrase grouping.
def stamp(ms):return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
groups=[];g=[]
for c in allcaps:
 if g and (len(g)>=5 or c['scene']!=g[-1]['scene'] or c['compositionStartMs']-g[-1]['compositionEndMs']>350):groups.append(g);g=[]
 g.append(c)
 if c['text'].strip().endswith(('.', '?', ':')):groups.append(g);g=[]
if g:groups.append(g)
(D/'subtitulos.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(g[0]['compositionStartMs'])} --> {stamp(g[-1]['compositionEndMs'])}\n{' '.join(c['text'].strip() for c in g)}" for i,g in enumerate(groups)))
# Rebuild score and effects from the original synthesis, with their cues retimed to the new edit.
sr=24000;t=np.arange(70*sr)/sr;rng=np.random.default_rng(2027);music=np.zeros_like(t)
for freq in [55,82.4069,110]:music+=.025*np.sin(2*np.pi*freq*t)*(.3+.7*np.maximum(0,np.sin(2*np.pi*.65*t))**5)
for freq in [220,261.6256,329.6276]:music+=.008*np.sin(2*np.pi*freq*t+.6*np.sin(t*.13))*(.6+.4*np.sin(t*.11+freq))
smooth=np.convolve(rng.normal(0,1,len(t)),np.ones(80)/80,mode='same');music+=.035*smooth
for at in [f/30 for f in frames[:-1]]:music+=.025*np.sin(2*np.pi*43*t)*np.exp(-np.maximum(t-at,0)*3)*(t>=at)
music*=np.minimum(1,t/.2)*np.minimum(1,(70-t)/.3);fx=np.zeros_like(t)
for at in map(inverse,[1,7.7,17.65,27.65,32.4,38.65,48.65,55.2,59.7,61]):
 delta=t-at;fx+=smooth*.28*np.clip(1-np.abs(delta-.16)/.16,0,1)
for at in map(inverse,[2.5,19.9,21,22,23.5,26,33.5,36.2,44,52.5,60.2,64.2]):
 delta=np.maximum(0,t-at);fx+=.035*np.sin(2*np.pi*(720*delta+160*delta*delta))*np.exp(-delta*18)*(t>=at)
for old in np.arange(28,32.2,.22):
 at=inverse(old);delta=np.maximum(0,t-at);fx+=.025*np.sin(2*np.pi*95*delta)*np.exp(-delta*45)*(t>=at)
fx+=smooth*.12*((t>inverse(41))&(t<inverse(48)))
fx+=smooth*.3*np.clip((t-inverse(54.6))/.5,0,1)*np.clip((inverse(58.6)-t)/.8,0,1)
for name,signal in [('musica-ritmo-v2.wav',music),('efectos-ritmo-v2.wav',fx)]:
 with wave.open(str(P/name),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(signal,-1,1)*32767).astype('<i2').tobytes())
# Re-map the 70 per-second storyboard rows; all text synchronization uses new actual times.
plan=[]
for second in range(70):
 i=max(i for i,f in enumerate(frames[:-1]) if f/30<=second+.5);c=clocks[i]
 old_t=old_starts[i]+float(np.interp(second+.5-frames[i]/30,c['inputSeconds'],c['animationSeconds']))
 row=dict(v1['plan'][min(69,int(old_t))]);row['segundo']=second
 row['frase_sincronizada']=' '.join(c['text'].strip() for c in allcaps if c['compositionEndMs']>second*1000 and c['compositionStartMs']<(second+1)*1000) or '(pausa breve; animación continua)'
 row['validacion']='Revisión 2: pendiente de comprobación visual del nuevo montaje'
 for k in ['accion_visual','movimiento_objetos','camara','transicion']:
  row[k]=re.sub(r'\b(?:19,88|36,18|36,20) s\b','el momento de la palabra correspondiente',row[k])
 plan.append(row)
(D/'plan-70-segundos.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2))
# Authored JSX timeline: voice and captions use the new real clock; artwork uses a continuous visual clock.
imports="import React from 'react';\nimport {AbsoluteFill,Audio,Freeze,Sequence,staticFile,useCurrentFrame,useVideoConfig,interpolate} from 'remotion';\nimport {Captions} from './Captions';\nimport {C,ease} from './Art';\nimport {visualClocks,finalQuestionMs} from './timing';\n"+''.join(f"import {{Scene{i}}} from './Scene{i}';\n" for i in range(1,8))
body='''
const VisualClock=({scene,children}:{scene:number;children:React.ReactNode})=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),c=visualClocks[scene];return <Freeze frame={interpolate(f/fps,[...c.inputSeconds],[...c.animationSeconds],{extrapolateLeft:'clamp',extrapolateRight:'extend'})*fps}>{children}</Freeze>};
const IncomingMask=({children,kind}:{children:React.ReactNode;kind:string})=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),p=ease(f/fps,0,.35);return <AbsoluteFill style={{clipPath:kind==='iris'?`circle(${p*140}% at 68% 46%)`:kind==='wave'?`inset(${(1-p)*100}% 0 0 0)`:`inset(0 ${(1-p)*100}% 0 0)`}}>{children}</AbsoluteFill>};
export const Economist2027=()=>{const {fps}=useVideoConfig();return <AbsoluteFill style={{background:C.navy,overflow:'hidden'}}>
<Audio src={staticFile('episodios/economist-2027/narracion-ritmo-v2.wav')}/>
<Audio src={staticFile('episodios/economist-2027/musica-ritmo-v2.wav')} volume={.65}/>
<Audio src={staticFile('episodios/economist-2027/efectos-ritmo-v2.wav')} volume={.55}/>
'''
for i,(start,end,kind) in enumerate(zip(frames,frames[1:],['none','iris','flag','iris','wave','cloud','iris']),1):
 duration=end-start
 body+=f'<Sequence name="{i:02} — Escena sincronizada" from={{{start}}} durationInFrames={{{duration+(11 if i<7 else 0)}}} premountFor={{fps}}>\n'
 visual=f'<VisualClock scene={{{i-1}}}><Scene{i}/></VisualClock>'
 body+=(visual if i==1 else f'<IncomingMask kind="{kind}">{visual}</IncomingMask>')+'\n'
 if 2<=i<=6:body+="<div style={{position:'absolute',top:1390,left:100,color:'#b8cbc4',fontFamily:'Arial',fontSize:20,letterSpacing:2}}>RECREACIÓN 2D · LECTURA VISUAL</div>\n"
 body+='<Captions '+('final hideAfterMs={finalQuestionMs} ' if i==7 else '')+'captions={'+json.dumps(json.loads((P/f'captions-{i:02}.json').read_text()),ensure_ascii=False,indent=1)+'}/>\n</Sequence>\n'
body+='</AbsoluteFill>};\n';(S/'Economist2027.tsx').write_text(imports+body)
# Manifest includes both preserved v1 assets and the new non-destructive audio edit.
assets=[{'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(P.iterdir()) if p.is_file()]
(D/'manifest-recursos.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2))
print(json.dumps({'duration':70,'sourceSamplesUnchanged':True,'maxDesignedPause':report['maximumDesignedPauseSeconds'],'boundaries':report['sceneBoundariesSeconds'],'finalQuestionLocalMs':round(question_hide)},indent=2))

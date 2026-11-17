"""Read-only technical checks of the exported episode; uses FFprobe and FFmpeg."""
import argparse, hashlib, json, pathlib, subprocess, re, wave

ROOT=pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('video',nargs='?',default=str(ROOT/'out/economist-2027/corazon-al-limite-economist-2027.mp4'))
args=parser.parse_args();video=pathlib.Path(args.video)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,r_frame_rate,nb_frames,pix_fmt,sample_rate','-of','json',str(video)]))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'])==(1080,1920)
assert v['r_frame_rate']=='30/1'
assert int(v['nb_frames'])==2100
assert v['codec_name']=='h264' and v['pix_fmt'] in ('yuv420p','yuvj420p')
assert a['codec_name']=='aac'
assert abs(float(probe['format']['duration'])-70)<.001
plan=json.loads((ROOT/'docs/economist-2027/plan-70-segundos.json').read_text())
assert [r['segundo'] for r in plan]==list(range(70))
for r in plan:
 assert all(k in r for k in ['elemento_principal','accion_visual','movimiento_objetos','camara','transicion','frase_sincronizada','validacion'])
caps=json.loads((ROOT/'docs/economist-2027/captions-word-timing.json').read_text())
assert len(caps)==145
for c in caps:assert 0<=c['compositionStartMs']<c['compositionEndMs']<=70000
manifest=json.loads((ROOT/'docs/economist-2027/manifest-recursos.json').read_text())
for asset in manifest:
 p=ROOT/asset['path'];assert hashlib.sha256(p.read_bytes()).hexdigest()==asset['sha256'],p
audio_edit=json.loads((ROOT/'docs/economist-2027/audio-edit.json').read_text())
silence_result=None
if isinstance(audio_edit,dict) and audio_edit.get('revision')==2:
 voice=ROOT/'public/episodios/economist-2027/narracion-ritmo-v2.wav'
 with wave.open(str(voice),'rb') as wav:
  assert wav.getframerate()==48000 and wav.getnframes()==70*48000
  pcm=wav.readframes(wav.getnframes())
 restored=[];cursor=0
 for insert in audio_edit['insertions']:
  pos=round(insert['timelineInsertionSecond']*48000)*2;n=insert['addedSamples']*2
  restored.append(pcm[cursor:pos]);assert not any(pcm[pos:pos+n]);cursor=pos+n
 restored.append(pcm[cursor:]);restored=b''.join(restored)
 original=subprocess.check_output(['ffmpeg','-v','error','-i',str(ROOT/'public/episodios/economist-2027/narracion-original.mp3'),'-ar','48000','-ac','1','-f','s16le','-'])
 assert restored==original,'La voz debe conservar todas las muestras originales y su velocidad'
 log=subprocess.run(['ffmpeg','-hide_banner','-i',str(voice),'-af','silencedetect=noise=-32dB:d=0.25','-f','null','-'],capture_output=True,text=True,check=True).stderr
 pauses=[float(x) for x in re.findall(r'silence_duration: ([\d.]+)',log)]
 assert max(pauses)<1.05,pauses
 silence_result={'maximumPauseSeconds':max(pauses),'pausesLongerThan1_15Seconds':sum(x>1.15 for x in pauses),'originalPcmPreserved':True,'voicePlaybackRate':1}
baseline='dfd156762fae47a61374c4c6b138f85bdd2ef542'
subprocess.run(['git','diff','--exit-code',baseline,'--','src/Root.tsx','src/CorazonAlLimite.tsx','src/index.ts','package.json','public/imagenes'],cwd=ROOT,check=True)
print(json.dumps({'technical':'passed','voiceRhythm':silence_result,'durationSeconds':float(probe['format']['duration']),'frames':int(v['nb_frames']),'video':v,'audio':a,'storyboardRecords':len(plan),'captionWords':len(caps),'existingEpisodesAndIllustrations':'unchanged','sha256':hashlib.sha256(video.read_bytes()).hexdigest()},ensure_ascii=False,indent=2))

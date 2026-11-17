"""Read-only technical checks of the exported episode; uses FFprobe and FFmpeg."""
import argparse, hashlib, json, pathlib, subprocess

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
baseline='dfd156762fae47a61374c4c6b138f85bdd2ef542'
subprocess.run(['git','diff','--exit-code',baseline,'--','src/Root.tsx','src/CorazonAlLimite.tsx','src/index.ts','package.json','public/imagenes'],cwd=ROOT,check=True)
print(json.dumps({'technical':'passed','durationSeconds':float(probe['format']['duration']),'frames':int(v['nb_frames']),'video':v,'audio':a,'storyboardRecords':len(plan),'captionWords':len(caps),'existingEpisodesAndIllustrations':'unchanged','sha256':hashlib.sha256(video.read_bytes()).hexdigest()},ensure_ascii=False,indent=2))

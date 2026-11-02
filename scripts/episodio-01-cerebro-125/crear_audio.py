"""Original 105 BPM score and word-cued SFX; no provider calls or samples."""
import argparse,importlib.util,json,math,subprocess,wave
from pathlib import Path
import numpy as np

SR=48000
ROOT=Path("src/episodios/episodio-01-cerebro-125")
DIRECTORY=Path("public/episodios/episodio-01-cerebro-125/audio")
OUT=Path("output/episodio-01-cerebro-125")
spec=importlib.util.spec_from_file_location("approved_audio_helpers","scripts/episodio-01-cerebro/crear_audio.py")
helpers=importlib.util.module_from_spec(spec);spec.loader.exec_module(helpers)

def main():
    p=argparse.ArgumentParser();p.add_argument("--voice",required=True);p.add_argument("--preview",action="store_true");args=p.parse_args()
    DIRECTORY.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
    timeline=json.loads((ROOT/"timeline.json").read_text());n=70*SR;music=np.zeros((n,2));fx=np.zeros((n,2))
    helpers.loudnorm(args.voice,DIRECTORY/"voz_normalizada.wav",-16,"highpass=f=75,")
    voice=np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",str(DIRECTORY/"voz_normalizada.wav"),"-ar",str(SR),"-ac","2","-f","f32le","-"]),dtype=np.float32).reshape(-1,2)
    assert len(voice)==n,"Narration timeline must already be exactly 70s"
    rng=np.random.default_rng(12501)
    def add(buffer,sound,start,pan=0):
        offset=round(start*SR);length=min(len(sound),n-offset)
        if offset<0 or length<=0:return
        buffer[offset:offset+length,0]+=sound[:length]*math.sqrt((1-pan)/2)
        buffer[offset:offset+length,1]+=sound[:length]*math.sqrt((1+pan)/2)
    def note(midi,seconds,level,pad=False,color=.18):
        t=np.arange(round(seconds*SR))/SR;f=440*2**((midi-69)/12)
        env=np.minimum(1,t/.45)*np.minimum(1,(seconds-t)/.9)if pad else (1-np.exp(-t*130))*np.exp(-t*5.5)
        return level*env*(np.sin(2*np.pi*f*t)+color*np.sin(2*np.pi*f*2.001*t))
    beat=60/105;chords=[[50,57,60,64],[46,53,57,62],[53,60,64,67],[48,55,62,64]]
    for block,start in enumerate(np.arange(0,70,beat*8)):
        chord=chords[block%4]
        for j,midi in enumerate(chord):add(music,note(midi,beat*9,.033,True),float(start),(-.45,.2,-.2,.45)[j])
    for i in range(math.ceil(70/beat)):
        time=i*beat;chapter=next((s["id"]for s in timeline["scenes"]if s["start"]<=time<s["end"]),7);chord=chords[(i//8)%4]
        # Layers evolve with each chapter; clinical chapters stay restrained.
        if chapter not in [5,6]or i%2==0:add(music,note(chord[i%4]+24,.8,.035,color=.08+.025*chapter),time,math.sin(i)*.45)
        if chapter in [0,2,4,7]and i%2==0:
            t=np.arange(round(.08*SR))/SR;add(music,helpers.smooth(rng.normal(0,1,len(t)),11)*np.exp(-t*55)*.012,time,-.3)
    music*=10**(-29.5/20)/max(1e-9,np.sqrt(np.mean(music**2)))
    t=np.arange(round(.55*SR))/SR
    add(fx,.16*np.sin(2*np.pi*(92*t-30*t*t))*np.exp(-t*12)*(1-np.exp(-t*220)),.03)
    for scene in timeline["scenes"][1:]:
        t=np.arange(round(.27*SR))/SR;noise=helpers.smooth(rng.normal(0,1,len(t)),13)
        add(fx,noise*.11*np.sin(np.pi*t/.27)**2,max(0,scene["start"]-.13),.3*(-1 if scene["id"]%2 else 1))
    sfx_events=[]
    for event in timeline["events"]:
        if (event["scene"]==4 and event["action"]in[1,2,4])or(event["scene"]==6 and event["action"]in[2,4]):
            t=np.arange(round(.10*SR))/SR;add(fx,.018*np.sin(2*np.pi*740*t)*np.sin(np.pi*t/.1)**2,event["start"],.2)
            sfx_events.append({"time":event["start"],"event":event["id"],"kind":"neural pulse"if event["scene"]==4 else "monitor tick"})
    fade=np.minimum(1,np.arange(n)/(SR*.08))*np.minimum(1,(n-1-np.arange(n))/(SR*.32))
    music*=fade[:,None];fx*=fade[:,None]
    energy=np.sqrt(np.maximum(0,helpers.smooth(np.mean(voice**2,axis=1),round(.06*SR))))
    duck=.38+.62*(1-np.clip(helpers.smooth(energy/.018,round(.08*SR)),0,1))
    helpers.wav(DIRECTORY/"musica_original.wav",music);helpers.wav(DIRECTORY/"efectos_originales.wav",fx)
    helpers.wav(DIRECTORY/"mezcla_previa.wav",voice+music*duck[:,None]+fx)
    master="mezcla_preview"if args.preview else "mezcla_master"
    helpers.loudnorm(DIRECTORY/"mezcla_previa.wav",DIRECTORY/f"{master}.wav",-14)
    for source,target in [("musica_original","musica_original"),("efectos_originales","efectos_originales"),("voz_normalizada","narracion_preview"if args.preview else "narracion"),(master,master)]:
        subprocess.run(["ffmpeg","-v","error","-y","-i",str(DIRECTORY/f"{source}.wav"),"-c:a","flac",str(DIRECTORY/f"{target}.flac")],check=True)
    (OUT/("audio_preview.json"if args.preview else "audio_produccion.json")).write_text(json.dumps({"mode":"preview-existing-voice"if args.preview else "production-expanded-narration","duration":70,"voiceTempo":1.25,"musicBpm":105,"oldMusicBpm":84,"samplesUsed":[],"scoreEvolution":"chapter-dependent layers, harmonic changes, pulse density and timbre","voiceDuckMinimum":.38,"sfx":sfx_events,"master":str(DIRECTORY/f"{master}.flac")},indent=2)+"\n")

if __name__=="__main__":main()

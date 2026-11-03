"""Original 105 BPM score and word-cued SFX; no provider calls or samples."""
import argparse,importlib.util,json,math,subprocess,wave
from pathlib import Path
import numpy as np

SR=48000
ROOT=Path("src/episodios/episodio-02-tiempo")
DIRECTORY=Path("public/episodios/episodio-02-tiempo/audio")
OUT=Path("output/episodio-02-tiempo")
spec=importlib.util.spec_from_file_location("approved_audio_helpers","scripts/episodio-01-cerebro/crear_audio.py")
helpers=importlib.util.module_from_spec(spec);spec.loader.exec_module(helpers)

def main():
    p=argparse.ArgumentParser();p.add_argument("--voice",required=True);p.add_argument("--preview",action="store_true");args=p.parse_args()
    DIRECTORY.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
    timeline=json.loads((ROOT/"timeline.json").read_text());n=70*SR;music=np.zeros((n,2));fx=np.zeros((n,2))
    helpers.loudnorm(args.voice,DIRECTORY/"voz_normalizada.wav",-16,"highpass=f=75,")
    voice=np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",str(DIRECTORY/"voz_normalizada.wav"),"-ar",str(SR),"-ac","2","-f","f32le","-"]),dtype=np.float32).reshape(-1,2)
    assert len(voice)==n,"Narration timeline must already be exactly 70s"
    rng=np.random.default_rng(12502)
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
        # Memory chapters gain texture; attention comparison stays restrained.
        if chapter!=5 or i%2==0:add(music,note(chord[i%4]+24,.8,.035,color=.08+.025*chapter),time,math.sin(i)*.45)
        if chapter in [0,2,4,7]and i%2==0:
            t=np.arange(round(.08*SR))/SR;add(music,helpers.smooth(rng.normal(0,1,len(t)),11)*np.exp(-t*55)*.012,time,-.3)
    music*=10**(-29.5/20)/max(1e-9,np.sqrt(np.mean(music**2)))
    t=np.arange(round(.55*SR))/SR
    add(fx,.16*np.sin(2*np.pi*(92*t-30*t*t))*np.exp(-t*12)*(1-np.exp(-t*220)),.03)
    for scene in timeline["scenes"][1:]:
        t=np.arange(round(.27*SR))/SR;noise=helpers.smooth(rng.normal(0,1,len(t)),13)
        add(fx,noise*.11*np.sin(np.pi*t/.27)**2,max(0,scene["start"]-.13),.3*(-1 if scene["id"]%2 else 1))
    sfx_events=[]
    def tick(start,level=.018):
        t=np.arange(round(.055*SR))/SR
        sound=level*(np.sin(2*np.pi*1900*t)+.25*np.sin(2*np.pi*520*t))*np.exp(-t*95)*(1-np.exp(-t*1400))
        add(fx,sound,start,-.2)
    # A brief acceleration belongs to the opening, not a looping 70s tic-tac.
    for time in [0,.58,1.06,1.45,1.77,2.02,2.23,2.40]:
        tick(time);sfx_events.append({"time":time,"kind":"opening clock tick","intent":"Accelerating opening clock, stops before 3 seconds"})
    for event in timeline["events"]:
        scene,action=event["scene"],event["action"]
        if (scene==0 and action==4)or(scene==3 and action in[1,2,3]):
            t=np.arange(round(.13*SR))/SR
            sound=helpers.smooth(rng.normal(0,1,len(t)),8)*np.sin(np.pi*t/.13)**2*.025
            add(fx,sound,event["start"],.2);kind="calendar / routine flip"
        elif (scene==4 and action in[2,4])or(scene==6 and action in[2,3,4,5]):
            t=np.arange(round(.24*SR))/SR
            sound=.018*(np.sin(2*np.pi*660*t)+.28*np.sin(2*np.pi*990*t))*np.exp(-t*17)*(1-np.exp(-t*180))
            add(fx,sound,event["start"],-.25 if action%2 else .25);kind="memory / discovery accent"
        elif scene==5 and action==3:
            tick(event["start"],.014);kind="attention focus tick"
        else:continue
        sfx_events.append({"time":event["start"],"event":event["id"],"kind":kind,"cue":event["cue"]})
    # Grounded everyday actions: a few quiet steps, never a continuous loop.
    for event in timeline["events"]:
        if (event["scene"]==3 and event["action"]in[2,3])or(event["scene"]==6 and event["action"]==3):
            for step in [0,.22]:
                t=np.arange(round(.085*SR))/SR
                sound=.011*(helpers.smooth(rng.normal(0,1,len(t)),17)+.3*np.sin(2*np.pi*130*t))*np.exp(-t*44)*(1-np.exp(-t*600))
                add(fx,sound,event["start"]+step,-.18 if step==0 else .18)
            sfx_events.append({"time":event["start"],"event":event["id"],"kind":"quiet footsteps following the protagonist","cue":event["cue"]})
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
    (OUT/("audio_preview.json"if args.preview else "audio_produccion.json")).write_text(json.dumps({"mode":"preview"if args.preview else "production-episodio02-real-narration","duration":70,"voiceTempo":1.25,"musicBpm":105,"oldMusicBpm":84,"samplesUsed":[],"scoreEvolution":"105BPM, chapter-dependent layers, discovery accents, restrained attention comparison, harmonic and timbral development","voiceDuckMinimum":.38,"sfx":sfx_events,"master":str(DIRECTORY/f"{master}.flac")},indent=2)+"\n")

if __name__=="__main__":main()

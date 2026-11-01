"""Original 70s cinematic score/SFX; optional real voice, never synthetic fake VO.

The oscillator score contains no samples. --voice must be an existing aligned
70s WAV; without it the export is explicitly marked voice-pending.
"""
import argparse
import json
import math
import re
import subprocess
import wave
from pathlib import Path
import numpy as np

SR=48000
DURATION=70
DIRECTORY=Path("public/episodios/episodio-01-cerebro/audio")
OUTPUT=Path("output/episodio-01-cerebro")

def wav(path,samples):
    if samples.ndim==1: samples=np.column_stack([samples,samples])
    assert np.max(np.abs(samples))<1,"Clipping before export"
    with wave.open(str(path),"wb") as out:
        out.setnchannels(2);out.setsampwidth(2);out.setframerate(SR)
        out.writeframes(np.round(samples*32767).astype("<i2").tobytes())

def loudnorm(source,output,target=-14,prefix=""):
    base=f"loudnorm=I={target}:TP=-2:LRA=7"
    first=subprocess.run(["ffmpeg","-hide_banner","-i",str(source),"-af",prefix+base+":print_format=json","-f","null","-"],capture_output=True,text=True,check=True)
    stats=json.loads(re.findall(r"\{[^{}]*\}",first.stderr)[-1])
    measured=f":measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true"
    subprocess.run(["ffmpeg","-v","error","-y","-i",str(source),"-af",prefix+base+measured,"-ar",str(SR),"-ac","2","-c:a","pcm_s16le",str(output)],check=True)
    return stats

def smooth(values,size):
    padded=np.pad(values,(size//2,size-size//2),mode="edge")
    sums=np.cumsum(padded,dtype=np.float64)
    return (sums[size:]-sums[:-size])/size

def main():
    parser=argparse.ArgumentParser();parser.add_argument("--voice",type=Path);args=parser.parse_args()
    DIRECTORY.mkdir(parents=True,exist_ok=True);OUTPUT.mkdir(parents=True,exist_ok=True)
    n=DURATION*SR;music=np.zeros((n,2));effects=np.zeros((n,2));rng=np.random.default_rng(1001)
    def add(buffer,sound,start,pan=0):
        offset=round(start*SR);length=min(len(sound),len(buffer)-offset)
        if offset<0 or length<=0:return
        buffer[offset:offset+length,0]+=sound[:length]*math.sqrt((1-pan)/2)
        buffer[offset:offset+length,1]+=sound[:length]*math.sqrt((1+pan)/2)
    def note(midi,duration,level,pad=False):
        t=np.arange(round(duration*SR))/SR;f=440*2**((midi-69)/12)
        if pad:
            envelope=np.minimum(1,t/.65)*np.minimum(1,(duration-t)/1.3)
            return level*envelope*(np.sin(2*np.pi*f*t)+.15*np.sin(2*np.pi*f*2.001*t))
        envelope=(1-np.exp(-t*80))*np.exp(-t*3.8)
        return level*envelope*(np.sin(2*np.pi*f*t)+.21*np.sin(2*np.pi*f*2*t))
    # Dm9 / Bbmaj7 / Fmaj9 / Cadd9: restrained documentary tension/resolution.
    chords=[[50,57,60,64],[46,53,57,62],[53,60,64,67],[48,55,62,64]]
    beat=60/84
    for section,start in enumerate(np.arange(0,DURATION,beat*8)):
        chord=chords[section%4]
        for j,midi in enumerate(chord):add(music,note(midi,beat*9,.045,True),float(start),(-.5,.3,-.2,.5)[j])
    for i in range(math.ceil(DURATION/beat)):
        if i%2 or 44<=i*beat<64:continue
        chord=chords[(i//8)%4]
        add(music,note(chord[(i//2)%4]+24,1.1,.035),i*beat,math.sin(i)*.45)
    music*=10**(-29/20)/max(1e-9,np.sqrt(np.mean(music**2)))
    # Original low impact and airy spatial transitions, no alarms or gore.
    t=np.arange(round(.8*SR))/SR
    impact=.20*np.sin(2*np.pi*(82*t-24*t*t))*np.exp(-t*8)*(1-np.exp(-t*180))
    add(effects,impact,.08)
    for i,start in enumerate([2.55,4.65,12.65,21.6,32.6,43.65,54.7,63.65]):
        t=np.arange(round(.52*SR))/SR;noise=smooth(rng.normal(0,1,len(t)),17)
        sound=(noise*.14+np.sin(2*np.pi*(700*t-420*t*t))*.012)*np.sin(np.pi*t/.52)**2
        add(effects,sound,start,(-1 if i%2 else 1)*.35)
    for start in [6.4,8.5,10.8,23.9,26,28.7,34.3,36.4,38.5,40.5,65.2]:
        t=np.arange(round(.18*SR))/SR
        pulse=.025*np.sin(2*np.pi*740*t)*np.exp(-t*26)*(1-np.exp(-t*160))
        add(effects,pulse,start,.1)
    for start in [46.5,49.5,52.5,56.5,59.5,62.5]:
        t=np.arange(round(.12*SR))/SR
        add(effects,.009*np.sin(2*np.pi*660*t)*np.sin(np.pi*t/.12)**2,start,.35)
    fade=np.minimum(1,np.arange(n)/(SR*.18))*np.minimum(1,(n-1-np.arange(n))/(SR*.8))
    music*=fade[:,None];effects*=fade[:,None]
    voice=np.zeros((n,2));voice_stats=None
    if args.voice:
        assert args.voice.exists(),"Missing real voice file"
        voice_stats=loudnorm(args.voice,DIRECTORY/"narracion_normalizada.wav",-16,"highpass=f=75,")
        pcm=subprocess.check_output(["ffmpeg","-v","error","-i",str(DIRECTORY/"narracion_normalizada.wav"),"-f","f32le","-ar",str(SR),"-ac","2","-"])
        decoded=np.frombuffer(pcm,dtype=np.float32).reshape(-1,2)
        assert len(decoded)<=n,"Narration exceeds 70s; never cut words"
        voice[:len(decoded)]=decoded
    energy=np.sqrt(np.maximum(0,smooth(np.mean(voice**2,axis=1),round(.08*SR))))
    duck=.45+.55*(1-np.clip(smooth(energy/.018,round(.12*SR)),0,1))
    wav(DIRECTORY/"musica_original.wav",music);wav(DIRECTORY/"efectos_originales.wav",effects)
    wav(DIRECTORY/"mezcla_previa.wav",voice+music*duck[:,None]+effects)
    # A pending-voice preview retains comfortable ambient levels, rather than
    # normalizing background music to narration loudness.
    target=-14 if args.voice else -24
    stats=loudnorm(DIRECTORY/"mezcla_previa.wav",DIRECTORY/"mezcla_master.wav",target)
    for name in ["musica_original","efectos_originales","mezcla_master"]:
        subprocess.run(["ffmpeg","-v","error","-y","-i",str(DIRECTORY/f"{name}.wav"),"-c:a","flac",str(DIRECTORY/f"{name}.flac")],check=True)
    report={"durationSeconds":70,"sampleRate":SR,"channels":2,"voiceStatus":"real-integrated" if args.voice else "pending-authorization","voiceSource":str(args.voice) if args.voice else None,"playbackRate":1,"originalScore":"84 BPM, Dm9/Bbmaj7/Fmaj9/Cadd9, synthesized from oscillators","samplesUsed":[],"sfx":"original impact, air transitions, neural pulses and discreet monitor tones","duckMinimum":.45,"masterTargetLufs":target,"masterTargetTruePeakDbtp":-2,"voiceMeasurement":voice_stats,"preMasterMeasurement":stats}
    (OUTPUT/"audio_produccion.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n")
    print(f"70s master ready; voice: {report['voiceStatus']}")

if __name__=="__main__":main()

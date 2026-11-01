"""Original score, whooshes and heartbeat. No samples, stock or protected music."""
import argparse
import json
import math
import re
import subprocess
import wave
from pathlib import Path
import numpy as np

SR = 48000
DIRECTORY = Path("public/piloto10s/audio")

def write_wave(path, samples):
    if samples.ndim == 1:
        samples = np.column_stack([samples, samples])
    assert np.max(np.abs(samples)) < 1, "Clipping before export"
    with wave.open(str(path), "wb") as out:
        out.setnchannels(samples.shape[1]); out.setsampwidth(2); out.setframerate(SR)
        out.writeframes(np.round(samples * 32767).astype("<i2").tobytes())

def loudnorm(source, target, output, prefix=""):
    base = f"loudnorm=I={target}:TP=-2:LRA=7"
    first = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(source), "-af", prefix + base + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
    stats = json.loads(re.findall(r"\{[^{}]*\}", first.stderr)[-1])
    measured = f":measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(source), "-af", prefix + base + measured, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(output)], check=True)
    return stats

def average(values, size):
    padded = np.pad(values, (size//2, size-size//2), mode="edge")
    sums = np.cumsum(padded, dtype=np.float64)
    return (sums[size:] - sums[:-size]) / size

def run():
    parser = argparse.ArgumentParser(); parser.add_argument("--duration", type=float, default=10)
    args = parser.parse_args(); duration = args.duration
    DIRECTORY.mkdir(parents=True, exist_ok=True)
    source = DIRECTORY / "narracion_original.mp3"
    voice_duration = float(json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_format", "-of", "json", str(source)]))["format"]["duration"])
    assert voice_duration + .18 < duration - .1, "Rewrite narration; never accelerate to force a fit."
    voice_stats = loudnorm(source, -16, DIRECTORY / "narracion_normalizada.wav", "highpass=f=75,")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(DIRECTORY / "narracion_normalizada.wav"), "-af", f"adelay=180:all=1,apad,atrim=duration={duration}", "-ar", str(SR), "-c:a", "pcm_s16le", str(DIRECTORY / "narracion.wav")], check=True)
    n = round(duration * SR); music = np.zeros((n,2)); sfx = np.zeros(n)
    def add(buffer, sound, start, pan=0):
        offset = round(start*SR); length = min(len(sound), len(buffer)-offset)
        if length <= 0: return
        if buffer.ndim == 1: buffer[offset:offset+length] += sound[:length]
        else:
            buffer[offset:offset+length,0] += sound[:length] * math.sqrt((1-pan)/2)
            buffer[offset:offset+length,1] += sound[:length] * math.sqrt((1+pan)/2)
    def pluck(midi, seconds, amp):
        t=np.arange(round(seconds*SR))/SR; f=440*2**((midi-69)/12)
        env=(1-np.exp(-t*120))*np.exp(-t*2.8)
        return amp*env*(np.sin(2*np.pi*f*t)+.28*np.sin(2*np.pi*f*2*t)+.08*np.sin(2*np.pi*f*3*t))
    chords=[[60,64,67,71],[53,57,60,64],[57,60,64,67],[55,60,62,65]]
    beat=.625
    for i in range(math.ceil(duration/beat)):
        chord=chords[(i//4)%4]
        for j,note in enumerate(chord): add(music,pluck(note+12,1.3,.15),i*beat+j*.035,(-.45,.2,-.2,.45)[j])
        if i%2==0: add(music,pluck(chord[0]-12,1.1,.10),i*beat,0)
    music *= 10**(-29/20)/max(1e-9,np.sqrt(np.mean(music**2)))
    rng=np.random.default_rng(2046)
    for start in [.035,1.84,4.86,7.84]:
        t=np.arange(round(.34*SR))/SR
        noise=rng.normal(0,1,len(t)); noise=average(noise,13)
        env=np.sin(np.pi*t/.34)**2
        sound=(noise*.12+np.sin(2*np.pi*(820*t-720*t*t))*.018)*env
        add(sfx,sound,start)
    for start in np.arange(2.2,duration-.35,.85):
        t=np.arange(round(.33*SR))/SR
        thump=.10*np.sin(2*np.pi*(78*t-35*t*t))*np.exp(-t*24)*(1-np.exp(-t*180))
        t2=np.maximum(0,t-.13)
        thump+=.07*np.sin(2*np.pi*100*t2)*np.exp(-t2*35)*(1-np.exp(-t2*220))*(t>=.13)
        thump += .025*np.sin(2*np.pi*220*t)*np.exp(-t*26)*(1-np.exp(-t*180))
        add(sfx,thump,float(start))
    fade=np.minimum(1,np.arange(n)/(SR*.12))*np.minimum(1,(n-1-np.arange(n))/(SR*.45))
    music *= fade[:,None]; sfx *= fade
    write_wave(DIRECTORY / "musica_original.wav", music)
    write_wave(DIRECTORY / "efectos_originales.wav", sfx)
    with wave.open(str(DIRECTORY / "narracion.wav")) as stream: voice=np.frombuffer(stream.readframes(stream.getnframes()),dtype="<i2").astype(float).reshape(-1,2)/32768
    rms=np.sqrt(np.maximum(0,average(np.mean(voice**2,axis=1),round(.08*SR))))
    duck=.5+.5*(1-np.clip(average(rms/.018,round(.12*SR)),0,1))
    mix=voice+music*duck[:,None]+sfx[:,None]
    write_wave(DIRECTORY / "mezcla_previa.wav", mix)
    final_stats=loudnorm(DIRECTORY / "mezcla_previa.wav",-14,DIRECTORY / "mezcla_master.wav")
    Path("output/piloto_audio_produccion.json").write_text(json.dumps({"durationSeconds":duration,"sampleRate":SR,"channels":2,"voiceProvider":"ElevenLabs via Higgsfield","voicePreset":"Juan","voiceOriginalSeconds":voice_duration,"voiceOffsetMs":180,"playbackRate":1,"voiceSource":str(source),"originalScore":"procedural composition, 96 BPM, Cmaj7/Fmaj7/Am7/Gsus","musicSamplesUsed":[],"sfx":"original synthesized air transitions and soft lub-dub heartbeat","musicDuckMinimum":.5,"masterTargetLufs":-14,"masterTargetTruePeakDbtp":-2,"voiceMeasurement":voice_stats,"masterPreNormalizationMeasurement":final_stats},ensure_ascii=False,indent=2)+"\n")
    print("Master estéreo original listo, sin acelerar la voz.")

if __name__ == "__main__": run()

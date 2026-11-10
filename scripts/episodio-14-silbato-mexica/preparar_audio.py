"""Map measured Spanish word timestamps to the edited 70-second master."""
from functools import lru_cache
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import unicodedata
import wave

import numpy as np

root = Path(__file__).resolve().parents[2]
out = root / "output/episodio-14-silbato-mexica"
scratch = out / "revision-interna"
src = root / "src/episodios/episodio-14-silbato-mexica"
audio = root / "public/episodio-14/audio"
ffmpeg = os.environ["FFMPEG_PATH"]
sr = 48000
target = 70 * sr


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def canonical(text):
    return "".join(c for c in unicodedata.normalize("NFKD", text.lower()) if c.isascii() and c.isalpha())


script = read(src / "guion.json")
original = audio / "narracion_grady_original.mp3"
recognized = read(scratch / "transcripcion.json")
expected = [word for stage in script for word in stage["text"].split()]
for i in range(len(recognized) - 1):
    a, b = recognized[i:i+2]
    if canonical(a["word"] + b["word"]) == "aterrorizar" and canonical(a["word"]) == "a":
        recognized[i:i+2] = [dict(word="aterrorizar", start=a["start"], end=b["end"],
                                  probability=min(a["probability"], b["probability"]))]
        break
assert len(expected) == len(recognized) == 167
assert list(map(canonical, expected)) == [canonical(w["word"]) for w in recognized], "La toma difiere del guion."

decode = subprocess.check_output([ffmpeg, "-v", "error", "-i", str(original),
                                  "-ar", str(sr), "-ac", "1", "-f", "f32le", "-"])
voice = np.frombuffer(decode, dtype="<f4").copy()
quiet = subprocess.run([ffmpeg, "-hide_banner", "-nostats", "-i", str(original),
                        "-af", "silencedetect=noise=-38dB:d=0.17", "-f", "null", "-"],
                       capture_output=True, text=True, check=True).stderr
silences = [(float(a), float(b)) for a,b in re.findall(
    r"silence_start: ([\d.]+).*?silence_end: ([\d.]+)", quiet, re.S)]
assert silences

# Preserve the original rhythm of every spoken word. Extend quiet sentence
# boundaries modestly to leave room for the mechanical movements.
capacity = np.array([max(0, .705-(b-a)) if b<63.7 else 0 for a,b in silences])
budget = min(3.6, capacity.sum())
edits = []
for (a,b), extra in zip(silences, capacity*budget/capacity.sum()):
    at = round((a+b)*sr/2)
    n = round(extra*sr)
    if n:
        assert np.max(np.abs(voice[at-256:at+256])) < 10**(-37/20)
        voice[at-192:at] *= np.linspace(1,0,192, dtype=np.float32)
        voice[at:at+192] *= np.linspace(0,1,192, dtype=np.float32)
        edits.append((at,n))

lead = round(.15*sr)
chunks, cursor = [np.zeros(lead,np.float32)], 0
for at, n in edits:
    chunks.extend([voice[cursor:at], np.zeros(n,np.float32)])
    cursor = at
chunks.append(voice[cursor:])
spoken = np.concatenate(chunks)
assert len(spoken) < target
spoken = np.pad(spoken,(0,target-len(spoken)))

def remap(seconds):
    sample = round(seconds*sr)
    return (sample+lead+sum(n for at,n in edits if at<=sample))/sr


groups, words, cursor = [], [], 0
for stage in script:
    count = len(stage["text"].split())
    group = []
    for text, observed in zip(expected[cursor:cursor+count], recognized[cursor:cursor+count]):
        start = observed["start"]
        end = observed["end"]
        # Whisper sometimes includes the prior silent interval in the first
        # word's token. Bind the start to the measured onset of sound.
        for a,b in silences:
            if a-.24 <= start < b-.07 and end >= b+.015:
                start = b-.035
        start_ms = max(words[-1]["endMs"] if words else 0, round(remap(start)*1000))
        end_ms = max(start_ms+2, round(remap(end)*1000))
        word = dict(text=text,startMs=start_ms,endMs=end_ms,confidence=observed["probability"])
        words.append(word)
        group.append(word)
    groups.append(group)
    cursor += count

assert 66 < words[-1]["endMs"]/1000 < 70
cues_spec = {
    "grito": (0, "un grito"), "barro": (0, "de barro"),
    "arcilla": (1, "con arcilla"), "cuerpo": (1, "el cuerpo"),
    "conducto": (2, "conducto estrecho"), "chorro": (2, "el chorro"),
    "cavidad": (3, "cavidad cerrada"), "inestable": (3, "vuelve inestable"),
    "aspero": (3, "sonido áspero"), "rostro": (4, "de cráneo"), "campana": (4, "la campana"),
    "exterior": (4, "el trabajo"), "tlatelolco": (5, "En Tlatelolco"),
    "entierro": (5, "un entierro ritual"), "batalla": (5, "en batalla"),
    "sale": (6, "oscila y sale"), "noche": (6, "la noche"),
}


def cue(index, phrase):
    group = groups[index]
    tokens = list(map(canonical, phrase.split()))
    spelling = [canonical(w["text"]) for w in group]
    positions = [i for i in range(len(spelling)) if spelling[i:i+len(tokens)] == tokens]
    assert len(positions)==1, (index,phrase)
    return group[positions[0]+len(tokens)-1]["startMs"]/1000


cues = {key:cue(*spec) for key,spec in cues_spec.items()}

captions, pages = [], []
for group in groups:
    @lru_cache(None)
    def partition(start):
        if start == len(group):
            return 0,[]
        options = []
        for size in (4,3,5):
            stop = start + size
            if stop > len(group):
                continue
            cost, rest = partition(stop)
            span = (group[stop-1]["endMs"]-group[start]["startMs"])/1000
            interior = sum(w["text"].endswith((".", "?")) for w in group[start:stop-1])
            end_bonus = .92 if group[stop-1]["text"].endswith((".", ",", "?")) else 0
            options.append((cost + abs(size-4)*.42 + max(.68-span,0)*4 + interior*3 - end_bonus, [stop]+rest))
        return min(options, default=(float("inf"),[]), key=lambda item:item[0])

    start = 0
    for stop in partition(0)[1]:
        chunk = group[start:stop]
        pages.append(chunk)
        for i,w in enumerate(chunk):
            captions.append(dict(text=(" " if captions else "")+w["text"],startMs=w["startMs"],
                                 endMs=w["endMs"],timestampMs=round((w["startMs"]+w["endMs"])/2),
                                 confidence=w["confidence"],pageBreakAfter=i==len(chunk)-1))
        start = stop
    assert start == len(group)


def clock(ms):
    seconds, millis = divmod(ms,1000)
    minutes, seconds = divmod(seconds,60)
    return f"00:{minutes:02d}:{seconds:02d},{millis:03d}"


srt = "\n".join(f"{i}\n{clock(page[0]['startMs'])} --> {clock(page[-1]['endMs'])}\n"
                + " ".join(w["text"] for w in page) + "\n" for i,page in enumerate(pages,1))
(out / "episodio14_FINAL_GRADY.srt").write_text(srt,encoding="utf-8")


def wav_write(destination, samples):
    with wave.open(str(destination),"wb") as file:
        file.setparams((1,2,sr,0,"NONE","not compressed"))
        file.writeframes(np.round(np.clip(samples,-1,.99996)*32767).astype("<i2").tobytes())


def loudness(path):
    data = subprocess.run([ffmpeg,"-hide_banner","-i",str(path),"-af",
                           "loudnorm=I=-16:TP=-2:LRA=7:print_format=json","-f","null","-"],
                          capture_output=True,text=True,check=True)
    return json.loads(re.search(r'\{\s*"input_i".*?\}',data.stderr,re.S)[0])


raw = scratch / "narracion-antes-de-nivel.wav"
wav_write(raw,spoken)
initial = loudness(raw)
gain_db = min(-16.5-float(initial["input_i"]),-2.3-float(initial["input_tp"]))
spoken *= 10**(gain_db/20)
wav_write(audio / "narracion_grady_70s.wav",spoken)

# A restrained original ambience. The only whistle is a recorded instrument.
sample_time = np.arange(target,dtype=np.float32)/sr
breath = .57+.43*np.sin(2*np.pi*.19*sample_time)**2
sound = breath*(.0048*np.sin(2*np.pi*54.4*sample_time) + .0021*np.sin(2*np.pi*81.6*sample_time))
sound *= np.minimum(sample_time/.55,1)*np.minimum((70-sample_time)/.63,1)

def tap(second, length, frequency, amplitude):
    start=round(second*sr)
    count=min(round(length*sr),target-start)
    if count<=0 or start<0:
        return
    t=np.arange(count,dtype=np.float32)/sr
    env=np.minimum(t*100,1)*np.exp(-t/(length*.22))
    sound[start:start+count] += amplitude*env*np.sin(2*np.pi*frequency*t)

tap(cues["arcilla"]-.16,.27,126,.027)
tap(cues["cuerpo"]+.23,.31,149,.024)
tap(cues["rostro"]+.71,.35,137,.030)
clip_file=audio / "silbato-demostracion-cc0.wav"
demo = None
if clip_file.exists():
    with wave.open(str(clip_file),"rb") as handle:
        assert handle.getnchannels()==1 and handle.getsampwidth()==2 and handle.getframerate()==sr
        whistle=np.frombuffer(handle.readframes(handle.getnframes()),dtype="<i2").astype(np.float32)/32768
    assert .8 < len(whistle)/sr < 1.35
    whistle*=.212/max(1e-8,float(np.max(np.abs(whistle))))
    fade_in,fade_out=round(.028*sr),round(.14*sr)
    whistle[:fade_in]*=np.linspace(0,1,fade_in,dtype=np.float32)
    whistle[-fade_out:]*=np.linspace(1,0,fade_out,dtype=np.float32)
    at=round(max(68.26,words[-1]["endMs"]/1000+.19)*sr)
    assert at+len(whistle)<target
    sound[at:at+len(whistle)]+=whistle
    chunks=np.array_split(whistle,30)
    values=[float(np.sqrt(np.mean(piece**2))) for piece in chunks]
    demo=dict(start=at/sr,end=(at+len(whistle))/sr,sourceStart=.57,sourceEnd=1.77,
              envelope=[round(x/max(values),3) for x in values],title="Aztec Death Whistle",author="Guy_Personface",
              license="CC0 1.0",source="https://freesound.org/people/Guy_Personface/sounds/832472/",
              sha256=hashlib.sha256(clip_file.read_bytes()).hexdigest())
assert np.max(np.abs(spoken+sound)) < .89
master=audio / "mezcla_final_70s.wav"
mix_before = scratch / "mezcla-sin-normalizar.wav"
wav_write(mix_before,spoken+sound)
initial_mix=loudness(mix_before)
normalization = ("loudnorm=I=-16:TP=-2:LRA=7:measured_I={input_i}:measured_TP={input_tp}:"
                 "measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:"
                 "linear=true").format(**initial_mix)
subprocess.run([ffmpeg,"-v","error","-y","-i",str(mix_before),"-af",
                normalization+f",aresample={sr},apad,atrim=end_sample={target}",
                "-ar",str(sr),"-ac","1","-c:a","pcm_s16le",str(master)],check=True)
with wave.open(str(master),"rb") as mixed:
    assert mixed.getframerate()==sr and mixed.getnframes()==target
metrics=loudness(master)

starts=[0]+[g[0]["startMs"]/1000 for g in groups[1:]]
windows=[dict(name=stage["name"],briefStart=stage["start"],start=start,end=end)
         for stage,start,end in zip(script,starts,starts[1:]+[70])]
save(src / "captions.json",captions)
save(src / "timeline.json",dict(audioReady=True,cues=cues,stages=windows,tempo=1,demo=demo,
    alignment="faster-whisper-small multilingual, Spanish; quiet edits remapped at sample level"))
save(out / "voz-verificada.json",dict(provider="Higgsfield",model="elevenlabs_v4",voice="Grady",
    voiceId="e2a2d2e6-9ed2-59cd-82af-feaa27f8a678",generationId="dc5f9561-b482-47b4-a873-855a32bb54ae",
    generations=1,credits=4.60,sourceDuration=len(voice)/sr,duration=70,sampleRate=sr,tempo=1,captionNormalization=["a terrorizar → aterrorizar (segmentación automática)"],demo=demo,
    words=len(words),pages=len(pages),lastWordEndMs=words[-1]["endMs"],edits=edits,
    quietAddedSeconds=sum(n for _,n in edits)/sr,preRoll=lead/sr,gainDb=gain_db,mixLoudness=metrics,
    sourceSha256=hashlib.sha256(original.read_bytes()).hexdigest(),mixSha256=hashlib.sha256(master.read_bytes()).hexdigest(),
    cues=cues,stages=windows))
print(json.dumps(dict(words=len(words),pages=len(pages),cues=cues,windows=windows,
                      last=words[-1]["endMs"],quietAdded=sum(n for _,n in edits)/sr,loudness=metrics),
                 ensure_ascii=False))

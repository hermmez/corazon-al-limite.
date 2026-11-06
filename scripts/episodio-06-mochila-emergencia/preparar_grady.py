"""Fit the complete Higgsfield take with quiet pause cuts and a small pitch-preserving adjustment."""
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

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output/episodio-06-emergencia"
SRC = ROOT / "src/episodios/episodio-06-mochila-emergencia"
AUDIO = ROOT / "public/episodio-06/audio"
SOURCE = AUDIO / "narracion_grady_original.mp3"
FFMPEG = os.environ["FFMPEG_PATH"]
SR = 48000
TARGET = 70 * SR
MAX_TEMPO = 1.09


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def canonical(word):
    return re.sub(r"[^\w]", "", unicodedata.normalize("NFC", word.casefold()))


def acoustic_words(chapters):
    expected = [word for chapter in chapters for word in chapter["text"].split()]
    data = read(OUT / "alineacion-original.json")
    raw = data["raw"]
    number = next(i for i, w in enumerate(raw) if canonical(w[0]) == "72")
    # Align the entire EU sentence to keep the three words of 72 on acoustic boundaries.
    aligned = [w for w in data["numeric72"] if canonical(w[0])]
    numeric_start = next(i for i,w in enumerate(aligned) if canonical(w[0]) == "setenta")
    first = number - numeric_start
    stop = first + len(aligned) - 2
    assert len(aligned) == stop - first + 2
    assert [canonical(w[0]) for w in aligned][numeric_start:numeric_start+3] == ["setenta", "y", "dos"]
    observed = [*raw[:first], *aligned, *raw[stop:]]
    observed = [["veintiocho" if canonical(w[0]) == "28" else w[0], *w[1:]] for w in observed]
    assert len(expected) == 177 and [canonical(w) for w in expected] == [canonical(w[0]) for w in observed]
    return [(word, *spoken[1:]) for word, spoken in zip(expected, observed)]


def quiet_intervals(samples):
    result = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", str(SOURCE), "-af", "silencedetect=noise=-39dB:d=0.13", "-f", "null", "-"], capture_output=True, text=True, check=True)
    starts = re.findall(r"silence_start: ([\d.]+)", result.stderr)
    ends = re.findall(r"silence_end: ([\d.]+)", result.stderr)
    assert len(starts) == len(ends)
    return [(round(float(a)*SR), min(len(samples), round(float(b)*SR))) for a,b in zip(starts, ends)]


def edit_pauses(samples, intervals):
    cuts = []
    for a,b in intervals:
        boundary = a == 0 or b >= len(samples)-5
        # Retain articulation around the quiet centre. Keep more time at sentence breaks.
        keep = .16 if (b-a)/SR < .42 else .21
        if boundary:
            keep = .14 if a == 0 else .20
        count = max(0, b-a-round(keep*SR))
        if count == 0:
            continue
        start = (a+b-count)//2
        stop = start+count
        peak = float(np.max(np.abs(samples[start:stop])))
        assert peak < 10**(-38.5/20), "Quiet cut overlaps audible signal"
        cuts.append(dict(start=start, end=stop, removed=count, retained=(b-a-count)/SR, peakDbfs=20*math.log10(max(peak,1e-12))))
    chunks, cursor = [], 0
    for cut in cuts:
        chunks.append(samples[cursor:cut["start"]])
        cursor = cut["end"]
    return np.concatenate([*chunks, samples[cursor:]]), cuts


def prepare_timing(chapters, spoken, intervals, cuts, tempo, samples):
    def map_sample(seconds):
        sample = round(seconds * SR)
        removed = sum(max(0,min(sample,c["end"])-c["start"]) for c in cuts)
        return (sample-removed) / SR / tempo

    words = []
    for word,start,end,confidence in spoken:
        for a,b in intervals:
            quiet_start, quiet_end = a/SR,b/SR
            if start <= quiet_start+.04 and end > quiet_end and quiet_end-start > .16:
                start = max(start,quiet_end-.035)
        mapped = max(words[-1]["end"] if words else 0,map_sample(start))
        words.append(dict(word=word,start=mapped,end=map_sample(end),confidence=confidence))
    last = intervals[-1]
    if last[1] >= len(samples)-5 and 0 < last[0]/SR-spoken[-1][2] < .4:
        words[-1]["end"] = min(69.90,map_sample(last[0]/SR))
    assert all(0 <= w["start"] < w["end"] < 70 for w in words)

    edges, groups, cursor = [0], [], 0
    for chapter in chapters:
        count = len(chapter["text"].split())
        group = words[cursor:cursor+count]
        if cursor:
            edge = min(group[0]["start"]-.032, (words[cursor-1]["end"]+group[0]["start"])/2)
            edges.append(max(edges[-1]+1,math.floor(edge*30)))
        groups.append(group)
        cursor += count
    edges.append(2100)

    captions, windows = [], []
    for index,(chapter,group) in enumerate(zip(chapters,groups)):
        begin,end=edges[index:index+2]
        windows.append(dict(name=chapter["name"],startFrame=begin,endFrame=end,start=begin/30,end=end/30,durationInFrames=end-begin))

        @lru_cache(None)
        def partition(start):
            if start==len(group):
                return 0, []
            candidates=[]
            for size in (4,3,5):
                stop=start+size
                if stop>len(group):
                    continue
                score,ends=partition(stop)
                span=group[stop-1]["end"]-group[start]["start"]
                punctuation=-1.3 if group[stop-1]["word"].endswith((".","?",":",",",";")) else 0
                internal=3*sum(w["word"].endswith((".","?")) for w in group[start:stop-1])
                candidates.append((score+abs(size-4)*.4+max(0,.78-span)*5+punctuation+internal,[stop]+ends))
            return min(candidates,default=(float("inf"),[]),key=lambda c:c[0])

        ends=set(partition(0)[1]); assert len(group) in ends
        for position,w in enumerate(group):
            captions.append(dict(text=(" " if captions else "")+w["word"],startMs=round(w["start"]*1000),endMs=round(w["end"]*1000),timestampMs=round((w["start"]+w["end"])*500),confidence=w["confidence"],pageBreakAfter=position+1 in ends))
    save(SRC / "captions.json",captions)
    save(SRC / "timeline.json",dict(voiceReady=True,duration=70,sceneWindows=windows,events=words,tempo=tempo,timingSource="Faster Whisper small Spanish and acoustic alignment of setenta y dos, mapped through measured pause edits and pitch-preserving tempo"))
    return words,windows


def main():
    chapters=read(SRC / "chapters.json")
    spoken=acoustic_words(chapters)
    scratch=OUT / "revision-interna"
    original=scratch / "grady-original.f32"
    paused=scratch / "grady-pausas.f32"
    adjusted=scratch / "grady-ajuste.f32"
    subprocess.run([FFMPEG,"-v","error","-y","-i",str(SOURCE),"-ar",str(SR),"-ac","1","-f","f32le",str(original)],check=True)
    samples=np.memmap(original,dtype="<f4",mode="r")
    intervals=quiet_intervals(samples)
    edited,cuts=edit_pauses(samples,intervals)
    tempo=max(1,len(edited)/(TARGET-round(.04*SR)))
    print(json.dumps(dict(sourceSeconds=len(samples)/SR,editedSeconds=len(edited)/SR,tempo=tempo,quietSecondsRemoved=(len(samples)-len(edited))/SR)),flush=True)
    assert tempo<=MAX_TEMPO, "La toma requiere una aceleración mayor al margen natural; revisar antes de continuar"
    quiet_removed=(len(samples)-len(edited))/SR
    edited.tofile(paused)
    del edited
    pcm_input=["-f","f32le","-ar",str(SR),"-ac","1"]
    subprocess.run([FFMPEG,"-v","error","-y",*pcm_input,"-i",str(paused),"-af",f"atempo={tempo:.10f}","-f","f32le",str(adjusted)],check=True)
    changed=np.memmap(adjusted,dtype="<f4",mode="r")
    assert abs(len(changed)-TARGET)<.15*SR
    if len(changed)>TARGET:
        assert np.max(np.abs(changed[TARGET:])) < 10**(-38/20), "End trim would cut audible sound"
    del changed
    temp=scratch / "grady-ajuste.wav"
    subprocess.run([FFMPEG,"-v","error","-y",*pcm_input,"-i",str(adjusted),"-af",f"apad,atrim=end_sample={TARGET}","-c:a","pcm_s16le",str(temp)],check=True)
    paused.unlink(); adjusted.unlink()
    loud=subprocess.run([FFMPEG,"-hide_banner","-i",str(temp),"-af","loudnorm=I=-16:TP=-2:LRA=7:print_format=json","-f","null","-"],capture_output=True,text=True,check=True)
    measured=json.loads(re.search(r'\{\s*"input_i".*?\}',loud.stderr,re.S)[0])
    filter_value="loudnorm=I=-16:TP=-2:LRA=7:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json".format(**measured)
    final=AUDIO / "narracion_grady_70s.wav"
    normalized=subprocess.run([FFMPEG,"-hide_banner","-y","-i",str(temp),"-af",filter_value,"-ar",str(SR),"-ac","1","-c:a","pcm_s16le",str(final)],capture_output=True,text=True,check=True)
    with wave.open(str(final),"rb") as wav:
        assert wav.getnframes()==TARGET and wav.getframerate()==SR
    words,windows=prepare_timing(chapters,spoken,intervals,cuts,tempo,samples)
    report=dict(sourceSha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),sourceDuration=len(samples)/SR,duration=70,sampleRate=SR,finalSamples=TARGET,tempo=tempo,pitchPreserved=True,words=len(words),speechWordsRemoved=0,quietSecondsRemoved=quiet_removed,cuts=cuts,finalSha256=hashlib.sha256(final.read_bytes()).hexdigest(),loudness=json.loads(re.search(r'\{\s*"input_i".*?\}',normalized.stderr,re.S)[0]),sceneWindows=windows)
    del samples
    original.unlink(); temp.unlink()
    save(OUT / "grady-edicion-audio.json",report)
    metadata=read(AUDIO / "narracion-grady.json")
    metadata.update({key:report[key] for key in ["sourceSha256","sourceDuration","duration","tempo","pitchPreserved","quietSecondsRemoved","finalSha256"]})
    metadata["status"]="aligned-and-verified-wav"
    save(AUDIO / "narracion-grady.json",metadata)
    print(json.dumps(dict(words=len(words),lastWordEnd=words[-1]["end"],tempo=tempo,edges=[x["startFrame"] for x in windows],loudness=report["loudness"]),ensure_ascii=True))


if __name__=="__main__":
    main()

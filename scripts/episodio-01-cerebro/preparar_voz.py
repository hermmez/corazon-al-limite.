"""Align an ACTUAL approved narration and fit pauses, never speech rate.

Usage: python preparar_voz.py --source path/to/real_narration.mp3
Requires faster-whisper / numpy (see scripts/piloto10s/requirements.txt).
No API calls or credit expenditure. Fails on a script mismatch or speech that
cannot fit 70 seconds naturally. Original audio remains untouched.
"""
import argparse
import hashlib
import json
import re
import subprocess
import unicodedata
import wave
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel

ROOT=Path("src/episodios/episodio-01-cerebro")
OUT=Path("output/episodio-01-cerebro")
AUDIO=Path("public/episodios/episodio-01-cerebro/audio")
SR=48000

def norm(text):
    return re.sub(r"[^a-z]","",unicodedata.normalize("NFD",text.lower()).encode("ascii","ignore").decode())

def stamp(ms):
    return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"

def main():
    parser=argparse.ArgumentParser();parser.add_argument("--source",required=True,type=Path);parser.add_argument("--model",default="base");parser.add_argument("--cache",default="/tmp/corazon-piloto-models");args=parser.parse_args()
    assert args.source.exists(),"Missing real narration"
    config=json.loads((ROOT/"production.json").read_text());expected=config["narration"].split()
    OUT.mkdir(parents=True,exist_ok=True);AUDIO.mkdir(parents=True,exist_ok=True)
    decode=lambda rate,channels:np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",str(args.source),"-ar",str(rate),"-ac",str(channels),"-f","f32le","-"]),dtype=np.float32).copy()
    source16=decode(16000,1)
    model=WhisperModel(args.model,device="cpu",compute_type="int8",cpu_threads=2,num_workers=1,download_root=args.cache)
    segments,_=model.transcribe(source16,language="es",beam_size=5,word_timestamps=True,condition_on_previous_text=False,initial_prompt=config["narration"],vad_filter=False)
    words=[{"word":w.word,"start":w.start,"end":w.end,"probability":w.probability}for s in segments for w in s.words]
    raw={"engine":"faster-whisper","version":"1.2.1","model":args.model,"language":"es","computeType":"int8","source":str(args.source),"sha256":hashlib.sha256(args.source.read_bytes()).hexdigest(),"words":words}
    (OUT/"transcripcion_original.json").write_text(json.dumps(raw,ensure_ascii=False,indent=2)+"\n")
    assert [norm(w["word"])for w in words]==[norm(w)for w in expected],"Transcription differs from definitive script: review real audio before exporting."
    assert all(w["end"]>w["start"] for w in words),"Zero-length acoustic timestamp; review alignment"
    source48=decode(SR,2).reshape(-1,2);slices=[];index=0
    for scene in config["scenes"]:
        count=len(scene["text"].split());part=words[index:index+count]
        # Retain breath context; never cut a word or time-stretch speech.
        before=words[index-1]["end"] if index else 0
        after=words[index+count]["start"] if index+count<len(words) else len(source48)/SR
        left=max(before,(before+part[0]["start"])/2,part[0]["start"]-.09)
        right=min(after,(part[-1]["end"]+after)/2,part[-1]["end"]+.16)
        a=round(left*SR);b=round(right*SR)
        slices.append({"scene":scene["id"],"index":index,"count":count,"a":a,"b":b,"duration":(b-a)/SR,"target":scene["start"]+.12});index+=count
    latest=[0.]*len(slices);deadline=69.85;gap=.08
    for i in range(len(slices)-1,-1,-1):
        latest[i]=deadline-slices[i]["duration"];deadline=latest[i]-gap
    assert latest[0]>=.08,"Actual speech cannot fit naturally: record a new approved take; no acceleration or truncation."
    master=np.zeros((70*SR,2),dtype=np.float32);previous=0;aligned=[];captions=[];srt=[]
    for i,s in enumerate(slices):
        start=max(previous+gap,min(s["target"],latest[i]));offset=round(start*SR)
        clip=source48[s["a"]:s["b"]].copy();fade=min(round(.008*SR),len(clip)//4)
        clip[:fade]*=np.linspace(0,1,fade)[:,None];clip[-fade:]*=np.linspace(1,0,fade)[:,None]
        master[offset:offset+len(clip)]=clip;previous=(offset+len(clip))/SR
        s.update({"start":offset/SR,"end":previous,"sourceStart":s["a"]/SR,"sourceEnd":s["b"]/SR})
        # 3–5 words per group, based only on the actual acoustic timestamps.
        groups=round(s["count"]/4);base,extra=divmod(s["count"],groups)
        counts=[base+(j<extra)for j in range(groups)];assert all(3<=n<=5 for n in counts)
        breaks=set(np.cumsum(counts)-1);group=[]
        for local,j in enumerate(range(s["index"],s["index"]+s["count"])):
            w=words[j];shift=offset/SR-s["a"]/SR
            start_ms=round((w["start"]+shift)*1000);end_ms=round((w["end"]+shift)*1000)
            assert 0<=start_ms<end_ms<=70000
            c={"text":(" "if j else "")+expected[j],"startMs":start_ms,"endMs":end_ms,"timestampMs":round((start_ms+end_ms)/2),"confidence":w["probability"],"pageBreakAfter":local in breaks}
            captions.append(c);aligned.append({"word":expected[j],"sourceStart":w["start"],"sourceEnd":w["end"],"shiftSeconds":shift,"startMs":start_ms,"endMs":end_ms,"scene":s["scene"]});group.append(c)
            if c["pageBreakAfter"]:
                srt.append(f"{len(srt)+1}\n{stamp(group[0]['startMs'])} --> {stamp(group[-1]['endMs'])}\n{''.join(c['text']for c in group).strip()}\n");group=[]
    with wave.open(str(AUDIO/"narracion_timeline.wav"),"wb")as out:
        out.setnchannels(2);out.setsampwidth(2);out.setframerate(SR);out.writeframes(np.round(master*32767).astype("<i2").tobytes())
    (ROOT/"captions.json").write_text(json.dumps(captions,indent=2,ensure_ascii=False)+"\n")
    (OUT/"subtitulos.srt").write_text("\n".join(srt))
    (OUT/"alineacion_audio_real.json").write_text(json.dumps({"engine":"faster-whisper","model":args.model,"playbackRate":1,"source":str(args.source),"words":aligned,"sceneAudio":slices},ensure_ascii=False,indent=2)+"\n")
    config["voice"].update({"status":"real-integrated","source":str(args.source),"timeline":"public/episodios/episodio-01-cerebro/audio/narracion_timeline.wav","lastWordEndMs":captions[-1]["endMs"]})
    config["captionAlignment"]="actual audio word timestamps, silence-only timeline edits"
    (ROOT/"production.json").write_text(json.dumps(config,ensure_ascii=False,indent=2)+"\n")
    config_path=ROOT/"config.ts";config_path.write_text(config_path.read_text().replace("narrationReady: false","narrationReady: true"))
    subprocess.run(["python","scripts/episodio-01-cerebro/crear_audio.py","--voice",str(AUDIO/"narracion_timeline.wav")],check=True)
    print(f"{len(captions)} words aligned to actual audio; last word ends at {captions[-1]['endMs']/1000:.3f}s. No speed changes.")

if __name__=="__main__":main()

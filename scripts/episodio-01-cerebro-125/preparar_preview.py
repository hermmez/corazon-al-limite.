"""Nonpaid visual proof, using only the existing approved narrator recording.

This is not the requested final expanded narration. The video and report retain
an explicit preview label; production rendering remains blocked without real VO.
"""
import json,subprocess,wave
from pathlib import Path
import numpy as np
ROOT=Path("src/episodios/episodio-01-cerebro-125");OUT=Path("output/episodio-01-cerebro-125");AUDIO=Path("public/episodios/episodio-01-cerebro-125/audio");SR=48000
source="public/episodios/episodio-01-cerebro/audio/narracion_original.mp3"
raw=json.loads(Path("output/episodio-01-cerebro/alineacion_audio_real.json").read_text())
timeline=json.loads((ROOT/"timeline.json").read_text());master=np.zeros((70*SR,2),np.float32);captions=[];spans=[]
for new,old in enumerate([0,1,3,2,4,5,6,7]):
    scene=raw["sceneAudio"][old];words=[w for w in raw["words"]if w["scene"]==old+1]
    if old==7:words=words[:-4]  # Remove the prolonged follow-us goodbye.
    a=scene["sourceStart"];b=min(scene["sourceEnd"],words[-1]["sourceEnd"]+.12)
    pcm=subprocess.check_output(["ffmpeg","-v","error","-ss",str(a),"-to",str(b),"-i",source,"-af","atempo=1.25","-ar",str(SR),"-ac","2","-f","f32le","-"])
    clip=np.frombuffer(pcm,dtype=np.float32).reshape(-1,2);start=timeline["scenes"][new]["start"]+.06;offset=round(start*SR);assert offset+len(clip)<=(70*SR)
    master[offset:offset+len(clip)]=clip
    groups=round(len(words)/4);base,extra=divmod(len(words),groups);breaks=set(np.cumsum([base+(i<extra)for i in range(groups)])-1)
    for i,w in enumerate(words):
        s=round(((w["sourceStart"]-a)/1.25+start)*1000);e=round(((w["sourceEnd"]-a)/1.25+start)*1000)
        captions.append({"text":(" "if captions else "")+w["word"],"startMs":s,"endMs":e,"timestampMs":round((s+e)/2),"confidence":None,"pageBreakAfter":i in breaks})
    spans.append({"scene":new,"start":start,"end":start+len(clip)/SR,"sourceScene":old+1,"status":"existing narration for visual proof; expanded text not yet spoken"})
with wave.open(str(AUDIO/"voz_preview.wav"),"wb")as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(np.round(master*32767).astype("<i2").tobytes())
(ROOT/"captions.json").write_text(json.dumps(captions,ensure_ascii=False,indent=2)+"\n")
timeline["previewAudioReady"]=True;timeline["status"]="visual-preview-expanded-voice-awaiting-authorization";(ROOT/"timeline.json").write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+"\n")
(OUT/"voz_preview.json").write_text(json.dumps({"status":"not-final-voice","newPaidGenerations":0,"source":source,"tempo":1.25,"words":len(captions),"spans":spans},indent=2)+"\n")
subprocess.run(["python","scripts/episodio-01-cerebro-125/crear_audio.py","--voice",str(AUDIO/"voz_preview.wav"),"--preview"],check=True)

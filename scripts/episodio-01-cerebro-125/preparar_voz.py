"""Prepare a real take; never calls a paid service.

Pitch-preserving 1.25x applies to narration only. All visual timing, music and
effects have their own authored timeline. No MP4 is globally sped up.
"""
import argparse,hashlib,json,re,subprocess,unicodedata,wave
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel

ROOT=Path("src/episodios/episodio-01-cerebro-125");OUT=Path("output/episodio-01-cerebro-125");AUDIO=Path("public/episodios/episodio-01-cerebro-125/audio");SR=48000
def norm(s):return re.sub(r"[^a-z]","",unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode())
def decode(file,rate=16000,channels=1):return np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",str(file),"-ar",str(rate),"-ac",str(channels),"-f","f32le","-"]),dtype=np.float32).copy()
def wav(file,audio):
    with wave.open(str(file),"wb")as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(np.round(np.clip(audio,-.999,.999)*32767).astype("<i2").tobytes())

def align(model,audio,script,scenes):
    import difflib
    expected=script.split();checked=[]
    def transcribe(clip,prompt,offset=0,beam=5):
        segments,_=model.transcribe(clip,language="es",beam_size=beam,word_timestamps=True,condition_on_previous_text=False,initial_prompt=prompt,vad_filter=False)
        return [{"word":w.word,"start":round(w.start+offset,3),"end":round(w.end+offset,3),"probability":w.probability}for segment in segments for w in segment.words]
    def subset(raw,target):
        for begin in range(len(raw)):
            result=[];cursor=begin
            for target_word in target:
                for count in [1,2,3]:
                    part=raw[cursor:cursor+count]
                    if len(part)==count and "".join(norm(w["word"])for w in part)==norm(target_word):
                        result.append({"word":target_word,"start":part[0]["start"],"end":part[-1]["end"],"probability":min(w["probability"]for w in part)});cursor+=count;break
                else:break
            if len(result)==len(target)and all(w["end"]>w["start"]for w in result):return result
        return None
    initial=transcribe(audio,script);complete=subset(initial,expected)
    if complete:words=complete
    else:
        matcher=difflib.SequenceMatcher(None,[norm(w)for w in expected],[norm(w["word"])for w in initial]);anchors={}
        for x,y,n in matcher.get_matching_blocks():
            for j in range(n):anchors[x+j]=y+j
        words=[];index=0
        for scene in scenes:
            count=len(scene["text"].split());target=expected[index:index+count]
            already_verified=subset(initial,target)
            if already_verified is not None:
                words.extend(already_verified);index+=count;continue
            left=min((k for k in anchors if index<=k<index+count),default=min(anchors,key=lambda k:abs(k-index)))
            right=max((k for k in anchors if index<=k<index+count),default=min(anchors,key=lambda k:abs(k-index-count+1)))
            a=max(0,initial[anchors[left]]["start"]-1.4);b=min(len(audio)/16000,initial[anchors[right]]["end"]+1.4)
            focused=transcribe(audio[round(a*16000):round(b*16000)],scene["text"],a,10);verified=subset(focused,target)
            checked.append({"scene":scene["id"],"audioStart":a,"audioEnd":b,"words":focused,"matched":verified is not None})
            if verified is None:
                (OUT/"alineacion_error.json").write_text(json.dumps({"expected":expected,"initialWords":initial,"focusedChecks":checked,"words":focused},ensure_ascii=False,indent=2)+"\n")
                raise AssertionError(f"Acoustic verification failed in scene {scene['id']}; review the take")
            words.extend(verified);index+=count
    assert [norm(w["word"])for w in words]==[norm(w)for w in expected]
    repairs=[]
    for previous,current in zip(words,words[1:]):
        if previous["end"]>current["start"]:
            overlap=previous["end"]-current["start"];assert overlap<=.06,"Acoustic windows overlap excessively"
            boundary=round((previous["end"]+current["start"])/2,3);repairs.append({"overlap":overlap,"boundary":boundary});previous["end"]=boundary;current["start"]=boundary
    assert all(w["end"]>w["start"]for w in words)
    proof={"initialWords":initial,"focusedChecks":checked,"verifiedWords":words,"acousticBoundaryRefinements":repairs,"engine":f"faster-whisper {getattr(model,'pace_name','small')} int8"}
    (OUT/"alineacion_ultima_verificada.json").write_text(json.dumps(proof,ensure_ascii=False,indent=2)+"\n")
    return words,proof

def main():
    p=argparse.ArgumentParser();p.add_argument("--source",required=True,type=Path);p.add_argument("--model",default="small");args=p.parse_args();assert args.source.exists()
    config=json.loads((ROOT/"production.json").read_text());chapters=json.loads((ROOT/"chapters.json").read_text());script=" ".join(s["text"]for s in config["scenes"]);expected=script.split();AUDIO.mkdir(parents=True,exist_ok=True)
    sped=AUDIO/"voz_125_sin_editar.wav"
    subprocess.run(["ffmpeg","-v","error","-y","-i",str(args.source),"-af","atempo=1.25","-ar",str(SR),"-ac","2",str(sped)],check=True)
    intrinsic=config["voice"].get("intrinsicAlignment")
    if intrinsic:
        measured=json.loads(Path(intrinsic).read_text())
        assert measured["sourceSha256"]==hashlib.sha256(args.source.read_bytes()).hexdigest()
        assert [w["word"]for w in measured["words"]]==expected
        scale=len(decode(sped))/16000/(measured["sampleCount"]/measured["sampleRate"])
        initial=[{**w,"start":w["start"]*scale,"end":w["end"]*scale}for w in measured["words"]]
        proof={"engine":measured["engine"],"intrinsicAlignment":intrinsic,"sentenceSampleChecks":measured["sentenceSampleChecks"],"actualTempoDurationRatio":scale,"timingFromTextLength":False,"verifiedWords":initial}
    else:
        model=WhisperModel(args.model,device="cpu",compute_type="int8",cpu_threads=2,num_workers=1,download_root="/tmp/corazon-piloto-models")
        model.pace_name=args.model
        initial,proof=align(model,decode(sped),script,config["scenes"])
    (OUT/"alineacion_antes_edicion.json").write_text(json.dumps(proof,ensure_ascii=False,indent=2)+"\n")
    audio=decode(sped,SR,2).reshape(-1,2);first=max(0,round((initial[0]["start"]-.035)*SR));last=min(len(audio),round((initial[-1]["end"]+.06)*SR))
    r=subprocess.run(["ffmpeg","-hide_banner","-i",str(sped),"-af","silencedetect=noise=-35dB:d=0.08","-f","null","-"],capture_output=True,text=True,check=True)
    starts=[float(x)for x in re.findall(r"silence_start: ([\d.]+)",r.stderr)];ends=[float(x)for x in re.findall(r"silence_end: ([\d.]+)",r.stderr)];gaps=[]
    for a,b in zip(starts,ends):
        if a*SR<=first or b*SR>=last:continue
        center=(a+b)/2
        candidates=[(i,w)for i,w in enumerate(initial[:-1])if w["end"]-.07<=center<=initial[i+1]["start"]+.07]
        if not candidates:continue
        i,w=min(candidates,key=lambda pair:abs(pair[1]["end"]-center));punct=bool(re.search(r"[.,:;!?…]$",expected[i]))
        a=max(a,w["end"]+.005);b=min(b,initial[i+1]["start"]-.005)
        if b-a<.06:continue
        gaps.append({"a":round(a*SR),"b":round(b*SR),"sourceSeconds":b-a,"minimum":.045,"maximum":.64 if punct else min(.18,b-a+.055),"punctuation":punct})
    fixed=(last-first)/SR-sum((g["b"]-g["a"])/SR for g in gaps)
    target=69.74-.06;budget=target-fixed;low=sum(g["minimum"]for g in gaps);high=sum(g["maximum"]for g in gaps)
    (OUT/"presupuesto_pausas.json").write_text(json.dumps({"fixedSpeechSeconds":fixed,"silenceBudget":budget,"minSilence":low,"maxSilence":high,"candidateGaps":gaps},indent=2)+"\n")
    assert low<=budget<=high,"The expanded take cannot fill 70s at the target pace without padding or overlong pauses; revise content rather than stretching speech."
    lengths=np.array([min(g["maximum"],max(g["minimum"],g["sourceSeconds"]))for g in gaps])
    delta=budget-float(lengths.sum())
    for _ in range(100):
        if abs(delta)<1/SR:break
        capacity=np.array([(g["maximum"]-lengths[i])if delta>0 else (lengths[i]-g["minimum"])for i,g in enumerate(gaps)])
        weights=capacity*np.array([3 if g["punctuation"]else 1 for g in gaps]);total=weights.sum();assert total>0
        update=np.minimum(capacity,abs(delta)*weights/total);lengths+=update*(1 if delta>0 else -1);delta=budget-float(lengths.sum())
    pieces=[np.zeros((round(.06*SR),2),np.float32)];cursor=first;edits=[]
    for g,duration in zip(gaps,lengths):
        pieces.append(audio[cursor:g["a"]]);samples=round(float(duration)*SR);pieces.append(np.zeros((samples,2),np.float32));cursor=g["b"];edits.append({**g,"newSeconds":samples/SR})
    pieces.append(audio[cursor:last]);voice=np.concatenate(pieces);assert len(voice)<=70*SR
    voice=np.pad(voice,((0,70*SR-len(voice)),(0,0)));wav(AUDIO/"voz_timeline.wav",voice)
    if intrinsic:
        def map_time(t):
            sample=round(t*SR);delta=round(.06*SR)-first
            for e in edits:
                assert not e["a"]<sample<e["b"],"Never edit through a timed phoneme"
                if sample>=e["b"]:delta+=round(e["newSeconds"]*SR)-(e["b"]-e["a"])
            return round((sample+delta)/SR,6)
        words=[{**w,"start":map_time(w["start"]),"end":map_time(w["end"])}for w in initial]
        proof={**proof,"verifiedWords":words,"timingEdits":"Actual acoustic silence sample splices; no spoken phoneme removed","tempoMappingToleranceMs":35}
    else:words,proof=align(model,decode(AUDIO/"voz_timeline.wav"),script,config["scenes"])
    (OUT/"alineacion_audio_real.json").write_text(json.dumps({**proof,"source":str(args.source),"sourceSha256":hashlib.sha256(args.source.read_bytes()).hexdigest(),"tempo":1.25,"silenceEdits":edits},ensure_ascii=False,indent=2)+"\n")
    scenes=[];events=[];captions=[];index=0;srt=[]
    def stamp(ms):return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
    for i,chapter in enumerate(chapters):
        count=len(chapter["text"].split());part=words[index:index+count];start=0 if i==0 else max(0,part[0]["start"]-.035)
        scenes.append({"id":i,"start":round(start,3),"end":70,"voiceStart":part[0]["start"],"voiceEnd":part[-1]["end"]})
        for action,cue in enumerate(chapter["cues"]):
            target_words=[norm(w)for w in cue.split()];tokens=[norm(w["word"])for w in part];matches=[j for j in range(len(tokens))if tokens[j:j+len(target_words)]==target_words];assert matches,f"Missing acoustic cue: {cue}"
            t=start if action==0 else part[matches[0]]["start"]
            events.append({"id":f"s{i}-a{action}","scene":i,"action":action,"start":round(t,3),"cue":cue,"label":chapter["actions"][action],"kind":"semantic","audioWord":index+matches[0]})
        groups=round(count/4);base,extra=divmod(count,groups);breaks=set(np.cumsum([base+(j<extra)for j in range(groups)])-1);g=[]
        for j,w in enumerate(part):
            a=round(w["start"]*1000);b=round(w["end"]*1000);c={"text":(" "if captions else "")+expected[index+j],"startMs":a,"endMs":b,"timestampMs":round((a+b)/2),"confidence":w["probability"],"pageBreakAfter":j in breaks};captions.append(c);g.append(c)
            if c["pageBreakAfter"]:srt.append(f"{len(srt)+1}\n{stamp(g[0]['startMs'])} --> {stamp(g[-1]['endMs'])}\n{''.join(w['text']for w in g).strip()}\n");g=[]
        index+=count
    for i,s in enumerate(scenes[:-1]):s["end"]=scenes[i+1]["start"]
    for scene,word,action,detail,visible in [(1,"dañinos",3,"stimulus","ESTÍMULO POTENCIALMENTE DAÑINO"),(2,"cabeza",4,"outer-head","OTRAS ESTRUCTURAS DE LA CABEZA"),(4,"cara",2,"face","SEÑALES DE LA CARA"),(4,"meninges",2,"meninges","SEÑALES DE LAS MENINGES"),(4,"sistema",3,"networks","REDES DEL SISTEMA NERVIOSO"),(4,"cerebro",3,"relay","EL CEREBRO RECIBE SEÑALES"),(5,"equipo",4,"monitor","RESPUESTA Y VIGILANCIA"),(6,"continua",4,"protocol","VIGILANCIA QUE CONTINÚA")]:
        candidates=[(j,w)for j,w in enumerate(captions)if scenes[scene]["start"]*1000<=w["startMs"]<scenes[scene]["end"]*1000 and norm(w["text"])==norm(word)]
        if candidates:
            j,w=candidates[0];events.append({"id":f"s{scene}-detail-{detail}","scene":scene,"action":action,"start":w["startMs"]/1000,"cue":word,"label":visible,"visible":visible,"detail":detail,"kind":"semantic-detail","audioWord":j})
    events.sort(key=lambda e:e["start"])
    ready_timeline={"status":"building-real-voice-mix","audioReady":False,"previewAudioReady":False,"scenes":scenes,"events":events}
    (ROOT/"timeline.json").write_text(json.dumps(ready_timeline,ensure_ascii=False,indent=2)+"\n")
    (ROOT/"captions.json").write_text(json.dumps(captions,ensure_ascii=False,indent=2)+"\n");(OUT/"subtitulos.srt").write_text("\n".join(srt))
    config["voice"].update({"status":"aligned-awaiting-mix","source":str(args.source),"words":len(words),"lastWordEndMs":captions[-1]["endMs"]});(ROOT/"production.json").write_text(json.dumps(config,ensure_ascii=False,indent=2)+"\n")
    subprocess.run(["python","scripts/episodio-01-cerebro-125/crear_audio.py","--voice",str(AUDIO/"voz_timeline.wav")],check=True)
    ready_timeline.update({"status":"production-real-expanded-voice","audioReady":True});(ROOT/"timeline.json").write_text(json.dumps(ready_timeline,ensure_ascii=False,indent=2)+"\n")
    config["voice"]["status"]="real-integrated";(ROOT/"production.json").write_text(json.dumps(config,ensure_ascii=False,indent=2)+"\n")

if __name__=="__main__":main()

"""Generate the licensed es-MX Aldo voice locally; no API or paid credits.

The native take is measured acoustically. Synthesis length is calibrated to the
approved narrator's articulation rate before the requested 1.25x voice pass.
The 61MB model stays outside Git. See downloaded provider model cards.
"""
import argparse,hashlib,importlib.util,json,subprocess,time,urllib.request,wave
from pathlib import Path
import numpy as np
from piper import PiperVoice,SynthesisConfig
import onnx,onnxruntime as ort

ROOT=Path("src/episodios/episodio-01-cerebro-125");OUT=Path("output/episodio-01-cerebro-125");AUDIO=Path("public/episodios/episodio-01-cerebro-125/audio")
spec=importlib.util.spec_from_file_location("pace_voice","scripts/episodio-01-cerebro-125/preparar_voz.py");helpers=importlib.util.module_from_spec(spec);spec.loader.exec_module(helpers)

def main():
    p=argparse.ArgumentParser();p.add_argument("--model-dir",default="/tmp/corazon-piper",type=Path);p.add_argument("--reuse-native",action="store_true");args=p.parse_args();args.model_dir.mkdir(parents=True,exist_ok=True)
    base="https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_MX/ald/medium/";name="es_MX-ald-medium"
    for suffix in [".onnx",".onnx.json"]:
        file=args.model_dir/(name+suffix)
        if not file.exists():urllib.request.urlretrieve(base+name+suffix,file)
    for url,file in [(base+"MODEL_CARD",AUDIO/"PIPER_MODEL_CARD.md"),("https://huggingface.co/datasets/rmcpantoja/Ald_Mexican_Spanish_speech_dataset/raw/main/README.md",AUDIO/"PIPER_DATASET_CARD.md"),("https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/davefx/medium/MODEL_CARD",AUDIO/"PIPER_BASE_MODEL_CARD.md")]:urllib.request.urlretrieve(url,file)
    config=json.loads((ROOT/"production.json").read_text());script=" ".join(s["text"]for s in config["scenes"])
    voice=PiperVoice.load(args.model_dir/(name+".onnx"),use_cuda=False)
    def synth(path,length):
        with wave.open(str(path),"wb")as file:voice.synthesize_wav(script,file,SynthesisConfig(length_scale=length,noise_scale=.55,noise_w_scale=.65))
    native=AUDIO/"voz_nativa_medicion.wav"
    if not(args.reuse_native and native.exists()):synth(native,1)
    with wave.open(str(native))as f:native_seconds=f.getnframes()/f.getframerate()
    original_config=json.loads(Path("src/episodios/episodio-01-cerebro/production.json").read_text())
    original_seconds=float(json.loads(subprocess.check_output(["ffprobe","-v","error","-show_format","-of","json",original_config["voice"]["source"]]))["format"]["duration"])
    def phonemes(text):return sum(token.isalpha()for sentence in voice.phonemize(text)for token in sentence)
    old_count,new_count=phonemes(original_config["narration"]),phonemes(script)
    # Calibrate synthesized utterance rate against measured audio and phoneme
    # density. Caption timestamps are obtained separately from actual audio.
    original_rate=old_count/original_seconds;native_rate=new_count/native_seconds
    length_scale=native_rate/original_rate
    assert .75<length_scale<1.75,"Unexpected calibration; review source audio"
    # Expose VITS's own duration tensor. Each emitted acoustic frame is 256
    # waveform samples; this is verified for EVERY sentence, not estimated
    # from text length or an ASR model's guesses.
    graph=onnx.load(args.model_dir/(name+".onnx"))
    graph.graph.output.append(onnx.helper.make_tensor_value_info("/Ceil_output_0",onnx.TensorProto.FLOAT,[1,1,"phonemes"]))
    instrumented=args.model_dir/(name+"-durations.onnx");onnx.save(graph,instrumented)
    opts=ort.SessionOptions();opts.intra_op_num_threads=2;opts.inter_op_num_threads=1
    ort.set_seed(125)
    session=ort.InferenceSession(str(instrumented),sess_options=opts,providers=["CPUExecutionProvider"])
    chunks=[];words=[];checks=[];offset=0;tokens=script.split();idmap=voice.config.phoneme_id_map
    for sentence in voice.phonemize(script):
        ids=list(idmap["^"])+list(idmap["_"]);spans=[]
        for phoneme in sentence:
            assert phoneme in idmap,f"Unmapped phoneme: {phoneme}"
            a=len(ids);ids.extend(idmap[phoneme]);b=len(ids);ids.extend(idmap["_"]);spans.append((a,b))
        ids.extend(idmap["$"]);assert ids==voice.phonemes_to_ids(sentence)
        audio,durations=session.run(None,{"input":np.array([ids],np.int64),"input_lengths":np.array([len(ids)],np.int64),"scales":np.array([.55,length_scale,.65],np.float32)})
        audio=audio.flatten();durations=durations.flatten();assert len(audio)==int(durations.sum())*256
        boundaries=np.r_[0,np.cumsum(durations)].astype(np.int64)*256
        group=[]
        def flush():
            if not group or not any(sentence[j].isalpha()for j in group):return
            lexical=[j for j in group if sentence[j]not in '.,:;!?…¿¡']
            a=offset+int(boundaries[spans[lexical[0]][0]]);b=offset+int(boundaries[spans[lexical[-1]][1]])
            assert b>a
            words.append({"word":tokens[len(words)],"start":a/22050,"end":b/22050,"startSample":a,"endSample":b,"probability":1,"phonemes":"".join(sentence[j]for j in group)})
        for j,phoneme in enumerate(sentence):
            if phoneme==" ":flush();group=[]
            else:group.append(j)
        flush();checks.append({"samples":len(audio),"durationFrames":int(durations.sum()),"hopSamples":256,"verified":True})
        chunks.append(audio);offset+=len(audio)
    assert len(words)==len(tokens)
    waveform=np.concatenate(chunks);waveform*=.94/max(.94,float(np.max(np.abs(waveform))))
    target=AUDIO/"narracion_original.wav"
    with wave.open(str(target),"wb")as file:
        file.setnchannels(1);file.setsampwidth(2);file.setframerate(22050);file.writeframes(np.round(waveform*32767).astype('<i2').tobytes())
    with wave.open(str(target))as f:duration=f.getnframes()/f.getframerate()
    flac=AUDIO/"narracion_original.flac";subprocess.run(["ffmpeg","-v","error","-y","-i",str(target),"-c:a","flac",str(flac)],check=True)
    report={"provider":"Piper local inference","voice":"Aldo, es_MX-ald-medium","language":"es_MX","phonemizer":"es-419","model":name,"modelUrl":base+name+".onnx","modelSha256":hashlib.sha256((args.model_dir/(name+".onnx")).read_bytes()).hexdigest(),"modelConfigSha256":hashlib.sha256((args.model_dir/(name+".onnx.json")).read_bytes()).hexdigest(),"datasetLicense":"Unlicense","baseDatasetLicense":"CC0","paidGenerations":0,"creditsSpent":0,"sampleRate":22050,"nativePhonemesPerSecond":native_rate,"referencePhonemesPerSecond":original_rate,"targetPhonemesPerSecondBeforePauseEditing":original_rate*1.25,"referencePhonemes":old_count,"newPhonemes":new_count,"synthesisLengthScale":length_scale,"nextPitchPreservingTempo":1.25,"originalDuration":duration,"source":str(flac),"sourceSha256":hashlib.sha256(flac.read_bytes()).hexdigest(),"wordsRequested":len(script.split()),"captionTiming":"pending actual audio alignment; phoneme counts are not used for caption timing"}
    alignment=OUT/"alineacion_intrinseca.json"
    alignment.write_text(json.dumps({"engine":"Piper/VITS intrinsic phoneme durations","source":str(flac),"sourceSha256":report["sourceSha256"],"sampleRate":22050,"sampleCount":offset,"words":words,"sentenceSampleChecks":checks,"timingFromTextLength":False},ensure_ascii=False,indent=2)+"\n")
    report["captionTiming"]="Intrinsic phoneme duration tensor; all emitted audio sample counts verified"
    (OUT/"voz_local_produccion.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    config["voice"].update({"provider":"Piper local","preset":"Aldo es_MX","voiceId":name,"voiceType":"local-model","source":str(flac),"intrinsicAlignment":str(alignment),"paidGenerationCount":0,"creditsActual":0,"status":"local-take-generated-awaiting-alignment"});config["voice"]["optionalElevenLabsQuote"]={"credits":3.45,"status":"not-authorized-not-used","voice":"Juan"};(ROOT/"production.json").write_text(json.dumps(config,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__":main()

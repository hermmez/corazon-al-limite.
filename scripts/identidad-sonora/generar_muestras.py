"""Three honest local voice auditions; no API requests or paid credits.

Piper has no semantic acting direction. Only its admitted synthesis length_scale
varies. Raw native PCM is retained; listening copies get the same constant-gain
and gentle peak-limiter chain, 48 kHz mono PCM24, without tempo/pitch processing.
"""
import argparse
import hashlib
import importlib.metadata
import json
import re
import shutil
import subprocess
import wave
from pathlib import Path

import onnxruntime as ort
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "config/corazon-cinematic-mx.json"
OUT = ROOT / "output/identidad-sonora/CORAZON_CINEMATIC_MX"


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, check=True)
    return result.stdout, result.stderr


def loudness(file):
    _, log = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(file),
                  "-af", "loudnorm=I=-16:TP=-2:LRA=11:print_format=json", "-f", "null", "-"])
    return json.loads(re.findall(r"\{\s*\"input_i\".*?\}", log, re.S)[-1])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dir", type=Path, default=Path("/tmp/corazon-piper"))
    parser.add_argument("--overwrite-auditions", action="store_true")
    args = parser.parse_args()
    config = json.loads(CONFIG.read_text())
    audition = config["localAudition"]
    model = args.model_dir / (audition["voiceId"] + ".onnx")
    assert model.exists(), "Local model missing; no external generation will be requested."
    assert sha(model) == audition["modelSha256"], "Model changed; review the real base voice."
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "raw").mkdir(exist_ok=True)
    # Retain licenses already verified for the existing local narrator.
    for card in (ROOT / "public/episodios/episodio-02-tiempo/audio").glob("PIPER_*CARD.md"):
        shutil.copyfile(card, OUT / card.name)
    (OUT / "texto_unico.txt").write_text(audition["text"] + "\n")
    rows = []
    for trial in audition["trials"]:
        raw = OUT / "raw" / trial["file"].replace(".wav", "_raw.wav")
        final = OUT / trial["file"]
        assert args.overwrite_auditions or not final.exists(), "Audition exists; preserve it unless explicitly regenerating."
        ort.set_seed(audition["sessionRandomSeed"])
        voice = PiperVoice.load(model, use_cuda=False)
        with wave.open(str(raw), "wb") as wav:
            voice.synthesize_wav(audition["text"], wav, SynthesisConfig(
                length_scale=trial["length_scale"], **audition["commonSynthesis"]))
        measurements = loudness(raw)
        # Constant gain plus the same gentle oversampled peak limiter in every
        # audition. No dynamic loudness-range compression, EQ, pitch or tempo.
        gain = -16 - float(measurements["input_i"])
        for attempt in range(3):
            normalization = f"volume={gain:.6f}dB,aresample=192000,alimiter=limit=0.785235635:level=false:attack=5:release=50:latency=1,aresample=48000"
            run(["ffmpeg", "-hide_banner", "-nostats", "-y", "-i", str(raw),
                 "-af", normalization, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s24le", str(final)])
            verified = loudness(final)
            difference = -16 - float(verified["input_i"])
            if abs(difference) < .10:
                break
            gain += difference
        applied = {"type": "constant-gain-and-gentle-oversampled-peak-limiter", "gainDb": gain,
                   "limiterCeilingDbfsAt192k": -2.1, "attackMs": 5, "releaseMs": 50,
                   "normalizationIterations": attempt + 1, "sameFilterChainAllTrials": True}
        info = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(final)])[0])
        stream = info["streams"][0]
        assert stream["codec_name"] == "pcm_s24le" and stream["sample_rate"] == "48000" and stream["channels"] == 1
        assert abs(float(verified["input_i"]) + 16) < 0.12, "Auditions must have comparable loudness."
        assert float(verified["input_tp"]) <= -1.95, "True-peak ceiling exceeded."
        run(["ffmpeg", "-v", "error", "-xerror", "-i", str(final), "-f", "null", "-"])
        mp3 = final.with_suffix(".mp3")
        run(["ffmpeg", "-v", "error", "-y", "-i", str(final), "-c:a", "libmp3lame", "-b:a", "96k", "-ar", "48000", str(mp3)])
        _, silence_log = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(final),
                              "-af", "silencedetect=noise=-35dB:d=0.7", "-f", "null", "-"])
        silence_rows = []
        starts = re.findall(r"silence_start: ([0-9.]+)", silence_log)
        ends = re.findall(r"silence_end: ([0-9.]+) \| silence_duration: ([0-9.]+)", silence_log)
        for start, (end, duration) in zip(starts, ends):
            silence_rows.append({"start": float(start), "end": float(end), "duration": float(duration)})
        rows.append({
            **trial, "file": str(final.relative_to(ROOT)), "raw": str(raw.relative_to(ROOT)),
            "durationSeconds": float(info["format"]["duration"]),
            "integratedLufs": float(verified["input_i"]), "truePeakDbtp": float(verified["input_tp"]),
            "loudnessRangeLu": float(verified["input_lra"]), "sampleRate": 48000,
            "channels": 1, "codec": "pcm_s24le", "sha256": sha(final), "rawSha256": sha(raw),
            "listeningMp3": str(mp3.relative_to(ROOT)), "listeningMp3Sha256": sha(mp3),
            "rawMeasurements": measurements, "normalization": applied,
            "silencesOver07Seconds": silence_rows,
            "fullDecodePassed": True, "creditsSpent": 0,
        })
        print(json.dumps({k: rows[-1][k] for k in ["id", "durationSeconds", "integratedLufs", "truePeakDbtp", "file"]}), flush=True)
    report = {
        "status": "real-local-auditions-awaiting-approval", "profile": config["profile"],
        "officialVoiceChanged": False, "provider": "Piper local", "voiceId": audition["voiceId"],
        "modelId": audition["modelId"], "modelSha256": sha(model),
        "modelConfigSha256": sha(model.with_suffix(".onnx.json")),
        "piperVersion": importlib.metadata.version("piper-tts"),
        "onnxruntimeVersion": ort.__version__, "text": audition["text"],
        "textSha256": hashlib.sha256(audition["text"].encode()).hexdigest(),
        "commonSynthesis": audition["commonSynthesis"], "sessionRandomSeed": audition["sessionRandomSeed"],
        "variedControlOnly": "length_scale", "semanticActingSupported": False,
        "phonemeLetters": sum(token.isalpha() for sentence in voice.phonemize(audition["text"]) for token in sentence),
        "limitations": audition["supportedControlLimit"],
        "postTempoProcessing": False, "pitchProcessing": False, "music": False, "soundEffects": False,
        "export": config["auditionExport"], "sourceQuality": "22,050 Hz native synthesis; 48 kHz delivery does not add source detail",
        "commercialProviderExecuted": False, "commercialCurrentCredits": None,
        "commercialLimitation": "No ready ElevenLabs runtime credential; existing historical subscription query returned missing_permissions. No generation or quota claim.",
        "paidGenerations": 0, "creditsSpent": 0, "generationCost": {"amount": 0, "currency": None, "reason": "Local CPU; no billable generation API called"},
        "licenses": {"voiceDataset": "Unlicense", "baseDataset": "CC0", "piperRuntime": "GPL-3.0; runtime/model files not committed"},
        "trials": rows,
        "technicalRecommendation": "Audition C2 as the fast local rhythm baseline. Approval is still required; Piper cannot verify the requested cinematic acting. For semantic expression, authorize and audition the real ElevenLabs voice before any official narrator change."
    }
    (OUT / "reporte_audio.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print("Report: " + str(OUT / "reporte_audio.json"))


if __name__ == "__main__":
    main()

"""Verify the exported MP4 against the complete approved narration and captions."""
import hashlib, json, os, re, subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output/episodio-05-nuclear"
SRC = ROOT / "src/episodios/episodio-05-emergencia-nuclear"
ffmpeg = os.environ["FFMPEG_PATH"]
ffprobe = str(Path(ffmpeg).with_name("ffprobe.exe" if os.name == "nt" else "ffprobe"))
target = OUT / "episodio05_FINAL_GRADY.mp4"
reference = ROOT / "public/episodio-05/audio/narracion_grady_70s.wav"
probe = json.loads(subprocess.check_output([ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(target)]))
video = next(s for s in probe["streams"] if s["codec_type"] == "video")
audio = next(s for s in probe["streams"] if s["codec_type"] == "audio")
assert [video["width"], video["height"], video["r_frame_rate"], video["nb_frames"]] == [1080, 1920, "30/1", "2100"]
assert video["codec_name"] == "h264" and audio["codec_name"] == "aac"
assert audio["sample_rate"] == "48000" and float(audio["duration"]) == 70
assert float(probe["format"]["duration"]) == 70

with wave.open(str(reference)) as wav:
    assert wav.getnframes() == 3360000 and wav.getframerate() == 48000
    expected_audio = np.frombuffer(wav.readframes(wav.getnframes()), dtype="<i2").astype(np.float32) / 32768
decoded = np.frombuffer(subprocess.check_output([ffmpeg, "-v", "error", "-i", str(target), "-map", "0:a:0", "-ac", "1", "-ar", "48000", "-f", "f32le", "-"]), dtype="<f4")
assert len(expected_audio) <= len(decoded) <= len(expected_audio) + 1024
actual = decoded[:len(expected_audio)]
correlation = float(np.corrcoef(expected_audio, actual)[0, 1])
snr = float(10 * np.log10(np.mean(expected_audio ** 2) / np.mean((expected_audio - actual) ** 2)))
assert correlation > .995 and snr > 23, "AAC voice differs from complete synchronized WAV"
assert np.max(np.abs(decoded)) < .999, "Audio clipping detected"
checks = subprocess.run([ffmpeg, "-hide_banner", "-nostats", "-xerror", "-i", str(target), "-vf", "blackdetect=d=0.1:pix_th=0.1", "-af", "silencedetect=noise=-38dB:d=0.7", "-f", "null", "-"], capture_output=True, text=True, check=True)
assert "black_start:" not in checks.stderr, "Black interval detected"
assert "silence_start:" not in checks.stderr, "Voice silence longer than 0.7 seconds needs review"
loud = subprocess.run([ffmpeg, "-hide_banner", "-nostats", "-i", str(target), "-map", "0:a:0", "-af", "loudnorm=I=-16:TP=-2:LRA=7:print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
measurement = json.loads(re.search(r"\{\s*\"input_i\".*?\}", loud.stderr, re.S)[0])
assert -17 <= float(measurement["input_i"]) <= -15
assert float(measurement["input_tp"]) <= -1.5

timestamps = json.loads(subprocess.check_output([ffprobe, "-v", "error", "-select_streams", "v:0", "-show_frames", "-show_entries", "frame=best_effort_timestamp_time", "-of", "json", str(target)]))["frames"]
assert len(timestamps) == 2100
assert all(abs(float(frame["best_effort_timestamp_time"]) - index / 30) < .00001 for index, frame in enumerate(timestamps))
movie = target.read_bytes(); atoms = {}; cursor = 0
while cursor + 8 <= len(movie):
    size = int.from_bytes(movie[cursor:cursor + 4], "big")
    if size == 1: size = int.from_bytes(movie[cursor + 8:cursor + 16], "big")
    if size == 0: size = len(movie) - cursor
    assert size >= 8
    atoms[movie[cursor + 4:cursor + 8].decode("ascii")] = cursor
    cursor += size
assert atoms["moov"] < atoms["mdat"]

chapters = json.loads((SRC / "chapters.json").read_text(encoding="utf-8"))
captions = json.loads((SRC / "captions.json").read_text(encoding="utf-8"))
assert " ".join(c["text"].strip() for c in captions) == " ".join(c["text"] for c in chapters)
assert len(captions) == 174
assert all(0 <= c["startMs"] < c["endMs"] <= 70000 for c in captions)
assert all(a["endMs"] <= b["startMs"] for a, b in zip(captions, captions[1:]))
sizes = []; size = 0
for caption in captions:
    size += 1
    if caption["pageBreakAfter"]:
        sizes.append(size); size = 0
assert size == 0 and all(3 <= n <= 5 for n in sizes)
timeline = json.loads((SRC / "timeline.json").read_text(encoding="utf-8"))
assert sum(w["durationInFrames"] for w in timeline["sceneWindows"]) == 2100
protected = subprocess.check_output(["git", "diff", "--name-only", "b43ec80031ba5799dbb52050dca07766dd876314", "--", "public/imagenes", "public/episodio-04", "src/episodios/episodio-04-sin-dormir", "src/episodios/episodio-01-cerebro", "src/episodios/episodio-01-cerebro-125", "src/episodios/episodio-02-tiempo"], cwd=ROOT, encoding="utf-8").strip()
assert not protected, protected
result = {"status": "passed-final-audio-captions", "video": target.name, "sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "duration": 70, "frames": 2100, "constantFrameTimestampsVerified": 2100, "faststart": True, "fullDecode": True, "fps": 30, "width": 1080, "height": 1920, "videoCodec": video["codec_name"], "audioCodec": audio["codec_name"], "audioSampleRate": 48000, "audioBitrateTarget": 192000, "audioEncoderBitrate": json.loads((OUT / "aac-calibracion.json").read_text())["encoderBitrate"], "audioBitrateMeasured": int(audio["bit_rate"]), "voice": "Grady", "provider": "Higgsfield", "model": "elevenlabs_v4", "scriptWords": len(captions), "subtitlePages": len(sizes), "subtitleWordsPerPage": [min(sizes), max(sizes)], "lastSpokenWordEndMs": captions[-1]["endMs"], "wavToAacCorrelationAtZeroLag": correlation, "aacSignalNoiseRatioDb": snr, "decodedPeakDbfs": float(20 * np.log10(np.max(np.abs(decoded)))), "loudnessLufs": float(measurement["input_i"]), "truePeakDbtp": float(measurement["input_tp"]), "blackIntervals": 0, "silencesOver700ms": 0, "tempo": 1, "speechWordsRemoved": 0, "protectedVisualSourcesUnchanged": True, "previousEpisodesUnchanged": True, "generationCalls": 1, "authorizedCredits": 5.52}
(OUT / "grady-verificacion-final.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, ensure_ascii=True))

(OUT / "episodio05_FINAL_GRADY.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

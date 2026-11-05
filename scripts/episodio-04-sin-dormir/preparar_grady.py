"""Prepare the approved Higgsfield take; no generation calls and no tempo changes."""
from __future__ import annotations
import hashlib, json, math, os, re, subprocess, unicodedata, wave
from functools import lru_cache
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output/episodio-04-sueno"
SRC = ROOT / "src/episodios/episodio-04-sin-dormir"
AUDIO = ROOT / "public/episodio-04/audio"
FFMPEG = os.environ["FFMPEG_PATH"]
SR = 48000

def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def normalized(word):
    value = re.sub(r"[^\w]", "", unicodedata.normalize("NFC", word.lower()))
    return "veinticuatro" if value == "24" else value

def main():
    chapters = json.loads((SRC / "chapters.json").read_text(encoding="utf-8"))
    transcript = json.loads((OUT / "transcripcion_grady_original.json").read_text(encoding="utf-8"))
    silences = json.loads((OUT / "grady-silencios-original.json").read_text())
    source = AUDIO / "narracion_grady_original.mp3"
    assert hashlib.sha256(source.read_bytes()).hexdigest() == transcript["audioSha256"]
    expected = [word for chapter in chapters for word in chapter["text"].split()]
    recognized = [word for segment in transcript["segments"] for word in segment["words"]]
    assert [normalized(w) for w in expected] == [normalized(w["word"]) for w in recognized], "Speech differs from approved script"
    raw = subprocess.check_output([FFMPEG, "-v", "error", "-i", str(source), "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"])
    samples = np.frombuffer(raw, dtype="<f4").copy()
    target = 70 * SR
    need = len(samples) - target
    assert need > 0
    capacities = [max(0, round((s["end"] - s["start"] - .25) * SR)) for s in silences]
    assert sum(capacities) >= need, "Narration cannot fit naturally by editing pauses alone"
    factor = need / sum(capacities)
    lengths = [math.floor(value * factor) for value in capacities]
    remainder = need - sum(lengths)
    for index in sorted(range(len(lengths)), key=lambda i: capacities[i] * factor - lengths[i], reverse=True)[:remainder]:
        lengths[index] += 1
    cuts = []
    for silence, count in zip(silences, lengths):
        if not count:
            continue
        start = round((silence["start"] + silence["end"]) * SR / 2) - count // 2
        end = start + count
        peak = float(np.max(np.abs(samples[start:end])))
        assert peak < 10 ** (-37.5 / 20), "A cut touches audible speech"
        cuts.append({"sourceStartSample": start, "sourceEndSample": end, "removedSamples": count, "removedPeakDbfs": round(20 * math.log10(max(peak, 1e-12)), 3), "retainedPauseSeconds": round(silence["duration"] - count / SR, 6)})
    chunks = []
    cursor = 0
    for cut in cuts:
        chunks.append(samples[cursor:cut["sourceStartSample"]])
        cursor = cut["sourceEndSample"]
    chunks.append(samples[cursor:])
    edited = np.concatenate(chunks)
    assert len(edited) == target
    temporary = OUT / "revision-interna/grady-pausas-70s.wav"
    temporary.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(temporary), "wb") as wav:
        wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(SR)
        wav.writeframes(np.round(np.clip(edited, -.999969, .999969) * 32767).astype("<i2").tobytes())

    # Two-pass loudness normalization changes gain only, preserving sample timing.
    first = subprocess.run([FFMPEG, "-hide_banner", "-i", str(temporary), "-af", "loudnorm=I=-16:TP=-2:LRA=7:print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
    measure = json.loads(re.search(r"\{\s*\"input_i\".*?\}", first.stderr, re.S)[0])
    filt = "loudnorm=I=-16:TP=-2:LRA=7:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json".format(**measure)
    final = AUDIO / "narracion_grady_70s.wav"
    second = subprocess.run([FFMPEG, "-hide_banner", "-y", "-i", str(temporary), "-af", filt, "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(final)], capture_output=True, text=True, check=True)
    normalization = json.loads(re.search(r"\{\s*\"input_i\".*?\}", second.stderr, re.S)[0])
    with wave.open(str(final)) as wav:
        assert wav.getnframes() == target and wav.getframerate() == SR
    temporary.unlink()

    def mapped(seconds):
        sample = round(seconds * SR)
        removed = sum(max(0, min(sample, cut["sourceEndSample"]) - cut["sourceStartSample"]) for cut in cuts)
        return (sample - removed) / SR

    words = []
    repairs = []
    for word, heard in zip(expected, recognized):
        start, end = heard["start"], heard["end"]
        # Whisper attached a sentence-initial word to the preceding silent gap.
        for silence in silences:
            if start <= silence["start"] + .03 and end >= silence["end"] and silence["duration"] > .3:
                repaired = silence["end"] - .04
                repairs.append({"word": word, "oldStart": start, "newStart": repaired, "reason": "sentence-initial word spans measured silent gap"})
                start = repaired
        words.append({"word": word, "sourceStart": start, "sourceEnd": end, "start": mapped(start), "end": mapped(end), "probability": heard["probability"]})
    for previous, current in zip(words, words[1:]):
        if current["start"] < previous["end"]:
            assert previous["end"] - current["start"] <= .06
            current["start"] = previous["end"]
    assert all(w["end"] > w["start"] for w in words)

    starts = [0]
    cursor = 0
    for chapter in chapters[:-1]:
        cursor += len(chapter["text"].split())
        # Cut in the breath between complete chapters, on a video frame boundary.
        starts.append(round((words[cursor - 1]["end"] + words[cursor]["start"]) * 15))
    boundaries = starts + [2100]
    scene_words = []
    cursor = 0
    for chapter in chapters:
        count = len(chapter["text"].split())
        scene_words.append(words[cursor:cursor + count]); cursor += count

    captions = []
    windows = []
    for chapter, chapter_words, start_frame, end_frame in zip(chapters, scene_words, boundaries, boundaries[1:]):
        windows.append({"id": chapter["id"], "startFrame": start_frame, "endFrame": end_frame, "start": start_frame / 30, "end": end_frame / 30, "durationInFrames": end_frame - start_frame})
        n = len(chapter_words)
        @lru_cache(None)
        def partition(index):
            if index == n:
                return 0, []
            best = (float("inf"), [])
            for count in (4, 3, 5):
                end = index + count
                if end > n:
                    continue
                cost, tail = partition(end)
                duration = chapter_words[end - 1]["end"] - chapter_words[index]["start"]
                length_cost = abs(count - 4) * .4 + max(0, .8 - duration) * 5
                punctuation_cost = -1.5 if chapter_words[end - 1]["word"].endswith((".", "?", ":", ",")) else 0
                internal_breaks = sum(w["word"].endswith((".", "?")) for w in chapter_words[index:end - 1])
                candidate = (cost + length_cost + punctuation_cost + internal_breaks * 3, [end] + tail)
                if candidate[0] < best[0]:
                    best = candidate
            return best
        ends = set(partition(0)[1])
        for index, word in enumerate(chapter_words):
            captions.append({"text": ("" if not captions else " ") + word["word"], "startMs": round(word["start"] * 1000), "endMs": round(word["end"] * 1000), "timestampMs": round((word["start"] + word["end"]) * 500), "confidence": word["probability"], "pageBreakAfter": index + 1 in ends})
    assert " ".join(c["text"].strip() for c in captions) == " ".join(expected)
    save(SRC / "captions.json", captions)
    save(SRC / "timeline.json", {"status": "aligned-to-grady-recording", "audioReady": True, "voiceApproved": True, "timingSource": "faster-whisper small Spanish word timestamps, mapped through measured silent-only sample cuts", "audio": "episodio-04/audio/narracion_grady_70s.wav", "sceneWindows": windows, "events": [{"word": w["word"], "start": round(w["start"], 6), "end": round(w["end"], 6)} for w in words], "tempo": 1, "removedSilenceSeconds": need / SR, "notes": "Scene illustration and animation source files remain unchanged. Only scene durations and entry times follow the complete narration."})
    save(OUT / "grady-edicion-audio.json", {"source": str(source.relative_to(ROOT)), "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(), "sourceSampleCount": len(samples), "sampleRate": SR, "targetSampleCount": target, "duration": 70, "tempo": 1, "pitchChanged": False, "speechWordsRemoved": 0, "cuts": cuts, "removedSilenceSeconds": need / SR, "minimumRetainedPauseSeconds": min(c["retainedPauseSeconds"] for c in cuts), "transcriptionWords": len(words), "wordCorrections": repairs, "normalization": normalization, "outputSha256": hashlib.sha256(final.read_bytes()).hexdigest(), "words": words})
    print(json.dumps({"duration": 70, "tempo": 1, "removedSilenceSeconds": need / SR, "minimumRetainedPause": min(c["retainedPauseSeconds"] for c in cuts), "words": len(words), "sceneWindows": windows, "normalization": normalization}, ensure_ascii=True))

if __name__ == "__main__":
    main()

"""Real audio word alignment on CPU; no timing based on text length."""
import argparse
import json
import re
import subprocess
import unicodedata
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

def normalized(word):
    return re.sub(r"[^a-z]", "", unicodedata.normalize("NFD", word.lower()).encode("ascii", "ignore").decode())

def run():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="base")
    parser.add_argument("--cache", default="/tmp/corazon-piloto-models")
    parser.add_argument("--production", default="src/Piloto10s/production.json")
    parser.add_argument("--source", default="public/piloto10s/audio/narracion_original.mp3")
    parser.add_argument("--captions", default="src/Piloto10s/captions.json")
    args = parser.parse_args()
    config = json.loads(Path(args.production).read_text())
    text, lead_ms = config["narration"], config["narrationLeadMs"]
    source = args.source
    waveform = np.frombuffer(subprocess.check_output(["ffmpeg", "-v", "error", "-i", source, "-ar", "16000", "-ac", "1", "-f", "f32le", "-"]), dtype=np.float32).copy()
    model = WhisperModel(args.model, device="cpu", compute_type="int8", cpu_threads=2, num_workers=1, download_root=args.cache)
    segments, _ = model.transcribe(waveform, language="es", beam_size=5, word_timestamps=True, condition_on_previous_text=False, initial_prompt=text, vad_filter=False)
    words = [{"word": w.word, "start": w.start, "end": w.end, "probability": w.probability} for segment in segments for w in segment.words]
    transcript = {"engine": "faster-whisper", "version": "1.2.1", "model": args.model, "language": "es", "computeType": "int8", "source": source.removeprefix("public/"), "words": words}
    Path("output").mkdir(exist_ok=True)
    Path("output/piloto_transcripcion_original.json").write_text(json.dumps(transcript, ensure_ascii=False, indent=2) + "\n")
    expected = text.split()
    assert [normalized(w["word"]) for w in words] == [normalized(w) for w in expected], "Revisar la transcripción contra el audio antes de exportar subtítulos."
    # Correct only orthography against the known spoken script; keep ASR boundaries.
    counts = config["captionGroupWords"]
    assert all(2 <= count <= 5 for count in counts) and sum(counts) == len(words)
    breaks = set(np.cumsum(counts) - 1)
    captions = [{"text": (" " if i else "") + expected[i], "startMs": round(w["start"] * 1000) + lead_ms, "endMs": round(w["end"] * 1000) + lead_ms, "timestampMs": round((w["start"] + w["end"]) * 500) + lead_ms, "confidence": w["probability"], "pageBreakAfter": i in breaks} for i, w in enumerate(words)]
    Path(args.captions).write_text(json.dumps(captions, ensure_ascii=False, indent=2) + "\n")
    Path("output/piloto_subtitulos.json").write_text(json.dumps(captions, ensure_ascii=False, indent=2) + "\n")
    def stamp(ms):
        return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    groups, group = [], []
    for caption in captions:
        group.append(caption)
        if caption["pageBreakAfter"]:
            groups.append(group)
            group = []
    srt = "\n".join(f"{i+1}\n{stamp(g[0]['startMs'])} --> {stamp(g[-1]['endMs'])}\n{''.join(c['text'] for c in g).strip()}\n" for i, g in enumerate(groups))
    Path("output/piloto_subtitulos.srt").write_text(srt)
    print(f"{len(words)} palabras alineadas con audio real; final a {captions[-1]['endMs']/1000:.2f} s.")

if __name__ == "__main__":
    run()

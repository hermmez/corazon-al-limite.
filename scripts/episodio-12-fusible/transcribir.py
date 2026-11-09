"""Local word alignment for the single authorized Grady recording."""
import json
import os
from pathlib import Path
import subprocess

import numpy as np
from faster_whisper import WhisperModel

root = Path(__file__).resolve().parents[2]
recording = root / "public/episodio-12/audio/narracion_grady_original.mp3"
output = root / "output/episodio-12-fusible/revision-interna"
output.mkdir(parents=True, exist_ok=True)
model = WhisperModel(os.environ["WHISPER_MODEL"], device="cpu", compute_type="int8", cpu_threads=4)
pcm = subprocess.check_output([os.environ["FFMPEG_PATH"], "-v", "error", "-i", str(recording),
                               "-ar", "16000", "-ac", "1", "-f", "f32le", "-"])
segments, _ = model.transcribe(np.frombuffer(pcm, dtype="<f4"), language="es", word_timestamps=True,
                              beam_size=5, condition_on_previous_text=False)
words = []
for segment in segments:
    print(f"{segment.start:.2f}–{segment.end:.2f} {segment.text}", flush=True)
    words.extend({"word": w.word.strip(), "start": w.start, "end": w.end, "probability": w.probability}
                 for w in segment.words or [])
(output / "transcripcion.json").write_text(json.dumps(words, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
print(f"{len(words)} palabras", flush=True)

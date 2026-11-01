"""Check the narration's actual offset against the delivered AAC waveform."""
import json
import subprocess
from pathlib import Path
import numpy as np

def decode(file):
    return np.frombuffer(subprocess.check_output(["ffmpeg", "-v", "error", "-i", file, "-ar", "16000", "-ac", "1", "-f", "f32le", "-"]), dtype=np.float32).astype(float)

a = decode("public/piloto10s/audio/narracion_normalizada.wav")
b = decode("output/corazon_al_limite_piloto_10s.mp4")
n = 1 << (len(a) + len(b) - 1).bit_length()
cross = np.fft.irfft(np.fft.rfft(b, n) * np.conj(np.fft.rfft(a, n)), n)
low, high = round(.1 * 16000), round(.28 * 16000)
lag = low + int(np.argmax(cross[low:high]))
part = b[lag:lag + len(a)]
correlation = float(np.corrcoef(a[:len(part)], part)[0, 1])
assert abs(lag / 16 - 180) < 5 and correlation > .95
result = {"status": "passed", "method": "waveform cross-correlation of the clean normalized narration against decoded final AAC", "sampleRate": 16000, "expectedOffsetMs": 180, "playbackRate": 1, "reference": "narracion_normalizada.wav", "measuredNarrationOffsetMs": lag / 16, "correlation": correlation}
Path("output/piloto_sincronia_audio.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result))

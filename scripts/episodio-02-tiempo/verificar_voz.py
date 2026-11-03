"""Prove the real clean narration is present and aligned in the final AAC."""
import hashlib
import json
import subprocess
from pathlib import Path
import numpy as np

OUT = Path("output/episodio-02-tiempo")
REFERENCE = Path("public/episodios/episodio-02-tiempo/audio/narracion.flac")
VIDEO = OUT / "episodio_02_tiempo_70s.mp4"
TIMELINE = Path("src/episodios/episodio-02-tiempo/timeline.json")

def decode(file):
    return np.frombuffer(subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(file), "-ar", "16000", "-ac", "1", "-f", "f32le", "-"]), dtype=np.float32).astype(float)

def main():
    timeline = json.loads(TIMELINE.read_text())
    assert timeline["audioReady"], "No existe una narración real integrada"
    reference, delivered = decode(REFERENCE), decode(VIDEO)
    assert len(reference) == 70 * 16000 and len(delivered) >= 70 * 16000
    n = 1 << (len(reference) + len(delivered) - 1).bit_length()
    cross = np.fft.irfft(np.fft.rfft(delivered, n) * np.conj(np.fft.rfft(reference, n)), n)
    lags = np.arange(-800, 801)
    lag = int(lags[np.argmax(cross[lags % n])])
    assert abs(lag) <= 80, "Voice/AAC offset exceeds 5 ms"
    scenes = []
    for scene in timeline["scenes"]:
        start, end = scene["voiceStart"], scene["voiceEnd"]
        a, b = round((start + .04) * 16000), round((end - .04) * 16000)
        assert b > a
        clean, mixed = reference[a:b], delivered[a+lag:b+lag]
        assert np.sqrt(np.mean(clean ** 2)) > .001, f"Silent narration in scene {scene['id']}"
        correlation = float(np.corrcoef(clean, mixed)[0, 1])
        assert correlation > .95, f"Voice missing or obscured in scene {scene['id']}: {correlation}"
        scenes.append({"scene": scene["id"], "start": start, "end": end, "correlation": correlation, "cleanRms": float(np.sqrt(np.mean(clean**2))), "mixedRms": float(np.sqrt(np.mean(mixed**2)))})
    result = {"status": "passed", "method": "Waveform correlation of clean real narration against delivered AAC in every scene", "reference": str(REFERENCE), "referenceSha256": hashlib.sha256(REFERENCE.read_bytes()).hexdigest(), "video": str(VIDEO), "videoSha256": hashlib.sha256(VIDEO.read_bytes()).hexdigest(), "sampleRate": 16000, "expectedOffsetMs": 0, "measuredOffsetMs": lag/16, "playbackRate": 1, "lastWordEndMs": round(timeline["scenes"][-1]["voiceEnd"]*1000), "scenes": scenes}
    (OUT/"sincronia_voz_aac.json").write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()

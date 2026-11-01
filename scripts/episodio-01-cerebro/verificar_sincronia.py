"""Prove the real narration exists, at the right offset, in delivered AAC."""
import json
import subprocess
from pathlib import Path
import numpy as np

OUT=Path("output/episodio-01-cerebro")
def decode(file):
    return np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",str(file),"-ar","16000","-ac","1","-f","f32le","-"]),dtype=np.float32).astype(float)

reference=decode("public/episodios/episodio-01-cerebro/audio/narracion.flac")
delivered=decode(OUT/"episodio_01_cerebro_70s.mp4")
alignment=json.loads((OUT/"alineacion_audio_real.json").read_text())
n=1<<(len(reference)+len(delivered)-1).bit_length()
cross=np.fft.irfft(np.fft.rfft(delivered,n)*np.conj(np.fft.rfft(reference,n)),n)
lags=np.arange(-800,801)
lag=int(lags[np.argmax(cross[lags%n])])
assert abs(lag)<=80,"Voice/AAC offset exceeds 5ms"
scenes=[]
for scene in alignment["sceneAudio"]:
    a=round((scene["start"]+.04)*16000);b=round((scene["end"]-.04)*16000)
    clean=reference[a:b];mixed=delivered[a+lag:b+lag]
    correlation=float(np.corrcoef(clean,mixed)[0,1])
    assert correlation>.95,f"Voice missing or desynchronized in scene {scene['scene']}"
    scenes.append({"scene":scene["scene"],"start":scene["start"],"end":scene["end"],"correlation":correlation})
result={"status":"passed","method":"waveform correlation of real clean narration against delivered AAC, checked in every scene","reference":"public/episodios/episodio-01-cerebro/audio/narracion.flac","sampleRate":16000,"expectedOffsetMs":0,"measuredOffsetMs":lag/16,"playbackRate":1,"lastWordEndMs":alignment["words"][-1]["endMs"],"scenes":scenes}
(OUT/"sincronia_voz_aac.json").write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps(result,indent=2))

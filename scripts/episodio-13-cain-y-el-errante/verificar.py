"""Verify the exported frames, audio master and caption text before delivery."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import wave

import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[2]
delivery = Path(os.environ.get("EPISODIO13_ENTREGA", root.parents[1] / "outputs")).resolve()
delivery.mkdir(parents=True, exist_ok=True)
out = root / "output/episodio-13-cain-y-el-errante"
scratch = out / "revision-interna"
src = root / "src/episodios/episodio-13-cain-y-el-errante"
audio = root / "public/episodio-13/audio"
pending = scratch / "episodio13-en-proceso.mp4"
target = delivery / "episodio13_FINAL_GRADY_70s.mp4"
ffmpeg = Path(os.environ["FFMPEG_PATH"])
ffprobe = ffmpeg.with_name("ffprobe.exe" if os.name=="nt" else "ffprobe")


def run(tool, *args):
    return subprocess.run([str(tool), *(str(arg) for arg in args)], capture_output=True, check=True)


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(path):
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


assert pending.is_file() and not target.exists(), "Conservar el MP4 final existente."
details = json.loads(run(ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", pending).stdout)
assert len(details["streams"]) == 2
video = next(stream for stream in details["streams"] if stream["codec_type"]=="video")
sound = next(stream for stream in details["streams"] if stream["codec_type"]=="audio")
assert (video["codec_name"],video["profile"],video["width"],video["height"],
        video["pix_fmt"],video["r_frame_rate"],video["avg_frame_rate"],video["nb_frames"],
        video["color_space"],video["color_transfer"],video["color_primaries"]) == (
        "h264","High",1080,1920,"yuv420p","30/1","30/1","2100","bt709","bt709","bt709")
assert sound["codec_name"] == "aac" and sound["sample_rate"] == "48000"
assert all(float(track["duration"]) == 70 for track in (details["format"],video,sound))
pts = json.loads(run(ffprobe, "-v", "error", "-select_streams", "v:0", "-show_frames",
                     "-show_entries", "frame=best_effort_timestamp_time", "-of", "json",pending).stdout)["frames"]
assert len(pts)==2100 and all(abs(float(frame["best_effort_timestamp_time"])-i/30)<1e-5
                             for i,frame in enumerate(pts))
with pending.open("rb") as mp4:
    atoms, offset = {}, 0
    while offset+8<=pending.stat().st_size:
        mp4.seek(offset)
        size, name = int.from_bytes(mp4.read(4),"big"), mp4.read(4)
        size = int.from_bytes(mp4.read(8),"big") if size == 1 else size or pending.stat().st_size-offset
        assert size >= 8
        atoms[name] = offset
        offset += size
assert atoms[b"moov"] < atoms[b"mdat"]

black = run(ffmpeg, "-hide_banner", "-nostats", "-xerror", "-i", pending,
            "-vf", "blackdetect=d=0.08:pix_th=0.10", "-f", "null", "-").stderr.decode("utf-8","replace")
assert "black_start:" not in black, "Se detectaron fotogramas negros."
pcm = run(ffmpeg, "-v", "error", "-i", pending, "-map", "0:a:0",
          "-ac", "1", "-ar", "48000", "-f", "s16le", "-").stdout
rendered = np.frombuffer(pcm,dtype="<i2").astype(np.float64)[:3360000]
master = audio / "mezcla_final_70s.wav"
with wave.open(str(master),"rb") as wav:
    assert wav.getframerate()==48000 and wav.getnframes()==3360000
    expected_audio = np.frombuffer(wav.readframes(wav.getnframes()),dtype="<i2").astype(np.float64)
assert len(rendered)==len(expected_audio)
similarity = float(np.corrcoef(rendered,expected_audio)[0,1])
assert similarity > .99 and float(np.max(np.abs(rendered))) < 32000

voice = read(out / "voz-verificada.json")
assert digest(master)==voice["mixSha256"]
assert digest(audio / "narracion_grady_original.mp3")==voice["sourceSha256"]
captions = read(src / "captions.json")
script = read(src / "guion.json")
expected_text = " ".join(stage["text"] for stage in script)
assert "".join(word["text"] for word in captions) == expected_text
assert len(captions)==voice["words"] and captions[-1]["endMs"]==voice["lastWordEndMs"]
assert all(0 <= word["startMs"] < word["endMs"] <= 70000 for word in captions)
assert all(a["endMs"] <= b["startMs"] for a,b in zip(captions,captions[1:]))
srt = out / "episodio13_FINAL_GRADY.srt"
blocks = srt.read_text(encoding="utf-8").strip().split("\n\n")
groups = [block.splitlines()[2:] for block in blocks]
assert len(groups)==voice["pages"] and all(1<=len(group)<=2 and 3<=len(" ".join(group).split())<=5 for group in groups)
assert " ".join(line for group in groups for line in group)==expected_text

quiet_output = run(ffmpeg,"-hide_banner","-nostats","-i",audio / "narracion_grady_70s.wav",
                   "-af","silencedetect=noise=-37dB:d=0.7","-f","null","-").stderr.decode("utf-8","replace")
quiet_ranges = [list(map(float, match)) for match in re.findall(
    r"silence_start: ([\d.]+).*?silence_end: ([\d.]+)",quiet_output,re.S)]
internal_pauses = [(a,b) for a,b in quiet_ranges if a>.25 and b<69.95]

samples = [51,132,255,350,507,655,727,790,931,1055,1218,1350,1526,1657,1810,2012]
selection = "+".join("eq(n\\,"+str(frame)+")" for frame in samples)
run(ffmpeg,"-v","error","-y","-i",pending,"-an","-vf",
    "select="+selection+",scale=162:288,tile=8x2","-frames:v","1","-q:v","2",scratch / "verificacion-visual.jpg")
run(ffmpeg,"-v","error","-y","-ss","40","-i",pending,"-an","-frames:v","1","-q:v","2",scratch / "miniatura.jpg")
for name in ("verificacion-visual.jpg","miniatura.jpg"):
    with Image.open(scratch / name) as still:
        still.verify()

def motion(filename, speed):
    if not filename.exists():
        return None
    raw = run(ffmpeg,"-v","error","-i",filename,"-an","-vf",
              f"setpts=PTS/{speed},fps=4,crop=1080:950:0:535,scale=72:46,format=gray",
              "-pix_fmt","gray","-f","rawvideo","-").stdout
    images = np.frombuffer(raw,np.uint8).reshape((-1,46,72)).astype(np.int16)
    delta = np.abs(np.diff(images,axis=0)).mean(axis=(1,2))
    low = np.r_[False,delta<.75,False].astype(np.int8)
    starts = np.flatnonzero(np.diff(low)==1)
    stops = np.flatnonzero(np.diff(low)==-1)
    return dict(median=round(float(np.median(delta)),3),p90=round(float(np.quantile(delta,.9)),3),
                lowMotionIntervals=[[round(a/4,2),round(b/4,2)] for a,b in zip(starts,stops) if b-a>=8])

report = dict(file=target.name,sha256=digest(pending),duration=70,width=1080,height=1920,
    frames=2100,fps=30,codec="h264",audioCodec="aac",sampleRate=48000,audioBitrate=int(sound["bit_rate"]),
    pixelFormat="yuv420p",colorSpace="bt709",videoProfile="High",faststart=True,fullDecode=True,
    checkedTimestamps=len(pts),blackIntervals=0,audioCorrelation=round(similarity,6),
    peakEncodedDbfs=round(20*np.log10(np.max(np.abs(rendered))/32768),2),
    internalPausesLongerThan700ms=internal_pauses,closingSilence=quiet_ranges[-1] if quiet_ranges and quiet_ranges[-1][1]>=69.95 else None,
    voice="Grady",words=voice["words"],captionGroups=voice["pages"],tempo=1,
    lastWordEndMs=voice["lastWordEndMs"],authorizedCredits=voice["credits"],paidTakes=voice["generations"],
    motion=dict(sampleFps=4,crop=[0,535,1080,950],threshold=.75,
                referenceEpisode04At125=motion(delivery / "episodio04_FINAL_GRADY_70s.mp4",1.25),
                episode13At100=motion(pending,1)))
save(out / "render-verificado.json",report)
for file,name in ((srt,"episodio13_FINAL_GRADY.srt"),(scratch / "miniatura.jpg","episodio13_MINIATURA.jpg"),
                  (scratch / "verificacion-visual.jpg","episodio13_VISTA_PREVIA.jpg"),
                  (out / "render-verificado.json","episodio13_VERIFICACION.json")):
    shutil.copyfile(file,delivery / name)
part = delivery / "episodio13_FINAL_GRADY_70s.tmp"
shutil.copyfile(pending,part)
assert digest(part)==report["sha256"]
part.rename(target)
print(json.dumps(report,ensure_ascii=True))

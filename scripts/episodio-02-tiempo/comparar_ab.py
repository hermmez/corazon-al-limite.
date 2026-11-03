"""Create a 24s local rhythm comparison: episode01 1.25x / episode02 1.0x.

The topics differ. This artifact compares audiovisual energy, not matching facts.
Only this comparison changes reference A's video speed; production B is untouched.
"""
import argparse
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "output/episodio-02-tiempo"


def run(args):
    subprocess.run(args, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=OUT / "comparacion_ritmo_AB.mp4")
    args = parser.parse_args()
    a = REPO / "output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4"
    b = OUT / "episodio_02_tiempo_70s.mp4"
    assert hashlib.sha256(a.read_bytes()).hexdigest() == "2985c99c74f23883c8302fa65094da5f2bc99364bd820f10faaf8288e395a4a3"
    assert b.exists(), "Falta el render final del episodio 02"
    timeline = json.loads((REPO / "src/episodios/episodio-02-tiempo/timeline.json").read_text())
    assert timeline["audioReady"]
    scenes = timeline["scenes"]
    pairs = list(zip([0, 22.12, 33.12, 43.73], [scenes[i]["voiceStart"] for i in [0, 2, 4, 6]]))
    font = REPO / "public/piloto10s/fonts/Manrope[wght].ttf"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    plan = []
    with tempfile.TemporaryDirectory(prefix="corazon-02-ab-") as tmp:
        tmp = Path(tmp)
        clips = []
        for index, (a_start, b_start) in enumerate(pairs):
            for label, path, start, speed in [
                ("A - EPISODIO 01 - 1.25x", a, a_start, 1.25),
                ("B - EPISODIO 02 - 1.0x", b, b_start, 1),
            ]:
                target = tmp / f"{index}-{speed}.mp4"
                text = tmp / f"{index}-{speed}.txt"
                text.write_text(label)
                filters = (
                    f"setpts=PTS/{speed},fps=30,scale=360:640,"
                    "drawbox=x=0:y=0:w=360:h=70:color=0x0C2035:t=fill,"
                    f"drawtext=fontfile='{font}':textfile='{text}':fontsize=14:"
                    "fontcolor=0xFFD56A:x=(w-text_w)/2:y=21,"
                    f"drawtext=fontfile='{font}':text='COMPARACION DE RITMO - TEMAS DIFERENTES':"
                    "fontsize=9:fontcolor=white:x=(w-text_w)/2:y=45"
                )
                run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(3 * speed),
                     "-i", str(path), "-vf", filters, "-af", f"atempo={speed}", "-t", "3",
                     "-frames:v", "90", "-c:v", "libx264", "-threads", "2", "-crf", "20",
                     "-c:a", "aac", "-ar", "48000", "-ac", "2", str(target)])
                clips.append(target)
                plan.append({"label": label, "source": str(path.relative_to(REPO)),
                             "sourceStart": start, "sourceDuration": 3 * speed,
                             "playbackRate": speed, "comparisonDuration": 3})
        manifest = tmp / "parts.txt"
        manifest.write_text("".join(f"file '{path}'\n" for path in clips))
        # Re-encode the small comparison to remove concatenated AAC padding.
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(manifest),
             "-t", "24", "-r", "30", "-frames:v", "720", "-c:v", "libx264", "-threads", "2",
             "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-ar", "48000", "-ac", "2",
             "-movflags", "+faststart", str(args.output)])
    metadata = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(args.output),
    ]))
    proof = {"artifact": str(args.output), "duration": float(metadata["format"]["duration"]),
             "bytes": args.output.stat().st_size, "sha256": hashlib.sha256(args.output.read_bytes()).hexdigest(),
             "limitation": "Different topics; qualitative rhythm comparison, not a matched-concept experiment.",
             "clips": plan}
    args.output.with_suffix(".json").write_text(json.dumps(proof, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"file": str(args.output), "duration": proof["duration"], "bytes": proof["bytes"]}))


if __name__ == "__main__":
    main()

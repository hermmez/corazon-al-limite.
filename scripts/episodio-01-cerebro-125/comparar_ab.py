"""24s A/B reel: matched topics, A at 1.25x and final B at 1x."""
import subprocess,json
from pathlib import Path
OUT=Path("output/episodio-01-cerebro-125");TEMP=Path("/tmp/corazon-125-ab");TEMP.mkdir(exist_ok=True)
A=Path("output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4");B=OUT/"episodio_01_cerebro_70s_FINAL.mp4"
t=json.loads(Path('src/episodios/episodio-01-cerebro-125/timeline.json').read_text())['scenes']
font="public/piloto10s/fonts/Manrope[wght].ttf";parts=[]
for topic,(a,b)in enumerate([(0,.06),(22.12,t[2]['voiceStart']),(33.12,t[4]['voiceStart']),(43.73,t[5]['voiceStart'])]):
    for label,file,start,speed in [("A - ORIGINAL 1.25x",A,a,1.25),("B - NUEVA 1.0x - VOZ LOCAL ES-MX",B,b,1)]:
        target=TEMP/f"{topic}-{speed}.mp4";text=TEMP/f"{topic}-{speed}.txt";text.write_text(label)
        filters=f"setpts=PTS/{speed},fps=30,scale=360:640,drawbox=x=0:y=0:w=360:h=70:color=0x0C2035:t=fill,drawtext=fontfile='{font}':textfile='{text}':fontsize=13:fontcolor=0xFFD56A:x=(w-text_w)/2:y=27"
        subprocess.run(["ffmpeg","-v","error","-y","-ss",str(start),"-t",str(3*speed),"-i",str(file),"-vf",filters,"-af",f"atempo={speed}","-t","3","-c:v","libx264","-threads","2","-crf","20","-c:a","aac","-ar","48000","-ac","2",str(target)],check=True);parts.append(target)
manifest=TEMP/"parts.txt";manifest.write_text("".join(f"file '{p}'\n"for p in parts))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",str(manifest),"-c","copy","-movflags","+faststart",str(OUT/"comparacion_AB.mp4")],check=True)

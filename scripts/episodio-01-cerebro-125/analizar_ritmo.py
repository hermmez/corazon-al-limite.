"""Measure audible pauses and main artwork evolution, independent of metadata.

Warnings require editorial review: a recurring clinical trace or a purposeful
pause is not automatically an error. ROI excludes titles/captions/progress bars.
"""
import argparse
import json
import re
import subprocess
from pathlib import Path
import numpy as np

def silence(file,speed=1):
    filters=(f"atempo={speed},"if speed!=1 else "")+"silencedetect=noise=-35dB:d=0.7"
    r=subprocess.run(["ffmpeg","-hide_banner","-i",str(file),"-af",filters,"-f","null","-"],capture_output=True,text=True,check=True)
    starts=re.findall(r"silence_start: ([\d.]+)",r.stderr);ends=re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)",r.stderr)
    return [{"start":float(a),"end":float(b),"duration":float(d),"review":"required"}for a,(b,d) in zip(starts,ends)]

def ranges(flags,step,min_duration):
    result=[];start=None
    for i,flag in enumerate([*flags,False]):
        if flag and start is None:start=i*step
        if not flag and start is not None:
            end=i*step
            if end-start>=min_duration:result.append({"start":round(start,3),"end":round(end,3),"duration":round(end-start,3),"review":"required"})
            start=None
    return result

def visual(file,speed=1):
    filters=(f"setpts=PTS/{speed},"if speed!=1 else "")+"fps=4,scale=216:384,format=rgb24"
    raw=subprocess.check_output(["ffmpeg","-v","error","-i",str(file),"-an","-vf",filters,"-f","rawvideo","-"])
    frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,384,216,3)
    # Main scene only, no moving subtitles, title, logo or bottom ticker.
    roi=frames[:,115:248,17:190]
    scores=[float(np.mean(np.abs(roi[i].astype(float)-roi[max(0,i-2)].astype(float)))/255)for i in range(len(roi))]
    low=ranges([s<.018 for s in scores],.25,2)
    signature=roi[:,::6,::6].astype(float)/255
    repeated=[]
    for i in range(len(roi)):
        candidates=[float(np.mean(np.abs(signature[i]-signature[i-lag])))for lag in [4,6,8,12,16]if i>=lag]
        repeated.append(bool(candidates and min(candidates)<.009 and scores[i]<.025))
    return {"sampleFps":4,"roi":{"x":[85,950],"y":[575,1240]},"lowEvolutionThresholdMae":.018,"lowEvolution":low,"possibleRepetition":ranges(repeated,.25,2),"medianHalfSecondChange":float(np.median(scores)),"p90HalfSecondChange":float(np.quantile(scores,.9)),"samples":[{"time":i*.25,"mae":round(s,5)}for i,s in enumerate(scores)]}

def main():
    p=argparse.ArgumentParser();p.add_argument("--video",required=True);p.add_argument("--voice",required=True);p.add_argument("--speed",type=float,default=1);p.add_argument("--output",required=True);args=p.parse_args()
    result={"video":args.video,"voice":args.voice,"playbackSpeed":args.speed,"thresholdsAreReviewAlerts":True,"voiceSilenceOver07":silence(args.voice,args.speed),"visual":visual(args.video,args.speed)}
    Path(args.output).write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps({"report":args.output,"voiceSilenceAlerts":len(result["voiceSilenceOver07"]),"lowEvolutionIntervals":len(result["visual"]["lowEvolution"]),"possibleRepetitionIntervals":len(result["visual"]["possibleRepetition"])}))

if __name__=="__main__":main()

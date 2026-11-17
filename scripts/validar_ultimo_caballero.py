"""Technical delivery checks and a sliding visual activity check, excluding subtitles.

Pixel changes are a diagnostic; they do not measure attention or replace visual review.
"""
from pathlib import Path
from collections import deque
import argparse, json, subprocess, hashlib
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('video', type=Path)
parser.add_argument('--preview', action='store_true')
parser.add_argument('--report', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
assets = root / 'public/episodios/ultimo-caballero'
plan = json.loads((assets / 'plan-70-segundos.json').read_text())
assert [r['second'] for r in plan] == list(range(70)), 'The second-by-second plan is incomplete'
for row in plan:
    for key in ['visible', 'action', 'movement', 'change', 'transition', 'principle', 'narration']:
        assert row[key].strip(), (row['second'], key)
manifest = json.loads((assets / 'produccion.json').read_text())
assert manifest['playbackRate'] == 1
for reference, expected in manifest.get('approvedReferenceSha256',{}).items():
    assert hashlib.sha256((root/reference).read_bytes()).hexdigest() == expected, reference
assert hashlib.sha256((assets / 'narracion-original.mp3').read_bytes()).hexdigest() == manifest['originalVoiceSha256']
info = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(args.video)]))
v = next(s for s in info['streams'] if s['codec_type'] == 'video')
a = next(s for s in info['streams'] if s['codec_type'] == 'audio')
assert v['codec_name'] == 'h264' and a['codec_name'] == 'aac'
assert int(v['nb_frames']) == 2100 and v['r_frame_rate'] == '30/1'
assert abs(float(v['duration']) - 70) < .001
if not args.preview:
    assert (v['width'], v['height']) == (1080,1920)
    assert abs(float(info['format']['duration']) - 70) < .001
    assert abs(float(a['duration']) - 70) < .001

# Ten samples/second. The upper 373 px exclude the subtitle band at y=378..405.
# For each rolling second, accumulate the union of visibly changed pixels.
proc = subprocess.Popen(['ffmpeg','-v','error','-i',str(args.video),'-an','-vf','fps=10,scale=270:480','-pix_fmt','rgb24','-f','rawvideo','-'],stdout=subprocess.PIPE)
window = deque(maxlen=10)
previous = None
samples = 0
per_second = [0.0] * 70
low_windows = []
while True:
    buf = proc.stdout.read(270*480*3)
    if not buf:
        break
    assert len(buf) == 270*480*3, 'Incomplete decoded frame'
    frame = np.frombuffer(buf, np.uint8).reshape(480,270,3)[:373].astype(np.int16)
    if previous is not None:
        window.append(np.max(np.abs(frame-previous),axis=2) > 14)
        changed = float(window[-1].mean())
        sec = min(69,samples//10)
        per_second[sec] = max(per_second[sec],changed)
        if len(window) == 10:
            union = float(np.logical_or.reduce(window).mean())
            if union < .001:
                low_windows.append({'endSeconds':samples/10,'changedFraction':round(union,6)})
    previous = frame
    samples += 1
assert proc.wait() == 0 and samples == 700
report = {
    'video':args.video.name, 'durationSeconds':float(info['format']['duration']),
    'videoSeconds':float(v['duration']), 'frames':int(v['nb_frames']), 'fps':v['r_frame_rate'],
    'width':v['width'], 'height':v['height'], 'videoCodec':v['codec_name'], 'audioCodec':a['codec_name'],
    'planSeconds':len(plan), 'voicePlaybackRate':manifest['playbackRate'],
    'voiceOriginalSha256Verified':True, 'voiceTimelineStartSeconds':0,
    'visualActivity':{'sampleFps':10,'excludedSubtitleRegion':True,'rollingWindowSeconds':1,
        'thresholdChangedFraction':.001,'lowActivityWindows':low_windows,
        'maxChangedFractionPerSecond':[round(x,6) for x in per_second],
        'limitation':'Pixel activity is a diagnostic, not a guarantee of retention or semantic quality.'},
}
target=args.report or args.video.with_suffix('.validacion.json')
target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['durationSeconds','frames','width','height','videoCodec','audioCodec']},indent=2))
print('Low activity windows:',len(low_windows))
assert not low_windows, f'Review the flagged visual intervals in {target}'

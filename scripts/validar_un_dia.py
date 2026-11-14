"""Read-only checks of the delivered MP4. Usage: python validar_un_dia.py file.mp4."""
from pathlib import Path
import json, subprocess, sys
import numpy as np

path=Path(sys.argv[1])
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
video=next(s for s in probe['streams'] if s['codec_type']=='video')
audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'])==(1080,1920)
assert video['r_frame_rate']=='30/1'
assert int(video['nb_frames'])==2100
assert abs(float(video['duration'])-70)<.0001
assert abs(float(probe['format']['duration'])-70)<.0001
assert video['codec_name']=='h264' and video['pix_fmt'] in ('yuv420p','yuvj420p')
assert audio['codec_name']=='aac'
# Decode the entire stream once. Sample 2 frames/second for activity review.
decoded=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-an','-vf','fps=2,scale=270:480','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True)
assert not decoded.stderr,decoded.stderr.decode(errors='replace')
frames=np.frombuffer(decoded.stdout,np.uint8).reshape(-1,480,270,3)
assert len(frames)==140
delta=np.max(abs(frames[1:].astype(np.int16)-frames[:-1].astype(np.int16)),axis=3)
# Exclude captions and the lower platform UI area from the activity measure.
fractions=(delta[:,:365]>12).mean(axis=(1,2))
low=[round((i+1)/2,1) for i,f in enumerate(fractions) if f<.001]
sound=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-vn','-af','volumedetect','-f','null','-'],capture_output=True,check=True)
report={'file':str(path),'durationSeconds':float(probe['format']['duration']),'videoFrames':int(video['nb_frames']),'width':video['width'],'height':video['height'],'fps':video['r_frame_rate'],'videoCodec':video['codec_name'],'pixelFormat':video['pix_fmt'],'audioCodec':audio['codec_name'],'audioChannels':audio['channels'],'audioSampleRate':audio['sample_rate'],'fullVideoDecodeErrors':0,'activitySampleRate':2,'activityDefinition':'Fraction of pixels changing >12/255 between half-second samples; captions excluded. This metric is not an audience retention measurement.','lowActivitySampleTimes':low,'intentionalClosingPhotographHold':{'fromSeconds':67.4,'toSeconds':70},'audioDecodeLog':sound.stderr.decode(errors='replace')}
path.with_suffix('.validacion.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='audioDecodeLog'},ensure_ascii=False,indent=2))
print('\n'.join(line for line in report['audioDecodeLog'].splitlines() if 'mean_volume:' in line or 'max_volume:' in line))

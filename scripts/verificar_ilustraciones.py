"""Validate assets and record resumable progress; never modifies PNG files."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'docs/ILUSTRACIONES_2D_PROGRESO.json'
manifest = json.loads(manifest_path.read_text())
baseline = manifest['baseline_commit']
original = subprocess.check_output(['git', '-C', str(root), 'ls-tree', '-r', baseline, 'public/imagenes/personajes/'], text=True)
assert original == manifest['approved_characters_git_tree'], 'Character baseline mismatch'
assert not subprocess.check_output(['git', '-C', str(root), 'diff', baseline, '--', 'public/imagenes/personajes/']), 'Approved characters changed'
done = 0
for asset in manifest['assets']:
    path = root / asset['path']
    if not path.exists():
        assert asset['status'] == 'pending', f'Missing completed file: {path}'
        continue
    with Image.open(path) as im:
        im.load()
        assert im.format == 'PNG' and min(im.size) >= 1024, f'Invalid PNG/dimensions: {path}'
        asset['width'], asset['height'] = im.size
        asset['mode'] = im.mode
        if asset['transparent']:
            assert im.mode == 'RGBA', f'Missing alpha: {path}'
            alpha = im.getchannel('A')
            hist = alpha.histogram()
            assert hist[0] > im.width * im.height * .01, f'No transparent background: {path}'
            assert sum(hist[245:]) > im.width * im.height * .05, f'Subject too transparent: {path}'
            asset['alpha_min'], asset['alpha_max'] = alpha.getextrema()
        asset['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
        asset['git_blob_sha'] = subprocess.check_output(['git', '-C', str(root), 'hash-object', str(path)], text=True).strip()
    asset['status'] = 'complete'
    done += 1
manifest['completed_new_assets'] = done
manifest['total_with_approved_characters'] = 30 + done
manifest['next_pending'] = next((a['path'] for a in manifest['assets'] if a['status'] == 'pending'), None)
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'Validated: {done}/45 new PNG; {30 + done}/75 total. Characters unchanged.')
print(f'Next: {manifest["next_pending"]}')
if '--all' in sys.argv:
    assert done == 45, 'Pending illustrations remain'

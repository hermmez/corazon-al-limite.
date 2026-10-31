"""Validate the character library or print its resumable generation queue.

Requires Pillow for validation: python -m pip install Pillow
No API calls, image modification, or generation costs.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / 'public/imagenes/personajes'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pending', action='store_true', help='Print pending prompts as JSON')
    parser.add_argument('--all', action='store_true', help='Require all 30 assets to be completed')
    args = parser.parse_args()
    manifest = json.loads((DIRECTORY / 'manifest.json').read_text())
    pending = [a for a in manifest['assets'] if a['status'] == 'pending']
    if args.pending:
        print(json.dumps({'reference': manifest['reference'], 'pending': pending}, ensure_ascii=False, indent=2))
        return

    from PIL import Image
    errors, checks = [], []
    assets = manifest['assets']
    if len(assets) != 30 or {a['id'] for a in assets} != set(range(1, 31)):
        errors.append('Manifest must contain IDs 1..30 exactly once')
    if len({a['file'] for a in assets}) != len(assets):
        errors.append('Duplicate filenames')
    reference = ROOT / manifest['reference']
    if not reference.is_file() or hashlib.sha256(reference.read_bytes()).hexdigest() != manifest['reference_sha256']:
        errors.append('Master reference missing or checksum mismatch')
    for asset in assets:
        path = DIRECTORY / asset['file']
        if path.parent != DIRECTORY or path.suffix != '.png':
            errors.append(f'Invalid path: {asset["file"]}')
            continue
        if asset['status'] == 'pending':
            if path.exists():
                errors.append(f'{path.name}: file exists but status remains pending')
            continue
        if asset['status'] != 'generated' or not path.is_file():
            errors.append(f'{path.name}: invalid status or missing file')
            continue
        try:
            with Image.open(path) as probe:
                assert probe.format == 'PNG', 'Not PNG'
                probe.verify()
            with Image.open(path) as im:
                im.load()
                assert im.mode == 'RGBA', 'Not RGBA'
                assert im.size == (asset['width'], asset['height']), 'Wrong dimensions'
                assert min(im.size) >= 1024, 'Below native resolution baseline'
                alpha = im.getchannel('A')
                hist = alpha.histogram()
                ratio = hist[0] / (im.width * im.height)
                solid_ratio = sum(hist[245:]) / (im.width * im.height)
                assert 0.2 < ratio < 0.95, 'Missing transparent background or empty image'
                assert solid_ratio > 0.1, 'Subject too transparent or empty'
                corners = [alpha.getpixel((x, y)) for x in (0, im.width - 1) for y in (0, im.height - 1)]
                # A one-step alpha residue (1/255) is below visible opacity;
                # require substantial exact-zero background above as well.
                assert max(corners) <= 1, 'Background corners are not transparent'
                bbox = alpha.point(lambda a: 255 if a >= 128 else 0).getbbox()
                assert bbox and bbox[0] > 0 and bbox[1] > 0 and bbox[2] < im.width and bbox[3] < im.height, 'Subject touches canvas edge'
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                assert digest == asset['sha256'], 'SHA256 mismatch'
                checks.append({'file': path.name, 'size': list(im.size), 'transparent_fraction': round(ratio, 4), 'subject_bbox': bbox, 'sha256': digest, 'result': 'passed'})
        except Exception as exc:
            errors.append(f'{path.name}: {exc}')
    if args.all and pending:
        errors.append(f'{len(pending)} pending assets remain')
    print(json.dumps({'passed': len(checks), 'pending': len(pending), 'checks': checks, 'errors': errors}, ensure_ascii=False, indent=2))
    raise SystemExit(1 if errors else 0)


if __name__ == '__main__':
    main()

"""Validate the selected 2D assets and verify the previous episode byte hashes."""
import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output/episodio-06-emergencia"
SRC = ROOT / "src/episodios/episodio-06-mochila-emergencia"
ASSETS = ROOT / "public/episodio-06/ilustraciones"


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream,"sha256").hexdigest()


plan = json.loads((SRC / "RECURSOS_PLAN.json").read_text(encoding="utf-8"))
assets = []
for spec in plan["plan"]:
    path = ASSETS / spec["file"]
    with Image.open(path) as im:
        w,h = im.size
        alpha = im.getchannel("A").getextrema() if im.mode=="RGBA" else None
        scale = None
        if spec["transparent"]:
            assert alpha and alpha[0]==0 and alpha[1]>240, (path.name,alpha)
            assert im.getchannel("A").getbbox(), path.name
        else:
            scale=max(1080/w,1920/h)
            assert scale<1.17 and abs(w/h-9/16)<.003, (path.name,scale)
        assets.append(dict(file=path.name,width=w,height=h,alpha=alpha,backgroundScale=scale,sha256=digest(path)))
    spec["status"]="generated-and-inspected"

assert len(assets)==24
baseline=json.loads((OUT / "episodios-anteriores.sha256.json").read_text(encoding="utf-8"))
protected=baseline["protected"]
for filename, expected in protected.items():
    assert digest(ROOT / filename)==expected, filename
delivered=baseline["delivered05"]
prior_delivery=ROOT.parents[1] / "outputs" / delivered["file"]
if prior_delivery.exists():
    assert digest(prior_delivery)==delivered["sha256"]
manifest=dict(generator="built-in imagegen",selected=len(assets),paidImageGenerations=0,assets=assets)
save(ASSETS / "manifest.json",manifest)
save(SRC / "RECURSOS_PLAN.json",plan)
save(OUT / "auditoria-recursos.json",dict(**manifest,previousEpisodesUnchanged=True,protectedFiles=len(protected),previousMP4Verified=prior_delivery.exists(),reference=baseline["reference"]))
print(json.dumps(dict(selected=len(assets),protectedFiles=len(protected),previousEpisodesUnchanged=True),ensure_ascii=True))

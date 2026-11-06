"""Audit new individual assets and stage only episode 05 runtime media."""
import hashlib, json, shutil, subprocess
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "src/episodios/episodio-05-emergencia-nuclear"
PUBLIC = ROOT / "public"
OUT = ROOT / "output/episodio-05-nuclear"
BASELINE = "b43ec80031ba5799dbb52050dca07766dd876314"
plan = json.loads((SRC / "RECURSOS_PLAN.json").read_text(encoding="utf-8"))
plan["assets"][6]["selectedFile"] = "edificio-corte-sotano-v2.png"
plan["assets"][6]["rejectedFile"] = "edificio-corte-sotano.png"
items = []; paths = []
for spec in plan["assets"]:
    file = spec.get("selectedFile", spec["file"])
    relative = Path("episodio-05/ilustraciones") / file
    source = PUBLIC / relative
    im = Image.open(source)
    alpha = im.getchannel("A").getextrema() if im.mode == "RGBA" else None
    if spec["transparent"]:
        assert alpha and alpha[0] == 0 and alpha[1] > 240, (file, alpha)
    w, h = im.size
    scale = max(1080 / w, 1920 / h) if not spec["transparent"] else None
    if scale: assert scale <= 1.30, (file, scale)
    items.append({"id": spec["id"], "file": file, "dimensions": [w, h], "mode": im.mode, "alpha": alpha, "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "backgroundCoverScale": scale})
    spec["status"] = "generated-and-inspected"
    paths.append(relative)
manifest = {"selectedAssets": len(items), "rejectedCandidates": ["edificio-corte-sotano.png"], "generator": "built-in image_gen", "paidImageGenerations": 0, "assets": items}
(PUBLIC / "episodio-05/ilustraciones/manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(SRC / "RECURSOS_PLAN.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
extra = [
    "imagenes/personajes/01_neutral.png", "imagenes/personajes/02_explicando.png",
    "imagenes/personajes/04_pensando.png", "imagenes/personajes/11_sorprendido.png",
    "imagenes/personajes/12_preocupado.png",
    "episodio-04/ilustraciones/automovil-teal-vista-trasera.png",
    "episodio-05/audio/narracion_grady_70s.wav",
]
paths += [Path(p) for p in extra]
stage = OUT / "revision-interna/public"
for relative in paths:
    target = stage / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(PUBLIC / relative, target)
protected = subprocess.check_output([
    "git", "diff", "--name-only", BASELINE, "--", "public/imagenes", "public/episodio-04",
    "src/episodios/episodio-04-sin-dormir", "src/episodios/episodio-01-cerebro",
    "src/episodios/episodio-01-cerebro-125", "src/episodios/episodio-02-tiempo",
], cwd=ROOT, encoding="utf-8", stderr=subprocess.DEVNULL).strip()
assert not protected, protected
(OUT / "auditoria-recursos.json").write_text(json.dumps({**manifest, "previousEpisodeProtectedPathsUnchanged": True, "baseline": BASELINE}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"selectedAssets": len(items), "previousEpisodesUnchanged": True, "backgroundMaxScale": max(item["backgroundCoverScale"] or 0 for item in items)}, ensure_ascii=True))

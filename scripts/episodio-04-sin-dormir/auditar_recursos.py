"""Audita PNG originales y nuevos; requiere Pillow. No altera las ilustraciones."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
EPISODE = ROOT / "src/episodios/episodio-04-sin-dormir"
OUT = ROOT / "output/episodio-04-sueno"
NEW = ROOT / "public/episodio-04/ilustraciones"
SPECS = [
    ("automovil-teal-vista-trasera.png", (1358, 1159), (820, 700), True, 1),
    ("carretera-nocturna-sin-vehiculo.png", (941, 1672), (1080, 1920), False, 1.15),
    ("taza-cafe-con-plato.png", (1254, 1254), (800, 800), True, 1),
    ("personaje-descansando-en-cama.png", (1536, 1024), (1200, 800), True, 1),
    ("dormitorio-nocturno-panoramico.png", (1054, 1492), (1080, 1920), False, 1.30),
    ("cama-vacia.png", (1536, 1024), (1100, 734), True, 1),
]
USED = [
    "imagenes/escenarios/01_dormitorio.png",
    "imagenes/escenarios/02_cocina.png",
    "imagenes/personajes/01_neutral.png",
    "imagenes/personajes/05_cansado.png",
    "imagenes/personajes/04_pensando.png",
    "imagenes/personajes/11_sorprendido.png",
    "imagenes/personajes/12_preocupado.png",
    "imagenes/personajes/15_confundido.png",
    "imagenes/personajes/18_bostezando.png",
    "imagenes/anatomia/01_cerebro_completo.png",
    "imagenes/ciencia/02_sinapsis_neuronal.png",
    "imagenes/ciencia/01_neurona.png",
]


def main() -> None:
    baseline = json.loads((EPISODE / "recursos.json").read_text(encoding="utf-8"))
    assert len(baseline["assets"]) == 68, "La referencia debe contener los 68 PNG aprobados"
    for item in baseline["assets"]:
        assert hashlib.sha256((ROOT / item["path"]).read_bytes()).hexdigest() == item["sha256"], item["path"]

    assets = []
    for name, expected_size, render_size, transparent, max_scale in SPECS:
        path = NEW / name
        with Image.open(path) as image:
            assert image.format == "PNG", name
            assert image.size == expected_size, (name, image.size)
            scale = max(render / native for render, native in zip(render_size, image.size))
            assert scale <= max_scale, (name, scale, max_scale)
            alpha = image.getchannel("A").getextrema() if "A" in image.getbands() else None
            if transparent:
                assert image.mode == "RGBA" and alpha[0] == 0 and alpha[1] >= 254, (name, alpha)
            record = {
                "path": path.relative_to(ROOT).as_posix(),
                "width": image.width,
                "height": image.height,
                "mode": image.mode,
                "alphaExtrema": alpha,
                "transparentBackgroundRequired": transparent,
                "maxRenderWidth": render_size[0],
                "maxRenderHeight": render_size[1],
                "coverScale": round(scale, 4),
                "maxAllowedScale": max_scale,
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                "generator": "built-in-imagegen",
                "styleReference": "public/imagenes/escenarios/01_dormitorio.png",
                "promptFile": "src/episodios/episodio-04-sin-dormir/" + ("PROMPTS_PANORAMA.md" if name in {"dormitorio-nocturno-panoramico.png", "cama-vacia.png"} else "PROMPTS_ILUSTRACIONES.md"),
            }
            assets.append(record)

    result = {
        "status": "passed",
        "approvedOriginalsVerified": 68,
        "originalsModified": False,
        "baselineCommit": baseline["baselineCommit"],
        "newAssetsVerified": len(assets),
        "externalCreditGenerationCalls": 0,
        "visualReview": "Inspección de identidad, contornos, paleta y sombreado frente a referencias aprobadas; validación final en movimiento pendiente de audio.",
        "assets": assets,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (NEW / "manifest.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "auditoria-recursos-2d.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Una copia reducida para revisar este episodio sin duplicar los videos de otros episodios.
    stage = OUT / "revision-interna/public"
    for relative in USED + [f"episodio-04/ilustraciones/{spec[0]}" for spec in SPECS]:
        target = stage / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / "public" / relative, target)
    print(json.dumps({"status": "passed", "approvedOriginalsVerified": 68, "newAssetsVerified": len(assets), "stage": str(stage)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

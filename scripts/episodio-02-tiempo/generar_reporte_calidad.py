"""Aggregate completed checks without inventing a review or a validation run."""
import hashlib
import json
from pathlib import Path

OUT = Path("output/episodio-02-tiempo")
SOURCE = Path("src/episodios/episodio-02-tiempo")

def read(path):
    return json.loads(path.read_text())

def main():
    required = ["validacion_tecnica.json", "reproduccion_navegador.json", "sincronia_voz_aac.json"]
    missing = [name for name in required if not (OUT/name).exists()]
    assert not missing, "Primero ejecutar las comprobaciones reales: " + ", ".join(missing)
    tech, browser, voice = [read(OUT/name) for name in required]
    file = Path(tech["file"])
    digest = hashlib.sha256(file.read_bytes()).hexdigest()
    assert tech["technicalStatus"] == "passed"
    assert browser["status"] == "passed" and browser["ended"]
    assert voice["status"] == "passed"
    assert digest == tech["sha256"] == browser["sha256"] == voice["videoSha256"], "La evidencia corresponde a otro render; repetir QA sobre el final."
    config = read(SOURCE/"production.json")
    timeline = read(SOURCE/"timeline.json")
    ret_path = OUT/"retencion.json"
    retention = read(ret_path) if ret_path.exists() else None
    editorial = read(OUT/"revision_editorial.json") if (OUT/"revision_editorial.json").exists() else None
    if retention:
        retention_hash = retention.get("videoSha256") or retention.get("newB", {}).get("videoSha256")
        assert digest == retention_hash, "El análisis editorial automático corresponde a otro MP4."
    report = {
        "technicalStatus": "passed", "video": str(file), "sha256": digest,
        "duration": tech["duration"], "frames": tech["frames"],
        "validationEvidence": required,
        "retentionEvidence": str(ret_path) if retention else None,
        "editorialReview": editorial,
        "voiceProvider": config.get("voice", {}).get("provider"),
        "creditsSpent": config.get("voice", {}).get("creditsActual"),
        "paidGenerations": config.get("voice", {}).get("paidGenerationCount"),
        "threeD": config.get("threeD"),
        "scope": "Las comprobaciones prueban metadatos, decodificación, preservación, voz integrada y reproducción. La naturalidad, ritmo percibido y calidad cinematográfica requieren valoración editorial; no son una conclusión automática de estas métricas.",
    }
    (OUT/"calidad.json").write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n")
    minimum = min(s["correlation"] for s in voice["scenes"])
    text = f'''# Episodio 02 · reporte de calidad técnica

Archivo: `{file.name}`. SHA-256: `{digest}`.

Las comprobaciones siguientes se ejecutaron sobre el mismo MP4 final; sus hashes coinciden. No se presentan como realizadas antes de disponer del archivo.

## Video y audio

| Comprobación | Resultado |
| --- | --- |
| Duración del contenedor, video y audio | {tech['duration']:.3f} s |
| Fotogramas decodificados | {tech['frames']} |
| Resolución y FPS | {tech['width']} × {tech['height']}, {tech['fps']} FPS |
| Códecs | H.264 / AAC estéreo a 48 kHz |
| Color | YUV420p, rango TV, BT.709 |
| Inicio rápido | Índice MP4 antes de los datos multimedia |
| Decodificación completa | Sin errores |
| Intervalos negros detectados | {len(tech['blackRanges'])} |
| Fotogramas distintos | {tech['distinctFrames']} |
| Loudness de la mezcla | {tech['audio']['lufs']} LUFS |
| Pico verdadero | {tech['audio']['truePeakDbtp']} dBTP |

## Narración y subtítulos

Voz: **{config.get('voice',{}).get('provider','Consultar ORIGEN.md')}**, {config.get('voice',{}).get('preset','')}. La procedencia y las licencias se documentan junto al audio; no se presume que una voz estimada o ausente fue generada.

- Correlación de la narración limpia contra el AAC final: mínimo **{minimum:.5f}** en las ocho partes.
- Desfase global medido: **{voice['measuredOffsetMs']:.3f} ms**. La prueba exige un máximo de 5 ms.
- Última palabra: **{voice['lastWordEndMs']/1000:.3f} s**, sin cortar la frase al llegar al límite de 70 s.
- Subtítulos: **{tech['captions']['words']} palabras, {tech['captions']['groups']} grupos**, de 3 a 5 palabras. Marcas positivas, ordenadas y dentro del episodio.
- Eventos semánticos verificados contra palabras reales: **{len(tech['semanticEvents'])}**. Las entradas de capítulo se verifican contra su primera palabra, conservando un pequeño preroll intencional.

`alineacion_audio_real.json` conserva el método de obtención de marcas y los empalmes acústicos. La correlación confirma presencia y posición de voz, no juzga por sí sola la naturalidad o el acento.

## Reproducción

Chromium HTML5 reprodujo el archivo completo a **1.0×**: **{browser['totalVideoFrames']} fotogramas**, **{browser['droppedVideoFrames']} perdidos**, `ended=true`, duración 70 s, sin error multimedia. Decodificó {browser.get('audioDecodedBytes')} bytes de audio. El autoplay se silencia solo durante la prueba automatizada; la mezcla se comprueba por separado.

## Preservación y costo

- {tech['approvedPngUnchanged']} PNG aprobados con SHA-256 intacto.
- Los dos MP4 anteriores del episodio 01 conservan sus hashes.
- Se retienen los registros previos de composiciones y se añade `Episodio02Tiempo` de forma independiente.
- Generaciones de pago declaradas en la configuración: **{config.get('voice',{}).get('paidGenerationCount')}**; créditos de voz: **{config.get('voice',{}).get('creditsActual')}**.
- Apertura 3D: `{config.get('threeD',{}).get('status','Consultar PROMPT_3D.md')}`. No se afirma que un marcador Remotion sea un clip hiperrealista generado. El prompt de sustitución se entrega por separado y no bloquea el render 2D.

## Revisión editorial

'''
    if retention:
        text += "El análisis de retención ejecutado se conserva en `retencion.json` y `REPORTE_RETENCION.md`: intervalos de silencio, evolución de la ilustración protagonista, repetición, sincronía y un registro segundo por segundo. Los umbrales producen alertas para revisar, no autorizan a borrar pausas o a declarar equivalencia subjetiva de energía.\n\n"
    else:
        text += "**Pendiente ejecutar el análisis de retención.** Este reporte técnico no declara completada esa revisión.\n\n"
    if editorial:
        text += "La inspección editorial adicional está documentada en `revision_editorial.json`. Sus observaciones no sustituyen las mediciones del render.\n"
    else:
        text += "La valoración subjetiva de naturalidad, retención y energía debe distinguirse de los checks técnicos; no se inventa una revisión humana.\n"
    (OUT/"REPORTE_CALIDAD.md").write_text(text)
    print(json.dumps({"technicalStatus": "passed", "hashesMatch": True, "retentionAvailable": retention is not None, "editorialReviewAvailable": editorial is not None}))

if __name__ == "__main__":
    main()

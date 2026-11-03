"""Measure the delivered episode, not a proposed storyboard.

Silence, image change and repetition thresholds are editorial review alerts.
An authored semantic event never suppresses a warning measured in the render.
All analysis is local and uses the clean narration rather than the music mix.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

REPO = Path(__file__).resolve().parents[2]
SOURCE = REPO / "src/episodios/episodio-02-tiempo"
OUT = REPO / "output/episodio-02-tiempo"
BASE_VIDEO = REPO / "output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4"
BASE_VOICE = REPO / "public/episodios/episodio-01-cerebro/audio/narracion.flac"
BASE_SHA = "2985c99c74f23883c8302fa65094da5f2bc99364bd820f10faaf8288e395a4a3"


def load_json(path: Path):
    return json.loads(path.read_text())


def digest(path: Path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path: Path):
    try:
        return str(path.resolve().relative_to(REPO))
    except ValueError:
        return str(path)


def overlap(a: float, b: float, interval: dict):
    return interval["start"] < b and interval["end"] > a


def decode_voice(path: Path):
    raw = subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(path), "-ar", "16000", "-ac", "1",
        "-f", "f32le", "-",
    ])
    return np.frombuffer(raw, dtype=np.float32)


def get_measurement_module():
    path = REPO / "scripts/episodio-01-cerebro-125/analizar_ritmo.py"
    spec = importlib.util.spec_from_file_location("cal_rhythm_measurements", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def acoustic_gaps(words):
    """Only derive word-gap information; silence alerts use actual waveform."""
    gaps = []
    for left, right in zip(words, words[1:]):
        a, b = left["endMs"] / 1000, right["startMs"] / 1000
        if b - a > 0.7:
            gaps.append({"start": a, "end": b, "duration": round(b - a, 3)})
    return gaps


def event_offsets(timeline, captions):
    result = []
    for event in timeline["events"]:
        index = event.get("audioWord")
        if index is None or not 0 <= index < len(captions):
            result.append({"event": event.get("id"), "warning": True,
                           "reason": "No acoustic cue word index is available"})
            continue
        word = captions[index]
        entry = event.get("action") == 0
        scene = timeline["scenes"][event["scene"]]
        initial_hook = entry and event["scene"] == 0
        # A chapter can begin on a leading conjunction before its semantic cue.
        # Compare entries with the actual first spoken word, retain cue offset.
        reference = scene["voiceStart"] if entry else word["startMs"] / 1000
        delta = event["start"] - reference
        tolerance = 0.12 if initial_hook else 0.08 if entry else 0.0011
        result.append({
            "event": event.get("id"), "scene": event["scene"],
            "cueWord": word["text"].strip(),
            "cueWordStart": word["startMs"] / 1000,
            "eventStart": event["start"],
            "timingReference": "chapter first spoken word" if entry else "cue word",
            "referenceTime": reference,
            "offsetMs": round(delta * 1000, 3),
            "offsetFromCueMs": round((event["start"] - word["startMs"] / 1000) * 1000, 3),
            "intentionalChapterPreroll": entry,
            "allowedPrerollMs": 120 if initial_hook else 80 if entry else 0,
            "allowedAlignmentErrorMs": round(tolerance * 1000, 3),
            "timingAllowanceReason": (
                "initial hook visual begins before voiced onset" if initial_hook
                else "chapter transition may lead its first spoken word" if entry
                else "cue timestamp rounding tolerance"
            ),
            "warning": abs(delta) > tolerance,
        })
    return result


def second_rows(visual, voice, timeline, captions, alerts):
    rows = []
    for second in range(70):
        begin, end = second, second + 1
        samples = [s["mae"] for s in visual["samples"] if begin <= s["time"] < end]
        pcm = voice[begin * 16000:end * 16000]
        rms = float(np.sqrt(np.mean(pcm.astype(float) ** 2))) if len(pcm) else 0
        active = [s["id"] for s in timeline["scenes"] if s["start"] < end and s["end"] > begin]
        words = [w["text"].strip() for w in captions
                 if w["startMs"] / 1000 < end and w["endMs"] / 1000 > begin]
        events = [{"id": e.get("id"), "cue": e.get("cue"), "intent": e.get("label"),
                   "time": e["start"]} for e in timeline["events"] if begin <= e["start"] < end]
        rows.append({
            "start": begin, "end": end, "sceneIds": active,
            "narratedWords": words, "semanticEvents": events,
            "voiceRmsDbfs": round(20 * math.log10(max(rms, 1e-9)), 2),
            "voiceEnergyAboveMinus35Dbfs": rms > 10 ** (-35 / 20),
            "meanArtworkChangeHalfSecondMae": round(float(np.mean(samples)), 6) if samples else None,
            "maximumArtworkChangeHalfSecondMae": round(max(samples), 6) if samples else None,
            "reviewAlerts": [{"kind": x["kind"], "start": x["start"], "end": x["end"],
                              "reviewed": x["reviewed"]} for x in alerts if overlap(begin, end, x)],
            "editorialMeaningVerifiedAutomatically": False,
        })
    return rows


def editorial_reviews(path: Path):
    if not path.exists():
        return []
    data = load_json(path)
    return data.get("intervals", [])


def review_alerts(groups, reviews):
    result = []
    for kind, intervals in groups:
        for interval in intervals:
            match = next((r for r in reviews if r.get("kind") == kind
                          and abs(r["start"] - interval["start"]) < 0.01
                          and abs(r["end"] - interval["end"]) < 0.01), None)
            decision = match.get("decision") if match else None
            # An interval match or a bare "OK" is not editorial evidence.
            # Keep the measured alert open until a descriptive decision exists;
            # this check cannot itself judge the truth of that explanation.
            descriptive = (isinstance(decision, str)
                           and len(decision.strip()) >= 24
                           and len(decision.split()) >= 5)
            result.append({
                **interval, "kind": kind, "reviewed": descriptive,
                "decision": decision.strip() if descriptive else "Inspección editorial pendiente: falta una decisión descriptiva",
            })
    return result


def baseline(measure):
    assert BASE_VIDEO.exists(), "Falta el episodio aprobado para la comparación de ritmo"
    assert digest(BASE_VIDEO) == BASE_SHA, "El episodio de referencia fue modificado"
    cached = REPO / "output/episodio-01-cerebro-125/analisis_A_original_125.json"
    if cached.exists():
        result = load_json(cached)
        assert result["playbackSpeed"] == 1.25
        assert result["visual"]["roi"] == {"x": [85, 950], "y": [575, 1240]}
        return {**result, "videoSha256Verified": BASE_SHA,
                "voiceSha256": digest(BASE_VOICE),
                "voiceSilenceOver07": measure.silence(BASE_VOICE, 1.25),
                "visualMeasurementReused": relative(cached),
                "visualReuseReason": "Protected video SHA-256 and identical ROI/sample settings"}
    return {
        "video": relative(BASE_VIDEO), "voice": relative(BASE_VOICE),
        "playbackSpeed": 1.25, "videoSha256Verified": BASE_SHA,
        "voiceSha256": digest(BASE_VOICE),
        "voiceSilenceOver07": measure.silence(BASE_VOICE, 1.25),
        "visual": measure.visual(BASE_VIDEO, 1.25),
    }


def write_markdown(result, target):
    a, b = result["referenceA"], result["newB"]
    def table(intervals):
        return "\n".join(f"| {x['start']:.3f}–{x['end']:.3f} | {x['duration']:.3f} |"
                         for x in intervals) or "| — | Sin alertas |"
    text = f"""# Episodio 02 · Retención y ritmo audiovisual

Análisis ejecutado sobre **el MP4 y la pista de voz reales**. Estado: `{result['status']}`. Los umbrales son alertas para inspección, no una medida automática de calidad narrativa. No se declara equivalencia subjetiva de energía mediante cifras.

## Referencia audiovisual

A: episodio 01 aprobado a **1.25×** (56 s efectivos). B: episodio 02 a **1.0×**, 70 s completos. Los temas y los gráficos son diferentes: se comparan ritmo y densidad, no escenas semánticamente equivalentes. `comparacion_ritmo_AB.mp4`, cuando se genera con el script incluido, alterna cuatro pasajes de cada episodio para escuchar voz, transiciones y música, y observar el movimiento.

| Medición | A original a 1.25× | B episodio 02 a 1.0× |
| --- | --- | --- |
| Silencios de voz >0.7 s | {len(a['voiceSilenceOver07'])} | {len(b['voiceSilenceOver07'])} |
| Intervalos de baja evolución ≥2 s | {len(a['visual']['lowEvolution'])} | {len(b['visual']['lowEvolution'])} |
| Posible repetición ≥2 s | {len(a['visual']['possibleRepetition'])} | {len(b['visual']['possibleRepetition'])} |
| MAE mediano por 0.5 s | {a['visual']['medianHalfSecondChange']:.5f} | {b['visual']['medianHalfSecondChange']:.5f} |
| Percentil 90 del cambio visual | {a['visual']['p90HalfSecondChange']:.5f} | {b['visual']['p90HalfSecondChange']:.5f} |

El análisis visual usa x=85–950, y=575–1240, excluyendo títulos, subtítulos y tarjetas inferiores. Se muestrea a 4 FPS y se compara con el fotograma de 0.5 s antes. Se señalan MAE <0.018 durante al menos 2 s y firmas repetidas con diferencia <0.009. Los cambios de cámara, texto o partículas no prueban por sí solos una evolución con propósito; la inspección editorial debe valorar el significado.

## Silencios B mayores de 0.7 s

Se usa exclusivamente la narración limpia a −35 dB, no la mezcla musical.

| Intervalo en la entrega (s) | Duración (s) |
| --- | --- |
{table(b['voiceSilenceOver07'])}

## Intervalos visuales B para revisión

| Baja evolución, segundos exactos | Duración (s) |
| --- | --- |
{table(b['visual']['lowEvolution'])}

| Posible repetición, segundos exactos | Duración (s) |
| --- | --- |
{table(b['visual']['possibleRepetition'])}

Las alertas medidas permanecen registradas aunque una revisión editorial las justifique. Un evento declarado en el guion no borra una alerta de píxeles.

## Sincronía y contenido

- Palabras con marcas reales: **{result['words']}**; fuente de tiempo: la alineación entregada con la narración, no la longitud del texto.
- Eventos semánticos: **{result['semanticEvents']}**. Alertas de desajuste: **{len(result['synchronizationWarnings'])}**. El gancho visual del primer fotograma admite hasta 120 ms de anticipación respecto al comienzo de la voz; las demás entradas de capítulo admiten hasta 80 ms. Los offsets medidos se conservan en el JSON con su motivo y tolerancia explícitos. Las activaciones por palabra mantienen su tolerancia de redondeo de 1.1 ms; no se evalúan con la tolerancia de entrada de capítulo.
- Finales de narración anticipados >0.7 s: **{len(result['earlyNarrationEnds'])}**. La tabla completa de escenas está en el JSON.
- Intervalos entre eventos >2 s: **{len(result['semanticGapsOver2s'])}**. Son puntos de inspección, no prueba de estasis: una construcción progresiva puede continuar entre marcas.
- Última palabra: **{result['lastWordEnd']:.3f} s**. El análisis no determina por sí solo pronunciación, naturalidad o precisión científica; esas revisiones deben quedar documentadas por separado.

"""
    if result["alerts"]:
        text += "## Decisiones editoriales\n\n"
        for row in result["alerts"]:
            text += f"- **{row['kind']} {row['start']:.3f}–{row['end']:.3f} s:** {row['decision']}.\n"
    if result["semanticGapsOver2s"]:
        text += "\n## Distancia entre marcas semánticas\n\n"
        for row in result["semanticGapsOver2s"]:
            text += f"- {row['start']:.3f}–{row['end']:.3f} s ({row['duration']:.3f} s): revisar que el concepto evolucione entre `{row['from']}` y `{row['to']}`.\n"
    text += "\n## Control segundo por segundo\n\n| Segundo | Escena | Voz medida (dBFS) | MAE medio | Eventos por palabra | Alertas |\n| --- | --- | --- | --- | --- | --- |\n"
    for row in result["seconds"]:
        events = "; ".join(str(e["cue"]) for e in row["semanticEvents"]) or "—"
        flags = "; ".join(x["kind"] for x in row["reviewAlerts"]) or "—"
        text += f"| {row['start']:02d}–{row['end']:02d} | {','.join(map(str,row['sceneIds']))} | {row['voiceRmsDbfs']:.2f} | {row['meanArtworkChangeHalfSecondMae']:.5f} | {events} | {flags} |\n"
    text += "\nEl JSON conserva hashes de los archivos analizados, muestras visuales, palabras, eventos, offsets y 70 filas de revisión. La ausencia de alertas no certifica retención, naturalidad o intención narrativa.\n"
    target.write_text(text)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", type=Path, default=OUT / "episodio_02_tiempo_70s.mp4")
    parser.add_argument("--voice", type=Path, default=REPO / "public/episodios/episodio-02-tiempo/audio/narracion.flac")
    parser.add_argument("--output", type=Path, default=OUT / "retencion.json")
    parser.add_argument("--reviews", type=Path, default=OUT / "revision_editorial.json")
    args = parser.parse_args()
    for path in (args.video, args.voice, SOURCE / "timeline.json", SOURCE / "captions.json"):
        assert path.exists(), f"Falta un archivo real necesario para analizar: {path}"
    timeline = load_json(SOURCE / "timeline.json")
    assert timeline["audioReady"], "No analizar una voz pendiente como producción terminada"
    captions = load_json(SOURCE / "captions.json")
    assert captions, "No hay marcas de subtítulos reales"
    measure = get_measurement_module()
    new = {
        "video": relative(args.video), "voice": relative(args.voice), "playbackSpeed": 1,
        "videoSha256": digest(args.video), "voiceSha256": digest(args.voice),
        "voiceSilenceOver07": measure.silence(args.voice),
        "visual": measure.visual(args.video),
    }
    assert len(new["visual"]["samples"]) == 280, "El video analizado no produce 70 s a 4 muestras/s"
    gaps = [{"start": left["start"], "end": right["start"],
             "duration": round(right["start"] - left["start"], 3),
             "from": left.get("id"), "to": right.get("id")}
            for left, right in zip(timeline["events"], timeline["events"][1:])
            if right["start"] - left["start"] > 2]
    early = [{"scene": s["id"], "start": s["voiceEnd"], "end": s["end"],
              "duration": round(s["end"] - s["voiceEnd"], 3)}
             for s in timeline["scenes"] if s["end"] - s["voiceEnd"] > 0.7]
    offsets = event_offsets(timeline, captions)
    sync_warnings = [x for x in offsets if x["warning"]]
    alerts = review_alerts([
        ("voiceSilence", new["voiceSilenceOver07"]),
        ("lowEvolution", new["visual"]["lowEvolution"]),
        ("possibleRepetition", new["visual"]["possibleRepetition"]),
        ("earlyNarrationEnd", early),
    ], editorial_reviews(args.reviews))
    pcm = decode_voice(args.voice)
    assert abs(len(pcm) / 16000 - 70) < 0.002, "La voz limpia no tiene 70 s exactos"
    result = {
        "status": "review-required" if any(not x["reviewed"] for x in alerts) or sync_warnings else "measured-no-unreviewed-threshold-alerts",
        "thresholdsAreReviewAlerts": True,
        "measuredAt": datetime.now(timezone.utc).isoformat(),
        "videoSha256": new["videoSha256"],
        "voiceSha256": new["voiceSha256"],
        "referenceA": baseline(measure), "newB": new,
        "sourceTimelineSha256": digest(SOURCE / "timeline.json"),
        "sourceCaptionsSha256": digest(SOURCE / "captions.json"),
        "words": len(captions), "lastWordEnd": captions[-1]["endMs"] / 1000,
        "semanticEvents": len(timeline["events"]),
        "semanticGapsOver2s": gaps, "earlyNarrationEnds": early,
        "wordGapOver07ForContextOnly": acoustic_gaps(captions),
        "synchronization": offsets, "synchronizationWarnings": sync_warnings,
        "alerts": alerts,
        "seconds": second_rows(new["visual"], pcm, timeline, captions, alerts),
        "limitations": [
            "A and B address different topics; metrics do not establish subjective equivalence.",
            "Pixel evolution cannot determine scientific accuracy or narrative purpose.",
            "No alert is automatically cleared by storyboard events.",
        ],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    write_markdown(result, args.output.parent / "REPORTE_RETENCION.md")
    print(json.dumps({"status": result["status"], "output": relative(args.output),
                      "secondsReviewed": len(result["seconds"]), "voiceSilenceAlerts": len(new["voiceSilenceOver07"]),
                      "lowEvolutionIntervals": len(new["visual"]["lowEvolution"]),
                      "repetitionIntervals": len(new["visual"]["possibleRepetition"]),
                      "syncWarnings": len(sync_warnings), "earlyNarrationEnds": len(early)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

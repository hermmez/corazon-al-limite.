"""Consulta metadatos de costo y acceso. Solo GET; nunca genera audio."""
from __future__ import annotations
import json
import os
from pathlib import Path
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
TEXT = "¿Veinticuatro horas sin dormir? Tu cuerpo no simplemente se cansa… tu cerebro empieza a funcionar de otra manera. Y aquí viene lo peligroso: pueden aparecer microsueños, incluso con los ojos abiertos."
VOICE_ID = "YKUjKbMlejgvkOZlnnvt"
OUT = ROOT / "output/episodio-04-sueno/cotizacion-alejandro.json"
result = {"status": "pending", "voiceId": VOICE_ID, "voiceName": "Alejandro Ballesteros - Warm and Joyful", "locale": "es-MX", "text": TEXT, "characters": len(TEXT), "maxAuditionCharacters": 300, "generationAuthorized": False, "audioGenerationCalls": 0}


def get(path: str, params: dict | None = None):
    assert path in {"/v1/models", "/v1/shared-voices"}
    url = "https://api.elevenlabs.io" + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Accept": "application/json"}, method="GET")
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


try:
    assert len(TEXT) <= 300
    if not os.environ.get("ELEVENLABS_API_KEY"):
        result["status"] = "missing-configured-api-key"
    else:
        models = get("/v1/models")
        model_ids = {"eleven_v4", "eleven_v3", "eleven_multilingual_v2"}
        result["models"] = [{"modelId": m.get("model_id"), "name": m.get("name"), "tokenCostFactor": m.get("token_cost_factor"), "spanish": [l for l in m.get("languages", []) if l.get("language_id") == "es"]} for m in models if m.get("model_id") in model_ids]
        library = get("/v1/shared-voices", {"search": "Alejandro Ballesteros", "language": "es", "gender": "male", "page_size": 100, "include_custom_rates": "true"})
        voice = next((v for v in library.get("voices", []) if v.get("voice_id") == VOICE_ID), None)
        if voice:
            result["status"] = "metadata-retrieved-review-pricing-before-generation"
            result["voice"] = {key: voice.get(key) for key in ["voice_id", "name", "language", "accent", "locale", "gender", "free_users_allowed", "rate", "model_rates"]}
        else:
            result["status"] = "selected-voice-not-returned-by-library"
except urllib.error.HTTPError as error:
    result.update(status="provider-read-failed", httpStatus=error.code)
except Exception:
    # No registrar excepciones, cabeceras ni respuestas que pudieran incluir credenciales.
    result["status"] = "provider-read-failed"
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, ensure_ascii=False))

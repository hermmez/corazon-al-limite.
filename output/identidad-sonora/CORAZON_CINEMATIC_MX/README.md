# CORAZON_CINEMATIC_MX — audiciones locales provisionales

Estas muestras reales no cambian al narrador oficial. Requieren escucha y aprobación de voz, proveedor, modelo y ajustes antes de usar una selección definitiva. Los episodios anteriores y la configuración original de ElevenLabs se conservan.

El candidato existente en ElevenLabs es **Arturo — Calm, Friendly, Natural**, `svrHd8NySjbCTALnWLoS`, modelo `eleven_multilingual_v2`. El catálogo histórico confirmó metadatos masculinos de México. El entorno actual no tiene credencial del proveedor; la consulta de suscripción histórica recibió `missing_permissions`. No se conoce el saldo actual, no se ejecutó síntesis externa y no se consumieron créditos. Un secreto configurado en Actions no implica autorización de generación de pago.

Las tres muestras utilizan **Aldo**, `es_MX-ald-medium`, Piper local, voz masculina mexicana ya utilizada por el proyecto. Mantienen exactamente el mismo texto y la misma voz. **Piper no recibe instrucciones interpretativas**: no controla suspenso, emoción, énfasis semántico, edad ni timbre. Los rótulos C1–C3 describen la dirección deseada; sus diferencias reales se limitan al ritmo nativo de síntesis (`length_scale`). No se afirma que produzcan tres interpretaciones humanas o que cumplan por sí solas el perfil cinematográfico.

| Audición | Archivo | Control distinto |
|---|---|---|
| C1, misterio científico | [voice_C1_misterio.wav](voice_C1_misterio.wav) | `length_scale=0.98` |
| C2, cinematográfica dinámica | [voice_C2_dinamica.wav](voice_C2_dinamica.wav) | `length_scale=0.82` |
| C3, documental moderno | [voice_C3_documental.wav](voice_C3_documental.wav) | `length_scale=0.90` |

No se modifica el texto ni la puntuación para inducir diferencias. Parámetros comunes: `noise_scale=0.55`, `noise_w_scale=0.65`, normalización interna desactivada, volumen 1.0 y misma semilla ONNX Runtime 125 al crear cada sesión. La semilla es del entorno de inferencia, no un parámetro inventado de Piper. No se modifica la frecuencia fundamental ni se aplica `atempo` después de sintetizar.

Los archivos `raw/*_raw.wav` conservan la síntesis original a 22,050 Hz. Las tres copias de escucha reciben el mismo proceso: ganancia constante medida hasta **−16 LUFS integrados / techo −2 dBTP**, con limitador suave de picos sobremuestreado a 192 kHz, ataque de 5 ms y recuperación de 50 ms. Se conserva la duración mediante compensación de latencia; no se comprime dinámicamente el rango de sonoridad. La entrega es PCM de 24 bits, mono a 48 kHz. El remuestreo no mejora la resolución de la fuente. No tienen música, efectos, reverberación, ecualización ni una mezcla que oculte limitaciones de voz. El reporte registra duración, niveles reales, configuración, hashes, decodificación completa y costo cero. Los MP3 a 96 kbps son copias ligeras de escucha; los WAV son las referencias de validación.

Recomendación técnica: escuchar C2 como candidata local de ritmo, sin considerarla aprobada. Para evaluar interpretación semántica profesional habría que autorizar y ejecutar audiciones del proveedor conectado, con parámetros que admita su modelo real. No se ha cambiado de voz ni elegido una definitiva.

Escuchar cada muestra en audífonos y altavoz de teléfono, a volumen fijo: inteligibilidad, acento mexicano, naturalidad, energía controlada y pronunciación de «ciencia ficción» y «sistema eléctrico». Esta evaluación perceptiva queda pendiente del usuario y no se sustituye por LUFS.

Reproducir las muestras con [escuchar.html](escuchar.html), servido desde esta carpeta. Regeneración explícita:

```bash
/tmp/corazon-ritmo-venv/bin/python scripts/identidad-sonora/generar_muestras.py
```

Se requiere el modelo en `/tmp/corazon-piper/`, FFmpeg y las dependencias de Piper ya utilizadas en el repositorio. Los pesos y el runtime no se suben a Git. Las tarjetas de licencia del dataset Aldo (Unlicense) y de la voz base (CC0) acompañan la entrega. La reutilización futura parte de `config/corazon-cinematic-mx.json`, cuyo estado de aprobación permanece pendiente.

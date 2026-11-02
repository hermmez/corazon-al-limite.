# Episodio 01 · Ritmo audiovisual 1.25×

Edición nueva de **70 s, 2100 fotogramas, 30 FPS, 1080 × 1920**. El MP4 no se acelera globalmente: montaje, cámara, diagramas, transiciones, voz, subtítulos y sonido tienen tiempos propios. Guion de **189 palabras**, frente a las 135 del original: sensores/central, estructuras extracraneales, trigémino y tareas durante cirugía despierta. Cierre centrado en la paradoja, sin despedida larga.

## Voz real y costo

Narración completa sintetizada localmente con **Piper, Aldo, es_MX-ald-medium**, voz mexicana masculina. **Cero generaciones de pago y cero créditos.** Es una voz distinta de Juan/ElevenLabs en el original; la comparación A/B conserva esa diferencia. La opción de pago solo se cotizó y no se ejecutó.

Modelo externo a Git en `/tmp/corazon-piper/`. La ficha del proveedor declara el conjunto mexicano bajo Unlicense y el conjunto base Davefx bajo CC0. Fichas y hashes conservados junto al audio. Piper es software GPL-3.0; no se redistribuyen sus ejecutables ni pesos. Música y efectos sintetizados con código original, sin stock ni servicios externos.

## Arquitectura y preservación

`Episodio01Cerebro` selecciona esta edición cuando `timeline.audioReady` es verdadero. `Episodio01Cerebro125` permite renderizarla directamente; `Episodio01CerebroAprobado` conserva la anterior. Las demás composiciones permanecen registradas. La validación verifica los SHA-256 de los 68 PNG y del MP4 aprobado.

| Archivo | Responsabilidad |
| --- | --- |
| `production.json`, `GUION.md` | Texto, referencia y procedencia de la voz |
| `chapters.json`, `labels.json` | Conceptos, acciones y textos editoriales |
| `timeline.json` | Capítulos y eventos derivados de palabras reales |
| `motion.ts` | Easing y acceso a marcas semánticas |
| `World.tsx` | Capas anatómicas, trigémino, sinapsis, escenario clínico y cerebro persistente |
| `Characters.tsx` | Poses oficiales, entrada anclada, respiración mínima y parpadeos |
| `Captions.tsx`, `captions.json` | Grupos de 3–5 palabras y énfasis |
| `index.tsx` | Cámara, máscaras, montaje, títulos y audio |
| `recursos.json` | Imágenes, dimensiones y hashes |
| `scripts/episodio-01-cerebro-125/` | Síntesis, audio, alineación, render, análisis y QA |

Se mantienen personaje, paleta, Manrope local y recursos del piloto. Nuevos gráficos mediante SVG/CSS. Se elimina la flotación como movimiento principal: las acciones cambian el foco, construyen capas, recorren señales o muestran respuestas clínicas. Música de 84 a 105 BPM, con evolución por capítulo.

## Renderizar la entrega incluida

Requisitos: Node/npm, FFmpeg/FFprobe y Chromium. El render utiliza `/usr/bin/chromium` si existe; en otros equipos Remotion usa su navegador configurado.

```bash
npm ci
npm run typecheck
npm run render:episodio01:ritmo
npm run validate:episodio01:ritmo
node scripts/episodio-01-cerebro-125/comprobar_navegador.mjs
```

Resultado: `output/episodio-01-cerebro-125/episodio_01_cerebro_70s_FINAL.mp4`, H.264/AAC estéreo 48 kHz, YUV420p, BT.709 e inicio rápido. `reproducir.html` permite verlo desde un servidor HTTP en esa carpeta.

## Regenerar voz y sincronización sin créditos

La entrega incluye voz, mezcla y marcas: no hay que regenerarlas para renderizar. Para otro guion, usar Python 3.12:

```bash
python -m venv /tmp/corazon-ritmo-venv
/tmp/corazon-ritmo-venv/bin/pip install -r scripts/episodio-01-cerebro-125/requirements.txt
/tmp/corazon-ritmo-venv/bin/python scripts/episodio-01-cerebro-125/generar_voz_local.py
/tmp/corazon-ritmo-venv/bin/python scripts/episodio-01-cerebro-125/preparar_voz.py \
  --source public/episodios/episodio-01-cerebro-125/audio/narracion_original.flac
```

La síntesis se calibra con la duración medida del original y la densidad de fonemas. `atempo=1.25` se aplica únicamente a la voz y conserva el tono. Se editan regiones de silencio verificadas, sin cortar fonemas. Si el presupuesto de pausas no permite llenar 70 s, el proceso falla y exige revisar el contenido.

**Las marcas no se estiman por longitud del texto.** VITS expone las duraciones de los fonemas sintetizados; se verifica por oración que su suma multiplicada por 256 coincide exactamente con las muestras emitidas. Las palabras se vinculan a esos intervalos. Se transforma la duración efectiva del cambio de tempo y los empalmes de silencio registrados. El mapeo de `atempo` tiene tolerancia de 35 ms. Una transcripción independiente revisa contenido, pero no reemplaza marcas. La correlación comprueba la presencia y alineación de la misma voz en el AAC final.

Para tomas externas sin marcas intrínsecas, eliminar `voice.intrinsicAlignment` y usar la ruta ASR de `preparar_voz.py`. Verificar de nuevo guion y alineación. `audioReady` solo se activa después de crear la mezcla real.

## Análisis y comparación

```bash
python scripts/episodio-01-cerebro-125/analizar_ritmo.py \
  --video output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4 \
  --voice public/episodios/episodio-01-cerebro/audio/narracion.flac \
  --speed 1.25 --output output/episodio-01-cerebro-125/analisis_A_original_125.json
python scripts/episodio-01-cerebro-125/analizar_ritmo.py \
  --video output/episodio-01-cerebro-125/episodio_01_cerebro_70s_FINAL.mp4 \
  --voice public/episodios/episodio-01-cerebro-125/audio/narracion.flac \
  --output output/episodio-01-cerebro-125/analisis_B_final_100.json
python scripts/episodio-01-cerebro-125/verificar_voz.py
python scripts/episodio-01-cerebro-125/reporte_ritmo.py
python scripts/episodio-01-cerebro-125/comparar_ab.py
```

`REPORTE_RITMO.md` y `comparacion_ritmo.json` registran segundos exactos y decisiones. El detector revisa silencios >0.7 s, finales anticipados, eventos/palabras y actividad de la ilustración principal a 4 muestras/s. Excluye títulos, subtítulos y tarjetas inferiores. Los umbrales generan alertas de revisión: un evento programado no las elimina automáticamente. La prueba A/B alterna cuatro conceptos equivalentes: A a 1.25×, B a 1.0×. Las métricas no demuestran por sí solas equivalencia subjetiva de energía.

Estándar para episodios futuros: [AGENTS.md](../../../AGENTS.md).

## Rigor científico

El tejido cerebral carece de nociceptores, no toda la cabeza. Meninges, ciertos vasos y estructuras extracraneales pueden ser sensibles. La migraña involucra mecanismos neurológicos complejos. El trigémino es esquemático; no explica todas las cefaleas. La cirugía despierta es para casos seleccionados, con anestesia y vigilancia; tareas de lenguaje y movimiento ayudan al equipo.

Referencias: [NINDS: Migraine](https://www.ninds.nih.gov/health-information/disorders/migraine), [Mayo Clinic: Awake brain surgery](https://www.mayoclinic.org/tests-procedures/awake-brain-surgery/about/pac-20384913) y [BrainFacts: Headaches](https://www.brainfacts.org/ask-an-expert/if-the-brain-cant-feel-pain-why-do-i-get-headaches).

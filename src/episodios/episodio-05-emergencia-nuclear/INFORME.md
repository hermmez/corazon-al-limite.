# Corazón al Límite · Informe del episodio 05

¿Qué hacer si ocurre una explosión nuclear?

El MP4 final dura 70.000 segundos y contiene 2,100 fotogramas a 30 FPS. La imagen es vertical de 1080 × 1920, con H.264 High y color BT.709. La voz Grady en español se exportó en AAC mono a 48 kHz, con 191.732 kbps medidos y un objetivo de 192 kbps.

## Montaje y verificación

Las ocho escenas usan ilustraciones y animación 2D a pantalla completa. Quince recursos nuevos completan la biblioteca aprobada. Los personajes, objetos y fondos se animan en capas independientes. La referencia visual y el diseño de personajes provienen de la escena del cerebro del episodio 04.

La voz se generó una vez en Higgsfield con Eleven v4 y el preset Grady, bajo la autorización de 5.52 créditos. Para ajustar la toma de 75.232625 s a 70 s se acortaron centros de pausas. Se conservan las 174 palabras del guion y el ritmo original de la voz. Los 47 grupos de subtítulos siguen las palabras medidas en la toma. La última palabra termina a los 69.658 s.

La revisión visual utilizó fotogramas a media resolución. Se exportó un solo video completo y se decodificaron todas sus pistas. Se verificaron los 2,100 tiempos de presentación, la ausencia de intervalos negros y la correspondencia del AAC con el WAV sincronizado. El pico real medido es de −1.76 dBTP y el nivel integrado de −16.22 LUFS.

El registro técnico, la edición de pausas y la alineación quedan en `output/episodio-05-nuclear/`. Las fuentes oficiales y la revisión del guion se reúnen en [CIENCIA.md](CIENCIA.md). El inventario de PNG con dimensiones y transparencia está en `public/episodio-05/ilustraciones/manifest.json`. Los prompts exactos están en [RECURSOS_PLAN.json](RECURSOS_PLAN.json) y [CORRECCION_CORTE.md](CORRECCION_CORTE.md).

## Conservación de episodios anteriores

Los recursos y las fuentes de episodios anteriores se cotejaron con el commit `b43ec80031ba5799dbb52050dca07766dd876314`. El MP4 entregado del episodio 04 conserva su SHA-256 `793e93a7d88661a2d2e543440d4ba5535af34064582e349fa2493e7a44a800f5`. Los únicos archivos existentes modificados son `src/Root.tsx`, que registra la composición, y `.gitignore`, que excluye archivos derivados de este episodio.

## Archivos creados

- `output/episodio-05-nuclear/aac-calibracion.json`

- `output/episodio-05-nuclear/alineacion_noventa.json`

- `output/episodio-05-nuclear/auditoria-recursos.json`

- `output/episodio-05-nuclear/episodio05_FINAL_GRADY.json`

- `output/episodio-05-nuclear/episodio05_FINAL_GRADY.srt`

- `output/episodio-05-nuclear/grady-edicion-audio.json`

- `output/episodio-05-nuclear/grady-verificacion-final.json`

- `output/episodio-05-nuclear/revision-composicion.json`

- `output/episodio-05-nuclear/silencios-original.json`

- `output/episodio-05-nuclear/transcripcion_grady_alineada.json`

- `output/episodio-05-nuclear/transcripcion_grady_original.json`

- `public/episodio-05/audio/guion_definitivo.txt`

- `public/episodio-05/audio/narracion-grady.json`

- `public/episodio-05/audio/narracion_grady_70s.wav`

- `public/episodio-05/audio/narracion_grady_original.mp3`

- `public/episodio-05/ilustraciones/bolsa-ropa.png`

- `public/episodio-05/ilustraciones/chaqueta-exterior.png`

- `public/episodio-05/ilustraciones/ciudad-avenida.png`

- `public/episodio-05/ilustraciones/edificio-concreto.png`

- `public/episodio-05/ilustraciones/edificio-corte-sotano-v2.png`

- `public/episodio-05/ilustraciones/interior-higiene.png`

- `public/episodio-05/ilustraciones/manifest.json`

- `public/episodio-05/ilustraciones/nube-explosion.png`

- `public/episodio-05/ilustraciones/personaje-chaqueta.png`

- `public/episodio-05/ilustraciones/personaje-entrando.png`

- `public/episodio-05/ilustraciones/personaje-lavandose.png`

- `public/episodio-05/ilustraciones/personaje-protegiendose.png`

- `public/episodio-05/ilustraciones/personaje-retirando-chaqueta.png`

- `public/episodio-05/ilustraciones/provisiones-selladas.png`

- `public/episodio-05/ilustraciones/radio-emergencia.png`

- `public/episodio-05/ilustraciones/refugio-interior.png`

- `scripts/episodio-05-emergencia-nuclear/auditar_recursos.py`

- `scripts/episodio-05-emergencia-nuclear/bundle.mjs`

- `scripts/episodio-05-emergencia-nuclear/preparar_grady.py`

- `scripts/episodio-05-emergencia-nuclear/renderizar-final.mjs`

- `scripts/episodio-05-emergencia-nuclear/revisar-fotogramas.mjs`

- `scripts/episodio-05-emergencia-nuclear/verificar_final.py`

- `src/episodios/episodio-05-emergencia-nuclear/BRIEF_ORIGINAL.md`

- `src/episodios/episodio-05-emergencia-nuclear/CIENCIA.md`

- `src/episodios/episodio-05-emergencia-nuclear/CORRECCION_CORTE.md`

- `src/episodios/episodio-05-emergencia-nuclear/INFORME.md`

- `src/episodios/episodio-05-emergencia-nuclear/README.md`

- `src/episodios/episodio-05-emergencia-nuclear/RECURSOS_PLAN.json`

- `src/episodios/episodio-05-emergencia-nuclear/Subtitulos.tsx`

- `src/episodios/episodio-05-emergencia-nuclear/captions.json`

- `src/episodios/episodio-05-emergencia-nuclear/chapters.json`

- `src/episodios/episodio-05-emergencia-nuclear/index.tsx`

- `src/episodios/episodio-05-emergencia-nuclear/production.json`

- `src/episodios/episodio-05-emergencia-nuclear/scenes.tsx`

- `src/episodios/episodio-05-emergencia-nuclear/timeline.json`

- `src/episodios/episodio-05-emergencia-nuclear/visuals.tsx`

El MP4 de 47,179,843 bytes se entrega fuera del historial de Git. SHA-256 del archivo entregado `35496256a2202e6f6d092670b714b622d88792e85a3ce27f088ba19289f606a3`.

## Reproducir la revisión y exportación

Desde la raíz del repositorio, abrir Remotion Studio y elegir `Episodio05EmergenciaNuclear`. La composición reproduce el WAV definitivo y los subtítulos integrados. [Vista previa local](http://localhost:3000/Episodio05EmergenciaNuclear).

Para repetir la exportación, usar Python con Pillow y NumPy y configurar `FFMPEG_PATH` con el ejecutable funcional de FFmpeg junto a FFprobe. Con FFmpeg 9.0.2, el ajuste de 173 kbps del codificador produce aproximadamente 192 kbps medidos para esta toma.

```powershell
python scripts/episodio-05-emergencia-nuclear/auditar_recursos.py
& $env:FFMPEG_PATH -v error -i public/episodio-05/audio/narracion_grady_70s.wav -c:a aac -b:a 173k -ar 48000 -ac 1 -t 70 output/episodio-05-nuclear/narracion_grady_192k.m4a
node scripts/episodio-05-emergencia-nuclear/renderizar-final.mjs
python scripts/episodio-05-emergencia-nuclear/verificar_final.py
```

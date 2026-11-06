# Corazón al Límite · Informe del episodio 06

**¿Qué necesitas para sobrevivir 72 horas o 7 días sin servicios básicos?**

El MP4 verificado dura 70.000 segundos. Contiene 2,100 fotogramas a 30 FPS en 1080 × 1920. La imagen se codificó en H.264 High con YUV420p y color BT.709. La voz quedó en AAC mono a 48 kHz con 193.258 kbps medidos, sobre un objetivo de 192 kbps.

## Ilustración y montaje

Las ocho escenas distinguen suministros portátiles de reservas del hogar. La cámara pasa de la ciudad y la cocina a un mapa de Europa, una mochila que se empaca, una comparación de carga y una despensa para siete días. Los 24 PNG nuevos complementan los escenarios, poses y objetos aprobados. Los fondos mantienen sus proporciones y los objetos se integran por capas con transparencia real. [Prompts y referencias](RECURSOS_PLAN.json).

Las cantidades de agua se presentan como aproximaciones. Se cotejaron las recomendaciones de 72 horas, siete días y almacenamiento de agua con la Comisión Europea, Protección Civil de Suecia, Ready.gov y CDC. El mapa usa contornos de Natural Earth. [Revisión y fuentes](CIENCIA.md).

## Voz y subtítulos

Se usó una sola generación de Grady en Higgsfield con Eleven v4, autorizada por 5.75 créditos. La toma original de 82.991 s se ajustó eliminando 6.848 s de centros de pausas medidas y aumentando el ritmo un 8.84 % con tono preservado. Se conservaron las 177 palabras. Una segunda transcripción de la edición reconoció el guion completo y observó una diferencia mediana de 11 ms y percentil 95 de 47 ms frente a las marcas originales transformadas.

Los 49 grupos de subtítulos tienen de tres a cinco palabras y hasta dos líneas. La última palabra se mantiene hasta el segundo 69.776 en los subtítulos. Las entradas de escena se movieron a las pausas entre las frases grabadas. El SRT usa los mismos tiempos de comienzo y fin de cada grupo.

## Verificación de entrega

TypeScript pasó. Se revisaron 35 fotogramas a baja resolución del montaje final. Se completó una exportación de 2,100 fotogramas después de resolver una interrupción inicial por espacio en disco. La verificación decodificó el MP4 completo, comprobó sus tiempos de presentación, detectó cero intervalos negros y confirmó una correlación de 0.99993 entre el AAC y el WAV de referencia. El audio mide −16.09 LUFS integrados y −1.87 dBTP.

Se verificaron los SHA-256 de 151 archivos protegidos y el MP4 entregado del episodio 05. La rama del episodio 06 usa como base la versión del episodio 05 `52245607817385090c9a3df1fdfea4a70066e788`. Los únicos archivos existentes modificados son `src/Root.tsx` y `.gitignore`, para registrar la composición y excluir temporales del episodio 06.

## Archivos creados

- `output/episodio-06-emergencia/aac-calibracion.json`

- `output/episodio-06-emergencia/alineacion-original.json`

- `output/episodio-06-emergencia/auditoria-recursos.json`

- `output/episodio-06-emergencia/episodio06_FINAL_GRADY.json`

- `output/episodio-06-emergencia/episodio06_FINAL_GRADY.srt`

- `output/episodio-06-emergencia/episodios-anteriores.sha256.json`

- `output/episodio-06-emergencia/grady-edicion-audio.json`

- `output/episodio-06-emergencia/grady-verificacion-final.json`

- `output/episodio-06-emergencia/reconocimiento-despues-de-ajuste.json`

- `output/episodio-06-emergencia/render-verificado.json`

- `output/episodio-06-emergencia/revision-rango-20.json`

- `output/episodio-06-emergencia/revision-reservas.json`

- `public/episodio-06/audio/guion_definitivo.txt`

- `public/episodio-06/audio/narracion-grady.json`

- `public/episodio-06/audio/narracion_grady_70s.wav`

- `public/episodio-06/audio/narracion_grady_original.mp3`

- `public/episodio-06/ilustraciones/abrelatas-manual.png`

- `public/episodio-06/ilustraciones/baterias.png`

- `public/episodio-06/ilustraciones/botella-portatil.png`

- `public/episodio-06/ilustraciones/botiquin-medicinas.png`

- `public/episodio-06/ilustraciones/calendario-escritorio.png`

- `public/episodio-06/ilustraciones/cargador-portatil.png`

- `public/episodio-06/ilustraciones/cobijas.png`

- `public/episodio-06/ilustraciones/despensa-reservas.png`

- `public/episodio-06/ilustraciones/documentos-estanco.png`

- `public/episodio-06/ilustraciones/familia-en-casa.png`

- `public/episodio-06/ilustraciones/garrafon-4l.png`

- `public/episodio-06/ilustraciones/lampara-mesa.png`

- `public/episodio-06/ilustraciones/linterna.png`

- `public/episodio-06/ilustraciones/manifest.json`

- `public/episodio-06/ilustraciones/mesa-preparacion.png`

- `public/episodio-06/ilustraciones/mochila-abierta.png`

- `public/episodio-06/ilustraciones/mochila-cerrada.png`

- `public/episodio-06/ilustraciones/personaje-carga-pesada.png`

- `public/episodio-06/ilustraciones/personaje-empacando.png`

- `public/episodio-06/ilustraciones/personaje-mochila.png`

- `public/episodio-06/ilustraciones/ropa-higiene-viaje.png`

- `public/episodio-06/ilustraciones/saneamiento.png`

- `public/episodio-06/ilustraciones/suministros-bebe.png`

- `public/episodio-06/ilustraciones/suministros-mascota.png`

- `public/episodio-06/ilustraciones/telefono.png`

- `scripts/episodio-06-mochila-emergencia/auditar_recursos.py`

- `scripts/episodio-06-mochila-emergencia/bundle.mjs`

- `scripts/episodio-06-mochila-emergencia/preparar_grady.py`

- `scripts/episodio-06-mochila-emergencia/preparar_mapa.py`

- `scripts/episodio-06-mochila-emergencia/renderizar-final.mjs`

- `scripts/episodio-06-mochila-emergencia/revisar-fotogramas.mjs`

- `scripts/episodio-06-mochila-emergencia/revisar-reservas.mjs`

- `scripts/episodio-06-mochila-emergencia/verificar_final.py`

- `src/episodios/episodio-06-mochila-emergencia/BRIEF_ORIGINAL.md`

- `src/episodios/episodio-06-mochila-emergencia/CIENCIA.md`

- `src/episodios/episodio-06-mochila-emergencia/INFORME.md`

- `src/episodios/episodio-06-mochila-emergencia/README.md`

- `src/episodios/episodio-06-mochila-emergencia/RECURSOS_PLAN.json`

- `src/episodios/episodio-06-mochila-emergencia/Subtitulos.tsx`

- `src/episodios/episodio-06-mochila-emergencia/captions.json`

- `src/episodios/episodio-06-mochila-emergencia/chapters.json`

- `src/episodios/episodio-06-mochila-emergencia/europa.json`

- `src/episodios/episodio-06-mochila-emergencia/index.tsx`

- `src/episodios/episodio-06-mochila-emergencia/production.json`

- `src/episodios/episodio-06-mochila-emergencia/scenes-inicio.tsx`

- `src/episodios/episodio-06-mochila-emergencia/scenes-reservas.tsx`

- `src/episodios/episodio-06-mochila-emergencia/timeline.json`

- `src/episodios/episodio-06-mochila-emergencia/timing.ts`

- `src/episodios/episodio-06-mochila-emergencia/visuals.tsx`

El MP4 final se entrega fuera del historial de Git. SHA-256 `f3e25a52104d9a5f6eddebe520aeca5c2e2e524e33596f82665285bcd93788cc`. El inventario técnico del formato y la sincronización está en `output/episodio-06-emergencia/grady-verificacion-final.json`.

[Vista previa en Remotion Studio](http://localhost:3000/Episodio06MochilaEmergencia).

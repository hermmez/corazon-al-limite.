# Episodio 14 · El silbato de la muerte azteca

## Entrega verificada

`episodio14_FINAL_GRADY_70s.mp4` contiene 70,000 segundos exactos de video y audio. La imagen es vertical de 1080 × 1920, con 2.100 fotogramas a 30 FPS, H.264 High, YUV420p y BT.709. El audio es AAC a 48 kHz y 192,3 kb/s medidos. El archivo permite inicio rápido. Se decodificó completo, se comprobaron los 2.100 tiempos de presentación y no aparecieron intervalos negros.

SHA-256 `118da360c7b295629ec1e2ecef4590ffa9d67c94cee8dc8a73b924d97285a82f`.

## Voz y subtítulos

La narración de Grady en español conserva los 167 términos del guion condensado y la toma original de Eleven v4 en Higgsfield. Se generó una sola toma por los 4,60 créditos autorizados. La voz quedó a velocidad natural, con 3,60 s añadidos en pausas repartidas. La corrección visual utilizó los mismos archivos de audio y el mismo guion.

Los 44 grupos de subtítulos tienen de tres a cinco palabras y ocupan hasta dos líneas. Se alinearon con la voz real. Se unió la segmentación automática «a terrorizar» en «aterrorizar» para conservar la palabra del guion. La última palabra termina a 67,55 s. El análisis de la voz aislada no detectó pausas internas superiores a 0,70 s con umbral de −37 dB.

La demostración corresponde a una grabación contemporánea de un silbato físico por Guy_Personface. Se escucha de 68,26 a 69,46 s, después de la voz. Se desconoce el modelo exacto grabado. El pico del fragmento en el MP4 es -9,62 dBFS. Su correlación con la muestra es 0,999192. La correlación de la mezcla completa con la pista AAC es 0,999948. [Grabación original](https://freesound.org/people/Guy_Personface/sounds/832472/) · [Licencia CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

## Montaje

La construcción parte del barro y conserva el contorno del silbato durante las revelaciones del conducto y las cámaras. El rostro reaparece sobre el mismo cuerpo. Las líneas animadas explican el recorrido y la interacción del aire. La última toma muestra las dos vistas aprobadas juntas. El gancho y la secuencia de Tlatelolco siguen en la edición.

| Secuencia | Tiempo aproximado | Acción |
| --- | --- | --- |
| Arcilla | 10,57–20,47 s | El bloque se moldea hasta adquirir el perfil del instrumento. |
| Conducto | 20,47–29,14 s | Se abre el corte y aparece la entrada tubular del aire. |
| Cavidades | 29,14–39,78 s | Se revelan la cámara de contrapresión, la zona de interacción y la campana. |
| Rostro | 39,78–50,27 s | Regresan los ojos, la nariz y los dientes tallados del exterior. |
| Funcionamiento | 61,04–64,31 s | El corte vuelve y las líneas animadas muestran la entrada, la oscilación y la salida. |
| Resultado | 64,31–70,00 s | Exterior y corte lado a lado. La demostración sonora empieza a los 68,26 s. |

El exterior se dibujó a partir de la fotografía aportada y con la ilustración aprobada del cerebro como referencia de estilo. Ambos PNG son RGBA de 939 × 1675 píxeles y tienen el mismo canal alfa píxel por píxel. El corte se rotula como reconstrucción ilustrativa basada en la tomografía del ejemplar comparable IV Ca 2621m del Museo Etnológico de Berlín. Se desconoce el interior del ejemplar de la fotografía. El guion presenta el uso militar como hipótesis. [Tomografía y esquema acústico](https://pmc.ncbi.nlm.nih.gov/articles/PMC11555264/figure/Fig1/) · [Contexto arqueológico del INAH](https://revistas.inah.gob.mx/index.php/arqueologia/article/view/3531/0)

## Archivos

| Ubicación | Contenido |
| --- | --- |
| `public/episodio-14/ilustraciones/` | PNG aprobados `silbato-exterior-aprobado.png` y `silbato-corte-aprobado.png`. Se reutilizan `patio-nocturno.png`, `mesa-arcilla.png`, `contexto-tlatelolco.png` y el personaje `public/imagenes/personajes/12_preocupado.png`. `manifest.json` registra dimensiones, referencias y hashes. |
| `src/episodios/episodio-14-silbato-mexica/` | `index.tsx` compone las escenas y las transiciones. `silbato-aprobado.tsx` anima la construcción, las capas y el flujo. `silbato.tsx` dibuja el bloque de arcilla. `arte/corte-capas.svg` conserva el corte editable. `guion.json`, `timeline.json` y `captions.json` conservan texto y tiempos. `FUENTES.md` documenta arqueología, acústica y audio. |
| `src/Root.tsx` | Registra la composición `Episodio14SilbatoMexica`. |
| `public/episodio-14/audio/` | Toma original, voz aislada, mezcla final y muestra sonora. |
| `scripts/episodio-14-silbato-mexica/` | Alineación, preparación de audio, exportación y comprobación. |
| `output/episodio-14-silbato-mexica/` | SRT, métricas de la voz, verificación del render y registro de recursos anteriores. |

### SHA-256 de los recursos aprobados

- Exterior `171e96be24ec44e7eb0937b51d2edc247c935e49369549244755b1d4da70d22a`.
- Corte `40eabe5874c8ac28e8fcff6fdf2c900d22cc7df81ec33d76e3a5d64ddd346dbd`.

## Reproducción del proyecto

Abrir `Episodio14SilbatoMexica` en Remotion Studio. Para exportar desde la raíz, configurar `FFMPEG_PATH` y ejecutar `node scripts/episodio-14-silbato-mexica/render.mjs`. El script admite `--stills` seguido de los números de fotograma para revisar vistas ligeras. Para verificar, indicar la carpeta de entrega con `EPISODIO14_ENTREGA` y ejecutar `verificar.py` con Python, NumPy, Pillow, FFmpeg y FFprobe.

## Revisión visual

Se inspeccionaron 21 fotogramas de la composición y 16 del MP4 final para comprobar encuadre, continuidad de silueta, legibilidad y correspondencia entre las etapas. Los SHA-256 de los 68 PNG aprobados y de los nueve MP4 anteriores coincidieron con sus registros.

Como referencia se midió el cambio de gris de un recorte central a cuatro muestras por segundo. La mediana y el percentil 90 fueron 0,854 y 4,170 en el episodio 14 a velocidad normal, y 0,875 y 9,734 en el episodio 04 a 1,25×. Los picos de movimiento medidos fueron menores en el episodio 14. El indicador también responde a cambios de luz y no mide por sí solo el ritmo narrativo.

Los intervalos bajo el umbral de 0,75 durante al menos 2 s fueron 3,50–9,50 s (reconocimiento del rostro en el patio), 18,00–21,00 s (forma de barro antes del corte), 25,50–28,00 s (lectura del conducto) y 65,50–68,00 s (comparación de ambas vistas antes del sonido). Se conservaron estos planos para leer las formas y seguir la explicación.

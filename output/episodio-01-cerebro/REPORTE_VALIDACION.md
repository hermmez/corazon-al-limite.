# Validación de entrega · Episodio 01 con narración

**Estado: MP4 de 70 segundos con narración real, música, efectos y subtítulos sincronizados.** El montaje visual aprobado se conserva. La revisión anterior sin voz está archivada en `revision-sin-voz/`.

Video: `episodio_01_cerebro_70s.mp4` · 36,212,975 bytes (34.54 MiB). SHA-256: `2985c99c74f23883c8302fa65094da5f2bc99364bd820f10faaf8288e395a4a3`.

| Comprobación | Resultado |
| --- | --- |
| Resolución / fotogramas | 1080 × 1920 · 30 FPS · 2100 fotogramas |
| Duración de video y audio | 70.000 segundos en ambas pistas |
| Video | H.264 · YUV420p · BT.709 · rango TV · inicio rápido |
| Audio | AAC estéreo · 48 kHz; voz, música y efectos integrados |
| Nivel / pico verdadero | -14.21 LUFS / -1.83 dBTP; sin saturación |
| Voz real | ElevenLabs vía Higgsfield, voz masculina Juan; una generación |
| Toma original | 62.850612 s; conservada en MP3 |
| Costo comprobado | 2.55 créditos; saldo 43.95 → 41.40 |
| Velocidad de la voz | 1×, sin aceleración; solo se editan pausas entre frases |
| Última palabra | Termina a los 69.700 s, sin corte |
| Subtítulos | 135 palabras, 33 grupos de 3–5 palabras, máximo 2 líneas |
| Alineación | Marcas acústicas reales de Whisper, con verificación focal de la frase sobre anestesia |
| Voz dentro del AAC | Comprobada por correlación de forma de onda en las ocho escenas |
| Desfase AAC / pista limpia | 0.0 ms detectados; correlación mínima 0.9517 |
| Decodificación | Completa; sin pantallas negras; 2100 fotogramas distintos |
| Reproducción Chromium | 70 s completos, 2100 fotogramas, 0 perdidos; sin error |
| Audio decodificado en navegador | 1,690,594 bytes; reproducción automatizada silenciada |
| Ilustraciones | 68 PNG verificados por SHA-256, intactos |
| Composiciones anteriores | 27 conservadas |
| TypeScript | Compila correctamente |

Se inspeccionaron capturas extraídas del MP4 con subtítulos en introducción, explicación, capas anatómicas, vías nerviosas, anestesia y cierre. Los grupos quedan bajo las ilustraciones, sin cubrir rostros ni órganos. La medición de la fuente local Manrope confirma un máximo de dos líneas por grupo dentro del ancho seguro de 850 px.

La voz guía la lectura a velocidad natural. Las frases pueden anticiparse o continuar sobre el plano siguiente mediante cortes de voz, manteniendo los intervalos visuales aprobados. Las pausas y marcas por escena se registran en `alineacion_audio_real.json`; no se calculan los subtítulos a partir de la longitud del texto.

## Recursos de voz y sincronización

- `public/episodios/episodio-01-cerebro/audio/narracion_original.mp3`: toma real original de ElevenLabs.
- `public/episodios/episodio-01-cerebro/audio/narracion.flac`: pista limpia normalizada de 70 s.
- `public/episodios/episodio-01-cerebro/audio/mezcla_master.flac`: bus de voz, música y efectos sin pérdida.
- `src/episodios/episodio-01-cerebro/captions.json` y `subtitulos.srt`: subtítulos sincronizados.
- `voz_generacion.json`: proveedor, trabajo completado y costo real.
- `transcripcion_original.json`, `transcripcion_verificada.json`, `alineacion_audio_real.json` y `sincronia_voz_aac.json`: pruebas acústicas y sincronización.

## Conservación y material 3D

Se conservaron las ilustraciones, personajes, órganos, colores, encuadres, cámara, transiciones y estructura visual aprobados. Solo se incorporan narración, mezcla y subtítulos. La música y los efectos son idénticos a sus archivos anteriores. El MP4 anterior sin voz conserva su SHA-256 original en `revision-sin-voz/episodio_01_cerebro_70s_sin_voz.mp4`.

La introducción 2D se mantiene. No hay clip 3D aprobado; siguen disponibles el espacio reemplazable de tres segundos y el prompt separado. No se han solicitado generaciones de imagen ni video.

## Render y límites

`npm run render:episodio01` genera el video; `npm run validate:episodio01` verifica metadatos, preservación, decodificación, pantallas negras, volumen y presencia/sincronización de voz en el AAC. `npm run playback:episodio01` reproduce los 70 s completos en Chromium.

El MP4 de 34.54 MiB y todos los binarios nuevos están por debajo de 50 MiB y del límite de 100 MiB por archivo de GitHub. Los WAV de trabajo y renders intermedios quedan fuera de Git. El PR #7 se actualiza sin fusionarse.

# Episodio 01 · El cerebro y el dolor

Composición independiente `Episodio01Cerebro`: **1080 × 1920, 30 FPS, 2100 fotogramas, 70 segundos exactos**. No se alteran los PNG aprobados ni las composiciones anteriores. La tipografía local Manrope, los colores, el componente de títulos y las curvas de movimiento se reutilizan del piloto aprobado.

## Estado de producción

Se ha construido el montaje 2D completo con ocho escenas, cámara, paralaje, cerebro que viaja entre planos, capas anatómicas, vías nerviosas, sinapsis, hospital ilustrado y cierre de marca. La música y los efectos son originales, sintetizados mediante código.

**Narración integrada.** Voz masculina Juan de ElevenLabs mediante Higgsfield, generada en una sola toma de 62.850612 s. Costo real: **2.55 créditos** (saldo 43.95 → 41.40). La grabación original está en `public/episodios/episodio-01-cerebro/audio/narracion_original.mp3`; la pista limpia de 70 s está en `narracion.flac`. Los subtítulos contienen las 135 palabras, alineadas acústicamente al audio real. La última palabra termina a los 69.7 s; no se acelera la voz. Se ajustan pausas entre frases y se permiten anticipaciones de narración entre planos para conservar el montaje visual aprobado. La revisión anterior sin voz se conserva en `output/episodio-01-cerebro/revision-sin-voz/`.

**Clip 3D pendiente.** No hay un clip de cerebro 3D aprobado. Los primeros tres segundos usan la ilustración oficial con profundidad y cámara. `EPISODE.introVideoSrc` es un espacio reemplazable; el prompt separado está en `PROMPT_3D_PENDIENTE.md`. No se ha generado imagen ni video ni se han solicitado créditos para 3D.

## Arquitectura

| Archivo | Función |
| --- | --- |
| `config.ts` | Dimensiones, imágenes, guion, ocho intervalos editables y espacio 3D |
| `production.json` | Registro del guion, procedencia y estado de voz/3D |
| `index.tsx` | Montaje, cámara, identidad, títulos y bus maestro |
| `primitives.tsx` | Personaje con respiración, gesto de antebrazo y parpadeos; imágenes proporcionales; señales SVG; órbitas; capas y fondo |
| `scenes.tsx` | Ocho segmentos narrativos y trayectoria del cerebro compartido |
| `Captions.tsx` | Grupos de 3–5 palabras basados en marcas acústicas reales |
| `captions.json` | 135 palabras con alineación acústica real |
| `../../../scripts/episodio-01-cerebro/` | Composición musical, alineación, mezcla, render y validación |

El personaje conserva su boca original sin sincronización labial. El gesto usa capas recortadas de la misma ilustración, sin sobrescribir el PNG. Las imágenes usan `staticFile()` y `objectFit: contain`. Los SVG nuevos son gráficos de apoyo, no sustituciones del protagonista. La escena médica es una ilustración conceptual, sin sangre ni representación de un procedimiento real.

## Render

```bash
npm ci
npm run typecheck
# NumPy se usa para comprobar la presencia de voz en el AAC final.
python -m pip install numpy
npm run render:episodio01
npm run validate:episodio01
npm run playback:episodio01
```

El render utiliza los FLAC entregados y no llama a ElevenLabs ni consume créditos de generación. La validación de voz usa Python con NumPy. Chromium puede descargarse mediante Remotion o utilizarse desde `/usr/bin/chromium`. Se limita la concurrencia a dos para este entorno de CPU.

Entrega: `output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4`. El render utiliza H.264 y una sola codificación AAC desde el bus sin pérdida, rango de video estándar BT.709, YUV420p y MP4 con inicio rápido. También extrae `miniatura_vertical.jpg` a resolución vertical completa.

## Reconstruir la mezcla y la alineación desde la grabación real

Primero instalar `scripts/piloto10s/requirements.txt` para disponer de faster-whisper y NumPy.

1. Guardar la grabación completa en `public/episodios/episodio-01-cerebro/audio/narracion_original.mp3`. No acelerar artificialmente la lectura.
2. Ejecutar el alineador acústico:

```bash
python scripts/episodio-01-cerebro/preparar_voz.py \
  --source public/episodios/episodio-01-cerebro/audio/narracion_original.mp3
npm run typecheck
npm run render:episodio01
npm run validate:episodio01
```

El alineador usa Whisper en CPU sobre el audio real; comprueba el guion palabra por palabra. Conserva las fronteras acústicas, modifica únicamente pausas entre frases, exporta SRT/JSON y mezcla el bus con prioridad a la voz. No estima tiempos a partir de la longitud del texto. Permite anticipaciones y continuaciones de voz entre planos cuando la lectura natural lo requiere, manteniendo los ocho intervalos visuales y los 2100 fotogramas. Si la lectura no cabe de forma natural, falla sin cortar palabras ni aumentar la velocidad. Si el reconocimiento global confunde palabras por unión fonética, el script vuelve a reconocer solo la frase discrepante sobre su ventana de audio real. Registra ambas transcripciones y no sustituye tiempos sin verificación acústica. Cualquier discrepancia restante detiene la exportación.

## Rigor científico

- El enunciado sobre ausencia de nociceptores se limita al **tejido cerebral**.
- Las meninges, ciertos vasos y otras estructuras dentro y fuera del cráneo pueden ser sensibles al dolor.
- La pantalla de migraña aclara que intervienen mecanismos neurológicos complejos; no la reduce a vasos sanguíneos.
- La cirugía despierta se presenta como una técnica para casos seleccionados, con anestesia de las estructuras sensibles y supervisión médica.
- Los diagramas son esquemas explicativos y no mapas clínicos ni instrucciones de tratamiento.

Lecturas de referencia: [NINDS: Migraine](https://www.ninds.nih.gov/health-information/disorders/migraine) y [Mayo Clinic: Awake brain surgery](https://www.mayoclinic.org/tests-procedures/awake-brain-surgery/about/pac-20384913).

## Conservación y validación

El verificador contrasta SHA-256 de los **68 PNG** contra el inventario del piloto y comprueba que continúen registradas todas las composiciones anteriores. Comprueba las rutas, los intervalos, códecs, dimensiones, FPS, 2100 fotogramas y duración de ambas pistas. Decodifica el video completo, detecta pantallas negras, cuenta fotogramas distintos, mide LUFS/picos y comprueba inicio rápido. Cuando existe narración, verifica además guion, grupos y correspondencia de marcas temporales con la alineación acústica.

El verificador también correlaciona la pista de voz limpia con el AAC decodificado de cada una de las ocho escenas. Así comprueba que la narración esté realmente dentro del MP4 y que no haya desfase. El bus maestro se rechaza si indica solo música cuando la composición requiere voz. La prueba del navegador reproduce los 70 segundos completos en Chromium HTML5 y registra fotogramas, errores y decodificación de audio.

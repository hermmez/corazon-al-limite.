# Episodio 01 · El cerebro y el dolor

Composición independiente `Episodio01Cerebro`: **1080 × 1920, 30 FPS, 2100 fotogramas, 70 segundos exactos**. No se alteran los PNG aprobados ni las composiciones anteriores. La tipografía local Manrope, los colores, el componente de títulos y las curvas de movimiento se reutilizan del piloto aprobado.

## Estado de producción

Se ha construido el montaje 2D completo con ocho escenas, cámara, paralaje, cerebro que viaja entre planos, capas anatómicas, vías nerviosas, sinapsis, hospital ilustrado y cierre de marca. La música y los efectos son originales, sintetizados mediante código.

**Voz pendiente de autorización.** El punto 3 solicita no gastar créditos sin autorización. Se obtuvo una cotización de 2.55 créditos para una generación de voz ElevenLabs/Juan con el guion definitivo, pero no se envió un trabajo de pago. Falta `public/episodios/episodio-01-cerebro/audio/narracion_original.mp3`. La versión sin voz no incluye subtítulos falsamente sincronizados: `captions.json` queda vacío hasta contar con audio real. Los textos editoriales y etiquetas anatómicas sí están animados en la imagen.

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
| `captions.json` | Alineación real, vacía mientras la voz esté pendiente |
| `../../../scripts/episodio-01-cerebro/` | Composición musical, alineación, mezcla, render y validación |

El personaje conserva su boca original sin sincronización labial. El gesto usa capas recortadas de la misma ilustración, sin sobrescribir el PNG. Las imágenes usan `staticFile()` y `objectFit: contain`. Los SVG nuevos son gráficos de apoyo, no sustituciones del protagonista. La escena médica es una ilustración conceptual, sin sangre ni representación de un procedimiento real.

## Render

```bash
npm ci
npm run typecheck
python -m pip install -r scripts/piloto10s/requirements.txt
# Produce música/efectos; no llama a un proveedor ni consume créditos.
python scripts/episodio-01-cerebro/crear_audio.py
npm run render:episodio01
npm run validate:episodio01
npm run playback:episodio01
```

Si ya existen los FLAC entregados, el render no requiere instalar Python ni regenerar el audio. Chromium puede descargarse mediante Remotion o utilizarse desde `/usr/bin/chromium`. Se limita la concurrencia a dos para este entorno de CPU.

Entrega: `output/episodio-01-cerebro/episodio_01_cerebro_70s.mp4`. El render utiliza H.264 y una sola codificación AAC desde el bus sin pérdida, rango de video estándar BT.709, YUV420p y MP4 con inicio rápido. También extrae `miniatura_vertical.jpg` a resolución vertical completa.

## Incorporar una locución real autorizada

1. Guardar la grabación completa en `public/episodios/episodio-01-cerebro/audio/narracion_original.mp3`. No acelerar artificialmente la lectura.
2. Ejecutar el alineador acústico:

```bash
python scripts/episodio-01-cerebro/preparar_voz.py \
  --source public/episodios/episodio-01-cerebro/audio/narracion_original.mp3
npm run typecheck
npm run render:episodio01
npm run validate:episodio01
```

El alineador usa Whisper en CPU sobre el audio real; comprueba el guion palabra por palabra. Conserva las fronteras acústicas, modifica únicamente pausas entre frases, exporta SRT/JSON y mezcla el bus con prioridad a la voz. No estima tiempos a partir de la longitud del texto. Permite anticipaciones y continuaciones de voz entre planos cuando la lectura natural lo requiere, manteniendo los ocho intervalos visuales y los 2100 fotogramas. Si la lectura no cabe de forma natural, falla sin cortar palabras ni aumentar la velocidad. Una diferencia de transcripción requiere revisión del audio antes de continuar.

## Rigor científico

- El enunciado sobre ausencia de nociceptores se limita al **tejido cerebral**.
- Las meninges, ciertos vasos y otras estructuras dentro y fuera del cráneo pueden ser sensibles al dolor.
- La pantalla de migraña aclara que intervienen mecanismos neurológicos complejos; no la reduce a vasos sanguíneos.
- La cirugía despierta se presenta como una técnica para casos seleccionados, con anestesia de las estructuras sensibles y supervisión médica.
- Los diagramas son esquemas explicativos y no mapas clínicos ni instrucciones de tratamiento.

Lecturas de referencia: [NINDS: Migraine](https://www.ninds.nih.gov/health-information/disorders/migraine) y [Mayo Clinic: Awake brain surgery](https://www.mayoclinic.org/tests-procedures/awake-brain-surgery/about/pac-20384913).

## Conservación y validación

El verificador contrasta SHA-256 de los **68 PNG** contra el inventario del piloto y comprueba que continúen registradas todas las composiciones anteriores. Comprueba las rutas, los intervalos, códecs, dimensiones, FPS, 2100 fotogramas y duración de ambas pistas. Decodifica el video completo, detecta pantallas negras, cuenta fotogramas distintos, mide LUFS/picos y comprueba inicio rápido. Cuando existe narración, verifica además guion, grupos y correspondencia de marcas temporales con la alineación acústica.

El reporte diferencia **validación técnica** de **estado de publicación**: un MP4 que reproduce música no se anuncia como un episodio con voz terminada. La prueba del navegador reproduce los 70 segundos completos en Chromium HTML5 y registra fotogramas, errores y decodificación de audio.

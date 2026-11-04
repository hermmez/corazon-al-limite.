# Revisión del episodio 04

Estado: preparación visual y código en revisión; producción final pendiente de voz y sincronización.

| Comprobación | Resultado |
|---|---|
| Composición independiente | `Episodio04SinDormir` registrada en `src/Root.tsx` |
| Metadatos de composición | 1080 × 1920, 30 FPS, 2100 fotogramas = 70.000 s |
| TypeScript | `tsc --noEmit` aprobado |
| Originales | 68/68 SHA-256 coinciden con la referencia aprobada; ninguno modificado |
| Recursos nuevos | 6 PNG individuales, nombres descriptivos y carpeta propia; sin 3D |
| Transparencia | Automóvil y taza: alpha 0–255; descanso en cama y cama vacía: 0–254; carretera y dormitorio: fondos RGB |
| Resolución de uso | Objetos y personajes nuevos dentro de su tamaño nativo. Fondos con ajuste proporcional para cubrir 1080 × 1920: carretera 1.148× y dormitorio 1.287×; límites y dimensiones en la auditoría |
| Encuadre | Ocho escenas a cuadro completo, sin tarjetas, rótulo superior de marca, leyendas inferiores ni barras de progreso |
| Fotogramas de revisión | 60, 360, 600, 940, 1150, 1450, 1750 y 1990, a 1080 × 1920 |
| Voz | Alejandro Ballesteros seleccionado por el usuario. Audición C2 pendiente: consulta de acceso/costo devuelve HTTP 401. Sin generación de pago; Piper rechazado por sonar robótico |
| Captions | Vacíos hasta obtener audio aprobado y marcas reales |
| MP4 visual de revisión | Exportado: 70.000 s, 2100 fotogramas, 1080 × 1920, 30 FPS, H.264 High, YUV420p, BT.709 y faststart. FFprobe y decodificación completa aprobados. Sin pista de audio. |
| MP4 de producción con audio | Pendiente de audición C2 con Alejandro, captions, mezcla y sincronización |

Las escenas usan dormitorio, cocina, carretera y entorno neuronal hasta los bordes del cuadro. Se separaron fondo, cama y personaje para animar las capas; la carretera ocupa todo el formato vertical. El cerebro anatómico y el detalle de sinapsis permanecen separados, sin insinuar una unión anatómica falsa. Se retiraron las moléculas genéricas y la gráfica que aparentaba una medición en tiempo real. Los originales permanecen intactos.

Los fotogramas permiten verificar encuadre y legibilidad; quedan por revisar la evolución visual en reproducción completa, gestos ligados a palabras, continuidad y transiciones creativas, ritmo comparable a la referencia a 1.25×, ausencia de tiempos muertos, mezcla, captions y sincronización semántica. Las ventanas de `timeline.json` son editoriales y no representan tiempos acústicos.

Se resolvió el fallo `write EOF`: los FFmpeg/FFprobe incluidos con Remotion terminaban con acceso inválido en este entorno. La vía alternativa captura PNG sin pérdida hacia un pipe y realiza una sola codificación H.264 con FFmpeg independiente. Se verificó el SHA-256 publicado del archivo de distribución: `60f467265b1e312373dbcd92200c2618a74850f98d3d078e94296bb3fa2047ba`. Fuente: [compilación de Gyan enlazada por FFmpeg](https://www.gyan.dev/ffmpeg/builds/). La exportación visual usa CRF 18 y no aplica una recompresión intermedia.

Video de revisión: `output/episodio-04-sueno/episodio04_REVISION_VISUAL_SIN_VOZ.mp4`; SHA-256 `7878112a411e1488ef4fb1767eae34ff9429ce078358320e2e00e92728f6f2a1`. Se comprobaron propiedades reales, ausencia de audio, 2100 marcas de tiempo a 30 FPS constantes y átomo moov anterior a mdat. La decodificación completa y `blackdetect` con `d=0.1:pix_th=0.1` terminaron sin errores ni intervalos negros detectados. No hay rótulos de revisión dentro del cuadro; el estado se indica en el nombre del archivo y en este reporte. El JSON homónimo conserva la comprobación técnica.

## Archivos de evidencia

- `output/episodio-04-sueno/auditoria-recursos-2d.json`
- `output/episodio-04-sueno/revision-tecnica-composicion.json`
- `output/episodio-04-sueno/revision-*.png`
- `output/episodio-04-sueno/audicion_C2_local_provisional.wav` y su metadato JSON
- `public/episodio-04/ilustraciones/manifest.json`

## Para cerrar la producción

Resolver el acceso a ElevenLabs para cotizar la audición de Alejandro ya elegido y obtener autorización concreta de costo antes de generar audio de pago, según `AUDICION_VOZ.md`. Aprobar la interpretación de esa audición antes de sustituir al narrador. Después preparar la narración completa, medir frases, ajustar interpretación y guion al ritmo requerido, alinear captions y eventos al audio real y completar la revisión audiovisual antes del MP4 final. El estándar 100 % 2D y la duración fija permanecen como requisitos de aceptación.

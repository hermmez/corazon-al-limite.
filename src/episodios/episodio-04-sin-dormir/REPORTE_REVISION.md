# Revisión del episodio 04

Estado: preparación visual y código en revisión; producción final pendiente de voz y sincronización.

| Comprobación | Resultado |
|---|---|
| Composición independiente | `Episodio04SinDormir` registrada en `src/Root.tsx` |
| Metadatos de composición | 1080 × 1920, 30 FPS, 2100 fotogramas = 70.000 s |
| TypeScript | `tsc --noEmit` aprobado |
| Originales | 68/68 SHA-256 coinciden con la referencia aprobada; ninguno modificado |
| Recursos nuevos | 4 PNG individuales, nombres descriptivos y carpeta propia; sin 3D |
| Transparencia | Automóvil y taza: alpha 0–255; descanso en cama: 0–254; carretera RGB de fondo |
| Resolución de uso | Ninguno de los cuatro nuevos recursos se amplía sobre su resolución nativa |
| Fotogramas de revisión | 60, 360, 600, 940, 1150, 1450, 1750 y 1990, a 1080 × 1920 |
| Voz | Audición Piper de 12.759365 s rechazada por sonar robótica; candidatas mexicanas documentadas en `VOCES_ESPANOL_MX.md` |
| Captions | Vacíos hasta obtener audio aprobado y marcas reales |
| MP4 visual de revisión | Exportado: 70.000 s, 2100 fotogramas, 1080 × 1920, 30 FPS, H.264 High, YUV420p, BT.709 y faststart. FFprobe y decodificación completa aprobados. Sin pista de audio. |
| MP4 de producción con audio | Pendiente de audición C2 con Alejandro, captions, mezcla y sincronización |

La revisión de imágenes corrigió el automóvil y taza simplificados, retiró moléculas genéricas y una gráfica que aparentaba una medición en tiempo real, separó cerebro y detalle de sinapsis y resolvió el personaje descansando con una ilustración específica de cama y almohadas. Líneas, reloj, flechas y esquemas se usan como complementos de los recursos completos.

Los fotogramas permiten verificar encuadre y legibilidad; quedan por revisar la evolución visual en reproducción completa, gestos ligados a palabras, continuidad y transiciones creativas, ritmo comparable a la referencia a 1.25×, ausencia de tiempos muertos, mezcla, captions y sincronización semántica. Las ventanas de `timeline.json` son editoriales y no representan tiempos acústicos.

Se resolvió el fallo `write EOF`: los FFmpeg/FFprobe incluidos con Remotion terminaban con acceso inválido en este entorno. La vía alternativa captura PNG sin pérdida hacia un pipe y realiza una sola codificación H.264 con FFmpeg independiente. Se verificó el SHA-256 publicado del archivo de distribución: `60f467265b1e312373dbcd92200c2618a74850f98d3d078e94296bb3fa2047ba`. Fuente: [compilación de Gyan enlazada por FFmpeg](https://www.gyan.dev/ffmpeg/builds/). La exportación visual usa CRF 18 y no aplica una recompresión intermedia.

Video de revisión: `output/episodio-04-sueno/episodio04_REVISION_VISUAL_SIN_VOZ.mp4`; SHA-256 `9d3ee433ccb516b3fafa9834f6c600f2afa0db46242365550e4823382de9ad28`. Se comprobaron propiedades reales, ausencia de audio y átomo moov anterior a mdat. El video lleva un rótulo de revisión y no sustituye la producción final con narración, captions y mezcla. El JSON homónimo conserva la comprobación técnica.

## Archivos de evidencia

- `output/episodio-04-sueno/auditoria-recursos-2d.json`
- `output/episodio-04-sueno/revision-tecnica-composicion.json`
- `output/episodio-04-sueno/revision-*.png`
- `output/episodio-04-sueno/audicion_C2_local_provisional.wav` y su metadato JSON
- `public/episodio-04/ilustraciones/manifest.json`

## Para cerrar la producción

Decidir la voz mediante la audición descrita en `AUDICION_VOZ.md`. Después preparar la narración completa, medir frases, ajustar interpretación y guion al ritmo requerido, alinear captions y eventos al audio real y completar la revisión audiovisual antes del MP4 final. El estándar 100 % 2D y la duración fija permanecen como requisitos de aceptación.

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
| Voz | Audición Piper local de 12.759365 s; identidad C2 definitiva aún pendiente de aprobación |
| Captions | Vacíos hasta obtener audio aprobado y marcas reales |
| MP4 de producción y FFprobe | Pendientes; no se afirma una exportación final ni validación de audio |

La revisión de imágenes corrigió el automóvil y taza simplificados, retiró moléculas genéricas y una gráfica que aparentaba una medición en tiempo real, separó cerebro y detalle de sinapsis y resolvió el personaje descansando con una ilustración específica de cama y almohadas. Líneas, reloj, flechas y esquemas se usan como complementos de los recursos completos.

Los fotogramas permiten verificar encuadre y legibilidad; quedan por revisar la evolución visual en reproducción completa, gestos ligados a palabras, continuidad y transiciones creativas, ritmo comparable a la referencia a 1.25×, ausencia de tiempos muertos, mezcla, captions y sincronización semántica. Las ventanas de `timeline.json` son editoriales y no representan tiempos acústicos.

El entorno agotó espacio durante copias de recursos y se preparó una carpeta pública reducida para la revisión. Un intento de MP4 visual terminó con `write EOF`; no se incluye como entrega válida. Los renders de fotogramas y el chequeo de composición sí produjeron evidencia. La exportación final debe realizarse después de preparar y aprobar la voz, con H.264 High, CRF 18, YUV420p, BT.709, faststart y AAC a 48 kHz/192 kbps, verificando el archivo real con FFprobe.

## Archivos de evidencia

- `output/episodio-04-sueno/auditoria-recursos-2d.json`
- `output/episodio-04-sueno/revision-tecnica-composicion.json`
- `output/episodio-04-sueno/revision-*.png`
- `output/episodio-04-sueno/audicion_C2_local_provisional.wav` y su metadato JSON
- `public/episodio-04/ilustraciones/manifest.json`

## Para cerrar la producción

Decidir la voz mediante la audición descrita en `AUDICION_VOZ.md`. Después preparar la narración completa, medir frases, ajustar interpretación y guion al ritmo requerido, alinear captions y eventos al audio real y completar la revisión audiovisual antes del MP4 final. El estándar 100 % 2D y la duración fija permanecen como requisitos de aceptación.

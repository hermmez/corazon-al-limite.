# Prueba2D — ¿Qué pasa en tu cuerpo cuando no duermes?

Composición nueva e independiente de `CorazonAlLimite`: 1080 × 1920,
30 FPS y 900 fotogramas (30 segundos). No utiliza fotografías, recursos de
otras carpetas, emojis, imágenes generadas ni audio externo.

## Recursos y dirección visual

Se inspeccionaron los 30 PNG RGBA numerados de
`public/imagenes/personajes/`. Las ocho poses utilizadas existen y se
cargan con `staticFile()`. Los archivos originales se conservan sin cambios.
La pose de sueño mantiene su formato horizontal 1536 × 1024; las otras
siete mantienen su proporción vertical 1024 × 1536 mediante `objectFit`.

**Diferencia entre el encargo y los archivos:** la biblioteca presente en
GitHub muestra un personaje de camiseta turquesa; no lleva sudadera azul
ni camiseta blanca. Se priorizaron los PNG aprobados y no se modificó su ropa.

Los fondos, partículas, luna, sol, ondas, anillos y medidores se dibujan
con CSS/SVG. El movimiento se calcula con `useCurrentFrame()`, `interpolate()`
y `spring()`: entrada del personaje, cambios de pose, respiración, acercamiento
al cerebro, indicadores de atención, recuperación y cambio de noche a mañana.
Los porcentajes de energía son una representación ilustrativa, no mediciones.

## Escenas

| Tiempo | Contenido | PNG |
| --- | --- | --- |
| 0–7 s | Pregunta y entrada animada | `01_neutral`, `02_explicando` |
| 7–15 s | Cansancio, bostezo y energía decreciente | `05_cansado`, `18_bostezando` |
| 15–23 s | Acercamiento al cerebro, partículas, ondas y confusión | `24_anatomia_cerebro`, `15_confundido` |
| 23–30 s | Sueño, recarga y personaje feliz | `23_durmiendo`, `13_feliz` |

Los fundidos de 12 fotogramas empiezan exactamente a los 7, 15 y 23 segundos.
Las duraciones de las secuencias incluyen las colas que se solapan:
`222 + 252 + 252 + 210 − 3 × 12 = 900`.
Las cuatro escenas también están registradas en `Prueba2D-Escenas` para
poder previsualizarlas y editarlas por separado.

## Vista previa y exportación

```bash
npm ci
npm run typecheck
npm run validate:prueba2d
npm run dev -- --no-open
```

Seleccionar `Prueba2D` en Remotion Studio, normalmente en
`http://localhost:3000/Prueba2D`.

```bash
npm run render:prueba2d
```

Salida: **`out/prueba2d.mp4`**, H.264, píxeles YUV420p, CRF 20. Si se utiliza
Chromium del sistema, se puede indicar su ruta:

```bash
npm run render:prueba2d -- --browser-executable=/usr/bin/chromium --concurrency=2
```

El comando original `npm run render` conserva su composición y su ruta anterior.
El workflow manual independiente **Renderizar Prueba2D** permite repetir la
exportación en GitHub Actions y descargar el artefacto `prueba2d-mp4`.

## Verificación

- TypeScript sin errores.
- Validación de los 30 PNG, numeración, dimensiones y formato RGBA.
- Comprobación de las ocho poses y de las rutas exclusivas de la biblioteca.
- Revisión visual de fotogramas de las cuatro escenas y cambios de pose.
- Render completo y decodificación del MP4 con FFmpeg.
- Verificación de duración, resolución, FPS y número de fotogramas con FFprobe.
- Comparación SHA-256: los 30 PNG aprobados permanecen intactos.
- `src/CorazonAlLimite.tsx` y su registro original permanecen intactos.

## Archivos entregados

- [MP4 de prueba](../out/prueba2d.mp4) — 30 segundos, 1080 × 1920, 30 FPS.
- [Storyboard de las ocho poses](../out/prueba2d-storyboard.jpg).
- [Informe de verificación y hashes](../out/prueba2d-verificacion.json).

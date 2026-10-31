# DemoProfesional2D · El miedo por dentro

Prueba independiente de 30 segundos, 1080 × 1920 y 30 FPS. Conserva
`CorazonAlLimite`, `Prueba2D`, sus registros y los videos anteriores.

## Biblioteca utilizada

Se inspeccionaron los 30 PNG de personajes y los 15 PNG de anatomía
presentes en el repositorio. Solo se cargan estos siete archivos con `staticFile()`:

| Uso | Archivo bajo `public/imagenes/` |
| --- | --- |
| Calma | `personajes/01_neutral.png` |
| Sorpresa | `personajes/11_sorprendido.png` |
| Preocupación | `personajes/12_preocupado.png` |
| Respiración | `personajes/20_respirando.png` |
| Explicación | `personajes/02_explicando.png` |
| Cerebro | `anatomia/01_cerebro_completo.png` |
| Corazón | `anatomia/03_corazon_humano.png` |

Los personajes conservan su proporción 1024 × 1536 y los órganos su proporción
1254 × 1254. Las ilustraciones originales no se modifican. La ropa real de la
biblioteca es una camiseta turquesa; se conserva, aunque el encargo describa
una sudadera azul.

No se usan fotografías, recursos antiguos, emojis ni imágenes nuevas.
No se encontraron archivos de audio en `public/`: el MP4 se entrega **sin
sonido y sin narración**. Las ondas iniciales representan visualmente un
estímulo inesperado; no se atribuye una pista de sonido a esa animación.

## Narrativa y continuidad

| Tiempo | Escena | Movimiento principal |
| --- | --- | --- |
| 0–7 s | El miedo | Entrada con spring, calma, ondas de estímulo y sobresalto con cambio de pose |
| 7–15 s | El cerebro | Acercamiento a la cabeza, revelado circular del órgano, conexiones que se dibujan y nodos activos |
| 15–23 s | El corazón | Seguimiento de una señal por una curva Bézier, llegada al órgano, latidos dobles con frecuencia creciente y gráfica animada |
| 23–30 s | La respuesta | El órgano se reduce hacia el pecho; la cámara retrocede y revela preocupación, respiración y explicación |

Los movimientos se anticipan alrededor de los límites de escena. El mundo y
la cámara permanecen montados durante los 900 fotogramas: no se emplean cortes
entre imágenes ni una sucesión de transiciones genéricas. El punto luminoso
y la cámara comparten la misma curva, por lo que la señal conduce la mirada
hacia el corazón. Las tres capas de fondo responden con distinta intensidad
al desplazamiento de cámara para producir paralaje.

Los textos aparecen mediante máscaras y desplazamiento vertical. Los gráficos,
pulsos, partículas, tensión corporal y respiración son SVG/CSS calculados por
fotograma. Todos los cambios usan `interpolate()`, easing y `spring()`;
no hay animaciones CSS dependientes del tiempo real.

El gráfico cardíaco es una representación ilustrativa de una respuesta de alerta,
no una medición clínica ni un trazado diagnóstico. El miedo se describe como
una respuesta automática de protección, sin atribuir ritmos fijos a todas las personas.

## Estructura

- `src/DemoProfesional2D.tsx`: mundo persistente, cámara, paralaje y composición.
- `src/DemoProfesional2D/motion.ts`: coordenadas compartidas, curva y pulsaciones.
- `ElMiedo.tsx`, `ElCerebro.tsx`, `ElCorazon.tsx`, `LaRespuesta.tsx`: capas y textos de cada escena.
- `Shared.tsx`: poses con proporciones conservadas y textos con máscaras.

`src/Root.tsx` registra `DemoProfesional2D` y cuatro vistas parciales en la
carpeta `DemoProfesional2D-Escenas`. Las vistas reutilizan el mismo componente
con un desplazamiento temporal para conservar el estado de cámara y del mundo.

## Reproducción

```bash
npm ci
npm run typecheck
npm run validate:demo
npm run dev -- --no-open
```

Abrir `http://localhost:3000/DemoProfesional2D`.

```bash
npm run render:demo
# Alternativa si se usa Chromium del sistema:
npm run render:demo -- --browser-executable=/usr/bin/chromium --concurrency=2
```

Salida: [`out/demo-profesional-2d.mp4`](../out/demo-profesional-2d.mp4), H.264,
30 segundos y 900 fotogramas. Se usa una ruta nueva para preservar los MP4 anteriores.

## Verificación

`npm run validate:demo` comprueba los siete PNG y sus canales alfa, el acceso
exclusivo a las carpetas oficiales, la continuidad de la cámara durante 900
fotogramas y los valores de las pulsaciones. Se complementa con TypeScript,
la enumeración de composiciones de Remotion, revisión visual de encuadres,
render completo, FFprobe y decodificación integral con FFmpeg.

El [informe de entrega](../out/demo-profesional-2d-verificacion.json) registra
los metadatos reales, hashes y comparación de los archivos preservados.

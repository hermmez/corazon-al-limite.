# PrimerVideoSueno · Primer video educativo de 90 segundos

Composición nueva de React, TypeScript y Remotion: **1080 × 1920, 30 FPS,
2700 fotogramas**. Tema: «¿Qué le pasa a tu cuerpo cuando duermes poco?».

## Entregables

- [`out/primer-video-sueno.mp4`](../out/primer-video-sueno.mp4): video completo de 1080p.
- [`out/primer-video-sueno-vista-previa.mp4`](../out/primer-video-sueno-vista-previa.mp4): los mismos 90 segundos en una versión ligera para móviles.
- [`out/primer-video-sueno-guion-es-MX.txt`](../out/primer-video-sueno-guion-es-MX.txt): texto para la futura narración, organizado por escena.
- [`out/primer-video-sueno-subtitulos.srt`](../out/primer-video-sueno-subtitulos.srt): subtítulos con tiempos estimados.
- [`out/primer-video-sueno-verificacion.json`](../out/primer-video-sueno-verificacion.json): metadatos, pruebas y hashes de preservación.

Descarga directa, sin pasar por el visor de archivos grandes de GitHub:

- [Vista previa completa](https://github.com/hermmez/corazon-al-limite./raw/refs/heads/primer-video-sueno/out/primer-video-sueno-vista-previa.mp4).
- [MP4 original de 1080p](https://github.com/hermmez/corazon-al-limite./raw/refs/heads/primer-video-sueno/out/primer-video-sueno.mp4).

## Guion y recursos

Se inspeccionaron las **68 ilustraciones aprobadas**: 30 personajes, 20 órganos,
15 recursos científicos y 3 escenarios. El video selecciona 25 imágenes pertinentes
mediante `staticFile()`. Conservan sus archivos y proporciones originales. No usa
fotografías, recursos hiperrealistas, imágenes generadas, emojis ni recursos de las
carpetas antiguas de referencias y pruebas. No se modifica ni se reexporta ningún PNG.

| Escena | Tiempo | Contenido y animación |
| --- | --- | --- |
| Gancho | 0–10 s | Dormitorio, cansancio, bostezo y acercamiento con llamada visual al cerebro |
| Cerebro | 10–22 s | Cerebro, neurona y sinapsis se enlazan con movimientos, conexiones y partículas |
| Atención | 22–34 s | Personaje distraído, cambios de pose y un objetivo móvil que cuesta seguir |
| Ánimo | 34–46 s | Preocupación, tristeza, negación y respiración; indicadores de tensión |
| Apetito | 46–58 s | Cocina, receptores hormonales, personaje comiendo y señales que viajan hacia él |
| Salud | 58–70 s | Pulsaciones, vasos, glóbulo rojo en movimiento y molécula de glucosa; se contextualiza la frecuencia |
| Descanso | 70–82 s | Dormitorio, respiración del personaje dormido, reloj y referencia de 7–9 horas para adultos |
| Cierre | 82–90 s | Personaje explicando y aprobando, marca y llamada a seguir Corazón al Límite |

El guion hablado completo y sus tiempos están en
[`src/PrimerVideoSueno/script.json`](../src/PrimerVideoSueno/script.json).
Las páginas de subtítulos muestran hasta cinco palabras. Se usan capas que se mueven
con distintas intensidades, respiración, rotación y escala contenidas, pulsaciones,
señales SVG y una cámara que sigue la conexión entre escenas. Las transiciones
anticipan la escena siguiente y no utilizan pantallas negras.

Las poses son ilustraciones completas, no marionetas con articulaciones separadas.
Los cambios de expresión usan poses aprobadas y conservan una fase común de movimiento,
sin superponer cuerpos semitransparentes.

## Narración pendiente: español mexicano

**No se ha generado ni incorporado narración ni sonido.** Cada escena contiene:

```json
{
  "narration": {
    "text": "Texto completo de la escena",
    "locale": "es-MX",
    "src": null,
    "status": "pending"
  },
  "captionTiming": "estimated_from_script_not_audio"
}
```

Los subtítulos usan el tipo `Caption` de `@remotion/captions`, con `timestampMs`
y `confidence` nulos. Sus tiempos son una propuesta de lectura del guion, no una
transcripción ni una sincronización con una voz inexistente. El video funciona sin audio.
El cierre contiene más palabras por segundo que las escenas centrales; al grabarlo
se debe respetar ese ritmo o editar los tiempos del guion.

Para incorporar voz posteriormente:

1. Colocar una grabación real en `public/audio/`.
2. Asignar la ruta relativa, por ejemplo `audio/sueno-01.wav`, a `narration.src`
   y actualizar su estado. Ese ejemplo no es un archivo existente.
3. Si se reutiliza una grabación larga, indicar `narration.offsetSeconds` con el
   punto de entrada de esa escena. El componente convierte segundos a fotogramas.
4. Ajustar `captions[].startMs` y `endMs` con la grabación real o reemplazarlos con
   una transcripción verificada. Son tiempos locales a cada escena.
5. Ejecutar las validaciones y volver a renderizar. Voz y subtítulos están dentro
   de la misma secuencia temporal de la escena.

## Arquitectura reutilizable

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `src/PrimerVideoSueno.tsx` | Montaje de las ocho escenas, cámara compartida y grupo temporal de voz/subtítulos |
| `src/PrimerVideoSueno/script.json` | Texto, imágenes asignadas, tiempos, idioma y subtítulos de cada escena |
| `src/PrimerVideoSueno/scenes/` | Ocho escenas independientes con los procesos visuales de cada tema |
| `src/video-2d/assets.ts` | Catálogo tipado de las imágenes utilizadas y sus proporciones |
| `src/video-2d/Visuals.tsx` | Personaje, ilustración científica, escenario, cámara, fondo, títulos y rótulos |
| `src/video-2d/motion.ts` | Aceleración suave, anclas, recorrido de cámara, transiciones y pulsaciones |
| `src/video-2d/Effects.tsx` | Partículas, conexiones neuronales, ondas y reloj SVG |
| `src/video-2d/Subtitles.tsx` | Presentación animada de subtítulos y pista opcional de voz real |
| `src/video-2d/basic-captions.tsx` | Componente Basic Captions oficial de Remotion, incorporado sin modificar |
| `src/video-2d/script.ts` | Validación del guion al cargar la composición |
| `scripts/temporizar-sueno.mjs` | Estimación editable de subtítulos cuando todavía no hay grabación |
| `scripts/exportar-guion-sueno.mjs` | Exportación del guion humano y del SRT |
| `scripts/validar-primer-video-sueno.mjs` | Rutas, imágenes, proporciones, textos, tiempos, cámara y seguimiento |

Para otro episodio de ocho escenas se cambian principalmente el texto, los tiempos y
las claves de imágenes, los rótulos `callouts` y el título corto del JSON. Los pasos visuales se escalan proporcionalmente con la duración de su escena. Si cambia el texto sin haber voz, `npm run captions:sueno`
regenera las estimaciones. Las escenas que ya tienen audio asignado conservan sus tiempos.
`npm run script:sueno` exporta de nuevo el guion y el SRT. Si cambia la duración total,
se actualiza también `durationInFrames` en el registro de Remotion y las vistas parciales.
Para otro tipo de proceso científico se puede sustituir una escena sin cambiar los
componentes de cámara, personaje, subtítulos o efectos.

## Reproducción, pruebas y exportación

```bash
npm ci
npm run typecheck
npm run validate:sueno
node scripts/temporizar-sueno.mjs --check
npm run script:sueno
npm run dev -- --no-open
```

Seleccionar `PrimerVideoSueno` o abrir `http://localhost:3000/PrimerVideoSueno`.
La carpeta `PrimerVideoSueno-Escenas` permite inspeccionar cada intervalo por separado.

```bash
npm run render:sueno
# Con Chromium del sistema en este entorno:
npm run render:sueno -- --browser-executable=/usr/bin/chromium --concurrency=2
```

La validación comprueba los ocho intervalos solicitados, el texto íntegro del guion,
las páginas de subtítulos, las rutas oficiales y proporciones de las imágenes,
y 2700 estados de cámara sin saltos ni valores inválidos. La revisión de entrega
incluye render completo, fotogramas de las ocho escenas y transiciones,
FFprobe, decodificación integral con FFmpeg y comparación de los archivos protegidos.

La composición y los videos anteriores se conservan. El pull request se entrega
para revisión y **no se fusiona automáticamente**.

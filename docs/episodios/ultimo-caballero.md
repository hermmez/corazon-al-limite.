# El último caballero · capítulo 1

Historia de fantasía familiar de 70 segundos, 1080×1920, 30 FPS, 2100 fotogramas. El combate queda sin resolver. Las relaciones entre likes/comentarios/compartidos y refuerzos son una dinámica ficticia. No se han inventado interacciones reales.

## Voz y montaje

Una única generación autorizada de Grady, Eleven v4, 4,14 créditos. Job `eec2082e-f02a-4451-becf-b6cbe5868cba`. El MP3 original está intacto; se usan ocho cortes WAV a velocidad 1.0, con pausas expresivas para completar el montaje de 70 segundos. `sincronizacion.json` conserva tiempos originales, cortes, inicios y palabras. La transcripción local recupera todo el texto; la pronunciación y la interpretación no se certifican con una medida numérica.

## Recursos y continuidad

Ocho nuevas ilustraciones generadas con la herramienta integrada y las referencias aprobadas reales de personaje/escenario. Los PNG originales de `public/imagenes` se conservan. Personajes nativos RGBA con transparencia real; el lienzo del escenario es RGB.

`rigs.tsx` divide las ilustraciones nuevas mediante máscaras SVG en cabeza, brazos, patas, cola y equipo. Cada parte tiene pivote y rotación contenida. No se infiere un esqueleto humano universal ni se presenta el desplazamiento de un PNG entero como una caminata. Revisar juntas y contornos para cualquier gesto nuevo o giro más extremo.

`army.tsx` representa exactamente 100 filas × 100 columnas lógicas de hienas. Usa ocho fases de marcha articulada prerasterizadas y recorta por cámara a los soldados fuera de encuadre. Los primeros planos usan animación continua por articulaciones. No existen 10.000 archivos PNG distintos.

`personajes-serie.json` identifica recursos, hashes y reglas de continuidad. Futuras entregas pueden recibir cifras reales de interacción suministradas por el usuario, sin inferirlas de esta representación. La mamá y dos bebés permanecen protegidos; no hay sangre, heridas ni combate mostrado.

## Animación y control

`plan-70-segundos.json` contiene los 70 registros preparados antes de animar. Máscaras, acciones encadenadas, encuadres motivados, transformación de símbolos en llegadas y cues de voz dirigen la secuencia. La música y el ambiente son síntesis local original, sin muestras de terceros ni servicios externos de pago.

```bash
npm ci --ignore-scripts
npx tsc --noEmit
node scripts/revisar_ultimo_caballero.mjs
ALL_SECONDS=1 node scripts/revisar_ultimo_caballero.mjs
node scripts/renderizar_ultimo_caballero.mjs preview
node scripts/renderizar_ultimo_caballero.mjs final
```

`EPISODE_OUTPUT_DIR`, `EPISODE_BUNDLE` y `REMOTION_BROWSER` permiten configurar rutas sin editar el código. `SKIP_BUNDLE=1` solo debe usarse cuando el bundle corresponde al código y recursos actuales. Concurrencia de render: 2. No instalar otra copia de Chrome si ya se dispone de Chromium local.

Normalizar duración del contenedor con FFmpeg conservando el video: `-c:v copy -af 'atrim=duration=70,apad=whole_dur=70,asetpts=N/SR/TB' -c:a aac -b:a 192k -ar 48000 -t 70 -movflags +faststart`.

```bash
python scripts/validar_ultimo_caballero.py out/ultimo-caballero/episodio.mp4
```

El diagnóstico de píxeles excluye subtítulos y detecta baja actividad en ventanas de un segundo. No certifica relevancia semántica, anatomía ni retención. Revisar junto a la tabla, primeros 90 frames y vistas previas; evitar renders completos repetidos.

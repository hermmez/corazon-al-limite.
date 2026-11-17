# Corazón al Límite — The Economist 2027

Episodio independiente, 1080 × 1920, 30 fps, 2100 fotogramas y 70 segundos. Se conservan sin cambios `src/Root.tsx`, `src/CorazonAlLimite.tsx`, `src/index.ts`, `package.json`, las ilustraciones y todos los episodios previos.

## Previsualizar y exportar

```sh
npm ci
npx remotion studio src/economist2027/index.tsx --no-open
npx remotion render src/economist2027/index.tsx Economist2027 out/economist-2027/render-remotion.mp4 --codec=h264 --audio-codec=aac --crf=18 --pixel-format=yuv420p
ffmpeg -i out/economist-2027/render-remotion.mp4 -map 0:v:0 -map 0:a:0 -c:v copy -af 'atrim=duration=70,asetpts=PTS-STARTPTS' -c:a aac -b:a 192k -ar 48000 -t 70 -movflags +faststart out/economist-2027/corazon-al-limite-economist-2027.mp4
```

Esta entrada también registra la composición anterior, sin modificarla, y las siete escenas nuevas para inspección individual. Para Chromium preinstalado se puede añadir `--browser-executable=/usr/bin/chromium`. Ajustar `--concurrency` a los núcleos disponibles.

## Audio autorizado

- Cotización de Higgsfield: **4,37 créditos exactos**, una variación, Eleven v4 `elevenlabs_v4`.
- Voz: Grady, preset, `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`.
- Autorización expresa recibida antes de generar audio o recursos visuales.
- Un solo trabajo: `1b77ccba-6297-4a50-b990-77c0e2b4b719`, completado.
- Original: `narracion-original.mp3`, 63,555875 s según FFprobe. No se solicitó otra generación pagada.
- `audio-edit.json` conserva todos los intervalos originales, las pausas añadidas y tres cortes de 0,2 s dentro de silencios del cierre. Velocidad de reproducción **1×** en todos los clips. Ninguna palabra se elimina ni se acelera.
- Transcripción local mediante faster-whisper small, español, tiempos por palabra. Se cotejaron sus 145 palabras con el guion autorizado. El texto de los JSON de subtítulos conserva la puntuación del guion.
- La transcripción comprueba contenido y temporización; no certifica el acento ni sustituye la escucha humana de Grady. El catálogo de Higgsfield no publica una certificación de acento latinoamericano para este preset.

## Estilo y recursos

Referencias inspeccionadas: personaje neutral, cerebro completo y sala de la biblioteca aprobada. Estética documentada del repositorio: contornos oscuros, sombreado 2D, coral/melocotón, turquesa, crema y azul marino.

Se reutiliza `public/imagenes/anatomia/01_cerebro_completo.png` sin alterarlo. No se usan los cerebros del pack de prueba como supuestas capas anatómicas registradas.

Los recursos ausentes son SVG nativo propio en `Art.tsx`, `Maps.tsx` y las escenas: tanque con orugas/ruedas/suspensión/torreta, robot con articulaciones y pinzas, cámara con eje y lente, árboles con ramas, llamas de contorno variable, frasco/tapa/pastillas, cohete/aletas/propulsión, monedas, Capitolio y figuras genéricas. No son recortes de la revista. No se emplearon generadores de video, fotografías como personajes, Three.js, Blender ni recursos 3D.

`plan-70-segundos.json` contiene los 70 registros con frase real, acción, objetos, cámara, transición y estado de revisión. La duración de las escenas se mantiene en los intervalos solicitados; las revelaciones internas siguen el audio real, no una lectura teórica por segundo.

Música y efectos: síntesis procedural original creada para el episodio; sin composición comercial, samples externos ni cargos adicionales. Uso autorizado sin restricciones de estos archivos originales dentro del proyecto. La música permanece por debajo de la narración.

## Procedencia y límites editoriales

1. Fuente primaria: [comunicado oficial de The Economist Group](https://www.economistgroup.com/press-centre/the-economist/the-economist-launches-the-world-ahead-2027-heralding-the-post-trump-era-amid-upheaval-from-bond-markets-and-ai), consultado el 17-11-2026. Respalda los temas de sucesión de Trump, populismo europeo, riesgos y rechazo de IA, repercusiones de Irán, Taiwán, clima, deuda, medicamentos para adelgazar y lanzamientos espaciales.
2. [Ilustración oficial enlazada por el comunicado](https://images.ctfassets.net/2h5kbjx7tvqe/1TpWj3uLsyWAiiYbDIDiY/ed43f5d4adbfd67048f894f3b9267113/The_World_Ahead_cover_2027.jpg), conservada como `portada-oficial.jpg` sin modificación.
3. [Reproducción completa](https://nbg1.your-objectstorage.com/prod-bb/truth-social/reader-politika-economist-2027-vaks-1711-2026-1.jpg), localizada en el [artículo de S Ziņas](https://szinas.com/en/politika/the-economist-world-ahead-2027-cover-what-it-says-about-next-year/). Cotejada visualmente con la imagen aportada y con la ilustración oficial. `portada-completa.jpg` conserva su diseño; solo cambia el encuadre durante el video. Se documenta que sus bytes proceden de una reproducción secundaria, no directamente del editor.
4. Se intentó consultar [el artículo introductorio oficial de Tom Standage](https://www.economist.com/the-world-ahead/2026/11/17/tom-standages-ten-trends-to-watch-in-2027), pero la herramienta no pudo acceder a él. No se atribuyen detalles que dependan de su lectura. La verificación temática utiliza el comunicado primario, que enumera los diez temas.
5. Cartografía: [Natural Earth 1:110m, países](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson), datos de dominio público, convertidos a trazados SVG equirectangulares en `mapPaths.ts`. Irán se centra en 53,7°E / 32,4°N; Taiwán en 121°E / 23,7°N. La proyección y las etiquetas conservan la posición relativa a China, Japón y Filipinas. La esfera terrestre es una representación artística, no un mapa de navegación.

La relación símbolo-tema es una lectura visual de este episodio, no un descifrado oficial exhaustivo. Los objetos visibles (misiles, fuego, cerebro, figuras, tanques, gráfico, monedas, pastillas y cohete) se separan de los temas documentados. Las escenas nuevas se identifican como recreaciones 2D. El Capitolio es un recurso narrativo estadounidense solicitado por el guion, no una identificación factual del edificio clásico de la portada. Las figuras políticas son genéricas; no se asignan nombres a siluetas ambiguas.

No se afirma que Trump deje la presidencia en 2027, que haya una invasión inevitable de Taiwán, que el año necesariamente bata un récord climático ni que existan mensajes secretos. No hay porcentajes, precios ni cotizaciones inventados.

## Verificación reproducible

```sh
npx tsc --noEmit
python scripts/verificar_economist_2027.py
```

El verificador comprueba el archivo exportado, 70 s / 2100 fotogramas / 30 fps, H.264/AAC, el plan de 70 registros, los 145 subtítulos, los SHA256 de los recursos y la conservación de los archivos previos. La inspección del estilo, la pertinencia editorial del movimiento y el acento de la voz requieren revisión humana; una diferencia numérica entre fotogramas no certifica por sí sola estos aspectos.

La salida de Remotion contenía 2100 fotogramas / 70 s de imagen, pero su pista AAC extendía el contenedor a 70,016 s. El paso FFmpeg conserva el video H.264 sin recodificar y ajusta únicamente el extremo del audio AAC para que imagen, audio y contenedor duren 70,000 s. No cambia la velocidad ni corta palabras. El H.264 es 8 bits / 4:2:0 con rango completo (`yuvj420p`), una variante válida del muestreo 4:2:0; el verificador acepta también el rango limitado `yuv420p`.

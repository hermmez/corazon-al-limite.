# Episodio 02 · ¿Por qué el tiempo pasa más rápido cuando creces?

Composición independiente **`Episodio02Tiempo`**, de **70.000 s / 2100 fotogramas / 30 FPS / 1080 × 1920**. Entrega prevista: MP4 H.264 con audio AAC estéreo. El episodio anterior y sus recursos permanecen en sus carpetas originales.

La referencia de ritmo es el episodio 01 aprobado reproducido a **1.25×**. Este episodio se monta para reproducirse a **1.0×**: narración, acciones, cámara, transiciones, subtítulos, música y efectos tienen sus propios tiempos. No se acelera globalmente el archivo MP4 de entrega. La rama de revisión es `episodio-02-tiempo`, apilada sobre el trabajo del PR #8; no fusionar automáticamente.

## Narración y tiempos reales

El texto contiene **189 palabras**: mantiene la estructura del guion base, añade 21 palabras de matiz científico y ajusta el gancho con dos palabras adicionales para mayor claridad. Voz en off masculina mexicana **Aldo/Piper, es_MX-ald-medium**. La boca de los PNG no se anima para simular habla. La toma completa ya existe y no proviene de una locución provisional reutilizada. **Cero generaciones de pago y cero créditos externos.**

Los intervalos editoriales del encargo son objetivos. `timeline.json` contiene los intervalos resultantes de la voz real editada; sus límites no se obtienen al dividir uniformemente 70 segundos. `production.json` y `chapters.json` conservan también las referencias nominales para edición.

| Escena | Intervalo visual real | Voz de la escena |
| --- | --- | --- |
| 01 · Vacaciones y diciembre | 0.000–7.078 s | 0.095–6.771 s |
| 02 · 24 horas; vivir y recordar | 7.078–16.242 s | 7.113–15.928 s |
| 03 · Descubrimientos | 16.242–25.541 s | 16.277–25.483 s |
| 04 · Rutina y detalles distintivos | 25.541–36.559 s | 25.576–36.252 s |
| 05 · La semana al recordarla | 36.559–45.400 s | 36.594–45.159 s |
| 06 · Dos perspectivas | 45.400–54.795 s | 45.435–54.700 s |
| 07 · Salir del automático | 54.795–63.224 s | 54.830–62.942 s |
| 08 · Reloj, recuerdos y pregunta | 63.224–70.000 s | 63.259–69.680 s |

El último término de la toma termina en **69.680 s**. El master de audio ocupa 70 s. Estos datos describen la pista preparada; la validación del MP4 requiere ejecutar las comprobaciones sobre el render real y consultar los informes con su SHA-256.

## Arquitectura editable

| Archivo | Función |
| --- | --- |
| `production.json`, `GUION.md` | Guion, especificaciones, referencia de ritmo y procedencia de voz |
| `chapters.json` | Ocho capítulos, objetivos editoriales, conceptos, palabras de activación y acciones |
| `labels.json` | Textos breves que acompañan los conceptos |
| `timeline.json` | Límites reales y 48 eventos semánticos ligados a palabras |
| `captions.json`, `Captions.tsx` | Marcas reales y 46 grupos de 3–5 palabras, con énfasis blanco/amarillo/coral |
| `motion.ts` | `interpolate`, `spring`, easing y acceso a marcas mediante `cueTime` y `spokenTime` |
| `VisualPrimitives.tsx` | Personaje oficial, anatomía, reloj, calendario y pequeños escenarios SVG |
| `World.tsx` | Ocho demostraciones visuales, gestos, recorridos, comparaciones y continuidad espacial |
| `index.tsx` | Cámara, máscaras entre escenas, parallax, títulos, tarjetas, tipografía y master de audio |
| `recursos.json`, `RECURSOS.md` | Lista de PNG realmente utilizados, dimensiones, tamaños y SHA-256 |
| `CIENCIA.md`, `PROMPT_3D.md` | Fuentes, límites de las explicaciones y apertura 3D opcional |
| `../../../scripts/episodio-02-tiempo/` | Síntesis, preparación de voz, mezcla, render, análisis y reproducción |

Los cambios de escala, posición y máscara se calculan por fotograma. El personaje utiliza poses aprobadas y movimientos secundarios discretos; las acciones principales son descubrimientos, desplazamientos, construcción de calendarios y transformación de recuerdos. Se reutilizan Manrope local, la paleta y componentes visuales del piloto. Las imágenes se cargan mediante `staticFile()` y conservan su proporción con `objectFit: contain`.

## Render y comprobaciones

Requisitos: Node/npm, dependencias del repositorio, FFmpeg/FFprobe, Chromium y Python con NumPy para análisis. El render usa `/usr/bin/chromium` si existe y, en otros equipos, el navegador configurado de Remotion. Ejecutar desde la raíz del repositorio:

```bash
npm ci
npm run typecheck
npm run render:episodio02
npm run validate:episodio02
python scripts/episodio-02-tiempo/verificar_voz.py
npm run retention:episodio02
python scripts/episodio-02-tiempo/comparar_ab.py
# Ejecutar la reproducción sin encoders ni análisis intensivos en paralelo.
npm run playback:episodio02
python scripts/episodio-02-tiempo/generar_reporte_calidad.py
```

El render exige `audioReady=true` y un master real de 70.000 s. Finaliza el MP4 de manera atómica después de completar la codificación. No basta con que un archivo exista: deben coincidir sus hashes en las comprobaciones de metadatos, voz, retención y reproducción.

Resultados en [output/episodio-02-tiempo](../../../output/episodio-02-tiempo/):

- `episodio_02_tiempo_70s.mp4` y `miniatura_vertical.jpg`.
- `subtitulos.srt`, junto a las marcas JSON de la composición.
- [REPORTE_CALIDAD.md](../../../output/episodio-02-tiempo/REPORTE_CALIDAD.md) y `calidad.json`.
- [REPORTE_RETENCION.md](../../../output/episodio-02-tiempo/REPORTE_RETENCION.md) y `retencion.json`, con 70 filas de revisión editorial.
- `validacion_tecnica.json`, `sincronia_voz_aac.json`, `reproduccion_navegador.json`.
- `comparacion_ritmo_AB.mp4`: A es el episodio 01 a 1.25×; B es el episodio 02 a 1.0×. Los temas son distintos, por lo que compara ritmo y energía, no hechos emparejados.

Los informes se generan al ejecutar los comandos; este README no sustituye sus resultados. Los indicadores automáticos tampoco prueban por sí solos naturalidad de voz o calidad subjetiva. El análisis excluye títulos, subtítulos y tarjetas al medir la ilustración principal y conserva los intervalos detectados aunque una revisión editorial los justifique.

Para reproducir la entrega localmente:

```bash
python -m http.server 8080 --directory output/episodio-02-tiempo
```

Abrir `http://localhost:8080/reproducir.html`. Servir por HTTP evita depender del visor binario de GitHub o de abrir archivos HTML mediante `file://`.

## Regenerar voz sin consumir créditos

La narración y mezcla se entregan en [public/episodios/episodio-02-tiempo/audio](../../../public/episodios/episodio-02-tiempo/audio/); no es necesario regenerarlas para renderizar. Para otro guion, usar Python 3.12 y las dependencias fijadas:

```bash
python3 -m venv /tmp/corazon-episodio02-venv
source /tmp/corazon-episodio02-venv/bin/activate
python -m pip install -r scripts/episodio-02-tiempo/requirements.txt
python scripts/episodio-02-tiempo/generar_voz_local.py
python scripts/episodio-02-tiempo/preparar_voz.py \
  --source public/episodios/episodio-02-tiempo/audio/narracion_original.flac
```

Mantener el texto de `production.json` y `chapters.json` coherente antes de generar; actualizar el guion y las palabras de activación. Después volver a preparar voz, marcas, mezcla, render e informes. No reutilizar la medición nativa de un texto anterior para calibrar un guion cambiado.

El modelo se descarga fuera de Git en `/tmp/corazon-piper/`. La ficha del proveedor declara el conjunto mexicano Unlicense y la base Davefx CC0; las fichas se conservan en el directorio de audio. Piper es software GPL-3.0, instalado como dependencia externa; no se redistribuyen pesos ni ejecutables en el repositorio. Detalles y hashes en `voz_local_produccion.json` y [ORIGEN.md](../../../public/episodios/episodio-02-tiempo/audio/ORIGEN.md).

**Marcas de audio reales:** el modelo VITS expone las duraciones de los fonemas sintetizados. Se comprueba en cada oración que la suma multiplicada por el salto de 256 muestras coincide exactamente con las muestras de audio emitidas. Las palabras se vinculan a esos intervalos; no se calculan tiempos por longitud del texto. Después se mapean el tempo efectivo y los empalmes de silencio registrados. La tolerancia de mapeo es 35 ms, más la cuantización visual a fotogramas. La transcripción independiente es una auditoría de contenido y no reemplaza esas marcas.

La síntesis se calibra frente al episodio aprobado; `atempo=1.25` se aplica solamente a la voz y conserva el tono. Se editan pausas identificadas en la forma de onda, sin cortar fonemas. Si el guion no permite llenar 70 s respetando los límites de pausas, la preparación falla y exige revisar el contenido. Música a 105 BPM y efectos se sintetizan con código original, sin stock ni muestras comerciales, y se mezclan por debajo de la voz.

## Ciencia y apertura 3D

La edad no se presenta como una causa única ni universal. Se separan **reloj**, **mientras ocurre** y **al recordarlo**. La novedad puede cambiar una duración recordada sin hacer que la experiencia siempre se sienta lenta. La rutina no se representa como deterioro general de memoria. Fuentes y criterios por escena en [CIENCIA.md](CIENCIA.md).

No se encontró un clip de reloj 3D aprobado compatible. Los primeros tres segundos utilizan un reloj vectorial animado con profundidad simulada como marcador reemplazable: **no es un clip hiperrealista generado**. El resto es animación 2D con los recursos aprobados. [PROMPT_3D.md](PROMPT_3D.md) prepara una posible sustitución futura sin cambiar el total de 2100 fotogramas; no se ha solicitado ni pagado esa generación.

Estándar para episodios futuros: [AGENTS.md](../../../AGENTS.md). Conservar PNG, composiciones anteriores y videos aprobados; trabajar en rama y PR sin fusión automática.

## Ajustes de claridad de locución

«Ahora parpadeas» se expresa como «Ahora cierras los ojos»: conserva el gancho y evita una pronunciación que dos decodificadores confundían. Se añade un punto tras «más lenta» y una coma tras «Mientras la vives» para separar la experiencia de la atención. Los experimentos locales están en `pruebas_claridad_*.json`; la auditoría de la toma realmente usada lleva hashes propios y conserva errores ASR crudos. No se aceleró el MP4 ni se cortaron palabras.

# Episodio 02 · una historia cotidiana

**«¿Por qué el tiempo pasa más rápido cuando creces?»** Composición independiente `Episodio02Tiempo`: **70.000 s / 2100 fotogramas / 30 FPS / 1080 × 1920**, entrega MP4 H.264/AAC.

## Dirección elegida: el personaje es el protagonista

La reinvención responde a la elección del usuario: **«Una historia cotidiana con el personaje como protagonista»**. Seguimos su mañana, trayecto, recuerdo escolar, rutina de trabajo, regreso a casa, espera, elección de otra ruta y cierre al final del día. Habitación, calle, oficina, escuela, parque y sala ocupan la pantalla. Calendario, reloj, libreta, lápiz y botella son objetos de su día que conectan acciones; no una sucesión de tarjetas que sustituyen al personaje.

El protagonista usa las ilustraciones oficiales a unos 500–525 px de ancho, con pies cerca de y=1400 y movimientos vinculados a lo que ocurre: caminar, correr al trayecto, saludar, mirar el reloj, aprender y elegir un camino. La boca no se anima para fingir habla. Los fondos tienen capas y paralaje, con cambios de luz y transiciones de puerta, trayecto, recuerdo o foco.

Se retiraron la tarjeta inferior fija y los titulares grandes persistentes de la primera propuesta. Los encabezados de capítulo permanecen brevemente (1.55 s más su salida); el gancho inicial dura aproximadamente tres segundos y la pregunta final vuelve a tomar protagonismo. La marca y los subtítulos conservan su área segura y contraste.

La primera propuesta no se sobrescribe como si fuera esta reinvención: se conserva en [version-01](../../../output/episodio-02-tiempo/version-01/), con fuente visual en el commit `341a8f4`. Su MP4 archivado tiene etiquetas de color corregidas; la documentación de esa carpeta distingue el remux de una validación del nuevo render. El episodio 01 y sus recursos siguen en sus carpetas originales.

## Narración conservada y ritmo

El texto tiene **189 palabras**, 46 grupos de subtítulos y 48 eventos semánticos. Conserva la estructura del guion base, añade 21 palabras de matiz científico y ajusta «parpadeas» a **«cierras los ojos»** para claridad de voz. La pausa después de **«más lenta.»** separa la percepción retrospectiva del inicio de **«Mientras la vives…»**. Estos ajustes pertenecen a la narración ya preparada y se mantienen en la reinvención visual.

Voz masculina mexicana en off **Aldo/Piper, es_MX-ald-medium**, generada localmente: **cero generaciones de pago y cero créditos externos**. La pista `narracion.flac` es idéntica antes y después de cambiar la dirección visual: SHA-256 `4b33aed83501cabf254ebd831dfd35700f7d290d8b86c10d84a94588d3635c1c`. La mezcla añade tres pares breves de pasos originales ligados a los desplazamientos, sin alterar el texto, los tiempos ni las marcas de voz; evidencia en `output/episodio-02-tiempo/remezcla_historia.json`.

La referencia de energía es el episodio 01 aprobado a **1.25×**; este episodio está montado para reproducirse a **1.0×**. Voz, acciones, cámara, transiciones, subtítulos, música y efectos tienen tiempos propios. No se acelera globalmente el MP4 de producción. La música original trabaja a 105 BPM y evoluciona por escena; el tic-tac inicial es breve y los pasos acompañan acciones concretas.

Los tiempos del encargo son objetivos editoriales. `timeline.json` recoge los límites derivados de la voz real editada; no divide uniformemente los 70 segundos. Las referencias nominales se conservan en `production.json` y `chapters.json`.

| Escena | Intervalo visual real | Voz |
| --- | --- | --- |
| 01 · La mañana y diciembre | 0.000–7.078 s | 0.095–6.771 s |
| 02 · El trayecto: vivir y recordar | 7.078–16.242 s | 7.113–15.928 s |
| 03 · El recuerdo escolar | 16.242–25.541 s | 16.277–25.483 s |
| 04 · Trabajo, casa y repetición | 25.541–36.559 s | 25.576–36.252 s |
| 05 · Una semana vivida | 36.559–45.400 s | 36.594–45.159 s |
| 06 · Esperar y recordar el viaje | 45.400–54.795 s | 45.435–54.700 s |
| 07 · Elegir otra ruta | 54.795–63.224 s | 54.830–62.942 s |
| 08 · Al terminar el día | 63.224–70.000 s | 63.259–69.680 s |

La última palabra termina en **69.680 s** y el master ocupa 70 s. Estos son datos de la pista preparada; la validación del nuevo MP4 debe ejecutarse sobre ese archivo y comprobar su SHA-256. La existencia de informes de una versión anterior no valida la reinvención.

## Arquitectura editable

| Archivo | Responsabilidad |
| --- | --- |
| `production.json`, `GUION.md` | Texto, especificaciones, procedencia de voz y dirección creativa |
| `chapters.json` | Conceptos y palabras de activación por capítulo; referencias editoriales nominales |
| `timeline.json` | Límites reales y eventos sincronizados |
| `captions.json`, `Captions.tsx` | Marcas reales y subtítulos de 3–5 palabras con énfasis blanco/amarillo/coral |
| `motion.ts` | `interpolate`, `spring`, easing, `cueTime` y `spokenTime` |
| `StoryPrimitives.tsx` | Actor oficial anclado al suelo, escenarios a pantalla completa y objetos físicos compartidos |
| `StoryScenesA.tsx` | Mañana, trayecto, recuerdo escolar y rutina: escenas 01–04 |
| `StoryScenesB.tsx` | Semana vivida, espera/viaje, ruta nueva y cierre: escenas 05–08 |
| `World.tsx` | Despacha las ocho escenas dentro del mismo sistema espacial |
| `VisualPrimitives.tsx` | Recursos reutilizados: `Art`, reloj, calendario y mapa base de poses; sus antiguos paneles no componen la historia actual |
| `index.tsx` | Montaje, encabezados breves, marca, subtítulos, gradientes de legibilidad y master de audio |
| `labels.json` | Referencias editoriales conservadas; ya no alimentan una tarjeta fija en pantalla |
| `recursos.json`, `RECURSOS.md` | PNG usados realmente, con hashes, dimensiones y tamaños |
| `CIENCIA.md`, `PROMPT_3D.md` | Fuentes, límites científicos y recurso 3D opcional |
| `../../../scripts/episodio-02-tiempo/` | Síntesis, audio, render y comprobaciones |

Las animaciones se calculan por fotograma. Los PNG se cargan mediante `staticFile()`; el actor y la anatomía conservan proporción con `contain`, y los fondos se reencuadran con `cover` cuando corresponde, sin estirar ni modificar los originales. Se reutilizan la tipografía Manrope local y la paleta aprobada.

## Render y comprobaciones

Requisitos: Node/npm, dependencias del repositorio, FFmpeg/FFprobe, Chromium y Python con NumPy para análisis. El render usa `/usr/bin/chromium` si existe; en otros equipos se utiliza el navegador configurado de Remotion. Ejecutar desde la raíz:

```bash
npm ci
npm run typecheck
npm run render:episodio02
npm run validate:episodio02
python scripts/episodio-02-tiempo/verificar_voz.py
npm run retention:episodio02
python scripts/episodio-02-tiempo/comparar_ab.py
# Reproducir sin encoders o análisis intensivos en paralelo.
npm run playback:episodio02
python scripts/episodio-02-tiempo/generar_reporte_calidad.py
```

El render requiere `audioReady=true` y un master real de 70.000 s. Codifica H.264/AAC, YUV420p y BT.709, descarta el perfil ICC heredado y comprueba las etiquetas de color antes de publicar el MP4 mediante un cambio de nombre atómico. Todos los informes deben corresponder al hash de la misma entrega, no al MP4 archivado en `version-01`.

Resultados en [output/episodio-02-tiempo](../../../output/episodio-02-tiempo/):

- `episodio_02_tiempo_70s.mp4`, `miniatura_vertical.jpg` y `subtitulos.srt`.
- [REPORTE_CALIDAD.md](../../../output/episodio-02-tiempo/REPORTE_CALIDAD.md), `calidad.json` y `validacion_tecnica.json`.
- [REPORTE_RETENCION.md](../../../output/episodio-02-tiempo/REPORTE_RETENCION.md), `retencion.json`, `revision_editorial.json` y revisión segundo por segundo.
- `sincronia_voz_aac.json` y `reproduccion_navegador.json`.
- `comparacion_ritmo_AB.mp4`: A es el episodio 01 a 1.25× y B el episodio 02 a 1.0×. Compara ritmo entre temas distintos; no es un experimento de conceptos idénticos.

Los comandos producen evidencia sobre archivos reales. Este README no afirma que el nuevo MP4 haya pasado QA antes de ejecutarlos. Los umbrales de retención son alertas de revisión, no sustituyen el criterio editorial ni prueban por sí solos naturalidad vocal. Una acción declarada en el guion no elimina una alerta medida en el render. La revisión debe considerar la nueva zona del protagonista y los escenarios, sin contar subtítulos o encabezados como evolución visual.

Reproducción local por HTTP:

```bash
python -m http.server 8080 --directory output/episodio-02-tiempo
```

Abrir `http://localhost:8080/reproducir.html`. La entrega no depende del visor binario de GitHub ni de abrir HTML mediante `file://`.

## Regenerar voz sin créditos

La narración y la mezcla están en [public/episodios/episodio-02-tiempo/audio](../../../public/episodios/episodio-02-tiempo/audio/); no hace falta regenerarlas para renderizar. Para un guion nuevo, usar Python 3.12 y las dependencias fijadas:

```bash
python3 -m venv /tmp/corazon-episodio02-venv
source /tmp/corazon-episodio02-venv/bin/activate
python -m pip install -r scripts/episodio-02-tiempo/requirements.txt
python scripts/episodio-02-tiempo/generar_voz_local.py
python scripts/episodio-02-tiempo/preparar_voz.py \
  --source public/episodios/episodio-02-tiempo/audio/narracion_original.flac
```

Mantener coherentes el texto de `production.json`, `chapters.json`, el guion y las palabras de activación. Tras cambiar texto, volver a preparar voz, marcas, mezcla, render e informes. No reutilizar la medición nativa de un texto anterior para calibrar otro guion.

El modelo queda fuera de Git en `/tmp/corazon-piper/`. Sus fichas declaran conjunto mexicano Unlicense y base Davefx CC0; Piper es software GPL-3.0 instalado externamente. No se redistribuyen pesos ni ejecutables. Procedencia en [ORIGEN.md](../../../public/episodios/episodio-02-tiempo/audio/ORIGEN.md) y hashes/calibración en `voz_local_produccion.json`.

**Marcas reales:** VITS expone las duraciones de los fonemas sintetizados. Se verifica por oración que su suma multiplicada por el salto de 256 muestras coincide exactamente con las muestras emitidas. Las palabras se vinculan a esos intervalos y se mapean el tempo efectivo y los empalmes de silencio registrados. No se calculan marcas por longitud del texto. La tolerancia de mapeo es 35 ms, más la cuantización visual por fotograma. La transcripción independiente revisa contenido; no reemplaza las marcas.

La calibración toma como referencia el episodio aprobado. `atempo=1.25` afecta solamente a la voz y conserva el tono; se editan pausas acústicas sin cortar fonemas. Si el guion no llena 70 s dentro del presupuesto permitido de pausas, la preparación exige revisar contenido. Música, efectos y pasos se sintetizan con código original, sin stock ni muestras comerciales.

## Ciencia y 3D opcional

Se separan reloj, percepción durante la experiencia y recuerdo posterior. La edad no se presenta como causa única; la novedad puede cambiar una duración recordada sin que lo vivido siempre parezca lento, y la rutina no equivale a deterioro general de memoria. Fuentes y criterios en [CIENCIA.md](CIENCIA.md).

No hay un clip aprobado compatible de reloj 3D. La versión actual integra un reloj de pared animado en el dormitorio, con profundidad simulada durante los primeros tres segundos; **no es un nuevo clip hiperrealista** ni sustituye al protagonista. [PROMPT_3D.md](PROMPT_3D.md) prepara una posible capa ambiental de reloj, sin generar personajes ni reemplazar la habitación aprobada. No se ha solicitado ni pagado esa generación.

La rama de revisión `episodio-02-tiempo` parte del trabajo del PR #8 y conserva la primera propuesta. Estándar futuro en [AGENTS.md](../../../AGENTS.md); no modificar ilustraciones ni fusionar automáticamente.

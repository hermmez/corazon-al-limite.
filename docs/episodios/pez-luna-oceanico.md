# El pez luna: el gigante más extraño del océano

Composición independiente `PezLunaOceanico`: 70 segundos exactos, 2.100 fotogramas a 30 FPS, 1080 × 1920 vertical, MP4 H.264 y audio AAC. Los componentes y las ilustraciones de los episodios anteriores permanecen intactos.

## Guion y datos

El guion aprobado tiene 152 palabras. Se acortan el gancho y la explicación del nado, y se precisa la descripción del clavus. El protagonista es **Mola mola**. No se le atribuyen récords de **Mola alexandrini** ni de **Mola tecta**.

Fuentes y alcance:

- [FishBase — Mola mola](https://www.fishbase.se/summary/mola-mola.html): peso publicado de 1,3 toneladas, que respalda la frase «más de una tonelada». No se presentan récords ni un tamaño máximo en pantalla.
- [Davenport et al., 2018, Journal of Anatomy](https://pubmed.ncbi.nlm.nih.gov/29926911/): propulsión mediante aletas dorsal y anal; clavus con función de timón.
- [Monterey Bay Aquarium](https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/ocean-sunfish): dieta variada con medusas, salpas y otros organismos; desplazamientos e inmersiones. No se afirma que coma exclusivamente medusas.
- [Nakamura et al., 2015, Journal of Animal Ecology](https://pubmed.ncbi.nlm.nih.gov/25643743/): alimentación en profundidad y recuperación de temperatura en aguas superficiales más cálidas. La narración y el rótulo mantienen «puede» y «una posible función», sin atribuirle una explicación única al comportamiento superficial.
- [Australian Museum](https://australian.museum/learn/animals/fishes/ocean-sunfish-mola-mola/): identificación por clavus ondulado y ausencia de una cola convencional. Se omiten de esta ficha las cifras históricas de récord que pueden mezclar especies.

No se inventan metros de profundidad, temperaturas ni cifras de velocidad. El cambio de silueta a esquema es una explicación gráfica; no representa una metamorfosis del individuo durante su vida.

## Voz y sonido

Una sola generación autorizada en Higgsfield: **Grady**, preset `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`, modelo `elevenlabs_v4`, **4,37 créditos**. Trabajo `757294a9-1df8-4612-b175-6c6fafc12256`. Audio original decodificado: 62,275918 segundos. Se mantienen todas las palabras a velocidad 1.

Los cortes se realizan dentro de pausas acústicas. Ocho clips de voz distribuyen los siete apartados; el cierre se separa antes de «Y ahora dime» para dar tiempo al recorrido del animal y cerrar después de la pregunta. La última palabra termina aproximadamente a los 69,72 segundos. No hay despedida ni créditos.

La transcripción local utiliza Whisper multilingüe en CPU. Los subtítulos JSON conservan los tiempos relativos a cada clip. Se corrige la segmentación automática «a costado» a la palabra aprobada «acostado» y se alinean tres inicios de palabras tras las pausas detectadas. No se altera el texto del audio.

Música submarina y ambiente sintetizados localmente para este episodio, sin muestras de terceros. Los efectos de agua y burbujas se mantienen discretos por debajo de la voz. No se utiliza generación de video IA.

## Identidad y recursos 2D

Se inspeccionan `public/imagenes/personajes/01_neutral.png` y `public/imagenes/escenarios/03_sala.png` antes de crear recursos. Sus contornos oscuros, paleta turquesa y azul marino, rostro, proporciones y sombreado cel sirven como referencias directas en la generación integrada de las nuevas ilustraciones.

Los seis recursos son archivos individuales: perfil y frente de Mola mola, buzo del mismo personaje, fondo oceánico, medusa y salpa. Animales y personaje son PNG RGBA con transparencia real; el fondo es RGB. Los originales aprobados no se editan. La procedencia y los tamaños nativos están en `recursos-originales.json`.

El pez conserva cuerpo alto y comprimido, boca y ojo en la cabeza, aletas dorsal, anal y pectorales, y clavus ondulado. No se añade una cola convencional. La vista frontal muestra la compresión lateral. Las aletas son capas enmascaradas con pivotes propios y deformaciones 2D controladas; el cuerpo mantiene su forma. La vista frontal permite mostrar el giro longitudinal antes de cambiar a una vista cenital del animal de lado.

Las piernas, antebrazos y cabeza del buzo tienen pivotes independientes. La campana y los brazos de la medusa se articulan por separado. La cadena de salpas usa contracciones con desfase. La comparación con un pez de cola convencional es un esquema vectorial ilustrado, no una fotografía o un elemento 3D.

## Movimiento y validación

El [plan previo](pez-luna-oceanico-plan-70s.md) contiene 70 registros, uno por segundo, escritos antes de animar. Las acciones principales se encadenan con el avance del animal, comparación anatómica, inmersión, alimento, ascenso, giro de lado y regreso al buzo. Las transiciones duran diez fotogramas (0,333 segundos) y alternan barrido, fundido y desplazamiento motivado por la acción.

La revisión usa una vista ligera de diez segundos, los primeros 90 fotogramas, capturas de anatomía y una revisión del episodio en baja resolución. El control automático analiza ventanas móviles de un segundo a diez muestras por segundo, excluyendo la zona de subtítulos. La actividad de píxeles es un diagnóstico, no una garantía de retención ni de calidad semántica. Se complementa con revisión visual del contenido de cada segundo.

## Reproducir y exportar

```bash
npm ci
npx tsc --noEmit
npx remotion studio src/index.ts --no-open --port=3002
npx remotion render src/index.ts PezLunaOceanico out/pez-luna-preview-10s.mp4 --frames=0-299 --scale=0.5 --codec=h264 --audio-codec=aac --crf=25 --concurrency=2 --browser-executable=/usr/bin/chromium
bash scripts/renderizar_pez_luna.sh
```

`REMOTION_BROWSER` permite indicar otra instalación de Chromium; `REMOTION_CONCURRENCY` limita los procesos y `EPISODE_OUTPUT_DIR` cambia la salida. La preparación de audio y los controles usan Python 3, NumPy y FFmpeg/FFprobe. Los recursos y WAV ya están preparados; no se necesita volver a generar la voz.

El script final conserva los fotogramas H.264 del render y ajusta solamente el relleno AAC a 70 segundos exactos. El informe JSON verifica resolución, FPS, fotogramas, duración, códecs, plan completo, huella del audio autorizado y actividad visual.

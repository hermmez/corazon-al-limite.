# Episodio 13 · El Judío Errante y Caín

## Entrega

Remotion, 1080 × 1920, 2.100 fotogramas a 30 FPS y 70,000 segundos exactos. Archivo MP4 con H.264 High, YUV420p, BT.709 y audio AAC a 48 kHz. Decodificación completa y verificación de los 2.100 tiempos de presentación. SHA-256 d8751387c5870b4e29aae02b18d06a0ebb5d9fffe1136eb4da4711b5548d3f8f.

El viajero y Caín tienen ropa, siluetas y paletas distintas. El montaje pasa por el camino de niebla, la dramatización legendaria, el relato de Génesis, la comparación en movimiento y un manuscrito ilustrado. Cierra con los dos recorridos separados. La señal de protección se ilustra con luz alrededor del personaje.

## Narración y subtítulos

Una sola toma de Grady, Eleven v4 mediante Higgsfield, por los 4,37 créditos autorizados. El guion se condensó a 162 palabras y se mantuvo la toma a velocidad 1,0×. Se ampliaron 4,901 s de pausas repartidas y se sincronizaron 41 grupos de subtítulos con marcas acústicas. En un pasaje ambos modelos locales transcribieron «copia». El subtítulo conserva «copie», la forma del guion. La palabra «errancia» conserva su ortografía.

La voz termina a 67,951 s y el recorrido continúa hasta los 70 s. La mezcla integra ambiente y pasos sintetizados para el episodio. Se midieron -16,10 LUFS y una correlación de 0,999929 entre la mezcla PCM y la pista AAC.

| Etapa | Inicio previsto | Inicio con la toma |
| --- | ---: | ---: |
| LA CONDENA | 0,000 s | 0,000 s |
| EL JUDÍO ERRANTE | 9,000 s | 9,002 s |
| EL PRIMER ERRANTE | 23,000 s | 23,940 s |
| LA EXTRAÑA SIMILITUD | 37,000 s | 34,349 s |
| EL ORIGEN DEL MISTERIO | 52,000 s | 46,998 s |
| DOS HISTORIAS | 63,000 s | 60,159 s |

## Archivos y recursos

- Composición en `src/episodios/episodio-13-cain-y-el-errante/`. Registro añadido en `src/Root.tsx`. El guion, la línea de tiempo, los subtítulos y la dirección de escenas quedan editables.
- Diez ilustraciones finales en `public/episodio-13/ilustraciones/`. Cuatro personajes PNG con alfa y seis fondos de encuadre vertical. ImageGen integrado creó las ilustraciones. Los movimientos, transiciones y composición se hicieron en Remotion. El inventario `manifest.json` contiene los prompts, dimensiones, referencias y hashes.
  - `viajero-medieval.png` · 1024 × 1536 · RGBA
  - `cain.png` · 1024 × 1536 · RGBA
  - `abel.png` · 1024 × 1536 · RGBA
  - `jesus-leyenda.png` · 1024 × 1536 · RGBA
  - `camino-bruma.png` · 941 × 1672
  - `jerusalen-antigua.png` · 941 × 1672
  - `ciudad-medieval.png` · 941 × 1672
  - `manuscrito-abierto.png` · 941 × 1672
  - `desierto-levante.png` · 941 × 1672
  - `dos-caminos-levante.png` · 941 × 1672
- Se usaron como referencias los dibujos aprobados de la serie y los paisajes del episodio 10. Se reutilizaron los procedimientos de alineación y exportación del episodio 12. La composición final usa fondos históricos propios.
- Toma original, voz aislada y mezcla en `public/episodio-13/audio/`. SRT y JSON de verificación en `output/episodio-13-cain-y-el-errante/`. Herramientas de transcripción, mezcla, render y comprobación en `scripts/episodio-13-cain-y-el-errante/`.

## Control de calidad

Los ocho MP4 anteriores coinciden con los hashes guardados. Los SHA-256 de los 68 PNG de la biblioteca activa también coinciden con la versión aprobada. Se revisaron las transiciones, legibilidad y posiciones de los personajes sobre el suelo en las vistas ligeras y en el archivo final.

Se midió el cambio de gris a 4 muestras por segundo en el recorte que excluye subtítulos y títulos superiores. La mediana del episodio 13 a velocidad normal fue 3,399 puntos de 255 y su percentil 90 fue 8,756. En la referencia del episodio 04 a 1,25× se midieron 0,875 y 9,734, respectivamente.

Intervalos por debajo del umbral de 0,75 durante al menos 2 s. 24,500 s a 26,500 s, 52,250 s a 59,750 s. El primer tramo sostiene el encuentro de Caín y Abel antes del destierro. El segundo mantiene el manuscrito abierto para leer las fechas y el contexto antijudío mientras se revelan los rótulos.

Pausas de voz superiores a 0,7 s. 4,319 s a 5,089 s, 8,267 s a 9,039 s, 11,390 s a 12,160 s, 15,002 s a 15,772 s, 17,106 s a 17,879 s, 20,663 s a 21,433 s, 23,205 s a 23,975 s, 26,860 s a 27,630 s, 31,095 s a 31,865 s, 33,606 s a 34,376 s, 37,391 s a 38,161 s, 39,262 s a 40,032 s, 42,911 s a 43,681 s, 46,263 s a 47,033 s, 47,724 s a 48,494 s, 49,818 s a 50,588 s, 54,679 s a 55,450 s, 59,282 s a 60,194 s, 62,601 s a 63,371 s. Se conservan como pausas de frase y de cambio de escena, con movimiento y ambiente de fondo.

## Reproducción del proyecto

Abrir la composición Episodio13CainYElErrante en Remotion Studio. Para exportar, definir FFMPEG_PATH y ejecutar node scripts/episodio-13-cain-y-el-errante/render.mjs desde la raíz. Luego ejecutar verificar.py con Python, NumPy y Pillow. Para repetir la alineación, correr transcribir.py con WHISPER_MODEL apuntando a Small y, con --base, a Base. preparar_audio.py usa ambas pasadas.

## Fuentes históricas

- Génesis 4:8–16 narra la muerte de Abel, la condena a errar, la señal para proteger a Caín y su establecimiento en Nod. El pasaje no especifica la forma de la señal ni atribuye inmortalidad al personaje. El resplandor del video rodea el entorno y sirve para explicar la función protectora. [United States Conference of Catholic Bishops, Génesis 4](https://bible.usccb.org/bible/genesis/4)
- El relato de Cartáfilo aparece en las crónicas inglesas del siglo XIII. Una versión incluida por Mateo de París refiere un episodio situado por la crónica en 1228. Esta fecha corresponde a la transmisión del relato medieval. [Parker Library, Chronica majora, CCCC MS 16 II](https://parker.stanford.edu/parker/catalog/qt808nj0703) · [Universidad de Pisa, estudio de las versiones medievales](https://arpi.unipi.it/handle/11568/1169127)
- La versión impresa alemana de 1602 presenta a Ahasuero. Una versión lo describe como un hombre que niega a Jesús un descanso cuando lleva la cruz. El video condensa rasgos de la tradición en una dramatización identificada como leyenda. Algunas versiones europeas difundieron prejuicios antijudíos. [Universidad Hebrea de Jerusalén, The Wandering Jew: a Jewish perspective](https://cris.huji.ac.il/en/publications/the-wandering-jew-a-jewish-perspective/) · [Lisa Lampert-Weissig, Instrument of Memory](https://press.umich.edu/Books/I/Instrument-of-Memory2)
- Hubo interpretaciones cristianas posteriores que usaron la figura de Caín de manera antijudía, como la lectura alegórica en el libro XII de Agustín. Esa lectura documenta la historia del prejuicio. La semejanza entre los personajes permite comparar motivos narrativos y por sí sola no establece una identidad ni una copia directa. [Agustín de Hipona, Réplica a Fausto, libro XII](https://www.augustinus.it/spagnolo/contro_fausto/libro_12_testo.htm)

Las figuras, el manuscrito y los paisajes son reconstrucciones artísticas. El manuscrito animado representa etapas de transmisión, con miniaturas creadas para este episodio.

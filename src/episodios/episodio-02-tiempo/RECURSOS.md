# Recursos del episodio 02

Inventario derivado de los atributos `src` y `pose` de `World.tsx` y de su mapa `CHARACTER_ASSETS` en `VisualPrimitives.tsx`. Se verificaron existencia, dimensiones y SHA-256 contra `src/Piloto10s/approved-assets.json`. No se modificó ningún PNG.

## PNG realmente utilizados

**12 imágenes: 9 poses, 1 ilustración anatómica y 2 escenarios.** Todas las rutas de la tabla son relativas a `public/imagenes/` y se cargan con `staticFile()`. El manifiesto [recursos.json](recursos.json) contiene el SHA-256 completo, dimensiones originales y bytes de cada archivo.

| Ruta | Dimensiones originales | Uso narrativo |
| --- | --- | --- |
| `anatomia/01_cerebro_completo.png` | 1254 × 1254 | Separación entre vivir y recordar el día. |
| `escenarios/01_dormitorio.png` | 1254 × 1254 | Despertar en la secuencia rutinaria. |
| `escenarios/03_sala.png` | 941 × 1672 | Regreso a casa dentro de la rutina. |
| `personajes/01_neutral.png` | 1024 × 1536 | Avatar del descubrimiento y comienzo de recorridos. |
| `personajes/02_explicando.png` | 1024 × 1536 | Explicación de las 24 horas y la percepción. |
| `personajes/04_pensando.png` | 1024 × 1536 | Pregunta del gancho, rutina y comparación de perspectivas. |
| `personajes/05_cansado.png` | 1024 × 1536 | Despertar dentro de la rutina cotidiana. |
| `personajes/08_senalando_arriba.png` | 1024 × 1536 | Señalar conceptos y acompañar la conclusión. |
| `personajes/11_sorprendido.png` | 1024 × 1536 | Reacción al calendario de diciembre. |
| `personajes/13_feliz.png` | 1024 × 1536 | Experiencias nuevas y cierre. |
| `personajes/21_caminando.png` | 1024 × 1536 | Desplazamientos entre lugares y cambio de recorrido. |
| `personajes/27_sentado.png` | 1024 × 1536 | Espera y atención al reloj. |

El componente declara 12 poses reutilizables, pero este episodio utiliza 9. `10_idea.png`, `23_durmiendo.png` y `26_levantando_brazos.png` están disponibles en el mapa y **no se incluyen como recursos usados**. Tampoco se usa `02_cocina.png`. No se debe confundir una pose declarada con una imagen solicitada por las escenas. Si se añaden llamadas nuevas a `Character` o `Art`, regenerar el inventario.

El uso de máscaras, encuadres y transformaciones en Remotion no altera los archivos. Se conserva la proporción mediante `objectFit: contain`. Los fondos y objetos de apoyo dibujados por código no reemplazan la identidad del personaje oficial.

## Gráficos originales por código

Relojes y agujas, calendarios, tarjetas de recuerdos, escuela, conversación simbólica, oficina, montaña, playa, libro/estudio, actividad y recorridos se dibujan con SVG/CSS. No son fotografías, emojis ni nuevas imágenes generadas. Las escenas de infancia evocan escuela, amistades y lugares con el avatar oficial y objetos; no se crea un actor infantil distinto.

Las tarjetas de rutina y recuerdos son diagramas conceptuales. No representan un conteo clínico de recuerdos almacenados ni una aceleración física del tiempo. Mantener las etiquetas de experiencia y recuerdo indicadas en [CIENCIA.md](CIENCIA.md).

## Tipografía

Manrope variable local: `public/piloto10s/fonts/Manrope[wght].ttf`, reutilizada del piloto. SHA-256: `3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6`. La tipografía se carga antes de continuar el render mediante `FontFace` y `delayRender`.

## Audio

Directorio: `public/episodios/episodio-02-tiempo/audio/`.

- `narracion_original.flac`: toma mexicana masculina Aldo/Piper antes de edición.
- `narracion.flac`: narración editada de 70 s.
- `musica_original.flac`: partitura original por código, 105 BPM, con cambios por capítulo.
- `efectos_originales.flac`: tic-tac inicial breve, cambios de calendario y acentos ligados a conceptos.
- `mezcla_master.flac`: mezcla de entrega, con prioridad a la voz.
- `PIPER_MODEL_CARD.md`, `PIPER_DATASET_CARD.md`, `PIPER_BASE_MODEL_CARD.md`: fichas del proveedor y licencias declaradas.

Voz completa de 189 palabras, cero generaciones de pago y cero créditos externos. El runtime Piper y los pesos del modelo están fuera de Git. Procedencia detallada en [ORIGEN.md](../../../public/episodios/episodio-02-tiempo/audio/ORIGEN.md); marcas intrínsecas y comprobaciones de muestras en `output/episodio-02-tiempo/alineacion_intrinseca.json` y `alineacion_audio_real.json`.

## 3D y recursos no utilizados

No hay un clip independiente aprobado de reloj 3D compatible. El clip `public/piloto10s/video/personaje_higgsfield_original.mp4` se inspeccionó: muestra al personaje y no es un reloj; no se usa para el gancho de este episodio. No se reutilizan imágenes antiguas de referencia ni el paquete adicional de siete recursos como si pertenecieran automáticamente a las 68 ilustraciones aprobadas.

La apertura actual es un reloj vectorial con profundidad simulada, reemplazable durante un máximo de 3 s. [PROMPT_3D.md](PROMPT_3D.md) conserva la propuesta opcional; no existe una generación hiperrealista nueva ni se ha consumido presupuesto para ella.

El listado acredita recursos existentes y preparados; el resultado técnico del MP4 debe consultarse en los reportes reales de calidad y retención, no deducirse de este inventario.

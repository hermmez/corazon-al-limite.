# Recursos de la historia cotidiana · episodio 02

Inventario de la reinvención: `World.tsx` compone `StoryScenesA.tsx` y `StoryScenesB.tsx`, que utilizan `Actor`, `Environment` y objetos de `StoryPrimitives.tsx`. Este módulo amplía el mapa de poses de `VisualPrimitives.tsx`; solo se cuentan las imágenes solicitadas por las escenas actuales.

Se verificaron existencia, dimensiones y SHA-256 de cada PNG contra `src/Piloto10s/approved-assets.json`. Ningún archivo de ilustración se modificó.

## PNG utilizados

**18 imágenes: 15 poses, 1 ilustración anatómica y 2 escenarios.** Las rutas son relativas a `public/imagenes/` y se cargan con `staticFile()`. [recursos.json](recursos.json) contiene hashes completos, dimensiones originales y bytes.

| Ruta | Dimensiones originales | Uso narrativo |
| --- | --- | --- |
| `anatomia/01_cerebro_completo.png` | 1254 × 1254 | Capa breve asociada a vivir y recordar durante el trayecto. |
| `escenarios/01_dormitorio.png` | 1254 × 1254 | Mañana y despertar; reloj y calendario integrados en la habitación. |
| `escenarios/03_sala.png` | 941 × 1672 | Regreso a casa, semana vivida, objetos y cierre al terminar el día. |
| `personajes/01_neutral.png` | 1024 × 1536 | Inicio de la espera y continuidad del mismo protagonista. |
| `personajes/02_explicando.png` | 1024 × 1536 | Explicar la percepción y acompañar el cierre. |
| `personajes/04_pensando.png` | 1024 × 1536 | Pensar en el tiempo, la rutina y los recuerdos. |
| `personajes/05_cansado.png` | 1024 × 1536 | Mañana y espera dentro de su día. |
| `personajes/06_saludando.png` | 1024 × 1536 | Saludo durante el recuerdo escolar. |
| `personajes/08_senalando_arriba.png` | 1024 × 1536 | Señalar el reloj, calendario y elecciones concretas. |
| `personajes/10_idea.png` | 1024 × 1536 | Descubrimiento y decisión de hacer algo diferente. |
| `personajes/11_sorprendido.png` | 1024 × 1536 | Sorpresa ante diciembre y experiencias nuevas. |
| `personajes/13_feliz.png` | 1024 × 1536 | Vacaciones, viaje recordado y cierre. |
| `personajes/15_confundido.png` | 1024 × 1536 | Pregunta sobre el tiempo y reacción a la repetición. |
| `personajes/18_bostezando.png` | 1024 × 1536 | Gesto del gancho al cerrar los ojos. |
| `personajes/21_caminando.png` | 1024 × 1536 | Trayecto, rutina y cambio de camino. |
| `personajes/22_corriendo.png` | 1024 × 1536 | Desplazamiento breve del trayecto cotidiano. |
| `personajes/26_levantando_brazos.png` | 1024 × 1536 | Reacción corporal al probar una actividad distinta. |
| `personajes/27_sentado.png` | 1024 × 1536 | Trabajo y aprendizaje con objetos del entorno. |

El mapa efectivo de `StoryPrimitives.tsx` declara 16 poses: las 12 del mapa base y cuatro adicionales. Se utilizan 15; **`23_durmiendo.png` está disponible pero no se usa**. `Environment` declara cocina como variante, pero ninguna escena llama a esa variante; **`02_cocina.png` tampoco se incluye**. Una declaración disponible no equivale a un recurso cargado por la historia. Regenerar el inventario si cambian las llamadas a `Actor`, `Art` o `Environment`.

El actor ocupa aproximadamente 500–525 px de ancho y se apoya en el suelo del escenario; no se sustituye por otro personaje. Los PNG del actor y la anatomía se ajustan sin distorsión; los fondos se reencuadran para llenar pantalla cuando corresponde. Máscaras, cambios de pose, profundidad y parallax no alteran los originales.

## Escenarios y objetos por código

La calle, la oficina, la escuela, el parque y el viaje se construyen mediante SVG/CSS. El dormitorio y la sala incorporan los PNG oficiales. Puerta, ventana, autobús, parada, escritorio, reloj de pared, calendario, libreta/libro, lápiz y botella son objetos del mismo día. Sus movimientos explican desplazamientos, atención, rutinas y recuerdos; no son tarjetas sueltas con imágenes estáticas.

No se generan fotografías, emojis ni actores alternativos. El recuerdo de infancia mantiene al protagonista oficial como representación narrativa, acompañado por la escuela y el saludo; no se crea una nueva ilustración infantil. Las variaciones de semana y recuerdo son conceptuales y no un conteo clínico de memoria. Ver [CIENCIA.md](CIENCIA.md).

## Tipografía

Manrope variable local: `public/piloto10s/fonts/Manrope[wght].ttf`. SHA-256: `3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6`. Se reutiliza del piloto y se carga mediante `FontFace` antes de continuar el render.

## Audio conservado y foley añadido

Directorio: `public/episodios/episodio-02-tiempo/audio/`.

- `narracion_original.flac`: toma completa mexicana Aldo/Piper antes de edición.
- `narracion.flac`: voz final de 70 s; **idéntica en la primera propuesta y la reinvención**, SHA-256 `4b33aed83501cabf254ebd831dfd35700f7d290d8b86c10d84a94588d3635c1c`.
- `musica_original.flac`: síntesis original, 105 BPM y desarrollo por escena.
- `efectos_originales.flac`: tic-tac inicial, calendario, descubrimiento y tres pares de pasos suaves asociados a desplazamientos.
- `mezcla_master.flac`: mezcla para la nueva historia, con la voz y sus marcas intactas.
- `PIPER_MODEL_CARD.md`, `PIPER_DATASET_CARD.md`, `PIPER_BASE_MODEL_CARD.md`: fichas y licencias declaradas por el proveedor.

Guion de 189 palabras; cero generaciones de pago y cero créditos externos. Los pesos y el runtime Piper están fuera de Git. [ORIGEN.md](../../../public/episodios/episodio-02-tiempo/audio/ORIGEN.md) documenta la procedencia. `alineacion_intrinseca.json` y `alineacion_audio_real.json` conservan marcas verificadas contra muestras; `remezcla_historia.json` registra que la voz no cambió.

## 3D opcional y versiones preservadas

No se encontró un clip aprobado de reloj 3D compatible. `public/piloto10s/video/personaje_higgsfield_original.mp4` muestra al personaje, no un reloj, y no se incorpora como sustituto del nuevo gancho. No se usan fotografías ni paquetes de referencia ajenos al manifiesto de 68 ilustraciones aprobadas.

El reloj ambiental del dormitorio se anima con SVG y profundidad simulada durante un máximo de tres segundos. No hay generación hiperrealista nueva. [PROMPT_3D.md](PROMPT_3D.md) prepara una sustitución opcional de ese objeto sin generar personas ni cambiar el PNG del dormitorio.

La primera propuesta se conserva en [version-01](../../../output/episodio-02-tiempo/version-01/); su código visual está en el commit `341a8f4`. Los recursos e informes archivados no deben confundirse con la lista y QA de esta reinvención. Los episodios anteriores se conservan.

Este inventario acredita archivos existentes y coincidencia de sus hashes; la validación del nuevo MP4 se documentará en sus reportes de calidad, retención y reproducción.

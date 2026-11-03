# Episodio 02 · reporte de calidad técnica

Archivo: `episodio_02_tiempo_70s.mp4`. SHA-256: `cea46e757723357d8ddd03013993f757580df2ee3caad8c1fa6f493449d2c34f`.

Las comprobaciones siguientes se ejecutaron sobre el mismo MP4 final; sus hashes coinciden. No se presentan como realizadas antes de disponer del archivo.

## Video y audio

| Comprobación | Resultado |
| --- | --- |
| Duración del contenedor, video y audio | 70.000 s |
| Fotogramas decodificados | 2100 |
| Resolución y FPS | 1080 × 1920, 30 FPS |
| Códecs | H.264 / AAC estéreo a 48 kHz |
| Color | YUV420p, rango TV, BT.709 |
| Inicio rápido | Índice MP4 antes de los datos multimedia |
| Decodificación completa | Sin errores |
| Intervalos negros detectados | 0 |
| Fotogramas distintos | 2100 |
| Loudness de la mezcla | -14.06 LUFS |
| Pico verdadero | -1.87 dBTP |

## Narración y subtítulos

Voz: **Piper local**, Aldo es_MX. La procedencia y las licencias se documentan junto al audio; no se presume que una voz estimada o ausente fue generada.

- Correlación de la narración limpia contra el AAC final: mínimo **0.98780** en las ocho partes.
- Desfase global medido: **0.000 ms**. La prueba exige un máximo de 5 ms.
- Última palabra: **69.680 s**, sin cortar la frase al llegar al límite de 70 s.
- Subtítulos: **189 palabras, 46 grupos**, de 3 a 5 palabras. Marcas positivas, ordenadas y dentro del episodio.
- Eventos semánticos verificados contra palabras reales: **48**. Las entradas de capítulo se verifican contra su primera palabra, conservando un pequeño preroll intencional.

`alineacion_audio_real.json` conserva el método de obtención de marcas y los empalmes acústicos. La correlación confirma presencia y posición de voz, no juzga por sí sola la naturalidad o el acento.

## Reproducción

Chromium HTML5 reprodujo el archivo completo a **1.0×**: **2100 fotogramas**, **3 perdidos**, `ended=true`, duración 70 s, sin error multimedia. Decodificó 1698286 bytes de audio. El autoplay se silencia solo durante la prueba automatizada; la mezcla se comprueba por separado.

## Preservación y costo

- 68 PNG aprobados con SHA-256 intacto.
- Los dos MP4 anteriores del episodio 01 conservan sus hashes.
- Se retienen los registros previos de composiciones y se añade `Episodio02Tiempo` de forma independiente.
- Generaciones de pago declaradas en la configuración: **0**; créditos de voz: **0**.
- Apertura 3D: `replaceable-Remotion-clock-marker`. No se afirma que un marcador Remotion sea un clip hiperrealista generado. El prompt de sustitución se entrega por separado y no bloquea el render 2D.

## Revisión editorial

El análisis de retención ejecutado se conserva en `retencion.json` y `REPORTE_RETENCION.md`: intervalos de silencio, evolución de la ilustración protagonista, repetición, sincronía y un registro segundo por segundo. Los umbrales producen alertas para revisar, no autorizan a borrar pausas o a declarar equivalencia subjetiva de energía.

La inspección editorial adicional está documentada en `revision_editorial.json`. Sus observaciones no sustituyen las mediciones del render.

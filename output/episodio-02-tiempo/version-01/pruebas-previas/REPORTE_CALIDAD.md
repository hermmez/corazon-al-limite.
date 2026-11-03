# Episodio 02 · render anterior a la reinvención

**Versión de trabajo para conservar, no producción final declarada lista.** El usuario pidió «Reinvéntalo»; esta comprobación documenta el estado del render anterior a esa nueva dirección.

Archivo: `episodio_02_tiempo_70s.mp4`. SHA-256: `a61783ccaf9fe797edc0427af485c435b4ac7c6e75b492e048618fc71a8eed72`. Tamaño: 13265048 bytes.

## Resultado técnico parcial

El validador se ejecutó y terminó con **código 1**: faltan las etiquetas H.264 `color_primaries=bt709` y `color_transfer=bt709`. El rango TV y la matriz BT.709 sí están declarados. No se cambió el validador ni se relajaron sus umbrales para darlo por aprobado.

Después se ejecutaron por separado los checks no afectados:

| Comprobación | Resultado medido |
| --- | --- |
| Duración de contenedor, video y audio | 70.000 s |
| Resolución / velocidad / fotogramas | 1080 × 1920 / 30 FPS / 2100 |
| Códecs / píxeles | H.264 / AAC estéreo 48 kHz / YUV420p |
| Decodificación completa | 2100 fotogramas, sin errores |
| Fotogramas distintos | 2098 |
| Intervalos negros | Ninguno detectado |
| Mezcla | -14.06 LUFS, -1.87 dBTP |
| Inicio rápido | Índice MP4 antes de los datos |
| Ilustraciones / videos anteriores | 68 PNG y ambos MP4 del episodio 01 conservan sus SHA-256 |

## Voz integrada y retención

La correlación entre la narración limpia y el AAC es 0.98780–0.99473 en las ocho partes, con desfase global medido 0.000 ms. La última palabra termina en 69.680 s. Esta medición demuestra presencia y posición de la voz; no certifica naturalidad humana.

El análisis sobre el MP4 real conserva **70 filas segundo por segundo** y 48 eventos ligados a palabras. Resultados de los umbrales existentes: 0 silencios de voz >0.7 s, 0 intervalos de baja evolución visual, 0 posibles repeticiones, 0 desajustes de eventos y 0 finales de narración anticipados >0.7 s. Los huecos entre marcas semánticas siguen listados para inspección; no prueban estasis ni se borran por metadata.

**No se ejecutó la reproducción completa en navegador ni se creó A/B en esta revisión**, por encargo del coordinador mientras se preserva y reinventa el episodio. Tampoco se realizó una nueva generación de audio o imágenes.

Evidencia: `validacion_tecnica.json`, `sincronia_voz_aac.json`, `retencion.json`, `REPORTE_RETENCION.md`. La nueva dirección visual requiere su propio render y sus propias comprobaciones; estos resultados no deben trasladarse al futuro MP4.

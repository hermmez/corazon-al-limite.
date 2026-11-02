# Revisión audiovisual 1.25× · entrega de 70 segundos

**70 s exactos / 2100 fotogramas / 30 FPS / 1080 × 1920 / H.264 + AAC.** Archivo: `episodio_01_cerebro_70s_FINAL.mp4`. Estado automático/editorial: `validated-with-editorial-review`.

## Cambios implementados

- Guion de 135 a 189 palabras (+40 %). Nuevos conceptos: sensores frente a central de alarmas, cuero cabelludo y músculos, complejidad de migraña, trigémino, sinapsis y pruebas de lenguaje/movimiento durante cirugía despierta.
- Narración completa local mexicana masculina Aldo/Piper; voz diferente de Juan/ElevenLabs. Calibración frente al original y cambio de tempo de 1.25× conservando tono. **Cero generaciones de pago, cero créditos.** No se aceleró globalmente el MP4.
- 56 respuestas semánticas vinculadas a palabras reales; cámara con cambios de foco de 0.28 s, transiciones de 0.34–0.38 s, subtítulos con entrada de 0.18 s, capas con parallax y cerebro persistente. El personaje no flota como recurso principal.
- Nuevas demostraciones: sensor de piel, capas sensibles, tres ramas del trigémino, transferencia sináptica, respuesta verbal/mano, monitoreo y anestesia. Acercamientos a la cara del paciente y la capa superficial corrigen zonas que la previsualización marcó con poca evolución.
- Música original de 84 a 105 BPM (+25 %), variaciones por capítulo, transiciones cortas y pulsos asociados a la señal/monitor. Voz prioritaria con atenuación musical.
- Conservados los 68 PNG y el MP4 aprobado mediante comprobación SHA-256; composición anterior disponible como `Episodio01CerebroAprobado`.

## Comparación obligatoria A/B

`comparacion_AB.mp4` alterna cuatro conceptos equivalentes durante aproximadamente 24 s: original a 1.25× frente a nueva edición a 1.0×. Ambos audios están incluidos. El cambio de locutor permanece explícito.

| Medida | A original 1.25× | B nueva 1.0× |
| --- | --- | --- |
| Duración completa | 56 s | 70 s |
| Palabras | 135 | 189 |
| Palabras/minuto incluyendo pausas | 144.6 | 162.0 |
| Música | 105 BPM al acelerar | 105 BPM nativos |
| Cambio visual mediano por 0.5 s, MAE | 0.02284 | 0.01798 |
| Percentil 90 del cambio visual | 0.12099 | 0.14785 |
| Alertas de poca evolución ≥2 s | 3 | 0 |
| Alertas de repetición | 0 | 0 |
| Silencios de voz >0.7 s | 7 | 0 |

Las métricas no prueban equivalencia subjetiva de energía o naturalidad. La menor actividad mediana puede reflejar la eliminación de oscilaciones constantes; tampoco sirve para descartar alertas. Se revisan ilustraciones protagonistas entre x=85–950 e y=575–1240, sin títulos, subtítulos ni tarjetas. El sistema mide cambios a 4 muestras/s, MAE <0.018 durante ≥2 s y firmas repetidas con diferencia <0.009. Un evento declarado no borra una alerta del render.

## Tiempos muertos

Pausas >0.7 s en A, **segundos del original acelerado**:

| Intervalo (s) | Duración (s) |
| --- | --- |
| 10.077–11.047 | 0.970 |
| 14.898–17.897 | 2.999 |
| 23.720–27.406 | 3.685 |
| 32.216–35.560 | 3.344 |
| 42.294–43.046 | 0.752 |
| 49.170–49.896 | 0.726 |
| 53.758–54.711 | 0.953 |

Pausas >0.7 s en B, **segundos de la entrega final**:

| Intervalo (s) | Duración (s) |
| --- | --- |
| — | Sin alertas |

Las pausas largas de A suman 13.429 s. Se reorganizó el contenido y se añadieron datos; no se rellenaron esos intervalos con planos vacíos.

Finales de voz anticipados >0.7 s: 5 en el original, 0 en la edición nueva. El JSON conserva los segundos exactos. Los empalmes de silencio se registran con muestras de inicio/fin y duración resultante; no se eliminan fonemas. El último término termina en 69.680 s, sin cortar la frase ni prolongar la despedida.

## Alertas visuales y revisión

No se detectaron intervalos que superaran los umbrales de revisión. Esto no sustituye la inspección de fotogramas y reproducción.

## Sincronización y validación

Las 189 palabras proceden de duraciones intrínsecas Piper/VITS verificadas contra las muestras reales emitidas. Se mapearon el cambio de tempo efectivo y los empalmes acústicos, con tolerancia de 35 ms. No se asignan tiempos por longitud de texto. La transcripción independiente está en `auditoria_contenido_voz.json`: es una revisión de contenido, no la fuente de marcas. Sus errores ortográficos no sustituyen el guion.

Eventos con desajuste no intencional: 0. La pequeña anticipación de inicio de capítulo se distingue de las activaciones por palabra. La correlación de voz limpia/AAC y la reproducción HTML5 se documentan en `sincronia_voz_aac.json` y `reproduccion_FINAL.json`.

Validación técnica: 2100 fotogramas decodificados, 2100 distintos, 0 intervalos negros; -14 LUFS y pico verdadero -1.89 dBTP. Reproducción completa en Chromium: 2100 fotogramas, 0 perdidos, sin error multimedia; desfase de voz/AAC medido 0.0 ms. La voz, música, efectos, subtítulos SRT/JSON y miniatura acompañan la entrega. El estándar futuro se documenta en `AGENTS.md`; instrucciones reproducibles en el README de la composición.

# Auditoría visual 2D · composición de cuadro completo

Se verifican los 68 PNG aprobados contra sus hashes de referencia. Los originales no se modifican. La composición usa entornos ilustrados hasta los bordes de 1080 × 1920; se retiraron el rótulo superior de marca, la leyenda técnica inferior, la barra de progreso y los marcos de tarjeta.

## Escenas

| Escena | Ocupación y capas |
|---|---|
| Noche en vela | Dormitorio nocturno panorámico, cama vacía independiente, personaje con gestos y reloj. |
| Atención | Entorno de neuronas aprobadas, cerebro anatómico grande y detalle de sinapsis sin tarjeta. |
| Microsueños | Dormitorio completo, cama y personaje, cerebro ilustrativo; no hay un umbral universal. |
| Carretera | Carretera a cuadro completo, automóvil más grande y carriles animados, sin bordes redondeados ni márgenes. |
| Funciones | Campo neural, cerebro y expresiones de memoria, decisiones y emociones como capas. |
| Cafeína | Cocina aprobada a cuadro completo, taza y cerebro; transición al entorno de descanso. |
| Percepción | Comparación entre personaje y cerebro integrada en el dormitorio, sin paneles de presentación. |
| Cierre | Dormitorio completo, personaje apoyado en cama/almohadas y aproximación 2D al descanso. |

## Recursos nuevos

Carpeta: `public/episodio-04/ilustraciones/`. Las seis imágenes son individuales, generadas con ImageGen integrado a partir de referencias aprobadas. Los dos recursos de esta revisión son el dormitorio panorámico y la cama vacía, necesarios para componer el entorno vertical y animar la vigilia por capas. No se usaron proveedores de créditos externos ni 3D.

| Archivo | Resolución nativa | Tamaño de uso | Alpha |
|---|---|---|---|
| automovil-teal-vista-trasera.png | 1358 × 1159 | 820 × 700 | 0–255 |
| carretera-nocturna-sin-vehiculo.png | 941 × 1672 | Fondo 1080 × 1920 | RGB |
| taza-cafe-con-plato.png | 1254 × 1254 | 800 × 800 | 0–255 |
| personaje-descansando-en-cama.png | 1536 × 1024 | Hasta 1200 × 800 | 0–254 |
| dormitorio-nocturno-panoramico.png | 1054 × 1492 | Fondo 1080 × 1920 con recorte proporcional | RGB |
| cama-vacia.png | 1536 × 1024 | Hasta 1100 × 734 | 0–254 |

La carretera usa una cobertura de 1.148× y el dormitorio 1.287×; ambos mantienen proporción con `objectFit: cover`. Los protagonistas se dibujan por debajo de su resolución nativa. Se registra esta escala en el manifiesto y se revisan los bordes en los fotogramas de salida. La cocina aprobada también se presenta a cuadro completo. No se compensa la relación de aspecto con franjas vacías.

Los prompts de los primeros cuatro recursos están en `PROMPTS_ILUSTRACIONES.md`; los del dormitorio y cama vacía en `PROMPTS_PANORAMA.md`. Los originales se conservan sin cambios.

## Validación y límites

TypeScript, hashes, formato PNG, alpha, tamaños y límites de escala se comprueban antes del render. Se inspeccionan ocho fotogramas representativos a 1080 × 1920. La exportación verifica 2100 tiempos de presentación a 30 FPS, 70.000 s, H.264 High, YUV420p, BT.709, faststart y decodificación completa.

La voz elegida es Alejandro Ballesteros. Sigue pendiente la audición con el guion y su costo, porque la integración de ElevenLabs respondió 401. Los títulos de la animática son editoriales, no captions alineados. La revisión audiovisual, mezcla y sincronización definitiva se realizan después de resolver la voz.

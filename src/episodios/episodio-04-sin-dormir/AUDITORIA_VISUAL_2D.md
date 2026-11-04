# Auditoría y actualización visual 2D · episodio 04

## Biblioteca inspeccionada

Se revisaron los 68 PNG aprobados: 30 personajes, 20 recursos anatómicos, 15 de ciencia y 3 escenarios. Las referencias visuales inspeccionadas fueron el personaje neutral, el personaje durmiendo, el dormitorio, el cerebro completo y la sinapsis neuronal. Sus archivos originales se conservan y se verifican mediante `recursos.json`.

## Necesidades resueltas

| Escena | Recurso principal y decisión |
|---|---|
| 01 · Noche en vela | Reutilizar dormitorio y expresiones cansado/bostezo; reloj complementario. Habitación a 1230 × 1230, dentro de sus 1254 × 1254 nativos. |
| 02 · Atención | Cerebro y sinapsis aprobados; retirar la gráfica ficticia «en tiempo real». Los textos describen posibilidades, no mediciones. |
| 03 · Microsueños | Personaje y cerebro completos; retirar ondas genéricas como ilustración protagonista. La pausa es ilustrativa y no simula una lectura clínica. |
| 04 · Conducción | Faltaban vehículo y carretera. Generar dos PNG separados para animar automóvil y marcas de carril sin sustituir el entorno por polígonos. |
| 05 · Funciones | Cerebro anatómico aprobado con llamadas complementarias de memoria, decisiones y emociones. |
| 06 · Cafeína | Faltaba taza. Generar una taza completa con plato y alpha; retirar círculos etiquetados como moléculas. El cerebro aprobado completa la explicación. |
| 07 · Percepción | Personajes neutral/confundido y cerebro aprobado; esquema de respuesta complementario rotulado como ilustrativo, sin cifras de rendimiento. |
| 08 · Descanso | La revisión renderizada mostró que la pose durmiendo no encajaba en el colchón. Crear un recurso específico de personaje, cama y almohadas como primer plano; conservar el dormitorio aprobado como entorno. |

## Recursos nuevos

Carpeta independiente: `public/episodio-04/ilustraciones/`. Generación mediante la herramienta integrada ImageGen, una imagen por recurso, con las referencias aprobadas. No se llamó a proveedores externos con créditos. Los prompts exactos se conservan en `PROMPTS_ILUSTRACIONES.md`.

| Archivo | Resolución nativa | Alpha | Uso máximo en composición |
|---|---|---|---|
| `automovil-teal-vista-trasera.png` | 1358 × 1159 | RGBA, alpha de 0 a 255 | 590 × 504 |
| `carretera-nocturna-sin-vehiculo.png` | 941 × 1672 | Fondo RGB | 900 × 1600 |
| `taza-cafe-con-plato.png` | 1254 × 1254 | RGBA, alpha de 0 a 255 | 560 × 560 |
| `personaje-descansando-en-cama.png` | 1536 × 1024 | RGBA, alpha de 0 a 254 | 1000 × 667 |

La carretera se presenta en un encuadre interior para conservar detalle sin ampliación. Los contornos, la paleta y el sombreado 2D de los nuevos recursos fueron revisados visualmente frente al dormitorio aprobado. Ningún recurso es 3D. Los hashes y la comprobación reproducible de resolución/alpha se guardan en el manifiesto y el reporte de recursos nuevos.

## Límites de esta revisión

La temporización continúa siendo editorial. La voz C2 requiere la decisión descrita en `AUDICION_VOZ.md`; quedan pendientes la locución definitiva, captions basados en audio real, mezcla, ajuste de gestos a palabras, comparación de ritmo A/B y validación del MP4 final con audio. La inspección de fotogramas permite revisar composición, pero no certifica por sí sola movimiento expresivo ni retención en reproducción completa.

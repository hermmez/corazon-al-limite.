# Estándar visual permanente · Corazón al Límite

Vigente desde la actualización del usuario para el episodio 04. Aplicar a nuevas producciones y revisiones. Animación **100 % 2D**; ningún recurso 3D. Mantener narración C2 cinematográfica, 70.000 s, 2100 fotogramas, 30 FPS y 1080 × 1920.

## Identidad y biblioteca

Inspeccionar las ilustraciones aprobadas antes de diseñar una escena. Preservar el diseño de personajes, paleta, proporciones, expresiones, contornos y nivel de detalle. Usar los PNG del repositorio como referencias obligatorias. No modificar ni reemplazar los originales; conservar sus hashes.

Las ilustraciones protagonistas deben ser completas y reconocibles: cerebro anatómico, personaje con cama, almohada y habitación al dormir, automóvil detallado con entorno y mobiliario reconocible si hay oficina. Los procesos biológicos se explican con ilustraciones educativas claras y animadas. Líneas, flechas y gráficos son complementos; no sustituyen los recursos principales.

## Recurso faltante

1. Revisar la biblioteca y documentar por qué no cubre la escena.
2. Definir una ilustración concreta y las partes que deben moverse por separado.
3. Elegir e inspeccionar las referencias aprobadas.
4. Guardar un prompt que preserve explícitamente la identidad.
5. Generar solo el recurso necesario, individualmente, con una herramienta de imágenes autorizada. No generar collages. No consumir créditos externos sin autorización concreta.
6. Revisar visualmente consistencia, resolución y transparencia. Un PNG no prueba por sí solo que exista alpha: verificarlo.
7. Copiar el resultado seleccionado a la carpeta del episodio e integrarlo mediante `staticFile()`. Registrar prompt, referencias, dimensiones, alpha y hash.

Para episodio 04 usar `public/episodio-04/ilustraciones/`. Fondos, objetos, personajes y piezas móviles se guardan por separado cuando facilita la animación. Usar nombres descriptivos. Los objetos y personajes independientes requieren PNG con transparencia real, sin un fondo simulado. Mostrar cada recurso dentro de su resolución nativa; si no cubre su encuadre final, preparar uno adecuado antes de exportar.

## Escenas y movimiento

Planificar gestos y reacciones del personaje, desplazamientos naturales de objetos, elementos animados del escenario, capas, cambios de perspectiva simulados en 2D y transiciones entre entornos. Cada cambio debe acompañar una idea de la narración. La respiración, un zoom o partículas no bastan para convertir un plano estático en una escena elaborada. Solicitar piezas separadas cuando una acción requiera articulación real.

## Revisión de entrega

Comprobar identidad en el encuadre final, nitidez a 1080 × 1920, alpha y bordes sobre fondos claros y oscuros, continuidad de perspectiva y contacto entre personaje y mobiliario. Revisar movimiento y legibilidad en reproducción, no solo en miniaturas. Conservar el estado pendiente de cualquier recurso o sincronización sin validar. Priorizar calidad visual y narrativa cuando la biblioteca sea insuficiente.

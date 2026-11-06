# Episodio 05 · emergencia nuclear

Composición Episodio05EmergenciaNuclear: 1080 × 1920, 30 FPS y 2100 fotogramas exactos. Se apoya en el estilo aprobado de la escena del cerebro y los tres personajes del episodio 04. No modifica sus ilustraciones ni componentes.

La voz Grady se generó exclusivamente en Higgsfield / elevenlabs_v4, con el preset aprobado y una autorización expresa de 5.52 créditos para una sola generación. El guion original conserva sus 174 palabras y su orden. La pista de 70 s se preparó acortando únicamente centros de pausas medidas, sin acelerar ni recortar palabras. Las cifras escritas «noventa por ciento» se alinearon por atención acústica/DTW, sin dividir su duración por longitud de texto.

Los quince recursos seleccionados están en public/episodio-05/ilustraciones/manifest.json. Los prompts exactos están en RECURSOS_PLAN.json; la corrección del corte arquitectónico se documenta en CORRECCION_CORTE.md. La primera versión con ventanas bajo tierra quedó descartada. El recurso utilizado es edificio-corte-sotano-v2.png.

Las ocho escenas están en scenes.tsx. Las secuencias de index.tsx se escribieron individualmente para poder inspeccionarlas y editarlas en Studio. Sus entradas siguen la narración real y las transiciones superponen doce fotogramas, conservando 2100 en total. Se reutilizan Backdrop, Clock, paleta y utilidades del episodio 04 sin modificarlas.

La composición no lleva título permanente, barras de progreso ni pie decorativo. Los subtítulos de 3–5 palabras conservan posiciones estables mientras aparecen sus palabras a tiempo con el audio. «Hasta 90 %» y «Al menos 24 h» se usan únicamente como etiquetas educativas en sus escenas.

## Verificación y reproducción

- Python scripts/episodio-05-emergencia-nuclear/auditar_recursos.py: hashes, dimensiones, transparencia, proporciones y staging reducido de medios; comprueba fuentes y recursos de episodios anteriores.
- TypeScript: node node_modules/typescript/bin/tsc --noEmit.
- Node scripts/episodio-05-emergencia-nuclear/revisar-fotogramas.mjs: fotogramas a media resolución; no renderiza una película completa de desarrollo.
- [Vista previa en Studio](http://localhost:3000/Episodio05EmergenciaNuclear).

La exportación final y la verificación del MP4 se documentan en [INFORME.md](INFORME.md). Las fuentes oficiales y las decisiones de representación visual están en [CIENCIA.md](CIENCIA.md).

# Audio del episodio 02

Narración completa local: **Aldo/Piper, es_MX-ald-medium**, voz masculina mexicana y fonetizador es-419. Guion de 189 palabras. No se generó ni solicitó voz de pago: **0 créditos**.

La ficha del modelo declara el conjunto mexicano bajo Unlicense y su conjunto base Davefx bajo CC0. Las fichas originales se conservan como `PIPER_*_CARD.md`. El runtime Piper es GPL-3.0, instalado fuera del repositorio; no se redistribuyen sus pesos ni ejecutables. Hashes y calibración en `output/episodio-02-tiempo/voz_local_produccion.json`.

`narracion_original.flac` contiene la toma sin editar. Se calibra la velocidad respecto al episodio aprobado y se aplica `atempo=1.25` conservando el tono. El ajuste neto frente a la toma nativa es moderado; el resultado tiene unas 162 palabras por minuto incluyendo pausas. Se editan solo regiones de silencio identificadas en la forma de onda, sin cortar fonemas. `narracion.flac` es la pista final de 70 s y `mezcla_master.flac` la mezcla de entrega.

Las marcas se obtienen de las duraciones de fonemas VITS realmente sintetizados: se verifica por oración que su suma multiplicada por el salto de 256 muestras coincide exactamente con el audio emitido. Después se mapean el tempo efectivo y los empalmes registrados. Tolerancia de mapeo: 35 ms, más la cuantización visual a fotogramas. No se calculan subtítulos por longitud del texto. `auditoria_contenido_voz.json` contiene una transcripción independiente de control; no es la fuente de marcas y puede contener errores ASR.

Música y efectos originales: síntesis mediante código de `scripts/episodio-02-tiempo/crear_audio.py`, sin stock ni muestras comerciales. Música a105 BPM, variación armónica, capas por capítulo y volumen reducido durante la voz. Tic-tac breve que acelera en la apertura y se detiene antes de3s; efectos de calendario, descubrimiento y foco de atención ligados al guion. No hay un tic-tac repetido durante todo el video.

Las ilustraciones aprobadas no se modifican. No se genera narración labial: la voz es en off y la boca de los PNG no se anima.

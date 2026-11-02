# Procedencia del audio · revisión 1.25×

- Narración completa: Piper local, voz masculina Aldo, `es_MX-ald-medium`, fonetizador `es-419`. Guion de 189 palabras. `narracion_original.flac` conserva la toma sin editar.
- Derechos: ficha del proveedor para el conjunto mexicano Unlicense; base Davefx CC0. Fichas y URLs conservadas como `PIPER_*_CARD.md`. Runtime Piper GPL-3.0 en entorno externo. No se redistribuyen pesos ni ejecutables.
- Costo: cero generaciones de pago, cero créditos. ElevenLabs/Juan fue una opción cotizada y no utilizada.
- Edición: calibración frente al original, `atempo=1.25` conservando tono, empalmes solo en silencio real. `narracion.flac`: voz editada de 70 s. `mezcla_master.flac`: master final.
- Marcas: duraciones intrínsecas VITS, verificadas contra las muestras emitidas por oración; transformadas por el cambio de tempo y los empalmes registrados. Tolerancia de 35 ms. Evidencia en `output/episodio-01-cerebro-125/alineacion_*.json`. Correlación entre voz y AAC final en `sincronia_voz_aac.json`.
- Música y efectos: síntesis original mediante osciladores, ruido, envolventes y eventos del guion, en `crear_audio.py`. 105 BPM con variación de capas, armonía y timbre. Sin música de terceros, stock ni muestras comerciales.
- `narracion_preview.flac` y `mezcla_preview.flac` conservan una revisión de trabajo anterior: no son los archivos finales.

Hashes, calibración y costos: `output/episodio-01-cerebro-125/voz_local_produccion.json`. Parámetros y loudness: `audio_produccion.json`. Las ilustraciones no se modifican.

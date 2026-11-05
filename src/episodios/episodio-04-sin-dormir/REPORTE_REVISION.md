# Episodio 04 · entrega final con Grady

Estado: **MP4 final exportado y verificado**, con narración completa y subtítulos sincronizados.

| Comprobación | Resultado |
|---|---|
| Video | 1080 × 1920, H.264 High, YUV420p, BT.709 |
| Duración | 70.000 s; 2100 fotogramas a 30 FPS constantes |
| Audio | AAC LC, 48 kHz; objetivo 192 kbps, 191.708 kbps medidos |
| Voz | Grady, Higgsfield / Eleven v4 (`elevenlabs_v4`), preset `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678` |
| Generación | Una solicitud completa; costo cotizado de 5.29 créditos autorizado expresamente |
| Guion | Las 186 palabras aprobadas, completas y en el orden original |
| Subtítulos | 47 grupos de 3–5 palabras; duración mínima de grupo: 0.76 s; ortografía y acentuación del guion aprobado |
| Velocidad | 1.0×; sin cambios de tono ni recortes de palabras |
| Mezcla | −16.12 LUFS, pico real −1.90 dBTP; sin clipping |
| Sincronización AAC | Correlación con el WAV a desplazamiento cero: 0.999925; SNR 38.19 dB |
| Última palabra | Termina en 69.680 s; queda margen antes del cierre |
| Integridad de archivo | Decodificación completa; moov antes de mdat; 2100 tiempos de presentación comprobados |
| Pantallas negras y pausas | Ningún intervalo negro ≥0.1 s ni silencio de voz >0.7 s detectados |
| Código | TypeScript aprobado |
| Recursos y episodios anteriores | Ilustraciones, escenarios, movimientos, transiciones, colores y fuentes de animación sin modificaciones respecto a la revisión aprobada |

La toma original de Higgsfield mide 74.370625 s. Para obtener 70 s se retiraron 4.370625 s exclusivamente de los centros de pausas medidas, conservando al menos 0.250421 s en cada pausa editada. Los cortes se verificaron por nivel de señal; no se aceleró la voz. La transcripción española de la toma coincide con el guion completo; la grafía «24» del reconocimiento se normalizó al «veinticuatro» del guion. Una entrada de palabra que abarcaba una pausa se ajustó a su límite acústico medido.

Se ajustaron las entradas y duraciones de las ocho secuencias a las palabras reales. Los archivos de `scenes/`, `visuals.tsx`, los 68 PNG originales y los seis recursos propios permanecen intactos. No se generaron imágenes, música ni efectos adicionales. Esta integración no utiliza la API directa de ElevenLabs.

Los subtítulos se integran como texto breve, sin barras, cajas decorativas ni marca permanente. Se inspeccionaron ocho fotogramas de las ocho escenas extraídos del MP4 final, incluido el cierre a 68.67 s. Conservan el encuadre aprobado y evitan tapar los elementos principales.

El lector FFprobe incluido con Remotion falla en este entorno Windows. El exportador usa PNG sin pérdida hacia FFmpeg independiente, una única codificación del video y el WAV aprobado para el audio. El ajuste de AAC de esta toma se calibró para conseguir aproximadamente 192 kbps medidos; el reporte conserva tanto el parámetro del codificador como el resultado. El reemplazo final de la pista AAC se hizo sin recodificar el video.

Archivo: `output/episodio-04-sueno/episodio04_FINAL_GRADY.mp4`  
SHA-256: `793e93a7d88661a2d2e543440d4ba5535af34064582e349fa2493e7a44a800f5`

## Evidencia y archivos editables

- [Validación final](../../../output/episodio-04-sueno/grady-verificacion-final.json).
- [Metadatos del MP4](../../../output/episodio-04-sueno/episodio04_FINAL_GRADY.json).
- [Subtítulos SRT](../../../output/episodio-04-sueno/episodio04_FINAL_GRADY.srt) y [palabras Caption](captions.json).
- [Procedencia, costo y autorización](../../../public/episodio-04/audio/narracion-grady.json).
- [Toma original](../../../public/episodio-04/audio/narracion_grady_original.mp3) y [narración de 70 s](../../../public/episodio-04/audio/narracion_grady_70s.wav).
- [Cortes de audio y marcas acústicas](../../../output/episodio-04-sueno/grady-edicion-audio.json).
- [Transcripción de la toma](../../../output/episodio-04-sueno/transcripcion_grady_original.json).
- [Carretera](../../../output/episodio-04-sueno/revision-940.png) y [cierre](../../../output/episodio-04-sueno/revision-1990.png), extraídos del archivo final.

El MP4 de entrega, el SRT, los metadatos y la miniatura también se guardan en la carpeta `outputs/` del proyecto de trabajo. El MP4 no se agrega al historial Git; los recursos de audio, el código y las pruebas sí quedan versionados. El PR permanece en borrador, sin fusionar.

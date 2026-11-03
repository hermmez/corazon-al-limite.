# Render y comprobaciones del episodio 02

Ejecutar desde la raíz del repositorio. Estos scripts no llaman a servicios de generación ni consumen créditos. Los reportes se crean solamente después de ejecutar las comprobaciones sobre archivos reales.

```bash
# Después de preparar la voz, su alineación y la mezcla de 70 s:
node scripts/episodio-02-tiempo/render.mjs
node scripts/episodio-02-tiempo/validar.mjs
python scripts/episodio-02-tiempo/verificar_voz.py
python scripts/episodio-02-tiempo/analizar_retencion.py
python scripts/episodio-02-tiempo/comparar_ab.py
# Correr la reproducción sin encoders/análisis intensivos paralelos.
node scripts/episodio-02-tiempo/comprobar_navegador.mjs
python scripts/episodio-02-tiempo/generar_reporte_calidad.py
```

Se necesitan dependencias npm ya instaladas, FFmpeg/FFprobe, Chromium y Python con NumPy. Las dependencias de voz adicionales están en `requirements.txt`. La ejecución de Chromium desde un entorno administrado puede requerir el permiso de red de la herramienta de comandos, aunque la página de reproducción sea local.

| Resultado | Archivo en `output/episodio-02-tiempo/` |
| --- | --- |
| Entrega final | `episodio_02_tiempo_70s.mp4` |
| Miniatura vertical | `miniatura_vertical.jpg` |
| Metadatos, decodificación, preservación y marcas | `validacion_tecnica.json` |
| Presencia/posición de voz en AAC | `sincronia_voz_aac.json` |
| Reproducción completa HTML5 | `reproduccion_navegador.json` |
| Análisis del render, voz y 70 filas editoriales | `retencion.json`, `REPORTE_RETENCION.md` |
| Comparación de ritmo A1.25× / B1.0× | `comparacion_ritmo_AB.mp4`, `.json` |
| Reporte agregado y verificación de hashes | `calidad.json`, `REPORTE_CALIDAD.md` |
| Reproductor local | `reproducir.html` |

El render exige `timeline.audioReady=true` y un master de audio real de 70.000 s. Codifica una entrega H.264/AAC, YUV420p/BT.709, 2100 fotogramas, 30 FPS; publica el archivo mediante un cambio de nombre atómico cuando finaliza la codificación. `--thumbnail-time=3.6` permite elegir el instante de la miniatura sin cambiar el video.

La validación técnica conserva los 68 PNG aprobados, los dos MP4 previos del episodio 01 y el catálogo anterior de composiciones. Verifica subtítulos de 3–5 palabras, tiempos positivos y eventos semánticos. Los eventos por palabra se comparan con su marca real (tolerancia de 1.1 ms en el JSON, antes de cuantizar al fotograma de video). Los capítulos admiten hasta 80 ms de entrada visual anticipada; solo el gancho inicial permite 120 ms, pues comienza en el fotograma cero antes del primer fonema. Se guarda el offset real: no se afirma que la voz empiece en 0.

El análisis de retención excluye títulos y subtítulos del área medida: x=85–950, y=575–1240. A 4 muestras/s, señala silencios de voz >0.7 s, cambios visuales pobres ≥2 s, posibles repeticiones, finales de voz demasiado tempranos y desajustes semánticos. Las alertas medidas se conservan aunque una revisión las justifique. `revision_editorial.json` puede registrar decisiones descriptivas en `intervals` con `kind`, `start`, `end` y `decision`; las entradas vacías o triviales no resuelven alertas.

El archivo A/B compara el episodio anterior a 1.25× con este episodio a 1.0×; los temas son diferentes. Es una ayuda para escuchar y observar ritmo, no un experimento de conceptos idénticos ni prueba de calidad subjetiva. La producción de 70 s no se acelera globalmente.

El reporte agregado exige que los hashes del video coincidan entre las comprobaciones técnicas, de navegador, voz y retención. Una salida de un render anterior no sirve para declarar validado el nuevo. Los checks técnicos no prueban por sí solos naturalidad de voz, rigor científico o retención; la inspección editorial se documenta por separado.

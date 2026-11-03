# Episodio 02 · una historia cotidiana

**¿Por qué el tiempo pasa más rápido cuando creces?**

El personaje vive el relato: despierta, descubre diciembre, sale a la calle, recuerda la escuela, trabaja, vuelve a casa, espera y decide tomar otra ruta. La explicación aparece a través de sus acciones y objetos. Se retiraron los paneles y titulares permanentes; el entorno ocupa la pantalla.

## Archivos

- [MP4 final](episodio_02_tiempo_70s.mp4): **70.000 segundos, 2100 fotogramas, 30 FPS, 1080 × 1920, H.264/AAC, BT.709, inicio rápido**.
- [Miniatura vertical](miniatura_vertical.jpg), extraída del gancho del propio video.
- [Reporte de calidad](REPORTE_CALIDAD.md) y [validación técnica](validacion_tecnica.json).
- [Retención segundo por segundo](REPORTE_RETENCION.md), [datos](retencion.json) y [revisión editorial](revision_editorial.json).
- [Comparación de ritmo](comparacion_ritmo_AB.mp4): episodio01 a1.25× frente a episodio02 a1.0×. Temas distintos; la comparación evalúa montaje y energía, no igualdad de contenido.
- [Primera propuesta conservada](version-01/episodio_02_tiempo_70s.mp4), con [fuente histórica](version-01/README.md).
- [Subtítulos SRT](subtitulos.srt), [marcas reales](alineacion_audio_real.json) y [fotogramas inspeccionados](inspeccion_final.jpg).
- [Código e instrucciones](../../src/episodios/episodio-02-tiempo/README.md), [guion](../../src/episodios/episodio-02-tiempo/GUION.md), [fuentes científicas](../../src/episodios/episodio-02-tiempo/CIENCIA.md) y [recursos usados](../../src/episodios/episodio-02-tiempo/RECURSOS.md).
- [Narración final](../../public/episodios/episodio-02-tiempo/audio/narracion.flac), [toma original](../../public/episodios/episodio-02-tiempo/audio/narracion_original.flac), [master](../../public/episodios/episodio-02-tiempo/audio/mezcla_master.flac), [música](../../public/episodios/episodio-02-tiempo/audio/musica_original.flac) y [efectos](../../public/episodios/episodio-02-tiempo/audio/efectos_originales.flac).

## Verificado sobre el archivo final

SHA-256: `cea46e757723357d8ddd03013993f757580df2ee3caad8c1fa6f493449d2c34f`. Tamaño: **20176625 bytes**. Los reportes técnico, de voz, retención y navegador corresponden al mismo hash.

- Decodificación completa de2100fotogramas, todos distintos, sin errores ni intervalos negros.
- Voz integrada: desfase global medido 0.0ms; correlación mínima 0.98780 en ocho escenas.
- Mezcla -14.06LUFS; pico verdadero -1.87dBTP.
- Chromium reprodujo el MP4 completo: ended=true,70s,2100fotogramas contabilizados y 3 descartados por el reproductor de prueba (0.14%). El archivo codificado conserva sus2100fotogramas y pasó la decodificación íntegra; no se presenta la medición del reproductor como pérdida de cuadros del archivo.
- Cero silencios de voz >0.7s, cero posibles repeticiones, cero desajustes de eventos y cero finales de narración anticipados.
- Una alerta de diferencia visual baja,43.25–45.50s, conservada y revisada: la acción de hojear y recuperar el detalle ocurre en la libreta mientras el fondo permanece estable. La decisión y los fotogramas reales están documentados; no se altera el umbral para ocultarla.
- Los68PNG aprobados y ambos MP4 del episodio01 conservan sus hashes. Se emplean18ilustraciones aprobadas. Se mantiene el catálogo previo y se registra la nueva composición;31composiciones verificadas.

## Voz, costo y apertura

Voz masculina mexicana **Aldo/Piper local**:189palabras,46grupos de subtítulos y48eventos principales, además de acciones secundarias por palabras. Las marcas proceden de duraciones de fonemas emitidos, comprobadas contra muestras reales; no se estiman por longitud del texto. La voz no se altera en la reinvención visual y no hay sincronización labial.

**Cero créditos externos y cero generaciones de pago.** Música y efectos son síntesis original. La apertura utiliza un reloj ambiental2.5D realizado en Remotion durante≤3s; no es un clip hiperrealista generado. Se incluye [prompt opcional3D](../../src/episodios/episodio-02-tiempo/PROMPT_3D.md) para una sustitución futura sin generar ni cobrar ese material ahora.

## Rama y reproducción

Rama `episodio-02-tiempo`, apilada sobre el PR#8 todavía abierto. Se prepara un PR para revisión, sin fusión automática.

Para ver el archivo localmente, servir esta carpeta medianteHTTP y abrir `reproducir.html`, o descargar el MP4 y abrirlo con el reproductor del teléfono. La entrega no depende de que GitHub muestre una previsualización de archivos binarios.

Límites comprobados antes de subir: repositorio público de320664KiB antes de esta rama; el MP4 final ocupa20176625bytes, por debajo de50MiB de advertencia y100MiB de límite por archivo. Los pesos del modelo y los WAV intermedios se mantienen fuera de Git.

# Validación de entrega · Episodio 01

**Estado: montaje 2D renderizado y reproducible; narración pendiente de autorización.**

Video: `episodio_01_cerebro_70s.mp4` · 34,772,036 bytes (33.16 MiB). SHA-256: `94823947e3ec9127d7736646607badb26cd2f44e2b697ed15013fc8dfdce1f0d`.

| Comprobación | Resultado |
| --- | --- |
| Resolución y FPS | 1080 × 1920 · 30 FPS |
| Duración | 70.000 s en video y audio |
| Fotogramas | 2100 de 2100; 2100 imágenes distintas |
| Video | H.264 · YUV420p · BT.709 · rango TV · inicio rápido |
| Audio | AAC estéreo · 48 kHz; música y efectos originales |
| Nivel integrado / pico verdadero | -24.02 LUFS / -12.49 dBTP |
| Decodificación completa | Correcta; sin pantallas negras detectadas |
| Chromium HTML5 | Reprodujo los 70 s a velocidad 1×, sin error |
| Fotogramas mostrados / perdidos | 2100 / 0 |
| Audio decodificado en navegador | 1,723,909 bytes; prueba automatizada silenciada |
| Recursos aprobados | 68 PNG verificados por SHA-256 y decodificación; intactos |
| Composiciones anteriores | 27 conservadas, incluida la del piloto |
| TypeScript | `npm run typecheck`: correcto |
| Miniatura | JPEG vertical 1080 × 1920, extraído del MP4 final |

Se inspeccionaron encuadres de las ocho escenas y una hoja de contacto extraída del MP4. Se corrigieron un patrón de fondo demasiado marcado y la persistencia del cerebro durante el acercamiento a la sinapsis. Las transiciones mantienen imagen continua y los títulos se colocan fuera del movimiento de cámara. La validación inicial se ejecutó prematuramente durante el cierre del contenedor; se repitió tras terminar FFmpeg y pasó. El render ahora publica el nombre definitivo solo después de finalizar la codificación.

## Dependencias pendientes

- **Voz:** falta `public/episodios/episodio-01-cerebro/audio/narracion_original.mp3`. La voz Juan de ElevenLabs vía Higgsfield cotiza **2.55 créditos** para el guion definitivo. Solo se consultó el costo; no se envió ninguna generación de pago. Se solicitó autorización porque el punto 3 indica no gastar créditos sin ella.
- **Subtítulos:** el renderizador y el alineador acústico están preparados. `captions.json` está vacío; no se fabricaron marcas temporales. La sincronización de voz/subtítulos no se declara validada hasta incorporar el audio real.
- **3D:** no existe un clip aprobado de cerebro. La apertura es 2D; hay un espacio reemplazable de 3 s y un prompt separado. No se gastaron créditos de video ni imagen.

El MP4 actual contiene textos editoriales animados, música y efectos; **no contiene narración** y se entrega para revisión visual, no como publicación final con locución terminada.

## Archivos

- `src/episodios/episodio-01-cerebro/`: composición, componentes, guion, configuración, subtítulos preparados, recursos y prompt pendiente.
- `scripts/episodio-01-cerebro/`: render, mezcla, alineación real de una futura locución, validación y reproducción.
- `public/episodios/episodio-01-cerebro/audio/`: pistas FLAC originales y bus maestro sin pérdida; procedencia documentada.
- `output/episodio-01-cerebro/`: MP4, miniatura, reproductor HTML y reportes JSON.
- `src/Root.tsx`: solo importa y registra la composición nueva.
- `package.json`: añade tres comandos; no cambia dependencias.
- `.gitignore`: excluye WAV de trabajo, capturas de inspección y renders intermedios del episodio.

## Tamaño y repositorio

Antes de subir binarios se comprobó que el repositorio es público y ocupa 187095 KiB según la API de GitHub. El MP4 de 33.16 MiB y cada FLAC están por debajo del umbral de aviso de 50 MiB y del límite de 100 MiB por archivo de GitHub. No se incluyen los WAV de trabajo ni el render intermedio de 41.4 MB. No se fusiona ningún PR.

Instrucciones completas de renderizado y recursos: `src/episodios/episodio-01-cerebro/README.md` y `RECURSOS.md`. Reportes verificables: `validacion_tecnica.json`, `reproduccion_navegador.json` y `audio_produccion.json`.

# Episodio 06 · Mochila de emergencia y reservas

**¿Qué necesitas para sobrevivir 72 horas o 7 días sin servicios básicos?** La composición `Episodio06MochilaEmergencia` reúne ocho escenas animadas en 2D. Usa 1080 × 1920, 30 FPS y 2,100 fotogramas. La narración Grady y los subtítulos están sincronizados en español.

La ciudad, la cocina, el personaje aprobado, la radio y las provisiones se reutilizan desde sus archivos de origen. Las 24 ilustraciones nuevas están en `public/episodio-06/ilustraciones`. [Prompts y referencias](RECURSOS_PLAN.json).

Las marcas de voz están en `timeline.json`. El guion conserva sus 177 palabras. La toma de 82.991 s se ajustó recortando 6.848 s de centros de pausas y aplicando un factor de ritmo de 1.08838 con el tono preservado. Las entradas de escena siguen el audio. [Revisión de la información](CIENCIA.md).

## Vista previa y exportación

Abrir `Episodio06MochilaEmergencia` en Remotion Studio. Para repetir las comprobaciones desde la raíz del repositorio, usar Python con Pillow y NumPy y configurar `FFMPEG_PATH` con un ejecutable funcional de FFmpeg junto a FFprobe. El paquete de render sirve los recursos directamente desde sus archivos fuente para ahorrar espacio.

```powershell
python scripts/episodio-06-mochila-emergencia/auditar_recursos.py
node node_modules/typescript/bin/tsc --noEmit
node scripts/episodio-06-mochila-emergencia/revisar-reservas.mjs 20 2099 60
& $env:FFMPEG_PATH -v error -i public/episodio-06/audio/narracion_grady_70s.wav -c:a aac -b:a 173k -ar 48000 -ac 1 -t 70 output/episodio-06-emergencia/narracion_grady_192k.m4a
node scripts/episodio-06-mochila-emergencia/renderizar-final.mjs
python scripts/episodio-06-mochila-emergencia/verificar_final.py
```

La calibración AAC está en `output/episodio-06-emergencia/aac-calibracion.json`. El renderizador entrega el MP4 fuera de Git, en `../../outputs/episodio06_FINAL_GRADY_70s.mp4`. [Informe de producción](INFORME.md).

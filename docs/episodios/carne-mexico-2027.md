# ¿Por qué comer carne podría ser más caro en México en 2027?

Episodio independiente de 70 segundos, 2.100 fotogramas a 30 FPS, 1080 × 1920. Composición `CarneMexico2027`. Se conserva la composición y los recursos anteriores.

## Información editorial

Los porcentajes son proyecciones para 2027 atribuidas al Consejo Mexicano de la Carne: res 6 %, cerdo 4,8 %, pollo 3,3 %. No son aumentos confirmados. La carne de res de $250 y su posible precio de $265 son un ejemplo hipotético, no una cotización comercial.

Fuentes consultadas:

- [Uno TV, 5 de noviembre de 2026](https://www.unotv.com/negocios/incremento-proteinas-pollo-cerdo-res-2027/).
- [La Jornada, 8 de noviembre de 2026](https://www.jornada.com.mx/2026/11/08/economia/012n1eco).

No se atribuyen aranceles, restricciones comerciales, frecuencias de robo ni volúmenes comerciales a los mapas. Las rutas se señalan como esquemas ilustrativos.

## Voz y sincronización

Una generación autorizada de Higgsfield, modelo `elevenlabs_v4`, voz Grady preset `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`, costo cotizado y autorizado: **4,60 créditos**. Trabajo `e7b9a6e4-3b2a-4d58-aa3d-bd8ff7c87b0d`. No se requieren nuevas generaciones.

La narración original dura 66,194 segundos. Se divide en siete segmentos en pausas detectadas y se conservan todas las palabras, a velocidad 1. Se distribuyen las pausas de montaje dentro de los 70 segundos. La voz entra a unos 0,13 segundos; el cierre termina después de la pregunta. La transcripción automática se corrige para representar el texto aprobado y agrupar los numerales. Los tiempos de palabras, cortes y señales están en `public/episodios/carne-mexico-2027/sincronizacion.json`.

## Recursos y animación

Se reutilizan los PNG aprobados `01_neutral.png` y `11_sorprendido.png` con máscaras y pivotes separados de cabeza, torso y antebrazos. Los pies permanecen plantados. No se simulan caminatas con un personaje desplazado.

Los escenarios, productos, camión, vacas, báscula y carrito son vectores originales del episodio, dibujados en React/SVG con la paleta cálida, contornos y acentos turquesa de los recursos del proyecto. Las ruedas, suspensión, dirección, ganado, puertas, objetos y reflejos tienen movimientos propios. No se utiliza video generado por IA ni software 3D.

Los contornos de Estados Unidos y México proceden de [Natural Earth 1:110m](https://www.naturalearthdata.com/about/terms-of-use/), de dominio público. Música instrumental y efectos sintetizados localmente para este episodio, sin muestras de terceros. No hay cargos ni licencias de una biblioteca musical externa.

El [plan por segundo](carne-mexico-2027-plan-70s.md) contiene los 70 registros previos a la animación. Los cambios de escena combinan corte, máscara circular y barrido de 0,32 segundos. Los subtítulos acompañan a la misma secuencia de audio, en frases breves dentro del área segura. Las animaciones no se basan en zooms repetitivos.

## Revisión y exportación

Se prepara una vista previa de los primeros diez segundos y una revisión ligera del episodio. El control incluye los primeros 90 fotogramas, dos capturas por segundo, revisión visual de anatomía, legibilidad y continuidad, y detección de actividad en ventanas móviles de un segundo excluyendo los subtítulos. La actividad de píxeles ayuda a detectar planos congelados; no garantiza retención de audiencia.

Comandos desde la raíz del repositorio:

```bash
npm ci
npx tsc --noEmit
npx remotion studio src/index.ts
npx remotion render src/index.ts CarneMexico2027 out/carne-preview-10s.mp4 --frames=0-299 --scale=0.5 --codec=h264 --audio-codec=aac --crf=25 --concurrency=2 --browser-executable=/usr/bin/chromium
bash scripts/renderizar_carne_2027.sh
```

El render requiere Chromium; `REMOTION_BROWSER` permite indicar otra instalación. El control técnico usa FFmpeg/FFprobe, Python 3 y NumPy. `EPISODE_OUTPUT_DIR` cambia el directorio de salida y `REMOTION_CONCURRENCY` limita los procesos. Los WAV, subtítulos y vectores ya están preparados y no necesitan regenerarse. Opcionalmente, `scripts/preparar_carne_2027.py` reproduce la preparación local sin volver a solicitar la voz.

El script final conserva los fotogramas H.264 y ajusta el relleno AAC a 70 segundos exactos. El informe JSON verifica duración, 2.100 fotogramas, resolución, FPS, códecs, plan completo y huella del audio aprobado.

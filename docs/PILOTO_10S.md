# Corazón al Límite · Piloto audiovisual de 10 segundos

**Archivo final:** [`output/corazon_al_limite_piloto_10s.mp4`](../output/corazon_al_limite_piloto_10s.mp4).

- [Reproducir el MP4 completo en el navegador](https://cdn.jsdelivr.net/gh/hermmez/corazon-al-limite.@piloto-corazon-10s/output/corazon_al_limite_piloto_10s.mp4).
- [Descarga directa desde GitHub](https://github.com/hermmez/corazon-al-limite./raw/refs/heads/piloto-corazon-10s/output/corazon_al_limite_piloto_10s.mp4).
- [Narración original](../public/piloto10s/audio/narracion_original.mp3).
- [Subtítulos SRT](../output/piloto_subtitulos.srt) y [palabras alineadas en JSON](../output/piloto_subtitulos.json).
- [Reproductor local](../output/reproducir_piloto.html).

## Resultado verificado

| Propiedad | Resultado |
| --- | --- |
| Duración de video y audio | 10,000000 segundos |
| Imagen | 1080 × 1920, 9:16, 30 FPS, 300 fotogramas |
| Video | H.264, YUV420p, rango estándar, BT.709, MP4 fast-start |
| Audio | AAC-LC estéreo, 48 kHz, 192 kb/s |
| Mezcla final | −14,09 LUFS integrados; pico real −1,98 dBTP |
| Locución original | 8,751 s, velocidad 1, sin aceleración ni estiramiento |
| Última palabra | Termina en 8,84 s del montaje |
| Subtítulos | 18 palabras; grupos de 2–4; marcas reales de audio |
| Decodificación completa | FFmpeg sin errores ni intervalos negros |
| Reproducción | Chromium reprodujo los 10 s, 300 fotogramas, 0 perdidos y AAC decodificado |
| Ilustraciones | Los 68 PNG aprobados mantienen sus hashes originales |

Informes reproducibles:

- [`piloto_validacion_tecnica.json`](../output/piloto_validacion_tecnica.json).
- [`piloto_reproduccion_navegador.json`](../output/piloto_reproduccion_navegador.json).
- [`piloto_sincronia_audio.json`](../output/piloto_sincronia_audio.json).
- [`piloto_audio_produccion.json`](../output/piloto_audio_produccion.json).
- [`piloto_transcripcion_original.json`](../output/piloto_transcripcion_original.json).
- [`piloto_entrega.json`](../output/piloto_entrega.json).

## Dirección y recursos

| Tiempo | Acción |
| --- | --- |
| 0–2 s | Reacción de sorpresa, entrada de cámara y «¿DUERMES POCO?» |
| 2–5 s | El corazón nace sobre el pecho y ocupa el plano; pulsación y circulación SVG; «PRESIÓN ARTERIAL ↑» con el matiz «PUEDE ELEVARSE» |
| 5–8 s | Desplazamiento hacia personaje cansado y corazón; reloj y plano dividido; se mantiene visible que el poco descanso es habitual |
| 8–10 s | Regreso al personaje explicando, corazón junto a él y cierre de marca |

El corazón es un elemento continuo entre los planos. La transición circular parte
del pecho, el corazón cambia de tamaño/posición y el movimiento lateral introduce
la consecuencia. Las poses, la respiración, los parpadeos, los pulsos, las partículas
y el paralaje se animan con fotogramas de Remotion, `spring()` e `interpolate()`.
Los títulos se revelan mediante máscaras y los subtítulos enfatizan palabras del habla.

Se usan los PNG oficiales `11_sorprendido`, `05_cansado`, `02_explicando` y
`anatomia/03_corazon_humano`. Todas las imágenes conservan su proporción.
No se utilizan stock, imágenes antiguas ni personajes de otras bibliotecas.

Higgsfield estaba disponible. Se creó **un** clip de movimiento suave con Kling 3.0
Turbo a partir del PNG aprobado de sorpresa. Se conserva la identidad y se usa
la región original de la boca como capa fija para impedir simulación de habla.
El audio nativo del clip se silencia. Los demás planos se animan directamente
en Remotion. El clip conserva la proporción 2:3 de la ilustración y se integra
dentro de la composición final 9:16; no se estira.

La tipografía Manrope se incluye localmente con su licencia OFL. No necesita
consultar servidores de fuentes para renderizar.

## Voz y precisión médica

Texto hablado final, abreviado para terminar naturalmente dentro del piloto:

> ¿Duermes poco? Si es habitual, puede elevar tu presión arterial y el riesgo
> cardiovascular. Tu corazón necesita descanso.

La voz real se generó con **ElevenLabs a través de Higgsfield**, preset masculino
Juan del catálogo. Se comprobó saldo antes de solicitar la generación. No se leen
ni se publican claves de API. Los identificadores de trabajo y las cotizaciones
previas están en `src/Piloto10s/production.json`; no se ejecutan generaciones al
renderizar de nuevo los recursos entregados.

Se mantuvieron los calificadores «si es habitual» y «puede». El piloto no afirma
que una noche concreta produzca enfermedad ni cuantifica un riesgo individual.
La referencia a menos de seis horas se omitió en la abreviación para evitar una
locución forzada y presentar el mensaje general con claridad.

Referencias del contenido:

- [NHLBI: efectos de la falta de sueño](https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects).
- [CDC: sueño y salud cardiovascular](https://www.cdc.gov/heart-disease/about/sleep.html).

## Subtítulos y sonido

Se transcribió el MP3 real con faster-whisper 1.2.1, modelo multilingüe `base`,
CPU/int8. Se usó FFmpeg para decodificarlo. Este entorno no dispone de GPU para
Whisper WebGPU. Se verificaron las 18 palabras contra el guion; únicamente se
corrigió la ortografía de «Duermes» conservando las marcas temporales del modelo.
Los tiempos no se distribuyen por longitud del texto.

El desplazamiento de voz de 180 ms se verificó contra el AAC final mediante
correlación de la forma de onda. Los subtítulos quedan dentro del área segura,
con letra gruesa, contraste alto y sin cubrir caras ni anatomía.

La música, el sonido de entrada, las transiciones y el latido suave se sintetizaron
originalmente mediante `crear_audio.py`. No contienen samples ni música de terceros.
Se entregan las pistas individuales, la narración y el máster. La música baja
durante el habla; la mezcla incluye fundidos y normalización con margen de pico.
El origen de cada archivo figura en
[`ORIGEN_Y_DERECHOS.md`](../public/piloto10s/audio/ORIGEN_Y_DERECHOS.md).

## Renderizar de nuevo

Los recursos de voz, video, fuente y mezcla ya están incluidos. Para repetir la
exportación no se necesitan servicios de pago ni Python:

```bash
npm ci
npm run typecheck
npm run render:piloto10s
npm run validate:piloto10s
node scripts/piloto10s/comprobar_navegador.mjs
```

Se requieren FFmpeg/FFprobe y Chromium. El script usa `/usr/bin/chromium` cuando
existe y la resolución de navegador de Remotion en los demás entornos.
El pase final de entrega fija rango de video estándar, fast-start y AAC desde
el mismo bus PCM usado por Remotion, para evitar recodificar audio AAC previamente.

Para editar en Studio:

```bash
npm run dev -- --no-open
```

Abrir `http://localhost:3000/CorazonPiloto10s`.
Para ver únicamente el archivo exportado, servir la carpeta de salida:

```bash
python -m http.server 4173 --directory output
```

Abrir `http://localhost:4173/reproducir_piloto.html`.

## Regenerar subtítulos o mezcla

```bash
python -m venv .venv-audio
# Activar el entorno virtual según el sistema operativo.
python -m pip install -r scripts/piloto10s/requirements.txt
python scripts/piloto10s/transcribir.py
python scripts/piloto10s/crear_audio.py
npm run render:piloto10s
npm run validate:piloto10s
```

Whisper descarga su modelo la primera vez. La narración no se acelera si no cabe:
el script rechaza un audio demasiado largo y requiere ajustar el guion y grabarlo
de nuevo. La mezcla puede generarse con otra duración mediante `--duration`.

## Componentes y futuros episodios de 70 segundos

| Archivo | Función reutilizable |
| --- | --- |
| `index.tsx` | Montaje del piloto, secuencias y fuente local |
| `Scenes.tsx` | Cuatro escenas con entradas y salidas conectadas |
| `Character.tsx` | Personaje, proporciones, respiración, parpadeos y boca fija |
| `Anatomy.tsx` | Corazón pulsante, posición configurable, circulación y reloj |
| `Stage.tsx` | Fondo, cámara 2D, paralaje e identidad |
| `Titles.tsx` | Títulos con tiempos, tamaños y máscaras configurables |
| `Captions.tsx` | Renderizador de palabras con JSON de subtítulos intercambiable |
| `Soundtrack.tsx` | Máster y subtítulos como grupo compartido, con fuentes configurables |
| `motion.ts` | Curvas de movimiento y trayectoria continua del piloto |
| `production.json` | Guion, tiempos, recursos, grupos de palabras y procedencia |

Para un episodio de 70 segundos se registra **otra** composición de 2100 fotogramas,
se define su guion/voz/alineación y se reutilizan estos componentes con nuevos tiempos
y posiciones. `SceneTitle` admite intervalos arbitrarios; `Heart` acepta posición;
los subtítulos y el bus de sonido aceptan nuevos datos/archivos. La trayectoria
`heartPose` y el montaje de este piloto permanecen independientes de ese futuro
episodio. No se estira el video de diez segundos para rellenar setenta.

Los binarios se revisaron antes de subirlos: el MP4 final pesa 3,73 MB y todos los
archivos nuevos están por debajo de 50 MiB, además del límite de 100 MiB por
archivo de GitHub. Se conservan todas las composiciones y los entregables anteriores.

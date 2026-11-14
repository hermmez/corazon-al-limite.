# Un día vas a extrañar este momento

Nuevo episodio independiente de Corazón al Límite. El archivo del episodio
anterior, sus recursos y su registro de 2.700 fotogramas se conservan.

## Especificación

- Composición: `UnDiaVasAExtranarEsteMomento`.
- 1080 × 1920, 30 FPS, 2.100 fotogramas: 70 segundos de imagen.
- Animación 2D por código Remotion; sin generación de video de IA.
- Entrega: MP4 H.264, yuv420p, audio AAC.
- Registro adicional de las siete escenas para revisión independiente en Studio.

## Voz autorizada

Se cotizó el texto completo y se esperó la autorización del usuario antes de
generarlo. Una única generación autorizada por **3,91 créditos de Higgsfield**.
Modelo `elevenlabs_v4`, Grady preset,
`e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`.
Trabajo: `539d9283-11e4-4f42-a1e0-684ba482aba6`.

El original dura 54,125714 segundos una vez decodificado. La transcripción local
en español coincide con las 137 palabras autorizadas. Esto verifica el contenido,
no certifica por sí solo el acento o la calidad interpretativa. Se solicitó al
usuario su valoración auditiva de Grady durante la preparación del montaje.

No se acelera ni ralentiza la voz. No se estiran palabras. Los siete cortes se
realizan dentro de pausas del original; se conserva el ritmo dentro de cada toma.
El tiempo adicional hasta 70 segundos corresponde a acciones visibles y a la
fotografía final, siempre acompañado por música y ambiente.

| Escena | Inicio en video | Intervalo del audio original | Acción entre frases |
|---|---:|---:|---|
| Gancho | 0 s | 0–5,4 s | Mano, fotografía, recuerdo |
| Después hablamos | 7 s | 5,4–13,15 s | Rechazo y madre esperando |
| La última vez | 17 s | 13,15–21,15 s | Desaturación, sillas vacías |
| Futuro | 27 s | 21,15–30,1 s | Reloj, cansancio, fotografía |
| Oportunidad | 38 s | 30,1–37,35 s | Se detiene y devuelve la llamada |
| Reencuentro | 49 s | 37,35–46,7 s | Llamada, abrazo, comida, amigos |
| Era suficiente | 60 s | 46,7–54,125714 s | Familia, fotografía, frase final |

El manifiesto `public/episodios/un-dia-vas-a-extranar-este-momento/produccion.json`
guarda el texto cotizado, las pausas orientativas, los tiempos y el hash del audio.

## Recursos e identidad

- Se reutilizan el protagonista, sus expresiones y los interiores aprobados de
  `public/imagenes/` sin modificar los archivos originales.
- Se añaden únicamente la oficina, los padres y las interacciones que no existían.
  Las ilustraciones nuevas usan como referencias los recursos originales.
- `padres.png` e `interacciones.png` son atlas RGBA: sus regiones se aíslan mediante
  viewBox y máscaras, sin modificar las bibliotecas anteriores.
- Cabezas y brazos tienen pivotes independientes. Las poses no se trasladan por
  la pantalla como recurso principal. Las máscaras conectan teléfono, recuerdo,
  espacios y fotografía final.
- Subtítulos en JSON con tiempos de palabra obtenidos del audio real. Grupos
  cortos, tamaño 50 px, contraste oscuro, margen derecho 153 px e inferior 365 px.
- No hay logo inicial, barra de progreso, cabecera permanente ni créditos finales.

## Música y efectos

`musica-original.wav`: composición instrumental original creada para este encargo,
sin muestras ni grabaciones de terceros. Arpegios suaves con acordes D add9,
Bm7, Gmaj7 y Asus4, y una capa tenue de cuerdas sintetizadas hacia el cierre.
Preparada para acompañar este video en TikTok y Facebook; no se utilizó música
comercial ni una licencia de biblioteca que deba renovarse.

`ambiente-y-efectos.wav`: vibración, pequeños contactos, teclas y ambiente
sintetizados localmente a volumen discreto. Sin voces añadidas ni créditos externos.
El programa `scripts/preparar_un_dia.py` reproduce estos recursos con semilla fija.
Requiere Python y NumPy; la transcripción ya está incluida para no repetir ASR.

## Revisión y reproducción

Antes de la exportación completa se generó una vista previa de los fotogramas
0–299 a 540 × 960 y se revisaron individualmente los primeros 90 fotogramas en
una hoja de contacto. También se revisaron fotogramas representativos de las
siete escenas. Se corrigieron el apoyo del teléfono, los límites de los atlas,
los recortes de cuerpo y el aislamiento del brazo que se acerca al teléfono.

La fotografía final se mantiene brevemente como pausa emocional deliberada.
No se ha medido retención de audiencia real: esto requiere publicar y revisar
las estadísticas de cada plataforma.

```bash
npm ci
npm run dev -- --no-open
npx tsc --noEmit
npx remotion render src/index.ts UnDiaVasAExtranarEsteMomento out/preview.mp4 \
  --frames=0-299 --scale=0.5 --codec=h264 --audio-codec=aac --crf=25
npx remotion render src/index.ts UnDiaVasAExtranarEsteMomento out/episodio.mp4 \
  --codec=h264 --audio-codec=aac --audio-bitrate=192k --crf=18 --pixel-format=yuv420p
```

En entornos con Chromium instalado se puede añadir
`--browser-executable=/usr/bin/chromium`. El render final se verifica con ffprobe
y una decodificación completa; la comprobación de 2.100 fotogramas es independiente
del redondeo del contenedor o de los paquetes AAC.

# DemoProfesional2DFluida

Copia independiente de la composición aprobada `DemoProfesional2D`.
Conserva sus personajes, órganos, recursos, paleta, fondos, textos, tipografía,
márgenes, orden y cuatro intervalos narrativos: 0–7, 7–15, 15–23 y 23–30 s.
El formato sigue siendo 1080 × 1920, 30 FPS y 900 fotogramas.

## Cambios limitados al movimiento

- Acercamiento a la cabeza con curvas de mínimo tirón y aceleración y desaceleración suaves.
- Máscaras SVG complementarias: el cerebro se revela en la posición de la cabeza;
  el regreso al personaje nace en el pecho mientras el corazón reduce su tamaño.
- Recorrido cerebro–corazón idéntico al aprobado, parametrizado por distancia
  para evitar que los cambios de curvatura aceleren y frenen la señal.
- Cámara guiada por esa señal, con una anticipación pequeña y sin saltos en los extremos.
- Señal por delante del órgano durante la llegada para que siga siendo visible.
- Respiración e inclinación con una fase compartida entre poses, sin cambios bruscos
  de frecuencia al cambiar de expresión.
- Movimientos secundarios contenidos de cerebro y corazón; ondas con entrada y salida
  suaves, sin aparición repentina al reiniciarse cada ciclo.
- Latido y gráfica cardíaca calculados con la misma fase temporal.
- Revelado vertical de los textos mediante spring y máscaras SVG; se conserva cada
  palabra, posición, tamaño y colores aprobados. Los títulos sucesivos no se superponen.
  Durante el cambio de fondo, la tinta principal usa el tono aprobado de mayor contraste,
  evitando que texto y fondo coincidan en un gris intermedio.

Se sustituyen los fundidos entre protagonistas por revelados ligados al movimiento.
No se añaden escenas, personajes, órganos, imágenes, sonidos ni elementos decorativos.
Los PNG originales permanecen intactos.

## Separación de la versión aprobada

Los archivos nuevos están en `src/DemoProfesional2DFluida.tsx` y
`src/DemoProfesional2DFluida/`. No se modifica ningún archivo de
`src/DemoProfesional2D/` ni su componente principal.
`src/Root.tsx` añade registros nuevos y conserva todos los anteriores.
Los MP4 aprobados y sus vistas previas mantienen sus nombres y bytes originales.

## Comprobaciones

```bash
npm run typecheck
npm run validate:demo
npm run validate:fluida
```

La validación de fluidez comprueba:

- Igualdad de la paleta, textos y rutas de medios con la versión aprobada.
- Estado finito y límites de cámara durante 900 fotogramas.
- Seguimiento de la señal con separación menor de 30 píxeles en pantalla.
- Espaciado uniforme de la trayectoria y extremos de cámara conservados.
- Reducción del máximo de desplazamiento, aceleración y cambio de zoom por fotograma.
- Progresión de máscaras y valores válidos de pulsación.

| Medida de cámara | Aprobada | Copia fluida |
| --- | ---: | ---: |
| Desplazamiento máximo, píxeles del mundo/fotograma | 20,82 | 9,28 |
| Aceleración máxima, píxeles del mundo/fotograma² | 1,98 | 0,85 |
| Cambio máximo de zoom/fotograma | 0,0343 | 0,0161 |

Estas medidas describen el movimiento; la revisión visual de las transiciones se
realiza también sobre fotogramas extraídos del MP4 completo.

## Vista previa y exportación

```bash
npm run dev -- --no-open
# http://localhost:3000/DemoProfesional2DFluida
npm run render:fluida
```

Con Chromium del sistema:

```bash
npm run render:fluida -- --browser-executable=/usr/bin/chromium --concurrency=2
```

Salida nueva: `out/demo-profesional-2d-fluida.mp4`.
También se entrega `out/demo-profesional-2d-fluida-vista-previa.mp4`, una copia
ligera de los mismos 30 segundos, 720 × 1280, H.264 Main, YUV420p e índice MP4
al principio para facilitar la reproducción en dispositivos móviles.

- [Descarga directa de la vista previa](https://github.com/hermmez/corazon-al-limite./raw/refs/heads/demo-profesional-2d-fluidez/out/demo-profesional-2d-fluida-vista-previa.mp4).
- [Descarga directa del original de 1080p](https://github.com/hermmez/corazon-al-limite./raw/refs/heads/demo-profesional-2d-fluidez/out/demo-profesional-2d-fluida.mp4).
- [Informe de verificación](../out/demo-profesional-2d-fluida-verificacion.json).

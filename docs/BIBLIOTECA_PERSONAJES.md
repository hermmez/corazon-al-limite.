# Biblioteca del personaje educativo 2D

Las primeras cinco pruebas son PNG individuales, generados uno por uno con la misma referencia maestra. Están en `public/imagenes/personajes/`:

1. `01_neutral.png`
2. `02_explicando.png`
3. `03_senalando_derecha.png`
4. `04_pensando.png`
5. `05_cansado.png`

## Especificación y límites

- Resolución nativa de las pruebas: **1024 × 1536**, sin reescalado artificial. Se pidió más resolución, pero el generador disponible entregó este tamaño. Sirve como personaje dentro de un video 1080 × 1920; evitar ampliaciones fuertes para primeros planos.
- PNG RGBA con fondo realmente transparente; no se ha dibujado un tablero de cuadros. Se inspeccionaron también sobre blanco. El RGB oculto en áreas transparentes puede aparecer como halo en visores que ignoran el alfa.
- El generador entrega alfa máximo 254/255: el interior es casi opaco, no exactamente 255. Se conserva el original sin modificar. El validador exige fondo alfa 0 y suficiente superficie con alfa ≥245.
- Cada archivo es una pose completa. Admite movimiento, escala, rotación, fundidos y cambios de pose en Remotion. No contiene capas separadas ni un esqueleto para articular brazos, boca o piernas.
- Hay variaciones pequeñas de encuadre entre poses. Usar la misma caja de presentación y revisar la alineación al cambiar de pose; `anchor` es una convención de colocación inferior central, no una articulación detectada.

## Uso en Remotion

```tsx
import {Img, staticFile} from 'remotion';

<Img
  src={staticFile('imagenes/personajes/02_explicando.png')}
  style={{
    position: 'absolute',
    height: 1350,
    width: 900,
    objectFit: 'contain',
    bottom: 80,
    left: 90,
    transformOrigin: '50% 98%',
  }}
/>
```

Ejemplo de colocación para lienzo 1080 × 1920. El PNG no depende del frame rate. El código de las composiciones existentes no se ha modificado.

## Continuar las 25 pendientes con una sola instrucción

El archivo `public/imagenes/personajes/manifest.json` contiene las 30 poses, sus nombres y los prompts completos. Las cinco pruebas tienen estado `generated`; las otras 25, `pending`.

Referencia permanente: `public/imagenes/referencias/personaje-maestro.png`. Usar siempre esa referencia original, sin encadenar imágenes nuevas como referencia, para reducir cambios del personaje.

Instrucción para continuar en una sesión con generación de imágenes y acceso a GitHub:

> Continúa las 25 poses pendientes del manifiesto de hermmez/corazon-al-limite. Usa la referencia maestra, genera cada PNG individual con fondo transparente mediante la herramienta integrada, una llamada por pose y en orden. No generes collages ni me pidas confirmación entre imágenes. Revisa identidad y transparencia, copia cada resultado al nombre previsto, actualiza estado, dimensiones y SHA256 en el manifiesto, valida y sube lotes de cinco. Verifica cada lote descargándolo desde GitHub y comparando SHA256. Reanuda desde el primer pendiente si se interrumpe. No sustituyas los cinco archivos existentes. Informa si una limitación real impide continuar.

Este proceso se ejecuta durante una sesión activa. No hay un servicio de generación en segundo plano ni una tarea programada instalada. No requiere clave API para la herramienta integrada. Una automatización externa con API sería un proceso distinto y requeriría configuración y facturación propias.

## Comprobación y reanudación

```bash
python -m pip install Pillow
python scripts/personajes.py
python scripts/personajes.py --pending
python scripts/personajes.py --all
```

El primer comando de validación acepta pendientes; `--all` falla hasta completar las 30. `--pending` devuelve la cola y los prompts sin necesitar Pillow. El script no genera ni altera imágenes.

Por cada imagen nueva:

1. Leer el siguiente pendiente y generar con la referencia maestra usando la herramienta de imágenes; no usar API de pago como sustituto silencioso.
2. Inspeccionar cara, ropa, anatomía, pose única, encuadre y composición sobre blanco y oscuro. Si falla, regenerar solo esa pose.
3. Copiar el PNG sin reescalar. Registrar `status: generated`, dimensiones reales, SHA256 y resultado de revisión visual.
4. Ejecutar el validador. Hacer commit y push cada cinco imágenes, sin sobreescribir cambios remotos.
5. Descargar el commit de GitHub en un checkout nuevo y validar allí para confirmar que los bytes publicados son los correctos.

El SHA256 identifica bytes exactos y permite verificar la subida. La revisión visual de identidad y anatomía sigue siendo necesaria; el validador numérico no puede certificarla.

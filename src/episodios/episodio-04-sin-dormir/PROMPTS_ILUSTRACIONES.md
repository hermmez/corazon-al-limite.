# Prompts ejecutados · ImageGen integrado

Una solicitud por recurso; las imágenes de entrada son referencias de estilo, no archivos que deban sustituirse. No se usaron modelos ni servicios de créditos externos.

## automovil-teal-vista-trasera.png

Referencias: `public/imagenes/personajes/01_neutral.png`, `public/imagenes/escenarios/01_dormitorio.png`. `transparent_background: true`.

```text
Use case: illustration-story. Create ONE individual production PNG asset for episode 04 of Corazón al Límite. Input image 1 is an approved character/style reference; image 2 is an approved environment/style reference. Match their hand-drawn 2D cartoon line weight, clear dark contours, cel shading, degree of detail and teal/navy/cream warm palette. Primary request: a complete detailed compact teal passenger car seen directly from behind with a slight view of its roof, suitable to place over a road in a vertical 1080x1920 animation. Include recognizable rear window, two headrests, side mirrors, panel seams, rear lamps, bumper, visible tires, license plate with no writing, subtle cel-shaded highlights. Symmetric perspective and wheels aligned to a flat ground plane. Full vehicle, no cropping, about 15% transparent padding. Car occupies at least 1200 pixels across; high-resolution clean edges. Pure 2D illustration, no 3D render, no volumetric lighting. No character, no road, no scenery, no cast ground shadow, no text, no logo, no watermark, no grid, no collage. Real transparent alpha background. Use the approved inputs only as visual style references; do not redraw or alter their files.
```

## carretera-nocturna-sin-vehiculo.png

Referencia: `public/imagenes/escenarios/01_dormitorio.png`. `transparent_background: false`.

```text
Use case: illustration-story. Create ONE complete background illustration for a 1080x1920 vertical Corazón al Límite animation. Approved reference image is the room: preserve its 2D cartoon illustration language, dark crisp contours, layered cel shading, moderate detail and teal, navy, warm cream palette. Nighttime quiet suburban two-lane road seen from a low centered camera following a passenger car; the vehicle will be added separately and MUST NOT be drawn. Road leads toward a distant vanishing point near the center at 45% of the height. Recognizable asphalt, two shoulders, sidewalk, guardrail, distant houses with roofs and windows, leafy trees, streetlights, rolling hills, night sky. Foreground road takes lower 55% of image, suitable for placing a complete rear-view car around the lower middle. No center dashed lane markings in foreground: those will be animated separately; keep road edges clearly defined. Background painted as a single coherent environment, no empty schematic landscape. Full 2D cartoon, no 3D, no photorealism, no bloom. No cars, people, text, signs with writing, logo or watermark; no collage, no panels. High resolution vertical 2:3 or 9:16, enough resolution to crop to 1080x1920 without stretching. This is a new asset using the reference only for visual style.
```

La salida real mide 941 × 1672; se limitó su uso a 900 × 1600 en vez de ampliarla al lienzo completo.

## taza-cafe-con-plato.png

Referencia: `public/imagenes/escenarios/01_dormitorio.png`. `transparent_background: true`.

```text
Use case: illustration-story. Create ONE individual production object PNG for Corazón al Límite episode 04, matching the approved bedroom image used as visual style reference. A fully recognizable ceramic warm ivory coffee cup with teal rim and matching saucer, filled with dark coffee, viewed in gentle three-quarter side perspective; handle on right, tasteful cel-shaded cream/ochre contours and navy outline, clean hand-drawn 2D geometry and shading matching the approved reference. Cup and saucer form one single asset, fully in frame with transparent padding. Render a high-resolution 2048 by 2048 PNG with real alpha transparency, sharp contours, no ground shadow. No steam because it will be animated independently in Remotion. No background, table, scenery, text, molecular icons, logo, watermark, extra objects, collage, 3D or photoreal rendering. The reference is only a style/palette guide and must remain unchanged.
```

La salida real mide 1254 × 1254; se limitó su uso a 560 × 560. El vapor complementario se anima en una capa SVG independiente.

## personaje-descansando-en-cama.png

Referencias: `public/imagenes/personajes/01_neutral.png`, `public/imagenes/escenarios/01_dormitorio.png`. `transparent_background: true`.

```text
Use case: illustration-story. Create ONE 2D foreground illustration for Corazón al Límite. Reference 1 fixes the exact approved male character identity: same friendly face, short swept brown hair, warm skin, large brown eyes (now closed), same body proportions and teal T-shirt. Reference 2 fixes the bedroom style, bed design, palette, dark outlines and moderate cel shading. Primary request: this same character sleeping peacefully IN a complete wooden bed, head visibly resting on an ivory pillow at the RIGHT, body stretched naturally under a teal blanket toward the foot at the LEFT. Both hands rest naturally on the blanket, eyes closed. A full, recognizable bed with wood headboard, mattress, pillows, blanket folds, footboard, all bed legs and no cropped parts. Three-quarter view from foot-left toward head-right, consistent with the approved bedroom reference. Complete bed and sleeper are ONE foreground layer to put over a room; no floating character, no shoes on the bed, no separate floating objects. Preserve the exact original face/hair design and dark contour weight, teal/navy/cream/wood palette, pure 2D drawing with cel shading. High resolution, at least 1536px wide if possible, bed framed in a horizontal 3:2 canvas with transparent padding around every edge. Real transparent alpha outside bed and person. NO walls, floor, window, nightstand, surroundings, lettering, text, logo, watermark, collage, photoreal shading, 3D render or perspective model. Do not edit or overwrite the source references.
```

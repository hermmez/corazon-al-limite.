# Corazón al Límite — Episodio 09

**¿Cómo un pequeño fusible puede evitar un incendio?**

Composición `Episodio09`: 1080 × 1920, 30 fps, 2100 fotogramas, 70 s exactos. Implementación exclusivamente 2D en Remotion, con escenas independientes editables en Studio.

## Estado de entrega

- Ocho escenas, ilustraciones eléctricas por capas, calentamiento, fusión, circuito abierto, comparación y advertencia implementados.
- MP4 de revisión: `out/episodio-09/episodio-09-BORRADOR-sin-voz.mp4`. H.264, muestreo 4:2:0, pista AAC **silenciosa**. No es el máster final narrado.
- Voz pendiente de autorización. La consulta de costo a Higgsfield devolvió **5.75 créditos** para el guion íntegro, `elevenlabs_v4`, Grady, preset `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`. No se envió ninguna generación de audio ni se consumieron créditos externos.
- Los 25 subtítulos actuales reproducen íntegramente el guion, con máximo dos líneas. Sus tiempos son **provisionales**, distribuidos por escena; no están alineados a una grabación real.
- El guion tiene 189 palabras. La escena 06 exige aproximadamente 200 palabras/minuto en su ventana de 9 s: hay que comprobar la dicción real antes de aprobar el máster. No se ha acelerado ni sustituido la voz oficial.

## Uso

```bash
npm ci
npm run dev:ep09
# Abrir http://localhost:3000/Episodio09
npm run check:ep09
npm run preview:ep09
npm run render:ep09:draft
```

En el entorno de desarrollo se empleó `/usr/bin/chromium`. Para otra instalación, configurar `REMOTION_BROWSER_EXECUTABLE` con el navegador disponible en el script de exportación.

`render:ep09` rechaza un final sin audio y subtítulos revisados. Para evitar renders duplicados, el exportador no reemplaza archivos existentes salvo `--reemplazar` explícito.

## Integración posterior de Grady

1. Autorizar el costo antes de generar. Usar exclusivamente Higgsfield con el modelo, voz e ID indicados; el texto íntegro está en `narracion.json`. No usar la API directa de ElevenLabs.
2. Descargar y escuchar la generación. Medir su duración y alinear el guion con el audio real mediante marcas temporales de palabra/frase. No usar el reparto provisional como si fuese una transcripción. Corregir manualmente nombres y acentos.
3. Preparar un JSON `Caption[]` con campos `text`, `startMs`, `endMs`, `timestampMs`, `confidence`, y el campo adicional `scene` (1–8). Los tiempos son absolutos en el máster. Formar páginas de máximo dos líneas de 43 caracteres, sin dividir palabras.
4. Revisar auditivamente las ocho ventanas del guion. Si el audio no cabe naturalmente en 70 s, evaluar silencios y dirección de lectura; no truncarlo ni imponer aceleración. Ajustar las acciones visuales a la locución y volver a revisar puntos de entrada y salida.
5. Ejecutar la importación local tras esa revisión:

```bash
node scripts/episodio-09/integrar-audio.mjs /ruta/grady.wav /ruta/captions-alineados.json --revisado
npm run check:ep09
npm run dev:ep09
npm run render:ep09
```

El importador normaliza el audio a WAV PCM, 48 kHz, sin alterar la velocidad; actualiza `audio-manifest.json` y reemplaza únicamente los subtítulos del episodio 09. La composición integra el audio cuando su estado es `ready`. El resultado final se verifica con ffprobe.

## Archivos y preservación

- `src/episodio09/`: composición, ocho escenas, ilustraciones animadas, subtítulos y estado de audio.
- `public/episodio-09/`: 13 SVG originales y 2 PNG nuevos; capas registradas del fusible, componentes y fondos.
- `scripts/episodio-09/`: creación de vectores, guía de subtítulos, importación, revisión, validación y exportación.
- `docs/episodio-09/`: guion, inventario con SHA-256, validación, revisión técnica y reporte.
- Cambios compartidos: `src/Root.tsx` incorpora las nuevas composiciones; `package.json` agrega dos paquetes de Remotion y comandos específicos; `package-lock.json` fija versiones; `.gitignore` excluye dependencias y exportaciones.
- `src/CorazonAlLimite.tsx`, todas las imágenes anteriores, documentos y workflows previos se preservan byte por byte respecto de `dfd1567`. El validador lo comprueba, incluida la composición anterior en Root.

La versión inspeccionada no contiene una composición del episodio 04. Sí incluye la referencia del cerebro y su biblioteca. Se reutilizan los PNG aprobados de personajes y sala sin modificarlos; las láminas de referencia no se recortaron como assets.

## Dirección visual y límites

La vivienda y el electricista son ilustraciones nuevas generadas con la herramienta integrada, sin facturación externa de Higgsfield. Los componentes eléctricos son dibujos vectoriales originales con contornos, metal sombreado, reflejos, textura, tornillos y capas. No son fotografías ni modelos 3D.

La animación usa movimientos independientes, poses del presentador, parallax ambiental, corriente alternante esquemática, cambio térmico, ruptura, partículas internas, contacto móvil del termomagnético y disolvencias de diez fotogramas. Las transiciones se solapan sin cambiar los 2100 fotogramas. El corte interior es esquemático; materiales, rellenos y geometrías reales varían por diseño. No se afirma equivalencia visual ya aprobada por el usuario con el episodio 04.

No hay título permanente, contador de tiempo, barra de progreso ni leyenda de marca inferior. Los textos adicionales son explicaciones eléctricas y avisos de seguridad.

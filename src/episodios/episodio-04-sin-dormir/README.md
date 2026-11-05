# Episodio 04 · 24 horas sin dormir

Composición independiente `Episodio04SinDormir`, registrada en `src/Root.tsx`: 1080 × 1920, 30 FPS y 2100 cuadros. La integración de audio conserva las ocho escenas 2D existentes y ajusta sus entradas a la narración completa de Grady. El archivo final y su validación se documentan en `REPORTE_REVISION.md`.

## Estado de revisión

La voz oficial de este episodio es **Grady**, preset `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`, mediante **Higgsfield / Eleven v4 (`elevenlabs_v4`)**. El usuario confirmó que ya estaba probada y aprobada y autorizó **5.29 créditos para una sola generación**. Se generó una narración completa en español, sin API directa de ElevenLabs. `public/episodio-04/audio/narracion-grady.json` conserva la solicitud, autorización y procedencia. Las candidatas y audiciones anteriores quedan como historial y no gobiernan esta integración.

`timeline.json` sigue marcas de palabras reconocidas en la toma real en español. `captions.json` conserva las 186 palabras del guion aprobado en grupos de 3–5 palabras. La toma original mide 74.370625 s; se retiraron 4.370625 s de los centros de pausas medidas, conservando al menos 0.250421 s en cada pausa editada. La voz permanece a velocidad 1.0×, sin frases ni palabras recortadas. Solo cambian las entradas y duraciones de las escenas, el audio y los subtítulos; los archivos de animaciones, ilustraciones y episodios anteriores permanecen intactos.

## Archivos

| Archivo | Uso |
|---|---|
| `production.json` | Formato, composición, estado de voz y ajustes de exportación |
| `chapters.json` | Guion y mapa de acciones visuales editable |
| `timeline.json` | Entradas de las ocho escenas y marcas reales de la narración |
| `captions.json`, `Subtitulos.tsx` | Palabras sincronizadas y presentación de subtítulos |
| `CIENCIA.md` | Criterios de precisión y fuentes |
| `AUDICION_VOZ.md` | Historial de audiciones, sustituido por la selección aprobada de Grady |
| `index.tsx`, `scenes/`, `visuals.tsx` | Ocho secuencias 2D editables, escenarios completos y capas animadas |
| `AUDITORIA_VISUAL_2D.md` | Revisión de biblioteca, sustituciones corregidas y recursos faltantes |
| `PROMPTS_ILUSTRACIONES.md` | Prompts y referencias exactos de los cuatro recursos generados |
| `PROMPTS_PANORAMA.md` | Prompts del dormitorio panorámico y la cama vacía |
| `VOCES_ESPANOL_MX.md` | Muestra local rechazada y selección corregida de voces mexicanas |

## Recursos aprobados

La composición referencia ilustraciones existentes del personaje, anatomía y dormitorio. Los PNG originales no se alteran ni se reescalan en disco; el encuadre ocurre dentro de Remotion. `recursos.json` registra los recursos reutilizados y sus hashes.

El estándar vigente es 100 % 2D y se documenta en `docs/ESTANDAR_VISUAL_2D.md`. Hay seis PNG nuevos en `public/episodio-04/ilustraciones/`: automóvil, carretera, taza, personaje descansando en cama, dormitorio nocturno panorámico y cama vacía. Los objetos independientes tienen alpha real. Los fondos cubren todo 1080 × 1920 conservando proporción; la escala de cobertura se registra en el manifiesto y se revisa en el render. Los protagonistas no exceden su resolución nativa.

La composición ocupa el cuadro completo, con escenarios hasta los bordes y sin marcos de tarjeta. No muestra marca arriba, leyendas de pie ni barras de progreso. El estado de revisión queda en el nombre de archivo y los reportes. Las escenas individuales también se registran en Studio dentro de `Episodio04-Escenas`.

La auditoría reproducible se ejecuta con Python + Pillow: `python scripts/episodio-04-sin-dormir/auditar_recursos.py`. Comprueba los hashes de los 68 originales, formato, resolución, alpha y escala de uso de los seis nuevos PNG. También prepara una carpeta pública reducida para revisar este episodio sin copiar los videos de otras producciones. Studio: `npm run dev -- --no-open`, composición `Episodio04SinDormir`.

## Exportación y verificación

Configurar `FFMPEG_PATH` con una compilación funcional de FFmpeg junto a FFprobe. Ejecutar `node scripts/episodio-04-sin-dormir/renderizar-final.mjs` y `python scripts/episodio-04-sin-dormir/verificar_final.py`. El exportador entrega los PNG de Remotion directamente a una única codificación H.264 y mezcla el WAV verificado como AAC de 48 kHz / 192 kbps. La propiedad `externalAudio` evita el lector de audio defectuoso de este equipo durante esa captura; Studio integra la misma narración por defecto.

`preparar_grady.py` reproduce los cortes de silencio, la normalización y la alineación usando la toma original y la transcripción archivada, sin llamar a servicios de generación. El validador compara el AAC decodificado con el WAV completo, verifica duración, fotogramas, captions, clipping, silencios, pantallas negras e integridad del código visual.

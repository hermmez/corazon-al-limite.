# Episodio 04 · 24 horas sin dormir

Composición independiente `Episodio04SinDormir`, registrada en `src/Root.tsx`: 1080 × 1920, 30 FPS y 2100 cuadros. La animática mantiene los ocho bloques editoriales del encargo. El contenido visual está preparado para revisión; no se marca como video final.

## Estado de revisión

La voz `CORAZON_CINEMATIC_MX` aún figura como pendiente de audición en la configuración existente. Se incluye una muestra local específica de este guion y se conserva sin cambios el perfil oficial. La línea de voz de ElevenLabs identificada en el proyecto no tiene credencial ni saldo actual comprobado; no se usaron créditos.

La temporización de `timeline.json` solo expresa ventanas editoriales para la animática. Está marcada explícitamente como no sincronizada. `captions.json` permanece vacío hasta que la locución se apruebe, se mida y se alinee con marcas reales. No se deben generar subtítulos cronometrados a partir de la longitud del texto.

## Archivos

| Archivo | Uso |
|---|---|
| `production.json` | Formato, composición, estado de voz y ajustes de exportación |
| `chapters.json` | Guion y mapa de acciones visuales editable |
| `timeline.json` | Ventanas editoriales de la animática; sin marcas de locución |
| `captions.json` | Reservado para captions derivados del audio real aprobado |
| `CIENCIA.md` | Criterios de precisión y fuentes |
| `AUDICION_VOZ.md` | Identidad provisional y condición de aprobación |
| `index.tsx` | Escenas 2D, cámara y elementos originales en SVG |
| `AUDITORIA_VISUAL_2D.md` | Revisión de biblioteca, sustituciones corregidas y recursos faltantes |
| `PROMPTS_ILUSTRACIONES.md` | Prompts y referencias exactos de los cuatro recursos generados |

## Recursos aprobados

La composición referencia ilustraciones existentes del personaje, anatomía y dormitorio. Los PNG originales no se alteran ni se reescalan en disco; el encuadre ocurre dentro de Remotion. `recursos.json` registra los recursos reutilizados y sus hashes.

El estándar vigente es 100 % 2D y se documenta en `docs/ESTANDAR_VISUAL_2D.md`. Se incorporan cuatro PNG en `public/episodio-04/ilustraciones/`: automóvil, carretera, taza y descanso en cama. Automóvil, taza y cama tienen alpha real; la carretera es un fondo independiente. Ninguno se amplía por encima de su resolución nativa. Las figuras SVG se reservan para reloj, marcas de carril, flechas y esquemas complementarios.

La auditoría reproducible se ejecuta con Python + Pillow: `python scripts/episodio-04-sin-dormir/auditar_recursos.py`. Comprueba los hashes de los 68 originales, formato, resolución, alpha y tamaño de uso de los cuatro nuevos PNG. También prepara una carpeta pública reducida para revisar este episodio sin copiar los videos de otras producciones. Studio: `npm run dev -- --no-open`, composición `Episodio04SinDormir`.

## Próximo paso para terminar

Después de aprobar la voz: preparar la locución completa, medir audio, ajustar la narración a 70 s sin silencios de relleno, alinear captions y eventos con el audio real, revisar la evolución visual en cada tramo de 1–2 s y producir/validar H.264 + AAC. La versión exportada deberá verificar 70.000 s, 2100 cuadros, 30 FPS, 48 kHz, decodificación completa y legibilidad en teléfono.

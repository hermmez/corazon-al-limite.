# Narración en español mexicano con ElevenLabs

La clave se lee solamente de `ELEVENLABS_API_KEY` en scripts de Node y en el paso
de síntesis de GitHub Actions. El SDK oficial `@elevenlabs/elevenlabs-js` nunca
se importa en React ni en el reproductor. No guardes credenciales en el JSON,
en props de Remotion ni en archivos de voz.

## Voz y configuración

`config/elevenlabs.json` reúne el `voiceId`, el modelo, los ajustes, el idioma,
el guion y los márgenes de lectura. La voz se elige consultando la API real:

```bash
npm run voz:voces
```

El catálogo queda en `out/elevenlabs-voces.json`: voces de la cuenta y, cuando
es necesario, candidatas masculinas de la biblioteca con `locale: es-MX`.
No sustituye una voz mexicana por una inglesa cuando no hay coincidencias.
Se puede cambiar `voiceId` en el JSON o usar `ELEVENLABS_VOICE_ID` en la ejecución.
La API vuelve a validar la disponibilidad y los metadatos antes de sintetizar.
Si la voz seleccionada es de la biblioteca pública, se agrega una sola vez a la
colección de la cuenta mediante el SDK; no se clona ni se genera otra voz.

La selección inicial es **Arturo — Calm, Friendly, Natural**,
`svrHd8NySjbCTALnWLoS`, con metadatos `male`, `es`, `mexican`, `es-MX`.
La consulta verificable está en
[Actions: catálogo](https://github.com/hermmez/corazon-al-limite./actions/runs/41274573808).
El acento y la descripción proceden del proveedor; conviene escuchar la muestra
antes de decidir la voz editorial definitiva.

## Prueba antes del episodio

```bash
npm run voz:prueba
npm run voz:validar
npm run render:voz:prueba
```

La prueba une las dos primeras frases originales: **28 palabras, 197 caracteres**,
aproximadamente diez segundos según el ritmo de la voz. Realiza **una sola
petición de síntesis**. La duración exacta se mide después con FFprobe; no se
fuerza a diez segundos mediante cortes o aceleración.

Los MP3 se guardan en `public/voz/prueba/` con nombres derivados del texto, voz,
modelo y ajustes. Se guardan también el hash del audio, la alineación real de
caracteres y `manifest.json`. El MP3 se conserva incluso si falla la validación
posterior, para evitar pagar de nuevo por el mismo resultado.

Los archivos existentes se reutilizan después de comprobar su hash y decodificación.
Las llamadas de pago tienen `maxRetries: 0`. Un archivo incompleto provoca un error
y requiere revisión; no se borra ni se regenera automáticamente. Cambiar el texto,
voz o ajustes produce otro nombre y conserva las grabaciones anteriores.

El episodio completo está separado y requiere una prueba válida con la misma voz,
modelo, texto de prueba y ajustes:

```bash
npm run voz:episodio -- --confirm-full
npm run voz:validar -- --mode episodio
npm run render:sueno
```

No se genera el episodio completo como parte de la entrega inicial. Generarlo
consumirá créditos adicionales. El flag explícito y la prueba previa son controles
del script para evitar un consumo involuntario.

## GitHub Actions

Workflow: `.github/workflows/elevenlabs.yml`, **Narración con ElevenLabs**.
Usa el secreto de repositorio `${{ secrets.ELEVENLABS_API_KEY }}`. No hace falta
ni se intenta recuperar ese secreto en Codex.

Ejecutar con **Run workflow** o con GitHub CLI:

```bash
gh workflow run elevenlabs.yml --repo hermmez/corazon-al-limite. \
  --ref integracion-elevenlabs -f modo=prueba -f render_video=true
```

Entradas:

| Entrada | Valores y comportamiento |
| --- | --- |
| `modo` | `voces`, `prueba` (por defecto), `episodio` |
| `voice_id` | Opcional; vacío usa el JSON. Se pasa por una variable, nunca se interpola en código shell |
| `confirmar_episodio` | `false` por defecto; debe ser `true` para el episodio |
| `render_video` | Genera además un MP4 con la voz; por defecto `true` |

El artefacto `elevenlabs-<modo>-<run_id>` conserva `public/voz/` y `out/`.
Descargarlo y extraerlo en la **raíz del proyecto**, manteniendo esa estructura.
Incluye MP3, alineación, manifiesto, configuración sin credenciales, catálogo,
informes y, cuando se solicita, el MP4. Los artefactos duran 30 días.
La caché de Actions permite reutilizar la prueba en la generación completa;
el script vuelve a verificarla antes de consumir créditos.

## Integración con Remotion

- `PrimerVideoSueno` lee `voz/primer-video-sueno/manifest.json` mediante
  `calculateMetadata`. Mientras esté pendiente, conserva los 90 segundos sin voz.
- `PruebaVozElevenLabs` reutiliza las primeras escenas con el manifiesto de prueba.
  Ajusta su duración a la medida real de la muestra más los márgenes configurados.
- `NarrationTrack` usa `Audio` de `@remotion/media` y `staticFile()`, con cortes de
  origen para separar las dos frases de una misma grabación.
- Los subtítulos son `Caption` de Remotion, derivados de la alineación de
  caracteres devuelta por ElevenLabs. Su confianza queda nula porque el proveedor
  no devuelve una confianza de transcripción. No se inventan marcas temporales.
- `narrationTiming: "extend"` conserva los intervalos originales y los amplía
  cuando la voz necesita más tiempo; nunca corta la locución para forzar 90 segundos.
  `"audio"` ajusta todas las escenas narradas al audio. El total final puede cambiar.
- Las imágenes, fondos, paleta y poses aprobadas se conservan. Las animaciones
  escalan con la duración de cada escena.

Para oír la prueba desde la composición completa, usar estos props:

```json
{
  "narrationManifest": "voz/prueba/manifest.json",
  "narrationTiming": "extend",
  "startAtSeconds": 0
}
```

Eso incorpora únicamente las dos frases de prueba; el resto sigue sin narración.
No equivale a una narración completa del episodio.

## Comprobaciones

```bash
npm run typecheck
npm run test:voz
npm run validate:sueno
npm run voz:validar
```

Las pruebas cubren la conversión de alineación española a palabras, el reparto
de un MP3 entre escenas, el ajuste temporal sin cortar voz, los manifiestos
pendientes, las rutas, la caché y el bloqueo del episodio sin confirmación.
`voz:validar` comprueba los MP3 reales con FFprobe/FFmpeg, sus hashes y los
subtítulos contra el guion. La entrega debe distinguir estas pruebas de la
generación real: consultar voces o compilar por sí solos no prueban la síntesis.

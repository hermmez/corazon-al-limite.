# Voz C2 · corrección de selección

**Historial sustituido:** el usuario aprobó posteriormente **Grady en Higgsfield / Eleven v4** para la producción definitiva. Esta página conserva las candidatas anteriores; no solicita nuevas credenciales ni determina la voz actual. La configuración vigente está en `production.json`.

El usuario eligió **Alejandro Ballesteros** para la audición C2. Su identificador real de ElevenLabs es `YKUjKbMlejgvkOZlnnvt`. La generación de pago y la interpretación definitiva todavía requieren sus respectivas aprobaciones.

La muestra Piper local fue rechazada por sonar robótica. Se conserva como evidencia y no debe proponerse otra vez como narrador definitivo. El primer selector mostró muestras en inglés, inadecuadas para revisar la narración de este episodio.

## Candidatas verificadas en el catálogo oficial mexicano de ElevenLabs

Fuente: https://elevenlabs.io/es/text-to-speech/mexican-accent

| Voz | Identificador real de ElevenLabs | Descripción del proveedor | Muestra existente |
|---|---|---|---|
| Alejandro Ballesteros — Warm and Joyful | `YKUjKbMlejgvkOZlnnvt` | Voz mexicana animada, cálida y energética, orientada a contenido. | [Escuchar](https://storage.googleapis.com/eleven-public-prod/database/workspace/061fc01ddee842e3a44faef15991a133/voices/YKUjKbMlejgvkOZlnnvt/MVdD8k6wONPnXjI9qENs.mp3) |
| Enrique Mondragón — Elegant and Dynamic | `iDEmt5MnqUotdwCIVplo` | Voz masculina de mediana edad con acento español mexicano, orientada a narración. | [Escuchar](https://storage.googleapis.com/eleven-public-prod/custom/voices/iDEmt5MnqUotdwCIVplo/rS1k8yAe8MGIMeC7Uq4V.mp3) |

Los nombres, identificadores y URLs proceden de los datos públicos de esa página; no son identificadores del selector de Higgsfield. No intercambiar identificadores entre proveedores ni inventar un par `voice_id` / `voice_type` para el conector.

Primera candidata propuesta: Alejandro, por la descripción cálida y energética del catálogo. Es una inferencia editorial, no una validación de la interpretación C2 con nuestro guion. Enrique queda como alternativa de narración. No se ha generado una nueva toma ni gastado créditos para esta comparación.

## Audición del episodio que falta preparar

Texto: «¿Veinticuatro horas sin dormir? Tu cuerpo no simplemente se cansa… tu cerebro empieza a funcionar de otra manera. Y aquí viene lo peligroso: pueden aparecer microsueños, incluso con los ojos abiertos.»

Dirección: hombre de 28–38 años percibidos; español mexicano natural; tono medio-grave cálido; ritmo rápido y claro; curiosidad en la pregunta y tensión en la revelación; evitar noticiero, voz engolada y pausas mecánicas. Revisar la muestra en español, sin música ni efectos que oculten defectos.

Antes de pedir una generación de pago, confirmar acceso al proveedor y cotizar la configuración exacta. Después de autorizar el costo, generar una sola audición breve y aprobar su interpretación antes de producir o alinear el episodio completo. La voz Arturo que ya consta en la configuración se conserva como referencia histórica; no es la voz C2 aprobada.

## Resultado de la consulta de acceso

La integración del repositorio ejecutó únicamente consultas GET mediante el secreto configurado `ELEVENLABS_API_KEY`. ElevenLabs respondió HTTP 401; la cotización no pudo completarse. No hubo generación de audio ni consumo de créditos de síntesis. Evidencia: [ejecución de consulta](https://github.com/hermmez/corazon-al-limite./actions/runs/41928935538) y `output/episodio-04-sueno/cotizacion-alejandro.json`.

Se necesita restablecer esa credencial en los secretos de Actions del repositorio. Con acceso válido, volver a consultar voz, modelos y factores de costo antes de pedir autorización de generación. No volver a solicitar la elección de voz: el usuario ya eligió Alejandro Ballesteros.

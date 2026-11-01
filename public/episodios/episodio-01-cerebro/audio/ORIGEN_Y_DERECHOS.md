# Audio del episodio 01

`musica_original.flac` y `efectos_originales.flac` son composiciones y sonidos originales sintetizados mediante osciladores, envolventes y ruido con semilla fija, en `scripts/episodio-01-cerebro/crear_audio.py`. No contienen muestras, canciones comerciales, videos de stock ni material de terceros. Se produjeron para este proyecto; no se declara una licencia CC0 sobre los recursos del usuario.

`mezcla_master.flac` es el bus estéreo de entrega sin pérdida, 48 kHz. En la versión pendiente de autorización contiene únicamente música y efectos, con nivel ambiental de −24 LUFS. No contiene narración. Cuando se incorpore una voz real, el script aplica prioridad a la voz, atenuación de música y normalización a −14 LUFS, con objetivo de pico verdadero de −2 dBTP.

El archivo de voz previsto es `narracion_original.mp3`. No se debe crear un archivo vacío con ese nombre ni afirmar que existe una locución hasta contar con el audio real. La cotización de una generación con la voz Juan de ElevenLabs mediante Higgsfield fue de 2.55 créditos. No se ha enviado esa generación: se solicitó autorización para respetar el punto 3 del encargo. El uso comercial de una futura locución estará sujeto a las condiciones del proveedor y del plan de la cuenta.

Los WAV de trabajo permanecen locales e ignorados por Git. Los FLAC entregados conservan el audio sin pérdida con menor tamaño.

# Audio del episodio 01

`musica_original.flac` y `efectos_originales.flac` son composiciones y sonidos originales sintetizados mediante osciladores, envolventes y ruido con semilla fija, en `scripts/episodio-01-cerebro/crear_audio.py`. No contienen muestras, canciones comerciales, videos de stock ni material de terceros. Se produjeron para este proyecto; no se declara una licencia CC0 sobre los recursos del usuario.

`mezcla_master.flac` es el bus estéreo de entrega sin pérdida, 48 kHz, con narración, música atenuada durante la voz y efectos discretos. Objetivo: −14 LUFS y pico verdadero de −2 dBTP.

`narracion_original.mp3` es la toma completa real de ElevenLabs, voz masculina Juan, generada vía Higgsfield (trabajo `c4eb3c79-1dc0-4104-9a75-1c99a7f06f00`). Duración: 62.850612 segundos. Se realizó una única generación, con costo comprobado de 2.55 créditos (saldo 43.95 → 41.40), después de que el usuario solicitara incorporar la voz faltante. No se han generado imágenes ni videos nuevos. El uso comercial de la locución está sujeto a las condiciones del proveedor y del plan de la cuenta.

`narracion.flac` conserva la pista limpia normalizada de 70 segundos: solo se ajustaron pausas entre frases, sin acelerar la voz ni cortar palabras. Sirve como referencia para comprobar su presencia y sincronización en el AAC del MP4 final.

Los WAV de trabajo permanecen locales e ignorados por Git. Los FLAC entregados conservan el audio sin pérdida con menor tamaño.

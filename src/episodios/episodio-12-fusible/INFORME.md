# Episodio 12 · De un pedazo de metal a un fusible completo

## Entrega verificada

MP4 vertical de 70,000 s, 1080 × 1920, 2.100 fotogramas a 30 FPS constantes. H.264 High, YUV420p y BT.709. Audio AAC a 48 kHz con objetivo de codificación de 192 kb/s y media medida de 194,9 kb/s. Inicio rápido y decodificación completa. SHA-256 28bef455e19ee18eb77535e091564586b316086e4820322d1fb954da8096d607.

La composición `Episodio12Fusible` conserva un solo cartucho y el mismo banco técnico. El elemento, la pared cerámica, el cuarzo y los contactos se integran por capas. El circuito conceptual permite ver el flujo, el aumento de corriente, la fusión, el arco interno y la pérdida de continuidad. Las vistas ampliadas se conectan al componente observado. El cierre compara el elemento intacto con el fundido.

## Narración y sincronización

Se utilizó una sola generación de Grady en español, modelo Eleven v4 mediante Higgsfield, con los 4,83 créditos autorizados. El guion se condensó a 163 palabras y se conservó completo en la toma. La velocidad de voz es 1,0×. Se extendieron 2,740 s de pausas repartidas para dejar espacio a los movimientos. Los subtítulos se alinearon con audio real y tienen 43 grupos de 3 a 5 palabras.

La cerámica se identifica a 12,432 s, el cuarzo a 21,269 s y los contactos a 30,131 s. La fusión ocurre alrededor de 53,138 s y el flujo desaparece al apagarse el arco a 57,076 s. La última palabra termina a 68,770 s.

La mezcla incluye golpes de asentamiento, granos y un efecto corto de descarga producidos localmente. Nivel integrado de la mezcla -16,06 LUFS. Correlación entre el AAC decodificado y la mezcla PCM 0,999959.

| Etapa | Inicio en el brief | Inicio medido en la toma |
| --- | ---: | ---: |
| El metal | 0,000 s | 0,000 s |
| El aislante | 10,000 s | 10,552 s |
| La arena | 20,000 s | 19,613 s |
| Los contactos | 31,000 s | 29,465 s |
| El circuito | 41,000 s | 38,834 s |
| La sobrecorriente | 51,000 s | 48,358 s |
| El resultado | 61,000 s | 58,215 s |

## Recursos

- Nuevos. Ilustraciones 2D vectoriales de la tira con estrechamientos, el cuerpo y su corte, los contactos, la arena, el circuito y las vistas de detalle. Quedaron en `cartucho.tsx`, `banco.tsx` e `index.tsx` dentro de la carpeta del episodio.
- Reutilizados. Geometría del alambre aislado del episodio 09, recoloreada e integrada al símbolo de advertencia. Su cartucho y su montaje doméstico se consultaron como referencia. El nuevo dibujo del fusible permite mover por separado las superficies y enseñar el relleno en el mismo modelo. Los originales quedaron intactos.
- Audio y edición. Toma original, voz aislada y mezcla final en `public/episodio-12/audio/`. Guion, marcas y subtítulos editables en `guion.json`, `timeline.json` y `captions.json`. SRT y comprobaciones en `output/episodio-12-fusible/`.

## Revisión técnica y visual

El cartucho es una reconstrucción educativa de la familia cerámica cilíndrica gG con contactos de casquillo y relleno de cuarzo. Se dramatizan los tiempos de fusión y extinción. El esquema del circuito representa un flujo conceptual y no prescribe cableado, magnitudes de prueba ni reparación.

- [Mersen — fusibles cilíndricos IEC, familia gG](https://www.mersen.com/en/iec-low-voltage-general-purpose-fuses-and-fusegear/iec-cylindrical-fuse-links-and-fusegear)
- [Mersen — tiempos de fusión, arco y relleno de sílice](https://www.mersen.com/sites/default/files/files_imported_ep/TT-SCN6-NEC-Update-Article-240.67-Arc-Energy-Reduction.pdf)
- [Eaton — funcionamiento del elemento y extinción en el relleno](https://www.eaton.com/gb/en-gb/products/electronic-components/topics/fuse-technology.html)
- [Ilustración del alambre del episodio 09](https://github.com/hermmez/corazon-al-limite./blob/fbb98c1125e23f2c1c1d814698fa7d393a06a4bb/public/episodio-09/alambre-advertencia.svg)

Se revisaron vistas ligeras del ensamble, el corte, el arco, el circuito abierto y la advertencia. Se verificaron los 2.100 tiempos de presentación, sin intervalos negros. Siete MP4 previos coinciden con sus hashes guardados.

Se midió el cambio de gris a 4 muestras por segundo en un recorte del fusible y el banco que excluye títulos y subtítulos. Umbral de revisión 0,75 puntos de 255 durante al menos 2 s. La mediana del episodio 12 a velocidad normal fue 2,01 y su percentil 90 fue 8,65. En el episodio 04 a 1,25× fueron 0,618 y 10,538, respectivamente.

Intervalos de menor cambio en ese recorte. 3,750 s a 6,500 s. La métrica no recoge las ampliaciones ni la comparación situadas debajo del recorte. Los cambios de material, las ampliaciones y la apertura se revisaron también en fotogramas individuales.

No hubo pausas internas de la voz aislada por encima de 0,7 s. El cierre deja visible la advertencia hasta el último fotograma.

## Reproducción del proyecto

Abrir `Episodio12Fusible` en Remotion Studio. Para exportar desde la raíz del repositorio, configurar `FFMPEG_PATH`, ejecutar `node scripts/episodio-12-fusible/render.mjs` y verificar con `python scripts/episodio-12-fusible/verificar.py`. La verificación usa NumPy y Pillow.

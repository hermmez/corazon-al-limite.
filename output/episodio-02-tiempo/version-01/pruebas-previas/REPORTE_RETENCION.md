# Episodio 02 · Retención y ritmo audiovisual

Análisis ejecutado sobre **el MP4 y la pista de voz reales**. Estado: `measured-no-unreviewed-threshold-alerts`. Los umbrales son alertas para inspección, no una medida automática de calidad narrativa. No se declara equivalencia subjetiva de energía mediante cifras.

## Referencia audiovisual

A: episodio 01 aprobado a **1.25×** (56 s efectivos). B: episodio 02 a **1.0×**, 70 s completos. Los temas y los gráficos son diferentes: se comparan ritmo y densidad, no escenas semánticamente equivalentes. `comparacion_ritmo_AB.mp4`, cuando se genera con el script incluido, alterna cuatro pasajes de cada episodio para escuchar voz, transiciones y música, y observar el movimiento.

| Medición | A original a 1.25× | B episodio 02 a 1.0× |
| --- | --- | --- |
| Silencios de voz >0.7 s | 7 | 0 |
| Intervalos de baja evolución ≥2 s | 3 | 0 |
| Posible repetición ≥2 s | 0 | 0 |
| MAE mediano por 0.5 s | 0.02284 | 0.01179 |
| Percentil 90 del cambio visual | 0.12099 | 0.11076 |

El análisis visual usa x=85–950, y=575–1240, excluyendo títulos, subtítulos y tarjetas inferiores. Se muestrea a 4 FPS y se compara con el fotograma de 0.5 s antes. Se señalan MAE <0.018 durante al menos 2 s y firmas repetidas con diferencia <0.009. Los cambios de cámara, texto o partículas no prueban por sí solos una evolución con propósito; la inspección editorial debe valorar el significado.

## Silencios B mayores de 0.7 s

Se usa exclusivamente la narración limpia a −35 dB, no la mezcla musical.

| Intervalo en la entrega (s) | Duración (s) |
| --- | --- |
| — | Sin alertas |

## Intervalos visuales B para revisión

| Baja evolución, segundos exactos | Duración (s) |
| --- | --- |
| — | Sin alertas |

| Posible repetición, segundos exactos | Duración (s) |
| --- | --- |
| — | Sin alertas |

Las alertas medidas permanecen registradas aunque una revisión editorial las justifique. Un evento declarado en el guion no borra una alerta de píxeles.

## Sincronía y contenido

- Palabras con marcas reales: **189**; fuente de tiempo: la alineación entregada con la narración, no la longitud del texto.
- Eventos semánticos: **48**. Alertas de desajuste: **0**. El gancho visual del primer fotograma admite hasta 120 ms de anticipación respecto al comienzo de la voz; las demás entradas de capítulo admiten hasta 80 ms. Los offsets medidos se conservan en el JSON con su motivo y tolerancia explícitos. Las activaciones por palabra mantienen su tolerancia de redondeo de 1.1 ms; no se evalúan con la tolerancia de entrada de capítulo.
- Finales de narración anticipados >0.7 s: **0**. La tabla completa de escenas está en el JSON.
- Intervalos entre eventos >2 s: **9**. Son puntos de inspección, no prueba de estasis: una construcción progresiva puede continuar entre marcas.
- Última palabra: **69.680 s**. El análisis no determina por sí solo pronunciación, naturalidad o precisión científica; esas revisiones deben quedar documentadas por separado.


## Distancia entre marcas semánticas

- 7.078–9.129 s (2.051 s): revisar que el concepto evolucione entre `s1-a0` y `s1-a1`.
- 14.154–16.242 s (2.088 s): revisar que el concepto evolucione entre `s1-a5` y `s2-a0`.
- 22.358–24.647 s (2.289 s): revisar que el concepto evolucione entre `s2-a4` y `s2-a5`.
- 25.541–28.332 s (2.791 s): revisar que el concepto evolucione entre `s3-a0` y `s3-a1`.
- 32.086–34.821 s (2.735 s): revisar que el concepto evolucione entre `s3-a4` y `s3-a5`.
- 39.242–41.526 s (2.284 s): revisar que el concepto evolucione entre `s4-a2` y `s4-a3`.
- 42.455–44.499 s (2.044 s): revisar que el concepto evolucione entre `s4-a4` y `s4-a5`.
- 45.400–47.595 s (2.195 s): revisar que el concepto evolucione entre `s5-a0` y `s5-a1`.
- 49.792–51.840 s (2.048 s): revisar que el concepto evolucione entre `s5-a3` y `s5-a4`.

## Control segundo por segundo

| Segundo | Escena | Voz medida (dBFS) | MAE medio | Eventos por palabra | Alertas |
| --- | --- | --- | --- | --- | --- |
| 00–01 | 0 | -14.25 | 0.02037 | Recuerdas | — |
| 01–02 | 0 | -15.97 | 0.03850 | vacaciones | — |
| 02–03 | 0 | -15.28 | 0.07534 | eternas | — |
| 03–04 | 0 | -16.68 | 0.01168 | cierras | — |
| 04–05 | 0 | -15.71 | 0.00181 | diciembre | — |
| 05–06 | 0 | -15.41 | 0.02093 | Qué le pasó | — |
| 06–07 | 0 | -17.31 | 0.00204 | — | — |
| 07–08 | 0,1 | -14.56 | 0.07368 | Lo extraño | — |
| 08–09 | 1 | -14.39 | 0.01900 | — | — |
| 09–10 | 1 | -14.67 | 0.01724 | veinticuatro horas | — |
| 10–11 | 1 | -15.11 | 0.03288 | puede cambiar | — |
| 11–12 | 1 | -14.77 | 0.03378 | — | — |
| 12–13 | 1 | -14.11 | 0.02270 | vive; recuerda | — |
| 13–14 | 1 | -14.04 | 0.04044 | — | — |
| 14–15 | 1 | -13.43 | 0.01414 | No hay | — |
| 15–16 | 1 | -17.42 | 0.00177 | — | — |
| 16–17 | 1,2 | -15.72 | 0.28203 | Cuando eras niño | — |
| 17–18 | 2 | -18.28 | 0.02980 | experiencias | — |
| 18–19 | 2 | -16.81 | 0.00717 | — | — |
| 19–20 | 2 | -17.21 | 0.01269 | primera escuela | — |
| 20–21 | 2 | -16.42 | 0.00500 | nuevos amigos | — |
| 21–22 | 2 | -15.43 | 0.07880 | — | — |
| 22–23 | 2 | -16.46 | 0.09281 | lugares | — |
| 23–24 | 2 | -15.17 | 0.00956 | — | — |
| 24–25 | 2 | -15.90 | 0.00836 | descubrimiento | — |
| 25–26 | 2,3 | -15.01 | 0.11127 | Pero al crecer | — |
| 26–27 | 3 | -17.11 | 0.03912 | — | — |
| 27–28 | 3 | -15.14 | 0.00692 | — | — |
| 28–29 | 3 | -16.24 | 0.02791 | despertar | — |
| 29–30 | 3 | -18.55 | 0.09882 | trabajar | — |
| 30–31 | 3 | -14.46 | 0.03488 | casa | — |
| 31–32 | 3 | -18.53 | 0.04308 | — | — |
| 32–33 | 3 | -12.94 | 0.07777 | memoria | — |
| 33–34 | 3 | -14.24 | 0.02796 | — | — |
| 34–35 | 3 | -16.07 | 0.01532 | No ocurre | — |
| 35–36 | 3 | -14.27 | 0.03649 | — | — |
| 36–37 | 3,4 | -15.41 | 0.29639 | Y aquí viene | — |
| 37–38 | 4 | -15.61 | 0.04162 | — | — |
| 38–39 | 4 | -14.74 | 0.01596 | una semana | — |
| 39–40 | 4 | -15.06 | 0.02332 | experiencias nuevas | — |
| 40–41 | 4 | -15.25 | 0.01740 | — | — |
| 41–42 | 4 | -14.20 | 0.02601 | más larga | — |
| 42–43 | 4 | -15.57 | 0.02344 | recuerdas | — |
| 43–44 | 4 | -14.16 | 0.00192 | — | — |
| 44–45 | 4 | -14.07 | 0.01173 | mirar atrás | — |
| 45–46 | 4,5 | -15.64 | 0.10005 | Eso no significa | — |
| 46–47 | 5 | -16.85 | 0.01098 | — | — |
| 47–48 | 5 | -15.57 | 0.01267 | más lenta | — |
| 48–49 | 5 | -14.58 | 0.01614 | la vives | — |
| 49–50 | 5 | -18.63 | 0.00632 | atención | — |
| 50–51 | 5 | -14.42 | 0.00947 | — | — |
| 51–52 | 5 | -16.43 | 0.00303 | cada momento | — |
| 52–53 | 5 | -17.58 | 0.01201 | — | — |
| 53–54 | 5 | -16.32 | 0.02405 | dos perspectivas | — |
| 54–55 | 5,6 | -15.53 | 0.11977 | Quieres | — |
| 55–56 | 6 | -16.00 | 0.17314 | — | — |
| 56–57 | 6 | -15.42 | 0.02377 | automática | — |
| 57–58 | 6 | -15.84 | 0.01233 | Aprende algo | — |
| 58–59 | 6 | -15.13 | 0.02349 | cambia tu recorrido | — |
| 59–60 | 6 | -16.88 | 0.00703 | — | — |
| 60–61 | 6 | -15.17 | 0.02575 | conoce un lugar | — |
| 61–62 | 6 | -15.59 | 0.00881 | actividad diferente | — |
| 62–63 | 6 | -15.84 | 0.01372 | — | — |
| 63–64 | 6,7 | -14.61 | 0.32667 | No puedes | — |
| 64–65 | 7 | -14.46 | 0.00377 | reloj | — |
| 65–66 | 7 | -15.38 | 0.03775 | crear recuerdos | — |
| 66–67 | 7 | -14.76 | 0.02542 | tus días | — |
| 67–68 | 7 | -16.75 | 0.00406 | A ti también | — |
| 68–69 | 7 | -15.63 | 0.05003 | — | — |
| 69–70 | 7 | -16.34 | 0.06008 | volando el año | — |

El JSON conserva hashes de los archivos analizados, muestras visuales, palabras, eventos, offsets y 70 filas de revisión. La ausencia de alertas no certifica retención, naturalidad o intención narrativa.

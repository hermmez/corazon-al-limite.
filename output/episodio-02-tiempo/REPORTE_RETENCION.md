# Episodio 02 · Retención y ritmo audiovisual

Análisis ejecutado sobre **el MP4 y la pista de voz reales**. Estado: `measured-no-unreviewed-threshold-alerts`. Los umbrales son alertas para inspección, no una medida automática de calidad narrativa. No se declara equivalencia subjetiva de energía mediante cifras.

## Referencia audiovisual

A: episodio 01 aprobado a **1.25×** (56 s efectivos). B: episodio 02 a **1.0×**, 70 s completos. Los temas y los gráficos son diferentes: se comparan ritmo y densidad, no escenas semánticamente equivalentes. `comparacion_ritmo_AB.mp4`, cuando se genera con el script incluido, alterna cuatro pasajes de cada episodio para escuchar voz, transiciones y música, y observar el movimiento.

| Medición | A original a 1.25× | B episodio 02 a 1.0× |
| --- | --- | --- |
| Silencios de voz >0.7 s | 7 | 0 |
| Intervalos de baja evolución ≥2 s | 3 | 1 |
| Posible repetición ≥2 s | 0 | 0 |
| MAE mediano por 0.5 s | 0.02284 | 0.01624 |
| Percentil 90 del cambio visual | 0.12099 | 0.16846 |

El análisis visual usa x=85–950, y=575–1240, excluyendo títulos, subtítulos y tarjetas inferiores. Se muestrea a 4 FPS y se compara con el fotograma de 0.5 s antes. Se señalan MAE <0.018 durante al menos 2 s y firmas repetidas con diferencia <0.009. Los cambios de cámara, texto o partículas no prueban por sí solos una evolución con propósito; la inspección editorial debe valorar el significado.

## Silencios B mayores de 0.7 s

Se usa exclusivamente la narración limpia a −35 dB, no la mezcla musical.

| Intervalo en la entrega (s) | Duración (s) |
| --- | --- |
| — | Sin alertas |

## Intervalos visuales B para revisión

| Baja evolución, segundos exactos | Duración (s) |
| --- | --- |
| 43.250–45.500 | 2.250 |

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

## Decisiones editoriales

- **lowEvolution 43.250–45.500 s:** Revisado en el MP4 final: es un plano deliberado de recuerdo. La página gira en duración (43.69–44.19), aparece el paisaje en mirar (44.50–44.78) y el sol en atrás (44.82–45.07). La voz explica la perspectiva retrospectiva y el personaje permanece en foco. La diferencia global es baja porque el fondo de la sala ocupa gran parte del ROI; la acción significativa ocurre en la libreta. Se conserva la alerta medida y se mantienen las acciones ligadas a palabras, sin añadir movimiento aleatorio para superar el umbral..

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
| 00–01 | 0 | -14.25 | 0.00088 | Recuerdas | — |
| 01–02 | 0 | -15.97 | 0.06759 | vacaciones | — |
| 02–03 | 0 | -15.28 | 0.01507 | eternas | — |
| 03–04 | 0 | -16.68 | 0.04406 | cierras | — |
| 04–05 | 0 | -15.71 | 0.00226 | diciembre | — |
| 05–06 | 0 | -15.41 | 0.04108 | Qué le pasó | — |
| 06–07 | 0 | -17.31 | 0.02013 | — | — |
| 07–08 | 0,1 | -14.56 | 0.13808 | Lo extraño | — |
| 08–09 | 1 | -14.39 | 0.07823 | — | — |
| 09–10 | 1 | -14.67 | 0.01264 | veinticuatro horas | — |
| 10–11 | 1 | -15.11 | 0.01404 | puede cambiar | — |
| 11–12 | 1 | -14.77 | 0.01392 | — | — |
| 12–13 | 1 | -14.11 | 0.05069 | vive; recuerda | — |
| 13–14 | 1 | -14.04 | 0.08605 | — | — |
| 14–15 | 1 | -13.43 | 0.01358 | No hay | — |
| 15–16 | 1 | -17.42 | 0.00288 | — | — |
| 16–17 | 1,2 | -15.72 | 0.15696 | Cuando eras niño | — |
| 17–18 | 2 | -18.28 | 0.03278 | experiencias | — |
| 18–19 | 2 | -16.81 | 0.05701 | — | — |
| 19–20 | 2 | -17.21 | 0.00176 | primera escuela | — |
| 20–21 | 2 | -16.42 | 0.01787 | nuevos amigos | — |
| 21–22 | 2 | -15.43 | 0.05300 | — | — |
| 22–23 | 2 | -16.46 | 0.15226 | lugares | — |
| 23–24 | 2 | -15.17 | 0.04393 | — | — |
| 24–25 | 2 | -15.90 | 0.02630 | descubrimiento | — |
| 25–26 | 2,3 | -15.01 | 0.11770 | Pero al crecer | — |
| 26–27 | 3 | -17.11 | 0.02264 | — | — |
| 27–28 | 3 | -15.14 | 0.02280 | — | — |
| 28–29 | 3 | -16.24 | 0.05346 | despertar | — |
| 29–30 | 3 | -18.55 | 0.18171 | trabajar | — |
| 30–31 | 3 | -14.46 | 0.07521 | casa | — |
| 31–32 | 3 | -18.53 | 0.08785 | — | — |
| 32–33 | 3 | -12.94 | 0.05480 | memoria | — |
| 33–34 | 3 | -14.24 | 0.03252 | — | — |
| 34–35 | 3 | -16.07 | 0.02844 | No ocurre | — |
| 35–36 | 3 | -14.27 | 0.00822 | — | — |
| 36–37 | 3,4 | -15.41 | 0.06699 | Y aquí viene | — |
| 37–38 | 4 | -15.61 | 0.02393 | — | — |
| 38–39 | 4 | -14.74 | 0.02140 | una semana | — |
| 39–40 | 4 | -15.06 | 0.07441 | experiencias nuevas | — |
| 40–41 | 4 | -15.25 | 0.01206 | — | — |
| 41–42 | 4 | -14.20 | 0.01433 | más larga | — |
| 42–43 | 4 | -15.57 | 0.03566 | recuerdas | — |
| 43–44 | 4 | -14.16 | 0.01298 | — | lowEvolution |
| 44–45 | 4 | -14.07 | 0.00641 | mirar atrás | lowEvolution |
| 45–46 | 4,5 | -15.64 | 0.13803 | Eso no significa | lowEvolution |
| 46–47 | 5 | -16.85 | 0.01683 | — | — |
| 47–48 | 5 | -15.57 | 0.02816 | más lenta | — |
| 48–49 | 5 | -14.58 | 0.03501 | la vives | — |
| 49–50 | 5 | -18.63 | 0.01536 | atención | — |
| 50–51 | 5 | -14.42 | 0.01202 | — | — |
| 51–52 | 5 | -16.43 | 0.02249 | cada momento | — |
| 52–53 | 5 | -17.58 | 0.10318 | — | — |
| 53–54 | 5 | -16.32 | 0.01122 | dos perspectivas | — |
| 54–55 | 5,6 | -15.53 | 0.05520 | Quieres | — |
| 55–56 | 6 | -16.00 | 0.15268 | — | — |
| 56–57 | 6 | -15.42 | 0.02706 | automática | — |
| 57–58 | 6 | -15.84 | 0.03047 | Aprende algo | — |
| 58–59 | 6 | -15.13 | 0.10730 | cambia tu recorrido | — |
| 59–60 | 6 | -16.88 | 0.04100 | — | — |
| 60–61 | 6 | -15.17 | 0.12556 | conoce un lugar | — |
| 61–62 | 6 | -15.59 | 0.02375 | actividad diferente | — |
| 62–63 | 6 | -15.84 | 0.01553 | — | — |
| 63–64 | 6,7 | -14.61 | 0.14042 | No puedes | — |
| 64–65 | 7 | -14.46 | 0.04603 | reloj | — |
| 65–66 | 7 | -15.38 | 0.04710 | crear recuerdos | — |
| 66–67 | 7 | -14.76 | 0.02592 | tus días | — |
| 67–68 | 7 | -16.75 | 0.00809 | A ti también | — |
| 68–69 | 7 | -15.63 | 0.01688 | — | — |
| 69–70 | 7 | -16.34 | 0.00247 | volando el año | — |

El JSON conserva hashes de los archivos analizados, muestras visuales, palabras, eventos, offsets y 70 filas de revisión. La ausencia de alertas no certifica retención, naturalidad o intención narrativa.

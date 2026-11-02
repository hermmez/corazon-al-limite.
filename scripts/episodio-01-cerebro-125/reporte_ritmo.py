"""Report actual render warnings, acoustic cue offsets and editorial decisions."""
import json
from pathlib import Path
OUT=Path('output/episodio-01-cerebro-125');ROOT=Path('src/episodios/episodio-01-cerebro-125')
def read(path):return json.loads(path.read_text())
a=read(OUT/'analisis_A_original_125.json');b=read(OUT/'analisis_B_final_100.json');t=read(ROOT/'timeline.json');c=read(ROOT/'captions.json');p=read(ROOT/'production.json');proof=read(OUT/'alineacion_audio_real.json');qa=read(OUT/'validacion_FINAL.json')
review=read(OUT/'revision_visual.json')if(OUT/'revision_visual.json').exists()else{'intervals':[]}
playback=read(OUT/'reproduccion_FINAL.json');voice_aac=read(OUT/'sincronia_voz_aac.json')
assert playback['ended']and playback['duration']==70 and playback['mediaError']is None
assert voice_aac['status']=='passed'
old=read(Path('src/episodios/episodio-01-cerebro/production.json'));old_voice=read(Path('output/episodio-01-cerebro/alineacion_audio_real.json'))
early=[]
for s,v in zip(old['scenes'],old_voice['sceneAudio']):
 if s['end']-v['end']>.7:early.append({'scene':s['id'],'voiceEnd':v['end'],'visualEnd':s['end'],'gap':round(s['end']-v['end'],3)})
new_early=[{'scene':s['id'],'voiceEnd':s['voiceEnd'],'visualEnd':s['end'],'gap':round(s['end']-s['voiceEnd'],3)}for s in t['scenes']if s['end']-s['voiceEnd']>.7]
sync=[]
for e in t['events']:
 word=c[e['audioWord']];chapter_entry=e['action']==0
 # Chapter transitions begin before the first spoken word, which may precede
 # the semantic cue (e.g. "Y" before "cómo"). Test the actual entry reference,
 # while preserving its separately measurable offset from the cue.
 reference=t['scenes'][e['scene']]['voiceStart']if chapter_entry else word['startMs']/1000
 offset=e['start']-reference
 sync.append({'event':e['id'],'word':word['text'].strip(),'wordStart':word['startMs']/1000,'eventStart':e['start'],'timingReference':'chapter first spoken word'if chapter_entry else 'cue word','referenceTime':reference,'offsetMs':round(offset*1000,3),'offsetToCueMs':round((e['start']-word['startMs']/1000)*1000,3),'intentionalChapterPreroll':chapter_entry,'warning':abs(offset)>(.08 if chapter_entry else .0011)})
gaps=[{'start':x['start'],'end':y['start'],'gap':round(y['start']-x['start'],3)}for x,y in zip(t['events'],t['events'][1:])if y['start']-x['start']>2]
alerts=[]
for kind,rows in [('lowEvolution',b['visual']['lowEvolution']),('possibleRepetition',b['visual']['possibleRepetition']),('voiceSilence',b['voiceSilenceOver07'])]:
 for x in rows:
  decisions=[r for r in review['intervals']if r['kind']==kind and abs(r['start']-x['start'])<.01 and abs(r['end']-x['end'])<.01]
  alerts.append({'kind':kind,**x,'decision':decisions[0]['decision']if decisions else 'OPEN: inspect actual frames','reviewed':bool(decisions)})
report={'status':'validated-with-editorial-review'if all(x['reviewed']for x in alerts)and not new_early and not any(x['warning']for x in sync)else 'review-required','reference':{'A':'approved original at 1.25x, 56 seconds','B':'new 70-second composition at 1.0x, real expanded local voice'},'voice':{'provider':'Piper local, Aldo es_MX','sameVoiceAsOriginal':False,'tempo':1.25,'pitchPreserved':True,'oldWords':135,'expandedWords':len(c),'referenceWordsPerMinuteIncludingPauses':135/56*60,'newWordsPerMinuteIncludingPauses':len(c)/70*60,'expandedRecordingExists':True,'paidGenerations':0,'creditsSpent':0,'alignmentEngine':proof['engine'],'captionTimingToleranceMs':35},'visual':{'semanticActions':len(t['events']),'authoredGapsOver2s':gaps,'A':a['visual'],'B':b['visual'],'reviews':alerts},'audio':{'referenceVoiceSilences':a['voiceSilenceOver07'],'newVoiceSilences':b['voiceSilenceOver07'],'silenceEdits':proof['silenceEdits']},'earlyNarration':{'original':early,'new':new_early},'synchronization':{'events':sync,'warnings':[x for x in sync if x['warning']]},'technical':qa,'comparisonLimit':'Pixel activity is not a perceptual quality score. New narrator has a different timbre; A/B allows direct listening. No automatic metric proves subjective equivalence.'}
report['playback']=playback;report['voiceAAC']=voice_aac
(OUT/'comparacion_ritmo.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
def intervals(rows):return '\n'.join(f"| {x['start']:.3f}–{x['end']:.3f} | {x['duration']:.3f} |"for x in rows)or'| — | Sin alertas |'
text=f'''# Revisión audiovisual 1.25× · entrega de 70 segundos

**{qa['duration']} s exactos / {qa['frames']} fotogramas / 30 FPS / 1080 × 1920 / H.264 + AAC.** Archivo: `episodio_01_cerebro_70s_FINAL.mp4`. Estado automático/editorial: `{report['status']}`.

## Cambios implementados

- Guion de 135 a {len(c)} palabras (+{(len(c)/135-1)*100:.0f} %). Nuevos conceptos: sensores frente a central de alarmas, cuero cabelludo y músculos, complejidad de migraña, trigémino, sinapsis y pruebas de lenguaje/movimiento durante cirugía despierta.
- Narración completa local mexicana masculina Aldo/Piper; voz diferente de Juan/ElevenLabs. Calibración frente al original y cambio de tempo de 1.25× conservando tono. **Cero generaciones de pago, cero créditos.** No se aceleró globalmente el MP4.
- {len(t['events'])} respuestas semánticas vinculadas a palabras reales; cámara con cambios de foco de 0.28 s, transiciones de 0.34–0.38 s, subtítulos con entrada de 0.18 s, capas con parallax y cerebro persistente. El personaje no flota como recurso principal.
- Nuevas demostraciones: sensor de piel, capas sensibles, tres ramas del trigémino, transferencia sináptica, respuesta verbal/mano, monitoreo y anestesia. Acercamientos a la cara del paciente y la capa superficial corrigen zonas que la previsualización marcó con poca evolución.
- Música original de 84 a 105 BPM (+25 %), variaciones por capítulo, transiciones cortas y pulsos asociados a la señal/monitor. Voz prioritaria con atenuación musical.
- Conservados los 68 PNG y el MP4 aprobado mediante comprobación SHA-256; composición anterior disponible como `Episodio01CerebroAprobado`.

## Comparación obligatoria A/B

`comparacion_AB.mp4` alterna cuatro conceptos equivalentes durante aproximadamente 24 s: original a 1.25× frente a nueva edición a 1.0×. Ambos audios están incluidos. El cambio de locutor permanece explícito.

| Medida | A original 1.25× | B nueva 1.0× |
| --- | --- | --- |
| Duración completa | 56 s | 70 s |
| Palabras | 135 | {len(c)} |
| Palabras/minuto incluyendo pausas | {135/56*60:.1f} | {len(c)/70*60:.1f} |
| Música | 105 BPM al acelerar | 105 BPM nativos |
| Cambio visual mediano por 0.5 s, MAE | {a['visual']['medianHalfSecondChange']:.5f} | {b['visual']['medianHalfSecondChange']:.5f} |
| Percentil 90 del cambio visual | {a['visual']['p90HalfSecondChange']:.5f} | {b['visual']['p90HalfSecondChange']:.5f} |
| Alertas de poca evolución ≥2 s | {len(a['visual']['lowEvolution'])} | {len(b['visual']['lowEvolution'])} |
| Alertas de repetición | {len(a['visual']['possibleRepetition'])} | {len(b['visual']['possibleRepetition'])} |
| Silencios de voz >0.7 s | {len(a['voiceSilenceOver07'])} | {len(b['voiceSilenceOver07'])} |

Las métricas no prueban equivalencia subjetiva de energía o naturalidad. La menor actividad mediana puede reflejar la eliminación de oscilaciones constantes; tampoco sirve para descartar alertas. Se revisan ilustraciones protagonistas entre x=85–950 e y=575–1240, sin títulos, subtítulos ni tarjetas. El sistema mide cambios a 4 muestras/s, MAE <0.018 durante ≥2 s y firmas repetidas con diferencia <0.009. Un evento declarado no borra una alerta del render.

## Tiempos muertos

Pausas >0.7 s en A, **segundos del original acelerado**:

| Intervalo (s) | Duración (s) |
| --- | --- |
{intervals(a['voiceSilenceOver07'])}

Pausas >0.7 s en B, **segundos de la entrega final**:

| Intervalo (s) | Duración (s) |
| --- | --- |
{intervals(b['voiceSilenceOver07'])}

Las pausas largas de A suman {sum(x['duration']for x in a['voiceSilenceOver07']):.3f} s. Se reorganizó el contenido y se añadieron datos; no se rellenaron esos intervalos con planos vacíos.

Finales de voz anticipados >0.7 s: {len(early)} en el original, {len(new_early)} en la edición nueva. El JSON conserva los segundos exactos. Los empalmes de silencio se registran con muestras de inicio/fin y duración resultante; no se eliminan fonemas. El último término termina en {t['scenes'][-1]['voiceEnd']:.3f} s, sin cortar la frase ni prolongar la despedida.

## Alertas visuales y revisión

'''
for x in alerts:text+=f"- **{x['kind']} {x['start']:.3f}–{x['end']:.3f} s:** {x['decision']}\n"
if not alerts:text+='No se detectaron intervalos que superaran los umbrales de revisión. Esto no sustituye la inspección de fotogramas y reproducción.\n'
text+=f'''
## Sincronización y validación

Las {len(c)} palabras proceden de duraciones intrínsecas Piper/VITS verificadas contra las muestras reales emitidas. Se mapearon el cambio de tempo efectivo y los empalmes acústicos, con tolerancia de 35 ms. No se asignan tiempos por longitud de texto. La transcripción independiente está en `auditoria_contenido_voz.json`: es una revisión de contenido, no la fuente de marcas. Sus errores ortográficos no sustituyen el guion.

Eventos con desajuste no intencional: {sum(x['warning']for x in sync)}. La pequeña anticipación de inicio de capítulo se distingue de las activaciones por palabra. La correlación de voz limpia/AAC y la reproducción HTML5 se documentan en `sincronia_voz_aac.json` y `reproduccion_FINAL.json`.

Validación técnica: {qa['frames']} fotogramas decodificados, {qa['distinctFrames']} distintos, {qa['blackRanges']} intervalos negros; {qa['audio']['lufs']} LUFS y pico verdadero {qa['audio']['truePeakDbtp']} dBTP. Reproducción completa en Chromium: {playback['totalVideoFrames']} fotogramas, {playback['droppedVideoFrames']} perdidos, sin error multimedia; desfase de voz/AAC medido {voice_aac['measuredOffsetMs']} ms. La voz, música, efectos, subtítulos SRT/JSON y miniatura acompañan la entrega. El estándar futuro se documenta en `AGENTS.md`; instrucciones reproducibles en el README de la composición.
'''
(OUT/'REPORTE_RITMO.md').write_text(text)
print(json.dumps({'status':report['status'],'alerts':len(alerts),'unreviewed':sum(not x['reviewed']for x in alerts),'earlyNarration':len(new_early),'syncWarnings':sum(x['warning']for x in sync)}))

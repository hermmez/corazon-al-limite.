from pathlib import Path
import json,shutil,subprocess,wave,hashlib,math
import numpy as np
root=Path(__file__).resolve().parents[1];out=root/'public/episodios/ultimo-caballero';src=root/'src/episodios/ultimo-caballero';prod=out;sr=44100
q=json.loads((prod/'guion-y-voz.json').read_text());trans=json.loads((prod/'transcripcion-original.json').read_text())
voice=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out/'narracion-original.mp3'),'-f','f32le','-ar',str(sr),'-ac','1','-']),np.float32).copy();voice*=min(.13/np.sqrt(np.mean(voice**2)),.84/max(abs(voice)))
cuts=[0,7.58,16.32,23.02,32.47,40.88,48.56,56.2,len(voice)/sr];starts=[0,8,18,28,38,47,56,65]
words=[w for s in trans['segments'] for w in s['words']];fixed=[]
for w in words:
 if w['text'].strip()=='.000':
  fixed[-1]['text']='Diez mil' if fixed[-1]['start']<1 else 'diez mil';fixed[-1]['end']=w['end']
 else:fixed.append(w.copy())
def wav(name,data):
 with wave.open(str(out/name),'wb') as f:f.setnchannels(1 if data.ndim==1 else 2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(data,-.99,.99)*32767).astype('<i2').tobytes())
caps=[];mapped=[]
for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
 wav(f'voz-{i+1:02}.wav',voice[round(a*sr):round(b*sr)])
 selected=[w for w in fixed if a<=w['start']<b]
 c=[dict(text=w['text'].strip(),startMs=round((w['start']-a)*1000),endMs=round((w['end']-a)*1000),timestampMs=round(((w['start']+w['end'])/2-a)*1000),confidence=w['probability']) for w in selected];caps.append(c)
 for w in selected:mapped.append(dict(w,startGlobal=starts[i]+w['start']-a,endGlobal=starts[i]+w['end']-a))
(src/'captions.ts').write_text("import type {Caption} from '@remotion/captions';\nexport const captions:Caption[][]="+json.dumps(caps,ensure_ascii=False,indent=2)+';\n')
cues={}
for text,key in [('gatito.','hero'),('cartón,','cardboard'),('espada','sword'),('mamá','mother'),('hermanitos,','babies'),('miedo,','fear'),('temblaban,','tremble'),('familia.','family'),('like','like'),('ratoncito','mouse'),('comentario','comment'),('arco','bow'),('compartas','share'),('puerquito,','pig'),('¿Cuántos','question')]:
 w=next(w for w in mapped if w['text'].strip()==text);cues[key]=w['startGlobal']
(src/'cues.ts').write_text('export const cues='+json.dumps(cues,ensure_ascii=False,indent=2)+' as const;\n')
(out/'sincronizacion.json').write_text(json.dumps(dict(cuts=cuts,starts=starts,playbackRate=1,words=mapped,cues=cues),ensure_ascii=False,indent=2)+'\n')
actions=[
['Filas de hierro pisan el terreno; polvo tras cada apoyo','Escudos y lanzas oscilan con marcha alterna','Cámara recorre filas hacia la formación distante','Estandarte se abre y revela el castillo lejano','Máscara de escudos descubre una figura diminuta','El gatito alza la mirada y sostiene la espada','Seguimiento baja hasta las patitas del caballero','Se fija el contraste de tamaño junto al ejército'],
['Barrido motivado sobre la coraza de cartón','Casco inclina y pluma cede al viento','Brazo mueve la espada y deja ver sus bordes corrugados','La espada flexa muy ligeramente al cambiar la muñeca','Cámara sigue cinta y escudo con corazón','Reflejo cálido revela parches pegados de la coraza','La mirada del gatito conduce al castillo','Castillo se revela por una máscara en profundidad','Bandera de papel ondea desde su asta','Luces en ventanas revelan el refugio humilde'],
['Cámara llega a la ventana central','Aparece la mamá protegiendo a sus dos bebés','Mamá inclina la cabeza hacia ellos','Un bebé mueve su cabeza hacia el protagonista','El otro levanta su patita y saluda','El gatito vuelve la cabeza hacia la ventana','La mamá sostiene una sonrisa preocupada','El pequeño responde con una inclinación de cabeza','La mano aprieta el mango y la espada se endereza','La cámara recorre el corazón del escudo hacia sus pies'],
['Patitas tiemblan con pequeños apoyos separados','La vibración sube a la espada de cartón','Primer plano de ojos; cejas expresan temor','Respira y baja ligeramente la cabeza','Inspira; la coraza sube con el pecho','Vuelve la mirada al ejército en marcha','Un barrido muestra la familia detrás de él','Cabeza vuelve al frente y se detiene el temblor','El brazo alza el escudo y revela el corazón','La postura se afirma ante el ejército'],
['La luz cambia mientras el gatito observa el costado','El corazón trazado inicia una revelación','Aparece la equivalencia narrativa del like','Un ratoncito entra corriendo con pasos alternos','La cámara sigue al ratón más pequeño que el héroe','Ratón frena, apoya sus pies y alza la espada','Dos ratoncitos más llegan con pasos desfasados','Se encadenan otros ratones en pequeña formación','El protagonista inclina la cabeza para recibirlos'],
['El símbolo de comentario abre la siguiente composición','Un arquero asoma tras una caja de cartón','El gatito arquero da dos pasos con articulación','El arquero se detiene y levanta el arco','La cuerda se tensa sin lanzar la flecha','La cámara sigue el arco hasta las murallas','Segundo arquero se revela en una almena','Otros arqueros se acomodan junto a las cajas','El protagonista observa a sus nuevos compañeros'],
['Un símbolo de compartir descubre el camino de llegada','Aparece el jinete sobre un puerquito','Patitas del puerquito trotan en pares alternos','El jinete acompaña el trote con brazos y cuerpo','Cámara sigue a la montura hacia el gatito','Puerquito baja cabeza y frena con apoyos','El jinete alza su espada de cartón','Llegan dos jinetes más en profundidad','La formación se abre para recibir a los jinetes'],
['El héroe mira sus compañeros y sonríe','La cámara se eleva revelando castillo y defensores','La sombra del enemigo avanza por el suelo','El gatito levanta la espada ante las filas','Pregunta final se revela; corte antes del combate']]
principles=['encadena','camara','mascara','transforma','sincroniza'];plan=[]
for scene,aa in enumerate(actions):
 for local,action in enumerate(aa):
  second=starts[scene]+local;phrase=' '.join(w['text'].strip() for w in mapped if w['startGlobal']<second+1 and w['endGlobal']>second)
  plan.append(dict(second=second,scene=scene+1,visible=['Ejército e intrépido gatito','Cartón y castillo','Familia en ventana','Valentía del pequeño','Ratoncitos caballeros','Gatitos arqueros','Jinetes sobre puerquitos','Defensores frente al ejército'][scene],action=action,movement=action,change=action,transition='encadenada; máscaras o cambio de plano de 0.33 s cuando cambia la escena',principle=principles[(scene+local)%5],narration=phrase or 'Pausa expresiva: continúa la acción motivada',meaningful=True))
assert len(plan)==70 and [p['second'] for p in plan]==list(range(70))
(out/'plan-70-segundos.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
# Original acoustic-inspired synth score and foley, no third-party samples.
n=70*sr;music=np.zeros((n,2),np.float32);sfx=np.zeros((n,2),np.float32);rng=np.random.default_rng(170110)
def put(dest,at,sig,pan=0):
 a=round(at*sr);l=min(len(sig),n-a)
 if l>0:dest[a:a+l,0]+=sig[:l]*math.sqrt((1-pan)/2);dest[a:a+l,1]+=sig[:l]*math.sqrt((1+pan)/2)
def note(m,dur,vol,kind='piano'):
 t=np.arange(round(sr*dur))/sr;f=440*2**((m-69)/12)
 if kind=='strings':return (np.sin(2*np.pi*f*t)+.16*np.sin(2*np.pi*2*f*t))*np.minimum(t/.8,1)*np.minimum((dur-t)/.8,1)*vol
 return (np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*2.003*f*t)+.08*np.sin(2*np.pi*3.999*f*t))*(1-np.exp(-t*55))*np.exp(-t*1.6)*vol
chords=[[45,52,57,60],[41,48,53,57],[48,55,60,64],[43,50,55,59]]
for bar in range(18):
 at=bar*4
 if at>=70:break
 for j,m in enumerate(chords[bar%4]):put(music,at,note(m,min(5,70-at),.003 if at<38 else .006,'strings'),(j-1.5)/4)
 for j in range(3):put(music,at+.3+j,note(chords[bar%4][j]+12,2,.008 if 18<at<38 else .004),(j-1)/4)
for at in np.arange(0,70,1.0):
 if 18<at<28:continue
 t=np.arange(round(.45*sr))/sr;vol=.014 if at<8 else (.006 if at<38 else .012)
 put(music,float(at),np.sin(2*np.pi*(60*t+25*(1-np.exp(-t*10))/10))*np.exp(-t*13)*vol)
noise=rng.normal(0,1,n);wind=np.convolve(noise,np.ones(150)/150,mode='same');sfx[:,0]+=wind*.005;sfx[:,1]+=np.roll(wind,120)*.004
for start,end,step,vol in [(0,8,.46,.012),(41,46,.27,.004),(48,52,.4,.004),(57,63,.26,.006)]:
 for at in np.arange(start,end,step):
  t=np.arange(round(.1*sr))/sr;sig=rng.normal(0,1,len(t))*np.exp(-t*55)*vol+np.sin(2*np.pi*100*t)*np.exp(-t*45)*vol*.5;put(sfx,float(at),sig,(at%1-.5)*.5)
for at in [8,18,28,38,47,56,65]:
 t=np.arange(round(.25*sr))/sr;put(sfx,at,rng.normal(0,1,len(t))*np.sin(np.pi*t/.25)**2*.002)
# Brief family gaze musical space and ascending final voicing.
for dest in [music,sfx]:dest[round(23.7*sr):round(24.15*sr)]*=.3
for j,m in enumerate([60,64,67,72]):put(music,65+j*.45,note(m,4,.009,'strings'),(j-1.5)/4)
t=np.arange(round(.55*sr))/sr;put(sfx,69.44,np.sin(2*np.pi*62*t)*np.exp(-t*13)*.022)
fade=np.minimum(np.arange(n)/(.02*sr),1)*np.minimum((n-1-np.arange(n))/(.08*sr),1)
# Duck the score around every voice segment, retaining full action beats.
for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
 lo=round(starts[i]*sr);hi=min(n,round((starts[i]+b-a)*sr));music[lo:hi]*=.5
wav('musica-medieval-original.wav',music*fade[:,None]);wav('ambiente-original.wav',sfx*fade[:,None])
manifest=dict(episode=q['episode'],voiceCredits=4.14,jobId=q['jobId'],originalVoiceSha256=hashlib.sha256((out/'narracion-original.mp3').read_bytes()).hexdigest(),sourceSeconds=len(voice)/sr,cuts=cuts,starts=starts,playbackRate=1,frames=2100,fps=30,width=1080,height=1920,narrativeHyenas=10000,realInteractions=None,interactionMechanism='Dinámica narrativa ficticia',music='Composición, síntesis y efectos locales originales, sin muestras de terceros')
manifest['approvedReferenceSha256']={str(f.relative_to(root)):hashlib.sha256(f.read_bytes()).hexdigest() for f in [root/'public/imagenes/personajes/01_neutral.png',root/'public/imagenes/escenarios/03_sala.png']}
manifest['rigging']='Partes anatómicas con máscaras de la misma ilustración; transformaciones de cabeza, brazos, patas, cola; poses de marcha de 8 fases para multitudes lejanas.'
(out/'produccion.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(cues=cues,sourceSeconds=len(voice)/sr,voiceEnd=starts[-1]+cuts[-1]-cuts[-2]),indent=2))

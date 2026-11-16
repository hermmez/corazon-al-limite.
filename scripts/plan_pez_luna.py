"""Editorial plan written before any animation, one meaningful action per second."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
rows=[
('Pez luna enorme de perfil','Aletas dorsal y anal oscilan desde el primer fotograma; el pez avanza.','Silueta y ojos visibles inmediatamente.','Sin introducción','Articulación + cámara'),
('Perfil del gigante','La aleta cercana se flexiona y la cabeza cambia ligeramente de orientación.','Se percibe su cuerpo comprimido.','Continuidad','Articulación'),
('Borde posterior','La cámara recorre el contorno hacia la parte posterior.','El borde truncado explica la sorpresa del gancho.','Seguimiento breve','Cámara'),
('Buzo y pez','El buzo entra mediante máscara y flexiona rodillas y tobillos.','Aparece una referencia humana de tamaño.','Máscara de agua','Máscara + articulación'),
('Comparación de escala','El pez pasa delante del buzo mientras éste sigue al animal con la cabeza.','Se separan planos y escalas coherentes.','Cruce de capas','Encadena + cámara'),
('Cabeza y ojo','La cámara sigue al pez hacia la cabeza; boca y opérculo se mueven discretamente.','Primer plano de anatomía real.','Acercamiento motivado','Cámara + articulación'),
('Cuerpo completo','La mirada del buzo guía una línea alrededor del cuerpo del pez.','Se demuestra que el animal está completo.','Trazo sobre contorno','Máscara'),
('Silueta anatómica','El color se atenúa y emerge un esquema desde el contorno del mismo animal.','La forma se convierte en explicación.','Barrido de 0,35 s','Transforma'),
('Nombre del animal','Aparece Pez luna y la silueta sigue moviendo aletas.','Se identifica el animal sin congelar la ilustración.','Revelación por máscara','Sincroniza'),
('Mola mola','El nombre científico se completa mientras el pez gira levemente.','Se distingue la especie de otros molas.','Máscara de texto','Encadena'),
('Zona posterior','El encuadre se desplaza desde el ojo hacia el extremo posterior.','La atención pasa al lugar donde iría una cola.','Seguimiento','Cámara'),
('Pez convencional','Se revela un pez de comparación con aleta caudal convencional.','Se comparan dos anatomías sin deformar al pez luna.','Máscara lateral','Máscara'),
('Comparación de colas','El pez convencional flexiona cuerpo y aleta caudal.','Se ve la diferencia entre cola y clavus.','Continuidad de comparación','Articulación'),
('Borde posterior real','Una máscara descubre el borde ondulado posterior del pez luna.','Se concentra la atención en su estructura real.','Máscara local','Máscara + sincroniza'),
('Contorno del clavus','Un trazo recorre el borde posterior; las aletas continúan activas.','Se delimita la estructura sin inventar otra cola.','Trazo progresivo','Máscara'),
('Clavus','La etiqueta clavus y una línea de llamada aparecen al pronunciarlo.','El nombre queda unido a la parte correcta.','Revelación local','Sincroniza'),
('Timón','Una curva de dirección se dibuja desde el clavus.','Se explica su función de orientación.','Trazo de trayectoria','Encadena'),
('Cambio de rumbo','El clavus se orienta suavemente y el pez cambia su trayectoria.','La orientación provoca el siguiente desplazamiento.','Seguimiento curvo','Articulación + encadena'),
('Esquema a animal','El esquema recupera color y abandona la comparación nadando.','Se vuelve de la explicación al entorno marino.','Barrido de 0,35 s','Transforma'),
('Aletas principales','La cámara sigue el avance y destaca las bases dorsal y anal.','La atención pasa de timón a propulsión.','Máscara de iluminación','Cámara + sincroniza'),
('Batido de aletas','Ambas aletas baten de forma coordinada; el cuerpo avanza.','La propulsión mueve el animal.','Continuidad','Articulación'),
('Dorsal y anal','Las líneas de llamada alcanzan cada aleta sin tapar al pez.','Se identifican los dos motores de la natación.','Trazo progresivo','Máscara + sincroniza'),
('Propulsión coordinada','Las aletas completan otra oscilación y el pez recorre una distancia visible.','Se conecta movimiento y avance.','Seguimiento lateral','Encadena'),
('Recorrido submarino','La cámara acompaña al pez entre dos capas de agua.','La profundidad se percibe por el paralaje.','Desplazamiento entre capas','Cámara'),
('Otra forma de nadar','Un pez pequeño aparece y mueve su aleta caudal.','La comparación muestra dos mecanismos distintos.','Entrada por objeto','Encadena'),
('Comparación breve','Ambos peces avanzan con articulaciones propias.','Se ve que el pez luna no depende de un coletazo convencional.','Plano compartido','Articulación'),
('Pez luna continúa','El pez pequeño sale y el pez luna ocupa el centro de seguimiento.','La comparación devuelve la atención al protagonista.','Salida encadenada','Encadena'),
('Aletas en acción','Un ciclo completo de aletas acompaña un cambio de encuadre.','El animal continúa vivo entre explicaciones.','Plano lateral motivado','Cámara + articulación'),
('Buzo y gigante','Se revela el buzo con manos separadas y piernas articuladas.','Regresa una referencia coherente de escala.','Máscara de 0,35 s','Máscara'),
('Comparación humana','El buzo flexiona aletas de buceo y observa al pez que pasa.','Se comprende el tamaño sin cifras inventadas.','Plano de comparación','Articulación + encadena'),
('Animal activo','El pez se adelanta al buzo y empieza a orientar la cabeza hacia abajo.','El gigante prepara una inmersión.','Seguimiento descendente','Encadena'),
('Inicio de inmersión','Las aletas cambian de fase y el cuerpo inclina su trayectoria.','El avance se convierte en descenso.','Cambio de trayectoria','Articulación'),
('Separación del buzo','El buzo queda en otra capa mientras la cámara sigue al pez.','La inmersión tiene continuidad espacial.','Paralaje de capas','Cámara'),
('Agua más profunda','El pez desciende y los rayos superiores se desplazan fuera del plano.','Se inicia el cambio de iluminación.','Seguimiento vertical','Cámara'),
('Capas del océano','Una banda de agua más fría pasa por delante del animal.','La profundidad se expresa sin metros inventados.','Máscara de color','Transforma'),
('Descenso continuo','El pez atraviesa otra capa mientras sus aletas siguen impulsándolo.','El entorno pierde luz gradualmente.','Barrido de agua','Cámara + articulación'),
('Océano profundo','Aparecen siluetas ilustradas de organismos en otra capa.','Se revela que hay alimento en profundidad.','Máscaras sucesivas','Máscara'),
('Organismos marinos','Una medusa pulsa y una cadena de salpas se curva.','El recorrido prepara la alimentación.','Continuidad entre capas','Encadena'),
('Medusa cercana','La medusa cruza el encuadre y la cámara cambia de objetivo.','El siguiente plano nace del recorrido de un organismo.','Transición mediante medusa','Cámara + transforma'),
('Alimento: medusa','La campana se contrae y los tentáculos responden con retraso.','Se muestra una presa gelatinosa.','Seguimiento breve','Articulación + sincroniza'),
('Salpas','Una cadena de salpas entra con contracciones encadenadas.','Se amplía la dieta más allá de las medusas.','Máscara lateral','Máscara + sincroniza'),
('Aproximación','El pez luna se acerca mediante el impulso de sus aletas.','La alimentación resulta de una acción de búsqueda.','Seguimiento de encuentro','Encadena'),
('Alimentación natural','La boca se abre discretamente y aspira una presa de tamaño proporcionado.','Se muestra la captura sin boca exagerada ni violencia gráfica.','Máscara de oclusión','Articulación'),
('Dieta diversa','Otro organismo ilustrado atraviesa una capa más alejada.','Se recuerda que no come solamente medusas.','Revelación breve','Máscara'),
('Búsqueda de alimento','El pez orienta la cabeza hacia otra zona de salpas.','La captura conduce a un nuevo recorrido.','Cambio motivado de trayectoria','Encadena'),
('Recorrido oceánico','La cámara sigue al animal entre dos planos ilustrados.','Se explican sus desplazamientos para buscar comida.','Paralaje lateral','Cámara'),
('Segundo acercamiento','Las aletas impulsan un giro leve y la boca vuelve a su posición normal.','Se mantiene la anatomía durante el movimiento.','Continuidad','Articulación'),
('Cambio de zona','Un organismo cercano pasa por delante y abre una máscara de agua.','El recorrido conecta ambientes sin collage.','Transición por objeto de 0,35 s','Transforma'),
('Dirección de ascenso','El pez empieza a orientar su recorrido hacia la luz superior.','La alimentación conduce al regreso superficial.','Trayectoria ascendente','Encadena'),
('Ascenso','El batido impulsa al pez hacia un área más iluminada.','Se inicia la explicación del comportamiento superficial.','Seguimiento vertical','Cámara + sincroniza'),
('Luz de superficie','Los rayos se abren en capas y el cuerpo recibe una luz más cálida.','Se percibe la proximidad de la superficie.','Máscara de luz','Máscara'),
('Cambio de perspectiva','El pez gira hacia la cámara con una vista frontal coherente.','Se hace visible su compresión lateral.','Transición controlada entre vistas','Cámara'),
('Vista frontal','Las aletas dorsal y anal oscilan a ambos lados de su plano.','La perspectiva frontal prepara el giro corporal.','Continuidad','Articulación'),
('Giro de lado','Visto de frente, el pez rota sobre su eje longitudinal.','El espectador ve cómo se coloca de lado.','Giro corporal motivado','Articulación + sincroniza'),
('Vista desde arriba','Una máscara de ondas cambia a cámara cenital y muestra al pez de lado.','La postura superficial se entiende sin confundirla con nadar cabeza arriba.','Máscara de superficie de 0,4 s','Transforma + cámara'),
('Recuperación de calor','Una franja de agua cálida recorre la superficie y el pez mueve suavemente sus aletas.','Se ilustra una posible función, sin grados inventados.','Máscara de iluminación','Sincroniza'),
('Postura superficial','Las aletas se flexionan y la superficie se desplaza alrededor del cuerpo.','La postura no se convierte en imagen congelada.','Continuidad','Articulación'),
('Posible explicación','La luz cálida se revela sobre el flanco junto a una frase condicional breve.','Se evita presentar una causa única.','Revelación por máscara','Máscara + sincroniza'),
('Regreso al recorrido','El pez cambia gradualmente su orientación; la cámara vuelve bajo el agua.','La escena superficial conecta con el cierre.','Transición entre capas','Cámara + transforma'),
('Animal completo','Las aletas se extienden y una línea recorre la silueta íntegra.','El cierre responde al gancho del pez incompleto.','Trazo de contorno','Máscara + sincroniza'),
('Perfil completo','El pez avanza con sus aletas activas y el cuerpo conserva proporciones.','La anatomía se confirma en movimiento.','Seguimiento lateral','Articulación'),
('Buzo cercano','El buzo aparece a distancia coherente y gira la cabeza.','La escala humana prepara la pregunta.','Máscara breve','Encadena'),
('Adaptación','Un esquema de contorno acompaña al animal y se integra otra vez en él.','Se explica evolución sin una metamorfosis individual.','Contorno a ilustración','Transforma'),
('Recorrido final','La cámara sigue un cruce del pez delante de una capa marina.','El cierre continúa como escena animada.','Seguimiento','Cámara'),
('Pez y buzo','El buzo flexiona piernas y el pez mueve aletas al pasar a su lado.','Se construye la situación de nadar junto al animal.','Plano compartido','Articulación + encadena'),
('Acercamiento frontal','El pez orienta la cabeza hacia la cámara; el buzo mantiene la distancia.','La perspectiva acerca la pregunta al espectador.','Cambio motivado de vista','Cámara'),
('Invitación','El buzo mira al pez y abre ligeramente una mano.','El gesto prepara ahora dime.','Continuidad de mirada y gesto','Encadena + sincroniza'),
('Pregunta final','Las palabras de la pregunta se revelan mientras el pez continúa nadando.','Aparece el llamado a participar.','Máscara de texto','Máscara + sincroniza'),
('¿Nadarías junto a él?','El buzo se mantiene al lado con aleteo articulado; el pez cambia levemente de rumbo.','Se sostiene la pregunta con actividad informativa.','Seguimiento de ambos','Articulación'),
('Último segundo','El pez y el buzo continúan su movimiento mientras termina la voz.','Cierre inmediato tras la pregunta, sin despedida.','Sin salida añadida','Sincroniza + articulación'),
]
assert len(rows)==70
q=json.loads((ROOT/'public/episodios/pez-luna-oceanico/guion-y-voz.json').read_text())
anchors=[0,8,19,28,39,49,59,70]
plan=[]
for s,(main,action,change,transition,technique) in enumerate(rows):
    scene=max(i for i,t in enumerate(anchors[:-1]) if s>=t)
    plan.append(dict(second=s,fromFrame=s*30,toFrame=s*30+29,element=main,action=action,movement=action,change=change,transition=transition,technique=technique,narration=q['narration'][scene]))
(ROOT/'public/episodios/pez-luna-oceanico/plan-70s.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
out='# Pez luna — plan previo de los 70 segundos\n\nCada registro contiene una acción informativa. Los subtítulos, el ruido y un zoom constante no sustituyen la animación. Los tiempos de voz se ajustan después a la toma real, sin cambiar su velocidad.\n\n| Segundo | Elemento | Acción y movimiento | Cambio | Transición | Técnica | Narración |\n|---|---|---|---|---|---|---|\n'
for row in plan:out+='| '+f"{row['second']:02}"+' | '+' | '.join(row[k] for k in ['element','action','change','transition','technique','narration'])+' |\n'
(ROOT/'docs/episodios/pez-luna-oceanico-plan-70s.md').write_text(out)
print('70 segundos planificados antes de animar')

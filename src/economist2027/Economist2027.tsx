import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Captions} from './Captions';
import {C,ease} from './Art';
import {Scene1} from './Scene1';
import {Scene2} from './Scene2';
import {Scene3} from './Scene3';
import {Scene4} from './Scene4';
import {Scene5} from './Scene5';
import {Scene6} from './Scene6';
import {Scene7} from './Scene7';

const IncomingMask=({children,kind}:{children:React.ReactNode;kind:string})=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),p=ease(f/fps,0,.35);return <AbsoluteFill style={{clipPath:kind==='iris'?`circle(${p*140}% at 68% 46%)`:kind==='wave'?`inset(${(1-p)*100}% 0 0 0)`:`inset(0 ${(1-p)*100}% 0 0)`}}>{children}</AbsoluteFill>};
export const Economist2027=()=>{const {fps}=useVideoConfig();return <AbsoluteFill style={{background:C.navy,overflow:'hidden'}}>
<Audio src={staticFile('episodios/economist-2027/musica-original.wav')} volume={.65}/>
<Audio src={staticFile('episodios/economist-2027/efectos-originales.wav')} volume={.55}/>
<Sequence name="01 — La portada" from={0 * fps} durationInFrames={8 * fps + 11} premountFor={fps}>
<Scene1/>
<Audio src={staticFile("episodios/economist-2027/voz-01.wav")}/>
<Captions captions={[
 {
  "text": " Misiles,",
  "startMs": 0,
  "endMs": 540,
  "timestampMs": 270,
  "confidence": 0.5856
 },
 {
  "text": " incendios",
  "startMs": 1100,
  "endMs": 1740,
  "timestampMs": 1420,
  "confidence": 0.9958
 },
 {
  "text": " y",
  "startMs": 1740,
  "endMs": 2320,
  "timestampMs": 2030,
  "confidence": 0.8439
 },
 {
  "text": " un",
  "startMs": 2320,
  "endMs": 2480,
  "timestampMs": 2400,
  "confidence": 0.9827
 },
 {
  "text": " cerebro.",
  "startMs": 2480,
  "endMs": 3080,
  "timestampMs": 2780,
  "confidence": 0.9947
 },
 {
  "text": " ¿Qué",
  "startMs": 3560,
  "endMs": 3800,
  "timestampMs": 3680,
  "confidence": 0.9485
 },
 {
  "text": " esconde",
  "startMs": 3800,
  "endMs": 4200,
  "timestampMs": 4000,
  "confidence": 0.7265
 },
 {
  "text": " esta",
  "startMs": 4200,
  "endMs": 4480,
  "timestampMs": 4340,
  "confidence": 0.9401
 },
 {
  "text": " inquietante",
  "startMs": 4480,
  "endMs": 5200,
  "timestampMs": 4840,
  "confidence": 0.9942
 },
 {
  "text": " portada",
  "startMs": 5200,
  "endMs": 5720,
  "timestampMs": 5460,
  "confidence": 0.9984
 },
 {
  "text": " de",
  "startMs": 5720,
  "endMs": 5900,
  "timestampMs": 5810,
  "confidence": 0.901
 },
 {
  "text": " The",
  "startMs": 5900,
  "endMs": 6000,
  "timestampMs": 5950,
  "confidence": 0.5619
 },
 {
  "text": " Economist",
  "startMs": 6000,
  "endMs": 6500,
  "timestampMs": 6250,
  "confidence": 0.99
 },
 {
  "text": " para",
  "startMs": 6500,
  "endMs": 6720,
  "timestampMs": 6610,
  "confidence": 0.9813
 },
 {
  "text": " 2027?",
  "startMs": 6720,
  "endMs": 7540,
  "timestampMs": 7130,
  "confidence": 0.9717
 }
]}/>
</Sequence>
<Sequence name="02 — Los líderes" from={8 * fps} durationInFrames={10 * fps + 11} premountFor={fps}>
<IncomingMask kind="iris"><Scene2/></IncomingMask>
<Audio src={staticFile("episodios/economist-2027/voz-02.wav")}/>
<div style={{position:'absolute',top:1390,left:100,color:'#b8cbc4',fontFamily:'Arial',fontSize:20,letterSpacing:2}}>RECREACIÓN 2D · LECTURA VISUAL</div>
<Captions captions={[
 {
  "text": " Arriba,",
  "startMs": 120,
  "endMs": 620,
  "timestampMs": 370,
  "confidence": 0.9572
 },
 {
  "text": " los",
  "startMs": 960,
  "endMs": 1080,
  "timestampMs": 1020,
  "confidence": 0.9913
 },
 {
  "text": " líderes",
  "startMs": 1080,
  "endMs": 1520,
  "timestampMs": 1300,
  "confidence": 0.9978
 },
 {
  "text": " parecen",
  "startMs": 1520,
  "endMs": 1900,
  "timestampMs": 1710,
  "confidence": 0.993
 },
 {
  "text": " vigilar",
  "startMs": 1900,
  "endMs": 2360,
  "timestampMs": 2130,
  "confidence": 0.9827
 },
 {
  "text": " el",
  "startMs": 2360,
  "endMs": 2560,
  "timestampMs": 2460,
  "confidence": 0.998
 },
 {
  "text": " mundo.",
  "startMs": 2560,
  "endMs": 2840,
  "timestampMs": 2700,
  "confidence": 0.9978
 },
 {
  "text": " La",
  "startMs": 3420,
  "endMs": 3540,
  "timestampMs": 3480,
  "confidence": 0.9902
 },
 {
  "text": " revista",
  "startMs": 3540,
  "endMs": 3980,
  "timestampMs": 3760,
  "confidence": 0.9976
 },
 {
  "text": " analiza",
  "startMs": 3980,
  "endMs": 4520,
  "timestampMs": 4250,
  "confidence": 0.9838
 },
 {
  "text": " la",
  "startMs": 4520,
  "endMs": 4660,
  "timestampMs": 4590,
  "confidence": 0.9882
 },
 {
  "text": " sucesión",
  "startMs": 4660,
  "endMs": 5160,
  "timestampMs": 4910,
  "confidence": 0.997
 },
 {
  "text": " de",
  "startMs": 5160,
  "endMs": 5280,
  "timestampMs": 5220,
  "confidence": 0.9941
 },
 {
  "text": " Trump",
  "startMs": 5280,
  "endMs": 5660,
  "timestampMs": 5470,
  "confidence": 0.9967
 },
 {
  "text": " y",
  "startMs": 5660,
  "endMs": 5980,
  "timestampMs": 5820,
  "confidence": 0.9927
 },
 {
  "text": " el",
  "startMs": 5980,
  "endMs": 6100,
  "timestampMs": 6040,
  "confidence": 0.9995
 },
 {
  "text": " avance",
  "startMs": 6100,
  "endMs": 6400,
  "timestampMs": 6250,
  "confidence": 0.9985
 },
 {
  "text": " del",
  "startMs": 6400,
  "endMs": 6640,
  "timestampMs": 6520,
  "confidence": 0.9957
 },
 {
  "text": " populismo.",
  "startMs": 6640,
  "endMs": 7240,
  "timestampMs": 6940,
  "confidence": 0.9984
 }
]}/>
</Sequence>
<Sequence name="03 — Inteligencia artificial" from={18 * fps} durationInFrames={10 * fps + 11} premountFor={fps}>
<IncomingMask kind="flag"><Scene3/></IncomingMask>
<Audio src={staticFile("episodios/economist-2027/voz-03.wav")}/>
<div style={{position:'absolute',top:1390,left:100,color:'#b8cbc4',fontFamily:'Arial',fontSize:20,letterSpacing:2}}>RECREACIÓN 2D · LECTURA VISUAL</div>
<Captions captions={[
 {
  "text": " Pero",
  "startMs": 40,
  "endMs": 280,
  "timestampMs": 160,
  "confidence": 0.9602
 },
 {
  "text": " mira",
  "startMs": 280,
  "endMs": 660,
  "timestampMs": 470,
  "confidence": 0.781
 },
 {
  "text": " el",
  "startMs": 660,
  "endMs": 860,
  "timestampMs": 760,
  "confidence": 0.9796
 },
 {
  "text": " centro:",
  "startMs": 860,
  "endMs": 1160,
  "timestampMs": 1010,
  "confidence": 0.9864
 },
 {
  "text": " un",
  "startMs": 1740,
  "endMs": 1880,
  "timestampMs": 1810,
  "confidence": 0.9821
 },
 {
  "text": " cerebro",
  "startMs": 1880,
  "endMs": 2460,
  "timestampMs": 2170,
  "confidence": 0.9964
 },
 {
  "text": " rodeado",
  "startMs": 2460,
  "endMs": 3120,
  "timestampMs": 2790,
  "confidence": 0.9834
 },
 {
  "text": " de",
  "startMs": 3120,
  "endMs": 3300,
  "timestampMs": 3210,
  "confidence": 0.9975
 },
 {
  "text": " tecnología.",
  "startMs": 3300,
  "endMs": 3820,
  "timestampMs": 3560,
  "confidence": 0.9936
 },
 {
  "text": " Es",
  "startMs": 4400,
  "endMs": 4600,
  "timestampMs": 4500,
  "confidence": 0.987
 },
 {
  "text": " una",
  "startMs": 4600,
  "endMs": 4760,
  "timestampMs": 4680,
  "confidence": 0.997
 },
 {
  "text": " pista",
  "startMs": 4760,
  "endMs": 5040,
  "timestampMs": 4900,
  "confidence": 0.9978
 },
 {
  "text": " sobre",
  "startMs": 5040,
  "endMs": 5380,
  "timestampMs": 5210,
  "confidence": 0.9976
 },
 {
  "text": " la",
  "startMs": 5380,
  "endMs": 5520,
  "timestampMs": 5450,
  "confidence": 0.998
 },
 {
  "text": " inteligencia",
  "startMs": 5520,
  "endMs": 6100,
  "timestampMs": 5810,
  "confidence": 0.9877
 },
 {
  "text": " artificial,",
  "startMs": 6100,
  "endMs": 6640,
  "timestampMs": 6370,
  "confidence": 0.9978
 },
 {
  "text": " sus",
  "startMs": 7060,
  "endMs": 7240,
  "timestampMs": 7150,
  "confidence": 0.9719
 },
 {
  "text": " riesgos",
  "startMs": 7240,
  "endMs": 7720,
  "timestampMs": 7480,
  "confidence": 0.9955
 },
 {
  "text": " y",
  "startMs": 7720,
  "endMs": 8180,
  "timestampMs": 7950,
  "confidence": 0.876
 },
 {
  "text": " el",
  "startMs": 8180,
  "endMs": 8300,
  "timestampMs": 8240,
  "confidence": 0.9969
 },
 {
  "text": " rechazo",
  "startMs": 8300,
  "endMs": 8760,
  "timestampMs": 8530,
  "confidence": 0.9971
 },
 {
  "text": " que",
  "startMs": 8760,
  "endMs": 8960,
  "timestampMs": 8860,
  "confidence": 0.9962
 },
 {
  "text": " provoca.",
  "startMs": 8960,
  "endMs": 9380,
  "timestampMs": 9170,
  "confidence": 0.993
 }
]}/>
</Sequence>
<Sequence name="04 — Tensiones internacionales" from={28 * fps} durationInFrames={11 * fps + 11} premountFor={fps}>
<IncomingMask kind="iris"><Scene4/></IncomingMask>
<Audio src={staticFile("episodios/economist-2027/voz-04.wav")}/>
<div style={{position:'absolute',top:1390,left:100,color:'#b8cbc4',fontFamily:'Arial',fontSize:20,letterSpacing:2}}>RECREACIÓN 2D · LECTURA VISUAL</div>
<Captions captions={[
 {
  "text": " Más",
  "startMs": 140,
  "endMs": 380,
  "timestampMs": 260,
  "confidence": 0.9949
 },
 {
  "text": " abajo",
  "startMs": 380,
  "endMs": 680,
  "timestampMs": 530,
  "confidence": 0.9946
 },
 {
  "text": " aparecen",
  "startMs": 680,
  "endMs": 1320,
  "timestampMs": 1000,
  "confidence": 0.9264
 },
 {
  "text": " tanques",
  "startMs": 1320,
  "endMs": 1860,
  "timestampMs": 1590,
  "confidence": 0.9819
 },
 {
  "text": " y",
  "startMs": 1860,
  "endMs": 2100,
  "timestampMs": 1980,
  "confidence": 0.9986
 },
 {
  "text": " armas.",
  "startMs": 2100,
  "endMs": 2340,
  "timestampMs": 2220,
  "confidence": 0.9981
 },
 {
  "text": " La",
  "startMs": 2340,
  "endMs": 3060,
  "timestampMs": 2700,
  "confidence": 0.6015
 },
 {
  "text": " publicación",
  "startMs": 3060,
  "endMs": 3640,
  "timestampMs": 3350,
  "confidence": 0.9826
 },
 {
  "text": " teme",
  "startMs": 3640,
  "endMs": 4040,
  "timestampMs": 3840,
  "confidence": 0.9816
 },
 {
  "text": " repercusiones",
  "startMs": 4040,
  "endMs": 4700,
  "timestampMs": 4370,
  "confidence": 0.9952
 },
 {
  "text": " de",
  "startMs": 4700,
  "endMs": 4920,
  "timestampMs": 4810,
  "confidence": 0.9977
 },
 {
  "text": " la",
  "startMs": 4920,
  "endMs": 5020,
  "timestampMs": 4970,
  "confidence": 0.9948
 },
 {
  "text": " guerra",
  "startMs": 5020,
  "endMs": 5240,
  "timestampMs": 5130,
  "confidence": 0.928
 },
 {
  "text": " con",
  "startMs": 5240,
  "endMs": 5500,
  "timestampMs": 5370,
  "confidence": 0.9963
 },
 {
  "text": " Irán",
  "startMs": 5500,
  "endMs": 5800,
  "timestampMs": 5650,
  "confidence": 0.9458
 },
 {
  "text": " y",
  "startMs": 5800,
  "endMs": 6180,
  "timestampMs": 5990,
  "confidence": 0.8546
 },
 {
  "text": " observa",
  "startMs": 6180,
  "endMs": 6600,
  "timestampMs": 6390,
  "confidence": 0.9941
 },
 {
  "text": " con",
  "startMs": 6600,
  "endMs": 6760,
  "timestampMs": 6680,
  "confidence": 0.9949
 },
 {
  "text": " inquietud",
  "startMs": 6760,
  "endMs": 7300,
  "timestampMs": 7030,
  "confidence": 0.9975
 },
 {
  "text": " la",
  "startMs": 7300,
  "endMs": 7540,
  "timestampMs": 7420,
  "confidence": 0.9931
 },
 {
  "text": " situación",
  "startMs": 7540,
  "endMs": 8000,
  "timestampMs": 7770,
  "confidence": 0.9996
 },
 {
  "text": " de",
  "startMs": 8000,
  "endMs": 8200,
  "timestampMs": 8100,
  "confidence": 0.9941
 },
 {
  "text": " Taiwán.",
  "startMs": 8200,
  "endMs": 8620,
  "timestampMs": 8410,
  "confidence": 0.8607
 }
]}/>
</Sequence>
<Sequence name="05 — Clima" from={39 * fps} durationInFrames={10 * fps + 11} premountFor={fps}>
<IncomingMask kind="wave"><Scene5/></IncomingMask>
<Audio src={staticFile("episodios/economist-2027/voz-05.wav")}/>
<div style={{position:'absolute',top:1390,left:100,color:'#b8cbc4',fontFamily:'Arial',fontSize:20,letterSpacing:2}}>RECREACIÓN 2D · LECTURA VISUAL</div>
<Captions captions={[
 {
  "text": " Y",
  "startMs": 130,
  "endMs": 270,
  "timestampMs": 200,
  "confidence": 0.9725
 },
 {
  "text": " el",
  "startMs": 270,
  "endMs": 390,
  "timestampMs": 330,
  "confidence": 0.9867
 },
 {
  "text": " fuego",
  "startMs": 390,
  "endMs": 670,
  "timestampMs": 530,
  "confidence": 0.9789
 },
 {
  "text": " podemos",
  "startMs": 670,
  "endMs": 1210,
  "timestampMs": 940,
  "confidence": 0.832
 },
 {
  "text": " relacionarlo",
  "startMs": 1210,
  "endMs": 1930,
  "timestampMs": 1570,
  "confidence": 0.977
 },
 {
  "text": " con",
  "startMs": 1930,
  "endMs": 2190,
  "timestampMs": 2060,
  "confidence": 0.9972
 },
 {
  "text": " otro",
  "startMs": 2190,
  "endMs": 2390,
  "timestampMs": 2290,
  "confidence": 0.994
 },
 {
  "text": " tema",
  "startMs": 2390,
  "endMs": 2670,
  "timestampMs": 2530,
  "confidence": 0.9995
 },
 {
  "text": " de",
  "startMs": 2670,
  "endMs": 2810,
  "timestampMs": 2740,
  "confidence": 0.9955
 },
 {
  "text": " la",
  "startMs": 2810,
  "endMs": 2910,
  "timestampMs": 2860,
  "confidence": 0.9966
 },
 {
  "text": " revista:",
  "startMs": 2910,
  "endMs": 3330,
  "timestampMs": 3120,
  "confidence": 0.9962
 },
 {
  "text": " el",
  "startMs": 3810,
  "endMs": 3890,
  "timestampMs": 3850,
  "confidence": 0.9751
 },
 {
  "text": " riesgo",
  "startMs": 3890,
  "endMs": 4350,
  "timestampMs": 4120,
  "confidence": 0.9977
 },
 {
  "text": " de",
  "startMs": 4350,
  "endMs": 4470,
  "timestampMs": 4410,
  "confidence": 0.9936
 },
 {
  "text": " más",
  "startMs": 4470,
  "endMs": 4790,
  "timestampMs": 4630,
  "confidence": 0.9762
 },
 {
  "text": " calor",
  "startMs": 4790,
  "endMs": 5030,
  "timestampMs": 4910,
  "confidence": 0.9903
 },
 {
  "text": " extremo,",
  "startMs": 5030,
  "endMs": 5710,
  "timestampMs": 5370,
  "confidence": 0.9825
 },
 {
  "text": " sequías",
  "startMs": 5990,
  "endMs": 6390,
  "timestampMs": 6190,
  "confidence": 0.9748
 },
 {
  "text": " e",
  "startMs": 6390,
  "endMs": 6730,
  "timestampMs": 6560,
  "confidence": 0.9359
 },
 {
  "text": " incendios.",
  "startMs": 6730,
  "endMs": 7330,
  "timestampMs": 7030,
  "confidence": 0.996
 }
]}/>
</Sequence>
<Sequence name="06 — Economía, salud y espacio" from={49 * fps} durationInFrames={11 * fps + 11} premountFor={fps}>
<IncomingMask kind="cloud"><Scene6/></IncomingMask>
<Audio src={staticFile("episodios/economist-2027/voz-06.wav")}/>
<div style={{position:'absolute',top:1390,left:100,color:'#b8cbc4',fontFamily:'Arial',fontSize:20,letterSpacing:2}}>RECREACIÓN 2D · LECTURA VISUAL</div>
<Captions captions={[
 {
  "text": " Entre",
  "startMs": 180,
  "endMs": 420,
  "timestampMs": 300,
  "confidence": 0.9897
 },
 {
  "text": " tantas",
  "startMs": 420,
  "endMs": 780,
  "timestampMs": 600,
  "confidence": 0.9979
 },
 {
  "text": " amenazas",
  "startMs": 780,
  "endMs": 1340,
  "timestampMs": 1060,
  "confidence": 0.9988
 },
 {
  "text": " también",
  "startMs": 1340,
  "endMs": 1820,
  "timestampMs": 1580,
  "confidence": 0.7045
 },
 {
  "text": " hay",
  "startMs": 1820,
  "endMs": 1980,
  "timestampMs": 1900,
  "confidence": 0.9985
 },
 {
  "text": " señales",
  "startMs": 1980,
  "endMs": 2400,
  "timestampMs": 2190,
  "confidence": 0.9987
 },
 {
  "text": " sobre",
  "startMs": 2400,
  "endMs": 2700,
  "timestampMs": 2550,
  "confidence": 0.9967
 },
 {
  "text": " deuda,",
  "startMs": 2700,
  "endMs": 3160,
  "timestampMs": 2930,
  "confidence": 0.9883
 },
 {
  "text": " medicamentos",
  "startMs": 3480,
  "endMs": 4040,
  "timestampMs": 3760,
  "confidence": 0.9915
 },
 {
  "text": " para",
  "startMs": 4040,
  "endMs": 4320,
  "timestampMs": 4180,
  "confidence": 0.9974
 },
 {
  "text": " adelgazar",
  "startMs": 4320,
  "endMs": 4840,
  "timestampMs": 4580,
  "confidence": 0.9987
 },
 {
  "text": " y",
  "startMs": 4840,
  "endMs": 5300,
  "timestampMs": 5070,
  "confidence": 0.8892
 },
 {
  "text": " viajes",
  "startMs": 5300,
  "endMs": 5660,
  "timestampMs": 5480,
  "confidence": 0.9954
 },
 {
  "text": " espaciales.",
  "startMs": 5660,
  "endMs": 6480,
  "timestampMs": 6070,
  "confidence": 0.9962
 },
 {
  "text": " No",
  "startMs": 6840,
  "endMs": 7040,
  "timestampMs": 6940,
  "confidence": 0.974
 },
 {
  "text": " todo",
  "startMs": 7040,
  "endMs": 7260,
  "timestampMs": 7150,
  "confidence": 0.9961
 },
 {
  "text": " es",
  "startMs": 7260,
  "endMs": 7440,
  "timestampMs": 7350,
  "confidence": 0.9993
 },
 {
  "text": " guerra:",
  "startMs": 7440,
  "endMs": 7660,
  "timestampMs": 7550,
  "confidence": 0.9936
 },
 {
  "text": " el",
  "startMs": 8180,
  "endMs": 8320,
  "timestampMs": 8250,
  "confidence": 0.9874
 },
 {
  "text": " mundo",
  "startMs": 8320,
  "endMs": 8580,
  "timestampMs": 8450,
  "confidence": 0.9973
 },
 {
  "text": " también",
  "startMs": 8580,
  "endMs": 9100,
  "timestampMs": 8840,
  "confidence": 0.9907
 },
 {
  "text": " está",
  "startMs": 9100,
  "endMs": 9400,
  "timestampMs": 9250,
  "confidence": 0.9962
 },
 {
  "text": " cambiando.",
  "startMs": 9400,
  "endMs": 9920,
  "timestampMs": 9660,
  "confidence": 0.9979
 }
]}/>
</Sequence>
<Sequence name="07 — El verdadero misterio" from={60 * fps} durationInFrames={10 * fps + 0} premountFor={fps}>
<IncomingMask kind="iris"><Scene7/></IncomingMask>
<Audio src={staticFile("episodios/economist-2027/voz-07.wav")}/>
<Captions final captions={[
 {
  "text": " ¿Entonces",
  "startMs": 100,
  "endMs": 420,
  "timestampMs": 260,
  "confidence": 0.4574
 },
 {
  "text": " predice",
  "startMs": 840,
  "endMs": 1260,
  "timestampMs": 1050,
  "confidence": 0.6423
 },
 {
  "text": " el",
  "startMs": 1260,
  "endMs": 1400,
  "timestampMs": 1330,
  "confidence": 0.9935
 },
 {
  "text": " futuro?",
  "startMs": 1400,
  "endMs": 1640,
  "timestampMs": 1520,
  "confidence": 0.9988
 },
 {
  "text": " No.",
  "startMs": 2340,
  "endMs": 2580,
  "timestampMs": 2460,
  "confidence": 0.9528
 },
 {
  "text": " Son",
  "startMs": 2800,
  "endMs": 3000,
  "timestampMs": 2900,
  "confidence": 0.989
 },
 {
  "text": " escenarios",
  "startMs": 3000,
  "endMs": 3600,
  "timestampMs": 3300,
  "confidence": 0.9957
 },
 {
  "text": " y",
  "startMs": 3600,
  "endMs": 3880,
  "timestampMs": 3740,
  "confidence": 0.9945
 },
 {
  "text": " preocupaciones,",
  "startMs": 3880,
  "endMs": 4740,
  "timestampMs": 4310,
  "confidence": 0.999
 },
 {
  "text": " no",
  "startMs": 5180,
  "endMs": 5300,
  "timestampMs": 5240,
  "confidence": 0.9937
 },
 {
  "text": " certezas.",
  "startMs": 5300,
  "endMs": 5980,
  "timestampMs": 5640,
  "confidence": 0.8183
 },
 {
  "text": " Pero",
  "startMs": 6220,
  "endMs": 6440,
  "timestampMs": 6330,
  "confidence": 0.9695
 },
 {
  "text": " vuelve",
  "startMs": 6440,
  "endMs": 6940,
  "timestampMs": 6690,
  "confidence": 0.6997
 },
 {
  "text": " a",
  "startMs": 6940,
  "endMs": 7000,
  "timestampMs": 6970,
  "confidence": 0.9945
 },
 {
  "text": " mirar",
  "startMs": 7000,
  "endMs": 7260,
  "timestampMs": 7130,
  "confidence": 0.9913
 },
 {
  "text": " la",
  "startMs": 7260,
  "endMs": 7340,
  "timestampMs": 7300,
  "confidence": 0.9972
 },
 {
  "text": " portada:",
  "startMs": 7340,
  "endMs": 7780,
  "timestampMs": 7560,
  "confidence": 0.9964
 },
 {
  "text": " ¿qué",
  "startMs": 8100,
  "endMs": 8240,
  "timestampMs": 8170,
  "confidence": 0.9347
 },
 {
  "text": " símbolo",
  "startMs": 8240,
  "endMs": 8760,
  "timestampMs": 8500,
  "confidence": 0.9975
 },
 {
  "text": " te",
  "startMs": 8760,
  "endMs": 8840,
  "timestampMs": 8800,
  "confidence": 0.9981
 },
 {
  "text": " inquieta",
  "startMs": 8840,
  "endMs": 9300,
  "timestampMs": 9070,
  "confidence": 0.9969
 },
 {
  "text": " más?",
  "startMs": 9300,
  "endMs": 9460,
  "timestampMs": 9380,
  "confidence": 0.9961
 }
]}/>
</Sequence>
</AbsoluteFill>};

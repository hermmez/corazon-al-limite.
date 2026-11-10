import React from "react";
import {AbsoluteFill, Img} from "remotion";
import {Atmosfera, Camara, Figura, Fondo, Rotulo, TituloEtapa, asset, fade, gold, lerp, move, paper} from "./visuals";

type Cues={cainGancho:number;leyenda:number;jesus:number;regreso:number;europa:number;genesis:number;abel:number;destierro:number;senal:number;forma:number;condena:number;errancia:number;inmortal:number;nod:number;pregunta:number;identidad:number;prejuicio:number;cierre:number;castigo:number};
export type SceneProps={t:number;global:number;length:number;start:number;cues:Cues;title:string};
const within=(cue:number,start:number,offset=0)=>Math.max(0,cue-start+offset);
const low=(progress:number)=>Math.max(0,Math.min(1,progress));

export const Condena:React.FC<SceneProps>=({t,global,length,start,cues,title})=>{
  const pull=move(t,.4,length-.45);
  const echo=fade(t,within(cues.cainGancho,start,-.35),length-.18,.62);
  return <AbsoluteFill style={{background:"#253544"}}>
    <Fondo file="camino-bruma" scale={1.14+.10*(1-pull)} x={lerp(-45,28,pull)} y={lerp(18,0,pull)}/>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(115deg,transparent 49%,#c4a18946 81%,#c393602a 100%)",opacity:echo}}/>
    <Figura who="cain" x={800+17*pull} y={1130} h={360-32*pull} time={global} walk={.45} direction={-1} opacity={echo*.88} light="brightness(.55) saturate(.65)"/>
    <Figura who="viajero-medieval" x={339+46*pull} y={1587-109*pull} h={1040-275*pull} time={global} walk={1} light="brightness(.89) saturate(.94)"/>
    <Atmosfera time={global} amount={.85} smoke={.8}/>
    <TituloEtapa time={t} at={.28} end={2.9}>{title}</TituloEtapa>
  </AbsoluteFill>;
};

export const Leyenda:React.FC<SceneProps>=({t,global,length,start,cues,title})=>{
  const jesus=within(cues.jesus,start);
  const europe=within(cues.europa,start,-2.1);
  const transport=move(t,europe-.55,europe+1.05);
  const street=move(t,europe+.96,length-.5);
  const crossing=move(t,.32,jesus+3.7);
  const seen=fade(t,.12,europe+.6,.55);
  const onWalk=move(t,jesus+1.25,europe+1);
  return <AbsoluteFill style={{background:"#584338"}}>
    <Fondo file="jerusalen-antigua" scale={1.15+.06*crossing} x={-34+42*crossing} y={-11}/>
    <Fondo file="camino-bruma" scale={1.13} x={22-23*street} opacity={transport} filter="sepia(.12) saturate(.93)"/>
    <Fondo file="ciudad-medieval" scale={1.23-.15*street} x={36-54*street} opacity={move(t,europe+.75,europe+1.8)}/>
    <Figura who="jesus-leyenda" x={563+254*crossing} y={1390+74*crossing} h={720+56*crossing} time={global} walk={.45} opacity={seen} lean={-.55}/>
    <Figura who="viajero-medieval" x={385+226*onWalk+116*street} y={1478-38*transport+21*street} h={765-160*transport} time={global} walk={onWalk} light={transport>.5?"brightness(.92)":"sepia(.1)"} lean={-1.6*Math.sin(t*1.1)*(1-onWalk)} />
    <Atmosfera time={global} warm={transport<.6} amount={.63} smoke={.52}/>
    <TituloEtapa time={t}>{title}</TituloEtapa>
    <Rotulo y={421} size={30} color={gold} opacity={fade(t,.58,Math.min(length-.35,europe+.25),.45)}>LEYENDA MEDIEVAL</Rotulo>
    <Rotulo y={446} size={39} opacity={fade(t,europe+1,length-.2,.48)} small="La leyenda circuló por Europa">DE UN CAMINO A OTRO</Rotulo>
  </AbsoluteFill>;
};

const Proteccion:React.FC<{time:number;opacity:number;x:number;y:number}>=({time,opacity,x,y})=><svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position:"absolute",inset:0,opacity,pointerEvents:"none"}}>
  <defs><radialGradient id="e13señal"><stop stopColor="#f2d897" stopOpacity=".39"/><stop offset=".47" stopColor="#e5be7c" stopOpacity=".14"/><stop offset="1" stopColor="#d7a066" stopOpacity="0"/></radialGradient></defs>
  <ellipse cx={x} cy={y} rx={322+25*Math.sin(time*.82)} ry={260} fill="url(#e13señal)"/>
  <path d={"M"+(x-295)+" "+(y+133)+" Q"+(x-37)+" "+(y+221)+" "+(x+280)+" "+(y+108)} fill="none" stroke="#ffdfa2" opacity=".62" strokeWidth="2.6" strokeDasharray="4 10"/>
</svg>;

export const Genesis:React.FC<SceneProps>=({t,global,length,start,cues,title})=>{
  const abel=within(cues.abel,start);
  const exile=within(cues.destierro,start);
  const mark=within(cues.senal,start);
  const onset=move(t,abel+.12,exile+.65);
  const walk=move(t,exile-.4,exile+1.65);
  const recede=move(t,exile,length-.3);
  const signal=fade(t,mark-.1,length-.18,.52);
  const x=386+264*recede, y=1493-130*recede;
  return <AbsoluteFill style={{background:"#95664a"}}>
    <Fondo file="desierto-levante" scale={1.31-.20*recede} x={-58+49*recede} y={14-13*recede} filter="sepia(.12) saturate(.9)"/>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(128deg,#2e294067 10%,#87482a18 68%,transparent 100%)",opacity:1-onset}}/>
    <Figura who="abel" x={691-33*onset} y={1510-28*onset} h={720} time={global} direction={-1} opacity={1-onset} lean={-.6*Math.sin(t*1.4)}/>
    <Proteccion time={global} opacity={signal} x={x} y={y-220}/>
    <Figura who="cain" x={x} y={y} h={760-179*recede} time={global} walk={walk} light="sepia(.12) contrast(1.03)"/>
    <Atmosfera time={global} warm amount={.70} smoke={.48}/>
    <TituloEtapa time={t}>{title}</TituloEtapa>
    <Rotulo y={423} size={37} opacity={fade(t,.47,mark-.33,.48)} color={gold}>CAÍN · GÉNESIS 4</Rotulo>
    <Rotulo y={1465} size={42} opacity={signal} small="El texto no describe su forma">SEÑAL DE PROTECCIÓN</Rotulo>
  </AbsoluteFill>;
};

export const Comparacion:React.FC<SceneProps>=({t,global,length,start,cues,title})=>{
  const meet=move(t,.03,1.0);
  const a=within(cues.condena,start), b=within(cues.errancia,start), c=within(cues.inmortal,start), d=within(cues.nod,start);
  const follow=move(t,b,length-.15);
  const ending=move(t,c-.37,c+.48);
  const pairY=1348+88*follow;
  return <AbsoluteFill style={{background:"#503b40"}}>
    <AbsoluteFill style={{clipPath:"polygon(0 0,54% 0,48% 100%,0 100%)",overflow:"hidden"}}>
      <Fondo file="ciudad-medieval" scale={1.18-.05*follow} x={-70+38*follow} y={-26} filter="saturate(.82)"/>
      <Figura who="viajero-medieval" x={248+42*follow} y={pairY} h={710-84*follow} time={global} walk={.87}/>
    </AbsoluteFill>
    <AbsoluteFill style={{clipPath:"polygon(54% 0,100% 0,100% 100%,48% 100%)",overflow:"hidden"}}>
      <Fondo file="desierto-levante" scale={1.22-.08*follow} x={65-38*follow} y={-18} filter="sepia(.19) saturate(1.10)"/>
      <Figura who="cain" x={809-22*follow} y={pairY} h={691-81*follow} time={global+.51} walk={.85} direction={-1}/>
    </AbsoluteFill>
    <svg width={1080} height={1920} style={{position:"absolute",inset:0,opacity:meet}}><path d="M583 0L518 1920" stroke="#e7c792" strokeWidth="2.2" strokeOpacity=".77"/><path d="M587 0L522 1920" stroke="#322529" strokeWidth="7" strokeOpacity=".45"/></svg>
    <Atmosfera time={global} amount={.55} smoke={.36}/>
    <TituloEtapa time={t} end={2.52}>{title}</TituloEtapa>
    <Rotulo y={565} x={64} width={400} size={35} color="#d8e5f4" opacity={meet}>EL ERRANTE</Rotulo>
    <Rotulo y={565} x={609} width={405} size={35} color="#ffe0a4" opacity={meet}>CAÍN</Rotulo>
    <Rotulo y={1478} size={43} opacity={fade(t,a-.28,b-.18,.36)}>CONDENA</Rotulo>
    <Rotulo y={1478} size={43} opacity={fade(t,b-.18,c-.33,.40)}>DESTIERRO · ERRANCIA</Rotulo>
    <Rotulo y={1458} x={54} width={408} size={36} opacity={ending} small="Según versiones de la leyenda">HASTA EL REGRESO DE CRISTO</Rotulo>
    <Rotulo y={1458} x={604} width={420} size={36} opacity={ending} small={t>d-.33?"Se estableció en Nod":"Según el relato de Génesis"}>NO SE AFIRMA QUE SEA INMORTAL</Rotulo>
  </AbsoluteFill>;
};

const milestones=[
  {x:126,y:1147,head:"GÉNESIS 4",copy:"Relato bíblico"},
  {x:563,y:1132,head:"SIGLO XIII",copy:"Crónicas medievales"},
  {x:562,y:1240,head:"1602",copy:"Versión impresa de Ahasuero"},
];
export const Manuscrito:React.FC<SceneProps>=({t,global,length,start,cues,title})=>{
  const ask=within(cues.pregunta,start);
  const identity=within(cues.identidad,start);
  const bias=within(cues.prejuicio,start);
  const descend=move(t,.2,identity+1.65);
  const book=move(t,-.25,1.1);
  const reveal=[move(t,ask-.35,ask+.4),move(t,identity-.3,identity+.42),move(t,identity+.75,identity+1.42)];
  return <AbsoluteFill style={{background:"#282127"}}>
    <Fondo file="manuscrito-abierto" scale={1.04+.15*descend} x={-15+24*descend} y={23-19*descend}/>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#25233255 0%,transparent 38%,transparent 65%,#1d172898 100%)"}}/>
    <Figura who="cain" x={330} y={1090} h={390} time={global} direction={1} opacity={book*.87} light="sepia(.36) saturate(.84)"/>
    <Figura who="viajero-medieval" x={738} y={1090} h={385} time={global} direction={-1} opacity={book*.87} light="sepia(.30) saturate(.86)"/>
    <svg width={1080} height={1920} style={{position:"absolute",inset:0}} viewBox="0 0 1080 1920">
      <path d="M128 1103 C295 1129 453 1122 567 1087 S576 1174 566 1197" fill="none" stroke="#784334" strokeWidth="2.7" strokeDasharray="7 8" opacity={reveal[1]*.65}/>
      {milestones.map(({x,y,head,copy},i)=><g key={head} opacity={reveal[i]} transform={"translate("+x+" "+y+")"}>
        <circle cx="4" cy="-43" r="5.3" fill="#7d3d31"/>
        <path d="M0,15 H343" stroke="#7c4b33" strokeOpacity=".53" strokeWidth="1.8" />
        <text fontFamily="Georgia, serif" fontSize="42" fontWeight="700" fill="#361d21" stroke="#f1cc8c" strokeWidth="2.4" paintOrder="stroke">{head}</text>
        <text y="48" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="700" fill="#422526" stroke="#eed09a" strokeWidth="2" paintOrder="stroke">{copy}</text>
      </g>)}
    </svg>
    <TituloEtapa time={t}>{title}</TituloEtapa>
    <Rotulo y={1500} size={40} opacity={fade(t,bias-.22,length-.08,.38)} color="#ffd5aa">PREJUICIOS ANTIJUDÍOS</Rotulo>
  </AbsoluteFill>;
};

export const Cierre:React.FC<SceneProps>=({t,global,length,title})=>{
  const lift=move(t,0,length-.07);
  const pace=low(t/length);
  return <AbsoluteFill style={{background:"#625059"}}>
    <Camara scale={1.22-.17*lift} y={22-15*lift} origin="50% 67%">
      <Fondo file="dos-caminos-levante" scale={1.055} y={2}/>
      <Figura who="viajero-medieval" x={282-115*move(t,length*.22,length)} y={1392-242*pace} h={380-168*lift} time={global} walk={.8} direction={-1} light="brightness(.87)"/>
      <Figura who="cain" x={780+97*pace} y={1363-239*pace} h={373-165*lift} time={global+.41} walk={.77} light="brightness(.90) sepia(.17)"/>
    </Camara>
    <Atmosfera time={global} warm amount={.62} smoke={.57}/>
    <TituloEtapa time={t} at={.15} end={2.92}>{title}</TituloEtapa>
    <Rotulo y={425} size={39} opacity={fade(t,3.05,length+.25,.55)} color={paper}>CAMINOS PARALELOS</Rotulo>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#18132100 40%,#130e1d66 100%)",opacity:move(t,length-1.3,length-.04)}}/>
  </AbsoluteFill>;
};

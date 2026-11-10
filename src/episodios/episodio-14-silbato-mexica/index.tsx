import React from "react";
import {Audio} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Arcilla, Tintas} from "./silbato";
import {SilbatoAprobado, plantedPose, project} from "./silbato-aprobado";
import timeline from "./timeline.json";
import captionData from "./captions.json";

const stage=timeline.stages;
const q=timeline.cues;
const demo=timeline.demo;
const paper="#fff0d5";
const cyan="#b1e6d7";
const gold="#f1c190";
const full={position:"absolute",inset:0,width:"100%",height:"100%"} as const;
const ease=Easing.bezier(.31,.03,.24,.99);
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const move=(time:number,a:number,b:number)=>interpolate(time,[a,b],[0,1],{...clamp,easing:ease});
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const env=(time:number,a:number,b:number,f=.38)=>move(time,a,a+f)*(1-move(time,b-f,b));
const art=(name:string)=>staticFile("episodio-14/ilustraciones/"+name+".png");
const visualStages = [
  {name:"ARCILLA", start:stage[1].start+.32},
  {name:"CONDUCTO", start:stage[2].start+.32},
  {name:"CAVIDADES", start:stage[3].start+.25},
  {name:"ROSTRO", start:stage[4].start+.24},
  {name:"FUNCIONAMIENTO", start:stage[6].start+.24, duration:2.71},
  {name:"RESULTADO", start:q.sale+1.36, duration:2.96},
];

const pages:Caption[][]=[];
let active:Caption[]=[];
for(const word of captionData as Caption[]){
  active.push(word);
  if(word.pageBreakAfter){pages.push(active);active=[];}
}

const Subtitulos:React.FC<{time:number}>=({time})=>{
  const ms=time*1000;
  const page=pages.find(p=>ms>=p[0].startMs&&ms<p[p.length-1].endMs+40);
  if(!page)return null;
  return <div style={{position:"absolute",left:83,top:139,width:900,color:paper,textAlign:"center",textWrap:"balance",fontFamily:"Arial, sans-serif",fontWeight:800,fontSize:49,lineHeight:1.12,textShadow:"0 4px 10px #161524,0 0 25px #161524",WebkitTextStroke:"1.6px #15131e",paintOrder:"stroke fill"}}>
    {page.map(word=><span key={word.startMs} style={{color:ms>=word.startMs?paper:"#d0c7b9"}}>{word.text}</span>)}
  </div>;
};

const Fondo:React.FC<{name:string;opacity:number;scale:number;x:number;y:number}>=({name,opacity,scale,x,y})=>
  opacity>0?<Img src={art(name)} style={{...full,objectFit:"cover",opacity,transform:"translate("+x+"px,"+y+"px) scale("+scale+")"}}/>:null;

const Titulo:React.FC<{name:string;show:number}>=({name,show})=>
  <div style={{position:"absolute",left:90,right:90,top:325,color:paper,textAlign:"center",opacity:show,fontFamily:"Georgia,serif",fontSize:49,fontWeight:700,letterSpacing:2.3,textShadow:"0 4px 11px #251a20,0 0 26px #221a22",transform:"translateY("+((1-show)*9)+"px)"}}>
    <span style={{padding:"12px 27px",borderTop:"1px solid #ffca92a0",borderBottom:"1px solid #ffca9280"}}>{name}</span>
  </div>;

const Guia:React.FC<{x:number;y:number;title:string;subtitle?:string;amount:number;tip:readonly [number,number];align?:"left"|"right";warm?:boolean}>=({x,y,title,subtitle,amount,tip,align="left",warm=false})=>{
  if(amount<=.001)return null;
  const hue=warm?gold:cyan;
  const right=align==="right";
  const hinge=right?x-10:x+9;
  const curve="M"+hinge+","+ (y+12) +" L"+(hinge+(right?-25:25))+","+(y+30)+" H"+tip[0]+" V"+tip[1];
  return <g opacity={amount} fontFamily="Arial, sans-serif" textAnchor={right?"end":"start"}>
    <path d={curve} stroke="#211e25" strokeWidth="6" fill="none" strokeLinejoin="round"/>
    <path d={curve} stroke={hue} strokeWidth="2.2" fill="none" strokeLinejoin="round" opacity=".78"/>
    <circle cx={tip[0]} cy={tip[1]} r="7" fill="#26393a" stroke={hue} strokeWidth="2.2"/>
    <circle cx={tip[0]} cy={tip[1]} r="2.5" fill={hue}/>
    <text x={x} y={y} fontSize="32" fill={paper} fontWeight="800" stroke="#211a21" strokeWidth="4" paintOrder="stroke">{title}</text>
    {subtitle&&<text x={x} y={y-40} fontSize="25" fontWeight="700" fill={hue} stroke="#211a21" strokeWidth="3.2" paintOrder="stroke">{subtitle}</text>}
  </g>;
};

const Nota:React.FC<{head:string;detail?:string;y:number;amount:number;color?:string}>=({head,detail,y,amount,color=paper})=>
  amount>.001?<div style={{position:"absolute",top:y,left:82,right:82,opacity:amount,color,textAlign:"center",fontFamily:"Arial,sans-serif",fontSize:37,fontWeight:800,letterSpacing:.9,lineHeight:1.08,WebkitTextStroke:"1.4px #252025",paintOrder:"stroke fill",textShadow:"0 3px 8px #171419,0 0 28px #2b1d22"}}>
    {head}{detail&&<div style={{fontSize:24,letterSpacing:.45,fontWeight:700,color:"#f8e0bf",marginTop:12}}>{detail}</div>}
  </div>:null;

const dust=Array.from({length:23},(_,i)=>({x:i*97%1130,y:i*137%1530,r:1.2+i%5*.53,p:i*.78}));
const Luz:React.FC<{time:number;night:number;archeo:number;heat:number}>=({time,night,archeo,heat})=><AbsoluteFill style={{pointerEvents:"none"}}>
  <div style={{...full,background:"linear-gradient(180deg,#181624b3 0%,#18162434 24%,transparent 46%,transparent 64%,#1b132170 100%)"}}/>
  <div style={{position:"absolute",left:-265+79*Math.sin(time*.31),top:420+43*Math.cos(time*.29),width:1460,height:1070,opacity:.31+.28*heat,
    background:night>.5?"radial-gradient(ellipse,#82a8bd76 0%,#789fba32 36%,transparent 71%)":"radial-gradient(ellipse,#e3a66854 0%,#bc865437 40%,transparent 70%)",transform:"rotate(-14deg)"}}/>
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={full}>
    {dust.map(({x,y,r,p},i)=><ellipse key={i} cx={((x+time*(8+i%6))%1170)-50} cy={(y+246-time*(3+i%6)+1900)%1720+60} rx={r*1.25} ry={r} fill={night>.6?"#a6cce2":"#f7c985"} opacity={(archeo>.45?.64:1)*(.10+.17*Math.sin(time*.86+p)**2)}/>)}
  </svg>
</AbsoluteFill>;

const Onda:React.FC<{time:number;at:number;to:number;values:number[]}>=({time,at,to,values})=>{
  const show=env(time,at-.11,to+.13,.16);
  const frame=Math.max(0,Math.min(values.length-1,Math.floor((time-at)/(to-at)*values.length)));
  return <g transform="translate(286 1460)" opacity={show}>
    <path d="M0 0H510" stroke="#dbb489" strokeWidth="2" opacity=".33"/>
    {values.map((v,i)=>{
      const h=7+v*79;
      return <path key={i} d={"M"+(8+i*17)+","+(-h/2)+" V"+(h/2)} stroke="#f7d0a2" strokeWidth={3.5+values[frame]*1.7} strokeLinecap="round" opacity={.47+v*.41}/>;
    })}
  </g>;
};

export const Episodio14SilbatoMexica:React.FC<{externalAudio?:boolean}>=({externalAudio=false})=>{
  const {fps}=useVideoConfig();
  const time=useCurrentFrame()/fps;
  const travel=(a:number,b:number)=>move(time,a,b);
  const band=(a:number,b:number,f=.43)=>env(time,a,b,f);
  const openBench=travel(stage[1].start-.94,stage[1].start+.23);
  const reveal=travel(.1,3.2);
  const night=1-openBench;
  const dig=travel(q.tlatelolco-.56,q.tlatelolco+.65)*(1-travel(stage[6].start-.48,stage[6].start+.65));
  const close=travel(stage[6].start-.15,stage[6].start+1.10);
  const demoStart=demo?.start??68.26;
  const demoEnd=demo?.end??69.46;
  const soundPulse=demo&&time>=demoStart&&time<demoEnd?demo.envelope[Math.min(demo.envelope.length-1,Math.floor((time-demoStart)/(demoEnd-demoStart)*demo.envelope.length))]:0;
  const demoLabel=demo?band(demoStart-.20,demoEnd+.34,.2):0;
  const clayAppear=travel(stage[1].start-.8,stage[1].start+.47);
  const bodyBuild=travel(q.arcilla+2.55,q.cuerpo-.01);
  const body=Math.max(night,bodyBuild);
  const duct=Math.max(night,travel(q.conducto-2.44,q.conducto+.24));
  const cavities=travel(q.cavidad-1.65,q.inestable+.30);
  const cut=travel(q.conducto-.64,q.conducto+.26);
  const returnFace=.32*travel(q.rostro-.1,q.campana+.05)+.68*travel(q.campana+1.05,q.exterior+.36);
  const review=travel(stage[6].start+.31,q.sale-.50);
  const paired=travel(q.sale+.59,q.sale+1.78);
  const face=Math.max(night,returnFace*(1-review),paired);
  const flow=Math.max(travel(q.chorro-.42,q.chorro+.38)*(1-returnFace),review);
  const macro=travel(q.cavidad-.74,q.inestable+.81)*(1-travel(q.rostro-.94,q.rostro+.39));
  const turn=travel(q.arcilla-.62,q.cuerpo+.55);
  const focusDuct=travel(q.chorro-.38,q.chorro+1.18)*(1-travel(q.cavidad-1.11,q.cavidad-.37));
  const widthFactor=1-.10*Math.sin(turn*Math.PI);
  const shadow=travel(.04,1.5);
  const introSize=mix(.16,.50,reveal);
  const benchSize=.49+.091*macro+.052*focusDuct-.035*dig+.052*close;
  const size=mix(mix(introSize,benchSize,openBench),.41,paired);
  const sceneX=mix(mix(747,636,reveal),548+23*Math.sin(time*.21)+13*macro+34*dig+31*focusDuct,openBench);
  const ground=mix(mix(mix(1260,1334,reveal),1333-45*dig-15*close,openBench),1325,paired);
  const tilt=mix(mix(mix(-11,-3,reveal),mix(-7,4,turn)-7*macro-5*dig-6*close,openBench),0,paired);
  const objX=mix(sceneX,298,paired);
  const pose=plantedPose(objX,ground,size,tilt,widthFactor);
  const cutPose=plantedPose(mix(sceneX+105,774,paired),1325,.41,0);
  const point=(x:number,y:number)=>project(pose,x,y);
  const exitListener=travel(2.1,4.05);
  const listener=night*(1-travel(3.64,4.20))*.93;
  const cutNote=Math.max(band(q.conducto-.60,q.exterior-.08,.46),review)*(1-demoLabel);
  const digNote=band(q.tlatelolco+.34,stage[6].start-.22,.5);
  const fullReview=band(q.sale-.67,q.sale+1.04,.35)*(1-paired);
  const clayY=ground-147;
  const pairLabel=paired*paired;

  return <AbsoluteFill style={{backgroundColor:"#231c26",overflow:"hidden"}}>
    {!externalAudio&&<Audio src={staticFile("episodio-14/audio/mezcla_final_70s.wav")} />}
    <Fondo name="patio-nocturno" opacity={1} scale={1.06+.17*reveal} x={-48*reveal} y={20*reveal}/>
    <Fondo name="mesa-arcilla" opacity={openBench} scale={1.06+.06*turn+.05*macro} x={22*Math.sin(time*.16)-22*macro} y={10*Math.cos(time*.19)}/>
    <Fondo name="contexto-tlatelolco" opacity={dig} scale={1.07+.08*travel(q.tlatelolco,stage[6].start)} x={-20+28*travel(q.tlatelolco,stage[6].start)} y={5}/>
    {listener>.001&&<Img src={staticFile("imagenes/personajes/12_preocupado.png")} style={{position:"absolute",left:-106-315*exitListener-40*reveal,top:740+38*reveal,width:621,height:931,objectFit:"contain",opacity:listener,filter:"brightness(.63) saturate(.82)",transform:"rotate("+(-2+3.4*travel(.45,2.8))+"deg)",transformOrigin:"50% 93%"}}/>}
    <Luz time={time} night={night} archeo={dig} heat={macro+soundPulse*.35}/>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={full}>
      <Tintas/>
      <ellipse cx={objX+50} cy={ground-7} rx={size*395} ry={size*81} fill="#15121d" opacity={shadow*.34}/>
      <ellipse cx={objX+52} cy={ground-5} rx={size*326} ry={size*53} fill="#19131b" opacity={shadow*.33}/>
      <ellipse cx={cutPose.x+48} cy={1318} rx={164} ry={29} fill="#19131b" opacity={paired*.45}/>
      <g transform={"translate("+objX+" "+clayY+") scale("+widthFactor+" 1)"}>
        <Arcilla opacity={clayAppear*(1-bodyBuild)} tilt={tilt} molding={bodyBuild}/>
      </g>
    </svg>
    <SilbatoAprobado pose={pose} opacity={body} neck={duct} face={face} cut={cut} cavities={cavities} flow={flow} time={time}/>
    <SilbatoAprobado pose={cutPose} opacity={paired} neck={1} face={0} cut={1} cavities={1} flow={.68+soundPulse*.26} time={time}/>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{...full,pointerEvents:"none"}}>
      <Guia x={121} y={1438} title="ARCILLA" amount={band(stage[1].start+.64,q.arcilla+4.76)} tip={[objX-92,clayY+96]} warm/>
      <Guia x={118} y={1424} title="CUERPO DE BARRO" amount={band(q.cuerpo-.95,q.conducto-1.54)} tip={point(189,1054)} warm/>
      <Guia x={105} y={618} title="CONDUCTO DE AIRE" amount={Math.max(band(q.conducto-.59,q.cavidad-.88),fullReview)} tip={point(321,433)}/>
      <Guia x={989} y={836} title="CONTRAPRESIÓN" subtitle="Cámara cerrada" amount={Math.max(band(q.cavidad-.23,q.rostro-.36),fullReview)} tip={point(564,873)} align="right"/>
      <Guia x={996} y={1382} title="ZONA DE ENCUENTRO" subtitle="Cámara de colisión" amount={Math.max(band(q.inestable-.5,q.rostro-.18),fullReview)} tip={point(447,863)} align="right"/>
      <Guia x={100} y={1424} title="CAMPANA" subtitle="Salida del sonido" amount={Math.max(band(q.campana-.45,q.exterior-.43),fullReview)} tip={point(538,1226)}/>
      <g opacity={pairLabel} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="34" fill={paper}
        stroke="#2b2022" strokeWidth="4.5" paintOrder="stroke">
        <text x="302" y="1382">EXTERIOR</text><text x="780" y="1382">CORTE ILUSTRATIVO</text>
      </g>
      {demo&&<Onda time={time} at={demoStart} to={demoEnd} values={demo.envelope}/>}
    </svg>
    {visualStages.map(({name,start,duration=2.85})=>{
      const amount=band(start,start+duration,.4);
      return amount>.001?<Titulo key={name} name={name} show={amount}/>:null;
    })}
    <Nota head="SILBATO MEXICA DE BARRO" detail="Un sonido que recuerda a un grito" amount={band(3.37,stage[1].start-.36,.60)} y={1461}/>
    <Nota head="CORTE ILUSTRATIVO" detail="Modelo comparable · IV Ca 2621m" amount={cutNote*.95} y={440} color="#ffdfac"/>
    <Nota head="TLATELOLCO" detail="Contexto del hallazgo de otros ejemplares" amount={digNote} y={454}/>
    <Nota head="EL USO MILITAR SIGUE SIN DEMOSTRARSE" amount={band(q.batalla-.38,stage[6].start-.04,.36)} y={1462} color="#ffdab0"/>
    {demo&&<Nota head="DEMOSTRACIÓN SONORA" detail="Grabación contemporánea · CC0" amount={demoLabel} y={450}/>}
    <Subtitulos time={time}/>
  </AbsoluteFill>;
};

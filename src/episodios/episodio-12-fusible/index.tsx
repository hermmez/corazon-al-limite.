import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {Caption} from "@remotion/captions";
import {Banco, Circuito} from "./banco";
import {CeramicBack, CeramicSection, Contacto, Cuarzo, Elemento, Materiales} from "./cartucho";
import script from "./guion.json";
import timeline from "./timeline.json";
import captionSource from "./captions.json";

const ease = Easing.bezier(.31,.07,.26,.96);
const clamp = {extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const palette = {paper:"#fff1d1", light:"#b9ddd4", warm:"#efbb81"};
const cues = timeline.cues;
const captions = captionSource as Caption[];
const captionPages: Caption[][] = [];
let nextCaptionPage: Caption[] = [];
for (const caption of captions) {
  nextCaptionPage.push(caption);
  if (caption.pageBreakAfter) {
    captionPages.push(nextCaptionPage);
    nextCaptionPage = [];
  }
}

const Subtitulos: React.FC<{ms:number}> = ({ms}) => {
  const page = captionPages.find(group => ms >= group[0].startMs && ms < group[group.length-1].endMs+55);
  if (!page) return null;
  return <div style={{position:"absolute",top:145,left:83,width:874,color:palette.paper,fontFamily:"Arial,sans-serif",fontSize:49,lineHeight:1.12,fontWeight:800,textAlign:"center",textWrap:"balance",WebkitTextStroke:"1.9px #111d28",paintOrder:"stroke fill",textShadow:"0 4px 8px #111d28, 0 0 28px #111d28"}}>
    {page.map(word=><span key={word.startMs} style={{color:ms < word.startMs ? "#bbc9c4" : palette.paper}}>{word.text}</span>)}
  </div>;
};

const arcPoints = [
  [-22,2],[-16,-3],[-11,8],[-7,-4],[-2,2],[2,-6],[6,5],[11,-3],[17,5],[22,1],
];
const Arco: React.FC<{power:number;time:number}> = ({power,time}) => {
  const points=arcPoints.map(([x,y],i)=>[x,y+Math.sin(time*36+i*2.3)*5*power].join(",")).join(" ");
  return <g opacity={power}>
    <ellipse rx="98" ry="64" fill="url(#e12calor)" />
    <ellipse rx="58" ry="40" fill="url(#e12azul)" />
    <polyline points={points} stroke="#f2a46a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <polyline points={points} stroke="#ffffd2" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {Array.from({length:9},(_,i)=><path key={i} d={"M"+((i*29%77)-38)+","+((i*19%38)-19)+"l"+(i%2?3:-3)+",3"} stroke="#ffd69a" strokeWidth="2.6" strokeLinecap="round" opacity={.46+.31*Math.sin(time*17+i)}/>)}
  </g>;
};

const Lectura: React.FC<{x:number;y:number;stage:number;title:string;detail:string;opacity:number;target?:readonly [number,number];accent?:string}> = ({x,y,stage,title,detail,opacity,target,accent=palette.light}) => <g opacity={opacity}>
  {target && <g>
    <path d={"M"+(x+11)+","+(y+40)+" l22,26 H"+target[0]+" V"+target[1]} stroke="#162730" strokeWidth="6" strokeLinejoin="round" fill="none" />
    <path d={"M"+(x+11)+","+(y+40)+" l22,26 H"+target[0]+" V"+target[1]} stroke={accent} strokeWidth="2" strokeLinejoin="round" fill="none" opacity=".77"/>
    <circle cx={target[0]} cy={target[1]} r="8" fill="#20343c" stroke={accent} strokeWidth="2" />
    <circle cx={target[0]} cy={target[1]} r="2.6" fill={accent} />
  </g>}
  <text x={x} y={y-55} fill={accent} fontSize="25" fontWeight="700" letterSpacing="2.1" stroke="#182631" strokeWidth="4" paintOrder="stroke">{"0"+(stage+1)+"  /  "+script[stage].name.toUpperCase()}</text>
  <text x={x} y={y} fill={palette.paper} fontSize="43" fontWeight="800" stroke="#182631" strokeWidth="5" paintOrder="stroke" letterSpacing=".55">{title}</text>
  <text x={x} y={y+39} fill={accent} fontSize="26" fontWeight="700" stroke="#182631" strokeWidth="4" paintOrder="stroke">{detail}</text>
</g>;

const Detalle: React.FC<{type:"metal"|"ceramica"|"arena";amount:number;time:number;target:readonly [number,number]}> = ({type,amount,time,target}) => {
  if (amount <= 0) return null;
  const x=553, y=1314+(1-amount)*42;
  const caption={metal:"ZONA ESTRECHA",ceramica:"PARED AISLANTE",arena:"GRANOS DE CUARZO"}[type];
  return <g opacity={amount}>
    <path d={"M"+target[0]+","+target[1]+" L"+(x-89)+","+(y-134)} stroke="#a6c3b9" strokeWidth="2" opacity=".6" />
    <circle cx={target[0]} cy={target[1]} r="23" fill="none" stroke="#c4e0ca" strokeWidth="2" opacity=".75" />
    <g transform={"translate("+x+" "+y+")"}>
      <defs><clipPath id={"e12lupa-"+type}><circle r="133" /></clipPath></defs>
      <circle r="151" fill="#152934" fillOpacity=".96" stroke="#668b84" strokeWidth="2" />
      <circle r="139" fill="#385057" stroke="#d5d6b8" strokeWidth="4" />
      <g clipPath={"url(#e12lupa-"+type+")"}>
        <rect x="-135" y="-135" width="270" height="270" fill="url(#e12reticula)" />
        {type==="metal" && <g transform="rotate(-11)">
          <g transform="scale(3.6)"><Elemento sheen={.41}/></g>
          <path d="M0,-59 V-21 M0,59 V21" stroke="#ffe2a5" strokeWidth="3" strokeDasharray="6 5"/>
          <ellipse rx="47" ry="36" fill="url(#e12calor)" opacity={.22+.16*Math.sin(time*3.2)} />
        </g>}
        {type==="ceramica" && <g transform={"rotate("+(time*8)+")"}>
          <circle r="106" fill="url(#e12seccion)" stroke="#644c44" strokeWidth="7"/>
          <circle r="103" fill="url(#e12poros)" />
          <circle r="68" fill="#273b43" stroke="#f5dab1" strokeWidth="4" />
          <circle r="75" fill="none" stroke="#6e5449" strokeWidth="2" opacity=".62" />
          <path d="M-16,-12 H16 V12 H-16Z" fill="url(#e12tira)" stroke="#111f27" strokeWidth="2" />
          <path d="M-60,-72 A95,95 0 0 1 53,-78" stroke="#fff2d3" strokeWidth="5" strokeLinecap="round" fill="none"/>
        </g>}
        {type==="arena" && <g transform={"rotate("+Math.sin(time*1.1)*7+") scale(4.1) translate(-32 -30)"}>
          <rect x="-10" y="-10" width="84" height="80" fill="#96785b"/>
          <rect x="-10" y="-10" width="84" height="80" fill="url(#e12granos)"/>
          <ellipse cx="23" cy="24" rx="45" ry="41" fill="url(#e12calor)" opacity=".17"/>
        </g>}
      </g>
      <path d="M-168,0h19m298,0h19 M0,-169v19 M0,150v19" stroke="#b3cab6" strokeWidth="2.2" />
      <text y="210" textAnchor="middle" fontSize="31" fontWeight="800" fill={palette.paper} stroke="#182631" strokeWidth="4" paintOrder="stroke" letterSpacing="1.2">{caption}</text>
    </g>
  </g>;
};

const Comparacion: React.FC<{amount:number}> = ({amount}) => <g transform={"translate(154 "+(1170+(1-amount)*28)+")"} opacity={amount}>
  <path d="M0,-49 L31,-78 H758 V226 H0Z" fill="#122731" fillOpacity=".94" stroke="#69857c" strokeWidth="2" />
  <path d="M28,62 H735 M28,189 H735" stroke="#5e726e" strokeWidth="1.6" opacity=".68"/>
  <g transform="translate(412 21) scale(.86)"><Elemento sheen={.64}/></g>
  <g transform="translate(412 151) scale(.86)"><Elemento broken/><ellipse rx="37" ry="22" fill="url(#e12calor)" opacity=".38"/></g>
  <text x="32" y="-34" fill={palette.light} fontSize="28" fontWeight="800">ELEMENTO INTACTO</text>
  <text x="32" y="109" fill={palette.warm} fontSize="28" fontWeight="800">ELEMENTO FUNDIDO</text>
</g>;

export const Episodio12Fusible: React.FC<{externalAudio?:boolean}> = ({externalAudio=false}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const time=frame/fps;
  const travel=(a:number,b:number)=>interpolate(time,[a,b],[0,1],{...clamp,easing:ease});
  const band=(a:number,b:number)=>travel(a,a+.23)*(1-travel(b-.32,b));
  const progress=travel(cues.ceramica-.72,cues.aisla-.21);
  const reveal=travel(cues.ceramica-1.34,cues.ceramica-.35);
  const sand=travel(cues.arena-.45,cues.control+.58);
  const contact=travel(cues.contactos-.1,cues.conexion+.55);
  const capReveal=travel(cues.contactos-.91,cues.contactos+.33);
  const board=travel(cues.completo-.52,cues.corriente+.35);
  const showLoop=board*(1-travel(cues.interrumpe+.43,cues.cables+.25));
  const current=travel(cues.corriente-.16,cues.corriente+.75)*(1-travel(cues.extingue-.27,cues.extingue+.07));
  const fault=travel(cues.exceso-.27,cues.funde-.45);
  const heat=fault*(1-travel(cues.arco+.05,cues.extingue+.8));
  const macro=travel(cues.calienta-.7,cues.funde+.03)*(1-travel(cues.extingue+.15,cues.cables+.7));
  const final=travel(cues.cables+.2,cues.cables+1.48);
  const sandMacro=travel(cues.control-.92,cues.control+.65)*(1-travel(cues.contactos-1.1,cues.contactos-.25));
  const closeShell=travel(cues.conexion+.36,cues.completo-.22)*(1-travel(cues.corriente+.1,cues.corriente+1.9));
  const subjectX=540+24*Math.sin(time*.19);
  const subjectY=935-117*board-41*final+34*Math.sin(time*.32)*(1-board);
  const scale=1.24+.17*travel(0,3.5)-.18*reveal+.30*sandMacro-.32*board+.80*macro+.09*final;
  const rotation=-24+7*Math.sin(time*.14)+19*board-12*macro-5*final;
  const sceneTransform="translate("+subjectX+" "+subjectY+") rotate("+rotation+") scale("+scale+")";
  const sectionOffset=-240*(1-progress);
  const broken=time>=cues.funde+.06;
  const arc=band(cues.funde+.02,cues.extingue+.12)*(.52+.48*travel(cues.arco-.55,cues.arco));
  const rise=travel(.03,.95);
  const project=(x:number,y:number)=>{
    const angle=rotation*Math.PI/180;
    return [subjectX+scale*(x*Math.cos(angle)-y*Math.sin(angle)),subjectY+scale*(x*Math.sin(angle)+y*Math.cos(angle))] as const;
  };
  const notchFocus=travel(4.4,5.4)*(1-travel(cues.ceramica-1.9,cues.ceramica-1.12));
  const ceramicFocus=travel(cues.aisla-.42,cues.aisla+.45)*(1-travel(cues.arena-1.28,cues.arena-.55));
  const quartzFocus=travel(cues.arena+.75,cues.arena+1.73)*(1-travel(cues.contactos-2.15,cues.contactos-1.21));
  const q=cues;

  return <AbsoluteFill style={{backgroundColor:"#182b36"}}>
    {timeline.audioReady && !externalAudio && <Audio src={staticFile("episodio-12/audio/mezcla_final_70s.wav")} />}
    <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{fontFamily:"Arial,sans-serif"}}>
      <Materiales />
      <Banco time={time} shift={subjectX-540} warm={heat} />
      <g transform={sceneTransform}>
        <ellipse cy="84" rx={395+40*board} ry={62+10*board} fill="#0d1823" opacity=".37"/>
        <ellipse cy="73" rx={343+24*board} ry="48" fill="#09141e" opacity=".28"/>
        <Circuito show={showLoop} active={current*showLoop} fault={fault} time={time} />
        <g opacity={reveal} transform={"translate(0 "+sectionOffset+")"}>
          <CeramicBack />
        </g>
        <g opacity={sand>0 ? 1 : 0}><Cuarzo fill={sand} pour={sand} heat={heat} /></g>
        <g opacity={.45+.55*rise} transform={"translate(0 "+(46*(1-rise))+")"}>
          <Elemento sheen={.48+.26*Math.cos(time*2)} heat={heat} broken={broken} />
          <ellipse rx="90" ry="55" fill="url(#e12calor)" opacity={heat*.75} />
        </g>
        <g opacity={reveal} transform={"translate(0 "+sectionOffset+")"}><CeramicSection closed={Math.max((1-progress)*reveal,closeShell)} /></g>
        <g opacity={capReveal}>
          <Contacto side={-1} exploded={190*(1-contact)} cut={1-closeShell} />
          <Contacto side={1} exploded={190*(1-contact)} cut={1-closeShell} />
        </g>
        <g opacity={current*showLoop}>
          <path d={broken?"M-313,0 H-22 M22,0 H313":"M-313,0 H313"} stroke={fault>.45?"#ffac6b":"#a8fff1"} strokeWidth={2.2+fault*2} opacity=".72" />
          {Array.from({length:7},(_,i)=>{
            const x=((time*(125+fault*133)+i*91)%630)-315;
            if(broken && Math.abs(x)<22)return null;
            return <g key={i} transform={"translate("+x+" 0)"}>
              <ellipse rx="28" ry="22" fill={fault>.45?"url(#e12calor)":"url(#e12azul)"}/>
              <circle r="3.8" fill={fault>.45?"#ffe49c":"#dcfff4"}/>
            </g>;
          })}
        </g>
        {broken && <g opacity={travel(q.funde,q.funde+.6)}>
          <path d="M-33,-12 L-20,-22 -7,-18 -3,-7 7,-16 25,-14 31,-4 26,12 10,17 1,12 -13,17 -27,11Z" fill="#64463d" stroke="#d39b65" strokeWidth="2.5" opacity=".8" />
          <path d="M-19,-11 L-9,-7 -13,2 -5,6 -8,12 M14,-8 L9,-2 15,6 10,10" fill="none" stroke="#e9b97d" strokeWidth="2.2" />
        </g>}
        <Arco power={arc} time={time} />
      </g>

      <Lectura x={105} y={448} stage={0} title={script[0].title} detail="La pieza que se funde" opacity={band(.85,q.ceramica-1.25)} target={project(0,0)}/>
      <Lectura x={105} y={434} stage={1} title={script[1].title} detail="Aislante resistente al calor" opacity={band(q.ceramica-.81,q.arena-.66)} target={project(56,-83+sectionOffset)}/>
      <Lectura x={105} y={465} stage={2} title={script[2].title} detail="Ayuda a extinguir el arco" opacity={band(q.arena-.37,q.contactos-.9)} target={project(41,29)}/>
      <Lectura x={105} y={435} stage={3} title={script[3].title} detail="Conectan el elemento con el circuito" opacity={band(q.contactos-.4,q.completo-.44)} target={project(327+190*(1-contact),-11)}/>
      <Lectura x={105} y={435} stage={4} title={script[4].title} detail="Puntos luminosos · corriente representada" opacity={band(q.corriente-.45,q.exceso-.46)} target={project(83,0)}/>
      <Lectura x={105} y={431} stage={5} title="SOBRECORRIENTE" detail="El calor se concentra en el estrechamiento" opacity={band(q.exceso-.16,q.funde-.18)} target={project(0,0)} accent={palette.warm}/>
      <Lectura x={105} y={433} stage={5} title={script[5].title} detail="Arco interno · secuencia ralentizada" opacity={band(q.funde-.14,q.interrumpe-.1)} target={project(0,0)} accent={palette.warm}/>
      <Lectura x={105} y={426} stage={6} title={script[6].title} detail="La corriente se ha interrumpido" opacity={band(q.interrumpe-.07,70.3)} target={project(0,0)}/>
      <Detalle type="metal" amount={notchFocus} time={time} target={project(0,4)} />
      <Detalle type="ceramica" amount={ceramicFocus} time={time} target={project(-122,46+sectionOffset)} />
      <Detalle type="arena" amount={quartzFocus} time={time} target={project(35,32)} />
      <Comparacion amount={final} />
      <g opacity={travel(q.alambre-.35,q.alambre+.35)} transform="translate(157 1518)">
        <path d="M0,0 H749" stroke="#9c805f" strokeWidth="2"/>
        <g transform="translate(27 31)">
          <circle r="27" fill="#24353a" stroke="#ef987e" strokeWidth="3"/>
          {/* Isolated wire silhouette from Episode 09, at the original curvature. */}
          <g transform="scale(.099) translate(-284 -170)">
            <path d="M100 263C90 135 256 72 336 126S344 284 475 97" fill="none" stroke="#111e26" strokeWidth="36"/>
            <path d="M100 263C90 135 256 72 336 126S344 284 475 97" fill="none" stroke="#d99f6e" strokeWidth="24"/>
          </g>
          <path d="M-18,-18 L18,18" stroke="#ef987e" strokeWidth="4"/>
        </g>
        <text x="66" y="34" fontSize="35" fontWeight="800" fill="#ffe1a8" stroke="#16242d" strokeWidth="4" paintOrder="stroke">Nunca lo sustituyas por alambre</text>
      </g>
    </svg>
    {timeline.audioReady && <Subtitulos ms={time*1000} />}
  </AbsoluteFill>;
};

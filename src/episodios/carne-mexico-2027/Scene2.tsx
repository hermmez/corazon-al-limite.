import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Meat,Label,Badge,Reveal,p,colors,lerp} from './art';
import {cues} from './cues';

export const MeatForecasts:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=7+f/fps;
 const specs=[{kind:'beef' as const,x:100,value:6,at:cues.beefPct,name:'RES',color:colors.beef,focus:cues.beef},{kind:'pork' as const,x:390,value:4.8,at:cues.porkPct,name:'CERDO',color:colors.pork,focus:cues.pork},{kind:'chicken' as const,x:680,value:3.3,at:cues.chickenPct,name:'POLLO',color:colors.chicken,focus:cues.chicken}];
 return <Canvas><Reveal t={t} at={7} kind="circle">
  <Label x={540} y={315} text="Proyecciones para 2027" size={50}/>
  <g transform={`translate(${-100*(1-p(t,7.3,.4))} 0)`} opacity={p(t,7.3,.4)}><Badge x={145} y={380} width={790} text="Consejo Mexicano de la Carne"/></g>
  <g opacity={p(t,8,.4)}><path d="M435 485 H645 V592 H435Z" fill="#f5e4bf" stroke="#6d654b" strokeWidth="3"/><path d="M435 485 H645 V517 H435Z" fill="#38858a"/><Label x={540} y={574} text="2027" size={48}/></g>
  <g opacity={p(t,9,.3)}><path d="M84 1333 V866 H990" stroke="#918664" strokeWidth="4" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,9,.65)}/><Label x={540} y={640} text="Aumento porcentual estimado" size={29} color="#736b54"/></g>
  {specs.map((s,i)=>{const fill=p(t,s.at-.15,.85),height=s.value/6*420*fill,focus=p(t,s.focus-.4,.4);return <g key={s.name} transform={`translate(0 ${45*(1-p(t,7.1+i*.2,.4))})`} opacity={p(t,7.1+i*.2,.4)}>
   <path d={`M${s.x} 1330 V880 H${s.x+218} V1330Z`} fill="#e5d4b5" stroke="#b4a17c" strokeWidth="2.5"/>
   <rect x={s.x+3} y={1330-height} width="212" height={height} rx="5" fill={s.color}/>
   <path d={`M${s.x+14} ${1330-height+12} H${s.x+202}`} stroke="#fae4cc" strokeWidth="4" opacity={fill>.1?.5:0}/>
   <Meat kind={s.kind} x={s.x-23-13*focus} y={680-30*focus} w={265+26*focus} angle={lerp(-5,0,focus)}/>
   <Label x={s.x+109} y={1410} text={s.name} size={39}/>
   <g opacity={p(t,s.at,.16)}><Label x={s.x+109} y={1278-height} text={`+${s.value}%`} size={61} color="#42382f"/></g>
  </g>;})}
  <path d="M80 1335 H990" stroke="#655c46" strokeWidth="7"/>
  <g opacity={p(t,16,.3)}><path d="M60 1442 Q350 1360 1040 1465 M60 1470 Q350 1385 1040 1495" fill="none" stroke="#aa9465" strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,16,.7)}/></g>
  <Label x={540} y={1480} text="Estimaciones · no aumentos confirmados" size={29} color="#6e6654"/>
 </Reveal></Canvas>;
};

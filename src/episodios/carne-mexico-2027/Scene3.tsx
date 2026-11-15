import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Farm,Road,Truck,Warehouse,Crate,Icon,Tag,Label,Badge,Reveal,p,lerp} from './art';
import {cues} from './cues';

export const ProductionCosts:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=17+f/fps;
 const drive=p(t,19.7,.7),wh=p(t,24.85,.4),ledger=p(t,26,.5);
 const boxMove=p(t,19,.65);
 return <Canvas><Reveal t={t} at={17} kind="up">
  <Farm t={t}/>
  <g opacity={drive}><Road t={t-20} speed={.8}/></g>
  <g opacity={1-wh}><Truck x={lerp(490,120,drive)} y={lerp(900,1020,drive)} w={780} t={t} speed={drive} door={1-drive}/></g>
  <g opacity={p(t,18.8,.25)*(1-p(t,20.15,.25))}><Crate x={lerp(460,610,boxMove)} y={lerp(900,1020,boxMove)} w={170} angle={-5*(1-boxMove)}/></g>
  <g opacity={p(t,17.5,.3)*(1-p(t,20.8,.3))}><Badge x={105} y={340} width={600} text="1 · PRODUCIR Y TRANSPORTAR"/></g>
  <g opacity={p(t,18,.3)*(1-p(t,19.3,.3))}><path d="M72 1180 L213 1133 L235 1266 L94 1312Z" fill="#ccb184" stroke="#66513b" strokeWidth="4"/><path d="M96 1180 L190 1152 M105 1213 L198 1182" stroke="#92814f" strokeWidth="5"/><Label x={155} y={1250} text="ALIMENTO" size={20}/></g>
  <g opacity={p(t,cues.electricity-.2,.3)}><Icon kind="energy" x={155} y={500} size={180} t={t}/><Label x={245} y={735} text="ELECTRICIDAD" size={28}/><path d="M245 750 Q315 850 395 950" fill="none" stroke="#c1a456" strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,cues.electricity,.7)}/></g>
  <g opacity={p(t,cues.fuel-.2,.3)}><Icon kind="fuel" x={452} y={500} size={180} t={t}/><Label x={542} y={735} text="COMBUSTIBLE" size={28}/><path d="M540 751 Q600 823 670 975" fill="none" stroke="#5a8581" strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,cues.fuel,.7)}/></g>
  <g opacity={p(t,cues.cold-.2,.3)}><Icon kind="cold" x={747} y={500} size={180} t={t}/><Label x={837} y={735} text="REFRIGERACIÓN" size={28}/></g>
  <g opacity={wh}><Warehouse t={t-24.8}/></g>
  <g opacity={wh*(1-ledger)}><Badge x={170} y={355} width={730} text="DISTRIBUCIÓN · LA CADENA CONTINÚA"/><Icon kind="cold" x={800} y={590} size={170} t={t}/></g>
  <g opacity={ledger}><path d="M185 430 H895 V1390 L865 1375 L835 1390 L805 1375 L775 1390 L745 1375 L715 1390 L685 1375 L655 1390 L625 1375 L595 1390 L565 1375 L535 1390 L505 1375 L475 1390 L445 1375 L415 1390 L385 1375 L355 1390 L325 1375 L295 1390 L265 1375 L235 1390 L205 1375 L185 1390Z" fill="#f6e9ca" stroke="#726147" strokeWidth="4"/>
   <Label x={540} y={535} text="COSTOS DE LA CADENA" size={42}/>
   {[['energy','Electricidad'],['fuel','Combustible'],['cold','Refrigeración']].map(([kind,text],i)=><g key={kind} transform={`translate(${80*(1-p(t,26+i*.16,.3))} 0)`} opacity={p(t,26+i*.16,.3)}><Icon kind={kind as 'energy'|'fuel'|'cold'} x={240} y={620+i*190} size={120} t={t}/><Label x={415} y={700+i*190} text={text} size={40} anchor="start"/><path d={`M710 ${685+i*190} L765 ${685+i*190}`} stroke="#b28a4a" strokeWidth="9"/></g>)}
   <Tag x={550} y={1220} w={270} text="$" small="Precio final" angle={-3}/>
  </g>
 </Reveal></Canvas>;
};

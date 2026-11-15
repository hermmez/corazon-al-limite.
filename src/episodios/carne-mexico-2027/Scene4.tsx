import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Road,Truck,Warehouse,Crate,Shop,MapTrade,Icon,Label,Badge,p,Reveal} from './art';
import {cues} from './cues';

export const RouteSecurity:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=27+f/fps;
 const map=p(t,30.5,.35)*(1-p(t,34,.35));const warehouse=p(t,34,.35);const shop=p(t,36,.45);
 return <Canvas>
  <Road t={t-27+5} speed={1}/><Truck x={85+36*p(t,28,.8)} y={1020-12*p(t,29,.7)} w={855} t={t} speed={1}/>
  <g opacity={p(t,cues.reason2-.2,.3)}><Badge x={130} y={350} width={650} text="2 · SEGURIDAD EN EL TRASLADO"/></g>
  <g opacity={p(t,cues.insecurity,.35)}><Icon kind="shield" x={770} y={550} size={180} t={t}/><path d="M370 610 L425 710 H315Z" fill="#e9bb70" stroke="#5d4935" strokeWidth="4"/><Label x={370} y={685} text="!" size={55}/></g>
  <g opacity={map}><MapTrade t={t} route={p(t,30.5,.7)} security/>
   <g opacity={p(t,cues.theft,.25)*(1-p(t,32,.25))}><path d="M340 796 Q540 750 725 807 V1040 H340Z" fill="#d4d6bf" stroke="#4a5c51" strokeWidth="5"/><path d="M410 780 V670 Q540 545 660 670 V780" fill="none" stroke="#718f82" strokeWidth="25"/><path d="M410 780 V670" fill="none" stroke="#e9e4cd" strokeWidth="12" opacity={1-p(t,31.35,.4)}/><circle cx="540" cy="902" r="22" fill="#6a7566"/><path d="M540 924 V961" stroke="#6a7566" strokeWidth="13"/></g>
  </g>
  <g opacity={p(t,cues.securityCost,.3)*(1-p(t,35,.3))}><path d="M165 1090 H915 V1380 H165Z" fill="#f4e6c9" stroke="#6e6148" strokeWidth="4"/><Icon kind="shield" x={208} y={1136} size={125} t={t}/><Label x={585} y={1198} text="Seguridad + operación" size={40}/><path d="M395 1250 H823" stroke="#bba378" strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,33.6,.6)}/><Label x={587} y={1322} text="También son costos" size={34}/></g>
  <g opacity={warehouse}><Warehouse t={t-34}/><Icon kind="shield" x={790} y={580} size={170} t={t} progress={1-shop}/><path d={`M140 ${880+160*p(t,34.25,.7)} H895`} stroke="#97b5a0" strokeWidth="11" opacity={(1-p(t,35,.3))*.8}/></g>
  <g opacity={shop}><Shop t={t}/><Crate x={160+220*p(t,36,.6)} y={1005-60*p(t,36,.6)} w={260}/><Badge x={140} y={370} width={700} text="DEL TRANSPORTE A LA TIENDA"/></g>
 </Canvas>;
};

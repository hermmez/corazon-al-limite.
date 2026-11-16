import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Note,Text,p,between} from './art';
import {Sunfish} from './fish';
import {cues} from './cues';
export const SunfishSurface:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=49+f/fps;
 const rise=p(t,49,2.5),turn=p(t,51.2,.65),roll=p(t,cues.side,1.1),above=p(t,54.5,.45);
 return <Canvas><Ocean t={t} depth={.5*(1-rise)} cameraY={-400*rise} surface={p(t,51.5,.7)}/>
 <g opacity={above}>
  <rect width="1080" height="1920" fill="#1b929d"/>
  {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M-100 ${150+i*270+Math.sin(t*.8+i)*17} Q300 ${75+i*270+Math.cos(t*.9+i)*15} 650 ${145+i*270} T1200 ${115+i*270}`} fill="none" stroke={i%2?'#8acac4':'#d5e2be'} strokeWidth={i%2?9:5} opacity=".32" transform={`translate(${Math.sin(t*.8+i)*28} 0)`}/>)}
  <rect width="1080" height="900" fill="url(#warm-luna)" opacity=".43"/>
 </g>
 <Sunfish cx={565-20*rise+20*Math.sin(t*.65)} cy={1090-160*rise+45*above} h={1030} t={t} angle={15*(1-rise)+12*above} front={turn*(1-above)} roll={90*roll} stroke={1-.5*above}/>
 <g opacity={between(t,54.7,56,.25)}><Text x={540} y={1345} size={43}>Vista desde arriba · de lado</Text></g>
 <g opacity={between(t,cues.maybe,58,.3)}><Note x={80} y={330} w={920} t={t} at={cues.maybe} size={43}>Una posible función: recuperar calor</Note></g>
 <g opacity={p(t,cues.warm,.5)*(1-p(t,58.3,.4))}><path d={`M165 ${1240+8*Math.sin(t)} Q545 1290 925 1240`} fill="none" stroke="#f5dda0" strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,cues.warm,.8)}/></g>
 </Canvas>;
};

import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Shop,Meat,Tag,Icon,Scale,Label,Badge,p,lerp,pulse} from './art';
import {Buyer} from './character';

export const MeatHook:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;const wide=p(t,1,.6);const person=p(t,2.9,.35);
 const lift=90*p(t,4,.4)*(1-p(t,5,.4));
 return <AbsoluteFill style={{overflow:'hidden'}}>
 <Canvas><defs><clipPath id="hook-shop"><circle cx="720" cy="720" r={wide*1900}/></clipPath></defs>
  <g clipPath="url(#hook-shop)"><Shop t={t}/></g>
  <g opacity={1-p(t,5.8,.5)}><Meat kind="beef" x={lerp(100,50,wide)} y={lerp(625,895,wide)} w={lerp(750,470,wide)} angle={-8+5*p(t,.03,.4)} lift={lift}/>
   <g opacity={1-p(t,.95,.42)}><Tag x={525} y={490} w={360} text={`$${250+Math.round(15*p(t,.03,.85))}`} small="Ejemplo hipotético" angle={-8+7*p(t,.1,.4)}/></g>
   <g opacity={p(t,.95,.25)*(1-p(t,1.7,.4))} transform={`translate(${680-55*p(t,1.25,.55)} ${565+150*p(t,1.25,.55)}) rotate(${-12+12*p(t,1.1,.5)})`}><path d="M-110 -90 H110 V108 H-110Z" fill="#f8e9ca" stroke="#584333" strokeWidth="4"/><Label x={0} y={65} text="$" size={175}/></g>
   <g opacity={p(t,2.1,.35)}><Tag x={430} y={620} w={290} text="$265" small="Ejemplo" angle={3}/></g>
  </g>
  <g opacity={p(t,1.9,.3)*(1-p(t,4.7,.4))}>
   <g transform={`translate(${600*(1-p(t,2,.3))} 0)`}><Meat kind="pork" x={125} y={1160} w={260} angle={-4}/><Label x={260} y={1410} text="CERDO" size={30}/></g>
   <g transform={`translate(${650*(1-p(t,2.25,.3))} 0)`}><Meat kind="chicken" x={420} y={1145} w={260} angle={5}/><Label x={550} y={1410} text="POLLO" size={30}/></g>
  </g>
  <g opacity={p(t,1.75,.3)*(1-p(t,4.6,.25))}><Badge x={76} y={365} width={375} text="2027 · PROYECCIÓN"/></g>
  <g opacity={p(t,4,.25)*(1-p(t,5.2,.3))}><Scale x={170} y={1110} t={t} weight={p(t,4.15,.45)} w={330}/></g>
  <g opacity={p(t,4.8,.2)}>
   <g transform={`translate(0 ${80*(1-p(t,4.8,.3))})`}><Icon kind="energy" x={100} y={1020} size={180} t={t} progress={p(t,4.8,.3)}/><Label x={190} y={1250} text="COSTOS" size={29}/></g>
   <g transform={`translate(0 ${80*(1-p(t,5.15,.3))})`}><Icon kind="shield" x={355} y={1020} size={180} t={t} progress={p(t,5.15,.3)}/><Label x={445} y={1250} text="SEGURIDAD" size={29}/></g>
   <g transform={`translate(0 ${80*(1-p(t,5.55,.3))})`}><Icon kind="globe" x={610} y={1020} size={180} t={t} progress={p(t,5.55,.3)}/><Label x={700} y={1250} text="OFERTA" size={29}/></g>
   <path d="M190 1322 Q445 1390 700 1322" fill="none" stroke="#5f8177" strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,6,.55)}/>
  </g>
 </Canvas>
 <div style={{position:'absolute',inset:0,opacity:person*(1-p(t,5.9,.3)),clipPath:`inset(0 0 ${100*(1-person)}% 0)`}}><Buyer x={650} y={505} width={435} t={t} look={-5*p(t,3,.45)+3*p(t,4.2,.5)} surprise={p(t,3.25,.3)*(1-p(t,4.7,.3))} reach={p(t,4,.4)*(1-p(t,5,.4))} lean={-2*p(t,3.6,.4)}/></div>
 </AbsoluteFill>;
};

import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Farm,Shop,MapTrade,Crate,Balance,Tag,Label,Badge,p,lerp} from './art';
import {cues} from './cues';

export const InternationalSupply:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=37+f/fps;const map=p(t,40,.4),balance=p(t,43,.4),shop=p(t,46,.4);
 const cargo=p(t,41.7,1.1);
 return <Canvas><Farm t={t} us/>
  <g opacity={p(t,cues.reason3-.2,.3)*(1-p(t,40,.3))}><Badge x={115} y={340} width={800} text="3 · DISPONIBILIDAD INTERNACIONAL"/></g>
  <g opacity={p(t,38.8,.4)*(1-p(t,40.4,.3))}><Crate x={lerp(760,610,p(t,39,.6))} y={1040-80*p(t,39.5,.6)} w={210}/></g>
  <g opacity={map}><MapTrade t={t} route={p(t,cues.usa,.75)}/><g opacity={p(t,41.8,.2)*(1-balance)}><Crate x={lerp(468,560,cargo)} y={lerp(712,1017,cargo)} w={130}/><Crate x={lerp(405,500,p(t,42.1,1))} y={lerp(680,985,p(t,42.1,1))} w={116}/></g></g>
  <g opacity={balance}><rect x="62" y="425" width="956" height="950" rx="35" fill="#eadcbf" stroke="#877854" strokeWidth="4"/>
   <Badge x={190} y={460} width={700} text="LA OFERTA INFLUYE EN EL MERCADO"/>
   <Balance x={140} y={660} t={t} tilt={-7*p(t,cues.supply,.6)+11*p(t,44,.6)-5*p(t,45,.7)}/>
   <Tag x={600} y={1120-35*p(t,44,.6)+20*p(t,45,.6)} w={250} text="$" small="Puede variar" angle={-3+6*p(t,44.5,.5)}/>
  </g>
  <g opacity={shop}><Shop t={t}/><Crate x={lerp(660,240,p(t,46,.75))} y={lerp(730,1070,p(t,46,.75))} w={245}/><Label x={530} y={403} text="MERCADO MEXICANO" size={42}/></g>
 </Canvas>;
};

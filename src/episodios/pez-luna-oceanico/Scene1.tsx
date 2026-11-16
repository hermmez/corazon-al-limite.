import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Reveal,Note,Trace,p,between} from './art';
import {Sunfish} from './fish';
import {Diver} from './diver';
import {cues} from './cues';
export const SunfishHook:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;
 const h=1320-320*p(t,1.35,.75)-60*p(t,3.9,.5)+430*p(t,5,.6)-410*p(t,6.5,.6);
 const cx=620-70*p(t,1.35,.75)+420*p(t,5,.6)-420*p(t,6.5,.6)-16*Math.sin(t*.7);
 return <Canvas><Ocean t={t} cameraX={50*p(t,1.35,.75)+110*p(t,5,.6)}/>
 <g opacity={between(t,2.95,4.7,.35)}><Reveal t={t} at={2.95}><Diver x={85} y={265} w={560} t={t} gesture={p(t,3.7,.4)}/></Reveal></g>
 <Sunfish cx={cx} cy={850+25*p(t,1.35,.75)} h={h} t={t} angle={-4+6*p(t,1,.6)-2*p(t,2.1,.5)} diagram={p(t,7,.55)*.65}/>
 <g opacity={between(t,5.5,6.55,.22)}><Note x={220} y={1230} w={640} t={t} at={cues.ton} size={66}>{'> 1 tonelada'}</Note></g>
 <g opacity={p(t,6,.25)*(1-p(t,7.6,.2))}><Trace d="M160 1020 Q80 770 250 595 Q420 435 663 499" t={t} at={6} duration={.75}/></g>
 </Canvas>;
};

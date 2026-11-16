import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Note,Trace,p,between} from './art';
import {Sunfish} from './fish';
import {Diver} from './diver';
import {Jelly,Salps} from './life';
import {cues} from './cues';
export const SunfishDiving:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=28+f/fps;const dive=p(t,31.3,5.2),depth=p(t,32,5)*.88;
 return <Canvas><Ocean t={t} depth={depth} cameraX={120*dive} cameraY={780*dive}/>
 <Diver x={95-30*dive} y={300-330*dive} w={560} t={t} gesture={p(t,30,.6)} opacity={1-p(t,32,.6)}/>
 <Sunfish cx={595-100*dive} cy={920+210*p(t,31.3,2.5)-150*p(t,34.3,2.5)} h={970} t={t} angle={-26*dive}/>
 <g opacity={between(t,29.1,31.5,.3)}><Trace d="M155 654 Q190 710 253 708 M130 688 L155 654 L194 652" t={t} at={29.1} duration={.7}/></g>
 <g opacity={between(t,cues.dives,37.2,.3)}><Note x={115} y={310} w={850} t={t} at={cues.dives} size={51}>Inmersiones profundas</Note></g>
 <g opacity={p(t,36,.5)}><Jelly x={800-100*p(t,37,1)} y={1230-110*p(t,37,1)} w={150} t={t}/><Salps x={100} y={1260-120*p(t,37,1)} w={95} t={t} count={4}/></g>
 <rect width="1080" height="1920" fill="#052d47" opacity={depth*.12}/>
 </Canvas>;
};

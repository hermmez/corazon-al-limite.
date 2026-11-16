import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Reveal,Text,Trace,p,between} from './art';
import {Sunfish} from './fish';
import {Diver} from './diver';
import {cues} from './cues';
export const SunfishQuestion:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=59+f/fps;const question=p(t,cues.question,.4);
 const front=between(t,65,66.2,.55);
 return <Canvas><Ocean t={t} cameraX={(t-59)*20}/>
 <g opacity={p(t,60.9,.4)}><Reveal t={t} at={60.9}><Diver x={110-20*p(t,65,2)} y={440+45*p(t,66,2)} w={555} t={t} gesture={p(t,66.8,.5)}/></Reveal></g>
 <Sunfish cx={575-55*p(t,59,1)+20*p(t,64,.7)-60*p(t,68,1.4)} cy={950-25*Math.sin((t-59)*.65)} h={1050-50*p(t,67,.6)} t={t} angle={-2+3*Math.sin(t*.6)} front={front} diagram={between(t,62.3,64.4,.5)*.55}/>
 <g opacity={between(t,59.2,61.4,.3)}><Trace d="M175 994 Q95 773 275 625 Q391 524 603 590" t={t} at={59.2} duration={.8}/></g>
 <g opacity={question}><Reveal t={t} at={cues.question}><Text x={540} y={315+15*(1-question)} size={84}>¿NADARÍAS</Text><Text x={540} y={418+15*(1-question)} size={84}>JUNTO A ÉL?</Text></Reveal></g>
 </Canvas>;
};

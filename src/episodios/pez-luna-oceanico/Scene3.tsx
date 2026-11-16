import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Text,Trace,p,between} from './art';
import {Sunfish,ConventionalFish} from './fish';
import {cues} from './cues';
export const SunfishSwimming:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=19+f/fps;
 const advance=p(t,cues.propulsion,2.1),compare=between(t,24,26,.3);
 const fishX=585-90*advance-32*p(t,26,.8),fishY=940+18*Math.sin((t-19)*.75),scale=1040/1536;
 return <Canvas><Ocean t={t} cameraX={(t-19)*38}/>
 <Sunfish cx={fishX} cy={fishY} h={1040} t={t} angle={-1.5+2*Math.sin(t*.65)}/>
 <g opacity={between(t,20.05,27,.3)}>
  <g opacity={p(t,cues.dorsal,.22)}><Text x={800} y={355} size={62}>Dorsal</Text><Trace d={`M796 380 L${fishX+218*scale} ${fishY-500*scale}`} t={t} at={cues.dorsal}/></g>
  <g opacity={p(t,cues.anal,.22)}><Text x={835} y={1320} size={62}>Anal</Text><Trace d={`M789 1320 L${fishX+178*scale} ${fishY+530*scale}`} t={t} at={cues.anal}/></g>
 </g>
 <g opacity={compare}><ConventionalFish x={850-630*p(t,24,1.4)} y={440} w={300} t={t}/></g>
 </Canvas>;
};

import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Text,p,between,lerp} from './art';
import {Sunfish} from './fish';
import {Jelly,Salps} from './life';
import {cues} from './cues';
export const SunfishFeeding:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=39+f/fps;const approach=p(t,41,1.6),eat=p(t,42.6,.5),leave=p(t,45.4,2.5);
 const fishX=925-345*approach-85*leave,fishY=970-50*approach-50*leave;
 const mouthX=fishX-306,mouthY=fishY-18;
 return <Canvas><Ocean t={t} depth={.6-.18*leave} cameraX={(t-39)*27} cameraY={120*leave}/>
 <Salps x={160-100*p(t,42.7,1.3)} y={425} w={155} t={t} count={5} opacity={between(t,41.35,43.7,.3)}/>
 <Jelly x={lerp(95,mouthX-36,approach)+65*eat} y={lerp(570,mouthY-9,approach)} w={lerp(335,48,approach)*(1-.25*eat)} t={t} angle={-10+10*approach} opacity={1-p(t,43,.2)}/>
 <Sunfish cx={fishX} cy={fishY} h={1000} t={t} angle={-4+6*approach+12*leave} feeding={between(t,42,43.2,.25)}/>
 <g opacity={between(t,cues.jelly,41.7,.2)}><Text x={300} y={400} size={66}>Medusas</Text></g>
 <g opacity={between(t,cues.salps,43.5,.2)}><Text x={600} y={355} size={66}>Salpas</Text></g>
 <Jelly x={100-150*p(t,46,2)} y={1290-200*p(t,45,3)} w={150} t={t+.5} opacity={between(t,43.8,48,.4)}/>
 <Salps x={760-160*p(t,45,2)} y={1170-160*p(t,45,2)} w={100} t={t} count={3} opacity={between(t,43.5,48,.4)}/>
 <rect width="1080" height="1920" fill="#123f55" opacity=".06"/>
 </Canvas>;
};

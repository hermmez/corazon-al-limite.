import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Ocean,Text,Trace,Reveal,p,between} from './art';
import {Sunfish,ConventionalFish} from './fish';
import {cues} from './cues';
export const SunfishAnatomy:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=8+f/fps;
 const steer=p(t,cues.rudder,.8),exit=p(t,18,.8);
 const fishX=565-30*steer-55*exit,fishY=1000+22*steer-25*exit,angle=3*steer-4*exit;
 return <Canvas><Ocean t={t} depth={.12} cameraX={(t-8)*7}/>
 <Sunfish cx={fishX} cy={fishY} h={980} t={t} angle={angle} diagram={.6*(1-exit)}/>
 <g opacity={between(t,8.05,11,.3)}><Reveal t={t} at={8.05}><Text x={540} y={330} size={84}>Pez luna</Text></Reveal><g opacity={p(t,cues.scientific,.3)}><Text x={540} y={422} size={62} italic>Mola mola</Text></g></g>
 <g opacity={between(t,11.2,14.8,.3)}><Reveal t={t} at={11.2}><ConventionalFish x={130-30*p(t,12,.8)} y={400} w={360} t={t}/><Text x={324} y={673} size={43}>Cola convencional</Text></Reveal></g>
 <g opacity={between(t,13.6,18.15,.3)}>
  <g transform={`translate(${fishX} ${fishY}) rotate(${angle}) scale(${980/1536}) translate(-512 -768)`}><Trace d="M901 538 Q943 558 948 601 Q983 629 980 681 Q1001 721 981 758 Q1001 808 977 843 Q993 903 960 939 Q956 981 910 1003 Q882 1037 838 1044" t={t} at={13.6} duration={1.0} color="#ffe3a1" width={9}/></g>
  <g opacity={p(t,cues.clavus,.22)}><Text x={797} y={508} size={76}>CLAVUS</Text><Trace d={`M800 540 Q975 665 ${fishX+438*980/1536} ${fishY+32*980/1536}`} t={t} at={cues.clavus} duration={.55}/></g>
 </g>
 <g opacity={p(t,cues.rudder,.2)}><Trace d="M190 1170 Q121 1090 192 1040 Q240 1010 274 1055 M250 1031 L274 1055 L242 1063" t={t} at={cues.rudder} duration={.65}/><Text x={265} y={1260} size={44}>Sirve de timón</Text></g>
 </Canvas>;
};

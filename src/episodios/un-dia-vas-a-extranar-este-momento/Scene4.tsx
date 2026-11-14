import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease,FamilyPhoto} from './art';
import {Clock,Narration,Office,Reveal} from './shared';

export const Scene4:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;
 return <AbsoluteFill><Reveal><Office t={t} night={.25+ease(t,1,7)*.65} mood={t>5?'tired':'neutral'} phoneMode="missed" photoLight={ease(t,7,9)}/><Clock t={t}/>
 <div style={{position:'absolute',left:650,top:275,width:400,height:360,overflow:'hidden',opacity:.55*ease(t,1.8,2.4)*(1-ease(t,5.6,6.4)),clipPath:`ellipse(${ease(t,1.8,2.6)*70}% 70% at 60% 50%)`,filter:'sepia(.25)'}}><FamilyPhoto t={t} style={{left:-10,top:0,rotate:'0deg'}}/></div>
 <FamilyPhoto t={t} style={{left:600,top:840,opacity:ease(t,7.6,8.1),translate:`${60*(1-ease(t,7.6,8.3))}px ${200*(1-ease(t,7.6,8.3))}px`,rotate:`${8-4*ease(t,8.3,9.8)}deg`}}/>
 </Reveal><Narration scene={3}/></AbsoluteFill>;
};

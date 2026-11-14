import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease,Interaction,Phone,ReachHand,Room,DeskCloseup,Table} from './art';
import {Narration,Office,Reveal} from './shared';

export const Scene5:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;
 const close=ease(t,4.6,5.05);const answer=ease(t,8.5,9.1);
 return <AbsoluteFill><Reveal direction="left"><Office t={t} night={.7*(1-ease(t,2,7))} mood={t<2.8?'worried':'neutral'} phoneMode="missed" typing={t<3} photoLight={ease(t,0,2.5)}/></Reveal>
 <AbsoluteFill style={{clipPath:`circle(${close*1600}px at 70% 75%)`}}><DeskCloseup/><AbsoluteFill style={{background:'#382a2822'}}/><Phone t={t} mode={t>6.2?'calling':'missed'} style={{left:340,top:400,scale:1.45,rotate:`${-7+ease(t,6.5,7.4)*7}deg`,transformOrigin:'top left'}}/><ReachHand progress={ease(t,5.25,6.2)} x={568} y={975} width={315}/></AbsoluteFill>
 <AbsoluteFill style={{clipPath:`circle(${answer*1600}px at 50% 42%)`}}><Room kind="kitchen"/><AbsoluteFill style={{clipPath:'inset(0 0 40% 0)'}}><Interaction kind="mother-call" x={125} y={430} width={760} t={t}/></AbsoluteFill><Table t={t}/></AbsoluteFill>
 <Narration scene={4}/></AbsoluteFill>;
};

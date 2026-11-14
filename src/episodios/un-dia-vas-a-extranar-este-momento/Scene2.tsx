import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease,Interaction,Phone,ReachHand,Room,DeskCloseup,Table} from './art';
import {Narration,Office,Reveal} from './shared';

export const Scene2:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;
 const phone=ease(t,2.3,2.65)*(1-ease(t,5.1,5.5));
 const mother=ease(t,5.1,5.6);
 return <AbsoluteFill>
  <Reveal><Office t={t} phoneMode={t>3.6?'missed':'ring'}/></Reveal>
  <AbsoluteFill style={{opacity:phone,clipPath:`circle(${ease(t,2.3,2.8)*1600}px at 70% 70%)`}}><DeskCloseup/><AbsoluteFill style={{background:'#382a2822'}}/><Phone t={t} mode={t>3.65?'missed':'ring'} style={{left:328,top:390,scale:1.45,transformOrigin:'top left',rotate:'-7deg'}}/><ReachHand progress={ease(t,2.9,3.65)} x={495} y={935} width={315}/></AbsoluteFill>
  <AbsoluteFill style={{clipPath:`circle(${mother*1600}px at 62% 65%)`}}><Room kind="kitchen" pan={-ease(t,6,8)*12}/><AbsoluteFill style={{clipPath:'inset(0 0 40% 0)'}}><Interaction kind="mother-call" x={100} y={430} width={800} t={t}/></AbsoluteFill><Table t={t}/><div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#46302788,transparent 60%)'}}/></AbsoluteFill>
  <Narration scene={1}/>
 </AbsoluteFill>;
};

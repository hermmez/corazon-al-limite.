import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease,Family,Interaction,Room,Table} from './art';
import {Narration,Reveal} from './shared';

export const Scene6:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;
 const hug=ease(t,3.1,3.55),meal=ease(t,5.8,6.3),friends=ease(t,8.2,8.65);
 return <AbsoluteFill><Reveal><Room kind="kitchen"/>
  <div style={{position:'absolute',inset:0,clipPath:'inset(0 48% 40% 0)'}}><Interaction kind="young-call" x={-40} y={500} width={650} t={t}/></div>
  <div style={{position:'absolute',inset:0,clipPath:'inset(0 0 40% 52%)'}}><Interaction kind="mother-call" x={474} y={500} width={650} t={t+.4}/></div>
  <Table t={t}/>
  <div style={{position:'absolute',left:530,top:0,bottom:0,width:20,background:'#f4d4a1',opacity:.28}}/>
 </Reveal>
 <AbsoluteFill style={{clipPath:`circle(${hug*1550}px at 50% 55%)`}}><Room kind="living" pan={ease(t,3.5,5.8)*10}/><Interaction kind="hug" x={-160} y={440} width={1400} t={t}/></AbsoluteFill>
 <AbsoluteFill style={{clipPath:`inset(0 ${(1-meal)*100}% 0 0)`}}><Family t={t}/></AbsoluteFill>
 <AbsoluteFill style={{clipPath:`circle(${friends*1550}px at 50% 55%)`}}><Room kind="kitchen"/><AbsoluteFill style={{clipPath:'inset(0 0 40% 0)'}}><Interaction kind="friends" x={10} y={560} width={1060} t={t}/></AbsoluteFill><Table t={t}/></AbsoluteFill>
 <Narration scene={5}/></AbsoluteFill>;
};

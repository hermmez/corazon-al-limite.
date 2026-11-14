import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, mix, Family, Phone, ReachHand, DeskCloseup} from './art';
import {Narration} from './shared';

export const Scene1: React.FC = () => {
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;
 const p=ease(t,3,4.25);const reveal=ease(t,1.95,2.55);
 const w=mix(440,1080,p),h=mix(372,1920,p),pad=15*(1-p);
 return <AbsoluteFill style={{background:'#614b35',overflow:'hidden'}}>
  <DeskCloseup/>
  <AbsoluteFill style={{background:'linear-gradient(120deg,#32282155,transparent 70%,#61422733)'}}/>
  <div style={{opacity:1-ease(t,3,3.8)}}><Phone t={t} style={{left:300,top:370,scale:1.45,rotate:`${-8+Math.sin(t*65)*1.5*(1-ease(t,1.5,2))}deg`,transformOrigin:'top left'}}/><ReachHand progress={ease(t,1,1.9)} x={640} y={850} width={315}/></div>
  <div style={{position:'absolute',left:mix(70,0,p),top:mix(1065,0,p),width:w,height:h,padding:pad,paddingBottom:43*(1-p),background:'#f4e5cb',rotate:`${-7*(1-p)}deg`,boxShadow:'8px 18px 35px #2c1f1b55',boxSizing:'border-box',clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`}}>
   <div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}><div style={{position:'absolute',width:1080,height:1920,transformOrigin:'top left',transform:`translateY(${-110*(1-p)}px) scale(${(w-pad*2)/1080})`}}><Family t={t} worried={t>5.35}/></div></div>
  </div>
  <Narration scene={0}/>
 </AbsoluteFill>;
};

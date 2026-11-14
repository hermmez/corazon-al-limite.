import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease,mix,Family} from './art';
import {Narration,Reveal} from './shared';

export const Scene7:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;const p=ease(t,4.3,7.2);const w=mix(1080,880,p);const scale=w/1080;
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 40% 40%,#c59159,#76533c)'}}><Reveal direction="left">
 <div style={{position:'absolute',left:mix(0,100,p),top:mix(0,365,p),width:w,height:mix(1920,840,p),padding:mix(0,22,p),paddingBottom:mix(0,70,p),boxSizing:'border-box',background:'#f6e8ce',rotate:`${-3*p}deg`,boxShadow:`${10*p}px ${20*p}px ${55*p}px #35221866`}}><div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}><div style={{position:'absolute',width:1080,height:1920,transformOrigin:'top left',transform:`translateY(${-270*p}px) scale(${(w-44*p)/1080})`}}><Family t={Math.min(t,7.4)}/></div></div></div>
 <AbsoluteFill style={{background:'#fff2db',opacity:.28*(1-ease(t,7.1,7.35))*ease(t,7,7.08)}}/>
 <div style={{position:'absolute',left:100,right:150,top:1420,fontFamily:'Georgia,serif',fontSize:78,fontWeight:500,lineHeight:1.12,textAlign:'center',color:'#fff0d3',textShadow:'0 3px 12px #35221d66',opacity:ease(t,7.35,7.8),translate:`0 ${18*(1-ease(t,7.35,7.9))}px`}}>No esperes<br/>a extrañarlo.</div>
 </Reveal><Narration scene={6}/></AbsoluteFill>;
};

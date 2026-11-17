import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {SVG,Backdrop,Cover,Tank,Flame,C,ease,lerp} from './Art';
import {Earth} from './Maps';
export const Scene7=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;return <><SVG><Backdrop t={t} space/><g opacity={1-ease(t,1,1.6)}><Earth t={t+3} r={lerp(t,0,1.6,355,490)}/></g></SVG><div style={{position:'absolute',inset:0,opacity:ease(t,1,1.6),clipPath:`circle(${ease(t,1,1.7)*100}% at 50% 48%)`}}><Cover t={t+70}/></div><SVG>
 {[0,1,2].map(i=><path key={'circuit'+i} d={`M${450+i*60} 1040V${900-i*45}L${690+i*40} ${840-i*45}`} stroke={C.teal} strokeWidth={6} pathLength="1" strokeDasharray="1" strokeDashoffset={ease(t,3,4.2)} opacity={ease(t,2,2.4)*(1-ease(t,4.1,4.5))}/>)}
 {[0,1,2].map(i=><circle key={i} cx={350+i*200} cy={890+i%2*180} r={55+(t*12+i*20)%65} opacity={ease(t,1.5,2)*(1-ease(t,5.4,6))*.6} stroke={C.teal} strokeWidth="6" strokeDasharray="16 9" strokeDashoffset={-t*40}/>)}
 <g opacity={ease(t,3.5,3.8)*(1-ease(t,5.4,5.7))}><Tank t={t+10} x={lerp(t,3.5,5.7,-400,1500)} y={1320} s={1.15}/></g>
 <g opacity={ease(t,4.7,5)*(1-ease(t,5.5,6.1))}><Flame t={t} x={140} y={1250} s={1.3}/><Flame t={t+.8} x={880} y={1220} s={.8}/></g>
 <path d={`M${540+Math.sin(t*.8)*280} 1400V${1340+Math.sin(t*1.1)*10}`} stroke={C.gold} strokeWidth="5" opacity={ease(t,6.2,6.5)}/><circle cx={540+Math.sin(t*.8)*280} cy={1330+Math.sin(t*1.1)*10} r="12" fill={C.teal} stroke={C.cream} opacity={ease(t,6.2,6.5)}/>
 </SVG><div style={{position:'absolute',top:1450,left:95,right:125,color:C.cream,fontSize:58,fontWeight:800,fontFamily:'Arial, sans-serif',lineHeight:1.13,textAlign:'center',opacity:ease(t,7.5,7.8),translate:`0px ${lerp(t,7.5,7.9,30,0)}px`}}>¿QUÉ SÍMBOLO<br/><span style={{color:C.gold}}>TE INQUIETA MÁS?</span></div></>};

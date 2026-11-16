import React,{useEffect,useState,useId} from 'react';
import {AbsoluteFill,staticFile,delayRender,continueRender,cancelRender} from 'remotion';
export const asset=(name:string)=>staticFile('episodios/pez-luna-oceanico/'+name);
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const p=(t:number,at:number,d=.4)=>{const v=clamp((t-at)/d);return v*v*(3-2*v);};
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const between=(t:number,a:number,b:number,d=.3)=>p(t,a,d)*(1-p(t,b,d));
export const ink='#202b30';
const assets=['pez-luna-perfil.png','pez-luna-frontal.png','buzo-personaje-original.png','oceano-ilustrado.png','medusa.png','salpa.png'];
const Preload:React.FC=()=>{
 const[handle]=useState(()=>delayRender('Cargar ilustraciones originales del pez luna'));
 useEffect(()=>{Promise.all(assets.map(name=>new Promise<void>((resolve,reject)=>{const im=new window.Image();im.onload=()=>resolve();im.onerror=reject;im.src=asset(name);}))).then(()=>continueRender(handle)).catch(cancelRender);},[handle]);return null;
};
export const Canvas:React.FC<{children:React.ReactNode}>=({children})=><AbsoluteFill style={{background:'#08788b',overflow:'hidden'}}><Preload/><svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}><defs>
 <linearGradient id="deep-luna" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#163e5c"/><stop offset="1" stopColor="#071b36"/></linearGradient>
 <linearGradient id="warm-luna" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffebb1" stopOpacity=".65"/><stop offset="1" stopColor="#fae7b0" stopOpacity="0"/></linearGradient>
 <linearGradient id="compare-luna" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#74b5bd"/><stop offset="1" stopColor="#297d91"/></linearGradient>
 </defs>{children}</svg></AbsoluteFill>;
export const Ocean:React.FC<{t:number;depth?:number;cameraX?:number;cameraY?:number;surface?:number}>=({t,depth=0,cameraX=0,cameraY=0,surface=0})=><g>
 <image href={asset('oceano-ilustrado.png')} x={-90-cameraX*.15} y={-120-cameraY*.12} width="1260" height="2239" preserveAspectRatio="xMidYMid slice"/>
 <rect width="1080" height="1920" fill="url(#deep-luna)" opacity={depth*.9}/>
 <g opacity={.11*(1-depth)} transform={`translate(${Math.sin(t*.45)*14-cameraX*.08} 0)`}><path d="M55 -100 L455 1450 L590 1450 L230 -100Z M300 -100 L780 1330 L875 1330 L430 -100Z" fill="#ffe8b0"/></g>
 <g opacity={surface}>
  <path d={`M-100 ${195+Math.sin(t*1.7)*9} Q250 ${130+Math.cos(t*.9)*13} 560 195 T1200 185 L1200 -100 H-100Z`} fill="#b6e0d7"/>
  <path d={`M-100 ${225+Math.sin(t*1.7)*10} Q240 ${160+Math.cos(t*.9)*16} 560 225 T1200 215`} stroke="#f4edcb" strokeWidth="12" fill="none"/>
  <rect width="1080" height="590" fill="url(#warm-luna)"/>
 </g>
 {[0,1,2,3,4,5,6,7].map(i=><g key={i} opacity={.14-depth*.07} transform={`translate(${90+i*139+Math.sin(t*.8+i)*13} ${1780-((t*26+i*199)%1800)})`}><circle r={i%2?7:4} fill="none" stroke="#e3f1dc" strokeWidth="2"/><circle cx="-2" cy="-3" r="1.5" fill="#ecf4e0"/></g>)}
 <g opacity={depth*.23} transform={`translate(${-cameraX*.22} ${-cameraY*.2})`}><path d="M-100 1720 Q80 1510 300 1595 Q490 1470 710 1580 Q980 1440 1250 1600 V2100 H-100Z" fill="#183c50"/><path d="M-100 1830 Q170 1600 405 1735 Q655 1550 900 1700 L1250 1650 V2100 H-100Z" fill="#092939"/></g>
</g>;
export const Reveal:React.FC<{t:number;at:number;duration?:number;kind?:'wipe'|'circle'|'up';children:React.ReactNode}>=({t,at,duration=.35,kind='wipe',children})=>{
 const id=useId().replace(/:/g,'');const v=p(t,at,duration);
 return <g><defs><clipPath id={id}>{kind==='circle'?<circle cx="540" cy="900" r={v*1500}/>:kind==='up'?<rect x="0" y={1920*(1-v)} width="1080" height={1920*v}/>:<rect x="0" y="0" width={1080*v} height="1920"/>}</clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
};
export const Text:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string;anchor?:'start'|'middle'|'end';italic?:boolean}>=({x,y,children,size=54,fill='#fff2cf',anchor='middle',italic=false})=><text x={x} y={y} textAnchor={anchor} fill={fill} fontFamily={italic?'Georgia,serif':'Arial,sans-serif'} fontSize={size} fontWeight="700" fontStyle={italic?'italic':'normal'} stroke="none" paintOrder="stroke">{children}</text>;
export const Note:React.FC<{x?:number;y:number;w?:number;t:number;at:number;children:string;size?:number}>=({x=140,y,w=800,t,at,children,size=48})=><g opacity={p(t,at,.22)} transform={`translate(0 ${18*(1-p(t,at,.35))})`}><rect x={x} y={y} width={w} height="86" rx="21" fill="#173d49" opacity=".91" stroke="#bfd9cd" strokeWidth="2"/><Text x={x+w/2} y={y+59} size={size}>{children}</Text></g>;
export const Trace:React.FC<{d:string;t:number;at:number;duration?:number;color?:string;width?:number}>=({d,t,at,duration=.6,color='#f8df9b',width=6})=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,at,duration)}/>;

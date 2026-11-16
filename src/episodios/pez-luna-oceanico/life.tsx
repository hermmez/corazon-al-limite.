import React,{useId} from 'react';
import {asset} from './art';
export const Jelly:React.FC<{x:number;y:number;w?:number;t:number;angle?:number;opacity?:number}>=({x,y,w=260,t,angle=0,opacity=1})=>{
 const id=useId().replace(/:/g,'');const pulse=Math.sin(t*3.8);const scale=w/1098;
 const im=<image href={asset('medusa.png')} width="1098" height="1433"/>;
 return <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${angle} ${w/2} ${w*.5}) scale(${scale})`}>
 <defs><clipPath id={id+'bell'}><rect x="0" y="0" width="1098" height="470"/></clipPath><clipPath id={id+'arms'}><rect x="0" y="450" width="1098" height="983"/></clipPath></defs>
 <g transform={`translate(545 459) matrix(${.95+.05*pulse} 0 ${.025*Math.sin(t*2.3-.5)} ${1+.025*Math.cos(t*3.8)} 0 0) translate(-545 -459)`} clipPath={`url(#${id}arms)`}>{im}</g>
 <g transform={`translate(545 460) scale(${.94+.06*pulse} ${1-.035*pulse}) translate(-545 -460)`} clipPath={`url(#${id}bell)`}>{im}</g>
 </g>;
};
export const Salps:React.FC<{x:number;y:number;w?:number;t:number;count?:number;opacity?:number}>=({x,y,w=170,t,count=4,opacity=1})=><g opacity={opacity} transform={`translate(${x} ${y})`}>
 {Array.from({length:count},(_,i)=><g key={i} transform={`translate(${i*w*.79} ${Math.sin(t*1.8+i*.7)*22}) rotate(${Math.cos(t*1.8+i*.7)*5}) scale(${(w/1774)*(1+.035*Math.sin(t*3-i*.5))} ${(w/1774)*(1-.07*Math.sin(t*3-i*.5))})`}><image href={asset('salpa.png')} width="1774" height="887"/></g>)}
 </g>;

import React,{useId} from 'react';
import {asset} from './art';
const farLeg='1080,496 1145,480 1315,325 1333,299 1402,275 1546,283 1664,250 1727,267 1758,357 1749,436 1663,449 1430,419 1331,387 1160,576 1100,568';
const nearLeg='1082,650 1127,608 1317,600 1347,565 1383,558 1438,577 1504,612 1664,661 1756,719 1761,811 1710,855 1568,838 1424,791 1360,717 1324,686 1152,745 1108,724';
const head='M95 33 H447 V324 L419 385 L365 437 L310 421 L231 402 L159 421 L119 391Z';
const farArm='286,592 338,609 323,655 256,681 199,682 173,706 123,731 85,720 31,722 14,691 25,649 81,615 168,623 218,625';
const nearArm='704,459 772,470 752,554 684,677 656,735 620,757 584,785 548,801 510,791 474,758 479,731 528,690 578,661 609,635 656,539';

/** Each leg, forearm and head has a separate pivot. The base layer excludes
 * the original limbs, preventing the duplicate-hand artifact of rigid cutouts.
 */
export const Diver:React.FC<{x:number;y:number;w?:number;t:number;angle?:number;gesture?:number;opacity?:number}>=({x,y,w=600,t,angle=0,gesture=0,opacity=1})=>{
 const id=useId().replace(/:/g,'');const im=<image href={asset('buzo-personaje-original.png')} width="1774" height="887"/>;const k=Math.sin(t*3.5);
 return <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${angle} ${w/2} ${w/4}) scale(${w/1774})`}>
 <defs>
  <clipPath id={id+'head'}><path d={head}/></clipPath>
  {[['far',farLeg],['near',nearLeg],['fa',farArm],['na',nearArm]].map(([name,poly])=><clipPath key={name} id={id+name}><polygon points={poly}/></clipPath>)}
  <mask id={id+'base'} maskUnits="userSpaceOnUse" x="0" y="0" width="1774" height="887"><rect width="1774" height="887" fill="white"/><path d={head} fill="black"/>{[farLeg,nearLeg,farArm,nearArm].map((poly,i)=><polygon key={i} points={poly} fill="black"/>)}</mask>
 </defs>
 <g transform={`rotate(${6*k} 1121 535)`}><g clipPath={`url(#${id}far)`}>{im}</g></g>
 <g mask={`url(#${id}base)`}>{im}</g>
 <ellipse cx="1118" cy="536" rx="40" ry="25" fill="#24304b"/>
 <ellipse cx="1108" cy="691" rx="31" ry="28" fill="#26314c"/>
 <g transform={`rotate(${-6*k} 1105 701)`}><g clipPath={`url(#${id}near)`}>{im}</g></g>
 <g transform={`rotate(${2.5*Math.sin(t*2)+gesture*5} 302 623)`} clipPath={`url(#${id}fa)`}>{im}</g>
 <g transform={`rotate(${-2*Math.sin(t*2.2)-gesture*8} 723 486)`} clipPath={`url(#${id}na)`}>{im}</g>
 <g transform={`rotate(${Math.sin(t*1.5)*1.2-gesture*3} 357 398)`} clipPath={`url(#${id}head)`}>{im}</g>
 {[0,1,2,3].map(i=><g key={i} transform={`translate(${185+Math.sin(t*1.8+i)*22} ${340-((t*53+i*85)%380)})`} opacity={.5*(1-((t*53+i*85)%380)/380)}><circle r={6+i*2} fill="none" stroke="#e5f0df" strokeWidth="3"/><path d={`M${-3-i} -3 L-1 -7`} stroke="#fff8da" strokeWidth="2"/></g>)}
 </g>;
};

import React,{useId} from 'react';
import {asset,lerp,p} from './art';
const body='M42 718 C74 593 286 437 516 425 Q690 409 836 480 Q889 487 901 538 Q940 554 948 601 Q984 626 980 681 Q1005 715 981 758 Q1004 803 977 843 Q996 901 960 939 Q955 984 910 1003 Q887 1040 838 1044 Q733 1105 506 1103 Q238 1096 93 904 Q49 837 42 750Z';
const dorsal='M520 435 Q591 420 608 367 Q679 179 800 47 Q848 -8 851 45 L823 427 Q819 463 851 485Z';
const anal='M480 1090 Q550 1090 594 1181 Q670 1311 704 1495 Q719 1541 728 1497 Q747 1303 749 1139 Q743 1081 794 1056Z';
const pectoral='M313 710 Q374 666 457 649 Q497 631 491 690 Q486 754 452 793 Q416 815 326 750Z';

/** The same approved PNG is clipped into independent anatomical layers.
 * Opposite shear at the dorsal/anal roots produces a controlled 2D projection
 * of their coordinated lateral stroke. The body is never warped or given a tail.
 */
export const Sunfish:React.FC<{cx:number;cy:number;h?:number;t:number;angle?:number;front?:number;roll?:number;diagram?:number;feeding?:number;stroke?:number}>=({cx,cy,h=1050,t,angle=0,front=0,roll=0,diagram=0,feeding=0,stroke=1})=>{
 const id=useId().replace(/:/g,'');const phase=t*Math.PI*1.25;const swing=Math.sin(phase)*stroke;const sx=.93+.07*Math.cos(phase);const scale=h/1536;
 const img=<image href={asset('pez-luna-perfil.png')} width="1024" height="1536"/>;
 const fimg=<image href={asset('pez-luna-frontal.png')} width="887" height="1774"/>;
 return <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
 <g opacity={1-front} transform={`scale(${scale*(1-.68*front)} ${scale}) translate(-512 -768)`}>
  <defs>
   <clipPath id={id+'body'}><path d={body}/></clipPath>
   <clipPath id={id+'d'}><path d={dorsal}/></clipPath><clipPath id={id+'a'}><path d={anal}/></clipPath><clipPath id={id+'p'}><path d={pectoral}/></clipPath>
   <mask id={id+'cut'} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><rect width="1024" height="1536" fill="white"/><path d={pectoral} fill="black"/></mask>
  </defs>
  <g transform={`translate(684 453) matrix(${sx} 0 ${.13*swing} ${1+.015*Math.cos(phase)} 0 0) translate(-684 -453)`}><g clipPath={`url(#${id}d)`} opacity={1-diagram*.58}>{img}</g>{diagram>0&&<path d={dorsal} fill="none" stroke="#fce8b8" strokeWidth="5" opacity={diagram}/>}</g>
  <g transform={`translate(632 1094) matrix(${sx} 0 ${.13*swing} ${1+.015*Math.cos(phase)} 0 0) translate(-632 -1094)`}><g clipPath={`url(#${id}a)`} opacity={1-diagram*.58}>{img}</g>{diagram>0&&<path d={anal} fill="none" stroke="#fce8b8" strokeWidth="5" opacity={diagram}/>}</g>
  <path d={body} fill="#b8b9b2"/>
  <g clipPath={`url(#${id}body)`} opacity={1-diagram*.58}><g mask={`url(#${id}cut)`}>{img}</g></g>
  <g transform={`translate(327 727) scale(${.91+.09*Math.sin(phase+.5)} 1) rotate(${4*swing}) translate(-327 -727)`}><g clipPath={`url(#${id}p)`} opacity={1-diagram*.58}>{img}</g></g>
  <ellipse cx="57" cy="741" rx={10+feeding*4} ry={3+feeding*8+Math.sin(t*2)*.7} fill="#382e2f" opacity=".64"/>
  <path d="M284 722 Q276 750 292 773" fill="none" stroke="#807e7d" strokeWidth="3" opacity={.25+.2*Math.sin(t*2)}/>
  {diagram>0&&<><path d={body} fill="#a9ced2" opacity={diagram*.1}/><path d={body} fill="none" stroke="#fce8b8" strokeWidth="5" opacity={diagram}/></>}
 </g>
 {front>0&&<g opacity={front} transform={`rotate(${roll}) scale(${h/1774}) translate(-443.5 -887)`}>
  <defs><clipPath id={id+'fd'}><path d="M350 550 Q400 445 395 246 L396 65 Q410 0 454 13 Q506 48 505 468 L540 555Z"/></clipPath><clipPath id={id+'fa'}><path d="M370 1210 H520 L500 1410 L499 1690 Q475 1790 430 1774 Q392 1740 389 1550Z"/></clipPath>
  <clipPath id={id+'fb'}><path d="M285 780 Q292 560 335 511 Q443 441 552 519 Q594 600 601 780 L607 940 Q607 1181 532 1256 Q493 1304 399 1308 Q320 1277 285 1150Z"/></clipPath>
  <clipPath id={id+'pl'}><polygon points="286,782 248,741 213,750 187,805 195,860 225,902 280,875 294,839"/></clipPath><clipPath id={id+'pr'}><polygon points="591,782 633,744 670,754 696,806 685,861 658,899 601,875 590,839"/></clipPath>
  <mask id={id+'fc'} maskUnits="userSpaceOnUse" x="0" y="0" width="887" height="1774"><rect width="887" height="1774" fill="white"/><polygon points="286,782 248,741 213,750 187,805 195,860 225,902 280,875 294,839" fill="black"/><polygon points="591,782 633,744 670,754 696,806 685,861 658,899 601,875 590,839" fill="black"/></mask></defs>
  <g transform={`rotate(${7*swing} 444 510)`} clipPath={`url(#${id}fd)`}>{fimg}</g>
  <g transform={`rotate(${7*swing} 444 1255)`} clipPath={`url(#${id}fa)`}>{fimg}</g>
  <ellipse cx="443" cy="880" rx="154" ry="385" fill="#b8b9b2"/>
  <g clipPath={`url(#${id}fb)`}><g mask={`url(#${id}fc)`}>{fimg}</g></g>
  <g transform={`rotate(${-5*swing} 286 821)`} clipPath={`url(#${id}pl)`}>{fimg}</g>
  <g transform={`rotate(${5*swing} 600 821)`} clipPath={`url(#${id}pr)`}>{fimg}</g>
 </g>}
 </g>;
};

export const ConventionalFish:React.FC<{x:number;y:number;t:number;w?:number}>=({x,y,t,w=350})=>{
 const k=Math.sin(t*5)*20;
 return <g transform={`translate(${x} ${y}) scale(${w/400})`} stroke="#243a43" strokeWidth="4" strokeLinejoin="round">
 <path d={`M296 140 Q330 ${130+k} 386 ${93+k} L372 ${160+k} L390 ${225+k} Q334 ${203+k} 296 186Z`} fill="#5b9caa"/>
 <path d={`M27 163 Q76 91 180 115 Q245 119 306 151 Q315 166 301 183 Q215 225 120 211 Q66 205 27 174Z`} fill="url(#compare-luna)"/>
 <path d="M103 119 L166 62 L214 125 M127 210 L194 242 L225 200" fill="#8cb9bd"/>
 <path d="M43 157 Q100 128 156 141" stroke="#cfe4cf" fill="none" strokeWidth="10"/>
 <path d="M122 142 Q141 169 122 195 M148 161 Q183 156 201 181 L155 186Z" fill="#3f8499"/>
 <path d="M29 166 L47 169" fill="none"/><circle cx="84" cy="157" r="11" fill="#f6ebd1"/><circle cx="82" cy="157" r="6" fill="#22323b"/>
 {[0,1,2,3].map(i=><path key={i} d={`M${168+i*24} 146 Q${181+i*24} 158 ${168+i*24} 172 Q${181+i*24} 186 ${168+i*24} 198`} fill="none" stroke="#437f91" strokeWidth="2"/>)}
 </g>;
};

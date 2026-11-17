import React,{useId} from 'react';
import {asset,p,clamp} from './art';
export type Part={id:string;d:string;cx:number;cy:number};
export const heroParts:Part[]=[
 {id:'tail',d:'M40 1100H355V1380H10Z',cx:308,cy:1230},
 {id:'leftLeg',d:'M280 1168 L490 1190 L500 1300 L442 1447 H265Z',cx:420,cy:1195},
 {id:'rightLeg',d:'M499 1190 L695 1150 V1450 H492Z',cx:565,cy:1200},
 {id:'head',d:'M30 0H800V751 Q785 801 647 826 L443 835 Q276 813 137 748 L70 700Z',cx:517,cy:810},
 {id:'sword',d:'M615 867 L720 808 L755 745 L826 734 L1008 390 L1024 410 V980 L733 1012 L641 979Z',cx:664,cy:885},
 {id:'shield',d:'M60 845 L312 818 L422 872 L420 1000 L358 1142 L278 1210 L50 1120Z',cx:363,cy:910},
];
export const hyenaParts:Part[]=[
 {id:'tail',d:'M650 1110 H1024V1380H690Z',cx:730,cy:1160},
 {id:'leftLeg',d:'M240 1055L460 1130L438 1290L370 1505H190V1320Z',cx:365,cy:1140},
 {id:'rightLeg',d:'M475 1080L695 1080L725 1260L838 1520H594L548 1300Z',cx:590,cy:1140},
 {id:'head',d:'M275 0H800V430L666 483L380 448L280 390Z',cx:515,cy:445},
 {id:'spear',d:'M30 60H200V540L267 580L328 641L300 818L180 785L180 1500H100V800L35 730Z',cx:268,cy:650},
 {id:'shield',d:'M605 565H1024V1200H560V780Z',cx:695,cy:655},
];
const mouseParts:Part[]=[{id:'tail',d:'M100 1065H405V1250H100Z',cx:375,cy:1170},{id:'leftLeg',d:'M370 1100H510V1340H330Z',cx:446,cy:1130},{id:'rightLeg',d:'M515 1100H685V1340H505Z',cx:565,cy:1130},{id:'head',d:'M100 100H780V788Q680 865 490 842L280 780Z',cx:520,cy:830},{id:'sword',d:'M630 870L700 817L800 600H920V970L660 1020Z',cx:645,cy:900},{id:'shield',d:'M140 860L400 832L468 900L415 1147H140Z',cx:420,cy:915}];
const archerParts:Part[]=[{id:'tail',d:'M30 1080H320V1380H20Z',cx:290,cy:1250},{id:'leftLeg',d:'M285 1185H500V1450H250Z',cx:410,cy:1210},{id:'rightLeg',d:'M510 1185H708V1450H480Z',cx:570,cy:1210},{id:'head',d:'M80 100H790V735Q730 815 570 834L380 823L90 740Z',cx:510,cy:810},{id:'bow',d:'M776 550H970V1320H758L795 1070L719 1048V937L790 935Z',cx:810,cy:998},{id:'draw',d:'M320 867L489 890L540 870L620 908V981L555 1040L340 1020Z',cx:376,cy:925}];
const pigParts:Part[]=[{id:'backLeg',d:'M455 851L576 860L668 1010H530L490 952Z',cx:510,cy:875},{id:'frontLeg',d:'M800 851L944 833L1010 1018H869Z',cx:873,cy:870},{id:'leftLeg',d:'M400 841L519 865L509 955L470 1024H365Z',cx:458,cy:870},{id:'rightLeg',d:'M694 870L830 875L816 1017H690Z',cx:765,cy:890},{id:'head',d:'M721 450H1210V902L986 920L844 866L767 782Z',cx:860,cy:815},{id:'rider',d:'M440 0H1060V575L862 600L746 698L559 674L471 577Z',cx:695,cy:610},{id:'tail',d:'M320 638H451V754H310Z',cx:442,cy:700}];
const familyParts:Part[]=[{id:'momHead',d:'M420 0H1060V432L1002 490L805 555L680 515L452 427Z',cx:790,cy:510},{id:'babyHead',d:'M355 444L574 438L750 565L746 703L592 789L400 758L320 650Z',cx:566,cy:741},{id:'wave',d:'M1030 738L1066 671L1136 661L1170 715L1130 788L1056 833L1001 818Z',cx:1037,cy:800}];

/** Native drawings are partitioned at authored joints. Each limb has its own
 * transform; originals stay intact. Limited angles protect silhouettes. */
const Rig:React.FC<{name:string;parts:Part[];angles:Record<string,number>;width?:number;height?:number;children?:React.ReactNode}>=({name,parts,angles,width=1024,height=1536,children})=>{
 const id=useId().replace(/:/g,'');const img=<image href={asset(name)} width={width} height={height}/>;
 return <g><defs><mask id={id+'body'} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}><rect width={width} height={height} fill="white"/>{parts.map(v=><path key={v.id} d={v.d} fill="black"/>)}</mask>{parts.map(v=><clipPath key={v.id} id={id+v.id}><path d={v.d}/></clipPath>)}</defs>
 {parts.filter(v=>v.id.includes('Leg')||v.id==='tail').map(v=><g key={v.id} transform={`rotate(${angles[v.id]||0} ${v.cx} ${v.cy})`} clipPath={`url(#${id+v.id})`}>{img}</g>)}
 <g mask={`url(#${id}body)`}>{img}</g>
 {parts.filter(v=>!v.id.includes('Leg')&&v.id!=='tail').map(v=><g key={v.id} transform={`rotate(${angles[v.id]||0} ${v.cx} ${v.cy})`} clipPath={`url(#${id+v.id})`}>{img}{v.id==='head'&&children}</g>)}
 </g>;
};
type CatProps={x:number;y:number;h:number;t:number;walk?:number;look?:number;raise?:number;fear?:number;kind?:'hero'|'mouse'|'archer';draw?:number};
export const Cat:React.FC<CatProps>=({x,y,h,t,walk=0,look=0,raise=0,fear=0,kind='hero',draw=0})=>{
 const phase=t*(kind==='mouse'?15:9),step=Math.sin(phase)*walk;const tremble=Math.sin(t*42)*fear;
 const names={hero:'gatito-caballero.png',mouse:'raton-caballero.png',archer:'gatito-arquero.png'};const parts=kind==='hero'?heroParts:kind==='mouse'?mouseParts:archerParts;
 const blink=Math.pow(Math.max(0,Math.cos((t%4.1-3.75)*Math.PI*5)),22)*(t%4.1>3.6?1:0);
 return <g transform={`translate(${x+tremble*1.6} ${y-Math.abs(step)*3}) scale(${h/1536}) translate(-512 -1450)`}>
  <Rig name={names[kind]} parts={parts} angles={{leftLeg:step*10+tremble*1.8,rightLeg:-step*10-tremble*1.8,tail:Math.sin(t*2)*4,head:look*5+Math.sin(t*1.8)*.7,sword:-raise*21+Math.sin(t*2.1)*1.6+tremble*1.7,shield:-raise*12+Math.sin(t*2)*1.3,bow:Math.sin(t*1.8)*1.3+draw*2,draw:draw*-5}}>
   {kind==='hero'&&<g>
    {blink>.12&&<g opacity={blink}><ellipse cx="440" cy="589" rx="84" ry="82" fill="#fff1e5"/><ellipse cx="639" cy="550" rx="65" ry="77" fill="#fff1e5"/><path d="M370 590Q440 615 511 581 M585 549Q643 570 697 540" stroke="#543626" strokeWidth="7" fill="none" strokeLinecap="round"/></g>}
    {fear>.05&&<g opacity={fear}><path d="M355 505Q404 489 445 468 M610 454Q650 468 677 488" stroke="#6c4931" strokeWidth="8" fill="none" strokeLinecap="round"/></g>}
   </g>}
  </Rig>
 </g>;
};
export const Hyena:React.FC<{x:number;y:number;h:number;t:number;phase?:number}>=({x,y,h,t,phase=0})=>{const step=Math.sin(t*6+phase);return <g transform={`translate(${x} ${y-Math.abs(step)*3}) scale(${h/1536}) translate(-512 -1500)`}><Rig name="hiena-hierro.png" parts={hyenaParts} angles={{leftLeg:step*8,rightLeg:-step*8,tail:Math.sin(t*2+phase)*3,head:Math.sin(t*2+phase)*1.2,spear:step*1.8,shield:-step*1.7}}/></g>;};
export const PigRider:React.FC<{x:number;y:number;w:number;t:number;trot?:number}>=({x,y,w,t,trot=1})=>{const s=Math.sin(t*12)*trot;return <g transform={`translate(${x} ${y-Math.abs(s)*6}) scale(${w/1536}) translate(-768 -1015)`}><Rig name="jinete-puerquito.png" parts={pigParts} width={1536} height={1024} angles={{leftLeg:s*10,rightLeg:-s*10,backLeg:-s*8,frontLeg:s*8,head:Math.sin(t*6)*2*trot,rider:-s*2.2,tail:Math.sin(t*5)*6}}/></g>;};
export const Family:React.FC<{t:number}>=({t})=><Rig name="familia.png" parts={familyParts} width={1536} height={1024} angles={{momHead:Math.sin(t*1.5)*1.8,babyHead:Math.sin(t*2.1)*2.6,wave:Math.sin(t*5)*10*p(t,.6)}}/>;
export const Castle:React.FC<{x:number;y:number;w:number;t:number;family?:boolean}>=({x,y,w,t,family=true})=>{const id=useId().replace(/:/g,'');return <g transform={`translate(${x-w/2} ${y-w/1.5}) scale(${w/1536})`}>
 <defs><clipPath id={id+'window'}><rect x="662" y="342" width="304" height="213" rx="3"/></clipPath><clipPath id={id+'flag'}><path d="M88 10H340V220H88Z"/></clipPath><mask id={id+'base'} maskUnits="userSpaceOnUse" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/><path d="M88 10H340V220H88Z" fill="black"/></mask></defs>
 <image href={asset('castillo-carton.png')} width="1536" height="1024" mask={`url(#${id}base)`}/>
 <g transform={`translate(309 95) skewY(${Math.sin(t*3)*3}) translate(-309 -95)`} clipPath={`url(#${id}flag)`}><image href={asset('castillo-carton.png')} width="1536" height="1024"/></g>
 {family&&<g clipPath={`url(#${id}window)`}><rect x="660" y="340" width="310" height="218" fill="#a3713f"/><g transform="translate(651 341) scale(.215)"><Family t={t}/></g></g>}
 <g opacity={.06+.04*Math.sin(t*2)} fill="#ffe9a1"><ellipse cx="274" cy="445" rx="43" ry="65"/><ellipse cx="1317" cy="455" rx="40" ry="60"/></g>
 </g>;};

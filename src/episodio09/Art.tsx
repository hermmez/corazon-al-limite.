import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const C = {ink:'#071724', navy:'#092c3d', teal:'#47e7d0', cream:'#fff0ce', orange:'#ff8a42', red:'#ff554b'};
export const clamp = (f:number, a:number,b:number,x=0,y=1) => interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
export const asset = (name:string) => staticFile(`episodio-09/${name}`);
export const Art:React.FC<{name:string; style?:React.CSSProperties}> = ({name,style}) => <Img src={asset(name)} style={{position:'absolute',objectFit:'contain',...style}}/>;

export const Stage:React.FC<{children:React.ReactNode; warm?:number}> = ({children,warm=0}) => {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:`radial-gradient(ellipse at 55% 40%, ${warm>.5?'#61392a':'#164655'} 0%, #0a2333 48%, #050f1d 100%)`,color:C.cream,fontFamily:'Arial, sans-serif',overflow:'hidden'}}>
  <Img src={asset('vivienda-mexicana.png')} style={{position:'absolute',width:1250,height:2222,left:-85+Math.sin(f*.003)*18,top:-180,objectFit:'cover',opacity:.065}}/>
   <svg width="1080" height="1920" style={{position:'absolute',opacity:.18}}>
    <defs><linearGradient id="trace"><stop stopColor="#72fae3"/><stop offset="1" stopColor="#ffba76"/></linearGradient></defs>
    {[0,1,2,3,4].map(i=><path key={i} d={`M${-140+i*33} 0 V${270+i*110} Q${-140+i*33} ${350+i*110} ${80+i*30} ${350+i*110} H${960-i*16} Q${1040-i*16} ${350+i*110} ${1040-i*16} ${440+i*110} V1920`} stroke="url(#trace)" strokeWidth={2} fill="none"/>)}
   </svg>
   {Array.from({length:30},(_,i)=><div key={i} style={{position:'absolute',left:(i*137.1)%1080,top:((i*271.8-f*(.12+i%3*.04))+2200)%2100,width:2+i%3,height:2+i%3,borderRadius:'50%',background:i%3?C.teal:C.orange,opacity:.1+.15*(1+Math.sin(f*.03+i))/2}}/>)}
   {children}
   <AbsoluteFill style={{pointerEvents:'none',boxShadow:'inset 0 0 150px 20px #020b1560'}}/>
 </AbsoluteFill>;
};

export const Label:React.FC<{children:React.ReactNode; x?:number;y:number;size?:number;color?:string;w?:number;align?:'left'|'center'}> = ({children,x=70,y,size=43,color=C.cream,w=940,align='center'}) => <div style={{position:'absolute',left:x,top:y,width:w,textAlign:align,fontSize:size,fontWeight:800,lineHeight:1.16,letterSpacing:size>38?1:0,color,textShadow:'0 3px 16px #02101b',whiteSpace:'pre-line'}}>{children}</div>;

export const Host:React.FC<{pose?:string;x?:number;y?:number;h?:number;flip?:boolean}> = ({pose='02_explicando',x=40,y=980,h=650,flip=false}) => {
 const f=useCurrentFrame();
 return <Img src={staticFile(`imagenes/personajes/${pose}.png`)} style={{position:'absolute',left:x,top:y,width:h*2/3,height:h,objectFit:'contain',transform:`translateY(${Math.sin(f*.055)*4}px) rotate(${Math.sin(f*.025)*.5}deg) scaleX(${flip?-1:1})`,transformOrigin:'50% 100%'}}/>;
};

// Una sola geometría registrada para la carcasa, el corte y el elemento animado.
export const Fuse:React.FC<{x?:number;y?:number;w?:number;angle?:number;reveal?:number;heat?:number;broken?:boolean;flow?:boolean;burstFrame?:number}> = ({x=40,y=660,w=1000,angle=0,reveal=0,heat=0,broken=false,flow=true,burstFrame=-100}) => {
 const f=useCurrentFrame();
 const h=w*.36;
 const col=heat>.75?'#fff5bb':heat>.3?C.orange:C.teal;
 return <div style={{position:'absolute',left:x,top:y,width:w,height:h,transform:`rotate(${angle}deg)`,transformOrigin:'50% 50%',filter:'drop-shadow(0 22px 25px #0008)'}}>
  <Art name="fusible-corte.svg" style={{width:w,height:h}}/>
  <svg viewBox="0 0 1000 360" width={w} height={h} style={{position:'absolute',overflow:'visible'}}>
   <defs><linearGradient id="link" x2="0" y2="1"><stop stopColor="#fff9db"/><stop offset=".5" stopColor={heat>.2?C.orange:'#c0b5a0'}/><stop offset="1" stopColor="#8b6046"/></linearGradient><radialGradient id="thermal"><stop stopColor={col} stopOpacity=".65"/><stop offset="1" stopColor={col} stopOpacity="0"/></radialGradient></defs>
   <ellipse cx="500" cy="180" rx={180+heat*120} ry={30+heat*70} fill="url(#thermal)" opacity={reveal*heat}/>
   <path d={broken?'M221 168H405L451 177L468 180L447 188H405L391 192H221Z M779 168H595L553 176L538 180L557 188H595L610 192H779Z':'M221 168H405L441 177H559L595 168H782V192H595L559 183H441L405 192H221Z'} fill="url(#link)" stroke={heat>.65?'#ffd99c':'#76563c'} strokeWidth="2"/>
   <path d={broken?'M224 171H402L451 179M550 179L597 171H779':'M224 171H402L442 179H559L597 171H779'} fill="none" stroke="#fff5c3" strokeWidth="2"/>
   {flow&&!broken&&Array.from({length:18},(_,i)=>{
    // Movimiento alternante conceptual para corriente doméstica de CA.
    const px=140+((i*41+Math.sin(f*.043)*97+720)%720);
    return <g key={i} opacity={reveal*.9}><ellipse cx={px} cy="180" rx="13" ry="5" fill={col} opacity=".18"/><circle cx={px} cy="180" r="3.6" fill="#fff6c6"/></g>;
   })}
   {burstFrame>=0&&burstFrame<18&&Array.from({length:15},(_,i)=>{
    const a=i*2.4;const d=burstFrame*(1.8+i%3);
    return <path key={i} d={`M${500+Math.cos(a)*d} ${180+Math.sin(a)*d*.55}l${Math.cos(a)*9} ${Math.sin(a)*6}`} stroke={i%2?'#ffe3a4':C.orange} strokeWidth="3" opacity={1-burstFrame/18}/>;
   })}
  </svg>
  <Art name="fusible-carcasa.svg" style={{width:w,height:h,opacity:1-reveal,transform:`translateY(${-reveal*120}px)`}}/>
  <Art name="fusible-terminales.svg" style={{width:w,height:h}}/>
 </div>;
};

export const Cable:React.FC<{heat?:number;x?:number;y?:number;w?:number;angle?:number}> = ({heat=0,x=-10,y=950,w=1100,angle=-10}) => {
 const f=useCurrentFrame();
 return <div style={{position:'absolute',left:x,top:y,width:w,height:w*350/1100,transform:`rotate(${angle}deg)`}}>
 <Art name="conductor-corte.svg" style={{width:'100%',height:'100%'}}/>
 <svg viewBox="0 0 1100 350" style={{position:'absolute',width:'100%',height:'100%',overflow:'visible'}}>
  <path d="M45 179Q380 130 730 177" fill="none" stroke={C.orange} strokeWidth="75" opacity={heat*(.25+.09*Math.sin(f*.15))} style={{filter:'blur(16px)'}}/>
  {heat>.1&&[0,1,2,3,4].map(i=><path key={i} d={`M${200+i*120} ${100-((f*1.2+i*15)%90)}q-14 -20 0 -40t0 -40`} fill="none" stroke="#ffbc73" strokeWidth="4" opacity={heat*.35*(1-((f*1.2+i*15)%90)/90)}/>)}
 </svg></div>;
};

const route=[[140,530],[920,530],[920,1250],[140,1250],[140,530]];
const lengths=route.slice(1).map((p,i)=>Math.hypot(p[0]-route[i][0],p[1]-route[i][1]));
const total=lengths.reduce((a,b)=>a+b,0);
const point=(value:number)=>{let d=((value%1+1)%1)*total; for(let i=0;i<lengths.length;i++){if(d<=lengths[i])return [route[i][0]+(route[i+1][0]-route[i][0])*d/lengths[i],route[i][1]+(route[i+1][1]-route[i][1])*d/lengths[i]];d-=lengths[i];}return route[0];};
export const Circuit:React.FC<{overload?:number;short?:boolean;open?:boolean;dim?:boolean}> = ({overload=0,short=false,open=false,dim=false}) => {
 const f=useCurrentFrame();
 return <div style={{position:'absolute',inset:0,opacity:dim?.4:1}}>
  <svg width="1080" height="1920" style={{position:'absolute'}}>
   <path d="M140 530H920V1250H140Z" fill="none" stroke="#020d17" strokeWidth="45" strokeLinejoin="round"/>
   <path d="M140 530H920V1250H140Z" fill="none" stroke={overload>.5?'#6d332b':'#294e5c'} strokeWidth="30" strokeLinejoin="round"/>
   <path d="M140 521H911V1241H148" fill="none" stroke="#a1b9b0" opacity=".25" strokeWidth="5"/>
   {overload>.4&&[500,710].map(x=><g key={x}><path d={`M${x} 530V1250`} fill="none" stroke="#071823" strokeWidth="30"/><path d={`M${x-4} 530V1250`} fill="none" stroke="#6d4a36" strokeWidth="19"/><circle cx={x} cy="530" r="14" fill={C.orange}/><circle cx={x} cy="1250" r="14" fill={C.orange}/></g>)}
   <circle cx="140" cy="865" r="70" fill="#0a2534" stroke="#a4c8bd" strokeWidth="5"/>
   <path d="M91 864q24-56 49 0t49 0" fill="none" stroke={C.teal} strokeWidth="5"/>
   {short&&<><path d="M790 532Q755 880 795 1250" stroke="#11212b" fill="none" strokeWidth="32"/><path d="M790 532Q755 880 795 1250" stroke="#ff8a42" fill="none" strokeWidth="14"/><path d="M780 870l32 24 -40 28 38 24" fill="none" stroke="#ffefbb" strokeWidth="6"/></>}
   {!open&&Array.from({length:overload>.4?52:26},(_,i)=>{const [x,y]=point(i/(overload>.4?52:26)+Math.sin(f*.04)*.05);return <g key={i}><circle cx={x} cy={y} r={overload>.5?12:9} fill={overload>.5?C.orange:C.teal} opacity=".14"/><circle cx={x} cy={y} r="3.8" fill={overload>.5?'#ffe7a7':'#baffef'}/></g>;})}
   {open&&<path d="M180 530H360" stroke="#061b2a" strokeWidth="44"/>}
  </svg>
  <Fuse x={45} y={449} w={450} reveal={open?1:0} broken={open} flow={!open}/>
  <Art name="lampara.svg" style={{left:820,top:760,width:200,height:420,filter:open?'brightness(.6)':'drop-shadow(0 0 40px #ffd98955)'}}/>
  {overload>.4&&<><Art name="lampara.svg" style={{left:400,top:760,width:200,height:420}}/><Art name="lampara.svg" style={{left:610,top:760,width:200,height:420}}/></>}
  <Art name="interruptor-cuchillas.svg" style={{left:35,top:1400,width:170,height:278}}/>
 </div>;
};

export const Breaker:React.FC<{x?:number;y?:number;w?:number;trip?:number}> = ({x=570,y=450,w=430,trip=0}) => <div style={{position:'absolute',left:x,top:y,width:w,height:w*900/550}}>
 <Art name="termomagnetico-cuerpo.svg" style={{width:'100%',height:'100%'}}/>
 <Art name="termomagnetico-palanca.svg" style={{width:'100%',height:'100%',transform:`translateY(${trip*55*w/550}px) rotate(${trip*5}deg)`,transformOrigin:'50% 40%'}}/>
</div>;

export const Warning:React.FC<{x:number;y:number;size?:number}> = ({x,y,size=160}) => <svg viewBox="0 0 180 170" style={{position:'absolute',left:x,top:y,width:size,height:size}}><path d="M80 17Q90 1 101 17L171 141Q181 160 159 161H21Q0 161 11 141Z" fill="#ffba55" stroke="#121f2d" strokeWidth="9"/><path d="M29 138L87 31" stroke="#fff1b5" strokeWidth="4"/><path d="M82 55H101L97 112H86Z" fill="#4c2527"/><circle cx="92" cy="133" r="10" fill="#4c2527"/></svg>;

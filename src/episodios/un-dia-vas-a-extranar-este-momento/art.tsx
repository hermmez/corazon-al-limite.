import React, {useId} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';

export const EP = 'episodios/un-dia-vas-a-extranar-este-momento/';
export const asset = (name: string) => staticFile(EP + name);
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (t: number, a: number, b: number) => {
  const p = clamp((t - a) / (b - a)); return p * p * (3 - 2 * p);
};
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const Room: React.FC<{kind?: 'office' | 'kitchen' | 'living'; night?: number; pan?: number}> = ({kind = 'living', night = 0, pan = 0}) => <AbsoluteFill>
  <Img src={kind === 'office' ? asset('oficina.png') : staticFile(`imagenes/escenarios/${kind === 'kitchen' ? '02_cocina' : '03_sala'}.png`)} style={{position:'absolute',width:1120,height:1992,left:-20 + pan,top:-36,objectFit:'cover'}} />
  <AbsoluteFill style={{background:`linear-gradient(115deg,rgba(255,199,111,${0.12 * (1-night)}),transparent 58%,rgba(30,18,22,.18))`}} />
  <AbsoluteFill style={{background:'#0e2242',opacity:night * 0.6,mixBlendMode:'multiply'}} />
</AbsoluteFill>;

// A motivated close view of the clear desktop in the new office illustration.
// The phone rests on wood from frame zero, rather than floating in the room.
export const DeskCloseup: React.FC = () => <AbsoluteFill style={{overflow:'hidden',background:'#b2733d'}}><Img src={asset('oficina.png')} style={{position:'absolute',width:4500,height:8000,left:-2200,top:-5500,objectFit:'fill'}}/><AbsoluteFill style={{background:'linear-gradient(120deg,#d9a26633,transparent 55%,#46302544)'}}/></AbsoluteFill>;

type Who = 'young' | 'mother' | 'father';
type ActorProps = {who?: Who; x: number; y: number; width: number; t: number; mood?: 'neutral'|'happy'|'worried'|'tired'; nod?: number; arm?: number; phase?: number; opacity?: number};

// The approved PNGs remain untouched. SVG masks separate the head and arms at
// their anatomical joints; each part has its own pivot and secondary motion.
export const Actor: React.FC<ActorProps> = ({who='young',x,y,width,t,mood='neutral',nod=0,arm=0,phase=0,opacity=1}) => {
  const id = useId().replace(/:/g,'');
  const young = who === 'young';
  const src = young ? staticFile(`imagenes/personajes/${mood==='worried'?'12_preocupado':mood==='tired'?'05_cansado':mood==='happy'?'13_feliz':'01_neutral'}.png`) : asset('padres.png');
  const box = young ? '220 0 600 1536' : who==='mother' ? '215 0 450 1024' : '825 0 495 1024';
  const head = young ? {x:330,y:0,w:330,h:342,cx:510,cy:330} : who==='mother' ? {x:300,y:30,w:250,h:265,cx:442,cy:290} : {x:960,y:0,w:200,h:224,cx:1060,cy:220};
  const left = young ? '342,363 393,365 369,552 367,700 332,815 335,899 321,959 294,969 232,943 240,817 251,714 256,625 272,552 262,531 290,425' : who==='mother' ? '350,278 379,290 341,459 329,513 311,551 323,623 300,672 266,652 264,603 278,529 273,494 290,407 307,325' : '942,225 969,252 945,389 928,469 914,522 923,606 909,652 870,643 859,609 871,510 867,469 873,397 898,281';
  const right = young ? '620,365 675,381 725,467 755,537 742,554 765,642 776,753 782,831 791,889 768,943 733,967 698,937 710,889 699,827 728,797 708,714 680,643 654,559 647,476' : who==='mother' ? '505,278 529,283 565,355 583,437 595,477 588,517 608,611 601,655 577,671 555,635 560,590 547,533 539,516 529,451 511,384' : '1138,226 1180,244 1209,324 1233,411 1241,453 1235,478 1242,543 1249,608 1235,649 1208,661 1189,632 1194,581 1183,521 1181,473 1169,438 1154,372';
  const breath = Math.sin(t*2.15+phase) * 1.7;
  const tilt = nod + Math.sin(t*1.3+phase)*1.1;
  const blinkPhase = (t + phase*0.7) % 3.7;
  const blink = blinkPhase>3.48 ? Math.sin((blinkPhase-3.48)/0.22*Math.PI) : 0;
  const dims = young ? {w:1024,h:1536} : {w:1536,h:1024};
  const img = <image href={src} width={dims.w} height={dims.h} />;
  const eyes = young ? [{x:453,y:191,rx:25,ry:29},{x:535,y:190,rx:25,ry:29}] : who==='mother' ? [{x:423,y:169,rx:16,ry:19},{x:476,y:164,rx:15,ry:18}] : [{x:1017,y:111,rx:16,ry:20},{x:1068,y:107,rx:17,ry:20}];
  return <svg viewBox={box} style={{position:'absolute',left:x,top:y,width,height:width*(young?1536/600:1024/(who==='mother'?450:495)),overflow:'hidden',opacity}}>
    <defs>
      <clipPath id={`${id}head`}><rect x={head.x} y={head.y} width={head.w} height={head.h}/></clipPath>
      <clipPath id={`${id}left`}><polygon points={left}/></clipPath>
      <clipPath id={`${id}right`}><polygon points={right}/></clipPath>
      <mask id={`${id}body`} maskUnits="userSpaceOnUse" x="0" y="0" width={dims.w} height={dims.h}><rect width={dims.w} height={dims.h} fill="white"/><rect x={head.x} y={head.y} width={head.w} height={head.h} fill="black"/><polygon points={left} fill="black"/><polygon points={right} fill="black"/></mask>
    </defs>
    <g transform={`translate(0 ${breath*.25})`}><g mask={`url(#${id}body)`}>{img}</g></g>
    <g transform={`rotate(${arm+Math.sin(t*1.7+phase)*0.7} ${young?344:who==='mother'?355:941} ${young?390:who==='mother'?310:260})`} clipPath={`url(#${id}left)`}>{img}</g>
    <g transform={`rotate(${-arm*.45+Math.sin(t*1.5+phase+1)*0.65} ${young?669:who==='mother'?519:1168} ${young?390:who==='mother'?310:260})`} clipPath={`url(#${id}right)`}>{img}</g>
    <g transform={`translate(0 ${breath}) rotate(${tilt} ${head.cx} ${head.cy})`}>
      <g clipPath={`url(#${id}head)`}>{img}</g>
      {blink>.05 && mood==='neutral' && eyes.map((e,i)=><g key={i} opacity={clamp((blink-.1)*2)}><ellipse cx={e.x} cy={e.y} rx={e.rx+2} ry={e.ry+2} fill="#f8b27c"/><path d={`M ${e.x-e.rx} ${e.y} Q ${e.x} ${e.y+12} ${e.x+e.rx} ${e.y-1}`} fill="none" stroke="#3b2725" strokeWidth="3.5" strokeLinecap="round"/></g>)}
    </g>
  </svg>;
};

export const Interaction: React.FC<{kind:'young-call'|'mother-call'|'hug'|'friends'; x:number;y:number;width:number;t:number}> = ({kind,x,y,width,t}) => {
  const id=useId().replace(/:/g,'');
  const box = kind==='young-call' ? [150,0,450,512] : kind==='mother-call' ? [910,0,430,512] : kind==='hug' ? [125,512,475,512] : [700,512,836,512];
  const regions = kind==='young-call' ? [{x:245,y:0,w:220,h:267,cx:365,cy:260}] : kind==='mother-call' ? [{x:970,y:0,w:250,h:270,cx:1110,cy:265}] : kind==='hug' ? [{x:165,y:515,w:198,h:210,cx:285,cy:715},{x:343,y:557,w:155,h:205,cx:413,cy:750}] : [{x:780,y:540,w:230,h:234,cx:900,cy:770},{x:1090,y:541,w:190,h:229,cx:1180,cy:760},{x:1285,y:590,w:230,h:225,cx:1380,cy:810}];
  const img=<image href={asset('interacciones.png')} width="1536" height="1024"/>;
  return <svg viewBox={box.join(' ')} style={{position:'absolute',left:x,top:y,width,height:width*box[3]/box[2],overflow:'hidden'}}>
    <defs><mask id={`${id}base`} maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/>{regions.map((r,i)=><rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="black"/>)}</mask>{regions.map((r,i)=><clipPath key={i} id={`${id}h${i}`}><rect x={r.x} y={r.y} width={r.w} height={r.h}/></clipPath>)}</defs>
    <g transform={`translate(0 ${Math.sin(t*2)*.8})`}><g mask={`url(#${id}base)`}>{img}</g></g>
    {regions.map((r,i)=><g key={i} transform={`rotate(${Math.sin(t*1.65+i)*.65} ${r.cx} ${r.cy}) translate(0 ${Math.sin(t*2+i)*.65})`} clipPath={`url(#${id}h${i})`}>{img}</g>)}
  </svg>;
};

export const Chair: React.FC<{x:number;y:number;opacity?:number}> = ({x,y,opacity=1}) => <svg width="240" height="500" viewBox="0 0 240 500" style={{position:'absolute',left:x,top:y,opacity}}><defs><linearGradient id={`chair${x}`}><stop stopColor="#bc753c"/><stop offset="1" stopColor="#754524"/></linearGradient></defs><path d="M28 490 L35 32 Q36 10 54 14 L199 14 Q218 15 218 39 L224 490 M40 290 L211 290 M57 70 L194 70 L195 263 L55 263 Z" stroke="#513220" strokeWidth="10" fill={`url(#chair${x})`}/><path d="M54 292 L201 292 L218 335 L35 335 Z" fill="#16818b" stroke="#513220" strokeWidth="8"/></svg>;

export const Table: React.FC<{t:number}> = ({t}) => <svg width="1080" height="850" viewBox="0 0 1080 850" style={{position:'absolute',left:0,top:1040}}>
  <defs><linearGradient id="tablewood" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d39552"/><stop offset="1" stopColor="#9d5a2b"/></linearGradient><radialGradient id="plate"><stop stopColor="#f9e9d4"/><stop offset=".85" stopColor="#f4ddbc"/><stop offset="1" stopColor="#c69d73"/></radialGradient></defs>
  <path d="M80 195 L115 810 M970 195 L943 810" stroke="#75411f" strokeWidth="44"/>
  <ellipse cx="540" cy="188" rx="580" ry="207" fill="#7f4725" stroke="#472a1d" strokeWidth="5"/>
  <ellipse cx="540" cy="165" rx="580" ry="204" fill="url(#tablewood)" stroke="#714522" strokeWidth="5"/>
  {[30,75,125,180,235,285].map((v,i)=><path key={v} d={`M -20 ${v} Q 440 ${v+Math.sin(i)*18} 1100 ${v-10}`} stroke="#97582e" strokeWidth="2" opacity=".32" fill="none"/>)}
  <path d="M350 -10 L721 -10 L842 346 L240 346 Z" fill="#e8cfa9" opacity=".72"/>
  {[{x:215,y:107},{x:540,y:48},{x:860,y:121}].map(({x,y})=><g key={x} transform={`translate(${x} ${y})`}><ellipse rx="86" ry="36" fill="url(#plate)" stroke="#b8a084" strokeWidth="3"/><ellipse rx="55" ry="21" fill="#e0a65b"/><path d="M-29 -5 Q0 -25 27 -6 Q42 13 4 18 Q-33 16 -29 -5" fill="#ae592f"/><path d="M22 -10 Q51 -20 49 2 Q42 21 21 8" fill="#68894a"/><path d="M-110 -16 L-110 24 M-116 -16 L-116 -2 Q-110 5 -104 -2 L-104 -16" stroke="#d9d5c9" strokeWidth="4" fill="none"/></g>)}
  <g transform="translate(539 195)"><ellipse rx="100" ry="35" fill="#d6b388"/><ellipse cy="-8" rx="94" ry="35" fill="#f0dfc9" stroke="#b69268" strokeWidth="3"/><path d="M-62 -13 Q-40 -45 -15 -14 Q10 -43 33 -15 Q58 -41 67 -5 L-60 3 Z" fill="#8b9c50"/><path d="M-43 -12 Q-30 -28 -15 -13 M22 -11 Q35 -27 48 -10" stroke="#d17e3e" strokeWidth="7" fill="none"/></g>
  {[335,751].map((x,i)=><g key={x} transform={`translate(${x} ${116+i*16})`}><path d="M-22 -53 L22 -53 L17 9 Q0 20 -17 9 Z" fill="#e3eddf" fillOpacity=".45" stroke="#e9ddc6" strokeWidth="3"/><path d="M-18 -24 L18 -24 L15 7 Q0 15 -15 7 Z" fill="#e6ac68" opacity=".65"/></g>)}
  {[0,1].map(i=><path key={i} d={`M ${500+i*40} 135 q -12 -18 0 -32 q 13 -17 1 -32`} fill="none" stroke="#fff1d6" strokeWidth="4" opacity={.18+.08*Math.sin(t*2+i)} transform={`translate(0 ${-4*Math.sin(t*1.5+i)})`}/>)}
</svg>;

export const Family: React.FC<{t:number;empty?:number;worried?:boolean}> = ({t,empty=0,worried=false}) => <AbsoluteFill style={{overflow:'hidden'}}>
  <Room kind="kitchen" pan={Math.sin(t*.25)*7}/>
  <div style={{position:'absolute',inset:0,background:'#e5b272',opacity:.1}}/>
  <Chair x={65} y={800}/><Chair x={433} y={800}/><Chair x={799} y={800}/>
  <AbsoluteFill style={{clipPath:'inset(0 0 45% 0)'}}>
    <Actor who="mother" x={2} y={608} width={360} t={t} phase={1.4} nod={4*Math.sin(t*1.3+.7)} arm={Math.sin(t*1.2)*5} opacity={1-empty}/>
    <Actor x={323} y={540} width={430} t={t} mood={worried?'worried':'neutral'} nod={Math.sin(t*1.8)*4.5} arm={Math.sin(t*1.1)*5}/>
    <Actor who="father" x={760} y={594} width={365} t={t} phase={2.4} nod={Math.sin(t*1.5+2)*3.4} arm={Math.sin(t*1.4)*6} opacity={1-empty}/>
  </AbsoluteFill>
  <Table t={t}/>
  <AbsoluteFill style={{background:`linear-gradient(180deg,transparent 55%,rgba(40,21,15,.3)),rgba(93,73,74,${empty*.15})`}}/>
</AbsoluteFill>;

export const FamilyPhoto: React.FC<{t:number;style?:React.CSSProperties}> = ({t,style}) => {
  const w=typeof style?.width==='number'?style.width:440;
  const padding=typeof style?.padding==='number'?style.padding:15;
  const scale=(w-padding*2)/1080;
  return <div style={{position:'absolute',width:440,height:372,padding:15,paddingBottom:43,boxSizing:'border-box',background:'#f7ead3',boxShadow:'8px 18px 30px #38251966',rotate:'-7deg',...style}}><div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',background:'#bd956c'}}><div style={{position:'absolute',width:1080,height:1920,transformOrigin:'top left',transform:`translateY(${-290*scale}px) scale(${scale})`}}><Family t={t}/></div></div></div>;
};

export const Phone: React.FC<{t:number;mode?:'ring'|'missed'|'calling'|'connected';style?:React.CSSProperties}> = ({t,mode='ring',style}) => {
  const vibration=mode==='ring'?Math.sin(t*70)*2.5*(Math.sin(t*8)>.1?1:.2):0;
  return <div style={{position:'absolute',width:310,height:602,borderRadius:47,padding:12,background:'linear-gradient(110deg,#797d7b,#151b21 16%,#454c51 85%,#92918a)',boxShadow:'10px 19px 24px #35201677',rotate:`${vibration}deg`,...style}}>
    <div style={{position:'relative',height:'100%',borderRadius:37,overflow:'hidden',border:'3px solid #101921',background:'linear-gradient(155deg,#264d54,#172d38 70%,#3c554b)',color:'#f9efd9',fontFamily:'Arial,sans-serif',textAlign:'center'}}>
      <div style={{width:95,height:22,borderRadius:'0 0 16px 16px',background:'#0d171e',margin:'0 auto'}}/>
      <div style={{marginTop:49,fontSize:17,letterSpacing:1,color:'#bfd2ca'}}>{mode==='ring'?'Llamada entrante':mode==='missed'?'Llamada perdida':mode==='calling'?'Llamando…':'En llamada'}</div>
      <div style={{marginTop:17,fontSize:39,fontWeight:600}}>Mamá</div>
      <svg viewBox="300 30 250 250" width="136" height="136" style={{marginTop:27,borderRadius:'50%',background:'#b48b61'}}><image href={asset('padres.png')} width="1536" height="1024"/></svg>
      <div style={{marginTop:25,fontSize:18,color:'#d7ddd0'}}>{mode==='missed'?'Hoy · hace un momento':mode==='connected'?'00:12':'móvil'}</div>
      <div style={{position:'absolute',bottom:70,left:27,right:27,display:'flex',justifyContent:mode==='ring'?'space-between':'center'}}>{(mode==='ring'?['#c26c58','#7caa87']:[mode==='missed'?'#7caa87':'#bb695b']).map((color,i)=><div key={i} style={{width:68,height:68,background:color,borderRadius:'50%',display:'grid',placeItems:'center',boxShadow:'inset 0 0 10px #fff2'}}><svg width="34" height="34" viewBox="0 0 40 40" style={{rotate:i===0&&mode==='ring'?'135deg':'0deg'}}><path d="M10 5 L17 13 L12 18 Q17 27 24 28 L29 23 L36 30 Q35 38 28 36 Q8 32 4 14 Q2 8 10 5" fill="#fff5e5"/></svg></div>)}</div>
      <div style={{position:'absolute',bottom:17,left:96,width:90,height:4,borderRadius:4,background:'#dfdfcc'}}/>
    </div>
  </div>;
};

export const ReachHand: React.FC<{progress:number;x?:number;y?:number;width?:number}> = ({progress,x=650,y=910,width=315}) => {
 const id=useId().replace(/:/g,'');
 return <svg viewBox="225 500 150 475" style={{position:'absolute',width,height:width*475/150,left:x+width*.15+mix(600,0,progress),top:y-width*.25+mix(100,0,progress),rotate:'154deg',transformOrigin:'50% 50%',opacity:ease(progress,0,.2),overflow:'hidden'}}><defs><clipPath id={id}><polygon points="270,530 367,560 364,620 350,690 330,763 313,809 330,854 335,884 328,914 315,931 314,944 302,965 282,963 255,944 238,925 235,895 240,850 244,816 249,762 254,708 257,643 267,581"/></clipPath></defs><image href={staticFile('imagenes/personajes/01_neutral.png')} width="1024" height="1536" clipPath={`url(#${id})`}/></svg>;
};

export const CinematicFinish: React.FC = () => <AbsoluteFill style={{pointerEvents:'none',boxShadow:'inset 0 0 160px 22px rgba(38,19,17,.23)',background:'linear-gradient(180deg,rgba(53,29,22,.06),transparent 30%,transparent 70%,rgba(36,24,25,.16))'}}/>;

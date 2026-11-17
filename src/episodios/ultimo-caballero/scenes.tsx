import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Landscape,Reveal,Card,Text,Dust,WarBanner,p,lerp,asset} from './art';
import {Cat,Castle,Hyena,PigRider} from './rigs';
import {Army} from './army';
import {cues} from './cues';
const useT=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig();return f/fps;};

export const EnemyHook=()=>{const t=useT();const reveal=p(t,4.1,.55);return <Canvas><Landscape t={t} dark={.12}/><Army t={t} pan={t*14} far={t>4.1}/><WarBanner x={90-t*10} y={430} t={t} scale={.7}/><WarBanner x={930-t*15} y={540} t={t+.6} scale={.55}/>
 {t<4.5&&<g opacity={1-p(t,4.1,.4)}><Hyena x={100-t*9} y={1610} h={700} t={t}/><Hyena x={540-t*12} y={1660} h={780} t={t} phase={2}/><Hyena x={1030-t*12} y={1600} h={680} t={t} phase={4}/></g>}
 <Dust t={t} amount={t<4.1?1:.3}/>
 <Reveal t={t} at={4.1} kind="iris"><path d="M0 1470Q400 1330 1080 1460V1920H0Z" fill="#b68649"/><Castle x={230} y={1350} w={430} t={t}/><Cat x={620} y={1530} h={370} t={t} raise={p(t,6.4,.7)} look={-p(t,5.3,.7)} fear={.25}/><Hyena x={1020} y={1490} h={650} t={t}/></Reveal>
 {t>1&&t<4&&<g opacity={p(t,1,.2)*(1-p(t,3.5,.3))}><Text x={520} y={390} size={67}>10.000 HIENAS</Text></g>}
 </Canvas>;};

export const CardboardCastle=()=>{const t=useT();const wide=p(t,4.25,.65);return <Canvas><Landscape t={t} pan={t*8}/><Castle x={lerp(1000,680,wide)} y={lerp(1360,1330,wide)} w={lerp(570,1130,wide)} t={t} family={false}/><Cat x={lerp(430,255,wide)} y={lerp(1600,1510,wide)} h={lerp(1510,690,wide)} t={t} look={p(t,5.7,.8)} raise={p(t,2.4,.5)*.35} fear={.08}/>
 {t>1.8&&t<4.7&&<g opacity={p(t,1.8,.25)*(1-p(t,4.3,.3))}><path d="M750 890Q865 790 895 730" fill="none" stroke="#fff0d0" strokeWidth="5"/><Text x={825} y={690} size={36}>Todo de cartón</Text></g>}
 <Dust t={t} amount={.12} y={1450}/>
 </Canvas>;};

export const FamilyReason=()=>{const t=useT();const reaction=p(t,5.35,.4);return <Canvas><Landscape t={t}/><Castle x={lerp(490,760,reaction)} y={lerp(1870,1200,reaction)} w={lerp(2250,860,reaction)} t={t+1}/>
 <Reveal t={t} at={5.35} kind="up"><Cat x={355} y={1550} h={1070} t={t} look={p(t,5.7,.8)} fear={.3} raise={p(t,8,.6)*.35}/></Reveal>
 <g opacity={(1-reaction)*.18}><rect x="0" y="0" width="1080" height="340" fill="#583e36"/><rect x="0" y="1320" width="1080" height="600" fill="#583e36"/></g>
 </Canvas>;};

export const Decision=()=>{const t=useT();const fear=(1-p(t,7.2,.7))*.8;const shot=t<2.25?0:t<5.35?1:2;return <Canvas><Landscape t={t} dark={.08}/>{shot===2&&<><Army t={t+28} far opacity={.75}/><Castle x={190} y={1220} w={460} t={t+28}/></>}
 {shot===0?<Cat x={515} y={1300} h={2200} t={t+28} fear={.9}/>:shot===1?<Cat x={480} y={2130} h={2050} t={t+28} fear={fear} look={Math.sin((t-2.25)*1.3)*.6}/>:<Cat x={590} y={1530} h={1120} t={t+28} fear={fear} look={1-p(t,6.5,.8)} raise={p(t,7.7,.75)}/>}
 {shot===0&&<g opacity={.55}><path d="M270 1240l-12 34m440-34l12 34" stroke="#f7ddb0" strokeWidth="7" strokeLinecap="round"/></g>}
 <Dust t={t} amount={.1}/></Canvas>;};

export const MouseReinforcements=()=>{const t=useT();const start=cues.mouse-38;const arrived=p(t,start,1);return <Canvas><Landscape t={t+38}/><Castle x={920} y={1240} w={550} t={t+38}/><Cat x={740} y={1510} h={980} t={t+38} look={-p(t,start+.7,.7)} raise={.3}/>
 <Card t={t} at={cues.like-38} line1="1 LIKE = 1 RATONCITO" line2="CABALLERO" fiction/>
 {Array.from({length:6},(_,i)=>{const at=start+i*.46;const v=p(t,at,.95);return t>=at?<Cat key={i} kind="mouse" x={lerp(-180,290+(i%3)*125,v)} y={1435+Math.floor(i/3)*85} h={365} t={t+38+i*.2} walk={1-p(t,at+.75,.3)} raise={p(t,at+1,.4)*.6}/>:null;})}
 <g opacity={(1-arrived)*p(t,cues.like-38,.2)}><path d="M198 1050C165 1010 117 1020 120 1061C123 1091 180 1131 198 1144C221 1125 274 1088 276 1058C278 1016 227 1015 198 1050Z" fill="#c2554d" stroke="#763b35" strokeWidth="4"/></g>
 </Canvas>;};

export const ArcherReinforcements=()=>{const t=useT();const at=cues.comment-47;const step=p(t,at+.45,1.1);return <Canvas><Landscape t={t+47}/><Castle x={590} y={1220} w={1120} t={t+47}/>
 {[0,1,2].map(i=>t>3.7+i*.6?<g key={i} opacity={p(t,3.7+i*.6,.33)}><Cat kind="archer" x={240+i*245} y={880+(i%2)*70} h={310} t={t+i+47} draw={p(t,cues.bow-47,.9)}/></g>:null)}
 <Cat x={790} y={1550} h={850} t={t+47} look={-1} raise={.2}/>
 <Reveal t={t} at={at+.3} kind="up"><Cat kind="archer" x={lerp(180,410,step)} y={1510} h={820} t={t+47} walk={1-p(t,at+1.3,.4)} draw={p(t,cues.bow-47,.7)}/></Reveal>
 <g opacity={1-p(t,at+1.3,.5)}><image href={asset('castillo-carton.png')} x="-120" y="1220" width="520" height="347"/></g>
 <Card t={t} at={at} line1="1 COMENTARIO = 1 GATITO" line2="ARQUERO" fiction/>
 </Canvas>;};

export const RiderReinforcements=()=>{const t=useT();const at=cues.share-56;const move=p(t,at+.45,2.5);return <Canvas><Landscape t={t+56} pan={t*14}/><Castle x={880} y={1220} w={550} t={t+56}/><Cat x={800} y={1510} h={680} t={t+56} look={-1} raise={.45}/>
 {t>at+.45&&<PigRider x={lerp(-510,380,move)} y={1490} w={1250} t={t+56} trot={1-p(t,at+3.1,.5)}/>}
 {[0,1].map(i=>t>5+i*.6?<PigRider key={i} x={lerp(-320,230+i*310,p(t,5+i*.6,1.4))} y={1260-i*90} w={620} t={t+57+i} trot={1-p(t,7,.5)}/>:null)}
 <Card t={t} at={at} line1="1 COMPARTIDO = 1 GATITO" line2="JINETE" fiction/>
 <Dust t={t} y={1470} amount={1-p(t,at+3,.5)}/>
 </Canvas>;};

export const OpenEnding=()=>{const t=useT();const pull=p(t,.8,2.1);const scale=lerp(1,.73,pull);return <Canvas><Landscape t={t+65} dark={p(t,2.2,2)*.1}/><Army t={t+65} far pan={-380}/><g transform={`translate(${540*(1-scale)} ${700*(1-scale)}) scale(${scale})`}>
 <Castle x={295} y={1310} w={650} t={t+65}/>
 {[0,1,2,3].map(i=><Cat key={'m'+i} kind="mouse" x={280+i*95} y={1560} h={180} t={t+65+i} raise={.5}/>)}
 {[0,1,2].map(i=><Cat key={'a'+i} kind="archer" x={165+i*160} y={1160} h={190} t={t+65+i} draw={.7}/>)}
 <PigRider x={800} y={1500} w={650} t={t+65} trot={0}/>
 <Cat x={545} y={1510} h={500} t={t+65} look={-p(t,0,.6)*(1-p(t,1.1,.6))} raise={p(t,2.5,1)}/>
 <Hyena x={1160} y={1300} h={800} t={t+65}/>
 </g>
 <path d={`M${lerp(1300,150,p(t,2.2,2.4))} 1050L1300 680V1920H${lerp(1500,250,p(t,2.2,2.4))}Z`} fill="url(#threat)" opacity=".6"/>
 <g opacity={p(t,cues.question-65,.3)}><Text x={520} y={420} size={70}>¿CUÁNTOS</Text><Text x={520} y={508} size={70}>SEREMOS?</Text></g>
 </Canvas>;};

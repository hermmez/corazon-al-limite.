import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Cart,Meat,Icon,Label,Badge,Tag,p,lerp,pulse} from './art';
import {cues} from './cues';

export const ForecastAndQuestion:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=58+f/fps;
 const question=p(t,cues.question-.12,.4),cart=p(t,64.5,.55);
 const qtext='¿CUÁL COMPRAS MÁS?';
 return <Canvas>
  <g opacity={1-question}>
   <g opacity={1-p(t,58.8,.35)} transform={`translate(${lerp(600,230,p(t,58,.6))} ${lerp(690,900,p(t,58,.6))}) rotate(${lerp(0,-8,p(t,58,.6))})`}><path d="M0 0 H330 V285 L300 269 L270 285 L240 269 L210 285 L180 269 L150 285 L120 269 L90 285 L60 269 L30 285 L0 269Z" fill="#fcf0d8" stroke="#7d6b4e" strokeWidth="4"/><Label x={165} y={110} text="$265" size={75}/><Label x={165} y={183} text="EJEMPLO" size={28}/></g>
   <g opacity={p(t,cues.warning-.2,.3)}><Badge x={160} y={385} width={760} text="PROYECCIONES PARA 2027"/>
    <path d="M100 515 H980 V1030 H100Z" fill="#f9ecd3" stroke="#85704f" strokeWidth="4"/>
    <g opacity={p(t,59.15,.3)} transform={`translate(${150-20*p(t,59.15,.3)} 555)`}><path d="M0 -30 L38 40 H-38Z" fill="#e8b86e" stroke="#6a553c" strokeWidth="4"/><Label x={0} y={26} text="!" size={43}/></g>
    <g opacity={p(t,cues.forecast-.1,.4)} transform={`rotate(${-7*(1-p(t,cues.forecast-.1,.4))} 550 628)`}><Label x={560} y={655} text="SON PRONÓSTICOS" size={51}/></g>
    <g opacity={p(t,cues.notConfirmed-.15,.35)}><Label x={540} y={751} text="No son precios confirmados" size={43}/><path d="M185 797 H895" stroke="#b3654d" strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,cues.notConfirmed,.5)}/></g>
    <g opacity={p(t,62,.25)}><Label x={540} y={912} text="El resultado depende del mercado" size={35}/></g>
   </g>
   <g opacity={p(t,62,.3)}><Icon kind="energy" x={145} y={1110-35*p(t,62,.4)} size={150} t={t}/><Icon kind="shield" x={465} y={1110-35*p(t,62.5,.4)} size={150} t={t}/><Icon kind="globe" x={785} y={1110-35*p(t,63,.4)} size={150} t={t}/><path d="M220 1310 Q540 1410 860 1310" stroke="#789b87" strokeWidth="7" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,63,.7)}/></g>
  </g>
  <g opacity={cart}>
   <Cart x={lerp(-540,80,p(t,64.5,1.1))} y={1050-15*p(t,65.5,.5)} w={900} t={t} roll={1-p(t,69.65,.3)} items={0}/>
   <g opacity={p(t,64,.4)}>
    <Meat kind="beef" x={85} y={820-50*p(t,67,.5)-34*pulse(t,cues.answerBeef,.55)} w={275} angle={-4+4*p(t,64.3,.4)}/>
    <Meat kind="chicken" x={402} y={820-50*p(t,67.2,.5)-34*pulse(t,cues.answerChicken,.55)} w={275} angle={4-4*p(t,64.6,.4)}/>
    <Meat kind="pork" x={719} y={820-50*p(t,67.4,.5)-34*pulse(t,cues.answerPork,.55)} w={275} angle={-4+4*p(t,64.9,.4)}/>
    {[{x:222,n:'RES',at:cues.answerBeef},{x:540,n:'POLLO',at:cues.answerChicken},{x:856,n:'CERDO',at:cues.answerPork}].map(s=><g key={s.n}>
     <rect x={s.x-120} y="1125" width="240" height="72" rx="18" fill={t>s.at?'#b3c6a4':'#e9d7b0'} stroke="#827551" strokeWidth="3"/>
     <Label x={s.x} y={1174} text={s.n} size={37}/>
     <path d={`M${s.x-86} 1226 L${s.x+86} 1226`} stroke="#3f8581" strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,s.at,.25)}/>
    </g>)}
   </g>
  </g>
  <g opacity={question} transform={`translate(0 ${35*(1-question)})`}><path d="M79 440 H1001 V700 H79Z" fill="#f6e8ca" stroke="#796443" strokeWidth="4"/><Label x={540} y={550} text="¿CUÁL COMPRAS" size={63}/><Label x={540} y={633} text="MÁS?" size={68}/><path d="M300 739 Q540 807 780 739" stroke="#4b8582" strokeWidth="7" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,67,.6)}/></g>
 </Canvas>;
};

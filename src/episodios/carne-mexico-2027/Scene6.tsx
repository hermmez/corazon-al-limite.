import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Canvas,Shop,Meat,Scale,Tag,Label,Badge,p,lerp,pulse} from './art';
import {Buyer,ReceiptHand} from './character';
import {cues} from './cues';

export const PriceExample:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=47+f/fps;const math=p(t,53.1,.4);
 const receipt=p(t,57,.6);
 return <AbsoluteFill style={{overflow:'hidden'}}>
 <Canvas><Shop t={t}/>
  <g opacity={1-math}><Badge x={100} y={375} width={760} text="Ejemplo hipotético · no es un precio actual"/>
   <Scale x={115} y={1030} w={475} t={t} weight={p(t,49,.7)}/>
   <Meat kind="beef" x={138+75*(1-p(t,48.7,.45))} y={784+62*p(t,49,.6)} w={430} angle={-7+7*p(t,49,.5)}/>
   <g opacity={p(t,cues.kilo,.2)}><Label x={352} y={1380} text="1 kg" size={66}/></g>
   <Tag x={160} y={550} w={400} text={t>=cues.price250?'$250':'$—'} small="MXN · un kilo" angle={-4+4*p(t,52,.5)} progress={p(t,50.7,.5)}/>
  </g>
  <g opacity={math}><rect x="55" y="450" width="970" height="1000" rx="35" fill="#f5e8ce" stroke="#8b7752" strokeWidth="4"/>
   <Badge x={252} y={510} width={575} text="EJEMPLO HIPOTÉTICO"/>
   <Meat kind="beef" x={350} y={625} w={350}/>
   <Label x={200} y={1040} text="$250" size={82}/>
   <g opacity={p(t,cues.ifRise,.2)}><Label x={357} y={1040} text="×" size={73}/></g>
   <g opacity={p(t,cues.six,.28)} transform={`translate(0 ${-40*(1-p(t,cues.six,.35))})`}><Label x={502} y={1040} text="1.06" size={80}/><path d="M441 921 Q500 871 559 921" fill="none" stroke="#bf9351" strokeWidth="5"/><Label x={502} y={869} text="+6 %" size={40}/></g>
   <g opacity={p(t,cues.pay,.2)}><Label x={641} y={1040} text="=" size={73}/></g>
   <g opacity={p(t,cues.price265,.28)} transform={`translate(0 ${24*(1-p(t,cues.price265,.55))})`}><Label x={824} y={1040} text="$265" size={82} color="#377b75"/><Label x={824} y={1102} text="MXN" size={33}/></g>
   <g opacity={p(t,55.1,.55)} transform={`translate(0 ${24*(1-p(t,55.1,.65))})`}><path d="M257 1180 Q540 1260 824 1180" fill="none" stroke="#a9a37a" strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,55.1,.65)}/><Label x={540} y={1290} text="Diferencia: $15 por kilo" size={45}/></g>
  </g>
  <g opacity={receipt} transform={`translate(0 ${150*(1-receipt)})`}><path d="M605 1125 H935 V1420 L912 1405 L890 1420 L868 1405 L846 1420 L824 1405 L802 1420 L780 1405 L758 1420 L736 1405 L714 1420 L692 1405 L670 1420 L648 1405 L626 1420 L605 1405Z" fill="#fcf0d8" stroke="#7a684d" strokeWidth="3"/><Label x={770} y={1187} text="1 kg · Res" size={31}/><Label x={770} y={1241} text="$250 + $15" size={35}/><path d="M632 1273 H906" stroke="#b8a47e" strokeWidth="3"/><Label x={770} y={1338} text="TOTAL $265" size={38} color="#377b75"/></g>
 </Canvas>
 <div style={{opacity:1-p(t,52.7,.3)}}><Buyer x={645} y={470} width={440} t={t} reach={p(t,48,.4)*(1-p(t,50,.4))} right={p(t,50,.4)*.4} look={-4*p(t,48,.4)+2*p(t,51,.3)} lean={-2*p(t,48.5,.4)} surprise={p(t,51.5,.25)*.5}/></div>
 <div style={{opacity:receipt}}><ReceiptHand progress={p(t,57.15,.55)}/></div>
 </AbsoluteFill>;
};

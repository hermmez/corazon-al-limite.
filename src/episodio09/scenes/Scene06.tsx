import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Breaker, C, clamp, Fuse, Label, Stage} from '../Art';
export const Scene06:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const operated=f>2.5*fps;const reset=clamp(f,7.3*fps,8.1*fps);
 return <Stage>
  <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M540 345V1405" stroke="#6b9a9b" opacity=".5" strokeWidth="2"/><path d="M55 1405H1025" stroke="#6b9a9b" opacity=".3" strokeWidth="2"/></svg>
  <Label y={170} size={48}>Dos formas de proteger{`\n`}contra sobrecorrientes</Label>
  <Label x={35} y={390} w={480} size={35} color={C.orange}>FUSIBLE</Label>
  <Label x={565} y={390} w={480} size={33} color={C.teal}>TERMOMAGNÉTICO</Label>
  <Fuse x={-125} y={800} w={790} angle={-90} reveal={clamp(f,.5*fps,2*fps)} heat={operated?.08:clamp(f,.7*fps,2.4*fps,0,1)} broken={operated} burstFrame={f-2.5*fps}/>
  <Breaker x={555} y={500} w={480} trip={operated?1-reset:0}/>
  <svg width="1080" height="1920" style={{position:'absolute',opacity:clamp(f,.6*fps,1.4*fps)}}>
   <path d="M793 860L826 925" stroke="#b8ded1" strokeWidth="3"/>
   <circle cx="810" cy="1080" r="140" fill="#102f3e" stroke="#b8ded1" strokeWidth="4"/>
   <path d="M693 1056H740M848 1060H925" stroke="#bc9262" strokeWidth="12"/>
   <path d="M735 1055L853 1058" stroke="#f1d5a6" strokeWidth="12" transform={`rotate(${operated?(1-reset)*-29:0} 735 1055)`}/>
   <circle cx="735" cy="1055" r="10" fill="#f2e6bf"/>
   <path d="M718 1146h20q-12-30 0-30t12 30t12-30t12 30t12-30t12 30t12-30t12 30h20" fill="none" stroke={C.orange} strokeWidth="5"/>
   <path d="M855 1138L873 1090L839 1076" fill="none" stroke="#80adbd" strokeWidth="8"/>
   <text x="810" y="1190" textAnchor="middle" fill="#d6e5d6" fontSize="23" fontFamily="Arial">Mecanismo ilustrado</text>
  </svg>
  <Label x={35} y={1290} w={470} size={34}>Se reemplaza{`\n`}después de operar</Label>
  <Label x={570} y={1290} w={470} size={34}>Puede rearmarse</Label>
  <Label y={1490} size={33} color={C.teal}>{f>5*fps?'PRIMERO: CORREGIR LA FALLA':'Ambos requieren selección adecuada al circuito'}</Label>
 </Stage>;
};

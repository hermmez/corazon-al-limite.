import React from 'react';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {asset, Cable, C, Circuit, clamp, Host, Label, Stage} from '../Art';
export const Scene05:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const house=clamp(f,2.7*fps,4.5*fps);
 return <Stage>
  <Img src={asset('vivienda-mexicana.png')} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',opacity:house*.7,transform:`translateY(${clamp(f,3*fps,9*fps,25,-15)}px) scale(1.05)`}}/>
  <div style={{opacity:1-house}}><Circuit open/></div>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(#041b2ba0, transparent 60%, #041b2bd0)',opacity:house}}/>
  <Label y={220} size={55} color={C.teal}>{house>.5?'Reduce el riesgo\nde incendio':'La sobrecorriente\nse interrumpe'}</Label>
  <Cable x={-30} y={1050} w={1100} angle={-7} heat={clamp(f,0,2.5*fps,.6,0)}/>
  <div style={{opacity:house}}><Host pose="16_aprobando" x={10} y={1160} h={470}/><Label x={410} w={600} y={1425} size={30}>{f<6.5*fps?'Ayuda a proteger.\nNo garantiza evitar todo incendio.':'No sustituye la protección\ncontra descargas eléctricas.'}</Label></div>
 </Stage>;
};

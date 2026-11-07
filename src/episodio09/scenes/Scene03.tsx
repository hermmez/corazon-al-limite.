import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cable, C, Circuit, clamp, Label, Stage, Warning} from '../Art';
export const Scene03:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const short=f>=4.7*fps;
 return <Stage warm={1}>
  <Img src={staticFile('imagenes/escenarios/03_sala.png')} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',opacity:.13,transform:`translateX(${Math.sin(f*.01)*15}px)`}}/>
  <Circuit overload={clamp(f,.6*fps,3*fps,.2,1)} short={short}/>
  <Label y={225} size={61} color={C.orange}>{short?'CORTOCIRCUITO':'SOBRECARGA'}</Label>
  <Label y={310} size={32}>{short?'Una trayectoria de muy baja impedancia':'La suma de las cargas supera lo admisible'}</Label>
  <Cable x={10} y={1320} w={1060} angle={-8} heat={clamp(f,1*fps,4*fps,0,.95)}/>
  <Warning x={790} y={1360} size={140}/>
 </Stage>;
};

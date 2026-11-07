import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Art, Cable, C, clamp, Fuse, Label, Stage, Warning} from '../Art';
export const Scene07:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const tech=clamp(f,4.4*fps,5.5*fps);
 return <Stage warm={1-tech}>
  <Label y={180} size={58} color={C.orange}>NUNCA CON ALAMBRE</Label>
  <Fuse x={50} y={400} w={640} angle={-15}/>
  <Art name="alambre-advertencia.svg" style={{left:410,top:540,width:600,height:360,transform:`rotate(${Math.sin(f*.04)*2}deg)`}}/>
  <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M535 606L902 860M902 606L535 860" stroke="#052132" strokeWidth="24"/><path d="M535 606L902 860M902 606L535 860" stroke={C.red} strokeWidth="15" strokeLinecap="round"/></svg>
  <Warning x={80} y={740} size={155}/>
  <Label y={940} size={38}>Tampoco aumentes su capacidad{`\n`}sin un análisis del circuito.</Label>
  <div style={{opacity:1-tech}}><Cable y={1230} heat={.9} w={1080}/></div>
  <Art name="electricista.png" style={{left:600+clamp(f,4.4*fps,5.5*fps,150,0),top:1070,width:400,height:610,opacity:tech}}/>
  <Art name="gabinete-cerrado.svg" style={{left:70,top:1110,width:210,height:343,opacity:tech}}/>
  <div style={{opacity:tech}}><Label x={55} y={1490} w={560} size={32} color={C.teal}>Acude a un electricista{`\n`}calificado. Equipo sin tensión.</Label></div>
 </Stage>;
};

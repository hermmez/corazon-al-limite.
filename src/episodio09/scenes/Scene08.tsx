import React from 'react';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {Art, asset, Cable, C, clamp, Fuse, Host, Label, Stage} from '../Art';
export const Scene08:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const pull=clamp(f,0,7*fps,1.17,1);
 return <Stage>
  <Img src={asset('vivienda-mexicana.png')} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',opacity:.42}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(#031827d0, #041c2b40 60%, #031827c0)'}}/>
  <div style={{position:'absolute',inset:0,transform:`scale(${pull})`,transformOrigin:'50% 44%'}}>
   <Fuse x={40} y={620} w={1000} angle={-23} reveal={clamp(f,0,2*fps,1,0)} heat={0}/>
   <Art name="interruptor-cuchillas.svg" style={{left:50,top:1110,width:240,height:392,transform:`rotate(${Math.sin(f*.025)*1.5}deg)`}}/>
   <Cable x={570} y={1190} w={590} angle={-40}/>
  </div>
  <Label y={190} size={59} color={C.cream}>Se sacrifica para{`\n`}proteger el circuito.</Label>
  <Host pose={f<3*fps?'03_senalando_derecha':'02_explicando'} x={315} y={1090} h={560}/>
  <div style={{opacity:clamp(f,3.6*fps,4.6*fps)}}><Label x={675} y={1440} w={350} size={36} color={C.teal}>¿Lo sabías?</Label></div>
  <div style={{position:'absolute',inset:0,background:'#04111c',opacity:clamp(f,7.65*fps,8*fps,0,1)}}/>
 </Stage>;
};

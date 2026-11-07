import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Circuit, clamp, Fuse, Label, Stage} from '../Art';
export const Scene04:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const cut=5.6*fps;const broken=f>=cut;
 return <Stage warm={broken?0:1}>
  <Label y={200} size={50} color={broken?C.teal:C.orange}>{broken?'CIRCUITO ABIERTO':'CORRIENTE + TIEMPO'}</Label>
  <Label y={280} size={31}>{broken?'El elemento se funde y se interrumpe':'Más sobrecorriente suele reducir el tiempo de operación'}</Label>
  <div style={{transform:`translate(${broken?Math.sin(f*2)*clamp(f,cut,cut+12,4,0):0}px, 0)`}}>
   <Fuse x={-30} y={580} w={1140} angle={clamp(f,0,3*fps,-16,0)} reveal={clamp(f,0,1.3*fps,.5,1)} heat={broken?clamp(f,cut,cut+2*fps,1,.08):clamp(f,0,cut,.3,1)} broken={broken} burstFrame={f-cut}/>
  </div>
  <div style={{position:'absolute',left:230,top:880,width:620,height:760,transform:'scale(.57)',transformOrigin:'0 0'}}><Circuit overload={broken?0:1} open={broken}/></div>
  <Label y={1495} size={29} color="#c9e3da">El tiempo y la capacidad de interrupción{`\n`}dependen del tipo de fusible.</Label>
  {f>=cut&&f<cut+7&&<div style={{position:'absolute',inset:0,background:'#fff1be',opacity:clamp(f,cut,cut+7,.3,0)}}/>}
 </Stage>;
};

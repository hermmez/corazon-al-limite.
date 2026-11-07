import React from 'react';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {Art, asset, clamp, Fuse, Label, Stage} from '../Art';
export const Scene01:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <Stage>
  <Img src={asset('vivienda-mexicana.png')} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',transformOrigin:'9% 56%',transform:`scale(${1+clamp(f,1.5*fps,4*fps,0,1.6)})`,opacity:1-clamp(f,4.4*fps,5.6*fps)}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(#03162666, transparent 50%, #03162688)',opacity:1-clamp(f,3*fps,4*fps)}}/>
  <div style={{opacity:1-clamp(f,2.4*fps,3.1*fps)}}><Label y={180} size={66}>¿Puede evitar{`\n`}un incendio?</Label></div>
  <Art name="interruptor-cuchillas.svg" style={{left:255,top:380,width:570,height:931,opacity:clamp(f,2.8*fps,3.7*fps)*(1-clamp(f,5.1*fps,6.2*fps)),transform:`scale(${clamp(f,3*fps,6*fps,.8,1.2)})`}}/>
  <div style={{opacity:clamp(f,5*fps,6*fps),transform:`translateY(${clamp(f,5*fps,6.5*fps,120,0)}px)`}}>
   <Fuse x={-70} y={660} w={1220} angle={-36} reveal={0}/>
   <Label y={1290} size={54}>FUSIBLE DE CARTUCHO</Label>
  </div>
 </Stage>;
};

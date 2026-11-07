import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, Fuse, Host, Label, Stage} from '../Art';
export const Scene02:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const reveal=clamp(f,1*fps,2.7*fps);
 return <Stage warm={clamp(f,5*fps,8*fps)}>
  <Label y={210} size={53}>El secreto está{`\n`}en su interior</Label>
  <Fuse x={-25} y={640} w={1130} angle={clamp(f,0,2*fps,-36,-6)} reveal={reveal} heat={clamp(f,4*fps,8*fps,0,.75)}/>
  <svg width="1080" height="1920" style={{position:'absolute',opacity:reveal}}><path d="M545 832L630 1060H930" stroke={C.cream} strokeWidth="3" fill="none"/><circle cx="545" cy="832" r="8" fill={C.orange}/></svg>
  <div style={{opacity:reveal}}><Label x={510} y={1085} w={470} size={35} color={C.orange}>ELEMENTO{`\n`}METÁLICO FUSIBLE</Label></div>
  <Host pose={f<6*fps?'02_explicando':'04_pensando'} x={15} y={1110} h={520}/>
  <Label x={430} y={1380} w={575} size={29} color="#bad8d4">Partículas: representación educativa.{`\n`}La electricidad no es visible.{`\n`}En CA, el sentido cambia.</Label>
 </Stage>;
};

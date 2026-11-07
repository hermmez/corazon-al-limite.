import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {clamp} from './Art';
import {Captions} from './Captions';
import audio from './audio-manifest.json';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';

const Dissolve:React.FC<{children:React.ReactNode;first?:boolean}>=({children,first=false})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{opacity:first?1:clamp(f,0,fps/3),overflow:'hidden'}}>{children}</AbsoluteFill>;
};
export const Episode09:React.FC=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#04111b'}}>
  <Sequence from={0} durationInFrames={8*fps+10} name="01 — Vivienda y gancho" premountFor={fps}><Dissolve first><Scene01/><Captions scene={1} start={0}/></Dissolve></Sequence>
  <Sequence from={8*fps} durationInFrames={9*fps+10} name="02 — Interior del cartucho" premountFor={fps}><Dissolve><Scene02/><Captions scene={2} start={8*fps}/></Dissolve></Sequence>
  <Sequence from={17*fps} durationInFrames={9*fps+10} name="03 — Sobrecarga y cortocircuito" premountFor={fps}><Dissolve><Scene03/><Captions scene={3} start={17*fps}/></Dissolve></Sequence>
  <Sequence from={26*fps} durationInFrames={9*fps+10} name="04 — Fusión y circuito abierto" premountFor={fps}><Dissolve><Scene04/><Captions scene={4} start={26*fps}/></Dissolve></Sequence>
  <Sequence from={35*fps} durationInFrames={9*fps+10} name="05 — Reducción del riesgo" premountFor={fps}><Dissolve><Scene05/><Captions scene={5} start={35*fps}/></Dissolve></Sequence>
  <Sequence from={44*fps} durationInFrames={9*fps+10} name="06 — Fusible y termomagnético" premountFor={fps}><Dissolve><Scene06/><Captions scene={6} start={44*fps}/></Dissolve></Sequence>
  <Sequence from={53*fps} durationInFrames={9*fps+10} name="07 — Advertencia y electricista" premountFor={fps}><Dissolve><Scene07/><Captions scene={7} start={53*fps}/></Dissolve></Sequence>
  <Sequence from={62*fps} durationInFrames={8*fps} name="08 — Cierre" premountFor={fps}><Dissolve><Scene08/><Captions scene={8} start={62*fps}/></Dissolve></Sequence>
  {audio.status==='ready'&&<Audio src={staticFile(audio.src)} premountFor={fps}/>}
 </AbsoluteFill>;
};

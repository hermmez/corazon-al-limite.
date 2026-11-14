import React from 'react';
import {AbsoluteFill,Sequence,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {asset,CinematicFinish} from './art';
import {Scene1} from './Scene1';
import {Scene2} from './Scene2';
import {Scene3} from './Scene3';
import {Scene4} from './Scene4';
import {Scene5} from './Scene5';
import {Scene6} from './Scene6';
import {Scene7} from './Scene7';

export const UnDiaVasAExtranar:React.FC=()=>{
 const{fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#4c362a',overflow:'hidden'}}>
  <Sequence name="01 · Esa llamada" from={0} durationInFrames={7*fps+12} premountFor={fps}><Scene1/></Sequence>
  <Sequence name="02 · Después hablamos" from={7*fps} durationInFrames={10*fps+12} premountFor={fps}><Scene2/></Sequence>
  <Sequence name="03 · La última vez" from={17*fps} durationInFrames={10*fps+12} premountFor={fps}><Scene3/></Sequence>
  <Sequence name="04 · Perseguir el futuro" from={27*fps} durationInFrames={11*fps+12} premountFor={fps}><Scene4/></Sequence>
  <Sequence name="05 · Todavía puedes" from={38*fps} durationInFrames={11*fps+12} premountFor={fps}><Scene5/></Sequence>
  <Sequence name="06 · Volver a estar" from={49*fps} durationInFrames={11*fps+12} premountFor={fps}><Scene6/></Sequence>
  <Sequence name="07 · Era suficiente" from={60*fps} durationInFrames={10*fps} premountFor={fps}><Scene7/></Sequence>
  <Audio src={asset('musica-original.wav')} premountFor={fps}/>
  <Audio src={asset('ambiente-y-efectos.wav')} premountFor={fps}/>
  <CinematicFinish/>
 </AbsoluteFill>;
};

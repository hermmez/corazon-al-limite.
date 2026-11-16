import React from 'react';
import {AbsoluteFill,useVideoConfig} from 'remotion';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {SunfishHook} from './Scene1';
import {SunfishAnatomy} from './Scene2';
import {SunfishSwimming} from './Scene3';
import {SunfishDiving} from './Scene4';
import {SunfishFeeding} from './Scene5';
import {SunfishSurface} from './Scene6';
import {SunfishQuestion} from './Scene7';
import {Narration} from './audio';
export const PezLunaOceanico:React.FC=()=>{
 const{fps}=useVideoConfig();const transition=linearTiming({durationInFrames:Math.round(fps/3)});
 return <AbsoluteFill style={{background:'#08788b'}}>
 <TransitionSeries>
  <TransitionSeries.Sequence name="01 · El gigante completo" durationInFrames={8*fps+Math.round(fps/3)} premountFor={fps}><SunfishHook/></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={transition} presentation={wipe({direction:'from-left'})}/>
  <TransitionSeries.Sequence name="02 · Clavus, no cola convencional" durationInFrames={11*fps+Math.round(fps/3)} premountFor={fps}><SunfishAnatomy/></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={transition} presentation={fade()}/>
  <TransitionSeries.Sequence name="03 · Natación con dos aletas" durationInFrames={9*fps+Math.round(fps/3)} premountFor={fps}><SunfishSwimming/></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={transition} presentation={wipe({direction:'from-top'})}/>
  <TransitionSeries.Sequence name="04 · Inmersión" durationInFrames={11*fps+Math.round(fps/3)} premountFor={fps}><SunfishDiving/></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={transition} presentation={slide({direction:'from-right'})}/>
  <TransitionSeries.Sequence name="05 · Alimentación variada" durationInFrames={10*fps+Math.round(fps/3)} premountFor={fps}><SunfishFeeding/></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={transition} presentation={wipe({direction:'from-bottom'})}/>
  <TransitionSeries.Sequence name="06 · De lado en superficie" durationInFrames={10*fps+Math.round(fps/3)} premountFor={fps}><SunfishSurface/></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={transition} presentation={fade()}/>
  <TransitionSeries.Sequence name="07 · ¿Nadarías junto a él?" durationInFrames={11*fps} premountFor={fps}><SunfishQuestion/></TransitionSeries.Sequence>
 </TransitionSeries>
 <Narration/>
 </AbsoluteFill>;
};

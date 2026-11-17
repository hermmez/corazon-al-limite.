import React from 'react';
import {AbsoluteFill,useVideoConfig} from 'remotion';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {fade} from '@remotion/transitions/fade';
import {EnemyHook,CardboardCastle,FamilyReason,Decision,MouseReinforcements,ArcherReinforcements,RiderReinforcements,OpenEnding} from './scenes';
import {Narration} from './audio';
export const UltimoCaballero=()=>{const{fps}=useVideoConfig();const timing=linearTiming({durationInFrames:10});return <AbsoluteFill style={{background:'#d29b51'}}><TransitionSeries>
 <TransitionSeries.Sequence name="01 · Un enemigo imposible" durationInFrames={8*fps+10} premountFor={fps}><EnemyHook/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={wipe({direction:'from-left'})}/>
 <TransitionSeries.Sequence name="02 · Todo de cartón" durationInFrames={10*fps+10} premountFor={fps}><CardboardCastle/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={fade()}/>
 <TransitionSeries.Sequence name="03 · Todo lo que ama" durationInFrames={10*fps+10} premountFor={fps}><FamilyReason/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={wipe({direction:'from-bottom'})}/>
 <TransitionSeries.Sequence name="04 · Patitas valientes" durationInFrames={10*fps+10} premountFor={fps}><Decision/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={fade()}/>
 <TransitionSeries.Sequence name="05 · Ratoncitos caballeros" durationInFrames={9*fps+10} premountFor={fps}><MouseReinforcements/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={wipe({direction:'from-right'})}/>
 <TransitionSeries.Sequence name="06 · Gatitos arqueros" durationInFrames={9*fps+10} premountFor={fps}><ArcherReinforcements/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={wipe({direction:'from-left'})}/>
 <TransitionSeries.Sequence name="07 · Puerquitos y jinetes" durationInFrames={9*fps+10} premountFor={fps}><RiderReinforcements/></TransitionSeries.Sequence>
 <TransitionSeries.Transition timing={timing} presentation={fade()}/>
 <TransitionSeries.Sequence name="08 · ¿Cuántos seremos?" durationInFrames={5*fps} premountFor={fps}><OpenEnding/></TransitionSeries.Sequence>
 </TransitionSeries><Narration/></AbsoluteFill>;};

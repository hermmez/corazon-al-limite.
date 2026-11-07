import React from 'react';
import {Composition,Folder} from 'remotion';
import {Episode09} from './Episode09';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
export const Episode09Registrations:React.FC=()=> <Folder name="Episodio-09">
 <Composition id="Episodio09" component={Episode09} durationInFrames={2100} fps={30} width={1080} height={1920}/>
 <Folder name="Escenas">
  <Composition id="E09-01-Vivienda" component={Scene01} durationInFrames={240} fps={30} width={1080} height={1920}/>
  <Composition id="E09-02-Interior" component={Scene02} durationInFrames={270} fps={30} width={1080} height={1920}/>
  <Composition id="E09-03-Fallas" component={Scene03} durationInFrames={270} fps={30} width={1080} height={1920}/>
  <Composition id="E09-04-Fusion" component={Scene04} durationInFrames={270} fps={30} width={1080} height={1920}/>
  <Composition id="E09-05-Proteccion" component={Scene05} durationInFrames={270} fps={30} width={1080} height={1920}/>
  <Composition id="E09-06-Comparacion" component={Scene06} durationInFrames={270} fps={30} width={1080} height={1920}/>
  <Composition id="E09-07-Advertencia" component={Scene07} durationInFrames={270} fps={30} width={1080} height={1920}/>
  <Composition id="E09-08-Cierre" component={Scene08} durationInFrames={240} fps={30} width={1080} height={1920}/>
 </Folder>
</Folder>;

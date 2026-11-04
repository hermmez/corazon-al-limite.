import React from "react";
import {AbsoluteFill,Series,useVideoConfig} from "remotion";
import {BedroomScene} from "./scenes/BedroomScene";
import {AttentionScene} from "./scenes/AttentionScene";
import {MicrosleepScene} from "./scenes/MicrosleepScene";
import {RoadScene} from "./scenes/RoadScene";
import {FunctionsScene} from "./scenes/FunctionsScene";
import {CoffeeScene} from "./scenes/CoffeeScene";
import {PerceptionScene} from "./scenes/PerceptionScene";
import {ClosingScene} from "./scenes/ClosingScene";

export {BedroomScene,AttentionScene,MicrosleepScene,RoadScene,FunctionsScene,CoffeeScene,PerceptionScene,ClosingScene};
export const Episodio04SinDormir: React.FC=()=>{
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{background:"#10323d",color:"#fff4dc",overflow:"hidden",fontFamily:"Arial, sans-serif"}}>
    <Series>
      <Series.Sequence name="Noche en vela" durationInFrames={8*fps} premountFor={fps}><BedroomScene/></Series.Sequence>
      <Series.Sequence name="Atención y reacción" durationInFrames={9*fps} premountFor={fps}><AttentionScene/></Series.Sequence>
      <Series.Sequence name="Microsueños" durationInFrames={9*fps} premountFor={fps}><MicrosleepScene/></Series.Sequence>
      <Series.Sequence name="Carretera" durationInFrames={9*fps} premountFor={fps}><RoadScene/></Series.Sequence>
      <Series.Sequence name="Funciones cognitivas" durationInFrames={9*fps} premountFor={fps}><FunctionsScene/></Series.Sequence>
      <Series.Sequence name="Cafeína y descanso" durationInFrames={9*fps} premountFor={fps}><CoffeeScene/></Series.Sequence>
      <Series.Sequence name="Percepción" durationInFrames={9*fps} premountFor={fps}><PerceptionScene/></Series.Sequence>
      <Series.Sequence name="Cierre" durationInFrames={8*fps} premountFor={fps}><ClosingScene/></Series.Sequence>
    </Series>
  </AbsoluteFill>;
};

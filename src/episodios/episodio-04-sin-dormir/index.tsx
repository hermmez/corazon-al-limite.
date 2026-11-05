import React from "react";
import {AbsoluteFill,Audio,Series,staticFile,useVideoConfig} from "remotion";
import {Subtitulos} from "./Subtitulos";
import timeline from "./timeline.json";
import {BedroomScene} from "./scenes/BedroomScene";
import {AttentionScene} from "./scenes/AttentionScene";
import {MicrosleepScene} from "./scenes/MicrosleepScene";
import {RoadScene} from "./scenes/RoadScene";
import {FunctionsScene} from "./scenes/FunctionsScene";
import {CoffeeScene} from "./scenes/CoffeeScene";
import {PerceptionScene} from "./scenes/PerceptionScene";
import {ClosingScene} from "./scenes/ClosingScene";

export {BedroomScene,AttentionScene,MicrosleepScene,RoadScene,FunctionsScene,CoffeeScene,PerceptionScene,ClosingScene};
export const Episodio04SinDormir: React.FC<{externalAudio?: boolean}>=({externalAudio=false})=>{
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{background:"#10323d",color:"#fff4dc",overflow:"hidden",fontFamily:"Arial, sans-serif"}}>
    {!externalAudio && <Audio src={staticFile(timeline.audio)} />}
    <Series>
      <Series.Sequence name="Noche en vela" durationInFrames={timeline.sceneWindows[0].durationInFrames} premountFor={fps}><BedroomScene/><Subtitulos sceneId={0}/></Series.Sequence>
      <Series.Sequence name="Atención y reacción" durationInFrames={timeline.sceneWindows[1].durationInFrames} premountFor={fps}><AttentionScene/><Subtitulos sceneId={1}/></Series.Sequence>
      <Series.Sequence name="Microsueños" durationInFrames={timeline.sceneWindows[2].durationInFrames} premountFor={fps}><MicrosleepScene/><Subtitulos sceneId={2}/></Series.Sequence>
      <Series.Sequence name="Carretera" durationInFrames={timeline.sceneWindows[3].durationInFrames} premountFor={fps}><RoadScene/><Subtitulos sceneId={3}/></Series.Sequence>
      <Series.Sequence name="Funciones cognitivas" durationInFrames={timeline.sceneWindows[4].durationInFrames} premountFor={fps}><FunctionsScene/><Subtitulos sceneId={4}/></Series.Sequence>
      <Series.Sequence name="Cafeína y descanso" durationInFrames={timeline.sceneWindows[5].durationInFrames} premountFor={fps}><CoffeeScene/><Subtitulos sceneId={5}/></Series.Sequence>
      <Series.Sequence name="Percepción" durationInFrames={timeline.sceneWindows[6].durationInFrames} premountFor={fps}><PerceptionScene/><Subtitulos sceneId={6}/></Series.Sequence>
      <Series.Sequence name="Cierre" durationInFrames={timeline.sceneWindows[7].durationInFrames} premountFor={fps}><ClosingScene/><Subtitulos sceneId={7}/></Series.Sequence>
    </Series>
  </AbsoluteFill>;
};

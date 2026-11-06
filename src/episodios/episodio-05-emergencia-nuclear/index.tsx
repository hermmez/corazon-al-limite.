import React from "react";
import {AbsoluteFill, Audio, staticFile, useVideoConfig} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {CiudadScene, ProteccionScene, RefugioScene, FalloutScene, RopaScene, HigieneScene, InformacionScene, CierreScene} from "./scenes";
import {Subtitulos} from "./Subtitulos";
import timeline from "./timeline.json";

export const Episodio05EmergenciaNuclear: React.FC<{externalAudio?: boolean}> = ({externalAudio = false}) => {
  const {fps} = useVideoConfig(), windows = timeline.sceneWindows;
  // Incoming scenes start at the measured chapter boundary. The outgoing scene
  // supplies 12 extra overlap frames, so the whole composition remains 2100.
  const overlap = 12, timing = linearTiming({durationInFrames: overlap});
  return <AbsoluteFill style={{background: "#071321", overflow: "hidden", fontFamily: "Arial, sans-serif"}}>
    {!externalAudio && <Audio src={staticFile("episodio-05/audio/narracion_grady_70s.wav")}/>}
    <TransitionSeries>
      <TransitionSeries.Sequence name="Ciudad y destello" durationInFrames={windows[0].durationInFrames + overlap} premountFor={fps}><CiudadScene/><Subtitulos sceneId={0}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Protección ante la onda expansiva" durationInFrames={windows[1].durationInFrames + overlap} premountFor={fps}><ProteccionScene/><Subtitulos sceneId={1}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-right"})} timing={timing}/>
      <TransitionSeries.Sequence name="Entrar y buscar el interior" durationInFrames={windows[2].durationInFrames + overlap} premountFor={fps}><RefugioScene/><Subtitulos sceneId={2}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Lluvia radiactiva y permanencia" durationInFrames={windows[3].durationInFrames + overlap} premountFor={fps}><FalloutScene/><Subtitulos sceneId={3}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: "from-left"})} timing={timing}/>
      <TransitionSeries.Sequence name="Retirar y aislar la ropa exterior" durationInFrames={windows[4].durationInFrames + overlap} premountFor={fps}><RopaScene/><Subtitulos sceneId={4}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-right"})} timing={timing}/>
      <TransitionSeries.Sequence name="Lavado suave y provisiones selladas" durationInFrames={windows[5].durationInFrames + overlap} premountFor={fps}><HigieneScene/><Subtitulos sceneId={5}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Permanecer e informarse" durationInFrames={windows[6].durationInFrames + overlap} premountFor={fps}><InformacionScene/><Subtitulos sceneId={6}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Entra, permanece y mantente informado" durationInFrames={windows[7].durationInFrames} premountFor={fps}><CierreScene/><Subtitulos sceneId={7}/></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>;
};

import React from "react";
import {AbsoluteFill, Audio, staticFile, useVideoConfig} from "remotion";
import {linearTiming, TransitionSeries} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {Apagon, Carga, Europa, Mochila} from "./scenes-inicio";
import {Agua, Cierre, Reserva, Revision} from "./scenes-reservas";
import {Subtitulos} from "./Subtitulos";
import {voiceReady, windows} from "./timing";

export const Episodio06MochilaEmergencia: React.FC<{externalAudio?: boolean}> = ({externalAudio=false}) => {
  const {fps}=useVideoConfig();
  // The twelve overlapping frames are added to outgoing scenes, preserving 2100 frames.
  const overlap=12;
  const timing=linearTiming({durationInFrames:overlap});
  return <AbsoluteFill style={{background:"#071321",overflow:"hidden",fontFamily:"Arial, sans-serif"}}>
    {voiceReady && !externalAudio && <Audio src={staticFile("episodio-06/audio/narracion_grady_70s.wav")}/>}
    <TransitionSeries>
      <TransitionSeries.Sequence name="Apagón y servicios" durationInFrames={windows[0].durationInFrames+overlap} premountFor={fps}><Apagon/><Subtitulos scene={0}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Unión Europea y Suecia" durationInFrames={windows[1].durationInFrames+overlap} premountFor={fps}><Europa/><Subtitulos scene={1}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction:"from-right"})} timing={timing}/>
      <TransitionSeries.Sequence name="Preparar la mochila" durationInFrames={windows[2].durationInFrames+overlap} premountFor={fps}><Mochila/><Subtitulos scene={2}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Ajustar la carga" durationInFrames={windows[3].durationInFrames+overlap} premountFor={fps}><Carga/><Subtitulos scene={3}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction:"from-left"})} timing={timing}/>
      <TransitionSeries.Sequence name="Agua en casa" durationInFrames={windows[4].durationInFrames+overlap} premountFor={fps}><Agua/><Subtitulos scene={4}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Siete días de reservas" durationInFrames={windows[5].durationInFrames+overlap} premountFor={fps}><Reserva/><Subtitulos scene={5}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction:"from-right"})} timing={timing}/>
      <TransitionSeries.Sequence name="Higiene y revisión" durationInFrames={windows[6].durationInFrames+overlap} premountFor={fps}><Revision/><Subtitulos scene={6}/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing}/>
      <TransitionSeries.Sequence name="Evacuar o permanecer" durationInFrames={windows[7].durationInFrames} premountFor={fps}><Cierre/><Subtitulos scene={7}/></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>;
};

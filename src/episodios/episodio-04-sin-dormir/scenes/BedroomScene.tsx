import React from "react";
import {interpolate} from "remotion";
import {Actor, Bed, Brain, Clock, Heading, Room, clamp, useTime} from "../visuals";
export const BedroomScene: React.FC = () => {
  const t = useTime();
  return <>
    <Room local={t} />
    <Bed local={t} left={-80} top={1050} width={1060} />
    <Actor local={t} left={380} width={700} bottom={65} poses={["05_cansado.png","18_bostezando.png","05_cansado.png","11_sorprendido.png"]} />
    <Brain left={30} top={720} width={550} style={{opacity: interpolate(t,[5.4,6.1],[0,1],clamp), translate:`${interpolate(t,[5.4,6.1],[-120,0],clamp)}px 0px`}} />
    <Clock local={t} />
    <Heading>¿24 horas<br/>sin dormir?</Heading>
  </>;
};

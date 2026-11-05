import React from "react";
import {interpolate} from "remotion";
import {Bed,Brain,Heading,Room,clamp,useTime} from "../visuals";
export const ClosingScene: React.FC=()=>{
  const t=useTime();
  return <>
    <Room local={t} dark={interpolate(t,[0,2],[0.12,0.26],clamp)}/>
    <Brain left={80} top={560} width={520} style={{opacity:interpolate(t,[0,0.5,2.4,3],[0,0.95,0.95,0],clamp)}}/>
    <Bed sleeping local={t} left={interpolate(t,[3,7.5],[-10,-100],clamp)} top={interpolate(t,[3,7.5],[1090,1040],clamp)} width={interpolate(t,[3,7.5],[1100,1200],clamp)}/>
    <Heading>{t<1.5?<>Dormir es una<br/>necesidad biológica.</>:t<3?<>Si tienes sueño,<br/>evita manejar.</>:<>¿Cuántas horas<br/>llevas despierto hoy?</>}</Heading>
  </>;
};

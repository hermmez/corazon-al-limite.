import React from "react";
import {Actor,Bed,Brain,Heading,Room,useTime} from "../visuals";
export const PerceptionScene: React.FC=()=>{
  const t=useTime();
  return <>
    <Room local={t}/><Bed local={t} left={310} top={1130} width={1000}/>
    <Actor local={t} left={-65} width={740} bottom={65} poses={["01_neutral.png","01_neutral.png","15_confundido.png","12_preocupado.png"]}/>
    <Brain left={510} top={590} width={570}/>
    <Heading>{t<4?<>Crees que<br/>vas bien…</>:<>Tu atención puede<br/>haber cambiado.</>}</Heading>
  </>;
};

import React from "react";
import {AbsoluteFill} from "remotion";
import {Actor,Bed,Brain,Heading,Room,useTime} from "../visuals";
export const MicrosleepScene: React.FC=()=>{
  const t=useTime();const lapse=t>=3.4&&t<4.4;
  return <>
    <Room local={t}/><Bed local={t} left={-100} width={1000} top={1090}/>
    <Actor local={t} left={390} width={700} bottom={65} poses={["01_neutral.png","01_neutral.png","05_cansado.png","15_confundido.png"]}/>
    <Brain left={-30} top={690} width={620} style={{opacity:lapse?0.5:1}}/>
    {lapse&&<AbsoluteFill style={{background:"#071321",opacity:0.25}}/>}
    <Heading>{t<3?<>Pueden aparecer<br/>microsueños</>:t<6?<>Incluso con<br/>los ojos abiertos</>:<>No hay una hora<br/>exacta para todos</>}</Heading>
  </>;
};

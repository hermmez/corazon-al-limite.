import React from "react";
import {Img,interpolate} from "remotion";
import {Brain,Heading,NeuralWorld,clamp,original,useTime} from "../visuals";
export const AttentionScene: React.FC = () => {
  const t=useTime();
  return <>
    <NeuralWorld local={t}/>
    <Brain top={350} width={1100} style={{translate:`${interpolate(t,[0,2,4,7],[0,-50,-50,0],clamp)}px ${interpolate(t,[0,2],[70,0],clamp)}px`}}/>
    <Img src={original("ciencia/02_sinapsis_neuronal.png")} style={{position:"absolute",left:-25,top:1170,width:720,height:720,objectFit:"contain",opacity:interpolate(t,[1,1.7],[0,1],clamp),translate:`${interpolate(t,[1,2],[-150,0],clamp)}px 0px`,scale:interpolate(t,[3,4.5,6.5,8.5],[1,1.06,1.06,1],clamp)}}/>
    <Heading>{t<3?<>La atención<br/>se resiente</>:t<6?<>Reaccionas<br/>más lento</>:<>Puedes cometer<br/>más errores</>}</Heading>
  </>;
};

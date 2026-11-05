import React from "react";
import {Img,interpolate} from "remotion";
import {Brain,C,Heading,NeuralWorld,clamp,original,useTime} from "../visuals";
export const FunctionsScene: React.FC=()=>{
  const t=useTime();const current=Math.min(2,Math.floor(t/2));
  const poses=["04_pensando.png","15_confundido.png","12_preocupado.png"];
  const labels=["MEMORIA","DECISIONES","EMOCIONES"];
  const colors=[C.teal,C.gold,C.coral];
  return <>
    <NeuralWorld local={t}/><Brain top={340} width={1080} left={0} style={{translate:`0px ${interpolate(t,[0,1],[55,0],clamp)}px`}}/>
    <Heading>{t<2?<>Tu memoria…</>:t<4?<>Tus decisiones…</>:t<6?<>Y tus emociones.</>:<>El efecto varía<br/>entre personas.</>}</Heading>
    {poses.map((pose,n)=><React.Fragment key={pose}>
      <Img src={original(`personajes/${pose}`)} style={{position:"absolute",left:10+n*365,top:1190,width:330,height:495,objectFit:"contain",opacity:interpolate(t,[n*2,n*2+0.3],[0,1],clamp)*(t>6||current===n?1:0.55),translate:`0px ${interpolate(t,[n*2,n*2+0.4],[40,0],clamp)}px`}}/>
      <div style={{position:"absolute",left:10+n*365,top:1120,width:330,textAlign:"center",color:colors[n],fontSize:29,fontWeight:900,textShadow:"0 4px 16px #071321"}}>{labels[n]}</div>
    </React.Fragment>)}
  </>;
};

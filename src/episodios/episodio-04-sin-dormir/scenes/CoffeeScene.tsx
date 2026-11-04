import React from "react";
import {AbsoluteFill,Img,interpolate} from "remotion";
import {Backdrop,Bed,Brain,Heading,Room,added,clamp,original,useTime} from "../visuals";
export const CoffeeScene: React.FC=()=>{
  const t=useTime();const rest=interpolate(t,[4.8,5.6],[0,1],clamp);
  return <>
    <Backdrop src={original("escenarios/02_cocina.png")} dark={0.2}/>
    <AbsoluteFill style={{opacity:rest}}><Room local={t}/><Bed sleeping local={t} left={interpolate(t,[4.8,6],[1080,-10],clamp)}/></AbsoluteFill>
    <Img src={added("taza-cafe-con-plato.png")} style={{position:"absolute",left:interpolate(t,[4.8,5.8],[-40,-400],clamp),top:810,width:800,height:800,objectFit:"contain",opacity:1-rest,translate:`0px ${interpolate(t,[0,0.7],[100,0],clamp)}px`}}/>
    <Brain left={500} top={540} width={570} style={{opacity:interpolate(t,[1.5,2.2,4.8,5.5],[0,1,1,0],clamp)}}/>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:"absolute",inset:0,opacity:1-rest}}>
      {[0,1,2].map(n=><path key={n} d={`M${240+n*70} 960 C${205+n*70} 870,${305+n*55} 825,${250+n*70} 735`} fill="none" stroke="#fff5dc" strokeWidth="5" opacity={0.25+0.12*Math.sin(t*2+n)}/>)}
    </svg>
    <Heading>{t<4.8?<>El café ayuda<br/>por un rato.</>:<>No reemplaza<br/>el sueño.</>}</Heading>
  </>;
};

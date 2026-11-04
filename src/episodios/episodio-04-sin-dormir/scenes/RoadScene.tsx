import React from "react";
import {Img,interpolate} from "remotion";
import {Backdrop,C,Heading,added,clamp,useTime} from "../visuals";
export const RoadScene: React.FC=()=>{
  const t=useTime();const drift=(t*190)%260;
  const shift=interpolate(t,[0,2,3.6,4.3,5.7,7,9],[0,0,36,36,0,0,0],clamp);
  return <>
    <Backdrop src={added("carretera-nocturna-sin-vehiculo.png")} dark={0.04}/>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:"absolute",inset:0}}>
      {[0,1,2,3,4].map(n=>{const y=880+((n*230+drift)%1040);return <path key={n} d={`M540 ${y}v${20+(y-880)*0.09}`} stroke="#f7e5ab" strokeWidth={3+(y-880)*0.012} opacity=".85"/>;})}
    </svg>
    <Img src={added("automovil-teal-vista-trasera.png")} style={{position:"absolute",left:130,top:1090,width:820,height:700,objectFit:"contain",translate:`${shift}px ${Math.sin(t*9)*1.5}px`,rotate:`${shift*0.018}deg`}}/>
    <Heading>{t<2?<>Al volante,<br/>la carretera sigue</>:t<5?<>Un instante<br/>sin responder</>:<>Con sueño,<br/>evita manejar</>}</Heading>
    {t>=2&&t<5&&<div style={{position:"absolute",left:65,top:400,width:850,color:C.gold,fontSize:43,fontWeight:800,textShadow:"0 3px 20px #000"}}>Información que se pierde.</div>}
  </>;
};

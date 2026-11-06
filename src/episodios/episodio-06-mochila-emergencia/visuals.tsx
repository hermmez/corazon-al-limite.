import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile} from "remotion";
import {Backdrop, C, clamp, original} from "../episodio-04-sin-dormir/visuals";
import {ApprovedActor, Camera, Radio, Scene, dissolve, ease, reveal} from "../episodio-05-emergencia-nuclear/visuals";
import {useLocalSeconds} from "./timing";

export {AbsoluteFill, ApprovedActor, Backdrop, C, Camera, Radio, Scene, clamp, dissolve, ease, original, reveal};
export const asset = (file: string) => staticFile(`episodio-06/ilustraciones/${file}`);
export const previous = (file: string) => staticFile(`episodio-05/ilustraciones/${file}`);
export const lerp = (from: number, to: number, p: number) => from + (to - from) * p;

type ImageBox = {x: number; y: number; width: number; height: number; style?: React.CSSProperties};
export const Prop: React.FC<ImageBox & {file?: string; src?: string}> = ({file, src, x, y, width, height, style}) => (
  <Img src={src ?? asset(file!)} style={{position:"absolute", left:x, top:y, width, height, objectFit:"contain", ...style}}/>
);

export const SurfaceShadow: React.FC<{x: number; y: number; width: number; opacity?: number}> = ({x,y,width,opacity=.6}) => (
  <div style={{position:"absolute", left:x, top:y, width, height:width*.12, borderRadius:"50%", background:"radial-gradient(ellipse,#1b1014b0 5%,#160e1280 40%,transparent 72%)", opacity}}/>
);

export const Label: React.FC<{children: React.ReactNode; top: number; left?: number; width?: number; size?: number; opacity?: number; color?: string}> = ({children,top,left=85,width=910,size=54,opacity=1,color=C.cream}) => (
  <div style={{position:"absolute", top,left,width,fontFamily:"Arial, sans-serif", fontWeight:900, textAlign:"center", fontSize:size,lineHeight:1.06,color,opacity,textShadow:"0 4px 16px #101827, 0 2px 5px #101827"}}>{children}</div>
);

export const PackingTable: React.FC<{children?: React.ReactNode; actor?: boolean}> = ({children, actor=true}) => {
  const time=useLocalSeconds();
  return <>
    <Backdrop src={asset("mesa-preparacion.png")} dark={.06}/>
    {actor && <>
      <ApprovedActor t={time} pose="04_pensando.png" x={576} y={570} width={486}/>
      <AbsoluteFill style={{clipPath:"inset(65.5% 0 0 0)"}}><Backdrop src={asset("mesa-preparacion.png")} dark={.06}/></AbsoluteFill>
    </>}
    {children}
  </>;
};

export const OpenBag: React.FC<{children?: React.ReactNode; size?: number; x?: number; y?: number; frontCut?: number}> = ({children,size=690,x=228,y=900,frontCut=53}) => <>
  <SurfaceShadow x={x+size*.12} y={y+size*.80} width={size*.77}/>
  <Prop file="mochila-abierta.png" x={x} y={y} width={size} height={size}/>
  {children}
  {children && <Prop file="mochila-abierta.png" x={x} y={y} width={size} height={size} style={{clipPath:`inset(${frontCut}% 0 0 0)`}}/>}
</>;

export type PackingItem = {file?: string; src?: string; title: string; from: number; until: number; width: number; height: number; x?: number; y?: number};
export const PackItem: React.FC<{item: PackingItem; time: number; mouth?: [number,number]}> = ({item,time,mouth=[535,1180]}) => {
  const {from,until,width,height,title,x=120,y=610}=item;
  if (time < from - .25 || time >= until + .04) return null;
  const landing=Math.max(from+.28,until-.33);
  const fly=reveal(time,from-.25,.35);
  const lower=reveal(time,landing,Math.max(.19,until-landing));
  const left=lerp(lerp(x-180,x,fly),mouth[0]-width*.25,lower);
  const top=lerp(lerp(y-38,y,fly),mouth[1],lower)-Math.sin(lower*Math.PI)*80;
  return <>
    <Prop file={item.file} src={item.src} x={left} y={top} width={width} height={height} style={{opacity:fly*(1-reveal(lower,.79,.21)),scale:lerp(1,.52,lower),rotate:`${lerp(-10,0,fly)+lower*13}deg`,transformOrigin:"45% 50%",filter:"drop-shadow(0 12px 12px #1a162e80)"}}/>
    <Label top={y-75} left={92} width={510} size={41} opacity={fly*dissolve(time,landing,.18)}>{title}</Label>
  </>;
};

export const ShelfItem: React.FC<ImageBox & {file?: string; src?: string; time: number; at: number}> = ({time,at,x,y,width,height,file,src}) => {
  const progress=reveal(time,at-.1,.52);
  if (progress <= 0) return null;
  return <>
    <SurfaceShadow x={x+width*.11} y={y+height*.86} width={width*.76} opacity={progress*.62}/>
    <Prop file={file} src={src} x={x} y={y} width={width} height={height} style={{opacity:progress,translate:`${lerp(120,0,progress)}px ${lerp(-48,0,progress)}px`,rotate:`${lerp(-9,0,progress)}deg`}}/>
  </>;
};

export const Calendar: React.FC<{time: number; start: number; x: number; y: number; width: number; review?: boolean}> = ({time,start,x,y,width,review}) => {
  const progress=reveal(time,start-.18,.52);
  const scale=width/660;
  return <div style={{position:"absolute",left:x,top:y,width:660,height:540,scale,transformOrigin:"0 0",opacity:progress,translate:`0px ${lerp(85,0,progress)}px`}}>
    <Prop file="calendario-escritorio.png" x={0} y={0} width={660} height={540}/>
    <div style={{position:"absolute",left:110,top:156,width:440,textAlign:"center",color:"#163745",fontWeight:900,fontSize:35,lineHeight:1.15}}>{review ? "Revisa tus reservas" : "7 días"}</div>
    <div style={{position:"absolute",left:130,top:218,width:400,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
      {Array.from({length:7},(_,i)=>{const mark=reveal(time,start+.26+i*.16,.2);return <div key={i} style={{textAlign:"center",height:54,background:`rgba(41,113,109,${.08+.75*mark})`,border:"1px solid #526b66",color:mark>.4?"#fff8e7":"#173844",fontSize:32,fontWeight:900,lineHeight:"52px"}}>{review ? (mark>.4 ? "✓" : i+1) : i+1}</div>;})}
    </div>
  </div>;
};

export const pan = (time:number, end:number, from:number, to:number) => interpolate(time,[0,Math.max(.15,end)],[from,to],ease);

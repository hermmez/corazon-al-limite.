import React from "react";
import {interpolate} from "remotion";
import {AbsoluteFill, ApprovedActor, Backdrop, C, Calendar, Camera, Label, Prop, Radio, Scene, ShelfItem, SurfaceShadow, asset, dissolve, ease, lerp, pan, previous, reveal} from "./visuals";
import {BackpackWalk} from "./scenes-inicio";
import {cue, sceneLength, useLocalSeconds} from "./timing";

export const Agua: React.FC = () => {
  const t=useLocalSeconds(), casa=cue(4,"casa",.45), reserve=cue(4,"Reserva agua",2.98), liters=cue(4,"cuatro litros",4.82), hygiene=cue(4,"higiene",8.43);
  const jug=reveal(t,reserve-.18,.73), comparison=reveal(t,casa+.15,.63)*dissolve(t,liters+.5,.58);
  return <Scene>
    <Camera scale={pan(t,sceneLength(4),1.035,1.075)} x={pan(t,sceneLength(4),14,-16)}>
      <Backdrop src={asset("despensa-reservas.png")} dark={.12}/>
      <ApprovedActor t={t} pose={t<reserve?"04_pensando.png":"01_neutral.png"} x={676} y={709} width={390}/>
      <AbsoluteFill style={{clipPath:"inset(65.3% 0 0)"}}><Backdrop src={asset("despensa-reservas.png")} dark={.12}/></AbsoluteFill>
      <SurfaceShadow x={127} y={1517} width={525} opacity={jug*.68}/>
      <Prop file="garrafon-4l.png" x={lerp(576,87,jug)} y={lerp(975,867,jug)} width={620} height={710} style={{opacity:jug,rotate:`${lerp(-9,0,jug)}deg`}}/>
      <SurfaceShadow x={768} y={1513} width={230} opacity={comparison*.65}/>
      <Prop file="botella-portatil.png" x={770} y={1178} width={175} height={377} style={{opacity:comparison,translate:`0px ${lerp(40,0,comparison)}px`}}/>
      <Label top={1058} left={721} width={295} size={40} opacity={comparison}>Para llevar</Label>
      <Label top={606} size={112} opacity={reveal(t,liters-.04,.42)} color={C.gold}>≈ 4 L</Label>
      <Label top={733} size={52} opacity={reveal(t,liters+.28,.45)}>Por persona al día</Label>
      <Label top={811} size={42} opacity={reveal(t,hygiene-.88,.45)}>Beber, cocinar e higiene básica</Label>
    </Camera>
  </Scene>;
};

const jugSlots = [[97,1009],[332,1010],[567,1008],[799,1009],[217,1230],[456,1228],[691,1226]];

export const Reserva: React.FC = () => {
  const t=useLocalSeconds(), days=cue(5,"siete días",.3), liters=cue(5,"veintiocho litros",2.48), food=cue(5,"alimentos",4.89), opener=cue(5,"abrelatas",6.54), blankets=cue(5,"cobijas",7.72), meds=cue(5,"medicinas",8.47);
  const stocked=reveal(t,food-.5,.51);
  return <Scene>
    <Camera scale={1.035+.025*stocked} x={lerp(-8,15,stocked)}>
      <Backdrop src={asset("despensa-reservas.png")} dark={.11}/>
      <AbsoluteFill style={{opacity:1-stocked}}>
        <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 64%,#122b3b55,transparent 61%)"}}/>
        {jugSlots.map(([x,y],i)=>{
          const at=days+i*.27, p=reveal(t,at,.44);
          const finalY=y+lerp(42,0,p);
          return <React.Fragment key={i}>
            <SurfaceShadow x={x+30} y={y+235} width={175} opacity={p*.62}/>
            <Prop file="garrafon-4l.png" x={x} y={finalY} width={205} height={266} style={{opacity:p,scale:lerp(.78,1,p),transformOrigin:"50% 90%"}}/>
            <Label left={x+16} top={y+182} width={174} size={36} opacity={p}>≈ 4 L</Label>
          </React.Fragment>;
        })}
        <Label top={650} size={108} color={C.gold} opacity={reveal(t,liters-.12,.52)}>≈ 28 L</Label>
        <Label top={772} size={49} opacity={reveal(t,liters+.24,.39)}>Por persona para 7 días</Label>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity:stocked}}>
        <ApprovedActor t={t} x={613} y={721} width={410} pose={t<opener?"04_pensando.png":"01_neutral.png"}/>
        <AbsoluteFill style={{clipPath:"inset(65.3% 0 0)"}}><Backdrop src={asset("despensa-reservas.png")} dark={.11}/></AbsoluteFill>
        <ShelfItem src={previous("provisiones-selladas.png")} x={38} y={1113} width={550} height={395} time={t} at={food}/>
        <ShelfItem file="abrelatas-manual.png" x={359} y={1337} width={350} height={200} time={t} at={opener}/>
        <ShelfItem file="cobijas.png" x={607} y={1145} width={440} height={374} time={t} at={blankets}/>
        <ShelfItem file="botiquin-medicinas.png" x={716} y={1344} width={340} height={239} time={t} at={meds}/>
        <Label top={543} size={55} opacity={reveal(t,food-.2,.4)}>Reservas del hogar</Label>
      </AbsoluteFill>
    </Camera>
  </Scene>;
};

export const Revision: React.FC = () => {
  const t=useLocalSeconds(), clean=cue(6,"bolsas de basura",.56), battery=cue(6,"baterías",2.73), radio=cue(6,"radio",3.48), baby=cue(6,"niños",5.46), pet=cue(6,"mascotas",5.96), check=cue(6,"revisarse",8.22);
  const details=reveal(t,baby-.78,.55), review=reveal(t,check-.82,.58);
  return <Scene>
    <Camera scale={1.038+.045*review} x={lerp(13,-10,reveal(t,battery,1.35))}>
      <Backdrop src={asset("despensa-reservas.png")} dark={.11}/>
      <ApprovedActor t={t} x={614} y={716} width={410} pose={t<radio?"01_neutral.png":"04_pensando.png"}/>
      <AbsoluteFill style={{clipPath:"inset(65.3% 0 0)"}}><Backdrop src={asset("despensa-reservas.png")} dark={.11}/></AbsoluteFill>
      <AbsoluteFill style={{opacity:(1-details)*(1-review)}}>
        <ShelfItem file="saneamiento.png" x={52} y={1105} width={390} height={422} time={t} at={clean}/>
        <ShelfItem file="baterias.png" x={454} y={1328} width={215} height={210} time={t} at={battery}/>
        <div style={{opacity:reveal(t,radio-.08,.48)}}><Radio t={t} x={603} y={1214} width={412}/></div>
        <Label top={675} left={64} width={510} size={50} opacity={reveal(t,clean+.1,.43)}>Higiene y saneamiento</Label>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity:details*(1-review)}}>
        <ShelfItem file="suministros-bebe.png" x={57} y={1105} width={478} height={450} time={t} at={baby-.2}/>
        <ShelfItem file="suministros-mascota.png" x={539} y={1160} width={462} height={402} time={t} at={pet-.13}/>
        <Label top={989} left={63} width={438} size={51} opacity={reveal(t,baby,.31)}>Niños</Label>
        <Label top={989} left={558} width={438} size={51} opacity={reveal(t,pet,.31)}>Mascotas</Label>
      </AbsoluteFill>
      <Calendar time={t} start={check-.8} x={187} y={947} width={720} review/>
      <Label top={656} size={50} opacity={review}>Caducidades y funcionamiento</Label>
    </Camera>
  </Scene>;
};

export const Cierre: React.FC = () => {
  const t=useLocalSeconds(), leave=cue(7,"evacuar",2.08), stay=cue(7,"reservas",2.9), final=cue(7,"Tu familia",5.48), ending=sceneLength(7);
  const right=reveal(t,stay-.28,.64), joined=reveal(t,final-.1,.54);
  const split=lerp(1100,523,right);
  return <Scene>
    <Camera scale={1.038} x={pan(t,ending,13,-13)}>
      <Backdrop src={previous("edificio-concreto.png")} dark={.12}/>
      <BackpackWalk t={t} x={lerp(-112,82,reveal(t,leave-.8,1.7))} y={930} width={447}/>
      <Label top={681} left={68} width={423} size={58} opacity={reveal(t,leave-.22,.32)*(1-joined)}>Evacuar</Label>
    </Camera>
    <AbsoluteFill style={{clipPath:`polygon(${split+62}px 0,100% 0,100% 100%,${split-45}px 100%)`}}>
      <Camera scale={1.04}>
        <Backdrop src={asset("despensa-reservas.png")} dark={.15}/>
        <Prop file="familia-en-casa.png" x={520} y={699} width={511} height={718} style={{translate:`${lerp(82,0,right)}px 0px`}}/>
        <AbsoluteFill style={{clipPath:"inset(65.3% 0 0)"}}><Backdrop src={asset("despensa-reservas.png")} dark={.15}/></AbsoluteFill>
        <Prop file="garrafon-4l.png" x={582} y={1267} width={196} height={279}/>
        <Prop src={previous("provisiones-selladas.png")} x={720} y={1293} width={305} height={227}/>
        <Label top={545} left={567} width={441} size={56} opacity={right*(1-joined)}>Permanecer<br/>en casa</Label>
      </Camera>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity:right*(1-joined),pointerEvents:"none"}}>
      <svg width="1080" height="1920"><path d={`M${split+62} 0L${split-45} 1920`} stroke="#f6cc7c" strokeWidth="4" opacity=".82"/></svg>
    </AbsoluteFill>
    <Camera scale={1.045+.041*reveal(t,final,.95)} opacity={joined}>
      <Backdrop src={asset("despensa-reservas.png")} dark={.2}/>
      <Prop file="familia-en-casa.png" x={657} y={689} width={402} height={641}/>
      <ApprovedActor t={t} x={158} y={378} width={724}/>
      <AbsoluteFill style={{clipPath:"inset(65.3% 0 0)"}}><Backdrop src={asset("despensa-reservas.png")} dark={.2}/></AbsoluteFill>
      <SurfaceShadow x={112} y={1492} width={305}/>
      <Prop file="mochila-cerrada.png" x={79} y={1130} width={370} height={399}/>
      <Label top={313} size={42} opacity={reveal(t,final+.56,.45)}>Sigue las indicaciones oficiales</Label>
      <AbsoluteFill style={{background:"radial-gradient(ellipse at 58% 36%,#fbc16f20,transparent 54%)",opacity:interpolate(t,[final,ending],[0,.85],ease),pointerEvents:"none"}}/>
    </Camera>
  </Scene>;
};

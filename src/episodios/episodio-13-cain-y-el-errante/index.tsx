import React from "react";
import {Audio} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import timeline from "./timeline.json";
import captionData from "./captions.json";
import {Cierre, Comparacion, Condena, Genesis, Leyenda, Manuscrito} from "./scenes";
import {fade, move, paper} from "./visuals";

const scenes=[Condena,Leyenda,Genesis,Comparacion,Manuscrito,Cierre];
const pages:Caption[][]=[];
let batch:Caption[]=[];
for(const word of captionData as Caption[]){
  batch.push(word);
  if(word.pageBreakAfter){
    pages.push(batch);
    batch=[];
  }
}

const Subtitulos:React.FC<{time:number}>=({time})=>{
  const ms=time*1000;
  const page=pages.find(words=>ms>=words[0].startMs && ms<words[words.length-1].endMs+36);
  if(!page)return null;
  return <div style={{position:"absolute",left:87,top:144,width:856,textAlign:"center",textWrap:"balance",fontFamily:"Arial, sans-serif",fontSize:50,lineHeight:1.13,fontWeight:800,color:paper,textShadow:"0 4px 10px #141423,0 0 24px #13101a",WebkitTextStroke:"1.5px #16131f",paintOrder:"stroke fill"}}>
    {page.map(word=><span key={word.startMs} style={{color:ms>=word.startMs?paper:"#d0cbbf"}}>{word.text}</span>)}
  </div>;
};

export const Episodio13CainYElErrante:React.FC<{externalAudio?:boolean}>=({externalAudio=false})=>{
  const {fps}=useVideoConfig();
  const time=useCurrentFrame()/fps;
  const duration=.61;
  return <AbsoluteFill style={{backgroundColor:"#232c3b",overflow:"hidden"}}>
    {!externalAudio && timeline.audioReady && <Audio src={staticFile("episodio-13/audio/mezcla_final_70s.wav")} />}
    {timeline.stages.map((stage,i)=>{
      const Scene=scenes[i];
      const transitionStart=stage.start-.11;
      const end=stage.end+duration;
      if(time<Math.max(transitionStart,0)||time>=end)return null;
      const opacity=i===0?1:move(time,transitionStart,transitionStart+duration);
      const t=Math.max(0,Math.min(time-stage.start,stage.end-stage.start-.002));
      return <AbsoluteFill key={stage.name} style={{opacity}}>
        <Scene t={t} global={time} length={stage.end-stage.start} start={stage.start} cues={timeline.cues} title={stage.name}/>
      </AbsoluteFill>;
    })}
    {timeline.stages.slice(1).map((stage,i)=>{
      const opacity=fade(time,stage.start-.12,stage.start+.50,.23)*.16;
      return opacity>0?<AbsoluteFill key={stage.name} style={{pointerEvents:"none",opacity,background:i===3?"#ebc896":"#b1acb6"}}/>:null;
    })}
    <Subtitulos time={time}/>
  </AbsoluteFill>;
};

import React from 'react';
import {Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {captions} from './captions';
import {asset,clamp} from './art';

const VoiceClip:React.FC<{index:number}>=({index})=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const ms=f/fps*1000;
 const pages:typeof captions[number][]=[],words=captions[index];let page:typeof words=[];
 for(let i=0;i<words.length;i++){
  const w=words[i];page.push(w);const next=words[i+1];
  if(page.length>=5||/[.?!:;]$/.test(w.text)||!next||next.startMs-w.endMs>380||(page.length>=3&&page.map(x=>x.text).join('').length>28)){pages.push(page);page=[];}
 }
 const active=pages.find(a=>a[0].startMs<=ms&&a[a.length-1].endMs+80>ms);
 return <><Audio src={asset(`voz-${String(index+1).padStart(2,'0')}.wav`)} premountFor={fps}/>{active&&<div style={{position:'absolute',left:78,right:154,bottom:354,textAlign:'center',opacity:clamp((ms-active[0].startMs)/60),translate:`0 ${8*(1-clamp((ms-active[0].startMs)/110))}px`,display:'flex',justifyContent:'center'}}><div style={{padding:'15px 25px',borderRadius:15,background:'rgba(42,34,29,.86)',color:'#fff5df',fontFamily:'Arial,sans-serif',fontSize:49,lineHeight:1.16,fontWeight:700,textShadow:'0 2px 3px #211b17'}}>{active.map(w=>w.text).join('').trim()}</div></div>}</>;
};
export const Narration:React.FC=()=>{
 const{fps}=useVideoConfig();
 return <>
  <Sequence name="Voz · Gancho" from={0} durationInFrames={206} premountFor={fps}><VoiceClip index={0}/></Sequence>
  <Sequence name="Voz · Proyecciones" from={217} durationInFrames={287} premountFor={fps}><VoiceClip index={1}/></Sequence>
  <Sequence name="Voz · Costos" from={521} durationInFrames={326} premountFor={fps}><VoiceClip index={2}/></Sequence>
  <Sequence name="Voz · Seguridad" from={855} durationInFrames={262} premountFor={fps}><VoiceClip index={3}/></Sequence>
  <Sequence name="Voz · Oferta" from={1136} durationInFrames={274} premountFor={fps}><VoiceClip index={4}/></Sequence>
  <Sequence name="Voz · Ejemplo" from={1434} durationInFrames={296} premountFor={fps}><VoiceClip index={5}/></Sequence>
  <Sequence name="Voz · Pronóstico y pregunta" from={1763} durationInFrames={337} premountFor={fps}><VoiceClip index={6}/></Sequence>
 </>;
};

import React from 'react';
import {Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {captions} from './captions';
import {asset,clamp} from './art';
const Clip:React.FC<{index:number}>=({index})=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const ms=f/fps*1000;
 const pages:typeof captions[number][]=[],words=captions[index];let page:typeof words=[];
 for(let i=0;i<words.length;i++){
  const w=words[i];page.push(w);const next=words[i+1];
  if(page.length>=5||/[.?!:;]$/.test(w.text)||!next||next.startMs-w.endMs>380||(page.length>=3&&page.map(s=>s.text).join('').length>27)){pages.push(page);page=[];}
 }
 const active=pages.find(s=>s[0].startMs<=ms&&s[s.length-1].endMs+90>ms);
 return <><Audio src={asset(`voz-${String(index+1).padStart(2,'0')}.wav`)} premountFor={fps}/>{active&&<div style={{position:'absolute',left:82,right:150,bottom:315,textAlign:'center',display:'flex',justifyContent:'center',opacity:clamp((ms-active[0].startMs)/60),translate:`0 ${7*(1-clamp((ms-active[0].startMs)/100))}px`}}><div style={{padding:'15px 25px',borderRadius:16,fontFamily:'Arial,sans-serif',fontWeight:700,fontSize:49,lineHeight:1.17,color:'#fff5de',background:'rgba(13,37,49,.89)',textShadow:'0 2px 3px #102a35'}}>{active.map(w=>w.text).join('').trim()}</div></div>}</>;
};
export const Narration:React.FC=()=>{
 const{fps}=useVideoConfig();return <>
 <Sequence name="Voz · El pez completo" from={0} durationInFrames={Math.ceil(6.38*fps)} premountFor={fps}><Clip index={0}/></Sequence>
 <Sequence name="Voz · Clavus" from={7.8*fps} durationInFrames={Math.ceil(10.92*fps)} premountFor={fps}><Clip index={1}/></Sequence>
 <Sequence name="Voz · Dos aletas" from={19*fps} durationInFrames={Math.ceil(8.1*fps)} premountFor={fps}><Clip index={2}/></Sequence>
 <Sequence name="Voz · Inmersiones" from={28.6*fps} durationInFrames={Math.ceil(9.22*fps)} premountFor={fps}><Clip index={3}/></Sequence>
 <Sequence name="Voz · Alimentación" from={39*fps} durationInFrames={Math.ceil(8.92*fps)} premountFor={fps}><Clip index={4}/></Sequence>
 <Sequence name="Voz · Superficie" from={49*fps} durationInFrames={Math.ceil(9.06*fps)} premountFor={fps}><Clip index={5}/></Sequence>
 <Sequence name="Voz · Evolución" from={59*fps} durationInFrames={Math.ceil(6.48*fps)} premountFor={fps}><Clip index={6}/></Sequence>
 <Sequence name="Voz · Pregunta" from={66.8*fps} durationInFrames={3.2*fps} premountFor={fps}><Clip index={7}/></Sequence>
 <Audio src={asset('musica-submarina-original.wav')} premountFor={fps}/>
 <Audio src={asset('ambiente-oceano-original.wav')} premountFor={fps}/>
 </>;
};

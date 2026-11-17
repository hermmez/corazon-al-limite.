import React,{useMemo} from 'react';
import {Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {captions} from './captions';
import {asset,clamp} from './art';
const Clip:React.FC<{index:number}>=({index})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();const ms=f/fps*1000;
 const pages=useMemo(()=>{const result:typeof captions[number][]=[],words=captions[index];let page:typeof words=[];
 const push=()=>{if(page.length)result.push(page);page=[];};
 for(let i=0;i<words.length;i++){const w=words[i];
  if(page.length&&(page.length>=5||[...page,w].map(x=>x.text).join(' ').length>34)){
   const tail=page[page.length-1];if(page.length>2&&/^(un|una|de|a|y|que|su|sus|el|la|en|por|cada)$/i.test(tail.text)){page.pop();push();page=[tail];}else push();
  }page.push(w);const next=words[i+1];if(/[.?!:;]$/.test(w.text)||!next||next.startMs-w.endMs>350)push();
 }push();return result;},[index]);
 const active=pages.find(s=>s[0].startMs<=ms&&s[s.length-1].endMs>ms);
 return <><Audio src={asset(`voz-${String(index+1).padStart(2,'0')}.wav`)} premountFor={fps}/>{active&&<div style={{position:'absolute',left:82,right:150,bottom:315,textAlign:'center',display:'flex',justifyContent:'center',opacity:clamp((ms-active[0].startMs+1000/fps)/70)}}><div style={{padding:'15px 25px',borderRadius:16,fontFamily:'Arial,sans-serif',fontWeight:700,fontSize:49,lineHeight:1.18,color:'#fff3dc',background:'rgba(46,37,33,.91)'}}>{active.map(w=>w.text).join(' ')}</div></div>}</>;
};
export const Narration=()=>{const{fps}=useVideoConfig();return <>
 <Sequence name="Voz · Diez mil hienas" from={0} durationInFrames={Math.ceil(7.58*fps)} premountFor={fps}><Clip index={0}/></Sequence>
 <Sequence name="Voz · Cartón" from={8*fps} durationInFrames={Math.ceil(8.74*fps)} premountFor={fps}><Clip index={1}/></Sequence>
 <Sequence name="Voz · Familia" from={18*fps} durationInFrames={Math.ceil(6.7*fps)} premountFor={fps}><Clip index={2}/></Sequence>
 <Sequence name="Voz · Valentía" from={28*fps} durationInFrames={Math.ceil(9.45*fps)} premountFor={fps}><Clip index={3}/></Sequence>
 <Sequence name="Voz · Ratoncitos" from={38*fps} durationInFrames={Math.ceil(8.41*fps)} premountFor={fps}><Clip index={4}/></Sequence>
 <Sequence name="Voz · Arqueros" from={47*fps} durationInFrames={Math.ceil(7.68*fps)} premountFor={fps}><Clip index={5}/></Sequence>
 <Sequence name="Voz · Jinetes" from={56*fps} durationInFrames={Math.ceil(7.64*fps)} premountFor={fps}><Clip index={6}/></Sequence>
 <Sequence name="Voz · Final abierto" from={65*fps} durationInFrames={Math.ceil(4.952654*fps)} premountFor={fps}><Clip index={7}/></Sequence>
 <Audio src={asset('musica-medieval-original.wav')} premountFor={fps}/>
 <Audio src={asset('ambiente-original.wav')} premountFor={fps}/>
 </>;};

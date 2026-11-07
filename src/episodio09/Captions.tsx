import React from 'react';
import type {Caption} from '@remotion/captions';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import cues from './captions.json';

// startMs/endMs son absolutos en el máster. La guía se reemplaza con el audio real.
export const Captions:React.FC<{scene:number;start:number}>=({scene,start})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const now=(f+start)/fps*1000;
 const cue:(Caption & {scene:number})|undefined=cues.find(c=>c.scene===scene&&c.startMs<=now&&c.endMs>now);
 if(!cue)return null;
 return <div style={{position:'absolute',left:65,right:65,top:1685,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
  <div style={{background:'#03121bed',boxShadow:'0 5px 22px #0007',borderRadius:14,border:'1px solid #91c6bb44',padding:'19px 27px',maxWidth:950,color:'#fff8e9',fontFamily:'Arial, sans-serif',fontWeight:700,fontSize:43,lineHeight:1.2,textAlign:'center',whiteSpace:'pre-line'}}>{cue.text}</div>
 </div>;
};

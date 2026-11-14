import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease,Family} from './art';
import {Narration,Reveal} from './shared';

export const Scene3:React.FC=()=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;const empty=ease(t,5.6,7.2);
 return <AbsoluteFill><Reveal direction="left"><AbsoluteFill style={{translate:`${-12+ease(t,0,5.5)*24}px 0`,scale:1.025,filter:`saturate(${1-empty*.4})`}}><Family t={t+1.5} empty={empty} worried={t>7}/></AbsoluteFill><AbsoluteFill style={{background:`linear-gradient(120deg,transparent,#a9adb1${Math.round(empty*35).toString(16).padStart(2,'0')})`}}/></Reveal><Narration scene={2}/></AbsoluteFill>;
};

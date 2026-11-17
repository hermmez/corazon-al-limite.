import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {SVG,Backdrop,Ground,Tank,Missile,C,ease,lerp} from './Art';
import {GeoMap} from './Maps';
export const Scene4=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;return <SVG><Backdrop t={t}/><g opacity={1-ease(t,4,4.5)}><Ground t={t}/><Tank t={t} x={lerp(t,0,3.7,170,750)} y={1160} s={1.35}/><Tank t={t+.4} x={lerp(t,0,4,-180,370)} y={1330} s={.8}/><Missile t={t} x={lerp(t,2.5,4.2,-250,1280)} y={lerp(t,2.5,4.2,720,520)} s={.85} angle={73}/></g>
 <g opacity={ease(t,4,4.5)*(1-ease(t,7.5,7.85))}><GeoMap t={t} region="middleEast" y={610} h={760}/></g>
 <g opacity={ease(t,7.5,7.85)}><GeoMap t={t} region="asia" y={610} h={760}/></g>
 <g opacity={ease(t,4,4.5)*(1-ease(t,10.3,10.6))}><Tank t={t} x={lerp(t,4,10.6,180,1180)} y={1345} s={.65}/></g>
 {t>4&&<text x="540" y="480" fill={C.cream} stroke="none" fontFamily="Arial" textAnchor="middle" fontSize="31" letterSpacing="3">TENSIONES · ESCENARIOS ABIERTOS</text>}
 {[0,1,2].map(i=><path key={i} d={`M-50 ${lerp(t,10.5,11,1950,300)+i*90}Q250 ${lerp(t,10.5,11,1800,150)+i*90} 550 ${lerp(t,10.5,11,1950,300)+i*90}T1180 ${lerp(t,10.5,11,1950,300)+i*90}V1920H-50Z`} fill={i%2?C.tealDark:C.teal} stroke="none"/>)}</SVG>};

import React from 'react';
import {AbsoluteFill,Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {asset,p} from './art';
import {Narration} from './audio';
import {MeatHook} from './Scene1';
import {MeatForecasts} from './Scene2';
import {ProductionCosts} from './Scene3';
import {RouteSecurity} from './Scene4';
import {InternationalSupply} from './Scene5';
import {PriceExample} from './Scene6';
import {ForecastAndQuestion} from './Scene7';

const Enter:React.FC<{children:React.ReactNode;kind?:'wipe'|'iris'|'cut'}>=({children,kind='wipe'})=>{
 const f=useCurrentFrame();const{fps}=useVideoConfig();const v=p(f/fps,0,.32);
 return <AbsoluteFill style={{clipPath:kind==='cut'?undefined:kind==='iris'?`circle(${v*1500}px at 50% 55%)`:`inset(0 ${(1-v)*100}% 0 0)`}}>{children}</AbsoluteFill>;
};

export const CarneMexico2027:React.FC=()=>{
 const{fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#e9d7b4',overflow:'hidden'}}>
  <Sequence name="01 · Gancho y carnicería" from={0} durationInFrames={7*fps+12} premountFor={fps}><MeatHook/></Sequence>
  <Sequence name="02 · Proyecciones Comecarne" from={7*fps} durationInFrames={10*fps+12} premountFor={fps}><Enter kind="iris"><MeatForecasts/></Enter></Sequence>
  <Sequence name="03 · Costos y cadena fría" from={17*fps} durationInFrames={10*fps+12} premountFor={fps}><Enter><ProductionCosts/></Enter></Sequence>
  <Sequence name="04 · Seguridad en la ruta" from={27*fps} durationInFrames={10*fps+12} premountFor={fps}><Enter kind="cut"><RouteSecurity/></Enter></Sequence>
  <Sequence name="05 · Oferta internacional" from={37*fps} durationInFrames={10*fps+12} premountFor={fps}><Enter kind="iris"><InternationalSupply/></Enter></Sequence>
  <Sequence name="06 · Ejemplo de $250 a $265" from={47*fps} durationInFrames={11*fps+12} premountFor={fps}><Enter><PriceExample/></Enter></Sequence>
  <Sequence name="07 · Pronóstico y participación" from={58*fps} durationInFrames={12*fps} premountFor={fps}><Enter kind="cut"><ForecastAndQuestion/></Enter></Sequence>
  <Narration/>
  <Audio src={asset('musica-original.wav')} premountFor={fps}/>
  <Audio src={asset('ambiente-y-efectos.wav')} premountFor={fps}/>
 </AbsoluteFill>;
};

import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {captions} from './captions';
import {Actor, asset, clamp, ease, FamilyPhoto, Phone, Room} from './art';

export const Narration: React.FC<{scene:number}> = ({scene}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const ms=frame/fps*1000;
  const words=captions[scene];
  const pages: typeof words[]=[]; let page: typeof words=[];
  words.forEach((w,i)=>{
    page.push(w);
    const next=words[i+1];
    if(page.length>=5 || /[.?!:»]$/.test(w.text) || !next || next.startMs-w.endMs>350 || (page.length>=3&&page.map(x=>x.text).join('').length>28)) {pages.push(page);page=[];}
  });
  const current=pages.find(p=>ms>=p[0].startMs && ms<p[p.length-1].endMs+120);
  return <>
    <Audio src={asset(`voz-${String(scene+1).padStart(2,'0')}.wav`)} premountFor={fps}/>
    {current && <div style={{position:'absolute',left:76,right:153,bottom:365,display:'flex',justifyContent:'center',opacity:clamp((ms-current[0].startMs)/80),translate:`0 ${12*(1-clamp((ms-current[0].startMs)/130))}px`}}>
      <div style={{maxWidth:850,padding:'15px 25px',borderRadius:16,background:'rgba(37,29,28,.79)',boxShadow:'0 3px 16px #21171328',fontFamily:'Arial, sans-serif',fontWeight:700,fontSize:50,lineHeight:1.16,textAlign:'center',color:'#fff7e8',textShadow:'0 2px 4px #211916'}}>{current.map(w=>w.text).join('').trim()}</div>
    </div>}
  </>;
};

export const Reveal: React.FC<{children:React.ReactNode;direction?:'left'|'right'}> = ({children,direction='right'}) => {
 const f=useCurrentFrame();const{fps}=useVideoConfig();const p=ease(f/fps,0,.35);
 return <AbsoluteFill style={{clipPath:`inset(0 ${direction==='right'?0:(1-p)*100}% 0 ${direction==='right'?(1-p)*100:0}%)`}}>{children}</AbsoluteFill>;
};

export const Office: React.FC<{t:number;night?:number;mood?:'neutral'|'happy'|'worried'|'tired';phoneMode?:'ring'|'missed'|'calling'|'connected';typing?:boolean;photoLight?:number}> = ({t,night=0,mood='neutral',phoneMode='ring',typing=true,photoLight=0}) => <AbsoluteFill>
  <Room kind="office" night={night}/>
  <Actor x={230} y={472} width={640} t={t} mood={mood} nod={(typing?Math.sin(t*2.3)*2.4:0)-night*2.5+photoLight*5} arm={typing?Math.sin(t*8)*1.2:0}/>
  <div style={{position:'absolute',inset:0,clipPath:'inset(67.3% 0 0 0)'}}><Img src={asset('oficina.png')} style={{position:'absolute',width:1120,height:1992,left:-20,top:-36,objectFit:'cover'}}/><AbsoluteFill style={{background:'#0e2242',opacity:night*.6,mixBlendMode:'multiply'}}/></div>
  <FamilyPhoto t={t} style={{left:866,top:1192,width:153,height:132,padding:5,paddingBottom:13,rotate:'8deg',transform:'scale(.68)',transformOrigin:'top left'}}/>
  <div style={{position:'absolute',left:855,top:1160,width:180,height:200,borderRadius:'50%',background:`radial-gradient(ellipse,#ffd999${Math.round(photoLight*90).toString(16).padStart(2,'0')},transparent 70%)`}}/>
  <Phone t={t} mode={phoneMode} style={{left:682,top:1353,scale:.47,rotate:'13deg',transformOrigin:'top left'}}/>
  {typing && <div style={{position:'absolute',left:335,top:780,width:330,height:470,background:'linear-gradient(25deg,#a9e1e000,rgba(170,220,221,.08),transparent)',opacity:.5+.2*Math.sin(t*7),mixBlendMode:'screen',clipPath:'polygon(0 90%,20% 0,100% 0,100% 100%)'}}/>}
</AbsoluteFill>;

export const Clock: React.FC<{t:number}> = ({t}) => <svg width="168" height="168" viewBox="0 0 168 168" style={{position:'absolute',top:255,left:115,filter:'drop-shadow(2px 4px 4px #1b1c2644)'}}><circle cx="84" cy="84" r="76" fill="#eee2cc" stroke="#5e4637" strokeWidth="9"/>{Array.from({length:12},(_,i)=><path key={i} d="M84 18 L84 25" stroke="#715b4d" strokeWidth="4" transform={`rotate(${i*30} 84 84)`}/>)}<path d="M84 86 L84 43" stroke="#4b4140" strokeWidth="7" strokeLinecap="round" transform={`rotate(${t*130} 84 84)`}/><path d="M84 86 L84 57" stroke="#4b4140" strokeWidth="8" strokeLinecap="round" transform={`rotate(${130+t*15} 84 84)`}/><circle cx="84" cy="84" r="6" fill="#ac6c49"/></svg>;

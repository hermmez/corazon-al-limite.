import React,{useId} from 'react';
import {staticFile} from 'remotion';
import {clamp} from './art';

/** Approved face/body PNGs, with separate waist, shoulder, elbow and neck pivots.
 * Legs stay planted. Neither walking nor arm gestures translate the whole PNG.
 */
export const Buyer:React.FC<{x:number;y:number;width?:number;t:number;reach?:number;right?:number;surprise?:number;look?:number;lean?:number}>=({x,y,width=420,t,reach=0,right=0,surprise=0,look=0,lean=0})=>{
 const id=useId().replace(/:/g,'');
 const neutral=staticFile('imagenes/personajes/01_neutral.png');
 const surprised=staticFile('imagenes/personajes/11_sorprendido.png');
 const head='M350 0 H640 L650 155 L630 225 L600 265 L566 335 L448 335 L414 282 L380 235 L353 178Z';
 const upperL='266,378 377,351 399,365 381,473 370,558 363,627 315,650 266,621 259,577 265,533 280,452';
 const lowerL='257,591 366,602 359,646 349,700 329,765 313,809 330,854 335,884 328,914 315,931 314,944 302,965 282,963 255,944 238,925 235,895 240,850 244,816 249,762 254,708 257,643';
 const upperR='638,354 679,371 728,467 754,533 748,576 767,636 734,660 694,638 681,590 653,544 641,467';
 const lowerR='691,600 762,601 774,674 785,803 792,872 790,900 770,950 733,968 701,938 702,908 712,875 729,831 710,761 694,691';
 const img=<image href={neutral} width="1024" height="1536"/>;
 const blink=(t%3.3)>3.12?Math.sin(((t%3.3)-3.12)/.18*Math.PI):0;
 return <svg viewBox="220 0 600 1536" style={{position:'absolute',left:x,top:y,width,height:width*1536/600,overflow:'visible'}}>
 <defs>
  <clipPath id={`${id}legs`}><rect x="200" y="790" width="640" height="746"/></clipPath>
  <clipPath id={`${id}torso`}><rect x="210" y="330" width="630" height="475"/></clipPath>
  <clipPath id={`${id}head`}><path d={head}/></clipPath>
  <clipPath id={`${id}ul`}><polygon points={upperL}/></clipPath><clipPath id={`${id}ll`}><polygon points={lowerL}/></clipPath>
  <clipPath id={`${id}ur`}><polygon points={upperR}/></clipPath><clipPath id={`${id}lr`}><polygon points={lowerR}/></clipPath>
  <mask id={`${id}body`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><rect width="1024" height="1536" fill="white"/><path d={head} fill="black"/>{[upperL,lowerL,upperR,lowerR].map((a,i)=><polygon key={i} points={a} fill="black"/>)}</mask>
 </defs>
 <g clipPath={`url(#${id}legs)`}><g mask={`url(#${id}body)`}>{img}</g></g>
 <g transform={`rotate(${lean} 512 795)`}>
  <g clipPath={`url(#${id}torso)`} transform={`translate(0 ${Math.sin(t*2.1)*1.2})`}><g mask={`url(#${id}body)`}>{img}</g></g>
  <g clipPath={`url(#${id}ul)`}>{img}</g><ellipse cx="315" cy="610" rx="30" ry="34" fill="#f7ad78"/>
  <g transform={`rotate(${reach*69} 315 610)`} clipPath={`url(#${id}ll)`}>{img}</g>
  <g clipPath={`url(#${id}ur)`}>{img}</g><ellipse cx="728" cy="622" rx="29" ry="33" fill="#f7ad78"/>
  <g transform={`rotate(${-right*51} 728 622)`} clipPath={`url(#${id}lr)`}>{img}</g>
  <g transform={`translate(0 ${Math.sin(t*2.1)*1.2}) rotate(${look} 510 328)`}>
   <g clipPath={`url(#${id}head)`}><image href={surprise>=.45?surprised:neutral} width="1024" height="1536"/></g>
   {blink>.1&&surprise<.4&&[453,535].map((cx,i)=><g key={i} opacity={clamp((blink-.1)*2)}><ellipse cx={cx} cy={191} rx="27" ry="31" fill="#f8b27b"/><path d={`M${cx-22} 191 Q${cx} 205 ${cx+22} 191`} fill="none" stroke="#48352d" strokeWidth="4" strokeLinecap="round"/></g>)}
  </g>
 </g></svg>;
};

export const ReceiptHand:React.FC<{progress:number}>=({progress})=>{
 const id=useId().replace(/:/g,'');const width=300;
 return <svg viewBox="225 500 150 475" style={{position:'absolute',width,height:width*475/150,left:895+450*(1-progress),top:1175+80*(1-progress),rotate:`${154-3*progress}deg`,transformOrigin:'50% 50%',overflow:'hidden',opacity:Math.min(1,progress*4)}}><defs><clipPath id={id}><polygon points="270,530 367,560 364,620 350,690 330,763 313,809 330,854 335,884 328,914 315,931 314,944 302,965 282,963 255,944 238,925 235,895 240,850 244,816 249,762 254,708 257,643 267,581"/></clipPath></defs><image href={staticFile('imagenes/personajes/01_neutral.png')} width="1024" height="1536" clipPath={`url(#${id})`}/></svg>;
};

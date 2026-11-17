import React,{useLayoutEffect,useRef} from 'react';
import {delayRender,continueRender,cancelRender} from 'remotion';
import {loadArt,imageCache} from './art';
import {hyenaParts} from './rigs';
const atlas:HTMLCanvasElement[]=[];
function poses(){
 if(atlas.length)return atlas;
 const image=imageCache.get('hiena-hierro.png')!;
 for(let phase=0;phase<8;phase++){
  const c=document.createElement('canvas');c.width=160;c.height=240;const ctx=c.getContext('2d')!;ctx.scale(160/1024,240/1536);
  ctx.drawImage(image,0,0,1024,1536);ctx.globalCompositeOperation='destination-out';
  for(const v of hyenaParts)ctx.fill(new Path2D(v.d));ctx.globalCompositeOperation='source-over';
  const step=Math.sin(phase*Math.PI/4);
  for(const v of hyenaParts){const angle=v.id==='leftLeg'?step*8:v.id==='rightLeg'?-step*8:v.id==='head'?step*1.1:v.id==='spear'?step*1.4:-step*1.3;
   ctx.save();ctx.translate(v.cx,v.cy);ctx.rotate(angle*Math.PI/180);ctx.translate(-v.cx,-v.cy);ctx.clip(new Path2D(v.d));ctx.drawImage(image,0,0,1024,1536);ctx.restore();
  }atlas.push(c);
 }return atlas;
}
/** Exactly 100×100 logical soldiers; camera culls offscreen instances.
 * Eight articulated gait poses are cached, not 10,000 separate illustrations.
 * Ordered 2D rows keep drawing cost and memory bounded on a 2-core renderer. */
export const Army:React.FC<{t:number;pan?:number;far?:boolean;opacity?:number}>=({t,pan=0,far=false,opacity=1})=>{
 const ref=useRef<HTMLCanvasElement>(null);
 useLayoutEffect(()=>{const handle=delayRender('Marcha de diez mil hienas');let stopped=false;
  loadArt().then(()=>{if(stopped)return;const ctx=ref.current!.getContext('2d')!;ctx.clearRect(0,0,1080,1920);const frames=poses();
   for(let row=0;row<100;row++){
    const d=row/99,h=(7+Math.pow(d,3)*175)*(far?.58:1),spacing=11+d*d*110;
    const y=(far?680:690)+(far?470:880)*Math.pow(d,1.6);
    for(let col=0;col<100;col++){
     const id=row*100+col,phase=(Math.floor(t*9)+row+col*3)%8;
     const x=540+(col-49.5)*spacing-pan+(row%2)*spacing*.5-t*3;
     if(x+h<0||x-h>1080)continue;
     ctx.globalAlpha=opacity*(.64+.36*d);ctx.drawImage(frames[phase],x-h/3,y-h-Math.abs(Math.sin(t*6+id))*.6,h*2/3,h);
    }
   }
  }).then(()=>continueRender(handle)).catch(cancelRender);return()=>{stopped=true;continueRender(handle);};
 },[t,pan,far,opacity]);
 return <foreignObject x="0" y="0" width="1080" height="1920"><canvas ref={ref} width={1080} height={1920} style={{width:1080,height:1920}}/></foreignObject>;
};

import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from "remotion";

export const W=1080;
export const H=1920;
export const ink="#151b24";
export const paper="#fff0d3";
export const gold="#f5c68c";
const root="episodio-13/ilustraciones/";
export const asset=(file:string)=>staticFile(root+file+".png");
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const ease=Easing.bezier(.33,.03,.21,1);
export const move=(time:number,start:number,end:number)=>interpolate(time,[start,end],[0,1],{...clamp,easing:ease});
export const fade=(time:number,start:number,end:number,duration=.55)=>move(time,start,start+duration)*(1-move(time,end-duration,end));
export const lerp=(a:number,b:number,f:number)=>a+(b-a)*f;
const styleFull={position:"absolute",inset:0,width:"100%",height:"100%"} as const;

export const Fondo:React.FC<{file:string;scale?:number;x?:number;y?:number;filter?:string;opacity?:number}> = ({file,scale=1.1,x=0,y=0,filter,opacity=1}) =>
  <Img src={asset(file)} style={{...styleFull,objectFit:"cover",transform:"translate("+x+"px,"+y+"px) scale("+scale+")",filter,opacity}} />;

export const Camara:React.FC<{children:React.ReactNode;scale?:number;x?:number;y?:number;origin?:string}> =
  ({children,scale=1,x=0,y=0,origin="center"})=><AbsoluteFill style={{transform:"translate("+x+"px,"+y+"px) scale("+scale+")",transformOrigin:origin}}>{children}</AbsoluteFill>;

type Character="viajero-medieval"|"cain"|"abel"|"jesus-leyenda";
type Joint={clip:string;origin:string};
type Puppet={foot:number;torso:string;back:Joint;front:Joint};
const rigs:Partial<Record<Character,Puppet>>={
  "viajero-medieval":{
    foot:.976,
    torso:"polygon(0 0,100% 0,100% 64%,65% 64%,52% 63%,40% 65%,0 68%)",
    back:{clip:"polygon(39% 60%,51% 61%,50% 69%,40% 78%,41% 97%,12% 98%,12% 85%,30% 75%)",origin:"47% 62%"},
    front:{clip:"polygon(44% 61%,65% 61%,65% 75%,92% 88%,92% 100%,56% 100%,47% 78%)",origin:"53% 62%"},
  },
  "cain":{
    foot:.986,
    torso:"polygon(0 0,100% 0,100% 63%,71% 64%,67% 69%,58% 70%,44% 72%,30% 72%,24% 69%,0 68%)",
    back:{clip:"polygon(31% 65%,51% 67%,44% 75%,36% 81%,36% 100%,10% 100%,10% 87%,18% 81%,25% 73%)",origin:"40% 68%"},
    front:{clip:"polygon(44% 66%,62% 65%,64% 78%,72% 89%,88% 94%,89% 100%,56% 100%,56% 89%,46% 77%)",origin:"54% 68%"},
  },
};

export const Figura:React.FC<{who:Character;x:number;y:number;h:number;time:number;walk?:number;direction?:1|-1;opacity?:number;light?:string;lean?:number}> =
({who,x,y,h,time,walk=0,direction=1,opacity=1,light,lean=0})=>{
  const rig=rigs[who];
  const w=h*2/3;
  const phase=time*(walk>.1? 6.4:3.5);
  const step=Math.sin(phase);
  const hop=Math.abs(Math.cos(phase))*Math.min(7,h*.012)*walk;
  const feet=rig?.foot??.973;
  const frame={width:w,height:h,position:"absolute",left:x-w/2,top:y-feet*h-hop} as const;
  const picture={...styleFull,objectFit:"contain",pointerEvents:"none"} as const;
  const file=asset(who);
  const swing=(side:1|-1)=>step*side*13*walk;
  return <div style={{...frame,opacity,filter:light}}>
    <div style={{position:"absolute",bottom:(1-feet)*h-5,left:"22%",width:"55%",height:Math.max(8,h*.039),borderRadius:"50%",transform:"scaleX("+(.96+Math.cos(phase)*.05*walk)+")",background:"radial-gradient(ellipse,#17121acc 0%,#18131a66 52%,transparent 74%)"}} />
    <div style={{...styleFull,transform:"scaleX("+direction+") rotate("+((step*.65*walk)+lean)+"deg)",transformOrigin:"50% 93%"}}>
      {rig && walk>0 ? <>
        <Img src={file} style={{...picture,clipPath:rig.back.clip,transformOrigin:rig.back.origin,transform:"rotate("+swing(-1)+"deg)",filter:"brightness(.94)"}} />
        <Img src={file} style={{...picture,clipPath:rig.front.clip,transformOrigin:rig.front.origin,transform:"rotate("+swing(1)+"deg)"}} />
        <Img src={file} style={{...picture,clipPath:rig.torso,transformOrigin:"51% 66%",transform:"rotate("+(Math.sin(phase+.6)*.77*walk)+"deg)"}} />
      </> : <Img src={file} style={picture} />}
    </div>
  </div>;
};

const motes=Array.from({length:21},(_,i)=>({x:37*i*17%1130,y:71*i*31%1580,rad:1.25+i%5*.62,phase:i*.41}));
export const Atmosfera:React.FC<{time:number;warm?:boolean;amount?:number;smoke?:number}> = ({time,warm=false,amount=.7,smoke=.55})=><AbsoluteFill style={{pointerEvents:"none",opacity:amount}}>
  <div style={{...styleFull,background:"linear-gradient(180deg,#100f23a3 0%,transparent 26%,transparent 62%,#180f22a6 100%)"}} />
  <div style={{position:"absolute",left:-250,top:880+Math.sin(time*.37)*50,width:1510,height:570,opacity:smoke,
    background:warm?"radial-gradient(ellipse,#e5ae7659 0%,#dfb69426 38%,transparent 70%)":"radial-gradient(ellipse,#8abbce66 0%,#839cb740 38%,transparent 70%)",
    transform:"translateX("+Math.sin(time*.42)*115+"px) rotate(-9deg)"}} />
  <svg width={W} height={H} viewBox="0 0 1080 1920" style={{...styleFull,overflow:"hidden"}}>
    {motes.map(({x,y,rad,phase},i)=><ellipse key={i} cx={((x+time*(12+i%7))%1170)-44} cy={(y+285-time*(4+i%5)+2100)%1770+75} rx={rad*1.45} ry={rad} fill={warm?"#ffda9c":"#d0e7ee"} opacity={(.14+.22*Math.sin(time*.65+phase)**2)*(i%4===0?.8:1)} />)}
  </svg>
</AbsoluteFill>;

const typeface="Georgia, 'Times New Roman', serif";
export const Rotulo:React.FC<{children:React.ReactNode;y:number;opacity?:number;x?:number;width?:number;size?:number;color?:string;small?:string;align?:"center"|"left"|"right"}> =
({children,y,opacity=1,x=72,width=936,size=53,color=paper,small,align="center"})=><div style={{position:"absolute",left:x,top:y,width,opacity,transform:"translateY("+((1-opacity)*11)+"px)",color,textAlign:align,fontFamily:typeface,fontWeight:700,fontSize:size,lineHeight:1.06,textShadow:"0 4px 9px #14121e,0 0 19px #0d121d",WebkitTextStroke:"1.05px #171722",paintOrder:"stroke fill",letterSpacing:.7}}>
  {children}{small&&<div style={{fontFamily:"Arial,sans-serif",fontWeight:600,fontSize:Math.round(size*.57),lineHeight:1.17,letterSpacing:.45,marginTop:12,color:"#f7dfb9"}}>{small}</div>}
</div>;

export const TituloEtapa:React.FC<{children:string;time:number;at?:number;end?:number}> =({children,time,at=.25,end=2.75})=>{
  const show=fade(time,at,end,.43);
  return <div style={{position:"absolute",left:80,right:80,top:310,opacity:show,textAlign:"center",color:paper,fontFamily:typeface,fontWeight:700,fontSize:48,letterSpacing:2.1,textShadow:"0 5px 12px #191726,0 0 25px #121420"}}>
    <span style={{display:"inline-block",borderTop:"1px solid #e9ba7da6",borderBottom:"1px solid #e9ba7d7a",padding:"11px 24px 12px"}}>{children}</span>
  </div>;
};

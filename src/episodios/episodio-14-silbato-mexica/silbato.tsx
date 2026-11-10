import React from "react";

const edge="#291d21";
const clay="M-257,-117 Q-224,-150 -161,-155 L129,-151 Q192,-149 227,-112 L252,-57 Q276,1 241,39 L202,117 Q187,145 129,154 L-185,148 Q-229,148 -252,110 L-278,51 Q-295,-3 -268,-53Z";
const stops=(list:readonly [number,string][])=>list.map(([o,c])=><stop key={o} offset={o} stopColor={c}/>);
const specks=Array.from({length:31},(_,i)=>({x:i*47%118,y:i*29%83,r:.75+i%5*.4}));
export const Tintas:React.FC=()=> <defs>
  <linearGradient id="e14arcilla" x1="0" y1="0" x2="1" y2="1">{stops([[0,"#db9d6f"],[.24,"#b76e46"],[.5,"#8c513c"],[.73,"#5d3935"],[1,"#382731"]])}</linearGradient>
  <pattern id="e14poro" width="118" height="83" patternUnits="userSpaceOnUse">
    {specks.map(({x,y,r},i)=><g key={i}>
      <ellipse cx={x} cy={y} rx={r*1.5} ry={r*.86} fill={i%3===0?"#251e25":"#ebbd94"} opacity={.25+i%6*.045}/>
      {i%4===0&&<path d={"M"+x+" "+(y+3)+" l"+(r*4)+" -2"} stroke="#3a2a2b" opacity=".29" strokeWidth="1.1"/>}
    </g>)}
  </pattern>
</defs>;

const ceramicTexture="M-171,-160 q15,-7 41,-7 m27,9 q23,-9 51,-3 m166,-31 q25,13 41,30 m29,67 q14,17 17,46 m-34,58 q-15,37 -48,52 m-46,29 q-15,17 -41,23 m-172,-14 q11,16 33,29 m-57,-89 q1,21 15,34 m252,-268 q18,9 30,15 m30,65 q17,34 5,80 m-403,52 q12,15 25,25";

const Fracturas:React.FC=()=> <g fill="none" strokeLinecap="round">
  <path d="M136,-187 l-9,24 13,17 -5,16 23,12 M-17,-203 l-13,24 7,19 -11,15 M198,13 l-14,15 1,20 -24,11 -5,18 M-115,153 l21,2 7,16 13,7 M-222,-16 l16,-10 3,-10" stroke="#44312d" strokeWidth="2.1" opacity=".58"/>
  <path d="M141,-186 l-9,22 11,15 M-15,-202 l-12,21 7,16 M202,14 l-15,15 1,18 M-116,156 l20,2 7,16" stroke="#e1b18a" strokeWidth="1.05" opacity=".49"/>
  <path d={ceramicTexture} stroke="#e1b18a" opacity=".44" strokeWidth="2.6"/>
</g>;

export const Arcilla:React.FC<{opacity:number;tilt:number;molding:number}>=({opacity,tilt,molding})=> <g opacity={opacity} transform={"rotate("+tilt+") scale("+(1-.17*molding)+" "+(1+.16*molding)+")"}>
  <path d={clay} fill="#402932" transform="translate(0 13)" stroke="#251c22" strokeWidth="7"/>
  <path d={clay} fill="url(#e14arcilla)" stroke={edge} strokeWidth="5"/>
  <path d={clay} fill="url(#e14poro)" opacity=".82"/>
  <path d="M-249,-105 Q-139,-145 12,-142 Q157,-152 221,-109 L247,-56 Q217,-31 157,-28 Q42,-13 -63,-23 Q-183,-19 -263,-57Z" fill="#d88c59" opacity=".53"/>
  <path d="M-266,-57 Q-166,-11 -48,-21 Q80,-5 244,-55 M-258,13 Q-196,49 -124,46 M-243,53 Q-184,74 -140,70 M-188,125 Q-19,139 117,130 Q184,126 199,106" stroke="#f2af79" fill="none" strokeWidth="3.1" opacity=".46"/>
  <path d="M-173,-129 l18,10 7,16 27,11 M140,-105 l-18,21 -30,2 -11,10 M217,17 l-22,15 -15,-7 -19,10 M-132,82 l21,15 39,-1 28,12 M-247,83 l22,6 7,18" fill="none" stroke="#4c302d" strokeWidth="3.3" opacity=".53"/>
  <Fracturas/>
</g>;

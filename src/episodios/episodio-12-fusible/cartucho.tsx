import React from "react";

const ceramic = "M-282,-89 H278 Q309,-89 309,0 T278,89 H-282 Q-317,89 -317,0 T-282,-89Z";
const cavity = "M-281,-60 H278 Q295,-60 295,0 T278,60 H-281 Q-298,60 -298,0 T-281,-60Z";
const ribbon = "M-317,-14 L-226,-14 L-210,-25 H-145 Q-135,-25 -131,-16 L-124,-8 H-111 L-103,-22 Q-100,-25 -92,-25 H-26 Q-18,-25 -14,-15 L-8,-8 H8 L14,-15 Q18,-25 26,-25 H92 Q100,-25 103,-22 L111,-8 H124 L131,-16 Q135,-25 145,-25 H210 L226,-14 H317 V14 H226 L210,25 H145 Q135,25 131,16 L124,8 H111 L103,22 Q100,25 92,25 H26 Q18,25 14,15 L8,8 H-8 L-14,15 Q-18,25 -26,25 H-92 Q-100,25 -103,22 L-111,8 H-124 L-131,16 Q-135,25 -145,25 H-210 L-226,14 H-317Z";

const gradient = (id: string, colors: readonly [string, string][]) =>
  <linearGradient id={id} x1="0" x2="0" y1="0" y2="1" gradientUnits="objectBoundingBox">
    {colors.map(([offset, color]) => <stop key={offset} offset={offset} stopColor={color} />)}
  </linearGradient>;

export const Materiales: React.FC = () => <defs>
  {gradient("e12ceramica", [["0%","#fff6d5"],["22%","#eed5a5"],["50%","#c8a17b"],["80%","#926f60"],["100%","#684f4c"]])}
  {gradient("e12seccion", [["0%","#fff2cf"],["38%","#ebcfa2"],["72%","#bc8e6b"],["100%","#f6dcb1"]])}
  {gradient("e12cavidad", [["0%","#17252d"],["48%","#39505a"],["100%","#141f28"]])}
  {gradient("e12metal", [["0%","#d2e2e2"],["13%","#b7c4cd"],["31%","#5e7d8a"],["49%","#466271"],["54%","#a1bcc3"],["67%","#e2e9de"],["83%","#96acb0"],["100%","#577283"]])}
  {gradient("e12tira", [["0%","#ffeecb"],["15%","#d9e2de"],["41%","#a2bdc2"],["77%","#70949d"],["100%","#e2d7bb"]])}
  {gradient("e12cobre", [["0%","#fee0a8"],["21%","#a3633a"],["46%","#552e29"],["63%","#d99556"],["100%","#64322a"]])}
  {gradient("e12arena", [["0%","#b68d65"],["38%","#826951"],["100%","#b18a61"]])}
  <radialGradient id="e12calor">
    <stop offset="0" stopColor="#fffac0" />
    <stop offset=".29" stopColor="#ffac64" />
    <stop offset=".58" stopColor="#ff683a" stopOpacity=".59" />
    <stop offset="1" stopColor="#ff4b2c" stopOpacity="0" />
  </radialGradient>
  <radialGradient id="e12azul">
    <stop offset="0" stopColor="#d3fff8" />
    <stop offset=".32" stopColor="#78f1e8" stopOpacity=".66" />
    <stop offset="1" stopColor="#46c8dc" stopOpacity="0" />
  </radialGradient>
  <pattern id="e12poros" width="77" height="39" patternUnits="userSpaceOnUse">
    <path d="M2 15l5 -2m17 -9 6 1m18 8 5 -2m10 13 7 2m-62 6 6 2m21 -8 8 -2m6 8 4 1" stroke="#704d46" strokeWidth="1.2" opacity=".36"/>
    <path d="M10 16l5 -2m20 -2 9 -1m22 -1 6 2m-50 17 4 -1m35 7 5 -1" stroke="#ffeed4" strokeWidth="1.4" opacity=".5"/>
  </pattern>
  <pattern id="e12granos" width="62" height="52" patternUnits="userSpaceOnUse">
    <path d="m3 9 9 -4 6 7 -4 8 -10 -2z m24 -4 9 -3 7 6 -4 8 -11 -2z m20 8 8 -5 5 7 -2 8 -9 -2z m-40 16 10 -5 7 6 -5 9 -10 1z m22 -5 10 -3 5 8 -5 8 -10 -2z m19 10 8 -6 6 7 -3 8 -10 1z m-27 4 5 5 -4 8 -8 -3 -2 -6z m15 5 9 -4 5 7 -5 6 -7 -2z" fill="#cfa877" stroke="#644e43" strokeWidth="1.25" />
    <path d="m5 12 6 -4 5 4m14 -5 6 -3 4 4m9 8 6 -4 3 4m-47 17 6 -4 4 3m10 -4 7 -2 4 5m9 7 5 -5 4 4m-37 6 3 3m14 2 6 -4 2 4" stroke="#efd6ac" strokeWidth="1.2" fill="none" opacity=".77" />
    <path d="m5 20 5 2 4 -1m10 -4 3 3m18 6 4 1m-12 -10 5 2 2 -3m-40 27 5 3m23 -6 4 -1m15 10 5 -1m-26 3 2 -4" stroke="#593f38" strokeWidth="1.3" fill="none" opacity=".73" />
  </pattern>
  <clipPath id="e12cavity"><path d={cavity} /></clipPath>
  <clipPath id="e12silhouette"><path d={ceramic} /></clipPath>
  <mask id="e12abierto"><rect x="-335" y="-58" width="670" height="116" fill="white" /><path d="M-12,-28 L-7,-16 -12,-6 -8,3 -13,14 -8,28 H13 L8,16 14,5 8,-4 12,-17 8,-28Z" fill="black" /></mask>
</defs>;

export const CeramicBack: React.FC = () => <g>
  <path d={ceramic} fill="url(#e12ceramica)" stroke="#111a23" strokeWidth="8" />
  <path d={ceramic} fill="url(#e12poros)" opacity=".84" />
  <path d={cavity} fill="url(#e12cavidad)" stroke="#775b50" strokeWidth="5" />
  <path d="M-276,-58 H275 M-276,59 H275" stroke="#ffe9be" strokeWidth="2.4" opacity=".68" />
  <path d="M-296,-67 Q-313,-44 -313,0 T-296,67 M-280,-78 H271 M-280,79 H271" stroke="#f2dfba" strokeWidth="3.5" opacity=".67" fill="none" />
  <path d="M-279,-62 H274 Q286,-62 289,-54 L-284,-51Z" fill="#fff0bd" opacity=".21" />
  <path d="M-282,-62 Q-299,-62 -300,0 T-282,62 M278,-62 Q298,-62 298,0 T278,62" stroke="#342c2f" strokeWidth="2" fill="none" />
</g>;

export const CeramicSection: React.FC<{closed: number}> = ({closed}) => <g>
  <g clipPath="url(#e12silhouette)">
    <rect x="-317" width="634" y={41 - closed * 128} height={52 + closed * 128} fill="url(#e12ceramica)" />
    <rect x="-317" width="634" y={41 - closed * 128} height={52 + closed * 128} fill="url(#e12poros)" opacity=".9" />
    <path d="M-288,79 H281" stroke="#7d655d" strokeWidth="3" />
    <path d="M-278,85 H276" stroke="#eed6ab" strokeWidth="2" opacity=".74" />
    <g transform={"translate(0 " + (-closed * 128) + ")"}>
      <path d="M-309,38 Q-296,41 -277,40 H282 L311,34 L310,49 L282,56 H-277 L-309,52Z" fill="url(#e12seccion)" stroke="#694e46" strokeWidth="2" />
      <path d="M-302,44 H290" stroke="#fff4d7" strokeWidth="2.6" opacity=".8" />
      {Array.from({length:38}, (_, i) => <path key={i} d={"M"+(-292+i*16)+",47 l-4,7"} stroke="#947157" opacity=".52" strokeWidth="1.3" />)}
    </g>
  </g>
  <path d={ceramic} stroke="#111a23" strokeWidth="5" fill="none" />
  <g opacity={closed}>
    <path d="M-278,-65 H257 M-262,-57 H188" stroke="#fff4da" strokeLinecap="round" strokeWidth="4" opacity=".56" />
    <path d="M-100,-28 H100 M-100,28 H100" stroke="#796b60" opacity=".57" strokeWidth="1.6" />
    <text textAnchor="middle" y="9" fill="#50464a" fontSize="25" fontWeight="800" letterSpacing="4">gG</text>
  </g>
</g>;

export const Elemento: React.FC<{broken?: boolean; sheen?: number; heat?: number}> = ({broken=false,sheen=0,heat=0}) =>
  <g mask={broken ? "url(#e12abierto)" : undefined}>
    <path d={ribbon} transform="translate(0 6)" fill="#3a5059" stroke="#151b25" strokeWidth="5" />
    <path d={ribbon} fill="url(#e12tira)" stroke="#17222a" strokeWidth="3.1" />
    <path d="M-310,-10 H-228 L-210,-21 H-144 L-130,-12 -125,-5 H-108 L-101,-20 H-27 L-17,-13 -10,-4 H10 L17,-13 27,-20 H101 L108,-5 H125 L130,-12 144,-21 H210 L228,-10 H310"
      fill="none" stroke="#fff2cf" strokeWidth="2.4" opacity=".82" />
    <path d="M-303,8 H-226 L-208,20 H-150 M-92,20 H-33 M31,20 H91 M150,20 H208 L226,8 H303" stroke="#4a666f" strokeWidth="2.2" fill="none" opacity=".7" />
    <path d="M-301,-2h60m63 4h25m20 0h20m28 -5h39m79 0h39m36 5h18m23 -3h42m61 2h53" stroke="#edeee1" strokeWidth="1.1" fill="none" opacity=".73" />
    <path d="M-315,-5 H315 M-315,3 H315" stroke="#2d505b" strokeWidth=".85" opacity=".55" />
    <path d={ribbon} fill="#ffe0ae" opacity={sheen * .28}/>
    <ellipse rx={88} ry={26} fill="url(#e12calor)" opacity={heat} />
  </g>;

export const Contacto: React.FC<{side: -1 | 1; exploded: number; cut: number}> = ({side,exploded,cut}) =>
  <g transform={"scale("+side+" 1) translate("+exploded+" 0)"}>
    <path d="M269,-19 H331 V19 H269 L258,12 V-12Z" fill="url(#e12cobre)" stroke="#272b30" strokeWidth="4" />
    <path d="M265,-11 H329 M273,-5 H331" stroke="#ffc582" opacity=".61" strokeWidth="2" />
    <path d="M251,-93 H350 Q379,-91 381,0 Q379,91 350,93 H251 Q226,93 226,0 Q226,-93 251,-93Z" fill="url(#e12metal)" stroke="#131e28" strokeWidth="6" />
    <ellipse cx="350" rx="30" ry="91" fill="url(#e12metal)" stroke="#39505d" strokeWidth="3.5" />
    <ellipse cx="353" rx="22" ry="78" fill="none" stroke="#c3d8d8" strokeWidth="2.6" opacity=".83" />
    <path d="M250,-85 H344 M245,-76 H332 M247,-69 H328 M249,67 H332 M248,75 H337 M252,84 H346" stroke="#dce4db" strokeWidth="2" opacity=".58" />
    <path d="M245,-42 H331 M245,56 H332 M247,-50 H328 M250,27 H328" stroke="#263e4d" strokeWidth="2.2" opacity=".68" />
    <path d="M249,-84 Q233,-66 233,0 Q233,69 249,85 M259,-83 Q242,-61 242,0 Q242,68 259,85" stroke="#f2e8d1" strokeWidth="2.2" fill="none" opacity=".66" />
    <path d="M350,-70 Q366,-43 367,9 Q367,59 354,70" stroke="#293d4b" strokeWidth="3" opacity=".8" fill="none" />
    <g opacity={cut}>
      <path d="M230,-40 H328 L340,-22 V27 L320,41 H230 L227,20 V-25Z" fill="#223742" stroke="#91adac" strokeWidth="2" />
      <path d="M231,40 H320 L339,26 M231,-38 H324" fill="none" stroke="#dedaca" strokeWidth="2" />
      <path d="M224,-13 H322 L331,-4 V8 L322,16 H224Z" fill="url(#e12cobre)" stroke="#17252d" strokeWidth="2.8" />
      <path d="M227,-10 H319 L326,-4 M228,12 H321" stroke="#efd1a1" strokeWidth="2" opacity=".73" fill="none" />
      <circle cx="318" cy="2" r="5" fill="#ecd7b0" stroke="#5e4840" strokeWidth="1.4" />
    </g>
  </g>;

const grains = Array.from({length:34},(_,i)=>({x:(i*89%531)-265,drift:(i*67%137)-68,size:4+(i*31%8),delay:(i*29%73)/100}));
export const Cuarzo: React.FC<{fill: number; pour: number; heat: number}> = ({fill,pour,heat}) => <g>
  <g clipPath="url(#e12cavity)">
    <path d={"M-302,"+(66-fill*110)+" Q-160,"+(51-fill*103)+" 0,"+(68-fill*112)+" T302,"+(64-fill*113)+" V64 H-302Z"} fill="url(#e12arena)" stroke="#d7bb86" strokeWidth="2" />
    <path d={"M-302,"+(66-fill*110)+" Q-160,"+(51-fill*103)+" 0,"+(68-fill*112)+" T302,"+(64-fill*113)+" V64 H-302Z"} fill="url(#e12granos)" />
    <ellipse cy="17" rx="87" ry="62" fill="url(#e12calor)" opacity={heat*.48} />
  </g>
  {pour>0 && pour<1 && grains.map(({x,drift,size,delay},i)=>{
    const offset=(pour*3+delay)%1;
    const y=-205+offset*(265-fill*92);
    return <path key={i} d={"M0 "+(-size)+" L"+size+",-2 "+(size*.64)+","+(size*.68)+" "+(-size*.44)+","+size+" "+(-size)+",-1Z"} transform={"translate("+(x+drift*(1-offset))+" "+y+") rotate("+(offset*290+i*27)+")"} fill={i%3===0?"#f9e7bd":"#c9a777"} stroke="#6f5241" strokeWidth="1.2" opacity={Math.min(pour*12,(1-pour)*12,1)} />;
  })}
</g>;

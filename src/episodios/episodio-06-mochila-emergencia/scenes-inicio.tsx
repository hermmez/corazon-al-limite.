import React from "react";
import {interpolate, staticFile} from "remotion";
import {AbsoluteFill, ApprovedActor, Backdrop, C, Calendar, Camera, Label, OpenBag, PackItem, PackingItem, PackingTable, Prop, Scene, SurfaceShadow, asset, clamp, dissolve, ease, lerp, original, pan, previous, reveal} from "./visuals";
import {cue, sceneLength, useLocalSeconds} from "./timing";
import europe from "./europa.json";

export const Apagon: React.FC = () => {
  const t = useLocalSeconds();
  const light = cue(0,"luz",1.23), water = cue(0,"agua",1.93), phone = cue(0,"comunicaciones",2.59);
  const question = cue(0,"Estarías",4.46), kit = reveal(t,question+.36,.57);
  const indoors = reveal(t,light+.17,.46);
  const dark = reveal(t,light-.08,.34);
  const phoneClose = reveal(t,phone-.18,.4) * dissolve(t,question+.25,.26);
  const emptyWater = reveal(t,water,.22);
  const lampTry = Math.sin(Math.PI*reveal(t,light+.56,.42))*.22;
  return <Scene>
    <Camera scale={pan(t,light+.75,1.025,1.17)} x={pan(t,light+.75,12,-10)}>
      <Backdrop src={previous("ciudad-avenida.png")} dark={.05}/>
      <AbsoluteFill style={{background:"#05152d",mixBlendMode:"multiply",opacity:.58*dark}}/>
      <AbsoluteFill style={{opacity:dissolve(t,light-.10,.28),background:"radial-gradient(ellipse at 9% 44%,#ffb85f40,transparent 31%),radial-gradient(ellipse at 53% 23%,#ffd49e36,transparent 16%)",mixBlendMode:"screen"}}/>
      <Prop src={staticFile("episodio-04/ilustraciones/automovil-teal-vista-trasera.png")} x={lerp(720,620,reveal(t,0,2.5))} y={lerp(1215,1030,reveal(t,0,2.5))} width={lerp(175,98,reveal(t,0,2.5))} height={160} style={{filter:`brightness(${1-.38*dark})`}}/>
    </Camera>
    <Camera scale={1.042 + .058*phoneClose} x={-12*phoneClose} opacity={indoors}>
      <Backdrop src={original("escenarios/02_cocina.png")} dark={.47-.14*lampTry}/>
      <AbsoluteFill style={{background:"#1f417449",mixBlendMode:"multiply"}}/>
      <ApprovedActor t={t} x={475} y={710} width={515} pose={t<phone-.18?"04_pensando.png":"12_preocupado.png"}/>
      <Prop file="lampara-mesa.png" x={65} y={716} width={260} height={340} style={{filter:`brightness(${.66+lampTry})`}}/>
      <div style={{position:"absolute",left:45,top:735,width:315,height:330,background:"radial-gradient(ellipse,#ffb97375,transparent 65%)",opacity:lampTry,mixBlendMode:"screen"}}/>
      <svg width="1080" height="1920" style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <path d="M350 730q-1 22 2 47" stroke="#c4eafb" strokeWidth={6*(1-emptyWater)+1} strokeLinecap="round" opacity={(1-emptyWater)*.8}/>
        <path d="M352 747q-6 10-5 14q5 9 10 0q1-4-5-14Z" fill="#c4eafb" transform={`translate(0 ${reveal(t,water,.33)*30})`} opacity={emptyWater*dissolve(t,water+.3,.2)}/>
      </svg>
      <div style={{position:"absolute",left:148,top:618,width:370,height:620,opacity:phoneClose,translate:`${-38*(1-phoneClose)}px ${36*(1-phoneClose)}px`,rotate:"-7deg",filter:"drop-shadow(0 18px 18px #0a102480)"}}>
        <Prop file="telefono.png" x={0} y={0} width={370} height={620}/>
        <svg viewBox="0 0 140 105" width="117" height="88" style={{position:"absolute",left:127,top:207}}>
          <g fill="#7bbab7" opacity={dissolve(t,phone+.16,.27)}><rect x="25" y="65" width="15" height="22" rx="2"/><rect x="48" y="54" width="15" height="33" rx="2"/><rect x="71" y="42" width="15" height="45" rx="2"/><rect x="94" y="28" width="15" height="59" rx="2"/></g>
          <path d="M29 32l79 55m-8-57L38 87" fill="none" stroke="#ffc475" strokeWidth="8" strokeLinecap="round" opacity={reveal(t,phone+.22,.25)}/>
        </svg>
      </div>
    </Camera>
    <Camera scale={1.02+.05*kit} opacity={kit}>
      <PackingTable actor={false}><OpenBag x={167} y={800} size={760}/></PackingTable>
    </Camera>
  </Scene>;
};

const EuropaMap: React.FC<{t:number; union:number; sweden:number; focus:number}> = ({t,union,sweden,focus}) => {
  const [sx,sy] = europe.sweden;
  return <svg viewBox="0 0 920 850" width="920" height="850" style={{position:"absolute",left:80,top:435,rotate:`${lerp(-4,0,focus)}deg`,filter:"drop-shadow(0 14px 22px #101728a0)"}} aria-label="Mapa de Europa con los países de la Unión Europea y Suecia">
    <defs>
      <linearGradient id="mar06" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#193b56"/><stop offset="1" stopColor="#245c67"/></linearGradient>
      <pattern id="rejilla06" width="92" height="89" patternUnits="userSpaceOnUse"><path d="M0 89V0H92" fill="none" stroke="#9bd4db" strokeWidth="1" opacity=".12"/></pattern>
    </defs>
    <rect width="920" height="850" rx="15" fill="url(#mar06)" stroke="#d2b680" strokeWidth="5"/>
    <rect width="920" height="850" rx="15" fill="url(#rejilla06)"/>
    {europe.countries.map(({code,name,path,eu}) => <path key={code+name} d={path} fillRule="evenodd" fill={code==="SE" && sweden>.5 ? "#ffca67" : eu ? "#659f89" : "#567473"} stroke="#142c42" strokeWidth="1.7" opacity={eu ? .66 + .34*union : .85}/>) }
    <path d={`M${sx},${sy}Q${sx+105},${sy-38} ${sx+220},${sy-49}`} fill="none" stroke="#ffda8a" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-sweden} opacity={sweden}/>
    <circle cx={sx} cy={sy} r={8+10*Math.sin(t*4)**2} fill="none" stroke="#ffdc90" strokeWidth="3" opacity={sweden}/>
    <text x={sx+222} y={sy-49} fill="#ffdc90" fontSize="41" fontWeight="900" opacity={sweden}>Suecia</text>
    <text x="66" y="772" fill="#f7e3ae" fontSize="39" fontWeight="900" opacity={union}>Unión Europea</text>
  </svg>;
};

export const Europa: React.FC = () => {
  const t=useLocalSeconds(), union=cue(1,"Unión Europea",.3), hrs=cue(1,"setenta",2.64), swe=cue(1,"Suecia",4.68), days=cue(1,"siete días",7.89);
  const switchHome=reveal(t,swe+1.15,.65), highlight=reveal(t,swe-.03,.4), mapIn=reveal(t,0,.55);
  return <Scene>
    <Camera scale={1.04}>
      <PackingTable actor={false}/>
      <div style={{position:"absolute",inset:0,opacity:mapIn,translate:`0px ${76*(1-mapIn)}px`,scale:1+.045*highlight,transformOrigin:"52% 43%"}}>
        <EuropaMap t={t} union={reveal(t,union,.5)} sweden={highlight} focus={mapIn}/>
      </div>
      <Label top={1345} size={86} opacity={reveal(t,hrs-.04,.35)*dissolve(t,swe+.72,.36)} color={C.gold}>Al menos 72 horas</Label>
    </Camera>
    <Camera scale={1.035} x={pan(t,sceneLength(1),8,-8)} opacity={switchHome}>
      <Backdrop src={asset("despensa-reservas.png")} dark={.08}/>
      <Calendar time={t} start={days-.65} x={235} y={1018} width={650}/>
      <Prop file="garrafon-4l.png" x={25} y={1095} width={270} height={385} style={{opacity:reveal(t,swe+1.8,.42)}}/>
    </Camera>
  </Scene>;
};

export const Mochila: React.FC = () => {
  const t=useLocalSeconds();
  const docs=cue(2,"documentos",2.81), aid=cue(2,"medicamentos",4.78), light=cue(2,"linterna",6.51), radio=cue(2,"radio",7.33), power=cue(2,"cargador portátil",8.4);
  const load=reveal(t,cue(2,"mochila",1.27)+.18,.62), end=sceneLength(2);
  const items: PackingItem[] = [
    {file:"documentos-estanco.png",title:"Documentos y efectivo",from:docs,until:aid-.03,width:470,height:310},
    {file:"botiquin-medicinas.png",title:"Medicinas y botiquín",from:aid,until:light-.04,width:440,height:315},
    {file:"linterna.png",title:"Linterna",from:light,until:radio-.04,width:440,height:245},
    {src:previous("radio-emergencia.png"),title:"Radio de baterías",from:radio,until:power-.06,width:450,height:306},
    {file:"cargador-portatil.png",title:"Cargador portátil",from:power,until:end+.14,width:420,height:310},
  ];
  return <Scene>
    <Camera scale={1.035} x={pan(t,2.1,14,-10)}>
      <PackingTable actor={false}>
        <Prop file="personaje-empacando.png" x={311} y={381} width={711} height={1300} style={{rotate:`${Math.sin(t*3)*.8}deg`,transformOrigin:"53% 77%"}}/>
        <AbsoluteFill style={{clipPath:"inset(65.5% 0 0 0)"}}><Backdrop src={asset("mesa-preparacion.png")} dark={.06}/></AbsoluteFill>
      </PackingTable>
    </Camera>
    <Camera scale={1.04+.025*reveal(t,docs,.8)} x={pan(t,end,12,-10)} opacity={load}>
      <PackingTable>
        <AbsoluteFill style={{translate:`${lerp(-80,0,load)}px ${lerp(91,0,load)}px`,opacity:.7+.3*load}}>
          <OpenBag>
            {items.map(item=><PackItem key={item.title} item={item} time={t}/>)}
          </OpenBag>
        </AbsoluteFill>
      </PackingTable>
    </Camera>
  </Scene>;
};

export const BackpackWalk: React.FC<{t:number;x:number;y:number;width:number;heavy?:boolean;opacity?:number}> = ({t,x,y,width,heavy,opacity=1}) => {
  const gait=Math.sin(t*Math.PI*(heavy?2.3:4.2));
  const file=heavy?"personaje-carga-pesada.png":"personaje-mochila.png";
  const height=width*1.5;
  const top=y-Math.abs(gait)*(heavy?4:11);
  return <>
    <SurfaceShadow x={x+width*.13} y={y+height*.932} width={width*.77} opacity={opacity*.75}/>
    <Prop file={file} x={x} y={top} width={width} height={height} style={{opacity,clipPath:"inset(0 0 34% 0)",rotate:`${gait*(heavy?2:1.2)}deg`,transformOrigin:"50% 56%"}}/>
    <Prop file={file} x={x} y={top} width={width} height={height} style={{opacity,clipPath:"polygon(0 63%,49% 63%,52% 100%,0 100%)",rotate:`${gait*(heavy?2.5:4.5)}deg`,transformOrigin:"49% 64%"}}/>
    <Prop file={file} x={x} y={top} width={width} height={height} style={{opacity,clipPath:"polygon(48% 63%,100% 63%,100% 100%,50% 100%)",rotate:`${-gait*(heavy?2.5:4.5)}deg`,transformOrigin:"50% 64%"}}/>
  </>;
};

export const Carga: React.FC = () => {
  const t=useLocalSeconds(), water=cue(3,"agua",.52), food=cue(3,"alimentos",1.22), warm=cue(3,"ropa de abrigo",2.83), fit=cue(3,"práctica",6.48), heavy=cue(3,"pesada",7.55);
  const close=cue(3,"Recuerda",4.9)-.3;
  const zipped=reveal(t,close,.55), outside=reveal(t,fit-.72,.55), strained=reveal(t,heavy-.15,.4);
  const items: PackingItem[] = [
    {file:"botella-portatil.png",title:"Agua para llevar",from:water,until:food+.03,width:250,height:377,x:206,y:588},
    {src:previous("provisiones-selladas.png"),title:"Alimentos listos",from:food,until:warm-.04,width:485,height:317,x:98,y:637},
    {file:"ropa-higiene-viaje.png",title:"Abrigo e higiene",from:warm,until:close+.05,width:482,height:320,x:120,y:628},
  ];
  return <Scene>
    <Camera scale={1.043}>
      <PackingTable>
        <AbsoluteFill style={{opacity:1-zipped,scale:lerp(1,.96,zipped),transformOrigin:"50% 68%"}}>
          <OpenBag>{items.map(item=><PackItem key={item.title} item={item} time={t}/>)}</OpenBag>
        </AbsoluteFill>
        <Prop file="mochila-cerrada.png" x={228} y={900} width={690} height={690} style={{opacity:zipped,translate:`0px ${-zipped*18}px`}}/>
      </PackingTable>
    </Camera>
    <Camera scale={1.045} opacity={outside}>
      <Backdrop src={previous("edificio-concreto.png")} dark={.09}/>
      <BackpackWalk t={t} x={lerp(-85,288,reveal(t,fit-.58,1.55))} y={795} width={565} opacity={1-strained}/>
      <BackpackWalk t={t} x={lerp(160,245,reveal(t,heavy,1.12))} y={790} width={585} heavy opacity={strained}/>
      <Label top={665} size={61} opacity={outside*(1-strained)}>Carga práctica</Label>
      <Label top={665} size={61} opacity={outside*strained} color={C.gold}>Demasiado peso</Label>
    </Camera>
  </Scene>;
};

import React from "react";
import {Img, interpolate, staticFile} from "remotion";
import {AbsoluteFill, ApprovedActor, Backdrop, C, Camera, Clock, Dust, Radio, Scene, Sprite, WalkingActor, WashingActor, asset, clamp, cue, dissolve, duration, ease, original, reveal, useTime} from "./visuals";

export const CiudadScene: React.FC = () => {
  const t = useTime(), flash = cue(0, "explotara"), reaction = reveal(t, flash - .12, .15);
  const light = interpolate(t, [flash - .05, flash + .08, flash + .6], [0, .72, 0], clamp);
  return <Scene>
    <Camera scale={interpolate(t, [0, duration(0)], [1.025, 1.065], ease)} x={interpolate(t, [0, duration(0)], [12, -12], clamp)}>
      <Backdrop src={asset("ciudad-avenida.png")} dark={.08}/>
      <Sprite file="nube-explosion.png" x={470} y={245} width={580} height={640} style={{opacity: reveal(t, flash + .08, .8), scale: interpolate(t, [flash, duration(0)], [.6, 1], ease), transformOrigin: "50% 100%"}}/>
      <AbsoluteFill style={{clipPath: "polygon(0 0,32% 0,44% 25%,54% 34%,47% 41%,64% 43%,69% 37%,100% 28%,100% 100%,0 100%)"}}>
        <Backdrop src={asset("ciudad-avenida.png")} dark={.08}/>
      </AbsoluteFill>
      <Img src={staticFile("episodio-04/ilustraciones/automovil-teal-vista-trasera.png")} style={{position: "absolute", left: interpolate(t, [0, 4], [790, 600], clamp), top: interpolate(t, [0, 4], [1220, 940], clamp), width: interpolate(t, [0, 4], [220, 95], clamp), height: interpolate(t, [0, 4], [188, 81], clamp), objectFit: "contain", opacity: dissolve(t, 3.2, .8)}}/>
    </Camera>
    <WalkingActor x={interpolate(t, [0, flash], [-240, 30], ease)} y={910} width={590} t={t} opacity={1 - reaction}/>
    <Sprite file="personaje-chaqueta.png" x={30} y={905} width={590} height={885} style={{opacity: reaction, rotate: (Math.sin(Math.max(0, t - flash) * 2) * .45) + "deg", transformOrigin: "50% 95%"}}/>
    <AbsoluteFill style={{background: "#fff0c9", opacity: light}}/>
  </Scene>;
};

export const ProteccionScene: React.FC = () => {
  const t = useTime(), down = cue(1, "Tírate"), wave = cue(1, "onda expansiva"), prone = reveal(t, down, .32);
  const shake = t > wave && t < wave + .65 ? Math.sin((t - wave) * 42) * 5 * (1 - (t - wave) / .65) : 0;
  return <Scene>
    <Camera scale={1.055} x={shake} y={12}>
      <Backdrop src={asset("ciudad-avenida.png")} dark={.17}/>
      <Sprite file="nube-explosion.png" x={480} y={220} width={570} height={625} style={{opacity: .76}}/>
    </Camera>
    <Sprite file="nube-explosion.png" x={-210} y={interpolate(t, [wave - .4, wave + 1.6], [-970, -280], ease)} width={1500} height={1610} style={{clipPath: "inset(65% 0 0 0)", opacity: reveal(t, wave - .35, .35) * .48}}/>
    <Dust t={t} wind={t > wave ? 130 : 6} opacity={reveal(t, wave - .1, .3) * .7}/>
    <Sprite file="personaje-chaqueta.png" x={35} y={920 + prone * 180} width={600} height={900} style={{opacity: 1 - prone, rotate: (prone * 14) + "deg", transformOrigin: "55% 94%"}}/>
    <Sprite file="personaje-protegiendose.png" x={30} y={1260} width={1020} height={510} style={{opacity: prone, translate: "0px " + (Math.sin(t * 1.6) * .6) + "px"}}/>
  </Scene>;
};

export const RefugioScene: React.FC = () => {
  const t = useTime(), section = cue(2, "Un sótano"), interior = cue(2, "lejos de las ventanas"), cut = reveal(t, section, .55), inside = reveal(t, interior + .1, .55);
  const approach = interpolate(t, [.2, section - .25], [0, 1], ease), actorWidth = interpolate(approach, [0, 1], [610, 275]);
  return <Scene>
    <Camera scale={1.025} x={-10}>
      <Backdrop src={asset("edificio-concreto.png")} dark={.08}/>
      <WalkingActor x={interpolate(approach, [0, 1], [-320, 620])} y={interpolate(approach, [0, 1], [890, 1040])} width={actorWidth} t={t} opacity={dissolve(t, section - .55, .35)}/>
    </Camera>
    <Camera scale={interpolate(t, [section, interior], [1, 1.08], ease)} y={interpolate(t, [section, interior], [0, -35], clamp)} opacity={cut}>
      <Backdrop src={asset("edificio-corte-sotano-v2.png")} dark={.05}/>
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0, opacity: reveal(t, section + .55, .4)}}>
        <path d="M930 1250 C960 1400 920 1510 820 1660" fill="none" stroke={C.gold} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - reveal(t, section + .6, .8)}/>
        <path d="M811 1625L820 1660L852 1646" fill="none" stroke={C.gold} strokeWidth="8" strokeLinecap="round" opacity={reveal(t, section + 1.2, .2)}/>
      </svg>
    </Camera>
    <Camera scale={1.025} opacity={inside}>
      <Backdrop src={asset("refugio-interior.png")} dark={.1}/>
      <WalkingActor t={Math.min(t - interior, 1.4)} x={interpolate(t, [interior, interior + 1.4], [495, 575], ease)} y={950} width={370}/>
    </Camera>
  </Scene>;
};

export const FalloutScene: React.FC = () => {
  const t = useTime(), dust = cue(3, "polvo radiactivo"), inside = reveal(t, duration(3) - 1.7, .6);
  return <Scene>
    <Camera scale={1.055} x={interpolate(t, [0, duration(3)], [20, -20], clamp)}>
      <Backdrop src={asset("ciudad-avenida.png")} dark={.25}/>
      <Img src={staticFile("episodio-04/ilustraciones/automovil-teal-vista-trasera.png")} style={{position: "absolute", left: 630, top: 1280, width: 410, height: 350, objectFit: "contain"}}/>
      <Dust t={t} opacity={reveal(t, dust - .3, .6)} count={95}/>
      <div style={{position: "absolute", left: 630, top: 1410, width: 330, height: 20, background: "radial-gradient(ellipse,#b4a69170,transparent 70%)", opacity: reveal(t, dust + 1, 2)}}/>
    </Camera>
    <Camera scale={1.025} opacity={inside}>
      <Backdrop src={asset("refugio-interior.png")} dark={.15}/>
      <WalkingActor t={Math.max(0, t - duration(3) + 1.7)} x={interpolate(t, [duration(3) - 1.7, duration(3)], [470, 540], ease)} y={880} width={440}/>
    </Camera>
  </Scene>;
};

export const RopaScene: React.FC = () => {
  const t = useTime(), remove = cue(4, "quítate"), percent = cue(4, "noventa por ciento"), undress = reveal(t, remove, .35), off = reveal(t, percent - .35, .45), bag = reveal(t, percent + .35, 1.15);
  return <Scene>
    <Camera scale={1.025} x={-8}>
      <Backdrop src={asset("refugio-interior.png")} dark={.13}/>
      <Sprite file="personaje-chaqueta.png" x={180} y={805} width={600} height={900} style={{opacity: 1 - undress}}/>
      <Sprite file="personaje-retirando-chaqueta.png" x={180} y={805} width={600} height={900} style={{opacity: undress * (1 - off)}}/>
      <ApprovedActor t={t} x={180} y={805} width={600} opacity={off}/>
      <Sprite file="bolsa-ropa.png" x={760} y={1405} width={290} height={320}/>
      <div style={{position: "absolute", left: interpolate(bag, [0, 1], [460, 780]), top: interpolate(bag, [0, 1], [1170, 1480]), width: interpolate(bag, [0, 1], [350, 225]), height: interpolate(bag, [0, 1], [375, 241]), opacity: off * (1 - reveal(t, percent + 1.7, .35)), rotate: (-5 + bag * 4) + "deg"}}>
        <Sprite file="chaqueta-exterior.png" x={0} y={0} width={350 - bag * 125} height={375 - bag * 134}/>
        {Array.from({length: 12}, (_, i) => <div key={i} style={{position: "absolute", left: 35 + (i * 23) % 210, top: 50 + (i * 37) % 230, width: 3, height: 3, borderRadius: "30%", background: "#d4bf9e", opacity: .7}}/>)}
      </div>
      <Sprite file="bolsa-ropa.png" x={760} y={1405} width={290} height={320} style={{clipPath: "inset(26% 0 0 0)"}}/>
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0, opacity: reveal(t, percent + 1.65, .4)}}>
        <path d="M800 1450Q902 1490 1000 1450" fill="none" stroke="#152d38" strokeWidth="7" strokeLinecap="round"/>
      </svg>
    </Camera>
    <div style={{position: "absolute", left: 95, top: 450, fontSize: 80, lineHeight: 1, fontWeight: 900, color: C.gold, textShadow: "0 4px 14px #071321", opacity: reveal(t, percent - .12, .2) * dissolve(t, percent + 1.8, .3)}}>Hasta 90 %</div>
  </Scene>;
};

export const HigieneScene: React.FC = () => {
  const t = useTime(), food = cue(5, "Usa agua embotellada"), supplies = reveal(t, food - .08, .5);
  return <Scene>
    <Camera scale={1.025} x={-5}>
      <Backdrop src={asset("interior-higiene.png")} dark={.08}/>
      <WashingActor t={t}/>
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
        <path d="M354 887Q352 910 355 937" stroke="#6ed4e5" strokeWidth="9" opacity=".7" fill="none"/>
        <path d="M352 891L354 933" stroke="#e6faff" strokeWidth="2.5" opacity=".8"/>
        {[0, 1, 2, 3].map(i => <circle key={i} cx={350 + i * 5} cy={944 + ((t * 45 + i * 8) % 28)} r={2} fill="#c0f4fa" opacity=".8"/>)}
      </svg>
    </Camera>
    <Camera scale={interpolate(t, [food, duration(5)], [1.025, 1.06], ease)} opacity={supplies}>
      <Backdrop src={asset("refugio-interior.png")} dark={.08}/>
      <ApprovedActor t={t} x={610} y={900} width={380}/>
      <Sprite file="provisiones-selladas.png" x={-5} y={870} width={700} height={467} style={{translate: "0px " + (18 * (1 - supplies)) + "px"}}/>
    </Camera>
  </Scene>;
};

export const InformacionScene: React.FC = () => {
  const t = useTime(), time = cue(6, "veinticuatro horas"), official = cue(6, "Mantente atento"), focus = reveal(t, official - .3, 1.0);
  return <Scene>
    <Camera scale={1.025 + focus * .035} x={focus * 14}>
      <Backdrop src={asset("refugio-interior.png")} dark={.13}/>
      <ApprovedActor pose="04_pensando.png" t={t} x={545} y={890} width={435}/>
      <Radio t={t} x={15} y={1000} width={655}/>
    </Camera>
    <AbsoluteFill style={{opacity: dissolve(t, official - .4, .6)}}>
      <Clock local={Math.min(t, time + 2.6) * .8}/>
      <div style={{position: "absolute", right: 70, top: 735, width: 300, fontSize: 46, lineHeight: 1.08, textAlign: "center", fontWeight: 900, color: C.cream, textShadow: "0 3px 12px #071321"}}>Al menos<br/><span style={{fontSize: 78}}>24 h</span></div>
    </AbsoluteFill>
  </Scene>;
};

export const CierreScene: React.FC = () => {
  const t = useTime(), stay = cue(7, "permanece"), informed = cue(7, "informado"), interior = reveal(t, stay - .1, .5), push = reveal(t, informed + .1, 2);
  return <Scene>
    <Camera scale={1.025}>
      <Backdrop src={asset("edificio-concreto.png")} dark={.13}/>
      <WalkingActor x={interpolate(t, [0, stay], [20, 630], ease)} y={interpolate(t, [0, stay], [960, 1080], clamp)} width={interpolate(t, [0, stay], [500, 250], ease)} t={t}/>
    </Camera>
    <Camera scale={1.025 + push * .04} x={push * 13} opacity={interior}>
      <Backdrop src={asset("refugio-interior.png")} dark={.12}/>
      <ApprovedActor pose={t < informed + .4 ? "01_neutral.png" : "04_pensando.png"} t={t} x={550} y={900} width={435}/>
      <Radio t={t} x={15} y={1000} width={655}/>
      <AbsoluteFill style={{background: "#ffd16f", opacity: reveal(t, duration(7) - .45, .4) * .025}}/>
    </Camera>
  </Scene>;
};

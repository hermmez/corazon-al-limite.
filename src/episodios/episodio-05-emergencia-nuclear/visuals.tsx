import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Backdrop, C, Clock, clamp, original, useTime} from "../episodio-04-sin-dormir/visuals";
import chapters from "./chapters.json";
import timeline from "./timeline.json";
export {AbsoluteFill, Backdrop, C, Clock, clamp, original, useTime};
export const asset = (file: string) => staticFile("episodio-05/ilustraciones/" + file);
export const ease = {...clamp, easing: Easing.bezier(.4, 0, .2, 1)};
const normalize = (s: string) => s.toLocaleLowerCase("es").replace(/[^\p{L}\p{N}]/gu, "");
export const sceneWords = chapters.map((chapter, id) => {
  const offset = chapters.slice(0, id).reduce((sum, c) => sum + c.text.split(/\s+/).length, 0);
  return timeline.events.slice(offset, offset + chapter.text.split(/\s+/).length);
});
export const cue = (id: number, phrase: string) => {
  const target = phrase.split(/\s+/).map(normalize);
  const words = sceneWords[id];
  const index = words.findIndex((_, i) => target.every((word, j) => normalize(words[i + j]?.word ?? "") === word));
  if (index < 0) throw new Error("Missing acoustic cue: " + phrase);
  return words[index].start - timeline.sceneWindows[id].start;
};
export const duration = (id: number) => timeline.sceneWindows[id].durationInFrames / 30;
export const reveal = (t: number, start: number, seconds = .4) => interpolate(t, [start, start + seconds], [0, 1], ease);
export const dissolve = (t: number, start: number, seconds = .4) => 1 - reveal(t, start, seconds);

export const Scene: React.FC<{children: React.ReactNode}> = ({children}) =>
  <AbsoluteFill style={{overflow: "hidden", background: C.navy}}>{children}</AbsoluteFill>;
export const Camera: React.FC<{children: React.ReactNode; x?: number; y?: number; scale?: number; opacity?: number}> =
  ({children, x = 0, y = 0, scale = 1, opacity = 1}) =>
    <AbsoluteFill style={{transform: "translate(" + x + "px," + y + "px) scale(" + scale + ")", opacity}}>{children}</AbsoluteFill>;
export const Sprite: React.FC<{file: string; x: number; y: number; width: number; height: number; style?: React.CSSProperties}> =
  ({file, x, y, width, height, style}) => <Img src={asset(file)} style={{position: "absolute", left: x, top: y, width, height, objectFit: "contain", ...style}}/>;
export const ApprovedActor: React.FC<{pose?: string; x?: number; y?: number; width?: number; t: number; opacity?: number}> =
  ({pose = "01_neutral.png", x = 560, y = 900, width = 450, t, opacity = 1}) =>
    <Img src={original("personajes/" + pose)} style={{position: "absolute", left: x, top: y, width, height: width * 1.5, objectFit: "contain", opacity, scale: "1 " + (1 + Math.sin(t * 1.6) * .002), transformOrigin: "50% 98%"}}/>;

export const WalkingActor: React.FC<{x: number; y: number; width: number; t: number; opacity?: number}> =
  ({x, y, width, t, opacity = 1}) => {
    const gait = Math.sin(t * Math.PI * 4.2);
    const full: React.CSSProperties = {position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain"};
    return <div style={{position: "absolute", left: x, top: y - Math.abs(gait) * 3, width, height: width * 1.5, opacity}}>
      <Img src={asset("personaje-entrando.png")} style={{...full, clipPath: "polygon(0% 50%,53% 50%,58% 70%,40% 100%,0% 100%)", rotate: (gait * 5) + "deg", transformOrigin: "54% 56%"}}/>
      <Img src={asset("personaje-entrando.png")} style={{...full, clipPath: "polygon(46% 50%,74% 50%,100% 100%,47% 100%,42% 72%)", rotate: (-gait * 5) + "deg", transformOrigin: "54% 56%"}}/>
      <Img src={asset("personaje-entrando.png")} style={{...full, clipPath: "inset(0 0 42% 0)"}}/>
    </div>;
  };

export const Dust: React.FC<{t: number; opacity?: number; wind?: number; count?: number}> = ({t, opacity = 1, wind = 0, count = 70}) =>
  <AbsoluteFill style={{pointerEvents: "none", opacity}}>{Array.from({length: count}, (_, i) => {
    const size = 2 + random("nuclear-size-" + i) * 4;
    const x = ((random("nuclear-x-" + i) * 1300 + t * wind) % 1300) - 100;
    const y = ((random("nuclear-y-" + i) * 2200 + t * (40 + random("nuclear-speed-" + i) * 70)) % 2200) - 150;
    return <div key={i} style={{position: "absolute", left: x, top: y, width: size, height: size * .7, borderRadius: "30%", background: i % 2 ? "#d4bf9e" : "#96877a", opacity: .3 + random("nuclear-opacity-" + i) * .45, rotate: (i * 27 + t * 12) + "deg"}}/>;
  })}</AbsoluteFill>;

export const Radio: React.FC<{t: number; x?: number; y?: number; width?: number}> = ({t, x = 25, y = 1000, width = 650}) => <>
  <Sprite file="radio-emergencia.png" x={x} y={y} width={width} height={width * 2 / 3}/>
  <div style={{position: "absolute", left: x + width * .735, top: y + width * .425, width: width * .025, height: width * .025, borderRadius: "50%", background: C.gold, opacity: .22 + .35 * Math.sin(t * 3) ** 2, boxShadow: "0 0 18px 7px #ffd16f80"}}/>
  <svg width="1080" height="1920" style={{position: "absolute", inset: 0, overflow: "visible"}}>
    {[0, 1, 2].map(i => <path key={i} d={"M" + (x + 15 - i * 18) + " " + (y + width * .42 - 30 - i * 15) + "q-32 48 0 96"} fill="none" stroke={C.gold} strokeWidth="3" opacity={.12 + .1 * Math.sin(t * 3 - i) ** 2}/>)}
  </svg>
</>;

export const WashingActor: React.FC<{t: number}> = ({t}) => {
  const full: React.CSSProperties = {position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain"};
  return <div style={{position: "absolute", left: 146, top: 535, width: 650, height: 975}}>
    <Img src={asset("personaje-lavandose.png")} style={{...full, clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 46%,40% 46%,64% 43%,66% 35%,49% 32%,0% 32%)"}}/>
    <Img src={asset("personaje-lavandose.png")} style={{...full, clipPath: "polygon(0% 32%,49% 32%,66% 35%,64% 43%,40% 46%,0% 46%)", rotate: (Math.sin(t * 5) * 1) + "deg", translate: (Math.sin(t * 5) * 1.5) + "px 0px", transformOrigin: "65% 35%"}}/>
  </div>;
};

export const useClock = () => useCurrentFrame() / useVideoConfig().fps;

import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

export const C = {navy: "#071321", cream: "#fff4dc", teal: "#45d1d2", coral: "#ff747e", gold: "#ffd16f"};
export const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
export const asset = (file: string) => staticFile(file);
export const original = (file: string) => asset(`imagenes/${file}`);
export const added = (file: string) => asset(`episodio-04/ilustraciones/${file}`);
export const useTime = () => Math.max(0, useCurrentFrame() / useVideoConfig().fps);

export const Heading: React.FC<{children: React.ReactNode; top?: number; size?: number; color?: string}> = ({children, top = 130, size = 70, color = C.cream}) => <div style={{position: "absolute", top, left: 64, width: 940, fontSize: size, color, fontWeight: 900, lineHeight: 1.02, letterSpacing: -2, textShadow: "0 3px 7px #071321, 0 8px 32px #071321bb"}}>{children}</div>;

export const Backdrop: React.FC<{src: string; dark?: number}> = ({src, dark = 0.15}) => <AbsoluteFill>
  <Img src={src} style={{width: "100%", height: "100%", objectFit: "cover"}} />
  <AbsoluteFill style={{background: `rgba(4,17,29,${dark})`}} />
  <AbsoluteFill style={{background: "linear-gradient(180deg,#0713218c 0%,#07132124 24%,transparent 55%,#07132116 100%)"}} />
</AbsoluteFill>;

export const Room: React.FC<{local: number; dark?: number}> = ({local, dark = 0.12}) => <>
  <Backdrop src={added("dormitorio-nocturno-panoramico.png")} dark={dark} />
  <AbsoluteFill style={{background: "#071321", opacity: interpolate(local, [0, 6, 9], [0, 0.08, 0.12], clamp)}} />
</>;

export const Bed: React.FC<{sleeping?: boolean; local: number; left?: number; top?: number; width?: number}> = ({sleeping = false, local, left = -10, top = 1090, width = 1100}) => {
  const src = added(sleeping ? "personaje-descansando-en-cama.png" : "cama-vacia.png");
  const style = {position: "absolute" as const, left, top, width, height: width * 2 / 3, objectFit: "contain" as const};
  return <>
    <Img src={src} style={style} />
    {sleeping && <Img src={src} style={{...style, clipPath: "polygon(38% 30%,88% 22%,88% 62%,36% 60%)", scale: `1 ${1 + Math.sin(local * 1.7) * 0.004}`, transformOrigin: "60% 55%"}} />}
  </>;
};

export const Actor: React.FC<{poses: string[]; local: number; left?: number; width?: number; bottom?: number}> = ({poses, local, left = 370, width = 700, bottom = 65}) => {
  const index = Math.min(poses.length - 1, Math.floor(local / 2));
  const blend = index === 0 ? 1 : interpolate(local - index * 2, [0, 0.14], [0, 1], clamp);
  const tilt = interpolate(local % 2, [0, 0.16, 0.4], [-1, 0.35, 0], clamp);
  const imageStyle = {position: "absolute" as const, inset: 0, width: "100%", height: "100%", objectFit: "contain" as const};
  return <div style={{position: "absolute", left, bottom, width, height: width * 1.5, transformOrigin: "50% 99%", rotate: `${tilt}deg`, filter: "drop-shadow(0 18px 18px #0005)"}}>
    {blend < 1 && <Img src={original(`personajes/${poses[Math.max(0, index - 1)]}`)} style={{...imageStyle, opacity: 1 - blend}} />}
    <Img src={original(`personajes/${poses[index]}`)} style={{...imageStyle, opacity: blend}} />
  </div>;
};

export const NeuralWorld: React.FC<{local: number}> = ({local}) => <AbsoluteFill style={{background: "#10323d", overflow: "hidden"}}>
  {[[-400,-290,1200,-20],[470,-40,1050,35],[-410,960,1200,15],[450,1040,1150,-35]].map(([left,top,width,angle], i) => <Img key={i} src={original("ciencia/01_neurona.png")} style={{position: "absolute", left, top, width, height: width, objectFit: "contain", opacity: 0.42, rotate: `${angle}deg`, translate: `${Math.sin(local * 0.22 + i) * 14}px ${Math.cos(local * 0.18 + i) * 10}px`}} />)}
  <Img src={original("ciencia/02_sinapsis_neuronal.png")} style={{position: "absolute", left: 80, top: 580, width: 1000, height: 1000, objectFit: "contain", opacity: 0.2}} />
  <AbsoluteFill style={{background: "linear-gradient(180deg,#0713218c 0%,#07132120 28%,#07132118 100%)"}} />
</AbsoluteFill>;

export const Brain: React.FC<{left?: number; top?: number; width?: number; style?: React.CSSProperties}> = ({left = -10, top = 350, width = 1100, style}) => <Img src={original("anatomia/01_cerebro_completo.png")} style={{position: "absolute", left, top, width, height: width * 1024 / 1254, objectFit: "contain", filter: "drop-shadow(0 15px 28px #0006)", ...style}} />;

export const Clock: React.FC<{local: number}> = ({local}) => <svg width="270" height="270" viewBox="0 0 270 270" style={{position: "absolute", right: 55, top: 440, filter: "drop-shadow(0 10px 24px #0008)"}}>
  <circle cx="135" cy="135" r="120" fill="#0b2430ef" stroke={C.cream} strokeWidth="6" />
  {Array.from({length:12},(_,n)=><line key={n} x1="135" y1="29" x2="135" y2="43" stroke={C.gold} strokeWidth="5" transform={`rotate(${n*30} 135 135)`} />)}
  <path d="M135 135V75" stroke={C.cream} strokeWidth="8" strokeLinecap="round" transform={`rotate(${local*60} 135 135)`} />
  <path d="M135 135V49" stroke={C.gold} strokeWidth="6" strokeLinecap="round" transform={`rotate(${local*420} 135 135)`} />
  <circle cx="135" cy="135" r="9" fill={C.coral} />
</svg>;

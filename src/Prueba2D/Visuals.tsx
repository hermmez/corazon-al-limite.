import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const ease = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: Easing.bezier(0.2, 0.8, 0.2, 1),
} as const;

export const colors = {
  ink: '#132653',
  mint: '#52edc2',
  yellow: '#ffdb65',
  coral: '#ff7c83',
};

// Only the approved character library may supply raster assets to this video.
export type ApprovedPose =
  | '01_neutral'
  | '02_explicando'
  | '05_cansado'
  | '18_bostezando'
  | '24_anatomia_cerebro'
  | '15_confundido'
  | '23_durmiendo'
  | '13_feliz';

export const Stage: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  background?: string;
  chapter: string;
  number: string;
}> = ({children, dark = false, background, chapter, number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: background ?? (dark ? '#15234c' : '#eef6ff'),
        color: dark ? '#fff' : colors.ink,
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id={`grid-${number}`} width="70" height="70" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill={dark ? '#fff' : '#47669b'} opacity=".12" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill={`url(#grid-${number})`} />
        <circle cx={880 + Math.sin(frame / fps) * 30} cy="820" r="460" fill={dark ? '#293a71' : '#d6e6ff'} />
        <circle cx="100" cy="1450" r="310" fill={dark ? '#20335a' : '#d6f7ed'} />
        <circle cx="910" cy="350" r="80" fill={colors.yellow} opacity=".7" />
      </svg>
      <div style={{position: 'absolute', left: 84, right: 84, top: 105, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, fontWeight: 800, letterSpacing: 3}}>
        <span>CUERPO EN MODO CIENCIA</span>
        <span style={{background: dark ? '#ffffff18' : colors.ink, color: 'white', padding: '15px 20px', borderRadius: 30}}>{number} / 04</span>
      </div>
      <div style={{position: 'absolute', top: 190, left: 84, fontSize: 28, letterSpacing: 5, fontWeight: 700, color: dark ? colors.mint : '#446da3'}}>{chapter}</div>
      {children}
    </AbsoluteFill>
  );
};

export const Heading: React.FC<{children: React.ReactNode; sub: string}> = ({children, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: 275, left: 84, right: 84, translate: `0 ${interpolate(frame, [0, 0.7 * fps], [45, 0], ease)}px`, opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], ease)}}>
      <div style={{fontSize: 94, lineHeight: 1.04, letterSpacing: -4, fontWeight: 900}}>{children}</div>
      <div style={{fontSize: 44, lineHeight: 1.3, marginTop: 26, maxWidth: 860}}>{sub}</div>
    </div>
  );
};

export const Pose: React.FC<{
  file: ApprovedPose;
  opacity?: number;
  sleeping?: boolean;
  zoom?: number;
}> = ({file, opacity = 1, sleeping = false, zoom = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 22, stiffness: 85}});
  return (
    <Img
      src={staticFile(`imagenes/personajes/${file}.png`)}
      style={{
        position: 'absolute',
        width: sleeping ? 990 : 720,
        height: sleeping ? 700 : 990,
        left: sleeping ? 45 : 180,
        top: sleeping ? 790 : 615,
        objectFit: 'contain',
        opacity,
        transformOrigin: '50% 80%',
        scale: zoom * (1 + Math.sin(frame / fps * 2) * 0.008),
        translate: `${(1 - entrance) * 180 + Math.sin(frame / fps * 1.3) * 9}px ${(1 - entrance) * 40 + Math.sin(frame / fps * 2) * 7}px`,
        rotate: `${Math.sin(frame / fps * 1.1) * 0.65}deg`,
      }}
    />
  );
};

export const Energy: React.FC<{value: number; label?: string; dark?: boolean}> = ({value, label = 'ENERGÍA', dark = false}) => (
  <div style={{position: 'absolute', left: 84, right: 84, top: 1590, padding: '25px 34px 20px', borderRadius: 30, background: dark ? '#182d52ee' : '#ffffffed', border: `2px solid ${dark ? '#ffffff25' : '#d2e2f3'}`}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 30, letterSpacing: 2, marginBottom: 18}}><span>{label}</span><span>{Math.round(value)}%</span></div>
    <div style={{height: 27, background: dark ? '#0d1736' : '#dce6f2', borderRadius: 20, overflow: 'hidden'}}>
      <div style={{height: '100%', width: `${value}%`, borderRadius: 20, background: value < 35 ? colors.coral : colors.mint}} />
    </div>
    <div style={{fontSize: 21, marginTop: 12, opacity: 0.7}}>Indicador ilustrativo, no una medición clínica.</div>
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  top: number;
  left: number;
  delay?: number;
  color?: string;
  opacity?: number;
}> = ({children, top, left, delay = 0, color = colors.yellow, opacity = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top, left, padding: '18px 26px', borderRadius: 22, background: color, color: colors.ink, fontSize: 38, fontWeight: 800, boxShadow: '0 10px 0 #13265312', opacity: opacity * interpolate(frame, [delay * fps, (delay + 0.4) * fps], [0, 1], ease), translate: `0 ${interpolate(frame, [delay * fps, (delay + 0.6) * fps], [24, 0], ease) + Math.sin(frame / fps * 2) * 5}px`}}>{children}</div>
  );
};

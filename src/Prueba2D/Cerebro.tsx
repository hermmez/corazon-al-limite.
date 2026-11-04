import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chip, Heading, Pose, Stage, colors, ease} from './Visuals';

export const Cerebro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const closeup = interpolate(frame, [0.7 * fps, 2.7 * fps], [1, 1.8], ease);
  const confused = interpolate(frame, [4.9 * fps, 5.3 * fps], [0, 1], ease);
  const activity = interpolate(frame, [0, 5 * fps], [82, 36], ease);
  return (
    <Stage dark chapter="03 · DENTRO DEL CEREBRO" number="03">
      <Heading sub="Cuesta concentrarse, recordar y reaccionar con rapidez.">Sigue activo.<br /><span style={{color: colors.mint}}>Rinde menos.</span></Heading>
      <div style={{position: 'absolute', left: 160, top: 675, width: 760, height: 760, borderRadius: '50%', background: '#ffffff0a', border: '2px solid #a3b9ff35', overflow: 'hidden', opacity: 1 - confused}}>
        <Img
          src={staticFile('imagenes/personajes/24_anatomia_cerebro.png')}
          style={{position: 'absolute', width: 1100, height: 1650, objectFit: 'contain', left: -170, top: 100, scale: closeup, transformOrigin: '50% 0%'}}
        />
      </div>
      <Pose file="15_confundido" opacity={confused} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <g opacity={1 - confused}>
          <ellipse cx="540" cy={775 + 70 * closeup} rx={65 * closeup} ry={32 * closeup} fill="none" stroke={colors.mint} strokeWidth="5" strokeDasharray="9 13" strokeDashoffset={-frame * 2} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={460 + i * 32} cy={775 + 70 * closeup + Math.sin(i * 2) * 26} r={4 + Math.sin(frame / fps * 7 + i) * 2} fill={colors.yellow} />
          ))}
        </g>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={150 + i * 110 + Math.sin(frame / fps + i) * 18} cy={760 + (i % 3) * 170 + Math.sin(frame / fps * 1.4 + i) * 35} r={4 + i % 3} fill={i % 2 ? colors.mint : colors.yellow} opacity={0.2 + (Math.sin(frame / fps * 3 + i) + 1) * 0.22} />
        ))}
        <path d={`M 100 1460 ${Array.from({length: 45}, (_, i) => `L ${100 + i * 20} ${1460 + Math.sin(i * 0.8 + frame / fps * 5) * activity / 2}`).join(' ')}`} fill="none" stroke={colors.mint} strokeWidth="5" />
      </svg>
      <Chip top={1150} left={650} delay={1} color={colors.mint}>Atención ↓</Chip>
      <Chip top={1285} left={84} delay={2.3} color={colors.yellow}>Memoria ↓</Chip>
      <Chip top={1355} left={650} delay={3.5} color={colors.coral}>Reflejos ↓</Chip>
      <div style={{position: 'absolute', left: 84, right: 84, top: 1590, fontSize: 26, color: '#c6d6ff', lineHeight: 1.4}}>
        ACTIVIDAD · REPRESENTACIÓN ILUSTRATIVA
        <div style={{display: 'flex', alignItems: 'end', gap: 10, height: 75, marginTop: 22}}>
          {Array.from({length: 18}, (_, i) => <div key={i} style={{width: 26, flexShrink: 0, height: activity * (0.4 + Math.abs(Math.sin(i * 1.5 + frame / fps * 2)) * 0.5), background: i < 11 ? colors.mint : colors.coral, borderRadius: 6}} />)}
          <span style={{fontSize: 31, marginLeft: 15, whiteSpace: 'nowrap'}}>ATENCIÓN ↓</span>
        </div>
      </div>
    </Stage>
  );
};

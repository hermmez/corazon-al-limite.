import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chip, Energy, Heading, Pose, Stage, colors, ease} from './Visuals';

export const Recuperacion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wake = interpolate(frame, [4.5 * fps, 5.2 * fps], [0, 1], ease);
  return (
    <Stage dark background={interpolateColors(wake, [0, 1], ['#15234c', '#197b86'])} chapter="04 · TIEMPO DE RECARGAR" number="04">
      <Heading sub="El descanso ayuda a recuperar energía y concentración.">Dormir también<br /><span style={{color: colors.mint}}>es cuidarte.</span></Heading>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <g opacity={1 - wake}>
          <path d="M 840 780 A 95 95 0 1 1 740 670 A 85 85 0 0 0 840 780" fill={colors.yellow} />
          <ellipse cx="535" cy="1370" rx={420 + Math.sin(frame / fps * 1.7) * 8} ry="60" fill="#0b1635" />
        </g>
        <circle cx="840" cy="760" r={72 + Math.sin(frame / fps * 2) * 4} fill={colors.yellow} opacity={wake} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d="M 0 -12 V 12 M -12 0 H 12" transform={`translate(${120 + i * 138} ${670 + (i % 3) * 85})`} stroke={colors.mint} strokeWidth="4" opacity={0.35 + Math.sin(frame / fps * 2 + i) * 0.3} />)}
      </svg>
      <Pose file="23_durmiendo" sleeping opacity={1 - wake} />
      <Pose file="13_feliz" opacity={wake} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 220 + i * 55, top: 850 - i * 60 - (frame % (3 * fps)) / (3 * fps) * 70, fontSize: 42 + i * 12, fontWeight: 800, color: colors.mint, opacity: (1 - wake) * interpolate(frame % (3 * fps), [0, 0.5 * fps, 2 * fps, 3 * fps], [0, 0.9, 0.9, 0], ease)}}>z</div>)}
      <Chip top={1435} left={160} delay={1.3} color={colors.yellow} opacity={1 - wake}>Adultos: procura dormir 7–9 h</Chip>
      <Chip top={1435} left={645} delay={4.7} color={colors.yellow} opacity={wake}>¡A recargar!</Chip>
      <Energy dark value={interpolate(frame, [0, 6.3 * fps], [23, 100], ease)} label="RECUPERANDO ENERGÍA" />
    </Stage>
  );
};

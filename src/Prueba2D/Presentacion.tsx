import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chip, Energy, Heading, Pose, Stage, ease} from './Visuals';

export const Presentacion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const change = interpolate(frame, [2 * fps, 2.4 * fps], [0, 1], ease);
  return (
    <Stage chapter="01 · LA PREGUNTA" number="01">
      <Heading sub="Una noche sin dormir cambia cómo te sientes.">¿Qué pasa cuando<br /><span style={{color: '#157d85'}}>no duermes?</span></Heading>
      <Pose file="01_neutral" opacity={1 - change} />
      <Pose file="02_explicando" opacity={change} />
      <Chip top={720} left={680} delay={1}>¿Y mañana?</Chip>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <path d="M 765 875 Q 950 1010 810 1190" fill="none" stroke="#1eb6a1" strokeWidth="8" strokeDasharray="16 15" strokeDashoffset={-frame * 1.5} />
        <path d="m 790 1160 20 35 38-17" fill="none" stroke="#1eb6a1" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <Energy value={interpolate(frame, [0, 7 * fps], [100, 82], ease)} />
    </Stage>
  );
};

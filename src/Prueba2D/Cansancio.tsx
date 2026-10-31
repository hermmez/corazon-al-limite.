import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chip, Energy, Heading, Pose, Stage, ease} from './Visuals';

export const Cansancio: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const change = interpolate(frame, [2.6 * fps, 3 * fps], [0, 1], ease);
  return (
    <Stage chapter="02 · SEÑALES DEL CUERPO" number="02">
      <Heading sub="Aumenta la somnolencia y cuesta mantener la atención.">Tu energía<br /><span style={{color: '#df546b'}}>baja el ritmo.</span></Heading>
      <Pose file="05_cansado" opacity={1 - change} zoom={interpolate(frame, [0, 8 * fps], [1, 1.06], ease)} />
      <Pose file="18_bostezando" opacity={change} zoom={1.06} />
      <Chip top={760} left={80} delay={0.8} color="#ffb4bc">Cansancio</Chip>
      <Chip top={1110} left={680} delay={3}>Bostezos</Chip>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2].map((i) => <path key={i} d={`M ${745 + i * 32} ${700 + i * 25} q 24 35 0 70`} fill="none" stroke="#eb7e99" strokeWidth="6" opacity={0.4 + Math.sin(frame / fps * 2.5 + i) * 0.3} />)}
      </svg>
      <Energy value={interpolate(frame, [0, 7.5 * fps], [82, 23], ease)} />
    </Stage>
  );
};

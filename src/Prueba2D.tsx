import React from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Presentacion} from './Prueba2D/Presentacion';
import {Cansancio} from './Prueba2D/Cansancio';
import {Cerebro} from './Prueba2D/Cerebro';
import {Recuperacion} from './Prueba2D/Recuperacion';

export const Prueba2D: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#eef6ff'}}>
      {/* 222 + 252 + 252 + 210 - 3 × 12 = 900 frames.
          Incoming scenes start at precisely 7, 15 and 23 seconds. */}
      <TransitionSeries>
        <TransitionSeries.Sequence name="01 · Introducción" durationInFrames={7.4 * fps} premountFor={fps}>
          <Presentacion />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 0.4 * fps})} />
        <TransitionSeries.Sequence name="02 · Cansancio" durationInFrames={8.4 * fps} premountFor={fps}>
          <Cansancio />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 0.4 * fps})} />
        <TransitionSeries.Sequence name="03 · Cerebro" durationInFrames={8.4 * fps} premountFor={fps}>
          <Cerebro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 0.4 * fps})} />
        <TransitionSeries.Sequence name="04 · Descanso" durationInFrames={7 * fps} premountFor={fps}>
          <Recuperacion />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <div style={{position: 'absolute', bottom: 100, left: 84, right: 84, fontFamily: 'Arial, sans-serif', fontSize: 24, color: frame < 15 * fps ? '#46618b' : '#c6d6ff', display: 'flex', justifyContent: 'space-between'}}>
        <span>CORAZÓN AL LÍMITE · PRUEBA 2D</span>
        <span>{String(Math.floor(frame / fps)).padStart(2, '0')} / 30 s</span>
      </div>
      <div style={{position: 'absolute', bottom: 76, left: 84, width: 912, height: 5, background: '#7892bd40'}}>
        <div style={{width: `${frame / (durationInFrames - 1) * 100}%`, height: '100%', background: '#21bda0'}} />
      </div>
    </AbsoluteFill>
  );
};

import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { SceneTitle } from "../../Piloto10s/Titles";
import { EPISODE, SCENES } from "./config";
import { Background, C, ease, p } from "./primitives";
import {
  BrainActor,
  Closing,
  Hospital,
  LayersOfHead,
  Migraine,
  NeuralJourney,
  Opening,
} from "./scenes";
import { EpisodeCaptions } from "./Captions";
import { interpolate } from "remotion";

const useEpisodeFont = () => {
  const [handle] = useState(() => delayRender("Manrope local · episodio 01"));
  useEffect(() => {
    const font = new FontFace(
      "Episode Manrope",
      `url("${staticFile("piloto10s/fonts/Manrope[wght].ttf")}")`,
      { weight: "200 800" },
    );
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle]);
};

export const Episodio01Cerebro: React.FC = () => {
  useEpisodeFont();
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    time = frame / fps;
  const scene = SCENES.findIndex((s) => time >= s.start && time < s.end),
    current = SCENES[Math.max(0, scene)];
  const dark = scene === 0 || scene === 3 || scene === 4 || scene === 7;
  // Controlled camera moves match the direction of the shared anatomy actor.
  const zoom = interpolate(
    time,
    [
      0, 0.8, 4.4, 5.4, 12.3, 13.3, 21.3, 22.6, 32.3, 33.6, 43.3, 44.6, 54.3,
      55.5, 63.3, 64.6, 69.97,
    ],
    [
      1.1, 1, 1.035, 1, 1, 1.035, 1.04, 1, 1, 1.035, 1.03, 1, 1, 1.025, 1, 1.02,
      1,
    ],
    ease,
  );
  return (
    <AbsoluteFill
      style={{
        fontFamily: '"Episode Manrope",sans-serif',
        background: C.navy,
        overflow: "hidden",
      }}
    >
      <Background time={time} />
      <AbsoluteFill
        style={{
          transformOrigin: "50% 53%",
          transform: `scale(${zoom}) translate(${Math.sin(time * 0.24) * 5}px,${Math.sin(time * 0.4) * 3}px)`,
        }}
      >
        <Opening time={time} />
        <Migraine time={time} />
        <LayersOfHead time={time} />
        <NeuralJourney time={time} />
        <Hospital time={time} />
        <Closing time={time} />
        <BrainActor time={time} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 103,
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: dark ? C.cream : C.ink,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 2.6,
        }}
      >
        <svg width="35" height="34" viewBox="0 0 40 40">
          <path d="M20 33C-7 15 8 1 20 12C32 1 47 15 20 33Z" fill={C.coral} />
          <path
            d="M9 21h6l3-6 4 13 3-7h6"
            fill="none"
            stroke={C.cream}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        CORAZÓN AL LÍMITE
      </div>
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 164,
          display: "flex",
          gap: 8,
        }}
      >
        {SCENES.map((s, i) => (
          <div
            key={i}
            style={{
              width: 99,
              height: 4,
              borderRadius: 2,
              background: dark ? "#FFF4E022" : "#102C4322",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 4,
                width: `${p(time, s.start, s.end) * 100}%`,
                background: C.teal,
              }}
            />
          </div>
        ))}
      </div>
      <SceneTitle
        key={scene}
        time={time}
        start={current.start + 0.05}
        end={current.end}
        label={`EP. 01 / ${String(scene + 1).padStart(2, "0")} · ${current.name.toUpperCase()}`}
        lines={[...current.lines]}
        sizes={[...current.sizes]}
        accent={dark ? C.gold : "#C6524D"}
        dark={dark}
        note={current.note}
      />
      <EpisodeCaptions time={time} />
      {EPISODE.audioReady && (
        <Audio src={staticFile(EPISODE.audioSrc)} volume={1} />
      )}
    </AbsoluteFill>
  );
};

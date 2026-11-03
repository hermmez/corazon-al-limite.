import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
import { Audio } from "@remotion/media";
import { SceneTitle } from "../../Piloto10s/Titles";
import { C, p, lift, sceneAt, activeEvent, cueTime } from "./motion";
import { StoryWorld } from "./World";
import { CaptionsTiempo } from "./Captions";
import timeline from "./timeline.json";
import chapters from "./chapters.json";
import labels from "./labels.json";

const useFont = () => {
  const [handle] = useState(() => delayRender("Manrope local · episodio02"));
  useEffect(() => {
    new FontFace(
      "Episode Manrope",
      `url("${staticFile("piloto10s/fonts/Manrope[wght].ttf")}")`,
      { weight: "200 800" },
    )
      .load()
      .then((font) => {
        document.fonts.add(font);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle]);
};

export const Episodio02Tiempo: React.FC = () => {
  useFont();
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    time = frame / fps,
    scene = Math.max(0, sceneAt(time)),
    chapter = chapters[scene],
    s = timeline.scenes[scene],
    event = activeEvent(time),
    action = Math.min(5, event.action),
    age = time - s.start,
    focus = lift(time - event.start, fps),
    dark = chapter.dark;
  // Moves link successive chapters; inner scene gestures follow spoken concepts.
  const anchors = [
    { x: 0, y: 0, z: 1 },
    { x: -8, y: 0, z: 1.015 },
    { x: 8, y: -5, z: 1.025 },
    { x: -8, y: 0, z: 1.015 },
    { x: 0, y: -5, z: 1.025 },
    { x: 0, y: 0, z: 1.01 },
    { x: 8, y: -4, z: 1.02 },
    { x: 0, y: 0, z: 1.015 },
  ];
  const before = anchors[Math.max(0, scene - 1)],
    after = anchors[scene],
    k = p(age, 0, 0.32),
    x = before.x + (after.x - before.x) * k,
    y = before.y + (after.y - before.y) * k,
    zoom = before.z + (after.z - before.z) * k;
  const enter = p(age, 0, 0.32),
    endQuestion = scene === 7 && action >= 4;
  const titleStart = endQuestion ? cueTime(7, 4) : s.start;
  const note = [
    "La percepción cambia; el reloj no.",
    "Atención, rutina, novedad y memoria pueden influir.",
    "Hitos que distinguen una experiencia de otra.",
    "Rutina no significa deterioro de la memoria.",
    "Comparación retrospectiva, no horas diferentes.",
    "Durante una experiencia y al recordarla después.",
    "Novedad con intención: no una promesa de frenar el tiempo.",
    "No hay una explicación única para todas las personas.",
  ][scene];
  return (
    <AbsoluteFill
      style={{
        fontFamily: '"Episode Manrope",sans-serif',
        overflow: "hidden",
        background: dark ? C.navy : C.cream,
      }}
    >
      <svg
        width={1080}
        height={1920}
        style={{
          position: "absolute",
          inset: 0,
          translate: `${x * 0.25}px ${y * 0.25}px`,
        }}
      >
        <defs>
          <radialGradient id="e02-glow">
            <stop stopColor={C.teal} stopOpacity=".18" />
            <stop offset="1" stopColor={C.teal} stopOpacity="0" />
          </radialGradient>
          <pattern
            id="e02-grid"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M90 0H0V90"
              stroke={C.teal}
              strokeWidth="1"
              opacity=".1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#e02-grid)" />
        <ellipse cx="550" cy="940" rx="700" ry="900" fill="url(#e02-glow)" />
        {[...Array(12)].map((_, i) => (
          <circle
            key={i}
            cx={75 + i * 83}
            cy={580 + ((i * 157) % 700)}
            r={i % 3 === 0 ? 3 : 2}
            fill={C.teal}
            opacity=".15"
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          transformOrigin: "50% 48%",
          scale: zoom,
          translate: `${x}px ${y}px`,
        }}
      >
        {scene > 0 && age < 0.34 && (
          <AbsoluteFill
            style={{
              translate: `${-enter * 75}px 0`,
              opacity: 1 - p(age, 0.1, 0.34),
            }}
          >
            <StoryWorld
              scene={scene - 1}
              time={timeline.scenes[scene - 1].end - 0.001}
              action={5}
            />
          </AbsoluteFill>
        )}
        <AbsoluteFill
          style={{
            clipPath:
              scene === 0
                ? undefined
                : scene % 2 === 0
                  ? `inset(0 ${(1 - enter) * 100}% 0 0 round 34px)`
                  : `circle(${enter * 150}% at 50% 48%)`,
            translate: `${(1 - enter) * (scene === 0 ? 0 : 55)}px 0`,
          }}
        >
          <StoryWorld time={time} scene={scene} action={action} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 103,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 2.6,
          color: dark ? C.cream : C.ink,
          display: "flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        <svg width="35" height="34" viewBox="0 0 40 40">
          <path d="M20 33C-7 15 8 1 20 12C32 1 47 15 20 33Z" fill={C.coral} />
          <path
            d="M9 21h6l3-6 4 13 3-7h6"
            stroke={C.cream}
            strokeWidth="2"
            fill="none"
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
        {timeline.scenes.map((v, i) => (
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
                width: `${p(time, v.start, v.end) * 100}%`,
                background: C.teal,
              }}
            />
          </div>
        ))}
      </div>
      <SceneTitle
        key={`${scene}-${endQuestion}`}
        time={titleStart + (time - titleStart) * 1.25 + (scene === 0 ? 0.8 : 0)}
        start={titleStart}
        end={titleStart + (s.end - titleStart) * 1.25 + (scene === 0 ? 0.8 : 0)}
        label={`EP. 02 · ${chapter.title}`}
        lines={endQuestion ? ["¿SE TE VA", "VOLANDO EL AÑO?"] : chapter.lines}
        sizes={endQuestion ? [108, 79] : chapter.sizes}
        accent={dark ? C.gold : "#C6524D"}
        dark={dark}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 1265,
          width: 850,
          minHeight: 170,
          boxSizing: "border-box",
          padding: "23px 28px",
          borderRadius: 25,
          background: dark ? "#16364C" : C.cream,
          border: `2px solid ${C.teal}44`,
          color: dark ? C.cream : C.ink,
          boxShadow: "0 12px 30px #07132110",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1.2,
            color: dark ? C.gold : "#08796F",
            clipPath: `inset(0 0 ${(1 - focus) * 100}% 0)`,
            translate: `0 ${(1 - focus) * 8}px`,
          }}
        >
          {labels[scene][action]}
        </div>
        <div
          style={{
            fontSize: 23,
            fontWeight: 650,
            lineHeight: 1.25,
            marginTop: 14,
            opacity: 0.74,
          }}
        >
          {note}
        </div>
      </div>
      <CaptionsTiempo time={time} />
      {timeline.audioReady && (
        <Audio
          src={staticFile(
            "episodios/episodio-02-tiempo/audio/mezcla_master.flac",
          )}
          premountFor={fps}
          volume={1}
        />
      )}
    </AbsoluteFill>
  );
};

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
import { C, p, lift, sceneAt, activeEvent, cueTime } from "./motion";
import { StoryWorld } from "./World";
import { CaptionsTiempo } from "./Captions";
import timeline from "./timeline.json";

const useFont = () => {
  const [handle] = useState(() =>
    delayRender("Manrope · una historia cotidiana"),
  );
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
const chapterHeadings = [
  {
    context: "UN DÍA CUALQUIERA",
    lines: ["¿YA ES", "DICIEMBRE?"],
    sizes: [108, 108],
  },
  {
    context: "LAS MISMAS 24 HORAS",
    lines: ["MISMO DÍA.", "OTRA SENSACIÓN."],
    sizes: [92, 84],
  },
  {
    context: "UN RECUERDO DE INFANCIA",
    lines: ["AQUEL PRIMER DÍA."],
    sizes: [82],
  },
  {
    context: "LUNES. MARTES. OTRA VEZ.",
    lines: ["¿OTRA VEZ LO MISMO?"],
    sizes: [78],
  },
  {
    context: "UNA SEMANA DISTINTA",
    lines: ["ESA SEMANA", "QUE SÍ RECUERDAS."],
    sizes: [91, 80],
  },
  { context: "DOS PERSPECTIVAS", lines: ["ESPERAR ≠ RECORDAR."], sizes: [75] },
  { context: "HOY CAMBIA ALGO", lines: ["POR OTRO CAMINO."], sizes: [86] },
  {
    context: "AL TERMINAR EL DÍA",
    lines: ["UN DÍA", "QUE SE DISTINGUE."],
    sizes: [94, 82],
  },
];
const StoryHeading: React.FC<{
  time: number;
  scene: number;
  question: boolean;
}> = ({ time, scene, question }) => {
  const { fps } = useVideoConfig(),
    start = question ? cueTime(7, 4) : timeline.scenes[scene].start,
    age = time - start,
    entrance = scene === 0 && !question ? 1 : lift(age + 0.035, fps),
    hold = scene === 0 ? 2.8 : 1.55,
    visible = question ? 1 : 1 - p(age, hold, hold + 0.3),
    h = chapterHeadings[scene],
    lines = question ? ["¿SE TE VA", "VOLANDO EL AÑO?"] : h.lines,
    sizes = question ? [106, 78] : h.sizes;
  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        top: question ? 244 : 225,
        width: 850,
        color: C.cream,
        opacity: visible,
        translate: `0 ${(1 - entrance) * -12}px`,
        textShadow: "0 3px 18px #07132166",
      }}
    >
      <div
        style={{
          fontSize: 23,
          fontWeight: 800,
          letterSpacing: 3,
          marginBottom: 24,
          color: C.teal,
          clipPath: `inset(0 ${(1 - entrance) * 100}% 0 0)`,
        }}
      >
        {question ? "CORAZÓN AL LÍMITE" : h.context}
      </div>
      {lines.map((line, i) => (
        <div key={line} style={{ overflow: "hidden", height: sizes[i] * 1.1 }}>
          <div
            style={{
              fontSize: sizes[i],
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -3,
              whiteSpace: "nowrap",
              color: i === lines.length - 1 ? C.gold : C.cream,
              translate: `0 ${(1 - entrance) * 110}%`,
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};

export const Episodio02Tiempo: React.FC = () => {
  useFont();
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    time = frame / fps,
    scene = Math.max(0, sceneAt(time)),
    s = timeline.scenes[scene],
    age = time - s.start,
    event = activeEvent(time),
    action = Math.min(5, event.action),
    enter = p(age, 0, 0.3),
    question = scene === 7 && time >= cueTime(7, 4);
  // Motivated edits: a remembered morning, a door, a change of focus and a walk.
  const transition = [
    "opening",
    "match",
    "memory",
    "door",
    "match",
    "focus",
    "travel",
    "door",
  ][scene];
  const incoming: React.CSSProperties =
    transition === "door"
      ? { clipPath: `inset(0 ${(1 - enter) * 100}% 0 0)` }
      : transition === "travel"
        ? { translate: `${(1 - enter) * 1080}px 0` }
        : transition === "memory"
          ? {
              opacity: enter,
              scale: 1 + 0.06 * (1 - enter),
              transformOrigin: "50% 45%",
            }
          : transition === "focus"
            ? {
                opacity: enter,
                scale: 1 + 0.05 * (1 - enter),
                transformOrigin: "50% 48%",
              }
            : { opacity: scene === 0 ? 1 : enter };
  return (
    <AbsoluteFill
      style={{
        fontFamily: '"Episode Manrope",sans-serif',
        overflow: "hidden",
        background: C.navy,
      }}
    >
      {scene > 0 && age < 0.32 && (
        <AbsoluteFill
          style={{
            translate:
              transition === "travel" ? `${-enter * 1080}px 0` : undefined,
          }}
        >
          <StoryWorld
            time={timeline.scenes[scene - 1].end - 0.001}
            scene={scene - 1}
            action={5}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={incoming}>
        <StoryWorld time={time} scene={scene} action={action} />
      </AbsoluteFill>
      {transition === "memory" && age < 0.28 && (
        <AbsoluteFill
          style={{
            background: C.gold,
            opacity: 0.28 * Math.exp(-Math.pow((age - 0.07) / 0.055, 2)),
          }}
        />
      )}
      {transition === "door" && age < 0.3 && (
        <div
          style={{
            position: "absolute",
            left: enter * 1080 - 20,
            top: 0,
            width: 30,
            height: 1920,
            background: "#26494F",
            boxShadow: "-20px 0 50px #07132155",
            opacity: 1 - p(age, 0.24, 0.3),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 560,
          background:
            "linear-gradient(180deg,#071725E8 0%,#0C2035B8 36%,#0C203530 78%,#0C203500 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: 510,
          background:
            "linear-gradient(180deg,#0C203500 0%,#0C2035A0 34%,#0C2035EE 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 103,
          display: "flex",
          alignItems: "center",
          gap: 13,
          color: C.cream,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 2.5,
          textShadow: "0 2px 12px #07132177",
        }}
      >
        <svg width="33" height="33" viewBox="0 0 40 40">
          <path d="M20 33C-7 15 8 1 20 12C32 1 47 15 20 33Z" fill={C.coral} />
          <path
            d="M9 21h6l3-6 4 13 3-7h6"
            stroke={C.cream}
            strokeWidth="2"
            fill="none"
          />
        </svg>
        CORAZÓN AL LÍMITE{" "}
        <span style={{ fontSize: 19, opacity: 0.65, marginLeft: 8 }}>02</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 166,
          display: "flex",
          gap: 8,
        }}
      >
        {timeline.scenes.map((v, i) => (
          <div
            key={i}
            style={{
              width: 99,
              height: 3,
              borderRadius: 2,
              background: "#FFF4E026",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 3,
                width: `${p(time, v.start, v.end) * 100}%`,
                background: C.teal,
              }}
            />
          </div>
        ))}
      </div>
      <StoryHeading time={time} scene={scene} question={question} />
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

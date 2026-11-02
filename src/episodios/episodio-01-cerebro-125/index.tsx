import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { SceneTitle } from "../../Piloto10s/Titles";
import { C, activeEvent, cueTime, ease, lift, p, sceneAt } from "./motion";
import { StoryWorld, TravelingBrain } from "./World";
import { Captions125 } from "./Captions";
import timeline from "./timeline.json";
import chapters from "./chapters.json";
import labels from "./labels.json";

const useFont = () => {
  const [handle] = useState(() => delayRender("Manrope local · ritmo125"));
  useEffect(() => {
    const font = new FontFace(
      "Episode Manrope",
      `url("${staticFile("piloto10s/fonts/Manrope[wght].ttf")}")`,
      { weight: "200 800" },
    );
    font
      .load()
      .then((f) => {
        document.fonts.add(f);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle]);
};

const Stage: React.FC<{
  time: number;
  scene: number;
  children: React.ReactNode;
}> = ({ time, scene, children }) => {
  const start = timeline.scenes[scene].start,
    age = time - start,
    enter = p(age, 0, 0.34);
  const mask =
    scene % 3 === 0
      ? `circle(${enter * 150}% at 56% 48%)`
      : scene % 3 === 1
        ? `inset(0 ${(1 - enter) * 100}% 0 0)`
        : `polygon(0 0,${enter * 130}% 0,${enter * 130 - 15}% 100%,0 100%)`;
  return (
    <AbsoluteFill
      style={{
        clipPath: scene === 0 || scene === 6 ? undefined : mask,
        translate: `${scene === 6 ? 0 : (1 - enter) * 85}px 0`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Episodio01Cerebro125: React.FC = () => {
  useFont();
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    time = frame / fps,
    scene = Math.max(0, sceneAt(time)),
    chapter = chapters[scene],
    s = timeline.scenes[scene],
    event = activeEvent(time),
    action = Math.min(5, event.action),
    age = time - s.start;
  const dark = chapter.dark,
    previousDark = chapters[Math.max(0, scene - 1)].dark;
  const eventAge = time - event.start,
    focus = lift(eventAge, fps);
  type FocusEvent = {
    action: number;
    scene: number;
    detail?: string;
    visible?: string;
  };
  const target = (a: number, detail?: string, sceneIndex = scene) =>
    detail
      ? ({
          face: { zoom: 1.1, x: -45, y: -30 },
          meninges: { zoom: 1.08, x: -10, y: 20 },
          "outer-head": { zoom: 1.05, x: 0, y: -5 },
          stimulus: { zoom: 1.085, x: 25, y: -15 },
          monitor: { zoom: 1.08, x: -45, y: 35 },
          protocol: { zoom: 1.045, x: 12, y: 5 },
          networks: { zoom: 1.1, x: 35, y: -15 },
          relay: { zoom: 1.045, x: -10, y: 15 },
        }[detail] ?? { zoom: 1.025, x: 0, y: 0 })
      : {
          zoom: a === 1 ? 1.075 : 1.015 + (a === 2 || a === 4 ? 0.04 : 0.01),
          x:
            a === 1
              ? [0, -35, -28, -35, -18, 45, 45, -20][sceneIndex]
              : a === 2
                ? -18
                : a === 4
                  ? 20
                  : 0,
          y:
            a === 1
              ? [0, -20, -30, -10, -45, 25, 25, -5][sceneIndex]
              : a === 2
                ? -15
                : a === 4
                  ? 9
                  : 0,
        };
  const previousEvent =
    timeline.events[Math.max(0, timeline.events.indexOf(event) - 1)];
  const before = target(
      previousEvent.action,
      (previousEvent as FocusEvent).detail,
      previousEvent.scene,
    ),
    after = target(action, (event as FocusEvent).detail);
  const zoom =
    scene === 0
      ? interpolate(time, [0, 0.28, 0.65], [1.13, 1.01, 1], ease)
      : before.zoom + (after.zoom - before.zoom) * focus;
  const x = before.x + (after.x - before.x) * focus,
    y = before.y + (after.y - before.y) * focus;
  const priorScene = Math.max(0, scene - 1),
    priorAction = 5;
  return (
    <AbsoluteFill
      style={{
        fontFamily: '"Episode Manrope",sans-serif',
        overflow: "hidden",
        background: previousDark ? C.navy : C.cream,
      }}
    >
      <AbsoluteFill
        style={{
          background: dark ? C.navy : C.cream,
          clipPath:
            scene === 0 || dark === previousDark
              ? undefined
              : `circle(${p(age, 0, 0.38) * 160}% at 55% 49%)`,
        }}
      />
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          translate: `${x * 0.23}px ${y * 0.23}px`,
        }}
      >
        <defs>
          <radialGradient id="pace-glow">
            <stop stopColor={C.teal} stopOpacity=".22" />
            <stop offset="1" stopColor={C.teal} stopOpacity="0" />
          </radialGradient>
          <pattern
            id="pace-grid"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            <path d="M90 0H0V90" stroke={C.teal} fill="none" opacity=".1" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#pace-grid)" />
        <circle cx={600 + x * 0.3} cy="970" r="800" fill="url(#pace-glow)" />
        {[...Array(16)].map((_, i) => (
          <circle
            key={i}
            cx={70 + ((i * 177) % 950) + x * 0.4}
            cy={570 + ((i * 127) % 840) + y * 0.4}
            r={i % 3 === 0 ? 4 : 2}
            fill={C.teal}
            opacity=".19"
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          transformOrigin: "50% 51%",
          scale: zoom,
          translate: `${x}px ${y}px`,
        }}
      >
        {scene > 0 && scene !== 6 && age < 0.36 && (
          <AbsoluteFill
            style={{
              opacity: 1 - p(age, 0.12, 0.36),
              translate: `${-p(age, 0, 0.36) * 90}px 0`,
            }}
          >
            <StoryWorld
              time={timeline.scenes[priorScene].end - 0.001}
              scene={priorScene}
              action={priorAction}
            />
          </AbsoluteFill>
        )}
        <Stage time={time} scene={scene}>
          <StoryWorld time={time} scene={scene} action={action} />
        </Stage>
        <TravelingBrain time={time} scene={scene} action={action} />
        {scene > 0 && age < 0.7 && (
          <svg
            width="1080"
            height="1920"
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d="M250 780C400 680 720 750 790 1030"
              pathLength="1"
              stroke={C.gold}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
              strokeDasharray=".12 .88"
              strokeDashoffset={-p(age, 0, 0.65)}
              opacity={1 - p(age, 0.38, 0.7)}
            />
          </svg>
        )}
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
        {timeline.scenes.map((s, i) => (
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
        time={s.start + (time - s.start) * 1.25}
        start={s.start}
        end={s.start + (s.end - s.start) * 1.25}
        label={`EP. 01 · ${chapter.title.toUpperCase()}`}
        lines={chapter.lines}
        sizes={chapter.sizes}
        accent={dark ? C.gold : "#C6524D"}
        dark={dark}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 1250,
          width: 850,
          height: 184,
          boxSizing: "border-box",
          padding: "24px 28px",
          borderRadius: 25,
          background: dark ? "#16364C" : C.cream,
          border: `2px solid ${C.teal}44`,
          color: dark ? C.cream : C.ink,
          boxShadow: "0 12px 30px #07132110",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1.2,
            color: dark ? C.gold : "#08796F",
            clipPath: `inset(0 0 ${(1 - focus) * 100}% 0)`,
            translate: `0 ${(1 - focus) * 9}px`,
          }}
        >
          {(event as FocusEvent).visible ?? labels[scene][action]}
        </div>
        <div
          style={{
            fontSize: 23,
            fontWeight: 700,
            marginTop: 18,
            opacity: 0.72,
          }}
        >
          {scene === 5
            ? "Vigilar el lenguaje y el movimiento."
            : scene === 6
              ? "Con anestesia y supervisión médica."
              : scene === 4
                ? "Representación simplificada de una vía nerviosa."
                : scene === 3
                  ? "La migraña involucra mecanismos neurológicos complejos."
                  : scene === 7
                    ? "El propio tejido cerebral carece de nociceptores."
                    : "Detectar daño e interpretar dolor no son lo mismo."}
        </div>
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            bottom: 18,
            height: 3,
            background: dark ? "#FFF4E015" : "#102C4315",
          }}
        >
          <div
            style={{
              height: 3,
              width: `${p(time, event.start, timeline.events[timeline.events.indexOf(event) + 1]?.start ?? 70) * 100}%`,
              background: C.teal,
            }}
          />
        </div>
      </div>
      {!timeline.audioReady && (
        <div
          style={{
            position: "absolute",
            left: 86,
            top: 1730,
            color: dark ? C.coral : C.ink,
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          PREVISUALIZACIÓN · VOZ AMPLIADA PENDIENTE
        </div>
      )}
      <Captions125 time={time} />
      {(timeline.audioReady || timeline.previewAudioReady) && (
        <Audio
          src={staticFile(
            `episodios/episodio-01-cerebro-125/audio/${timeline.audioReady ? "mezcla_master" : "mezcla_preview"}.flac`,
          )}
          premountFor={fps}
        />
      )}
    </AbsoluteFill>
  );
};

import React from "react";
import { Character } from "./Character";
import { Circulation, SleepClock } from "./Anatomy";
import { C, p, mix } from "./motion";

export const HookScene: React.FC<{ time: number }> = ({ time }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      clipPath: `circle(${mix(1800, 0, p(time, 1.72, 2.22))}px at 565px 910px)`,
    }}
  >
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <ellipse
        cx="535"
        cy="1060"
        rx="398"
        ry="438"
        fill={C.teal}
        opacity=".045"
      />
      <path
        d="M190 723l-45-30m670 30 45-30M175 820l-58-5m747 5 58-5"
        stroke={C.gold}
        strokeWidth="5"
        strokeLinecap="round"
        opacity={p(time, 0.12, 0.32) * (1 - p(time, 1.35, 1.7))}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        translate: `0 ${mix(70, 0, p(time, 0, 0.45))}px`,
      }}
    >
      <Character
        pose="surprised"
        generated
        time={time}
        x={530}
        y={1000}
        width={605}
      />
    </div>
  </div>
);
export const ExplanationScene: React.FC<{ time: number }> = ({ time }) => (
  <Circulation time={time} />
);
export const ConsequenceScene: React.FC<{ time: number }> = ({ time }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      translate: `${mix(-560, 0, p(time, 4.8, 5.4)) - mix(0, 620, p(time, 7.5, 8.15))}px 0`,
    }}
  >
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <rect x="84" y="640" width="427" height="795" rx="56" fill={C.navy} />
      <path
        d="M542 770v560"
        stroke={C.teal}
        strokeWidth="3"
        strokeDasharray="7 15"
        opacity=".4"
      />
      <path
        d="M547 1010c72-60 95-60 150-20"
        stroke={C.coral}
        strokeWidth="3"
        fill="none"
        opacity=".5"
      />
    </svg>
    <SleepClock time={time} />
    <div
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <Character pose="tired" time={time} x={299} y={1131} width={416} />
    </div>
  </div>
);
export const ClosingScene: React.FC<{ time: number }> = ({ time }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      translate: `${mix(-600, 0, p(time, 7.75, 8.32))}px 0`,
    }}
  >
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <circle cx="445" cy="1125" r="366" fill={C.teal} opacity=".065" />
      <circle
        cx="445"
        cy="1125"
        r={315 + Math.sin(time) * 5}
        fill="none"
        stroke={C.teal}
        strokeWidth="2"
        opacity=".16"
      />
    </svg>
    <Character pose="explaining" time={time} x={400} y={1070} width={520} />
  </div>
);

import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { C, p, mix, ease } from "./motion";

export const PilotBackground: React.FC<{ time: number }> = ({ time }) => (
  <AbsoluteFill style={{ background: C.navy }}>
    <svg width="1080" height="1920" aria-hidden>
      <defs>
        <radialGradient id="pilot-glow">
          <stop stopColor={C.teal} stopOpacity=".2" />
          <stop offset="1" stopColor={C.teal} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx={550 + Math.sin(time * 0.45) * 22}
        cy="1020"
        r="780"
        fill="url(#pilot-glow)"
      />
      <circle
        cx="565"
        cy="910"
        r={interpolate(time, [1.66, 1.96, 2.16], [0, 390, 2200], ease)}
        fill={C.cream}
      />
      <ellipse
        cx={750 - time * 5}
        cy="1050"
        rx="610"
        ry="550"
        fill={C.teal}
        opacity={time < 1.7 ? 0.07 : 0.065}
      />
      <circle cx="42" cy="1580" r="330" fill={C.coral} opacity=".065" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle
          key={i}
          cx={80 + ((i * 173) % 910) + Math.sin(time * 0.5 + i) * 10}
          cy={190 + ((i * 223) % 1470) + Math.cos(time * 0.5 + i) * 12}
          r={i % 4 === 0 ? 3 : 2}
          fill={time < 1.95 ? C.cream : C.ink}
          opacity=".12"
        />
      ))}
      <path
        d="M-80 1120 Q540 430 1170 1050 M-90 1210 Q530 510 1190 1140"
        stroke={C.teal}
        strokeWidth="2"
        opacity=".12"
        fill="none"
      />
    </svg>
  </AbsoluteFill>
);

export const Camera2D: React.FC<{
  time: number;
  children: React.ReactNode;
}> = ({ time, children }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "50% 55%",
        scale: interpolate(
          time * fps,
          [
            0,
            0.55 * fps,
            1.5 * fps,
            2.15 * fps,
            2.6 * fps,
            4.8 * fps,
            5.5 * fps,
            7.7 * fps,
            8.4 * fps,
            10 * fps,
          ],
          [1.14, 1, 1, 1.055, 1, 1, 1.025, 1, 1.01, 1],
          ease,
        ),
        translate: `${mix(0, -16, p(time, 5, 7.6)) + mix(0, 16, p(time, 7.6, 8.3))}px ${Math.sin(time * 0.65) * 2}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Brand: React.FC<{ time: number }> = ({ time }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 86,
        top: 103,
        display: "flex",
        alignItems: "center",
        gap: 15,
        color: time < 2 ? C.cream : C.ink,
        fontSize: 25,
        fontWeight: 800,
        letterSpacing: 3,
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
    {time >= 8 && (
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 1630,
          color: C.ink,
          opacity: p(time, 8.35, 8.65),
          translate: `0 ${mix(14, 0, p(time, 8.35, 8.8))}px`,
        }}
      >
        <div style={{ fontSize: 41, fontWeight: 800, letterSpacing: 1 }}>
          CORAZÓN AL LÍMITE
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            marginTop: 9,
            opacity: 0.68,
          }}
        >
          CIENCIA PARA CUIDARTE
        </div>
      </div>
    )}
  </>
);

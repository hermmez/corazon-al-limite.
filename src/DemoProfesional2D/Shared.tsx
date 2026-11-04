import React from "react";
import { Img, interpolate, staticFile, useVideoConfig } from "remotion";
import { C, ramp } from "./motion";

export type PoseName =
  | "01_neutral"
  | "11_sorprendido"
  | "12_preocupado"
  | "20_respirando"
  | "02_explicando";
export const CharacterPose: React.FC<{
  pose: PoseName;
  opacity: number;
  time: number;
  tension?: number;
}> = ({ pose, opacity, time, tension = 0 }) => {
  const breath = Math.sin(time * Math.PI * (tension ? 1.35 : 0.85));
  return (
    <Img
      src={staticFile(`imagenes/personajes/${pose}.png`)}
      style={{
        position: "absolute",
        left: 220,
        top: 645,
        width: 640,
        height: 960,
        objectFit: "contain",
        opacity,
        transformOrigin: "50% 92%",
        scale: 1 + breath * (tension ? 0.009 : 0.004),
        rotate: `${Math.sin(time * 2) * 0.45 + tension * Math.sin(time * 9) * 0.45}deg`,
        translate: `0 ${breath * 2}px`,
      }}
    />
  );
};

export const MaskedText: React.FC<{
  time: number;
  start: number;
  end: number;
  lines: string[];
  accent: string;
  accentLine?: number;
  size?: number;
}> = ({ time, start, end, lines, accent, accentLine = 2, size = 88 }) => {
  const { fps } = useVideoConfig();
  const frame = time * fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 266,
        width: 820,
        opacity: 1 - ramp(time, end - 0.35, end),
        pointerEvents: "none",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            overflow: "hidden",
            height: size * 1.14,
            clipPath: `inset(0 ${interpolate(frame, [(start + i * 0.12) * fps, (start + 0.75 + i * 0.12) * fps], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0 0)`,
          }}
        >
          <div
            style={{
              fontSize: size,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -3.5,
              color: i === accentLine ? accent : undefined,
              translate: `0 ${interpolate(ramp(time, start + i * 0.12, start + 0.65 + i * 0.12), [0, 1], [size, 0])}px`,
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SceneCaption: React.FC<{
  children: React.ReactNode;
  time: number;
  start: number;
  end: number;
  color?: string;
  top?: number;
}> = ({ children, time, start, end, color = C.teal, top = 1515 }) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      top,
      width: 790,
      opacity:
        ramp(time, start, start + 0.7) * (1 - ramp(time, end - 0.4, end)),
      clipPath: `inset(0 ${100 * (1 - ramp(time, start, start + 0.8))}% 0 0)`,
      color,
      fontSize: 34,
      lineHeight: 1.3,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

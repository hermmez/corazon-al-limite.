import React, { useId } from "react";
import { Img, spring, staticFile, useVideoConfig } from "remotion";
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
  const breath = Math.sin(time * 2.6 + 0.4 * Math.sin(time * 0.7));
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
        scale: 1 + breath * (0.004 + tension * 0.002),
        rotate: `${Math.sin(time * 1.1) * 0.35 + tension * Math.sin(time * 6) * 0.12}deg`,
        translate: `0 ${breath * 1.8}px`,
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
  const id = `fluid-text-${useId().replace(/:/g, "")}`;
  const lineHeight = size * 1.14;
  const exit = 1 - ramp(time, end - 0.25, end);
  return (
    <svg
      width="820"
      height={lineHeight * lines.length}
      style={{
        position: "absolute",
        left: 96,
        top: 266,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <defs>
        {lines.map((_, i) => (
          <clipPath id={`${id}-${i}`} key={i}>
            <rect x="0" y="0" width="820" height={lineHeight * exit} />
          </clipPath>
        ))}
      </defs>
      {lines.map((line, i) => {
        const reveal = spring({
          frame: (time - start - i * 0.09) * fps,
          fps,
          durationInFrames: 0.62 * fps,
          config: { damping: 200 },
        });
        return (
          <g
            key={line}
            transform={`translate(0 ${i * lineHeight})`}
            clipPath={`url(#${id}-${i})`}
          >
            <foreignObject
              x="0"
              y={(1 - reveal) * lineHeight}
              width="820"
              height={lineHeight}
            >
              <div
                style={{
                  fontSize: size,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: -3.5,
                  color: i === accentLine ? accent : undefined,
                }}
              >
                {line}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
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

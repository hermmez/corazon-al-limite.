import React from "react";
import { C, clamp, ramp } from "./motion";
export const PulseRings: React.FC<{
  x: number;
  y: number;
  time: number;
  radius?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, time, radius = 250, color = C.teal, opacity = 1 }) => (
  <svg
    width="1080"
    height="1920"
    style={{ position: "absolute", inset: 0, opacity }}
  >
    {[0, 1, 2].map((i) => {
      const p = (((time * 0.4 + i / 3) % 1) + 1) % 1;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={radius + p * 95}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={Math.sin(Math.PI * p) ** 2 * 0.32}
        />
      );
    })}
  </svg>
);
export const NeuralSignals: React.FC<{
  time: number;
  start: number;
  opacity?: number;
}> = ({ time, start, opacity = 1 }) => {
  const active = ramp(time, start, start + 1.2);
  const pts = [
    [330, 1030],
    [410, 890],
    [520, 950],
    [650, 900],
    [750, 1080],
    [570, 1160],
    [410, 1200],
  ];
  return (
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0, opacity: opacity * active }}
    >
      <path
        d="M 330 1030 410 890 520 950 650 900 750 1080 570 1160 410 1200 330 1030 M 520 950 570 1160"
        fill="none"
        stroke={C.gold}
        strokeWidth="4"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - active}
      />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={5 + (Math.sin(time * 5 + i) + 1) * 2}
            fill={C.cream}
          />
          <circle
            cx={x}
            cy={y}
            r={14 + (Math.sin(time * 5 + i) + 1) * 3}
            fill="none"
            stroke={C.gold}
            strokeWidth="2"
            opacity=".6"
          />
        </g>
      ))}
    </svg>
  );
};
export const ParticleRoute: React.FC<{
  time: number;
  path: string;
  points: [number, number][];
  color?: string;
  opacity?: number;
}> = ({ time, path, points, color = C.gold, opacity = 1 }) => (
  <svg
    width="1080"
    height="1920"
    style={{ position: "absolute", inset: 0, opacity }}
  >
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeDasharray="8 12"
      strokeDashoffset={-time * 24}
      opacity=".6"
    />
    {points.slice(0, -1).map(([x, y], i) => {
      const q = (((time * 0.55 + i * 0.2) % 1) + 1) % 1;
      const b = points[i + 1];
      return (
        <circle
          key={i}
          cx={x + (b[0] - x) * q}
          cy={y + (b[1] - y) * q}
          r="8"
          fill={color}
          opacity={Math.sin(Math.PI * q) ** 2}
        />
      );
    })}
  </svg>
);
export const Clock: React.FC<{ time: number; start: number }> = ({
  time,
  start,
}) => {
  const progress = ramp(time, start, start + 8);
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(780 810)">
        <circle r="105" fill={C.cream} stroke={C.ink} strokeWidth="7" />
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d="M 0 -83 V -71"
            stroke={C.ink}
            strokeWidth="5"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <path
          d="M 0 0 V -60"
          stroke={C.ink}
          strokeWidth="7"
          strokeLinecap="round"
          transform={`rotate(${progress * 270})`}
        />
        <path
          d="M 0 0 V -38"
          stroke={C.coral}
          strokeWidth="9"
          strokeLinecap="round"
          transform={`rotate(${230 + progress * 22.5})`}
        />
        <circle r="9" fill={C.ink} />
      </g>
    </svg>
  );
};

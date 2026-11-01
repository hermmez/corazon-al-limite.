import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { ASSETS } from "./config";
export { C } from "../../Piloto10s/motion";
import { C } from "../../Piloto10s/motion";

export const ease = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;
export const p = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], ease);
export const mix = (a: number, b: number, v: number) => a + (b - a) * v;
export const pop = (t: number, start: number, duration = 0.7) =>
  spring({
    frame: (t - start) * 30,
    fps: 30,
    config: { damping: 22, stiffness: 110, mass: 0.9 },
    durationInFrames: Math.round(duration * 30),
  });

export const Art: React.FC<{
  asset: keyof typeof ASSETS;
  x: number;
  y: number;
  width: number;
  height?: number;
  rotate?: number;
  opacity?: number;
}> = ({ asset, x, y, width, height = width, rotate = 0, opacity = 1 }) => (
  <Img
    src={staticFile(ASSETS[asset])}
    style={{
      position: "absolute",
      left: x - width / 2,
      top: y - height / 2,
      width,
      height,
      objectFit: "contain",
      rotate: `${rotate}deg`,
      opacity,
    }}
  />
);

// The source PNG is never edited: the raised forearm is an alpha-preserving
// render layer with a small shoulder gesture. The original mouth stays fixed.
export const Actor: React.FC<{
  pose:
    | "surprised"
    | "neutral"
    | "explaining"
    | "confused"
    | "headache"
    | "seated";
  time: number;
  x: number;
  y: number;
  width: number;
  opacity?: number;
  tilt?: number;
}> = ({ pose, time, x, y, width, opacity = 1, tilt = 0 }) => {
  const blinkAt = 1.8 + Math.floor(time / 4.3) * 4.3;
  const blink = Math.max(0, 1 - Math.abs(time - blinkAt) / 0.075);
  const eyes =
    pose === "explaining"
      ? [
          [455, 191],
          [535, 183],
        ]
      : pose === "neutral"
        ? [
            [449, 190],
            [538, 187],
          ]
        : [];
  const gesture = pose === "explaining";
  const src = staticFile(ASSETS[pose]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - width * 0.75,
        width,
        height: width * 1.5,
        opacity,
        transformOrigin: "50% 75%",
        transform: `translateY(${Math.sin(time * 1.9) * 3}px) rotate(${tilt + Math.sin(time * 1.4) * 0.45}deg) scale(1,${1 + Math.sin(time * 2) * 0.004})`,
      }}
    >
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          clipPath: gesture
            ? "polygon(0 0,100% 0,100% 100%,0 100%,0 43.3%,37.1% 43.3%,37.1% 28%,0 28%)"
            : undefined,
        }}
      />
      {gesture && (
        <Img
          src={src}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            clipPath: "polygon(0 28%,37.1% 28%,37.1% 43.3%,0 43.3%)",
            transformOrigin: "37% 35%",
            rotate: `${Math.sin(time * 1.45) * 1.15}deg`,
          }}
        />
      )}
      {eyes.length > 0 && (
        <svg
          viewBox="0 0 1024 1536"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: blink,
          }}
        >
          {eyes.map(([cx, cy]) => (
            <g key={cx}>
              <ellipse cx={cx} cy={cy} rx="26" ry="26" fill="#FFB273" />
              <path
                d={`M${cx - 24} ${cy}q24 12 48 0`}
                stroke="#5C3021"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  width: number;
  dark?: boolean;
  accent?: string;
  opacity?: number;
}> = ({
  children,
  x,
  y,
  width,
  dark = false,
  accent = C.teal,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      boxSizing: "border-box",
      padding: "18px 24px",
      borderRadius: 22,
      background: dark ? "#16364C" : "#FFF9ED",
      border: `2px solid ${accent}55`,
      color: dark ? C.cream : C.ink,
      fontSize: 28,
      fontWeight: 800,
      lineHeight: 1.3,
      opacity,
      boxShadow: "0 12px 30px #07132110",
    }}
  >
    {children}
  </div>
);

export const Background: React.FC<{ time: number }> = ({ time }) => {
  const light =
    p(time, 4.5, 5.3) * (1 - p(time, 21.5, 22.4)) +
    p(time, 43.5, 44.5) * (1 - p(time, 63.5, 64.5));
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <AbsoluteFill style={{ background: C.cream, opacity: light }} />
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="ep-glow">
            <stop stopColor={C.teal} stopOpacity=".22" />
            <stop offset="1" stopColor={C.teal} stopOpacity="0" />
          </radialGradient>
          <pattern
            id="ep-grid"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M90 0H0V90"
              fill="none"
              stroke={C.teal}
              strokeWidth="1"
              opacity=".09"
            />
          </pattern>
        </defs>
        <g
          transform={`translate(${Math.sin(time * 0.19) * 20} ${Math.cos(time * 0.14) * 20})`}
        >
          <rect
            x="-50"
            y="-50"
            width="1180"
            height="2020"
            fill="url(#ep-grid)"
          />
          <circle cx="700" cy="980" r="800" fill="url(#ep-glow)" />
          <circle cx="-100" cy="1280" r="400" fill={C.coral} opacity=".065" />
        </g>
        {[...Array(28)].map((_, i) => (
          <circle
            key={i}
            cx={60 + ((i * 173) % 950) + Math.sin(time * 0.4 + i) * 14}
            cy={180 + ((i * 227) % 1450) + Math.cos(time * 0.3 + i) * 18}
            r={i % 4 === 0 ? 4 : 2}
            fill={C.teal}
            opacity={0.14 + 0.08 * Math.sin(time + i)}
          />
        ))}
        <path
          d={`M-80 ${1050 + Math.sin(time * 0.3) * 30} Q540 550 1200 1100 M-80 1190Q540 690 1200 1240`}
          stroke={C.teal}
          strokeWidth="2"
          opacity=".12"
          fill="none"
        />
      </svg>
    </AbsoluteFill>
  );
};

export const Signals: React.FC<{
  time: number;
  paths?: string[];
  color?: string;
  opacity?: number;
  start?: number;
}> = ({
  time,
  paths = ["M180 1080 C300 1080 250 800 510 840 S740 1120 900 900"],
  color = C.gold,
  opacity = 1,
  start = 0,
}) => (
  <svg
    width="1080"
    height="1920"
    style={{ position: "absolute", inset: 0, opacity }}
  >
    {paths.map((d, i) => (
      <g key={i}>
        <path
          d={d}
          stroke={color}
          strokeOpacity=".18"
          strokeWidth="5"
          fill="none"
        />
        <path
          d={d}
          pathLength="1"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray=".065 .935"
          strokeDashoffset={-(time - start) * 0.42 - i * 0.27}
        />
        <path
          d={d}
          pathLength="1"
          stroke={color}
          strokeWidth="18"
          strokeOpacity=".12"
          fill="none"
          strokeDasharray=".09 .91"
          strokeDashoffset={-(time - start) * 0.42 - i * 0.27}
        />
      </g>
    ))}
  </svg>
);

export const Orbit: React.FC<{
  time: number;
  x: number;
  y: number;
  r: number;
  opacity?: number;
  color?: string;
}> = ({ time, x, y, r, opacity = 1, color = C.teal }) => (
  <svg
    width="1080"
    height="1920"
    style={{ position: "absolute", inset: 0, opacity }}
  >
    <g transform={`translate(${x} ${y}) rotate(${time * 5})`}>
      <ellipse
        rx={r}
        ry={r * 0.72}
        stroke={color}
        strokeWidth="2"
        opacity=".3"
        fill="none"
      />
      <ellipse
        rx={r * 0.94}
        ry={r * 0.94}
        stroke={color}
        strokeWidth="2"
        opacity=".18"
        fill="none"
        strokeDasharray="6 18"
      />
      {[0, 120, 240].map((a, i) => (
        <circle
          key={a}
          cx={Math.cos(((time * 0.45 + a) * Math.PI) / 180) * r}
          cy={Math.sin(((time * 0.45 + a) * Math.PI) / 180) * r * 0.72}
          r={6 + i}
          fill={i === 1 ? C.coral : C.gold}
        />
      ))}
    </g>
  </svg>
);

export const Layer: React.FC<{
  time: number;
  start: number;
  end: number;
  children: React.ReactNode;
  mode?: "slide" | "iris" | "follow";
  origin?: string;
}> = ({ time, start, end, children, mode = "slide", origin = "55% 52%" }) => {
  if (time < start - 0.5 || time > end + 0.5) return null;
  const enter = p(time, start - 0.45, start + 0.4),
    exit = p(time, end - 0.35, end + 0.45);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, enter * 2) * (1 - exit),
        transformOrigin: origin,
        transform:
          mode === "follow"
            ? `translate(${(1 - enter) * 150 - exit * 200}px,${(1 - enter) * 100 - exit * 80}px) scale(${1 + (1 - enter) * 0.08})`
            : mode === "slide"
              ? `translateX(${(1 - enter) * 200 - exit * 230}px)`
              : `scale(${1 + (1 - enter) * 0.14 + exit * 0.15})`,
        clipPath:
          mode === "iris"
            ? `circle(${mix(0, 150, enter)}% at ${origin})`
            : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

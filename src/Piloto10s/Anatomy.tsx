import React from "react";
import { Img, staticFile } from "remotion";
import { C, beat, heartPose, p } from "./motion";

export const Heart: React.FC<{ time: number; position?: ReturnType<typeof heartPose> }> = ({ time, position }) => {
  const h = position ?? heartPose(time);
  return (
    <div
      style={{
        position: "absolute",
        left: h.x - h.width / 2,
        top: h.y - h.width / 2,
        width: h.width,
        height: h.width,
        opacity: h.opacity,
        scale: 1 + beat(time) * 0.024,
        rotate: `${Math.sin(time * 1.4) * 0.65}deg`,
        filter: "drop-shadow(0 18px 22px #102c4318)",
      }}
    >
      <Img
        src={staticFile("imagenes/anatomia/03_corazon_humano.png")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};
export const Circulation: React.FC<{ time: number }> = ({ time }) => (
  <svg
    width="1080"
    height="1920"
    style={{
      position: "absolute",
      inset: 0,
      opacity: p(time, 1.95, 2.4) * (1 - p(time, 4.85, 5.35)),
    }}
    aria-hidden
  >
    <defs>
      <linearGradient id="circulation-color">
        <stop stopColor={C.teal} />
        <stop offset="1" stopColor={C.coral} />
      </linearGradient>
    </defs>
    <ellipse
      cx="540"
      cy="1045"
      rx="390"
      ry="303"
      fill="none"
      stroke={C.teal}
      strokeWidth="2"
      opacity=".15"
    />
    {[0, 1, 2].map((i) => (
      <ellipse
        key={i}
        cx="540"
        cy="1045"
        rx={340 + i * 30 + beat(time) * 8}
        ry={262 + i * 21 + beat(time) * 6}
        fill="none"
        stroke="url(#circulation-color)"
        strokeWidth={i === 1 ? 5 : 2}
        pathLength="1"
        strokeDasharray={i === 1 ? ".14 .86" : ".035 .965"}
        strokeDashoffset={-((time * 0.21 + i * 0.31) % 1)}
        opacity={i === 1 ? 0.9 : 0.35}
      />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = time * 1.45 + (i * Math.PI) / 3;
      return (
        <circle
          key={i}
          cx={540 + 390 * Math.cos(a)}
          cy={1045 + 303 * Math.sin(a)}
          r={i % 2 ? 5 : 8}
          fill={i % 2 ? C.coral : C.teal}
        />
      );
    })}
    <path
      d="M834 1170V977m-20 22 20-24 20 24"
      stroke={C.coral}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={p(time, 2.7, 3.6)}
    />
  </svg>
);
export const SleepClock: React.FC<{ time: number }> = ({ time }) => (
  <svg
    width="190"
    height="190"
    viewBox="0 0 190 190"
    style={{
      position: "absolute",
      left: 128,
      top: 654,
      opacity: p(time, 5.3, 5.6),
      rotate: `${Math.sin(time * 1.6) * 2}deg`,
    }}
    aria-hidden
  >
    <circle cx="95" cy="95" r="77" fill={C.cream} />
    <circle
      cx="95"
      cy="95"
      r="67"
      fill="none"
      stroke={C.teal}
      strokeWidth="4"
      opacity=".7"
    />
    {Array.from({ length: 12 }, (_, i) => (
      <path
        key={i}
        d="M95 34V41"
        stroke={C.ink}
        strokeWidth="3"
        transform={`rotate(${i * 30} 95 95)`}
      />
    ))}
    <g transform={`rotate(${time * 12} 95 95)`}>
      <path
        d="M95 95V54"
        stroke={C.ink}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </g>
    <path
      d="M95 95L122 112"
      stroke={C.coral}
      strokeWidth="8"
      strokeLinecap="round"
    />
    <circle cx="95" cy="95" r="6" fill={C.ink} />
  </svg>
);

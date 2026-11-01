import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolateColors,
  spring,
  staticFile,
  useVideoConfig,
} from "remotion";
import { ASSETS, type AssetKey } from "./assets";
import {
  C,
  backgroundAt,
  clamp,
  curve,
  inkAt,
  ramp,
  SPACING,
  transitionAt,
} from "./motion";
import type { SceneSpec } from "./types";

export const Illustration: React.FC<{
  asset: AssetKey;
  x: number;
  y: number;
  width: number;
  time: number;
  opacity?: number;
  rotate?: number;
  pulse?: number;
  float?: number;
}> = ({
  asset,
  x,
  y,
  width,
  time,
  opacity = 1,
  rotate = 0,
  pulse = 0,
  float = 3,
}) => {
  const aspect = ASSETS[asset].aspect,
    height = width / aspect;
  return (
    <Img
      src={staticFile(ASSETS[asset].path)}
      style={{
        position: "absolute",
        width,
        height,
        left: x - width / 2,
        top: y - height / 2,
        objectFit: "contain",
        opacity,
        scale: 1 + pulse,
        rotate: `${rotate + Math.sin(time * 0.8) * 0.45}deg`,
        translate: `${Math.sin(time * 0.7) * float * 0.5}px ${Math.sin(time * 1.5) * float}px`,
        transformOrigin: "50% 65%",
      }}
    />
  );
};
export const AnimatedCharacter: React.FC<{
  asset: AssetKey;
  alternate?: AssetKey;
  blend?: number;
  time: number;
  x?: number;
  y?: number;
  width?: number;
  opacity?: number;
  intensity?: number;
}> = ({
  asset,
  alternate,
  blend = 0,
  time,
  x = 540,
  y = 1060,
  width = 560,
  opacity = 1,
  intensity = 1,
}) => {
  const breathe = Math.sin(time * 2.5 + 0.3 * Math.sin(time * 0.6));
  const selected = alternate && blend >= 0.5 ? alternate : asset;
  return (
    <div
      style={{
        opacity,
        rotate: `${Math.sin(time * 1.1) * 0.35 * intensity}deg`,
        transformOrigin: `${x}px ${y + width * 0.7}px`,
        translate: `0 ${breathe * 1.8 * intensity}px`,
      }}
    >
      <Illustration
        asset={selected}
        x={x}
        y={y}
        width={width}
        time={time}
        pulse={breathe * 0.004 * intensity + Math.sin(Math.PI * blend) * 0.003}
        float={0}
      />
    </div>
  );
};
export const Room: React.FC<{
  asset: AssetKey;
  time: number;
  opacity?: number;
}> = ({ asset, time, opacity = 0.78 }) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      top: 600,
      width: 900,
      height: 900,
      borderRadius: 48,
      overflow: "hidden",
      opacity,
      boxShadow: "0 22px 70px #112C4716",
      translate: `${Math.sin(time * 0.13) * 4}px ${Math.sin(time * 0.17) * 3}px`,
    }}
  >
    <Img
      src={staticFile(ASSETS[asset].path)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        scale: 1.025 + Math.sin(time * 0.2) * 0.008,
      }}
    />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, #fff4e000, #112c4715)" }}
    />
  </div>
);
export const Camera2D: React.FC<{
  children: React.ReactNode;
  camera: { x: number; y: number; zoom: number };
  index: number;
}> = ({ children, camera, index }) => (
  <AbsoluteFill
    style={{
      maskImage:
        "linear-gradient(to bottom,transparent 560px,black 610px,black 1465px,transparent 1510px)",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 1080,
        height: 1920,
        transformOrigin: "0 0",
        transform: `translate(540px,1080px) scale(${camera.zoom}) translate(${index * SPACING - camera.x}px,${-camera.y}px)`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);
export const Backdrop: React.FC<{
  time: number;
  dark: number;
  camera: { x: number; y: number; zoom: number };
}> = ({ time, dark, camera }) => (
  <AbsoluteFill style={{ background: backgroundAt(dark) }}>
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <circle
        cx={850 - Math.sin(camera.x / 800) * 80}
        cy={1040 - (camera.y - 1080) * 0.15}
        r="590"
        fill={interpolateColors(dark, [0, 1], ["#E1EFE1", "#163F56"])}
      />
      <circle
        cx={-90 + Math.sin(camera.x / 1200) * 45}
        cy="1510"
        r="420"
        fill={interpolateColors(dark, [0, 1], ["#FFDEB9", "#1B3152"])}
      />
      <path
        d={`M -50 800 Q ${500 - Math.sin(camera.x / 900) * 80} 580 1200 850 M -50 1310 Q 600 1840 1200 1200`}
        fill="none"
        stroke={C.teal}
        strokeWidth="2"
        opacity=".15"
      />
      {Array.from({ length: 32 }, (_, i) => (
        <circle
          key={i}
          cx={((((i * 193 - camera.x * 0.12) % 1180) + 1180) % 1180) - 50}
          cy={((i * 277) % 1920) + Math.sin(time * 0.55 + i) * 8}
          r={2 + (i % 3)}
          fill={i % 3 ? C.teal : C.coral}
          opacity=".2"
        />
      ))}
    </svg>
  </AbsoluteFill>
);
export const FlowBridge: React.FC<{
  time: number;
  scenes: SceneSpec[];
  camera: { x: number; y: number; zoom: number };
}> = ({ time, scenes, camera }) => {
  const tr = transitionAt(time, scenes);
  if (!tr) return null;
  const p = tr.progress,
    a = curve(tr.index, 0),
    b = curve(tr.index, 1);
  const path = `M ${a.x} ${a.y} C ${a.x + SPACING * 0.34} ${a.y - 90} ${b.x - SPACING * 0.34} ${b.y + 70 * (tr.index % 2 ? 1 : -1)} ${b.x} ${b.y}`;
  return (
    <AbsoluteFill
      style={{
        maskImage:
          "linear-gradient(to bottom,transparent 570px,black 640px,black 1430px,transparent 1505px)",
        pointerEvents: "none",
      }}
    >
      <svg width="1080" height="1920">
        <g
          transform={`translate(540 1080) scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`}
          opacity={Math.sin(Math.PI * p) ** 2}
        >
          <path
            d={path}
            stroke={C.teal}
            strokeWidth="4"
            fill="none"
            opacity=".5"
          />
          <path
            d={path}
            stroke={C.gold}
            strokeWidth="5"
            fill="none"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - p}
          />
          {[0, 1, 2, 3, 4].map((i) => {
            const q = curve(tr.index, clamp(p - i * 0.018));
            return (
              <circle
                key={i}
                cx={q.x}
                cy={q.y}
                r={i ? 8 - i : 17}
                fill={C.gold}
                opacity={1 - i * 0.15}
              />
            );
          })}
          <circle
            cx={curve(tr.index, p).x}
            cy={curve(tr.index, p).y}
            r="30"
            stroke={C.gold}
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
export const HeroTitle: React.FC<{
  scene: SceneSpec;
  local: number;
  dark: number;
}> = ({ scene, local, dark }) => {
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: local * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: 0.65 * fps,
  });
  const exit =
    1 - ramp(local, scene.end - scene.start - 0.24, scene.end - scene.start);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 220,
        width: 820,
        color: inkAt(dark),
        clipPath: `inset(0 0 ${(1 - exit) * 100}% 0)`,
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 3,
          color: dark > 0.5 ? C.teal : "#3D7276",
          marginBottom: 35,
        }}
      >
        {scene.label}
      </div>
      {scene.headline.map((line, i) => (
        <div key={line} style={{ overflow: "hidden", height: 103 }}>
          <div
            style={{
              fontSize: scene.kind === "mood" ? 84 : 90,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -3.5,
              color:
                i === scene.headline.length - 1 ? C[scene.accent] : undefined,
              translate: `0 ${(1 - enter) * 105}px`,
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};
export const Tag: React.FC<{
  text: string;
  x: number;
  y: number;
  time: number;
  start: number;
  color?: string;
}> = ({ text, x, y, time, start, color = C.teal }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      color: C.ink,
      background: color,
      padding: "15px 24px",
      borderRadius: 20,
      fontSize: 37,
      fontWeight: 800,
      opacity: ramp(time, start, start + 0.45),
      translate: `0 ${(1 - ramp(time, start, start + 0.7)) * 20}px`,
    }}
  >
    {text}
  </div>
);
